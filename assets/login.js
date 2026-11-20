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
 staffForm.onsubmit=event=>{event.preventDefault();return loginStaff({barcode:normalizeBarcode(scan.value)});};
 // Readers with or without an Enter suffix and pasted card numbers use the same path.
 scan.addEventListener('input',()=>{const barcode=normalizeBarcode(scan.value);if(!panel.hidden&&method==='barcode'&&/^TL-[A-F0-9]{48}$/.test(barcode))void loginStaff({barcode});});
 scan.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();void staffForm.onsubmit(event);}});
 passwordForm.onsubmit=event=>{event.preventDefault();return loginStaff({method:'password',login_id:passwordForm.elements.login_id.value,password:passwordForm.elements.password.value});};
 document.getElementById('change-account').onclick=async()=>{await auth.signOut();location.reload();};
 document.getElementById('forgot').onclick=()=>say('パスワードの再設定は代表へ依頼してください。');
 auth.session().then(proceed).catch(error=>{if(error.status!==401)say(error.message);});
})();
