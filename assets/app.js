
'use strict';
const KEY='llld_manabi_mock_v9_local_demo', TODAY=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const SUBJECTS=['数学','英語','国語','算数','理科','社会'];
const AXES=['理解する力','整理する力','考える力','伝える力','振り返る力','自分で進める力'];
const AXIS_DESC=['言葉・式の意味や、物事のつながりを捉える','条件を抜き出し、表・図・メモに整理する','解き方を選び、理由を考えて取り組む','考えを言葉・式・図で説明する','間違いの原因を確認し、修正する','次にすることを考え、必要に応じて質問する'];
const LEVELS={'4':'自力で説明・応用もできる','3':'基本問題は自力で解ける','2':'ヒントがあれば解ける','1':'解説後も自力で解けない','':'確認できていない'};
const STUMBLES=['知識不足','考え方・理解','計算ミス','問題文の読み取り','時間配分','その他'];
const TAGS=['条件を整理した','図・表で確認した','理由を説明した','間違いを修正した','自分から質問した','別の解き方を試した','前回の学習を使えた','計算が正確だった','粘り強く取り組んだ','自分で学習を進めた'];
const ICONS={profile:'<path d="M12 3 21 8v10l-9 5-9-5V8Z"/><path d="m12 7 5 3-1 7-6 2-4-7Z"/>',history:'<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M8 3v4m8-4v4M4 11h16M8 15h3m3 0h2m-8 3h3"/>',daily:'<path d="M14 20h7v-2a4 4 0 0 0-4-4m-8-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9v-3a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v3M17 4a4 4 0 0 1 0 8"/>',reports:'<path d="M6 9V3h12v6M6 18H3V9h18v9h-3"/><path d="M6 14h12v8H6zM17 11h1"/>',audit:'<path d="M5 4h14v18H5zM9 2h6v4H9zM8 10h8m-8 4h8m-8 4h5"/>',settings:'<path d="m10 3-.7 3-3 1-.8 3L3 12l2.5 2 1 3 3 1 .5 3h4l.5-3 3-1 1-3 2.5-2-2.5-2-1-3-3-1-.7-3Z"/><circle cx="12" cy="12" r="3"/>',plus:'<path d="M12 5v14M5 12h14"/>',search:'<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',arrow:'<path d="M5 12h14m-5-5 5 5-5 5"/>',edit:'<path d="m4 16 12-12 4 4L8 20H4zM14 6l4 4"/>',check:'<path d="m4 12 5 5L20 6"/>',compare:'<rect x="3" y="4" width="7" height="16" rx="1"/><rect x="14" y="4" width="7" height="16" rx="1"/>'};
const icon=k=>'<span class="icon"><svg viewBox="0 0 24 24">'+(ICONS[k]||ICONS.profile)+'</svg></span>';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=prefix=>prefix+'_'+(window.crypto&&crypto.randomUUID?crypto.randomUUID():Date.now()+'_'+Math.random().toString(36).slice(2));
const fmt=d=>d?d.substring(0,10).replace(/-/g,'/'):'—';
const now=()=>new Date().toISOString();
const localDate=()=>{let d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const stamp=x=>{try{return new Intl.DateTimeFormat('ja-JP',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}).format(new Date(x))}catch(e){return x||''}};
const stampDate=x=>{try{return new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Tokyo'}).format(new Date(x))}catch(e){return ''}};
function seed(){
 const students=[{id:'s1',name:'生徒 A',grade:'中学2年',school:'仁保教室',code:'D-001',subjects:['数学','英語']},{id:'s2',name:'生徒 B',grade:'中学3年',school:'広島大州教室',code:'D-002',subjects:['数学','英語']},{id:'s3',name:'生徒 C',grade:'小学6年',school:'仁保教室',code:'D-003',subjects:['算数','国語']},{id:'s4',name:'生徒 D',grade:'中学1年',school:'広島大州教室',code:'D-004',subjects:['数学','国語']}];
 let lessons=[];let no=0;
 const weeks=['2026-05-12','2026-06-09','2026-07-14','2026-08-18','2026-09-08','2026-10-06','2026-10-20','2026-11-03','2026-11-10','2026-11-17'];
 students.forEach((s,si)=>s.subjects.forEach((sub,sj)=>weeks.forEach((date,i)=>{
  let math=sub==='数学'||sub==='算数';let unit=math?(sub==='算数'?'割合':i<4?'文字式':i<9?'連立方程式':'一次関数'):(sub==='英語'?(i<8?'一般動詞':'接続詞'):'説明文の読み取り');
  let obs=math?'問題の条件を表に整理してから取り組んだ。確認の声かけにより、式と数値の対応を修正できた。':sub==='英語'?'文のまとまりを確認し、語順を自分の言葉で説明できた。単語の意味は一部確認が必要だった。':'接続語に着目して段落の関係を整理した。根拠となる文を本文から探して示せた。';
  let tags=math?['条件を整理した','間違いを修正した']:sub==='英語'?['理由を説明した']:['条件を整理した','理由を説明した'];
  let level=i%4===0?2:3;let next=math?'条件を整理する手順を確認し、ヒントを減らして類題に取り組む。':sub==='英語'?'短文の語順を確認し、単語を変えた例文を自力で作れるか確認する。':'接続語と根拠の文をもとに、段落の要点を短く説明する。';
  if(s.id==='s1'&&sub==='数学'&&date==='2026-11-17'){obs='変化の割合を求める際に、xとyの増加量を混同していた。表から確認すると理解が進んだ。';tags=['図・表で確認した'];level=2;next='表から変化の割合を求める練習';}
  if(s.id==='s1'&&sub==='数学'&&date==='2026-11-10'){obs='表の条件を自力で整理した。途中で誤りに気づいて修正し、次の類題にも取り組んだ。考え方の説明には講師の問いかけが必要だった。';tags=['条件を整理した','間違いを修正した','自分で学習を進めた'];}
  const id='l'+(++no);let status=date==='2026-11-17'?(si===0?'報告済み':si===1&&sj===1?'下書き':'確認済み'):'確認済み';
  lessons.push({id,student:s.id,subject:sub,date,slot:si%2?'C':'B',teacher:sj?'講師 B（デモ）':'講師 A（デモ）',unit,material:math?'数学演習（サンプル）':'教科別ワーク（サンプル）',pages:'p.'+(10+i*2)+'〜'+(11+i*2),mode:i%3?'同範囲':'復習',level,stumbles:math?['考え方・理解']:['知識不足'],obs,next,homework:math?'表を使う基本問題3題。わからない箇所に印を付ける。':'授業で扱った範囲の復習と確認問題。',homeworkDone:'実施',tags,correct:null,total:null,internal:'内部連絡のサンプル。保護者用の報告書には掲載しません。',status,createdAt:date+'T11:00:00Z',updatedAt:date+'T12:00:00Z'});
 }))); 
 let policies=[],assessments=[],audit=[];
 students.forEach(s=>{
  policies.push({id:'p_'+s.id+'_all',student:s.id,subject:'全体',text:'できたことを具体的に伝え、本人が次の学習を見通せるようにする。答えだけでなく、どのように考えたかを確認する。',updatedAt:'2026-10-01T05:00:00Z',updatedBy:'教室長（デモ）',version:1});
  s.subjects.forEach((sub,j)=>{
   let text=sub==='数学'||sub==='算数'?'表・図で条件を確認してから式につなげる。解説の直後だけでなく、次回の授業でも自力で取り組めるか確認する。':'本人の言葉で説明する場面を設ける。根拠を確認し、短い課題から自力で取り組む範囲を広げる。';
   policies.push({id:'p_'+s.id+'_'+sub,student:s.id,subject:sub,text,updatedAt:'2026-11-17T11:00:00Z',updatedBy:'講師 A（デモ）',version:2});
   audit.push({id:uid('a'),type:'指導方針',student:s.id,subject:sub,actor:'講師 A（デモ）',at:'2026-11-17T11:00:00Z',label:sub+'の指導方針を直接更新',before:'基本問題を通して理解を確認する。解き方を一つずつ整理する。',after:text});
   [0,1].forEach(p=>{let vals=p?[2,3,2,2,3,3]:[2,2,2,1,2,2];if(j===1)vals=p?[3,3,2,3,2,3]:[2,2,2,2,2,2];if(s.id==='s3')vals=[2,null,2,2,null,2];let d=p?'2026-11-10':'2026-10-06';let rec=lessons.find(l=>l.student===s.id&&l.subject===sub&&l.date===d);assessments.push({id:uid('sk'),student:s.id,subject:sub,date:d,values:vals,evidence:AXES.map((_,i)=>vals[i]===null?'未確認':'演習中の行動を確認した評価例です。数値・根拠とも架空のサンプルです。'),lessonIds:[rec.id],author:'教室長（デモ）',createdAt:d+'T12:00:00Z'});});
  });
 });
 return {version:1,students,lessons,policies,assessments,audit,issued:[],backupTime:'03:00'};
}
let storageOK=true,db;
try{const saved=DebugStorage.getItem(KEY)||DebugStorage.getItem('llld_manabi_mock_v6_exam_qualification')||DebugStorage.getItem('llld_manabi_mock_v5_all_students_ten_lessons');db=saved?JSON.parse(saved):seed();if(db.version!==1||!Array.isArray(db.lessons)||!Array.isArray(db.students))throw Error('invalid');}catch(e){db=seed();}
const state={page:'profile',student:'s1',subject:'数学',actor:'教室長（デモ）',history:{from:'2026-11-01',to:TODAY,subject:'',q:'',sort:'desc'},daily:{from:'2026-11-17',to:'2026-11-17',teacher:'',student:'',subject:'',status:'',sort:'date'},report:{from:'2026-11-01',to:TODAY,subject:'数学',type:'term',students:['s1'],confirmed:false,sort:'date',edits:{}},audit:{type:'',student:'',q:''},compare:{leftFrom:'2026-05-01',leftTo:'2026-05-31',leftSubject:'数学',rightFrom:'2026-11-01',rightTo:TODAY,rightSubject:'数学'}};
function persist(){try{DebugStorage.setItem(KEY,JSON.stringify(db));storageOK=true}catch(e){storageOK=false;toast('保存容量またはブラウザ設定により保存できません。JSONを書き出してください。');}}
function audit(type,student,subject,label,before,after){db.audit.unshift({id:uid('a'),type,student,subject,actor:state.actor,at:now(),label,before,after})}
function toast(text){const el=document.getElementById('toast');el.textContent=text;el.classList.add('show');clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>el.classList.remove('show'),3600)}
function student(id=state.student){return db.students.find(x=>x.id===id)||db.students[0]}
function policy(sub=state.subject,sid=state.student){return db.policies.find(x=>x.student===sid&&x.subject===sub)}
function subjOptions(selected='',all=true,subs=SUBJECTS){return (all?'<option value="">すべての教科</option>':'')+subs.map(s=>`<option ${s===selected?'selected':''}>${esc(s)}</option>`).join('')}
function studentOptions(selected='',all=false){return (all?'<option value="">すべての生徒</option>':'')+db.students.map(s=>`<option value="${s.id}" ${s.id===selected?'selected':''}>${esc(s.name)}｜${s.grade}</option>`).join('')}
function teacherOptions(selected='',all=true){return (all?'<option value="">すべての講師</option>':'')+['講師 A（デモ）','講師 B（デモ）','教室長（デモ）'].map(t=>`<option ${t===selected?'selected':''}>${t}</option>`).join('')}
function goodRange(a,b){return !a||!b||a<=b}
function records(sid=state.student,f=state.history){let ls=db.lessons.filter(x=>(!sid||x.student===sid)&&(!f.from||x.date>=f.from)&&(!f.to||x.date<=f.to)&&(!f.subject||x.subject===f.subject));if(f.q){let q=f.q.toLocaleLowerCase();ls=ls.filter(x=>[x.unit,x.obs,x.next,x.material,x.tags.join(' '),x.homework,x.teacher].join(' ').toLocaleLowerCase().includes(q))}if(f.teacher)ls=ls.filter(x=>x.teacher===f.teacher);if(f.student)ls=ls.filter(x=>x.student===f.student);if(f.status)ls=ls.filter(x=>x.status===f.status);return ls.sort((a,b)=>f.sort==='asc'?a.date.localeCompare(b.date):f.sort==='subject'?a.subject.localeCompare(b.subject,'ja')||b.date.localeCompare(a.date):f.sort==='teacher'?a.teacher.localeCompare(b.teacher,'ja')||b.date.localeCompare(a.date):b.date.localeCompare(a.date)||a.subject.localeCompare(b.subject,'ja'))}
function getAssess(sid,sub,from='',to='9999-99-99'){return db.assessments.filter(x=>x.student===sid&&x.subject===sub&&(!from||x.date>=from)&&x.date<=to).sort((a,b)=>b.date.localeCompare(a.date)||b.createdAt.localeCompare(a.createdAt))[0]}
function statusBadge(s){return `<span class="badge ${s==='確認済み'?'green':s==='報告済み'?'amber':''}">${esc(s)}</span>`}
function navigate(p){state.page=p;render();window.scrollTo({top:0,behavior:'instant'})}
function renderNav(){const navs=[['profile','生徒カルテ'],['history','授業履歴・比較'],['daily','講師別・日別報告'],['reports','報告書・印刷'],['audit','変更ログ'],['settings','運用設定']];document.getElementById('nav').innerHTML=navs.map(([p,n])=>`<button class="navbtn ${state.page===p?'active':''}" onclick="navigate('${p}')">${icon(p)}${n}${p==='daily'?'<span class="count">'+db.lessons.filter(x=>x.status==='報告済み').length+'</span>':''}</button>`).join('')}
function render(){renderNav();const fn={profile:renderProfile,history:renderHistory,daily:renderDaily,reports:renderReports,audit:renderAudit,settings:renderSettings};document.getElementById('content').innerHTML=fn[state.page]();if(state.page==='reports')updateReportPreview();}
function head(title,desc,actions=''){return `<div class="pagehead"><div><div class="eyebrow">MANABI / ${state.page.toUpperCase()}</div><h1>${title}</h1><p>${desc}</p></div><div class="row">${actions}</div></div>`}
function studentbar(){const s=student();return `<div class="card studentbar"><div class="studentid"><div class="avatar">${s.name.slice(-1)}</div><div><div class="studenttitle">${esc(s.name)} <span class="badge">架空データ</span></div><div class="studentmeta">${s.grade} ・ ${s.school} ・ ${s.code}</div></div></div><div class="row"><select class="studentselect" aria-label="表示する生徒" onchange="setStudent(this.value)">${studentOptions(state.student)}</select><div class="segmented">${s.subjects.map(x=>`<button class="${state.subject===x?'on':''}" onclick="setSubject('${x}')">${x}</button>`).join('')}</div></div></div>`}
function setStudent(id){state.student=id;let subs=student().subjects;if(!subs.includes(state.subject))state.subject=subs[0];state.compare.leftSubject=state.subject;state.compare.rightSubject=state.subject;render()}
function setSubject(sub){state.subject=sub;render()}
function radar(values,prev=null,print=false){values=values||Array(6).fill(null);const cx=230,cy=184,r=114;const pt=(i,v)=>{let a=(i*60-90)*Math.PI/180;return [cx+Math.cos(a)*r*v/4,cy+Math.sin(a)*r*v/4]};const pts=(v)=>v.map((n,i)=>pt(i,n).join(',')).join(' ');let out=`<svg class="radar" viewBox="0 0 460 365" role="img" aria-label="${esc(AXES.map((x,i)=>x+' '+(values[i]??'未評価')).join('、'))}">`;
 for(let lv=4;lv>=1;lv--)out+=`<polygon points="${pts(Array(6).fill(lv))}" fill="${lv%2===0?'#f8faf6':'#ffffff'}" stroke="#dce5dc" stroke-width="1"/>`;
 for(let i=0;i<6;i++){let p=pt(i,4);out+=`<line x1="${cx}" y1="${cy}" x2="${p[0]}" y2="${p[1]}" stroke="#e4eae0"/>`;}
 function shape(v,previous){if(!v)return '';let all=v.every(x=>x!==null&&x!==undefined);let color=previous?'#a4b5a7':'#2a7861',s='';if(all)s+=`<polygon points="${pts(v)}" fill="${previous?'none':'#a9d0b7'}" fill-opacity=".32" stroke="${color}" stroke-width="${previous?1.5:2.3}" ${previous?'stroke-dasharray="5 4"':''}/>`;else for(let i=0;i<6;i++){let j=(i+1)%6;if(v[i]!=null&&v[j]!=null){let a=pt(i,v[i]),b=pt(j,v[j]);s+=`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${color}" stroke-width="2"/>`;}}
  v.forEach((n,i)=>{if(n!=null){let p=pt(i,n);s+=`<circle cx="${p[0]}" cy="${p[1]}" r="${previous?2.5:4}" fill="${previous?'white':color}" stroke="${color}" stroke-width="1"/>`;}});return s;}
 out+=shape(prev,true)+shape(values,false);
 for(let lv=1;lv<=4;lv++)out+=`<text x="${cx+7}" y="${cy-r*lv/4+4}" fill="#87968a" font-size="9">${lv}</text>`;
 const pos=[[230,33],[368,108],[369,270],[230,330],[91,270],[90,108]];
 AXES.forEach((n,i)=>out+=`<text x="${pos[i][0]}" y="${pos[i][1]}" text-anchor="middle" fill="#354c3e" font-size="12.5" font-weight="600">${n}</text><text x="${pos[i][0]}" y="${pos[i][1]+18}" text-anchor="middle" fill="${values[i]==null?'#879286':'#2a7861'}" font-size="11">${values[i]==null?'未評価':values[i]+' / 4'}</text>`);
 return out+'</svg>';
}
function renderProfile(){const s=student(),sub=state.subject;let a=getAssess(s.id,sub),prev=a?getAssess(s.id,sub,'',beforeDay(a.date)):null;let ls=records(s.id,{subject:sub,sort:'desc'}),recent=ls[0],month=ls.filter(x=>x.date>='2026-11-01'&&x.date<=TODAY);let pol=policy(),gen=policy('全体');let tagSet=[...new Set(month.flatMap(x=>x.tags))];return head('学びのスキルカルテ','できることと成長を見つけ、次の指導につなげる。',`<button class="btn" onclick="toReports()">${icon('reports')}報告書を作成</button><button class="btn primary" onclick="openLesson()">${icon('plus')}授業を記録</button>`)+studentbar()+`<div class="profilegrid"><section class="card radarcard"><div class="section-title"><div><div class="eyebrow">SKILL PROFILE</div><h2>${sub}で見えた6つの力</h2></div><button class="btn small" onclick="openSkills()">${icon('edit')}評価を編集</button></div><div class="row between"><span class="small muted">${a?'評価日 '+fmt(a.date):'評価はまだありません'}</span><span class="badge green">手動設定・4段階</span></div>${radar(a?.values,prev?.values)}<div class="legend"><span><i class="swatch"></i>今回の評価</span><span><i class="swatch prev"></i>前回 ${prev?fmt(prev.date):'なし'}</span></div><div class="axis-buttons">${AXES.map((x,i)=>`<button class="axisbtn" onclick="showEvidence(${i})"><span>${x}</span><b>${a?.values[i]??'—'} <span class="tiny muted">›</span></b></button>`).join('')}</div><p class="tiny muted mt">点数・単元の到達度とは別の評価です。未評価は0点にせず、根拠と評価日を残します。</p></section><div class="stack"><section class="card"><div class="section-title"><div><div class="eyebrow">TEACHING POLICY</div><h2>この子の指導方針</h2></div><button class="btn small" onclick="openPolicy()">${icon('edit')}直接編集</button></div><div class="policy-box"><div class="policy-label">全体の方針</div><div class="policy-text">${esc(gen?.text||'未設定')}</div></div><div class="policy-box"><div class="policy-label">${sub}の方針</div><div class="policy-text">${esc(pol?.text||'未設定')}</div><div class="policy-meta">${pol?stamp(pol.updatedAt)+' ／ '+esc(pol.updatedBy)+' ／ v'+pol.version:''}</div></div><div class="divider"></div><div class="policy-label">次回の取り組み</div><p class="small preline">${esc(recent?.next||'授業記録を入力すると表示されます。')}</p><div class="row between mt"><span class="tiny muted">更新すると変更前後をログに保存</span><button class="btn text" onclick="showPolicyHistory()">変更履歴を見る ›</button></div></section><section class="card"><div class="section-title"><div><div class="eyebrow">GOOD DISCOVERIES</div><h2>授業で見つけた、いいところ</h2></div><span class="badge">今月</span></div><div class="tagrow">${tagSet.map(x=>`<span class="pill">${esc(x)}</span>`).join('')||'<span class="small muted">まだ記録がありません</span>'}</div>${recent?`<div class="strength-item"><div>${esc(recent.obs)}</div><div class="date">${fmt(recent.date)} ・ ${sub} ・ ${recent.teacher}</div></div>`:''}<p class="tiny muted mt">一度の所見から性格や得意な学び方を断定せず、具体的な場面を残します。</p></section></div></div><div class="metrics"><div class="metric"><small>今月の${sub}の授業</small><div class="num">${month.length}<span>回</span></div></div><div class="metric"><small>今回の到達度</small><div class="num">${recent?.level??'—'}<span>/ 4</span></div><small>${recent?LEVELS[String(recent.level??'')]:''}</small></div><div class="metric"><small>確認できた良さ</small><div class="num">${tagSet.length}<span>種類</span></div></div><div class="metric"><small>教室長の確認待ち</small><div class="num">${month.filter(x=>x.status==='報告済み').length}<span>件</span></div><small>日々の口頭報告も継続</small></div></div><section class="card"><div class="section-title"><div><div class="eyebrow">RECENT LESSONS</div><h2>直近の授業を、続けて見る</h2></div><button class="btn" onclick="state.history.subject=state.subject;navigate('history')">${icon('history')}すべての履歴</button></div>${ls.slice(0,3).map(x=>lessonCard(x)).join('')}</section>`}
function beforeDay(d){let t=new Date(d+'T12:00:00Z');t.setUTCDate(t.getUTCDate()-1);return t.toISOString().slice(0,10)}
function lessonCard(l,opts={}){let s=student(l.student);return `<article class="lesson" data-id="${l.id}"><div class="lesson-head"><div class="row"><span class="lesson-date">${fmt(l.date)} <span class="muted small">${l.slot}コマ</span></span><span class="badge blue">${l.subject}</span>${opts.showStudent?`<b class="small">${esc(s.name)}</b>`:''}<span class="small muted">${esc(l.teacher)}</span></div><div class="row">${statusBadge(l.status)}<span class="level">${l.level==null?'未評価':'到達度 '+l.level+' / 4'}</span></div></div><div class="lesson-unit">${esc(l.unit)} <span class="small muted" style="font-weight:400">${esc(l.material)} ${esc(l.pages)}</span></div><div class="lesson-body"><div><div class="label">できたこと・支援の効果・気づき</div><p class="preline">${esc(l.obs)}</p></div><div><div class="label">次回の取り組み</div><p class="preline">${esc(l.next)}</p></div></div><div class="lesson-foot"><div class="tagrow">${l.tags.map(x=>`<span class="pill">${esc(x)}</span>`).join('')}</div><div class="row"><button class="btn text small" onclick="showContext('${l.id}')">前後の授業</button><button class="btn text small" onclick="openLesson('${l.id}')">詳細・編集 ›</button></div></div></article>`}
function historyFilters(){let f=state.history;return `<div class="card"><div class="toolbar"><label class="field">開始日<input type="date" value="${f.from}" onchange="setHistory('from',this.value)"></label><label class="field">終了日<input type="date" value="${f.to}" onchange="setHistory('to',this.value)"></label><label class="field">教科で絞り込む<select onchange="setHistory('subject',this.value)">${subjOptions(f.subject,true,student().subjects)}</select></label><label class="field">並べ方<select onchange="setHistory('sort',this.value)"><option value="desc" ${f.sort==='desc'?'selected':''}>新しい順</option><option value="asc" ${f.sort==='asc'?'selected':''}>古い順</option><option value="subject" ${f.sort==='subject'?'selected':''}>教科別 → 新しい順</option></select></label><label class="field">単元・所見・教材から検索<input type="search" id="history-q" value="${esc(f.q)}" placeholder="例：変化の割合、表、説明" oninput="setHistory('q',this.value,true)"></label></div><div class="quickbar"><span>すぐ移動</span><button onclick="quickRange('month')">今月</button><button onclick="quickRange('halfmonth')">半年前の月</button><button onclick="quickRange('halfyear')">直近6か月</button><button onclick="quickRange('all')">全期間</button><input class="monthjump" aria-label="年月へ移動" type="month" onchange="jumpMonth(this.value)"><span>期間・教科を引き継いで印刷できます。</span></div><div id="range-error" class="tiny" style="color:var(--red)">${goodRange(f.from,f.to)?'':'開始日は終了日以前にしてください。'}</div></div>`}
function setHistory(k,v,partial=false){state.history[k]=v;if(partial){document.getElementById('history-results').innerHTML=historyResults();return}render()}
function quickRange(kind){let f=state.history;if(kind==='month'){f.from='2026-11-01';f.to=TODAY}else if(kind==='halfmonth'){f.from='2026-05-01';f.to='2026-05-31'}else if(kind==='halfyear'){f.from='2026-05-18';f.to=TODAY}else {f.from='';f.to=''}render()}
function jumpMonth(v){if(!v)return;let [y,m]=v.split('-').map(Number);state.history.from=v+'-01';state.history.to=v+'-'+new Date(y,m,0).getDate();render()}
function historyResults(){let f=state.history;let ls=goodRange(f.from,f.to)?records():[];let prev='';return `<div class="resultbar"><span><b>${ls.length}件</b> ・ ${f.from?fmt(f.from):'開始指定なし'} 〜 ${f.to?fmt(f.to):'終了指定なし'} ${f.subject?' / '+f.subject:''}</span><span>本文を開かずに連続表示</span></div>`+(ls.length?ls.map(l=>{let h='';if(f.sort==='subject'&&prev!==l.subject){h=`<div class="grouphead">${l.subject}</div>`;prev=l.subject}return h+lessonCard(l)}).join(''):'<div class="empty">この条件に合う授業記録はありません。<br><span class="small">日付・教科・検索語を変更してください。</span></div>')}
function renderHistory(){let p=policy(),g=policy('全体');return head('授業履歴・比較','半年前も、前後の流れも。記録を一件ずつ開かずに見渡せます。',`<button class="btn" onclick="openCompare()">${icon('compare')}左右に並べて比較</button><button class="btn primary" onclick="toReports(true)">${icon('reports')}この期間・教科で印刷</button>`)+studentbar()+historyFilters()+`<div class="historylayout mt"><div id="history-results">${historyResults()}</div><aside class="card sticky-policy"><div class="section-title"><h2>現在の指導方針</h2><button class="btn text" onclick="openPolicy()">編集</button></div><div class="policy-label">全体</div><p class="small preline">${esc(g?.text||'未設定')}</p><div class="divider"></div><div class="policy-label">${state.subject}</div><p class="small preline">${esc(p?.text||'未設定')}</p><p class="tiny muted mt">過去の履歴を見ていても、現在の方針はここで確認できます。</p><button class="btn text mt" onclick="showPolicyHistory()">過去の方針も見る ›</button></aside></div>`}
function modal(title,body){let d=document.getElementById('modal');document.getElementById('modal-title').textContent=title;document.getElementById('modal-body').innerHTML=body;if(!d.open)d.showModal();}
function closeModal(){document.getElementById('modal').close()}
function showContext(id){let l=db.lessons.find(x=>x.id===id);let ls=db.lessons.filter(x=>x.student===l.student&&x.subject===l.subject).sort((a,b)=>a.date.localeCompare(b.date));let idx=ls.findIndex(x=>x.id===id);modal('前後の授業｜'+student(l.student).name+'・'+l.subject,`<p class="small muted mb">検索条件にかかわらず、同じ教科の前後の記録を表示します。</p>${ls.slice(Math.max(0,idx-1),idx+2).map(x=>`${x.id===id?'<div class="badge green mb">選択した授業</div>':''}${lessonCard(x)}`).join('')}`)}
function openCompare(){let c=state.compare;modal('左右で比較｜'+student().name,`<p class="small muted mb">期間と教科を左右で別々に選べます。通常の履歴検索の条件は変更しません。</p><div class="comparegrid">${['left','right'].map((k,i)=>`<section class="comparecol"><h3 class="mb">${i?'比較する記録':'以前の記録'}</h3><div class="row"><input type="date" aria-label="${i?'右':'左'}の開始日" value="${c[k+'From']}" onchange="state.compare.${k}From=this.value;refreshCompare()"><input type="date" aria-label="${i?'右':'左'}の終了日" value="${c[k+'To']}" onchange="state.compare.${k}To=this.value;refreshCompare()"><select aria-label="${i?'右':'左'}の教科" onchange="state.compare.${k}Subject=this.value;refreshCompare()">${subjOptions(c[k+'Subject'],true,student().subjects)}</select></div><div class="mt" id="compare-${k}"></div></section>`).join('')}</div>`);document.getElementById('modal').style.width='min(1200px,96vw)';refreshCompare()}
function refreshCompare(){let c=state.compare;['left','right'].forEach(k=>{let from=c[k+'From'],to=c[k+'To'];let ls=goodRange(from,to)?records(state.student,{from,to,subject:c[k+'Subject']}):[];document.getElementById('compare-'+k).innerHTML=ls.length?ls.map(x=>lessonCard(x)).join(''):'<div class="empty">該当する記録はありません</div>';})}
document.getElementById('modal').addEventListener('close',()=>{document.getElementById('modal').style.width='';});
function openPolicy(){let p=policy(),g=policy('全体');modal('指導方針を直接編集',`<p class="small muted mb">講師・教室長が直接更新できます。変更前後・更新者・日時をログに残します。承認申請はありません。</p><form onsubmit="savePolicy(event)"><label class="field">生徒全体の方針<textarea id="policy-all" required rows="4">${esc(g?.text||'')}</textarea></label><label class="field mt">${state.subject}の指導方針<textarea id="policy-sub" required rows="5">${esc(p?.text||'')}</textarea></label><div class="notice info mt">更新者：${state.actor} ／ 指導方針は内部向けです。保護者用報告書への掲載文は別途確認します。</div><div class="formfooter"><button type="button" class="btn" onclick="closeModal()">キャンセル</button><button class="btn primary">保存して反映</button></div></form>`)}
function savePolicy(e){e.preventDefault();let n=0;[['全体','policy-all'],[state.subject,'policy-sub']].forEach(([sub,id])=>{let text=document.getElementById(id).value.trim();if(!text)return;let p=policy(sub);if(!p){p={id:uid('p'),student:state.student,subject:sub,text:'',version:0};db.policies.push(p)}if(p.text!==text){audit('指導方針',state.student,sub,sub+'の指導方針を直接更新',p.text,text);p.text=text;p.version++;p.updatedAt=now();p.updatedBy=state.actor;n++;}});persist();closeModal();render();toast(n?'指導方針を更新し、変更前後を保存しました。':'変更はありません。')}
function showPolicyHistory(){const logs=db.audit.filter(x=>x.type==='指導方針'&&x.student===state.student);modal('指導方針の変更履歴｜'+student().name,logs.length?logs.map(x=>auditCard(x)).join(''):'<div class="empty">変更履歴はありません</div>')}
function showEvidence(i){let a=getAssess(state.student,state.subject);modal(AXES[i]+'｜評価の根拠',`<p class="mb">${AXIS_DESC[i]}</p><div class="notice info">評価：${a?.values[i]==null?'未評価':a.values[i]+' / 4'}　評価日：${a?fmt(a.date):'—'}<br>評価者：${esc(a?.author||'—')}</div><p class="preline mt">${esc(a?.evidence[i]||'評価の根拠はまだ記録されていません。')}</p><h3 class="mt mb">参照した授業</h3>${(a?.lessonIds||[]).map(id=>db.lessons.find(x=>x.id===id)).filter(Boolean).map(x=>lessonCard(x)).join('')||'<p class="small muted">参照授業なし</p>'}`)}
function skillProposals(){let ls=records(state.student,{subject:state.subject,from:'2026-11-01',to:TODAY}).filter(x=>x.status!=='下書き');let p=Array(6).fill(null);let rules=[{i:1,re:/自力で整理|自分で整理/,v:3,reason:'「自力で整理した」という行動記録があるため。'},{i:3,re:/自分の言葉で説明でき/,v:3,reason:'自分の言葉で説明できたという記録があるため。'},{i:4,re:/誤りに気づいて修正/,v:3,reason:'自分で誤りに気づいて修正した記録があるため。'},{i:5,re:/次の類題にも取り組/,v:3,reason:'次の類題へ自分で進めた記録があるため。'}];for(let r of rules){let l=ls.find(x=>r.re.test(x.obs));if(l)p[r.i]={value:r.v,reason:r.reason,lesson:l.id,date:l.date}}return p}
function openSkills(){let a=getAssess(state.student,state.subject);let proposals=skillProposals();window.currentProposals=proposals;window.skillReferenceIds=new Set(a?.lessonIds||[]);modal('6つの力を手動設定｜'+state.subject,`<div class="notice info mb"><b>提案はルールによるデモです。AIには接続していません。</b><br>所見の行動記録から一部の項目だけ提案します。単元の到達度を6軸へ自動変換しません。</div><form onsubmit="saveSkills(event)"><div class="row mb"><label class="field">評価日<input type="date" id="skill-date" value="${TODAY}" required></label><span class="tiny muted">各段階の意味と、実際に見た行動を照合してください。</span></div><details class="small mb"><summary>4段階の共通目安を見る</summary><p class="mt">1：継続的な支援を受けながら取り組む<br>2：手がかり・問いかけがあれば取り組める<br>3：慣れた課題で自力で使える<br>4：場面が変わっても自力で活用できる<br>未評価：観察していない・根拠が足りない</p><p class="small muted">以下の項目説明が観察対象です。この尺度はモック用の仮設定であり、テスト点数や診断を意味しません。</p></details>${AXES.map((x,i)=>`<div class="skill-edit-row"><div><b>${x}</b><div class="sub">${AXIS_DESC[i]}</div><textarea id="evidence-${i}" aria-label="${x}の根拠" placeholder="実際に確認した行動・支援の有無">${esc(a?.evidence[i]||'')}</textarea>${proposals[i]?`<div class="proposal"><b>提案：${proposals[i].value}</b> ／ ${fmt(proposals[i].date)}<br>${proposals[i].reason}<br><button type="button" onclick="useProposal(${i})">この提案を入力欄に反映</button></div>`:'<div class="sub">提案なし：記録からは判断しません。</div>'}</div><label class="field">手動設定<select id="value-${i}"><option value="">未評価</option>${[1,2,3,4].map(v=>`<option value="${v}" ${a?.values[i]===v?'selected':''}>${v} / 4</option>`).join('')}</select></label></div>`).join('')}<div class="formfooter"><button type="button" class="btn" onclick="closeModal()">キャンセル</button><button class="btn primary">評価を確定して保存</button></div></form>`);if(a)AXES.forEach((_,i)=>{if(a.values[i]==null)document.getElementById('value-'+i).value=''})}
function useProposal(i){let p=window.currentProposals[i];window.skillReferenceIds.add(p.lesson);document.getElementById('value-'+i).value=p.value;document.getElementById('evidence-'+i).value=fmt(p.date)+'の授業：'+p.reason;toast('入力欄に反映しました。内容を確認して保存してください。')}
function saveSkills(e){e.preventDefault();let values=AXES.map((_,i)=>{let v=document.getElementById('value-'+i).value;return v===''?null:Number(v)});let evidence=AXES.map((_,i)=>document.getElementById('evidence-'+i).value.trim());if(values.some((v,i)=>v!==null&&!evidence[i])){toast('評価した項目には根拠となる行動を記入してください。');return}let old=getAssess(state.student,state.subject);let data={id:uid('sk'),student:state.student,subject:state.subject,date:document.getElementById('skill-date').value,values,evidence,lessonIds:[...(window.skillReferenceIds||new Set())],author:state.actor,createdAt:now()};db.assessments.push(data);audit('スキル評価',state.student,state.subject,'6つの力を手動設定',old?skillText(old):'評価なし',skillText(data));persist();closeModal();render();toast('評価と根拠を保存しました。過去の評価は残ります。')}
function skillText(a){return AXES.map((x,i)=>x+'：'+(a.values[i]??'未評価')+'\n根拠：'+(a.evidence[i]||'未確認')).join('\n\n')}
function openLesson(id=''){let l=id?db.lessons.find(x=>x.id===id):null;let s=student(l?.student||state.student);let teacher=l?.teacher||(state.actor.includes('講師')?state.actor:'講師 A（デモ）');modal(id?'授業記録の詳細・編集':'授業を記録',`<form id="lesson-form" onsubmit="saveLesson(event,'${id}')"><div class="form-grid three mb"><label class="field">生徒<select name="student" id="entry-student" onchange="updateEntrySubjects(this.value)">${studentOptions(s.id)}</select></label><label class="field">教科<select name="subject" id="entry-subject">${subjOptions(l?.subject||state.subject,false,s.subjects)}</select></label><label class="field">授業日<input type="date" name="date" value="${l?.date||TODAY}" required></label><label class="field">担当講師<select name="teacher">${teacherOptions(teacher,false)}</select></label><label class="field">コマ<select name="slot">${['A','B','C','D'].map(x=>`<option ${x===(l?.slot||'B')?'selected':''}>${x}</option>`).join('')}</select></label><label class="field">授業進度<select name="mode">${['復習','同範囲','予習'].map(x=>`<option ${x===(l?.mode||'同範囲')?'selected':''}>${x}</option>`).join('')}</select></label><label class="field full">学習した単元・範囲 <span class="tiny">必須</span><input name="unit" required value="${esc(l?.unit||'')}" placeholder="例：一次関数・変化の割合"></label><label class="field">教材<input name="material" value="${esc(l?.material||'')}" placeholder="教材名"></label><label class="field">ページ・問題番号<input name="pages" value="${esc(l?.pages||'')}" placeholder="例：p.42〜43"></label></div><div class="fieldgroup"><div class="fieldtitle">今回の到達度 <span class="small muted">単元の評価</span></div><div class="radio-list">${['4','3','2','1',''].map(v=>`<label class="radioitem"><input type="radio" name="level" value="${v}" ${String(l?.level??'')===v?'checked':''}>${v?v+'：':'未評価：'}${LEVELS[v]}</label>`).join('')}</div></div><div class="fieldgroup"><div class="fieldtitle">つまずきの原因 <span class="small muted">複数選択・任意</span></div><div class="tagrow">${STUMBLES.map(x=>`<label class="chipcheck"><input type="checkbox" name="stumbles" value="${x}" ${l?.stumbles.includes(x)?'checked':''}>${x}</label>`).join('')}</div></div><label class="field">できたこと・支援の効果・気づき <span class="tiny">必須／短い所見でOK</span><textarea name="obs" required placeholder="例：xとyの増加量を混同。表で確認すると理解が進んだ。">${esc(l?.obs||'')}</textarea></label><div class="fieldgroup mt"><div class="fieldtitle">見つけた良さ <span class="small muted">確認できたものだけ・任意</span></div><div class="tagrow">${TAGS.map(x=>`<label class="chipcheck"><input type="checkbox" name="tags" value="${x}" ${l?.tags.includes(x)?'checked':''}>${x}</label>`).join('')}</div></div><label class="field">次回の取り組み <span class="tiny">必須</span><textarea name="next" required rows="2" placeholder="例：表から変化の割合を求める練習">${esc(l?.next||'')}</textarea></label><div class="form-grid mt"><label class="field">前回の宿題<select name="homeworkDone">${['実施','一部実施','未実施','確認できていない'].map(x=>`<option ${x===(l?.homeworkDone||'確認できていない')?'selected':''}>${x}</option>`).join('')}</select><label class="field">今回の宿題 <span class="tiny">必須／出さない場合は「なし」</span><input name="homework" required value="${esc(l?.homework||'')}" placeholder="範囲・量・取り組み方"></label></div><details class="mt"><summary class="small">確認テストの結果・内部メモ（任意）</summary><div class="form-grid mt"><label class="field">正答数<input name="correct" type="number" min="0" value="${l?.correct??''}"></label><label class="field">出題数<input name="total" type="number" min="1" value="${l?.total??''}"></label><label class="field full">講師・教室長向けの内部メモ<textarea name="internal" placeholder="保護者用報告書には掲載しません。">${esc(l?.internal||'')}</textarea></label></div></details><div class="draft-note mt">下書きは未報告です。「教室長に報告」後、日別報告の確認対象になります。終業時の口頭報告は継続してください。${l?.status==='確認済み'?'<br><b>確認済みの記録を修正すると、再確認のため「報告済み」に戻ります。</b>':''}</div><div class="formfooter"><button type="button" class="btn" onclick="closeModal()">キャンセル</button><button name="intent" value="draft" class="btn">下書き保存</button><button name="intent" value="report" class="btn primary">${icon('check')}保存して教室長に報告</button></div></form>`)}
function updateEntrySubjects(id){document.getElementById('entry-subject').innerHTML=subjOptions('',false,student(id).subjects)}
function saveLesson(e,id){e.preventDefault();let f=new FormData(e.target),intent=e.submitter?.value||'draft';let c=f.get('correct'),t=f.get('total');if((c&&!t)||(!c&&c!=='0'&&t)||(c!==''&&t!==''&&Number(c)>Number(t))){toast('正答数・出題数は両方入力し、正答数を出題数以下にしてください。');return}let old=id?db.lessons.find(x=>x.id===id):null;let item={id:old?.id||uid('lesson'),student:f.get('student'),subject:f.get('subject'),date:f.get('date'),teacher:f.get('teacher'),slot:f.get('slot'),unit:f.get('unit').trim(),material:f.get('material').trim(),pages:f.get('pages').trim(),mode:f.get('mode'),level:f.get('level')===''?null:Number(f.get('level')),stumbles:f.getAll('stumbles'),obs:f.get('obs').trim(),next:f.get('next').trim(),homework:f.get('homework').trim(),homeworkDone:f.get('homeworkDone'),tags:f.getAll('tags'),correct:c===''?null:Number(c),total:t===''?null:Number(t),internal:f.get('internal').trim(),status:intent==='report'?'報告済み':'下書き',createdAt:old?.createdAt||now(),updatedAt:now()};if(!item.unit||!item.obs||!item.next||!item.homework){toast('必須項目に空白以外の内容を入力してください。');return}audit('授業記録',item.student,item.subject,old?'授業記録を更新':'授業記録を作成',old?lessonText(old):'新規',lessonText(item));if(old)db.lessons[db.lessons.indexOf(old)]=item;else db.lessons.push(item);persist();closeModal();render();toast(intent==='report'?'保存し、教室長の確認待ちにしました。':'このブラウザに下書きを保存しました。')}
function lessonText(l){return ['記録ID：'+l.id,'生徒：'+student(l.student).name,'授業日：'+l.date+' '+l.slot+'コマ','担当：'+l.teacher,'教科：'+l.subject,'単元：'+l.unit,'教材：'+l.material+' '+l.pages,'授業進度：'+l.mode,'到達度：'+(l.level??'未評価'),'つまずき：'+l.stumbles.join('、'),'所見：'+l.obs,'良さのタグ：'+l.tags.join('、'),'次回：'+l.next,'宿題：'+l.homework,'前回宿題の実施：'+l.homeworkDone,'確認問題：'+(l.correct??'未記録')+' / '+(l.total??'未記録'),'内部メモ：'+l.internal,'状態：'+l.status].join('\n')}
function renderDaily(){let f=state.daily,ls=goodRange(f.from,f.to)?records('',f):[];let reported=ls.filter(x=>x.status==='報告済み');return head('講師別・日別報告','誰が、誰の、どの教科を担当したか。日々の口頭報告と一緒に確認します。',`<button class="btn primary" onclick="openLesson()">${icon('plus')}授業を記録</button>`)+`<div class="notice info mb"><b>これまでの終業報告は継続。</b> この画面は報告する授業を見渡し、教室長の確認履歴を残すための一覧です。</div><div class="card"><div class="toolbar"><label class="field">開始日<input type="date" value="${f.from}" onchange="setDaily('from',this.value)"></label><label class="field">終了日<input type="date" value="${f.to}" onchange="setDaily('to',this.value)"></label><label class="field">担当講師<select onchange="setDaily('teacher',this.value)">${teacherOptions(f.teacher)}</select></label><label class="field">生徒<select onchange="setDaily('student',this.value)">${studentOptions(f.student,true)}</select></label><label class="field">教科<select onchange="setDaily('subject',this.value)">${subjOptions(f.subject)}</select></label><label class="field">報告状態<select onchange="setDaily('status',this.value)"><option value="">すべて</option>${['下書き','報告済み','確認済み'].map(x=>`<option ${f.status===x?'selected':''}>${x}</option>`).join('')}</select></label><label class="field">並べ方<select onchange="setDaily('sort',this.value)"><option value="date" ${f.sort==='date'?'selected':''}>日付順</option><option value="teacher" ${f.sort==='teacher'?'selected':''}>講師別 → 日付順</option><option value="subject" ${f.sort==='subject'?'selected':''}>教科別 → 日付順</option></select></label></div><div class="quickbar"><button onclick="state.daily.from=TODAY;state.daily.to=TODAY;render()">今日（デモ基準日）</button><button onclick="state.daily.from='2026-11-17';state.daily.to='2026-11-17';render()">サンプル授業日 11/17</button><button onclick="state.daily.from='2026-11-01';state.daily.to=TODAY;render()">今月</button><button onclick="state.daily.from='';state.daily.to='';render()">全履歴</button></div>${goodRange(f.from,f.to)?'':'<p class="small" style="color:var(--red)">開始日は終了日以前にしてください。</p>'}</div><div class="metrics"><div class="metric"><small>対象の授業</small><div class="num">${ls.length}<span>件</span></div></div><div class="metric"><small>下書き・未報告</small><div class="num">${ls.filter(x=>x.status==='下書き').length}<span>件</span></div></div><div class="metric"><small>教室長の確認待ち</small><div class="num">${reported.length}<span>件</span></div></div><div class="metric"><small>確認済み</small><div class="num">${ls.filter(x=>x.status==='確認済み').length}<span>件</span></div></div></div><div class="card"><div class="section-title"><h2>担当授業の一覧</h2><span class="small muted">授業ごとに確認</span></div><div class="tablewrap"><table><thead><tr><th>日付・コマ</th><th>講師</th><th>生徒・教科</th><th>学習内容</th><th>状態</th><th>操作</th></tr></thead><tbody>${ls.map(l=>`<tr><td class="nowrap">${fmt(l.date)}<div class="subcell">${l.slot}コマ</div></td><td>${l.teacher}</td><td><b>${esc(student(l.student).name)}</b><div class="subcell">${l.subject} ／ ${student(l.student).school}</div></td><td>${esc(l.unit)}<div class="subcell">到達度 ${l.level??'未評価'}　${esc(l.obs.slice(0,34))}${l.obs.length>34?'…':''}</div></td><td>${statusBadge(l.status)}${l.reviewedAt?`<div class="subcell">${stamp(l.reviewedAt)}<br>${esc(l.reviewedBy)}</div>`:''}</td><td><button class="btn small" onclick="reviewLesson('${l.id}')">${l.status==='報告済み'?'内容を確認':'詳細を見る'}</button></td></tr>`).join('')||'<tr><td colspan="6"><div class="empty">この条件の授業はありません。</div></td></tr>'}</tbody></table></div></div>`}
function setDaily(k,v){state.daily[k]=v;render()}
function reviewLesson(id){let l=db.lessons.find(x=>x.id===id),can=!state.actor.startsWith('講師');modal('終業報告の確認｜'+student(l.student).name+'・'+l.subject,lessonCard(l)+`<div class="card mt"><div class="small"><b>宿題：</b>${esc(l.homework)}<br><b>前回の実施状況：</b>${l.homeworkDone}</div><div class="notice mt"><b>内部メモ（保護者用には非表示）</b><br>${esc(l.internal||'記録なし')}</div></div><div class="formfooter"><button class="btn" onclick="openLesson('${id}')">記録を編集</button>${l.status==='報告済み'?`<button class="btn primary" ${can?'':'disabled'} onclick="markReviewed('${id}')">教室長として確認済みにする</button>`:''}</div>${!can?'<p class="tiny muted mt">確認済みへの変更は教室長・代表のデモユーザーで試してください。認証・権限制御は本番実装が必要です。</p>':''}`)}
function markReviewed(id){if(state.actor.startsWith('講師')){toast('教室長・代表の操作として確認します。');return}let l=db.lessons.find(x=>x.id===id);audit('報告確認',l.student,l.subject,'授業報告を確認',l.status,'確認済み');l.status='確認済み';l.reviewedBy=state.actor;l.reviewedAt=now();persist();closeModal();render();toast('授業報告を確認済みにしました。')}
function toReports(fromHistory=false){let f=fromHistory?state.history:{from:'2026-11-01',to:TODAY,subject:state.subject,sort:'desc'};state.report={...state.report,from:f.from,to:f.to,subject:f.subject,type:fromHistory?'list':'term',students:[state.student],sort:f.sort==='subject'?'subject':'date',confirmed:false,edits:{}};navigate('reports')}
function renderReports(){let r=state.report;return head('報告書・印刷','期間・教科を選び、A4の報告書を作成。内部メモを分けて、内容を確認して発行します。')+`<div class="report-layout"><aside class="card report-controls"><h2 class="mb">出力する内容</h2><label class="field">報告書の種類<select onchange="setReport('type',this.value)"><option value="term" ${r.type==='term'?'selected':''}>期間指定の成長報告書</option><option value="daily" ${r.type==='daily'?'selected':''}>授業ごとの学習報告書</option><option value="list" ${r.type==='list'?'selected':''}>学プロの記録一覧（内部用）</option></select></label><div class="form-grid" style="gap:8px"><label class="field">開始日<input type="date" value="${r.from}" onchange="setReport('from',this.value)"></label><label class="field">終了日<input type="date" value="${r.to}" onchange="setReport('to',this.value)"></label></div><label class="field">教科<select onchange="setReport('subject',this.value)">${subjOptions(r.subject)}</select></label><label class="field">記録の並べ方<select onchange="setReport('sort',this.value)"><option value="date" ${r.sort==='date'?'selected':''}>日付順</option><option value="subject" ${r.sort==='subject'?'selected':''}>教科別 → 日付順</option></select></label><div class="fieldtitle">対象生徒 <span class="tiny muted">複数選択可</span></div><div class="stack" style="gap:8px">${db.students.map(s=>`<label class="checkline"><input type="checkbox" ${r.students.includes(s.id)?'checked':''} onchange="toggleReportStudent('${s.id}',this.checked)"><span>${esc(s.name)} <span class="tiny muted">${s.grade}</span></span></label>`).join('')}</div><button class="btn text small mt" onclick="state.report.students=db.students.map(x=>x.id);state.report.confirmed=false;render()">全員を選択</button><div class="divider"></div><div class="notice ${r.type==='list'?'':'info'} small">${r.type==='list'?'講師・教室長向けの内部用です。内部メモが含まれます。保護者配布用には使用しないでください。':'保護者用です。内部メモや内部用の指導方針を、そのまま掲載しません。下書きの授業は含めません。'}</div><label class="checkline mt"><input type="checkbox" id="report-confirmed" ${r.confirmed?'checked':''} onchange="state.report.confirmed=this.checked;updatePrintButton()"><span>${r.type==='list'?'内部用であることと、出力対象を確認しました。':'対象者・内容を確認し、保護者に渡してよい内容です。'}</span></label><button id="print-button" class="btn primary mt" style="width:100%" onclick="issuePrint()">${icon('reports')}保存して印刷</button><p class="tiny muted mt">印刷画面で「PDFに保存」も選べます。PDFはブラウザの印刷機能を利用します。</p><button class="btn mt" style="width:100%" onclick="showIssued()">発行履歴・再印刷 (${db.issued.length})</button><p class="tiny muted mt">印刷操作前の内容を保存します。実際の印刷完了・配布完了を自動判定する機能ではありません。</p></aside><div><div class="resultbar" style="margin-top:0"><span id="report-summary">印刷プレビュー</span><span class="badge">A4・生徒ごとに改ページ</span></div><div class="paperpreview" id="report-preview"></div><div id="report-editors"></div></div></div>`}
function setReport(k,v){state.report[k]=v;state.report.confirmed=false;state.report.edits={};render()}
function toggleReportStudent(id,on){let r=state.report;if(on&&!r.students.includes(id))r.students.push(id);if(!on)r.students=r.students.filter(x=>x!==id);r.confirmed=false;updateReportPreview()}
function reportLessons(sid){let r=state.report;return records(sid,{from:r.from,to:r.to,subject:r.subject,sort:r.sort==='subject'?'subject':'asc'}).filter(x=>r.type==='list'||x.status!=='下書き')}
function reportCopy(sid,ls){let r=state.report;if(r.edits[sid])return r.edits[sid];let subs=[...new Set(ls.map(x=>x.subject))];let latest=subs.map(sub=>ls.filter(x=>x.subject===sub).sort((a,b)=>b.date.localeCompare(a.date))[0]);return {growth:latest.map(l=>{let sentences=l.obs.match(/[^。！？]+[。！？]?/g)||[l.obs];let good=sentences.filter(x=>/理解が進ん|できた|自力で整理|自分で整理|修正|説明でき|取り組んだ|示せた/.test(x));return '【'+l.subject+'】'+(good.length?good.join(''):l.obs)}).join('\n'),progress:subs.map(sub=>{let recs=ls.filter(x=>x.subject===sub),units=[...new Set(recs.map(x=>x.unit))],last=[...recs].sort((a,b)=>b.date.localeCompare(a.date))[0],tested=[...recs].filter(x=>x.correct!==null&&x.total!==null).sort((a,b)=>b.date.localeCompare(a.date))[0];return '【'+sub+'】'+units.join('、')+'に取り組みました（記録 '+recs.length+'回）。直近の到達状況：'+(last.level===null?'未評価':last.level+' / 4（'+LEVELS[String(last.level)]+'）')+'。'+(tested?'確認問題：'+tested.correct+'問正解 / '+tested.total+'問（'+fmt(tested.date)+'）。':'確認テストの点数は未記録です。');}).join('\n'),next:latest.map(l=>'【'+l.subject+'】'+l.next).join('\n'),home:latest.map(l=>'【'+l.subject+'】'+l.homework).join('\n')}}
function headerReport(s,title,sub=''){let r=state.report;return `<div class="report-top"><div><div class="school">明光義塾 ${s.school} ／ LLLD</div><h1>${title}</h1></div><div style="text-align:right"><span class="badge">デモ・架空データ</span><div class="report-meta">作成日 ${fmt(TODAY)}</div></div></div><div class="report-lead"><div class="report-name">${esc(s.name)} さん <span style="font-size:12px;font-weight:400">${s.grade}</span></div><div class="report-meta">対象：${r.from?fmt(r.from):'開始指定なし'} 〜 ${r.to?fmt(r.to):'終了指定なし'} ／ ${sub||r.subject||'全教科'}</div></div>`}
function reportFooter(){return '<div class="report-footer">操作確認用の架空データです。スキル評価は授業で確認した行動の記録であり、学力の総合点や診断ではありません。<br>LLLD ／ 学びのスキルカルテ　※本番の個人情報は入力しないでください。</div>'}
function reportTerm(sid,ls){let s=student(sid),copy=reportCopy(sid,ls),r=state.report,subs=[...new Set(ls.map(x=>x.subject))];let graphSubs=r.subject?[r.subject]:subs;
 return `<section class="report-page">${headerReport(s,'学習・成長報告書')}<div class="report-section"><h3>今回見つけた強み・成長</h3><p>${esc(copy.growth)}</p></div><div class="report-graphs ${graphSubs.length>1?'multi':''}">${graphSubs.map(sub=>{let a=getAssess(sid,sub,r.from,r.to||'9999-99-99'),prev=r.from?getAssess(sid,sub,'',beforeDay(r.from)):null;return `<div class="report-graph"><div>${radar(a?.values,prev?.values,true)}</div><div><h3>${sub}で見えた6つの力</h3><p class="small muted mt">${a?'対象期間内の評価日：'+fmt(a.date):'対象期間内の確定評価はありません。'}</p><div class="legend mt" style="justify-content:flex-start;flex-wrap:wrap"><span><i class="swatch"></i>対象期間の評価</span>${prev?'<span><i class="swatch prev"></i>期間前 '+fmt(prev.date)+'</span>':''}</div><p class="small muted mt">4段階＋未評価。未確認は0点にせず「未評価」としています。</p></div></div>`}).join('')}</div><div class="report-section"><h3>学習状況</h3><p>${esc(copy.progress)}</p></div><div class="report-section"><h3>これからの指導方針</h3><p>${esc(copy.next)}</p></div><div class="report-section"><h3>家庭での取り組み</h3><p>${esc(copy.home)}</p></div>${reportFooter()}</section>`;
}
function reportDaily(sid,ls){let s=student(sid);return ls.map(l=>`<section class="report-page">${headerReport(s,'学習報告書',l.subject)}<div class="row between"><h2>${fmt(l.date)} ${l.slot}コマ</h2><span class="badge blue">${l.subject}</span></div><div class="report-section"><h3>学習した内容</h3><p>${esc(l.unit)}\n${esc(l.material)} ${esc(l.pages)}</p></div><div class="report-section"><h3>できたこと・理解につながったこと</h3><p>${esc(l.obs)}</p></div><div class="report-section"><h3>今回の到達状況</h3><p>${l.level==null?'未評価：確認できていない':l.level+' / 4：'+LEVELS[String(l.level)]}${l.correct!=null&&l.total!=null?'\n確認問題：'+l.correct+'問正解 / '+l.total+'問':''}</p></div><div class="report-section"><h3>次回の取り組み</h3><p>${esc(l.next)}</p></div><div class="report-section"><h3>宿題</h3><p>${esc(l.homework)}</p></div>${reportFooter()}</section>`).join('')}
function reportList(sid,ls){let s=student(sid);return `<section class="report-page"><table class="history-table"><thead><tr><td>${headerReport(s,'学プロ・授業記録一覧')}<p class="print-alert mb"><b>講師・教室長向けの内部用 ／ 保護者配布不可</b>　${ls.length}件。下書きも含みます。</p></td></tr></thead><tbody>${ls.map(l=>`<tr><td><article class="lesson"><div class="lesson-head"><span class="lesson-date">${fmt(l.date)} ${l.slot}コマ ／ ${l.subject} ／ ${esc(l.teacher)}</span>${statusBadge(l.status)}</div><div class="lesson-unit">${esc(l.unit)} <span class="tiny muted">${esc(l.pages)}</span></div><div class="lesson-body"><div><div class="label">所見</div><p>${esc(l.obs)}</p></div><div><div class="label">次回</div><p>${esc(l.next)}</p></div></div><p class="tiny mt">到達度：${l.level??'未評価'} ／ 宿題：${esc(l.homework)}</p>${l.internal?'<p class="tiny" style="margin-top:6px;color:#7b6050"><b>内部メモ：</b>'+esc(l.internal)+'</p>':''}</article></td></tr>`).join('')}</tbody><tfoot><tr><td>${reportFooter()}</td></tr></tfoot></table></section>`}
function buildReport(){let r=state.report;if(!goodRange(r.from,r.to))return {html:'',count:0,pages:0};let html='',count=0,pages=0;for(let sid of r.students){let ls=reportLessons(sid);if(!ls.length)continue;count++;pages+=r.type==='daily'?ls.length:1;html+=r.type==='term'?reportTerm(sid,ls):r.type==='daily'?reportDaily(sid,ls):reportList(sid,ls);}return {html,count,pages}}
function updateReportPreview(){let r=state.report,out=buildReport();document.getElementById('report-preview').innerHTML=out.html||'<div class="empty">対象の記録がありません。<br>生徒・期間・教科を確認してください。</div>';document.getElementById('report-summary').textContent='選択 '+r.students.length+'名・記録あり '+out.count+'名 ／ '+(r.type==='daily'?out.pages+'件の授業報告':'内容量に応じて複数ページ');document.getElementById('report-editors').innerHTML=r.type==='term'?r.students.map(sid=>{let ls=reportLessons(sid);if(!ls.length)return '';let c=reportCopy(sid,ls);return `<details class="report-edit"><summary class="strong small">${esc(student(sid).name)}さんの報告文を確認・修正する</summary><p class="tiny muted mt mb">授業記録から転記した下書きです。AI生成ではありません。ここでの修正は元の授業記録を変更しません。</p>${[['growth','強み・成長'],['progress','学習状況'],['next','今後の指導方針'],['home','家庭での取り組み']].map(([k,label])=>`<label class="field mt">${label}<textarea oninput="editReport('${sid}','${k}',this.value)">${esc(c[k])}</textarea></label>`).join('')}</details>`}).join(''):'';let ck=document.getElementById('report-confirmed');if(ck)ck.checked=r.confirmed;updatePrintButton()}
function editReport(sid,k,v){if(!state.report.edits[sid])state.report.edits[sid]=reportCopy(sid,reportLessons(sid));state.report.edits[sid][k]=v;state.report.confirmed=false;document.getElementById('report-confirmed').checked=false;document.getElementById('report-preview').innerHTML=buildReport().html;updatePrintButton()}
function updatePrintButton(){let b=document.getElementById('print-button');if(b)b.disabled=!state.report.confirmed||!buildReport().count||!goodRange(state.report.from,state.report.to)}
function issuePrint(){if(!state.report.confirmed){toast('対象者と内容を確認してください。');return}let out=buildReport();if(!out.count)return;let entry={id:uid('rpt'),at:now(),actor:state.actor,type:state.report.type,from:state.report.from,to:state.report.to,subject:state.report.subject,students:state.report.students.filter(sid=>reportLessons(sid).length),html:out.html};db.issued.unshift(entry);audit('報告書発行','',state.report.subject,'印刷用の内容を保存','未発行','対象 '+entry.students.map(id=>student(id).name).join('、')+' ／ '+fmt(entry.from)+'〜'+fmt(entry.to)+' ／ 印刷ダイアログを開く操作');persist();document.getElementById('print-root').innerHTML=out.html;window.print();render();toast('発行内容を保存しました。印刷完了・配布完了は別途ご確認ください。')}
function showIssued(){modal('発行履歴・再印刷',`<p class="small muted mb">発行時の内容を保存しています。その後、授業記録や評価を変えても過去の発行内容は変わりません。</p>${db.issued.length?db.issued.map(x=>`<div class="archive-item"><div><b>${esc(x.students.map(id=>student(id).name).join('、'))}</b> ／ ${x.type==='term'?'成長報告書':x.type==='daily'?'授業報告書':'内部用記録一覧'}<div class="tiny muted">${stamp(x.at)} ／ ${fmt(x.from)}〜${fmt(x.to)} ／ ${x.subject||'全教科'}<br>操作：${esc(x.actor)}</div></div><button class="btn small" onclick="reprint('${x.id}')">再印刷</button></div>`).join(''):'<div class="empty">発行済みの報告書はまだありません</div>'}`)}
function reprint(id){let r=db.issued.find(x=>x.id===id);document.getElementById('print-root').innerHTML=r.html;audit('報告書発行','',r.subject,'保存済みの発行内容を再印刷','発行ID '+r.id,'印刷ダイアログを開く操作');persist();window.print()}
function auditCard(x){return `<details class="auditentry"><summary><div><span class="badge">${x.type}</span> <b>${esc(x.label)}</b><div class="tiny muted mt" style="margin-top:5px">${stamp(x.at)} ／ ${esc(x.actor)}${x.student?' ／ '+esc(student(x.student).name):''}${x.subject?' ／ '+x.subject:''}</div></div></summary><div class="diff"><div class="before"><b>変更前</b><pre>${esc(typeof x.before==='string'?x.before:JSON.stringify(x.before,null,2))}</pre></div><div><b>変更後</b><pre>${esc(typeof x.after==='string'?x.after:JSON.stringify(x.after,null,2))}</pre></div></div></details>`}
function auditResults(){let f=state.audit;let ls=db.audit.filter(x=>(!f.type||x.type===f.type)&&(!f.student||x.student===f.student)&&(!f.q||[x.actor,x.label,x.before,x.after,x.subject].join(' ').includes(f.q))).sort((a,b)=>b.at.localeCompare(a.at));return `<div class="resultbar">${ls.length}件の変更履歴</div>`+(ls.length?ls.map(auditCard).join(''):'<div class="empty">該当する変更ログはありません。</div>')}
function renderAudit(){let f=state.audit;return head('変更ログ','授業記録・指導方針・スキル評価・報告確認・報告書発行の変更前後を確認します。')+`<div class="notice info mb"><b>本番要件：ログは自動削除せず、継続保存。</b> バックアップの7日間保管とは別です。このモックの保存先はブラウザ内です。</div><div class="card"><div class="toolbar"><label class="field">記録の種類<select onchange="state.audit.type=this.value;render()"><option value="">すべて</option>${['授業記録','指導方針','スキル評価','報告確認','報告書発行','運用設定'].map(x=>`<option ${f.type===x?'selected':''}>${x}</option>`).join('')}</select></label><label class="field">生徒<select onchange="state.audit.student=this.value;render()">${studentOptions(f.student,true)}</select></label><label class="field">更新者・内容から検索<input type="search" value="${esc(f.q)}" placeholder="例：講師 A、一次関数" oninput="state.audit.q=this.value;document.getElementById('audit-results').innerHTML=auditResults()"></label></div></div><div id="audit-results">${auditResults()}</div>`}
function renderSettings(){return head('運用設定','確定した運用と、モックで試せる範囲を分けて表示します。')+`<div class="two"><section class="card"><div class="section-title"><h2>保存・バックアップの方針</h2><span class="badge amber">本番は未接続</span></div><dl><div class="settingrow"><dt>定時バックアップ</dt><dd>毎晩1回・日本時間<br><div class="row mt" style="margin-top:8px"><input type="time" id="backup-time" value="${esc(db.backupTime)}" aria-label="バックアップ予定時刻"><button class="btn small" onclick="saveBackupTime()">設定を保存</button></div><span class="tiny muted">03:00は仮設定です。デモ上の設定値のみ保存します。</span></dd></div><div class="settingrow"><dt>バックアップ保管</dt><dd><b>7日間</b><br><span class="small muted">本番では古いバックアップを更新する運用。授業履歴の保持期間ではありません。</span></dd></div><div class="settingrow"><dt>授業・変更ログ</dt><dd><b>自動削除なし・継続保存</b><br><span class="small muted">指導方針・スキル評価の変更前後、確認・発行操作を含みます。</span></dd></div><div class="settingrow"><dt>過去の紙の移行</dt><dd>行わず、新規運用を開始</dd></div><div class="settingrow"><dt>既存業務との連携</dt><dd>このモックの対象外</dd></div></dl><div class="notice">このHTMLは、ブラウザを閉じた後に定時バックアップを実行できません。サーバー側の定期実行・復元検証は本番開発で実装する機能です。</div></section><section class="card"><div class="section-title"><h2>このモックのデータ</h2><span class="badge">ローカル</span></div><p class="small">入力したデータはこのブラウザの保存領域に保存します。通信や外部AIへの送信はありません。別の端末には共有されません。</p><div class="metrics" style="grid-template-columns:1fr 1fr"><div class="metric"><small>授業記録</small><div class="num">${db.lessons.length}<span>件</span></div></div><div class="metric"><small>変更ログ</small><div class="num">${db.audit.length}<span>件</span></div></div></div><div class="notice ${storageOK?'info':''}">${storageOK?'ブラウザ内保存を使用しています。':'保存に問題があります。JSON書き出しでデータを控えてください。'}<br>閲覧データの削除や保存容量の制限により失われる場合があります。本番の永続保存・バックアップではありません。</div><button class="btn mt" onclick="exportData()">デモデータをJSONで書き出す</button><div class="divider"></div><h3>本番実装が必要な機能</h3><p class="small muted mt">ログインと権限、複数端末での同時利用、サーバー保存、バックアップ・復元、改ざんに備えたログ管理、外部AI接続は未実装です。</p><div class="divider"></div><button class="btn danger" onclick="resetDemo()">デモを初期状態に戻す</button><p class="tiny muted mt">この端末のデモ記録・発行履歴が消えます。本番用の削除機能ではありません。</p></section></div>`}
function saveBackupTime(){let val=document.getElementById('backup-time').value;if(!/^\d\d:\d\d$/.test(val)){toast('時刻を入力してください。');return}audit('運用設定','','','バックアップ予定時刻を変更',db.backupTime+' JST',val+' JST（デモ設定のみ）');db.backupTime=val;persist();toast('予定時刻を保存しました。自動実行は未実装です。')}
function exportData(){let blob=new Blob([JSON.stringify(db,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='manabi_demo_data_'+localDate()+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('手動書き出しです。定時バックアップとは別です。')}
function resetDemo(){if(!confirm('このブラウザのデモ記録・変更ログ・発行履歴を初期化します。よろしいですか？'))return;db=seed();persist();state.student='s1';state.subject='数学';state.report.edits={};render();toast('架空のサンプルデータに戻しました。')}
document.getElementById('actor').addEventListener('change',e=>{state.actor=e.target.value;toast('操作ユーザーを切り替えました。認証機能ではありません。')});
document.getElementById('modal').addEventListener('click',e=>{if(e.target===e.currentTarget){let r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeModal()}});
window.addEventListener('beforeprint',()=>{if(!document.getElementById('print-root').innerHTML){document.getElementById('print-root').innerHTML='<section class="report-page"><h1>報告書の確認が必要です</h1><p class="mt">「報告書・印刷」画面で対象期間・生徒・内容を確認し、「保存して印刷」から出力してください。</p></section>';}});
window.addEventListener('afterprint',()=>{document.getElementById('print-root').innerHTML=''});

/* ---- SEARCH-FIRST CLASSROOM WORKSPACE / revision 2 ----
   All data stays in this browser. No network calls, authentication, or real backup.
   A desk selection is a local view, never a timetable/assignment master.
*/
const GRADES = [...Array.from({length:6},(_,i)=>`小学${i+1}年`),...Array.from({length:3},(_,i)=>`中学${i+1}年`),...Array.from({length:3},(_,i)=>`高校${i+1}年`)];
const CLASSROOMS=['仁保教室','広島大州教室'];
const clone=x=>JSON.parse(JSON.stringify(x));
const norm=x=>String(x||'').normalize('NFKC').replace(/[ァ-ヶ]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60)).replace(/\s/g,'').toLocaleLowerCase();
const option=(v,label,selected)=>`<option value="${esc(v)}" ${v===selected?'selected':''}>${esc(label??v)}</option>`;
const shortGrade=g=>String(g||'').replace('小学','小').replace('中学','中').replace('高校','高').replace('年','');
const activeStudent=s=>s.enrollment!=='退塾';
function extendData(){
 if(db.revision===2){db.deskDrafts ||= {};db.handovers ||= [];db.catalog ||= [];return;}
 const names=[['山田 はる','やまだ はる'],['佐藤 そら','さとう そら'],['鈴木 ゆい','すずき ゆい'],['田中 れん','たなか れん']];
 db.students.forEach((s,i)=>Object.assign(s,{name:names[i]?.[0]||s.name,kana:names[i]?.[1]||'',schoolName:'サンプル学校',attributes:s.grade==='中学3年'?['高校受験']:['学校補習'],enrollment:'在籍',createdAt:now(),updatedAt:now()}));
 const family=[['青木','あおき'],['石井','いしい'],['上田','うえだ'],['岡田','おかだ'],['加藤','かとう'],['木村','きむら'],['小林','こばやし'],['清水','しみず'],['高橋','たかはし'],['中村','なかむら'],['西田','にしだ'],['橋本','はしもと'],['藤井','ふじい'],['松本','まつもと'],['森','もり'],['吉田','よしだ']];
 const given=[['あおい','あおい'],['ひなた','ひなた'],['かえで','かえで'],['みなと','みなと'],['さくら','さくら']];
 for(let i=4;i<80;i++){const f=family[(i-4)%family.length],g=given[Math.floor((i-4)/family.length)],grade=GRADES[2+(i%10)];db.students.push({id:'s'+(i+1),name:f[0]+' '+g[0],kana:f[1]+' '+g[1],grade,school:CLASSROOMS[i%2],schoolName:grade.startsWith('小学')?'サンプル小学校':grade.startsWith('中学')?'サンプル中学校':'サンプル高校',code:'D-'+String(i+1).padStart(3,'0'),subjects:grade.startsWith('小学')?['算数','国語']:['数学','英語'],attributes:grade.startsWith('高校')?['大学受験']:grade==='中学3年'?['高校受験']:grade.startsWith('小学')&&i%4===0?['中学受験']:['学校補習'],enrollment:'在籍',createdAt:now(),updatedAt:now()});}
 db.catalog=[];
 const addBook=(title,subject,grades,attributes=[])=>db.catalog.push({id:uid('book'),title,subject,grades,attributes,active:true,updatedAt:now()});
 ['中学1年','中学2年','中学3年'].forEach(grade=>{addBook(`メインワーク ${shortGrade(grade)}（サンプル）`,'数学',[grade]);addBook(`計算トレーニング ${shortGrade(grade)}（サンプル）`,'数学',[grade]);addBook(`英語演習 ${shortGrade(grade)}（サンプル）`,'英語',[grade]);addBook(`学校ワーク ${shortGrade(grade)}（サンプル）`,'数学',[grade],['学校補習']);});
 addBook('入試対策 数学（サンプル）','数学',['中学3年'],['高校受験']);
 addBook('受験算数 演習（サンプル）','算数',['小学4年','小学5年','小学6年'],['中学受験']);
 addBook('算数の基本（サンプル）','算数',GRADES.filter(g=>g.startsWith('小学')));
 addBook('国語 読解ワーク（サンプル）','国語',GRADES.filter(g=>g.startsWith('小学')||g.startsWith('中学')));
 addBook('英文法のまとめ（サンプル）','英語',GRADES.filter(g=>g.startsWith('高校')),['大学受験']);
 addBook('高校数学 演習（サンプル）','数学',GRADES.filter(g=>g.startsWith('高校')));
 addBook('英検 単語練習（サンプル）','英語',[],['英検対策']);
 db.lessons.forEach(l=>{
  const s=student(l.student),book=db.catalog.find(b=>b.subject===l.subject&&(!b.grades.length||b.grades.includes(s.grade)));
  l.materials=[{id:uid('mat'),catalogId:book?.id||'',name:book?.title||l.material,pages:l.pages,content:l.unit,homework:''}];
  if(l.subject==='数学'){let b=db.catalog.find(b=>b.title.includes('計算トレーニング')&&b.grades.includes(s.grade));l.materials.push({id:uid('mat'),catalogId:b?.id||'',name:b?.title||'計算プリント（サンプル）',pages:'p.12',content:'計算の確認',homework:'p.13'});}
  l.material=l.materials.map(m=>m.name).join('／');l.pages=l.materials.map(m=>m.pages).filter(Boolean).join('／');
 });
 db.handovers=[
  {id:'h_demo1',student:'s1',subject:'全体',text:'次回、学校のテスト範囲表を持参予定。受け取ったら学プロへ範囲を記録し、教室長に共有してください。',priority:'重要',status:'継続',author:'教室長（デモ）',createdAt:'2026-11-17T10:00:00Z',updatedAt:'2026-11-17T10:00:00Z',readBy:{}},
  {id:'h_demo2',student:'s2',subject:'英語',text:'新しい教材は未着です。届くまでは教室の演習プリントを使用してください。教材到着後に対応済みへ。',priority:'通常',status:'継続',author:'講師 B（デモ）',createdAt:'2026-11-17T10:30:00Z',updatedAt:'2026-11-17T10:30:00Z',readBy:{}},
  {id:'h_demo3',student:'s3',subject:'全体',text:'保護者からの連絡を教室長へ共有しました。次回の面談で確認予定です。',priority:'通常',status:'対応済み',author:'講師 A（デモ）',createdAt:'2026-11-10T09:00:00Z',updatedAt:'2026-11-17T09:00:00Z',completedAt:'2026-11-17T09:00:00Z',completedBy:'教室長（デモ）',readBy:{}}
 ];
 db.deskDrafts={};db.recentStudents=[];db.revision=2;
}
extendData();
/* --- v5 demonstration records: 10 lessons per enrolled subject for all 80 demo students.
   100% fictional. No network requests and no changes to the actual user's school data.
   Idempotent: never generates duplicate lessons when re-opening the file.
*/
const V5_DEMO_DATES=['2026-05-12','2026-06-09','2026-07-14','2026-08-18','2026-09-08','2026-10-06','2026-10-20','2026-11-03','2026-11-10','2026-11-17'];
function v5UnitsFor(s,sub){
 const g=s.grade||'';
 if(sub==='算数')return g.includes('6年')?['分数の計算','円の面積','比の利用','速さ','比例と反比例','拡大図と縮図','立体の体積','場合の数','資料の読み取り','総合問題']:g.includes('5年')?['小数のかけ算','小数のわり算','合同な図形','約数と倍数','分数の計算','平均','単位量あたり','割合','速さ','総合演習']:['計算の復習','かけ算・わり算','大きい数','図形','小数','分数','面積','文章題','グラフ','総合演習'];
 if(sub==='数学')return g.startsWith('高校')?['数と式','一次不等式','二次関数','図形と計量','場合の数','確率','データの分析','三角比','二次方程式','総合演習']:g.includes('3年')?['式の展開','因数分解','平方根','二次方程式','二次関数','相似','円周角','三平方の定理','関数と図形','入試演習']:g.includes('2年')?['式の計算','連立方程式','連立方程式の利用','一次関数','一次関数のグラフ','図形の性質','平行と合同','確率','データの活用','総合演習']:['正負の数','文字式','方程式','方程式の文章題','比例','反比例','平面図形','空間図形','データの活用','総合演習'];
 if(sub==='英語')return g.startsWith('高校')?['文型','時制','助動詞','不定詞','動名詞','分詞','関係詞','長文読解','英作文','総合演習']:g.includes('3年')?['現在完了','受動態','不定詞','関係代名詞','分詞の後置修飾','間接疑問文','長文読解','条件英作文','リスニング','総合演習']:g.includes('2年')?['過去形の復習','未来表現','不定詞','動名詞','比較','接続詞','助動詞','長文読解','英作文','総合演習']:['be動詞','一般動詞','疑問文・否定文','三人称単数','命令文','代名詞','現在進行形','過去形','読解','総合演習'];
 if(sub==='国語')return g.startsWith('小学')?['漢字・語句','説明文の要点','指示語','物語の登場人物','段落のつながり','接続語','詩の表現','要約','資料を読む','総合読解']:['漢字・語彙','説明的文章','指示語と接続語','小説の心情','古文の基礎','文法','論説文','記述問題','資料の読み取り','総合読解'];
 if(sub==='理科')return ['物質の性質','化学変化','電流','光と音','力と運動','植物','動物','大地の変化','天気','総合演習'];
 if(sub==='社会')return ['地理の基本','日本の地形','産業','世界の地域','歴史の流れ','古代','中世','近世','近現代','総合演習'];
 return ['基本内容','復習','基本演習','重要語句','確認問題','資料問題','応用問題','まとめ','単元テスト','総合演習'];
}
function v5Comment(sub,unit,i,studentIndex){
 const variant=(studentIndex*3+i)%6;
 const skill=(sub==='数学'||sub==='算数')?'式の意味と数量の関係':sub==='英語'?'語順と文の意味':sub==='国語'?'本文の根拠':sub==='理科'?'実験結果と理由':'資料に示された根拠';
 const observations=[
  `${unit}について、基本事項を確認した後、例題を自力で解けた。途中で質問した内容を次の問題に生かしていた。`,
  `${unit}では、問題の条件を整理するところに時間がかかった。図や表を使うと${skill}を確認できた。`,
  `${unit}の基本問題では計算・解答の手順を守って進められた。応用問題は講師の問いかけを受けて考え直した。`,
  `${unit}について、最初は根拠を説明しづらそうだったが、解いた手順を振り返ると自分の言葉で説明できた。`,
  `${unit}の確認問題で前回の内容を使えた。解き直しでは自分で誤りに気づき、答えを修正できた。`,
  `${unit}の演習に集中して取り組めた。別の条件になると迷いが見られたため、次回も類題で定着を確認する。`
 ];
 const nexts=[
  `次回は${unit}の類題を自力で解き、考え方を説明できるか確認する。`,
  `次回は図・表による整理から始め、${unit}の基本問題を少ないヒントで解けるか確認する。`,
  `次回は${unit}の応用問題を段階的に取り上げ、考え方の定着を確認する。`,
  `次回は${unit}の解法の理由を短く説明してから、別の問題へ進む。`,
  `次回は${unit}の復習テストを行い、間違いの原因と解き直しを確認する。`,
  `次回は${unit}の基本・応用を混ぜて出題し、自力で進められる範囲を確認する。`
 ];
 const tags=[['自分から質問した','前回の学習を使えた'],['図・表で確認した','条件を整理した'],['粘り強く取り組んだ'],['理由を説明した'],['間違いを修正した','前回の学習を使えた'],['粘り強く取り組んだ','自分で学習を進めた']];
 return {obs:observations[variant],next:nexts[variant],tags:tags[variant],level:([3,2,3,2,3,2][variant]+(i>=7&&[0,2,4].includes(variant)?1:0)),stumbles:variant===1?['考え方・理解']:variant===2?['時間配分']:variant===3?['問題文の読み取り']:variant===4?['計算ミス']:variant===5?['知識不足']:[]};
}
function v5BookCandidates(s,sub){
 return (db.catalog||[]).filter(b=>b.active!==false&&b.subject===sub&&(!b.grades?.length||b.grades.includes(s.grade))&&(!b.attributes?.length||b.attributes.some(a=>(s.attributes||[]).includes(a))));
}
function v5FillAllLessons(){
 if(db.demoSeededV5)return;
 let countAdded=0,recordsUpdated=0;
 const pairCount={};
 db.students.forEach((s,si)=>{
  [...new Set(s.subjects||[])].forEach((sub,sj)=>{
   let existing=db.lessons.filter(l=>l.student===s.id&&l.subject===sub);
   const names=v5UnitsFor(s,sub),books=v5BookCandidates(s,sub);
   const seen=new Set(existing.map(l=>l.date));
   V5_DEMO_DATES.forEach((date,i)=>{
    if(existing.length>=10||seen.has(date))return;
    const unit=names[i%names.length],c=v5Comment(sub,unit,i,si);
    const primary=books.length?books[(i+si)%books.length]:null;
    const secondary=books.length>1&&i%3!==0?books[(i+si+1)%books.length]:null;
    const bookName=primary?.title||`${sub} 基本ワーク（サンプル）`;
    const pages=`p.${8+i*4}〜${11+i*4}`;
    const hwPages=`p.${12+i*4}〜${13+i*4}`;
    const materials=[{id:`v5mat_${s.id}_${sub}_${i}_1`,name:bookName,catalogId:primary?.id||'',pages,content:unit,homework:hwPages}];
    if(secondary&&secondary.id!==primary?.id){materials.push({id:`v5mat_${s.id}_${sub}_${i}_2`,name:secondary.title,catalogId:secondary.id,pages:`p.${3+i*2}〜${4+i*2}`,content:'前回の確認・補強',homework:''});}
    const homeworkItems=[{id:`v5hw_${s.id}_${sub}_${i}`,catalogId:primary?.id||'',name:bookName,pages:hwPages,instruction:'基本問題を解き、迷った問題には印を付ける',sourcePages:pages}];
    const total=10,level=c.level,correct=Math.max(3,Math.min(10,4+Math.floor(i/2)+(si%3)-((si+i)%4===0?1:0)));
    const status=(i===9&&si%7===0)?'報告済み':'確認済み';
    const lesson={id:`v5_l_${s.id}_${sub}_${i+1}`,student:s.id,subject:sub,date,slot:['A','B','C','D','X','Y','Z'][(si+sj)%7],teacher:['講師 A（デモ）','講師 B（デモ）','講師 C（デモ）'][(si+sj)%3],unit,material:bookName,pages,materials,mode:i%4===0?'復習':i%4===3?'予習':'同範囲',level,stumbles:c.stumbles,obs:c.obs,next:c.next,homework:`${bookName} ${hwPages}`,homeworkNote:'',homeworkItems,homeworkDone:(i+si)%8===0?'一部実施':'実施',tags:c.tags,correct,total,internal:'',status,createdAt:date+'T10:00:00Z',updatedAt:date+'T11:00:00Z',demo:true};
    db.lessons.push(lesson);existing.push(lesson);seen.add(date);countAdded++;
   });
   // Upgrade the four original students' ten legacy demo records as well.
   for(const l of existing){
    if(!/^l\d+$/.test(l.id))continue;
    const i=V5_DEMO_DATES.indexOf(l.date);
    if(i<0)continue;
    const originalSpecial=s.id==='s1'&&sub==='数学'&&(l.date==='2026-11-10'||l.date==='2026-11-17');
    const candidate=books[(i+si)%Math.max(1,books.length)]||books[0];
    const secondary=books.length>1&&i%2===0?books[(i+si+1)%books.length]:null;
    const name=candidate?.title||l.material||`${sub} 基本ワーク（サンプル）`;
    const pages=`p.${8+i*4}〜${11+i*4}`,hwPages=`p.${12+i*4}〜${13+i*4}`;
    if(!originalSpecial){const unit=names[i],v=v5Comment(sub,unit,i,si);l.unit=unit;l.obs=v.obs;l.next=v.next;l.tags=v.tags;l.stumbles=v.stumbles;l.level=v.level;}
    l.materials=[{id:`v5mat_legacy_${l.id}`,name,catalogId:candidate?.id||'',pages,content:l.unit||'',homework:hwPages}];
    if(secondary&&secondary.id!==candidate?.id)l.materials.push({id:`v5mat_legacy2_${l.id}`,name:secondary.title,catalogId:secondary.id,pages:`p.${3+i*2}〜${4+i*2}`,content:'復習・定着確認',homework:''});
    l.material=name;l.pages=pages;
    l.homeworkItems=[{id:`v5hw_legacy_${l.id}`,catalogId:candidate?.id||'',name,pages:hwPages,instruction:'基本問題を復習し、迷った問題に印を付ける',sourcePages:pages}];
    l.homework=`${name} ${hwPages}`;l.homeworkNote='';
    l.correct=Math.min(10,Math.max(4,5+Math.floor(i/3)+(si%2)));
    l.total=10;l.demo=true;recordsUpdated++;
   }
   pairCount[`${s.id}|${sub}`]=existing.length;
   // Add demonstration skill assessments for students that did not yet have one.
   if(!db.assessments.some(a=>a.student===s.id&&a.subject===sub)){
    [5,8].forEach((idx,k)=>{
     const l=existing.find(x=>x.date===V5_DEMO_DATES[idx]);if(!l)return;
     const values=[0,1,2,3,4,5].map(axis=>Math.min(4,Math.max(1,(k?3:2)+((si+axis+sj)%3===0?1:0)-((si+axis)%11===0?1:0))));
     db.assessments.push({id:`v5sk_${s.id}_${sub}_${k}`,student:s.id,subject:sub,date:l.date,axisNames:[...AXES],values,evidence:AXES.map(x=>`サンプル授業 ${l.date}「${l.unit}」の観察内容を元にした架空の評価です。`),lessonIds:[l.id],author:'教室長（デモ）',createdAt:l.date+'T12:00:00Z',demo:true});
    });
   }
  });
 });
 db.demoSeededV5=true;
 db.demoStatsV5={students:db.students.length,pairs:Object.keys(pairCount).length,lessons:db.lessons.length,added:countAdded,updated:recordsUpdated,minimum:Math.min(...Object.values(pairCount)),maximum:Math.max(...Object.values(pairCount))};
}
v5FillAllLessons();
const extra={
 roster:{q:'',grade:'',classroom:'',subject:'',attribute:'',enrollment:'在籍'},
 catalog:{q:'',subject:'',grade:'',attribute:'',inactive:false},
 notes:{q:'',status:'継続',subject:'',student:'',priority:''},
 desk:db.deskView||{date:TODAY,slot:'B',teacher:'講師 A（デモ）',seats:[{student:'s1',subject:'数学'},{student:'s2',subject:'英語'},{student:'s3',subject:'算数'}],focus:-1},
 picker:null,bookPicker:null,modalDraft:null,modalKey:null,scrolls:[0,0,0]
};
state.page='desk';
ICONS.desk='<rect x="3" y="5" width="5" height="14" rx="1"/><rect x="9.5" y="5" width="5" height="14" rx="1"/><rect x="16" y="5" width="5" height="14" rx="1"/>';
ICONS.roster=ICONS.daily;ICONS.catalog='<path d="M3 4h7a3 3 0 0 1 3 3v15a4 4 0 0 0-4-3H3zM13 7a3 3 0 0 1 3-3h5v15h-4a4 4 0 0 0-4 3"/>';
ICONS.notes='<path d="M4 3h16v15H9l-5 4zM8 7h8m-8 4h8m-8 4h4"/>';
const original={render,renderProfile,renderHistory,renderReports,renderAudit,renderSettings,reportList,lessonCard,reviewLesson,resetDemo};
function storeView(){db.deskView=clone(extra.desk);persist();}
renderNav=function(){const navs=[['desk','授業・3人表示'],['roster','生徒検索・登録'],['profile','生徒カルテ'],['history','授業履歴・比較'],['daily','講師別・日別報告'],['notes','申し送り'],['catalog','よく使う教材'],['reports','報告書・印刷'],['audit','変更ログ'],['settings','運用設定']];document.getElementById('nav').innerHTML=navs.map(([p,n])=>`<button title="${n}" aria-label="${n}" class="navbtn ${state.page===p?'active':''}" onclick="navigate('${p}')">${icon(p)}<span class="navname">${n}</span></button>`).join('');};
render=function(){
 document.body.classList.toggle('workspace-mode',state.page==='desk');renderNav();
 const pages={desk:renderDesk,roster:renderRoster,catalog:renderCatalog,notes:renderHandovers,profile:renderProfile,history:renderHistory,daily:renderDaily,reports:renderReports,audit:renderAudit,settings:renderSettings};
 document.getElementById('content').innerHTML=(pages[state.page]||renderDesk)();
 if(state.page==='reports')updateReportPreview();
 if(state.page==='desk')extra.scrolls.forEach((v,i)=>{let el=document.getElementById('desk-scroll-'+i);if(el)el.scrollTop=v;});
};
studentOptions=function(selected='',all=false){return (all?'<option value="">すべての生徒</option>':'')+GRADES.map(g=>{let ss=db.students.filter(s=>s.grade===g).sort((a,b)=>norm(a.kana||a.name).localeCompare(norm(b.kana||b.name),'ja'));return ss.length?`<optgroup label="${g}">${ss.map(s=>option(s.id,`${esc(s.name)}｜${s.school}`,selected)).join('')}</optgroup>`:'';}).join('');};
function matchStudents(f){return db.students.filter(s=>(!f.grade||s.grade===f.grade)&&(!f.classroom||s.school===f.classroom)&&(!f.subject||s.subjects.includes(f.subject))&&(!f.enrollment||s.enrollment===f.enrollment)&&(!f.attribute||(s.attributes||[]).includes(f.attribute))&&(!f.q||[s.name,s.kana,s.code,s.schoolName].some(x=>norm(x).includes(norm(f.q))))).sort((a,b)=>GRADES.indexOf(a.grade)-GRADES.indexOf(b.grade)||norm(a.kana||a.name).localeCompare(norm(b.kana||b.name),'ja'));}
function gradeOptions(selected='',allLabel='すべての学年'){return option('',allLabel,selected)+GRADES.map(g=>option(g,g,selected)).join('');}
function attributeOptions(selected=''){let vals=[...new Set(db.students.flatMap(s=>s.attributes||[]).concat(db.catalog.flatMap(b=>b.attributes||[])))].sort();return option('','すべての属性',selected)+vals.map(v=>option(v,v,selected)).join('');}
function studentIdentity(s){return `${esc(s.grade)} ・ ${esc(s.school)} ・ ${esc(s.code)}`;}
function rememberStudent(id){db.recentStudents=[id,...(db.recentStudents||[]).filter(x=>x!==id)].slice(0,8);persist();}
function openStudentPicker(target,seat=null){extra.picker={target,seat,q:'',grade:'',classroom:'',enrollment:'在籍'};renderStudentPicker(true);}
function aux(title,body){let d=document.getElementById('picker-dialog');document.getElementById('picker-title').textContent=title;document.getElementById('picker-body').innerHTML=body;if(!d.open)d.showModal();}
function closePicker(){document.getElementById('picker-dialog').close();}
function renderStudentPicker(initial=false){let p=extra.picker;aux(p.target==='desk'?'表示する生徒を検索（担当表の登録は不要）':p.target==='report'?'報告書の対象生徒を追加':'生徒を検索',`<div class="picker-filter"><label class="field">氏名・ふりがな・生徒番号<input id="picker-q" type="search" value="${esc(p.q)}" placeholder="例：やまだ、D-001" oninput="extra.picker.q=this.value;updatePickerResults()"></label><label class="field">教室<select onchange="extra.picker.classroom=this.value;updatePickerResults()">${option('','両教室',p.classroom)+CLASSROOMS.map(x=>option(x,x,p.classroom)).join('')}</select></label><label class="field">学年<select onchange="extra.picker.grade=this.value;updatePickerResults()">${gradeOptions(p.grade)}</select></label></div><p class="mini-note">名前を検索するか、学年で絞って選びます。3人表示への追加はこの端末の表示設定だけです。</p><div id="picker-results"></div>`);updatePickerResults();if(initial)setTimeout(()=>document.getElementById('picker-q')?.focus(),80);}
function updatePickerResults(){let p=extra.picker,ss=matchStudents(p);let seats=extra.desk.seats||[];document.getElementById('picker-results').innerHTML=`<div class="filter-result">${ss.length}名 ／ 登録 ${db.students.length}名</div><div class="picker-list">${ss.map(s=>{let added=p.target==='desk'&&seats.some((x,i)=>x?.student===s.id&&i!==p.seat)||p.target==='report'&&state.report.students.includes(s.id);return `<div class="pick-row ${added?'disabled':''}"><div><div class="pick-name">${esc(s.name)}</div><div class="pick-meta">${esc(s.kana)}<br>${studentIdentity(s)}</div></div><button class="btn small ${added?'':'primary'}" ${added?'disabled':''} onclick="chooseStudent('${s.id}')">${added?'選択済み':p.target==='desk'?'表示する':p.target==='report'?'追加':'選ぶ'}</button></div>`;}).join('')||'<div class="empty">該当する生徒はいません。検索条件を変更してください。</div>'}</div>`;}
function chooseStudent(id){let p=extra.picker,s=student(id);if(!s)return;rememberStudent(id);
 if(p.target==='desk'){let i=p.seat;if(i==null)i=extra.desk.seats.findIndex(x=>!x);if(i<0){toast('3人表示は満席です。入れ替える欄の「生徒変更」から選んでください。');return;}extra.desk.seats[i]={student:id,subject:s.subjects[0]||'数学'};extra.scrolls[i]=0;storeView();closePicker();navigate('desk');}
 else if(p.target==='report'){if(!state.report.students.includes(id))state.report.students.push(id);state.report.confirmed=false;closePicker();render();}
 else if(p.target==='daily'){state.daily.student=id;closePicker();render();}
 else if(p.target==='notes'){extra.notes.student=id;closePicker();render();}
 else{closePicker();state.student=id;state.subject=s.subjects.includes(state.subject)?state.subject:s.subjects[0];state.compare.leftSubject=state.subject;state.compare.rightSubject=state.subject;render();}
}
studentbar=function(){const s=student();return `<div class="card studentbar"><div class="studentid"><div class="avatar">${esc(s.name.charAt(0))}</div><div><div class="studenttitle">${esc(s.name)} <span class="badge">架空データ</span></div><div class="studentmeta">${studentIdentity(s)}</div></div></div><div class="row"><button class="btn" onclick="openStudentPicker('profile')">${icon('search')}生徒を検索・変更</button><div class="segmented">${s.subjects.map(x=>`<button class="${state.subject===x?'on':''}" onclick="setSubject('${x}')">${x}</button>`).join('')}</div></div></div>`;};
function renderRoster(){let f=extra.roster;return head('生徒検索・登録','学年・教室・氏名で検索。授業の担当表や固定の組み合わせは登録しません。',`<button class="btn primary" onclick="openStudentForm()">${icon('plus')}生徒を登録</button>`)+`<div class="registry-toolbar"><div class="toolbar"><label class="field roster-search">氏名・ふりがな・生徒番号<input type="search" value="${esc(f.q)}" placeholder="例：やまだ、さとう、D-001" oninput="extra.roster.q=this.value;refreshRoster()"></label><label class="field">教室<select onchange="extra.roster.classroom=this.value;render()">${option('','両教室',f.classroom)+CLASSROOMS.map(x=>option(x,x,f.classroom)).join('')}</select></label><label class="field">教科<select onchange="extra.roster.subject=this.value;render()">${subjOptions(f.subject)}</select></label><label class="field">属性<select onchange="extra.roster.attribute=this.value;render()">${attributeOptions(f.attribute)}</select></label><label class="field">在籍状態<select onchange="extra.roster.enrollment=this.value;render()">${option('','すべて',f.enrollment)+['在籍','休塾','退塾'].map(x=>option(x,x,f.enrollment)).join('')}</select></label></div><div class="grade-pills">${['',...GRADES].map(g=>`<button class="${g===f.grade?'on':''}" onclick="extra.roster.grade='${g}';render()">${g?shortGrade(g):'全学年'}<small>${matchStudents({...f,q:'',grade:g}).length}</small></button>`).join('')}</div><p class="mini-note">80名の架空データを用意しています。新規登録・編集はこのブラウザだけに保存されます。</p></div><div id="roster-results">${rosterResults()}</div>`;}
function refreshRoster(){document.getElementById('roster-results').innerHTML=rosterResults();}
function rosterResults(){let ss=matchStudents(extra.roster);return `<div class="filter-result"><b>${ss.length}名</b>を表示 ／ 登録 ${db.students.length}名</div><div class="tablewrap"><table class="roster-table"><thead><tr><th>生徒・ふりがな</th><th>学年・教室</th><th>教科・属性</th><th>申し送り</th><th>操作</th></tr></thead><tbody>${ss.map(s=>{let n=db.handovers.filter(h=>h.student===s.id&&h.status==='継続').length;return `<tr><td><div class="roster-name">${esc(s.name)}</div><div class="roster-sub">${esc(s.kana)} ／ ${esc(s.code)}</div></td><td>${esc(s.grade)}<div class="roster-sub">${esc(s.school)} ／ ${esc(s.enrollment)}</div></td><td>${s.subjects.map(esc).join('・')}<div class="roster-sub">${(s.attributes||[]).map(esc).join('・')||'属性なし'}</div></td><td>${n?`<button class="badge amber" onclick="state.student='${s.id}';openNotesFor('${s.id}','全体')">継続 ${n}件</button>`:'<span class="muted small">—</span>'}</td><td><div class="row"><button class="btn small" onclick="viewStudent('${s.id}')">カルテ</button><button class="btn small primary" onclick="addStudentToDesk('${s.id}')">3人表示へ</button><button class="btn small" onclick="openStudentForm('${s.id}')">編集</button></div></td></tr>`;}).join('')||'<tr><td colspan="5"><div class="empty">条件に合う生徒がいません。</div></td></tr>'}</tbody></table></div>`;}
function viewStudent(id){state.student=id;state.subject=student(id).subjects[0];rememberStudent(id);navigate('profile');}
function addStudentToDesk(id){let occupied=extra.desk.seats.findIndex(x=>x?.student===id);if(occupied>=0){extra.desk.focus=occupied;navigate('desk');return;}let i=extra.desk.seats.findIndex(x=>!x);if(i<0){modal('入れ替える表示欄を選ぶ',`<p class="small muted mb">入力途中の内容は生徒・教科・日付ごとに残ります。担当表は作成しません。</p><div class="stack">${extra.desk.seats.map((x,i)=>`<button class="btn" onclick="replaceDeskStudent(${i},'${id}')">${i+1}人目：${esc(student(x.student).name)} と入れ替える</button>`).join('')}</div>`);}else replaceDeskStudent(i,id);}
function replaceDeskStudent(i,id){let s=student(id);extra.desk.seats[i]={student:id,subject:s.subjects[0]};extra.scrolls[i]=0;closeModal();rememberStudent(id);storeView();navigate('desk');}
function openStudentForm(id=''){let s=id?db.students.find(x=>x.id===id):null;modal(id?'生徒登録を編集':'生徒を新規登録',`<form onsubmit="saveStudentForm(event,'${id}')"><p class="mini-note mb">必要なのは生徒情報です。曜日・担当講師・授業の組み合わせは登録しません。</p><div class="form-grid"><label class="field">氏名 <span class="mark-required">必須</span><input name="name" maxlength="60" required value="${esc(s?.name||'')}" placeholder="例：デモ 太郎"></label><label class="field">ふりがな <span class="mark-required">必須</span><input name="kana" maxlength="80" required value="${esc(s?.kana||'')}" placeholder="例：でも たろう"></label><label class="field">学年<select name="grade" required>${GRADES.map(g=>option(g,g,s?.grade||'中学1年')).join('')}</select></label><label class="field">教室<select name="classroom">${CLASSROOMS.map(c=>option(c,c,s?.school||CLASSROOMS[0])).join('')}</select></label><label class="field">学校名（任意）<input name="schoolName" maxlength="80" value="${esc(s?.schoolName||'')}"></label><label class="field">生徒番号（空欄なら自動採番）<input name="code" maxlength="30" value="${esc(s?.code||'')}"></label><label class="field">在籍状態<select name="enrollment">${['在籍','休塾','退塾'].map(v=>option(v,v,s?.enrollment||'在籍')).join('')}</select><label class="field">属性（任意・読点で区切る）<input name="attributes" maxlength="160" value="${esc((s?.attributes||[]).join('、'))}" placeholder="例：学校補習、高校受験"></label></div><div class="fieldgroup mt"><div class="fieldtitle">受講教科 <span class="mark-required">1つ以上</span></div><div class="tagrow">${SUBJECTS.map(sub=>`<label class="chipcheck"><input type="checkbox" name="subjects" value="${sub}" ${(s?.subjects||[]).includes(sub)?'checked':''}>${sub}</label>`).join('')}</div></div><div class="notice info mt">連絡先・住所などはこのモックでは収集しません。退塾に変更しても、過去の授業記録や変更ログは消しません。</div><div class="formfooter"><button type="button" class="btn" onclick="closeModal()">キャンセル</button><button class="btn primary">保存する</button></div></form>`);}
function splitTags(s){return [...new Set(String(s||'').split(/[、,，\n]/).map(x=>x.trim()).filter(Boolean))];}
function saveStudentForm(e,id){e.preventDefault();let f=new FormData(e.target),old=db.students.find(s=>s.id===id),subjects=f.getAll('subjects');if(!String(f.get('name')).trim()||!String(f.get('kana')).trim()||!subjects.length){toast('氏名・ふりがな・受講教科を確認してください。');return;}let code=String(f.get('code')).trim();if(!code){let n=db.students.length+1;while(db.students.some(s=>s.code==='D-'+String(n).padStart(3,'0')))n++;code='D-'+String(n).padStart(3,'0');}if(db.students.some(s=>s.code===code&&s.id!==id)){toast('同じ生徒番号が登録済みです。別の番号にしてください。');return;}let item={...(old||{}),id:old?.id||uid('student'),name:String(f.get('name')).trim(),kana:String(f.get('kana')).trim(),grade:f.get('grade'),school:f.get('classroom'),schoolName:String(f.get('schoolName')).trim(),code,subjects,attributes:splitTags(f.get('attributes')),enrollment:f.get('enrollment'),createdAt:old?.createdAt||now(),updatedAt:now()};audit('生徒登録',item.id,'',old?'生徒情報を更新':'生徒を登録',old?clone(old):'新規',item);if(old)db.students[db.students.indexOf(old)]=item;else db.students.push(item);persist();closeModal();render();toast('生徒情報を保存しました。担当表の登録は不要です。');}

/* Textbook catalog. Grade/attribute are suggestions, not hard restrictions. */
function renderCatalog(){let f=extra.catalog;return head('よく使う教材','学年・教科・属性で候補を整理。登録していない教材も授業画面から手入力できます。',`<button class="btn primary" onclick="openBookForm()">${icon('plus')}教材を登録</button>`)+`<div class="registry-toolbar"><div class="toolbar"><label class="field roster-search">教材名<input type="search" value="${esc(f.q)}" oninput="extra.catalog.q=this.value;refreshCatalog()" placeholder="教材名の一部で検索"></label><label class="field">教科<select onchange="extra.catalog.subject=this.value;render()">${subjOptions(f.subject)}</select></label><label class="field">学年<select onchange="extra.catalog.grade=this.value;render()">${gradeOptions(f.grade)}</select></label><label class="field">属性<select onchange="extra.catalog.attribute=this.value;render()">${attributeOptions(f.attribute)}</select></label><label class="checkline"><input type="checkbox" ${f.inactive?'checked':''} onchange="extra.catalog.inactive=this.checked;render()">非表示の教材も含む</label></div><p class="mini-note">登録サンプルは説明用です。実際に採用している教材一覧ではありません。属性は「学校補習・受験対策」など、任意に設定できます。</p></div><div id="catalog-results">${catalogResults()}</div>`;}
function filteredBooks(f){return db.catalog.filter(b=>(f.inactive||b.active!==false)&&(!f.q||norm(b.title).includes(norm(f.q)))&&(!f.subject||b.subject===f.subject)&&(!f.grade||!b.grades.length||b.grades.includes(f.grade))&&(!f.attribute||!b.attributes.length||b.attributes.includes(f.attribute)));}
function catalogResults(){let bs=filteredBooks(extra.catalog);return `<div class="filter-result">${bs.length}件の教材</div><div class="tablewrap"><table><thead><tr><th>教材名</th><th>教科</th><th>対象学年</th><th>属性</th><th>操作</th></tr></thead><tbody>${bs.map(b=>`<tr><td><span class="catalog-row-title">${esc(b.title)}</span>${b.active===false?'<span class="badge">非表示</span>':''}</td><td>${esc(b.subject)}</td><td>${b.grades.map(shortGrade).map(esc).join('・')||'全学年'}</td><td>${b.attributes.map(esc).join('・')||'指定なし'}</td><td><button class="btn small" onclick="openBookForm('${b.id}')">編集</button></td></tr>`).join('')||'<tr><td colspan="5"><div class="empty">条件に合う教材はありません。</div></td></tr>'}</tbody></table></div>`;}
function refreshCatalog(){document.getElementById('catalog-results').innerHTML=catalogResults();}
function openBookForm(id=''){let b=db.catalog.find(x=>x.id===id);modal(b?'教材の登録情報を編集':'よく使う教材を登録',`<form onsubmit="saveBookForm(event,'${id}')"><div class="form-grid"><label class="field full">教材名 <span class="mark-required">必須</span><input name="title" maxlength="120" required value="${esc(b?.title||'')}"></label><label class="field">教科<select name="subject">${subjOptions(b?.subject||'数学',false)}</select></label><label class="field">属性（任意・読点で区切る）<input name="attributes" value="${esc((b?.attributes||[]).join('、'))}" placeholder="例：中学受験、学校補習" maxlength="160"></label></div><div class="fieldgroup mt"><div class="fieldtitle">対象学年 <span class="small muted">選ばない場合は全学年</span></div><div class="tagrow">${GRADES.map(g=>`<label class="chipcheck"><input type="checkbox" name="grades" value="${g}" ${b?.grades.includes(g)?'checked':''}>${shortGrade(g)}</label>`).join('')}</div></div><label class="checkline mt"><input type="checkbox" name="active" ${b?.active!==false?'checked':''}>授業の選択候補に表示する</label><p class="mini-note">教材名を変更しても、過去の授業に保存された教材名・範囲は書き換えません。</p><div class="formfooter"><button type="button" class="btn" onclick="closeModal()">キャンセル</button><button class="btn primary">保存</button></div></form>`);}
function saveBookForm(e,id){e.preventDefault();let f=new FormData(e.target),old=db.catalog.find(x=>x.id===id),title=String(f.get('title')).trim();if(!title){toast('教材名を入力してください。');return;}let item={id:old?.id||uid('book'),title,subject:f.get('subject'),grades:f.getAll('grades'),attributes:splitTags(f.get('attributes')),active:f.has('active'),updatedAt:now()};audit('教材登録','',item.subject,old?'教材情報を更新':'教材を登録',old?clone(old):'新規',item);if(old)db.catalog[db.catalog.indexOf(old)]=item;else db.catalog.push(item);persist();closeModal();render();toast('教材を保存しました。手入力も引き続き使えます。');}
function openBookPicker(token,index){captureEntry(token);let d=getEditor(token),s=student(d.student);extra.bookPicker={token,index,q:'',subject:d.subject,grade:s.grade,attribute:(s.attributes||[])[0]||'',mode:'fit'};renderBookPicker();}
function renderBookPicker(){let p=extra.bookPicker,d=getEditor(p.token),s=student(d.student);aux('教材を選ぶ｜'+s.name+'・'+d.subject,`<div class="book-filters"><label class="field">教材名<input type="search" value="${esc(p.q)}" oninput="extra.bookPicker.q=this.value;updateBookPicker()" placeholder="教材名の一部"></label><label class="field">学年<select onchange="extra.bookPicker.grade=this.value;updateBookPicker()">${gradeOptions(p.grade)}</select></label><label class="field">教科<select onchange="extra.bookPicker.subject=this.value;updateBookPicker()">${subjOptions(p.subject)}</select></label><label class="field">属性<select onchange="extra.bookPicker.attribute=this.value;updateBookPicker()">${attributeOptions(p.attribute)}</select></label></div><div class="row between mt mb"><span class="small muted">学年・属性の指定なしの教材も表示します。</span><button class="btn small" onclick="extra.bookPicker.grade='';extra.bookPicker.attribute='';extra.bookPicker.subject='';renderBookPicker()">すべての教材を見る</button></div><div id="book-picker-results"></div><p class="mini-note">候補になければ、この画面を閉じて教材名を直接入力できます。</p>`);updateBookPicker();}
function updateBookPicker(){let p=extra.bookPicker,d=getEditor(p.token),recent=records(d.student,{subject:d.subject,sort:'desc'}).flatMap(l=>l.materials||[]).map(m=>m.catalogId),bs=filteredBooks({...p,inactive:false}).sort((a,b)=>Number(recent.includes(b.id))-Number(recent.includes(a.id))||a.title.localeCompare(b.title,'ja'));document.getElementById('book-picker-results').innerHTML=`<div class="filter-result">${bs.length}件の候補 ／ 最近使った教材を優先</div><div class="picker-list">${bs.map(b=>`<div class="pick-row"><div><div class="material-candidate">${recent.includes(b.id)?'<span class="book-badge">最近使用</span>':''}${esc(b.title)}</div><div class="pick-meta">${b.subject} ／ ${b.grades.map(shortGrade).join('・')||'全学年'} ／ ${b.attributes.map(esc).join('・')||'属性指定なし'}</div></div><button class="btn small primary" onclick="chooseBook('${b.id}')">選ぶ</button></div>`).join('')||'<div class="empty">候補はありません。条件を広げるか、教材名を直接入力してください。</div>'}</div>`;}
function chooseBook(id){let p=extra.bookPicker,d=getEditor(p.token),b=db.catalog.find(x=>x.id===id);if(!d||!b)return;let row=d.materials[p.index];if(!row)return;row.name=b.title;row.catalogId=b.id;touchDraft(d);persist();closePicker();refreshEditor(p.token);toast('教材名を反映しました。今回の範囲を入力してください。');}

/* Persistent handovers. Acknowledgement is NOT resolution. Parent reports never use these records. */
function relevantHandovers(sid,sub){return db.handovers.filter(h=>h.student===sid&&h.status==='継続'&&(h.subject==='全体'||h.subject===sub||sub==='全体')).sort((a,b)=>Number(b.priority==='重要')-Number(a.priority==='重要')||b.updatedAt.localeCompare(a.updatedAt));}
function unread(h){return !h.readBy?.[state.actor]||h.readBy[state.actor]<h.updatedAt;}
function handoverStrip(sid,sub,compact=false){let hs=relevantHandovers(sid,sub);return `<section data-hsid="${sid}" data-hsub="${sub}" class="handover-strip ${hs.length?'':'empty-notes'}"><div class="strip-head"><span>申し送り・特記事項 <span class="badge ${hs.length?'amber':''}">${hs.length}件</span></span><button class="btn text small" onclick="openHandoverForm('', '${sid}', '${sub}')">＋追加</button></div>${hs.length?hs.map(h=>`<div class="note-item"><div class="row"><span class="badge ${h.priority==='重要'?'amber':''}">${h.priority==='重要'?'重要':esc(h.subject)}</span>${unread(h)?'<span class="tiny"><i class="unread-dot"></i>未確認</span>':'<span class="tiny muted">確認済み・対応継続</span>'}</div><p class="note-preview">${esc(h.text)}</p><div class="note-meta">${stamp(h.createdAt)} ／ ${esc(h.author)} ／ ${esc(h.subject)}</div><div class="note-controls"><button onclick="ackHandover('${h.id}')" ${unread(h)?'':'disabled'}>内容を確認</button><button onclick="setHandoverStatus('${h.id}','対応済み')">対応済みにする</button><button onclick="openHandoverForm('${h.id}')">編集</button></div></div>`).join(''):'<div class="tiny muted">継続中の申し送りはありません。</div>'}<div class="note-meta" style="margin-top:7px">内部共有のみ・保護者用の報告書には載りません。</div></section>`;}
function refreshPreservingDesk(){if(state.page==='desk'){extra.scrolls=extra.desk.seats.map((_,i)=>document.getElementById('desk-scroll-'+i)?.scrollTop||0);}render();document.querySelectorAll('#modal .handover-strip[data-hsid]').forEach(el=>{el.outerHTML=handoverStrip(el.dataset.hsid,el.dataset.hsub);});}
function ackHandover(id){let h=db.handovers.find(x=>x.id===id);if(!h)return;let before={id:h.id,readBy:clone(h.readBy||{})};h.readBy ||= {};h.readBy[state.actor]=now();audit('申し送り',h.student,h.subject,'申し送りの内容を確認（継続表示）',before,{id:h.id,readBy:clone(h.readBy)});persist();refreshPreservingDesk();toast('確認を記録しました。対応済みにするまで表示を続けます。');}
function setHandoverStatus(id,status){let h=db.handovers.find(x=>x.id===id);if(!h||h.status===status)return;let before=clone(h);h.status=status;h.updatedAt=now();h.updatedBy=state.actor;if(status==='対応済み'){h.completedAt=now();h.completedBy=state.actor;}else{delete h.completedAt;delete h.completedBy;}audit('申し送り',h.student,h.subject,status==='対応済み'?'申し送りを対応済みに変更':'申し送りを継続へ戻す',before,clone(h));persist();refreshPreservingDesk();toast(status==='対応済み'?'対応済みとして履歴に残しました。':'継続中の申し送りに戻しました。');}
function openHandoverForm(id='',sid=state.student,sub=state.subject){let h=db.handovers.find(x=>x.id===id);sid=h?.student||sid;sub=h?.subject||sub;let s=student(sid);modal(h?'申し送りを編集':'申し送り・特記事項を追加',`<form onsubmit="saveHandoverForm(event,'${id}','${sid}')"><div class="notice info mb"><b>${esc(s.name)} ／ ${esc(s.grade)}</b><br>授業の所見・次回の学習内容とは別の、講師・教室長向けの連絡です。</div><div class="form-grid"><label class="field">表示する範囲<select name="subject">${['全体',...s.subjects].map(x=>option(x,x==='全体'?'教科共通（すべての授業）':x,sub)).join('')}</select></label><label class="field">重要度<select name="priority">${['通常','重要'].map(x=>option(x,x,h?.priority||'通常')).join('')}</select></label></div><label class="field mt">申し送り内容 <span class="mark-required">必須</span><textarea name="text" rows="5" maxlength="2000" required placeholder="例：次回、テスト範囲表を受け取って教室長へ共有。">${esc(h?.text||'')}</textarea></label><p class="mini-note">「内容を確認」だけでは消えません。「対応済み」にするまで、生徒の授業欄に表示します。編集前の内容も変更ログに残します。</p><div class="formfooter"><button type="button" class="btn" onclick="closeModal()">キャンセル</button><button class="btn primary">保存して表示</button></div></form>`);}
function saveHandoverForm(e,id,sid){e.preventDefault();let f=new FormData(e.target),text=String(f.get('text')).trim();if(!text){toast('内容を入力してください。');return;}let old=db.handovers.find(x=>x.id===id),item={...(old||{}),id:old?.id||uid('handover'),student:sid,subject:f.get('subject'),text,priority:f.get('priority'),status:old?.status||'継続',author:old?.author||state.actor,createdAt:old?.createdAt||now(),updatedAt:now(),updatedBy:state.actor,readBy:old?.readBy||{}};audit('申し送り',sid,item.subject,old?'申し送りを編集':'申し送りを追加',old?clone(old):'新規',item);if(old)db.handovers[db.handovers.indexOf(old)]=item;else db.handovers.push(item);persist();closeModal();refreshPreservingDesk();toast('申し送りを保存しました。内部共有として表示します。');}
function openNotesFor(sid,sub){extra.notes.student=sid;extra.notes.subject=sub==='全体'?'':sub;extra.notes.status='';navigate('notes');}
function renderHandovers(){let f=extra.notes;return head('申し送り・特記事項','確認しただけでは消さず、対応済みになるまで表示。完了後も履歴を残します。')+`<div class="registry-toolbar"><div class="toolbar"><label class="field roster-search">内容・記入者・生徒名<input type="search" value="${esc(f.q)}" oninput="extra.notes.q=this.value;refreshHandovers()" placeholder="例：教材、範囲表"></label><label class="field">状態<select onchange="extra.notes.status=this.value;render()">${option('','すべて',f.status)+['継続','対応済み'].map(x=>option(x,x,f.status)).join('')}</select></label><label class="field">教科<select onchange="extra.notes.subject=this.value;render()">${subjOptions(f.subject,true,['全体',...SUBJECTS])}</select></label><label class="field">重要度<select onchange="extra.notes.priority=this.value;render()">${option('','すべて',f.priority)+['通常','重要'].map(x=>option(x,x,f.priority)).join('')}</select></label><button class="btn" onclick="openStudentPicker('notes')">${f.student?esc(student(f.student).name):'生徒で絞る'}</button>${f.student?'<button class="btn text" onclick="extra.notes.student=\'\';render()">解除</button>':''}</div></div><div id="handover-results">${handoverResults()}</div>`;}
function refreshHandovers(){document.getElementById('handover-results').innerHTML=handoverResults();}
function handoverResults(){let f=extra.notes,hs=db.handovers.filter(h=>(!f.status||h.status===f.status)&&(!f.subject||h.subject===f.subject||h.subject==='全体')&&(!f.student||h.student===f.student)&&(!f.priority||h.priority===f.priority)&&(!f.q||norm([h.text,h.author,student(h.student).name].join(' ')).includes(norm(f.q)))).sort((a,b)=>Number(a.status==='対応済み')-Number(b.status==='対応済み')||Number(b.priority==='重要')-Number(a.priority==='重要')||b.updatedAt.localeCompare(a.updatedAt));return `<div class="filter-result">${hs.length}件 ／ 内部向けの連絡</div>`+hs.map(h=>`<article class="note-list-card ${h.priority==='重要'?'important':''} ${h.status==='対応済み'?'done':''}"><div class="row between mb"><div class="row"><b>${esc(student(h.student).name)}</b><span class="badge blue">${esc(h.subject)}</span><span class="badge ${h.status==='継続'?'amber':'green'}">${h.status}</span>${h.priority==='重要'?'<span class="badge amber">重要</span>':''}</div><button class="btn small" onclick="viewStudent('${h.student}')">カルテへ</button></div><p>${esc(h.text)}</p><div class="note-meta mt">記入：${stamp(h.createdAt)} ／ ${esc(h.author)}<br>更新：${stamp(h.updatedAt)} ／ ${esc(h.updatedBy||h.author)}${h.completedAt?'<br>対応済み：'+stamp(h.completedAt)+' ／ '+esc(h.completedBy):''}</div><div class="note-controls">${h.status==='継続'?`<button onclick="ackHandover('${h.id}')" ${unread(h)?'':'disabled'}>${unread(h)?'内容を確認':'確認済み（継続表示）'}</button><button onclick="setHandoverStatus('${h.id}','対応済み')">対応済みにする</button>`:`<button onclick="setHandoverStatus('${h.id}','継続')">継続に戻す</button>`}<button onclick="openHandoverForm('${h.id}')">編集</button><button onclick="showHandoverAudit('${h.id}')">変更履歴</button></div></article>`).join('')+(hs.length?'':'<div class="empty">この条件の申し送りはありません。</div>');}
function showHandoverAudit(id){let hs=db.audit.filter(a=>a.type==='申し送り'&&[a.before?.id,a.after?.id].includes(id));modal('申し送りの変更履歴',hs.length?hs.map(auditCard).join(''):'<div class="empty">このデモの初期データには変更履歴はありません。</div>');}

/* Three independent draft editors, no timetable or roster assignments. */
function draftKey(sid,sub,date,slot,teacher){return [sid,sub,date,slot,teacher].join('|');}
function blankMaterial(){return {id:uid('mat'),name:'',catalogId:'',pages:'',content:'',homework:''};}
function asMaterials(l){if(Array.isArray(l?.materials)&&l.materials.length)return clone(l.materials);return [{...blankMaterial(),name:l?.material||'',pages:l?.pages||'',content:''}];}
function blankDraft(sid,sub,date,slot,teacher){return {id:'',student:sid,subject:sub,date,slot,teacher,unit:'',materials:[blankMaterial()],mode:'同範囲',level:null,stumbles:[],tags:[],obs:'',next:'',homework:'',homeworkDone:'確認できていない',correct:null,total:null,internal:'',plan:'',handoverText:'',handoverPriority:'通常',handoverScope:sub,status:'下書き',_dirty:false};}
function draftFrom(l){return {...clone(l),materials:asMaterials(l),homework:l.homeworkNote??l.homework,_dirty:false};}
function deskDraft(i){let seat=extra.desk.seats[i];if(!seat)return null;let w=extra.desk,key=draftKey(seat.student,seat.subject,w.date,w.slot,w.teacher);if(!db.deskDrafts[key]){let l=db.lessons.find(l=>l.student===seat.student&&l.subject===seat.subject&&l.date===w.date&&l.slot===w.slot&&l.teacher===w.teacher);db.deskDrafts[key]=l?draftFrom(l):blankDraft(seat.student,seat.subject,w.date,w.slot,w.teacher);}let saved=db.deskDrafts[key];if(saved.id&&!saved._dirty){let current=db.lessons.find(l=>l.id===saved.id);if(current&&(current.updatedAt!==saved.updatedAt||current.status!==saved.status))db.deskDrafts[key]=draftFrom(current);}return db.deskDrafts[key];}
function getEditor(token){return token==='modal'?extra.modalDraft:deskDraft(Number(token.replace('ws','')));}
function editorRoot(token){return document.querySelector(`[data-editor="${token}"]`);}
function touchDraft(d){d._dirty=true;d._draftAt=now();}
function captureEntry(token){let d=getEditor(token),root=editorRoot(token);if(!d||!root)return d;let f=new FormData(root);let scalar=['unit','mode','obs','next','homework','homeworkDone','internal','plan','handoverText','handoverPriority','handoverScope'];scalar.forEach(k=>{if(f.has(k))d[k]=String(f.get(k));});d.level=f.get('level')===''?null:Number(f.get('level'));d.correct=f.get('correct')===''||!f.has('correct')?null:Number(f.get('correct'));d.total=f.get('total')===''||!f.has('total')?null:Number(f.get('total'));d.stumbles=f.getAll('stumbles');d.tags=f.getAll('tags');let rows=[...root.querySelectorAll('[data-mat-index]')];d.materials=rows.map(row=>{let j=Number(row.dataset.matIndex),old=d.materials[j]||blankMaterial();let m={...old};['name','pages','content','homework'].forEach(k=>{m[k]=row.querySelector(`[data-mat-field="${k}"]`)?.value||'';});if(m.name!==old.name){m.catalogId='';delete m.sourcePages;}return m;});touchDraft(d);if(token==='modal'&&extra.modalKey)db.deskDrafts[extra.modalKey]=d;persist();let st=document.getElementById('draft-state-'+token);if(st)st.textContent=storageOK?'入力途中をこの端末に保存しました ／ まだ報告していません':'保存できませんでした。画面を閉じず、データを書き出してください。';return d;}
function prevLesson(d){return db.lessons.filter(l=>l.student===d.student&&l.subject===d.subject&&l.id!==d.id&&l.status!=='下書き'&&(l.date<d.date||l.date===d.date&&['A','B','C','D'].indexOf(l.slot)<['A','B','C','D'].indexOf(d.slot))).sort((a,b)=>b.date.localeCompare(a.date)||b.slot.localeCompare(a.slot)||(b.updatedAt||'').localeCompare(a.updatedAt||''))[0];}
function currentHomework(d){let parts=(d.materials||[]).filter(m=>m.homework?.trim()).map(m=>`${m.name||'教材'}：${m.homework.trim()}`);if(d.homework?.trim())parts.push(d.homework.trim());return parts.join('\n');}
function materialsText(l,includeHomework=false){return asMaterials(l).filter(m=>m.name.trim()).map(m=>`${m.name}${m.pages?' ／ '+m.pages:''}${m.content?' ／ '+m.content:''}${includeHomework&&m.homework?' ／ 宿題 '+m.homework:''}`).join('\n');}
function renderDesk(){let w=extra.desk,n=w.seats.filter(Boolean).length;return head('授業・3人表示','検索して並べるだけ。担当表の事前登録は不要です。',`<button class="btn small" onclick="extra.desk.focus=-1;storeView();render()">3人を均等表示</button><button class="btn small" onclick="navigate('roster')">生徒検索・登録</button>`)+`<div class="desk-toolbar"><label class="field">授業日<input type="date" value="${w.date}" onchange="setDeskMeta('date',this.value)" required></label><label class="field">コマ<select onchange="setDeskMeta('slot',this.value)">${['A','B','C','D'].map(x=>option(x,x+'コマ',w.slot)).join('')}</select></label><label class="field">記録する担当講師<select onchange="setDeskMeta('teacher',this.value)">${teacherOptions(w.teacher,false)}</select></label><span class="badge green">${n} / 3人を表示</span><span class="desk-caption">各欄を別々にスクロール・入力できます</span></div><div class="desk-grid ${w.focus>=0?'focused focus-'+w.focus:''}">${[0,1,2].map(renderDeskSeat).join('')}</div><p class="desk-note">初期の3名は操作用サンプルです。生徒の入れ替えは表示だけを変更し、記録・入力途中の内容は生徒ごとに残ります。</p>`;}
function setDeskMeta(k,v){if(k==='date'&&!/^\d{4}-\d{2}-\d{2}$/.test(v)){toast('有効な授業日を選んでください。');render();return;}extra.desk[k]=v;extra.scrolls=[0,0,0];storeView();render();}
function setDeskSubject(i,sub){extra.desk.seats[i].subject=sub;extra.scrolls[i]=0;storeView();render();}
function removeDeskSeat(i){extra.desk.seats[i]=null;extra.scrolls[i]=0;if(extra.desk.focus===i)extra.desk.focus=-1;storeView();render();toast('表示から外しました。記録と入力途中の内容は残っています。');}
function focusSeat(i){extra.desk.focus=extra.desk.focus===i?-1:i;storeView();refreshPreservingDesk();}
function renderDeskSeat(i){let seat=extra.desk.seats[i];if(!seat)return `<section class="desk-panel slot-${i}"><div class="desk-top"><b>${i+1}人目</b></div><div class="desk-empty"><div class="empty-index">0${i+1}</div><h3>生徒を検索して表示</h3><p class="small muted" style="text-align:center">学年・教室・氏名から選択。<br>担当表は登録しません。</p><button class="btn primary" onclick="openStudentPicker('desk',${i})">${icon('search')}生徒を検索</button></div></section>`;let s=student(seat.student),d=deskDraft(i),prev=prevLesson(d),pol=policy(seat.subject,s.id),gen=policy('全体',s.id);return `<section class="desk-panel slot-${i} ${extra.desk.focus===i?'is-focused':''}" id="desk-seat-${i}"><header class="desk-top"><div class="row between"><div><div class="tiny muted">${i+1}人目 ／ ${esc(s.grade)} ・ ${esc(s.school)}</div><div class="pupil">${esc(s.name)}</div></div><select class="subject-choice" aria-label="${esc(s.name)}の教科" onchange="setDeskSubject(${i},this.value)">${subjOptions(seat.subject,false,[...new Set([...s.subjects,seat.subject])])}</select></div><div class="row between" style="margin-top:6px"><span class="tiny muted">${esc(s.code)} ／ 架空データ</span><div class="desk-actions"><button onclick="focusSeat(${i})">${extra.desk.focus===i?'戻す':'広げる'}</button><button onclick="openStudentPicker('desk',${i})">生徒変更</button><button title="表示から外す" aria-label="${esc(s.name)}を表示から外す" onclick="removeDeskSeat(${i})">×</button></div></div></header><div class="desk-scroll" id="desk-scroll-${i}" onscroll="extra.scrolls[${i}]=this.scrollTop">${handoverStrip(s.id,seat.subject,true)}<div class="section-mini"><span>指導方針</span><button class="btn text small" onclick="editDeskPolicy(${i})">編集</button></div><div class="desk-policy">${esc(pol?.text||gen?.text||'指導方針は未設定です。')}<details style="margin-top:6px"><summary class="tiny muted">全体の方針・履歴</summary><p style="margin-top:5px">${esc(gen?.text||'未設定')}</p><button class="btn text small" onclick="openDeskPolicyHistory(${i})">変更履歴を見る</button></details></div>${renderPrevious(d,prev,'ws'+i)}<div id="entry-host-ws${i}">${renderEntry(d,'ws'+i)}</div><div class="row between mt"><button class="btn text small" onclick="viewStudent('${s.id}')">スキルカルテ ›</button><button class="btn text small" onclick="deskHistory(${i})">過去の授業を確認 ›</button></div></div></section>`;}
function editDeskPolicy(i){let seat=extra.desk.seats[i];state.student=seat.student;state.subject=seat.subject;openPolicy();}
function openDeskPolicyHistory(i){let seat=extra.desk.seats[i];state.student=seat.student;state.subject=seat.subject;showPolicyHistory();}
function deskHistory(i){let seat=extra.desk.seats[i],ls=records(seat.student,{subject:seat.subject,sort:'desc'});modal('授業履歴｜'+student(seat.student).name+'・'+seat.subject,`<p class="small muted mb">他の2人の入力途中の内容は保持しています。</p>${ls.map(l=>lessonCard(l)).join('')||'<div class="empty">授業記録はまだありません。</div>'}`);}
function renderPrevious(d,prev,token){if(!prev)return '<div class="reference-box"><span class="ref-label">前回の授業</span>同じ教科の過去の報告はありません。</div>';return `<section class="reference-box"><div class="row between"><b>前回 ${fmt(prev.date)} ${prev.slot}コマ</b><span class="badge blue">${esc(prev.subject)}</span></div><span class="tiny muted">${esc(prev.teacher)} ／ ${prev.level==null?'未評価':'到達度 '+prev.level+'/4'}</span><p><span class="ref-label">所見</span>${esc(prev.obs)}</p><p><span class="ref-label">次回の取り組み → 今回の参考</span>${esc(prev.next)}</p><p><span class="ref-label">確認する宿題</span>${esc(prev.homework)}</p><details style="margin-top:8px"><summary>前回使った教材・範囲</summary>${asMaterials(prev).map(m=>`<div class="previous-material"><span>${esc(m.name)}</span><span>${esc(m.pages||'範囲未入力')}</span></div>`).join('')}</details><div class="row" style="margin-top:9px;gap:6px"><button class="btn small" type="button" onclick="copyPrevious('${token}','materials')">前回の教材セットを使う</button><button class="btn small" type="button" onclick="copyPrevious('${token}','plan')">次回方針を今回の予定へ</button></div></section>`;}
function renderEntry(d,token){let materialRows=asMaterials(d);d.materials=materialRows;return `<form data-editor="${token}" class="entry-fields" onsubmit="event.preventDefault();submitEntry('${token}','report')"><div class="draft-state" id="draft-state-${token}">${d._dirty?'入力途中をこの端末に保存済み ／ 報告前':d.id?'保存済みの授業記録：'+esc(d.status):'今回の記録 ／ 入力はこの端末に自動保存'}</div><label class="field">今回の予定 <span class="field-hint">任意・前回から反映可能</span><textarea name="plan" rows="2" placeholder="今回取り組む予定">${esc(d.plan||'')}</textarea></label><label class="field mt">学習した内容・到達度の評価対象 <span class="mark-required">報告時は必須</span><input name="unit" value="${esc(d.unit)}" placeholder="例：一次関数・変化の割合" maxlength="240"></label><div class="record-scope"><div class="row between"><b>使用教材・範囲</b><span class="tiny muted">複数登録可</span></div>${materialRows.map((m,j)=>renderMaterialRow(m,j,token)).join('')}<button type="button" class="btn small" onclick="addMaterial('${token}')">＋ 教材を追加</button><div class="field-hint" style="margin-top:7px">教材名は手入力、または候補から選択できます。</div></div><div class="fieldgroup"><div class="fieldtitle">今回の到達度 <span class="tiny muted">上の評価対象について</span></div><div class="radio-list">${['4','3','2','1',''].map(v=>`<label class="radioitem"><input type="radio" name="level" value="${v}" ${String(d.level??'')===v?'checked':''}>${v?v+'：':'未評価：'}${LEVELS[v]}</label>`).join('')}</div></div><label class="field">授業の様子・できたこと・支援の効果 <span class="mark-required">報告時は必須</span><textarea name="obs" rows="3" placeholder="具体的にできたことや、理解につながった支援を短く。">${esc(d.obs)}</textarea></label><label class="field mt">次回の指導内容 <span class="mark-required">報告時は必須</span><textarea name="next" rows="2" placeholder="次に何を、どう確認するか">${esc(d.next)}</textarea></label><div class="form-grid mt"><label class="field">前回の宿題の実施<select name="homeworkDone">${['実施','一部実施','未実施','確認できていない'].map(x=>option(x,x,d.homeworkDone)).join('')}</select></label><label class="field">授業進度<select name="mode">${['復習','同範囲','予習'].map(x=>option(x,x,d.mode)).join('')}</select></label></div><label class="field mt">今回の宿題・取り組み方 <span class="field-hint">教材行への記入でも可。出さない場合「なし」</span><textarea name="homework" rows="2" placeholder="範囲・量・取り組み方">${esc(d.homework)}</textarea></label><div class="note-new"><div class="fieldtitle">今回の申し送り・特記事項 <span class="tiny">内部向け</span></div><textarea name="handoverText" rows="2" placeholder="例：次回テスト範囲表を受け取り、教室長へ共有してください。">${esc(d.handoverText||'')}</textarea><div class="form-grid" style="margin-top:7px"><label class="field">表示範囲<select name="handoverScope">${['全体',d.subject].map(x=>option(x,x==='全体'?'教科共通':x,d.handoverScope||d.subject)).join('')}</select></label><label class="field">重要度<select name="handoverPriority">${['通常','重要'].map(x=>option(x,x,d.handoverPriority||'通常')).join('')}</select></label></div><p class="field-hint" style="margin-top:7px">下の保存・報告ボタンで申し送り欄へ反映。対応済みになるまで表示します。保護者用には掲載しません。</p></div><details class="compact-details"><summary>つまずき・見つけた良さ・確認問題</summary><div class="fieldgroup"><div class="fieldtitle">つまずき（複数選択）</div><div class="tagrow">${STUMBLES.map(x=>`<label class="chipcheck"><input type="checkbox" name="stumbles" value="${x}" ${(d.stumbles||[]).includes(x)?'checked':''}>${x}</label>`).join('')}</div></div><div class="fieldgroup"><div class="fieldtitle">見つけた良さ（任意）</div><div class="tagrow">${TAGS.map(x=>`<label class="chipcheck"><input type="checkbox" name="tags" value="${x}" ${(d.tags||[]).includes(x)?'checked':''}>${x}</label>`).join('')}</div></div><div class="form-grid"><label class="field">正答数<input type="number" name="correct" min="0" step="1" value="${d.correct??''}"></label><label class="field">出題数<input type="number" name="total" min="1" step="1" value="${d.total??''}"></label></div><label class="field mt">この授業だけの内部メモ<textarea name="internal" rows="2" placeholder="継続して表示したい連絡は、上の「申し送り」に記入。">${esc(d.internal||'')}</textarea></label></details><div class="sticky-save"><div class="formfooter"><button type="button" class="btn" onclick="submitEntry('${token}','draft')">下書き保存</button><button type="button" class="btn primary" onclick="submitEntry('${token}','report')">保存して教室長に報告</button></div><p class="field-hint" style="margin-top:6px">${d.status==='確認済み'?'修正すると再確認の対象になります。':'終業時の口頭報告は継続します。'}</p></div></form>`;}
function renderMaterialRow(m,j,token){return `<div class="material-row" data-mat-index="${j}"><div class="mat-heading"><b>教材 ${j+1}</b><div class="row" style="gap:5px"><button type="button" class="btn small" onclick="openBookPicker('${token}',${j})">候補から選ぶ</button><button type="button" class="btn text small" aria-label="教材${j+1}を削除" onclick="removeMaterial('${token}',${j})">×</button></div></div><div class="mat-fields"><label class="field">教材名<input data-mat-field="name" value="${esc(m.name)}" placeholder="手入力できます" maxlength="140"></label><label class="field">ページ・問題番号<input data-mat-field="pages" value="${esc(m.pages)}" placeholder="例：p.42〜43" maxlength="160"></label><label class="field">この教材の宿題<input data-mat-field="homework" value="${esc(m.homework)}" placeholder="任意" maxlength="300"></label></div><details class="material-extra" ${m.content?'open':''}><summary>教材ごとの学習内容（任意）</summary><input data-mat-field="content" value="${esc(m.content)}" style="width:100%;margin-top:5px" aria-label="教材${j+1}の学習内容" placeholder="例：変化の割合" maxlength="200"></details>${m.sourcePages?`<div class="source-hint"><span>前回：${esc(m.sourcePages)}</span><button type="button" class="btn text small" onclick="reuseRange('${token}',${j})">同じ範囲を使う</button></div>`:''}</div>`;}
function refreshEditor(token){if(token==='modal'){let host=document.getElementById('modal-entry-host');if(host)host.innerHTML=renderEntry(getEditor(token),token);}else{let i=Number(token.slice(2)),host=document.getElementById('entry-host-'+token),scroll=document.getElementById('desk-scroll-'+i),old=scroll?.scrollTop||0;if(host)host.innerHTML=renderEntry(getEditor(token),token);if(scroll)scroll.scrollTop=old;}}
function addMaterial(token){let d=captureEntry(token);if(!d)return;d.materials.push(blankMaterial());persist();refreshEditor(token);}
function removeMaterial(token,index){let d=captureEntry(token);if(!d)return;let m=d.materials[index];if((m.name||m.pages||m.homework)&&!confirm('この教材行を今回の入力から外します。よろしいですか？'))return;d.materials.splice(index,1);if(!d.materials.length)d.materials=[blankMaterial()];touchDraft(d);persist();refreshEditor(token);}
function reuseRange(token,j){let d=captureEntry(token),m=d.materials[j];if(m.pages&&m.pages!==m.sourcePages&&!confirm('今回の範囲を前回と同じ範囲で置き換えますか？'))return;m.pages=m.sourcePages||'';touchDraft(d);persist();refreshEditor(token);}
function copyPrevious(token,kind){let d=captureEntry(token),p=prevLesson(d);if(!p){toast('引き継げる前回の記録がありません。');return;}if(kind==='materials'){if(d.materials.some(m=>m.name||m.pages||m.homework)&&!confirm('今回の教材欄を前回の教材セットで置き換えます。所見・評価は変更しません。よろしいですか？'))return;d.materials=asMaterials(p).map(m=>({...blankMaterial(),catalogId:m.catalogId||'',name:m.name,sourcePages:m.pages,sourceLessonId:p.id}));}else{if(d.plan?.trim()&&!confirm('今回の予定を前回の次回方針で置き換えますか？'))return;d.plan=p.next;}d.copySourceId=p.id;touchDraft(d);persist();refreshEditor(token);toast(kind==='materials'?'教材名を引き継ぎました。今回の範囲・宿題は新しく入力してください。':'前回の次回方針を「今回の予定」に反映しました。');}
function syncLessonHandover(d,item){let text=(d.handoverText||'').trim();if(!text)return;let old=d.handoverId?db.handovers.find(h=>h.id===d.handoverId):null;let source=d.id?db.lessons.find(l=>l.id===d.id):null;if(old&&source&&text===(source.handoverText||'').trim()&&d.handoverScope===source.handoverScope&&d.handoverPriority===source.handoverPriority){item.handoverId=old.id;return;}if(old&&old.text===text&&old.subject===d.handoverScope&&old.priority===d.handoverPriority){item.handoverId=old.id;return;}let h={...(old||{}),id:old?.id||uid('handover'),student:d.student,subject:d.handoverScope||d.subject,text,priority:d.handoverPriority||'通常',status:old?.status||'継続',author:old?.author||state.actor,createdAt:old?.createdAt||now(),updatedAt:now(),updatedBy:state.actor,readBy:old?.readBy||{},originLessonId:item.id};audit('申し送り',d.student,h.subject,old?'授業記録の申し送りを更新':'授業記録から申し送りを追加',old?clone(old):'新規',h);if(old)db.handovers[db.handovers.indexOf(old)]=h;else db.handovers.push(h);d.handoverId=h.id;item.handoverId=h.id;}
function submitEntry(token,intent){let d=captureEntry(token);if(!d)return;let root=editorRoot(token);root?.querySelectorAll('.save-error').forEach(el=>el.classList.remove('save-error'));let missing=[];if(intent==='report'){[['unit','学習内容'],['obs','授業の様子・所見'],['next','次回の指導内容']].forEach(([k,label])=>{if(!String(d[k]||'').trim()){missing.push(label);let el=root?.querySelector(`[name="${k}"]`);el?.classList.add('save-error');}});if(!currentHomework(d)){missing.push('今回の宿題（なしでも可）');root?.querySelector('[name="homework"]')?.classList.add('save-error');}}if(missing.length){toast('報告前に入力してください：'+missing.join('、'));root?.querySelector('.save-error')?.focus();return;}let c=d.correct,t=d.total;if((c===null)!==(t===null)||c!==null&&(!Number.isInteger(c)||!Number.isInteger(t)||c<0||t<1||c>t)){toast('正答数と出題数は整数で両方入力し、正答数を出題数以下にしてください。');return;}if(d.materials.some(m=>!m.name.trim()&&(m.pages.trim()||m.homework.trim()||m.content.trim()))){toast('ページ・宿題を入力した教材には、教材名も入力してください。');return;}
 let old=d.id?db.lessons.find(l=>l.id===d.id):null;if(!old){let dup=db.lessons.find(l=>l.student===d.student&&l.subject===d.subject&&l.date===d.date&&l.slot===d.slot&&l.teacher===d.teacher);if(dup){toast('同じ生徒・教科・日付・コマの記録が既にあります。履歴から既存の記録を開いてください。');return;}}
 let mats=d.materials.filter(m=>m.name.trim()).map(m=>({id:m.id||uid('mat'),catalogId:m.catalogId||'',name:m.name.trim(),pages:m.pages.trim(),content:m.content.trim(),homework:m.homework.trim()}));
 let item={...clone(d),id:old?.id||uid('lesson'),materials:mats,unit:d.unit.trim(),obs:d.obs.trim(),next:d.next.trim(),homework:currentHomework(d),homeworkNote:d.homework.trim(),material:mats.map(m=>m.name).join('／'),pages:mats.map(m=>m.pages).filter(Boolean).join('／'),status:intent==='report'?'報告済み':'下書き',createdAt:old?.createdAt||now(),updatedAt:now()};delete item._dirty;delete item._draftAt;delete item.reviewedAt;delete item.reviewedBy;
 syncLessonHandover(d,item);audit('授業記録',d.student,d.subject,old?'授業記録を更新':'授業記録を作成',old?lessonText(old):'新規',lessonText(item));if(old)db.lessons[db.lessons.indexOf(old)]=item;else db.lessons.push(item);
 // Preserve editor-specific material homework separately from the combined report string.
 const fresh=draftFrom(item);fresh.homework=item.homeworkNote;let key=draftKey(d.student,d.subject,d.date,d.slot,d.teacher);db.deskDrafts[key]=fresh;
 if(token==='modal'){extra.modalDraft=fresh;closeModal();}persist();refreshPreservingDesk();toast(intent==='report'?'保存して教室長の確認待ちにしました。':'下書きを保存しました。申し送りも内部欄へ反映しています。');}
openLesson=function(id=''){let l=id?db.lessons.find(x=>x.id===id):null;if(id&&!l){toast('授業記録が見つかりません。');return;}let sid=l?.student||state.student,sub=l?.subject||state.subject,teacher=l?.teacher||(state.actor.includes('講師')?state.actor:'講師 A（デモ）'),date=l?.date||TODAY,slot=l?.slot||'B';let key=draftKey(sid,sub,date,slot,teacher);extra.modalKey=key;extra.modalDraft=db.deskDrafts[key]||(l?draftFrom(l):blankDraft(sid,sub,date,slot,teacher));if(l&&!extra.modalDraft._dirty)extra.modalDraft=draftFrom(l);if(extra.modalDraft.homeworkNote!==undefined)extra.modalDraft.homework=extra.modalDraft.homeworkNote;db.deskDrafts[key]=extra.modalDraft;let d=extra.modalDraft,s=student(sid);modal((id?'授業記録の詳細・編集':'授業を記録')+'｜'+s.name+'・'+sub,`<div class="notice info mb">${esc(s.name)} ／ ${esc(sub)} ／ ${fmt(date)} ${slot}コマ ／ ${esc(teacher)}<br>学習記録は生徒・教科ごとに保存します。教材は複数入力できます。</div>${handoverStrip(sid,sub)}${renderPrevious(d,prevLesson(d),'modal')}<div id="modal-entry-host">${renderEntry(d,'modal')}</div>`);};
// Capture each editor independently, so input is not lost on navigation or student changes.
document.addEventListener('input',e=>{let root=e.target.closest('form[data-editor]');if(root)captureEntry(root.dataset.editor);});
document.addEventListener('change',e=>{let root=e.target.closest('form[data-editor]');if(root)captureEntry(root.dataset.editor);});

/* Integration with existing profile, search, review, audit, and print flows. */
records=function(sid=state.student,f=state.history){let ls=db.lessons.filter(x=>(!sid||x.student===sid)&&(!f.from||x.date>=f.from)&&(!f.to||x.date<=f.to)&&(!f.subject||x.subject===f.subject));if(f.q){let q=norm(f.q);ls=ls.filter(x=>norm([x.unit,x.obs,x.next,materialsText(x,true),(x.tags||[]).join(' '),x.homework,x.teacher,x.handoverText||''].join(' ')).includes(q));}if(f.teacher)ls=ls.filter(x=>x.teacher===f.teacher);if(f.student)ls=ls.filter(x=>x.student===f.student);if(f.status)ls=ls.filter(x=>x.status===f.status);if(f.slot)ls=ls.filter(x=>x.slot===f.slot);return ls.sort((a,b)=>f.sort==='asc'?a.date.localeCompare(b.date)||a.slot.localeCompare(b.slot):f.sort==='subject'?a.subject.localeCompare(b.subject,'ja')||b.date.localeCompare(a.date):f.sort==='teacher'?a.teacher.localeCompare(b.teacher,'ja')||b.date.localeCompare(a.date)||a.slot.localeCompare(b.slot):f.sort==='student'?student(a.student).name.localeCompare(student(b.student).name,'ja')||b.date.localeCompare(a.date):b.date.localeCompare(a.date)||a.slot.localeCompare(b.slot)||a.subject.localeCompare(b.subject,'ja'));};
lessonText=function(l){return ['記録ID：'+l.id,'生徒：'+student(l.student).name,'授業日：'+l.date+' '+l.slot+'コマ','担当：'+l.teacher,'教科：'+l.subject,'学習内容・評価対象：'+l.unit,'教材：\n'+materialsText(l,true),'到達度：'+(l.level??'未評価'),'つまずき：'+(l.stumbles||[]).join('、'),'所見：'+l.obs,'次回：'+l.next,'宿題：'+l.homework,'宿題確認：'+l.homeworkDone,'申し送り（内部）：'+(l.handoverText||''),'内部メモ：'+(l.internal||''),'状態：'+l.status].join('\n');};
lessonCard=function(l,opts={}){let s=student(l.student);return `<article class="lesson" data-id="${l.id}"><div class="lesson-head"><div class="row"><span class="lesson-date">${fmt(l.date)} <span class="small muted">${l.slot}コマ</span></span><span class="badge blue">${esc(l.subject)}</span>${opts.showStudent?`<b class="small">${esc(s.name)}</b>`:''}<span class="small muted">${esc(l.teacher)}</span></div><div class="row">${statusBadge(l.status)}<span class="level">${l.level==null?'未評価':'到達度 '+l.level+' / 4'}</span></div></div><div class="lesson-unit">${esc(l.unit||'学習内容未入力')}</div><p class="tiny muted preline mb">${esc(materialsText(l))}</p><div class="lesson-body"><div><div class="label">授業の様子・できたこと</div><p class="preline">${esc(l.obs||'未入力')}</p></div><div><div class="label">次回の指導内容</div><p class="preline">${esc(l.next||'未入力')}</p></div></div>${l.handoverText?`<div class="notice mt"><b>この授業の申し送り（内部）</b><br>${esc(l.handoverText)}</div>`:''}<div class="lesson-foot"><div class="tagrow">${(l.tags||[]).map(t=>`<span class="pill">${esc(t)}</span>`).join('')}</div><div class="row"><button class="btn text small" onclick="showContext('${l.id}')">前後の授業</button><button class="btn text small" onclick="openLesson('${l.id}')">詳細・編集 ›</button></div></div></article>`;};
renderProfile=function(){let html=original.renderProfile(),marker='<div class="profilegrid">';return html.replace(marker,`<div class="profile-handover">${handoverStrip(state.student,state.subject)}</div>`+marker);};
renderHistory=function(){let html=original.renderHistory();return html.replace('<div class="historylayout mt">',`<div class="profile-handover mt">${handoverStrip(state.student,state.subject)}</div><div class="historylayout mt">`);};
renderDaily=function(){let f=state.daily,ls=goodRange(f.from,f.to)?records('',f):[];return head('講師別・日別報告','日付・講師・生徒・教科で確認。申し送りも見ながら、これまでの口頭報告を続けます。')+`<div class="card"><div class="toolbar"><label class="field">開始日<input type="date" value="${f.from}" onchange="setDaily('from',this.value)"></label><label class="field">終了日<input type="date" value="${f.to}" onchange="setDaily('to',this.value)"></label><label class="field">担当講師<select onchange="setDaily('teacher',this.value)">${teacherOptions(f.teacher)}</select></label><label class="field">コマ<select onchange="setDaily('slot',this.value)">${option('','すべて',f.slot||'')+['A','B','C','D'].map(x=>option(x,x+'コマ',f.slot)).join('')}</select></label><label class="field">教科<select onchange="setDaily('subject',this.value)">${subjOptions(f.subject)}</select></label><label class="field">状態<select onchange="setDaily('status',this.value)">${option('','すべて',f.status)+['下書き','報告済み','確認済み'].map(x=>option(x,x,f.status)).join('')}</select></label><label class="field">並べ方<select onchange="setDaily('sort',this.value)">${[['date','日付・コマ順'],['teacher','講師別 → 日付・コマ'],['subject','教科別 → 日付'],['student','生徒別 → 日付']].map(([v,t])=>option(v,t,f.sort)).join('')}</select></label></div><div class="row between"><div class="row"><button class="btn small" onclick="openStudentPicker('daily')">${f.student?esc(student(f.student).name):'生徒を検索して絞る'}</button>${f.student?'<button class="btn text small" onclick="state.daily.student=\'\';render()">解除</button>':''}</div><div class="quickbar"><button onclick="state.daily.from=TODAY;state.daily.to=TODAY;render()">今日（デモ日）</button><button onclick="state.daily.from='2026-11-17';state.daily.to='2026-11-17';render()">サンプル 11/17</button><button onclick="state.daily.from='';state.daily.to='';render()">全履歴</button></div></div>${goodRange(f.from,f.to)?'':'<div class="notice mt">開始日と終了日を確認してください。</div>'}</div><div class="metrics">${[['対象授業',ls.length],['下書き',ls.filter(l=>l.status==='下書き').length],['教室長の確認待ち',ls.filter(l=>l.status==='報告済み').length],['確認済み',ls.filter(l=>l.status==='確認済み').length]].map(([label,n])=>`<div class="metric"><small>${label}</small><div class="num">${n}<span>件</span></div></div>`).join('')}</div><div class="tablewrap"><table><thead><tr><th>日付・コマ</th><th>講師</th><th>生徒・教科</th><th>授業内容</th><th>現在の申し送り</th><th>状態・確認</th></tr></thead><tbody>${ls.map(l=>{let hs=relevantHandovers(l.student,l.subject);return `<tr><td class="nowrap">${fmt(l.date)}<div class="subcell">${l.slot}コマ</div></td><td>${esc(l.teacher)}</td><td><b>${esc(student(l.student).name)}</b><div class="subcell">${esc(l.subject)} ／ ${esc(student(l.student).grade)}</div></td><td>${esc(l.unit||'未入力')}<div class="subcell">教材 ${(l.materials||[]).length||1}件 ／ 到達度 ${l.level??'未評価'}</div></td><td><div class="note-summary">${hs.length?esc(hs.map(h=>h.text).join(' ／ ')):'—'}</div></td><td>${statusBadge(l.status)}<div style="margin-top:7px"><button class="btn small" onclick="reviewLesson('${l.id}')">内容を確認</button></div></td></tr>`;}).join('')||'<tr><td colspan="6"><div class="empty">該当する授業記録はありません。</div></td></tr>'}</tbody></table></div>`;};
reviewLesson=function(id){let l=db.lessons.find(x=>x.id===id);if(!l)return;let can=!state.actor.startsWith('講師');modal('終業報告の確認｜'+student(l.student).name+'・'+l.subject,handoverStrip(l.student,l.subject)+lessonCard(l)+`<div class="card mt"><p class="small preline"><b>宿題：</b>\n${esc(l.homework||'未入力')}<br><b>前回の実施：</b>${esc(l.homeworkDone)}</p><div class="notice mt"><b>この授業の内部メモ</b><br>${esc(l.internal||'記録なし')}</div></div><div class="formfooter"><button class="btn" onclick="openLesson('${id}')">記録を編集</button>${l.status==='報告済み'?`<button class="btn primary" ${can?'':'disabled'} onclick="markReviewed('${id}')">教室長として確認済みにする</button>`:''}</div><p class="mini-note">申し送りの対応完了と、授業報告の確認は別々に管理します。</p>`);};
// Report student selection stays compact even with eighty or more students.
renderReports=function(){let html=original.renderReports(),start=html.indexOf('<div class="fieldtitle">対象生徒'),end=html.indexOf('<div class="divider"></div>',start);if(start>=0&&end>start)html=html.slice(0,start)+`<div class="fieldtitle">対象生徒 <span class="tiny muted">${state.report.students.length}名</span></div><div class="registered-tags">${state.report.students.map(id=>`<span class="pill">${esc(student(id).name)}<button aria-label="${esc(student(id).name)}を対象から外す" onclick="toggleReportStudent('${id}',false);render()">×</button></span>`).join('')}</div><button class="btn small" onclick="openStudentPicker('report')">${icon('search')}対象生徒を追加</button>`+html.slice(end);return html;};
function reportMaterials(l){let ms=asMaterials(l).filter(m=>m.name);if(!ms.length)return '<p>教材の記録なし</p>';return `<table class="mat-table"><thead><tr><th>教材</th><th>範囲・内容</th><th>宿題</th></tr></thead><tbody>${ms.map(m=>`<tr><td>${esc(m.name)}</td><td>${esc([m.pages,m.content].filter(Boolean).join(' ／ '))}</td><td>${esc(m.homework||'—')}</td></tr>`).join('')}</tbody></table>`;}
reportDaily=function(sid,ls){let s=student(sid);return ls.map(l=>`<section class="report-page">${headerReport(s,'学習報告書',l.subject)}<div class="row between"><h2>${fmt(l.date)} ${l.slot}コマ</h2><span class="badge blue">${esc(l.subject)}</span></div><div class="report-section"><h3>学習した内容</h3><p>${esc(l.unit)}</p>${reportMaterials(l)}</div><div class="report-section"><h3>授業の様子・できたこと</h3><p>${esc(l.obs)}</p></div><div class="report-section"><h3>今回の到達状況</h3><p>${l.level==null?'未評価：確認できていない':l.level+' / 4：'+LEVELS[String(l.level)]}${l.correct!=null&&l.total!=null?'\n確認問題：'+l.correct+'問正解 / '+l.total+'問':''}</p></div><div class="report-section"><h3>次回の指導内容</h3><p>${esc(l.next)}</p></div><div class="report-section"><h3>宿題・家庭での取り組み</h3><p>${esc(l.homework)}</p></div>${reportFooter()}</section>`).join('');};
reportList=function(sid,ls){let s=student(sid);return `<section class="report-page"><table class="history-table"><thead><tr><td>${headerReport(s,'学プロ・授業記録一覧')}<p class="print-alert mb"><b>講師・教室長向けの内部用 ／ 保護者配布不可</b>　${ls.length}件。下書きも含みます。</p></td></tr></thead><tbody>${ls.map(l=>`<tr><td><article class="lesson"><div class="lesson-head"><span class="lesson-date">${fmt(l.date)} ${l.slot}コマ ／ ${esc(l.subject)} ／ ${esc(l.teacher)}</span>${statusBadge(l.status)}</div><div class="lesson-unit">${esc(l.unit)}</div><p class="tiny preline">${esc(materialsText(l,true))}</p><div class="lesson-body mt"><div><div class="label">所見</div><p>${esc(l.obs)}</p></div><div><div class="label">次回</div><p>${esc(l.next)}</p></div></div><p class="tiny mt">到達度：${l.level??'未評価'} ／ 宿題：${esc(l.homework)}</p>${l.handoverText?'<p class="tiny mt"><b>この授業の申し送り：</b>'+esc(l.handoverText)+'</p>':''}${l.internal?'<p class="tiny mt"><b>内部メモ：</b>'+esc(l.internal)+'</p>':''}</article></td></tr>`).join('')}</tbody><tfoot><tr><td>${reportFooter()}</td></tr></tfoot></table></section>`;};
headerReport=function(s,title,sub=''){let r=state.report;return `<div class="report-top"><div><div class="school">明光義塾 ${esc(s.school)} ／ LLLD</div><h1>${esc(title)}</h1></div><div style="text-align:right"><span class="badge">デモ・架空データ</span><div class="report-meta">作成日 ${fmt(TODAY)}</div></div></div><div class="report-lead"><div class="report-name">${esc(s.name)} さん <span style="font-size:12px;font-weight:400">${esc(s.grade)}</span></div><div class="report-meta">対象：${r.from?fmt(r.from):'開始指定なし'} 〜 ${r.to?fmt(r.to):'終了指定なし'} ／ ${esc(sub||r.subject||'全教科')}</div></div>`;};
renderAudit=function(){let html=original.renderAudit();let extraOptions=['生徒登録','教材登録','申し送り'].map(t=>option(t,t,state.audit.type)).join('');html=html.replace('<option value="">すべて</option>','<option value="">すべて</option>'+extraOptions);return html;};
renderSettings=function(){return original.renderSettings()+`<section class="card mt"><h2>今回の改訂内容</h2><p class="small muted mt">担当表の事前登録なし。検索した生徒を3名まで表示／生徒登録・学年検索／複数教材と教材候補／前回教材の安全な引き継ぎ／申し送りの継続表示・確認・対応済み管理。</p><p class="small muted mt">この改訂版は旧モックと別のブラウザ保存領域を使います。旧版の入力データを自動で読み込む機能はありません。保存済みの授業・変更ログを自動削除する機能はありませんが、ブラウザ内保存は本番の永続保存ではありません。</p></section>`;};
resetDemo=function(){if(!confirm('この改訂版のデモ記録・変更履歴・入力途中の内容を初期化しますか？'))return;db=seed();extendData();extra.desk={date:TODAY,slot:'B',teacher:'講師 A（デモ）',seats:[{student:'s1',subject:'数学'},{student:'s2',subject:'英語'},{student:'s3',subject:'算数'}],focus:-1};extra.scrolls=[0,0,0];state.student='s1';state.subject='数学';state.report.students=['s1'];state.report.edits={};state.page='desk';storeView();render();toast('80名の架空データに戻しました。');};
// Improve handover badges when the demo operator is changed.
document.getElementById('actor').addEventListener('change',()=>refreshPreservingDesk());
document.getElementById('picker-dialog').addEventListener('click',e=>{if(e.target===e.currentTarget){let r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closePicker();}});
window.addEventListener('beforeunload',()=>{db.deskView=clone(extra.desk);persist();});
/* ---- v3: classroom mode, message board, staff, sessions, homework & print ---- */
const V3SLOTS=['X','Y','Z','A','B','C','D'];
const v2ref={renderDesk,renderDeskSeat,renderEntry,renderMaterialRow,renderPrevious,renderReports,renderRoster,renderCatalog,renderStudentPicker,openStudentPicker,renderStudentPicker,chooseStudent,openBookPicker,chooseBook,renderBookPicker,updateBookPicker,captureEntry,submitEntry,saveStudentForm,openStudentForm,renderDaily,lessonCard,renderSettings,reportDaily,reportList,reportTerm,renderStudentPicker2:renderStudentPicker,resetDemo,renderHistory,renderProfile,reportMaterials,renderAudit};
if(!db.activeRoom||!CLASSROOMS.includes(db.activeRoom))db.activeRoom=CLASSROOMS[0];
if(!Array.isArray(db.teachers))db.teachers=[
 {id:'t1',name:'講師 A（デモ）',kana:'こうし えー',role:'講師',classrooms:[...CLASSROOMS],active:true},
 {id:'t2',name:'講師 B（デモ）',kana:'こうし びー',role:'講師',classrooms:[...CLASSROOMS],active:true},
 {id:'t3',name:'講師 C（デモ）',kana:'こうし しー',role:'講師',classrooms:[...CLASSROOMS],active:true},
 {id:'t4',name:'教室長（デモ）',kana:'きょうしつちょう',role:'教室長',classrooms:[...CLASSROOMS],active:true},
 {id:'t5',name:'代表（デモ）',kana:'だいひょう',role:'代表',classrooms:[...CLASSROOMS],active:true}
];
if(!Array.isArray(db.sessions))db.sessions=[];
if(!Array.isArray(db.announcements))db.announcements=[
 {id:'board1',room:'仁保教室',title:'本日の授業準備について',body:'授業前に前回の所見・申し送りを確認してください。授業後は学プロを保存し、これまでどおり教室長へ報告してください。',urgent:true,author:'教室長（デモ）',createdAt:'2026-11-18T00:00:00Z',updatedAt:'2026-11-18T00:00:00Z'},
 {id:'board2',room:'広島大州教室',title:'学プロ入力の確認',body:'教材が複数ある場合は教材を追加してください。申し送りは所見とは別に入力し、必要に応じて対応済みに変更してください。',urgent:false,author:'教室長（デモ）',createdAt:'2026-11-18T00:00:00Z',updatedAt:'2026-11-18T00:00:00Z'}
];
db.revision=3;
extra.masterTab='students';extra.masterQ='';extra.scanInput='';extra.desk.collapsed=Array.isArray(extra.desk.collapsed)?extra.desk.collapsed:[false,true,true];
extra.desk.focus=-1;
extra.roster.classroom=db.activeRoom;
extra.picker=null;
state.page='home';
state.report.termDensity=state.report.termDensity||'standard';
state.report.listDensity=state.report.listDensity||'4';
state.report.fontSize=state.report.fontSize||'9.4';
state.report.edits={};
const currentRoom=()=>db.activeRoom;
let isSameRoom=(sid)=>db.students.some(s=>s.id===sid&&s.school===currentRoom());
let roomStudents=()=>db.students.filter(s=>s.school===currentRoom()&&activeStudent(s));
const roleFor=person=>db.teachers.find(t=>t.name===person)?.role||(/教室長/.test(person)?'教室長':/代表/.test(person)?'代表':'講師');
const canManage=()=>!!window.__v13_session_manager;
const roomTeachers=()=>db.teachers.filter(t=>t.active!==false&&(t.classrooms||[]).includes(currentRoom()));
const managerRole=()=>canManage();
const partDate=d=>fmt(d||TODAY);
const safeStudent=(sid)=>db.students.find(s=>s.id===sid);
function v3Audit(type,studentId,subject,label,before,after){audit(type,studentId,subject,label,before,after);}
function captureVisibleEditors(){document.querySelectorAll('#content form[data-editor]').forEach(root=>{try{captureEntry(root.dataset.editor)}catch(e){console.warn('保存できなかった入力欄',e)}})}
function roomStudentFirst(){return roomStudents()[0]||db.students.find(s=>s.school===currentRoom())||db.students[0]}
function roomTeacherFirst(){return roomTeachers().find(t=>t.role==='講師')?.name||roomTeachers()[0]?.name||'講師 A（デモ）'}
function updateActorChoices(){let el=document.getElementById('actor');let valid=roomTeachers();if(!valid.length)return;let cur=state.actor;if(!valid.some(t=>t.name===cur))cur=valid.find(t=>t.role==='教室長')?.name||valid[0].name;state.actor=cur;el.innerHTML=valid.map(t=>option(t.name,`${t.name} (${t.role})`,cur)).join('');}
function makeRoomSwitch(){let label=document.querySelector('.topbar>.row');if(!label)return;label.classList.add('room-cluster');label.innerHTML=`<span class="room-banner">教室モード</span><select class="room-select" aria-label="利用する教室" onchange="switchRoom(this.value)">${CLASSROOMS.map(r=>option(r,r,currentRoom())).join('')}</select>`;}
function switchRoom(r){if(!CLASSROOMS.includes(r)||r===currentRoom())return;captureVisibleEditors();db.activeRoom=r;extra.roster.classroom=r;extra.notes.student='';extra.catalog.q='';extra.picker=null;extra.desk.seats=[null,null,null];extra.desk.collapsed=[false,true,true];extra.desk.teacher=roomTeacherFirst();state.student=roomStudentFirst().id;state.subject=roomStudentFirst().subjects[0]||'数学';state.history.subject='';state.daily.student='';state.daily.teacher='';state.report.students=[state.student];state.report.subject=state.subject;state.report.edits={};restoreSession();updateActorChoices();storeView();render();toast(r+'モードに切り替えました。生徒・講師の表示をこの教室に限定します。');}
// Room mode is the primary scope: no repeated room setting in ordinary searches.
const v3MatchStudents=matchStudents;
matchStudents=function(f={}){return v3MatchStudents({...f,classroom:currentRoom()});};
studentOptions=function(selected='',all=false){let ss=db.students.filter(s=>s.school===currentRoom());return (all?'<option value="">すべての生徒</option>':'')+GRADES.map(g=>{let group=ss.filter(s=>s.grade===g).sort((a,b)=>norm(a.kana||a.name).localeCompare(norm(b.kana||b.name),'ja'));return group.length?`<optgroup label="${g}">${group.map(s=>option(s.id,s.name,selected)).join('')}</optgroup>`:'';}).join('');};
teacherOptions=function(selected='',all=true){let ts=roomTeachers();return (all?'<option value="">すべての講師</option>':'')+ts.map(t=>option(t.name,t.name,selected)).join('');};
const originalRecordsV3=records;
records=function(sid=state.student,f=state.history){if(sid&&!isSameRoom(sid))return [];return originalRecordsV3(sid,f).filter(l=>isSameRoom(l.student));};
const v3RenderStudentPicker=renderStudentPicker;
openStudentPicker=function(target,seat=null){extra.picker={target,seat,q:'',grade:'',classroom:currentRoom(),enrollment:'在籍'};renderStudentPicker(true);};
renderStudentPicker=function(initial=false){v3RenderStudentPicker(initial);let d=document.getElementById('picker-body');let roomlabel=d?.querySelector('.picker-filter label:nth-child(2)');if(roomlabel)roomlabel.outerHTML=`<div class="room-banner" style="align-self:end;min-height:40px">${esc(currentRoom())}の生徒を表示</div>`;};
const v3ChooseStudent=chooseStudent;
chooseStudent=function(id){if(!isSameRoom(id)){toast('この教室に登録されている生徒のみ選択できます。');return;}v3ChooseStudent(id);};
const v3SaveStudent=saveStudentForm;
saveStudentForm=function(e,id){let f=new FormData(e.target);if(f.get('classroom')!==currentRoom()){toast('現在の教室モードと登録先の教室を合わせてください。');return;}v3SaveStudent(e,id);};
const v3OpenStudentForm=openStudentForm;
openStudentForm=function(id=''){v3OpenStudentForm(id);let f=document.getElementById('modal-body')?.querySelector('select[name="classroom"]');if(f){f.value=id?(safeStudent(id)?.school||currentRoom()):currentRoom();f.disabled=true;const hidden=document.createElement('input');hidden.type='hidden';hidden.name='classroom';hidden.value=f.value;f.insertAdjacentElement('afterend',hidden);}let h=document.getElementById('modal-body');if(h)h.insertAdjacentHTML('beforeend',`<p class="mini-note mt">生徒番号はバーコード用IDとして利用します。登録後、マスター管理からラベルを印刷できます。実名は入力しないでください（モック）。</p>`);};
function v3Nav(){let navs=[['home','ホーム・掲示板'],['desk','授業準備・3人表示'],['roster','生徒検索'],['profile','スキルカルテ'],['history','授業履歴・比較'],['daily','講師別・日別報告'],['notes','申し送り'],['reports','報告書・印刷'],['master','マスター管理'],['audit','変更ログ'],['settings','運用設定']];document.getElementById('nav').innerHTML=navs.map(([p,n])=>`<button title="${n}" aria-label="${n}" class="navbtn ${state.page===p?'active':''}" onclick="navigate('${p}')">${icon(p==='home'?'notes':p==='master'?'roster':p)}<span class="navname">${n}</span></button>`).join('');}
renderNav=v3Nav;
render=function(){document.body.classList.toggle('workspace-mode',state.page==='desk');v3Nav();let pages={home:renderHome,desk:renderDesk,roster:renderRoster,profile:renderProfile,history:renderHistory,daily:renderDaily,notes:renderHandovers,reports:renderReports,master:renderMaster,audit:renderAudit,settings:renderSettings};document.getElementById('content').innerHTML=(pages[state.page]||renderHome)();if(state.page==='reports')updateReportPreview();if(state.page==='desk')extra.scrolls.forEach((v,i)=>{let el=document.getElementById('desk-scroll-'+i);if(el)el.scrollTop=v;});document.querySelector('.room-select')?.setAttribute('value',currentRoom());};
function announcementsForRoom(){return db.announcements.filter(a=>a.room===currentRoom()||a.room==='両教室').sort((a,b)=>Number(b.urgent)-Number(a.urgent)||b.updatedAt.localeCompare(a.updatedAt));}
function renderHome(){let notes=announcementsForRoom(),ls=records('',{from:TODAY,to:TODAY,sort:'desc'}),ready=db.sessions.filter(x=>x.room===currentRoom()&&x.date===TODAY);return head('今日の教室','伝言を確認してから授業準備へ。生徒の記録は教室ごとに表示します。',`<button class="btn primary" onclick="navigate('desk')">授業準備を開く ${icon('arrow')}</button>`)+`<div class="home-grid"><section class="card"><div class="home-title"><div><div class="eyebrow">FROM THE CLASSROOM MANAGER</div><h2>教室長からの伝言掲示板</h2></div>${canManage()?`<button class="btn small primary" onclick="openBoard()">＋ 伝言を投稿</button>`:'<span class="badge">閲覧</span>'}</div><p class="small muted mt">${esc(currentRoom())}へのお知らせ。個別生徒の申し送りは専用欄で管理します。</p>${notes.map(n=>`<article class="announcement ${n.urgent?'urgent':''}"><div class="row between"><h3>${esc(n.title)}</h3>${n.urgent?'<span class="badge amber">重要</span>':''}</div><p>${esc(n.body)}</p><div class="foot">${esc(n.room)} ／ ${stamp(n.updatedAt)} ／ ${esc(n.author)}${canManage()?`<button class="btn text small" onclick="openBoard('${n.id}')">編集</button>`:''}</div></article>`).join('')||'<div class="empty mt">現在の伝言はありません。</div>'}</section><div class="stack"><section class="card"><div class="section-title"><h2>教室モード</h2><span class="badge green">${esc(currentRoom())}</span></div><div class="room-selector-large">${CLASSROOMS.map(r=>`<button class="${currentRoom()===r?'selected':''}" onclick="switchRoom('${r}')">${r}</button>`).join('')}</div><div class="home-status"><div class="home-stat"><span class="small muted">在籍生徒</span><b>${roomStudents().length} 名</b></div><div class="home-stat"><span class="small muted">登録講師・管理者</span><b>${roomTeachers().length} 名</b></div><div class="home-stat"><span class="small muted">今日の授業記録</span><b>${ls.length} 件</b></div><div class="home-stat"><span class="small muted">今日の準備済みコマ</span><b>${ready.length} コマ</b></div></div></section><section class="card"><div class="section-title"><h2>すぐに使う</h2></div><div class="stack" style="gap:9px"><button class="btn" onclick="navigate('desk')">XYZABCDコマから授業準備</button><button class="btn" onclick="navigate('daily')">今日の報告を確認</button><button class="btn" onclick="navigate('roster')">学年・氏名から生徒を検索</button><button class="btn" onclick="navigate('reports')">A4報告書を作成・印刷</button></div></section><div class="notice">操作確認用モック：掲示板の投稿・データ保存はこのブラウザのみ。実際の教室間共有や権限認証はありません。</div></div></div>`;}
function openBoard(id=''){if(!canManage()){toast('掲示板の投稿は教室長・代表の役割を想定しています。');return;}let n=db.announcements.find(a=>a.id===id);modal(n?'掲示板の伝言を編集':'教室長からの伝言を投稿',`<form onsubmit="saveBoard(event,'${id}')"><div class="form-grid"><label class="field">表示先<select name="room">${[currentRoom(),'両教室'].map(x=>option(x,x,n?.room||currentRoom())).join('')}</select></label><label class="field">重要度<select name="urgent">${option('通常','通常',n?.urgent?'重要':'通常')}${option('重要','重要',n?.urgent?'重要':'通常')}</select></label></div><label class="field mt">タイトル<input name="title" required maxlength="100" value="${esc(n?.title||'')}"></label><label class="field mt">伝言<textarea name="body" required rows="5">${esc(n?.body||'')}</textarea></label><div class="formfooter"><button type="button" class="btn" onclick="closeModal()">戻る</button>${n?`<button type="button" class="btn danger" onclick="removeBoard('${id}')">削除</button>`:''}<button class="btn primary">保存して掲示</button></div></form>`);}
function saveBoard(e,id){e.preventDefault();if(!canManage())return;let f=new FormData(e.target),old=db.announcements.find(x=>x.id===id);let a={...(old||{}),id:old?.id||uid('board'),room:f.get('room'),urgent:f.get('urgent')==='重要',title:String(f.get('title')||'').trim(),body:String(f.get('body')||'').trim(),author:state.actor,updatedAt:now(),createdAt:old?.createdAt||now()};if(!a.title||!a.body)return;v3Audit('掲示板','','',old?'掲示板の伝言を変更':'掲示板に伝言を投稿',old||'新規',a);if(old)db.announcements[db.announcements.indexOf(old)]=a;else db.announcements.push(a);persist();closeModal();render();toast('掲示板に反映しました。');}
function removeBoard(id){if(!canManage())return;if(!confirm('この伝言を掲示板から削除しますか？'))return;let a=db.announcements.find(x=>x.id===id);if(!a)return;v3Audit('掲示板','','','掲示を削除',a,'掲示板から削除');db.announcements=db.announcements.filter(x=>x.id!==id);persist();closeModal();render();}
// Session preparation: saved by day / room / slot / teacher, not a recurring master timetable.
const sessionKey=(room,date,slot,teacher)=>[room,date,slot,teacher].join('|');
function currentSession(){let w=extra.desk;return db.sessions.find(x=>x.key===sessionKey(currentRoom(),w.date,w.slot,w.teacher));}
function restoreSession(){let w=extra.desk,entry=currentSession();w.seats=(entry?.seats||[null,null,null]).map(x=>x&&isSameRoom(x.student)?clone(x):null);while(w.seats.length<3)w.seats.push(null);w.collapsed=[false,true,true];w.focus=-1;extra.scrolls=[0,0,0];}
function saveSession(){captureVisibleEditors();let w=extra.desk,ids=w.seats.filter(Boolean).map(s=>s.student);if(new Set(ids).size!==ids.length){toast('同じ生徒が複数の欄に登録されています。');return;}if(ids.some(id=>!isSameRoom(id))){toast('別教室の生徒を含むため、登録できません。');return;}let key=sessionKey(currentRoom(),w.date,w.slot,w.teacher),old=db.sessions.find(x=>x.key===key),a={id:old?.id||uid('session'),key,room:currentRoom(),date:w.date,slot:w.slot,teacher:w.teacher,seats:clone(w.seats),updatedBy:state.actor,updatedAt:now()};v3Audit('授業準備','', '',old?'コマの生徒登録を更新':'コマに生徒を登録',old||'新規',a);if(old)db.sessions[db.sessions.indexOf(old)]=a;else db.sessions.push(a);storeView();render();toast(`${w.slot}コマに${ids.length}人を登録しました。次回この条件を開くと呼び出せます。`);}
const v3PreviousDesk=renderDesk;
renderDesk=function(){let w=extra.desk,n=w.seats.filter(Boolean).length,session=currentSession(),collapsed=w.collapsed||[false,false,false];return head('授業準備・3人表示','教室・日付・コマ・講師を決め、検索またはバーコードで生徒を選択。準備した組み合わせを保存できます。',`<button class="btn" onclick="expandDeskAll()">3人を広く表示</button><button class="btn" onclick="navigate('master')">マスター管理</button>`)+`<div class="desk-toolbar"><span class="room-banner">${esc(currentRoom())}</span><label class="field">授業日<input type="date" value="${w.date}" onchange="setDeskMeta('date',this.value)"></label><div class="slot-picker" aria-label="コマ選択">${V3SLOTS.map(x=>`<button class="${x===w.slot?'active':''} ${db.sessions.some(a=>a.room===currentRoom()&&a.date===w.date&&a.slot===x&&a.teacher===w.teacher)?'ready':''}" onclick="setDeskMeta('slot','${x}')" title="${x}コマ">${x}</button>`).join('')}</div><label class="field">担当講師<select onchange="setDeskMeta('teacher',this.value)">${teacherOptions(w.teacher,false)}</select></label><span class="badge ${session?'green':'amber'}">${session?'このコマは登録済み':'このコマは未登録'} / ${n}名</span><button class="btn primary" onclick="saveSession()">このコマの生徒を保存</button></div><div class="card" style="padding:11px 14px;margin:10px 0"><div class="row between"><div class="scan-box"><span class="small strong">バーコードで登録</span><input id="scan-student" type="search" placeholder="生徒番号をスキャン・入力" aria-label="スキャンで生徒を登録" autocomplete="off" onkeydown="if(event.key==='Enter'){event.preventDefault();scanStudent(this.value);this.value='';}"><button class="btn small" onclick="scanStudent(document.getElementById('scan-student').value);document.getElementById('scan-student').value=''">登録</button><button class="btn small" onclick="openCameraScanner()">カメラ</button></div><span class="scan-note">スキャナーで番号を読み取り、Enter。紙のラベルはマスター管理から印刷できます。</span></div></div><div class="desk-grid ${collapsed.some(Boolean)?'has-collapsed ':''}${collapsed.map((v,i)=>v?'collapse-'+i:'').join(' ')}">${[0,1,2].map(renderDeskSeat).join('')}</div><div class="desk-note">講師が授業前に登録した組み合わせは、その日・コマ・担当講師ごとに保存されます。毎週の時間割を登録する必要はありません。各生徒の所見・評価・宿題は独立して保存します。</div>`;};
function expandDeskAll(){captureVisibleEditors();extra.desk.collapsed=[false,false,false];extra.desk.focus=-1;storeView();refreshPreservingDesk();}
function toggleDeskCollapse(i){captureVisibleEditors();extra.desk.collapsed[i]=!extra.desk.collapsed[i];extra.desk.focus=-1;storeView();refreshPreservingDesk();}
const v3DeskSeat=renderDeskSeat;
renderDeskSeat=function(i){let seat=extra.desk.seats[i],collapsed=extra.desk.collapsed?.[i];if(collapsed){if(!seat)return `<section class="desk-panel is-collapsed"><div class="desk-top"><button class="rail-open" onclick="toggleDeskCollapse(${i})" title="${i+1}人目の欄を開く">＋</button><div class="rail-name">${i+1}人目</div><button class="rail-open" onclick="openStudentPicker('desk',${i})" title="生徒を選ぶ">検索</button></div></section>`;let s=safeStudent(seat.student),d=deskDraft(i),n=relevantHandovers(s.id,seat.subject).length;return `<section class="desk-panel is-collapsed" id="desk-seat-${i}"><header class="desk-top"><button class="rail-open" onclick="toggleDeskCollapse(${i})" title="${esc(s.name)}の報告を開く">＋</button><div class="rail-name">${esc(s.name)}</div><div class="rail-extra">${esc(s.grade)}　${esc(seat.subject)}</div>${n?`<div class="rail-alert">申し送り ${n}</div>`:''}<span class="badge ${d.id?'green':'amber'}">${d.id?'保存済':'入力前'}</span></header></section>`;}
let html=v3DeskSeat(i);if(seat){html=html.replace('</header>',`<div style="padding:0 9px 9px;background:#f1f8f4"><button class="btn small" style="width:100%" onclick="toggleDeskCollapse(${i})">− この生徒を小さく表示</button></div></header>`);}return html;};
setDeskMeta=function(k,v){if(k==='date'&&!/^\d{4}-\d{2}-\d{2}$/.test(v)){toast('授業日を確認してください。');return;}if(k==='slot'&&!V3SLOTS.includes(v))return;captureVisibleEditors();extra.desk[k]=v;restoreSession();storeView();render();};
function scanStudent(input){let code=String(input||'').trim().toUpperCase().replace(/^LLLD[:\-]STUDENT[:\-]/,'').replace(/^LLLD[:\-]/,'');if(!code){toast('バーコードの生徒番号を読み取ってください。');return;}let s=db.students.find(x=>String(x.code||'').toUpperCase()===code&&x.school===currentRoom()&&activeStudent(x));if(!s){toast('現在の教室で該当する生徒番号が見つかりません：'+code);return;}let occupied=extra.desk.seats.findIndex(x=>x?.student===s.id);if(occupied>=0){toggleDeskCollapse(occupied);toast(s.name+'さんは既に表示されています。');return;}let empty=extra.desk.seats.findIndex(x=>!x);if(empty>=0){captureVisibleEditors();extra.desk.seats[empty]={student:s.id,subject:s.subjects?.[0]||'数学'};extra.desk.collapsed[empty]=false;storeView();render();toast('バーコードから '+s.name+' さんを '+(empty+1)+'人目へ表示しました。コマ登録は別途「保存」で確定します。');return;}modal('3人のうち誰と入れ替えますか？',`<p class="small muted mb">${esc(s.name)}さんを登録します。現在の入力途中の内容は生徒ごとに保持されます。</p>${extra.desk.seats.map((x,i)=>`<button class="btn" style="width:100%;margin:5px 0" onclick="replaceDeskStudent(${i},'${s.id}');extra.desk.collapsed[${i}]=false;storeView();render()">${i+1}人目：${esc(safeStudent(x.student).name)}と入れ替える</button>`).join('')}`);}
let cameraStream=null,cameraReader=null;
async function openCameraScanner(){if(!('BarcodeDetector' in window)||!navigator.mediaDevices?.getUserMedia){toast('このブラウザではカメラ読み取りを利用できません。USB/Bluetoothスキャナーまたは番号入力をお使いください。');return;}try{modal('カメラでバーコードを読む',`<p class="small muted mb">カメラを許可して、生徒のCode39バーコードを枠内に入れてください。</p><video id="scanner-video" class="camera-view" autoplay muted playsinline></video><div class="formfooter"><button class="btn" onclick="stopCamera();closeModal()">閉じる</button></div>`);cameraStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}}});let video=document.getElementById('scanner-video');if(!video){stopCamera();return;}video.srcObject=cameraStream;await video.play();let detector=new BarcodeDetector({formats:['code_39','qr_code','code_128']});cameraReader=setInterval(async()=>{if(!video||!document.getElementById('modal').open)return;try{let list=await detector.detect(video);if(list?.[0]?.rawValue){const code=list[0].rawValue;stopCamera();closeModal();scanStudent(code);}}catch(e){}},500);}catch(e){stopCamera();toast('カメラを開始できません。許可・ブラウザ対応を確認してください。');}}
function stopCamera(){if(cameraReader){clearInterval(cameraReader);cameraReader=null;}if(cameraStream){cameraStream.getTracks().forEach(t=>t.stop());cameraStream=null;}}
document.getElementById('modal').addEventListener('close',stopCamera);
// Code39: valid, offline, printable one-dimensional barcode for student code IDs.
const CODE39={
 '0':'nnnwwnwnn','1':'wnnwnnnnw','2':'nnwwnnnnw','3':'wnwwnnnnn','4':'nnnwwnnnw','5':'wnnwwnnnn','6':'nnwwwnnnn','7':'nnnwnnwnw','8':'wnnwnnwnn','9':'nnwwnnwnn',
 'A':'wnnnnwnnw','B':'nnwnnwnnw','C':'wnwnnwnnn','D':'nnnnwwnnw','E':'wnnnwwnnn','F':'nnwnwwnnn','G':'nnnnnwwnw','H':'wnnnnwwnn','I':'nnwnnwwnn','J':'nnnnwwwnn',
 'K':'wnnnnnnww','L':'nnwnnnnww','M':'wnwnnnnwn','N':'nnnnwnnww','O':'wnnnwnnwn','P':'nnwnwnnwn','Q':'nnnnnnwww','R':'wnnnnnwwn','S':'nnwnnnwwn','T':'nnnnwnwwn',
 'U':'wwnnnnnnn','V':'nwwnnnnnn','W':'wwwnnnnnn','X':'nwnnwnnnw','Y':'wwnnwnnnn','Z':'nwwnwnnnn','-':'nwnnnnwnw','.':'wwnnnnwnn',' ':'nwwnnnwnn','*':'nwnnwnwnn','$':'nwnwnwnnn','/':'nwnwnnnwn','+':'nwnnnwnwn','%':'nnnwnwnwn'
};
function barcodeSVG(code,small=false){let c=String(code||'').toUpperCase();if([...c].some(x=>!CODE39[x]))return `<span class="small" style="color:#a33">生徒番号にバーコード非対応文字があります</span>`;let x=12,barH=small?42:62,scale=small?1.5:2.05,parts=[];for(let ch of '*'+c+'*'){const p=CODE39[ch];for(let i=0;i<p.length;i++){let w=(p[i]==='w'?3:1)*scale;if(i%2===0)parts.push(`<rect x="${x.toFixed(1)}" y="2" width="${w.toFixed(1)}" height="${barH}" fill="#111"/>`);x+=w;}x+=scale;}let width=x+12;return `<svg role="img" aria-label="生徒番号 ${esc(c)} のCode39バーコード" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${barH+3}" width="${width}" height="${barH+3}" preserveAspectRatio="xMidYMid meet">${parts.join('')}</svg>`;}
function openStudentBarcode(id){let s=safeStudent(id);if(!s)return;modal('生徒のバーコード｜'+s.name,`<div class="barcode-card"><div class="school-tag">${esc(s.school)} / ${esc(s.grade)}</div><b style="display:block;font-size:17px;margin:5px">${esc(s.name)}</b>${barcodeSVG(s.code)}<div style="letter-spacing:2px;font-size:13px">${esc(s.code)}</div></div><p class="small muted">Code39形式。バーコードリーダーが読み取った番号を授業画面の入力欄に送る方式です。教室内の生徒番号以外の個人情報はバーコードに含めません。</p><div class="formfooter"><button class="btn" onclick="closeModal()">閉じる</button><button class="btn primary" onclick="printBarcodes(['${id}'])">A4ラベルを印刷</button></div>`);}
function printBarcodes(ids){let ss=ids.map(safeStudent).filter(s=>s&&s.school===currentRoom());if(!ss.length){toast('印刷対象の生徒がいません。');return;}let pages=[];for(let i=0;i<ss.length;i+=21){let batch=ss.slice(i,i+21);pages.push(`<section class="report-page scan-label-page"><div class="row between mb"><h2>生徒バーコードラベル</h2><span class="small muted">${esc(currentRoom())} ・ ${partDate(TODAY)}</span></div><div class="scan-label-grid">${batch.map(s=>`<div class="scan-label"><div class="scan-small"><span>${esc(s.grade)}</span><span>${esc(s.school)}</span></div><div class="scan-student">${esc(s.name)}</div>${barcodeSVG(s.code,true)}<div class="scan-code">${esc(s.code)}</div></div>`).join('')}</div></section>`);}document.getElementById('print-root').innerHTML=pages.join('');window.print();}
// Master screens: registration is kept separate from lesson records.
function switchMasterTab(t){extra.masterTab=t;extra.masterQ='';render();}
function renderMaster(){let tabs=[['students','生徒マスター'],['teachers','講師マスター'],['books','教材マスター']];let t=extra.masterTab;return head('マスター管理','授業で使う生徒・講師・教材を登録・編集します。登録は現在の教室モードに基づきます。')+`<div class="master-tabs">${tabs.map(([id,name])=>`<button class="${t===id?'on':''}" onclick="switchMasterTab('${id}')">${name}</button>`).join('')}</div>`+(t==='students'?masterStudents():t==='teachers'?masterTeachers():masterBooks());}
function masterStudents(){let f=extra.roster;f.classroom=currentRoom();let ss=matchStudents({...f,q:extra.masterQ});return `<div class="card"><div class="master-toolbar"><div class="row"><span class="room-banner">${esc(currentRoom())}</span><b>登録生徒 ${db.students.filter(s=>s.school===currentRoom()).length}名</b></div><div class="row"><button class="btn" onclick="printBarcodes(roomStudents().map(s=>s.id))">在籍生徒のバーコードを一括印刷</button><button class="btn primary" onclick="openStudentForm()">＋ 生徒を登録</button></div></div><div class="toolbar"><label class="field">氏名・ふりがな・番号<input type="search" value="${esc(extra.masterQ)}" oninput="extra.masterQ=this.value;document.getElementById('master-list').innerHTML=masterStudentRows()" placeholder="例：やまだ、D-001"></label><label class="field">学年<select onchange="extra.roster.grade=this.value;render()">${gradeOptions(f.grade)}</select></label><label class="field">状態<select onchange="extra.roster.enrollment=this.value;render()">${option('','すべて',f.enrollment)+['在籍','休塾','退塾'].map(x=>option(x,x,f.enrollment)).join('')}</select></label></div><div id="master-list">${masterStudentRows()}</div></div>`;}
function masterStudentRows(){let f=extra.roster,ss=matchStudents({...f,q:extra.masterQ});return `<div class="filter-result">${ss.length}名を表示 ／ ${esc(currentRoom())}</div><div class="tablewrap"><table class="master-table"><thead><tr><th>生徒名・生徒番号</th><th>学年・教科</th><th>在籍</th><th>バーコード・操作</th></tr></thead><tbody>${ss.map(s=>`<tr><td><b>${esc(s.name)}</b><div class="subcell">${esc(s.kana||'')} ／ ${esc(s.code)}</div></td><td>${esc(s.grade)}<div class="subcell">${(s.subjects||[]).map(esc).join('・')}</div></td><td><span class="badge">${esc(s.enrollment||'在籍')}</span></td><td><div class="actions"><button class="btn small" onclick="openStudentBarcode('${s.id}')">バーコード表示</button><button class="btn small" onclick="openStudentForm('${s.id}')">編集</button><button class="btn small" onclick="viewStudent('${s.id}')">カルテ</button></div></td></tr>`).join('')||'<tr><td colspan="4">登録生徒がありません</td></tr>'}</tbody></table></div>`;}
function masterTeachers(){let ts=roomTeachers().filter(t=>!extra.masterQ||norm(t.name+' '+t.kana).includes(norm(extra.masterQ)));return `<div class="card"><div class="master-toolbar"><div><span class="room-banner">${esc(currentRoom())}</span> <b>講師・管理者 ${ts.length}名</b></div><button class="btn primary" onclick="openTeacherForm()">＋ 講師を登録</button></div><label class="field mb">講師名を検索<input type="search" value="${esc(extra.masterQ)}" oninput="extra.masterQ=this.value;render()" placeholder="講師名・ふりがな"></label><div class="tablewrap"><table class="master-table"><thead><tr><th>氏名</th><th>役割</th><th>所属教室</th><th>状態</th><th>操作</th></tr></thead><tbody>${ts.map(t=>`<tr><td><b>${esc(t.name)}</b><div class="subcell">${esc(t.kana||'')}</div></td><td>${esc(t.role)}</td><td>${(t.classrooms||[]).map(esc).join('・')}</td><td>${t.active===false?'利用停止':'利用中'}</td><td><button class="btn small" onclick="openTeacherForm('${t.id}')">編集</button></td></tr>`).join('')||'<tr><td colspan="5">登録講師がありません</td></tr>'}</tbody></table></div><p class="mini-note mt">講師の実際のログイン・アクセス制御は本番開発で実装します。このモックは名前・担当教室などの登録のみです。</p></div>`;}
function openTeacherForm(id=''){let t=db.teachers.find(x=>x.id===id);modal(t?'講師マスターを編集':'講師を新規登録',`<form onsubmit="saveTeacherForm(event,'${id}')"><div class="form-grid"><label class="field">氏名 <span class="mark-required">必須</span><input name="name" required maxlength="70" value="${esc(t?.name||'')}" placeholder="例：講師 D（デモ）"></label><label class="field">ふりがな<input name="kana" maxlength="90" value="${esc(t?.kana||'')}"></label><label class="field">役割<select name="role">${['講師','教室長','代表'].map(x=>option(x,x,t?.role||'講師')).join('')}</select></label><label class="field">在籍状態<select name="active">${option('利用中','利用中',t?.active===false?'利用停止':'利用中')}${option('利用停止','利用停止',t?.active===false?'利用停止':'利用中')}</select></label></div><div class="fieldgroup mt"><b>所属教室（複数選択可）</b><div class="tagrow mt">${CLASSROOMS.map(r=>`<label class="chipcheck"><input type="checkbox" name="rooms" value="${r}" ${(t?.classrooms||[currentRoom()]).includes(r)?'checked':''}>${r}</label>`).join('')}</div></div><div class="formfooter"><button type="button" class="btn" onclick="closeModal()">戻る</button><button class="btn primary">保存</button></div></form>`);}
function saveTeacherForm(e,id){e.preventDefault();let f=new FormData(e.target),name=String(f.get('name')||'').trim(),rooms=f.getAll('rooms'),old=db.teachers.find(x=>x.id===id);if(!name||!rooms.length){toast('氏名と所属教室を入力してください。');return;}if(db.teachers.some(t=>t.id!==id&&t.name===name)){toast('同じ講師名が登録されています。名前を区別してください。');return;}let t={...old,id:old?.id||uid('teacher'),name,kana:String(f.get('kana')||'').trim(),role:f.get('role'),classrooms:rooms,active:f.get('active')==='利用中',updatedAt:now()};v3Audit('講師登録','','',old?'講師マスターを更新':'講師を登録',old||'新規',t);if(old)db.teachers[db.teachers.indexOf(old)]=t;else db.teachers.push(t);persist();closeModal();updateActorChoices();render();toast('講師マスターに登録しました。');}
const v3OldFilteredBooks=filteredBooks;
filteredBooks=function(f){return v3OldFilteredBooks(f).filter(b=>!b.room||b.room==='両教室'||b.room===currentRoom());};
const v3OldOpenBook=openBookForm, v3OldSaveBook=saveBookForm;
openBookForm=function(id=''){v3OldOpenBook(id);let b=db.catalog.find(x=>x.id===id),form=document.getElementById('modal-body')?.querySelector('form');if(!form)return;let chooser=`<label class="field mt">教材を表示する教室<select name="bookRoom">${['両教室',currentRoom()].map(x=>option(x,x,b?.room||'両教室')).join('')}</select></label>`;form.insertAdjacentHTML('beforeend',chooser);};
saveBookForm=function(e,id){let f=new FormData(e.target),room=f.get('bookRoom')||'両教室';v3OldSaveBook(e,id);let book=db.catalog.find(b=>b.id===id)||[...db.catalog].reverse().find(b=>b.title===String(f.get('title')).trim());if(book){book.room=room;persist();}};
function masterBooks(){return `<div class="card"><div class="master-toolbar"><div><span class="room-banner">${esc(currentRoom())}</span> <b>教材マスター</b></div><button class="btn primary" onclick="openBookForm()">＋ 教材を登録</button></div><div class="toolbar"><label class="field">教材名<input type="search" value="${esc(extra.catalog.q)}" oninput="extra.catalog.q=this.value;document.getElementById('master-books').innerHTML=masterBookRows()" placeholder="教材名を検索"></label><label class="field">教科<select onchange="extra.catalog.subject=this.value;render()">${subjOptions(extra.catalog.subject)}</select></label><label class="field">学年<select onchange="extra.catalog.grade=this.value;render()">${gradeOptions(extra.catalog.grade)}</select></label><label class="field">属性<select onchange="extra.catalog.attribute=this.value;render()">${attributeOptions(extra.catalog.attribute)}</select></label></div><div id="master-books">${masterBookRows()}</div><p class="mini-note mt">教材候補は学年・教科・属性で優先表示。授業中は手入力もできます。履歴中の教材名はマスター名を変更しても書き換えません。</p></div>`;}
function masterBookRows(){let bs=filteredBooks(extra.catalog);return `<div class="filter-result">${bs.length}件を表示</div><div class="tablewrap"><table class="master-table"><thead><tr><th>教材名</th><th>教科</th><th>対象学年</th><th>属性</th><th>教室</th><th>操作</th></tr></thead><tbody>${bs.map(b=>`<tr><td><b>${esc(b.title)}</b></td><td>${esc(b.subject)}</td><td>${(b.grades||[]).map(shortGrade).join('・')||'全学年'}</td><td>${(b.attributes||[]).map(esc).join('・')||'指定なし'}</td><td>${esc(b.room||'両教室')}</td><td><button class="btn small" onclick="openBookForm('${b.id}')">編集</button></td></tr>`).join('')||'<tr><td colspan="6">教材がありません。</td></tr>'}</tbody></table></div>`;}
// Extend audit filters and manual review checks.
const v3OldAudit=renderAudit;
renderAudit=function(){let h=v3OldAudit();let more=['講師登録','掲示板','授業準備'].map(x=>option(x,x,state.audit.type)).join('');return h.replace('<option value="">すべて</option>','<option value="">すべて</option>'+more);};
const v3OldReviewLesson=reviewLesson;
reviewLesson=function(id){v3OldReviewLesson(id);if(!canManage()){let button=document.getElementById('modal')?.querySelector('button[onclick*="markReviewed"]');if(button)button.disabled=true;}};
markReviewed=function(id){if(!canManage()){toast('報告確認は教室長・代表の役割で行います。');return;}let l=db.lessons.find(x=>x.id===id);if(!l)return;v3Audit('報告確認',l.student,l.subject,'授業報告を確認',l.status,'確認済み');l.status='確認済み';l.reviewedAt=now();l.reviewedBy=state.actor;persist();closeModal();render();toast('教室長の確認済みにしました。');};
// Homework is a repeatable independent list with textbook choices, not only a free-text box.
function blankHomework(){return {id:uid('hw'),catalogId:'',name:'',pages:'',instruction:'',sourcePages:''};}
function asHomeworkItems(x){if(Array.isArray(x?.homeworkItems))return clone(x.homeworkItems);let mats=asMaterials(x).filter(m=>m.homework&&m.homework.trim()).map(m=>({id:uid('hw'),catalogId:m.catalogId||'',name:m.name||'',pages:m.homework, instruction:'',sourcePages:''}));if(mats.length)return mats;let note=String(x?.homeworkNote??x?.homework??'').trim();return note&&note!=='なし'?[{id:uid('hw'),catalogId:'',name:'',pages:'',instruction:note,sourcePages:''}]:[blankHomework()];}
function hwText(x){const list=asHomeworkItems(x).filter(h=>h.name?.trim()||h.pages?.trim()||h.instruction?.trim()).map(h=>[h.name,h.pages,h.instruction].filter(Boolean).join(' ／ '));const add=String(x.homeworkNote??x.homework??'').trim();const mats=asMaterials(x).filter(m=>m.homework?.trim());if(list.length)return list.join('\n')+(add&&add!=='なし'&&!list.some(s=>s.includes(add))?'\n補足：'+add:'');if(add)return add;return mats.map(m=>[m.name,m.homework].filter(Boolean).join(' ／ ')).join('\n')||'なし';}
function renderHWRow(h,j,token){return `<div class="hw-row" data-home-index="${j}"><div class="row between mb"><b>宿題 ${j+1}</b><div class="row" style="gap:5px"><button type="button" class="btn small" onclick="openHomeworkBookPicker('${token}',${j})">教材候補から選ぶ</button><button type="button" class="btn text small" onclick="removeHomeworkRow('${token}',${j})">× 削除</button></div></div><div class="hw-fields"><label class="field">教材名<input data-home-field="name" value="${esc(h.name||'')}" placeholder="教材名／手入力可"></label><label class="field">宿題の範囲<input data-home-field="pages" value="${esc(h.pages||'')}" placeholder="例：p.45〜47"></label><label class="field">指示・取り組み方<input data-home-field="instruction" value="${esc(h.instruction||'')}" placeholder="例：問1〜5、途中式を書く"></label></div>${h.sourcePages?`<div class="source-hint">前回の宿題：${esc(h.sourcePages)} <button type="button" class="btn text small" onclick="reuseHomeworkRange('${token}',${j})">同じ範囲を使う</button></div>`:''}</div>`;}
const v3OldEntry=renderEntry;
renderEntry=function(d,token){if(!Array.isArray(d.homeworkItems))d.homeworkItems=asHomeworkItems(d);let h=v3OldEntry(d,token);let st=h.indexOf('<label class="field mt">今回の宿題・取り組み方');let en=h.indexOf('<div class="note-new">',st);if(st<0||en<st)return h;let replacement=`<div class="record-scope hw-scope"><div class="row between"><b>今回の宿題・教材</b><span class="tiny muted">複数の宿題を追加できます</span></div>${d.homeworkItems.map((hw,j)=>renderHWRow(hw,j,token)).join('')}<button type="button" class="btn small" onclick="addHomeworkRow('${token}')">＋ 宿題を追加</button><div class="field-hint" style="margin-top:7px">よく使う教材から選ぶか、教材名・範囲を直接入力できます。宿題を出さない場合は下の補足欄に「なし」と入力してください。</div><label class="field mt">宿題の補足・取り組み方（任意）<textarea name="homework" rows="2" placeholder="必要なら補足を入力／宿題なしの場合は「なし」">${esc(d.homework||'')}</textarea></label></div>`;return h.slice(0,st)+replacement+h.slice(en);};
const v3OldMaterialRow=renderMaterialRow;
renderMaterialRow=function(m,j,token){let html=v3OldMaterialRow(m,j,token);return html.replace(/<label class="field">この教材の宿題<input[^>]*><\/label>/,'');};
const v3OldCapture=captureEntry;
captureEntry=function(token){let d=v3OldCapture(token),root=editorRoot(token);if(!d||!root)return d;let old=d.homeworkItems||[];d.homeworkItems=[...root.querySelectorAll('[data-home-index]')].map(row=>{let j=Number(row.dataset.homeIndex),prev=old[j]||blankHomework(),h={...prev};['name','pages','instruction'].forEach(k=>h[k]=row.querySelector(`[data-home-field="${k}"]`)?.value||'');if(prev.name!==h.name)h.catalogId='';return h;});touchDraft(d);persist();return d;};
function addHomeworkRow(token){let d=captureEntry(token);if(!d)return;d.homeworkItems.push(blankHomework());persist();refreshEditor(token);}
function removeHomeworkRow(token,j){let d=captureEntry(token);if(!d)return;let h=d.homeworkItems[j];if((h?.name||h?.pages||h?.instruction)&&!confirm('この宿題行を削除しますか？'))return;d.homeworkItems.splice(j,1);if(!d.homeworkItems.length)d.homeworkItems=[blankHomework()];touchDraft(d);persist();refreshEditor(token);}
function reuseHomeworkRange(token,j){let d=captureEntry(token),h=d?.homeworkItems[j];if(!h)return;h.pages=h.sourcePages||'';touchDraft(d);persist();refreshEditor(token);}
const v3OldOpenBookPicker=openBookPicker;
function openHomeworkBookPicker(token,index){v3OldOpenBookPicker(token,0);extra.bookPicker.kind='homework';extra.bookPicker.index=index;renderBookPicker();}
const v3OldChooseBook=chooseBook;
chooseBook=function(id){let p=extra.bookPicker;if(p?.kind==='homework'){let d=getEditor(p.token),h=d?.homeworkItems?.[p.index],b=db.catalog.find(x=>x.id===id);if(!h||!b)return;h.name=b.title;h.catalogId=b.id;touchDraft(d);persist();closePicker();refreshEditor(p.token);toast('宿題の教材を設定しました。範囲・取り組み方を入力してください。');return;}v3OldChooseBook(id);};
const v3OldBookPicker=renderBookPicker;
renderBookPicker=function(){v3OldBookPicker();if(extra.bookPicker?.kind==='homework')document.getElementById('picker-title').textContent='宿題の教材を選ぶ';};
const v3OldCopyPrevious=copyPrevious;
copyPrevious=function(token,kind){if(kind!=='homework')return v3OldCopyPrevious(token,kind);let d=captureEntry(token),p=prevLesson(d);if(!p){toast('前回の宿題の記録がありません。');return;}if(d.homeworkItems.some(h=>h.name||h.pages||h.instruction)&&!confirm('現在の宿題欄を前回の宿題で置き換えますか？'))return;d.homeworkItems=asHomeworkItems(p).map(h=>({...blankHomework(),catalogId:h.catalogId||'',name:h.name||'',sourcePages:h.pages||'',pages:'',instruction:h.instruction||''}));d.homework='';touchDraft(d);persist();refreshEditor(token);toast('前回の宿題教材を引き継ぎました。今回の範囲を確認して入力してください。');};
const v3OldPrevious=renderPrevious;
renderPrevious=function(d,prev,token){let h=v3OldPrevious(d,prev,token);if(prev){h=h.replace('前回使った教材・範囲', '前回使った教材・範囲');h=h.replace('<div class="row" style="margin-top:9px;gap:6px">',`<p class="small muted mt">前回の宿題：${esc(hwText(prev))}</p><div class="row" style="margin-top:9px;gap:6px"><button type="button" class="btn small" onclick="copyPrevious('${token}','homework')">前回の宿題教材を使う</button>`);}return h;};
// Safe-to-print report tables reflect the separate homework choices.
reportMaterials=function(l){let ms=asMaterials(l).filter(m=>m.name);if(!ms.length)return '<p class="small muted">教材の記録なし</p>';return `<table class="mat-table"><thead><tr><th>教材</th><th>今回の範囲・内容</th></tr></thead><tbody>${ms.map(m=>`<tr><td>${esc(m.name)}</td><td>${esc([m.pages,m.content].filter(Boolean).join(' ／ '))}</td></tr>`).join('')}</tbody></table>`;};
const v3OldLessonCard=lessonCard;
lessonCard=function(l,opts={}){let h=v3OldLessonCard(l,opts);let old=String(l.homework||'');let homework=hwText(l);if(homework&&homework!==old){h=h.replace('</article>',`<p class="tiny mt" style="white-space:pre-line"><b>宿題：</b> ${esc(homework)}</p></article>`);}return h;};
currentHomework=function(d){let lines=(d.homeworkItems||[]).filter(h=>String(h.name||'').trim()||String(h.pages||'').trim()||String(h.instruction||'').trim()).map(h=>[h.name,h.pages,h.instruction].filter(Boolean).join(' ／ '));let supplement=String(d.homework||'').trim();if(supplement)lines.push(supplement==='なし'?'宿題なし':'補足：'+supplement);return lines.join('\n');};
// A4 subject report informed by the attached one-page example. All wording remains editable.
function termEditKey(sid,sub){return sid+'::'+sub;}
function termSeed(sid,sub,ls){let s=safeStudent(sid),sorted=[...ls].sort((a,b)=>a.date.localeCompare(b.date)),first=sorted[0],last=sorted[sorted.length-1],units=[...new Set(ls.map(l=>l.unit).filter(Boolean))].slice(-6),goods=[...ls].reverse().filter(l=>/理解が進ん|でき|整理|説明|修正|取り組/.test(l.obs||'')),stumbles=[...new Set(ls.flatMap(l=>l.stumbles||[]))].slice(0,3);let lead=`対象期間は「${units.join('・')||'授業記録のある単元'}」に取り組みました。${last?`直近は${last.unit||sub}を学習し、授業中の到達度は${last.level??'未評価'}${last.level!=null?'／4':''}でした。`:''}`;return {
 progress:lead,
 strength:goods[0]?.obs||'授業記録から、今回見つかったよさやできるようになったことを入力してください。',
 challenge:`${stumbles.length?'授業で確認したつまずき：'+stumbles.join('・')+'。\n':''}${last?.next?'次回の確認事項：'+last.next:'今後確認したい課題を記入してください。'}`,
 goal1:'学習内容の定着',approach1:last?.next||'今回学習した範囲を復習し、類題を確認する。',target1:'基本問題を、自分で手順を確認しながら解けるかを確かめる。',
 goal2:'学習の振り返り',approach2:'正答・誤答の理由を確認し、次回授業へつなげる。',target2:'自力でできることと、支援が必要なことを具体的に確認する。',
 summary:`${sub}では、授業で見つかった強みを活かしながら、${last?.unit||'学習した内容'}の理解と定着を確認していきます。次回以降も、できることの変化を記録し、指導方法を調整します。`,
 showStrength:true,showChallenge:true
};}
function termValue(sid,sub,ls){let key=termEditKey(sid,sub);return state.report.edits[key]||(state.report.edits[key]=termSeed(sid,sub,ls));}
function termOnePage(sid,sub,ls){let s=safeStudent(sid),r=state.report,c=termValue(sid,sub,ls),compact=r.termDensity==='compact';let f=Math.min(11,Math.max(7.5,Number(r.fontSize)||9.4));return `<section class="report-page term-sheet ${compact?'compact':''}" style="--term-font-size:${f}pt"><div class="term-head"><h2>個別指導報告書（学習所見・指針）</h2><div class="term-meta">学年：${esc(s.grade)}　｜　科目：${esc(sub)}</div></div><div class="term-person"><div><b>${esc(s.name)} さん</b>　／　${esc(currentRoom())}</div><span>${partDate(r.from)} 〜 ${partDate(r.to)}</span></div><div class="term-title">1. 現在の学習状況と進度</div><div class="term-body">${esc(c.progress)}</div><div class="term-title">2. 生徒の学習傾向と課題・要因分析</div>${c.showStrength!==false?`<div class="term-body good"><span class="field-heading">強み・優れている点</span>${esc(c.strength)}</div>`:''}${c.showChallenge!==false?`<div class="term-body caution"><span class="field-heading">具体的な課題・今後の確認事項</span>${esc(c.challenge)}</div>`:''}<div class="term-title">3. 教室での指導対応と今後のステップ</div><table class="term-table"><colgroup><col style="width:25%"><col style="width:42%"><col style="width:33%"></colgroup><thead><tr><th>重点項目</th><th>具体的なアプローチ内容</th><th>今後1か月の目標</th></tr></thead><tbody>${[1,2].map(j=>`<tr><td>${esc(c['goal'+j])}</td><td>${esc(c['approach'+j])}</td><td>${esc(c['target'+j])}</td></tr>`).join('')}</tbody></table><div class="term-body summary"><span class="field-heading">指導方針まとめ</span>${esc(c.summary)}</div><div class="term-foot">明光義塾 ${esc(currentRoom())} ／ 学びのスキルカルテ　　※操作確認用の架空データ・文章案です。教室長が確認・修正して発行します。</div></section>`;}
reportTerm=function(sid,ls){let subs=[...new Set(ls.map(l=>l.subject))];if(state.report.subject)subs=subs.filter(x=>x===state.report.subject);return subs.map(sub=>termOnePage(sid,sub,ls.filter(x=>x.subject===sub))).join('');};
function renderTermEditor(sid,sub,ls){let key=termEditKey(sid,sub),s=safeStudent(sid),c=termValue(sid,sub,ls);const field=(k,title,rows=3)=>`<label class="field edit-field">${title}<textarea rows="${rows}" oninput="changeTermField('${sid}','${esc(sub)}','${k}',this.value)">${esc(c[k]||'')}</textarea></label>`;return `<details class="report-edit" ${state.report.openEditor===key?'open':''} ontoggle="if(this.open)state.report.openEditor='${key}'"><summary class="strong small">${esc(s.name)}さん ／ ${esc(sub)} — 印刷文章を手動で微調整</summary><p class="mini-note">右のA4プレビューに即時反映します。元の授業記録は変更しません。文章は必ず講師・教室長が確認してください。</p>${field('progress','1. 現在の学習状況と進度',4)}<h3>2. 生徒の学習傾向と課題・要因分析</h3>${field('strength','強み・優れている点',4)}${field('challenge','具体的な課題・今後の確認事項',4)}<div class="row mt"><label class="checkline"><input type="checkbox" ${c.showStrength!==false?'checked':''} onchange="changeTermField('${sid}','${esc(sub)}','showStrength',this.checked)">強みの欄を表示</label><label class="checkline"><input type="checkbox" ${c.showChallenge!==false?'checked':''} onchange="changeTermField('${sid}','${esc(sub)}','showChallenge',this.checked)">課題の欄を表示</label></div><h3>3. 教室での指導対応と今後のステップ</h3>${[1,2].map(j=>`<div class="plan-edit-grid">${field('goal'+j,'重点項目 '+j,2)}${field('approach'+j,'具体的なアプローチ',3)}${field('target'+j,'1か月後の目標',3)}</div>`).join('')}${field('summary','指導方針まとめ',4)}</details>`;}
function changeTermField(sid,sub,k,v){let ls=reportLessons(sid).filter(x=>x.subject===sub),c=termValue(sid,sub,ls);c[k]=v;state.report.confirmed=false;let ck=document.getElementById('report-confirmed');if(ck)ck.checked=false;document.getElementById('report-preview').innerHTML=buildReport().html;updatePrintButton();reviewPrintFit();}
function setTermStyle(kind,val){state.report[kind]=val;state.report.confirmed=false;let ck=document.getElementById('report-confirmed');if(ck)ck.checked=false;document.getElementById('report-preview').innerHTML=buildReport().html;updatePrintButton();reviewPrintFit();}
function reviewPrintFit(){let pages=[...document.querySelectorAll('#report-preview .term-sheet')],overflow=pages.filter(el=>el.scrollHeight>el.clientHeight+3);let notice=document.getElementById('print-fit');if(notice)notice.textContent=overflow.length?`注意：${overflow.length}枚で内容が用紙からはみ出す可能性があります。文章・文字サイズ・余白を調整してください。`:'プレビューはA4比率です。印刷前にページ数・改ページを確認してください。';}
// Daily reports also show homework assignments selected independently of teaching materials.
reportDaily=function(sid,ls){let s=safeStudent(sid);return ls.map(l=>`<section class="report-page">${headerReport(s,'学習報告書',l.subject)}<div class="row between"><h2>${partDate(l.date)} ${esc(l.slot)}コマ</h2><span class="badge blue">${esc(l.subject)}</span></div><div class="report-section"><h3>学習した内容</h3><p>${esc(l.unit)}</p>${reportMaterials(l)}</div><div class="report-section"><h3>授業の様子・できたこと</h3><p>${esc(l.obs)}</p></div><div class="report-section"><h3>今回の到達状況</h3><p>${l.level==null?'未評価':l.level+'/4：'+LEVELS[String(l.level)]}</p></div><div class="report-section"><h3>次回の指導内容</h3><p>${esc(l.next)}</p></div><div class="report-section"><h3>宿題・家庭での取り組み</h3><p>${esc(hwText(l))}</p></div>${reportFooter()}</section>`).join('');};
// Printable 学プロ records, two columns per page as in the original paper sheet.
function gakuproEntry(l){let s=safeStudent(l.student),ms=asMaterials(l).filter(m=>m.name);let homework=hwText(l);return `<article class="gakupro-entry"><div class="rowbar"><span>${partDate(l.date)} ${esc(l.slot)}コマ　${esc(l.subject)}</span><span>講師 ${esc(l.teacher)}</span></div><div class="mini-fields"><div><div class="mini-label">単元・進度</div>${esc(l.unit||'—')}<br>復習・同範囲・予習：${esc(l.mode||'未記録')}</div><div><div class="mini-label">教材・学習内容</div>${esc(ms.map(m=>m.name+(m.pages?' '+m.pages:'')).join('\n')||'未記録')}</div></div><div class="mini-fields"><div><div class="mini-label">理解度・正答率</div>到達度：${l.level??'未評価'} /4<br>正答率：${l.correct!=null&&l.total?Math.round(l.correct/l.total*100)+'%':'未記録'}</div><div><div class="mini-label">宿題</div>${esc(homework)}</div></div><div class="note-box"><b>できたこと・授業の様子</b>${esc(l.obs||'未記録')}</div><div class="note-box"><b>今後の指導</b>${esc(l.next||'未記録')}</div><div class="mini-info"><b>特記事項（内部用）：</b>${esc(l.handoverText||l.internal||'—')} <span style="float:right">${esc(l.status||'下書き')}</span></div></article>`;}
reportList=function(sid,ls){let s=safeStudent(sid),count=state.report.listDensity==='6'?6:4,html='';for(let i=0;i<ls.length;i+=count){let chunk=ls.slice(i,i+count);html+=`<section class="report-page gakupro-sheet ${count===6?'dense':''}"><div class="gakupro-header"><div><h2>学習報告書（学プロ記録一覧）</h2><p class="small">${esc(s.name)}　${esc(s.grade)}　${esc(currentRoom())}</p></div><div style="text-align:right;font-size:10px">${partDate(state.report.from)}〜${partDate(state.report.to)}<br>内部用／${Math.floor(i/count)+1}ページ</div></div><div class="gakupro-grid">${chunk.map(gakuproEntry).join('')}</div><div class="report-footer">授業の記録を紙の学プロに近い2列形式で出力。内部用の申し送りを含むため、保護者には配布しないでください。　架空データ</div></section>`;}return html;};
renderReports=function(){let html=v2ref.renderReports();html=html.replace('期間指定の成長報告書','個別指導報告書（各教科A4・1枚）').replace('学プロの記録一覧（内部用）','学プロ記録一覧（紙の学プロ風）');let pos=html.indexOf('<label class="checkline mt">');if(pos>=0){let ctl=`<div class="report-style-controls" style="font-size:11px"><span class="strong">印刷調整</span><label class="field" style="width:90px">文字サイズ<select onchange="setTermStyle('fontSize',this.value)">${[['9.4','標準'],['8.8','小さめ'],['8.2','小'],['10.2','大']].map(([v,n])=>option(v,n,state.report.fontSize)).join('')}</select></label><label class="field" style="width:114px">余白<select onchange="setTermStyle('termDensity',this.value)">${[['standard','標準'],['compact','コンパクト']].map(([v,n])=>option(v,n,state.report.termDensity)).join('')}</select></label><label class="field" style="width:126px">学プロ一覧<select onchange="setTermStyle('listDensity',this.value)">${[['4','2列×2行'],['6','2列×3行']].map(([v,n])=>option(v,n,state.report.listDensity)).join('')}</select></label></div><p id="print-fit" class="print-alert" style="padding-bottom:9px">各教科A4・1枚。印刷前にプレビューで確認してください。</p>`;html=html.slice(0,pos)+ctl+html.slice(pos);}return html;};
updateReportPreview=function(){let r=state.report,out=buildReport(),host=document.getElementById('report-preview');if(!host)return;host.innerHTML=out.html||'<div class="empty">対象の記録がありません。生徒・期間・教科を確認してください。</div>';document.getElementById('report-summary').textContent=`対象 ${r.students.length}名 ／ ${r.type==='term'?'教科別にA4・1枚ずつ':r.type==='list'?'紙の学プロ風レイアウト':'授業ごとに印刷'} ／ 印刷プレビュー`;let editor=document.getElementById('report-editors');if(editor)editor.innerHTML=r.type==='term'?r.students.map(sid=>{let ls=reportLessons(sid),subs=[...new Set(ls.map(x=>x.subject))];return subs.map(sub=>renderTermEditor(sid,sub,ls.filter(x=>x.subject===sub))).join('');}).join(''):'<p class="small muted mt">学プロ一覧・授業ごとの報告書は元記録から作成します。所見を直す場合は、授業履歴で該当記録を編集してください。</p>';let ck=document.getElementById('report-confirmed');if(ck)ck.checked=r.confirmed;updatePrintButton();reviewPrintFit();};
// Ensure printing only scoped subjects and print counts display accurate number of pages.
const oldBuildReport=buildReport;
buildReport=function(){let result=oldBuildReport();result.pages=(result.html.match(/class="report-page/g)||[]).length;return result;};
// Preserve manually edited term report drafts within a scoped reporting period.
db.narrativeDrafts ||= {};
const scopeForReport=()=>[currentRoom(),state.report.from,state.report.to,state.report.subject].join('|');
const v3OldSetReport=setReport;
setReport=function(k,v){v3OldSetReport(k,v);state.report.edits=clone(db.narrativeDrafts[scopeForReport()]||{});updateReportPreview();};
const v3ChangeTermField=changeTermField;
changeTermField=function(sid,sub,k,v){v3ChangeTermField(sid,sub,k,v);db.narrativeDrafts[scopeForReport()]=clone(state.report.edits);persist();};
// Initial demo group is intentionally illustrative; it is not a recurring assignment.
if(!db.demoSessionV3){let groups=[{r:'仁保教室',teacher:'講師 A（デモ）',slot:'B'},{r:'広島大州教室',teacher:'講師 B（デモ）',slot:'C'}];for(let g of groups){let people=db.students.filter(s=>s.school===g.r&&activeStudent(s)).slice(0,3),seats=people.map(s=>({student:s.id,subject:s.subjects[0]}));while(seats.length<3)seats.push(null);let key=sessionKey(g.r,TODAY,g.slot,g.teacher);if(!db.sessions.some(s=>s.key===key))db.sessions.push({id:uid('demo-session'),key,room:g.r,date:TODAY,slot:g.slot,teacher:g.teacher,seats,updatedBy:'教室長（デモ）',updatedAt:'2026-11-18T00:00:00Z'});}db.demoSessionV3=true;}
if(!V3SLOTS.includes(extra.desk.slot))extra.desk.slot='B';
if(!roomTeachers().some(t=>t.name===extra.desk.teacher))extra.desk.teacher=roomTeacherFirst();
// The initial N room B sample is shown immediately; other date/slot combos start empty unless saved.
extra.desk.date=TODAY;
restoreSession();
makeRoomSwitch();updateActorChoices();
const v3OldSettings=renderSettings;
renderSettings=function(){return v3OldSettings()+`<section class="card mt"><h2>改訂版 v3 の運用</h2><p class="small muted mt">教室モードを切り替えると生徒・講師をその教室に限定表示。XYZABCDの各コマに講師が必要な生徒を登録し、次に同じ条件を選ぶと再表示します。宿題には教材候補を使い、教科別A4報告書は手動で文章・文字サイズを調整可能です。</p><p class="small muted mt">バーコードは Code39 方式で生徒番号のみを符号化。USB/Bluetoothスキャナーなら文字入力とEnterで使えます。カメラ利用は対応ブラウザと許可が必要です。夜間バックアップ・権限認証・複数端末共有・サーバー保存は未実装です。</p></section>`;};
const v3OldReset=resetDemo;
resetDemo=function(){if(!confirm('このブラウザのデモ入力を初期化しますか？'))return;DebugStorage.removeItem(KEY);db=seed();extendData(); // recreate v2 80-name examples
 db.activeRoom=CLASSROOMS[0];db.teachers=[];db.sessions=[];db.announcements=[];db.demoSessionV3=false;extra.desk={date:TODAY,slot:'B',teacher:'講師 A（デモ）',seats:[null,null,null],collapsed:[false,true,true],focus:-1};state.student='s1';state.subject='数学';state.page='home';persist();toast('初期化しました。ページを再読み込みして、架空データを再生成してください。');};
// Expose a quick safe print status display, rather than claiming the printer finished.
const v3OldPrint=issuePrint;
issuePrint=function(){if(state.report.type==='term'){let issues=[...document.querySelectorAll('#report-preview .term-sheet')].filter(el=>el.scrollHeight>el.clientHeight+3);if(issues.length){if(!confirm(`A4に収まりきらない可能性がある報告書が${issues.length}枚あります。文字サイズや文章の調整をおすすめします。そのまま印刷画面へ進みますか？`))return;}}v3OldPrint();};
// Final room scoping and practical validation refinements.
const v3OriginalRoster=renderRoster;
renderRoster=function(){let h=v3OriginalRoster();let st=h.indexOf('<label class="field">教室<select');let en=st>=0?h.indexOf('</select></label>',st):-1;if(st>=0&&en>st){h=h.slice(0,st)+`<span class="room-banner" style="align-self:center">${esc(currentRoom())}の生徒のみ表示</span>`+h.slice(en+'</select></label>'.length);}return h;};
const v3HandoverResults=handoverResults;
handoverResults=function(){let all=db.handovers;try{db.handovers=all.filter(x=>isSameRoom(x.student));return v3HandoverResults();}finally{db.handovers=all;}};
const v3StudentSave=saveStudentForm;
saveStudentForm=function(e,id){let code=new FormData(e.target).get('code');if(code&& !/^[A-Z0-9-]+$/i.test(String(code).trim())){toast('バーコードを使用するため、生徒番号は英数字とハイフンで入力してください。');return;}v3StudentSave(e,id);};
const v3EntrySubmit=submitEntry;
submitEntry=function(token,intent){let d=captureEntry(token);if(d?.homeworkItems?.some(x=>!String(x.name||'').trim()&&(String(x.pages||'').trim()||String(x.instruction||'').trim()))){toast('宿題のページや指示を入力した行には、教材名も入力してください。');return;}return v3EntrySubmit(token,intent);};
resetDemo=function(){if(!confirm('このブラウザのデモ入力・記録・登録情報を初期化しますか？'))return;try{DebugStorage.removeItem(KEY);window.location.reload();}catch(e){toast('ブラウザ保存の初期化に失敗しました。画面を再読み込みして試してください。');}};
// Update static v2 footer in the sidebar without changing older data.
document.querySelector('.sidebar-foot .tiny.muted').textContent='電子学プロ / Prototype 0.5';
// Keep the operator and room mode visible in the top bar.
document.getElementById('actor').addEventListener('change',()=>{render();});
state.report.edits=clone(db.narrativeDrafts[scopeForReport()]||{});
persist();render();

/* v4 | Changes are additive, using existing browser-only demo storage. */
const V4_VERSION='0.4';
const V4_AXIS_POOL=[...AXES,'計算の正確さ','語彙力','文法理解','読解力','資料を読み取る力','記述する力','発想する力','応用する力','集中して取り組む力','粘り強さ','質問する力','目標を立てる力','計画を実行する力','協力する力','聞いて理解する力','要点をまとめる力','問題を発見する力','時間を管理する力','自分で調べる力'];
db.skillAxisConfigs ||= {};
db.skillAxisPool ||= V4_AXIS_POOL;
db.examResults ||= [];
db.manualReports ||= {};
db.sidebarWidth ??= 224;
db.sidebarCollapsed ??= false;
if(!db.demoExamSeedV4){
 const seedExam=(sid,date,title,kind,subjects)=>db.examResults.push({id:uid('exam'),student:sid,date,title,type:kind,grade:safeStudent(sid)?.grade||'',subjects,notes:'操作確認用の架空の成績。実際の成績ではありません。',demo:true,createdAt:now(),updatedAt:now()});
 seedExam('s1','2026-06-15','1学期期末テスト','定期テスト',[{subject:'数学',score:64,max:100,average:58,deviation:null,rank:null},{subject:'英語',score:73,max:100,average:65,deviation:null,rank:null}]);
 seedExam('s1','2026-09-11','夏期まとめ模試','模試',[{subject:'数学',score:73,max:100,average:57,deviation:53.8,rank:null},{subject:'英語',score:69,max:100,average:60,deviation:51.4,rank:null}]);
 seedExam('s1','2026-10-23','2学期中間テスト','定期テスト',[{subject:'数学',score:79,max:100,average:62,deviation:null,rank:null},{subject:'英語',score:81,max:100,average:66,deviation:null,rank:null}]);
 seedExam('s2','2026-09-17','秋の実力模試','模試',[{subject:'数学',score:67,max:100,average:59,deviation:51.9,rank:null}]);
 db.demoExamSeedV4=true;
}
const V4_prevRenderNav=renderNav;
renderNav=function(){V4_prevRenderNav();let nav=document.getElementById('nav');let index=nav.querySelector('[onclick="navigate(\'profile\')"]');if(index){index.insertAdjacentHTML('beforebegin',`<button title="定期テスト・模試" aria-label="定期テスト・模試" class="navbtn ${state.page==='exams'?'active':''}" onclick="navigate('exams')">${icon('history')}<span class="navname">定期テスト・模試</span></button>`);}nav.querySelectorAll('.navbtn').forEach(el=>el.setAttribute('title',el.getAttribute('aria-label')||el.textContent.trim()));};
// Sidebar: user-adjustable width on a desktop, compact via toggle.
const handle=document.createElement('div');handle.id='nav-resizer';handle.title='ドラッグして左のメニュー幅を調整';handle.setAttribute('role','separator');handle.setAttribute('aria-label','メニューの幅を変更');document.body.append(handle);
const sidebarToggle=document.createElement('button');sidebarToggle.className='nav-width-toggle';sidebarToggle.type='button';document.querySelector('.sidebar').append(sidebarToggle);
function applySidebar(){let width=db.sidebarCollapsed?68:Math.max(170,Math.min(355,Number(db.sidebarWidth)||224));document.documentElement.style.setProperty('--nav-width',width+'px');document.body.classList.toggle('nav-compact',db.sidebarCollapsed);sidebarToggle.textContent=db.sidebarCollapsed?'»':'« 縮小';sidebarToggle.title=db.sidebarCollapsed?'メニューを広げる':'メニューを細くする';}
sidebarToggle.onclick=()=>{db.sidebarCollapsed=!db.sidebarCollapsed;db.sidebarWidth ||=224;persist();applySidebar()};
let resizeStarting=false;
handle.addEventListener('pointerdown',e=>{if(window.innerWidth<=950)return;resizeStarting=true;db.sidebarCollapsed=false;handle.classList.add('is-dragging');handle.setPointerCapture(e.pointerId);applySidebar();});
handle.addEventListener('pointermove',e=>{if(!resizeStarting)return;db.sidebarWidth=Math.max(170,Math.min(355,e.clientX));applySidebar();});
function stopSidebarResize(){if(!resizeStarting)return;resizeStarting=false;handle.classList.remove('is-dragging');persist();}
handle.addEventListener('pointerup',stopSidebarResize);handle.addEventListener('pointercancel',stopSidebarResize);
const V4_prevRender=render;
render=function(){V4_prevRender();if(state.page==='exams')document.getElementById('content').innerHTML=renderExams();applySidebar();};
// 1:N session; 3 visible starting seats but absolutely no fixed maximum.
function normalizeDesk(){let w=extra.desk;w.seats=Array.isArray(w.seats)?w.seats:[];while(w.seats.length<3)w.seats.push(null);w.collapsed=Array.isArray(w.collapsed)?w.collapsed:[];while(w.collapsed.length<w.seats.length)w.collapsed.push(w.collapsed.length!==0);w.collapsed=w.collapsed.slice(0,w.seats.length);extra.scrolls ||= [];while(extra.scrolls.length<w.seats.length)extra.scrolls.push(0);w.focus=Number.isInteger(w.focus)&&w.focus<w.seats.length?w.focus:-1;}
normalizeDesk();
function addDeskSeat(){captureVisibleEditors();normalizeDesk();extra.desk.seats.push(null);extra.desk.collapsed.push(false);extra.scrolls.push(0);storeView();render();toast('表示枠を追加しました。授業人数の上限は設定していません。');}
const V4_originalRestoreSession=restoreSession;
restoreSession=function(){let w=extra.desk,entry=currentSession();w.seats=(entry?.seats||[null,null,null]).map(x=>x&&isSameRoom(x.student)?clone(x):null);w.collapsed=w.seats.map((x,i)=>i!==0);w.focus=-1;extra.scrolls=w.seats.map(()=>0);normalizeDesk();};
expandDeskAll=function(){captureVisibleEditors();normalizeDesk();extra.desk.collapsed=extra.desk.seats.map(()=>false);extra.desk.focus=-1;storeView();refreshPreservingDesk();};
removeDeskSeat=function(i){captureVisibleEditors();normalizeDesk();if(i<0||i>=extra.desk.seats.length)return;if(extra.desk.seats.length>3){extra.desk.seats.splice(i,1);extra.desk.collapsed.splice(i,1);extra.scrolls.splice(i,1);}else{extra.desk.seats[i]=null;extra.desk.collapsed[i]=false;extra.scrolls[i]=0;}extra.desk.focus=-1;storeView();render();toast('表示から外しました。授業記録と下書きは削除していません。');};
addStudentToDesk=function(id){let s=safeStudent(id);if(!s||!isSameRoom(id)){toast('現在の教室の在籍生徒を選んでください。');return;}normalizeDesk();let i=extra.desk.seats.findIndex(x=>x?.student===id);if(i>=0){extra.desk.collapsed[i]=false;extra.desk.focus=i;storeView();navigate('desk');return;}i=extra.desk.seats.findIndex(x=>!x);if(i<0){extra.desk.seats.push(null);extra.desk.collapsed.push(false);extra.scrolls.push(0);i=extra.desk.seats.length-1;}replaceDeskStudent(i,id);};
const V4_priorChooseStudent=chooseStudent;
chooseStudent=function(id){let p=extra.picker;if(p?.target!=='desk')return V4_priorChooseStudent(id);let s=safeStudent(id);if(!s||!isSameRoom(id)){toast('現在の教室で在籍している生徒を選んでください。');return;}normalizeDesk();let exists=extra.desk.seats.findIndex(x=>x?.student===id);if(exists>=0&&exists!==p.seat){toast('この生徒は既に表示されています。');return;}let i=p.seat;if(i==null)i=extra.desk.seats.findIndex(x=>!x);if(i<0){i=extra.desk.seats.length;extra.desk.seats.push(null);extra.desk.collapsed.push(false);extra.scrolls.push(0);}captureVisibleEditors();extra.desk.seats[i]={student:id,subject:s.subjects?.[0]||'数学'};extra.desk.collapsed[i]=false;extra.scrolls[i]=0;storeView();closePicker();rememberStudent(id);navigate('desk');};
const V4_priorPicker=renderStudentPicker;
renderStudentPicker=function(initial=false){V4_priorPicker(initial);let d=document.getElementById('picker-body');if(d)d.innerHTML=d.innerHTML.replaceAll('3人表示','授業の表示欄').replace('表示設定だけ','表示設定だけ');};
scanStudent=function(input){let code=String(input||'').trim().toUpperCase().replace(/^LLLD[:\-]STUDENT[:\-]/,'').replace(/^LLLD[:\-]/,'');if(!code){toast('生徒番号をスキャン・入力してください。');return;}let s=db.students.find(x=>String(x.code||'').toUpperCase()===code&&x.school===currentRoom()&&activeStudent(x));if(!s){toast('この教室の在籍生徒から番号が見つかりません：'+code);return;}addStudentToDesk(s.id);toast(s.name+'さんを授業欄に追加しました。確定する場合は「このコマの生徒を保存」を押してください。');};
renderDesk=function(){normalizeDesk();let w=extra.desk,n=w.seats.filter(Boolean).length,session=currentSession();let slots=V3SLOTS.map(x=>`<button class="${x===w.slot?'active':''} ${db.sessions.some(a=>a.room===currentRoom()&&a.date===w.date&&a.slot===x&&a.teacher===w.teacher)?'ready':''}" onclick="setDeskMeta('slot','${x}')" title="${x}コマ">${x}</button>`).join('');return head('授業準備・複数生徒表示','1対3を基本に、1対4・1対5以上も追加可能。小さく畳んで必要な生徒を広く表示できます。',`<button class="btn small" onclick="expandDeskAll()">全員を開く</button><button class="btn small" onclick="navigate('master')">マスター管理</button>`)+`<div class="desk-toolbar"><span class="room-banner">${esc(currentRoom())}</span><label class="field">授業日<input type="date" value="${w.date}" onchange="setDeskMeta('date',this.value)"></label><div class="slot-picker" aria-label="コマ選択">${slots}</div><label class="field">担当講師<select onchange="setDeskMeta('teacher',this.value)">${teacherOptions(w.teacher,false)}</select></label><span class="badge ${session?'green':'amber'}">${session?'登録済み':'未登録'} ／ ${n}名表示（上限なし）</span><button class="btn primary" onclick="saveSession()">このコマの生徒を保存</button></div><div class="v4-toolbar"><button class="btn primary" onclick="addDeskSeat()">＋ 表示枠を追加</button><button class="btn" onclick="openStudentPicker('desk')">＋ 生徒を検索して追加</button><span class="action-label">誰も追加していないコマは3枠から開始。追加は何名でも可能です。</span></div><div class="card" style="padding:10px 14px;margin:8px 0"><div class="row between"><div class="scan-box"><span class="small strong">バーコードで追加</span><input id="scan-student" type="search" placeholder="生徒番号をスキャン・入力" aria-label="スキャンで生徒を登録" autocomplete="off" onkeydown="if(event.key==='Enter'){event.preventDefault();scanStudent(this.value);this.value='';}"><button class="btn small" onclick="scanStudent(document.getElementById('scan-student').value);document.getElementById('scan-student').value=''">追加</button><button class="btn small" onclick="openCameraScanner()">カメラ</button></div><details class="small" style="max-width:270px"><summary>Bluetoothスキャナーの使い方</summary>OSでスキャナーをペアリングし、キーボード入力モード・読み取り後Enterを設定。上の欄を選択して読み取ります。モックにBluetoothペアリング機能はありません。</details></div></div><div class="v4-desk-scroll-row" id="v4-desk-list">${w.seats.map((_,i)=>renderDeskSeat(i)).join('')}</div><p class="v4-layout-note">最大人数は固定していません。各生徒の所見・宿題・申し送りは別々に保存。日付・講師・XYZABCDコマの組み合わせを保存して再表示できます。</p>`;};
// Barcode sort controls: scope, primary/secondary keys and independent sort direction.
extra.barcodeSort ||= {scope:'visible',primary:'grade',primaryDir:'asc',secondary:'kana',secondaryDir:'asc'};
const V4_gradeIndex=g=>{let x=GRADES.indexOf(g);return x<0?999:x};
const v4Cmp=(a,b,key)=>{if(key==='grade')return V4_gradeIndex(a.grade)-V4_gradeIndex(b.grade);if(key==='code')return (a.code||'').localeCompare(b.code||'','ja',{numeric:true});if(key==='school')return (a.school||'').localeCompare(b.school||'','ja');if(key==='name')return (a.name||'').localeCompare(b.name||'','ja');return (a.kana||a.name||'').localeCompare(b.kana||b.name||'','ja');};
function sortedBarcodeStudents(){let b=extra.barcodeSort;let ss=b.scope==='visible'?matchStudents({...extra.roster,classroom:currentRoom(),q:extra.masterQ}):roomStudents().filter(activeStudent);return [...ss].sort((a,z)=>{let x=v4Cmp(a,z,b.primary)*(b.primaryDir==='desc'?-1:1);return x||v4Cmp(a,z,b.secondary)*(b.secondaryDir==='desc'?-1:1)||v4Cmp(a,z,'code')});}
function barcodePrintPanel(){let b=extra.barcodeSort,keys=[['grade','学年'],['kana','ふりがな'],['name','生徒名'],['code','生徒番号'],['school','所属教室']];let results=sortedBarcodeStudents();return `<div class="v4-controls-row"><label class="field">対象<select onchange="extra.barcodeSort.scope=this.value;render()">${[['visible','現在の絞り込み'],['all','教室の在籍生徒全員']].map(([v,n])=>option(v,n,b.scope)).join('')}</select></label><label class="field">第1基準<select onchange="extra.barcodeSort.primary=this.value;render()">${keys.map(([v,n])=>option(v,n,b.primary)).join('')}</select></label><label class="field">並び順<select onchange="extra.barcodeSort.primaryDir=this.value;render()">${[['asc','昇順 ↑'],['desc','降順 ↓']].map(([v,n])=>option(v,n,b.primaryDir)).join('')}</select></label><label class="field">第2基準<select onchange="extra.barcodeSort.secondary=this.value;render()">${keys.map(([v,n])=>option(v,n,b.secondary)).join('')}</select></label><label class="field">並び順<select onchange="extra.barcodeSort.secondaryDir=this.value;render()">${[['asc','昇順 ↑'],['desc','降順 ↓']].map(([v,n])=>option(v,n,b.secondaryDir)).join('')}</select></label><button class="btn primary" onclick="printBarcodes(sortedBarcodeStudents().map(s=>s.id))">${results.length}名をこの順に一括印刷</button><span class="tiny muted" style="width:100%">印刷順の先頭：${results.slice(0,7).map(s=>esc(s.grade+' '+s.name)).join(' → ')||'対象なし'}</span></div>`;}
const V4_masterStudents=masterStudents;
masterStudents=function(){let html=V4_masterStudents();html=html.replace(/<button class="btn" onclick="printBarcodes\(roomStudents\(\).map\(s=>s.id\)\)">在籍生徒のバーコードを一括印刷<\/button>/,'');let at=html.indexOf('<div id="master-list">');if(at>=0)html=html.slice(0,at)+barcodePrintPanel()+html.slice(at);return html;};
const V4_priorHome=renderHome;
renderHome=function(){let html=V4_priorHome();return html.replace('XYZABCDコマから授業準備','XYZABCDコマから複数生徒の授業準備').replace('A4報告書を作成・印刷','A4報告書を作成・印刷') .replace('<button class="btn" onclick="navigate(\'reports\')">A4報告書を作成・印刷</button>',`<button class="btn" onclick="navigate('exams')">定期テスト・模試の成績を記録</button><button class="btn" onclick="navigate('reports')">A4報告書を作成・印刷</button>`);};
const V4_priorRoster=renderRoster;
renderRoster=function(){return V4_priorRoster().replaceAll('3人表示へ','授業画面に追加');};
const V4_priorMaster=renderMaster;
renderMaster=function(){return V4_priorMaster().replaceAll('3人表示','複数生徒表示');};
// Exam results: structured facts, independent of teaching-skills scores.
extra.examFilters ||= {student:'',subject:'',type:'',from:'',to:''};
function v4ExamRows(sid='',sub='',from='',to='',type=''){return (db.examResults||[]).filter(e=>isSameRoom(e.student)&&(!sid||e.student===sid)&&(!from||e.date>=from)&&(!to||e.date<=to)&&(!type||e.type===type)).flatMap(e=>(e.subjects||[]).filter(r=>!sub||r.subject===sub).map(r=>({...r,date:e.date,title:e.title,type:e.type,examId:e.id,student:e.student,demo:!!e.demo}))).sort((a,b)=>a.date.localeCompare(b.date)||a.examId.localeCompare(b.examId));}
function v4Percent(r,valueKey='score'){let val=Number(r[valueKey]);let max=Number(r.max);return Number.isFinite(val)&&Number.isFinite(max)&&max>0?100*val/max:null;}
function v4LineChart(rows,{compact=false}={}){let data=rows.filter(r=>r.score!==null&&r.score!==''&&r.max>0).sort((a,b)=>a.date.localeCompare(b.date));if(!data.length)return `<div class="small muted" style="padding:25px 10px;text-align:center">この条件では得点データが未登録です</div>`;const W=compact?380:520,H=compact?156:240,padL=compact?25:40,padR=15,padT=compact?13:23,padB=compact?31:47,xRange=W-padL-padR,yRange=H-padT-padB;const xx=i=>padL+(data.length===1?xRange/2:i*xRange/(data.length-1));const yy=v=>padT+yRange*(1-Math.max(0,Math.min(100,v))/100);let body='';for(let v=0;v<=100;v+=25){let y=yy(v);body+=`<line x1="${padL}" y1="${y}" x2="${W-padR}" y2="${y}" stroke="#e3ece8" stroke-width="1"/><text x="${padL-7}" y="${y+4}" text-anchor="end" fill="#779186" font-size="${compact?8:10}">${v}</text>`;}
 let scorePts=data.map((r,i)=>`${xx(i)},${yy(v4Percent(r))}`).join(' ');body+=`<polyline fill="none" stroke="#21856d" stroke-width="${compact?2.3:3}" stroke-linejoin="round" points="${scorePts}"/>`;
 let avgPts=data.map((r,i)=>r.average!==null&&r.average!==''&&Number.isFinite(Number(r.average))?`${xx(i)},${yy(v4Percent(r,'average'))}`:null);
 for(let i=1;i<avgPts.length;i++){if(avgPts[i]&&avgPts[i-1])body+=`<line x1="${avgPts[i-1].replace(',', '" y1="')}" x2="${avgPts[i].replace(',','" y2="')}" stroke="#da9e42" stroke-width="2" stroke-dasharray="5 3"/>`;}
 data.forEach((r,i)=>{let x=xx(i),s=v4Percent(r);body+=`<circle cx="${x}" cy="${yy(s)}" r="${compact?3.4:4.5}" fill="#21856d" stroke="white" stroke-width="1.5"/><text x="${x}" y="${yy(s)-9}" text-anchor="middle" fill="#176c57" font-size="${compact?9:11}" font-weight="700">${Math.round(s)}%</text><text x="${x}" y="${H-padB+14}" text-anchor="middle" fill="#748779" font-size="${compact?8:9.5}">${esc(r.date.slice(5).replace('-','/'))}</text>`;if(r.average!==null&&r.average!==''&&Number.isFinite(Number(r.average)))body+=`<circle cx="${x}" cy="${yy(v4Percent(r,'average'))}" r="${compact?2.5:3.4}" fill="#da9e42"/>`;});
 body+=`<g transform="translate(${W-padR-145},${H-7})"><line x1="0" x2="19" y1="-3" y2="-3" stroke="#21856d" stroke-width="3"/><text x="23" y="0" font-size="${compact?8:10}" fill="#4a6255">本人</text><line x1="61" x2="79" y1="-3" y2="-3" stroke="#da9e42" stroke-width="2" stroke-dasharray="4 2"/><text x="82" y="0" font-size="${compact?8:10}" fill="#4a6255">平均</text></g>`;
 return `<svg class="v4-exam-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="入力されたテスト得点率の推移。満点が異なる場合は百分率に換算。">${body}</svg>`;}
function v4ScoreLabel(r){return `${r.score} / ${r.max}${r.average!==null&&r.average!==''?'　平均 '+r.average:''}${r.deviation!==null&&r.deviation!==''?'　偏差値 '+r.deviation:''}`;}
function v4ExamSubjectOptions(selected='',all=true){return (all?'<option value="">すべての教科</option>':'')+SUBJECTS.map(s=>option(s,s,selected)).join('');}
function renderExams(){let f=extra.examFilters,rows=v4ExamRows(f.student,f.subject,f.from,f.to,f.type).sort((a,b)=>b.date.localeCompare(a.date)||a.subject.localeCompare(b.subject,'ja')),uniq=[...new Set(rows.map(x=>x.examId))];let chartSubject=f.subject||'数学',chartSid=f.student||state.student;if(!isSameRoom(chartSid))chartSid=roomStudentFirst().id;let chartRows=v4ExamRows(chartSid,chartSubject);let latest=chartRows.at(-1);return head('定期テスト・模試','得点・平均点・偏差値を記録。生徒カルテや保護者報告書の成績推移にも使用します。',`<button class="btn primary" onclick="openExamForm()">＋ テスト・模試を登録</button>`)+`<div class="notice info mb">スキルの六角形は講師の確定評価から表示し、こちらはテストの実測データを表示します。初期の一部結果は操作確認用の架空データです。</div><div class="card mb"><div class="toolbar"><label class="field">生徒<select onchange="extra.examFilters.student=this.value;render()">${option('','教室の生徒すべて',f.student)+roomStudents().map(s=>option(s.id,`${s.grade} ／ ${s.name}`,f.student)).join('')}</select></label><label class="field">種類<select onchange="extra.examFilters.type=this.value;render()">${option('','すべてのテスト',f.type)+['定期テスト','模試','その他'].map(x=>option(x,x,f.type)).join('')}</select></label><label class="field">教科<select onchange="extra.examFilters.subject=this.value;render()">${v4ExamSubjectOptions(f.subject)}</select></label><label class="field">開始日<input type="date" value="${f.from}" onchange="extra.examFilters.from=this.value;render()"></label><label class="field">終了日<input type="date" value="${f.to}" onchange="extra.examFilters.to=this.value;render()"></label></div></div><div class="v4-exam-summary"><div class="v4-grade-item"><span>登録されたテスト</span><b>${uniq.length} 回</b></div><div class="v4-grade-item"><span>教科別結果</span><b>${rows.length} 件</b></div><div class="v4-grade-item"><span>最新の${esc(chartSubject)}の得点</span><b>${latest?latest.score+'/'+latest.max:'未登録'}</b></div></div><div class="v4-exam-list"><section class="card"><div class="section-title"><h2>成績の記録一覧</h2><span class="small muted">対象 ${rows.length}件</span></div><div class="tablewrap"><table><thead><tr><th>日付・テスト</th><th>生徒</th><th>教科</th><th>得点・平均</th><th>偏差値</th><th>操作</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${fmt(r.date)}<div class="subcell">${esc(r.type)} ／ ${esc(r.title)}${r.demo?'（架空）':''}</div></td><td>${esc(safeStudent(r.student)?.name||'—')}</td><td>${esc(r.subject)}</td><td>${r.score} / ${r.max}<div class="subcell">平均 ${r.average===null||r.average===''?'未記録':r.average}</div></td><td>${r.deviation??'—'}</td><td><button class="btn small" onclick="openExamForm('${r.examId}')">編集</button></td></tr>`).join('')||'<tr><td colspan="6"><div class="empty">結果がありません。条件を変更するか、新規登録してください。</div></td></tr>'}</tbody></table></div></section><aside class="card"><h2>得点率の推移</h2><p class="small muted">${esc(safeStudent(chartSid)?.name||'')} ／ ${esc(chartSubject)}。満点が異なるテストを比較するため得点率に換算します。</p>${v4LineChart(chartRows)}<p class="tiny muted mt">緑：本人の得点率　黄：平均点率。偏差値は別の数値として記録・表示します。模試と定期テストは試験の難易度が異なるため、推移の解釈に注意が必要です。</p><div class="divider"></div><button class="btn" onclick="extra.examFilters.student='${chartSid}';extra.examFilters.subject='${chartSubject}';render()">この生徒・教科だけを見る</button></aside></div>`;}
let v4ExamDraft=null;
function v4ExamRowHtml(r={},i=0){return `<div class="v4-exam-row" data-exam-row="${i}"><label class="field">教科<select data-e="subject">${SUBJECTS.map(s=>option(s,s,r.subject||'数学')).join('')}</select></label><label class="field">得点<input data-e="score" type="number" min="0" step="0.1" value="${r.score??''}" placeholder="得点"></label><label class="field">満点<input data-e="max" type="number" min="1" step="0.1" value="${r.max??100}" placeholder="100"></label><label class="field">平均点<input data-e="average" type="number" min="0" step="0.1" value="${r.average??''}" placeholder="任意"></label><button type="button" class="btn text small" aria-label="教科行を削除" onclick="v4RemoveExamRow(${i})">×</button><div class="row" style="grid-column:1/-1;gap:9px"><label class="field" style="flex:1">偏差値（任意）<input data-e="deviation" type="number" step="0.1" value="${r.deviation??''}"></label><label class="field" style="flex:1">順位（任意）<input data-e="rank" type="number" min="1" step="1" value="${r.rank??''}"></label><label class="field" style="flex:1">受験者数（任意）<input data-e="participants" type="number" min="1" step="1" value="${r.participants??''}"></label></div></div>`;}
function openExamForm(id='',sid=''){let exam=(db.examResults||[]).find(x=>x.id===id);let s=safeStudent(sid)||safeStudent(state.student);if(!s||!isSameRoom(s.id))s=roomStudentFirst();v4ExamDraft=exam?clone(exam):{student:s.id,date:TODAY,title:'',type:'定期テスト',grade:s.grade,notes:'',subjects:[{subject:s.subjects?.[0]||'数学',score:'',max:100,average:'',deviation:'',rank:'',participants:''}]};modal(exam?'成績を編集':'定期テスト・模試を登録',`<form id="v4-exam-form" onsubmit="v4SaveExam(event)"><div class="form-grid"><label class="field">生徒<select name="student" required>${roomStudents().map(x=>option(x.id,`${x.grade} ／ ${x.name}`,v4ExamDraft.student)).join('')}</select></label><label class="field">試験日<input name="date" type="date" value="${esc(v4ExamDraft.date)}" required></label><label class="field">種類<select name="type">${['定期テスト','模試','その他'].map(x=>option(x,x,v4ExamDraft.type)).join('')}</select></label><label class="field">テスト名 <span class="mark-required">必須</span><input name="title" required maxlength="90" value="${esc(v4ExamDraft.title)}" placeholder="例：2学期期末テスト"></label></div><div class="section-title mt"><h3>教科別の結果</h3><button type="button" class="btn small" onclick="v4AddExamRow()">＋ 教科を追加</button></div><div id="v4-exam-rows">${v4ExamDraft.subjects.map(v4ExamRowHtml).join('')}</div><label class="field mt">メモ（任意）<textarea name="notes" rows="2">${esc(v4ExamDraft.notes||'')}</textarea></label><div class="formfooter"><button type="button" class="btn" onclick="closeModal()">閉じる</button><button class="btn primary" type="submit">結果を保存</button></div></form>`);}
function v4ReadExamForm(){let form=document.getElementById('v4-exam-form');if(!form)return;let f=new FormData(form);v4ExamDraft={...v4ExamDraft,student:String(f.get('student')),date:String(f.get('date')),title:String(f.get('title')||''),type:String(f.get('type')),notes:String(f.get('notes')||''),subjects:[...form.querySelectorAll('[data-exam-row]')].map(row=>Object.fromEntries(['subject','score','max','average','deviation','rank','participants'].map(k=>[k,row.querySelector(`[data-e="${k}"]`)?.value??''])))};}
function v4AddExamRow(){v4ReadExamForm();v4ExamDraft.subjects.push({subject:'数学',score:'',max:100,average:'',deviation:'',rank:'',participants:''});document.getElementById('v4-exam-rows').innerHTML=v4ExamDraft.subjects.map(v4ExamRowHtml).join('');}
function v4RemoveExamRow(i){v4ReadExamForm();if(v4ExamDraft.subjects.length<=1){toast('教科を最低1つ登録してください。');return;}v4ExamDraft.subjects.splice(i,1);document.getElementById('v4-exam-rows').innerHTML=v4ExamDraft.subjects.map(v4ExamRowHtml).join('');}
function v4SaveExam(e){e.preventDefault();v4ReadExamForm();let d=v4ExamDraft;if(!d||!d.title.trim()||!isSameRoom(d.student)||!d.date||!d.subjects.length){toast('生徒・日付・テスト名・教科を入力してください。');return;}let names=new Set();let lines=[];for(let raw of d.subjects){let score=Number(raw.score),max=Number(raw.max),average=raw.average===''?null:Number(raw.average),deviation=raw.deviation===''?null:Number(raw.deviation),rank=raw.rank===''?null:Number(raw.rank),participants=raw.participants===''?null:Number(raw.participants);if(names.has(raw.subject)){toast('同じ教科は1回のテストにつき1行だけにしてください。');return;}names.add(raw.subject);if(raw.score===''||raw.max===''||!Number.isFinite(score)||!Number.isFinite(max)||max<=0||score<0||score>max||average!==null&&(!Number.isFinite(average)||average<0||average>max)||deviation!==null&&!Number.isFinite(deviation)||rank!==null&&(!Number.isInteger(rank)||rank<1)||participants!==null&&(!Number.isInteger(participants)||participants<1)||rank!==null&&participants!==null&&rank>participants){toast('得点・満点・平均点・順位の入力を確認してください。');return;}lines.push({subject:raw.subject,score,max,average,deviation,rank,participants});}let old=db.examResults.find(x=>x.id===d.id),item={...d,id:old?.id||uid('exam'),title:d.title.trim(),subjects:lines,grade:safeStudent(d.student)?.grade||'',demo:false,updatedAt:now(),createdAt:old?.createdAt||now()};v3Audit('成績入力',item.student,'',old?'テスト結果を更新':'テスト結果を登録',old||'新規',item);if(old)db.examResults[db.examResults.indexOf(old)]=item;else db.examResults.push(item);persist();closeModal();render();toast('テスト結果を保存しました。スキル評価は自動変更していません。');}
const V4_prevAudit=renderAudit;
renderAudit=function(){let html=V4_prevAudit();return html.replace('<option value="">すべて</option>',`<option value="">すべて</option>${option('成績入力','成績入力',state.audit.type)}${option('スキル評価軸','スキル評価軸',state.audit.type)}`);};
// Six user-selectable axes; each historical assessment retains the axis names it measured.
const v4AxisKey=(sid,sub)=>sid+'::'+sub;
function v4Axes(sid=state.student,sub=state.subject){let arr=db.skillAxisConfigs?.[v4AxisKey(sid,sub)];return Array.isArray(arr)&&arr.length===6?arr:[...AXES];}
function v4AssessmentValues(record,axes){let names=record.axisNames||AXES;return axes.map(n=>{let i=names.indexOf(n);return i<0?null:record.values?.[i]??null;});}
getAssess=function(sid,sub,from='',to='9999-99-99'){let axes=v4Axes(sid,sub),ls=db.assessments.filter(a=>a.student===sid&&a.subject===sub&&(!from||a.date>=from)&&a.date<=to).sort((a,b)=>b.date.localeCompare(a.date)||String(b.createdAt||'').localeCompare(String(a.createdAt||'')));let source=[],values=[],evidence=[],lessonIds=new Set();axes.forEach(axis=>{let pick=null;for(let rec of ls){let names=rec.axisNames||AXES,index=names.indexOf(axis);if(index>=0){pick={record:rec,index};break;}}source.push(pick?{date:pick.record.date,author:pick.record.author,assessmentId:pick.record.id}:null);values.push(pick?pick.record.values[pick.index]??null:null);evidence.push(pick?pick.record.evidence?.[pick.index]||'':'');pick?.record.lessonIds?.forEach(x=>lessonIds.add(x));});if(!ls.length)return undefined;return {id:ls[0].id,student:sid,subject:sub,date:ls[0].date,values,evidence,axisNames:axes,sources:source,lessonIds:[...lessonIds],author:ls[0].author,createdAt:ls[0].createdAt};};
// Replacement SVG is still a radar, with the six selected labels at its vertices.
radar=function(values,prev=null,print=false,labels=null){labels=labels||v4Axes();values=Array.from({length:6},(_,i)=>values?.[i]??null);prev=prev?Array.from({length:6},(_,i)=>prev[i]??null):null;let cx=225,cy=180,r=110;let pt=(i,val)=>{let a=(i*60-90)*Math.PI/180;return [cx+Math.cos(a)*r*val/4,cy+Math.sin(a)*r*val/4];};let poly=arr=>arr.map((v,i)=>pt(i,v).join(',')).join(' '),body='';for(let k=4;k>=1;k--)body+=`<polygon points="${poly(Array(6).fill(k))}" stroke="#dbe7df" stroke-width="1" fill="${k%2?'#fff':'#f8fbf8'}"/>`;for(let i=0;i<6;i++){let p=pt(i,4);body+=`<line x1="${cx}" y1="${cy}" x2="${p[0]}" y2="${p[1]}" stroke="#e0e9e1"/>`;}
 for(let series of [{v:prev,color:'#b1bfb3',dash:true},{v:values,color:'#198568',dash:false}]){if(!series.v)continue;let all=series.v.every(x=>x!==null);if(all)body+=`<polygon points="${poly(series.v)}" fill="${series.dash?'none':'#6cb299'}" fill-opacity=".23" stroke="${series.color}" stroke-width="${series.dash?1.5:2.6}" ${series.dash?'stroke-dasharray="5 4"':''}/>`;else for(let i=0;i<6;i++){let j=(i+1)%6;if(series.v[i]!=null&&series.v[j]!=null){let a=pt(i,series.v[i]),b=pt(j,series.v[j]);body+=`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${series.color}" stroke-width="2"/>`;}}series.v.forEach((v,i)=>{if(v!=null){let p=pt(i,v);body+=`<circle cx="${p[0]}" cy="${p[1]}" r="${series.dash?3:4.6}" fill="${series.dash?'#fff':series.color}" stroke="${series.color}" stroke-width="1"/>`;}});}
 const coords=[[225,27],[361,102],[363,273],[225,331],[85,273],[85,102]];
 labels.forEach((n,i)=>{let [x,y]=coords[i],text=String(n);let parts=text.length>8?[text.slice(0,Math.min(8,Math.ceil(text.length/2))),text.slice(Math.min(8,Math.ceil(text.length/2)))]:[text];let off=(parts.length-1)*8;body+=`<text text-anchor="middle" fill="#355345" font-size="${print?13:13.8}" font-weight="650" x="${x}" y="${y-off}">${parts.map((p,j)=>`<tspan x="${x}" dy="${j?16:0}">${esc(p)}</tspan>`).join('')}</text><text x="${x}" y="${y+18+off}" text-anchor="middle" font-size="11" fill="#268166">${values[i]==null?'未評価':values[i]+'/4'}</text>`;});
 return `<svg class="radar" viewBox="0 0 450 355" role="img" aria-label="${esc(labels.map((n,i)=>n+' '+(values[i]??'未評価')).join('、'))}">${body}</svg>`;};
function v4Evidence(i){let axes=v4Axes(),a=getAssess(state.student,state.subject),src=a?.sources?.[i];let texts=axes[i];modal(texts+'｜スキル評価の根拠',`<p class="small muted mb">選択した評価軸について、講師・教室長が確認した根拠を表示します。</p><div class="notice info">${esc(texts)}　${a?.values[i]??'未評価'} / 4<br>評価日：${src?fmt(src.date):'未評価'}　評価者：${esc(src?.author||'—')}</div><p class="preline mt">${esc(a?.evidence?.[i]||'評価の根拠がまだありません。')}</p>`);}
showEvidence=v4Evidence;
let v4AxisDraft=[];
function openAxisConfig(){v4AxisDraft=[...v4Axes()];v4RenderAxisConfig();}
function v4RenderAxisConfig(){let opts=db.skillAxisPool||V4_AXIS_POOL;modal('六角形に表示する6つの力を選択',`<p class="v4-pick-note mb">${esc(safeStudent(state.student)?.name||'')} ／ ${esc(state.subject)}の6軸です。評価の名称を変更しても、以前の数値を違う力へ付け替えることはありません。新しく選んだ力は、評価するまで「未評価」と表示します。</p>${v4AxisDraft.map((a,i)=>`<div class="v4-six-axis-row"><span>${i+1}</span><select aria-label="${i+1}番目の評価軸" onchange="v4AxisDraft[${i}]=this.value">${opts.map(x=>option(x,x,a)).join('')}</select></div>`).join('')}<div class="row mt"><input id="v4-axis-new" placeholder="候補にない力を追加（例：自分で質問する力）" style="flex:1" maxlength="24"><button class="btn" onclick="v4AddAxisName()">候補に追加</button></div><p class="small muted mt">選択候補は後から増やせます。同じ力を2つの頂点に設定することはできません。</p><div class="formfooter"><button class="btn" onclick="closeModal()">キャンセル</button><button class="btn primary" onclick="v4SaveAxisConfig()">この6軸に変更</button></div>`);}
function v4AddAxisName(){let text=document.getElementById('v4-axis-new')?.value.trim();if(!text||text.length>24){toast('24文字以内で評価軸名を入力してください。');return;}if((db.skillAxisPool||[]).includes(text)){toast('既に候補にあります。');return;}db.skillAxisPool.push(text);persist();v4RenderAxisConfig();toast('候補に追加しました。6軸に選択して保存できます。');}
function v4SaveAxisConfig(){if(v4AxisDraft.length!==6||new Set(v4AxisDraft).size!==6||v4AxisDraft.some(x=>!x)){toast('異なる6種類の評価軸を選択してください。');return;}let key=v4AxisKey(state.student,state.subject),old=v4Axes();if(old.join('|')!==v4AxisDraft.join('|')){v3Audit('スキル評価軸',state.student,state.subject,'六角形の6つの力を変更',old,v4AxisDraft);db.skillAxisConfigs[key]=[...v4AxisDraft];persist();}closeModal();render();toast('6つの力を変更しました。過去の評価は軸の名称と一緒に保持されます。');}
let v4SkillProposals=[];
openSkills=function(){let axes=v4Axes(),a=getAssess(state.student,state.subject),p=skillProposals();v4SkillProposals=axes.map(label=>{let idx=AXES.indexOf(label);return idx>=0?p[idx]:null;});modal('6つの力を評価｜'+esc(state.subject),`<div class="notice info mb"><b>評価は講師・教室長が手動で確定します。</b> 所見からの提案は簡単なルールによる候補で、AI接続ではありません。単元到達度やテスト点をそのまま六角形に換算しません。</div><form id="v4-skill-form" onsubmit="v4SaveSkills(event)"><div class="row between mb"><label class="field">評価日<input type="date" id="v4-skill-date" value="${TODAY}" required></label><button type="button" class="btn" onclick="openAxisConfig()">6軸の名称を変更</button></div><div class="v4-pick-note">段階の目安：1 支援が必要 ／ 2 ヒントがあればできる ／ 3 自力でできる ／ 4 別の場面でも活かせる ／ 未評価は採点しない</div>${axes.map((label,i)=>`<div class="v4-axis-evidence"><div><b>${esc(label)}</b><textarea id="v4-skill-evidence-${i}" placeholder="授業で確認した行動・評価の理由">${esc(a?.evidence?.[i]||'')}</textarea>${v4SkillProposals[i]?`<p class="small muted">記録に基づく候補：${v4SkillProposals[i].value}　<button type="button" class="btn text small" onclick="v4UseSkillProposal(${i})">反映</button></p>`:''}</div><label class="field">評価<select id="v4-skill-score-${i}">${option('','未評価',a?.values?.[i]??'')}${[1,2,3,4].map(n=>option(String(n),n+' / 4',a?.values?.[i]==null?'':String(a.values[i]))).join('')}</select></label></div>`).join('')}<div class="formfooter"><button type="button" class="btn" onclick="closeModal()">戻る</button><button class="btn primary">スキル評価を保存</button></div></form>`);};
function v4UseSkillProposal(i){let p=v4SkillProposals[i];if(!p)return;document.getElementById('v4-skill-score-'+i).value=String(p.value);document.getElementById('v4-skill-evidence-'+i).value=fmt(p.date)+'の授業：'+p.reason;}
function v4SaveSkills(e){e.preventDefault();let axes=v4Axes(),values=[],evidence=[];axes.forEach((_,i)=>{let value=document.getElementById('v4-skill-score-'+i).value;values.push(value===''?null:Number(value));evidence.push(document.getElementById('v4-skill-evidence-'+i).value.trim());});if(values.some((x,i)=>x!==null&&!evidence[i])){toast('評価した項目には、根拠となる行動を入力してください。');return;}let old=getAssess(state.student,state.subject),record={id:uid('sk'),student:state.student,subject:state.subject,date:document.getElementById('v4-skill-date').value,axisNames:[...axes],values,evidence,lessonIds:[],author:state.actor,createdAt:now()};db.assessments.push(record);v3Audit('スキル評価',state.student,state.subject,'選択した6つの力を確定',old?{axes:old.axisNames,values:old.values}:'未評価',{axes,values,evidence});persist();closeModal();render();toast('選択した6軸の評価を保存しました。履歴は削除しません。');}
const V4_priorProfile=renderProfile;
renderProfile=function(){let html=V4_priorProfile();html=html.replace('<button class="btn small" onclick="openSkills()">',`<button class="btn small" onclick="openAxisConfig()">6軸を選択</button><button class="btn small" onclick="openSkills()">`);let axes=v4Axes(),a=getAssess(state.student,state.subject);html=html.replace(/<div class="axis-buttons">[\s\S]*?<\/div>(?=<p class="tiny muted mt">)/,`<div class="axis-buttons">${axes.map((name,i)=>`<button class="axisbtn" onclick="showEvidence(${i})"><span>${esc(name)}</span><b>${a?.values[i]??'—'} <span class="tiny muted">›</span></b></button>`).join('')}</div>`);let exams=v4ExamRows(state.student,state.subject);let latest=exams.at(-1);const widget=`<section class="card mt"><div class="section-title"><h2>定期テスト・模試の記録</h2><button class="btn small" onclick="extra.examFilters.student='${state.student}';extra.examFilters.subject='${state.subject}';navigate('exams')">成績の一覧・登録</button></div><div class="row between"><div><b>${latest?latest.score+'/'+latest.max:'未登録'}</b><span class="small muted"> ${latest?`${fmt(latest.date)}・${esc(latest.title)}${latest.demo?'（架空データ）':''}`:'得点を登録すると推移が表示されます。'}</span></div></div>${v4LineChart(exams,{compact:true})}<p class="tiny muted">テスト結果は六角形の学習スキル評価には自動変換されません。</p></section>`;let idx=html.indexOf('<div class="metrics">');if(idx>=0)html=html.slice(0,idx)+widget+html.slice(idx);return html;};
// A4 reports: handwritten-first authoring is possible even before the first lesson is logged.
state.report.manualMode ??= false;
state.report.chartMode ||= 'both';
function v4ManualSubject(){let r=state.report;let s=safeStudent(r.students?.[0])||safeStudent(state.student);return r.subject||r.manualSubject||s?.subjects?.[0]||'数学';}
const v4ManualKey=(sid,sub)=>[currentRoom(),state.report.from||'all',state.report.to||'all',sid,sub].join('|');
function v4BlankTerm(){return {progress:'',strength:'',challenge:'',goal1:'',approach1:'',target1:'',goal2:'',approach2:'',target2:'',summary:'',showStrength:true,showChallenge:true};}
const V4_oldTermValue=termValue;
termValue=function(sid,sub,ls){if(state.report.manualMode){let key=v4ManualKey(sid,sub);db.manualReports[key] ||= v4BlankTerm();return db.manualReports[key];}return V4_oldTermValue(sid,sub,ls);};
function v4ReportGraphs(sid,sub){let mode=state.report.chartMode||'both';if(mode==='none')return '';let r=state.report,axes=v4Axes(sid,sub),a=getAssess(sid,sub,'',r.to||'9999-99-99'),prev=r.from?getAssess(sid,sub,'',beforeDay(r.from)):null;let exams=v4ExamRows(sid,sub,r.from,r.to);let includeRadar=mode==='both'||mode==='skill',includeExam=mode==='both'||mode==='exam';let part=[];if(includeRadar){part.push(`<div class="v4-report-mini"><div class="v4-report-mini-title">学習スキル（4段階）</div>${a?radar(a.values,prev?.values,true,axes):'<div class="small muted" style="padding:30px 5px">未評価</div>'}<div class="v4-report-source">${a?'評価記録：'+fmt(a.date)+'（講師・教室長が確定）':'スキル評価記録なし'}${prev?' ／ 比較：'+fmt(prev.date):''}</div></div>`);}if(includeExam){let latest=exams.at(-1);part.push(`<div class="v4-report-mini"><div class="v4-report-mini-title">テスト得点率の推移</div>${v4LineChart(exams,{compact:true})}<div class="v4-report-source">${latest?`${esc(latest.title)}：${latest.score}/${latest.max}点${latest.average!=null?'（平均 '+latest.average+'点）':''}／${fmt(latest.date)}`:'対象期間のテスト結果は未登録'}　※模試・定期テスト間の単純比較には注意</div></div>`);}return `<div class="v4-report-graphs">${part.join('')}</div>`;}
const V4_prevTermOnePage=termOnePage;
termOnePage=function(sid,sub,ls){let html=V4_prevTermOnePage(sid,sub,ls),graphs=v4ReportGraphs(sid,sub);if(graphs)html=html.replace('class="report-page term-sheet','class="report-page term-sheet v4-with-graphs');return html.replace('<div class="term-foot">',graphs+'<div class="term-foot">');};
const V4_prevBuildReport=buildReport;
buildReport=function(){if(state.report.type!=='term')return V4_prevBuildReport();let r=state.report;if(!goodRange(r.from,r.to))return {html:'',count:0,pages:0};let html='',count=0,pages=0;for(let sid of r.students){let s=safeStudent(sid);if(!s||!isSameRoom(sid))continue;let ls=reportLessons(sid);let subs=r.manualMode?[r.subject||r.manualSubject||s.subjects?.[0]||'数学']:[...new Set(ls.map(x=>x.subject))].filter(x=>!r.subject||x===r.subject);if(!r.manualMode&&!subs.length)continue;for(let sub of subs){let subls=ls.filter(l=>l.subject===sub);html+=termOnePage(sid,sub,subls);pages++;}count++;}return {html,count,pages};};
const V4_prevReportScreen=renderReports;
renderReports=function(){let html=V4_prevReportScreen(),r=state.report;if(r.type!=='term')return html;let block=`<div class="v4-report-choice"><b>報告書の作成方法</b><label><input type="radio" name="v4-term-mode" ${!r.manualMode?'checked':''} onchange="v4SetTermMode(false)">授業記録から文章案を作る</label><label><input type="radio" name="v4-term-mode" ${r.manualMode?'checked':''} onchange="v4SetTermMode(true)">白紙から直接手入力する（授業記録がなくても可）</label>${r.manualMode?`<label class="field mt">手入力する教科<select onchange="v4SetManualSubject(this.value)">${SUBJECTS.map(sub=>option(sub,sub,v4ManualSubject())).join('')}</select></label>`:''}<p class="tiny muted">どちらの方法でも本文は編集でき、グラフは登録データから表示します。印刷した内容は発行時点で保存します。</p></div><label class="field mt">報告書に入れるグラフ<select onchange="v4SetChartMode(this.value)">${[['both','学習スキル＋成績推移'],['skill','学習スキルのみ'],['exam','成績推移のみ'],['none','グラフなし']].map(([x,n])=>option(x,n,r.chartMode||'both')).join('')}</select></label>`;let pos=html.indexOf('<label class="checkline mt">');if(pos>=0)html=html.slice(0,pos)+block+html.slice(pos);return html;};
function v4SetTermMode(v){state.report.manualMode=!!v;state.report.confirmed=false;state.report.manualSubject=v4ManualSubject();state.report.openEditor=termEditKey(state.report.students?.[0]||state.student,v4ManualSubject());render();}
function v4SetManualSubject(sub){state.report.manualSubject=sub;state.report.subject=sub;state.report.openEditor=termEditKey(state.report.students?.[0]||state.student,sub);state.report.confirmed=false;render();}
function v4SetChartMode(mode){state.report.chartMode=mode;state.report.confirmed=false;render();}
const V4_prevChangeTermField=changeTermField;
changeTermField=function(sid,sub,k,v){if(!state.report.manualMode)return V4_prevChangeTermField(sid,sub,k,v);let key=v4ManualKey(sid,sub),old=termValue(sid,sub,[]);old[k]=v;db.manualReports[key]=old;persist();state.report.confirmed=false;let ck=document.getElementById('report-confirmed');if(ck)ck.checked=false;document.getElementById('report-preview').innerHTML=buildReport().html;updatePrintButton();reviewPrintFit();};
const V4_prevReportPreview=updateReportPreview;
updateReportPreview=function(){if(!state.report.manualMode||state.report.type!=='term'){V4_prevReportPreview();return;}let r=state.report,out=buildReport(),host=document.getElementById('report-preview');if(!host)return;host.innerHTML=out.html||'<div class="empty">対象生徒を選択してください。</div>';document.getElementById('report-summary').textContent=`白紙から手入力：${out.count}名 ／ 各教科A4 1枚（${out.pages}枚）`;document.getElementById('report-editors').innerHTML=r.students.map(sid=>{let s=safeStudent(sid);return s&&isSameRoom(sid)?renderTermEditor(sid,r.subject||r.manualSubject||s.subjects?.[0]||'数学',[]):'';}).join('');let ck=document.getElementById('report-confirmed');if(ck)ck.checked=r.confirmed;updatePrintButton();reviewPrintFit();};
const V4_oldRenderSettings=renderSettings;
renderSettings=function(){let html=V4_oldRenderSettings();return html+`<section class="card mt"><h2>v4：グラフと成績データの扱い</h2><p class="small mt">六角形はスキル評価を手動で確定した数値のみ使用します。今回から軸名と評価をセットで履歴保存するため、六角形の6項目を変更しても過去の評価が混同されません。</p><p class="small mt">成績の推移は「定期テスト・模試」画面で登録した得点・満点・平均点を表示し、比較用に百分率へ換算しています。偏差値は自動推測せず入力値をそのまま保持します。初期の一部結果は架空データです。</p><p class="small mt">このモックでは実際のBluetoothペアリング、外部接続、端末間同期、夜間バックアップ、アクセス権の制御は未実装です。</p></section>`;};
// Render exam page through the wrapper while keeping v3's navigation and room context.
const V4_prevWrappedRender=render;
render=function(){V4_prevWrappedRender();renderNav();if(state.page==='exams')document.getElementById('content').innerHTML=renderExams();applySidebar();};
// Keep room switches and printouts scoped; custom input mode follows the operator's setting.
const V4_prevSwitchRoom=switchRoom;
switchRoom=function(room){V4_prevSwitchRoom(room);if(state.page==='exams'){extra.examFilters.student='';render();}};
// Make the original barcodes sortable in batch while keeping one-person barcode prints unchanged.
const V4_prevPrintBarcodes=printBarcodes;
printBarcodes=function(ids){return V4_prevPrintBarcodes(ids);};
// A loaded v3 session may contain three seats; ensure it can grow without discarding them.
normalizeDesk();
document.querySelector('.sidebar-foot .tiny.muted').textContent='電子学プロ / Prototype 0.5';
persist();render();
// Make authoring visible immediately in manual mode, including newly selected students.
const V4_prevRenderTermEditor=renderTermEditor;
renderTermEditor=function(sid,sub,ls){let html=V4_prevRenderTermEditor(sid,sub,ls);if(state.report.manualMode)html=html.replace('<details class="report-edit"','<details class="report-edit" open');return html;};
const V4_prevNavFinal=renderNav;
renderNav=function(){V4_prevNavFinal();let desk=document.querySelector('#nav button[onclick="navigate(\'desk\')"] .navname');if(desk)desk.textContent='授業準備・複数生徒';};
// The prototype labels reflect the new behavior, while old stored data stays compatible.
document.title='学びのスキルカルテ v5｜全生徒の授業サンプル入り';
render();
// Strength statements should not mechanically turn a difficulty into a claimed strength.
const V4_prevTermSeed=termSeed;
termSeed=function(sid,sub,ls){let draft=V4_prevTermSeed(sid,sub,ls);let ordered=[...ls].sort((a,b)=>b.date.localeCompare(a.date));let positive=null;for(let l of ordered){let sentences=String(l.obs||'').split(/[。！？]/).map(x=>x.trim()).filter(Boolean);let s=sentences.find(t=>/(できた|理解が進んだ|整理できた|説明できた|自力|集中して|粘り強く|確認できた|進められた)/.test(t)&&!/(混同|できなかった|できない|不足|苦手|間違え|つまずき|できず|難し)/.test(t));if(s){positive=s+'。';break;}}if(!positive){let last=ordered.find(l=>l.tags?.length);if(last)positive='授業で確認した良さ：'+last.tags.slice(0,3).join('・')+'。';}draft.strength=positive||'授業で実際に確認できた「できたこと」や強みを入力してください。';return draft;};
render();
// v5: show the seeded fictional lesson count on the home screen, without exposing personal records.
const V5_prevHome=renderHome;
renderHome=function(){const stats=db.demoStatsV5||{};return `<div class="notice info mb" style="padding:11px 16px"><b>授業サンプルデータ入り</b>：架空の生徒 ${db.students.length}名／登録教科 ${stats.pairs||0}組／授業履歴 ${db.lessons.length}件（各教科10回分）。<br><span class="tiny">生徒検索 → カルテ → 授業履歴から、半年前から現在までの記録を確認できます。実在の生徒情報は入れないでください。</span></div>`+V5_prevHome();};
// Optional source-data export so graph values can be reviewed outside the chart.
function v4ExportExamCSV(){let f=extra.examFilters,rows=v4ExamRows(f.student,f.subject,f.from,f.to,f.type);if(!rows.length){toast('書き出せる成績データがありません。');return;}let columns=['日付','種類','テスト名','生徒','教科','得点','満点','得点率(%)','平均点','偏差値','順位','受験者数','デモデータ'];let data=rows.map(r=>[r.date,r.type,r.title,safeStudent(r.student)?.name||'',r.subject,r.score,r.max,+(100*r.score/r.max).toFixed(1),r.average??'',r.deviation??'',r.rank??'',r.participants??'',r.demo?'はい':'いいえ']);let safe=x=>{let t=String(x??'');if(/^[=+\-@\t\r]/.test(t))t="'"+t;return '"'+t.replaceAll('"','""')+'"';};let csv='\ufeff'+[columns,...data].map(row=>row.map(safe).join(',')).join('\r\n');let link=document.createElement('a'),url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));link.href=url;link.download='manabi_exam_results_'+localDate()+'.csv';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast(rows.length+'件の成績元データをCSVに書き出しました。');}
const V4_prevExamScreen=renderExams;
renderExams=function(){let html=V4_prevExamScreen();return html.replace('onclick="openExamForm()">＋ テスト・模試を登録</button>',`onclick="openExamForm()">＋ テスト・模試を登録</button><button class="btn" onclick="v4ExportExamCSV()">グラフ元データ CSV</button>`);};
render();


// ===== v6 / 模試・検定申込 / 生徒カルテ / 全教科 =====
const V6_APP_VERSION='0.6';
const V6_ELEM=['国語','算数','英語','理科','社会'];
const V6_JUNIOR=['国語','数学','英語','理科','社会'];
const V6_HS_GROUPS=[
 {name:'国語',list:['国語','現代文','古文','漢文']},
 {name:'数学',list:['数学Ⅰ・数学Ａ','数学Ⅰ','数学Ⅱ・数学Ｂ・数学Ｃ','数学ⅠA','数学ⅡBC','数学Ⅲ','数学Ｃ']},
 {name:'地理・歴史・公民',list:['地理総合・地理探究','歴史総合・日本史探究','歴史総合・世界史探究','公共・倫理','公共・政治・経済','地理総合／歴史総合／公共']},
 {name:'理科',list:['物理基礎／化学基礎／生物基礎／地学基礎','物理','化学','生物','地学','物理基礎','化学基礎','生物基礎','地学基礎']},
 {name:'外国語',list:['英語','英語リーディング','英語リスニング','ドイツ語','フランス語','中国語','韓国語']},
 {name:'情報',list:['情報Ⅰ']},
];
const V6_CATEGORIES=['漢検','英検','数検','日本語検定','全県模試','育伸社学力テスト','大学入学共通テスト模試','その他'];
const V6_APPLY=['仮受付','受付済み','主催者へ申込済み','取消'];
const V6_ATTEND=['未実施','受験','欠席','辞退'];
const V6_RESULTS=['未発表','合格','不合格','判定・得点あり','未受験'];
const V6_BILL=['未請求','請求済み','入金確認済み','対象外'];
const V6_LEVELS={
 '英検':['5級','4級','3級','準2級','準2級プラス','2級','準1級','1級'],
 '漢検':['10級','9級','8級','7級','6級','5級','4級','3級','準2級','2級','準1級','1級'],
 '数検':['11級','10級','9級','8級','7級','6級','5級','4級','3級','準2級','2級','準1級','1級'],
 '日本語検定':['7級','6級','5級','4級','3級','準2級','2級','1級']
};
function v6LevelType(grade){return /^小学|^小[1-6]/.test(grade||'')?'elem':/^中学|^中[1-3]/.test(grade||'')?'junior':'high';}
function v6StudentSubjects(s){const cat=v6LevelType(s?.grade),base=cat==='elem'?V6_ELEM:cat==='junior'?V6_JUNIOR:V6_HS_GROUPS.flatMap(x=>x.list);return [...new Set([...base,...(s?.subjects||[]),...(db.lessons||[]).filter(l=>l.student===s?.id).map(l=>l.subject)])].filter(Boolean);}
function v6SubjectSelect(selected='',opts={}){const all=opts.all!==false,s=opts.student||(safeStudent(state.student)),isReport=opts.universal||state.page==='reports'||state.page==='roster';let groups;
 if(isReport){groups=[{name:'小学生（5教科）',list:V6_ELEM},{name:'中学生（5教科）',list:V6_JUNIOR},...V6_HS_GROUPS];}
 else {groups=v6LevelType(s?.grade)==='high'?V6_HS_GROUPS:[{name:v6LevelType(s?.grade)==='elem'?'小学生・5教科':'中学生・5教科',list:v6LevelType(s?.grade)==='elem'?V6_ELEM:V6_JUNIOR}];}
 let seen=new Set();let html=all?option('','すべての教科',selected):'';
 for(let g of groups){let vals=g.list.filter(x=>{if(seen.has(x))return false;seen.add(x);return true;});html+=`<optgroup label="${esc(g.name)}">${vals.map(x=>option(x,x,selected)).join('')}</optgroup>`;}
 if(selected&&!seen.has(selected))html+=option(selected,selected,selected);
 return html;
}
// 認可可能な教科一覧は、生徒マスターの受講教科とは無関係。
subjOptions=function(selected='',all=true,ignoredSubjects=null){return v6SubjectSelect(selected,{all,student:safeStudent(state.student),universal:state.page==='reports'});};
// v5のデモデータは読み込み専用の架空データ。実際の外部情報はコピーしない。
db.qualEvents||=[];db.qualEntries||=[];db.qualCredentials||=[];
function v6CreateDemoData(){
 if(db.v6ExamSeeded)return;
 const events=[
  {id:'qev_demo_hk',type:'検定',category:'漢検',name:'漢字検定 冬季回（デモ）',date:'2026-12-12',deadline:'2026-12-01',venue:'教室内（デモ）',room:'両教室',fee:2500,notes:'実際の検定日程・料金ではありません',demo:true},
  {id:'qev_demo_ek',type:'検定',category:'英検',name:'英語検定 冬季回（デモ）',date:'2027-01-23',deadline:'2026-12-16',venue:'教室内（デモ）',room:'両教室',fee:3200,notes:'実際の検定日程・料金ではありません',demo:true},
  {id:'qev_demo_zen',type:'模試',category:'全県模試',name:'全県模試 秋期回（デモ）',date:'2026-11-08',deadline:'2026-10-20',venue:'各教室（デモ）',room:'両教室',fee:3500,notes:'実際の模試日程・料金ではありません',demo:true},
  {id:'qev_demo_ik',type:'模試',category:'育伸社学力テスト',name:'育伸社 学力テスト 冬期回（デモ）',date:'2026-12-19',deadline:'2026-12-07',venue:'各教室（デモ）',room:'両教室',fee:2800,notes:'実際の模試日程・料金ではありません',demo:true}
 ];
 db.qualEvents.push(...events);
 const ss=db.students.filter(s=>s.enrollment!=='退塾').slice(0,23);
 ss.forEach((s,i)=>{const ev=events[i%events.length],hasPast=ev.date<TODAY,cat=ev.category,isPass=hasPast&&i%5===0;
  db.qualEntries.push({id:'qen_demo_'+i,eventId:ev.id,studentId:s.id,level:ev.type==='検定'?(V6_LEVELS[cat]?.[i%Math.min(6,V6_LEVELS[cat].length)]||'3級'):'',applyAt:'2026-10-'+String((i%19)+1).padStart(2,'0'),application:'受付済み',attendance:hasPast?(i%9===0?'欠席':'受験'):'未実施',result:hasPast&&i%9!==0?(isPass?'合格':'判定・得点あり'):'未発表',score:hasPast&&i%9!==0?String(55+i%32):'',billing:i%3===0?'請求済み':'未請求',returnedAt:'',memo:'デモデータ',source:'デモ',demo:true,updatedAt:'2026-11-12T10:00:00Z'});
 });
 const n=db.students[0];if(n)db.qualCredentials.push({id:'qcert_demo_1',studentId:n.id,category:'漢検',level:'4級',acquiredAt:'2026-03-14',notes:'過去の取得実績（架空のサンプル）',source:'手動',demo:true,createdAt:'2026-03-14T10:00:00Z'});
 db.v6ExamSeeded=true;
}
v6CreateDemoData();
const v6ui={tab:'overview',event:'',type:'',status:'',grade:'',q:'',includeInactive:false,bulkEvent:'',bulkGrade:'',bulkQ:'',bulkSelected:new Set(),bulkLevel:'',formEvent:'',rosterSort:'grade',rosterDir:'asc'};
function v6RoomEvents(){return db.qualEvents.filter(e=>e.room==='両教室'||e.room===currentRoom());}
function v6Event(id){return db.qualEvents.find(e=>e.id===id);}
function v6VisibleEntries(){return db.qualEntries.filter(r=>{let s=safeStudent(r.studentId),e=v6Event(r.eventId);return s&&isSameRoom(s.id)&&e&&(e.room==='両教室'||e.room===currentRoom());});}
function v6EntriesFor(sid){return db.qualEntries.filter(r=>r.studentId===sid).map(r=>({...r,event:v6Event(r.eventId)})).filter(x=>x.event).sort((a,b)=>b.event.date.localeCompare(a.event.date));}
function v6CredentialsFor(sid){let direct=db.qualCredentials.filter(x=>x.studentId===sid).map(x=>({...x,auto:false}));let acquired=db.qualEntries.filter(r=>r.studentId===sid&&r.result==='合格'&&r.attendance==='受験').map(r=>{let e=v6Event(r.eventId);return e?.type==='検定'?{id:'passed_'+r.id,studentId:sid,category:e.category,level:r.level,acquiredAt:r.resultAt||e.date,notes:'受験結果から取得',source:'受験結果',auto:true}:null}).filter(Boolean);return [...direct,...acquired].sort((a,b)=>(b.acquiredAt||'').localeCompare(a.acquiredAt||''));}
function v6PassSummary(sid){let arr=v6CredentialsFor(sid);if(!arr.length)return '取得級の登録なし';return [...new Set(arr.map(x=>`${x.category} ${x.level}`))].join(' ／ ');}
function v6ExamDigest(sid){let apps=v6EntriesFor(sid),future=apps.filter(x=>x.event.date>=TODAY&&x.application!=='取消'),taken=apps.filter(x=>x.attendance==='受験'),latest=taken[0];let messages=[];if(future.length)messages.push(`次回：${future[0].event.category} ${future[0].level||''}（${fmt(future[0].event.date)}）`);if(latest)messages.push(`直近受験：${latest.event.category} ${fmt(latest.event.date)}／${latest.result}`);messages.push(`取得級：${v6PassSummary(sid)}`);return messages.join('　｜　');}
function v6AuditChange(type,sid,label,before,after){audit(type,sid,'',label,before,after);persist();}
function v6RowEventStatus(entry){let e=v6Event(entry.eventId);if(!e)return '';if(entry.application==='取消')return '取消';if(entry.attendance==='欠席')return '欠席';if(entry.attendance==='受験')return entry.result==='未発表'?'受験済・結果待ち':entry.result==='合格'?'合格':entry.result==='不合格'?'不合格':'受験済';return e.date<TODAY?'実施日経過・未確認':'受験予定';}
function v6SmallBadge(s){let k=/合格|取得|確認済/.test(s)?'green':/未確認|結果待ち|仮受付|期限/.test(s)?'amber':/取消|欠席|不合格/.test(s)?'red':'blue';return `<span class="badge ${k}">${esc(s)}</span>`;}
function v6ExamSubjectList(){return [...new Set([ ...V6_ELEM,...V6_JUNIOR,...V6_HS_GROUPS.flatMap(x=>x.list)])];}
// ---------- ホームとナビ ----------
const V6_prevNav=renderNav;
renderNav=function(){V6_prevNav();const nav=document.getElementById('nav');if(!nav||nav.querySelector('[data-v6="qual"]'))return;let btn=`<button data-v6="qual" title="模試・検定の申込・受験・合否・取得級" class="navbtn ${state.page==='qualifications'?'active':''}" onclick="navigate('qualifications')">${icon('daily')}<span class="navname">模試・検定管理</span></button>`;let ins=nav.querySelector('button[onclick="navigate(\'exams\')"]')||nav.querySelector('button[onclick="navigate(\'profile\')"]');if(ins)ins.insertAdjacentHTML('beforebegin',btn);else nav.insertAdjacentHTML('beforeend',btn);};
const V6_prevRender=render;
render=function(){V6_prevRender();if(state.page==='qualifications')document.getElementById('content').innerHTML=v6ManageScreen();renderNav();};
const V6_prevHome=renderHome;
renderHome=function(){let base=V6_prevHome();const n=v6VisibleEntries().filter(r=>v6Event(r.eventId)?.date>=TODAY&&r.application!=='取消').length;let box=`<div class="v6-home-alert card"><div><div class="eyebrow">EXAM & CERTIFICATION</div><h2>模試・検定の受付・受験状況</h2><p class="small muted">受験予定 ${n}件 ／ 申込から取得級まで一元管理</p></div><button class="btn primary" onclick="navigate('qualifications')">申込・受験管理を開く →</button></div>`;return box+base;};
const V6_prevProfile=renderProfile;
renderProfile=function(){let base=V6_prevProfile(),s=safeStudent(state.student),entries=v6EntriesFor(s.id),credentials=v6CredentialsFor(s.id),recent=entries.slice(0,4);let card=`<section class="card v6-profile-events mb"><div class="section-title"><div><div class="eyebrow">EXAMS & QUALIFICATIONS</div><h2>模試・検定・取得級</h2></div><button class="btn small" onclick="v6ui.tab='applications';navigate('qualifications')">一覧・申込管理 →</button></div><div class="v6-mini-stats"><div><span>受験予定</span><b>${entries.filter(x=>x.event.date>=TODAY&&x.application!=='取消').length}件</b></div><div><span>受験済み</span><b>${entries.filter(x=>x.attendance==='受験').length}件</b></div><div><span>取得級</span><b>${credentials.length}件</b></div></div><div class="small"><strong>取得済み：</strong>${esc(v6PassSummary(s.id))}</div><div class="v6-profile-exam-list">${recent.map(x=>`<div><span>${fmt(x.event.date)}　${esc(x.event.category)} ${esc(x.level||'')}</span>${v6SmallBadge(v6RowEventStatus(x))}</div>`).join('')||'<p class="small muted">受験記録はありません。</p>'}</div><p class="tiny muted">受験予定と取得級を分けて管理します。合格・取得は結果を確定したものだけ表示します。</p></section>`;let pos=base.indexOf('<div class="profilegrid">');return pos<0?card+base:base.slice(0,pos)+card+base.slice(pos);};
const V6_prevRoster=renderRoster;
renderRoster=function(){let html=V6_prevRoster();let actions=`<div class="row v6-roster-buttons mb"><button class="btn" onclick="v6RosterCSV()">名簿をCSV出力</button><button class="btn" onclick="v6RosterPrint()">名簿をA4印刷</button><button class="btn" onclick="v6ui.tab='applications';navigate('qualifications')">模試・検定受付一覧 →</button></div>`;return html.replace('<div class="registry-toolbar">',actions+'<div class="registry-toolbar">').replace('学年・教室・氏名で検索。','学年・教室・氏名で検索。受講教科の登録は不要です。');};
// 生徒登録を教科必須とせず、通塾先・学年・名前のみから設定できるようにする。
openStudentForm=function(id=''){let s=id?safeStudent(id):null;modal(id?'生徒マスターを編集':'生徒を新規登録',`<form onsubmit="v6SaveStudent(event,'${id}')"><p class="notice info mb">教科は登録不要です。小学・中学は5教科、高校は共通テストの全科目を学プロ・報告書から選べます。</p><div class="form-grid"><label class="field">生徒名（必須）<input name="name" required maxlength="60" value="${esc(s?.name||'')}" placeholder="例：サンプル 太郎"></label><label class="field">ふりがな（必須）<input name="kana" required maxlength="80" value="${esc(s?.kana||'')}"></label><label class="field">学年<select name="grade">${GRADES.map(g=>option(g,g,s?.grade||'中学1年')).join('')}</select></label><label class="field">教室<input value="${esc(currentRoom())}" disabled><input type="hidden" name="classroom" value="${esc(s?.school||currentRoom())}"></label><label class="field">学校名<input name="schoolName" maxlength="80" value="${esc(s?.schoolName||'')}"></label><label class="field">生徒番号（空欄なら自動採番）<input name="code" maxlength="30" value="${esc(s?.code||'')}"></label><label class="field">在籍状態<select name="enrollment">${['在籍','休塾','退塾'].map(x=>option(x,x,s?.enrollment||'在籍')).join('')}</select></label><label class="field">属性・目的（読点区切り）<input name="attributes" maxlength="160" value="${esc((s?.attributes||[]).join('、'))}"></label></div><div class="formfooter"><button type="button" class="btn" onclick="closeModal()">戻る</button><button class="btn primary">保存</button></div></form>`);};
function v6SaveStudent(ev,id){ev.preventDefault();let f=new FormData(ev.target),old=db.students.find(s=>s.id===id),name=String(f.get('name')||'').trim(),kana=String(f.get('kana')||'').trim();if(!name||!kana){toast('氏名とふりがなを入力してください。');return}let code=String(f.get('code')||'').trim();if(!code){let n=db.students.length+1;while(db.students.some(s=>s.code==='D-'+String(n).padStart(3,'0')))n++;code='D-'+String(n).padStart(3,'0')}if(db.students.some(s=>s.id!==id&&s.code===code)){toast('同じ生徒番号が登録されています。');return}let s={...(old||{}),id:id||uid('student'),name,kana,grade:String(f.get('grade')),school:String(f.get('classroom'))||currentRoom(),schoolName:String(f.get('schoolName')||''),code,enrollment:String(f.get('enrollment')),attributes:splitTags(f.get('attributes')),subjects:old?.subjects||[],createdAt:old?.createdAt||now(),updatedAt:now()};v6AuditChange('生徒登録',s.id,old?'生徒情報を更新':'生徒登録',old?clone(old):'新規',s);if(old)db.students[db.students.indexOf(old)]=s;else db.students.push(s);persist();closeModal();render();toast('生徒情報を保存しました。教科の設定は不要です。');}
// カルテ内・授業画面の教科選択を、マスターの受講教科欄から切り離す。
studentbar=function(){const s=student();return `<div class="card studentbar"><div class="studentid"><div class="avatar">${esc(s.name.charAt(0))}</div><div><div class="studenttitle">${esc(s.name)} <span class="badge">架空データ</span></div><div class="studentmeta">${studentIdentity(s)}</div></div></div><div class="row"><button class="btn" onclick="openStudentPicker('profile')">${icon('search')}生徒を検索・変更</button><select style="max-width:min(380px,100%)" aria-label="教科を選ぶ" onchange="setSubject(this.value)">${v6SubjectSelect(state.subject,{all:false,student:s})}</select></div></div>`;};
const V6_prevSetStudent=setStudent;
setStudent=function(id){state.student=id;state.subject=v6StudentSubjects(student(id))[0]||'数学';state.compare.leftSubject=state.subject;state.compare.rightSubject=state.subject;render();};
const V6_prevViewStudent=viewStudent;
viewStudent=function(id){state.student=id;state.subject=v6StudentSubjects(student(id))[0]||'数学';rememberStudent(id);navigate('profile');};
const V6_prevDeskSeat=renderDeskSeat;
renderDeskSeat=function(i){let html=V6_prevDeskSeat(i),seat=extra.desk.seats[i],s=seat?safeStudent(seat.student):null;if(!s||html.includes('is-collapsed'))return html;return html.replace(/(<select class="subject-choice"[^>]*>)[\s\S]*?(<\/select>)/,(_,a,b)=>a+v6SubjectSelect(seat.subject,{all:false,student:s})+b);};
const V6_prevOpenLesson=openLesson;
openLesson=function(id=''){V6_prevOpenLesson(id);let l=id?db.lessons.find(x=>x.id===id):null,s=safeStudent(l?.student||state.student);let select=document.getElementById('entry-subject');if(select&&s){select.innerHTML=v6SubjectSelect(l?.subject||state.subject,{all:false,student:s});select.value=l?.subject||state.subject;}};
updateEntrySubjects=function(id){let sel=document.getElementById('entry-subject');if(sel)sel.innerHTML=v6SubjectSelect('',{all:false,student:safeStudent(id)});};
const V6_prevExamRow=v4ExamRowHtml;
v4ExamRowHtml=function(r={},i=0){let html=V6_prevExamRow(r,i),s=safeStudent(v4ExamDraft?.student)||safeStudent(state.student);return html.replace(/(<select data-e="subject">)[\s\S]*?(<\/select>)/,(_,a,b)=>a+v6SubjectSelect(r.subject||'数学',{all:false,student:s})+b);};
v4ExamSubjectOptions=function(selected='',all=true){return v6SubjectSelect(selected,{all,universal:true});};
// 生徒マスターの受講教科に登録がなくても、任意の教科で報告書を新規作成できる。
const V6_prevReports=renderReports;
renderReports=function(){let html=V6_prevReports();return html.replace(/(<select[^>]*onchange="v4SetManualSubject\(this.value\)"[^>]*>)[\s\S]*?(<\/select>)/,(_,a,b)=>a+v6SubjectSelect(v4ManualSubject(),{all:false,universal:true})+b);};
const V6_prevManualSubject=v4ManualSubject;
v4ManualSubject=function(){return state.report.subject||state.report.manualSubject||v6StudentSubjects(safeStudent(state.report.students?.[0]))[0]||'数学';};
// 指導方針・スキル評価は新しい教科のデータが未登録なら空で開始。
// ---------- 申込/受験/資格管理 ----------
function v6EventOptions(selected='',onlyRoom=true){let list=onlyRoom?v6RoomEvents():db.qualEvents;return list.sort((a,b)=>b.date.localeCompare(a.date)).map(e=>option(e.id,`${e.date}｜${e.category}｜${e.name}`,selected)).join('');}
function v6FilteredEntries(){let f=v6ui;return v6VisibleEntries().filter(r=>{let e=v6Event(r.eventId),s=safeStudent(r.studentId);return (!f.event||r.eventId===f.event)&&(!f.type||e.type===f.type)&&(!f.status||v6RowEventStatus(r).includes(f.status))&&(!f.grade||s.grade===f.grade)&&(!f.q||norm(s.name+' '+s.kana+' '+s.code+' '+e.name+' '+e.category+' '+r.level).includes(norm(f.q)));}).sort((a,b)=>{let ed=b=>v6Event(b.eventId)?.date||'';return ed(b).localeCompare(ed(a))||a.studentId.localeCompare(b.studentId);});}
function v6ManageScreen(){const entries=v6VisibleEntries(),events=v6RoomEvents(),next=entries.filter(r=>v6Event(r.eventId)?.date>=TODAY&&r.application!=='取消'),taken=entries.filter(r=>r.attendance==='受験'),pending=entries.filter(r=>r.attendance==='受験'&&r.result==='未発表'),counts=`<div class="v6-tiles"><div><span>申込・予定</span><strong>${next.length}</strong><small>件</small></div><div><span>受験済み</span><strong>${taken.length}</strong><small>件</small></div><div><span>結果待ち</span><strong>${pending.length}</strong><small>件</small></div><div><span>実施回</span><strong>${events.length}</strong><small>回</small></div></div>`;const tabs=[['overview','実施回・受付状況'],['applications','申込・受験一覧'],['bulk','一括申込'],['intake','申込フォーム'],['credentials','取得級一覧']];return head('模試・検定の一元管理','申込→受験→結果→取得級・返却まで。生徒の受験履歴と連動します。',`<button class="btn" onclick="v6RosterCSV()">生徒名簿 CSV</button><button class="btn primary" onclick="v6OpenEvent()">＋ 実施回を登録</button>`)+`<div class="notice info mb">Google Driveの「生徒学習カルテ」「検定受験のお申し込みフォーム（回答）」「生徒別受験管理表（案）」を項目設計の参考にしています。<b>実際の生徒データを取り込んだわけではありません。</b></div>${counts}<div class="v6-tabs">${tabs.map(([key,n])=>`<button class="${v6ui.tab===key?'active':''}" onclick="v6SwitchTab('${key}')">${n}</button>`).join('')}</div>${({overview:v6EventsSection,applications:v6ApplicationsSection,bulk:v6BulkSection,intake:v6IntakeSection,credentials:v6CredentialsSection})[v6ui.tab]()}<div class="notice mt">※架空の申込・結果データによる操作モックです。Googleフォームとの自動連携、外部受験機関への申込送信、決済・請求処理、ログイン・バックアップは未実装です。</div>`;}
function v6SwitchTab(t){v6ui.tab=t;render();}
function v6EventsSection(){let list=[...v6RoomEvents()].sort((a,b)=>b.date.localeCompare(a.date));return `<section class="card"><div class="section-title"><h2>実施回の一覧</h2><button class="btn small" onclick="v6OpenEvent()">＋ 模試・検定を追加</button></div><div class="tablewrap"><table><thead><tr><th>実施日・区分</th><th>名称・会場</th><th>申込期限</th><th>申込人数</th><th>受験・結果</th><th>操作</th></tr></thead><tbody>${list.map(e=>{let rows=v6VisibleEntries().filter(r=>r.eventId===e.id&&r.application!=='取消'),taken=rows.filter(r=>r.attendance==='受験'),confirmed=rows.filter(r=>r.result!=='未発表');return `<tr><td class="nowrap"><b>${fmt(e.date)}</b><div class="subcell">${esc(e.type)} ／ ${esc(e.category)}</div></td><td><b>${esc(e.name)}</b><div class="subcell">${esc(e.venue||'会場未定')} ／ ${esc(e.room)}</div></td><td>${fmt(e.deadline)}</td><td><b>${rows.length}名</b></td><td>${taken.length}名受験<div class="subcell">結果入力 ${confirmed.length}件</div></td><td><div class="row" style="gap:5px"><button class="btn small" onclick="v6SelectEvent('${e.id}')">管理</button><button class="btn small" onclick="v6OpenEvent('${e.id}')">編集</button></div></td></tr>`}).join('')||'<tr><td colspan="6">実施回はありません。</td></tr>'}</tbody></table></div></section><div class="v6-hint-grid mt"><div class="card"><b>検定の取得級</b><p class="small muted">合格を記録すると生徒カルテの取得級一覧へ反映。過去に取得した級も別途登録できます。</p></div><div class="card"><b>申込・受験の区別</b><p class="small muted">申込済みでも受験実績にはしません。当日の出欠・結果発表・成績表返却を別々に記録します。</p></div></div>`;}
function v6SelectEvent(id){v6ui.event=id;v6ui.tab='applications';render();}
function v6OpenEvent(id=''){let e=id?v6Event(id):null;modal(id?'実施回を編集':'模試・検定の実施回を登録',`<form onsubmit="v6SaveEvent(event,'${id}')"><div class="form-grid"><label class="field">区分<select name="type" onchange="v6RefreshCategories(this.value)">${['検定','模試'].map(x=>option(x,x,e?.type||'検定')).join('')}</select></label><label class="field">検定・模試の種類<select name="category" id="v6-event-category">${V6_CATEGORIES.map(x=>option(x,x,e?.category||'漢検')).join('')}</select></label><label class="field full">実施回の名称（必須）<input name="name" required maxlength="90" value="${esc(e?.name||'')}" placeholder="例：第2回 漢字検定"></label><label class="field">試験日<input type="date" required name="date" value="${e?.date||'2026-12-12'}"></label><label class="field">申込締切<input type="date" name="deadline" value="${e?.deadline||'2026-12-01'}"></label><label class="field">実施教室<select name="room">${['両教室',...CLASSROOMS].map(x=>option(x,x,e?.room||currentRoom())).join('')}</select></label><label class="field">会場<input name="venue" maxlength="90" value="${esc(e?.venue||'')}"></label><label class="field">受験料（任意）<input name="fee" type="number" min="0" value="${e?.fee??''}"></label><label class="field full">備考<textarea name="notes" rows="2">${esc(e?.notes||'')}</textarea></label></div><div class="formfooter"><button type="button" class="btn" onclick="closeModal()">キャンセル</button><button class="btn primary">保存</button></div></form>`);}
function v6RefreshCategories(type){let sel=document.getElementById('v6-event-category');sel.innerHTML=(type==='模試'?V6_CATEGORIES.filter(x=>/模試|テスト|その他/.test(x)):V6_CATEGORIES.filter(x=>!/模試|テスト/.test(x))).map(x=>option(x,x)).join('');}
function v6SaveEvent(ev,id){ev.preventDefault();let f=new FormData(ev.target),old=v6Event(id);let data={...(old||{}),id:id||uid('qev'),name:String(f.get('name')||'').trim(),type:String(f.get('type')),category:String(f.get('category')),date:String(f.get('date')),deadline:String(f.get('deadline')),venue:String(f.get('venue')||'').trim(),room:String(f.get('room')),fee:f.get('fee')===''?null:Number(f.get('fee')),notes:String(f.get('notes')||'').trim(),updatedAt:now()};if(!data.name||!data.date||(!data.type)){toast('実施回の名称・日付を入力してください');return}if(old)db.qualEvents[db.qualEvents.indexOf(old)]=data;else db.qualEvents.push(data);v6AuditChange('模試検定・実施回','',old?'実施回を更新':'実施回を登録',old?clone(old):'新規',data);persist();closeModal();v6ui.tab='overview';render();toast('実施回を保存しました');}
function v6ApplicationsSection(){let f=v6ui,rows=v6FilteredEntries();return `<section class="card"><div class="section-title"><h2>受験申込・結果管理</h2><div class="row"><button class="btn small" onclick="v6EntryForm()">＋ 個別申込</button><button class="btn small" onclick="v6ui.tab='bulk';render()">＋ 一括申込</button><button class="btn small" onclick="v6ExportEntries()">一覧CSV</button><button class="btn small" onclick="v6PrintEntries()">受付名簿印刷</button></div></div><div class="toolbar"><label class="field">実施回<select onchange="v6ui.event=this.value;render()">${option('','すべての実施回',f.event)}${v6EventOptions(f.event)}</select></label><label class="field">区分<select onchange="v6ui.type=this.value;render()">${option('','すべて',f.type)}${['模試','検定'].map(x=>option(x,x,f.type)).join('')}</select></label><label class="field">学年<select onchange="v6ui.grade=this.value;render()">${gradeOptions(f.grade)}</select></label><label class="field">現在の状態<select onchange="v6ui.status=this.value;render()">${option('','すべて',f.status)}${['受験予定','受験済','結果待ち','合格','不合格','欠席','取消'].map(x=>option(x,x,f.status)).join('')}</select></label><label class="field">生徒名・級・検定名<input type="search" value="${esc(f.q)}" oninput="v6ui.q=this.value;v6RefreshEntryResults()" placeholder="名前・3級・漢検"></label></div><div id="v6-entry-results">${v6EntriesTable(rows)}</div></section>`;}
function v6RefreshEntryResults(){let host=document.getElementById('v6-entry-results');if(host)host.innerHTML=v6EntriesTable(v6FilteredEntries());}
function v6EntriesTable(rows){return `<p class="small muted" style="margin:5px 0 12px">${rows.length}件の受験管理記録／${new Set(rows.map(r=>r.studentId)).size}名</p><div class="tablewrap"><table><thead><tr><th>生徒・学年</th><th>検定・模試</th><th>実施日・級</th><th>申込</th><th>当日出欠</th><th>結果</th><th>請求</th><th>操作</th></tr></thead><tbody>${rows.map(r=>{let s=safeStudent(r.studentId),e=v6Event(r.eventId);return `<tr><td><b>${esc(s.name)}</b><div class="subcell">${esc(s.grade)} / ${esc(s.school)}</div></td><td>${esc(e.category)}<div class="subcell">${esc(e.name)}</div></td><td>${fmt(e.date)}<div class="subcell">${esc(r.level||'級指定なし')}</div></td><td>${v6SmallBadge(r.application)}</td><td>${v6SmallBadge(r.attendance)}</td><td>${v6SmallBadge(r.result)}${r.score!==''&&r.score!=null?`<div class="subcell">スコア ${esc(r.score)}</div>`:''}</td><td>${esc(r.billing)}</td><td><button class="btn small" onclick="v6EntryForm('${r.id}')">編集</button></td></tr>`}).join('')||'<tr><td colspan="8">該当する申込・受験記録はありません。</td></tr>'}</tbody></table></div>`;}
function v6LevelOptions(cat,selected=''){let levels=V6_LEVELS[cat]||[];return option('','指定なし',selected)+levels.map(x=>option(x,x,selected)).join('')+(selected&&!levels.includes(selected)?option(selected,selected,selected):'');}
function v6EntryForm(id='',overrideEvent=''){let r=id?db.qualEntries.find(x=>x.id===id):null,e=v6Event(r?.eventId||overrideEvent||v6ui.event)||v6RoomEvents()[0],s=safeStudent(r?.studentId)||roomStudentFirst();if(!e){toast('実施回を先に登録してください');return;}modal(r?'受験申込・結果を編集':'個別に申し込む',`<form onsubmit="v6SaveEntry(event,'${id}')"><div class="form-grid"><label class="field full">実施回<select name="eventId" id="v6-entry-event" onchange="v6UpdateEntryLevel()">${v6EventOptions(e.id)}</select></label><label class="field">生徒<select name="studentId" required>${roomStudents().filter(x=>x.enrollment!=='退塾').map(x=>option(x.id,`${x.grade}｜${x.name}`,r?.studentId||s?.id)).join('')}</select></label><label class="field">受検級<select name="level" id="v6-entry-level">${v6LevelOptions(e.category,r?.level||'')}</select></label><label class="field">受付日<input type="date" name="applyAt" value="${r?.applyAt||TODAY}"></label><label class="field">申込状態<select name="application">${V6_APPLY.map(x=>option(x,x,r?.application||'受付済み')).join('')}</select></label><label class="field">当日出欠<select name="attendance">${V6_ATTEND.map(x=>option(x,x,r?.attendance||'未実施')).join('')}</select></label><label class="field">結果<select name="result">${V6_RESULTS.map(x=>option(x,x,r?.result||'未発表')).join('')}</select></label><label class="field">得点・スコア（任意）<input name="score" maxlength="30" value="${esc(r?.score??'')}" placeholder="例：80／100、CSEなど"></label><label class="field">結果判明日<input type="date" name="resultAt" value="${r?.resultAt||''}"></label><label class="field">請求状況<select name="billing">${V6_BILL.map(x=>option(x,x,r?.billing||'未請求')).join('')}</select></label><label class="field">成績表返却日<input type="date" name="returnedAt" value="${r?.returnedAt||''}"></label><label class="field full">申し送り・備考<textarea name="memo" rows="3">${esc(r?.memo||'')}</textarea></label></div><div class="notice info mt">「合格」は当日出欠を「受験」にして保存したときのみ取得級に反映します。受験予定だけでは取得扱いになりません。</div><div class="formfooter"><button type="button" class="btn" onclick="closeModal()">キャンセル</button><button class="btn primary">保存</button></div></form>`);}
function v6UpdateEntryLevel(){let e=v6Event(document.getElementById('v6-entry-event')?.value),sel=document.getElementById('v6-entry-level');if(e&&sel)sel.innerHTML=v6LevelOptions(e.category);}
function v6SaveEntry(ev,id){ev.preventDefault();let f=new FormData(ev.target),old=db.qualEntries.find(x=>x.id===id),e=v6Event(f.get('eventId')),s=safeStudent(f.get('studentId'));if(!e||!s||!isSameRoom(s.id)){toast('生徒と実施回を確認してください');return}let level=String(f.get('level')||'').trim();if(e.type==='検定'&&!level){toast('検定の受検級を選択してください');return}if(!id&&db.qualEntries.some(r=>r.eventId===e.id&&r.studentId===s.id&&r.application!=='取消')){toast('この生徒は同じ実施回にすでに登録されています');return}let attendance=String(f.get('attendance')),result=String(f.get('result'));if(result==='合格'&&attendance!=='受験'){toast('合格として登録する場合は「受験」を選択してください');return}let data={...(old||{}),id:id||uid('qen'),eventId:e.id,studentId:s.id,level,applyAt:String(f.get('applyAt')),application:String(f.get('application')),attendance,result,score:String(f.get('score')||''),resultAt:String(f.get('resultAt')),billing:String(f.get('billing')),returnedAt:String(f.get('returnedAt')),memo:String(f.get('memo')||''),source:old?.source||'個別登録',updatedAt:now()};if(old)db.qualEntries[db.qualEntries.indexOf(old)]=data;else db.qualEntries.push(data);v6AuditChange('受験申込・結果',s.id,old?'受験記録を更新':'受験申込を登録',old?clone(old):'新規',data);persist();closeModal();render();toast('申込・受験状況を保存しました');}
function v6BulkSection(){let e=v6Event(v6ui.bulkEvent)||v6RoomEvents()[0],ss=roomStudents().filter(s=>s.enrollment==='在籍'&&(!v6ui.bulkGrade||s.grade===v6ui.bulkGrade)&&(!v6ui.bulkQ||norm(s.name+' '+s.kana+' '+s.code).includes(norm(v6ui.bulkQ)))),ids=new Set(v6VisibleEntries().filter(r=>r.eventId===e?.id&&r.application!=='取消').map(x=>x.studentId));return `<section class="card"><div class="section-title"><div><h2>複数生徒をまとめて申込</h2><p class="small muted">学年で絞り、対象者を選択。一括で受検級・受付状態を設定できます。</p></div><span class="badge green">選択 ${v6ui.bulkSelected.size}名</span></div><div class="toolbar"><label class="field" style="min-width:280px">実施回<select onchange="v6ui.bulkEvent=this.value;v6ui.bulkSelected.clear();render()">${v6EventOptions(e?.id)}</select></label><label class="field">学年<select onchange="v6ui.bulkGrade=this.value;render()">${gradeOptions(v6ui.bulkGrade)}</select></label><label class="field">名前で検索<input type="search" value="${esc(v6ui.bulkQ)}" oninput="v6ui.bulkQ=this.value;v6RefreshBulk()"></label><label class="field">共通の受検級<select id="v6-bulk-level" onchange="v6ui.bulkLevel=this.value">${v6LevelOptions(e?.category,v6ui.bulkLevel)}</select></label></div><div class="row mb"><button class="btn small" onclick="v6BulkCheckVisible(true)">現在の表示から全員選択</button><button class="btn small" onclick="v6BulkCheckVisible(false)">現在の表示を選択解除</button><button class="btn small" onclick="v6ui.bulkSelected.clear();render()">選択クリア</button></div><div id="v6-bulk-results">${v6BulkTable(ss,ids)}</div><div class="formfooter"><button class="btn primary" onclick="v6BulkSave()">選択した生徒をまとめて受付登録</button></div><p class="tiny muted mt">すでに同じ実施回に申込済みの生徒は重複登録しません。</p></section>`;}
function v6BulkTable(ss,registered){return `<div class="tablewrap"><table><thead><tr><th>選択</th><th>生徒名</th><th>学年・番号</th><th>申込状況</th></tr></thead><tbody>${ss.map(s=>`<tr><td><input type="checkbox" aria-label="${esc(s.name)}を選ぶ" ${v6ui.bulkSelected.has(s.id)?'checked':''} ${registered.has(s.id)?'disabled':''} onchange="v6BulkToggle('${s.id}',this.checked)"></td><td><b>${esc(s.name)}</b></td><td>${esc(s.grade)} <span class="small muted">${esc(s.code)}</span></td><td>${registered.has(s.id)?v6SmallBadge('申込登録済み'):'未登録'}</td></tr>`).join('')||'<tr><td colspan="4">条件に合う生徒はいません。</td></tr>'}</tbody></table></div>`;}
function v6RefreshBulk(){document.getElementById('v6-bulk-results').innerHTML=v6BulkTable(roomStudents().filter(s=>s.enrollment==='在籍'&&(!v6ui.bulkGrade||s.grade===v6ui.bulkGrade)&&(!v6ui.bulkQ||norm(s.name+' '+s.kana+' '+s.code).includes(norm(v6ui.bulkQ)))),new Set(v6VisibleEntries().filter(r=>r.eventId===(v6ui.bulkEvent||v6RoomEvents()[0]?.id)&&r.application!=='取消').map(x=>x.studentId)));}
function v6BulkToggle(id,on){if(on)v6ui.bulkSelected.add(id);else v6ui.bulkSelected.delete(id);}
function v6BulkCheckVisible(on){let ss=roomStudents().filter(s=>s.enrollment==='在籍'&&(!v6ui.bulkGrade||s.grade===v6ui.bulkGrade)&&(!v6ui.bulkQ||norm(s.name+' '+s.kana+' '+s.code).includes(norm(v6ui.bulkQ))));let eId=v6ui.bulkEvent||v6RoomEvents()[0]?.id;ss.forEach(s=>{if(db.qualEntries.some(r=>r.eventId===eId&&r.studentId===s.id&&r.application!=='取消'))return;if(on)v6ui.bulkSelected.add(s.id);else v6ui.bulkSelected.delete(s.id);});render();}
function v6BulkSave(){let e=v6Event(v6ui.bulkEvent||v6RoomEvents()[0]?.id);if(!e){toast('実施回を選択してください');return}let level=v6ui.bulkLevel;if(e.type==='検定'&&!level){toast('共通の受検級を選んでください');return}let count=0;v6ui.bulkSelected.forEach(sid=>{if(!isSameRoom(sid)||db.qualEntries.some(r=>r.eventId===e.id&&r.studentId===sid&&r.application!=='取消'))return;db.qualEntries.push({id:uid('qen'),eventId:e.id,studentId:sid,level:e.type==='検定'?level:'',applyAt:TODAY,application:'受付済み',attendance:'未実施',result:'未発表',score:'',billing:'未請求',returnedAt:'',memo:'一括登録',source:'一括登録',updatedAt:now()});count++});v6AuditChange('受験申込・一括','','一括受付登録','—',`${e.category} ${e.name} / ${level||'級指定なし'} / ${count}名`);persist();v6ui.bulkSelected.clear();v6ui.tab='applications';v6ui.event=e.id;render();toast(`${count}名の申込を登録しました（重複は除外）`);}
function v6IntakeSection(){let e=v6Event(v6ui.formEvent)||v6RoomEvents()[0];return `<div class="v6-hint-grid"><section class="card"><h2>申込フォーム（デモ受付）</h2><p class="small muted mt mb">塾生の生徒番号で照合する想定の受付画面です。保存すると同じブラウザ内の受験管理一覧へ反映されます。</p><form onsubmit="v6IntakeSave(event)"><label class="field">実施回<select name="event" id="v6-intake-event" onchange="v6ui.formEvent=this.value;v6IntakeRefreshLevel()">${v6EventOptions(e?.id)}</select></label><label class="field mt">生徒番号（デモ）<input name="code" required placeholder="例：D-001" autocomplete="off"></label><label class="field mt">受検級<select name="level" id="v6-intake-level">${v6LevelOptions(e?.category)}</select></label><label class="field mt">申込に関するメモ<input name="memo" maxlength="160" placeholder="任意"></label><label class="checkline mt"><input type="checkbox" required><span>申込内容を確認しました（デモ送信）</span></label><button class="btn primary mt" style="width:100%">申込を送信（デモ）</button></form><p class="tiny muted mt">公開URL・Googleフォーム連携はありません。入力した内容はこのブラウザにだけ保存されます。</p></section><section class="card"><h2>運用時の想定</h2><div class="v6-steps mt"><div><b>1. 募集・受付</b><p>実施回・受検級・締切日を指定したフォームを用意</p></div><div><b>2. 受付確認・申込</b><p>一覧に集約し、主催者への申込・請求状況を記録</p></div><div><b>3. 受験実績・結果</b><p>出欠、合否、得点、成績票返却を記録</p></div><div><b>4. 生徒カルテへ反映</b><p>取得級・受験履歴が自動で確認できる</p></div></div><div class="notice mt">実際に保護者へ配布できるフォームを作るには、認証・重複防止・同意取得・外部からの送信先・データ保護の実装が必要です。</div></section></div>`;}
function v6IntakeRefreshLevel(){let e=v6Event(document.getElementById('v6-intake-event')?.value),node=document.getElementById('v6-intake-level');if(e&&node)node.innerHTML=v6LevelOptions(e.category);}
function v6IntakeSave(ev){ev.preventDefault();let f=new FormData(ev.target),e=v6Event(f.get('event')),code=String(f.get('code')||'').trim(),s=db.students.find(x=>x.code===code&&isSameRoom(x.id));if(!s){toast('現在の教室に該当する生徒番号がありません。');return;}let level=String(f.get('level')||'');if(e?.type==='検定'&&!level){toast('受検級を選択してください');return;}if(db.qualEntries.some(r=>r.eventId===e?.id&&r.studentId===s.id&&r.application!=='取消')){toast('この実施回にはすでに申込登録があります');return;}db.qualEntries.push({id:uid('qen'),eventId:e.id,studentId:s.id,level,applyAt:TODAY,application:'仮受付',attendance:'未実施',result:'未発表',score:'',billing:'未請求',returnedAt:'',memo:String(f.get('memo')||''),source:'申込フォーム（デモ）',updatedAt:now()});v6AuditChange('受験申込・フォーム',s.id,'フォーム仮受付','新規',`${e.name} ${level}`);v6ui.tab='applications';v6ui.event=e.id;render();toast('仮受付を記録しました（デモ・外部送信なし）');}
function v6CredentialsSection(){const rows=roomStudents().flatMap(s=>v6CredentialsFor(s.id).map(r=>({...r,student:s}))).sort((a,b)=>(b.acquiredAt||'').localeCompare(a.acquiredAt||''));return `<section class="card"><div class="section-title"><div><h2>取得済みの級・資格</h2><p class="small muted">検定の「受験・合格」から自動反映。過去に取得した級も手動追加できます。</p></div><div class="row"><button class="btn small" onclick="v6CredentialForm()">＋ 過去の取得級を登録</button><button class="btn small" onclick="v6ExportCredentials()">CSV</button></div></div><div class="tablewrap"><table><thead><tr><th>生徒名</th><th>学年</th><th>検定</th><th>取得級</th><th>取得日</th><th>登録元</th><th>操作</th></tr></thead><tbody>${rows.map(r=>`<tr><td><b>${esc(r.student.name)}</b></td><td>${esc(r.student.grade)}</td><td>${esc(r.category)}</td><td>${v6SmallBadge(r.level)}</td><td>${fmt(r.acquiredAt)}</td><td>${r.auto?'合格結果から自動':'手動登録'}</td><td>${r.auto?'<span class="small muted">結果から編集</span>':`<button class="btn small" onclick="v6CredentialForm('${r.id}')">編集</button>`}</td></tr>`).join('')||'<tr><td colspan="7">取得級の記録はありません。</td></tr>'}</tbody></table></div></section>`;}
function v6CredentialForm(id=''){let r=id?db.qualCredentials.find(x=>x.id===id):null;modal(id?'取得級を編集':'過去の取得級を登録',`<form onsubmit="v6SaveCredential(event,'${id}')"><div class="form-grid"><label class="field">生徒<select name="studentId">${roomStudents().map(s=>option(s.id,`${s.grade}｜${s.name}`,r?.studentId||state.student)).join('')}</select></label><label class="field">検定名<select name="category" onchange="v6ChangeCredentialLevel(this.value)">${['漢検','英検','数検','日本語検定','その他'].map(x=>option(x,x,r?.category||'漢検')).join('')}</select></label><label class="field">取得級<input name="level" required maxlength="30" list="v6-credential-levels" value="${esc(r?.level||'')}" placeholder="例：3級"><datalist id="v6-credential-levels">${V6_LEVELS['漢検'].map(x=>`<option value="${x}">`).join('')}</datalist></label><label class="field">取得日<input name="acquiredAt" type="date" value="${r?.acquiredAt||'2026-03-14'}"></label><label class="field full">備考<textarea name="notes" rows="2">${esc(r?.notes||'')}</textarea></label></div><div class="formfooter"><button type="button" class="btn" onclick="closeModal()">キャンセル</button><button class="btn primary">保存</button></div></form>`);}
function v6ChangeCredentialLevel(cat){let list=document.getElementById('v6-credential-levels');if(list)list.innerHTML=(V6_LEVELS[cat]||[]).map(x=>`<option value="${x}">`).join('');}
function v6SaveCredential(ev,id){ev.preventDefault();let f=new FormData(ev.target),s=safeStudent(f.get('studentId')),old=db.qualCredentials.find(x=>x.id===id),category=String(f.get('category')),level=String(f.get('level')||'').trim();if(!s||!isSameRoom(s.id)||!level){toast('生徒・取得級を確認してください');return;}let data={...(old||{}),id:id||uid('qcert'),studentId:s.id,category,level,acquiredAt:String(f.get('acquiredAt')),notes:String(f.get('notes')||''),source:'手動',createdAt:old?.createdAt||now()};if(old)db.qualCredentials[db.qualCredentials.indexOf(old)]=data;else db.qualCredentials.push(data);v6AuditChange('取得級',s.id,old?'取得級を更新':'取得級を手動登録',old?clone(old):'新規',data);closeModal();render();toast('取得級を保存しました');}
function v6CSVCell(value){let x=String(value??'');if(/^[=+\-@]/.test(x))x="'"+x;return '"'+x.replace(/"/g,'""')+'"';}
function v6CSVDownload(file,head,rows){let str='\ufeff'+[head,...rows].map(row=>row.map(v6CSVCell).join(',')).join('\r\n');let blob=new Blob([str],{type:'text/csv;charset=utf-8;'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=file;a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);toast('CSVを書き出しました');}
function v6EntryExportRows(){return v6FilteredEntries().map(r=>{let s=safeStudent(r.studentId),e=v6Event(r.eventId);return [s.code,s.name,s.kana,s.grade,s.school,e.type,e.category,e.name,e.date,r.level,r.applyAt,r.application,r.attendance,r.result,r.score,r.billing,r.returnedAt||'',r.memo||''];});}
function v6ExportEntries(){v6CSVDownload('模試検定_受験管理_'+TODAY+'.csv',['番号','生徒','ふりがな','学年','教室','種別','検定名','実施回','実施日','受検級','申込日','申込状態','当日出欠','結果','スコア','請求','成績表返却','備考'],v6EntryExportRows());}
function v6ExportCredentials(){v6CSVDownload('取得級一覧_'+TODAY+'.csv',['生徒番号','生徒','学年','教室','種類','取得級','取得日','登録方法'],roomStudents().flatMap(s=>v6CredentialsFor(s.id).map(r=>[s.code,s.name,s.grade,s.school,r.category,r.level,r.acquiredAt,r.source])));}
function v6VisibleRoster(){return matchStudents({...extra.roster,classroom:currentRoom(),subject:''});}
function v6SortRoster(ss){return [...ss].sort((a,b)=>{let k=v6ui.rosterSort,comp=k==='code'?(a.code||'').localeCompare(b.code||'','ja',{numeric:true}):k==='name'?(a.name||'').localeCompare(b.name||'','ja'):k==='kana'?(a.kana||'').localeCompare(b.kana||'','ja'):(GRADES.indexOf(a.grade)-GRADES.indexOf(b.grade)||String(a.kana||'').localeCompare(String(b.kana||''),'ja'));return (v6ui.rosterDir==='desc'?-1:1)*comp;});}
function v6RosterCSV(){let ss=v6SortRoster(v6VisibleRoster());v6CSVDownload('生徒名簿_'+currentRoom().replace(/\W/g,'')+'.csv',['生徒番号','氏名','ふりがな','学年','学校','教室','在籍状態','取得級','受験予定'],ss.map(s=>[s.code,s.name,s.kana,s.grade,s.schoolName||'',s.school,s.enrollment,v6PassSummary(s.id),v6EntriesFor(s.id).filter(x=>x.event.date>=TODAY&&x.application!=='取消').map(x=>`${x.event.category}${x.level||''} ${x.event.date}`).join('、')]));}
function v6PreparePrint(html){document.getElementById('print-root').innerHTML=html;window.print();}
function v6RosterPrint(){let ss=v6SortRoster(v6VisibleRoster());let body=`<section class="report-page v6-print-paper"><div class="v6-print-head"><h1>生徒名簿</h1><div>${esc(currentRoom())} ／ ${fmt(TODAY)}<br>表示 ${ss.length}名</div></div><table><thead><tr><th>No.</th><th>生徒番号</th><th>氏名</th><th>ふりがな</th><th>学年</th><th>在籍</th><th>取得級</th></tr></thead><tbody>${ss.map((s,i)=>`<tr><td>${i+1}</td><td>${esc(s.code)}</td><td>${esc(s.name)}</td><td>${esc(s.kana)}</td><td>${esc(s.grade)}</td><td>${esc(s.enrollment)}</td><td>${esc(v6PassSummary(s.id))}</td></tr>`).join('')}</tbody></table><div class="v6-foot">※架空の生徒データ ／ 検定取得級は確定したもののみ</div></section>`;v6PreparePrint(body);}
function v6PrintEntries(){let rows=v6FilteredEntries();let body=`<section class="report-page v6-print-paper"><div class="v6-print-head"><h1>模試・検定 受験管理名簿</h1><div>${esc(currentRoom())} ／ ${fmt(TODAY)}<br>申込・受験 ${rows.length}件</div></div><table><thead><tr><th>No.</th><th>学年</th><th>生徒名</th><th>模試・検定</th><th>受検級</th><th>実施日</th><th>申込</th><th>出欠</th><th>結果</th></tr></thead><tbody>${rows.map((r,i)=>{let s=safeStudent(r.studentId),e=v6Event(r.eventId);return `<tr><td>${i+1}</td><td>${esc(s.grade)}</td><td>${esc(s.name)}</td><td>${esc(e.category)}</td><td>${esc(r.level||'—')}</td><td>${fmt(e.date)}</td><td>${esc(r.application)}</td><td>${esc(r.attendance)}</td><td>${esc(r.result)}</td></tr>`}).join('')}</tbody></table><div class="v6-foot">※デモデータ。実際の申込・外部機関への手続を示すものではありません。</div></section>`;v6PreparePrint(body);}
// 授業報告書（A4・教科別）に、確定した受験状況のみコンパクトに追加。グラフの元点数とは独立。
const V6_prevTermOnePage=termOnePage;
termOnePage=function(sid,sub,ls){let html=V6_prevTermOnePage(sid,sub,ls),d=v6ExamDigest(sid);if(!d)return html;let block=`<div class="v6-term-qual"><b>模試・検定・取得級</b><span>${esc(d)}</span></div>`;let marker='<div class="term-foot">';return html.includes(marker)?html.replace(marker,block+marker):html;};
const V6_prevSettings=renderSettings;
renderSettings=function(){return V6_prevSettings()+`<div class="card mt"><h2>v6：模試・検定の受付と教科</h2><p class="small mt">生徒情報に受講教科を登録しなくても、小学校・中学校の5教科と高校の大学入学共通テスト科目を選択可能。申込・実施回・受験出欠・合否・取得級は別データで保持します。取得級は「受験済みかつ合格」または過去資格の手動登録だけを表示。</p><p class="small mt">外部Googleフォーム連携・公開フォーム・外部試験の正式申込・請求・実データ取り込みは未実装です。</p></div>`;};
// Report pages with no subject registered in student master remain available in manual mode.
// The historical v5 sample remains unchanged (80 students, 10 lessons in each sample subject).
document.title='学びのスキルカルテ v6｜模試・検定・全教科対応';
const marker=document.querySelector('.sidebar-foot .tiny.muted');if(marker)marker.textContent='電子学プロ / Prototype 0.6';
persist();render();

// v6 final adjustments: class-based roster without subject enrollment dependency.
const V6_prevMatchStudents=matchStudents;
matchStudents=function(f){let base=V6_prevMatchStudents({...f,subject:''});if(f.subject)base=base.filter(s=>db.lessons.some(l=>l.student===s.id&&l.subject===f.subject));return base;};
rosterResults=function(){let ss=matchStudents(extra.roster);return `<div class="filter-result"><b>${ss.length}名</b>を表示 ／ ${esc(currentRoom())} ／ 登録 ${db.students.length}名</div><div class="tablewrap"><table class="roster-table"><thead><tr><th>生徒名・生徒番号</th><th>学年・在籍状態</th><th>授業履歴のある教科・属性</th><th>取得済みの級</th><th>操作</th></tr></thead><tbody>${ss.map(s=>{let lessonSubs=[...new Set(db.lessons.filter(l=>l.student===s.id).map(l=>l.subject))];return `<tr><td><b class="roster-name">${esc(s.name)}</b><div class="roster-sub">${esc(s.kana)} ／ ${esc(s.code)}</div></td><td>${esc(s.grade)}<div class="roster-sub">${esc(s.enrollment)}</div></td><td>${lessonSubs.length?lessonSubs.map(esc).join('・'):'授業記録なし'}<div class="roster-sub">${esc((s.attributes||[]).join('・'))}</div></td><td><span class="small">${esc(v6PassSummary(s.id))}</span></td><td><div class="row"><button class="btn small" onclick="viewStudent('${s.id}')">カルテ</button><button class="btn small" onclick="addStudentToDesk('${s.id}')">授業表示</button><button class="btn small" onclick="openStudentForm('${s.id}')">編集</button></div></td></tr>`;}).join('')||'<tr><td colspan="5">条件に合う生徒はいません</td></tr>'}</tbody></table></div>`;};
const V6_prevRosterFinal=renderRoster;
renderRoster=function(){return V6_prevRosterFinal().replace('<label class="field">教科<select onchange="extra.roster.subject','<label class="field">授業履歴のある教科<select onchange="extra.roster.subject');};
const V6_prevChoose=chooseStudent;
chooseStudent=function(id){let p=extra.picker,s=safeStudent(id),target=p?.target;if(!s)return;if(target==='profile'){closePicker();state.student=id;state.subject=v6StudentSubjects(s)[0]||'数学';rememberStudent(id);state.compare.leftSubject=state.subject;state.compare.rightSubject=state.subject;render();return;}V6_prevChoose(id);if(target==='desk'){let i=extra.desk.seats.findIndex(x=>x?.student===id);if(i>=0){const seat=extra.desk.seats[i];if(!v6StudentSubjects(s).includes(seat.subject)){seat.subject=v6StudentSubjects(s)[0]||'数学';storeView();render();}}}};
const V6_prevAddToDesk=addStudentToDesk;
addStudentToDesk=function(id){V6_prevAddToDesk(id);let s=safeStudent(id),i=extra.desk.seats.findIndex(x=>x?.student===id);if(s&&i>=0&&!v6StudentSubjects(s).includes(extra.desk.seats[i].subject)){extra.desk.seats[i].subject=v6StudentSubjects(s)[0]||'数学';storeView();render();}};
const V6_prevVisibleRoster=v6VisibleRoster;
v6VisibleRoster=function(){return matchStudents({...extra.roster,classroom:currentRoom()});};
const V6_prevBulkSave=v6BulkSave;
v6BulkSave=function(){let e=v6Event(v6ui.bulkEvent||v6RoomEvents()[0]?.id);if(e&&e.room!=='両教室'&&e.room!==currentRoom()){toast('別教室の実施回には申し込めません');return;}V6_prevBulkSave();};
// See all common-test subjects even when filtering the historical class roster.
const V6_prevSubjectSelect=v6SubjectSelect;
v6SubjectSelect=function(selected='',opts={}){return V6_prevSubjectSelect(selected,opts);};
const V6_prevCSVFile=v6RosterCSV;
v6RosterCSV=function(){let ss=v6SortRoster(v6VisibleRoster());v6CSVDownload('生徒名簿_'+currentRoom().replace(/[\\/:*?"<>|]/g,'')+'.csv',['生徒番号','氏名','ふりがな','学年','学校','教室','在籍状態','取得級','受験予定'],ss.map(s=>[s.code,s.name,s.kana,s.grade,s.schoolName||'',s.school,s.enrollment,v6PassSummary(s.id),v6EntriesFor(s.id).filter(x=>x.event.date>=TODAY&&x.application!=='取消').map(x=>`${x.event.category}${x.level||''} ${x.event.date}`).join('、')]));};
// Additional direct route from an exam application to subject-specific score registration.
function v6OpenScores(id){let r=db.qualEntries.find(x=>x.id===id),e=r&&v6Event(r.eventId);if(!r||!e){toast('申込記録が見つかりません');return;}openExamForm('',r.studentId);let form=document.getElementById('v4-exam-form');if(!form)return;const date=form.querySelector('[name="date"]'),title=form.querySelector('[name="title"]'),type=form.querySelector('[name="type"]');if(date)date.value=e.date;if(title)title.value=e.name;if(type)type.value='模試';let notes=form.querySelector('[name="notes"]');if(notes)notes.value=`${notes.value||''}\n実施回：${e.name}（${e.date}）`.trim();}
const V6_prevApplicationsSection=v6ApplicationsSection;
v6ApplicationsSection=function(){let html=V6_prevApplicationsSection();return html.replace('<div id="v6-entry-results">','<p class="tiny muted mb">模試の教科別得点は「定期テスト・模試」でも入力・分析できます。受験実績と成績推移を分けて保持します。</p><div id="v6-entry-results">');};
const V6_prevEntriesTable=v6EntriesTable;
v6EntriesTable=function(rows){let html=V6_prevEntriesTable(rows);return html.replace(/<button class="btn small" onclick="v6EntryForm\('([^']+)'\)">編集<\/button>/g,(_,id)=>`<div class="row" style="gap:4px"><button class="btn small" onclick="v6EntryForm('${id}')">編集</button>${v6Event(db.qualEntries.find(r=>r.id===id)?.eventId)?.type==='模試'?`<button class="btn small" title="教科別得点を登録" onclick="v6OpenScores('${id}')">成績</button>`:''}</div>`);};
render();

// v6: make master directory independent of enrollment subjects (legacy demo field remains for historical records only).
masterStudentRows=function(){let f=extra.roster,ss=matchStudents({...f,q:extra.masterQ,classroom:currentRoom()});return `<div class="filter-result">${ss.length}名を表示 ／ ${esc(currentRoom())}　<span class="muted">教科はマスター登録不要です</span></div><div class="tablewrap"><table class="master-table"><thead><tr><th>生徒名・番号</th><th>学年・学校</th><th>授業記録数</th><th>在籍</th><th>バーコード・操作</th></tr></thead><tbody>${ss.map(s=>`<tr><td><b>${esc(s.name)}</b><div class="subcell">${esc(s.kana||'')} ／ ${esc(s.code)}</div></td><td>${esc(s.grade)}<div class="subcell">${esc(s.schoolName||'学校名未登録')}</div></td><td>${db.lessons.filter(l=>l.student===s.id).length}件</td><td>${v6SmallBadge(s.enrollment||'在籍')}</td><td><div class="actions"><button class="btn small" onclick="openStudentBarcode('${s.id}')">バーコード</button><button class="btn small" onclick="openStudentForm('${s.id}')">編集</button><button class="btn small" onclick="viewStudent('${s.id}')">カルテ</button></div></td></tr>`).join('')||'<tr><td colspan="5">該当する生徒がありません</td></tr>'}</tbody></table></div>`;};
const V6_prevMaster=masterStudents;
masterStudents=function(){return V6_prevMaster().replace('<b>登録生徒','<span class="small muted">受講教科の登録は不要です</span> <b>登録生徒');};
// A cancelled application cannot be simultaneously certified as a valid pass.
const V6_prevSaveEntry=v6SaveEntry;
v6SaveEntry=function(ev,id){let f=new FormData(ev.target);if(f.get('application')==='取消'&&f.get('result')==='合格'){ev.preventDefault();toast('取消した申込を合格扱いにすることはできません');return;}V6_prevSaveEntry(ev,id);};
render();



// ===== v7 / 入力欄の順序・次回授業教材の構造化 =====
// 保存キーはv6を引き継ぎ、既存の学習履歴を破壊しません。
function v7NewNextMaterial(){return {id:uid('next'),catalogId:'',name:'',unit:'',pages:''};}
function v7AsNextMaterials(record){let a=Array.isArray(record?.nextMaterials)?record.nextMaterials:[];return a.length?clone(a).map(x=>({...v7NewNextMaterial(),...x})): [v7NewNextMaterial()];}
function v7NextText(record){return (record?.nextMaterials||[]).filter(x=>String(x.name||'').trim()).map(x=>[x.name,x.unit,x.pages].filter(Boolean).join(' ／ ')).join('\n');}
function v7HomeworkText(record){let entries=asHomeworkItems(record).filter(h=>[h.name,h.unit,h.pages,h.instruction].some(x=>String(x||'').trim()));let rows=entries.map(h=>[h.name,h.unit,h.pages,h.instruction].filter(Boolean).join(' ／ '));let extra=String(record?.homeworkNote??record?.homework??'').trim();if(rows.length)return rows.join('\n')+(extra&&extra!=='なし'&&!rows.some(x=>x.includes(extra))?'\n補足：'+extra:'');return extra||'なし';}
// 単元名は別項目として明示し、既存データの material.content は単元名として継続利用。
renderMaterialRow=function(m,j,token){return `<div class="v7-row material-row" data-mat-index="${j}"><div class="v7-row-header"><b>使用教材 ${j+1}</b><div class="row" style="gap:5px"><button type="button" class="btn small" onclick="openBookPicker('${token}',${j})">教材を選択</button><button type="button" class="btn text small" onclick="removeMaterial('${token}',${j})">× 削除</button></div></div><div class="v7-triple"><label class="field">① 教材名<input data-mat-field="name" value="${esc(m.name||'')}" placeholder="選択または手入力" maxlength="140"></label><label class="field">② 単元名<input data-mat-field="content" value="${esc(m.content||'')}" placeholder="例：一次関数" maxlength="200"></label><label class="field">③ ページ<input data-mat-field="pages" value="${esc(m.pages||'')}" placeholder="p.42〜43" maxlength="160"></label></div>${m.sourcePages?`<div class="source-hint">前回の範囲：${esc(m.sourcePages)} <button type="button" class="btn text small" onclick="reuseRange('${token}',${j})">同じ範囲を使う</button></div>`:''}</div>`;};
// 宿題にも単元名を保持。古いデモ記録は空欄から入力できます。
const v7PrevBlankHomework=blankHomework;
blankHomework=function(){return {...v7PrevBlankHomework(),unit:''};};
const v7PrevAsHomework=asHomeworkItems;
asHomeworkItems=function(d){return v7PrevAsHomework(d).map(h=>({...h,unit:h.unit||''}));};
renderHWRow=function(h,j,token){return `<div class="v7-row hw-row" data-home-index="${j}"><div class="v7-row-header"><b>宿題教材 ${j+1}</b><div class="row" style="gap:5px"><button type="button" class="btn small" onclick="openHomeworkBookPicker('${token}',${j})">教材を選択</button><button type="button" class="btn text small" onclick="removeHomeworkRow('${token}',${j})">× 削除</button></div></div><div class="v7-triple"><label class="field">① 教材名<input data-home-field="name" value="${esc(h.name||'')}" placeholder="選択または手入力"></label><label class="field">② 単元名<input data-home-field="unit" value="${esc(h.unit||'')}" placeholder="例：変化の割合"></label><label class="field">③ ページ<input data-home-field="pages" value="${esc(h.pages||'')}" placeholder="p.44〜45"></label></div><label class="field v7-instruction">追加の指示（任意）<input data-home-field="instruction" value="${esc(h.instruction||'')}" placeholder="例：問1〜5を解く"></label>${h.sourcePages?`<div class="source-hint">前回の宿題：${esc(h.sourcePages)} <button type="button" class="btn text small" onclick="reuseHomeworkRange('${token}',${j})">同じ範囲を使う</button></div>`:''}</div>`;};
function v7NextRow(n,j,token){return `<div class="v7-row" data-next-index="${j}"><div class="v7-row-header"><b>次回の教材 ${j+1}</b><div class="row" style="gap:5px"><button type="button" class="btn small" onclick="v7OpenNextPicker('${token}',${j})">教材を選択</button><button type="button" class="btn text small" onclick="v7RemoveNext('${token}',${j})">× 削除</button></div></div><div class="v7-triple"><label class="field">① 教材名<input data-next-field="name" value="${esc(n.name||'')}" placeholder="選択または手入力"></label><label class="field">② 単元名<input data-next-field="unit" value="${esc(n.unit||'')}" placeholder="例：一次関数のグラフ"></label><label class="field">③ ページ<input data-next-field="pages" value="${esc(n.pages||'')}" placeholder="p.46〜47"></label></div></div>`;}
function v7AddNext(token){let d=captureEntry(token);if(!d)return;d.nextMaterials=v7AsNextMaterials(d);d.nextMaterials.push(v7NewNextMaterial());touchDraft(d);persist();refreshEditor(token);}
function v7RemoveNext(token,j){let d=captureEntry(token);if(!d)return;let n=d.nextMaterials?.[j];if(n&&(n.name||n.unit||n.pages)&&!confirm('この次回教材行を削除しますか？'))return;d.nextMaterials.splice(j,1);if(!d.nextMaterials.length)d.nextMaterials=[v7NewNextMaterial()];touchDraft(d);persist();refreshEditor(token);}
const v7PrevEntry=renderEntry;
renderEntry=function(d,token){if(!Array.isArray(d.nextMaterials)||!d.nextMaterials.length)d.nextMaterials=v7AsNextMaterials(d);let html=v7PrevEntry(d,token);let start=html.indexOf('<label class="field mt">次回の指導内容');let end=start<0?-1:html.indexOf('</label>',start);if(start<0||end<0)return html;end+='</label>'.length;const nextInstruction=html.slice(start,end),without=html.slice(0,start)+html.slice(end);const mark='<div class="note-new">';const pos=without.indexOf(mark);if(pos<0)return without+nextInstruction;const nextScope=`<div class="record-scope v7-next-scope"><div class="row between"><b>次回の授業（教材・単元・ページ）</b><span class="tiny muted">必要に応じて複数登録</span></div>${d.nextMaterials.map((n,j)=>v7NextRow(n,j,token)).join('')}<button type="button" class="btn small" onclick="v7AddNext('${token}')">＋ 次回の教材を追加</button><div class="v7-field-sequence">次回の授業で使用する教材を先に登録。指導方針は下に記入します。</div></div>`;return without.slice(0,pos)+nextScope+nextInstruction+without.slice(pos);};
// v3既存の入力保存を通し、その後に新設した項目を追加保存。
const v7PrevCapture=captureEntry;
captureEntry=function(token){let d=v7PrevCapture(token),root=editorRoot(token);if(!d||!root)return d;d.homeworkItems=asHomeworkItems(d);for(const [j,h] of d.homeworkItems.entries()){const r=[...root.querySelectorAll('[data-home-index]')][j];if(r)h.unit=r.querySelector('[data-home-field="unit"]')?.value||'';}const prior=Array.isArray(d.nextMaterials)?d.nextMaterials:[];d.nextMaterials=[...root.querySelectorAll('[data-next-index]')].map((row,j)=>{const old=prior[j]||v7NewNextMaterial();const n={...old};['name','unit','pages'].forEach(k=>n[k]=row.querySelector(`[data-next-field="${k}"]`)?.value||'');if(n.name!==old.name)n.catalogId='';return n;});touchDraft(d);persist();return d;};
// 教材マスター候補を次回授業の教材にも使う。
function v7OpenNextPicker(token,index){openBookPicker(token,0);extra.bookPicker.kind='v7next';extra.bookPicker.index=index;renderBookPicker();}
const v7PrevChooseBook=chooseBook;
chooseBook=function(id){const p=extra.bookPicker;if(p?.kind==='v7next'){let d=getEditor(p.token),row=d?.nextMaterials?.[p.index],book=db.catalog.find(b=>b.id===id);if(!row||!book)return;row.name=book.title;row.catalogId=book.id;touchDraft(d);persist();closePicker();refreshEditor(p.token);toast('次回授業の教材を選択しました。単元名・ページを入力してください。');return;}return v7PrevChooseBook(id);};
const v7PrevRenderBookPicker=renderBookPicker;
renderBookPicker=function(){v7PrevRenderBookPicker();if(extra.bookPicker?.kind==='v7next'){let title=document.getElementById('picker-title');if(title)title.textContent='次回の授業で使う教材を選ぶ';}};
// 前回、次回教材として指定された予定がある場合は、それを今回の使用教材へ引き継ぐ。
const v7PrevCopyPrevious=copyPrevious;
copyPrevious=function(token,kind){if(kind!=='materials')return v7PrevCopyPrevious(token,kind);let d=getEditor(token),prev=d&&prevLesson(d),planned=prev?.nextMaterials?.filter(x=>x.name?.trim())||[];if(!planned.length)return v7PrevCopyPrevious(token,kind);d=captureEntry(token);if(d.materials.some(m=>m.name||m.pages||m.content)&&!confirm('今回の使用教材を前回の「次回授業予定」で置き換えますか？'))return;d.materials=planned.map(n=>({...blankMaterial(),name:n.name,content:n.unit||'',pages:n.pages||'',catalogId:n.catalogId||''}));touchDraft(d);persist();refreshEditor(token);toast('前回の次回授業予定から、教材名・単元名・ページを引き継ぎました。');};
const v7PrevPrevious=renderPrevious;
renderPrevious=function(d,prev,token){let html=v7PrevPrevious(d,prev,token);let ms=prev?.nextMaterials?.filter(x=>x.name?.trim())||[];if(ms.length){let marker='<div class="row" style="margin-top:9px;gap:6px">';let pos=html.indexOf(marker);if(pos>=0){let note=`<p class="small muted mt"><b>前回指定された次回授業の教材：</b><br>${esc(ms.map(n=>[n.name,n.unit,n.pages].filter(Boolean).join(' ／ ')).join('\n')).replaceAll('\n','<br>')}</p>`;html=html.slice(0,pos)+note+html.slice(pos);}}return html;};
// 出力や履歴の教材順序も「教材名 → 単元名 → ページ」に統一。
materialsText=function(l,includeHomework=false){return asMaterials(l).filter(m=>String(m.name||'').trim()).map(m=>[m.name,m.content,m.pages,includeHomework&&m.homework?'宿題 '+m.homework:''].filter(Boolean).join(' ／ ')).join('\n');};
reportMaterials=function(l){let ms=asMaterials(l).filter(m=>m.name);if(!ms.length)return '<p class="small muted">教材の記録なし</p>';return `<table class="mat-table"><thead><tr><th>教材名</th><th>単元名</th><th>ページ</th></tr></thead><tbody>${ms.map(m=>`<tr><td>${esc(m.name)}</td><td>${esc(m.content||'—')}</td><td>${esc(m.pages||'—')}</td></tr>`).join('')}</tbody></table>`;};
hwText=v7HomeworkText;
currentHomework=function(d){let rows=(d.homeworkItems||[]).filter(h=>[h.name,h.unit,h.pages,h.instruction].some(x=>String(x||'').trim())).map(h=>[h.name,h.unit,h.pages,h.instruction].filter(Boolean).join(' ／ '));let supplement=String(d.homework||'').trim();if(supplement)rows.push(supplement==='なし'?'宿題なし':'補足：'+supplement);return rows.join('\n');};
const v7PrevSubmit=submitEntry;
submitEntry=function(token,intent){let d=captureEntry(token);if(!d)return;let missingName=d.nextMaterials?.find(n=>!String(n.name||'').trim()&&(String(n.unit||'').trim()||String(n.pages||'').trim()));if(missingName){toast('次回授業の単元名・ページを入力した行には教材名も入力してください。');return;}let hwMissing=d.homeworkItems?.find(h=>!String(h.name||'').trim()&&(String(h.unit||'').trim()||String(h.pages||'').trim()||String(h.instruction||'').trim()));if(hwMissing){toast('宿題の単元名・ページ・指示を入力した行には教材名も入力してください。');return;}return v7PrevSubmit(token,intent);};
const v7PrevLessonText=lessonText;
lessonText=function(l){return v7PrevLessonText(l)+(v7NextText(l)?'\n次回授業の教材・単元・ページ：\n'+v7NextText(l):'');};
const v7PrevLessonCard=lessonCard;
lessonCard=function(l,opts={}){let out=v7PrevLessonCard(l,opts),next=v7NextText(l);return next?out.replace('<div class="lesson-foot">',`<div class="small muted preline mt"><b>次回授業の教材・単元・ページ</b>\n${esc(next)}</div><div class="lesson-foot">`):out;};
document.title='学びのスキルカルテ v7｜授業入力の順序を改善';
const v7Footer=document.querySelector('.sidebar-foot .tiny.muted');if(v7Footer)v7Footer.textContent='電子学プロ / Prototype 0.7';
render();

// ===== v8: 一括級指定・全名簿の昇降順・学年別バーコード・保存・提出・ブラウザ戻る =====
// このファイル内の個人・授業データはすべて操作確認用の架空データです。
const V8_UI_KEY='llld_manabi_v9_ui';
const V8_FORM_KEY='llld_manabi_v9_forms';
const V8_SLOTS=['X','Y','Z','A','B','C','D'];
function v8Read(key,fall={}){try{let x=JSON.parse(DebugStorage.getItem(key)||'null');return x&&typeof x==='object'?x:fall}catch(e){return fall}}
function v8Write(key,data){try{DebugStorage.setItem(key,JSON.stringify(data));return true}catch(e){console.warn('端末への下書き保存失敗',e);return false}}
const v8Preferences=v8Read(V8_UI_KEY);
const v8Prefs={
 barcodeMode:'grade',barcodeGrade:'all',recentSubject:'',dailySlot:'all',dailyLayout:'cards',dailyLimit:40,dailyDir:'desc',
 rosterSort:v6ui.rosterSort||'grade',rosterDir:v6ui.rosterDir||'asc',
 applicationsSort:'date',applicationsDir:'desc',
 bulkSort:'grade',bulkDir:'asc',
 credentialsSort:'acquiredAt',credentialsDir:'desc',
 teachersSort:'name',teachersDir:'asc',booksSort:'name',booksDir:'asc',
 examSort:'date',examDir:'desc',
 bulkLevels:{},selectedDaily:[],
 ...v8Preferences
};
const v8SelectedDaily=new Set(v8Prefs.selectedDaily||[]);
if(Array.isArray(v8Prefs.bulkSelected))v6ui.bulkSelected=new Set(v8Prefs.bulkSelected);
function v8SavePrefs(){v8Prefs.selectedDaily=[...v8SelectedDaily];v8Prefs.bulkSelected=[...v6ui.bulkSelected];v8Write(V8_UI_KEY,v8Prefs)}
function v8SortUI(scope,fields){const field=v8Prefs[scope+'Sort'],direction=v8Prefs[scope+'Dir'];return `<div class="v8-sortbar"><span class="small strong">並べ替え</span><select aria-label="並べ替え項目" onchange="v8ChangeSort('${scope}','Sort',this.value)">${fields.map(([k,label])=>option(k,label,field)).join('')}</select><select aria-label="昇順・降順" onchange="v8ChangeSort('${scope}','Dir',this.value)">${option('asc','昇順 ↑',direction)}${option('desc','降順 ↓',direction)}</select></div>`;}
function v8ChangeSort(scope,k,val){v8Prefs[scope+k]=val;if(scope==='roster'){v6ui.rosterSort=v8Prefs.rosterSort;v6ui.rosterDir=v8Prefs.rosterDir;}v8SavePrefs();render()}
const V8_ROSTER_KEYS=[['grade','学年'],['kana','ふりがな'],['name','氏名'],['code','生徒番号'],['school','教室']];
const V8_APP_KEYS=[['date','実施日'],['grade','学年'],['name','生徒名'],['level','受検級'],['category','検定名'],['application','申込状態'],['attendance','当日出欠'],['result','結果']];
const V8_CRED_KEYS=[['acquiredAt','取得日'],['grade','学年'],['name','生徒名'],['category','検定名'],['level','取得級']];
const V8_BULK_KEYS=[['grade','学年'],['name','生徒名'],['kana','ふりがな'],['code','生徒番号']];
function v8Collate(a,b){return String(a??'').localeCompare(String(b??''),'ja',{numeric:true,sensitivity:'base'});}
function v8SchoolGrade(s){let i=GRADES.indexOf(s?.grade);return i<0?999:i;}
function v8CompareStudents(a,b,k){return k==='grade'?v8SchoolGrade(a)-v8SchoolGrade(b):v8Collate(k==='school'?a.school:a[k],k==='school'?b.school:b[k]);}
function v8SortStudents(list,scope='roster'){const k=v8Prefs[scope+'Sort'],dir=v8Prefs[scope+'Dir']==='desc'?-1:1;return [...list].sort((a,b)=>dir*v8CompareStudents(a,b,k)||v8CompareStudents(a,b,'kana')||v8Collate(a.code,b.code));}
v6ui.rosterSort=v8Prefs.rosterSort;
v6ui.rosterDir=v8Prefs.rosterDir;
const V8_originalMatchStudents=matchStudents;
matchStudents=function(f){return v8SortStudents(V8_originalMatchStudents(f),'roster')};
const V8_prevRoster=renderRoster;
renderRoster=function(){let text=V8_prevRoster();return text.replace('<div class="grade-pills">',v8SortUI('roster',V8_ROSTER_KEYS)+'<div class="grade-pills">');};
const V8_prevMasterStudents=masterStudents;
masterStudents=function(){let out=V8_prevMasterStudents();return out.replace('<div id="master-list">',v8SortUI('roster',V8_ROSTER_KEYS)+'<div id="master-list">');};
function v8DOMSort(table,scope,columns){if(!table)return;let body=table.tBodies[0];if(!body)return;let key=v8Prefs[scope+'Sort'],index=columns[key]??0,dir=v8Prefs[scope+'Dir']==='desc'?-1:1,rows=[...body.rows];rows.sort((a,b)=>{let av=a.cells[index]?.innerText||'',bv=b.cells[index]?.innerText||'';if(key==='grade'){const aidx=GRADES.findIndex(x=>av.includes(x)),bidx=GRADES.findIndex(x=>bv.includes(x));return dir*(aidx-bidx)}return dir*v8Collate(av,bv);});rows.forEach(r=>body.appendChild(r));}
const V8_prevMasterTeachers=masterTeachers;
masterTeachers=function(){return V8_prevMasterTeachers().replace('<div class="tablewrap">',v8SortUI('teachers',[['name','講師名'],['role','役割'],['room','所属教室'],['status','状態']])+'<div class="tablewrap">');};
const V8_prevFilteredBooks=filteredBooks;
filteredBooks=function(f){const bs=V8_prevFilteredBooks(f),key=v8Prefs.booksSort,dir=v8Prefs.booksDir==='desc'?-1:1;const field=b=>key==='grade'?String(Math.min(...(b.grades||[]).map(g=>GRADES.indexOf(g)),999)).padStart(3,'0'):key==='subject'?b.subject:b.title;return [...bs].sort((a,b)=>dir*v8Collate(field(a),field(b))||v8Collate(a.title,b.title));};
const V8_prevMasterBooksScreen=masterBooks;
masterBooks=function(){let html=V8_prevMasterBooksScreen();return html.replace('<div id="master-books">',v8SortUI('books',[['name','教材名'],['grade','学年'],['subject','教科']])+'<div id="master-books">');};
// 模試・検定の一覧はデータを並べ替えた上で、CSV・印刷と同じ順にする。
const V8_prevFilteredEntries=v6FilteredEntries;
v6FilteredEntries=function(){let rows=V8_prevFilteredEntries(),k=v8Prefs.applicationsSort,dir=v8Prefs.applicationsDir==='desc'?-1:1;let get=(r)=>{let e=v6Event(r.eventId),s=safeStudent(r.studentId);switch(k){case 'grade':return String(v8SchoolGrade(s)).padStart(3,'0');case 'name':return s.name;case 'level':return r.level;case 'category':return e.category;case 'application':return r.application;case 'attendance':return r.attendance;case 'result':return r.result;default:return e.date;}};return rows.sort((a,b)=>dir*v8Collate(get(a),get(b))||v8Collate(safeStudent(a.studentId).kana,safeStudent(b.studentId).kana));};
const V8_prevApplicationsSection=v6ApplicationsSection;
v6ApplicationsSection=function(){let html=V8_prevApplicationsSection();return html.replace('<div id="v6-entry-results">',v8SortUI('applications',V8_APP_KEYS)+'<div id="v6-entry-results">');};
const V8_prevCredentialsSection=v6CredentialsSection;
v6CredentialsSection=function(){let html=V8_prevCredentialsSection();return html.replace('<div class="tablewrap">',v8SortUI('credentials',V8_CRED_KEYS)+'<div class="tablewrap">');};
const V8_prevExamScreen=renderExams;
renderExams=function(){let h=V8_prevExamScreen();return h.replace('<div class="v4-exam-list">',v8SortUI('exam',[['date','試験日'],['grade','学年'],['name','生徒名'],['subject','教科'],['score','得点']])+'<div class="v4-exam-list">');};

// 生徒ごとに受検級を別々に入力して一括受付。共通級は選択済みの生徒へワンタッチ適用。
function v8BulkEvent(){return v6Event(v6ui.bulkEvent||v6RoomEvents()[0]?.id);}
function v8BulkLevel(sid,e=v8BulkEvent()){if(!e)return '';return v8Prefs.bulkLevels[e.id+'::'+sid]??v6ui.bulkLevel??'';}
function v8SetBulkLevel(sid,level,el){let e=v8BulkEvent();if(!e)return;v8Prefs.bulkLevels[e.id+'::'+sid]=level;if(level){v6ui.bulkSelected.add(sid);let ck=el?.closest('tr')?.querySelector('input[type=checkbox]');if(ck)ck.checked=true;}v8SavePrefs();let badge=document.getElementById('v8-bulk-count');if(badge)badge.textContent='選択 '+v6ui.bulkSelected.size+'名';let box=document.getElementById('v8-bulk-warning');if(box)box.textContent='生徒別の級を指定してから、選択した生徒を一括登録できます。';}
function v8ApplyCommonLevel(){let e=v8BulkEvent(),level=document.getElementById('v6-bulk-level')?.value||v6ui.bulkLevel;if(!e||!level){toast('先に共通の受検級を選んでください');return;}v6ui.bulkLevel=level;v6ui.bulkSelected.forEach(id=>v8Prefs.bulkLevels[e.id+'::'+id]=level);v8SavePrefs();v6RefreshBulk();toast('選択中の'+v6ui.bulkSelected.size+'名へ「'+level+'」を反映しました。個別変更もできます。');}
const V8_prevBulkSection=v6BulkSection;
v6BulkSection=function(){let h=V8_prevBulkSection();h=h.replace('一括で受検級・受付状態を設定できます。','生徒ごとに受検級を指定できます。共通級のまとめ適用も可能です。');h=h.replace(/<span class="badge green">選択 \d+名<\/span>/,'');h=h.replace('<div class="row mb"><button class="btn small" onclick="v6BulkCheckVisible(true)">',`<div class="row" style="gap:8px;margin:0 0 10px"><button class="btn small" onclick="v8ApplyCommonLevel()">選択者に共通の級を反映</button><span id="v8-bulk-count" class="badge green">選択 ${v6ui.bulkSelected.size}名</span></div>${v8SortUI('bulk',V8_BULK_KEYS)}<div class="row mb"><button class="btn small" onclick="v6BulkCheckVisible(true)">`);h=h.replace('<p class="tiny muted mt">すでに同じ実施回に申込済みの生徒は重複登録しません。</p>',`<p id="v8-bulk-warning" class="tiny muted mt">受検級は行ごとに指定可能。共通級を適用後、必要な生徒だけ変更できます。申込済みの生徒は重複登録しません。</p>`);return h;};
v6BulkTable=function(ss,registered){let e=v8BulkEvent(),rows=v8SortStudents(ss,'bulk'),test=e?.type==='検定';return `<div class="tablewrap"><table class="v8-bulk-table"><thead><tr><th>選択</th><th>生徒名</th><th>学年・番号</th><th>受検級（個別）</th><th>申込状況</th></tr></thead><tbody>${rows.map(s=>{let done=registered.has(s.id),level=v8BulkLevel(s.id,e);return `<tr><td><input type="checkbox" aria-label="${esc(s.name)}を選ぶ" ${v6ui.bulkSelected.has(s.id)?'checked':''} ${done?'disabled':''} onchange="v6BulkToggle('${s.id}',this.checked);v8SavePrefs();v8UpdateBulkCount()"></td><td><b>${esc(s.name)}</b></td><td>${esc(s.grade)} <span class="small muted">${esc(s.code)}</span></td><td>${test?`<select aria-label="${esc(s.name)}の受検級" ${done?'disabled':''} onchange="v8SetBulkLevel('${s.id}',this.value,this)">${v6LevelOptions(e.category,level)}</select>`:'<span class="small muted">級設定なし（模試）</span>'}</td><td>${done?v6SmallBadge('申込登録済み'):'未登録'}</td></tr>`}).join('')||'<tr><td colspan="5">条件に合う生徒はいません。</td></tr>'}</tbody></table></div>`;};
const V8_prevBulkToggle=v6BulkToggle;
v6BulkToggle=function(sid,on){V8_prevBulkToggle(sid,on);v8SavePrefs();v8UpdateBulkCount();};
const V8_prevBulkCheck=v6BulkCheckVisible;
v6BulkCheckVisible=function(on){V8_prevBulkCheck(on);v8SavePrefs();};
function v8UpdateBulkCount(){let b=document.getElementById('v8-bulk-count');if(b)b.textContent='選択 '+v6ui.bulkSelected.size+'名';}
const V8_prevBulkRefresh=v6RefreshBulk;
v6RefreshBulk=function(){V8_prevBulkRefresh();v8UpdateBulkCount();};
v6BulkSave=function(){let e=v8BulkEvent();if(!e){toast('実施回を選択してください');return;}if(e.room!=='両教室'&&e.room!==currentRoom()){toast('別教室の実施回には申し込めません');return;}let selected=[...v6ui.bulkSelected].filter(sid=>isSameRoom(sid)&&!db.qualEntries.some(r=>r.eventId===e.id&&r.studentId===sid&&r.application!=='取消'));if(!selected.length){toast('申込する生徒を選択してください');return;}let notSet=selected.filter(id=>e.type==='検定'&&!v8BulkLevel(id,e));if(notSet.length){toast('級未設定が'+notSet.length+'名います。生徒ごとに受検級を選んでください');return;}let count=0;selected.forEach(sid=>{let level=e.type==='検定'?v8BulkLevel(sid,e):'';db.qualEntries.push({id:uid('qen'),eventId:e.id,studentId:sid,level,applyAt:TODAY,application:'受付済み',attendance:'未実施',result:'未発表',score:'',billing:'未請求',returnedAt:'',memo:'生徒別級で一括登録',source:'一括登録（個別受検級）',updatedAt:now()});count++;});v6AuditChange('受験申込・一括','','生徒別受検級で一括受付','—',selected.map(id=>safeStudent(id).name+' '+v8BulkLevel(id,e)).join('、'));persist();v6ui.bulkSelected.clear();v8SavePrefs();v6ui.tab='applications';v6ui.event=e.id;render();toast(count+'名をそれぞれ指定した受検級で申込登録しました');};

// 学年ごとにページを切り替えるA4のCode39バーコード印刷。順序は選択中の昇降順に従う。
const V8_prevBarcodePrint=printBarcodes;
printBarcodes=function(ids){if(v8Prefs.barcodeMode!=='grade')return V8_prevBarcodePrint(ids);let ss=ids.map(safeStudent).filter(s=>s&&s.school===currentRoom());if(!ss.length){toast('印刷対象の生徒がいません');return;}let groups=new Map();ss.forEach(s=>{if(!groups.has(s.grade))groups.set(s.grade,[]);groups.get(s.grade).push(s);});let ordered=[...groups.keys()].sort((a,b)=>(GRADES.indexOf(a)-GRADES.indexOf(b))*(extra.barcodeSort?.primary==='grade'&&extra.barcodeSort?.primaryDir==='desc'?-1:1));let pages=[];for(const grade of ordered){let group=groups.get(grade);for(let i=0;i<group.length;i+=21){let subset=group.slice(i,i+21);pages.push(`<section class="report-page scan-label-page v8-barcode-grade"><div class="row between mb"><div><h2>バーコードラベル　<span class="v8-grade-title">${esc(grade)}</span></h2><span class="tiny muted">${esc(currentRoom())} ／ 全${group.length}名 ／ ${Math.floor(i/21)+1}ページ目</span></div><span class="small muted">${partDate(TODAY)}</span></div><div class="scan-label-grid">${subset.map(s=>`<div class="scan-label"><div class="scan-small"><span>${esc(s.grade)}</span><span>${esc(s.school)}</span></div><div class="scan-student">${esc(s.name)}</div>${barcodeSVG(s.code,true)}<div class="scan-code">${esc(s.code)}</div></div>`).join('')}</div></section>`);}}document.getElementById('print-root').innerHTML=pages.join('');window.print();};
const V8_prevSortedBarcode=sortedBarcodeStudents;
sortedBarcodeStudents=function(){let ss=V8_prevSortedBarcode();return v8Prefs.barcodeGrade&&v8Prefs.barcodeGrade!=='all'?ss.filter(x=>x.grade===v8Prefs.barcodeGrade):ss;};
const V8_prevBarcodePanel=barcodePrintPanel;
barcodePrintPanel=function(){return V8_prevBarcodePanel().replace('<button class="btn primary" onclick="printBarcodes(sortedBarcodeStudents().map(s=>s.id))">',`<label class="field">A4の印刷方法<select onchange="v8Prefs.barcodeMode=this.value;v8SavePrefs();render()">${option('grade','学年ごとにA4改ページ',v8Prefs.barcodeMode)}${option('standard','通常のラベル連続印刷',v8Prefs.barcodeMode)}</select></label><label class="field">印刷する学年<select onchange="v8Prefs.barcodeGrade=this.value;v8SavePrefs();render()">${option('all','全学年',v8Prefs.barcodeGrade)}${GRADES.map(g=>option(g,g,v8Prefs.barcodeGrade)).join('')}</select></label><button class="btn primary" onclick="printBarcodes(sortedBarcodeStudents().map(s=>s.id))">`);};

// 直近の授業：生徒マスターの受講教科に縛られず、全教科から絞り込める。
function v8RecentLessons(){if(state.page!=='profile')return;let section=[...document.querySelectorAll('#content section.card')].find(s=>s.querySelector('h2')?.textContent.includes('直近の授業を'));if(!section)return;let sid=state.student;let subs=[...new Set(db.lessons.filter(l=>l.student===sid).map(l=>l.subject))].sort(v8Collate);let sel=v8Prefs.recentSubject;if(sel&&!subs.includes(sel))sel='';let existing=section.querySelector('.v8-recent-tools');if(existing)existing.remove();let cards=[...section.querySelectorAll('article.lesson')];cards.forEach(c=>c.remove());let block=document.createElement('div');block.className='v8-recent-tools';block.innerHTML=`<label class="field">直近の授業を教科で絞る<select aria-label="直近授業の教科" onchange="v8Prefs.recentSubject=this.value;v8SavePrefs();v8RecentLessons()">${option('','すべての教科',sel)}${subs.map(s=>option(s,s,sel)).join('')}</select></label>`;section.querySelector('.section-title')?.insertAdjacentElement('afterend',block);let ls=records(sid,{subject:sel,sort:'desc'}).slice(0,5);block.insertAdjacentHTML('afterend',`<div class="v8-recent-records">${ls.length?ls.map(l=>lessonCard(l)).join(''):'<div class="empty">該当する授業がありません。</div>'}</div>`);let old=section.querySelectorAll('.v8-recent-records');if(old.length>1)old[old.length-1].remove();}

// 授業一覧と個別・選択・一括提出：7コマと「全コマ」。入力途中の下書きも確認。
state.daily.from=state.daily.from||'2026-11-17';state.daily.to=state.daily.to||'2026-11-17';
function v8DraftHasContent(d){return !!(String(d.unit||d.obs||d.next||d.plan||d.homework||d.handoverText||'').trim()||(d.materials||[]).some(m=>m.name||m.pages)||(d.homeworkItems||[]).some(h=>h.name||h.pages));}
function v8DailyItems(){let f=state.daily,rows=new Map();let room=currentRoom();for(let l of db.lessons){if(!isSameRoom(l.student))continue;rows.set('lesson:'+l.id,{id:'lesson:'+l.id,d:l,kind:'lesson',key:'',status:l.status||'下書き'});}for(let [k,d] of Object.entries(db.deskDrafts||{})){if(!d||!isSameRoom(d.student)||!d._dirty||!v8DraftHasContent(d))continue;let old=d.id?db.lessons.find(x=>x.id===d.id):null;let key=old?'lesson:'+old.id:'draft:'+k;rows.set(key,{id:key,d,kind:'draft',key:k,status:'入力途中'});}let result=[...rows.values()].filter(({d})=>(!f.from||d.date>=f.from)&&(!f.to||d.date<=f.to)&&(!f.student||d.student===f.student)&&(!f.teacher||d.teacher===f.teacher)&&(!f.subject||d.subject===f.subject)&&(!f.status||(f.status==='下書き'?['下書き','入力途中'].includes(d._dirty?'入力途中':d.status):f.status=== (d._dirty?'入力途中':d.status)))&&(v8Prefs.dailySlot==='all'||d.slot===v8Prefs.dailySlot));let sort=f.sort||'date';result.sort((a,b)=>{const x=a.d,y=b.d;let c=sort==='teacher'?v8Collate(x.teacher,y.teacher):sort==='subject'?v8Collate(x.subject,y.subject):sort==='student'?v8Collate(student(x.student)?.name,student(y.student)?.name):0;return c||(v8Prefs.dailyDir==='asc'?a.d.date.localeCompare(b.d.date):b.d.date.localeCompare(a.d.date))||(v8Prefs.dailyDir==='asc'?V8_SLOTS.indexOf(x.slot)-V8_SLOTS.indexOf(y.slot):V8_SLOTS.indexOf(y.slot)-V8_SLOTS.indexOf(x.slot))||v8Collate(student(x.student)?.kana,student(y.student)?.kana);});return result;}
function v8CanSend(data){let d=data.d;if(!['下書き','入力途中'].includes(data.status))return false;let home=currentHomework(d);return !!String(d.unit||'').trim()&&!!String(d.obs||'').trim()&&!!String(d.next||'').trim()&&!!home;}
function v8JsArg(x){return esc(JSON.stringify(String(x)));}
function v8DailyItemCard(item){let l=item.d,s=safeStudent(l.student),able=v8CanSend(item),select=v8SelectedDaily.has(item.id);return `<article class="v8-daily-card" data-daily-id="${esc(item.id)}"><div class="v8-daily-head"><div class="row" style="gap:7px"><label class="v8-check"><input type="checkbox" aria-label="${esc(s.name)}の報告を選択" ${select?'checked':''} ${!able?'disabled':''} onchange="v8ToggleDaily('${esc(item.id)}',this.checked)"></label><b>${esc(s.name)}</b><span class="badge blue">${esc(s.grade)}</span><span class="badge">${esc(l.subject)}</span><span class="tiny muted">${esc(l.teacher)}</span><span class="tiny muted">${fmt(l.date)} ${esc(l.slot)}コマ</span></div><div class="row">${statusBadge(item.status)}${able?`<button class="btn small primary" onclick="v8SubmitSelected(['${esc(item.id)}'])">この生徒だけ提出</button>`:''}${item.kind==='lesson'?`<button class="btn small" onclick="reviewLesson('${l.id}')">詳細・確認</button>`:`<button class="btn small" onclick="v8OpenDraft(${v8JsArg(item.key)})">続きを入力</button>`}</div></div><div class="v8-daily-body"><div><strong>教材・単元</strong><div>${esc(l.unit||'未入力')}</div><p class="muted tiny preline">${esc(materialsText(l))}</p></div><div><strong>できたこと・授業の様子</strong><p class="preline">${esc(l.obs||'未入力')}</p></div><div><strong>次回の指導</strong><p class="preline">${esc(l.next||'未入力')}</p></div><div><strong>宿題・申し送り</strong><p class="preline">宿題：${esc(hwText(l)||'未入力')}${l.handoverText?'\n申し送り：'+esc(l.handoverText):''}</p></div></div>${!able&&['下書き','入力途中'].includes(item.status)?'<p class="v8-incomplete">未入力項目があるため提出不可です（学習内容・所見・次回・宿題を確認）</p>':''}</article>`;}
function v8ToggleDaily(id,on){if(on)v8SelectedDaily.add(id);else v8SelectedDaily.delete(id);v8SavePrefs();let el=document.getElementById('v8-selected-count');if(el)el.textContent=v8SelectedDaily.size+'件選択';}
function v8DailySetSlot(v){v8Prefs.dailySlot=v;v8Prefs.dailyLimit=40;v8SavePrefs();render()}
function v8DailyMore(){v8Prefs.dailyLimit+=40;v8SavePrefs();render();}
function v8DailyGroupHTML(items){if(!items.length)return '<div class="empty">条件に該当する授業はありません。日付・コマを変更してください。</div>';
 if(v8Prefs.dailySlot==='all'){
  const dates=[...new Set(items.map(x=>x.d.date))].sort((a,b)=>v8Prefs.dailyDir==='asc'?a.localeCompare(b):b.localeCompare(a));
  const maxDays=Math.max(1,Math.floor((v8Prefs.dailyLimit||40)/8));
  let result=dates.slice(0,maxDays).map(date=>`<div class="v8-day-divider"><b>${fmt(date)}｜全コマ一覧</b><span>${items.filter(r=>r.d.date===date).length}件</span></div>`+V8_SLOTS.map(slot=>{
   let arr=items.filter(x=>x.d.date===date&&x.d.slot===slot),visible=arr.slice(0,8);
   return `<section class="v8-time-group"><div class="v8-time-head"><b>${slot}コマ</b><span>${arr.length}名 ${arr.length>8?'（うち8名を表示）':''}</span></div>${visible.length?visible.map(v8DailyItemCard).join(''):'<div class="v8-empty-slot">このコマの授業記録はありません</div>'}${arr.length>8?`<button class="btn small v8-slot-more" onclick="v8DailySetSlot('${slot}')">${slot}コマの${arr.length}名をすべて見る</button>`:''}</section>`;
  }).join('')).join('');
  if(dates.length>maxDays)result+=`<div class="row" style="justify-content:center;padding:14px"><button class="btn" onclick="v8DailyMore()">さらに過去の日付を表示（残り${dates.length-maxDays}日）</button></div>`;
  return result;
 }
 let limit=v8Prefs.dailyLimit||40,part=items.slice(0,limit),groups=new Map();for(let item of part){let key=item.d.date+' / '+item.d.slot+'コマ';if(!groups.has(key))groups.set(key,[]);groups.get(key).push(item);}
 let html=[...groups].map(([key,ls])=>`<section class="v8-time-group"><div class="v8-time-head"><b>${esc(key)}</b><span>${ls.length}名表示</span></div>${ls.map(v8DailyItemCard).join('')}</section>`).join('');return html+(items.length>part.length?`<div class="row" style="justify-content:center;padding:14px"><button class="btn" onclick="v8DailyMore()">さらに40件表示（残り${items.length-part.length}件）</button></div>`:'');}
function v8OpenDraft(key){let draft=db.deskDrafts[key];if(!draft)return;state.student=draft.student;state.subject=draft.subject;extra.modalKey=key;extra.modalDraft=draft;let s=safeStudent(draft.student);modal(`授業の続きを入力｜${s.name}`,`<div class="notice info mb">${esc(s.name)} ／ ${esc(draft.subject)} ／ ${fmt(draft.date)} ${esc(draft.slot)}コマ　入力途中はこの端末に保存済みです。</div>${renderPrevious(draft,prevLesson(draft),'modal')}<div id="modal-entry-host">${renderEntry(draft,'modal')}</div>`);}
function v8SubmitDraft(item){let d=item.d,valid=v8CanSend(item);if(!valid)return false;let c=d.correct,t=d.total;if((c==null)!==(t==null)||(c!=null&&(!Number.isInteger(c)||!Number.isInteger(t)||c<0||t<1||c>t)))return false;let mat=asMaterials(d);if(mat.some(m=>!String(m.name||'').trim()&&(m.pages||m.content||m.homework)))return false;let hw=asHomeworkItems(d);if(hw.some(h=>!String(h.name||'').trim()&&(h.unit||h.pages||h.instruction)))return false;let old=d.id?db.lessons.find(x=>x.id===d.id):db.lessons.find(x=>x.student===d.student&&x.subject===d.subject&&x.date===d.date&&x.slot===d.slot&&x.teacher===d.teacher);let mats=mat.filter(x=>String(x.name||'').trim()).map(x=>({...x,name:String(x.name).trim()}));let itemRecord={...clone(d),id:old?.id||uid('lesson'),materials:mats,unit:String(d.unit||'').trim(),obs:String(d.obs||'').trim(),next:String(d.next||'').trim(),homework:currentHomework(d),homeworkNote:String(d.homework||'').trim(),material:mats.map(m=>m.name).join('／'),pages:mats.map(m=>m.pages).filter(Boolean).join('／'),status:'報告済み',createdAt:old?.createdAt||now(),updatedAt:now()};delete itemRecord._dirty;delete itemRecord._draftAt;delete itemRecord.reviewedAt;delete itemRecord.reviewedBy;syncLessonHandover(d,itemRecord);audit('授業記録',d.student,d.subject,old?'授業記録を更新・報告':'授業記録を作成・報告',old?lessonText(old):'新規',lessonText(itemRecord));if(old)db.lessons[db.lessons.indexOf(old)]=itemRecord;else db.lessons.push(itemRecord);let fresh=draftFrom(itemRecord);fresh.homework=itemRecord.homeworkNote;db.deskDrafts[item.key]=fresh;return true;}
function v8SubmitSelected(ids,allFlag=false){captureVisibleEditors();let all=v8DailyItems(),selected=new Set(ids),targets=all.filter(r=>allFlag||selected.has(r.id));let success=0,skipped=0;targets.forEach(r=>{if(!v8CanSend(r)){skipped++;return;}if(r.kind==='draft'){if(v8SubmitDraft(r))success++;else skipped++;}else if(r.d.status==='下書き'){audit('授業報告',r.d.student,r.d.subject,'教室長へ提出','下書き','報告済み');r.d.status='報告済み';r.d.updatedAt=now();r.d.reviewedAt=null;r.d.reviewedBy=null;success++;}else skipped++;v8SelectedDaily.delete(r.id);});persist();v8SavePrefs();render();toast(success+'件を教室長への確認待ちに変更しました'+(skipped?' ／ '+skipped+'件は未入力または対象外のためスキップ':''));}
function v8SubmitDailyChecked(){if(!v8SelectedDaily.size){toast('先に提出する授業を選択してください');return;}v8SubmitSelected([...v8SelectedDaily]);}
function v8SubmitDailyAll(){let eligible=v8DailyItems().filter(v8CanSend);if(!eligible.length){toast('提出可能な下書きがありません');return;}if(!confirm('表示条件に該当する提出可能な'+eligible.length+'件をまとめて提出しますか？'))return;v8SubmitSelected(eligible.map(x=>x.id));}
function v8DailySelectDisplayed(on){let ids=v8DailyItems().filter(v8CanSend).map(x=>x.id);if(on)ids.forEach(x=>v8SelectedDaily.add(x));else ids.forEach(x=>v8SelectedDaily.delete(x));v8SavePrefs();render();}
renderDaily=function(){let f=state.daily,items=goodRange(f.from,f.to)?v8DailyItems():[],eligible=items.filter(v8CanSend),reported=items.filter(x=>x.status==='報告済み'),slotCount=slot=>items.filter(x=>x.d.slot===slot).length;return head('授業報告・提出','X〜Dコマを一度に見渡し、1件ずつ・選択した授業・条件に合う全授業を提出できます。',`<button class="btn" onclick="navigate('desk')">授業準備で入力する</button>`)+`<div class="notice info mb"><b>報告の流れ：</b>下書き保存 → 講師が提出（報告済み） → 教室長が確認済みに変更。終業時の口頭報告は継続します。<br><span class="tiny">提出済み・確認済みは再提出しません。まだ保存ボタンを押していない入力途中も対象に表示します。</span></div><div class="card v8-daily-filter"><div class="toolbar"><label class="field">開始日<input type="date" value="${f.from}" onchange="setDaily('from',this.value)"></label><label class="field">終了日<input type="date" value="${f.to}" onchange="setDaily('to',this.value)"></label><label class="field">講師<select onchange="setDaily('teacher',this.value)">${teacherOptions(f.teacher)}</select></label><label class="field">教科<select onchange="setDaily('subject',this.value)">${subjOptions(f.subject)}</select></label><label class="field">報告の状態<select onchange="setDaily('status',this.value)">${option('','すべて',f.status)}${['入力途中','下書き','報告済み','確認済み'].map(x=>option(x,x,f.status)).join('')}</select></label><label class="field">並べ方<select onchange="setDaily('sort',this.value)">${[['date','日付・コマ順'],['teacher','講師別'],['student','生徒別'],['subject','教科別']].map(([v,t])=>option(v,t,f.sort)).join('')}</select></label><label class="field">並び順<select onchange="v8Prefs.dailyDir=this.value;v8SavePrefs();render()">${option('desc','降順 ↓',v8Prefs.dailyDir)}${option('asc','昇順 ↑',v8Prefs.dailyDir)}</select></label></div><div class="row between"><div class="row"><button class="btn small" onclick="openStudentPicker('daily')">${f.student?esc(student(f.student).name):'生徒を検索・絞り込み'}</button>${f.student?'<button class="btn text small" onclick="state.daily.student=\'\';render()">生徒指定を解除</button>':''}</div><div class="row"><button class="btn small" onclick="state.daily.from='2026-11-17';state.daily.to='2026-11-17';render()">サンプル 11/17</button><button class="btn small" onclick="state.daily.from='';state.daily.to='';render()">全期間</button></div></div><div class="v8-slot-tabs"><button class="${v8Prefs.dailySlot==='all'?'active':''}" onclick="v8DailySetSlot('all')">全コマ <small>XYZABCD</small></button>${V8_SLOTS.map(x=>`<button class="${v8Prefs.dailySlot===x?'active':''}" onclick="v8DailySetSlot('${x}')">${x} <small>コマ</small></button>`).join('')}</div></div><div class="metrics">${[['対象の記録',items.length],['提出可能な下書き',eligible.length],['教室長の確認待ち',reported.length],['確認済み',items.filter(x=>x.status==='確認済み').length]].map(([n,v])=>`<div class="metric"><small>${n}</small><div class="num">${v}<span>件</span></div></div>`).join('')}</div><div class="card v8-daily-actions"><div class="row between"><div><h2>授業履歴をまとめて確認</h2><span class="small muted">所見・教材・次回指導・宿題・申し送りを連続して表示。現在の条件：${items.length}件</span></div><div class="row"><span id="v8-selected-count" class="badge blue">${v8SelectedDaily.size}件選択</span><button class="btn small" onclick="v8DailySelectDisplayed(true)">提出可能な分をすべて選択</button><button class="btn small" onclick="v8DailySelectDisplayed(false)">選択解除</button><button class="btn primary" onclick="v8SubmitDailyChecked()">選んだ授業を提出</button><button class="btn primary" onclick="v8SubmitDailyAll()">表示条件の全件を一括提出</button></div></div></div><div class="v8-daily-entries">${goodRange(f.from,f.to)?v8DailyGroupHTML(items):'<div class="notice">開始日・終了日の順番を確認してください。</div>'}</div>`;};

// ユーザー操作を、画面遷移・ブラウザバック・リロード後も復元する。
const v8FormDrafts=v8Read(V8_FORM_KEY);
let v8CurrentModalKey='';
function v8ModalKey(){let d=document.getElementById('modal');let form=d?.querySelector('form:not([data-editor])');if(!form)return '';let onclick=form.getAttribute('onsubmit')||'';let title=document.getElementById('modal-title')?.textContent||'';return currentRoom()+'|'+onclick+'|'+title;}
function v8FormSnapshot(form){return [...form.querySelectorAll('input,select,textarea')].filter(el=>el.type!=='file'&&el.type!=='password').map((el,i)=>({i,type:el.type,value:el.value,checked:el.checked}));}
function v8SaveModal(){let d=document.getElementById('modal'),form=d?.querySelector('form:not([data-editor])');if(!form)return;let key=v8ModalKey();if(!key)return;v8CurrentModalKey=key;v8FormDrafts[key]={at:now(),fields:v8FormSnapshot(form),exam:form.id==='v4-exam-form'?(v4ReadExamForm(),clone(v4ExamDraft)):null};v8Write(V8_FORM_KEY,v8FormDrafts);}
function v8RestoreModal(){let d=document.getElementById('modal'),form=d?.querySelector('form:not([data-editor])');if(!form)return;let key=v8ModalKey();v8CurrentModalKey=key;let saved=v8FormDrafts[key];if(!saved)return;if(form.id==='v4-exam-form'&&saved.exam?.subjects){v4ExamDraft=clone(saved.exam);let rows=document.getElementById('v4-exam-rows');if(rows)rows.innerHTML=v4ExamDraft.subjects.map(v4ExamRowHtml).join('');}let elements=[...form.querySelectorAll('input,select,textarea')].filter(el=>el.type!=='file'&&el.type!=='password');(saved.fields||[]).forEach(s=>{let el=elements[s.i];if(!el)return; if(['checkbox','radio'].includes(el.type))el.checked=!!s.checked;else el.value=s.value;});let mark=document.createElement('div');mark.className='v8-restored';mark.textContent='前回の入力途中をこの端末から復元しました（未提出）';form.prepend(mark);}
const V8_prevModal=modal;
modal=function(title,body){V8_prevModal(title,body);v8RestoreModal();};
document.addEventListener('input',e=>{if(e.target.closest('#modal form:not([data-editor])'))v8SaveModal();});
document.addEventListener('change',e=>{if(e.target.closest('#modal form:not([data-editor])'))v8SaveModal();});
document.addEventListener('submit',e=>{let form=e.target;if(!form.matches('#modal form:not([data-editor])'))return;let key=v8ModalKey();queueMicrotask(()=>{if(!document.getElementById('modal')?.open&&key){delete v8FormDrafts[key];v8Write(V8_FORM_KEY,v8FormDrafts);}});});
function v8SaveReportEdits(){v8Write('llld_manabi_v9_reports',{edits:state.report.edits,from:state.report.from,to:state.report.to,subject:state.report.subject,students:state.report.students,termMode:state.report.termMode,fontSize:state.report.fontSize,termDensity:state.report.termDensity,chartMode:state.report.chartMode,type:state.report.type,manualSubject:state.report.manualSubject});}
const V8_prevTermEdit=changeTermField;
changeTermField=function(...args){V8_prevTermEdit(...args);v8SaveReportEdits();};
const V8_prevTermStyle=setTermStyle;
setTermStyle=function(...args){V8_prevTermStyle(...args);v8SaveReportEdits();};
const V8_prevEditReport=editReport;
editReport=function(...args){V8_prevEditReport(...args);v8SaveReportEdits();};
const V8_prevSetReport=setReport;
setReport=function(...args){V8_prevSetReport(...args);v8SaveReportEdits();};
const V8_prevTermMode=v4SetTermMode;
v4SetTermMode=function(...args){V8_prevTermMode(...args);v8SaveReportEdits();};
const v8SavedReport=v8Read('llld_manabi_v9_reports');
if(v8SavedReport.edits&&typeof v8SavedReport.edits==='object'){Object.assign(state.report,{...v8SavedReport,confirmed:false});}
function v8SaveView(){let v={page:state.page,student:state.student,subject:state.subject,history:state.history,daily:state.daily,roster:extra.roster,masterTab:extra.masterTab,qual:{tab:v6ui.tab,event:v6ui.event,type:v6ui.type,status:v6ui.status,grade:v6ui.grade},activeRoom:currentRoom(),selectedReportStudents:state.report.students,examFilters:extra.examFilters,report:state.report?.type};v8Write('llld_manabi_v9_view',v);}
const v8SavedView=v8Read('llld_manabi_v9_view');
if(v8SavedView.activeRoom&&CLASSROOMS.includes(v8SavedView.activeRoom)&&db.activeRoom!==v8SavedView.activeRoom){db.activeRoom=v8SavedView.activeRoom;extra.roster.classroom=db.activeRoom;updateActorChoices();makeRoomSwitch();}
if(v8SavedView.student&&isSameRoom(v8SavedView.student))state.student=v8SavedView.student;
if(v8SavedView.subject)state.subject=v8SavedView.subject;
if(v8SavedView.history)Object.assign(state.history,v8SavedView.history);if(v8SavedView.roster)Object.assign(extra.roster,v8SavedView.roster);if(v8SavedView.masterTab)extra.masterTab=v8SavedView.masterTab;if(v8SavedView.qual)Object.assign(v6ui,v8SavedView.qual);
if(v8SavedView.daily)Object.assign(state.daily,v8SavedView.daily);
if(v8SavedView.examFilters)Object.assign(extra.examFilters,v8SavedView.examFilters);
const v8AllowedPages=new Set(['home','desk','roster','profile','history','daily','notes','reports','master','exams','qualifications','audit','settings','catalog']);
let v8RequestedPage=decodeURIComponent(location.hash.slice(1)||'');if(!v8AllowedPages.has(v8RequestedPage))v8RequestedPage=v8SavedView.page;
if(v8AllowedPages.has(v8RequestedPage))state.page=v8RequestedPage;
let v8Rendering=false;
const V8_prevRender=render;
render=function(){if(v8Rendering)return;v8Rendering=true;try{if(document.querySelector('#content form[data-editor]'))captureVisibleEditors();V8_prevRender();let label=document.querySelector('#nav button[onclick="navigate(\'daily\')"] .navname');if(label)label.textContent='授業報告・提出';if(state.page==='profile')v8RecentLessons();if(state.page==='master'&&extra.masterTab==='teachers')v8DOMSort(document.querySelector('.master-table'),'teachers',{name:0,role:1,room:2,status:3});if(state.page==='master'&&extra.masterTab==='books')v8DOMSort(document.querySelector('.master-table'),'books',{name:0,grade:2,subject:1});if(state.page==='qualifications'&&v6ui.tab==='credentials')v8DOMSort(document.querySelector('#content table'),'credentials',{name:0,grade:1,category:2,level:3,acquiredAt:4});if(state.page==='exams')v8DOMSort(document.querySelector('.v4-exam-list table'),'exam',{date:0,name:1,subject:2,score:3,grade:1});v8SaveView();}finally{v8Rendering=false}};
const V8_prevNavigate=navigate;
navigate=function(p){if(!v8AllowedPages.has(p))return;if(state.page===p){render();return;}if(document.querySelector('#content form[data-editor]'))captureVisibleEditors();V8_prevNavigate(p);try{history.pushState({v8Page:p},'', '#'+encodeURIComponent(p));}catch(err){location.hash=encodeURIComponent(p);}v8SaveView();};
try{history.replaceState({v8Page:state.page},'', '#'+encodeURIComponent(state.page));}catch(e){}
window.addEventListener('popstate',e=>{let p=e.state?.v8Page||decodeURIComponent(location.hash.slice(1));if(!v8AllowedPages.has(p)||p===state.page)return;captureVisibleEditors();state.page=p;render();window.scrollTo(0,0);});
window.addEventListener('pagehide',()=>{captureVisibleEditors();v8SaveView();v8SaveReportEdits();v8SavePrefs();});
function v8AfterRenderLabel(){let txt=document.getElementById('draft-state-ws0');if(txt&&storageOK&&txt.textContent.includes('自動保存'))txt.textContent='入力するたびに端末へ自動保存されます';}
// 画面内でブラウザの「戻る」を押してもデモデータの操作状態を復元。
document.title='学びのスキルカルテ v8｜授業提出・受検級別一括申込・自動保存';
const v8Footer=document.querySelector('.sidebar-foot .tiny.muted');if(v8Footer)v8Footer.textContent='電子学プロ / Prototype 0.8';
render();

/* ================= v9: review & usability improvements ================= */
const V9_STORAGE_KEY='llld_manabi_v9_controls';
const v9Ui=(()=>{try{return {...{dailyMode:'table'},...JSON.parse(DebugStorage.getItem(V9_STORAGE_KEY)||'{}')}}catch(e){return {dailyMode:'table'}}})();
function v9SaveUI(){try{DebugStorage.setItem(V9_STORAGE_KEY,JSON.stringify(v9Ui))}catch(e){}}
// Prior versions used a separate administrative review step. Migrate its confirmed
// records to the simpler two-state reporting model; retain every record and audit entry.
let v9Migrated=0;
for(const lesson of db.lessons||[]){if(lesson.status==='確認済み'){lesson.status='報告済み';v9Migrated++}else if(!lesson.status)lesson.status='下書き';}
for(const draft of Object.values(db.deskDrafts||{})){if(draft?.status==='確認済み')draft.status='報告済み';}
if(v9Migrated)persist();
function v9Reported(status){return status==='報告済み'||status==='確認済み';}
function v9Label(status){return v9Reported(status)?'報告済み':'未報告';}
statusBadge=function(status){return `<span class="badge ${v9Reported(status)?'green':'amber'}">${v9Label(status)}</span>`};
// Preserve v8's already-tested draft submission validation but rename visible
// completion, and accept the new "未報告" combined filter.
const V9_priorDailyItems=v8DailyItems;
v8DailyItems=function(){let f=state.daily,old=f.status;if(old==='未報告')f.status='下書き';if(old==='確認済み')f.status='報告済み';try{return V9_priorDailyItems();}finally{f.status=old;}};
const V9_priorSubmitSelected=v8SubmitSelected;
v8SubmitSelected=function(ids,all=false){let before=(db.lessons||[]).filter(l=>l.status==='報告済み').length;V9_priorSubmitSelected(ids,all);let after=(db.lessons||[]).filter(l=>l.status==='報告済み').length;toast(`${Math.max(0,after-before)}件を「報告済み」に変更しました。口頭報告はこれまでどおり継続してください。`);};
const V9_priorSubmitEntry=submitEntry;
submitEntry=function(token,intent){const before=db.lessons.filter(x=>x.status==='報告済み').length;const val=V9_priorSubmitEntry(token,intent);if(intent==='report'&&db.lessons.filter(x=>x.status==='報告済み').length>before)toast('授業記録を「報告済み」にしました。');return val;};

// Register more than one student without reopening the selection dialog.
const V9_priorChooseStudent=chooseStudent;
chooseStudent=function(id){let p=extra.picker,target=p?.target,s=safeStudent(id);if(!s)return;
 if(target==='desk'){
  if(!isSameRoom(id)){toast('現在の教室の生徒を選択してください。');return;}
  normalizeDesk();let existing=extra.desk.seats.findIndex(x=>x?.student===id);
  if(existing>=0){toast('この生徒は既に授業画面にいます。');return;}
  captureVisibleEditors();let i=p.seat;
  if(i==null){i=extra.desk.seats.findIndex(x=>!x);if(i<0)i=extra.desk.seats.length;}
  if(i>=extra.desk.seats.length){extra.desk.seats.push(null);extra.desk.collapsed.push(false);extra.scrolls.push(0);}
  extra.desk.seats[i]={student:id,subject:v6StudentSubjects(s)[0]||'数学'};
  extra.desk.collapsed[i]=false;extra.scrolls[i]=0;p.seat=null;rememberStudent(id);storeView();render();updatePickerResults();
  toast(`${s.name}さんを追加しました。続けて生徒を追加できます。`);return;
 }
 if(target==='report'){
  if(!isSameRoom(id)){toast('現在の教室の生徒を選択してください。');return;}
  if(!state.report.students.includes(id))state.report.students.push(id);
  state.report.confirmed=false;rememberStudent(id);v8SaveReportEdits();render();updatePickerResults();
  toast(`${s.name}さんを印刷対象に追加しました。続けて追加できます。`);return;
 }
 return V9_priorChooseStudent(id);
};
const V9_priorPicker=renderStudentPicker;
renderStudentPicker=function(initial=false){V9_priorPicker(initial);let p=extra.picker;
 if(!['desk','report'].includes(p?.target))return;
 const root=document.getElementById('picker-body');if(!root)return;
 const note=root.querySelector('.mini-note');
 if(note)note.textContent='名前・学年で絞って、必要な生徒を続けて追加できます。最後に「選択を終了」で閉じてください。';
 const bar=document.createElement('div');bar.className='v9-picker-bottom';bar.innerHTML=`<span class="small muted">追加後もこの画面を閉じずに続けて検索できます</span><button type="button" class="btn primary" onclick="closePicker()">選択を終了</button>`;
 root.appendChild(bar);
};
const V9_priorPickerResults=updatePickerResults;
updatePickerResults=function(){V9_priorPickerResults();const p=extra.picker;if(!['desk','report'].includes(p?.target))return;
 const label=document.querySelector('#picker-body .filter-result');
 if(label){const n=p.target==='desk'?extra.desk.seats.filter(Boolean).length:state.report.students.length;label.insertAdjacentHTML('beforeend',` <span class="badge green">現在 ${n}名選択</span>`);}
};

// Put one-tap history access adjacent to the pupil's name and show observations.
const V9_priorDeskSeat=renderDeskSeat;
renderDeskSeat=function(i){let html=V9_priorDeskSeat(i),seat=extra.desk.seats[i];if(!seat)return html;
 if(html.includes('is-collapsed'))return html;
 html=html.replace(/<div class="pupil">([\s\S]*?)<\/div>/,(_whole,name)=>`<div class="v9-name-history"><div class="pupil">${name}</div><button type="button" class="v9-history-shortcut" onclick="deskHistory(${i})" title="過去の授業記録を確認">過去の授業 ›</button></div>`);
 html=html.replace(`<button class="btn text small" onclick="deskHistory(${i})">過去の授業を確認 ›</button>`,'');
 return html;
};
const V9_priorDeskHistory=deskHistory;
deskHistory=function(i){captureVisibleEditors();V9_priorDeskHistory(i);};
const V9_priorRenderEntry=renderEntry;
renderEntry=function(d,token){let html=V9_priorRenderEntry(d,token);
 // It remains collapsible if the instructor wants more space, but is open by default.
 html=html.replace('<details class="compact-details">','<details class="compact-details v9-observations" open>');
 html=html.replace('保存して教室長に報告','入力完了・報告済みにする');
 html=html.replace(/今回の記録 ／ 入力はこの端末に自動保存/g,'今回の記録 ／ 入力はこの端末に自動保存（未報告）');
 html=html.replace(/入力途中をこの端末に保存済み ／ 報告前/g,'入力途中をこの端末に保存済み ／ 未報告');
 html=html.replace(/保存済みの授業記録：確認済み/g,'保存済みの授業記録：報告済み');
 html=html.replace(/保存済みの授業記録：下書き/g,'保存済みの授業記録：未報告');
 return html;
};
function v9RefreshRequired(root){if(!root)return;let missing=[];
 for(const [name,label] of [['unit','学習内容'],['obs','授業の様子'],['next','次回の指導内容']]){
  let el=root.querySelector(`[name="${name}"]`);if(!el)continue;
  const bad=!String(el.value||'').trim();el.classList.toggle('v9-required-empty',bad);el.setAttribute('aria-invalid',bad?'true':'false');
  el.closest('label.field')?.classList.toggle('v9-required-label',bad);if(bad)missing.push(label);
 }
 const home=root.querySelector('textarea[name="homework"]');
 const hasHomework=!!String(home?.value||'').trim()||[...root.querySelectorAll('[data-hw-index]')].some(row=>!!row.querySelector('[data-hw-field="name"]')?.value?.trim());
 const scope=root.querySelector('.hw-scope');if(scope)scope.classList.toggle('v9-home-missing',!hasHomework);
 if(!hasHomework)missing.push('今回の宿題');
 let notice=root.querySelector('.v9-missing-notice');if(!notice){notice=document.createElement('div');notice.className='v9-missing-notice';const top=root.querySelector('.draft-state');top?.insertAdjacentElement('afterend',notice);}
 if(notice){notice.classList.toggle('complete',missing.length===0);notice.textContent=missing.length?'未入力（報告前に確認）：'+missing.join('・'):'必須項目は入力済みです。報告済みへの変更ができます。';}
}
function v9RefreshAllRequired(){document.querySelectorAll('form[data-editor]').forEach(v9RefreshRequired)}
document.addEventListener('input',e=>{if(e.target.closest('form[data-editor]'))v9RefreshRequired(e.target.closest('form[data-editor]'));});
document.addEventListener('change',e=>{if(e.target.closest('form[data-editor]'))v9RefreshRequired(e.target.closest('form[data-editor]'));});
const V9_priorRefreshEditor=refreshEditor;
refreshEditor=function(token){V9_priorRefreshEditor(token);v9RefreshAllRequired();};

// Daily overview: two reported states, an actionable table and existing card option.
function v9DailyTableRow(it){const d=it.d,s=safeStudent(d.student),able=v8CanSend(it),selected=v8SelectedDaily.has(it.id);
 if(!s)return '';
 const action=able?`<button class="btn small primary" onclick='v8SubmitSelected([${JSON.stringify(it.id)}])'>報告済みにする</button>`:'';
 const inspect=it.kind==='lesson'?`<button class="btn small" onclick='reviewLesson(${JSON.stringify(d.id)})'>内容を確認</button>`:`<button class="btn small" onclick='v8OpenDraft(${JSON.stringify(it.key)})'>続きを入力</button>`;
 return `<tr data-v9-item="${esc(it.id)}"><td class="nowrap">${fmt(d.date)}<div class="subcell">${esc(d.slot)}コマ</div></td><td>${esc(d.teacher)}</td><td><b>${esc(s.name)}</b><div class="subcell">${esc(d.subject)}／${esc(s.grade)}</div></td><td>${esc(d.unit||'未入力')}<div class="subcell">教材 ${asMaterials(d).filter(x=>x.name?.trim()).length}件 ／ 到達度 ${d.level??'未評価'}</div></td><td>${esc((d.handoverText||'').slice(0,70)||'—')}</td><td>${statusBadge(it.status)}<div class="v9-table-actions"><label title="一括変更の対象に選択"><input type="checkbox" aria-label="${esc(s.name)}を選択" ${selected?'checked':''} ${!able?'disabled':''} onchange='v8ToggleDaily(${JSON.stringify(it.id)},this.checked)'></label>${action}${inspect}</div></td></tr>`;
}
function v9DailyTable(items){if(!items.length)return '<div class="empty">この条件の授業はありません。</div>';
 const limit=v8Prefs.dailyLimit||40,groups=new Map();
 if(v8Prefs.dailySlot==='all'){
  const dates=[...new Set(items.map(i=>i.d.date))].sort((a,b)=>v8Prefs.dailyDir==='asc'?a.localeCompare(b):b.localeCompare(a));
  let nDays=Math.max(1,Math.floor(limit/8));for(const day of dates.slice(0,nDays)){
   for(const slot of V8_SLOTS){let rows=items.filter(it=>it.d.date===day&&it.d.slot===slot);groups.set(`${fmt(day)}・${slot}コマ`,rows);}
  }
 }else{
  for(const it of items.slice(0,limit)){let k=`${fmt(it.d.date)}・${it.d.slot}コマ`;if(!groups.has(k))groups.set(k,[]);groups.get(k).push(it);}
 }
 let rows=[...groups].map(([title,group])=>`<tr class="v9-group-row"><td colspan="6"><b>${esc(title)}</b> <span class="tiny">${group.length}件</span></td></tr>${group.length?group.map(v9DailyTableRow).join(''):'<tr class="v9-empty-row"><td colspan="6">記録なし</td></tr>'}`).join('');
 const shown= [...groups.values()].reduce((n,a)=>n+a.length,0);
 return `<div class="tablewrap v9-daily-table-wrap"><table class="v9-daily-table"><thead><tr><th>日付・コマ</th><th>講師</th><th>生徒・学年・教科</th><th>授業内容</th><th>現在の申し送り</th><th>状態・操作</th></tr></thead><tbody>${rows}</tbody></table></div>${shown<items.length?`<div class="row" style="justify-content:center;padding:14px"><button class="btn" onclick="v8DailyMore()">さらに表示する（条件内 ${items.length}件）</button></div>`:''}`;
}
function v9DailyMode(mode){v9Ui.dailyMode=mode;v9SaveUI();render()}
renderDaily=function(){let f=state.daily,items=goodRange(f.from,f.to)?v8DailyItems():[],eligible=items.filter(v8CanSend),sent=items.filter(it=>v9Reported(it.status));
 let ct=items.length,unreported=ct-sent.length;
 return head('授業報告・提出','未報告・報告済みの2区分で管理。X〜Dコマを一覧表示し、個別・選択・一括で報告済みにできます。',`<button class="btn" onclick="navigate('desk')">授業準備で入力する</button>`)+
 `<div class="notice info mb"><b>報告の運用：</b>授業後に「報告済み」に変更し、これまでどおり教室長へ口頭でも報告します。追加の承認操作は不要です。<br><span class="tiny">このモックは端末内保存のみです。複数タブレットでの共有・同時編集は本番の共有DB・認証が必要です。</span></div>`+
 `<div class="card v8-daily-filter"><div class="toolbar"><label class="field">開始日<input type="date" value="${f.from}" onchange="setDaily('from',this.value)"></label><label class="field">終了日<input type="date" value="${f.to}" onchange="setDaily('to',this.value)"></label><label class="field">講師<select onchange="setDaily('teacher',this.value)">${teacherOptions(f.teacher)}</select></label><label class="field">教科<select onchange="setDaily('subject',this.value)">${subjOptions(f.subject)}</select></label><label class="field">報告の状態<select onchange="setDaily('status',this.value)">${option('','すべて',f.status)}${option('未報告','未報告',f.status)}${option('報告済み','報告済み',f.status)}</select></label><label class="field">並べ方<select onchange="setDaily('sort',this.value)">${[['date','日付・コマ順'],['teacher','講師別'],['student','生徒別'],['subject','教科別']].map(([v,t])=>option(v,t,f.sort)).join('')}</select></label><label class="field">並び順<select onchange="v8Prefs.dailyDir=this.value;v8SavePrefs();render()">${option('desc','降順 ↓',v8Prefs.dailyDir)}${option('asc','昇順 ↑',v8Prefs.dailyDir)}</select></label></div><div class="row between"><div class="row"><button class="btn small" onclick="openStudentPicker('daily')">${f.student?esc(student(f.student).name):'生徒を検索・絞り込み'}</button>${f.student?'<button class="btn text small" onclick="state.daily.student=\'\';render()">指定解除</button>':''}</div><div class="row"><button class="btn small" onclick="state.daily.from='2026-11-17';state.daily.to='2026-11-17';render()">サンプル 11/17</button><button class="btn small" onclick="state.daily.from='';state.daily.to='';render()">全期間</button></div></div><div class="v8-slot-tabs"><button class="${v8Prefs.dailySlot==='all'?'active':''}" onclick="v8DailySetSlot('all')">全コマ <small>XYZABCD</small></button>${V8_SLOTS.map(x=>`<button class="${v8Prefs.dailySlot===x?'active':''}" onclick="v8DailySetSlot('${x}')">${x} <small>コマ</small></button>`).join('')}</div></div>`+
 `<div class="metrics v9-metrics">${[['対象授業',ct],['未報告',unreported],['報告済み',sent.length],['今すぐ報告可能',eligible.length]].map(([name,value])=>`<div class="metric"><small>${name}</small><div class="num">${value}<span>件</span></div></div>`).join('')}</div>`+
 `<div class="card v8-daily-actions"><div class="row between"><div><h2>授業報告一覧</h2><span class="small muted">${ct}件／学習内容・申し送り・状態を確認できます</span></div><div class="row"><span id="v8-selected-count" class="badge blue">${v8SelectedDaily.size}件選択</span><button class="btn small" onclick="v8DailySelectDisplayed(true)">報告できる分を選択</button><button class="btn small" onclick="v8DailySelectDisplayed(false)">選択解除</button><button class="btn primary" onclick="v8SubmitDailyChecked()">選択分を報告済みに</button><button class="btn primary" onclick="v8SubmitDailyAll()">表示条件の未報告を一括変更</button></div></div><div class="row between mt"><span class="tiny muted">並べて一覧する場合は表形式、所見を大きく読む場合はカード形式</span><div class="segmented"><button class="${v9Ui.dailyMode==='table'?'on':''}" onclick="v9DailyMode('table')">一覧（表）</button><button class="${v9Ui.dailyMode==='cards'?'on':''}" onclick="v9DailyMode('cards')">詳細（カード）</button></div></div></div>`+
 `<div class="v8-daily-entries">${goodRange(f.from,f.to)?v9Ui.dailyMode==='cards'?v8DailyGroupHTML(items):v9DailyTable(items):'<div class="notice">開始日・終了日を確認してください。</div>'}</div>`;
};
const V9_priorDailyCard=v8DailyItemCard;
v8DailyItemCard=function(it){return V9_priorDailyCard(it).replace('この生徒だけ提出','報告済みにする');};
const V9_priorReviewLesson=reviewLesson;
reviewLesson=function(id){const l=db.lessons.find(x=>x.id===id);if(!l)return;
 let item={id:'lesson:'+l.id,d:l,kind:'lesson',status:l.status};
 const btn=v8CanSend(item)?`<button class="btn primary" onclick='v9ReportFromDialog(${JSON.stringify(l.id)})'>報告済みにする</button>`:'';
 modal('授業の内容｜'+safeStudent(l.student)?.name+'・'+l.subject,lessonCard(l)+`<div class="card mt"><p class="small"><b>現在の状態：</b>${statusBadge(l.status)}</p><p class="small mt"><b>宿題：</b>${esc(hwText(l)||'未入力')}</p><div class="notice mt"><b>申し送り・内部メモ（保護者には非表示）</b><p class="preline">${esc([l.handoverText,l.internal].filter(Boolean).join('\n')||'記録なし')}</p></div></div><div class="formfooter"><button class="btn" onclick="openLesson('${l.id}')">記録を編集</button>${btn}<button class="btn" onclick="closeModal()">閉じる</button></div>`);
};
function v9ReportFromDialog(id){closeModal();v8SubmitSelected(['lesson:'+id]);}

// One fixed print layout: 2 columns × 4 rows, without density/margin controls.
state.report.listDensity='8';
const V9_priorGakuproEntry=gakuproEntry;
gakuproEntry=function(l){let h=V9_priorGakuproEntry(l);return h.replace('<div class="note-box"><b>今後の指導</b>','<div class="note-box v9-next-note"><b>今後の指導</b>').replace(/<span style="float:right">(?:下書き|確認済み)<\/span>/,`<span style="float:right">${v9Label(l.status)}</span>`);};
reportList=function(sid,ls){let s=safeStudent(sid),html='';for(let i=0;i<ls.length;i+=8){let chunk=ls.slice(i,i+8);
 html+=`<section class="report-page gakupro-sheet v9-eight"><div class="gakupro-header"><div><h2>学習報告書（学プロ記録一覧）</h2><p class="small">${esc(s.name)}　${esc(s.grade)}　${esc(currentRoom())}</p></div><div style="text-align:right;font-size:10px">${partDate(state.report.from)}〜${partDate(state.report.to)}<br>内部用／${Math.floor(i/8)+1}ページ</div></div><div class="gakupro-grid">${chunk.map(gakuproEntry).join('')}</div><div class="report-footer">授業記録：2列×4行の固定配置／1ページ8件。内部用の申し送りを含みます。保護者配布不可。架空データ。</div></section>`;
 }return html;
};
const V9_priorReports=renderReports;
renderReports=function(){state.report.listDensity='8';let html=V9_priorReports();
 // Previous style/density/margin dropdown group is intentionally removed.
 html=html.replace(/<div class="report-style-controls"[\s\S]*?<\/div><p id="print-fit"[\s\S]*?<\/p>/,'<p class="v9-print-fixed small">学プロ記録一覧：A4縦・2列×4行（1ページ8件）の固定レイアウト</p>');
 return html;
};
// A no-frills configuration note: sharing is explicitly not enabled.
const V9_priorSettings=renderSettings;
renderSettings=function(){return V9_priorSettings()+`<section class="card mt"><h2>複数タブレット利用（本番で必要な構成）</h2><p class="small mt">このモックは同じタブレット・同じブラウザのローカル保存です。別端末のデータは共有できません。本番ではサーバー側の共有データベース・教室ごとの権限・同時編集の競合検出と履歴保存が必要です。</p><p class="small mt">授業報告は「未報告／報告済み」の二状態に統一。毎晩のバックアップと永続の操作ログは本番開発時に実装します。</p></section>`;};
// Keep the exact v8 hash/history behavior and cross-page local draft persistence.
const V9_priorRender=render;
render=function(){V9_priorRender();if(state.page==='desk')v9RefreshAllRequired();
 if(state.page==='profile'){
  document.querySelectorAll('#content .metric small').forEach(e=>{if(e.textContent.includes('教室長の確認待ち'))e.textContent='報告済みの授業';});
 }
};
const v9Foot=document.querySelector('.sidebar-foot .tiny.muted');if(v9Foot)v9Foot.textContent='電子学プロ / Prototype 0.9';
document.title='学びのスキルカルテ v9｜2段階報告・複数選択・8件印刷';
render();

// ===== v10: 次回教材・単元・ページのデモ整備／必須判定／未定の例外 =====
// v9 のローカル保存キーを引き継ぐ。既存の手入力記録や下書きは上書きしない。
function v10HasNextValues(n){return !![n?.name,n?.unit,n?.pages].some(x=>String(x||'').trim());}
function v10NextValidation(d){
 if(d?.nextUndecided===true)return {ok:true,undecided:true,reason:'次回の教材・ページ：未定'};
 const rows=Array.isArray(d?.nextMaterials)?d.nextMaterials:[];
 const filled=rows.filter(v10HasNextValues);
 if(!filled.length)return {ok:false,reason:'次回の教材名・ページを入力するか、「未定」にチェックしてください。'};
 const invalid=filled.find(n=>!String(n.name||'').trim()||!String(n.pages||'').trim());
 if(invalid)return {ok:false,reason:'次回の教材を入力した行は、教材名とページの両方が必要です。'};
 return {ok:true,undecided:false,reason:'次回教材・ページは入力済み'};
}
function v10ForwardPages(value){
 const txt=String(value||'').trim();
 const nums=[...txt.matchAll(/\d+/g)].map(a=>Number(a[0]));
 if(nums.length>=2){const delta=Math.max(1,nums[1]-nums[0]+1);return 'p.'+(nums[1]+1)+'〜'+(nums[1]+delta);}
 if(nums.length===1)return 'p.'+(nums[0]+1)+'〜'+(nums[0]+3);
 return 'p.1〜3（予定）';
}
function v10DemoRecord(l){return !!(l?.demo||/^v5_l_/.test(String(l?.id||''))||/^l\d+$/.test(String(l?.id||'')));}
function v10SeedDemoNextLessons(){
 if(db.demoNextSeedV10)return;
 let added=0,skippedEdited=0;
 const pairs=new Map();
 for(const l of db.lessons||[]){const k=l.student+'\u0001'+l.subject;if(!pairs.has(k))pairs.set(k,[]);pairs.get(k).push(l);}
 for(const lessons of pairs.values()){
  lessons.sort((a,b)=>String(a.date||'').localeCompare(String(b.date||''))||V8_SLOTS.indexOf(a.slot)-V8_SLOTS.indexOf(b.slot));
  for(let i=0;i<lessons.length;i++){
   const l=lessons[i];if(!v10DemoRecord(l)||l.nextUndecided===true)continue;
   if((l.nextMaterials||[]).some(v10HasNextValues))continue;
   // デモを書き換えて保存したものには自動補充しない（講師が未記入にした可能性があるため）。
   if(l.updatedAt && String(l.updatedAt)>'2026-11-19T00:00:00Z'){skippedEdited++;continue;}
   const following=lessons.slice(i+1).find(x=>x.date>l.date||x.date===l.date&&x.slot!==l.slot);
   let mats=[];
   if(following){
     mats=asMaterials(following).filter(m=>String(m.name||'').trim()).map((m,j)=>({
      id:'v10next_'+l.id+'_'+j,catalogId:m.catalogId||'',name:String(m.name),
      unit:String(m.content||following.unit||''),pages:String(m.pages||v10ForwardPages(l.pages))
     }));
   }
   if(!mats.length){
    mats=asMaterials(l).filter(m=>String(m.name||'').trim()).slice(0,2).map((m,j)=>({
      id:'v10next_'+l.id+'_'+j,catalogId:m.catalogId||'',name:String(m.name),
      unit:String(l.unit||m.content||'')+'の定着・確認',pages:v10ForwardPages(m.pages||l.pages)
    }));
   }
   if(!mats.length)mats=[{id:'v10next_'+l.id+'_0',catalogId:'',name:String(l.material||l.subject+'ワーク（サンプル）'),unit:String(l.unit||'復習')+'の確認',pages:v10ForwardPages(l.pages)}];
   l.nextMaterials=mats;l.nextUndecided=false;l.demoNextV10=true;added++;
  }
 }
 // 保存済みの、未変更のデモ用編集下書きにも次回教材を反映。
 for(const [k,d] of Object.entries(db.deskDrafts||{})){
   if(d?._dirty)continue;
   const match=d?.id?db.lessons.find(l=>l.id===d.id):null;
   if(match?.demoNextV10){d.nextMaterials=clone(match.nextMaterials);d.nextUndecided=false;}
 }
 db.demoNextSeedV10=true;db.demoNextSeedCountV10=added;persist();
}
const V10_previousEntry=renderEntry;
renderEntry=function(d,token){
 if(d.nextUndecided==null)d.nextUndecided=false;
 let html=V10_previousEntry(d,token);
 const marker='<div class="record-scope v7-next-scope">';
 const checked=d.nextUndecided===true;
 const addition=`<div class="v10-decision"><label><input type="checkbox" data-next-undecided ${checked?'checked':''} onchange="v10ToggleUndecided('${token}',this.checked)"> 次回の教材・ページは「未定」</label><span class="small">未定の場合は教材名・ページが空欄でも報告済みにできます。<br>決まっている場合は教材名とページを必ず入力してください。</span></div><p class="v10-undecided-info">未定として登録します。決まり次第、次回教材を入力してください。</p>`;
 html=html.replace(marker,`<div class="record-scope v7-next-scope v10-next-scope ${checked?'v10-is-undecided':''}">`+addition);
 html=html.replace('次回の授業（教材・単元・ページ）</b>','次回の授業（教材・単元・ページ） <span class="v10-next-asterisk">※教材名・ページ必須／未定可</span></b>');
 html=html.replace(`<button type="button" class="btn small" onclick="v7AddNext('${token}')"`,`<button type="button" class="btn small v10-next-add" onclick="v7AddNext('${token}')"`);
 return html;
};
const V10_previousCapture=captureEntry;
captureEntry=function(token){
 const d=V10_previousCapture(token);const root=editorRoot(token);if(!d)return d;
 if(root){d.nextUndecided=!!root.querySelector('[data-next-undecided]')?.checked;touchDraft(d);persist();}
 return d;
};
function v10ToggleUndecided(token,on){
 const root=editorRoot(token),toggle=root?.querySelector('[data-next-undecided]');if(!root||!toggle)return;
 if(on){
   const hasAny=[...root.querySelectorAll('[data-next-index]')].some(row=>[...row.querySelectorAll('input')].some(x=>String(x.value||'').trim()));
   if(hasAny&&!confirm('入力済みの次回教材・ページを削除して「未定」にしますか？')){toggle.checked=false;return;}
   if(hasAny)root.querySelectorAll('[data-next-index] input').forEach(x=>{x.value='';});
 }
 const d=captureEntry(token);d.nextUndecided=on;
 if(on)d.nextMaterials=[v7NewNextMaterial()];
 touchDraft(d);persist();refreshEditor(token);
 toast(on?'次回教材を「未定」として保存しました。':'次回教材の入力に戻しました。');
}
const V10_previousRequired=v9RefreshRequired;
v9RefreshRequired=function(root){
 V10_previousRequired(root);if(!root)return;
 const scope=root.querySelector('.v10-next-scope');if(!scope)return;
 const undecided=!!scope.querySelector('[data-next-undecided]')?.checked;
 const rows=[...scope.querySelectorAll('[data-next-index]')].map(row=>({
   row,name:row.querySelector('[data-next-field="name"]'),unit:row.querySelector('[data-next-field="unit"]'),pages:row.querySelector('[data-next-field="pages"]')
 }));
 const considered=rows.filter(x=>[x.name?.value,x.unit?.value,x.pages?.value].some(t=>String(t||'').trim()));
 const missing=!undecided&&(!considered.length||considered.some(x=>!String(x.name?.value||'').trim()||!String(x.pages?.value||'').trim()));
 scope.classList.toggle('v10-is-undecided',undecided);
 scope.classList.toggle('v10-next-missing',missing);
 rows.forEach(x=>{let active=!undecided&&(!considered.length||considered.includes(x));for(const [k,input] of [['name',x.name],['pages',x.pages]]){if(!input)continue;const bad=active&&!(input.value||'').trim()&&(!considered.length?x===rows[0]:true);input.classList.toggle('v9-required-empty',bad);input.setAttribute('aria-invalid',bad?'true':'false');}});
 let hint=scope.querySelector('.v10-next-summary');if(!hint){hint=document.createElement('p');hint.className='v10-next-summary';scope.appendChild(hint);}
 hint.classList.toggle('good',!missing);hint.textContent=undecided?'未定にチェック済み：入力不要です。':missing?'次回の教材名とページは基本必須です。未定の場合はチェックしてください。':'次回の教材名・ページは入力済みです。';
 const notice=root.querySelector('.v9-missing-notice');if(notice){
   if(missing){notice.classList.remove('complete');if(notice.textContent.startsWith('未入力（報告前に確認）：'))notice.textContent+='・次回教材名・ページ';else notice.textContent='未入力（報告前に確認）：次回教材名・ページ';}
   else if(undecided && notice.classList.contains('complete'))notice.textContent='必須項目は入力済みです（次回教材は未定）。報告済みにできます。';
 }
};
const V10_previousSubmit=submitEntry;
submitEntry=function(token,intent){
 if(intent==='report'){
  const d=captureEntry(token);if(!d)return;
  const valid=v10NextValidation(d);
  if(!valid.ok){v9RefreshRequired(editorRoot(token));toast(valid.reason);const root=editorRoot(token);let el=root?.querySelector('.v10-next-scope input.v9-required-empty');if(el){el.focus({preventScroll:true});el.scrollIntoView({block:'center',behavior:'smooth'});}return;}
 }
 return V10_previousSubmit(token,intent);
};
const V10_previousCanSend=v8CanSend;
v8CanSend=function(item){return V10_previousCanSend(item)&&v10NextValidation(item.d).ok;};
const V10_previousDraftFrom=draftFrom;
draftFrom=function(l){let d=V10_previousDraftFrom(l);d.nextUndecided=!!l.nextUndecided;d.nextMaterials=v7AsNextMaterials(l);return d;};
const V10_previousNextText=v7NextText;
v7NextText=function(l){if(l?.nextUndecided)return '未定';return V10_previousNextText(l);};
const V10_previousPrintEntry=gakuproEntry;
gakuproEntry=function(l){
 let out=V10_previousPrintEntry(l);const planned=v7NextText(l)||'未入力';
 // ページ余白を増やさずに、今後の指導欄の末尾に次回教材をコンパクトに記載。
 const marker='<div class="mini-info">';const idx=out.indexOf(marker);
 if(idx<0)return out;
 const compact=planned.replace(/\n/g,' ／ ');
 return out.slice(0,idx)+`<div class="v10-plan-in-print"><strong>次回教材・ページ：</strong>${esc(compact)}</div>`+out.slice(idx);
};
const V10_previousReset=resetDemo;
resetDemo=function(){V10_previousReset();}; // 再読込時にも全デモ授業に再適用される
const V10_previousRender=render;
render=function(){if(!db.demoNextSeedV10)v10SeedDemoNextLessons();return V10_previousRender();};
v10SeedDemoNextLessons();
const v10Foot=document.querySelector('.sidebar-foot .tiny.muted');if(v10Foot)v10Foot.textContent='電子学プロ / Prototype 1.0';
document.title='学びのスキルカルテ v10｜次回教材・ページの必須／未定対応';
render();


/* ================= v11: 教室運用の改善（デモ） ================= */
const V11_STORAGE_KEY='llld_manabi_v11_view';
const v11Prefs=(()=>{try{return {...{font:'sm',recentLimit:10,recentSubject:''},...JSON.parse(DebugStorage.getItem(V11_STORAGE_KEY)||'{}')}}catch(e){return {font:'sm',recentLimit:10,recentSubject:''}}})();
function v11SavePrefs(){try{DebugStorage.setItem(V11_STORAGE_KEY,JSON.stringify(v11Prefs))}catch(e){}}
function v11SetFont(size){if(!['sm','md','lg'].includes(size))return;v11Prefs.font=size;v11SavePrefs();v11ApplyFont();}
function v11ApplyFont(){document.body.dataset.v11Size=v11Prefs.font;document.querySelectorAll('[data-v11-font-btn]').forEach(b=>{b.classList.toggle('active',b.dataset.v11FontBtn===v11Prefs.font);b.setAttribute('aria-pressed',b.dataset.v11FontBtn===v11Prefs.font?'true':'false')})}
const v11Actor=document.querySelector('.topbar .actor');
if(v11Actor&&!v11Actor.querySelector('.v11-font-control')){
 v11Actor.insertAdjacentHTML('afterbegin',`<div class="v11-font-control" role="group" aria-label="文字サイズの切り替え"><span>文字</span>${[['sm','小'],['md','中'],['lg','大']].map(([k,l])=>`<button type="button" data-v11-font-btn="${k}" aria-label="文字サイズ${l}" onclick="v11SetFont('${k}')">${l}</button>`).join('')}</div>`);
}
v11ApplyFont();

// Legacy demo scores: retain the raw historical counts but offer only rounded
// 10-point dropdown values for the new per-lesson percentage field.
function v11Accuracy(d){
 const value=d?.accuracyPercent;
 if(value!==null&&value!==undefined&&value!==''&&Number.isFinite(Number(value)))return Math.max(0,Math.min(100,Math.round(Number(value)/10)*10));
 if(d?.correct!==null&&d?.correct!==undefined&&d?.total>0)return Math.max(0,Math.min(100,Math.round((Number(d.correct)/Number(d.total))*10)*10));
 return null;
}
let v11ScoreMigrated=0;
for(const d of [...(db.lessons||[]),...Object.values(db.deskDrafts||{})]){
 if(d.accuracyPercent===undefined){const val=v11Accuracy(d);if(val!==null){d.accuracyPercent=val;v11ScoreMigrated++;}}
 // Avoid validating old count-only fields after users switch to the percentage dropdown.
 if(d.correct!==null&&d.correct!==undefined)d.legacyCorrect=d.correct;
 if(d.total!==null&&d.total!==undefined)d.legacyTotal=d.total;
 d.correct=null;d.total=null;
}
if(v11ScoreMigrated)persist();

// Start a new lesson using the prior lesson's next teaching direction, without
// inheriting its score, observations, or conclusion. Explicitly cleared drafts stay cleared.
function v11PrefillPlan(d){
 if(!d||d.id||d._dirty||d.v11PlanInitialized)return d;
 const prior=prevLesson(d);
 if(prior?.next?.trim()&&!String(d.plan||'').trim()){
  d.plan=String(prior.next).trim();d.v11PlanFrom=prior.id;d.v11PlanDate=prior.date;
 }
 d.v11PlanInitialized=true;
 return d;
}
const V11_previousBlankDraft=blankDraft;
blankDraft=function(sid,sub,date,slot,teacher){return v11PrefillPlan(V11_previousBlankDraft(sid,sub,date,slot,teacher));};
const V11_previousDeskDraft=deskDraft;
deskDraft=function(i){let d=V11_previousDeskDraft(i);if(d&&!d.v11PlanInitialized&&!d._dirty&&!d.id){v11PrefillPlan(d);persist()}return d;};

// Redraw the lesson editor with a percentage selector and richer free observations.
const V11_previousRenderEntry=renderEntry;
renderEntry=function(d,token){
 let html=V11_previousRenderEntry(d,token);
 const percent=v11Accuracy(d);
 const pctControl=`<div class="fieldgroup v11-rate-control"><label class="field">確認問題の正答率（任意）<select name="accuracyPercent" aria-label="正答率（0〜100%、10%刻み）">${option('','未記録',percent===null?'':String(percent))}${Array.from({length:11},(_,i)=>option(String(i*10),(i*10)+'%',percent===null?'':String(percent))).join('')}</select></label><p class="tiny muted" style="margin-top:4px">0〜100％を10％刻みで記録。出題数・正答数の入力は不要です。</p></div>`;
 html=html.replace(/<div class="form-grid"><label class="field">正答数[\s\S]*?<\/div>/,pctControl);
 const insertAfterTagrow=(title,addon)=>{
  let pos=html.indexOf(title);if(pos<0)return;
  let start=html.indexOf('<div class="tagrow">',pos);if(start<0)return;
  let end=html.indexOf('</div>',start);if(end<0)return;
  html=html.slice(0,end+6)+addon+html.slice(end+6);
 };
 insertAfterTagrow('つまずき（複数選択）',`<div class="v11-form-extra"><label for="v11-stumbles-${token}">その他・つまずきの補足（自由記述）</label><textarea id="v11-stumbles-${token}" name="stumblesOther" rows="2" placeholder="選択肢にないつまずきや、具体的な様子を入力">${esc(d.stumblesOther||'')}</textarea></div>`);
 insertAfterTagrow('見つけた良さ（任意）',`<div class="v11-form-extra"><label class="chipcheck" style="display:inline-flex;align-items:center"><input type="checkbox" name="tags" value="その他" ${(d.tags||[]).includes('その他')?'checked':''}> その他の良さ</label><label for="v11-strength-${token}" style="margin-top:9px">良かったところの補足（自由記述）</label><textarea id="v11-strength-${token}" name="tagsOther" rows="2" placeholder="例：自分から友達の考え方との違いを説明できた">${esc(d.tagsOther||'')}</textarea></div>`);
 html=html.replace(/授業の様子・できたこと・支援の効果/g,'できたこと・支援の効果・気づき');
 html=html.replace('任意・前回から反映可能','前回の次回指導を初期入力・編集可');
 const planSource=d.v11PlanFrom?`<span class="v11-current-plan-source">${fmt(d.v11PlanDate)}の「次回の指導内容」から自動反映。今回の予定として自由に修正できます。</span>`:'';
 if(planSource)html=html.replace('</textarea></label><label class="field mt">学習した内容',`</textarea></label>${planSource}<label class="field mt">学習した内容`);
 const behavior=`<div class="v11-behavior"><label class="field">生徒の様子（自由記述・任意）<span class="field-hint">授業での表情・集中・質問の様子など、観察した事実を記入</span><textarea name="studentBehavior" rows="3" placeholder="例：前半は集中して取り組んだ。わからない箇所では自分から質問できた。">${esc(d.studentBehavior||'')}</textarea></label></div>`;
 html=html.replace('<div class="sticky-save">',behavior+'<div class="sticky-save">');
 return html;
};
const V11_previousCaptureEntry=captureEntry;
captureEntry=function(token){
 const d=V11_previousCaptureEntry(token),root=editorRoot(token);if(!d||!root)return d;
 const v=root.querySelector('[name="accuracyPercent"]')?.value;
 d.accuracyPercent=(v===undefined||v==='')?null:Number(v);
 d.correct=null;d.total=null;
 d.stumblesOther=String(root.querySelector('[name="stumblesOther"]')?.value||'').trim();
 d.tagsOther=String(root.querySelector('[name="tagsOther"]')?.value||'').trim();
 d.studentBehavior=String(root.querySelector('[name="studentBehavior"]')?.value||'').trim();
 if(d.stumblesOther&&!d.stumbles.includes('その他'))d.stumbles.push('その他');
 if(d.tagsOther&&!d.tags.includes('その他'))d.tags.push('その他');
 touchDraft(d);persist();return d;
};

// Store typed extra fields also in previously finalized and historical reports.
const V11_previousLessonText=lessonText;
lessonText=function(l){return V11_previousLessonText(l)+ '\n正答率：'+(v11Accuracy(l)===null?'未記録':v11Accuracy(l)+'%')+'\nつまずき補足：'+(l.stumblesOther||'')+'\n良さ補足：'+(l.tagsOther||'')+'\n生徒の様子：'+(l.studentBehavior||'');};
const V11_previousLessonCard=lessonCard;
lessonCard=function(l,opts={}){
 let html=V11_previousLessonCard(l,opts);
 const info=[v11Accuracy(l)===null?'':'確認問題の正答率：'+v11Accuracy(l)+'%',l.stumblesOther?'つまずき（その他）：'+l.stumblesOther:'',l.tagsOther?'見つけた良さ（その他）：'+l.tagsOther:'',l.studentBehavior?'生徒の様子：'+l.studentBehavior:''].filter(Boolean);
 if(info.length)html=html.replace('<div class="lesson-foot">',`<div class="v11-lesson-details">${info.map(x=>`<div>${esc(x)}</div>`).join('')}</div><div class="lesson-foot">`);
 html=html.replace(/<button class="btn text small" onclick="showContext\('[^']+'\)">前後の授業<\/button>/g,'');
 return html;
};
const V11_previousRecords=records;
records=function(sid=state.student,f=state.history){
 if(!f?.q)return V11_previousRecords(sid,f);
 const found=V11_previousRecords(sid,{...f,q:''}),q=norm(f.q);
 return found.filter(l=>norm([l.unit,l.obs,l.next,materialsText(l,true),(l.tags||[]).join(' '),(l.stumbles||[]).join(' '),l.homework,l.teacher,l.handoverText||'',l.studentBehavior||'',l.stumblesOther||'',l.tagsOther||''].join(' ')).includes(q));
};
const V11_previousGakupro=gakuproEntry;
gakuproEntry=function(l){
 let html=V11_previousGakupro(l);const score=v11Accuracy(l);
 html=html.replace(/正答率：(\d+%|未記録)/,`正答率：${score===null?'未記録':score+'%'}`);
 if(l.studentBehavior)html=html.replace('<div class="mini-info">',`<div class="v11-print-behavior" style="font-size:8px;line-height:1.2">生徒の様子：${esc(l.studentBehavior)}</div><div class="mini-info">`);
 return html;
};
const V11_previousReportDaily=reportDaily;
reportDaily=function(sid,ls){
 let html=V11_previousReportDaily(sid,ls);
 // Legacy daily print paragraphs contained counts; replace the old result sentence.
 html=html.replace(/確認問題：\d+問正解 \/ \d+問/g,'');
 // Each report is one page; append a percentage result beside the attainment paragraph.
 const pageChunks=html.split(/(?=<section class="report-page">)/);
 return pageChunks.map((chunk,i)=>{
  if(!chunk.startsWith('<section class="report-page">'))return chunk;
  const l=ls[i];if(!l)return chunk;
  const rate=v11Accuracy(l);
  if(rate!==null)chunk=chunk.replace(/(<div class="report-section"><h3>今回の到達状況<\/h3><p>[\s\S]*?)(<\/p>)/,(_s,b,c)=>b+`<br>確認問題の正答率：${rate}%`+c);
  if(l.studentBehavior)chunk=chunk.replace('<div class="report-section"><h3>次回の指導内容',`<div class="report-section"><h3>生徒の様子</h3><p>${esc(l.studentBehavior)}</p></div><div class="report-section"><h3>次回の指導内容`);
  return chunk;
 }).join('');
};

// The list of today's records is available without scrolling down each student's editor.
function v11TodayItems(sid=''){
 const date=extra.desk.date;
 const selected=new Set(sid?[sid]:extra.desk.seats.filter(Boolean).map(x=>x.student));
 const list=[];const savedIds=new Set();
 for(const l of db.lessons||[]){if(l.date!==date||!isSameRoom(l.student)||!selected.has(l.student))continue;list.push({record:l,key:'',kind:'saved'});savedIds.add(l.id);}
 for(const [key,d] of Object.entries(db.deskDrafts||{})){
  if(!d||d.date!==date||!isSameRoom(d.student)||!selected.has(d.student))continue;
  if(d.id&&savedIds.has(d.id))continue;
  if(!v8DraftHasContent(d))continue;
  list.push({record:d,key,kind:'draft'});
 }
 return list.sort((a,b)=>V8_SLOTS.indexOf(a.record.slot)-V8_SLOTS.indexOf(b.record.slot)||a.record.teacher.localeCompare(b.record.teacher,'ja')||safeStudent(a.record.student)?.name.localeCompare(safeStudent(b.record.student)?.name||'','ja'));
}
function v11TodayOverview(sid=''){
 captureVisibleEditors();let rows=v11TodayItems(sid),date=extra.desk.date;
 const names=sid?safeStudent(sid)?.name+'さん':extra.desk.seats.filter(Boolean).map(x=>safeStudent(x.student)?.name).filter(Boolean).join('・');
 const slotHTML=V8_SLOTS.map(slot=>{
  let group=rows.filter(x=>x.record.slot===slot);
  return `<tr class="v11-group-row"><td colspan="7">${slot}コマ　${group.length}件</td></tr>`+group.map(({record:l,key,kind})=>`<tr><td>${fmt(l.date)}<br><small>${esc(l.slot)}コマ</small></td><td><b>${esc(safeStudent(l.student)?.name||'')}</b><div class="tiny muted">${esc(safeStudent(l.student)?.grade||'')}</div></td><td>${esc(l.subject)}</td><td>${esc(l.teacher)}</td><td>${esc(l.unit||l.plan||'未入力')}</td><td>${kind==='draft'?v6SmallBadge('入力途中'):statusBadge(l.status)}</td><td><button class="btn small" type="button" onclick="${kind==='draft'?`v8OpenDraft(${JSON.stringify(key)})`:`openLesson(${JSON.stringify(l.id)})`}">開いて編集</button></td></tr>`).join('')+(group.length?'':'<tr><td colspan="7" class="small muted">このコマの記録はありません</td></tr>');
 }).join('');
 modal('今日の授業一覧｜'+fmt(date),`<div class="v11-today-overview"><p class="small muted mb">対象：${esc(names||'生徒未選択')}。今日の入力状況をX〜Dコマでまとめて確認できます。授業中の入力は保持します。</p><div class="tablewrap"><table><thead><tr><th>日付・コマ</th><th>生徒</th><th>教科</th><th>講師</th><th>今回の予定・内容</th><th>状態</th><th>操作</th></tr></thead><tbody>${slotHTML}</tbody></table></div><div class="formfooter"><button class="btn" onclick="closeModal()">戻る</button><button class="btn primary" onclick="closeModal();navigate('daily')">報告の一覧へ</button></div></div>`);
 const dlg=document.getElementById('modal');if(dlg)dlg.style.width='min(1240px,97vw)';
}
const V11_previousDeskSeat=renderDeskSeat;
renderDeskSeat=function(i){let html=V11_previousDeskSeat(i),s=extra.desk.seats[i];if(!s||html.includes('is-collapsed'))return html;
 const anchor=`<button type="button" class="v9-history-shortcut" onclick="deskHistory(${i})" title="過去の授業記録を確認">過去の授業 ›</button>`;
 return html.replace(anchor,anchor+`<button type="button" class="v11-today-button" onclick="v11TodayOverview('${s.student}')" title="${fmt(extra.desk.date)}の授業履歴を確認">今日の授業 ›</button>`);
};
const V11_previousDesk=renderDesk;
renderDesk=function(){let html=V11_previousDesk();
 html=html.replace('このコマの生徒を保存','コマ編成を保存');
 html=html.replace('onclick="saveSession()">コマ編成を保存</button>',`onclick="saveSession()">コマ編成を保存</button><button type="button" class="btn" onclick="v11TodayOverview()">今日の授業を一覧で確認</button>`);
 html=html.replace('登録済み ／','編成登録済み ／');
 html=html.replace('<div class="v4-toolbar">','<div class="v11-demo-save-note">各生徒の記入は自動保存。コマ編成（誰を表示するか）は「コマ編成を保存」で確定します。</div><div class="v4-toolbar">');
 return html;
};
// The barcode entry's old message must distinguish local drafts from session roster confirmation.
const V11_previousScan=scanStudent;
scanStudent=function(code){V11_previousScan(code);};

// Recent lessons: all subjects or one subject; 10/20/50/100/200, no context button.
v8RecentLessons=function(){
 if(state.page!=='profile')return;
 const section=[...document.querySelectorAll('#content section.card')].find(s=>s.querySelector('h2')?.textContent.includes('直近の授業を'));
 if(!section)return;
 const heading=section.querySelector('h2');heading.textContent='直近の授業を見る';
 const subs=[...new Set(db.lessons.filter(l=>l.student===state.student).map(l=>l.subject))].sort((a,b)=>a.localeCompare(b,'ja'));
 let sub=v11Prefs.recentSubject;if(sub&&!subs.includes(sub))sub='';
 const count=[10,20,50,100,200].includes(Number(v11Prefs.recentLimit))?Number(v11Prefs.recentLimit):10;
 section.querySelector('.v8-recent-tools')?.remove();section.querySelectorAll('.v8-recent-records,.v11-recent-results,.v11-recent-tools').forEach(x=>x.remove());
 section.querySelectorAll('article.lesson').forEach(x=>x.remove());
 const controls=`<div class="v11-recent-tools"><label class="field">教科<select onchange="v11SetRecent('subject',this.value)">${option('','すべての教科',sub)}${subs.map(x=>option(x,x,sub)).join('')}</select></label><label class="field">表示件数<select onchange="v11SetRecent('limit',this.value)">${[10,20,50,100,200].map(n=>option(String(n),n+'件',String(count))).join('')}</select></label><span class="tiny muted">各授業をその場で確認できます</span></div>`;
 const all=records(state.student,{subject:sub,sort:'desc'});
 const html=`<div class="v11-recent-results"><div class="resultbar">全${all.length}件中 ${Math.min(count,all.length)}件を表示</div>${all.slice(0,count).map(l=>lessonCard(l)).join('')||'<div class="empty">該当する授業記録はありません。</div>'}</div>`;
 section.querySelector('.section-title')?.insertAdjacentHTML('afterend',controls+html);
};
function v11SetRecent(key,value){if(key==='subject')v11Prefs.recentSubject=value;else if(key==='limit')v11Prefs.recentLimit=Number(value);v11SavePrefs();v8RecentLessons();}

// Dedicated exam/qualification registers inside each student's profile, editable in place.
function v11ProfileEntryForm(id='',sid=state.student){
 v6EntryForm(id);
 if(id)return;
 const sel=document.querySelector('#modal select[name="studentId"]');if(sel&&[...sel.options].some(x=>x.value===sid))sel.value=sid;
}
function v11ProfileCredentials(id=''){v6CredentialForm(id);}
function v11ProfileQualCard(sid){
 const s=safeStudent(sid),entries=v6EntriesFor(sid).filter(x=>x.application!=='取消');
 const future=entries.filter(x=>x.attendance!=='受験'&&x.attendance!=='欠席'&&x.event.date>=TODAY);
 const taken=entries.filter(x=>x.attendance==='受験');
 const unresolved=entries.filter(x=>x.event.date<TODAY&&!['受験','欠席'].includes(x.attendance));
 const creds=v6CredentialsFor(sid);
 const entryRow=(r)=>`<article class="v11-qual-item"><div class="row between"><b>${esc(r.event.category)} ${esc(r.level||'')}</b>${v6SmallBadge(v6RowEventStatus(r))}</div><div class="v11-qual-date">${esc(r.event.name)} ／ ${fmt(r.event.date)}</div><div class="row mt"><button type="button" class="btn small" onclick="v11ProfileEntryForm('${r.id}')">申込・結果を編集</button></div></article>`;
 const credRow=(c)=>{
  const source=String(c.id||'').startsWith('passed_');
  return `<article class="v11-qual-item"><b>${esc(c.category)} ${esc(c.level)}</b><div class="v11-qual-date">取得日：${fmt(c.acquiredAt||'')} ／ ${source?'受験結果から自動反映':'過去取得を登録'}</div><div class="row mt"><button type="button" class="btn small" onclick="${source?`v11ProfileEntryForm('${c.id.slice(7)}')`:`v11ProfileCredentials('${c.id}')`}">${source?'受験結果を編集':'取得級を編集'}</button></div></article>`;
 };
 return `<section class="card v11-qual-card mb"><div class="v11-qual-header"><div><div class="eyebrow">EXAMS & QUALIFICATIONS</div><h2>模試・検定・取得級</h2><p class="small muted">${esc(s?.name||'')}さんの受験予定・受験実績・取得級を、その場で確認・変更できます。</p></div><div class="row"><button class="btn small primary" onclick="v11ProfileEntryForm('','${sid}')">＋ 受験予定を登録</button><button class="btn small" onclick="v11ProfileCredentials()">＋ 取得級を登録</button><button class="btn small" onclick="v6ui.tab='applications';navigate('qualifications')">全体の申込一覧</button></div></div><div class="v11-qual-columns"><div class="v11-qual-group"><h3>受験予定 ${v6SmallBadge(future.length+'件')}</h3><div class="v11-qual-items">${future.map(entryRow).join('')||'<p class="small muted">これからの受験予定はありません。</p>'}</div></div><div class="v11-qual-group"><h3>受験済み ${v6SmallBadge(taken.length+'件')}</h3><div class="v11-qual-items">${taken.map(entryRow).join('')||'<p class="small muted">受験済みの記録はありません。</p>'}</div>${unresolved.length?`<p class="tiny muted mt">※過去実施日で出欠未確認が${unresolved.length}件あります。申込一覧から確認してください。</p>`:''}</div><div class="v11-qual-group"><h3>取得級 ${v6SmallBadge(creds.length+'件')}</h3><div class="v11-qual-items">${creds.map(credRow).join('')||'<p class="small muted">取得級の登録はありません。</p>'}</div></div></div></section>`;
}
const V11_previousProfile=renderProfile;
renderProfile=function(){let html=V11_previousProfile();return html.replace(/<section class="card v6-profile-events mb">[\s\S]*?<\/section>/,v11ProfileQualCard(state.student));};

// Refresh v11 enhancements after each old render chain (the old v8 render calls the
// recent-widget function, and the v9 chain invokes the required-field function).
const V11_previousRender=render;
render=function(){V11_previousRender();v11ApplyFont();if(state.page==='profile')v8RecentLessons();};
const v11Footer=document.querySelector('.sidebar-foot .tiny.muted');if(v11Footer)v11Footer.textContent='電子学プロ / Prototype 1.1';
document.title='学びのスキルカルテ v11｜正答率・今日の授業一覧・受験履歴・文字サイズ';
render();

/* ================= v12 / 2026-11-19 =================
   生徒複数所属・学年更新・教科統合・折り畳み操作・iPad印刷プレビュー
   注意: 静的HTMLのため期限到達処理はこの端末で次に開いた時に実行。
*/
const V12_VERSION='1.2';
if(!GRADES.includes('卒業'))GRADES.push('卒業');
const V12_HS_MATH=['数学','数学Ⅰ・A','数学Ⅱ・B','数学Ⅲ・C'];
const v12MathGroup=V6_HS_GROUPS.find(x=>x.name==='数学');
if(v12MathGroup)v12MathGroup.list=[...V12_HS_MATH];
// 旧表記は履歴上の原文を保持したまま、デモの表示選択へ正規化する。
const V12_MATH_ALIAS={
 '数学Ⅰ':'数学Ⅰ・A','数学Ⅰ・数学Ａ':'数学Ⅰ・A','数学Ⅰ・A':'数学Ⅰ・A','数学ⅠA':'数学Ⅰ・A',
 '数学Ⅱ・数学Ｂ':'数学Ⅱ・B','数学Ⅱ・B':'数学Ⅱ・B','数学ⅡBC':'数学Ⅱ・B',
 '数学Ⅲ':'数学Ⅲ・C','数学Ｃ':'数学Ⅲ・C','数学Ⅲ・C':'数学Ⅲ・C'
};
function v12NormalizeSubject(x){return V12_MATH_ALIAS[x]||x;}
function v12StudentRooms(s){let list=Array.isArray(s?.classrooms)?s.classrooms.filter(x=>CLASSROOMS.includes(x)):[];if(!list.length&&CLASSROOMS.includes(s?.school))list=[s.school];return [...new Set(list)];}
function v12HasRoom(s,room=currentRoom()){return !!s&&v12StudentRooms(s).includes(room)}
function v12SyncSchoolData(){let changed=false;
 for(const s of db.students){let rooms=v12StudentRooms(s);if(!Array.isArray(s.classrooms)||rooms.join('|')!==s.classrooms.join('|')){s.classrooms=rooms;changed=true;}if(!rooms.includes(s.school)){s.school=rooms[0]||currentRoom();changed=true;}}
 // 誤読を防ぐため、曖昧な「数学Ⅱ・数学Ｂ・数学Ｃ」は自動変換しない。
 for(const table of [db.lessons,db.assessments,db.exams,db.catalog,db.policies,Object.values(db.deskDrafts||{})]){
  for(const record of table||[]){if(record?.subject&&V12_MATH_ALIAS[record.subject]&&V12_MATH_ALIAS[record.subject]!==record.subject){record.originalSubject ||=record.subject;record.subject=v12NormalizeSubject(record.subject);changed=true;}}
 }
 if(state.subject&&V12_MATH_ALIAS[state.subject])state.subject=v12NormalizeSubject(state.subject);
 if(state.report.subject&&V12_MATH_ALIAS[state.report.subject])state.report.subject=v12NormalizeSubject(state.report.subject);
 if(changed)persist();
}
v12SyncSchoolData();
// Use membership instead of the legacy single primary room for all main app lookups.
isSameRoom=(sid)=>v12HasRoom(db.students.find(s=>s.id===sid));
roomStudents=()=>db.students.filter(s=>v12HasRoom(s)&&activeStudent(s));
const V12_priorMatchStudents=matchStudents;
matchStudents=function(f={}){
 let room=f.classroom&&CLASSROOMS.includes(f.classroom)?f.classroom:currentRoom();
 return v8SortStudents(db.students.filter(s=>v12HasRoom(s,room)&&(!f.grade||s.grade===f.grade)&&(!f.subject||(db.lessons||[]).some(l=>l.student===s.id&&l.subject===f.subject))&&(!f.enrollment||s.enrollment===f.enrollment)&&(!f.attribute||(s.attributes||[]).includes(f.attribute))&&(!f.q||[s.name,s.kana,s.code,s.schoolName].some(x=>norm(x).includes(norm(f.q))))),'roster');
};
studentOptions=function(selected='',all=false){const ss=db.students.filter(s=>v12HasRoom(s));return (all?'<option value="">すべての生徒</option>':'')+GRADES.map(g=>{let list=ss.filter(s=>s.grade===g).sort((a,b)=>v8Collate(a.kana||a.name,b.kana||b.name));return list.length?`<optgroup label="${esc(g)}">${list.map(s=>option(s.id,`${s.name}｜${v12StudentRooms(s).join('・')}`,selected)).join('')}</optgroup>`:'';}).join('');};
studentIdentity=function(s){return `${esc(s.grade)} ・ ${esc(v12StudentRooms(s).join('／'))} ・ ${esc(s.code)}`;};
// カルテ・名簿・授業準備は学年順を初期値にする（ユーザーの明示ソート選択は尊重）
if(!v8Prefs.rosterSort)v8Prefs.rosterSort='grade';
if(!v8Prefs.rosterDir)v8Prefs.rosterDir='asc';
const V12_priorRosters=rosterResults;
rosterResults=function(){return V12_priorRosters();};
// Explicitly show both rooms in the student master, without duplicating the student row.
masterStudentRows=function(){let f=extra.roster,ss=matchStudents({...f,q:extra.masterQ});return `<div class="filter-result">${ss.length}名を表示 ／ ${esc(currentRoom())}（兼籍を含む）</div><div class="tablewrap"><table class="master-table"><thead><tr><th>生徒名・生徒番号</th><th>学年・所属教室</th><th>在籍</th><th>操作</th></tr></thead><tbody>${ss.map(s=>`<tr><td><b>${esc(s.name)}</b><div class="subcell">${esc(s.kana||'')} ／ ${esc(s.code)}</div></td><td>${esc(s.grade)}<div class="subcell">${esc(v12StudentRooms(s).join('・'))}</div></td><td><span class="badge">${esc(s.enrollment||'在籍')}</span></td><td><div class="actions"><button class="btn small" onclick="openStudentBarcode('${s.id}')">バーコード</button><button class="btn small" onclick="openStudentForm('${s.id}')">編集</button><button class="btn small" onclick="viewStudent('${s.id}')">カルテ</button></div></td></tr>`).join('')||'<tr><td colspan="4">登録生徒はありません</td></tr>'}</tbody></table></div>`;};
// Registration / transfer / multi-room membership use a single student ID.
openStudentForm=function(id=''){
 const s=id?safeStudent(id):null,primary=s?.school||currentRoom(),rooms=s?v12StudentRooms(s):[currentRoom()];
 modal(id?'生徒マスター・所属教室を編集':'生徒を新規登録',`<form id="v12-student-form" onsubmit="v12SaveStudent(event,'${id}')"><div class="notice info mb">教科登録は不要です。移籍するときは「主所属教室だけに移籍」、両教室で使うときは「両教室に所属」を選択できます。</div><div class="form-grid"><label class="field">氏名（必須）<input name="name" maxlength="60" required value="${esc(s?.name||'')}"></label><label class="field">ふりがな（必須）<input name="kana" maxlength="80" required value="${esc(s?.kana||'')}"></label><label class="field">学年<select name="grade">${GRADES.map(g=>option(g,g,s?.grade||'中学1年')).join('')}</select></label><label class="field">主所属教室<select name="primaryRoom" onchange="v12EnsureRoom(this.value)">${CLASSROOMS.map(c=>option(c,c,primary)).join('')}</select></label><label class="field">学校名<input name="schoolName" maxlength="80" value="${esc(s?.schoolName||'')}"></label><label class="field">生徒番号（空欄なら自動採番）<input name="code" maxlength="30" value="${esc(s?.code||'')}"></label><label class="field">在籍状態<select name="enrollment">${['在籍','休塾','退塾'].map(x=>option(x,x,s?.enrollment||'在籍')).join('')}</select></label><label class="field">属性・目的<input name="attributes" maxlength="160" value="${esc((s?.attributes||[]).join('、'))}"></label></div><div class="fieldgroup mt"><b>表示対象の教室（複数選択可）</b><div class="v12-class-checks">${CLASSROOMS.map(c=>`<label><input name="rooms" type="checkbox" value="${esc(c)}" ${rooms.includes(c)?'checked':''}>${esc(c)}</label>`).join('')}</div><div class="row"><button type="button" class="btn small" onclick="v12SetRoomsPreset('only')">主所属教室だけに移籍</button><button type="button" class="btn small" onclick="v12SetRoomsPreset('both')">両教室に所属</button></div><p class="tiny muted mt">過去の授業履歴や取得級はそのまま残ります。両教室に表示しても二重登録にはなりません。</p></div><div class="formfooter"><button type="button" class="btn" onclick="closeModal()">戻る</button><button class="btn primary">生徒情報を保存</button></div></form>`);
};
function v12EnsureRoom(name){const el=[...document.querySelectorAll('#v12-student-form [name="rooms"]')].find(x=>x.value===name);if(el)el.checked=true;}
function v12SetRoomsPreset(mode){const form=document.getElementById('v12-student-form'),primary=form?.querySelector('[name="primaryRoom"]')?.value;if(!form)return;form.querySelectorAll('[name="rooms"]').forEach(x=>x.checked=mode==='both'||x.value===primary);}
function v12SaveStudent(event,id){event.preventDefault();const f=new FormData(event.target),old=db.students.find(s=>s.id===id),name=String(f.get('name')||'').trim(),kana=String(f.get('kana')||'').trim(),main=f.get('primaryRoom'),rooms=[...new Set(f.getAll('rooms'))];
 if(!name||!kana){toast('氏名・ふりがなを入力してください');return;}if(!rooms.includes(main)){toast('主所属教室を表示対象に含めてください。');return;}
 let code=String(f.get('code')||'').trim();if(code&&!/^[A-Z0-9-]+$/i.test(code)){toast('生徒番号は英数字・ハイフンで指定してください');return;}if(!code){let n=db.students.length+1;while(db.students.some(s=>s.code==='D-'+String(n).padStart(3,'0')))n++;code='D-'+String(n).padStart(3,'0');}
 if(db.students.some(s=>s.id!==id&&s.code===code)){toast('同じ生徒番号があります');return;}
 let item={...(old||{}),id:old?.id||uid('student'),name,kana,grade:f.get('grade'),school:main,classrooms:rooms,schoolName:String(f.get('schoolName')||''),code,enrollment:String(f.get('enrollment')||'在籍'),attributes:splitTags(f.get('attributes')),subjects:old?.subjects||[],createdAt:old?.createdAt||now(),updatedAt:now()};
 audit('生徒登録',item.id,'',old?'生徒情報・所属教室を変更':'生徒を登録',old?clone(old):'新規',clone(item));if(old)db.students[db.students.indexOf(old)]=item;else db.students.push(item);persist();closeModal();render();toast('生徒と所属教室を保存しました。');
}

// Desktop and tablet can tap anywhere on a collapsed pupil's panel.
const V12_priorDeskSeat=renderDeskSeat;
renderDeskSeat=function(i){let html=V12_priorDeskSeat(i);if(!extra.desk.collapsed?.[i]||!extra.desk.seats[i])return html;const match=html.match(/<section class="desk-panel is-collapsed"[^>]*>/);if(!match)return html;return html.replace(match[0],match[0].replace('class="desk-panel is-collapsed"',`class="desk-panel is-collapsed v12-click-collapsed" role="button" tabindex="0" aria-label="${esc(safeStudent(extra.desk.seats[i].student)?.name||'生徒')}の授業を開く" onclick="if(event.target.closest('button'))return;toggleDeskCollapse(${i})" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleDeskCollapse(${i})}"`));};
// Model lesson sessions as auto-saved: editing text and selecting the current cohort are separate.
let v12SessionSaveDisabled=false;
function v12AutoSaveSession(){if(v12SessionSaveDisabled)return;let w=extra.desk;if(!w||!w.date||!w.slot||!w.teacher)return;let key=sessionKey(currentRoom(),w.date,w.slot,w.teacher);let seats=clone(w.seats||[]);let ids=seats.filter(Boolean).map(x=>x.student);if(new Set(ids).size!==ids.length)return;if(ids.some(id=>!isSameRoom(id)))return;
 let entry=db.sessions.find(x=>x.key===key),existing=entry?.seats||[];if(JSON.stringify(existing)===JSON.stringify(seats))return;
 let next={...(entry||{}),id:entry?.id||uid('session'),key,room:currentRoom(),date:w.date,slot:w.slot,teacher:w.teacher,seats,updatedBy:state.actor,updatedAt:now(),autoSaved:true};
 if(entry)db.sessions[db.sessions.indexOf(entry)]=next;else db.sessions.push(next);
 // Do not add an audit event for scroll/position; only for changed classroom assignments.
 audit('授業準備','', '',entry?'コマの生徒編成を自動保存':'コマの生徒編成を自動登録',entry?.seats||[],seats);persist();
}
const V12_prevChooseStudent=chooseStudent;
chooseStudent=function(id){let target=extra.picker?.target;const result=V12_prevChooseStudent(id);if(target==='desk')v12AutoSaveSession();return result;};
const V12_prevAddStudent=addStudentToDesk;
addStudentToDesk=function(id){let out=V12_prevAddStudent(id);v12AutoSaveSession();return out;};
const V12_prevRemoveSeat=removeDeskSeat;
removeDeskSeat=function(i){let out=V12_prevRemoveSeat(i);v12AutoSaveSession();return out;};
const V12_prevReplaceSeat=replaceDeskStudent;
replaceDeskStudent=function(i,id){let out=V12_prevReplaceSeat(i,id);v12AutoSaveSession();return out;};
const V12_prevDeskSubject=setDeskSubject;
setDeskSubject=function(i,subject){let out=V12_prevDeskSubject(i,subject);v12AutoSaveSession();return out;};
const V12_prevScanStudent=scanStudent;
scanStudent=function(input){let out=V12_prevScanStudent(input);v12AutoSaveSession();return out;};
const V12_prevRenderDesk=renderDesk;
renderDesk=function(){let html=V12_prevRenderDesk();html=html.replace(/<button[^>]*onclick="saveSession\(\)"[^>]*>コマ編成を保存<\/button>/,'<span class="v12-auto-saved">✓ 生徒の組み合わせも自動保存</span>');html=html.replace('各生徒の記入は自動保存。コマ編成（誰を表示するか）は「コマ編成を保存」で確定します。','授業の下書きも、生徒の組み合わせも、この端末へ自動保存されます。');return html;};
// Correctness rate should also appear in the historical 学プロ print format.
const V12_prevGakuproEntry=gakuproEntry;
gakuproEntry=function(l){let html=V12_prevGakuproEntry(l);const p=v11Accuracy(l);html=html.replace(/正答率：未記録/g,`正答率：${p===null?'未記録':p+'%'}`);if(l.studentBehavior){const insert='<div class="note-box"><b>できたこと・授業の様子</b>';html=html.replace(insert,insert+esc(l.studentBehavior)+'　');}return html;};
// Grade promotion can be scheduled yearly; in this offline demo it runs when reopened on or after its due date.
db.gradeAutomation ||= {enabled:false,monthDay:'04-01',lastExecutedYear:0,nextRunYear:2027,history:[]};
function v12GradeNext(g){const idx=GRADES.indexOf(g);if(g==='卒業'||idx<0)return g;if(g==='小学6年')return '中学1年';if(g==='中学3年')return '高校1年';if(g==='高校3年')return '卒業';return GRADES[idx+1]||g;}
function v12CurrentTokyoDate(){return stampDate(now())||localDate();}
function v12GradePreview(){return db.students.map(s=>({id:s.id,name:s.name,from:s.grade,to:v12GradeNext(s.grade),room:v12StudentRooms(s).join('・')})).filter(r=>r.from!==r.to);}
function v12RunPromotion(year,{manual=false}={}){
 let rule=db.gradeAutomation;if(rule.lastExecutedYear>=year)return false;
 let rows=v12GradePreview();if(!rows.length){rule.lastExecutedYear=year;rule.nextRunYear=Math.max(Number(rule.nextRunYear)||year,year+1);persist();return false;}
 if(manual&&!confirm(`${rows.length}名の学年を繰り上げます。元のデータは履歴に残ります。実行しますか？`))return false;
 for(let r of rows){const s=safeStudent(r.id);let before=s.grade;s.grade=r.to;s.gradeHistory ||= [];s.gradeHistory.push({year,at:now(),before,after:r.to,by:manual?state.actor:'年次更新（この端末起動時）'});s.updatedAt=now();audit('年次更新',s.id,'',`${year}年の学年繰り上げ`,before,r.to);}
 rule.history ||= [];rule.history.unshift({year,runAt:now(),count:rows.length,manual});rule.lastExecutedYear=year;rule.nextRunYear=Math.max(Number(rule.nextRunYear)||year,year+1);
 persist();return true;
}
function v12CheckAnnualPromotion(){const rule=db.gradeAutomation;if(!rule?.enabled)return;const date=v12CurrentTokyoDate(),currentYear=Number(date.slice(0,4));rule.nextRunYear ||= (date.slice(5)<rule.monthDay?currentYear:currentYear+1);let loops=0;while(loops++<15&&Number(rule.nextRunYear)<=currentYear&&date>=`${rule.nextRunYear}-${rule.monthDay}`){let year=Number(rule.nextRunYear);if(rule.lastExecutedYear<year)v12RunPromotion(year);else rule.nextRunYear=year+1;}}
function v12SaveYearly(e){
 e.preventDefault();const old=clone(db.gradeAutomation),f=new FormData(e.target),runDate=String(f.get('nextRunDate')||'');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(runDate)||!Number.isFinite(Date.parse(runDate))){toast('次回実施日を指定してください。');return;}
 const today=v12CurrentTokyoDate(),enabled=f.get('enabled')==='on';
 if(enabled&&runDate<today){toast('自動更新日は今日以降を指定してください。');return;}
 db.gradeAutomation.enabled=enabled;db.gradeAutomation.nextRunYear=Number(runDate.slice(0,4));db.gradeAutomation.monthDay=runDate.slice(5);
 audit('運用設定','','','年次更新の実行日・有効状態を変更',old,clone(db.gradeAutomation));persist();v12CheckAnnualPromotion();render();toast('次回の年次更新を'+runDate+'に設定しました。');
}
function v12ExecuteGradeNow(){let currentYear=Number(v12CurrentTokyoDate().slice(0,4));if(db.gradeAutomation.lastExecutedYear>=currentYear){toast('今年はすでに年次更新済みです。二重実行はできません。');return}if(v12RunPromotion(currentYear,{manual:true})){render();toast('年次更新を実行しました。変更前後の学年は履歴に保存されています。');}}
function v12RenderAnnual(){const r=db.gradeAutomation,rows=v12GradePreview();return `<section class="card v12-annual-tab"><div class="section-title"><div><div class="eyebrow">ANNUAL UPDATE</div><h2>学年の年次更新</h2></div>${r.enabled?'<span class="badge green">自動実行 有効</span>':'<span class="badge amber">停止中</span>'}</div><div class="v12-annual-info">指定した月日以降に初めてこのHTMLを開いた際、対象生徒の学年を一括で繰り上げます（1年につき1回）。<b>ブラウザーを閉じている間は実行できません。</b>本番ではサーバーの定時処理が必要です。<br>小学6年→中学1年、中学3年→高校1年、高校3年→卒業（在籍状態は自動変更しません）。</div><form class="form-grid mt" onsubmit="v12SaveYearly(event)"><label class="field">次回の実施日（翌年以降は同月日に実行）<input type="date" name="nextRunDate" min="${v12CurrentTokyoDate()}" value="${esc(String(r.nextRunYear||2027)+'-'+r.monthDay)}" required></label><label class="field">自動更新<label class="checkline" style="margin-top:8px"><input type="checkbox" name="enabled" ${r.enabled?'checked':''}>有効にする</label></label><div class="row"><button type="submit" class="btn primary">設定を保存</button><button type="button" class="btn" onclick="v12ExecuteGradeNow()">現在の学年を手動で更新</button></div></form><div class="divider"></div><div class="row between"><h3>次回の更新対象：${rows.length}名</h3><span class="small muted">最終実行：${r.lastExecutedYear||'なし'}</span></div><div class="v12-preview-table tablewrap"><table><thead><tr><th>生徒</th><th>更新前</th><th>更新後</th><th>所属教室</th></tr></thead><tbody>${rows.slice(0,100).map(x=>`<tr><td>${esc(x.name)}</td><td>${esc(x.from)}</td><td><strong>${esc(x.to)}</strong></td><td>${esc(x.room)}</td></tr>`).join('')||'<tr><td colspan="4">更新対象はありません。</td></tr>'}</tbody></table></div><p class="small muted mt">過去の授業・成績・模試検定の履歴はそのまま残します。変更の履歴は「変更ログ」から確認できます。</p></section>`;}
const V12_prevMaster=renderMaster;
renderMaster=function(){if(extra.masterTab==='annual')return head('マスター管理','生徒・講師・教材・年次更新を設定します。')+`<div class="master-tabs">${[['students','生徒マスター'],['teachers','講師マスター'],['books','教材マスター'],['annual','年次更新']].map(([id,name])=>`<button class="${extra.masterTab===id?'on':''}" onclick="switchMasterTab('${id}')">${name}</button>`).join('')}</div>`+v12RenderAnnual();let html=V12_prevMaster();return html.replace(/(<div class="master-tabs">[\s\S]*?)(<\/div>)/,(_m,first,last)=>first+`<button onclick="switchMasterTab('annual')">年次更新</button>`+last);};
// Profile, exam displays and tables already use the normalized subject mapping.
// Report selectors: only offer subjects with a previously recorded lesson for selected pupils.
function v12ReportSubjects(){const ids=new Set(state.report.students||[state.student]);return [...new Set(db.lessons.filter(l=>ids.has(l.student)).map(l=>v12NormalizeSubject(l.subject)))].sort(v8Collate);}
const V12_prevReportScreen=renderReports;
renderReports=function(){const r=state.report,subs=v12ReportSubjects();if(r.subject&&!subs.includes(r.subject))r.subject=subs[0]||'';let html=V12_prevReportScreen(),values=option('','全教科（授業記録あり）',r.subject)+subs.map(x=>option(x,x,r.subject)).join('');
 html=html.replace(/(<label class="field">教科<select onchange="setReport\('subject',this.value\)">)[\s\S]*?(<\/select>)/,(_m,start,end)=>start+values+end);
 html=html.replace(/(<label class="field mt">手入力する教科<select onchange="v4SetManualSubject\(this.value\)">)[\s\S]*?(<\/select>)/,(_m,start,end)=>start+subs.map(x=>option(x,x,r.subject||v4ManualSubject())).join('')+end);
 return html.replace('<div class="report-layout">',`<p class="v12-report-description">選択した生徒に授業記録がある教科だけ表示します（${subs.length}教科）。対象生徒を変更すると候補も更新されます。</p><div class="report-layout">`);
};
const V12_priorToggleReportStudent=toggleReportStudent;
toggleReportStudent=function(id,on){V12_priorToggleReportStudent(id,on);const valid=v12ReportSubjects();if(state.report.subject&&!valid.includes(state.report.subject))state.report.subject=valid[0]||'';render();};
const V12_prevSetReport=setReport;
setReport=function(k,value){V12_prevSetReport(k,value);if(k==='students'||k==='from'||k==='to'||k==='subject')v12ScalePreviewSoon();};
// Preview: use real A4 width and scale the whole page to fit the iPad viewport.
let v12ResizingPreview=false;
function v12SizeReportPreview(){if(v12ResizingPreview)return;const host=document.getElementById('report-preview');if(!host||!host.isConnected||state.page!=='reports')return;v12ResizingPreview=true;try{
 host.classList.add('v12-print-preview');const available=Math.max(180,host.getBoundingClientRect().width-2),scale=Math.min(1,available/794);
 const pages=[...host.children].filter(p=>p.matches('.report-page'));
 pages.forEach(page=>{const f=document.createElement('div');f.className='v12-preview-frame';page.replaceWith(f);f.appendChild(page);});
 host.querySelectorAll('.v12-preview-frame').forEach(frame=>{const page=frame.querySelector('.report-page');if(!page)return;page.style.width='794px';page.style.transform=`scale(${scale})`;const naturalHeight=Math.max(1040,page.scrollHeight||0);frame.style.width=(794*scale)+'px';frame.style.height=(naturalHeight*scale)+'px';});
 }finally{v12ResizingPreview=false;}}
function v12ScalePreviewSoon(){requestAnimationFrame(()=>v12SizeReportPreview());}
const V12_prevRender=render;
render=function(){v12CheckAnnualPromotion();V12_prevRender();if(state.page==='reports')v12ScalePreviewSoon();};
const v12PreviewObserver=new MutationObserver(()=>{if(state.page==='reports')v12ScalePreviewSoon();});
v12PreviewObserver.observe(document.getElementById('report-preview')||document.getElementById('content'),{subtree:true,childList:true});
window.addEventListener('resize',()=>{if(state.page==='reports')v12ScalePreviewSoon();});
// Normalize term manual subjects when navigating to reports.
const V12_prevToReports=toReports;
toReports=function(fromHistory=false){V12_prevToReports(fromHistory);if(state.page==='reports')v12ScalePreviewSoon();};
// Keep multi-room student visibility consistent in barcode and today desk lists.
const V12_prevBarcodePrint=printBarcodes;
printBarcodes=function(ids){const arr=ids.map(safeStudent).filter(s=>v12HasRoom(s));if(!arr.length){toast('表示する教室に所属する生徒がいません');return}
 // Existing grade/individual barcode UI is reused; widen its room validation for dual-room students.
 let originalSchools=new Map(arr.map(s=>[s.id,s.school]));try{for(let s of arr)if(s.school!==currentRoom())s.school=currentRoom();return V12_prevBarcodePrint(arr.map(s=>s.id));}finally{for(let [id,old] of originalSchools)safeStudent(id).school=old;}
};
// On screen refresh, recheck draft-grade rules while avoiding unrequested mass changes.
v12CheckAnnualPromotion();
const v12Foot=document.querySelector('.sidebar-foot .tiny.muted');if(v12Foot)v12Foot.textContent='電子学プロ / Prototype 1.2';
document.title='学びのスキルカルテ v12｜複数教室・年次更新・iPad印刷対応';
persist();render();

/* ================= v13: staff authentication demo, attendance, tests, profile notes =================
   Prototype only: login/password and barcode validation live in local browser storage.
   Production requires server-backed authentication, independent audit store, device binding for passwordless login.
*/
const V13_SLOTS=['X','Y','Z','A','B','C','D'];
const V13_DEMO_PASS='demo2026';
let v13Auth=null;
const v13Attendance={month:TODAY.slice(0,7),teacher:'',addDate:TODAY};
const v13QualSort={key:'date',dir:'desc'};
let v13QualLevel='';
const v13SimpleHash=(input)=>{let h=2166136261;for(let i=0;i<input.length;i++){h^=input.charCodeAt(i);h=Math.imul(h,16777619);}return 'demo-'+(h>>>0).toString(16)};
function v13RandomBarcode(){let letters='ABCDEFGHJKLMNPQRSTUVWXYZ23456789',v='TL-';for(let i=0;i<12;i++)v+=letters[Math.floor(Math.random()*letters.length)];return v;}
if(!db.loginAccounts||!Array.isArray(db.loginAccounts))db.loginAccounts=[];
if(!Array.isArray(db.attendanceOverrides))db.attendanceOverrides=[];
if(!Array.isArray(db.profileObservations))db.profileObservations=[];
if(!db.profileObservationDrafts)db.profileObservationDrafts={};
for(let i=0;i<db.teachers.length;i++){
 const teacher=db.teachers[i];if(!db.loginAccounts.some(a=>a.teacherId===teacher.id)){
 const special=/教室長/.test(teacher.name)?'manager':/代表/.test(teacher.name)?'director':'teacher-'+String(i+1);
 db.loginAccounts.push({teacherId:teacher.id,loginId:special,passHash:v13SimpleHash(V13_DEMO_PASS),barcode:v13RandomBarcode(),active:teacher.active!==false,updatedAt:now()});
 }
}
persist();
const v13AccountByTeacher=(id)=>db.loginAccounts.find(a=>a.teacherId===id);
const v13LoggedTeacher=()=>v13Auth?db.teachers.find(t=>t.id===v13Auth.teacherId):null;
const v13Manager=()=>['教室長','代表'].includes(v13Auth?.role);
const v13ActivePerson=()=>v13LoggedTeacher()?.name||'未ログイン';
const V13_PREV_AUDIT=audit;
audit=function(type,studentId,subject,label,before,after){
 V13_PREV_AUDIT(type,studentId,subject,label,before,after);
 const log=db.audit[0];if(log){log.loginId=v13Auth?.loginId||'未ログイン';log.loginTeacherId=v13Auth?.teacherId||'';log.loginTeacherName=v13ActivePerson();log.actingTeacher=state.actor;log.sessionId=v13Auth?.sessionId||'';}
};
const V13_PREV_AUDITCARD=auditCard;
auditCard=function(x){let markup=V13_PREV_AUDITCARD(x);if(!x.loginId)return markup;return markup.replace('</summary>',`<div class="v13-audit-session">ログイン：${esc(x.loginTeacherName||'')}（ID: ${esc(x.loginId)}） ／ 入力担当：${esc(x.actingTeacher||x.actor||'')}</div></summary>`);};
const v13LoginHtml=`<div id="v13-login-screen" class="v13-login-screen" role="dialog" aria-modal="true" aria-labelledby="v13-login-title"><div class="v13-login-card"><div class="eyebrow">MANABI / STAFF SIGN-IN</div><h1 id="v13-login-title">学びのスキルカルテ</h1><p class="small muted">講師ログイン（モック）</p><div class="v13-login-tabs"><button id="v13-login-tab-password" class="on" type="button" onclick="v13SwitchLoginTab('password')">ログインID・パスワード</button><button id="v13-login-tab-barcode" type="button" onclick="v13SwitchLoginTab('barcode')">バーコード</button></div><form id="v13-login-password" onsubmit="v13LoginPassword(event)" class="stack"><label class="field">ログインID<input id="v13-login-id" required autocomplete="username" placeholder="例：manager"></label><label class="field">パスワード<input id="v13-login-pass" type="password" required autocomplete="current-password" placeholder="パスワード"></label><button class="btn primary" type="submit">ログイン</button></form><form id="v13-login-barcode" onsubmit="v13LoginBarcode(event)" class="stack" hidden><label class="field">ログイン用バーコードをスキャン<input id="v13-login-scan" autocomplete="off" placeholder="Bluetoothスキャナーの入力先"></label><p class="tiny muted">キーボード入力型Bluetoothスキャナーを想定しています。読取後にEnterでログインします。</p><button class="btn primary" type="submit">バーコードでログイン</button></form><p id="v13-login-error" class="v13-login-error" role="alert" aria-live="polite"></p><div class="v13-login-help"><b>動作確認用アカウント</b><br>教室長：<code>manager</code> ／ 講師A：<code>teacher-1</code><br>共通パスワード：<code>demo2026</code><br><button class="btn text small" type="button" onclick="v13ShowRecovery()">ログインできないとき</button></div><p class="tiny muted">注意：これは端末内だけのログイン画面デモです。個人情報の保護や本人認証には使用できません。バーコードの複製防止・失効・端末認証は本番開発が必要です。</p></div></div>`;
document.body.insertAdjacentHTML('beforeend',v13LoginHtml);
document.body.insertAdjacentHTML('beforeend','<div class="v13-board-shade" id="v13-board-shade" hidden><div class="v13-board-panel" role="dialog" aria-modal="true" aria-label="教室長からの伝言"><div id="v13-board-content"></div><button class="btn primary" type="button" onclick="v13CloseBoard()" style="width:100%;margin-top:15px">伝言を確認しました</button></div></div>');
function v13SwitchLoginTab(tab){document.getElementById('v13-login-password').hidden=tab!=='password';document.getElementById('v13-login-barcode').hidden=tab!=='barcode';for(let k of ['password','barcode'])document.getElementById('v13-login-tab-'+k).classList.toggle('on',tab===k);document.getElementById('v13-login-error').textContent='';(document.getElementById(tab==='password'?'v13-login-id':'v13-login-scan'))?.focus();}
function v13ShowRecovery(){document.getElementById('v13-login-error').textContent='教室長または代表が講師マスターからログインID・パスワード・バーコードを再発行します。管理者もログインできない場合は、本番システム運用担当による本人確認付き復旧が必要です。';}
function v13LoginPassword(event){event.preventDefault();let loginId=document.getElementById('v13-login-id').value.trim(),password=document.getElementById('v13-login-pass').value;let a=db.loginAccounts.find(x=>x.loginId===loginId&&x.active&&x.passHash===v13SimpleHash(password));if(!a)return v13BadLogin();v13LoginSuccess(a,'ID・パスワード');}
function v13LoginBarcode(event){event.preventDefault();let token=document.getElementById('v13-login-scan').value.toUpperCase().trim();let a=db.loginAccounts.find(x=>x.barcode===token&&x.active);if(!a)return v13BadLogin();v13LoginSuccess(a,'バーコード');}
function v13BadLogin(){const el=document.getElementById('v13-login-error');if(el)el.textContent='ログイン情報が一致しません。管理者に再発行を依頼してください。';}
function v13LoginSuccess(account,method){let t=db.teachers.find(x=>x.id===account.teacherId);if(!t||t.active===false)return v13BadLogin();
 v13Auth={teacherId:t.id,role:t.role,loginId:account.loginId,sessionId:'S-'+Date.now()+'-'+Math.random().toString(36).slice(2),method,at:now()};
 window.__v13_session_manager=v13Manager();
 if(!t.classrooms.includes(currentRoom())){db.activeRoom=t.classrooms[0]||CLASSROOMS[0];extra.roster.classroom=db.activeRoom;const sel=document.querySelector('.room-select');if(sel)sel.value=db.activeRoom;}
 state.actor=t.name;extra.desk.teacher=t.name;v13Attendance.teacher=t.id;state.page='home';
 document.getElementById('v13-login-screen').hidden=true;document.getElementById('v13-login-pass').value='';document.getElementById('v13-login-scan').value='';
 audit('ログイン','','','ログイン成功（'+method+'）','未認証','ログインアカウント：'+account.loginId);
 persist();updateActorChoices();render();v13OpenBoard();
}
function v13Logout(){if(!v13Auth)return;let previous=v13ActivePerson();audit('ログイン','','','ログアウト',previous,'ログアウト');persist();v13Auth=null;window.__v13_session_manager=false;v13CloseBoard();document.getElementById('v13-login-screen').hidden=false;document.getElementById('v13-login-id').value='';document.getElementById('v13-login-error').textContent='';v13SwitchLoginTab('password');}
function v13OpenBoard(){if(!v13Auth)return;let notes=announcementsForRoom();document.getElementById('v13-board-content').innerHTML=`<div class="eyebrow">NOTICE BOARD / ${esc(currentRoom())}</div><h2>教室長からの伝言</h2><p class="small muted">ログイン：${esc(v13ActivePerson())}</p><div class="v13-board-items">${notes.map(n=>`<article class="v13-board-item"><div class="row"><span class="badge ${n.urgent?'amber':'green'}">${n.urgent?'重要':'連絡'}</span><b>${esc(n.title)}</b></div><p class="small preline">${esc(n.body)}</p><p class="tiny muted">${stamp(n.updatedAt)} ／ ${esc(n.author)}</p></article>`).join('')||'<p class="small muted">現在の伝言はありません。</p>'}</div>`;document.getElementById('v13-board-shade').hidden=false;}
function v13CloseBoard(){document.getElementById('v13-board-shade').hidden=true;}
const V13_PREV_RENDER=render;
render=function(){
 if(!v13Auth)return;
 const attendance=state.page==='attendance';V13_PREV_RENDER();
 if(attendance){document.getElementById('content').innerHTML=v13RenderAttendance();document.body.classList.remove('workspace-mode');}
 const nav=document.getElementById('nav');const daily=nav?.querySelector('button[onclick="navigate(\'daily\')"] .navname');if(daily)daily.textContent='授業報告・提出';
 const desk=nav?.querySelector('button[onclick="navigate(\'desk\')"] .navname');if(desk)desk.textContent='授業準備・授業報告';
 if(nav&&!nav.querySelector('button[data-v13="attendance"]')){
  const b=document.createElement('button');b.type='button';b.className='navbtn '+(attendance?'active':'');b.dataset.v13='attendance';b.title='講師の出勤簿';b.innerHTML=icon('history')+'<span class="navname">講師の出勤簿</span>';b.onclick=()=>navigate('attendance');
  const before=nav.querySelector('button[onclick="navigate(\'master\')"]');nav.insertBefore(b,before||null);
 }
 const actor=document.querySelector('.topbar .actor');if(actor){const legacy=actor.querySelector(':scope > .tiny.muted');if(legacy)legacy.textContent='記録する講師（変更可）';let old=actor.querySelector('#v13-auth-info');if(old)old.remove();let el=document.createElement('div');el.id='v13-auth-info';el.className='v13-auth-info';el.innerHTML=`<div class="tiny muted">ログインID：<b>${esc(v13Auth.loginId)}</b><br>ログイン講師：${esc(v13ActivePerson())}</div><button class="btn small" type="button" onclick="v13OpenBoard()">伝言</button><button class="btn small" type="button" onclick="v13Logout()">ログアウト</button>`;actor.appendChild(el);}
 if(state.page==='profile')v13MountObservations();
};
v8AllowedPages.add('attendance');
const v13ActorSelect=document.getElementById('actor');v13ActorSelect.addEventListener('change',()=>{
 if(!v13Auth)return;
 const before=extra.desk.teacher; if(before!==state.actor){captureVisibleEditors();extra.desk.teacher=state.actor;storeView();if(state.page==='desk')render();}
 audit('担当者変更','','','操作画面の担当講師を変更','ログイン講師：'+v13ActivePerson(),'表示・入力担当：'+state.actor);
 persist();
});
// demo account maintenance: the person who logged in is kept separate from a manually switched instructor.
const V13_PREV_SAVE_TEACHER=saveTeacherForm;
saveTeacherForm=function(e,id){if(!v13Manager()){e.preventDefault();toast('講師アカウントの登録・変更は教室長・代表が行います。');return;}const snapshot=new FormData(e.target),name=String(snapshot.get('name')||'').trim();V13_PREV_SAVE_TEACHER(e,id);let t=id?db.teachers.find(x=>x.id===id):db.teachers.find(x=>x.name===name);if(t&&!v13AccountByTeacher(t.id)){let loginId='teacher-'+(db.teachers.indexOf(t)+1);while(db.loginAccounts.some(x=>x.loginId===loginId))loginId+='x';db.loginAccounts.push({teacherId:t.id,loginId,passHash:v13SimpleHash(V13_DEMO_PASS),barcode:v13RandomBarcode(),active:t.active!==false,updatedAt:now()});}else if(t){v13AccountByTeacher(t.id).active=t.active!==false;}persist();};
const V13_PREV_OPEN_TEACHER_FORM=openTeacherForm;
openTeacherForm=function(id=''){if(!v13Manager()){toast('講師マスターの変更は教室長・代表が行います。');return;}return V13_PREV_OPEN_TEACHER_FORM(id);};
masterTeachers=function(){let ts=roomTeachers().filter(t=>!extra.masterQ||norm(t.name+' '+t.kana).includes(norm(extra.masterQ)));return `<div class="card"><div class="master-toolbar"><div><span class="room-banner">${esc(currentRoom())}</span>　<b>講師マスター ${ts.length}名</b></div><button class="btn primary" onclick="openTeacherForm()">＋ 講師を登録</button></div><label class="field mb">講師検索<input type="search" value="${esc(extra.masterQ)}" oninput="extra.masterQ=this.value;render()" placeholder="氏名・ふりがな・ログインID"></label><div class="tablewrap"><table><thead><tr><th>講師</th><th>ログインID</th><th>役割</th><th>所属教室</th><th>利用</th><th>操作</th></tr></thead><tbody>${ts.map(t=>{let a=v13AccountByTeacher(t.id);return `<tr><td><b>${esc(t.name)}</b><div class="subcell">${esc(t.kana||'')}</div></td><td>${esc(a?.loginId||'未設定')}</td><td>${esc(t.role)}</td><td>${esc(t.classrooms.join('・'))}</td><td>${t.active?'利用中':'停止中'}</td><td><div class="row"><button class="btn small" onclick="openTeacherForm('${t.id}')" ${!v13Manager()?'disabled':''}>講師情報</button><button class="btn small" onclick="v13Credentials('${t.id}')">ログイン設定・バーコード</button></div></td></tr>`}).join('')}</tbody></table></div><p class="notice mt">ログイン認証・権限保護・カード失効は本番開発が必要です。操作モックでは共通のデモパスワードを使用します。</p></div>`;};
function v13Credentials(tid){let t=db.teachers.find(x=>x.id===tid),a=v13AccountByTeacher(tid);if(!t||!a)return;
 if(!v13Manager()){modal('ログイン用バーコードの確認',`<div class="notice">ログインID・パスワードの変更、バーコード再発行は教室長・代表が行います。</div>${t.id===v13Auth?.teacherId?`<div class="v13-barcode">${barcodeSVG(a.barcode,true)}<div>${esc(a.barcode)}</div></div>`:''}<button class="btn" onclick="closeModal()">戻る</button>`);return;}
 modal('講師ログイン設定｜'+t.name,`<form onsubmit="v13SaveCredentials(event,'${tid}')"><p class="notice mb">管理者用：本人確認後に再発行してください。バーコードは単独でログインできる「鍵」と同じなので、紛失時には必ず無効化・再発行してください。</p><label class="field">ログインID<input name="loginId" value="${esc(a.loginId)}" required pattern="[A-Za-z0-9_-]{3,40}"></label><label class="field mt">新パスワード（変更しない場合は空欄）<input name="newPass" type="password" minlength="8" autocomplete="new-password" placeholder="8文字以上"></label><div class="v13-barcode mt">${barcodeSVG(a.barcode,true)}<div>${esc(a.barcode)}</div></div><label class="checkline mt"><input type="checkbox" name="reissue">ログインバーコードを再発行して以前のコードを無効化</label><div class="formfooter"><button type="button" class="btn" onclick="v13PrintTeacherBarcode('${tid}')">A4カード印刷</button><button type="button" class="btn" onclick="closeModal()">閉じる</button><button class="btn primary">変更を保存</button></div></form>`);
}
function v13SaveCredentials(e,tid){e.preventDefault();if(!v13Manager())return;let a=v13AccountByTeacher(tid),f=new FormData(e.target),loginId=String(f.get('loginId')||'').trim(),pass=String(f.get('newPass')||'');if(db.loginAccounts.some(x=>x.teacherId!==tid&&x.loginId===loginId)){toast('そのログインIDは登録済みです');return;}let before={loginId:a.loginId,barcodeReissue:false};a.loginId=loginId;if(pass)a.passHash=v13SimpleHash(pass);if(f.get('reissue')==='on')a.barcode=v13RandomBarcode();a.updatedAt=now();audit('ログイン設定','','','講師アカウントを更新（秘密情報は記録しない）',before,{loginId:a.loginId,passwordChanged:!!pass,barcodeReissued:f.get('reissue')==='on'});persist();closeModal();render();toast('ログイン設定を更新しました。');}
function v13PrintTeacherBarcode(tid){let t=db.teachers.find(x=>x.id===tid),a=v13AccountByTeacher(tid);if(!t||!a)return;document.getElementById('print-root').innerHTML=`<section class="report-page v13-teacher-pass"><h1>講師ログインカード（デモ）</h1><h2>${esc(t.name)}</h2><p>ログインID：${esc(a.loginId)}</p><div class="v13-barcode">${barcodeSVG(a.barcode,true)}</div><p>バーコード紛失時は管理者が無効化・再発行してください。</p><p>※本カードは操作確認用です。実運用での認証情報として使用しないでください。</p></section>`;window.print();}
function v13TeacherIdByName(name){return db.teachers.find(t=>t.name===name)?.id||'';}
function v13AttendanceKey(teacherId,room,date){return [teacherId,room,date].join('|');}
function v13AttendanceSlots(teacherName,room,date){
 const teacherId=v13TeacherIdByName(teacherName),found=new Set();
 db.lessons.filter(l=>l.teacher===teacherName&&l.date===date&&V13_SLOTS.includes(l.slot)&&v12HasRoom(safeStudent(l.student),room)).forEach(l=>found.add(l.slot));
 const override=db.attendanceOverrides.find(o=>o.key===v13AttendanceKey(teacherId,room,date));return override?[...override.slots]:V13_SLOTS.filter(x=>found.has(x));
}
function v13AttendanceRows(){let t=db.teachers.find(x=>x.id===v13Attendance.teacher),room=currentRoom(),month=v13Attendance.month;
 if(!t)return [];
 let dates=new Set(db.lessons.filter(l=>l.teacher===t.name&&l.date?.startsWith(month)&&v12HasRoom(safeStudent(l.student),room)).map(l=>l.date));
 db.attendanceOverrides.filter(o=>o.teacherId===t.id&&o.room===room&&o.date.startsWith(month)).forEach(o=>dates.add(o.date));
 return [...dates].sort().map(date=>({date,slots:v13AttendanceSlots(t.name,room,date),corrected:!!db.attendanceOverrides.find(o=>o.key===v13AttendanceKey(t.id,room,date))}));
}
function v13RenderAttendance(){let ts=roomTeachers(),t=ts.find(x=>x.id===v13Attendance.teacher);if(!t){t=ts[0];v13Attendance.teacher=t?.id||'';}let rows=v13AttendanceRows(),total=rows.reduce((n,r)=>n+r.slots.length,0),days=rows.filter(r=>r.slots.length).length;
 return head('講師の出勤簿','登録された授業記録から出勤コマの候補を作ります。実際の出勤と異なる場合は、コマを手動で修正してください。',`<button class="btn primary" onclick="v13PrintAttendance()">A4で印刷</button><button class="btn" onclick="v13ExportAttendance()">CSVを出力</button>`)+`<div class="notice mb"><b>集計の根拠：</b>授業記録（未報告を含む）を元にした候補です。同じ日・同じコマに複数生徒がいても1コマとして数えます。欠勤・代講・授業記録がない出勤は、必ず確認して修正してください。</div><div class="card"><div class="toolbar"><label class="field">対象月<input type="month" value="${v13Attendance.month}" onchange="v13Attendance.month=this.value;v13Attendance.addDate=this.value+'-01';render()"></label><label class="field">対象講師<select onchange="v13Attendance.teacher=this.value;render()">${ts.map(x=>option(x.id,x.name,v13Attendance.teacher)).join('')}</select></label><span class="badge">教室：${esc(currentRoom())}</span><label class="field">出勤日を追加<input type="date" value="${esc(v13Attendance.addDate)}" onchange="v13Attendance.addDate=this.value"></label><button class="btn" onclick="v13AddAttendanceDate()">＋ 日付を追加</button></div></div><div class="metrics"><div class="metric"><small>月合計</small><div class="num">${total}<span>コマ</span></div></div><div class="metric"><small>出勤日数</small><div class="num">${days}<span>日</span></div></div><div class="metric"><small>出勤を確認する日</small><div class="num">${rows.length}<span>日</span></div></div></div><section class="card mt"><div class="section-title"><h2>${esc(t?.name||'')} の出勤記録</h2><span class="small muted">${esc(v13Attendance.month)} ／ コマ別に確認・修正</span></div><div class="tablewrap"><table class="v13-attend-table"><thead><tr><th>日付</th><th>コマ（X〜D）</th><th>日合計</th><th>集計方法</th><th>操作</th></tr></thead><tbody>${rows.map((r,i)=>`<tr><td class="nowrap">${fmt(r.date)}</td><td><div class="v13-slots">${V13_SLOTS.map(sl=>`<label><input type="checkbox" data-attend-date="${r.date}" value="${sl}" ${r.slots.includes(sl)?'checked':''}>${sl}</label>`).join('')}</div></td><td>${r.slots.length}コマ</td><td>${r.corrected?'手動修正':'授業記録から推定'}</td><td><button class="btn small" onclick="v13SaveAttendance('${r.date}')">この日の修正を保存</button></td></tr>`).join('')||'<tr><td colspan="5">この月の授業記録はありません。出勤日を追加できます。</td></tr>'}</tbody></table></div></section>`;
}
function v13SaveAttendance(date){let tid=v13Attendance.teacher,key=v13AttendanceKey(tid,currentRoom(),date),slots=[...document.querySelectorAll(`input[data-attend-date="${date}"]:checked`)].map(x=>x.value),old=db.attendanceOverrides.find(o=>o.key===key),data={key,teacherId:tid,room:currentRoom(),date,slots,updatedAt:now()};if(old)Object.assign(old,data);else db.attendanceOverrides.push(data);audit('出勤簿','','','出勤コマを手動で確認・修正',old?.slots||'授業記録から推定',slots);persist();render();toast('出勤コマの変更を保存しました。');}
function v13AddAttendanceDate(){const date=v13Attendance.addDate;if(!/\d{4}-\d{2}-\d{2}/.test(date)||!date.startsWith(v13Attendance.month)){toast('対象月の日付を指定してください');return;}let key=v13AttendanceKey(v13Attendance.teacher,currentRoom(),date);if(!db.attendanceOverrides.some(o=>o.key===key))db.attendanceOverrides.push({key,teacherId:v13Attendance.teacher,room:currentRoom(),date,slots:[],updatedAt:now()});persist();render();toast('日付を追加しました。出勤コマを選んで保存してください。');}
function v13AttendanceSummary(){const rows=v13AttendanceRows(),total=rows.reduce((x,r)=>x+r.slots.length,0),days=rows.filter(r=>r.slots.length).length,t=db.teachers.find(x=>x.id===v13Attendance.teacher);return {rows,total,days,teacher:t};}
function v13PrintAttendance(){const x=v13AttendanceSummary();document.getElementById('print-root').innerHTML=`<section class="report-page v13-attendance-print"><header><h1>講師 出勤簿</h1><p>${esc(currentRoom())}　${esc(v13Attendance.month)}　担当：${esc(x.teacher?.name||'')}</p></header><table><thead><tr><th>日付</th><th>担当コマ</th><th>日合計</th></tr></thead><tbody>${x.rows.filter(r=>r.slots.length).map(r=>`<tr><td>${fmt(r.date)}</td><td>${esc(r.slots.join(''))}</td><td>${r.slots.length}コマ</td></tr>`).join('')||'<tr><td colspan="3">この月の出勤記録はありません</td></tr>'}</tbody></table><div class="v13-attendance-totals"><span>月合計　<strong>${x.total}コマ</strong></span><span>出勤日数　<strong>${x.days}日</strong></span></div><p class="tiny muted">出勤コマは授業記録による候補と、画面で確認した手動修正による集計です。最終確認の上ご利用ください。</p></section>`;window.print();}
function v13ExportAttendance(){let x=v13AttendanceSummary(),rows=[['対象月','講師','教室','日付','担当コマ','日合計','月合計','出勤日数']];x.rows.filter(x=>x.slots.length).forEach(r=>rows.push([v13Attendance.month,x.teacher?.name||'',currentRoom(),r.date,r.slots.join(''),r.slots.length,x.total,x.days]));let csv='\ufeff'+rows.map(row=>row.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\r\n');let a=document.createElement('a'),url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.href=url;a.download=`出勤簿_${v13Attendance.month}_${x.teacher?.name||'講師'}.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);}
// Exam applications: explicit sortable columns; application status intentionally absent.
const V13_PREV_FILTERED_ENTRIES=v6FilteredEntries;
function v13SortValue(entry,key){let s=safeStudent(entry.studentId),e=v6Event(entry.eventId);switch(key){case 'student':return s?.kana||s?.name||'';case 'grade':return String(GRADES.indexOf(s?.grade));case 'category':return e?.category||'';case 'event':return e?.name||'';case 'date':return e?.date||'';case 'level':return entry.level||'';case 'applyAt':return entry.applyAt||'';case 'attendance':return entry.attendance||'';case 'result':return entry.result||'';case 'billing':return entry.billing||'';default:return '';}}
function v13SortEntries(rows){let dir=v13QualSort.dir==='asc'?1:-1,key=v13QualSort.key;return [...rows].sort((a,b)=>{if(key==='grade'){let x=GRADES.indexOf(safeStudent(a.studentId)?.grade),y=GRADES.indexOf(safeStudent(b.studentId)?.grade);return (x-y)*dir||(v6Event(b.eventId)?.date||'').localeCompare(v6Event(a.eventId)?.date||'');}return v13SortValue(a,key).localeCompare(v13SortValue(b,key),'ja',{numeric:true})*dir||(v6Event(b.eventId)?.date||'').localeCompare(v6Event(a.eventId)?.date||'');});}
v6FilteredEntries=function(){return v13SortEntries(V13_PREV_FILTERED_ENTRIES().filter(r=>!v13QualLevel||r.level===v13QualLevel));};
function v13SortQual(key){if(v13QualSort.key===key)v13QualSort.dir=v13QualSort.dir==='asc'?'desc':'asc';else{v13QualSort.key=key;v13QualSort.dir=key==='date'||key==='applyAt'?'desc':'asc';}render();}
function v13SortHeader(key,title){return `<button type="button" class="v13-sort-header" onclick="v13SortQual('${key}')">${title}<span aria-hidden="true">${v13QualSort.key===key?(v13QualSort.dir==='asc'?' ↑':' ↓'):' ⇅'}</span></button>`;}
v6EntriesTable=function(rows){let list=v13SortEntries(rows);return `<p class="small muted" style="margin:5px 0 12px">${list.length}件 ／ 各見出しを押すと昇順・降順を切り替えます</p><div class="tablewrap"><table class="v13-entries-table"><thead><tr>${[['student','生徒名'],['grade','学年'],['category','検定・模試'],['event','実施回'],['date','実施日時'],['level','受検級'],['applyAt','受付日'],['attendance','当日出欠'],['result','結果'],['billing','請求']].map(([key,label])=>`<th aria-sort="${v13QualSort.key===key?(v13QualSort.dir==='asc'?'ascending':'descending'):'none'}">${v13SortHeader(key,label)}</th>`).join('')}<th>操作</th></tr></thead><tbody>${list.map(r=>{let s=safeStudent(r.studentId),e=v6Event(r.eventId);if(!s||!e)return '';return `<tr><td><b>${esc(s.name)}</b></td><td>${esc(s.grade)}</td><td>${esc(e.category)}</td><td>${esc(e.name)}</td><td class="nowrap">${fmt(e.date)}${e.time?`<div class="subcell">${esc(e.time)}</div>`:''}</td><td>${esc(r.level||'—')}</td><td>${fmt(r.applyAt)}</td><td>${v6SmallBadge(r.attendance)}</td><td>${v6SmallBadge(r.result)}${r.score?`<div class="subcell">${esc(r.score)}</div>`:''}</td><td>${esc(r.billing||'—')}</td><td><button class="btn small" onclick="v6EntryForm('${r.id}')">編集</button></td></tr>`;}).join('')||'<tr><td colspan="11">この条件に該当する受験記録はありません。</td></tr>'}</tbody></table></div>`;};
function v13QualSummary(rows){
 const groups=new Map();for(const r of rows){const e=v6Event(r.eventId);if(!e)continue;const key=e.category+' | '+(r.level||'級指定なし');const entry=groups.get(key)||{label:key,n:0,attend:0,pass:0};entry.n++;if(r.attendance==='受験')entry.attend++;if(r.result==='合格')entry.pass++;groups.set(key,entry);}
 return `<div class="v13-summary-head"><b>級別集計</b><span class="small muted">表示中の${rows.length}件を集計</span></div><div class="row">${[...groups.values()].sort((a,b)=>a.label.localeCompare(b.label,'ja',{numeric:true})).map(g=>`<span class="badge">${esc(g.label)}　${g.n}名 ／ 受験済 ${g.attend}名 ／ 合格 ${g.pass}名</span>`).join('')||'<span class="small muted">該当する申込はありません</span>'}</div>`;
}
v6ApplicationsSection=function(){let f=v6ui;f.status='';return `<section class="card"><div class="section-title"><h2>模試・検定の受験者一覧</h2><div class="row"><button class="btn small" onclick="v6EntryForm()">＋ 個別申込</button><button class="btn small" onclick="v6ui.tab='bulk';render()">＋ 一括申込</button><button class="btn small" onclick="v6ExportEntries()">一覧CSV</button><button class="btn small" onclick="v6PrintEntries()">受験名簿印刷</button></div></div><div class="toolbar"><label class="field">実施回<select onchange="v6ui.event=this.value;render()">${option('','すべての実施回',f.event)}${v6EventOptions(f.event)}</select></label><label class="field">区分<select onchange="v6ui.type=this.value;render()">${option('','すべて',f.type)}${['模試','検定'].map(x=>option(x,x,f.type)).join('')}</select></label><label class="field">学年<select onchange="v6ui.grade=this.value;render()">${gradeOptions(f.grade)}</select></label><label class="field">受検級<select onchange="v13QualLevel=this.value;render()">${option('','すべての級',v13QualLevel)}${[...new Set(V13_PREV_FILTERED_ENTRIES().map(r=>r.level).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'ja',{numeric:true})).map(x=>option(x,x,v13QualLevel)).join('')}</select></label><label class="field">検索<input type="search" value="${esc(f.q)}" oninput="v6ui.q=this.value;v6RefreshEntryResults()" placeholder="生徒名・級・検定名"></label></div><div class="v13-level-summary">${v13QualSummary(v6FilteredEntries())}</div><div id="v6-entry-results">${v6EntriesTable(v6FilteredEntries())}</div></section>`;};
// Dedicated teacher observation notes in the skill profile (not overwriting lesson text).
function v13NoteKey(){return state.student+'|'+state.subject;}
function v13SaveNoteDraft(value){db.profileObservationDrafts[v13NoteKey()]=value;persist();const el=document.getElementById('v13-note-save-status');if(el)el.textContent='端末に下書き保存済み';}
function v13SaveObservation(){if(!v13Auth)return;const input=document.getElementById('v13-profile-note-input');if(!input)return;let value=input.value.trim();if(!value){toast('所見を入力してください。');return;}let row={id:uid('pn'),studentId:state.student,subject:state.subject,text:value,teacher:state.actor,account:v13Auth.loginId,at:now()};db.profileObservations.unshift(row);db.profileObservationDrafts[v13NoteKey()]='';audit('講師入力用所見',state.student,state.subject,'スキルカルテへ講師所見を記録','新規',value);persist();render();toast('講師所見を保存しました。');}
function v13MountObservations(){if(document.getElementById('v13-profile-observation'))return;const target=document.querySelector('#content .profilegrid');if(!target)return;let notes=db.profileObservations.filter(n=>n.studentId===state.student&&n.subject===state.subject).slice(0,12),draft=db.profileObservationDrafts[v13NoteKey()]||'';let section=document.createElement('section');section.id='v13-profile-observation';section.className='card mt';section.innerHTML=`<div class="section-title"><div><div class="eyebrow">TEACHER OBSERVATIONS</div><h2>講師入力用所見</h2></div><span class="badge">Dots評価用の参照記録</span></div><p class="small muted mb">生徒の良さ・学習方法・変化・課題などを自由に記録します。授業ごとの所見とは別の蓄積欄です。AIの自動評価はまだ行いません。</p><label class="field">${esc(state.subject)}についての講師所見<textarea id="v13-profile-note-input" rows="4" oninput="v13SaveNoteDraft(this.value)" placeholder="例：文章から条件を整理する力が伸びている。前月より自分から質問できるようになった。">${esc(draft)}</textarea></label><div class="row between mt"><span class="small muted" id="v13-note-save-status">入力途中も端末に保存</span><button class="btn primary" onclick="v13SaveObservation()">所見を記録する</button></div><div class="divider"></div><h3>所見の履歴</h3><div class="v13-observation-list" data-ai-source="teacher-observations">${notes.map(x=>`<article class="v13-observation" data-student="${esc(x.studentId)}" data-subject="${esc(x.subject)}"><p class="small preline">${esc(x.text)}</p><div class="tiny muted">${stamp(x.at)} ／ 入力担当：${esc(x.teacher)} ／ ログインID：${esc(x.account)}</div></article>`).join('')||'<p class="small muted">まだ所見はありません。</p>'}</div></section>`;target.insertAdjacentElement('afterend',section);}
// Student search: never assign a desk slot from the roster, only view history.
const V13_PREV_ROSTER_RESULTS=rosterResults;
rosterResults=function(){let html=V13_PREV_ROSTER_RESULTS();return html.replace(/<button[^>]*onclick="addStudentToDesk\('([^']+)'\)"[^>]*>[^<]*<\/button>/g,(_m,sid)=>`<button class="btn small primary" onclick="v13StudentHistory('${sid}')">授業履歴</button>`);};
function v13StudentHistory(id){state.student=id;state.subject=student(id).subjects?.[0]||'数学';state.history.subject='';state.history.from='';state.history.to='';rememberStudent(id);navigate('history');}
const v13Foot=document.querySelector('.sidebar-foot .tiny.muted');if(v13Foot)v13Foot.textContent='電子学プロ / Prototype 1.5';
document.title='学びのスキルカルテ v13｜出勤簿・講師ログイン・模試整理';
// Start signed-out on each HTML launch. No secure authentication is possible in a standalone local HTML file.
state.page='home';
document.getElementById('v13-login-screen').hidden=false;
setTimeout(()=>document.getElementById('v13-login-id')?.focus(),0);


/* v14: instructor work-period aggregation and concise operational copy.
   Demo only: records remain local to this browser. */
const V14_ROOM_ALL='__all_rooms__',V14_TEACHER_ALL='__all_teachers__';
const v14Attendance={
 month:v13Attendance.month||TODAY.slice(0,7),
 room:currentRoom(),teacher:V14_TEACHER_ALL,
 result:null,calculatedAt:'',filterKey:''
};
const v14Key=()=>[v14Attendance.month,v14Attendance.room,v14Attendance.teacher].join('|');
const v14RoomFromLesson=l=>{
 if(CLASSROOMS.includes(l.room))return l.room;
 if(CLASSROOMS.includes(l.classroom))return l.classroom;
 if(CLASSROOMS.includes(l.lessonRoom))return l.lessonRoom;
 const ss=db.sessions.filter(sess=>sess.date===l.date&&sess.slot===l.slot&&sess.teacher===l.teacher&&Array.isArray(sess.seats)&&sess.seats.some(x=>x?.student===l.student));
 const choices=[...new Set(ss.map(x=>x.room).filter(r=>CLASSROOMS.includes(r)))];
 if(choices.length===1)return choices[0];
 const s=safeStudent(l.student);
 return CLASSROOMS.includes(s?.school)?s.school:CLASSROOMS.includes(s?.classrooms?.[0])?s.classrooms[0]:'';
};
function v14TeacherOptions(){
 const list=[...(db.teachers||[]).map(t=>({id:t.id,name:t.name}))];
 for(const l of db.lessons){if(l.teacher&&!list.some(t=>t.name===l.teacher))list.push({id:'old:'+l.teacher,name:l.teacher});}
 return list.sort((a,b)=>a.name.localeCompare(b.name,'ja'));
}
// A lesson counts only if an actual student is present in its record. Planned seats alone never count.
function v14AttendanceAggregate(month){
 const map=new Map(),teacherLookup=new Map(v14TeacherOptions().map(t=>[t.name,t]));
 for(const l of db.lessons){
  if(!l||!l.date?.startsWith(month)||!V13_SLOTS.includes(l.slot))continue;
  if(l.absent===true||l.presence==='欠席'||l.attendance==='欠席'||l.studentStatus==='欠席')continue;
  const s=safeStudent(l.student);if(!s)continue;
  const room=v14RoomFromLesson(l);if(!room)continue;
  const teacher=teacherLookup.get(l.teacher);if(!teacher)continue;
  const key=[teacher.id,room,l.date,l.slot].join('|');
  if(!map.has(key))map.set(key,{teacherId:teacher.id,teacher:teacher.name,room,date:l.date,slot:l.slot,students:new Set(),ids:[]});
  const row=map.get(key);row.students.add(l.student);row.ids.push(l.id);
 }
 return [...map.values()].filter(x=>x.students.size>0).map(x=>({...x,studentCount:x.students.size,students:[...x.students]}));
}
function v14AttendanceReport(){
 const teachers=v14TeacherOptions();
 let slots=v14AttendanceAggregate(v14Attendance.month).filter(x=>(v14Attendance.room===V14_ROOM_ALL||x.room===v14Attendance.room)&&(v14Attendance.teacher===V14_TEACHER_ALL||x.teacherId===v14Attendance.teacher));
 const teacherMap=new Map();
 for(const teacher of teachers){if(v14Attendance.teacher!==V14_TEACHER_ALL&&v14Attendance.teacher!==teacher.id)continue;
  const rows=slots.filter(x=>x.teacherId===teacher.id);if(!rows.length&&v14Attendance.teacher===V14_TEACHER_ALL)continue;
  const dayMap=new Map();
  for(const x of rows){const k=[x.date,x.room].join('|');if(!dayMap.has(k))dayMap.set(k,{date:x.date,room:x.room,slots:[]});dayMap.get(k).slots.push(x);}
  const dayRows=[...dayMap.values()].map(x=>({...x,slots:x.slots.sort((a,b)=>V13_SLOTS.indexOf(a.slot)-V13_SLOTS.indexOf(b.slot)),count:x.slots.length,students:[...new Set(x.slots.flatMap(y=>y.students))].length})).sort((a,b)=>a.date.localeCompare(b.date)||CLASSROOMS.indexOf(a.room)-CLASSROOMS.indexOf(b.room));
  const uniquePeriods=new Set(rows.map(x=>[x.date,x.slot].join('|')));
  const uniqueDates=new Set(rows.map(x=>x.date));
  const rooms=CLASSROOMS.map(room=>({room,periods:rows.filter(x=>x.room===room).length,days:new Set(rows.filter(x=>x.room===room).map(x=>x.date)).size})).filter(r=>v14Attendance.room===V14_ROOM_ALL||r.room===v14Attendance.room);
  teacherMap.set(teacher.id,{teacher,rows:dayRows,total:uniquePeriods.size,days:uniqueDates.size,periods:rows.length,rooms});
 }
 const teacherReports=[...teacherMap.values()];
 const detailedRows=teacherReports.flatMap(t=>t.rows.map(x=>({...x,teacherId:t.teacher.id,teacher:t.teacher.name})));
 return {month:v14Attendance.month,room:v14Attendance.room,teacherId:v14Attendance.teacher,teachers:teacherReports,rows:detailedRows,total:teacherReports.reduce((sum,t)=>sum+t.total,0),days:teacherReports.reduce((sum,t)=>sum+t.days,0),teacherCount:teacherReports.filter(x=>x.total>0).length,duplicatePeriods:teacherReports.reduce((acc,t)=>acc+t.periods-t.total,0),roomTotals:CLASSROOMS.map(room=>({room,total:teacherReports.reduce((acc,t)=>acc+(t.rooms.find(r=>r.room===room)?.periods||0),0)})),excludedPlanned:true};
}
function v14SetAttendanceFilter(field,value){v14Attendance[field]=value;v14Attendance.result=null;v14Attendance.filterKey='';render();}
function v14CalculateAttendance(){v14Attendance.result=v14AttendanceReport();v14Attendance.calculatedAt=now();v14Attendance.filterKey=v14Key();render();toast('担当生徒が1名以上いるコマを集計しました。');}
function v14AttendanceReady(){return !!v14Attendance.result&&v14Attendance.filterKey===v14Key();}
const v14RoomTitle=room=>room===V14_ROOM_ALL?'全教室':room;
const v14TeacherTitle=()=>v14Attendance.teacher===V14_TEACHER_ALL?'全講師':v14TeacherOptions().find(t=>t.id===v14Attendance.teacher)?.name||'講師未指定';
const v14PeriodLabel=row=>row.slots.map(x=>x.slot+'（'+x.studentCount+'名）').join(' ・ ');
function v14RenderAttendance(){
 const result=v14AttendanceReady()?v14Attendance.result:null;
 const teacherOptions=v14TeacherOptions();
 const toolbar=`<div class="card v14-attendance-controls"><div class="toolbar"><label class="field">対象月<input type="month" value="${esc(v14Attendance.month)}" onchange="v14SetAttendanceFilter('month',this.value)"></label><label class="field">対象教室<select id="v14-room" onchange="v14SetAttendanceFilter('room',this.value)">${[...CLASSROOMS,V14_ROOM_ALL].map(r=>option(r,v14RoomTitle(r),v14Attendance.room)).join('')}</select></label><label class="field">対象講師<select id="v14-teacher" onchange="v14SetAttendanceFilter('teacher',this.value)">${option(V14_TEACHER_ALL,'全講師',v14Attendance.teacher)}${teacherOptions.map(t=>option(t.id,t.name,v14Attendance.teacher)).join('')}</select></label><button class="btn primary v14-calc" type="button" onclick="v14CalculateAttendance()">コマ数を集計</button><button class="btn" type="button" onclick="v14PrintAttendance()" ${!result?'disabled':''}>A4印刷</button><button class="btn" type="button" onclick="v14ExportAttendance()" ${!result?'disabled':''}>CSV出力</button></div></div>`;
 const output=!result?`<div class="card mt"><div class="empty">対象月・教室・講師を選び、「コマ数を集計」を押してください。</div></div>`:`<div class="v14-stats metrics"><div class="metric"><small>集計した担当コマ</small><div class="num">${result.total}<span>コマ</span></div></div><div class="metric"><small>出勤日数（講師別合計）</small><div class="num">${result.days}<span>日</span></div></div><div class="metric"><small>担当講師</small><div class="num">${result.teacherCount}<span>名</span></div></div><div class="metric"><small>対象の授業日別記録</small><div class="num">${result.rows.length}<span>行</span></div></div></div>
 ${result.duplicatePeriods>0?`<div class="notice amber mt">全教室集計で同一講師・同一日時のコマが複数教室に重なっています（${result.duplicatePeriods}件）。月合計は同じコマを1回として計上しています。教室別の内訳も確認してください。</div>`:''}
 <section class="card v14-attendance-result"><div class="section-title"><h2>${esc(v14Attendance.month)}｜${esc(v14RoomTitle(v14Attendance.room))}・${esc(v14TeacherTitle())}</h2><span class="badge green">集計済み</span></div>
 <div class="tablewrap"><table class="v14-attend-table"><thead><tr><th>日付</th><th>教室</th><th>講師</th><th>担当コマ（人数）</th><th>日合計</th><th>担当生徒（実人数）</th></tr></thead><tbody>${result.rows.map(x=>`<tr><td>${fmt(x.date)}</td><td>${esc(x.room)}</td><td>${esc(x.teacher)}</td><td class="v14-period-text">${esc(v14PeriodLabel(x))}</td><td><b>${x.count}コマ</b></td><td>${x.students}名</td></tr>`).join('')||'<tr><td colspan="6">該当する授業記録はありません。</td></tr>'}</tbody></table></div>
 <div class="v14-month-list"><h3>講師別の月合計</h3><div class="tablewrap"><table><thead><tr><th>講師</th><th>教室別のコマ数</th><th>月合計</th><th>出勤日数</th></tr></thead><tbody>${result.teachers.map(x=>`<tr><td><b>${esc(x.teacher.name)}</b></td><td>${x.rooms.map(y=>`${esc(y.room)} ${y.periods}コマ`).join(' ／ ')||'—'}</td><td>${x.total}コマ</td><td>${x.days}日</td></tr>`).join('')||'<tr><td colspan="4">対象記録なし</td></tr>'}</tbody><tfoot><tr><th>合計</th><td></td><th>${result.total}コマ</th><th>${result.days}日（延べ）</th></tr></tfoot></table></div></div>
 </section>`;
 return head('講師の出勤簿','担当生徒が1名以上いるコマのみ集計します。', '')+toolbar+output;
}
function v14AttendancePrintHtml(result){
 const roomTitle=v14RoomTitle(result.room),teacherName=result.teacherId===V14_TEACHER_ALL?'全講師':result.teachers[0]?.teacher.name||v14TeacherTitle();
 const summary=`<section class="report-page v14-attendance-print v14-attendance-summary"><header><h1>講師 出勤簿</h1><p>${esc(result.month)} ／ ${esc(roomTitle)} ／ ${esc(teacherName)}</p></header><div class="v14-print-metrics"><span>月合計 <strong>${result.total}コマ</strong></span><span>出勤日数 <strong>${result.days}日${result.teacherId===V14_TEACHER_ALL?'（延べ）':''}</strong></span></div><h3>講師別集計</h3><table><thead><tr><th>講師</th><th>教室内訳</th><th>月合計</th><th>出勤日数</th></tr></thead><tbody>${result.teachers.map(t=>`<tr><td>${esc(t.teacher.name)}</td><td>${t.rooms.map(r=>`${esc(r.room)} ${r.periods}コマ`).join(' / ')}</td><td>${t.total}</td><td>${t.days}</td></tr>`).join('')||'<tr><td colspan="4">対象の担当生徒記録はありません</td></tr>'}</tbody></table><footer>集計条件：担当生徒が1名以上いる授業記録。同じ講師の同日・同コマは一度だけ集計。</footer></section>`;
 const detail=result.teachers.map(t=>`<section class="report-page v14-attendance-print"><header><h1>講師 出勤簿｜${esc(t.teacher.name)}</h1><p>${esc(result.month)} ／ ${esc(roomTitle)}</p></header><table><thead><tr><th>日付</th><th>教室</th><th>担当コマ</th><th>日合計</th></tr></thead><tbody>${t.rows.map(r=>`<tr><td>${fmt(r.date)}</td><td>${esc(r.room)}</td><td>${esc(r.slots.map(x=>x.slot).join(''))}</td><td>${r.count}コマ</td></tr>`).join('')||'<tr><td colspan="4">担当記録なし</td></tr>'}</tbody></table><div class="v14-print-metrics"><span>月合計 <strong>${t.total}コマ</strong></span><span>出勤日数 <strong>${t.days}日</strong></span></div>${result.room===V14_ROOM_ALL?`<p class="small">${t.rooms.map(r=>`${esc(r.room)} ${r.periods}コマ`).join(' ／ ')}</p>`:''}</section>`).join('');
 return result.teacherId===V14_TEACHER_ALL?summary+detail:detail;
}
function v14PrintAttendance(){if(!v14AttendanceReady()){toast('先に「コマ数を集計」を押してください。');return;}document.getElementById('print-root').innerHTML=v14AttendancePrintHtml(v14Attendance.result);window.print();}
function v14ExportAttendance(){if(!v14AttendanceReady()){toast('先に「コマ数を集計」を押してください。');return;}const r=v14Attendance.result,table=[['年月','教室','講師','日付','担当コマ','コマ別生徒数','日合計']];for(const x of r.rows)table.push([r.month,x.room,x.teacher,x.date,x.slots.map(y=>y.slot).join(''),x.slots.map(y=>y.slot+':'+y.studentCount+'名').join(' / '),x.count]);table.push([]);table.push(['講師','対象教室','月合計コマ','出勤日数']);r.teachers.forEach(t=>table.push([t.teacher.name,v14RoomTitle(r.room),t.total,t.days]));table.push(['全対象合計',v14RoomTitle(r.room),r.total,r.days]);const csv='\ufeff'+table.map(a=>a.map(x=>'"'+String(x??'').replace(/"/g,'""')+'"').join(',')).join('\r\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`出勤簿_${r.month}_${v14RoomTitle(r.room)}_${v14TeacherTitle()}.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
// Persist an explicit classroom on newly submitted lesson records where possible.
const V14_PREV_SUBMIT_ENTRY=submitEntry;
submitEntry=function(token,intent){
 const draft=captureEntry(token),dates=new Map(db.lessons.map(l=>[l.id,l.updatedAt]));
 const response=V14_PREV_SUBMIT_ENTRY(token,intent);
 if(draft){const lesson=db.lessons.find(l=>l.student===draft.student&&l.subject===draft.subject&&l.date===draft.date&&l.slot===draft.slot&&l.teacher===draft.teacher);
  if(lesson&&lesson.updatedAt!==dates.get(lesson.id)&&!lesson.room){lesson.room=currentRoom();persist();}
 }
 return response;
};
const V14_PREV_BATCH_DRAFT=v8SubmitDraft;
v8SubmitDraft=function(item){
 const result=V14_PREV_BATCH_DRAFT(item);
 if(result){const d=item.d;const l=db.lessons.find(x=>x.student===d.student&&x.subject===d.subject&&x.date===d.date&&x.slot===d.slot&&x.teacher===d.teacher);if(l&&!l.room)l.room=currentRoom();}
 return result;
};
const V14_PREV_RENDER=render;
render=function(){
 if(!v13Auth)return;
 if(state.page==='attendance'){
  V14_PREV_RENDER();
  document.getElementById('content').innerHTML=v14RenderAttendance();
 }else V14_PREV_RENDER();
 v14CleanCopy(document.getElementById('content'));
};
// Keep the original open/edit behavior while suppressing the requested explanatory copy.
const V14_PREV_MODAL=modal;
modal=function(title,body){V14_PREV_MODAL(title,body);v14CleanCopy(document.getElementById('modal-body'));};
const V14_COPY_PHRASES=[
 '未入力（報告前に確認）','の「次回の指導内容」から自動反映。','複数登録可','教材名は手入力、または候補から選択できます。',
 'よく使う教材から選ぶか、教材名・範囲を直接入力できます。','宿題を出さない場合は下の補足欄に「なし」と入力してください。',
 '未定の場合は教材名・ページが空欄でも報告済みにできます。','決まっている場合は教材名とページを必ず入力してください。',
 '必要に応じて複数登録','下の保存・報告ボタンで申し送り欄へ反映。','対応済みになるまで表示します。保護者用には掲載しません。',
 '0〜100％を10％刻みで記録。','出題数・正答数の入力は不要です。','終業時の口頭報告は継続します。',
 '授業サンプルデータ入り','伝言を確認してから授業準備へ。','へのお知らせ。個別生徒の申し送りは専用欄で管理します。',
 '操作確認用モック：掲示板の投稿・データ保存は','学年・教室・氏名で検索。受講教科の登録は不要です。',
 '学年・教室・氏名で検索。授業の担当表や固定の組み合わせは登録しません。',
 '80名の架空データを用意しています。','申込→受験→結果→取得級・返却まで。',
 'Google Driveの「生徒学習カルテ」','合格を記録すると生徒カルテの取得級一覧へ反映。',
 '申込済みでも受験実績にはしません。','※架空の申込・結果データによる操作モックです。',
 '得点・平均点・偏差値を記録。','スキルの六角形は講師の確定評価から表示し、',
 'できることと成長を見つけ、次の指導につなげる。','さんの受験予定・受験実績・取得級を、その場で確認・変更できます。',
 '更新すると変更前後をログに保存','一度の所見から性格や得意な学び方を断定せず、',
 '点数・単元の到達度とは別の評価です。','テスト結果は六角形の学習スキル評価には自動変換されません。',
 '半年前も、前後の流れも。','内部共有のみ・保護者用の報告書には載りません。',
 '未報告・報告済みの2区分で管理。','報告の運用：','このモックは端末内保存のみです。',
 '確認しただけでは消さず、対応済みになるまで表示。','選択した生徒に授業記録がある教科だけ表示します',
 '期間・教科を選び、A4の報告書を作成。','保護者用です。内部メモや内部用の指導方針を、',
 '学プロ記録一覧：A4縦・2列×4行','どちらの方法でも本文は編集でき、','印刷画面で「PDFに保存」も選べます。',
 '印刷操作前の内容を保存します。','指定した月日以降に初めてこのHTMLを開いた際、',
 '小学6年→中学1年','受講教科の登録は不要です','印刷順の先頭：',
 '講師の実際のログイン・アクセス制御は本番開発で実装します。',
 '教材候補は学年・教科・属性で優先表示。','本番要件：ログは自動削除せず、継続保存。'
];
function v14IsCopy(s){return V14_COPY_PHRASES.some(p=>s.includes(p));}
function v14CleanCopy(root){if(!root)return;
 const selectors=['.pagehead p','.notice','.field-hint','.v10-decision > span','.v10-undecided-info','.v9-missing-notice','.v12-annual-info','.v12-report-description','.v11-demo-save-note','.desk-note','.mini-note','.draft-note','.tiny.muted','.small.muted','.small.muted.mt','.v13-attendance-detail','.v6-help','.v6-note','.v3-entry-note','.v6-disclaimer','.field-title-note'];
 const nodes=[...new Set(selectors.flatMap(s=>[...root.querySelectorAll(s)]))].sort((a,b)=>{if(a.contains(b))return 1;if(b.contains(a))return -1;return 0;});
 for(const el of nodes){if(!el.isConnected)continue;const value=(el.textContent||'').replace(/\s+/g,' ').trim();if(!v14IsCopy(value))continue;
  if(el.querySelector('input,select,textarea,button,a[href]')){
   const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);const parts=[];let n;while(n=walker.nextNode())parts.push(n);for(const textNode of parts){let v=textNode.nodeValue||'';for(const phrase of V14_COPY_PHRASES)if(v.includes(phrase))v=v.replaceAll(phrase,'');textNode.nodeValue=v;}
   continue;
  }
  el.remove();
 }
 // Short instructions appearing in other small text blocks.
 for(const el of root.querySelectorAll('p,span,div')){
  if(el.children.length||!el.textContent)continue;
  const text=el.textContent.trim();
  if(v14IsCopy(text)&&text.length<450&&!el.closest('table')){el.remove();}
 }
}
// Hide the long dynamic missing-fields sentence; actual validation and field color remain active.
const v14CopyStyle=document.createElement('style');v14CopyStyle.textContent='.v9-missing-notice{display:none!important}';document.head.appendChild(v14CopyStyle);
document.title='学びのスキルカルテ v14｜出勤コマ集計・表示整理';


/* v15: instructor-level lesson history directly in 授業準備・授業報告.
   Same fact source as v14 attendance: actual lesson records with an existing student,
   never scheduled seats or unsent editor drafts. */
const v15TeacherHistory={mode:'month', month:'', teacher:'', room:'', limit:35, rows:[], collapsed:false, defaultInitialized:false};
const v15SortSlots=(a,b)=>V13_SLOTS.indexOf(a.slot)-V13_SLOTS.indexOf(b.slot);
function v15TeacherFilter(){
 const w=extra.desk;
 const teacherName=v15TeacherHistory.teacher==='__all__'?'':(v15TeacherHistory.teacher||w.teacher);
 const room=v15TeacherHistory.room==='__all__'?'':(v15TeacherHistory.room||currentRoom());
 const month=v15TeacherHistory.month||w.date.slice(0,7);
 const day=w.date;
 return {teacherName,room,month,day,mode:v15TeacherHistory.mode};
}
function v15TeacherHistoryRows(){
 const f=v15TeacherFilter();
 const months=f.mode==='all'?[...new Set(db.lessons.map(l=>l.date?.slice(0,7)).filter(Boolean).concat(db.sessions.map(s=>s.date?.slice(0,7)).filter(Boolean)))]:[f.mode==='day'?f.day.slice(0,7):f.month];
 const actual=months.flatMap(m=>v14AttendanceAggregate(m)).filter(r=>(!f.teacherName||r.teacher===f.teacherName)&&(!f.room||r.room===f.room)&&(f.mode!=='day'||r.date===f.day));
 const periods=new Map();
 for(const a of actual){periods.set([a.teacherId,a.room,a.date,a.slot].join('|'),{...a,plannedStudents:[],missingStudents:[],kind:'recorded'});}
 for(const session of db.sessions||[]){
  if(!session||!session.date||!V13_SLOTS.includes(session.slot)||!months.includes(session.date.slice(0,7)))continue;
  if(f.mode==='day'&&session.date!==f.day)continue;
  if(f.room&&session.room!==f.room)continue;
  if(f.teacherName&&session.teacher!==f.teacherName)continue;
  const teacher=v14TeacherOptions().find(t=>t.name===session.teacher);if(!teacher)continue;
  const key=[teacher.id,session.room,session.date,session.slot].join('|');
  const planned=[...new Set((session.seats||[]).filter(Boolean).map(s=>s.student).filter(Boolean))];
  const row=periods.get(key)||{teacherId:teacher.id,teacher:teacher.name,room:session.room,date:session.date,slot:session.slot,students:[],studentCount:0,ids:[],plannedStudents:[],missingStudents:[],kind:'planned'};
  row.plannedStudents=[...new Set([...row.plannedStudents,...planned])];
  periods.set(key,row);
 }
 // On the selected day, show all seven slots even when there is no scheduled student.
 // This makes the difference between an empty period and a recorded lesson obvious.
 if(f.mode==='day'&&f.teacherName&&f.room){
  const teacher=v14TeacherOptions().find(t=>t.name===f.teacherName);
  if(teacher)for(const slot of V13_SLOTS){const k=[teacher.id,f.room,f.day,slot].join('|');if(!periods.has(k))periods.set(k,{teacherId:teacher.id,teacher:teacher.name,room:f.room,date:f.day,slot,students:[],studentCount:0,ids:[],plannedStudents:[],missingStudents:[],kind:'empty'});}
 }
 return [...periods.values()].map(x=>({...x,missingStudents:(x.plannedStudents||[]).filter(id=>!x.students.includes(id))})).sort((a,b)=>b.date.localeCompare(a.date)||v15SortSlots(a,b)||a.teacher.localeCompare(b.teacher,'ja')||a.room.localeCompare(b.room,'ja'));
}
function v15TeacherHistoryHTML(){
 const f=v15TeacherFilter(),rows=v15TeacherHistoryRows();v15TeacherHistory.rows=rows;
 const recorded=rows.filter(r=>r.studentCount>0);
 const uniquePeriods=new Set(recorded.map(r=>[r.teacherId,r.date,r.slot].join('|')));
 const uniqueDays=new Set(recorded.map(r=>[r.teacherId,r.date].join('|')));
 const recordedStudents=new Set(recorded.flatMap(r=>r.students));
 const plannedOnly=rows.filter(r=>r.studentCount===0&&r.plannedStudents.length);
 const tOpts=v14TeacherOptions();
 const names=(ids)=>ids.map(id=>{let s=safeStudent(id);return s?esc(s.name):'不明な生徒'});
 const count=Math.min(v15TeacherHistory.limit,rows.length);
 const body=rows.slice(0,count).map((r,i)=>{
  const ls=r.ids.map(id=>db.lessons.find(x=>x.id===id)).filter(Boolean);
  const students=[...new Set(ls.map(l=>l.student))].map(sid=>{
   let s=safeStudent(sid),subjects=[...new Set(ls.filter(l=>l.student===sid).map(l=>l.subject))];
   return `<div><b>${esc(s?.name||'不明な生徒')}</b><span class="v15-subject">${esc(subjects.join('・'))}</span></div>`;
  }).join('');
  const sent=ls.filter(x=>['報告済み','確認済み'].includes(x.status)).length;
  const unreported=ls.length-sent;
  const status=r.studentCount?`<span class="badge green">${r.studentCount}名・授業実績あり</span>`:(r.plannedStudents.length?'<span class="badge amber">予定のみ・未計上</span>':'<span class="badge">担当生徒0名</span>');
  const missed=r.missingStudents.length?`<div class="v15-missing">記録未作成：${names(r.missingStudents).join('、')}</div>`:'';
  return `<tr class="${r.studentCount?'':'v15-no-lesson'}"><td class="nowrap">${fmt(r.date)}<div class="subcell">${esc(r.room)}</div></td><td class="v15-slot"><b>${esc(r.slot)}</b></td><td>${esc(r.teacher)}</td><td>${status}${students?`<div class="v15-student-list">${students}</div>`:''}${missed}</td><td><span class="v15-count">${r.studentCount?'1':'0'}コマ</span><div class="subcell">${ls.length?`報告済み ${sent} / 未報告 ${unreported}`:'授業記録なし'}</div></td><td>${ls.length?`<button class="btn small" type="button" onclick="v15OpenTeacherPeriod(${i})">授業を見る</button>`:'—'}</td></tr>`;
 }).join('');
 const mode=v15TeacherHistory.mode;
 return `<div class="v15-instructor-head"><div><div class="eyebrow">INSTRUCTOR HISTORY</div><h2>講師の授業履歴・出勤確認</h2></div><div class="row"><button class="btn small" type="button" onclick="v15GoAttendance()">出勤簿で集計 ›</button><button class="btn small" type="button" onclick="v15ToggleHistory()">${v15TeacherHistory.collapsed?'履歴を開く':'折りたたむ'}</button></div></div>
 <div class="v15-instructor-toolbar">
  <div class="segmented" aria-label="表示する期間"><button class="${mode==='day'?'on':''}" type="button" onclick="v15SetTeacherHistory('mode','day')">選択日・全7コマ</button><button class="${mode==='month'?'on':''}" type="button" onclick="v15SetTeacherHistory('mode','month')">月別履歴</button><button class="${mode==='all'?'on':''}" type="button" onclick="v15SetTeacherHistory('mode','all')">全期間</button></div>
  ${mode==='month'?`<label class="field">対象月<input type="month" value="${esc(f.month)}" onchange="v15SetTeacherHistory('month',this.value)"></label>`:''}
  <label class="field">担当講師<select onchange="v15SetTeacherHistory('teacher',this.value)">${option('','授業画面で選択中の講師',v15TeacherHistory.teacher)}${option('__all__','全講師',v15TeacherHistory.teacher)}${tOpts.map(t=>option(t.name,t.name,v15TeacherHistory.teacher)).join('')}</select></label>
  <label class="field">教室<select onchange="v15SetTeacherHistory('room',this.value)">${option('','現在の教室',v15TeacherHistory.room)}${option('__all__','全教室',v15TeacherHistory.room)}${CLASSROOMS.map(room=>option(room,room,v15TeacherHistory.room)).join('')}</select></label>
 </div>
 <div class="v15-instructor-stats"><span><b>${uniquePeriods.size}</b> コマ</span><span><b>${uniqueDays.size}</b> 出勤日${f.teacherName?'':'（延べ）'}</span><span><b>${recordedStudents.size}</b> 名の生徒の記録</span>${plannedOnly.length?`<span class="v15-attention"><b>${plannedOnly.length}</b> コマは予定のみ</span>`:''}<span class="v15-clarify">同じコマの複数生徒は1コマとして計上</span></div>
 <div class="tablewrap"><table class="v15-teacher-table"><thead><tr><th>日付・教室</th><th>コマ</th><th>講師</th><th>担当生徒・教科</th><th>出勤判断・報告状態</th><th>確認</th></tr></thead><tbody>${body||'<tr><td colspan="6"><div class="empty">この条件で授業記録はありません。</div></td></tr>'}</tbody></table></div>
 ${rows.length>count?`<div class="v15-more"><button type="button" class="btn" onclick="v15ShowMoreHistory()">さらに30件表示（全${rows.length}件）</button></div>`:''}
 <p class="v15-footnote">授業記録があるコマだけを出勤簿と同じ方法で計上します。生徒の配置だけ・入力途中の未提出データは集計に含めません。</p>`;
}
function v15ToggleHistory(){v15TeacherHistory.collapsed=!v15TeacherHistory.collapsed;v15RefreshTeacherHistory();}
function v15SetTeacherHistory(field,value){v15TeacherHistory[field]=value;v15TeacherHistory.limit=35;v15RefreshTeacherHistory();}
function v15ShowMoreHistory(){v15TeacherHistory.limit+=30;v15RefreshTeacherHistory();}
function v15RefreshTeacherHistory(){const el=document.getElementById('v15-instructor-history');if(el){el.innerHTML=v15TeacherHistoryHTML();el.classList.toggle('is-folded',v15TeacherHistory.collapsed);}}
function v15MountTeacherHistory(){
 const root=document.getElementById('content');if(!root||document.getElementById('v15-instructor-history'))return;
 if(!v15TeacherHistory.defaultInitialized){if(v13Manager())v15TeacherHistory.teacher='__all__';v15TeacherHistory.defaultInitialized=true;}
 const panel=document.createElement('section');panel.className='card v15-instructor-card';panel.id='v15-instructor-history';panel.innerHTML=v15TeacherHistoryHTML();panel.classList.toggle('is-folded',v15TeacherHistory.collapsed);
 const near=root.querySelector('#v4-desk-list')||root.querySelector('.desk-grid');if(near)near.insertAdjacentElement('beforebegin',panel);else root.appendChild(panel);
}
function v15OpenTeacherPeriod(index){
 const row=v15TeacherHistory.rows[index];if(!row||!row.ids.length)return;
 const lessons=row.ids.map(id=>db.lessons.find(l=>l.id===id)).filter(Boolean).sort((a,b)=>(safeStudent(a.student)?.name||'').localeCompare(safeStudent(b.student)?.name||'','ja'));
 const cards=lessons.map(l=>{
  const s=safeStudent(l.student);
  return `<section class="v15-period-lesson"><div class="row between"><h3>${esc(s?.name||'生徒')}｜${esc(l.subject)}</h3><span class="badge ${['報告済み','確認済み'].includes(l.status)?'green':'amber'}">${['報告済み','確認済み'].includes(l.status)?'報告済み':'未報告'}</span></div>
  <div class="v15-period-fields"><div><b>単元</b><p>${esc(l.unit||'未記入')}</p></div><div><b>教材・ページ</b><p class="preline">${esc(materialsText(l)||[l.material,l.pages].filter(Boolean).join('　')||'未記入')}</p></div><div><b>所見・生徒の様子</b><p class="preline">${esc([l.obs,l.studentBehavior].filter(Boolean).join('\n')||'未記入')}</p></div><div><b>次回の指導</b><p class="preline">${esc(l.next||'未記入')}</p></div></div>
  <div class="row" style="justify-content:flex-end;margin-top:10px"><button type="button" class="btn small" onclick="closeModal();v13StudentHistory('${esc(l.student)}')">この生徒の授業履歴</button><button type="button" class="btn small" onclick="reviewLesson('${esc(l.id)}')">記録の詳細</button></div></section>`;
 }).join('');
 modal(`${fmt(row.date)}｜${esc(row.slot)}コマ・${esc(row.teacher)}`,`<p class="small muted mb">${esc(row.room)} ／ 担当生徒${row.studentCount}名 ／ 授業実績 1コマ</p>${cards}`);
}
function v15GoAttendance(){
 const f=v15TeacherFilter(),teacher=v14TeacherOptions().find(t=>t.name===f.teacherName);
 v14Attendance.month=f.mode==='day'?f.day.slice(0,7):f.mode==='month'?f.month:extra.desk.date.slice(0,7);
 v14Attendance.room=f.room||V14_ROOM_ALL;
 v14Attendance.teacher=f.teacherName?(teacher?.id||V14_TEACHER_ALL):V14_TEACHER_ALL;
 v14Attendance.result=null;
 navigate('attendance');v14CalculateAttendance();
}
const V15_PREV_RENDER=render;
render=function(){V15_PREV_RENDER();if(state.page==='desk'&&v13Auth)v15MountTeacherHistory();};
// When new records are saved from the same page, refresh the instructor history from the
// persisted source. The next full render also refreshes it naturally.
const V15_PREV_SUBMIT_ENTRY=submitEntry;
submitEntry=function(token,intent){const out=V15_PREV_SUBMIT_ENTRY(token,intent);if(state.page==='desk')v15RefreshTeacherHistory();return out;};
const V15_PREV_SUBMIT_DRAFT=v8SubmitDraft;
v8SubmitDraft=function(item){const out=V15_PREV_SUBMIT_DRAFT(item);if(state.page==='desk')v15RefreshTeacherHistory();return out;};
document.title='学びのスキルカルテ v15｜講師別授業履歴・出勤確認';

/* v16 - Past-day lesson integrity. Demo-only front-end gate; enforce again on server in production. */
function v16TodayJST(){return new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());}
function v16Past(date){return typeof date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(date)&&date<v16TodayJST();}
function v16Historical(date,old){return v16Past(date)||!!(old&&v16Past(old.date));}
function v16CanEditLesson(lesson){return !!lesson&&(!v16Past(lesson.date)||v13Manager());}
function v16CanWrite(date,old){return !v16Historical(date,old)||v13Manager();}
function v16Deny(){toast('昨日以前の授業は閲覧のみです。修正・追記・報告変更は教室長または代表へ依頼してください。');return false;}
function v16RecordForDraft(d){return d&&(d.id?db.lessons.find(l=>l.id===d.id):db.lessons.find(l=>l.student===d.student&&l.subject===d.subject&&l.date===d.date&&l.slot===d.slot&&l.teacher===d.teacher));}
function v16Reason(old,d,token){const root=token?editorRoot(token):null;let v=root?.querySelector('[name="v16CorrectionReason"]')?.value||d?._v16CorrectionReason||'';return String(v).trim();}
function v16Correction(lesson,before,reason,verb='修正'){
 if(!lesson||!reason||!v16Historical(lesson.date,before))return;
 const after=clone(lesson),beforeText=before?JSON.stringify(before,null,2):'記録なし（過去分の追加）';
 audit('過去授業の訂正',lesson.student,lesson.subject,`${fmt(lesson.date)} ${lesson.slot}コマの${verb}｜理由：${reason}`,beforeText,JSON.stringify(after,null,2));
 const log=db.audit[0];if(log){log.correctionReason=reason;log.lessonId=lesson.id;log.originalLessonDate=before?.date||'';log.originalRecord=before?clone(before):null;log.revisedRecord=after;}
 lesson.lastCorrectedAt=now();lesson.lastCorrectedBy=v13ActivePerson();lesson.lastCorrectionReason=reason;
 persist();
}
function v16ReadOnly(l){if(!l)return toast('授業記録が見つかりません。');const s=safeStudent(l.student);
 const row=(label,value)=>`<div class="v16-view-row"><dt>${esc(label)}</dt><dd class="preline">${esc(value||'—')}</dd></div>`;
 const next=v7NextText(l)||(l.nextUndecided?'未定':(l.next||''));
 modal('授業記録の閲覧｜'+(s?.name||'生徒'),`<div class="v16-locked-msg"><b>過去の授業：閲覧専用</b><div>昨日以前の授業の修正・追記は教室長または代表のみ行えます。</div></div><div class="row mb"><span class="badge blue">${fmt(l.date)} ${esc(l.slot)}コマ</span><span>${esc(l.teacher||'')}</span><span>${esc(l.subject||'')}</span><span>${statusBadge(l.status)}</span></div><dl class="v16-view-dl">${row('学習内容',l.unit)}${row('使用教材・ページ',materialsText(l)||[l.material,l.pages].filter(Boolean).join(' '))}${row('授業の様子・できたこと',l.obs)}${row('宿題',hwText(l)||l.homework)}${row('次回の指導内容',l.next)}${row('次回の教材・ページ',next)}${row('つまずき',(l.stumbles||[]).join('・'))}${row('見つけた良さ',(l.tags||[]).join('・'))}${row('申し送り',l.handoverText)}${row('生徒の様子（補足）',l.studentBehavior)}${row('記録者',l.updatedBy||l.teacher)}${l.lastCorrectedAt?row('管理者による訂正',`${stamp(l.lastCorrectedAt)}／${l.lastCorrectedBy}／${l.lastCorrectionReason}`):''}</dl><div class="formfooter"><button class="btn" onclick="closeModal()">閉じる</button></div>`);
}
const V16_PREV_RENDER_ENTRY=renderEntry;
renderEntry=function(d,token){
 const old=v16RecordForDraft(d),historical=v16Historical(d.date,old);
 if(historical&&!v13Manager())return `<section class="v16-locked-panel"><div class="v16-locked-msg"><b>過去の授業は閲覧専用です</b><div>講師は昨日以前の授業を変更できません。訂正が必要な場合は教室長または代表に依頼してください。</div></div><div class="row mt"><button class="btn small" type="button" onclick="${d.id?`openLesson(${JSON.stringify(d.id)})`:`deskHistory(${Number(String(token).slice(2))||0})`}">過去の記録を確認</button></div></section>`;
 let html=V16_PREV_RENDER_ENTRY(d,token);
 if(historical&&v13Manager()){
   const reason=`<label class="field v16-correction-reason">過去の授業の修正・追記理由 <span class="mark-required">必須</span><textarea name="v16CorrectionReason" rows="2" placeholder="例：記録と実際の指導内容に相違があったため。確認資料：教室長の業務日誌">${esc(d._v16CorrectionReason||'')}</textarea><span class="tiny muted">変更前後・ログインアカウント・理由を操作ログに記録します。</span></label>`;
   html=html.replace('<div class="sticky-save">',reason+'<div class="sticky-save">');
 }
 return html;
};
const V16_PREV_CAPTURE_ENTRY=captureEntry;
captureEntry=function(token){
 const root=editorRoot(token),d=getEditor(token);if(d&&root?.querySelector('[name="v16CorrectionReason"]'))d._v16CorrectionReason=root.querySelector('[name="v16CorrectionReason"]').value;
 if(d&&v16Historical(d.date,v16RecordForDraft(d))&&!v13Manager())return d;
 return V16_PREV_CAPTURE_ENTRY(token);
};
const V16_PREV_OPEN_LESSON=openLesson;
openLesson=function(id=''){
 if(id){const l=db.lessons.find(x=>x.id===id);if(l&&v16Past(l.date)&&!v13Manager())return v16ReadOnly(l);}
 return V16_PREV_OPEN_LESSON(id);
};
const V16_PREV_REVIEW_LESSON=reviewLesson;
reviewLesson=function(id){const l=db.lessons.find(x=>x.id===id);if(l&&v16Past(l.date)&&!v13Manager())return v16ReadOnly(l);return V16_PREV_REVIEW_LESSON(id);};
const V16_PREV_OPEN_DRAFT=v8OpenDraft;
v8OpenDraft=function(key){const d=db.deskDrafts[key];if(d&&v16Past(d.date)&&!v13Manager()){
   let old=v16RecordForDraft(d);return old?v16ReadOnly(old):v16Deny();
 }return V16_PREV_OPEN_DRAFT(key);
};
const V16_PREV_LESSON_CARD=lessonCard;
lessonCard=function(l,opts){let h=V16_PREV_LESSON_CARD(l,opts);if(v16Past(l.date)&&!v13Manager())h=h.replace('詳細・編集 ›','内容を閲覧 ›').replace('詳細・編集','内容を閲覧');return h;};
const V16_PREV_CAN_SEND=v8CanSend;
v8CanSend=function(it){
 if(!it?.d)return false;const d=it.d,old=v16RecordForDraft(d);
 return v16CanWrite(d.date,old)&&V16_PREV_CAN_SEND(it);
};
const V16_PREV_SUBMIT_ENTRY=submitEntry;
submitEntry=function(token,intent){
 const d=captureEntry(token);if(!d)return;
 const old=v16RecordForDraft(d),historical=v16Historical(d.date,old);
 if(!v16CanWrite(d.date,old))return v16Deny();
 let reason='';if(historical){reason=v16Reason(old,d,token);if(!reason){const inp=editorRoot(token)?.querySelector('[name="v16CorrectionReason"]');inp?.focus();toast('過去の授業を変更するには修正・追記理由を入力してください。');return;}}
 const before=old?clone(old):null,priorStamp=old?.updatedAt,priorId=old?.id;
 const result=V16_PREV_SUBMIT_ENTRY(token,intent);
 let saved=priorId?db.lessons.find(l=>l.id===priorId):v16RecordForDraft(d);
 if(historical&&saved&&(priorId?(saved.updatedAt!==priorStamp):true))v16Correction(saved,before,reason,before?'修正':'追記');
 return result;
};
// The legacy single-entry form is retained for compatibility; guard it too.
const V16_PREV_SAVE_LESSON=saveLesson;
saveLesson=function(e,id){
 const old=id?db.lessons.find(l=>l.id===id):null,form=e?.target,date=form?.querySelector('[name="date"]')?.value||old?.date||'';
 if(!v16CanWrite(date,old)){e?.preventDefault();return v16Deny();}
 let reason='';if(v16Historical(date,old)){reason=prompt('過去の授業を変更する理由を入力してください。')?.trim()||'';if(!reason){e?.preventDefault();toast('修正理由が必要です。');return;}}
 const before=old?clone(old):null,ids=new Set(db.lessons.map(l=>l.id));
 const ret=V16_PREV_SAVE_LESSON(e,id),after=old?db.lessons.find(l=>l.id===id):db.lessons.find(l=>!ids.has(l.id));
 if(reason&&after)v16Correction(after,before,reason,before?'修正':'追記');return ret;
};
let v16BatchReason=null;
const V16_PREV_BATCH_DRAFT=v8SubmitDraft;
v8SubmitDraft=function(it){const d=it?.d,old=v16RecordForDraft(d);if(!d||!v16CanWrite(d.date,old))return false;
 const historic=v16Historical(d.date,old),withinBatch=v16BatchReason!==null;
 let reason=withinBatch?v16BatchReason:'';
 if(historic&&!withinBatch){reason=prompt('過去の授業を登録・報告する理由を入力してください。')?.trim()||'';if(!reason)return false;}
 const before=old?clone(old):null,ret=V16_PREV_BATCH_DRAFT(it);
 if(ret&&historic&&!withinBatch){const saved=v16RecordForDraft(d);if(saved)v16Correction(saved,before,reason,before?'修正・報告':'追記・報告');}
 return ret;
};
const V16_PREV_BATCH_SELECT=v8SubmitSelected;
v8SubmitSelected=function(ids,allFlag=false){
 const set=new Set(ids),rows=v8DailyItems().filter(r=>allFlag||set.has(r.id));const old=rows.filter(r=>v8CanSend(r)&&v16Historical(r.d.date,v16RecordForDraft(r.d)));
 let reason='';if(old.length){reason=prompt(`昨日以前の授業${old.length}件を変更します。訂正理由を入力してください。`)?.trim()||'';if(!reason){toast('過去授業の変更には理由が必要です。');return;}}
 const originals=old.map(r=>({student:r.d.student,subject:r.d.subject,date:r.d.date,slot:r.d.slot,teacher:r.d.teacher,before:v16RecordForDraft(r.d)?clone(v16RecordForDraft(r.d)):null,stamp:v16RecordForDraft(r.d)?.updatedAt||''}));
 v16BatchReason=reason;try{V16_PREV_BATCH_SELECT(ids,allFlag)}finally{v16BatchReason=null;}
 originals.forEach(o=>{const lesson=db.lessons.find(l=>l.student===o.student&&l.subject===o.subject&&l.date===o.date&&l.slot===o.slot&&l.teacher===o.teacher);
 if(lesson&&(!o.before||o.stamp!==lesson.updatedAt))v16Correction(lesson,o.before,reason,o.before?'報告状態変更':'過去授業の追加');});
 if(originals.length)render();
};
// Prevent direct invocation of the obsolete approval transition on past records by teachers.
const V16_PREV_MARK_REVIEWED=markReviewed;
markReviewed=function(id){const l=db.lessons.find(x=>x.id===id);if(l&&v16Past(l.date)&&!v13Manager())return v16Deny();return V16_PREV_MARK_REVIEWED(id);};
// Provide an extra visible indication on every historical entry when viewing as staff.
const V16_PREV_V15_HISTORY=v15TeacherHistoryHTML;
v15TeacherHistoryHTML=function(){let html=V16_PREV_V15_HISTORY();if(!v13Manager())html=html.replace(/<th>確認<\/th>/,'<th>閲覧</th>');return html;};
document.title='学びのスキルカルテ v16｜過去授業の編集制限と訂正履歴';
// Make any correction visibly traceable from the lesson and attendance views.
const V16_PREV_RENDER_AUDIT=renderAudit;
renderAudit=function(){let h=V16_PREV_RENDER_AUDIT();const entry=option('過去授業の訂正','過去授業の訂正',state.audit.type);return h.replace('<option value="">すべて</option>','<option value="">すべて</option>'+entry);};
const V16_PREV_LESSON_CARD_BADGE=lessonCard;
lessonCard=function(l,opts){let h=V16_PREV_LESSON_CARD_BADGE(l,opts);if(!l.lastCorrectedAt)return h;return h.replace('</article>',`<div class="v16-corrected-badge"><b>管理者の訂正履歴あり</b>　${stamp(l.lastCorrectedAt)}　${esc(l.lastCorrectedBy||'')}</div></article>`);};
function v16OpenCorrections(){state.audit.type='過去授業の訂正';navigate('audit');}
function v16AttendanceCorrections(){
 const month=v14Attendance.month,room=v14Attendance.room,tid=v14Attendance.teacher;
 const selected=v14TeacherOptions().find(t=>t.id===tid)?.name;
 return db.audit.filter(log=>{
   if(log.type!=='過去授業の訂正')return false;
   const old=log.originalRecord||{},next=log.revisedRecord||{};
   if(![old.date,next.date].some(d=>String(d||'').slice(0,7)===month))return false;
   if(room!==V14_ROOM_ALL&&![old.room,next.room].includes(room))return false;
   if(tid!==V14_TEACHER_ALL&&![old.teacher,next.teacher].includes(selected))return false;
   return true;
 });
}
const V16_PREV_RENDER_ATTENDANCE=v14RenderAttendance;
v14RenderAttendance=function(){let h=V16_PREV_RENDER_ATTENDANCE(),n=v16AttendanceCorrections().length;if(!n)return h;const banner=`<div class="v16-locked-msg v16-attendance-notice"><b>対象月に過去授業の訂正 ${n}件</b><div>勤怠集計に影響する修正が含まれる可能性があります。必要に応じて変更前後と修正理由を確認してください。</div><button type="button" class="btn small" onclick="v16OpenCorrections()">訂正履歴を見る</button></div>`;return h.replace('<div class="card v14-attendance-controls">',banner+'<div class="card v14-attendance-controls">');};
const V16_PREV_V15_HISTORY_DETAILS=v15TeacherHistoryHTML;
v15TeacherHistoryHTML=function(){let h=V16_PREV_V15_HISTORY_DETAILS();v15TeacherHistory.rows.forEach((r,i)=>{if(!r.ids.some(id=>db.lessons.find(l=>l.id===id)?.lastCorrectedAt))return;const key=`onclick="v15OpenTeacherPeriod(${i})"`;h=h.replace(key,`title="訂正履歴のある授業を含みます" ${key}`);});return h;};


/* v17 - Show the pupils actually taught in the existing lesson panels.
   Instructor attendance HISTORY belongs only to the attendance view; the lesson desk
   itself displays student lesson cards for the selected room/date/slot/teacher. */
function v17ClassroomLessonRows(){
 const w=extra.desk;
 // Match the same source used to count real lessons in attendance, never a planned
 // seat on its own. A student with two subjects in the same period appears once.
 const matches=(db.lessons||[]).filter(l=>
   l&&l.date===w.date&&l.slot===w.slot&&l.teacher===w.teacher&&
   l.student&&safeStudent(l.student)&&
   v14RoomFromLesson(l)===currentRoom()&&
   l.absent!==true&&l.presence!=='欠席'&&l.attendance!=='欠席'&&l.studentStatus!=='欠席'
 ).sort((a,b)=>(b.updatedAt||'').localeCompare(a.updatedAt||'')||String(b.id).localeCompare(String(a.id)));
 const unique=new Map();
 for(const l of matches){if(!unique.has(l.student))unique.set(l.student,l);}
 const rank=s=>{let n=GRADES.indexOf(s?.grade||'');return n<0?999:n;};
 return [...unique.values()].sort((a,b)=>{
    const sa=safeStudent(a.student),sb=safeStudent(b.student);
    return rank(sa)-rank(sb)||String(sa?.kana||sa?.name||'').localeCompare(String(sb?.kana||sb?.name||''),'ja')
 });
}
function v17PopulateLessonPanels(){
 const w=extra.desk;
 const recorded=v17ClassroomLessonRows();
 if(!recorded.length)return;
 // Recorded pupils first, then any pupils the instructor already selected while
 // preparing this period. No attendance record is generated or edited here.
 const all=[],seen=new Set();
 for(const l of recorded){if(seen.has(l.student))continue;seen.add(l.student);all.push({student:l.student,subject:l.subject});}
 for(const seat of w.seats||[]){if(!seat||seen.has(seat.student)||!isSameRoom(seat.student))continue;seen.add(seat.student);all.push(clone(seat));}
 while(all.length<3)all.push(null);
 const different=JSON.stringify(all)!==JSON.stringify(w.seats);
 if(!different)return;
 w.seats=all;
 w.collapsed=all.map((seat,i)=>i!==0);
 w.focus=-1;
 extra.scrolls=all.map(()=>0);
 normalizeDesk();
 // Store only the desk's view state, not a timetable/session entry and not a
 // clock-in event. The instructor can continue to edit each pupil independently.
 db.deskView=clone(extra.desk);
 persist();
}
const V17_PREVIOUS_RESTORE_SESSION=restoreSession;
restoreSession=function(){
 V17_PREVIOUS_RESTORE_SESSION();
 v17PopulateLessonPanels();
};
let v17LastDeskContext='',v17LastLessonSignature='';
const V17_PREVIOUS_DESK=renderDesk;
renderDesk=function(){
 const w=extra.desk,key=[currentRoom(),w.date,w.slot,w.teacher].join('|');
 if(v17LastDeskContext!==key){
   v17LastDeskContext=key;
   // Initial visit and changes to the selected teaching period reload the correct
   // pupils; navigating to a different page does not destroy in-progress edits.
   restoreSession();
 }
 const recorded=v17ClassroomLessonRows();
 const signature=key+'|'+recorded.map(l=>l.id).join('|');
 if(signature!==v17LastLessonSignature){
    v17LastLessonSignature=signature;
    // If another view added a real lesson, expose that pupil on the next desk
    // render without introducing an attendance-history table.
    v17PopulateLessonPanels();
 }
 let html=V17_PREVIOUS_DESK().replace('授業準備・複数生徒表示','授業準備・授業報告');
 if(recorded.length&&!currentSession()){
   html=html.replace(/未登録\s*／\s*([0-9]+)名表示/,`授業記録あり ／ $1名表示`);
 }
 return html;
};
// Remove the v15 attendance-like table from the teaching workspace altogether.
// The separate instructor attendance/register page remains intact.
v15MountTeacherHistory=function(){document.getElementById('v15-instructor-history')?.remove();};
v15RefreshTeacherHistory=function(){document.getElementById('v15-instructor-history')?.remove();};
document.title='学びのスキルカルテ v17｜授業した生徒を授業欄へ自動表示';

