import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
import {webcrypto} from 'node:crypto';
import {createAvatar,getTraits,palettes,options} from '../dist/avatar.js';

// Lightweight DOM contract test, not a substitute for browser rendering or PNG export.
async function setup(){
 const ids=new Map(),created=[];
 class Element{
  constructor(tag='div'){this.tag=tag;this.children=[];this.listeners={};this.style={};this.attrs={};this.checked=false;this.value='';this.innerHTML='';created.push(this);}
  set id(value){this._id=value;ids.set(value,this);}get id(){return this._id;}
  append(...nodes){this.children.push(...nodes);}replaceChildren(...nodes){this.children=nodes;}
  setAttribute(k,v){this.attrs[k]=v;}addEventListener(k,v){this.listeners[k]=v;}
  scrollIntoView(){}remove(){}click(){this.onclick?.();}
 }
 for(const id of ['seed','status','avatar','palette-name','transparent','palettes','trait-controls','apply-seed','shuffle','reset','gallery','refresh-gallery','download-svg','download-png','trait-summary','playground']){const el=new Element();el.id=id;}
 const blobs=[];
 const document={getElementById:id=>ids.get(id),createElement:tag=>new Element(tag),querySelectorAll:selector=>selector==='.swatch'?created.filter(e=>e.className==='swatch'):[],body:new Element('body')};
 const ui=await readFile(new URL('../dist/app.js',import.meta.url),'utf8');
 runInNewContext(ui.replace(/^import .*?;\n/,''),{document,createAvatar,getTraits,palettes,URLSearchParams,location:{search:''},crypto:webcrypto,matchMedia:()=>({matches:true}),Blob,URL:{createObjectURL:blob=>{blobs.push(blob);return 'blob:test'},revokeObjectURL(){}},setTimeout:fn=>fn()});
 return {ids,created,blobs};
}
test('UI builds ten outfit and eleven accessory choices, with no independent necklace control',async()=>{
 const {ids}=await setup();assert.equal(ids.get('outfit').children.length,10);assert.equal(ids.get('accessory').children.length,11);assert.ok(!ids.has('jewelry'));assert.ok(ids.get('avatar').innerHTML.includes('<svg'));
});
test('every UI choice updates the renderer without dropping other selected traits',async()=>{
 const {ids}=await setup();ids.get('seed').value='ui-regression';ids.get('apply-seed').onclick();
 for(const key of ['hair','outfit','accessory'])for(let i=0;i<options[key];i++){
  ids.get(key).value=String(i);ids.get(key).onchange();assert.equal(ids.get(key).value,i);assert.ok(!/undefined|NaN/.test(ids.get('avatar').innerHTML));
 }
 assert.match(ids.get('avatar').innerHTML,/data-part="sunglasses"/);
 assert.equal(ids.get('hair').value,9);assert.equal(ids.get('outfit').value,9);
 ids.get('accessory').value='7';ids.get('accessory').onchange();assert.match(ids.get('avatar').innerHTML,/data-part="gold-chain"/);assert.ok(!ids.get('avatar').innerHTML.includes('data-part="sunglasses"'));
});
test('seed entry, reset, transparency, gallery and SVG download remain wired',async()=>{
 const {ids,blobs}=await setup();ids.get('seed').value='repeat-me';ids.get('seed').listeners.keydown({key:'Enter'});const first=ids.get('avatar').innerHTML;
 ids.get('shuffle').onclick();assert.notEqual(ids.get('avatar').innerHTML,first);
 ids.get('seed').value='repeat-me';ids.get('seed').listeners.change();assert.equal(ids.get('avatar').innerHTML,first);
 ids.get('transparent').checked=true;ids.get('transparent').onchange();assert.match(ids.get('avatar').innerHTML,/<rect[^>]+fill="none"/);
 ids.get('download-svg').onclick();assert.match(await blobs[0].text(),/width="1024"/);
 ids.get('reset').onclick();assert.equal(ids.get('avatar').innerHTML,first);
 assert.equal(ids.get('gallery').children.length,8);ids.get('gallery').children[0].onclick();assert.notEqual(ids.get('avatar').innerHTML,first);
 ids.get('refresh-gallery').onclick();assert.equal(ids.get('gallery').children.length,8);
});
