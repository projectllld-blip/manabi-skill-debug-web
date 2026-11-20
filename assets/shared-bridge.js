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

var ManabiMaterialsCSV = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // shared/materials-csv.mjs
  var materials_csv_exports = {};
  __export(materials_csv_exports, {
    exportCSV: () => exportCSV,
    grades: () => grades,
    headers: () => headers,
    parseCSV: () => parseCSV,
    subjects: () => subjects
  });
  var headers = ["\u6559\u6750\u30D0\u30FC\u30B3\u30FC\u30C9ID", "\u6559\u6750\u540D", "\u6559\u79D1", "\u5B66\u5E74", "\u51FA\u7248\u793E", "\u8868\u793A\u9806", "\u5099\u8003"];
  var grades = [...Array.from({ length: 6 }, (_, i) => `\u5C0F\u5B66${i + 1}\u5E74`), ...Array.from({ length: 3 }, (_, i) => `\u4E2D\u5B66${i + 1}\u5E74`), ...Array.from({ length: 3 }, (_, i) => `\u9AD8\u6821${i + 1}\u5E74`)];
  var subjects = ["\u6570\u5B66", "\u82F1\u8A9E", "\u56FD\u8A9E", "\u7B97\u6570", "\u7406\u79D1", "\u793E\u4F1A"];
  var dangerous = /^(?:[\t\r\n]|\s*[=+@-])/;
  var encode = (v) => {
    const s = String(v ?? "");
    return s.startsWith("'") || dangerous.test(s) ? "'" + s : s;
  };
  var decode = (s) => s.startsWith("'") && (s[1] === "'" || dangerous.test(s.slice(1))) ? s.slice(1) : s;
  var quote = (v) => '"' + encode(v).replaceAll('"', '""') + '"';
  function exportCSV(items) {
    return "\uFEFF" + [headers, ...items.filter((x) => x.active !== false).map((x) => [x.barcode || "", x.title || "", x.subject || "", (x.grades || []).join("\u3001"), x.publisher || "", x.sortOrder ?? "", x.notes || ""])].map((row) => row.map(quote).join(",")).join("\r\n") + "\r\n";
  }
  function parseCSV(input) {
    const errors = [], rows = [], matrix = [];
    const fail = (row2, message) => errors.push({ row: row2, message });
    if (typeof input !== "string" || input.length > 4 * 1024 * 1024) return { rows, errors: [{ row: 0, message: "CSV\u306F4MB\u4EE5\u5185\u3067\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002" }], total: 0 };
    const text = input.replace(/^\uFEFF/, "");
    let row = [], cell = "", quoted = false, ended = false, line = 1, rowLine = 1;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (quoted) {
        if (ch === '"') {
          if (text[i + 1] === '"') {
            cell += '"';
            i++;
          } else {
            quoted = false;
            ended = true;
          }
        } else {
          cell += ch;
          if (ch === "\n") line++;
        }
        continue;
      }
      if (ch === '"') {
        if (cell || ended) {
          fail(line, "\u5F15\u7528\u7B26\u306E\u4F4D\u7F6E\u304C\u4E0D\u6B63\u3067\u3059\u3002");
          break;
        }
        quoted = true;
        continue;
      }
      if (ch === "," || ch === "\r" || ch === "\n") {
        row.push(decode(cell));
        cell = "";
        ended = false;
        if (ch !== ",") {
          matrix.push({ cells: row, line: rowLine });
          row = [];
          if (ch === "\r" && text[i + 1] === "\n") i++;
          line++;
          rowLine = line;
        }
        continue;
      }
      if (ended) {
        fail(line, "\u9589\u3058\u305F\u5F15\u7528\u7B26\u306E\u5F8C\u306B\u306F\u30AB\u30F3\u30DE\u307E\u305F\u306F\u6539\u884C\u3092\u5165\u308C\u3066\u304F\u3060\u3055\u3044\u3002");
        break;
      }
      cell += ch;
    }
    if (quoted) fail(rowLine, "\u5F15\u7528\u7B26\u304C\u9589\u3058\u3089\u308C\u3066\u3044\u307E\u305B\u3093\u3002");
    if (cell || row.length || ended) matrix.push({ cells: [...row, decode(cell)], line: rowLine });
    while (matrix.length && matrix.at(-1).cells.every((x) => x === "")) matrix.pop();
    if (!matrix.length) return { rows, errors: [{ row: 0, message: "CSV\u304C\u7A7A\u3067\u3059\u3002\u6559\u6750\u306F\u5909\u66F4\u3055\u308C\u307E\u305B\u3093\u3002" }], total: 0 };
    if (matrix[0].cells.length !== 7 || matrix[0].cells.some((x, i) => x.trim() !== headers[i])) fail(matrix[0].line, "\u5217\u898B\u51FA\u3057\u304C\u9055\u3044\u307E\u3059\u3002\u300CCSV\u51FA\u529B\u300D\u3067\u53D6\u5F97\u3057\u305F7\u5217\u3092\u4F7F\u7528\u3057\u3066\u304F\u3060\u3055\u3044\u3002");
    const seen = /* @__PURE__ */ new Set();
    for (const record of matrix.slice(1)) {
      const n = record.line, c = record.cells;
      if (c.length !== 7) {
        fail(n, "\u5217\u6570\u306F7\u5217\u3067\u3059\u3002");
        continue;
      }
      const [rawBarcode, title, subject, rawGrades, publisher, rawOrder, notes] = c;
      const barcode = rawBarcode.trim();
      const gradeValues = rawGrades.trim() ? rawGrades.split(/[、,;；|／/]/).map((g) => {
        const s = g.trim().normalize("NFKC");
        const m = s.match(/^([小中高])(\d)年?$/);
        return m ? (m[1] === "\u5C0F" ? "\u5C0F\u5B66" : m[1] === "\u4E2D" ? "\u4E2D\u5B66" : "\u9AD8\u6821") + m[2] + "\u5E74" : s;
      }) : [];
      const order = rawOrder.trim();
      const sortOrder = order === "" ? null : Number(order);
      if (barcode && !/^MAT-[0-9]{6,9}$/.test(barcode)) fail(n, "\u6559\u6750\u30D0\u30FC\u30B3\u30FC\u30C9ID\u306F MAT-000001 \u306E\u5F62\u5F0F\u3067\u3059\u3002\u65B0\u898F\u306F\u7A7A\u6B04\u306B\u3057\u3066\u304F\u3060\u3055\u3044\u3002");
      if (barcode && seen.has(barcode)) fail(n, "\u6559\u6750\u30D0\u30FC\u30B3\u30FC\u30C9ID\u304C\u91CD\u8907\u3057\u3066\u3044\u307E\u3059\u3002");
      if (barcode) seen.add(barcode);
      if (!title.trim() || title.length > 120) fail(n, "\u6559\u6750\u540D\u306F1\u301C120\u6587\u5B57\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002");
      if (subject && !subjects.includes(subject)) fail(n, "\u6559\u79D1\u3092\u65E2\u5B58\u306E\u6559\u79D1\u304B\u3089\u9078\u3093\u3067\u304F\u3060\u3055\u3044\u3002");
      if (gradeValues.some((g) => !grades.includes(g)) || new Set(gradeValues).size !== gradeValues.length) fail(n, "\u5B66\u5E74\u306F\u5C0F1\u301C\u9AD83\u3067\u3001\u8907\u6570\u5B66\u5E74\u306F\u300C\u3001\u300D\u3067\u533A\u5207\u3063\u3066\u304F\u3060\u3055\u3044\u3002");
      if (publisher.length > 200) fail(n, "\u51FA\u7248\u793E\u306F200\u6587\u5B57\u4EE5\u5185\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002");
      if (notes.length > 2e3) fail(n, "\u5099\u8003\u306F2000\u6587\u5B57\u4EE5\u5185\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002");
      if (order && (!/^\d+$/.test(order) || !Number.isSafeInteger(sortOrder) || sortOrder > 1e6)) fail(n, "\u8868\u793A\u9806\u306F0\u301C1000000\u306E\u6574\u6570\u3067\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002");
      if (c.some((s) => /[\u0000-\u0008\u000b\u000c\u000e-\u001f\ufffd]/.test(s))) fail(n, "\u8AAD\u307F\u53D6\u308C\u306A\u3044\u6587\u5B57\u304C\u3042\u308A\u307E\u3059\u3002CSV UTF-8\u3067\u4FDD\u5B58\u3057\u3066\u304F\u3060\u3055\u3044\u3002");
      rows.push({ barcode, title: title.trim(), subject, grades: gradeValues, publisher, sortOrder, notes });
    }
    if (!rows.length && !errors.length) fail(2, "\u6559\u6750\u884C\u304C\u3042\u308A\u307E\u305B\u3093\u3002\u30D8\u30C3\u30C0\u30FC\u306E\u307F\u306ECSV\u3067\u306F\u4E0A\u66F8\u304D\u3067\u304D\u307E\u305B\u3093\u3002");
    if (rows.length > 2e3) fail(0, "\u4E00\u5EA6\u306B\u53D6\u308A\u8FBC\u3081\u308B\u6559\u6750\u306F2000\u4EF6\u307E\u3067\u3067\u3059\u3002");
    return { rows, errors, total: matrix.length - 1 };
  }
  return __toCommonJS(materials_csv_exports);
})();

