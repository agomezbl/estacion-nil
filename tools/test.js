// Prueba de la Estación Nil en móvil, tableta y ordenador: modo sin cuenta y modo conectado
// (con un Supabase simulado). Uso: node tools/test.js  → capturas en shots/
const {chromium}=require('playwright');const path=require('path'),fs=require('fs'),http=require('http');
const ROOT=path.join(__dirname,'..');const SH=path.join(ROOT,'shots');fs.mkdirSync(SH,{recursive:true});
const srv=http.createServer((q,r)=>{let f=path.join(ROOT,decodeURIComponent(q.url.split('?')[0]));if(f.endsWith('/'))f+='index.html';fs.readFile(f,(e,d)=>{if(e){r.writeHead(404);r.end();return}
  r.writeHead(200,{'Content-Type':f.endsWith('.js')?'text/javascript':f.endsWith('.png')?'image/png':f.endsWith('.webmanifest')?'application/manifest+json':'text/html'});r.end(d)})}).listen(8766);
const CFG="window.ESTACION={supabaseUrl:'https://demo.supabase.co',supabaseKey:'k',rutinatorUrl:'https://rutinator.example'};";
/* Supabase falso: lo justo para lo que usa la Estación */
const FAKE=`(function(){const today=new Date();const ymd=d=>{const z=new Date(d.getTime()-d.getTimezoneOffset()*6e4);return z.toISOString().slice(0,10)};const di=(today.getDay()+6)%7;
 const m=today.getHours()*60+today.getMinutes();
 const DB={family_members:[{id:'m1',display_name:'Nil',role:'hijo',auth_user_id:'u1'}],
  tasks:[{id:'t1',title:'Hacer la cama',category:'mant',day_of_week:di,active:true,adhoc_date:null},{id:'t2',title:'Deberes',category:'oblig',day_of_week:di,active:true,adhoc_date:null},{id:'t3',title:'Tele',category:'ocio',day_of_week:di,active:true,adhoc_date:null},{id:'t4',title:'Ducha',category:'mant',day_of_week:di,active:true,adhoc_date:null}],
  task_status:[{task_id:'t1',status:'aprobado',date:ymd(today),member_id:'m1'},{task_id:'t2',status:'pendiente',date:ymd(today),member_id:'m1'}],
  ledger_entries:[{amount:30,currency:'credito',member_id:'m1'},{amount:12.5,currency:'credito',member_id:'m1'},{amount:4,currency:'estrella',member_id:'m1'}],
  calendar_events:[{id:'e1',date:ymd(today),time:'17:30',type:'cita',title:'Dentista'},{id:'e2',date:ymd(new Date(Date.now()+864e5*2)),time:null,type:'recordatorio',title:'Llevar la flauta',done:false}],
  schedule_blocks:[{day_of_week:di,start_min:Math.max(0,m-20),end_min:m+35,subject:'Mathématiques',room:'B12',type:'clase',parity:'todas'},{day_of_week:di,start_min:m+40,end_min:m+95,subject:'Technologie',room:'Lab 2',type:'clase',parity:'todas'}],
  settings:[{week_parity:'todas'}],estacion_items:[{id:'n1',member_id:'m1',kind:'note',title:'Examen de Pythagore',due:ymd(new Date(Date.now()+864e5)),done:false,created_at:new Date().toISOString()}],estacion_progress:[{member_id:'m1',game:'philoquest',device:'tablet',data:{xp:300,done:3,total:0,label:'3 llaves'}}]};
 window.__FAKEDB=DB;
 function Q(t){let rows=(DB[t]||[]).slice(),single=false,op='select',payload=null;const q={
  select(){return q},eq(k,v){if(op==='delete'){DB[t]=DB[t].filter(r=>r[k]!==v);return q}rows=rows.filter(r=>r[k]===v);return q},gte(k,v){rows=rows.filter(r=>r[k]>=v);return q},lte(k,v){rows=rows.filter(r=>r[k]<=v);return q},order(){return q},limit(){return q},maybeSingle(){single=true;return q},
  upsert(p){(Array.isArray(p)?p:[p]).forEach(x=>{const r=Object.assign({member_id:'m1',created_at:new Date().toISOString()},x);const i=DB[t].findIndex(y=>y.id&&y.id===r.id||(!y.id&&y.game===r.game&&y.device===r.device));if(i>=0)DB[t][i]=Object.assign(DB[t][i],r);else DB[t].push(r)});op='up';return q},
  delete(){op='delete';return q},
  then(res){res(op==='select'?{data:single?(rows[0]||null):rows,error:null}:{data:null,error:null})}};return q}
 let session=localStorage.getItem('fake-sess')?{user:{id:'u1'}}:null;
 window.supabase={createClient(){return {from:Q,rpc:(n,a)=>Promise.resolve(n==='verify_parent_pin'?{data:a.p_pin==='1234',error:null}:{data:null,error:null}),
  auth:{getSession:async()=>({data:{session}}),getUser:async()=>({data:{user:session&&session.user}}),
   signInWithPassword:async({email,password})=>{if(password!=='nil12345')return {error:{message:'Invalid login'}};session={user:{id:'u1'}};localStorage.setItem('fake-sess','1');return {error:null}},
   signOut:async()=>{session=null;localStorage.removeItem('fake-sess')}}}}};})();`;
