import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {runInNewContext} from 'node:vm';
import {createAvatar,getTraits,options,combinationCount,partNames,VERSION,VERSIONS,v3,v4} from '../dist/avatar.js';

// First seed of the form rare-N whose mask is the rare one.
const KNOWN_RARE='rare-35060';
const sha=s=>createHash('sha256').update(s).digest('hex');
const baseline=Object.fromEntries(Object.keys(options).map(k=>[k,0]));

test('render version 5 is the default and versions 4 and 3 stay selectable',()=>{
 assert.equal(VERSION,'5');assert.deepEqual([...VERSIONS],['3','4','5']);
 assert.notEqual(createAvatar('x'),createAvatar('x',{version:4}));
 assert.notEqual(createAvatar('x'),createAvatar('x',{version:3}));
 assert.equal(createAvatar('x',{version:3}),v3.createAvatar('x'));
 assert.equal(createAvatar('x',{version:4}),v4.createAvatar('x'));
 assert.equal(createAvatar('x',{version:'5'}),createAvatar('x'));
 assert.deepEqual(getTraits('x',{},{version:4}),v4.getTraits('x'));
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
test('trait counts: friendly eyes and mouths, two-colour outfits, masks and hat poses',()=>{
 assert.deepEqual({...options},{palette:6,skin:5,hairColor:6,hair:8,eyes:3,brows:3,mouth:3,outfit:7,outfitColor:14,outfitAccent:14,accessory:15,hatPose:3});
 // The hat pose only changes a beanie, so it multiplies that one accessory, not all eleven.
 const others=Object.entries(options).filter(([k])=>k!=='accessory'&&k!=='hatPose').reduce((a,[,n])=>a*n,1);
 assert.equal(combinationCount,others*(options.accessory-1+options.hatPose));assert.equal(combinationCount,906837120);
 assert.deepEqual({...v4.options},{palette:6,skin:5,hairColor:6,hair:8,eyes:3,brows:3,mouth:3,outfit:7,accessory:7});
 assert.equal(v4.combinationCount,1905120);
 assert.deepEqual(partNames.accessory.slice(7),['方框墨镜','圆框墨镜','冰球面具','小丑面具','英雄面具','银渐层猫面具','两花猫面具','愁眉猫面具']);
 assert.deepEqual(partNames.hatPose,['正戴','向左歪戴','向右歪戴']);
 assert.deepEqual(partNames.eyes,['亮眼睛','笑眯眯','圆眼睛']);assert.deepEqual(partNames.mouth,['微笑','开心','坏笑']);
 for(const [k,n] of Object.entries(partNames))assert.equal(n.length,options[k],k);
});
test('trait ranges and overrides',()=>{
 for(let i=0;i<1000;i++)for(const [key,value] of Object.entries(getTraits(i)))assert.ok(Number.isInteger(value)&&value>=0&&value<options[key],key);
 assert.equal(getTraits('x',{hair:4}).hair,4);
 for(const bad of [-1,3,1.5,'1',null,NaN])assert.equal(getTraits('x',{eyes:bad}).eyes,getTraits('x').eyes);
 assert.equal(getTraits('x',{accessory:15}).accessory,getTraits('x').accessory);
});
test('overrides never reshuffle unrelated features',()=>{const a=getTraits('hello'),b=getTraits('hello',{palette:2});for(const k of Object.keys(options))if(k!=='palette')assert.equal(a[k],b[k]);});
test('untrusted input never interpolates into XML',()=>{
 for(const version of [3,4,5]){
  const svg=createAvatar('<script>alert(1)</script>',{version,size:'1 onload=alert(1)',traits:{palette:'red" onload="x',__proto__:{eyes:9}}});
  assert.ok(!svg.includes('<script'));assert.ok(!svg.includes('onload'));assert.ok(!/undefined|NaN|null/.test(svg));assert.match(svg,/width="256"/);
 }
 assert.match(createAvatar('x',null),/<svg/);assert.match(createAvatar('x',{traits:'bad'}),/<svg/);
});
test('transparent and square formats',()=>{assert.match(createAvatar('x',{transparent:true}),/<rect width="256" height="256" rx="36" fill="none"/);assert.match(createAvatar('x',{rounded:false}),/rx="0"/);assert.match(createAvatar('x',{size:1024}),/width="1024"/);});
test('every individual trait changes visible output',()=>{for(const [key,n] of Object.entries(options)){const base={...baseline,...(key==='hatPose'?{accessory:4}:{})};const set=new Set(Array.from({length:n},(_,i)=>createAvatar('x',{traits:{...base,[key]:i}})));assert.equal(set.size,n,key);}});
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
 assert.equal(ctx.FuliAvatar.VERSION,'5');assert.ok(Object.isFrozen(ctx.FuliAvatar));
 for(let i=0;i<100;i++){assert.equal(ctx.FuliAvatar.createAvatar('bundle-'+i),createAvatar('bundle-'+i));assert.equal(ctx.FuliAvatar.createAvatar('bundle-'+i,{version:3}),createAvatar('bundle-'+i,{version:3}));}
});
test('v5 output matches its stored snapshots',async()=>{
 const fixtures=JSON.parse(await readFile(new URL('./fixtures/v5-snapshots.json',import.meta.url),'utf8'));
 assert.ok(fixtures.length>=24);
 for(const f of fixtures){
  assert.equal(sha(createAvatar(f.seed,f.opts)),f.sha256,f.seed);
  assert.deepEqual(getTraits(f.seed,f.opts.traits||{}),f.traits,f.seed);
 }
});
test('random outfits draw main and accent from the curated pairs',async()=>{
 const {outfitCombos,outfitColors}=await import('../dist/avatar.js');
 assert.equal(outfitColors.length,14);assert.ok(outfitCombos.length>=30);
 const pairs=new Set(outfitCombos.map(p=>p.join()));
 for(const [m,a] of outfitCombos)assert.ok(m!==a&&m<14&&a<14);
 const seen=new Set();
 for(let i=0;i<5000;i++){const t=getTraits('cloth-'+i);assert.ok(pairs.has(t.outfitColor+','+t.outfitAccent));seen.add(t.outfitColor+','+t.outfitAccent);}
 assert.equal(seen.size,pairs.size);
 // Any two colours can still be picked by hand, and the accent shows on every garment.
 for(let outfit=0;outfit<options.outfit;outfit++){
  const a=createAvatar('pick',{traits:{outfit,outfitColor:6,outfitAccent:12}}),b=createAvatar('pick',{traits:{outfit,outfitColor:6,outfitAccent:3}});
  assert.notEqual(a,b,'accent visible on outfit '+outfit);assert.match(a,/fill="#EDE6D8"/);
 }
});
test('masks: one seed in fifty, the five regular ones equally likely',async()=>{
 const {maskRate,masks}=await import('../dist/avatar.js');
 assert.equal(maskRate,0.02);assert.equal(masks.length,6);
 const count=[0,0,0,0,0];const n=50000;let rare=0;
 for(let i=0;i<n;i++){const a=getTraits('mask-'+i).accessory;if(a>=9&&a<14)count[a-9]++;if(a===14)rare++;}
 const total=count.reduce((a,b)=>a+b,0)+rare;
 assert.ok(total>n*.016&&total<n*.024,String(total));
 for(const c of count)assert.ok(c>total/5*.7&&c<total/5*1.3,count.join());
 // Everyday accessories, sunglasses included, share the rest evenly.
 const daily=new Array(9).fill(0);for(let i=0;i<n;i++){const a=getTraits('mask-'+i).accessory;if(a<9)daily[a]++;}
 for(const c of daily)assert.ok(c>n*.98/9*.9&&c<n*.98/9*1.1,daily.join());
});
test('the rare mask comes up for one masked seed in five hundred',()=>{
 let masked=0,rare=0,first=null;
 for(let i=0;i<1000000;i++){const a=getTraits('rare-'+i).accessory;if(a>=9){masked++;if(a===14){rare++;first??='rare-'+i;}}}
 assert.ok(masked>16000&&masked<24000,String(masked));
 assert.ok(rare>=20&&rare<=65,String(rare));
 // A known seed that draws it, so it stays reachable.
 assert.equal(first,KNOWN_RARE);assert.equal(getTraits(KNOWN_RARE).accessory,14);
 assert.match(createAvatar(KNOWN_RARE),/<g data-part="mask" data-style="5">/);
});
test('masks sit tilted on the upper side of the head and never reach the eyes',()=>{
 for(let accessory=9;accessory<=14;accessory++)for(let hair=0;hair<options.hair;hair++)for(const size of [32,256]){
  const svg=createAvatar('mask',{size,traits:{accessory,hair}});
  assert.match(svg,new RegExp(`<g data-part="mask" data-style="${accessory-9}">`));
  // Leaning from upper right to lower left, with no strap over the crown.
  assert.match(svg,/transform="translate\(74 75\) rotate\(28\) scale\(1.2\)"/);
  assert.ok(!svg.includes('#8B6B4E'));
  assert.ok(svg.indexOf('data-part="mask"')>svg.indexOf('data-part="hair-front"'));
  assert.ok(!/undefined|NaN|null/.test(svg));
  assert.equal((svg.match(/<g[ >]/g)||[]).length,(svg.match(/<\/g>/g)||[]).length);
  // The face group is unchanged by the mask.
  const face=s=>s.match(/<g data-part="face">(.*?)<\/g>/)[1];
  assert.equal(face(svg),face(createAvatar('mask',{size,traits:{accessory:0,hair}})));
 }
});
test('a third of beanies tilt, left or right, and the pose only changes beanies',()=>{
 const poses=[0,0,0];
 for(let i=0;i<6000;i++)poses[getTraits('pose-'+i).hatPose]++;
 assert.ok(poses[0]>3600&&poses[0]<4400,poses.join());
 assert.ok(Math.abs(poses[1]-poses[2])<300,poses.join());
 for(let hair=0;hair<options.hair;hair++){
  const straight=createAvatar('hat',{traits:{accessory:4,hatPose:0,hair}});
  assert.match(straight,/<g data-part="beanie">/);
  assert.match(createAvatar('hat',{traits:{accessory:4,hatPose:1,hair}}),/<g data-part="beanie" data-pose="1" transform="translate\(-4 -2\) rotate\(-12 128 100\)">/);
  assert.match(createAvatar('hat',{traits:{accessory:4,hatPose:2,hair}}),/<g data-part="beanie" data-pose="2" transform="translate\(4 -2\) rotate\(12 128 100\)">/);
 }
 for(const accessory of [0,1,3,5,6,7,8,9])assert.equal(createAvatar('hat',{traits:{accessory,hatPose:2}}),createAvatar('hat',{traits:{accessory,hatPose:0}}));
});
test('sunglasses are dark-lensed frames over the eyes',()=>{
 for(const accessory of [7,8]){
  const svg=createAvatar('shade',{traits:{accessory}}),plain=createAvatar('shade',{traits:{accessory:0}});
  assert.match(svg,new RegExp(`<g data-part="sunglasses" data-style="${accessory-7}">`));
  assert.match(svg,/fill="#2B3440" fill-opacity=".92"/);assert.match(svg,/opacity=".7"/);
  const face=s=>s.match(/<g data-part="face">(.*?)<\/g>/)[1];
  assert.equal(face(svg),face(plain));
  assert.doesNotMatch(createAvatar('shade',{size:32,traits:{accessory}}),/opacity=".7"/);
 }
});
// The site signature: a tiny text line at one of three spots, or none.
const SIG='有点.意思.com';
const spot=svg=>{const m=svg.match(/<text ([^>]*)>([^<]*)<\/text>/);if(!m)return null;assert.equal(m[2],SIG);
 return m[1].includes('translate(251.6 128)')?'frame':m[1].includes('x="164" y="251"')?'chest':m[1].includes('translate(157 140.5)')?'lens':'?';};
