import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {runInNewContext} from 'node:vm';
import {createAvatar,getEgg,eggs,eggRate,options,freezeFrame} from '../dist/avatar.js';

const sha=s=>createHash('sha256').update(s).digest('hex');
const fixture=name=>readFile(new URL('./fixtures/'+name,import.meta.url),'utf8').then(JSON.parse);
// Removes every <g data-egg> group (with nested groups) and the egg <style> block.
function stripEgg(svg){
 for(let start;(start=svg.indexOf('<g data-egg='))>=0;){
  let depth=0,i=start;
  for(;;){const open=svg.indexOf('<g',i),close=svg.indexOf('</g>',i);
   if(open>=0&&open<close){depth++;i=open+2;}else{depth--;i=close+4;if(!depth)break;}}
  svg=svg.slice(0,start)+svg.slice(i);
 }
 return svg.replace(/<style>.*?<\/style>/,'');
}

test('v4 without eggs is byte-identical to the pre-egg snapshots',async()=>{
 const fixtures=await fixture('v4-snapshots.json');
 assert.equal(fixtures.length,20);
 for(const f of fixtures){
  for(const extra of [{},{eggs:false},{egg:'not-an-egg'},{animate:false}])assert.equal(sha(createAvatar(f.seed,{...f.opts,...extra,version:4})),f.sha256,f.seed);
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
test('existing seeds keep the egg they showed before eggs were added',async()=>{
 const known=await fixture('egg-ids.json');
 assert.ok(Object.keys(known).length>250);
 // The egg comes from the seed alone; only the fallback for a clashing egg depends on traits.
 for(const [seed,id] of Object.entries(known)){assert.equal(getEgg(seed,{},{version:4})?.id,id,seed);assert.ok(getEgg(seed),seed);}
 assert.equal(getEgg('hello-fuli').id,'star');assert.equal(getEgg('agent-68').id,'blink');
});
test('about one in eight seeds carries an egg and every egg is reachable',()=>{
 assert.equal(eggRate,0.125);
 const seen=new Map();let n=0;
 for(let i=0;i<10000;i++){const e=getEgg('agent-'+i);if(e){n++;seen.set(e.id,(seen.get(e.id)||0)+1);}}
 assert.ok(n>1050&&n<1450,String(n));
 assert.deepEqual([...seen.keys()].sort(),eggs.map(e=>e.id).sort());
 assert.equal(eggs.length,10);
 for(const e of eggs)assert.ok(e.id&&e.name&&e.en&&e.loop>0&&Object.isFrozen(e));
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
 // Music eggs replace plain headphones but never sit on a beanie (they wrap to the first egg).
 for(const id of ['hiphop','pop']){
  assert.match(createAvatar('fit',{egg:id,traits:{accessory:3}}),new RegExp('data-egg="'+id+'"'));
  assert.match(createAvatar('fit',{egg:id,traits:{accessory:4}}),/data-egg="blink"/);
 }
 // The hip-hop chain gives way to a scarf.
 assert.match(createAvatar('fit',{egg:'hiphop',traits:{accessory:0}}),/stroke-dasharray="4.5 2.5"/);
 assert.doesNotMatch(createAvatar('fit',{egg:'hiphop',traits:{accessory:5}}),/stroke-dasharray/);
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
test('music eggs move the head only inside their own SVG and rest still',()=>{
 for(const id of ['hiphop','pop']){
  const svg=createAvatar('music',{egg:id,traits:{accessory:0}});
  assert.ok(svg.includes(`svg:has([data-egg="${id}"]) [data-part="head"]{animation:`));
  assert.ok(svg.includes('svg [data-part="head"]{animation:none!important}}</style>'));
  // The head groups stay untouched markup; only CSS moves them.
  assert.equal(svg.split('<g data-part="head" transform="matrix(1.15 0 0 1.15 -19.2 -27.3)">').length,3);
 }
});
test('frame sampler pauses every animation at the requested time',()=>{
 const svg=createAvatar('frame',{egg:'hearts'}),freeze='svg{--fa-t:1.25s}svg *{animation-play-state:paused!important}';
 const frame=freezeFrame(svg,1.25);
 assert.ok(frame.includes('<style>'+freeze));
 assert.equal(frame.replace(freeze,''),svg);
 // Every animation delay reads the frame clock.
 const delays=svg.match(/animation-delay:[^;}]+/g);
 assert.ok(delays.length>0&&delays.every(d=>d.includes('var(--fa-t, 0s)')));
 assert.equal(freezeFrame(createAvatar('frame'),1),createAvatar('frame'));
 assert.ok(freezeFrame(svg,NaN).includes('--fa-t:0s'));
});
test('animate:false keeps the decoration and removes every animation',()=>{
 for(const e of eggs)for(const version of [4,5]){
  const moving=createAvatar('still',{egg:e.id,version}),still=createAvatar('still',{egg:e.id,version,animate:false});
  assert.ok(!/@keyframes|animation/.test(still),e.id);
  assert.match(still,/<g data-egg="[a-z]+">/);
  // Same picture: only the style block differs.
  assert.equal(still.replace(/<style>.*?<\/style>/,''),moving.replace(/<style>.*?<\/style>/,''));
 }
 // A blink holds a still wink instead of closing both eyes.
 assert.match(createAvatar('still',{egg:'blink',animate:false}),/<style>\.fa-wink\{opacity:1\}<\/style>/);
 assert.equal(createAvatar('still',{eggs:true,animate:false}),createAvatar('still',{eggs:true,animate:false}));
 assert.equal(createAvatar('plain',{animate:false}),createAvatar('plain'));
});
test('eggs work the same on v5 and skip hats and headphones under a mask',()=>{
 for(let i=0;i<3000;i++){const s='v5egg-'+i;assert.equal(Boolean(getEgg(s)),Boolean(getEgg(s,{},{version:4})),s);}
 for(const id of ['tophat','hiphop','pop'])assert.doesNotMatch(createAvatar('m',{egg:id,traits:{accessory:10}}),new RegExp('data-egg="'+id+'"'));
 // Sunglasses do not clash.
 assert.match(createAvatar('m',{egg:'tophat',traits:{accessory:7}}),/data-egg="tophat"/);
 assert.equal(getEgg('x',{},{version:3}),null);
});
