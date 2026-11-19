(async()=>{
 const auth=window.ManabiAuth;
 const stop=message=>{document.body.replaceChildren();const box=document.createElement('main');box.className='debug-block';const h=document.createElement('h1');h.textContent='学びのスキルカルテ';const p=document.createElement('p');p.textContent=message;const a=document.createElement('a');a.href='./';a.textContent='ログイン画面へ';box.append(h,p,a);document.body.append(box);};
 try{
  const user=await auth.api('me');
  window.DebugContext={user,locked:false,loginURL:'./',request:auth.request,signOut:auth.signOut};
  const prefix='manabi_debug:'+user.id+':';
  window.DebugStorage={getItem:key=>localStorage.getItem(prefix+key),setItem:(key,value)=>{if(DebugContext.locked)throw Error('locked');localStorage.setItem(prefix+key,value);},removeItem:key=>{if(DebugContext.locked)throw Error('locked');localStorage.removeItem(prefix+key);},keys:()=>Object.keys(localStorage).filter(k=>k.startsWith(prefix)).map(k=>k.slice(prefix.length))};
  if(!navigator.locks){stop('最新版のChromeまたはSafariで開いてください。');return;}
  navigator.locks.request(prefix+'writer',{ifAvailable:true},async lock=>{
   if(!lock){stop('同じアカウントの画面が別のタブで開いています。先のタブを閉じてから開き直してください。');return;}
   await auth.api('session/open','POST',{});
   const load=path=>new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=path;s.onload=resolve;s.onerror=reject;document.body.append(s);});
   await load('./assets/app.js');await load('./assets/debug.js');await new Promise(()=>{});
  }).catch(()=>stop('画面を開けませんでした。入力済みの端末データは保持されています。'));
 }catch(error){if(error.status===401)location.replace('./');else stop(error.message||'利用許可を確認できませんでした。');}
})();
