import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
import {webcrypto} from 'node:crypto';
import {createAvatar,getTraits,palettes,options,partNames,getEgg,eggs,nameDetails,nameFor,nameLocales,combinationCount} from '../dist/avatar.js';

// Lightweight DOM contract test, not a substitute for browser rendering or PNG export.
async function setup(search,globals={}){
 const ids=new Map(),created=[];
 class Element{
  constructor(tag='div'){this.tag=tag;this.children=[];this.listeners={};this.style={};this.attrs={};this.checked=false;this.value='';this.innerHTML='';this.hidden=false;this.classes=new Set();created.push(this);
   const classes=this.classes;this.classList={toggle:(c,on)=>on?classes.add(c):classes.delete(c)};}
  set id(value){this._id=value;ids.set(value,this);}get id(){return this._id;}
  append(...nodes){this.children.push(...nodes);}replaceChildren(...nodes){this.children=nodes;}
  setAttribute(k,v){this.attrs[k]=v;}getAttribute(k){return this.attrs[k]??null;}addEventListener(k,v){this.listeners[k]=v;}
  scrollIntoView(){}remove(){}click(){this.onclick?.();}
 }
 for(const id of ['seed','status','avatar','palette-name','transparent','palettes','trait-controls','apply-seed','shuffle','reset','gallery','refresh-gallery','download-svg','download-png','trait-summary','playground','logo','favicon','avatar-name','name-locale','egg-badge','download-gif','gif-sub','combination-count','sample-names','met-grid','eggs-switch','eggs-line']){const el=new Element();el.id=id;}
 const blobs=[],gifCalls=[];
 const docListeners={};
 const document={addEventListener:(k,v)=>{docListeners[k]=v;},getElementById:id=>ids.get(id),createElement:tag=>new Element(tag),querySelectorAll:selector=>selector==='.swatch'?created.filter(e=>e.className==='swatch'):[],body:new Element('body')};
 const ui=await readFile(new URL('../dist/app.js',import.meta.url),'utf8');
 runInNewContext(ui.replace(/^import .*?;\n/gm,''),{...globals,renderGif:async(svg,loop)=>{gifCalls.push(loop);return new Uint8Array([71,73,70]);},eggs,combinationCount,document,createAvatar,getTraits,palettes,partNames,getEgg,nameDetails,nameFor,nameLocales,URLSearchParams,location:{search:search||''},crypto:webcrypto,matchMedia:()=>({matches:true}),Blob,URL:{createObjectURL:blob=>{blobs.push(blob);return 'blob:test'},revokeObjectURL(){}},setTimeout:fn=>fn()});
 return {ids,created,blobs,docListeners,gifCalls};
}
test('UI builds one control per v4 trait from the generator part names',async()=>{
 const {ids}=await setup();
 for(const k of ['hairColor','hair','eyes','brows','mouth','outfit','accessory'])assert.equal(ids.get(k).children.length,options[k],k);
 assert.equal(ids.get('skin').children.length,options.skin);assert.equal(ids.get('eyes').children[0].textContent,partNames.eyes[0]);
 assert.ok(!ids.has('jewelry'));assert.ok(ids.get('avatar').innerHTML.includes('<svg'));
});
test('every UI choice updates the renderer without dropping other selected traits',async()=>{
 const {ids}=await setup();ids.get('seed').value='ui-regression';ids.get('apply-seed').onclick();
 for(const key of ['hair','eyes','mouth','outfit','accessory'])for(let i=0;i<options[key];i++){
  ids.get(key).value=String(i);ids.get(key).onchange();assert.equal(ids.get(key).value,i);assert.ok(!/undefined|NaN/.test(ids.get('avatar').innerHTML));
 }
 assert.match(ids.get('avatar').innerHTML,/data-part="mask"/);
 assert.equal(ids.get('hair').value,options.hair-1);assert.equal(ids.get('outfit').value,options.outfit-1);assert.equal(ids.get('mouth').value,options.mouth-1);
 ids.get('accessory').value='1';ids.get('accessory').onchange();assert.match(ids.get('avatar').innerHTML,/data-part="glasses"/);assert.ok(!ids.get('avatar').innerHTML.includes('data-part="mask"'));
});
test('seed entry, reset, transparency, gallery and SVG download remain wired',async()=>{
 const {ids,blobs}=await setup();ids.get('seed').value='repeat-me';ids.get('seed').listeners.keydown({key:'Enter'});const first=ids.get('avatar').innerHTML;
 ids.get('shuffle').onclick();assert.notEqual(ids.get('avatar').innerHTML,first);
 ids.get('seed').value='repeat-me';ids.get('seed').listeners.change();assert.equal(ids.get('avatar').innerHTML,first);
 ids.get('transparent').checked=true;ids.get('transparent').onchange();assert.match(ids.get('avatar').innerHTML,/<rect[^>]+fill="none"/);
 ids.get('download-svg').onclick();assert.match(await blobs[0].text(),/width="1024"/);
 ids.get('reset').onclick();assert.equal(ids.get('avatar').innerHTML,first);
 assert.equal(ids.get('gallery').children.length,10);ids.get('gallery').children[0].onclick();assert.notEqual(ids.get('avatar').innerHTML,first);
 ids.get('refresh-gallery').onclick();assert.equal(ids.get('gallery').children.length,10);
});
test('every character shows its seed name, and the header logo is a fresh generated character',async()=>{
 const {ids}=await setup('?seed=agent-68');
 assert.equal(ids.get('avatar-name').textContent,nameFor('agent-68'));
 assert.match(ids.get('name-locale').textContent,/(西语|中文|英文)名/);
 assert.ok(ids.get('avatar').attrs['aria-label'].startsWith(nameFor('agent-68')+' 的头像'));
 assert.match(ids.get('logo').src,/^data:image\/svg\+xml;charset=utf-8,%3Csvg/);
 assert.equal(ids.get('favicon').href,ids.get('logo').src);
 assert.match(ids.get('logo').title,/^今天的门面：/);
 const other=await setup('?seed=agent-68');assert.notEqual(other.ids.get('logo').src,ids.get('logo').src);
 for(const card of ids.get('gallery').children)assert.match(card.attrs['aria-label'],/^选择 /);
});
// Every string the page writes for people to see or hear.
const uiStrings=created=>created.flatMap(e=>[e.textContent,e.title,...Object.values(e.attrs)]).filter(v=>typeof v==='string');
const seedWith=id=>Array.from({length:5000},(_,i)=>'find-'+i).find(s=>getEgg(s)?.id===id);
test('a rare extra shows only as an icon and its own name',async()=>{
 const egg=getEgg('agent-68');assert.ok(egg);
 const {ids}=await setup('?seed=agent-68');
 assert.equal(ids.get('egg-badge').hidden,false);assert.equal(ids.get('egg-badge').textContent,'✦ '+egg.name);
 assert.ok(ids.get('avatar').innerHTML.includes('data-egg="'+egg.id+'"'));
 assert.match(ids.get('avatar').attrs['aria-label'],/，还在眨眼$/);
 ids.get('seed').value='agent-68';ids.get('apply-seed').onclick();
 assert.equal(ids.get('status').textContent,nameFor('agent-68')+' 来了，还在眨眼。');
 // matchMedia reports reduced motion in this harness, so no assembly animation is requested.
 assert.equal(ids.get('avatar').classes.has('assemble'),false);
 const plain=Array.from({length:200},(_,i)=>'plain-'+i).find(s=>!getEgg(s));
 ids.get('seed').value=plain;ids.get('apply-seed').onclick();
 assert.equal(ids.get('egg-badge').hidden,true);assert.ok(!ids.get('avatar').innerHTML.includes('data-egg'));
});
test('the page never names its extras as such and never states odds',async()=>{
 const html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8'),app=await readFile(new URL('../dist/app.js',import.meta.url),'utf8');
 const banned=/彩蛋|图鉴|1 ?\/ ?10|大约每|easter egg/i;
 assert.ok(!banned.test(html));assert.ok(!banned.test(app));
 // The only thing kept per browser is which surprises were met, under one key.
 assert.deepEqual([...app.matchAll(/localStorage\.(\w+)\(([A-Z_]+)/g)].map(m=>m[1]+':'+m[2]).sort(),['getItem:MET_KEY','setItem:MET_KEY']);
 const {ids,created}=await setup();const seen=[];
 for(const e of eggs){ids.get('seed').value=seedWith(e.id);ids.get('apply-seed').onclick();seen.push(...uiStrings(created));}
 for(let i=0;i<5;i++){ids.get('refresh-gallery').onclick();ids.get('shuffle').onclick();seen.push(...uiStrings(created));}
 ids.get('download-svg').onclick();seen.push(...uiStrings(created));
 for(const text of seen)assert.ok(!banned.test(text),text);
 assert.ok(seen.some(t=>/^✦ /.test(t)),'an icon-and-name badge was shown');
});
test('the R key shuffles unless the visitor is typing',async()=>{
 const {ids,docListeners}=await setup();const first=ids.get('avatar').innerHTML;
 docListeners.keydown({key:'r',target:{tagName:'INPUT'}});assert.equal(ids.get('avatar').innerHTML,first);
 docListeners.keydown({key:'r',ctrlKey:true,target:{tagName:'BODY'}});assert.equal(ids.get('avatar').innerHTML,first);
 docListeners.keydown({key:'r',target:{tagName:'BODY'}});assert.notEqual(ids.get('avatar').innerHTML,first);
});
test('every character can be saved as a GIF; only moving ones say 动图',async()=>{
 const {ids,blobs,gifCalls}=await setup('?seed=agent-68');
 assert.equal(ids.get('download-gif').hidden,false);assert.equal(ids.get('gif-sub').hidden,false);
 assert.equal(ids.get('download-gif').attrs['aria-label'],'下载 GIF 动图');
 await ids.get('download-gif').onclick();
 assert.equal(blobs.at(-1).type,'image/gif');assert.match(ids.get('status').textContent,/^GIF 动图已下载/);
 assert.ok(gifCalls.at(-1)>0);
 const plain=Array.from({length:200},(_,i)=>'still-'+i).find(s=>!getEgg(s));
 ids.get('seed').value=plain;ids.get('apply-seed').onclick();
 // Still: the button stays, the sublabel keeps its width but hides, and a one-frame GIF is saved.
 assert.equal(ids.get('download-gif').hidden,false);assert.equal(ids.get('gif-sub').hidden,true);
 assert.equal(ids.get('download-gif').attrs['aria-label'],'下载 GIF');
 await ids.get('download-gif').onclick();
 assert.equal(gifCalls.at(-1),0);assert.equal(blobs.at(-1).type,'image/gif');assert.match(ids.get('status').textContent,/^GIF 已下载/);
});
test('studio picks outfit main and accent colours and the hat pose, and shows the real count',async()=>{
 const {ids}=await setup('?seed=studio');
 assert.equal(ids.get('outfitColor').children.length,options.outfitColor);
 assert.equal(ids.get('outfitAccent').children.length,options.outfitAccent);
 assert.equal(ids.get('hatPose').children.length,3);
 ids.get('accessory').value='0';ids.get('accessory').onchange();assert.equal(ids.get('hatPose').disabled,true);
 ids.get('accessory').value='4';ids.get('accessory').onchange();assert.equal(ids.get('hatPose').disabled,false);
 ids.get('hatPose').value='1';ids.get('hatPose').onchange();assert.match(ids.get('avatar').innerHTML,/data-pose="1"/);
 ids.get('outfitColor').value='6';ids.get('outfitColor').onchange();
 ids.get('outfitAccent').value='12';ids.get('outfitAccent').onchange();
 assert.match(ids.get('avatar').innerHTML,/fill="#EDE6D8"/);assert.match(ids.get('avatar').innerHTML,/#993F37/);
 assert.equal(ids.get('combination-count').textContent,combinationCount.toLocaleString('en-US'));
 const html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');
 assert.ok(html.includes(`<span id="combination-count">${combinationCount.toLocaleString('en-US')}</span>`));
});
test('re-rolls never move the studio buttons: fixed caption, one-line text, floating egg chip',async()=>{
 const html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8'),css=await readFile(new URL('../dist/style.css',import.meta.url),'utf8');
 // The egg chip lives over the portrait frame, not in the caption's text flow.
 const stage=html.slice(html.indexOf('<div class="avatar-stage">'),html.indexOf('<div class="preview-caption">'));
 assert.ok(stage.includes('id="egg-badge"'));
 assert.ok(!html.slice(html.indexOf('<div class="preview-caption">'),html.indexOf('<button id="shuffle"')).includes('egg-badge'));
 assert.match(css,/\.egg-badge\{position:absolute;/);
 assert.match(css,/\.preview-caption\{[^}]*height:118px/);
 assert.match(css,/\.preview-caption>\*\{[^}]*white-space:nowrap;overflow:hidden;text-overflow:ellipsis/);
 assert.match(css,/\.avatar-name\{[^}]*height:36px/);
 // The GIF slot keeps its width when hidden, and gallery names never wrap.
 assert.match(css,/#gif-sub\[hidden\]\{display:inline;visibility:hidden\}/);
 assert.match(css,/\.card-name\{[^}]*white-space:nowrap;overflow:hidden;text-overflow:ellipsis/);
 // Truncated lines keep their full text as a tooltip.
 const {ids}=await setup('?seed=agent-68');
 assert.equal(ids.get('avatar-name').title,ids.get('avatar-name').textContent);
 assert.equal(ids.get('trait-summary').title,ids.get('trait-summary').textContent);
});
test('the header and footer show the official FULI wordmark, not typed text',async()=>{
 const html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');
 const brand=await readFile(new URL('../dist/brand/fuli-wordmark-en.svg',import.meta.url),'utf8');
 const paths=[...brand.matchAll(/ d="([^"]+)"/g)].map(m=>m[1]);
 const mark='<svg class="brand-mark" viewBox="0 0 750 204" aria-hidden="true" focusable="false"><g fill="#18181B">'+paths.map(d=>'<path d="'+d+'"/>').join('')+'</g></svg>';
 assert.equal(html.split(mark).length-1,2,'header and footer');
 assert.ok(html.includes('alt="" draggable="false">'+mark+'<span class="wordmark-light">/avatar</span></a>'));
 assert.ok(!/>\s*fuli\s*<span class="wordmark-light">/i.test(html));
 assert.ok(!html.includes('X:/'));
});
test('site copy: no stale SVG-only chip and no internal notes',async()=>{
 const html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');
 for(const stale of ['纯 SVG','独立实验','不修改现有','现有 FULI 头像'])assert.ok(!html.includes(stale),stale);
 assert.ok(html.includes('<span class="pill">SVG · PNG · GIF</span>'));
 assert.ok(!/footer>[\s\S]*FULI 头像/.test(html));
});
test('the intro shows three fresh sample names: one Spanish, one Chinese, one English',async()=>{
 // Given names each locale can produce, from the generator itself.
 const given={};for(const l of nameLocales){given[l]=new Set();for(let i=0;i<3000;i++)given[l].add(nameDetails('pool-'+i,{locales:[l]}).given);}
 const localeOf=n=>/^[一-鿿]{3}$/.test(n)?'zh':given.es.has(n.split(' ')[0])&&!given.en.has(n.split(' ')[0])?'es':given.en.has(n.split(' ')[0])?'en':'?';
 const seen=new Set(),orders=new Set();
 for(let k=0;k<12;k++){
  const {ids}=await setup();const text=ids.get('sample-names').textContent,names=text.split('、');
  assert.equal(names.length,3,text);
  assert.deepEqual(names.map(localeOf).sort(),['en','es','zh'],text);
  orders.add(names.map(localeOf).join());seen.add(text);
 }
 const html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');
 assert.ok(html.includes('<span id="sample-names">Lucía、林知夏、Milo</span>……'),'static fallback and the ellipsis stay');
 assert.ok(seen.size>8,'random on each load');assert.ok(orders.size>1,'random order');
});
test('decoration is never selectable or draggable',async()=>{
 const html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8'),css=await readFile(new URL('../dist/style.css',import.meta.url),'utf8');
 const rule=sel=>{const m=css.match(new RegExp('(^|\\n)([^{}\\n]*'+sel.replace(/[.*[\]()]/g,'\\$&')+'[^{}\\n]*)\\{([^}]*)\\}','g'));return (m||[]).join('\n');};
 for(const sel of ['h1 i','.spark','.ui-icon','.brand-mark','.egg-mark','.avatar svg','.gallery svg']){
  const r=rule(sel);
  assert.match(r,/-webkit-user-select:none;user-select:none/,sel);assert.match(r,/pointer-events:none/,sel);
 }
 assert.match(rule('.logo'),/user-select:none/);
 assert.match(html,/<img class="logo" id="logo" src="logo.svg" width="37" height="37" alt="" draggable="false">/);
 assert.match(html,/<h1>[\s\S]*<i aria-hidden="true"><svg viewBox="-50 -50 100 100" focusable="false">/);
});

test('the header links to the project on GitHub in a new tab',async()=>{
  const html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');
  const link=html.match(/<a class="github"[^>]*>/)?.[0]??'';
  assert.match(link,/href="https:\/\/github\.com\/JevonsCode\/fuli-avatar"/);
  assert.match(link,/target="_blank"/);
  assert.match(link,/rel="noopener"/);
  assert.match(html.slice(html.indexOf('<nav'),html.indexOf('</nav>')),/class="github"/);
});

test('the hero spin resumes from where it was before a reload',async()=>{
  const app=await readFile(new URL('../dist/app.js',import.meta.url),'utf8');
  assert.match(app,/sessionStorage\.getItem\(SPIN_KEY\)/);
  assert.match(app,/animationDelay=`-\$\{saved\}ms`/);
  assert.match(app,/addEventListener\?\.\('pagehide'/);
});

// A tiny in-memory localStorage stand-in.
const memoryStorage=(init={})=>{const m=new Map(Object.entries(init));return {getItem:k=>m.has(k)?m.get(k):null,setItem:(k,v)=>m.set(k,String(v)),dump:()=>Object.fromEntries(m)};};
test('the showcase has one fixed tile per surprise, black and nameless until met',async()=>{
 const {ids}=await setup('?seed='+Array.from({length:200},(_,i)=>'still-'+i).find(s=>!getEgg(s)));
 const grid=ids.get('met-grid');
 // The gallery may already have met some; count only what this page shows.
 assert.equal(grid.children.length,eggs.length);
 for(const [i,tile] of grid.children.entries()){
  assert.equal(tile.attrs['data-id'],eggs[i].id);
  assert.match(tile.innerHTML,new RegExp('data-egg="[a-z]+"'));
  const name=tile.children.find(c=>c.className==='met-name');
  if(tile.className==='met-tile'){assert.equal(name.textContent,'');assert.equal(tile.attrs['aria-label'],'突发状况：？？？');assert.ok(!/@keyframes/.test(tile.innerHTML),'unmet tiles are still');}
  else{assert.equal(tile.className,'met-tile found');assert.equal(name.textContent,'✦ '+eggs[i].name);}
 }
});
test('meeting a surprise in the studio reveals its tile and is remembered per browser',async()=>{
 const storage=memoryStorage();
 const {ids}=await setup('?seed=agent-68',{localStorage:storage});
 const egg=getEgg('agent-68'),tile=ids.get('met-grid').children.find(t=>t.attrs['data-id']===egg.id);
 assert.equal(tile.className,'met-tile found');assert.equal(tile.attrs['aria-label'],'突发状况：'+egg.name);
 assert.match(tile.innerHTML,/@keyframes/,'revealed tiles move');
 assert.ok(JSON.parse(storage.dump()['fuli-avatar.met']).includes(egg.id));
 // A later visit in the same browser starts with it revealed.
 const again=await setup('?seed='+Array.from({length:200},(_,i)=>'still-'+i).find(s=>!getEgg(s)),{localStorage:memoryStorage(storage.dump())});
 assert.equal(again.ids.get('met-grid').children.find(t=>t.attrs['data-id']===egg.id).className,'met-tile found');
 // Unknown or garbled stored values are ignored.
 const odd=await setup('?seed=still-0',{localStorage:memoryStorage({'fuli-avatar.met':'{"x":1}'})});
 assert.equal(odd.ids.get('met-grid').children.length,eggs.length);
});
test('the showcase survives storage that throws',async()=>{
 const broken={getItem(){throw Error('denied');},setItem(){throw Error('denied');}};
 const {ids}=await setup('?seed=agent-68',{localStorage:broken});
 const egg=getEgg('agent-68');
 assert.equal(ids.get('met-grid').children.length,eggs.length);
 assert.equal(ids.get('met-grid').children.find(t=>t.attrs['data-id']===egg.id).className,'met-tile found');
});
test('the showcase keeps a fixed size and cannot be selected',async()=>{
 const css=await readFile(new URL('../dist/style.css',import.meta.url),'utf8');
 assert.match(css,/\.met-grid\{[^}]*-webkit-user-select:none;user-select:none/);
 assert.match(css,/\.met-name\{height:18px;/);
 assert.match(css,/\.met-tile svg\{[^}]*filter:brightness\(0\)/);
 assert.match(css,/\.met-tile\.found svg\{filter:none;opacity:1\}/);
});
test('the integration switch shows the snippet with or without the moving extras',async()=>{
 const html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');
 assert.match(html,/<button id="eggs-switch" class="switch" role="switch" aria-checked="false">会动的小装饰/);
 assert.match(html,/<span id="eggs-line" hidden>  eggs: true,/);
 const {ids}=await setup();
 assert.equal(ids.get('eggs-line').hidden,false,'harness default');
 ids.get('eggs-switch').attrs['aria-checked']='false';ids.get('eggs-line').hidden=true;
 ids.get('eggs-switch').onclick();
 assert.equal(ids.get('eggs-switch').attrs['aria-checked'],'true');assert.equal(ids.get('eggs-line').hidden,false);
 ids.get('eggs-switch').onclick();
 assert.equal(ids.get('eggs-switch').attrs['aria-checked'],'false');assert.equal(ids.get('eggs-line').hidden,true);
});
test('the hero asterisk is four rounded sticks, each its own soft colour',async()=>{
 const html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8'),css=await readFile(new URL('../dist/style.css',import.meta.url),'utf8');
 const star=html.slice(html.indexOf('<i aria-hidden="true">'),html.indexOf('</i>'));
 assert.ok(!star.includes('✳'),'no text glyph');
 assert.match(star,/stroke-linecap="round"/);
 const sticks=[...star.matchAll(/<line x1="(-?[\d.]+)" y1="(-?[\d.]+)" x2="(-?[\d.]+)" y2="(-?[\d.]+)" stroke="(#[0-9A-F]{6})"\/>/g)];
 assert.equal(sticks.length,4);
 assert.equal(new Set(sticks.map(s=>s[5])).size,4,'four distinct colours');
 // All cross at the centre, at four different angles.
 for(const s of sticks)assert.equal(+s[1]+ +s[3],0),assert.equal(+s[2]+ +s[4],0);
 assert.equal(new Set(sticks.map(s=>Math.round(Math.atan2(+s[4],+s[3])*180/Math.PI+360)%180)).size,4);
 // Still the spinning, unselectable, non-interactive decoration the resume code finds as "h1 i".
 assert.match(css,/h1 i\{position:absolute;[^}]*animation:spin 40s linear infinite\}/);
 const app=await readFile(new URL('../dist/app.js',import.meta.url),'utf8');assert.ok(app.includes("document.querySelector?.('h1 i')"));
});
test('the showcase is titled 突发状况 with a deadpan line and no gentler names',async()=>{
 const html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8'),app=await readFile(new URL('../dist/app.js',import.meta.url),'utf8');
 assert.match(html,/<h2 id="met-title">突发状况<\/h2><p class="met-sub">刷新时可能会撞见。<\/p>/);
 for(const text of [html,app])assert.ok(!/小意外|彩蛋|概率|1 ?\/ ?\d+/.test(text));
});