const CHRONO={name:'Nil',xp:1250,introSeen:true,ch:{c1:{done:6,stars:{'1-1':3,'1-2':3},complete:true},c2:{done:6,stars:{},complete:true},c3:{done:3,stars:{},complete:false}},ach:{lab1:1,c1:1,c2:1},savedAt:Date.now()};
(async()=>{const b=await chromium.launch();const errs=[];const res=[];
 for(const mode of ['local','nube']){for(const vp of [{w:390,h:844,n:'movil'},{w:820,h:1180,n:'tableta'},{w:1180,h:820,n:'tableta-h'},{w:1440,h:900,n:'pc'}]){
  const ctx=await b.newContext({viewport:{width:vp.w,height:vp.h},hasTouch:vp.n!=='pc',isMobile:vp.n==='movil'});
  await ctx.route('**/supabase.min.js',r=>r.fulfill({contentType:'text/javascript',body:mode==='nube'?FAKE:''}));
  await ctx.route('**/config.js',r=>r.fulfill({contentType:'text/javascript',body:mode==='nube'?CFG:'window.ESTACION={}'}));
  await ctx.addInitScript(c=>{if(!localStorage.getItem('chrono-ohm-v1'))localStorage.setItem('chrono-ohm-v1',JSON.stringify(c))},CHRONO);
  const p=await ctx.newPage();p.on('pageerror',e=>errs.push(`${mode}/${vp.n}: ${e.message}`));p.on('console',m=>{if(m.type()==='error')errs.push(`${mode}/${vp.n} consola: ${m.text()}`)});
  await p.goto('http://localhost:8766/');await p.waitForTimeout(500);
  if(mode==='nube'){await p.screenshot({path:path.join(SH,`${vp.n}-login.png`)});await p.fill('#lgMail','nil@ejemplo');await p.fill('#lgPass','mal');await p.click('#lgGo');await p.waitForTimeout(200);
    const bad=await p.textContent('#lgMsg');await p.fill('#lgPass','nil12345');await p.click('#lgGo');await p.waitForTimeout(900);res.push(`${vp.n} login malo → «${bad}»`)}
  // nota nueva para mañana, marcar y borrar
  await p.fill('#noteIn','Traer la calculadora');await p.click('#dueChips [data-due="1"]');await p.click('#noteForm button[type=submit]');await p.waitForTimeout(200);
  await p.click('#notesList [data-tk]');await p.waitForTimeout(150);
  // editar enlaces con clave
  await p.click('#editLinks');await p.waitForTimeout(150);await p.fill('#pgIn',mode==='nube'?'1234':'abcd');await p.click('#pgOk');await p.waitForTimeout(300);
  const editing=await p.textContent('#editLinks');
  await p.click('#links [data-edit]');await p.waitForTimeout(150);await p.fill('#lkU','https://0081234a.index-education.net/pronote/eleve.html');await p.click('#lkOk');await p.waitForTimeout(200);await p.click('#editLinks');await p.waitForTimeout(200);
  const sw=await p.evaluate(()=>({sw:document.documentElement.scrollWidth,cw:document.documentElement.clientWidth}));
  const info=await p.evaluate(()=>({notes:__EST.S.notes.length,links:__EST.S.links.map(l=>l.title+':'+(l.url?'ok':'-')).join(','),games:[...document.querySelectorAll('.game .meta')].map(x=>x.textContent.trim()).join(' | '),rut:document.querySelector('#rutBox').textContent.replace(/\s+/g,' ').trim().slice(0,80),now:document.querySelector('#nowBox').textContent.replace(/\s+/g,' ').trim().slice(0,90),lvl:document.querySelector('#lvT').textContent,pending:__EST.S.pending.length,db:window.__FAKEDB?window.__FAKEDB.estacion_items.length:null}));
  res.push(`${mode}/${vp.n} edit=${editing} desborde=${sw.sw>sw.cw+1?sw.sw+'>'+sw.cw:'no'} ${JSON.stringify(info)}`);
  await p.screenshot({path:path.join(SH,`${mode}-${vp.n}.png`),fullPage:true});
  await ctx.close()}}
 res.forEach(x=>console.log(x));console.log('errores',errs.length,errs.slice(0,8));srv.close();await b.close()})();
