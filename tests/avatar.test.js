import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {runInNewContext} from 'node:vm';
import {createAvatar,getTraits,options,combinationCount,partNames,VERSION,VERSIONS,v3} from '../dist/avatar.js';

const sha=s=>createHash('sha256').update(s).digest('hex');
const baseline=Object.fromEntries(Object.keys(options).map(k=>[k,0]));

test('render version 4 is the default and version 3 stays selectable',()=>{
 assert.equal(VERSION,'4');assert.deepEqual([...VERSIONS],['3','4']);
 assert.notEqual(createAvatar('x'),createAvatar('x',{version:3}));
 assert.equal(createAvatar('x',{version:3}),v3.createAvatar('x'));
});
test('v3 output is byte-identical to the stored snapshots',async()=>{
 const fixtures=JSON.parse(await readFile(new URL('./fixtures/v3-snapshots.json',import.meta.url),'utf8'));
 assert.equal(fixtures.length,13);
 for(const f of fixtures){
  assert.equal(sha(createAvatar(f.seed,{...f.opts,version:3})),f.sha256,f.seed);
  assert.deepEqual(getTraits(f.seed,f.opts.traits||{},{version:3}),f.traits,f.seed);
 }
});
test('deterministic across 1000 seeds',()=>{for(let i=0;i<1000;i++){assert.equal(createAvatar('agent-'+i),createAvatar('agent-'+i));assert.deepEqual(getTraits('agent-'+i),getTraits('agent-'+i));}});
test('thousands of distinct visible SVGs',()=>{const svg=new Set();for(let i=0;i<10000;i++)svg.add(createAvatar('agent-'+i));assert.ok(svg.size>9700,svg.size);});
test('v4 trait counts: friendly eyes and mouths only',()=>{
 assert.deepEqual({...options},{palette:6,skin:5,hairColor:6,hair:8,eyes:3,brows:3,mouth:3,outfit:7,accessory:7});
 assert.equal(combinationCount,Object.values(options).reduce((a,b)=>a*b,1));assert.equal(combinationCount,1905120);
 assert.deepEqual(partNames.eyes,['亮眼睛','笑眯眯','圆眼睛']);assert.deepEqual(partNames.mouth,['微笑','开心','坏笑']);
 for(const [k,n] of Object.entries(partNames))assert.equal(n.length,options[k],k);
});
test('trait ranges and overrides',()=>{
 for(let i=0;i<1000;i++)for(const [key,value] of Object.entries(getTraits(i)))assert.ok(Number.isInteger(value)&&value>=0&&value<options[key],key);
 assert.equal(getTraits('x',{hair:4}).hair,4);
 for(const bad of [-1,3,1.5,'1',null,NaN])assert.equal(getTraits('x',{eyes:bad}).eyes,getTraits('x').eyes);
});
test('overrides never reshuffle unrelated features',()=>{const a=getTraits('hello'),b=getTraits('hello',{palette:2});for(const k of Object.keys(options))if(k!=='palette')assert.equal(a[k],b[k]);});
test('untrusted input never interpolates into XML',()=>{
 for(const version of [3,4]){
  const svg=createAvatar('<script>alert(1)</script>',{version,size:'1 onload=alert(1)',traits:{palette:'red" onload="x',__proto__:{eyes:9}}});
  assert.ok(!svg.includes('<script'));assert.ok(!svg.includes('onload'));assert.ok(!/undefined|NaN|null/.test(svg));assert.match(svg,/width="256"/);
 }
 assert.match(createAvatar('x',null),/<svg/);assert.match(createAvatar('x',{traits:'bad'}),/<svg/);
});
test('transparent and square formats',()=>{assert.match(createAvatar('x',{transparent:true}),/<rect width="256" height="256" rx="36" fill="none"/);assert.match(createAvatar('x',{rounded:false}),/rx="0"/);assert.match(createAvatar('x',{size:1024}),/width="1024"/);});
test('every individual trait changes visible output',()=>{for(const [key,n] of Object.entries(options)){const set=new Set(Array.from({length:n},(_,i)=>createAvatar('x',{traits:{...baseline,[key]:i}})));assert.equal(set.size,n,key);}});
test('head and hair share one enlarged frame scaled about the chin',()=>{
 const svg=createAvatar('frame');
 assert.equal(svg.split('<g data-part="head" transform="matrix(1.15 0 0 1.15 -19.2 -27.3)">').length,3);
 assert.ok(svg.indexOf('data-part="hair-back"')<svg.indexOf('data-part="neck"'));
 assert.ok(svg.indexOf('data-part="outfit"')<svg.indexOf('data-part="face"'));
});
test('all hair, outfit and accessory combinations are well-formed',()=>{
 for(let hair=0;hair<options.hair;hair++)for(let outfit=0;outfit<options.outfit;outfit++)for(let accessory=0;accessory<options.accessory;accessory++)for(const size of [32,256]){
  const svg=createAvatar('matrix',{size,traits:{hair,outfit,accessory}});
  assert.ok(!/undefined|NaN|null/.test(svg));
  assert.equal((svg.match(/<g[ >]/g)||[]).length,(svg.match(/<\/g>/g)||[]).length);
  assert.ok(svg.endsWith('</g></g></svg>'));
 }
});
test('accessories are drawn over the face but never replace the eyes',()=>{
 for(let accessory=0;accessory<options.accessory;accessory++)for(let eyes=0;eyes<options.eyes;eyes++){
  const svg=createAvatar('acc',{traits:{...baseline,eyes,accessory}});
  const plain=createAvatar('acc',{traits:{...baseline,eyes,accessory:0}});
  const face=s=>s.match(/<g data-part="face">(.*?)<\/g>/)[1];
  assert.equal(face(svg),face(plain));
 }
 const glasses=createAvatar('g',{traits:{accessory:1}});assert.ok(glasses.indexOf('data-part="glasses"')>glasses.indexOf('data-part="face"'));
});
test('default eye is a dark oval with an upper-right catchlight and lid stroke',()=>{
 const svg=createAvatar('eye',{traits:{...baseline,eyes:0}});
 assert.match(svg,/<ellipse cx="106" cy="130" rx="8.5" ry="11" fill="#22303D"\/>/);
 assert.match(svg,/<circle cx="109.4" cy="125.5" r="2.8" fill="#FFFFFF"\/>/);
 assert.match(svg,/M97 121C100 115 110 114 116 119/);
});
test('every hairstyle breaks the silhouette with tufts and hangs fringe locks',()=>{
 for(let hair=0;hair<options.hair;hair++){
  const svg=createAvatar('hair',{traits:{...baseline,hair}});
  const back=svg.match(/<g data-part="hair-back">(.*?)<\/g>/)[1],front=svg.match(/<g data-part="hair-front">(.*?)<\/g>/)[1];
  assert.ok((back.match(/Q/g)||[]).length>=4,'tufts '+hair);
  assert.ok(front.indexOf('<path')<front.indexOf('opacity=".75"'),'locks and crown shine '+hair);
 }
});
test('32 px keeps outline, eyes, smile and silhouette but drops fine detail',()=>{
 for(let i=0;i<200;i++){
  const big=createAvatar('lod-'+i),small=createAvatar('lod-'+i,{size:32});
  assert.ok(small.length<big.length);
  assert.ok(!/r="2\.[46]"/.test(small),'buttons and strings');
  const style=getTraits('lod-'+i).hair;
  assert.ok(!small.includes('stroke-width="2.6"'),'inner strands and folds');
  assert.ok(!small.includes(['M110 96C112','M120 98C122','M104 100C120','M76 122C74','M110 92L118','M96 94C112','M86 70q6','M100 70C114'][style]),'hair strands '+style);
  assert.match(small,/stroke-width="4"/);assert.match(small,/data-part="hair-back"/);
  const mouth=['M117 152C123 159','M115 150C120 151','M117 153C123 158'][getTraits('lod-'+i).mouth];
  assert.ok(small.includes(mouth),'smile');assert.match(small,/data-part="face"><path d="M68 104/);
 }
});
test('browser script exposes the same API without dependencies',async()=>{
 const ctx={};runInNewContext(await readFile(new URL('../dist/fuli-avatar.browser.js',import.meta.url),'utf8'),ctx);
 assert.equal(ctx.FuliAvatar.VERSION,'4');assert.ok(Object.isFrozen(ctx.FuliAvatar));
 for(let i=0;i<100;i++){assert.equal(ctx.FuliAvatar.createAvatar('bundle-'+i),createAvatar('bundle-'+i));assert.equal(ctx.FuliAvatar.createAvatar('bundle-'+i,{version:3}),createAvatar('bundle-'+i,{version:3}));}
});
