import {createAvatar,getTraits,palettes,partNames,getEgg,nameDetails,nameFor,nameLocales,combinationCount} from './avatar.js';
import {renderGif} from './gif.js';
const $=id=>document.getElementById(id);
const calm=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;

// v4 part names come from the generator so the controls always match the renderer's trait ranges.
const names={skin:['奶油','暖杏','蜂蜜','焦糖','可可'],hairColor:partNames.hairColor,hair:partNames.hair,eyes:partNames.eyes,brows:partNames.brows,mouth:partNames.mouth,outfit:partNames.outfit,outfitColor:partNames.outfitColor,outfitAccent:partNames.outfitAccent,accessory:partNames.accessory,hatPose:partNames.hatPose};
const labels={skin:'肤色',hairColor:'发色',hair:'发型',eyes:'眼睛',brows:'眉毛',mouth:'表情',outfit:'衣服',outfitColor:'衣服主色',outfitAccent:'衣服配色',accessory:'小装饰',hatPose:'帽子戴法'};
const localeLabel={es:'西语名 · ES',zh:'中文名 · ZH',en:'英文名 · EN'};

let seed=new URLSearchParams(location.search).get('seed')?.slice(0,160)||'hello-fuli',overrides={},galleryRound=0;
const galleryBase=randomSeed();
$('seed').value=seed;

function randomSeed(){return 'fuli-'+crypto.getRandomValues(new Uint32Array(2)).join('-');}
function announce(text){$('status').textContent=text;}
// Rare animated extras are never announced as such: the page only says what the character is doing.
const doing={blink:'还在眨眼',sparkle:'身边闪着星光',leaf:'身后飘着落叶',star:'身边跟着一颗小星星',ahoge:'头顶翘着一根呆毛',clouds:'身后飘着云朵',tophat:'戴着一顶迷你礼帽',hearts:'正在冒爱心',hiphop:'正跟着节拍点头',pop:'正哼着小调'};
const doingOf=egg=>doing[egg.id]||egg.name;

// The header mark is a fresh character on every load; logo.svg stays as the no-JS fallback.
function paintLogo(){
 const s=randomSeed(),url='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(createAvatar(s,{size:48,eggs:true}));
 $('logo').src=url;$('logo').title='今天的门面：'+nameDetails(s).name;$('favicon').href=url;
}

function render(assemble=false){
 const t=getTraits(seed,overrides),egg=getEgg(seed,overrides),who=nameDetails(seed),box=$('avatar');
 // Parts drop and slide into place only for a new character, never for a single trait tweak.
 box.classList.toggle('assemble',assemble&&!calm());
 box.innerHTML=createAvatar(seed,{traits:overrides,transparent:$('transparent').checked,eggs:true});
 const summary=palettes[t.palette].name+' / '+names.hair[t.hair]+' / '+names.accessory[t.accessory];
 box.setAttribute('aria-label',`${who.name} 的头像：${summary}${egg?'，'+doingOf(egg):''}`);
 $('avatar-name').textContent=who.name;$('avatar-name').title=who.name;
 $('name-locale').textContent=localeLabel[who.locale];
 $('egg-badge').hidden=!egg;
 $('egg-badge').textContent=egg?'✦ '+egg.name:'';
 // Every character can be saved as a GIF; the 动图 sublabel only shows when it moves, and it
 // keeps its width either way so the button row never shifts.
 $('gif-sub').hidden=!egg;
 $('download-gif').setAttribute('aria-label',egg?'下载 GIF 动图':'下载 GIF');
 $('palette-name').textContent=palettes[t.palette].name;
 $('trait-summary').textContent=summary;$('trait-summary').title=summary;
 document.querySelectorAll('.swatch').forEach((b,i)=>b.setAttribute('aria-pressed',String(t.palette===i)));
 for(const k of Object.keys(names))$(k).value=t[k];
 // The pose only changes a beanie.
 $('hatPose').disabled=partNames.accessory[t.accessory]!=='毛线帽';
 return {egg,who};
}

for(const [i,p] of palettes.entries()){
 const b=document.createElement('button');b.className='swatch';b.style.background=p.bg;b.title=p.name;b.setAttribute('aria-label',p.name);
 b.onclick=()=>{overrides.palette=i;render();};
 $('palettes').append(b);
}
for(const [k,values] of Object.entries(names)){
 const label=document.createElement('label');label.textContent=labels[k];
 const select=document.createElement('select');select.id=k;
 values.forEach((name,i)=>{const option=document.createElement('option');option.value=i;option.textContent=name;select.append(option);});
 select.onchange=()=>{overrides[k]=Number(select.value);render();};
 label.append(select);$('trait-controls').append(label);
}

