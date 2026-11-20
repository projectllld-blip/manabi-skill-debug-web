/* Real identity/permissions are checked on the server on every request.
   The server-verified staff identity controls the shared fictional workspace. */
(()=>{
 const user=DebugContext.user;
 const roles={system_admin:'代表',classroom_manager:'教室長',assistant_manager:'講師',teacher:'講師'};
 const teacher=db.teachers.find(t=>t.id===user.teacher_id)||(window.ManabiShared?null:db.teachers.find(t=>t.role===roles[user.role])||db.teachers[0]);
 if(!teacher)throw Error('ログインした講師の登録情報を読み込めません。再読み込みしてください。');
 db.loginAccounts ||= [];let account=db.loginAccounts.find(a=>a.teacherId===teacher.id);
 if(!account){account={teacherId:teacher.id,loginId:user.login_id||'',active:true};db.loginAccounts.push(account);}
 if(user.login_id)account.loginId=user.login_id;
 if(account)v13LoginSuccess(account,window.ManabiShared?(user.login_method==='password'?'ID・パスワード':'バーコード'):'Web認証済み・架空の操作役');
 v13CloseBoard();
 const originalLogout=v13Logout;
 const el=(tag,text,attrs={})=>{const n=document.createElement(tag);if(text)n.textContent=text;for(const[k,v]of Object.entries(attrs))n.setAttribute(k,v);return n;};
 const manager=['system_admin','classroom_manager'].includes(user.role);
 const labels={open:'未対応',in_progress:'対応中',fixed:'修正済み',closed:'確認完了'};
 let halted=false,checking=false;
 function halt(message){if(halted)return;halted=true;DebugContext.locked=true;const mask=el('div',null,{class:'debug-mask'});mask.append(el('h1','操作を停止しました'),el('p',message));const b=el('button','ログインし直す');b.onclick=()=>location.assign(DebugContext.loginURL||'./');mask.append(b);document.body.replaceChildren(mask);}
 const request=(path,method='GET',body)=>DebugContext.request?DebugContext.request(path,method,body):fetch('./api/'+path,{method,cache:'no-store',redirect:'error',headers:method==='GET'?{}:{'Content-Type':'application/json','X-Manabi-Request':'1'},body:body?JSON.stringify(body):undefined});
 async function api(path,method='GET',body){
  const r=await request(path,method,body);
  if(r.status===401||r.status===403){halt('認証が切れたか、利用許可が変更されました。端末データは残っています。');throw Error('利用許可を確認してください。');}
  const out=await r.json();if(!r.ok)throw Error(out.message||'送信できませんでした。入力内容を保ったまま再試行できます。');return out;
 }
 async function logout(){try{if(window.ManabiShared){await ManabiShared.sync.flush();if(ManabiShared.sync.pending.size)throw Error();}await api('logout','POST',{});if(DebugContext.signOut)await DebugContext.signOut();halt('ログアウトしました。');location.assign(DebugContext.loginURL||'./');}catch(e){toast('ログアウトを完了できません。回線を確認して再試行してください。');}}
 v13Logout=logout;
 const bar=el('section',null,{class:'debug-bar','aria-label':'教室共有メニュー'});
 bar.append(el('span',window.ManabiShared?'教室共有':'非公開テスト｜架空データのみ。端末ごとに独立・自動共有なし。ブラウザデータ削除で消えます。'));
 function button(text,fn){const b=el('button',text,{type:'button',class:'btn small'});b.onclick=fn;return b;}
 bar.append(button('不具合を報告',report),button(manager?'報告を管理':'自分の報告',()=>listReports(0)),button('バックアップ・復元',backups),button(window.ManabiShared?'講師を切り替える':'操作役を試す',async()=>{if(window.ManabiShared){try{await ManabiShared.sync.flush();if(ManabiShared.sync.pending.size)throw Error('未送信の入力を先に確認してください。');await api('logout','POST',{});ManabiAuth.clearStaff();location.assign('./');}catch(e){toast(e.message);}return;}originalLogout();document.getElementById('v13-login-title').textContent='架空データの操作役を選択';}),button('ログアウト',logout));
 const main=document.getElementById('content');main.parentNode.insertBefore(bar,main);
 const identity=el('small','利用者：'+user.name+(window.ManabiShared?' ／ '+(user.login_method==='password'?'講師ID・パスワード':'バーコード')+'でログイン中':' ／ 画面内の講師切替・ログインIDは架空データの操作確認用です。'));bar.append(identity);
 function dialog(title){const d=el('dialog',null,{class:'debug-dialog'});d.append(el('h2',title));const close=button('閉じる',()=>d.close());d.append(close);d.addEventListener('close',()=>d.remove());document.body.append(d);d.showModal();return d;}
 function field(form,name,title,value='',type='textarea'){const label=el('label',title);const input=el(type==='textarea'?'textarea':'input',null,{name});if(type!=='textarea')input.type=type;input.required=true;input.value=value;input.maxLength=name==='screen'?160:4000;if(type==='textarea')input.rows=3;label.append(input);form.append(label);return input;}
 function report(){
  const d=dialog('不具合を報告'),form=el('form');d.append(form);
  form.append(el('p',window.ManabiShared?'不具合の内容と、必要な画像を共有します。':'この報告文と添付画像だけを共有します。生徒・授業の端末データは送信しません。',{class:'debug-notice'}));
  field(form,'screen','発生した画面',document.querySelector('#content h1')?.textContent||state.page,'text');
  field(form,'description','不具合の内容');field(form,'expected','本来期待していた動作');field(form,'actual','実際に起こった動作');field(form,'steps','再現手順');
  const local=new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,16);
  field(form,'occurred_at','発生日時',local,'datetime-local');
  const input=el('input',null,{type:'file',accept:'image/png,image/jpeg'}),label=el('label','画像（任意・PNG/JPEG、2MB以内）');label.append(input);form.append(label);
  const hint=el('p','画像を確認し、名前など残したくない部分をドラッグして黒塗りしてください。実在する生徒の画像は添付禁止です。');form.append(hint);
  const canvas=el('canvas');canvas.hidden=true;form.append(canvas);let imageReady=false,start;
  const confirmed=el('input',null,{type:'checkbox',required:''}),check=el('label','報告文と画像に実在する生徒の個人情報がなく、架空データだけであることを確認しました。');check.prepend(confirmed);form.append(check);
  const status=el('p','',{class:'debug-status',role:'status'});form.append(status);
  input.onchange=async()=>{imageReady=false;canvas.hidden=true;confirmed.checked=false;const f=input.files[0];if(!f)return;
   if(!['image/png','image/jpeg'].includes(f.type)||f.size>2*1024*1024){status.textContent='PNG/JPEGの2MB以内の画像を選択してください。';input.value='';return;}
   const url=URL.createObjectURL(f);try{const img=new Image();img.src=url;await img.decode();if(img.width*img.height>20000000)throw Error('大きすぎる画像です。');const scale=Math.min(1,1200/img.width,1200/img.height);canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale);const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);canvas.hidden=false;imageReady=true;status.textContent='画像を確認し、必要な部分を黒塗りしてください。';}catch{status.textContent='画像を読み込めませんでした。';input.value='';}finally{URL.revokeObjectURL(url);}
  };
  const point=e=>{const r=canvas.getBoundingClientRect();return [(e.clientX-r.left)*canvas.width/r.width,(e.clientY-r.top)*canvas.height/r.height];};
  canvas.onpointerdown=e=>{start=point(e);canvas.setPointerCapture(e.pointerId);confirmed.checked=false;};
  canvas.onpointerup=e=>{if(!start)return;const end=point(e),ctx=canvas.getContext('2d');ctx.fillStyle='#000';ctx.fillRect(Math.min(start[0],end[0]),Math.min(start[1],end[1]),Math.max(10,Math.abs(start[0]-end[0])),Math.max(10,Math.abs(start[1]-end[1])));start=null;};
  const send=el('button','報告を送信',{type:'submit',class:'btn primary'});form.append(send);
  form.onsubmit=async e=>{e.preventDefault();send.disabled=true;try{
   const data=Object.fromEntries(new FormData(form));data.occurred_at=new Date(data.occurred_at).toISOString();data.fictional_confirmed=confirmed.checked;
   data.screenshot=imageReady?canvas.toDataURL('image/jpeg',0.65).split(',')[1]:null;
   if(data.screenshot?.length>600000)throw Error('画像が大きすぎます。小さな画像を選び直してください。');
   await api('reports','POST',data);d.close();toast('不具合報告を保存しました。');
  }catch(err){status.textContent=err.message;}finally{send.disabled=false;}};
 }
 async function listReports(offset){
  const d=dialog(manager?'不具合報告の管理':'自分の不具合報告'),status=el('p','読み込み中…',{role:'status'});d.append(status);
  try{const [rows,users]=await Promise.all([api('reports?offset='+offset),manager?api('users'):Promise.resolve([user])]);status.textContent=rows.length?`${offset+1}〜${offset+rows.length}件`:'報告はありません。';
   const names=Object.fromEntries(users.map(u=>[u.id,u.display_name||u.name]));
   for(const row of rows){const item=el('details');item.append(el('summary',labels[row.status]+'｜'+row.screen+'｜'+row.description.slice(0,70)));item.append(el('p',new Date(row.occurred_at).toLocaleString('ja-JP')+' ／ '+(row.reporter_name||names[row.reporter_id]||'利用者')));
    for(const[k,title]of [['description','内容'],['expected','期待'],['actual','実際'],['steps','手順'],['device','端末']]){item.append(el('b',title),el('pre',row[k]));}
    const imageButton=button('添付画像を確認',async()=>{try{const r=await request('reports/'+row.id+'/image');if(!r.ok)throw Error('添付画像がないか、閲覧できません。');const url=URL.createObjectURL(await r.blob()),img=el('img',null,{src:url,alt:'確認済みの架空データの添付画像'});item.append(img);imageButton.disabled=true;d.addEventListener('close',()=>URL.revokeObjectURL(url),{once:true});}catch(e){toast(e.message);}});item.append(imageButton);
    if(manager){const select=el('select',null,{'aria-label':'対応状況'});for(const[k,v]of Object.entries(labels)){const o=el('option',v,{value:k});select.append(o);}select.value=row.status;const save=button('対応状況を保存',async()=>{save.disabled=true;try{await api('reports/'+row.id,'PATCH',{status:select.value});item.querySelector('summary').textContent=labels[select.value]+'｜'+row.screen+'｜'+row.description.slice(0,70);toast('対応状況を保存しました。');}catch(e){status.textContent=e.message;}finally{save.disabled=false;}});item.append(select,save);}
    d.append(item);
   }
   if(offset>0)d.append(button('前の50件',()=>{d.close();listReports(Math.max(0,offset-50));}));if(rows.length===50)d.append(button('次の50件',()=>{d.close();listReports(offset+50);}));
  }catch(e){status.textContent=e.message;}
 }
 function download(value,name){const url=URL.createObjectURL(new Blob([JSON.stringify(value,null,2)],{type:'application/json'})),a=el('a',null,{href:url,download:name});a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 const keys=['llld_manabi_mock_v9_local_demo','llld_manabi_v9_ui','llld_manabi_v9_forms','llld_manabi_v9_reports','llld_manabi_v9_view','llld_manabi_mock_v6_exam_qualification','llld_manabi_mock_v5_all_students_ten_lessons','llld_manabi_v9_controls','llld_manabi_v11_view'];
 function snapshot(){captureVisibleEditors();persist();const entries={};for(const key of keys){const value=DebugStorage.getItem(key);if(value!==null)entries[key]=JSON.parse(value);}return {format:'manabi-debug-backup',version:1,created_at:new Date().toISOString(),entries};}
 function validateBackup(value){
  if(value?.format!=='manabi-debug-backup'||value.version!==1||!value.entries||Array.isArray(value.entries)||typeof value.entries!=='object')throw Error('このアプリの全体バックアップを選択してください。');
  if(Object.keys(value.entries).some(k=>!keys.includes(k)))throw Error('対応していない保存領域です。');
  const record=value.entries[keys[0]];if(record?.version!==1||!Array.isArray(record.students)||!Array.isArray(record.lessons)||!Array.isArray(record.teachers))throw Error('記録の形式を確認できません。');
  const walk=x=>{if(!x||typeof x!=='object')return;for(const[k,v]of Object.entries(x)){if(['__proto__','constructor','prototype'].includes(k))throw Error('使用できないキーが含まれています。');walk(v);}};walk(value);
  for(const s of record.students)if(typeof s.id!=='string'||!/^[-\w]+$/.test(s.id)||!Array.isArray(s.subjects))throw Error('生徒データの形式が不正です。');
  return value.entries;
 }
 function backups(){if(window.ManabiShared)return sharedBackups();const d=dialog('バックアップ・復元');d.append(el('p','この利用者・この端末の全保存領域が対象です。実在する生徒のデータは取り込まないでください。'));
  d.append(button('全体JSONを保存',()=>{download(snapshot(),'manabi_debug_backup_'+localDate()+'.json');toast('下書き・設定を含めて書き出しました。');}));
  const input=el('input',null,{type:'file',accept:'.json,application/json'}),label=el('label','全体JSONから復元（現在データを上書き）');label.append(input);d.append(label);
  input.onchange=async()=>{try{const f=input.files[0];if(!f)return;if(f.size>8*1024*1024)throw Error('8MB以内のJSONを選択してください。');const entries=validateBackup(JSON.parse(await f.text()));if(!confirm('架空データだけのJSONであることを確認しましたか？ 現在データをバックアップしてから上書き復元します。'))return;
   const before=snapshot();download(before,'manabi_before_restore_'+Date.now()+'.json');
   try{for(const key of keys)DebugStorage.removeItem(key);for(const[key,value]of Object.entries(entries))DebugStorage.setItem(key,JSON.stringify(value));}catch(error){for(const key of keys)DebugStorage.removeItem(key);for(const[key,value]of Object.entries(before.entries))DebugStorage.setItem(key,JSON.stringify(value));throw error;}
   DebugContext.locked=true;location.reload();
  }catch(e){toast('復元できません：'+e.message);}};
  d.append(button('架空データの初期状態に戻す',()=>{if(!confirm('現在データをJSON保存してから、この利用者・端末の架空データと下書き・設定を初期化しますか？'))return;download(snapshot(),'manabi_before_reset_'+Date.now()+'.json');for(const key of keys)DebugStorage.removeItem(key);DebugContext.locked=true;location.reload();}));
 }

 async function exportShared(){try{captureVisibleEditors();persist();await ManabiShared.sync.flush();if(ManabiShared.sync.pending.size||ManabiShared.sync.inflight)throw Error('未送信の入力があります。保存完了後に再度書き出してください。');const current=await ManabiAuth.api('shared');const data=ManabiSharedModules.unpack(current.records,{});download({format:'manabi-debug-backup',version:1,created_at:new Date().toISOString(),entries:{[keys[0]]:data}},'manabi_shared_backup_'+localDate()+'.json');toast('共有データのJSONを保存しました。');}catch(error){toast(error.message);}}
 function sharedBackups(){const d=dialog('共有データのバックアップ・復元');d.append(el('p','生徒・授業・成績などは全講師で共有しています。復元・初期化は全員に反映されます。'));
  d.append(button('共有データをJSON保存',exportShared));
  const legacy=localStorage.getItem(ManabiShared.legacyPrefix+keys[0]);if(legacy)d.append(button('以前の端末データをJSON保存',()=>{const entries={};for(const k of keys){const v=localStorage.getItem(ManabiShared.legacyPrefix+k);if(v)entries[k]=JSON.parse(v);}download({format:'manabi-debug-backup',version:1,created_at:new Date().toISOString(),entries},'manabi_previous_local_'+localDate()+'.json');}));
  if(!manager)return;
  const history=el('section'),backupStatus=el('p','DBのバックアップを確認中…',{role:'status'});history.append(backupStatus);d.append(history);
  const backupKinds={initial:'初期データ',scheduled:'日次保存',manual:'手動保存',restore:'復元前',reset:'初期化前'};
  const loadBackups=async()=>{try{const rows=await ManabiAuth.api('shared/backups');history.replaceChildren(backupStatus);const latest=rows.find(b=>b.kind==='scheduled');backupStatus.textContent='毎日03:00（日本時間）に自動保存・直近7回を保持。'+(latest?' 最終保存：'+new Date(latest.created_at).toLocaleString('ja-JP'):' まだ日次保存がありません。');if(!latest||Date.now()-Date.parse(latest.created_at)>36*3600000)backupStatus.textContent+=' 自動保存の稼働状況を管理者へ確認してください。';for(const b of rows){const row=el('div',null,{class:'row mt'});row.append(el('span',new Date(b.created_at).toLocaleString('ja-JP')+'｜'+(backupKinds[b.kind]||b.kind)+'｜'+b.record_count+'件'));row.append(button('JSON保存',async()=>{try{const v=await ManabiAuth.api('shared/backups/'+b.id);download({format:'manabi-debug-backup',version:1,created_at:v.created_at,entries:{[keys[0]]:ManabiSharedModules.unpack(v.records,{})}},'manabi_db_backup_'+b.id+'.json');}catch(e){toast(e.message);}}));row.append(button('この時点に戻す',async()=>{if(!confirm('全講師の共有データを、この時点に戻します。現在の内容は復元前のバックアップへ保存します。よろしいですか？'))return;try{const v=await ManabiAuth.api('shared/backups/'+b.id);await replace('restore',ManabiSharedModules.unpack(v.records,{}));}catch(e){toast(e.message);}}));history.append(row);}}catch(e){backupStatus.textContent=e.message;}};
  d.append(button('今の共有DBをバックアップ',async()=>{try{await ManabiShared.sync.flush();if(ManabiShared.sync.pending.size)throw Error('未送信の入力があります。');await ManabiAuth.api('shared/backups','POST',{});await loadBackups();toast('共有DBをバックアップしました。');}catch(e){toast(e.message);}}));
  d.append(el('p','DB内の控えです。サーバー全体の障害に備えて、JSONも別の場所へ保存してください。'));
  const input=el('input',null,{type:'file',accept:'.json,application/json'}),label=el('label','全体JSONで共有DBを上書き復元');label.append(input);d.append(label);
  const replace=async(kind,data)=>{await ManabiShared.sync.flush();if(ManabiShared.sync.pending.size)throw Error('未送信の入力があります。');const latest=await ManabiAuth.api('shared');const before=ManabiSharedModules.unpack(latest.records,{});download({format:'manabi-debug-backup',version:1,created_at:new Date().toISOString(),entries:{[keys[0]]:before}},'manabi_before_'+kind+'_'+Date.now()+'.json');await ManabiAuth.api('shared/'+kind,'POST',{expected_revision:latest.revision,data});location.reload();};
  input.onchange=async()=>{try{const f=input.files[0];if(!f)return;if(f.size>8*1024*1024)throw Error('8MB以内のJSONを選択してください。');const entries=validateBackup(JSON.parse(await f.text()));if(!confirm('このJSONで全講師の共有データを上書きします。変更前の共有データはJSONとDBに保存します。よろしいですか？'))return;await replace('restore',entries[keys[0]]);}catch(e){toast('復元できません：'+e.message);}};
  loadBackups();
  d.append(button('初期サンプルへ戻す（全教室）',async()=>{if(!confirm('全講師の共有データを最初の架空データへ戻します。変更前の共有データはJSONとDBに保存します。よろしいですか？'))return;try{await replace('reset');}catch(e){toast(e.message);}}));
 }
 if(window.ManabiShared){
  const syncStatus=el('span',ManabiShared.status.message,{role:'status',class:'shared-sync-status'});bar.append(syncStatus);
  const recover=button('未送信の入力を確認',()=>{const d=dialog('共有DBに送れていない入力');d.append(el('p',ManabiShared.status.message));d.append(button('未送信の入力をJSON保存',()=>download(ManabiShared.sync.exportPending(),'manabi_unsent_'+Date.now()+'.json')));d.append(button('入力を保存して最新データを開く',()=>{if(!confirm('未送信の入力をJSONに保存し、この画面は共有DBの最新内容へ戻します。必要な内容はJSONを見ながら再入力してください。'))return;download(snapshot(),'manabi_before_reload_'+Date.now()+'.json');download(ManabiShared.sync.exportPending(),'manabi_unsent_'+Date.now()+'.json');localStorage.removeItem(ManabiShared.localPrefix+'outbox');ManabiShared.sync.pending.clear();ManabiShared.sync.inflight=null;location.reload();}));});recover.hidden=true;bar.append(recover);
  window.addEventListener('manabi-sync',e=>{syncStatus.textContent=e.detail.message;recover.hidden=!e.detail.blocked;});
  bar.append(button('共有データを更新',async()=>{try{captureVisibleEditors();persist();await ManabiShared.sync.refresh();toast('共有データを確認しました。');}catch(e){toast(e.message);}}));
 }
 // The original reset button now resets all relevant storage, using the same safe workflow.
 resetDemo=()=>backups();
 if(window.ManabiShared)exportData=exportShared;
 async function check(){if(checking||halted)return;checking=true;try{const latest=await api('me');if(latest.role!==user.role)halt('利用権限が変更されました。再読み込みしてください。');}catch(error){if(!halted&&[401,403].includes(error.status))halt('認証が切れました。ログインし直してください。未送信の入力は端末に残っています。');else if(!halted&&window.ManabiShared)ManabiShared.sync.status('回線を確認しています。未送信の入力は端末に保持します。');}finally{checking=false;}}
 setInterval(check,60000);window.addEventListener('focus',check);window.addEventListener('pageshow',e=>{if(e.persisted)check();});
 window.addEventListener('storage',e=>{if(e.key?.startsWith(window.ManabiShared?ManabiShared.localPrefix:'manabi_debug:'+user.id+':'))halt('別の画面で保存内容が変更されました。再読み込みしてください。');});
 // Exposed only for local DOM tests; no server secrets or privileges.
 window.ManabiDebug={validateBackup,snapshot};
})();

