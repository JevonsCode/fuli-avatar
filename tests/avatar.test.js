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
 assert.deepEqual({...options},{palette:6,skin:5,hairColor:6,hair:8,eyes:3,brows:3,mouth:3,outfit:7,outfitColor:14,outfitAccent:14,accessory:17,hatPose:3});
 // The hat pose only changes a beanie, so it multiplies that one accessory, not all eleven.
 const others=Object.entries(options).filter(([k])=>k!=='accessory'&&k!=='hatPose').reduce((a,[,n])=>a*n,1);
 assert.equal(combinationCount,others*(options.accessory-1+options.hatPose));assert.equal(combinationCount,1013523840);
 assert.deepEqual({...v4.options},{palette:6,skin:5,hairColor:6,hair:8,eyes:3,brows:3,mouth:3,outfit:7,accessory:7});
 assert.equal(v4.combinationCount,1905120);
 assert.deepEqual(partNames.accessory.slice(7),['方框墨镜','飞行员墨镜','眉框墨镜','圆框墨镜','冰球面具','小丑面具','英雄面具','银渐层猫面具','两花猫面具','愁眉猫面具']);
 assert.deepEqual(partNames.hatPose,['正戴','向左歪戴','向右歪戴']);
 assert.deepEqual(partNames.eyes,['亮眼睛','笑眯眯','圆眼睛']);assert.deepEqual(partNames.mouth,['微笑','开心','坏笑']);
 for(const [k,n] of Object.entries(partNames))assert.equal(n.length,options[k],k);
});
test('trait ranges and overrides',()=>{
 for(let i=0;i<1000;i++)for(const [key,value] of Object.entries(getTraits(i)))assert.ok(Number.isInteger(value)&&value>=0&&value<options[key],key);
 assert.equal(getTraits('x',{hair:4}).hair,4);
 for(const bad of [-1,3,1.5,'1',null,NaN])assert.equal(getTraits('x',{eyes:bad}).eyes,getTraits('x').eyes);
 assert.equal(getTraits('x',{accessory:17}).accessory,getTraits('x').accessory);
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
 for(let i=0;i<n;i++){const a=getTraits('mask-'+i).accessory;if(a>=11&&a<16)count[a-11]++;if(a===16)rare++;}
 const total=count.reduce((a,b)=>a+b,0)+rare;
 assert.ok(total>n*.016&&total<n*.024,String(total));
 for(const c of count)assert.ok(c>total/5*.7&&c<total/5*1.3,count.join());
 // Everyday: the seven v4 accessories share nine equal slots with sunglasses, which keep two slots
 // split evenly across their four styles.
 const daily=new Array(11).fill(0);for(let i=0;i<n;i++){const a=getTraits('mask-'+i).accessory;if(a<11)daily[a]++;}
 for(let a=0;a<11;a++){const want=n*.98/9/(a<7?1:2);assert.ok(daily[a]>want*.88&&daily[a]<want*1.12,daily.join());}
});
test('the rare mask comes up for one masked seed in five hundred',()=>{
 let masked=0,rare=0,first=null;
 for(let i=0;i<1000000;i++){const a=getTraits('rare-'+i).accessory;if(a>=11){masked++;if(a===16){rare++;first??='rare-'+i;}}}
 assert.ok(masked>16000&&masked<24000,String(masked));
 assert.ok(rare>=20&&rare<=65,String(rare));
 // A known seed that draws it, so it stays reachable.
 assert.equal(first,KNOWN_RARE);assert.equal(getTraits(KNOWN_RARE).accessory,16);
 assert.match(createAvatar(KNOWN_RARE),/<g data-part="mask" data-style="5">/);
});
test('masks sit tilted on the upper side of the head and never reach the eyes',()=>{
 for(let accessory=11;accessory<=16;accessory++)for(let hair=0;hair<options.hair;hair++)for(const size of [32,256]){
  const svg=createAvatar('mask',{size,traits:{accessory,hair}});
  assert.match(svg,new RegExp(`<g data-part="mask" data-style="${accessory-11}">`));
  // Leaning about 38 degrees from upper right to lower left, no strap, turned toward the upper
  // left in 3/4 view: squeezed width and a smaller, mirrored far eye.
  assert.match(svg,/transform="translate\(70 76\) rotate\(38\) scale\(1.2\)"><g transform="scale\(.78 1\)">/);
  if(accessory<16){
   assert.match(svg,/<g transform="scale\(.78 1\)">/);
   assert.match(svg,/<g transform="translate\(-13 -?\d+\) scale\(-.7 .86\)">/);
   assert.match(svg,/<g transform="translate\(7.75 -?\d+\) scale\(1.04 1\)">/);
  }else{
   // The rare mask is the original whole-cat drawing grown into a plain white oval: no outline,
   // the picture fades into the white through a radial alpha mask, a very soft drop shadow, no
   // inner shade and no eye holes.
   assert.match(svg,/<g transform="scale\(.78 1\)"><defs><clipPath id="fuli-avatar-cat-oval"><path d="M0 -30C/);
   assert.match(svg,/<mask id="fuli-avatar-cat-mask" maskContentUnits="objectBoundingBox"><rect width="1" height="1" fill="url\(#fuli-avatar-cat-fade\)"\/><\/mask>/);
   assert.match(svg,/<path d="M0 -30C[^"]+" fill="#FFFFFF" filter="url\(#fuli-avatar-cat-shadow\)"\/><g clip-path="url\(#fuli-avatar-cat-oval\)"><image href="data:image\/png;base64,iVBORw0KGgo[A-Za-z0-9+/=]+" x="-25" y="-22" width="50" height="44.17" preserveAspectRatio="none" transform="rotate\(-15\)" mask="url\(#fuli-avatar-cat-mask\)"\/><\/g>/);
   const rare=svg.slice(svg.indexOf('data-part="mask"'));
   assert.ok(!rare.includes('stroke='),'no outline');assert.ok(!rare.includes('opacity=".14"'),'no inner shade');
   assert.ok(!svg.slice(svg.indexOf('data-part="mask"')).includes('<ellipse'),'no eye holes on the drawing');
  }
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
 for(const accessory of [0,1,3,5,6,7,8,9,10,11])assert.equal(createAvatar('hat',{traits:{accessory,hatPose:2}}),createAvatar('hat',{traits:{accessory,hatPose:0}}));
});
test('four sunglasses styles: tinted lenses with a glint over the eyes',()=>{
 const tints=['fill="#2B3440" fill-opacity=".92"','fill="url(#fuli-avatar-aviator-tint)"','fill="#2E4A40" fill-opacity=".9"','fill="#2B3440" fill-opacity=".92"'];
 for(const accessory of [7,8,9,10]){
  const svg=createAvatar('shade',{traits:{accessory}}),plain=createAvatar('shade',{traits:{accessory:0}});
  assert.match(svg,new RegExp(`<g data-part="sunglasses" data-style="${accessory-7}">`));
  assert.ok(svg.includes(tints[accessory-7]),'tint '+accessory);assert.match(svg,/opacity=".7"/);
  // Each lens is drawn once and mirrored for the other eye.
  assert.match(svg,/<g transform="translate\(150 130\) scale\(-1 1\)">/);
  const face=s=>s.match(/<g data-part="face">(.*?)<\/g>/)[1];
  assert.equal(face(svg),face(plain));
  assert.doesNotMatch(createAvatar('shade',{size:32,traits:{accessory}}),/opacity=".7"/);
 }
});
// The site signature: a tiny text line at one of seven spots, or none.
const SIG='有点.意思.com';
const spot=svg=>{
 // The FULI lens etching is separate from the site mark.
 const texts=(svg.match(/<text [^>]*>(?:<textPath[^>]*>)?[^<]*(?:<\/textPath>)?<\/text>/g)||[]).filter(x=>!x.includes('>FULI<'));
 if(!texts.length)return null;
 assert.equal(texts.length,1,'one signature at most');
 assert.ok(texts[0].includes('>'+SIG+'<'));
 const m=texts[0];
 if(m.includes('<textPath href="#fuli-avatar-seam"'))return 'seam';
 if(m.includes('translate(251.6 128)'))return 'frame';
 if(m.includes('x="164" y="250"'))return 'chest';
 if(m.includes('translate(138 225) rotate(90)'))return 'cord';
 if(svg.includes('<g transform="translate(206 242) rotate(-22)"><rect'))return 'label';
 if(svg.includes('<g transform="translate(172 92) rotate(4)"><rect'))return 'hat';
 return '?';
};
test('the signature placement is deterministic, fits its host part, and a third of seeds have none',()=>{
 const tally={none:0,frame:0,chest:0,label:0,seam:0,cord:0,hat:0};
 for(let i=0;i<6000;i++){
  const s='sig-'+i,svg=createAvatar(s),where=spot(svg),t=getTraits(s);
  assert.equal(spot(createAvatar(s)),where);assert.notEqual(where,'?',s);
  tally[where??'none']++;
  if(where==='chest')assert.ok([0,4,5,6].includes(t.outfit),s);
  if(where==='cord')assert.equal(t.outfit,4,'drawstring text only on a hoodie '+s);
  if(where==='hat'){assert.equal(t.accessory,4,'hat tag only with a beanie '+s);
   // The tag sits inside the beanie group, so it follows the hat's tilt.
   const beanie=svg.slice(svg.indexOf('<g data-part="beanie"'));assert.ok(beanie.indexOf('translate(172 92)')<beanie.indexOf('</g></g>')+8);}
  assert.ok(!svg.match(/<g data-part="face">(.*?)<\/g>/)[1].includes('<text'));
 }
 assert.ok(tally.none>1800&&tally.none<2200,JSON.stringify(tally));
 // Only clothing and the background carry it: no lens spot any more.
 for(const k of ['frame','chest','label','seam','cord','hat'])assert.ok(tally[k]>30,JSON.stringify(tally));
 assert.deepEqual(Object.keys(tally).sort(),['chest','cord','frame','hat','label','none','seam']);
});
test('host parts gate the signature even when traits are overridden',()=>{
 for(let i=0;i<1500;i++){
  const s='host-'+i;
  for(const traits of [{outfit:0,accessory:0},{outfit:6,accessory:5},{outfit:3,accessory:3},{outfit:2,accessory:7},{outfit:1,accessory:9}]){
   const where=spot(createAvatar(s,{traits}));
   assert.ok(!['cord','hat','lens'].includes(where),s+' '+where);
  }
 }
});
test('the signature is tiny, low contrast and only in v5 at readable sizes',()=>{
 const s=Array.from({length:200},(_,i)=>'mark-'+i).find(x=>spot(createAvatar(x))==='frame');
 const svg=createAvatar(s,{size:1024});
 assert.match(svg,/font-size="3.2"/);
 assert.equal(spot(createAvatar(s,{size:1024,eggs:true,animate:false})),'frame');
 assert.equal(spot(createAvatar(s,{size:48})),null);assert.equal(spot(createAvatar(s,{size:32})),null);
 // Text on the outline sits on the ink stroke in a slightly lighter ink.
 const seam=Array.from({length:400},(_,i)=>'mark-'+i).find(x=>spot(createAvatar(x))==='seam');
 assert.match(createAvatar(seam),/<path id="fuli-avatar-seam" d="M110 188C84 190 56 198 42 216"\/>/);
 for(let i=0;i<200;i++){assert.ok(!createAvatar('mark-'+i,{version:4}).includes('<text'));assert.ok(!createAvatar('mark-'+i,{version:3}).includes(SIG));}
});
test('the rare mask embeds the original drawing unchanged in every export path',async()=>{
 const {readFileSync}=await import('node:fs');
 const png=createAvatar(KNOWN_RARE).match(/href="data:image\/png;base64,([A-Za-z0-9+/=]+)"/)[1];
 const bytes=Buffer.from(png,'base64');
 // PNG signature and the 120 x 106 header of the cut-out.
 assert.deepEqual([...bytes.subarray(0,8)],[137,80,78,71,13,10,26,10]);
 assert.equal(bytes.readUInt32BE(16),120);assert.equal(bytes.readUInt32BE(20),106);
 assert.equal(sha(bytes),sha(Buffer.from(readFileSync(new URL('../src/v5/rare-cat.js',import.meta.url),'utf8').match(/base64,([A-Za-z0-9+/=]+)'/)[1],'base64')));
 for(const opts of [{size:1024},{size:64},{animate:false,eggs:true},{egg:'hearts'}])assert.ok(createAvatar(KNOWN_RARE,opts).includes(png));
 // Only the rare mask carries a picture; v3 and v4 never do.
 for(let i=0;i<300;i++)for(const version of [3,4,5])if(getTraits('pic-'+i,{},{version}).accessory!==16)assert.ok(!createAvatar('pic-'+i,{version}).includes('<image'));
});
test('about one sunglasses wearer in seven gets FULI etched at the lens top outer corner',()=>{
 const spots={7:'translate(-14 -8) rotate(4)',8:'translate(-12.5 -8) rotate(-8)',9:'translate(-13 -4.4) rotate(-4)',10:'translate(-11.5 -7) rotate(-16)'};
 let sun=0,etched=0;const seen=new Set();
 for(let i=0;i<30000;i++){
  const s='etch-'+i,t=getTraits(s),svg=createAvatar(s),has=svg.includes('>FULI</text>');
  if(t.accessory<7||t.accessory>10){assert.ok(!has,'no etching without sunglasses '+s);continue;}
  sun++;if(!has)continue;etched++;seen.add(t.accessory);
  // Light italic in white, inside the viewer's left lens, clipped to that lens shape.
  assert.ok(svg.includes(`<g transform="translate(106 130)"><defs><clipPath id="fuli-avatar-lens-${t.accessory}">`),s);
  assert.ok(svg.includes(`<g clip-path="url(#fuli-avatar-lens-${t.accessory})"><text transform="${spots[t.accessory]}" font-family="Georgia, serif" font-style="italic" font-weight="300" font-size="2.6" letter-spacing=".3" dominant-baseline="central" fill="#FFFFFF" opacity=".45">FULI</text>`),s);
  assert.equal(svg.includes('>FULI</text>'),createAvatar(s).includes('>FULI</text>'));
 }
 assert.ok(etched/sun>.12&&etched/sun<.18,etched+'/'+sun);
 assert.deepEqual([...seen].sort(),[10,7,8,9].sort());
 // Independent of the site mark: some characters carry both.
 assert.ok(Array.from({length:30000},(_,i)=>'etch-'+i).some(s=>{const svg=createAvatar(s);return svg.includes('>FULI</text>')&&svg.includes('>有点.意思.com<');}));
 // Gone at icon size like other fine detail.
 const s=Array.from({length:30000},(_,i)=>'etch-'+i).find(x=>createAvatar(x).includes('>FULI</text>'));
 assert.ok(!createAvatar(s,{size:48}).includes('>FULI</text>'));
});