function changeSeed(next){
 seed=next;overrides={};$('seed').value=seed;
 const {egg,who}=render(true);
 announce(egg?`${who.name} 来了，${doingOf(egg)}。`:`${who.name} 来了。相同 seed 可以再次生成 TA。`);
}
function applySeed(){changeSeed($('seed').value);}
$('apply-seed').onclick=applySeed;
$('seed').addEventListener('keydown',e=>{if(e.key==='Enter')applySeed();});
$('seed').addEventListener('change',applySeed);
const shuffle=()=>changeSeed(randomSeed());
$('shuffle').onclick=shuffle;
// "R" also shuffles, unless the visitor is typing or choosing in a form control.
document.addEventListener('keydown',e=>{
 if(e.key!=='r'&&e.key!=='R')return;
 if(e.ctrlKey||e.metaKey||e.altKey||/^(INPUT|SELECT|TEXTAREA|BUTTON)$/.test(e.target?.tagName||''))return;
 shuffle();
});
$('transparent').onchange=()=>render();
$('reset').onclick=()=>{overrides={};$('transparent').checked=false;render();announce('已恢复这个 seed 的原始搭配。');};

function goToWorkshop(s){changeSeed(s);$('playground').scrollIntoView({behavior:calm()?'auto':'smooth',block:'start'});}
// A clickable character card; a rare extra only shows as a quiet icon.
function card(s,egg,svg,label){
 const b=document.createElement('button'),name=document.createElement('span');
 b.innerHTML=svg;name.className='card-name';name.textContent=nameDetails(s).name;b.append(name);
 if(egg){const mark=document.createElement('span');mark.className='egg-mark';mark.setAttribute('aria-hidden','true');mark.textContent='✦';b.append(mark);}
 b.setAttribute('aria-label',label);b.onclick=()=>goToWorkshop(s);
 return b;
}
function gallery(){
 $('gallery').replaceChildren();
 for(let i=0;i<10;i++){
  const s=`${galleryBase}-${galleryRound}-${i}`,egg=getEgg(s),who=nameDetails(s).name;
  $('gallery').append(card(s,egg,createAvatar(s,{eggs:true}),`选择 ${who}`+(egg?`，${doingOf(egg)}`:'')));
 }
 galleryRound++;
}
$('refresh-gallery').onclick=gallery;

function download(blob,ext){
 const url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download='fuli-avatar-'+seed.replace(/[^a-zA-Z0-9_-]/g,'-').slice(0,48)+'.'+ext;
 document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
const exportSvg=()=>createAvatar(seed,{size:1024,traits:overrides,transparent:$('transparent').checked,eggs:true});
$('download-svg').onclick=()=>{download(new Blob([exportSvg()],{type:'image/svg+xml;charset=utf-8'}),'svg');announce('SVG 已下载，可以无限放大。');};
// Draws an SVG string onto a size × size canvas through a local Blob URL.
async function rasterise(svg,size){
 const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));
 try{
  const img=new Image();
  await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=reject;img.src=url;});
  const canvas=document.createElement('canvas');canvas.width=canvas.height=size;
  canvas.getContext('2d').drawImage(img,0,0,size,size);
  return canvas;
 }finally{URL.revokeObjectURL(url);}
}
$('download-png').onclick=async()=>{
 const button=$('download-png');button.disabled=true;
 try{
  const canvas=await rasterise(exportSvg(),1024);
  const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));
  if(!blob)throw Error('No PNG');
  download(blob,'png');announce('1024 × 1024 PNG 已下载。');
 }catch{announce('PNG 导出失败，请重试或下载 SVG。');}
 finally{button.disabled=false;}
};
// GIF keeps the background: GIF has no soft transparency, so anti-aliased edges would fringe.
// A character that does not move is saved as a single-frame GIF.
$('download-gif').onclick=async()=>{
 const egg=getEgg(seed,overrides),button=$('download-gif'),kind=egg?'GIF 动图':'GIF';
 button.disabled=true;announce(`正在生成 ${kind}…`);
 try{
  const svg=createAvatar(seed,{size:256,traits:overrides,eggs:true});
  const bytes=await renderGif(svg,egg?egg.loop:0,(frame,size)=>rasterise(frame,size).then(c=>c.getContext('2d').getImageData(0,0,size,size).data));
  download(new Blob([bytes],{type:'image/gif'}),'gif');
  announce(`${egg?'GIF 动图':'GIF '}已下载（${Math.round(bytes.length/1024)} KB）。`);
 }catch{announce('GIF 导出失败，请重试或下载 SVG。');}
 finally{button.disabled=false;}
};

$('combination-count').textContent=combinationCount.toLocaleString('en-US');
// The intro's sample names: one Spanish, one Chinese and one English name from fresh random seeds,
// in random order, on every load.
function sampleNames(){
 const order=[...nameLocales].map(l=>[crypto.getRandomValues(new Uint32Array(1))[0],l]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]);
 $('sample-names').textContent=order.map(l=>nameFor(randomSeed(),{locales:[l]})).join('、');
}
sampleNames();
paintLogo();
render(true);
gallery();
