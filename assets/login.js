(()=>{
 const auth=window.ManabiAuth,form=document.getElementById('login-form'),panel=document.getElementById('mfa-panel'),mfaForm=document.getElementById('mfa-form'),status=document.getElementById('login-status');
 let factorId;
 const say=message=>{status.textContent=message;};
 async function proceed(){
  const me=await auth.api('me');
  if(!me.mfa_required){location.replace('./app.html');return;}
  form.hidden=true;panel.hidden=false;document.getElementById('forgot').hidden=true;
  const {data,error}=await auth.client.auth.mfa.listFactors();if(error)throw Error('本人確認の設定を読み込めませんでした。');
  const verified=data.totp.find(f=>f.status==='verified');
  document.getElementById('mfa-qr').replaceChildren();
  if(verified){factorId=verified.id;document.getElementById('mfa-instruction').textContent='認証アプリの番号を入力してください。通常の講師アカウントにはこの確認はありません。';}
  else{
   // Remove only unfinished enrollments so interrupted setup can be retried.
   for(const f of data.all.filter(f=>f.factor_type==='totp'&&f.status==='unverified'))await auth.client.auth.mfa.unenroll({factorId:f.id});
   const enrollment=await auth.client.auth.mfa.enroll({factorType:'totp',friendlyName:'学びのスキルカルテ',issuer:'学びのスキルカルテ'});
   if(enrollment.error)throw Error('認証アプリを登録できませんでした。');factorId=enrollment.data.id;
   const image=document.createElement('img');image.alt='認証アプリの登録用QRコード';image.src=enrollment.data.totp.qr_code.startsWith('data:')?enrollment.data.totp.qr_code:'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(enrollment.data.totp.qr_code);document.getElementById('mfa-qr').append(image);
   document.getElementById('mfa-instruction').textContent='初回のみ、このQRコードをスマホの認証アプリで読み取ってください。QRコードや番号は他人に送らないでください。';
  }
 }
 form.addEventListener('submit',async event=>{event.preventDefault();const send=form.querySelector('button');send.disabled=true;say('ログインしています…');try{const data=new FormData(form),result=await auth.client.auth.signInWithPassword({email:String(data.get('email')).trim(),password:String(data.get('password'))});form.elements.password.value='';if(result.error)throw Error('メールアドレスまたはパスワードを確認してください。');say('');await proceed();}catch(error){say(error.message);}finally{send.disabled=false;}});
 mfaForm.addEventListener('submit',async event=>{event.preventDefault();const send=mfaForm.querySelector('button');send.disabled=true;try{const {error}=await auth.client.auth.mfa.challengeAndVerify({factorId,code:mfaForm.elements.code.value});mfaForm.elements.code.value='';if(error)throw Error('番号を確認し、新しい番号で試してください。');document.getElementById('mfa-qr').replaceChildren();say('');await proceed();}catch(error){say(error.message);}finally{send.disabled=false;}});
 document.getElementById('cancel-mfa').onclick=async()=>{await auth.client.auth.signOut({scope:'local'});location.reload();};
 document.getElementById('forgot').onclick=()=>say('パスワードの再設定は代表へ依頼してください。');
 auth.session().then(proceed).catch(error=>{if(error.status!==401)say(error.message);});
})();