// Material management uses the existing catalog and server transactions. Lesson snapshots stay unchanged.
(()=>{
 const manager=()=>!DebugContext.locked&&['system_admin','classroom_manager'].includes(DebugContext.user.role);
 const ui={items:null,revision:null,loading:false,error:'',q:'',subject:'',grade:'',attribute:'',inactive:false,sort:'order',direction:'asc',selected:new Set()};
 const all=()=>ui.items||db.catalog||[];
 const active=()=>all().filter(b=>b.active!==false);
 const csv=()=>window.ManabiMaterialsCSV;
 const text=v=>String(v??'');
 const options=(values,value,empty)=>'<option value="">'+esc(empty)+'</option>'+values.map(v=>'<option value="'+esc(v)+'"'+(v===value?' selected':'')+'>'+esc(v)+'</option>').join('');
 const grades=()=>typeof GRADES!=='undefined'?GRADES:csv().grades;
 const subjects=()=>[...new Set([...(csv()?.subjects||[]),...all().map(b=>b.subject).filter(Boolean)])];
 const filtered=()=>all().filter(b=>(ui.inactive||b.active!==false)&&(!ui.q||[b.title,b.barcode,b.publisher].some(x=>text(x).normalize('NFKC').toLowerCase().includes(ui.q.normalize('NFKC').toLowerCase())))&&(!ui.subject||b.subject===ui.subject)&&(!ui.grade||!(b.grades||[]).length||b.grades.includes(ui.grade))&&(!ui.attribute||(b.attributes||[]).includes(ui.attribute))).sort(compare);
 function compare(a,b){let result=ui.sort==='name'?text(a.title).localeCompare(text(b.title),'ja'):ui.sort==='barcode'?text(a.barcode).localeCompare(text(b.barcode),'en',{numeric:true}):(a.sortOrder??1000001)-(b.sortOrder??1000001);if(!result)result=text(a.barcode).localeCompare(text(b.barcode),'en',{numeric:true});return ui.direction==='desc'?-result:result;}
 const button=(label,action,extra='')=>'<button type="button" class="btn" data-mm-action="'+action+'" '+extra+'>'+label+'</button>';
 const notice=()=>ui.loading?'教材を読み込んでいます…':ui.error||'';
 function results(){const rows=filtered();return '<div class="resultbar"><span>'+rows.length+'件／選択 '+active().filter(b=>ui.selected.has(b.id)).length+'件</span><label class="checkline"><input type="checkbox" data-mm-select-filtered '+(rows.filter(b=>b.active!==false).length&&rows.filter(b=>b.active!==false).every(b=>ui.selected.has(b.id))?'checked':'')+'>表示中を選択</label></div><div class="tablewrap"><table class="materials-table"><thead><tr><th>選択</th><th>教材名・バーコードID</th><th>教科・学年</th><th>出版社・表示順</th><th>操作</th></tr></thead><tbody>'+rows.map(b=>'<tr><td><input type="checkbox" aria-label="'+esc(b.title)+'を印刷選択" data-mm-select="'+esc(b.id)+'" '+(ui.selected.has(b.id)?'checked ':'')+(b.active===false?'disabled':'')+'></td><td><b>'+esc(b.title)+'</b><div class="subcell">'+esc(b.barcode||'準備中')+(b.active===false?' ／ 非表示':'')+'</div>'+(b.notes?'<div class="subcell">'+esc(b.notes)+'</div>':'')+'</td><td>'+esc(b.subject||'指定なし')+'<div class="subcell">'+esc((b.grades||[]).join('・')||'全学年')+'</div>'+(b.attributes?.length?'<div class="subcell">'+esc(b.attributes.join('・'))+'</div>':'')+'</td><td>'+esc(b.publisher||'—')+'<div class="subcell">'+esc(b.sortOrder??'—')+'</div></td><td><div class="row">'+(manager()?button('編集','edit','data-mm-id="'+esc(b.id)+'"')+(b.active!==false?button('削除','archive','data-mm-id="'+esc(b.id)+'"'):''): '')+(b.active!==false?button('印刷','print-one','data-mm-id="'+esc(b.id)+'"'):'')+'</div></td></tr>').join('')+'<tr '+(rows.length?'hidden':'')+'><td colspan="5"><div class="empty">条件に合う教材はありません。</div></td></tr></tbody></table></div>';}
 function html(){if(!ui.loading)queueMicrotask(()=>void load());return '<section class="card manabi-materials"><div class="master-toolbar"><b>教材バーコード管理</b><div class="row">'+(manager()?button('＋教材を新規登録','new')+button('CSV出力','export')+button('CSV取込・全件上書き','import'):'')+'</div></div><div class="toolbar"><label class="field roster-search">教材名・バーコードID<input type="search" data-mm-filter="q" value="'+esc(ui.q)+'" placeholder="教材名・ID・出版社で検索"></label><label class="field">教科<select data-mm-filter="subject">'+options(subjects(),ui.subject,'すべての教科')+'</select></label><label class="field">学年<select data-mm-filter="grade">'+options(grades(),ui.grade,'すべての学年')+'</select></label><label class="field">属性<select data-mm-filter="attribute">'+options([...new Set(all().flatMap(b=>b.attributes||[]))],ui.attribute,'すべての属性')+'</select></label><label class="field">並び順<select data-mm-filter="sort">'+[['order','表示順'],['name','教材名'],['barcode','バーコードID']].map(([v,l])=>'<option value="'+v+'"'+(ui.sort===v?' selected':'')+'>'+l+'</option>').join('')+'</select></label><label class="field">方向<select data-mm-filter="direction"><option value="asc"'+(ui.direction==='asc'?' selected':'')+'>昇順</option><option value="desc"'+(ui.direction==='desc'?' selected':'')+'>降順</option></select></label><label class="checkline"><input type="checkbox" data-mm-filter="inactive" '+(ui.inactive?'checked':'')+'>非表示の教材も含む</label></div><div class="row materials-actions">'+button('全教材を一括印刷','print-all')+button('絞り込み結果を印刷','print-filtered')+button('選択教材のみ印刷','print-selected')+button('最新の一覧に更新','reload')+'</div><p class="mini-note">授業では教材名の欄でバーコードを読み取れます。削除・名称変更後も過去の授業記録は残ります。</p><p data-mm-status role="status">'+esc(notice())+'</p><div data-mm-results>'+results()+'</div></section>';}
 function paint(){document.querySelectorAll('.manabi-materials [data-mm-results]').forEach(node=>node.innerHTML=results());document.querySelectorAll('[data-mm-status]').forEach(node=>node.textContent=notice());}
 let loadPromise=null;
 async function load(){if(loadPromise)return loadPromise;if(DebugContext.locked)return;loadPromise=loadOnce();try{return await loadPromise;}finally{loadPromise=null;}}
 async function loadOnce(){ui.loading=true;ui.error='';paint();try{const response=await ManabiAuth.api('materials');if(DebugContext.locked)return;if(!Array.isArray(response.items)||!Number.isSafeInteger(response.revision))throw Error('教材一覧を確認できませんでした。');ui.items=response.items;ui.revision=response.revision;const ids=new Set(active().map(b=>b.id));ui.selected=new Set([...ui.selected].filter(id=>ids.has(id)));}catch(error){ui.error=error.message;}finally{ui.loading=false;paint();}}
 const originalMaster=renderMaster;
 renderMaster=function(){return originalMaster().replaceAll('>教材マスター</button>','>教材バーコード管理</button>');};
 masterBooks=html;
 renderCatalog=()=>head('教材バーコード管理','教材の登録・CSV一括更新・バーコード印刷を行います。')+html();
 openBookForm=id=>void editItem(id||'');
 saveBookForm=event=>{event.preventDefault();toast('教材バーコード管理から保存してください。');};
 function dialog(title){const d=document.createElement('dialog');d.className='debug-dialog materials-dialog';const h=document.createElement('h2');h.textContent=title;const body=document.createElement('div');body.className='materials-dialog-body';const status=document.createElement('p');status.setAttribute('role','status');const footer=document.createElement('div');footer.className='formfooter';const close=document.createElement('button');close.type='button';close.className='btn';close.textContent='閉じる';close.onclick=()=>d.close();footer.append(close);d.append(h,body,status,footer);let closed=false;d.addEventListener('close',()=>{closed=true;d.remove();});document.body.append(d);d.showModal();return {d,body,status,footer,close,get closed(){return closed;}};}
 function guard(){if(!manager())throw Error('教材の登録・変更は教室長または代表が行ってください。');}
 async function flush(){guard();await ManabiShared.sync.flush();guard();if(ManabiShared.sync.pending.size||ManabiShared.sync.inflight)throw Error('未送信の変更を保存してから教材を更新してください。');}
 function merge(response){const sync=ManabiShared.sync;if(!Array.isArray(response.items)||!Array.isArray(response.records))throw Error('保存結果を確認できません。最新の一覧に更新してください。');for(const row of response.records){const key=JSON.stringify([row.collection,row.record_key]),old=sync.base?.get(key);if(sync.base&&(!old||old.revision<=row.revision))sync.base.set(key,row);}if(sync.materialize&&sync.onUpdate){sync.onUpdate(sync.materialize(),false);sync.status();}ui.items=response.items;ui.revision=response.revision;paint();}
 const itemSignature=b=>JSON.stringify(b?[b.id,b.barcode,b.title,b.subject,b.grades||[],b.attributes||[],b.publisher||'',b.sortOrder??null,b.notes||'',b.active!==false]:null);
 async function currentRevision(old){const latest=await ManabiAuth.api('materials');if(old&&itemSignature(latest.items?.find(b=>b.id===old.id))!==itemSignature(old))throw Error('別の端末でこの教材が更新されました。入力内容を控えて閉じ、最新の一覧から編集し直してください。');return latest.revision;}
 async function commit(mode,rows,expected_revision,request_id,cancelled=()=>false){await flush();if(cancelled())throw Error('操作はキャンセルされました。');const response=await ManabiAuth.api('materials/commit','POST',{mode,rows,expected_revision,request_id});merge(response);return response;}
 function addField(form,label,name,value='',type='text'){const l=document.createElement('label');l.className='field';l.textContent=label;const field=document.createElement(type==='textarea'?'textarea':'input');if(type!=='textarea')field.type=type;field.name=name;field.value=value??'';l.append(field);form.append(l);return field;}
 async function editItem(id){if(!manager())return;const box=dialog(id?'教材を編集':'教材を新規登録');box.status.textContent='最新の教材情報を確認しています…';try{await load();if(box.closed)return;guard();if(ui.error)throw Error(ui.error);const old=id?all().find(b=>b.id===id):null;if(id&&!old)throw Error('教材が見つかりません。最新の一覧に更新してください。');const form=document.createElement('form');form.className='materials-form';if(old){const p=document.createElement('p');p.textContent='バーコードID：'+old.barcode;form.append(p);}const grid=document.createElement('div');grid.className='form-grid';const title=addField(grid,'教材名（必須）','material_title',old?.title);title.required=true;title.maxLength=120;const sl=document.createElement('label');sl.className='field';sl.textContent='教科';const subject=document.createElement('select');subject.name='material_subject';subject.innerHTML=options(subjects(),old?.subject||'','指定なし');sl.append(subject);grid.append(sl);addField(grid,'出版社','material_publisher',old?.publisher).maxLength=200;const order=addField(grid,'表示順','material_order',old?.sortOrder,'number');order.min='0';order.max='1000000';order.step='1';form.append(grid);const group=document.createElement('fieldset');const legend=document.createElement('legend');legend.textContent='対象学年（選ばない場合は全学年）';group.append(legend);const tags=document.createElement('div');tags.className='tagrow';for(const grade of grades()){const label=document.createElement('label');label.className='chipcheck';const check=document.createElement('input');check.type='checkbox';check.name='material_grades';check.value=grade;check.checked=old?.grades?.includes(grade)||false;label.append(check,document.createTextNode(grade));tags.append(label);}group.append(tags);form.append(group);addField(form,'属性（任意・読点で区切る）','material_attributes',(old?.attributes||[]).join('、')).maxLength=160;const notes=addField(form,'備考','material_notes',old?.notes,'textarea');notes.maxLength=2000;notes.rows=3;const activeLabel=document.createElement('label');activeLabel.className='checkline';const show=document.createElement('input');show.type='checkbox';show.checked=old?.active!==false;activeLabel.append(show,document.createTextNode('授業の選択候補に表示する'));if(old?.active===false)form.append(activeLabel);const save=document.createElement('button');save.className='btn primary';save.type='submit';save.textContent='保存';form.append(save);box.body.append(form);box.status.textContent='';let saving=false,attempt=null;box.d.addEventListener('cancel',e=>{if(saving)e.preventDefault();});form.onsubmit=async event=>{event.preventDefault();if(saving||box.closed||!form.reportValidity())return;saving=true;save.disabled=true;box.close.disabled=true;box.status.textContent='共有DBに保存しています…';try{await flush();if(box.closed)return;const f=new FormData(form),row={...(old?{id:old.id,barcode:old.barcode}:{}),title:text(f.get('material_title')).trim(),subject:text(f.get('material_subject')),grades:f.getAll('material_grades'),publisher:text(f.get('material_publisher')),sortOrder:f.get('material_order')===''?null:Number(f.get('material_order')),notes:text(f.get('material_notes')),attributes:text(f.get('material_attributes')).split(/[、,]/).map(s=>s.trim()).filter(Boolean)};if(old?.active===false)row.active=show.checked;const rows=[row],payload=JSON.stringify(rows);if(attempt&&attempt.payload!==payload)throw Error('前の保存結果を確認できていません。入力を控えて閉じ、最新の一覧に更新してから編集してください。');if(!attempt){const expected=await currentRevision(old);if(box.closed)return;const preview=await ManabiAuth.api('materials/preview','POST',{mode:'upsert',rows});if(preview.errors?.length)throw Error(preview.errors.map(e=>e.message).join('／'));if(preview.expected_revision!==expected)throw Error('共有データが更新されました。入力を保持したまま、もう一度保存してください。');attempt={rows,expected,requestId:crypto.randomUUID(),payload};}await commit('upsert',attempt.rows,attempt.expected,attempt.requestId,()=>box.closed);box.d.close();toast('教材を保存しました。');}catch(error){if([400,401,403,409].includes(error.status))attempt=null;box.status.textContent=error.message+(attempt&&!error.status?' 入力を変えずに「保存」をもう一度押すと、保存結果を確認できます。':'');}finally{saving=false;save.disabled=false;box.close.disabled=false;}};title.focus();}catch(error){if(!box.closed)box.status.textContent=error.message;}}
 async function archiveItem(id){if(!manager())return;const old=all().find(b=>b.id===id);if(!old||old.active===false)return;const box=dialog('教材の削除を確認');const p=document.createElement('p');p.textContent='「'+old.title+'」を現行の教材一覧から除外します。過去の授業記録とバーコードIDは残ります。';box.body.append(p);const save=document.createElement('button');save.className='btn primary';save.type='button';save.textContent='削除する';box.footer.prepend(save);let saving=false,attempt=null;box.d.addEventListener('cancel',e=>{if(saving)e.preventDefault();});save.onclick=async()=>{if(saving||box.closed)return;saving=true;save.disabled=true;box.close.disabled=true;box.status.textContent='共有DBに保存しています…';try{await flush();if(box.closed)return;if(!attempt)attempt={expected:await currentRevision(old),requestId:crypto.randomUUID()};await commit('archive',[{barcode:old.barcode}],attempt.expected,attempt.requestId,()=>box.closed);ui.selected.delete(id);box.d.close();toast('教材を一覧から除外しました。');}catch(error){if([400,401,403,409].includes(error.status))attempt=null;box.status.textContent=error.message+(attempt&&!error.status?' もう一度「削除する」を押すと保存結果を確認できます。':'');}finally{saving=false;save.disabled=false;box.close.disabled=false;}};}
 function csvTable(rows,newCodes=[]){const fresh=new Set(newCodes.map(r=>r.barcode));return '<div class="tablewrap"><table><thead><tr><th>バーコードID</th><th>教材名</th><th>教科・学年</th><th>出版社</th><th>表示順</th><th>備考</th></tr></thead><tbody>'+rows.map(r=>'<tr><td>'+esc(r.barcode||'未発行')+(fresh.has(r.barcode)?'<span class="badge">新規発行</span>':'')+'</td><td>'+esc(r.title)+'</td><td>'+esc(r.subject)+'<br>'+esc((r.grades||[]).join('・'))+'</td><td>'+esc(r.publisher)+'</td><td>'+esc(r.sortOrder??'')+'</td><td>'+esc(r.notes)+'</td></tr>').join('')+'</tbody></table></div>';}
 async function importText(value){if(!manager())return;const box=dialog('CSV更新内容の確認');box.d.classList.add('materials-wide-dialog');const parsed=csv().parseCSV(value);let preview=null,requestId=null,busy=false;const intro=document.createElement('p');intro.textContent='CSVにない教材は現行一覧から除外されます。過去の授業記録は残ります。';const counts=document.createElement('div');counts.className='materials-counts';const table=document.createElement('div');const errors=document.createElement('div');errors.setAttribute('role','alert');box.body.append(intro,counts,errors,table);const execute=document.createElement('button');execute.type='button';execute.className='btn primary';execute.textContent='全件上書き実行';execute.disabled=true;const retry=document.createElement('button');retry.type='button';retry.className='btn';retry.textContent='更新内容を再確認';box.footer.prepend(execute,retry);function display(data){const c=data.counts||{};counts.innerHTML=[['CSV総件数',parsed.total],['新規登録',c.created??0],['更新',c.updated??0],['変更なし',c.unchanged??0],['一覧から除外',c.archived??0],['エラー',data.errors?.length||0]].map(([k,v])=>'<span>'+k+' <b>'+v+'</b></span>').join('');errors.replaceChildren();for(const error of data.errors||[]){const p=document.createElement('p');p.textContent=(error.row?'行 '+error.row+'：':'')+error.message;errors.append(p);}table.innerHTML=csvTable(data.rows||parsed.rows,data.new_codes||[]);execute.disabled=!!data.errors?.length||!data.rows?.length;}
 async function prepare(){if(busy||box.closed)return;busy=true;execute.disabled=true;retry.disabled=true;box.status.textContent='更新内容を確認しています…';try{guard();if(parsed.errors.length){display({errors:parsed.errors,rows:parsed.rows});box.status.textContent='CSVを修正して取り込み直してください。';return;}await flush();if(box.closed)return;preview=await ManabiAuth.api('materials/preview','POST',{mode:'replace',rows:parsed.rows});if(box.closed)return;guard();display(preview);requestId=crypto.randomUUID();box.status.textContent=preview.errors?.length?'エラーがあるため更新できません。':'内容を確認してから「全件上書き実行」を押してください。';}catch(error){if(!box.closed)box.status.textContent=error.message;}finally{busy=false;retry.disabled=false;}}
 retry.onclick=()=>void prepare();box.d.addEventListener('cancel',e=>{if(busy&&box.close.disabled)e.preventDefault();});execute.onclick=async()=>{if(busy||box.closed||!preview||preview.errors?.length)return;busy=true;execute.disabled=true;retry.disabled=true;box.close.disabled=true;box.status.textContent='共有DBに全件保存しています…';try{await commit('replace',parsed.rows,preview.expected_revision,requestId,()=>box.closed);box.d.close();toast('教材マスターをCSVの内容に更新しました。');}catch(error){box.status.textContent=error.status===409?'共有データが更新されました。「更新内容を再確認」で差分を確認し直してください。':error.message;execute.disabled=error.status===409;}finally{busy=false;retry.disabled=false;box.close.disabled=false;}};await prepare();return box;}
 async function chooseFile(){if(!manager())return;const input=document.createElement('input');input.type='file';input.accept='.csv,text/csv';input.onchange=async()=>{const file=input.files?.[0];if(!file)return;if(file.size>4*1024*1024){toast('CSVは4MB以内で選択してください。');return;}try{await importText(await file.text());}catch(error){toast(error.message);}};input.click();}
 async function exportAll(){if(!manager())return;await load();if(ui.error){toast(ui.error);return;}const blob=new Blob([csv().exportCSV(active().sort(compare))],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='教材マスター_'+new Date().toISOString().slice(0,10)+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 function printItems(items){if(DebugContext.locked)return;items=items.filter(b=>b.active!==false).sort(compare);if(!items.length){toast('印刷する教材を選んでください。');return;}if(items.some(b=>!/^MAT-\d{6,9}$/.test(b.barcode||''))){toast('バーコードIDを確認できません。最新の一覧に更新してください。');return;}const box=dialog('教材バーコード印刷プレビュー');box.d.classList.add('materials-wide-dialog');const note=document.createElement('p');note.textContent=items.length+'件／A4・倍率100%で印刷してください。PDFは印刷画面の保存先から選べます。';const preview=document.createElement('div');preview.className='materials-print-preview';const groups=[];let page=[],height=0;for(let i=0;i<items.length;i+=3){const row=items.slice(i,i+3),rowHeight=Math.max(...row.map(b=>Math.max(114,90+Math.ceil([...b.title].reduce((n,c)=>n+(c.charCodeAt(0)>255?1:.6),0)/19)*13+Math.ceil((b.grades||[]).join('・').length/22)*10)));if(page.length&&(page.length>=21||height+rowHeight+7>925)){groups.push(page);page=[];height=0;}page.push(...row);height+=rowHeight+7;}if(page.length)groups.push(page);const pages=[];for(let pageIndex=0;pageIndex<groups.length;pageIndex++){pages.push('<section class="report-page scan-label-page material-card-page"><div class="row between mb"><h2>教材バーコード</h2><span class="small muted">'+(pageIndex+1)+' / '+groups.length+'</span></div><div class="scan-label-grid">'+groups[pageIndex].map(b=>'<div class="scan-label material-scan-label"><div class="scan-small"><span>'+esc(b.subject||'教材')+'</span><span>'+esc((b.grades||[]).map(g=>typeof shortGrade==='function'?shortGrade(g):g).join('・')||'全学年')+'</span></div><div class="material-label-name">'+esc(b.title)+'</div>'+barcodeSVG(b.barcode,true)+'<div class="scan-code">'+esc(b.barcode)+'</div></div>').join('')+'</div></section>');}preview.innerHTML=pages.join('');box.body.append(note,preview);const print=document.createElement('button');print.type='button';print.className='btn primary';print.textContent='A4印刷・PDF保存';print.onclick=()=>{if(box.closed||DebugContext.locked)return;const root=document.getElementById('print-root');root.replaceChildren(...[...preview.children].map(node=>node.cloneNode(true)));try{window.print();}catch{root.replaceChildren();box.status.textContent='印刷画面を開けませんでした。もう一度押してください。';}};box.footer.prepend(print);box.d.addEventListener('close',()=>document.querySelectorAll('#print-root .material-card-page').forEach(n=>n.remove()));return box;}
 document.addEventListener('input',event=>{const f=event.target.closest('.manabi-materials [data-mm-filter="q"]');if(f){ui.q=f.value;paint();}});
 document.addEventListener('change',event=>{const target=event.target;if(!target.closest('.manabi-materials'))return;if(target.dataset.mmFilter){ui[target.dataset.mmFilter]=target.type==='checkbox'?target.checked:target.value;paint();}else if(target.hasAttribute('data-mm-select-filtered')){for(const b of filtered().filter(b=>b.active!==false))target.checked?ui.selected.add(b.id):ui.selected.delete(b.id);paint();}else if(target.dataset.mmSelect){target.checked?ui.selected.add(target.dataset.mmSelect):ui.selected.delete(target.dataset.mmSelect);paint();}});
 document.addEventListener('click',event=>{const b=event.target.closest('.manabi-materials [data-mm-action]');if(!b||DebugContext.locked)return;const id=b.dataset.mmId;switch(b.dataset.mmAction){case 'new':void editItem('');break;case 'edit':void editItem(id);break;case 'archive':void archiveItem(id);break;case 'reload':void load();break;case 'import':void chooseFile();break;case 'export':void exportAll();break;case 'print-all':printItems(active());break;case 'print-filtered':printItems(filtered());break;case 'print-selected':printItems(active().filter(x=>ui.selected.has(x.id)));break;case 'print-one':printItems(active().filter(x=>x.id===id));break;}});
 window.addEventListener('afterprint',()=>document.querySelectorAll('#print-root .material-card-page').forEach(n=>n.remove()));
 window.ManabiMaterialsManager={load,importText,print:ids=>printItems(active().filter(b=>ids.includes(b.id)))};
})();