// Operational copy belongs to the online app; the immutable prototype stays intact.
(()=>{
 const remove=['本文を開かずに連続表示','過去の履歴を見ていても、現在の方針はここで確認できます。','入力した生徒・授業・成績は共有DBへ保存し、別端末にも反映します。未送信の入力はこのブラウザに保持します。'];
 function clean(root){if(!root)return;for(const node of root.querySelectorAll('p,span'))if(!node.children.length&&remove.includes(node.textContent.trim()))node.remove();}
 const priorRender=render;render=function(...args){const result=priorRender(...args);clean(document.getElementById('content'));return result;};
 renderSettings=function(){const samples=(db.students||[]).some(s=>/^生徒 [A-Z]/.test(s.name)&&/^D-\d+$/.test(s.code));return head('運用設定','')+`<div class="two"><section class="card"><div class="section-title"><h2>保存しているデータ</h2><span class="badge green">教室共有・オンライン</span></div><dl><div class="settingrow"><dt>保存先</dt><dd>仁保・大州の共有データベース</dd></div><div class="settingrow"><dt>データの状態</dt><dd>${samples?'初期サンプルを含んでいます':'登録された教室データ'}</dd></div><div class="settingrow"><dt>生徒／講師</dt><dd>${db.students.length}名 ／ ${db.teachers.length}名</dd></div><div class="settingrow"><dt>授業記録</dt><dd>${db.lessons.length}件</dd></div></dl><div class="row mt"><button class="btn" onclick="exportData()">共有データをJSON保存</button><button class="btn" onclick="resetDemo()">バックアップ・復元を開く</button></div></section><section class="card"><h2>バックアップ</h2><dl><div class="settingrow"><dt>自動保存</dt><dd>毎日03:00（日本時間）</dd></div><div class="settingrow"><dt>日次の保存数</dt><dd>直近7回</dd></div><div class="settingrow"><dt>授業・変更履歴</dt><dd>継続して保存</dd></div></dl><p class="small">復元は全教室に反映されます。復元前のデータも保存します。</p><p class="small">障害に備え、JSONをPCなど別の場所にも保存してください。</p></section></div>`;};
 document.title='学びのスキルカルテ';clean(document.getElementById('content'));
})();