test('the signature placement is deterministic, and some seeds have none',()=>{
 const tally={none:0,frame:0,chest:0,lens:0};
 for(let i=0;i<3000;i++){
  const s='sig-'+i,svg=createAvatar(s),where=spot(svg);
  assert.equal(spot(createAvatar(s)),where);assert.notEqual(where,'?');
  tally[where??'none']++;
  const t=getTraits(s);
  if(where==='chest')assert.ok([0,4,5,6].includes(t.outfit),s);
  if(where==='lens')assert.ok([1,2,7,8].includes(t.accessory),s);
  // Never inside the face, and in exactly one place.
  assert.ok(!svg.match(/<g data-part="face">(.*?)<\/g>/)[1].includes('<text'));
  assert.ok((svg.match(/<text /g)||[]).length<=1);
 }
 assert.ok(tally.none>800&&tally.none<1200,JSON.stringify(tally));
 for(const k of ['frame','chest','lens'])assert.ok(tally[k]>50,JSON.stringify(tally));
});
test('the signature is tiny, low contrast and only in v5 at readable sizes',()=>{
 const s=Array.from({length:200},(_,i)=>'mark-'+i).find(x=>spot(createAvatar(x))==='frame');
 const svg=createAvatar(s,{size:1024});
 assert.match(svg,/font-size="3.2"/);
 assert.equal(spot(createAvatar(s,{size:1024,eggs:true,animate:false})),'frame');
 assert.equal(spot(createAvatar(s,{size:32})),null);
 for(let i=0;i<200;i++){assert.ok(!createAvatar('mark-'+i,{version:4}).includes('<text'));assert.ok(!createAvatar('mark-'+i,{version:3}).includes(SIG));}
});
