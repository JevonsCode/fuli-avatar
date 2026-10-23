import test from 'node:test';import assert from 'node:assert/strict';import {createAvatar,getTraits,options,combinationCount} from '../dist/avatar.js';
test('deterministic across 1000 seeds',()=>{for(let i=0;i<1000;i++)assert.equal(createAvatar('agent-'+i),createAvatar('agent-'+i));});
test('thousands of distinct visible SVGs',()=>{const svg=new Set();for(let i=0;i<10000;i++)svg.add(createAvatar('agent-'+i));assert.ok(svg.size>9800,svg.size);console.log('Unique rendered SVGs for 10000 seeds:',svg.size);});
test('trait ranges and overrides',()=>{for(let i=0;i<1000;i++)for(const [key,value] of Object.entries(getTraits(i)))assert.ok(value>=0&&value<options[key]);assert.equal(getTraits('x',{hair:4}).hair,4);assert.equal(combinationCount,4752000);});
test('untrusted input never interpolates into XML',()=>{const svg=createAvatar('<script>alert(1)</script>',{size:'1 onload=alert(1)',traits:{palette:'red" onload="x'}});assert.ok(!svg.includes('<script'));assert.ok(!svg.includes('onload'));assert.ok(!svg.includes('undefined'));assert.match(svg,/width="256"/);});
test('transparent and square formats',()=>{assert.match(createAvatar('x',{transparent:true}),/fill="none"/);assert.match(createAvatar('x',{rounded:false}),/rx="0"/);assert.match(createAvatar('x',{size:1024}),/width="1024"/);});
test('every individual trait changes visible output',()=>{const baseline=Object.fromEntries(Object.keys(options).map(k=>[k,0]));for(const [key,n] of Object.entries(options)){const set=new Set(Array.from({length:n},(_,i)=>createAvatar('x',{traits:{...baseline,[key]:i}})));assert.equal(set.size,n,key);}});

test('overrides never reshuffle unrelated features',()=>{const a=getTraits('hello'),b=getTraits('hello',{palette:2});for(const k of Object.keys(options))if(k!=='palette')assert.equal(a[k],b[k]);});

test('renderer version is explicit',async()=>{const {VERSION}=await import('../dist/avatar.js');assert.equal(VERSION,'3');});
test('headphone styles keep ear cushions aligned',()=>{for(let hair=0;hair<10;hair++){const svg=createAvatar('qa',{traits:{hair,accessory:2}});assert.match(svg,/<rect x="36" y="111" width="25" height="42"/);assert.match(svg,/<rect x="195" y="111" width="25" height="42"/);}});
test('no generic check badge',()=>{for(let i=0;i<100;i++)assert.ok(!createAvatar(i).includes('M167 208L170 211L175 205'));});

test('browser script exposes matching API without dependencies',async()=>{const {readFile}=await import('node:fs/promises'),{runInNewContext}=await import('node:vm');const ctx={};runInNewContext(await readFile(new URL('../dist/fuli-avatar.browser.js',import.meta.url),'utf8'),ctx);assert.equal(ctx.FuliAvatar.VERSION,'3');for(let i=0;i<100;i++)assert.equal(ctx.FuliAvatar.createAvatar('bundle-'+i),createAvatar('bundle-'+i));assert.ok(Object.isFrozen(ctx.FuliAvatar));});
test('web control labels cover every selectable trait',async()=>{const {readFile}=await import('node:fs/promises');const ui=await readFile(new URL('../dist/app.js',import.meta.url),'utf8');assert.ok(!ui.includes('jewelry'));assert.ok(ui.includes('经典墨镜'));assert.ok(ui.includes('星星墨镜'));assert.ok(ui.includes('猫眼墨镜'));assert.ok(ui.includes('金链子'));assert.ok(!ui.includes('吊坠'));assert.ok(ui.includes('蓬松 Afro'));});

test('all ten white hairstyles have matching front/back fill and edging, never a dark scalp base',async()=>{
 const {palettes}=await import('../dist/avatar.js');
 for(let hair=0;hair<10;hair++)for(let accessory=0;accessory<11;accessory++){
  const svg=createAvatar('white',{traits:{palette:5,hair,accessory}});
  for(const layer of ['hair-back','hair-front']){
   const part=svg.match(new RegExp('<g data-part="'+layer+'">(.*?)</g>'))[1];
   assert.match(part,new RegExp('fill="'+palettes[5].hair+'"'));
   assert.match(part,new RegExp('stroke="'+palettes[5].hair+'"'));
   assert.ok(!part.includes('#1D3040'));
  }
 }
});
test('portrait and all attached pieces share one reduced coordinate frame',()=>{
 for(let accessory=0;accessory<11;accessory++){
  const svg=createAvatar('framing',{traits:{accessory}});
  assert.match(svg,/<g data-part="portrait" transform="translate\(20.48 22\) scale\(.84\)">/);
  assert.ok(svg.endsWith('</g></svg>'));
 }
});
test('hat is a small tilted bowler, not the old wide visor',()=>{
 for(let hair=0;hair<10;hair++){
  const svg=createAvatar('hat',{traits:{hair,accessory:3}});
  assert.match(svg,/data-part="perched-hat"/);assert.match(svg,/rotate\(-25 80 58\)/);
  assert.ok(!svg.includes('M35 87Q30 22'));
 }
});
test('one accessory selector owns the chain and all three sunglasses',()=>{
 assert.ok(!('jewelry' in options));assert.equal(options.accessory,11);assert.equal(options.outfit,10);
 for(let accessory=0;accessory<11;accessory++){
  const svg=createAvatar('accessory',{traits:{accessory},jewelry:2});
  assert.equal(svg.includes('data-part="gold-chain"'),accessory===7);
  assert.equal(svg.includes('data-part="sunglasses"'),accessory>=8);
  assert.ok(!svg.includes('M128 218L139 228'));
 }
});
test('all garment/hat/hair combinations have well-formed finite SVG output',()=>{
 for(let hair=0;hair<10;hair++)for(let outfit=0;outfit<10;outfit++)for(let accessory=0;accessory<11;accessory++){
  const svg=createAvatar('matrix',{traits:{hair,outfit,accessory}});
  assert.ok(!/undefined|NaN|null/.test(svg));
  assert.equal((svg.match(/<g[ >]/g)||[]).length,(svg.match(/<\/g>/g)||[]).length);
  assert.ok(svg.indexOf('data-part="neck"')<svg.indexOf('data-part="outfit"'));
 }
});

test('light hair has no inner ear stroke slivers and sunglasses have no overlapping brows',()=>{
 for(let hair=0;hair<10;hair++){
  const svg=createAvatar('seams',{traits:{palette:5,hair,accessory:0}});
  assert.match(svg,/M207 119Q218 142/);
  assert.ok(!svg.includes("M191 118Q201 109"));
 }
 for(let accessory=8;accessory<11;accessory++){
  const svg=createAvatar('brows',{traits:{accessory}});
  assert.ok(!svg.includes('M96 111Q103 107'));
 }
});