// Keep action feedback inside the active dialog's top layer.
(()=>{
 const previous=toast;
 toast=function(message){
  const dialogs=[...document.querySelectorAll('dialog[open]')],board=document.querySelector('.v13-board-panel'),shade=board?.closest('.v13-board-shade');const target=dialogs.at(-1)||(shade&&!shade.hidden&&getComputedStyle(shade).display!=='none'?board:null);
  if(!target)return previous(message);
  let status=target.querySelector(':scope > .production-dialog-status');if(!status){status=document.createElement('p');status.className='production-dialog-status';status.setAttribute('role','alert');status.setAttribute('aria-live','assertive');const heading=target.querySelector(':scope > h2,:scope > .dialoghead');if(heading)heading.insertAdjacentElement('afterend',status);else target.prepend(status);}
  status.textContent=String(message);status.hidden=false;status.scrollIntoView?.({block:'nearest'});
 };
 function arrange(){
  const bar=document.querySelector('.debug-bar');if(!bar||bar.querySelector('.production-bar-actions'))return;
  const actions=document.createElement('div');actions.className='production-bar-actions';for(const button of [...bar.children].filter(n=>n.tagName==='BUTTON'))actions.append(button);bar.append(actions);
 }
 arrange();
 window.ManabiProductionUI={arrange};
})();
