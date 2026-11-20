(()=>{
 const auth=window.ManabiAuth,form=document.getElementById('login-form'),status=document.getElementById('login-status'),staffForm=document.getElementById('staff-form'),passwordForm=document.getElementById('staff-password-form');
 let method='password';
 function selectMethod(next){method=next;staffForm.hidden=method!=='barcode';passwordForm.hidden=method!=='password';staffForm.elements.barcode.value='';passwordForm.elements.password.value='';for(const m of ['password','barcode'])document.getElementById('method-'+m).setAttribute('aria-pressed',String(m===method));say('');(method==='barcode'?staffForm.elements.barcode:passwordForm.elements.login_id).focus();}
 for(const m of ['password','barcode'])document.getElementById('method-'+m).onclick=()=>selectMethod(m);
 const say=message=>{status.textContent=message;};
 async function proceed(){
  const me=await auth.api('me');
  if(me.staff_required){auth.clearStaff();form.hidden=true;document.getElementById('staff-panel').hidden=false;document.getElementById('forgot').hidden=true;selectMethod(method);return;}
  location.replace('./app.html');
 }
 form.addEventListener('submit',async event=>{event.preventDefault();const send=form.querySelector('button');send.disabled=true;say('ログインしています…');try{const data=new FormData(form),result=await auth.client.auth.signInWithPassword({email:String(data.get('email')).trim(),password:String(data.get('password'))});form.elements.password.value='';if(result.error)throw Error('メールアドレスまたはパスワードを確認してください。');say('');await proceed();}catch(error){say(error.message);}finally{send.disabled=false;}});
 staffForm.onsubmit=async event=>{event.preventDefault();const send=staffForm.querySelector('button');send.disabled=true;try{const result=await auth.api('staff/login','POST',{barcode:staffForm.elements.barcode.value});staffForm.elements.barcode.value='';auth.setStaffToken(result.token);await proceed();}catch(error){staffForm.elements.barcode.value='';say(error.message);}finally{send.disabled=false;}};
 passwordForm.onsubmit=async event=>{event.preventDefault();const send=passwordForm.querySelector('button');send.disabled=true;say('ログインしています…');try{const result=await auth.api('staff/login','POST',{method:'password',login_id:passwordForm.elements.login_id.value,password:passwordForm.elements.password.value});passwordForm.elements.password.value='';auth.setStaffToken(result.token);say('');await proceed();}catch(error){passwordForm.elements.password.value='';say(error.message);}finally{send.disabled=false;}};
 document.getElementById('change-account').onclick=async()=>{await auth.signOut();location.reload();};
 document.getElementById('forgot').onclick=()=>say('パスワードの再設定は代表へ依頼してください。');
 auth.session().then(proceed).catch(error=>{if(error.status!==401)say(error.message);});
})();
