import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
import {webcrypto} from 'node:crypto';
import {createAvatar,getTraits,palettes,options,partNames,getEgg,eggs,nameDetails,nameFor} from '../dist/avatar.js';

// Lightweight DOM contract test, not a substitute for browser rendering or PNG export.
async function setup(search){
 const ids=new Map(),created=[];
 class Element{
  constructor(tag='div'){this.tag=tag;this.children=[];this.listeners={};this.style={};this.attrs={};this.checked=false;this.value='';this.innerHTML='';this.hidden=false;this.classes=new Set();created.push(this);
   const classes=this.classes;this.classList={toggle:(c,on)=>on?classes.add(c):classes.delete(c)};}
  set id(value){this._id=value;ids.set(value,this);}get id(){return this._id;}
  append(...nodes){this.children.push(...nodes);}replaceChildren(...nodes){this.children=nodes;}
  setAttribute(k,v){this.attrs[k]=v;}addEventListener(k,v){this.listeners[k]=v;}
  scrollIntoView(){}remove(){}click(){this.onclick?.();}
 }
 for(const id of ['seed','status','avatar','palette-name','transparent','palettes','trait-controls','apply-seed','shuffle','reset','gallery','refresh-gallery','download-svg','download-png','trait-summary','playground','logo','favicon','avatar-name','name-locale','egg-badge','download-gif']){const el=new Element();el.id=id;}
 const blobs=[];
 const docListeners={};
 const document={addEventListener:(k,v)=>{docListeners[k]=v;},getElementById:id=>ids.get(id),createElement:tag=>new Element(tag),querySelectorAll:selector=>selector==='.swatch'?created.filter(e=>e.className==='swatch'):[],body:new Element('body')};
 const ui=await readFile(new URL('../dist/app.js',import.meta.url),'utf8');
 runInNewContext(ui.replace(/^import .*?;\n/gm,''),{renderGif:async()=>new Uint8Array([71,73,70]),document,createAvatar,getTraits,palettes,partNames,getEgg,nameDetails,URLSearchParams,location:{search:search||''},crypto:webcrypto,matchMedia:()=>({matches:true}),Blob,URL:{createObjectURL:blob=>{blobs.push(blob);return 'blob:test'},revokeObjectURL(){}},setTimeout:fn=>fn()});
 return {ids,created,blobs,docListeners};
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
 assert.match(ids.get('avatar').innerHTML,/data-part="hair-clip"/);
 assert.equal(ids.get('hair').value,options.hair-1);assert.equal(ids.get('outfit').value,options.outfit-1);assert.equal(ids.get('mouth').value,options.mouth-1);
 ids.get('accessory').value='1';ids.get('accessory').onchange();assert.match(ids.get('avatar').innerHTML,/data-part="glasses"/);assert.ok(!ids.get('avatar').innerHTML.includes('data-part="hair-clip"'));
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
test('the page never names or counts its extras and keeps no collection',async()=>{
 const html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8'),app=await readFile(new URL('../dist/app.js',import.meta.url),'utf8');
 const banned=/彩蛋|图鉴|1 ?\/ ?10|大约每|easter egg/i;
 assert.ok(!banned.test(html));assert.ok(!banned.test(app));
 assert.ok(!/localStorage|egg-dex|egg-progress/.test(app+html));
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
test('the GIF download appears only for characters that move',async()=>{
 const {ids,blobs}=await setup('?seed=agent-68');
 assert.equal(ids.get('download-gif').hidden,false);
 await ids.get('download-gif').onclick();
 assert.equal(blobs.at(-1).type,'image/gif');assert.match(ids.get('status').textContent,/^GIF 动图已下载/);
 const plain=Array.from({length:200},(_,i)=>'still-'+i).find(s=>!getEgg(s));
 ids.get('seed').value=plain;ids.get('apply-seed').onclick();
 assert.equal(ids.get('download-gif').hidden,true);
});
