// This classic script intentionally shares the existing app's lexical db binding.
(()=>{
 const shared=window.ManabiShared,auth=window.ManabiAuth;
 shared.readApp=()=>db;
 shared.applyApp=(value,redraw)=>{db=value;if(redraw)render();};
 shared.canRefresh=()=>!document.hidden&&!document.querySelector('dialog[open]')&&!document.activeElement?.matches('input,textarea,select,[contenteditable="true"]')&&Date.now()-shared.lastInput>1200;
 const oldToast=toast;toast=message=>oldToast(shared.sync.pending.size&&/保存|更新|反映|登録/.test(message)?message+'（共有DBへ送信中）':message);
 document.addEventListener('input',()=>{shared.lastInput=Date.now();},true);
 shared.sync.capture(db);
 setInterval(()=>shared.sync.poll().catch(()=>shared.sync.status('共有データの更新確認を待っています。')),4000);
 window.addEventListener('online',()=>{shared.sync.flush().then(()=>shared.sync.poll()).catch(()=>{});});
 window.addEventListener('beforeunload',e=>{if(shared.sync.pending.size||shared.sync.inflight){e.preventDefault();e.returnValue='';}});
 const issueBarcode=async teacherId=>{
  if(!['system_admin','classroom_manager'].includes(DebugContext.user.role)){toast('教室長または代表へ依頼してください。');return;}
  if(!confirm('この講師のバーコードを再発行します。以前のカードは使えなくなります。よろしいですか？'))return;
  try{const issued=await auth.api('staff/issue','POST',{teacher_id:teacherId});if(teacherId===DebugContext.user.teacher_id){const login=await auth.api('staff/login','POST',{barcode:issued.barcode});auth.setStaffToken(login.token);}const t=db.teachers.find(x=>x.id===teacherId);const d=document.createElement('dialog');d.className='debug-dialog';const h=document.createElement('h2');h.textContent=(t?.name||'講師')+'のログインカード';const barcode=document.createElement('div');barcode.innerHTML=barcodeSVG(issued.barcode,true);const code=document.createElement('code');code.textContent=issued.barcode;const note=document.createElement('p');note.textContent='本人へ渡してください。この画面を閉じた後は、再発行すると新しい番号になります。';const print=document.createElement('button');print.textContent='カードを印刷';print.onclick=()=>{const root=document.getElementById('print-root');root.replaceChildren(h.cloneNode(true),barcode.cloneNode(true),code.cloneNode(true));window.print();};const close=document.createElement('button');close.textContent='閉じる';close.onclick=()=>d.close();d.append(h,barcode,code,note,print,close);d.onclose=()=>d.remove();document.body.append(d);d.showModal();}catch(e){toast(e.message);}
 };

 const refreshAccounts=async()=>{const rows=await auth.api('staff/accounts');for(const a of db.loginAccounts)a.loginId=rows.find(r=>r.teacher_id===a.teacherId)?.login_id||'';return rows;};
 if(DebugContext.user.login_id){const own=db.loginAccounts.find(a=>a.teacherId===DebugContext.user.teacher_id);if(own)own.loginId=DebugContext.user.login_id;}
 if(['system_admin','classroom_manager'].includes(DebugContext.user.role))refreshAccounts().then(()=>{if(state.page==='master')render();}).catch(()=>{});
 v13Credentials=async teacherId=>{
  if(!['system_admin','classroom_manager'].includes(DebugContext.user.role)){toast('教室長または代表へ依頼してください。');return;}
  try{
   const rows=await refreshAccounts(),account=rows.find(r=>r.teacher_id===teacherId),teacher=db.teachers.find(t=>t.id===teacherId);
   const d=document.createElement('dialog');d.className='debug-dialog';const h=document.createElement('h2');h.textContent=(teacher?.name||'講師')+'のログイン設定';d.append(h);
   const form=document.createElement('form');const field=(label,name,type,value='')=>{const l=document.createElement('label');l.className='field';l.textContent=label;const input=document.createElement('input');input.name=name;input.type=type;input.value=value;l.append(input);form.append(l);return input;};
   const login=field('講師ID（英数字・ハイフン・_、3〜40文字）','login_id','text',account?.login_id||'');login.required=true;login.pattern='[A-Za-z0-9_-]{3,40}';login.maxLength=40;login.autocomplete='off';
   const password=field(account?.password_set?'新しいパスワード（変更しない場合は空欄）':'パスワード（8文字以上）','password','password');password.minLength=8;password.maxLength=128;password.required=!account?.password_set;password.autocomplete='new-password';
   const again=field('パスワードをもう一度','again','password');again.autocomplete='new-password';again.maxLength=128;
   const status=document.createElement('p');status.setAttribute('role','status');form.append(status);const save=document.createElement('button');save.type='submit';save.className='btn primary';save.textContent='ID・パスワードを保存';form.append(save);
   form.onsubmit=async event=>{event.preventDefault();if(password.value!==again.value){status.textContent='パスワードが一致しません。';return;}save.disabled=true;try{const next=password.value;await auth.api('staff/credentials','POST',{teacher_id:teacherId,login_id:login.value,password:next});password.value='';again.value='';if(teacherId===DebugContext.user.teacher_id&&next){const signed=await auth.api('staff/login','POST',{method:'password',login_id:login.value,password:next});auth.setStaffToken(signed.token);}await refreshAccounts();d.close();render();toast('講師ID・パスワードを保存しました。');}catch(e){password.value='';again.value='';status.textContent=e.message;}finally{save.disabled=false;}};
   const card=document.createElement('button');card.type='button';card.className='btn';card.textContent='バーコードを再発行・印刷';card.onclick=()=>issueBarcode(teacherId);
   const note=document.createElement('p');note.className='small';note.textContent='ID・パスワードとバーコードのどちらでも同じ講師として入れます。現在のパスワードは表示できません。';
   const close=document.createElement('button');close.type='button';close.className='btn';close.textContent='閉じる';close.onclick=()=>d.close();d.append(form,card,note,close);d.onclose=()=>{password.value='';again.value='';d.remove();};document.body.append(d);d.showModal();
  }catch(e){toast(e.message);}
 };
 v13PrintTeacherBarcode=issueBarcode;
 v13SaveCredentials=()=>toast('ログイン設定からID・パスワードを保存してください。');
})();
