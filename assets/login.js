var ManabiScan = (() => {
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

  // shared/scan.mjs
  var scan_exports = {};
  __export(scan_exports, {
    codeKind: () => codeKind,
    compactProduct: () => compactProduct,
    createScanGate: () => createScanGate,
    decodeASCII: () => decodeASCII,
    isComposing: () => isComposing,
    isStaffCredential: () => isStaffCredential,
    isTerminator: () => isTerminator,
    isbn13: () => isbn13,
    looksLikeScan: () => looksLikeScan,
    normalizeScan: () => normalizeScan,
    resolveScan: () => resolveScan,
    scanCandidates: () => scanCandidates,
    staffCredential: () => staffCredential,
    stripStudentPrefix: () => stripStudentPrefix,
    validGTIN: () => validGTIN,
    validISBN: () => validISBN
  });
  var normalizeScan = (value) => String(value ?? "").normalize("NFKC").trim().replace(/^\][A-Za-z][0-9]/, "").replace(/^\*([^*]+)\*$/, "$1").replace(/[‐‑‒–—−]/g, "-").trim().toUpperCase();
  var isStaffCredential = (value) => /^(?:TL-[A-F0-9]{48}|91[0-9]{30})$/.test(normalizeScan(value));
  function codeKind(value) {
    const code = normalizeScan(value);
    if (/^LLLD[:-](?:STUDENT[:-])?/.test(code) || /^D-\d+$/.test(code)) return "student";
    if (/^MAT-/.test(code)) return "material";
    if (/^TL-/.test(code) || /^91[0-9]{30}$/.test(code)) return "credential";
    return null;
  }
  var stripStudentPrefix = (value) => normalizeScan(value).replace(/^LLLD[:-]STUDENT[:-]/, "").replace(/^LLLD[:-]/, "");
  var compactProduct = (value) => normalizeScan(value).replace(/^(?:ISBN(?:-1[03])?|JAN)\s*:?\s*/, "").replace(/[ -]/g, "");
  function validGTIN(value) {
    const code = String(value);
    if (!/^(?:\d{8}|\d{13})$/.test(code)) return false;
    let sum = 0;
    for (let i = code.length - 2, weight = 3; i >= 0; i--, weight = 4 - weight) sum += Number(code[i]) * weight;
    return (10 - sum % 10) % 10 === Number(code.at(-1));
  }
  function validISBN(value) {
    const code = compactProduct(value);
    if (/^97[89]\d{10}$/.test(code)) return validGTIN(code);
    if (!/^\d{9}[0-9X]$/.test(code)) return false;
    return [...code].reduce((sum, c, i) => sum + (c === "X" ? 10 : Number(c)) * (10 - i), 0) % 11 === 0;
  }
  function isbn13(value) {
    const code = compactProduct(value);
    if (!validISBN(code)) return "";
    if (code.length === 13) return code;
    const body = "978" + code.slice(0, 9), sum = [...body].reduce((n, c, i) => n + Number(c) * (i % 2 ? 3 : 1), 0);
    return body + (10 - sum % 10) % 10;
  }
  function decodeASCII(value, { credential = false } = {}) {
    const code = normalizeScan(value);
    if (!/^\d{6,600}$/.test(code) || code.length % 3 || validGTIN(code) || validISBN(code)) return "";
    const numbers = code.match(/.../g).map(Number);
    if (numbers.some((n) => n < 32 || n > 126)) return "";
    const decoded = normalizeScan(String.fromCharCode(...numbers));
    if (credential && isStaffCredential(decoded)) return decoded;
    return /^[A-Z0-9][A-Z0-9._:/-]{1,199}$/.test(decoded) && /[A-Z]/.test(decoded) ? decoded : "";
  }
  function scanCandidates(value, { kind } = {}) {
    const raw = normalizeScan(value), decoded = decodeASCII(raw, { credential: kind === "credential" });
    return [...new Set([raw, decoded].filter(Boolean))];
  }
  function staffCredential(value) {
    const raw = normalizeScan(value);
    if (isStaffCredential(raw)) return raw;
    const decoded = decodeASCII(raw, { credential: true });
    return isStaffCredential(decoded) ? decoded : "";
  }
  var defaultKeys = { student: ["code", "id"], teacher: ["id", "login_id", "loginId"], material: ["barcode", "id", "isbn", "jan"] };
  function aliases(item, kind, keys) {
    return [...new Set(keys.flatMap((key) => {
      const value = item?.[key];
      if (value === void 0 || value === null) return [];
      const code = kind === "student" ? stripStudentPrefix(value) : normalizeScan(value);
      if (key === "isbn") return [code, compactProduct(code), isbn13(code)].filter(Boolean);
      if (key === "jan") return [code, compactProduct(code)];
      return [code];
    }))];
  }
  function resolveScan(value, { kind, items = [], keys = defaultKeys[kind] || ["id"] } = {}) {
    const raw = normalizeScan(value);
    if (!raw) return { status: "empty", matches: [], raw, code: raw };
    for (const [index, candidate] of scanCandidates(raw, { kind }).entries()) {
      const declared = codeKind(candidate);
      if (declared && declared !== kind) return { status: "wrong_kind", matches: [], raw, code: candidate };
      const code2 = kind === "student" ? stripStudentPrefix(candidate) : candidate;
      let matches = items.filter((item) => keys.some((key) => (kind === "student" ? stripStudentPrefix(item?.[key]) : normalizeScan(item?.[key])) === code2));
      if (!matches.length && kind === "material") {
        const product = compactProduct(code2);
        if (validGTIN(product) || validISBN(product)) matches = items.filter((item) => aliases(item, kind, keys).some((v) => v === product || validISBN(product) && v === isbn13(product)));
      }
      if (matches.length) return { status: matches.length === 1 ? "found" : "ambiguous", matches, raw, code: code2, source: index ? "ascii" : "direct" };
    }
    const code = scanCandidates(raw, { kind }).at(-1) || raw;
    return { status: "not_found", matches: [], raw, code };
  }
  function looksLikeScan(value, kind) {
    const code = normalizeScan(value);
    return !!codeKind(code) || !!decodeASCII(code, { credential: kind === "credential" }) || /^\d{3,}$/.test(code) || kind === "material" && /^(?:ISBN|JAN)\b/.test(code);
  }
  var isComposing = (event) => !!(event.isComposing || event.keyCode === 229);
  var isTerminator = (event) => !isComposing(event) && !event.ctrlKey && !event.metaKey && !event.altKey && ["Enter", "Tab"].includes(event.key);
  function createScanGate({ now = () => Date.now(), windowMs = 650 } = {}) {
    const states = /* @__PURE__ */ new WeakMap();
    return { accept(target, value) {
      const code = normalizeScan(value), previous = states.get(target), time = now();
      if (previous?.code === code && time - previous.time < windowMs) return false;
      states.set(target, { code, time });
      return true;
    }, clear(target) {
      states.delete(target);
    } };
  }
  return __toCommonJS(scan_exports);
})();

