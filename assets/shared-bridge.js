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
 v13Credentials=async teacherId=>{
  if(!['system_admin','classroom_manager'].includes(DebugContext.user.role)){toast('教室長または代表へ依頼してください。');return;}
  if(!confirm('この講師のバーコードを再発行します。以前のカードは使えなくなります。よろしいですか？'))return;
  try{const issued=await auth.api('staff/issue','POST',{teacher_id:teacherId});if(teacherId===DebugContext.user.teacher_id){const login=await auth.api('staff/login','POST',{barcode:issued.barcode});auth.setStaffToken(login.token);}const t=db.teachers.find(x=>x.id===teacherId);const d=document.createElement('dialog');d.className='debug-dialog';const h=document.createElement('h2');h.textContent=(t?.name||'講師')+'のログインカード';const barcode=document.createElement('div');barcode.innerHTML=barcodeSVG(issued.barcode,true);const code=document.createElement('code');code.textContent=issued.barcode;const note=document.createElement('p');note.textContent='本人へ渡してください。この画面を閉じた後は、再発行すると新しい番号になります。';const print=document.createElement('button');print.textContent='カードを印刷';print.onclick=()=>{const root=document.getElementById('print-root');root.replaceChildren(h.cloneNode(true),barcode.cloneNode(true),code.cloneNode(true));window.print();};const close=document.createElement('button');close.textContent='閉じる';close.onclick=()=>d.close();d.append(h,barcode,code,note,print,close);d.onclose=()=>d.remove();document.body.append(d);d.showModal();}catch(e){toast(e.message);}
 };
 v13PrintTeacherBarcode=v13Credentials;
 v13SaveCredentials=()=>toast('講師のログインはバーコードを再発行して設定してください。');
})();
