(async()=>{
 const auth=window.ManabiAuth,{acquireTabStorage,SharedSync,MAIN_KEY,localPart,unpack}=window.ManabiSharedModules;
 const stop=message=>{document.body.replaceChildren();const box=document.createElement('main');box.className='debug-block';const h=document.createElement('h1');h.textContent='学びのスキルカルテ';const p=document.createElement('p');p.textContent=message;const a=document.createElement('a');a.href='./';a.textContent='ログイン画面へ';box.append(h,p,a);document.body.append(box);};
 let storageLease;
 try{
  const user=await auth.api('me');if(user.staff_required){location.replace('./');return;}
  window.DebugContext={user,locked:false,loginURL:'./',request:auth.request,signOut:auth.signOut};
  if(!navigator.locks){stop('最新版のChromeまたはSafariで開いてください。');return;}
  storageLease=await acquireTabStorage({storage:localStorage,session:sessionStorage,locks:navigator.locks,userId:user.id,staffId:user.staff_id});
  const prefix=storageLease.prefix;
   const snapshot=await auth.api('shared');let local=JSON.parse(localStorage.getItem(prefix+'local')||'{}'),journal=JSON.parse(localStorage.getItem(prefix+'outbox')||'null');
   const shared=window.ManabiShared={lastInput:0,readApp:null,applyApp:null,canRefresh:()=>false,localPrefix:prefix,legacyPrefix:'manabi_debug:'+user.id+':',storageLease,status:{pending:0,message:'共有データを読み込みました'}};
   const sync=shared.sync=new SharedSync({snapshot,journal,saveJournal:value=>localStorage.setItem(prefix+'outbox',JSON.stringify(value)),send:value=>auth.api('shared','POST',value),read:since=>auth.api('shared?since='+since),onUpdate:(data,redraw)=>{if(shared.applyApp){shared.applying=true;try{shared.applyApp(data,redraw);}finally{shared.applying=false;}}},onStatus:value=>{shared.status=value;window.dispatchEvent(new CustomEvent('manabi-sync',{detail:value}));},canRefresh:()=>shared.canRefresh()});
   sync.local=local;let initial=sync.materialize(local);
   window.DebugStorage={getItem:key=>key===MAIN_KEY?JSON.stringify(shared.readApp?shared.readApp():initial):localStorage.getItem(prefix+key),setItem:(key,value)=>{if(DebugContext.locked)throw Error('locked');if(key===MAIN_KEY){const data=JSON.parse(value);local=localPart(data);localStorage.setItem(prefix+'local',JSON.stringify(local));if(shared.readApp&&!shared.applying)sync.capture(data);else initial=data;}else localStorage.setItem(prefix+key,value);},removeItem:key=>{if(key===MAIN_KEY)throw Error('共有データはバックアップ・復元から操作してください。');localStorage.removeItem(prefix+key);},keys:()=>[MAIN_KEY,...Object.keys(localStorage).filter(k=>k.startsWith(prefix)&&!['local','outbox'].includes(k.slice(prefix.length))).map(k=>k.slice(prefix.length))]};
   await auth.api('session/open','POST',{});
   const load=path=>new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=path;s.onload=resolve;s.onerror=reject;document.body.append(s);});
   await load('./assets/app.js');await load('./assets/shared-bridge.js');await load('./assets/debug.js');
 }catch(error){
  if(window.DebugContext)DebugContext.locked=true;
  const sync=window.ManabiShared?.sync;sync?.close();
  try{await sync?.running;}catch{}
  storageLease?.release();
  if(error.status===401)location.replace('./');
  else stop(error instanceof SyntaxError?'未送信データを読み込めませんでした。データを削除せず、管理者へお知らせください。':error.message||'共有データを開けませんでした。未送信の入力は端末に保持しています。');
 }
})();