(()=>{
 const auth=window.ManabiAuth,status=document.getElementById('login-status'),staffForm=document.getElementById('staff-form'),passwordForm=document.getElementById('staff-password-form');
 const scan=staffForm.elements.barcode,panel=document.getElementById('staff-panel');
 let method='barcode',staffBusy=false;
 const say=message=>{status.textContent=message;};
 const normalizeBarcode=value=>ManabiScan.staffCredential(value)||ManabiScan.normalizeScan(value);
 const scanGate=ManabiScan.createScanGate();
 function selectID(value){const id=ManabiScan.decodeASCII(value)||ManabiScan.normalizeScan(value);if(!/^[A-Z0-9_-]{2,40}$/.test(id)||/^(MAT-|TL-|D-)/.test(id))return false;selectMethod('password');passwordForm.elements.login_id.value=id.toLowerCase();passwordForm.elements.password.focus();say('講師IDを入力しました。パスワードを入力してください。');return true;}
 function selectMethod(next){
  if(staffBusy)return;
  method=next;staffForm.hidden=method!=='barcode';passwordForm.hidden=method!=='password';scan.value='';passwordForm.elements.password.value='';
  for(const m of ['password','barcode'])document.getElementById('method-'+m).setAttribute('aria-pressed',String(m===method));
  say('');(method==='barcode'?scan:passwordForm.elements.login_id).focus();
 }
 for(const m of ['password','barcode'])document.getElementById('method-'+m).onclick=()=>selectMethod(m);
 async function proceed(){
  const me=await auth.api('me');
  if(me.staff_required){auth.clearStaff();panel.hidden=false;selectMethod(method);return;}
  location.replace('./app.html');
 }
 async function loginStaff(body){
  if(staffBusy)return;
  staffBusy=true;
  for(const b of panel.querySelectorAll('button'))b.disabled=true;
  say('ログインしています…');
  try{const result=await auth.api('staff/login','POST',body);scan.value='';passwordForm.elements.password.value='';auth.setStaffToken(result.token);await proceed();}
  catch(error){scanGate.clear(scan);scan.value='';passwordForm.elements.password.value='';say(error.message);if(method==='barcode')scan.focus();}
  finally{staffBusy=false;for(const b of panel.querySelectorAll('button'))b.disabled=false;}
 }
 const isStaffBarcode=value=>/^(?:TL-[A-F0-9]{48}|91[0-9]{30})$/.test(value);
 const rejectBarcode=()=>{scan.value='';say('講師用のバーコードを読み取ってください。生徒・教材のコードは使えません。');scan.focus();};
 staffForm.onsubmit=event=>{event.preventDefault();const barcode=normalizeBarcode(scan.value);if(!isStaffBarcode(barcode)){if(!selectID(scan.value))rejectBarcode();return;}if(!scanGate.accept(scan,barcode))return;return loginStaff({barcode});};
 // Readers with or without an Enter suffix and pasted card numbers use the same path.
 scan.addEventListener('input',event=>{if(event.isComposing)return;const barcode=normalizeBarcode(scan.value);if(!panel.hidden&&method==='barcode'){if(/^MAT-[0-9]{6,}$/.test(barcode))rejectBarcode();else if(isStaffBarcode(barcode)&&scanGate.accept(scan,barcode))void loginStaff({barcode});}});
 scan.addEventListener('keydown',event=>{if(!event.isComposing&&event.keyCode!==229&&(event.key==='Enter'||event.key==='Tab'&&scan.value.trim())){event.preventDefault();void staffForm.onsubmit(event);}});
 passwordForm.onsubmit=event=>{event.preventDefault();if(/^MAT-/i.test(passwordForm.elements.login_id.value.normalize('NFKC').trim())){passwordForm.elements.password.value='';say('教材バーコードは講師IDとして使えません。講師IDを入力してください。');return;}return loginStaff({method:'password',login_id:passwordForm.elements.login_id.value,password:passwordForm.elements.password.value});};
 document.getElementById('forgot').onclick=()=>say('パスワードの再設定は代表へ依頼してください。');
 selectMethod(method);
 auth.session().then(proceed).catch(error=>{if(error.status!==401)say(error.message);});
})();
