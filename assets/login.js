(()=>{
 const auth=window.ManabiAuth,form=document.getElementById('login-form'),status=document.getElementById('login-status'),staffForm=document.getElementById('staff-form'),passwordForm=document.getElementById('staff-password-form');
 const scan=staffForm.elements.barcode,panel=document.getElementById('staff-panel');
 let method='barcode',staffBusy=false;
 const say=message=>{status.textContent=message;};
 const normalizeBarcode=value=>String(value||'').normalize('NFKC').trim().replace(/^\](?:A[0-7]|C[01])/i,'').replace(/^\*([^*]+)\*$/,'$1').trim().toUpperCase();
 function selectMethod(next){
  if(staffBusy)return;
  method=next;staffForm.hidden=method!=='barcode';passwordForm.hidden=method!=='password';scan.value='';passwordForm.elements.password.value='';
  for(const m of ['password','barcode'])document.getElementById('method-'+m).setAttribute('aria-pressed',String(m===method));
  say('');(method==='barcode'?scan:passwordForm.elements.login_id).focus();
 }
 for(const m of ['password','barcode'])document.getElementById('method-'+m).onclick=()=>selectMethod(m);
 async function proceed(){
  const me=await auth.api('me');
  if(me.staff_required){auth.clearStaff();form.hidden=true;panel.hidden=false;document.getElementById('forgot').hidden=true;selectMethod(method);return;}
  location.replace('./app.html');
 }
 form.addEventListener('submit',async event=>{event.preventDefault();const send=form.querySelector('button');send.disabled=true;say('ログインしています…');try{const data=new FormData(form),result=await auth.client.auth.signInWithPassword({email:String(data.get('email')).trim(),password:String(data.get('password'))});form.elements.password.value='';if(result.error)throw Error('メールアドレスまたはパスワードを確認してください。');say('');await proceed();}catch(error){say(error.message);}finally{send.disabled=false;}});
 async function loginStaff(body){
  if(staffBusy)return;
  staffBusy=true;
  for(const b of panel.querySelectorAll('button'))b.disabled=true;
  say('ログインしています…');
  try{const result=await auth.api('staff/login','POST',body);scan.value='';passwordForm.elements.password.value='';auth.setStaffToken(result.token);await proceed();}
  catch(error){scan.value='';passwordForm.elements.password.value='';say(error.message);if(method==='barcode')scan.focus();}
  finally{staffBusy=false;for(const b of panel.querySelectorAll('button'))b.disabled=false;}
 }
 const isStaffBarcode=value=>/^(?:TL-[A-F0-9]{48}|91[0-9]{30})$/.test(value);
 const rejectBarcode=()=>{scan.value='';say('講師用のバーコードを読み取ってください。生徒・教材のコードは使えません。');scan.focus();};
 staffForm.onsubmit=event=>{event.preventDefault();const barcode=normalizeBarcode(scan.value);if(!isStaffBarcode(barcode)){rejectBarcode();return;}return loginStaff({barcode});};
 // Readers with or without an Enter suffix and pasted card numbers use the same path.
 scan.addEventListener('input',event=>{if(event.isComposing)return;const barcode=normalizeBarcode(scan.value);if(!panel.hidden&&method==='barcode'){if(/^MAT-[0-9]{6,}$/.test(barcode))rejectBarcode();else if(isStaffBarcode(barcode))void loginStaff({barcode});}});
 scan.addEventListener('keydown',event=>{if(!event.isComposing&&event.keyCode!==229&&(event.key==='Enter'||event.key==='Tab'&&scan.value.trim())){event.preventDefault();void staffForm.onsubmit(event);}});
 passwordForm.onsubmit=event=>{event.preventDefault();if(/^MAT-/i.test(passwordForm.elements.login_id.value.normalize('NFKC').trim())){passwordForm.elements.password.value='';say('教材バーコードは講師IDとして使えません。講師IDを入力してください。');return;}return loginStaff({method:'password',login_id:passwordForm.elements.login_id.value,password:passwordForm.elements.password.value});};
 document.getElementById('change-account').onclick=async()=>{await auth.signOut();location.reload();};
 document.getElementById('forgot').onclick=()=>say('パスワードの再設定は代表へ依頼してください。');
 auth.session().then(proceed).catch(error=>{if(error.status!==401)say(error.message);});
})();
