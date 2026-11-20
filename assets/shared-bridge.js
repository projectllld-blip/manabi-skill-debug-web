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
  try{
   const issued=await auth.api('staff/issue','POST',{teacher_id:teacherId});
   if(teacherId===DebugContext.user.teacher_id){const login=await auth.api('staff/login','POST',{barcode:issued.barcode});auth.setStaffToken(login.token);}
   await window.ManabiStaffCards.show([teacherId]);
  }catch(e){toast(e.message);}
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
   const reprint=document.createElement('button');reprint.type='button';reprint.className='btn';reprint.textContent='バーコードを印刷';reprint.onclick=()=>window.ManabiStaffCards.show([teacherId]);
   const card=document.createElement('button');card.type='button';card.className='btn';card.textContent='紛失したカードを無効化・再発行';card.onclick=()=>issueBarcode(teacherId);
   const note=document.createElement('p');note.className='small';note.textContent='ID・パスワードとバーコードのどちらでも同じ講師として入れます。現在のパスワードは表示できません。';
   const close=document.createElement('button');close.type='button';close.className='btn';close.textContent='閉じる';close.onclick=()=>d.close();d.append(form,reprint,card,note,close);d.onclose=()=>{password.value='';again.value='';d.remove();};document.body.append(d);d.showModal();
  }catch(e){toast(e.message);}
 };
 v13PrintTeacherBarcode=issueBarcode;
 v13SaveCredentials=()=>toast('ログイン設定からID・パスワードを保存してください。');
})();

// Printable credentials are fetched only for managers and live only in this dialog.
(()=>{
 const manager=()=>['system_admin','classroom_manager'].includes(DebugContext.user.role);
 const eligible=()=>db.teachers.filter(t=>t.active!==false&&(DebugContext.user.role==='system_admin'||t.role!=='代表'));
 const previous=masterTeachers;
 masterTeachers=function(){const html=previous();if(!manager())return html;return html.replace('<button class="btn primary" onclick="openTeacherForm()">','<button type="button" class="btn" data-staff-card-print>講師バーコードを一括印刷</button><button class="btn primary" onclick="openTeacherForm()">');};
 const button=(text,fn)=>{const b=document.createElement('button');b.type='button';b.className='btn';b.textContent=text;b.onclick=fn;return b;};
 let busy=false;
 async function showCards(ids){
  if(busy||DebugContext.locked||!manager())return;
  if(!ids.length){toast('印刷できる講師がいません。');return;}
  busy=true;
  const d=document.createElement('dialog');d.className='debug-dialog staff-cards-dialog';
  const h=document.createElement('h2');h.textContent='講師ログインカード';
  const status=document.createElement('p');status.setAttribute('role','status');status.textContent='カードを準備しています…';
  const preview=document.createElement('div');preview.className='staff-cards-preview';
  const close=button('閉じる',()=>d.close());let closed=false;
  const print=button('A4で一括印刷',()=>{
   if(closed||DebugContext.locked||!manager())return;
   const root=document.getElementById('print-root');root.replaceChildren(...[...preview.children].map(node=>node.cloneNode(true)));
   try{window.print();}catch{root.replaceChildren();status.textContent='印刷を開けませんでした。もう一度押してください。';}
  });print.disabled=true;
  const controls=document.createElement('div');controls.className='row';controls.append(print,close);
  d.append(h,status,controls,preview);
  d.addEventListener('close',()=>{closed=true;preview.replaceChildren();document.querySelectorAll('#print-root .staff-card-page').forEach(node=>node.remove());d.remove();});
  document.body.append(d);d.showModal();
  try{
   await ManabiShared.sync.flush();
   if(closed||DebugContext.locked||!manager())return;
   if(ManabiShared.sync.pending.size)throw Error('未送信の変更を保存してから印刷してください。');
   const cards=await ManabiAuth.api('staff/cards','POST',{teacher_ids:ids});
   if(closed||DebugContext.locked||!manager())return;
   if(!Array.isArray(cards)||cards.length!==ids.length||new Set(cards.map(c=>c.teacher_id)).size!==ids.length||cards.some(c=>!ids.includes(c.teacher_id)||!/^91[0-9]{30}$/.test(c.barcode)))throw Error('カードを確認できませんでした。');
   const ordered=ids.map(id=>cards.find(c=>c.teacher_id===id));
   const pages=[];
   for(let i=0;i<ordered.length;i+=21){pages.push('<section class="report-page scan-label-page staff-card-page"><div class="row between mb"><h2>講師ログインカード</h2><span class="small muted">'+(Math.floor(i/21)+1)+' / '+Math.ceil(ordered.length/21)+'</span></div><div class="scan-label-grid">'+ordered.slice(i,i+21).map(c=>'<div class="scan-label staff-scan-label"><div class="scan-small"><span>'+esc(c.role)+'</span><span>講師ログイン</span></div><div class="scan-student">'+esc(c.name)+'</div>'+barcodeSVG(c.barcode,true)+'<div class="scan-code">ID：'+esc(c.login_id||'未設定')+'</div></div>').join('')+'</div></section>');}
   preview.innerHTML=pages.join('');status.textContent=cards.length+'名分／生徒ラベルと同じ大きさです。A4・倍率100%で印刷してください。';print.disabled=false;
  }catch(error){if(!closed)status.textContent=error.message;}
  finally{busy=false;}
 }
 document.addEventListener('click',event=>{if(event.target.closest('[data-staff-card-print]'))void showCards(eligible().map(t=>t.id));});
 // Single-card reprints use the same compact layout and never rotate a credential.
 window.ManabiStaffCards={show:showCards};
 window.addEventListener('afterprint',()=>document.querySelectorAll('#print-root .staff-card-page').forEach(node=>node.remove()));
})();
