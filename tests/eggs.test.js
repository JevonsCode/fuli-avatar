import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {runInNewContext} from 'node:vm';
import {createAvatar,getEgg,eggs,eggRate,options} from '../dist/avatar.js';

const sha=s=>createHash('sha256').update(s).digest('hex');
const fixture=name=>readFile(new URL('./fixtures/'+name,import.meta.url),'utf8').then(JSON.parse);
// Removes the single <g data-egg> group (with nested groups) and the egg <style> block.
function stripEgg(svg){
 const start=svg.indexOf('<g data-egg=');if(start<0)return svg;
 let depth=0,i=start;
 for(;;){const open=svg.indexOf('<g',i),close=svg.indexOf('</g>',i);
  if(open>=0&&open<close){depth++;i=open+2;}else{depth--;i=close+4;if(!depth)break;}}
 return (svg.slice(0,start)+svg.slice(i)).replace(/<style>.*?<\/style>/,'');
}

test('v4 without eggs is byte-identical to the pre-egg snapshots',async()=>{
 const fixtures=await fixture('v4-snapshots.json');
 assert.equal(fixtures.length,20);
 for(const f of fixtures){
  assert.equal(sha(createAvatar(f.seed,f.opts)),f.sha256,f.seed);
  assert.equal(sha(createAvatar(f.seed,{...f.opts,eggs:false})),f.sha256,f.seed);
  assert.equal(sha(createAvatar(f.seed,{...f.opts,egg:'not-an-egg'})),f.sha256,f.seed);
 }
});
test('v3 ignores eggs and stays byte-identical',async()=>{
 for(const f of await fixture('v3-snapshots.json'))assert.equal(sha(createAvatar(f.seed,{...f.opts,version:3,eggs:true,egg:'blink'})),f.sha256,f.seed);
});
test('eggs are deterministic from the seed',()=>{
 for(let i=0;i<2000;i++){
  const s='egg-'+i;
  assert.deepEqual(getEgg(s),getEgg(s));
  assert.equal(createAvatar(s,{eggs:true}),createAvatar(s,{eggs:true}));
  // Whether an egg appears depends on the seed only; overrides can at most swap which one.
  assert.equal(Boolean(getEgg(s)),Boolean(getEgg(s,{accessory:4,hair:5})),s);
  const svg=createAvatar(s,{eggs:true}),egg=getEgg(s);
  if(egg)assert.ok(svg.includes(`<g data-egg="${egg.id}">`),s);else assert.equal(svg,createAvatar(s),s);
 }
});
test('about one in ten seeds carries an egg and every egg is reachable',()=>{
 assert.equal(eggRate,0.1);
 const seen=new Map();let n=0;
 for(let i=0;i<10000;i++){const e=getEgg('agent-'+i);if(e){n++;seen.set(e.id,(seen.get(e.id)||0)+1);}}
 assert.ok(n>800&&n<1200,String(n));
 assert.deepEqual([...seen.keys()].sort(),eggs.map(e=>e.id).sort());
 assert.equal(eggs.length,8);
 for(const e of eggs)assert.ok(e.id&&e.name&&e.en&&Object.isFrozen(e));
});
test('an egg only adds markup on top of the unchanged character',()=>{
 for(const e of eggs)for(let i=0;i<40;i++){
  const s='layer-'+i,svg=createAvatar(s,{egg:e.id});
  assert.equal(stripEgg(svg),createAvatar(s),e.id+' '+s);
 }
});
test('every egg renders well-formed on every hair and accessory, with a still pose for reduced motion',()=>{
 for(const e of eggs)for(let hair=0;hair<options.hair;hair++)for(let accessory=0;accessory<options.accessory;accessory++)for(const size of [32,256]){
  const svg=createAvatar('matrix',{egg:e.id,size,traits:{hair,accessory}});
  assert.ok(!/undefined|NaN|null|Infinity/.test(svg));
  assert.equal((svg.match(/<g[ >]/g)||[]).length,(svg.match(/<\/g>/g)||[]).length);
  assert.match(svg,/<g data-egg="[a-z]+">/);
  assert.match(svg,/@media \(prefers-reduced-motion:reduce\)\{\.fa-m\{animation:none!important\}/);
  assert.ok(svg.endsWith('</g></g></svg>'));
 }
});
test('eggs that do not fit the traits yield to another egg',()=>{
 assert.match(createAvatar('fit',{egg:'ahoge',traits:{accessory:4}}),/data-egg="clouds"/);
 assert.match(createAvatar('fit',{egg:'ahoge',traits:{hair:5,accessory:0}}),/data-egg="clouds"/);
 assert.match(createAvatar('fit',{egg:'tophat',traits:{accessory:3}}),/data-egg="hearts"/);
 assert.match(createAvatar('fit',{egg:'ahoge',traits:{hair:0,accessory:0}}),/data-egg="ahoge"/);
});
test('blinks rest open and keep a still wink when motion is reduced',()=>{
 const svg=createAvatar('wink',{egg:'blink'});
 assert.equal((svg.match(/class="fa-m fa-blink[^"]*" opacity="0"/g)||[]).length,2);
 assert.match(svg,/\.fa-wink\{opacity:1\}\}<\/style>/);
});
test('browser script exposes eggs and names with the same output',async()=>{
 const ctx={};runInNewContext(await readFile(new URL('../dist/fuli-avatar.browser.js',import.meta.url),'utf8'),ctx);
 const {nameFor}=await import('../dist/avatar.js');
 assert.equal(ctx.FuliAvatar.eggs.length,eggs.length);
 for(let i=0;i<100;i++){
  const s='bundle-'+i;
  assert.equal(ctx.FuliAvatar.createAvatar(s,{eggs:true}),createAvatar(s,{eggs:true}));
  assert.equal(ctx.FuliAvatar.nameFor(s),nameFor(s));
  assert.deepEqual(ctx.FuliAvatar.getEgg(s)?.id,getEgg(s)?.id);
 }
});
