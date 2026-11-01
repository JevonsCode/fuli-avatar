// v4 easter eggs: rare, gently animated extras. Opt-in only ({ eggs: true }); without it the
// renderer output is byte-identical. The egg comes from its own seed namespace, so it never
// shifts trait draws. Rest poses are the static markup: renderers that skip CSS animation, PNG
// export and prefers-reduced-motion all show the decoration standing still.
import {seededRng,INK,mix,line} from './util.js';
import {v4PhoneBand} from './accessory.js';
const eggR2=n=>Math.round(n*100)/100;
// Wrapper places a part; the inner group animates about the wrapper's local origin.
const eggAt=(transform,cls,body)=>`<g transform="${transform}"><g class="fa-m ${cls}">${body}</g></g>`;
const eggPath=(d,fill,w)=>`<path d="${d}" fill="${fill}" stroke="${INK}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
// Every animation delay is offset by --fa-t, so a frame sampler can pause the clock at any time.
const eggDelay=s=>`animation-delay:calc(${s}s - var(--fa-t, 0s))`;
const eggAnim=(sel,spec,delay=0)=>`${sel}{animation:${spec};${eggDelay(delay)}}`;
const STAR4=s=>{const a=eggR2(s*.16),b=eggR2(s*.3);return `M0 ${-s}C${a} ${-b} ${b} ${-a} ${s} 0C${b} ${a} ${a} ${b} 0 ${s}C${-a} ${b} ${-b} ${a} ${-s} 0C${-b} ${-a} ${-a} ${-b} 0 ${-s}Z`;};
const STAR5=(()=>{let d='';for(let i=0;i<10;i++){const r=i%2?5.4:12,a=Math.PI*(i/5-.5);d+=(i?'L':'M')+eggR2(r*Math.cos(a))+' '+eggR2(r*Math.sin(a));}return d+'Z';})();
const LEAF='M0 -10C8 -8 10 2 0 11C-10 2 -8 -8 0 -10Z';
const CLOUD='M-18 6C-25 6 -25 -5 -16 -5C-15 -13 -4 -15 1 -8C5 -14 17 -12 16 -4C24 -4 24 6 16 6Z';
const HEART='M0 5C-9 -1 -10 -8 -5.5 -10C-2.5 -11.3 0 -9 0 -6.5C0 -9 2.5 -11.3 5.5 -10C10 -8 9 -1 0 5Z';
const AHOGE='M0 4C-4 -10 2 -24 14 -28C22 -30 24 -22 17 -19';
// Music eggs: over-ear cups centred on the ears (head frame), on the same band as the accessory.
const CUPS=[56,200];
const musicCup=(x,cls,fill,w,extra='')=>eggAt(`translate(${x} 132)`,cls,`<rect x="-12" y="-22" width="24" height="44" rx="12" fill="${fill}" stroke="${INK}" stroke-width="${w}"/>`+extra);
const NOTE1=`<ellipse cx="0" cy="0" rx="4.6" ry="3.4" transform="rotate(-22)" fill="${INK}"/>`+line('M4 -1V-17C9 -15 11 -11 9 -7',INK,2.6);
const NOTE2=`<ellipse cx="0" cy="0" rx="4.6" ry="3.4" transform="rotate(-22)" fill="${INK}"/><ellipse cx="11" cy="-3" rx="4.6" ry="3.4" transform="rotate(-22 11 -3)" fill="${INK}"/>`+line('M4 -1V-16M15 -4V-19',INK,2.6)+`<path d="M4 -17L15 -20L15 -15.5L4 -12.5Z" fill="${INK}"/>`;
// The music eggs move the whole head. :has() scopes the rule to the SVG that carries the egg,
// because an inline <style> applies to the whole page. Without :has() the head simply stays still.
const headAnim=(id,spec)=>eggAnim(`svg:has([data-egg="${id}"]) [data-part="head"]`,spec);
const stillHead='svg [data-part="head"]{animation:none!important}';
// Slots: bg (behind the character), neck (over the garment, under the face), face (over the face,
// under the fringe, head frame), head (over head-worn accessories, head frame), over (canvas top).
// `loop` is the seconds after which every part of the egg repeats; GIF export samples one loop.
export const V4_EGGS=[
 {id:'blink',name:'眨眨眼',en:'Blink',slot:'face',loop:4.8,
  css:'@keyframes fa-blink{0%,88%,100%{opacity:0}90%,95%{opacity:1}}'+eggAnim('.fa-blink','fa-blink 4.8s infinite'),
  // Reduced motion keeps a still wink instead of a blink.
  still:'.fa-wink{opacity:1}',
  draw:({skin})=>{const lid=x=>`<ellipse cx="${x}" cy="129" rx="12.5" ry="13.5" fill="${skin}"/>`+line(`M${x-9} 131C${x-5} 136 ${x+5} 136 ${x+9} 131`,INK,4.2);
   return `<g class="fa-m fa-blink" opacity="0">${lid(106)}</g><g class="fa-m fa-blink fa-wink" opacity="0">${lid(150)}</g>`;}},
 {id:'sparkle',name:'闪闪亮',en:'Sparkle',slot:'over',loop:2.4,
  css:'@keyframes fa-tw{0%,100%{transform:scale(1) rotate(0deg)}50%{transform:scale(.55) rotate(45deg)}}'+eggAnim('.fa-tw','fa-tw 2.4s ease-in-out infinite')+`.fa-tw2{${eggDelay(-1.2)}}`,
  draw:({p})=>{const c=mix(p.accent,'#FFFFFF',.6);return eggAt('translate(212 50)','fa-tw',eggPath(STAR4(21),c,3))+eggAt('translate(236 88)','fa-tw fa-tw2',eggPath(STAR4(11),c,2.6))+eggAt('translate(190 24)','fa-tw fa-tw2',eggPath(STAR4(8),c,2.4));}},
 {id:'leaf',name:'落叶飘飘',en:'Falling leaf',slot:'bg',loop:10,
  css:'@keyframes fa-leaf{0%{transform:translate(0px,0px) rotate(0deg);opacity:0}6%{opacity:1}25%{transform:translate(12px,58px) rotate(50deg)}50%{transform:translate(-8px,118px) rotate(-15deg)}75%{transform:translate(10px,178px) rotate(40deg);opacity:1}100%{transform:translate(0px,236px) rotate(0deg);opacity:0}}'+eggAnim('.fa-leaf','fa-leaf 10s linear infinite',-1)+`.fa-leaf2{${eggDelay(-6)}}`,
  draw:({p})=>{const leaf=eggPath(LEAF,p.accent,2.2)+line('M0 -6V7',mix(p.accent,'#000000',.3),1.6);return eggAt('translate(26 30) rotate(-20) scale(1.6)','fa-leaf',leaf)+eggAt('translate(230 20) rotate(25) scale(1.5)','fa-leaf fa-leaf2',leaf);}},
 {id:'star',name:'小星星',en:'Little star',slot:'over',loop:3.2,
  css:'@keyframes fa-bob{0%,100%{transform:translate(0px,0px) rotate(-8deg)}50%{transform:translate(0px,-7px) rotate(8deg)}}'+eggAnim('.fa-bob','fa-bob 3.2s ease-in-out infinite'),
  draw:({p})=>eggAt('translate(34 56) scale(1.7)','fa-bob',eggPath(STAR5,mix(p.accent,'#FFFFFF',.45),2.4)+`<circle cx="-2.6" cy="0.6" r="1.3" fill="${INK}"/><circle cx="2.6" cy="0.6" r="1.3" fill="${INK}"/>`)},
 {id:'ahoge',name:'呆毛',en:'Cowlick',slot:'head',loop:2.6,
  // A crown strand drawn over the hair; a borderless hair-colour dab hides the root cap.
  // Scaled so its tip never rises above head y 27.
  fits:(t,style)=>t.accessory!==4&&!style.bun&&style.top>=36,
  css:'@keyframes fa-sway{0%,100%{transform:rotate(-7deg)}50%{transform:rotate(9deg)}}'+eggAnim('.fa-sway','fa-sway 2.6s ease-in-out infinite'),
  draw:({hc,style})=>{const k=Math.min(1,eggR2((style.top+10-27)/30));return eggAt(`translate(130 ${style.top+10}) scale(${k})`,'fa-sway',line(AHOGE,INK,9)+line(AHOGE,hc,4.6)+`<circle cx="0" cy="4" r="4.6" fill="${hc}"/>`);}},
 {id:'clouds',name:'云朵慢游',en:'Drifting clouds',slot:'bg',loop:12,
  css:'@keyframes fa-drift{0%,100%{transform:translate(0px,0px)}50%{transform:translate(16px,2px)}}'+eggAnim('.fa-drift','fa-drift 12s ease-in-out infinite')+'.fa-drift2{animation-direction:reverse}',
  draw:()=>{const cloud=`<path d="${CLOUD}" fill="#FFFFFF" fill-opacity=".72"/>`;return eggAt('translate(44 46) scale(1.5)','fa-drift',cloud)+eggAt('translate(214 30) scale(1.15)','fa-drift fa-drift2',cloud)+eggAt('translate(228 118) scale(.9)','fa-drift',cloud);}},
 {id:'tophat',name:'迷你礼帽',en:'Tiny top hat',slot:'head',loop:2.2,
  fits:t=>t.accessory!==3&&t.accessory!==4,
  css:'@keyframes fa-wob{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(7deg)}}'+eggAnim('.fa-wob','fa-wob 2.2s ease-in-out infinite'),
  draw:({p,style})=>{const k=Math.min(1.5,eggR2((style.top+16-29)/19)),dark=mix(p.shirt,'#000000',.45);
   return eggAt(`translate(164 ${style.top+16}) rotate(18) scale(${k})`,'fa-wob',eggPath('M-8 0L-7 -16C-7 -19 7 -19 7 -16L8 0Z',dark,2.8)+`<path d="M-7.6 -6L7.6 -6L7.9 -1.5L-7.9 -1.5Z" fill="${p.accent}"/>`+eggPath('M-14 0C-14 -3.5 14 -3.5 14 0C14 3.5 -14 3.5 -14 0Z',dark,2.8));}},
 {id:'hearts',name:'冒爱心',en:'Floating hearts',slot:'over',loop:3.4,
  css:'@keyframes fa-rise{0%{transform:translate(0px,0px) scale(.7);opacity:0}15%{opacity:1}70%{opacity:1}100%{transform:translate(4px,-40px) scale(1.1);opacity:0}}'+eggAnim('.fa-rise','fa-rise 3.4s ease-out infinite',-1.4)+`.fa-rise2{${eggDelay(-2.6)}}`,
  draw:()=>eggAt('translate(222 150) scale(1.6)','fa-rise',eggPath(HEART,'#E88F7A',2))+eggAt('translate(36 172) scale(1.25)','fa-rise fa-rise2',eggPath(HEART,'#E88F7A',2.2))},
 // Hip-hop: a firm nod with a short snap at 100 bpm, thumping cups, equaliser bars and a chain.
 // Replaces the plain headphones accessory (same band, bigger cups); skipped under a beanie.
 {id:'hiphop',name:'嘻哈节拍',en:'Hip-hop beat',slot:'head',loop:2.4,
  fits:t=>t.accessory!==4,
  css:'@keyframes fa-nod{0%,100%{translate:0px 0px}12%{translate:0px 4px}30%{translate:0px 0px}}'+headAnim('hiphop','fa-nod .6s cubic-bezier(.2,.9,.3,1) infinite')+
   '@keyframes fa-thump{0%,100%{transform:scale(1)}12%{transform:scale(1.1)}35%{transform:scale(1)}}'+eggAnim('.fa-thump','fa-thump .6s ease-out infinite')+
   '@keyframes fa-eq{0%,100%{transform:scaleY(.35)}12%{transform:scaleY(1)}45%{transform:scaleY(.55)}}'+eggAnim('.fa-eq','fa-eq .6s ease-out infinite')+`.fa-eq2{${eggDelay(-.15)}}.fa-eq3{${eggDelay(-.3)}}`,
  still:stillHead,
  draw:({p,t,style,w})=>{
   const dark=mix(INK,'#000000',.15),gold='#D2A25C',band=v4PhoneBand(style);
   const ring='<rect x="-6.5" y="-14" width="13" height="28" rx="6.5" fill="none" stroke="'+gold+'" stroke-width="2.6"/>';
   const bar=(x,y,h,k)=>eggAt(`translate(${x} ${y})`,'fa-eq'+(k?' fa-eq'+k:''),`<rect x="-3.2" y="${-h}" width="6.4" height="${h}" rx="2" fill="${p.accent}" stroke="${INK}" stroke-width="2.2"/>`);
   return {
    head:line(band,INK,11)+line(band,dark,6)+CUPS.map(x=>musicCup(x,'fa-thump',dark,w,ring)).join(''),
    // The chain is dropped when a scarf already wraps the neck.
    neck:t.accessory===5?'':line('M104 196C112 214 144 214 152 196',INK,6.4)+`<path d="M104 196C112 214 144 214 152 196" fill="none" stroke="${gold}" stroke-width="3.4" stroke-dasharray="4.5 2.5" stroke-linecap="round"/>`,
    over:bar(214,62,16,0)+bar(224,62,28,2)+bar(234,62,20,3)+bar(22,68,20,3)+bar(32,68,28,2)+bar(42,68,16,0)};}},
 // Pop: a light side-to-side sway about the chin, bouncing pastel cups with a sparkle, notes in arcs.
 {id:'pop',name:'流行小调',en:'Pop tune',slot:'head',loop:2,
  fits:t=>t.accessory!==4,
  // Rotating about the chin (128,182) with translate compensating, so the neck joint stays put.
  css:'@keyframes fa-groove{0%,50%,100%{rotate:0deg;translate:0px 0px}25%{rotate:3deg;translate:9.7px -6.45px}75%{rotate:-3deg;translate:-9.35px 6.95px}}'+headAnim('pop','fa-groove 2s ease-in-out infinite')+
   '@keyframes fa-bounce{0%,100%{transform:scale(1)}20%{transform:scale(1.06)}}'+eggAnim('.fa-bounce','fa-bounce .5s ease-out infinite')+
   '@keyframes fa-float{0%{transform:translate(0px,0px) rotate(-8deg) scale(.7);opacity:0}15%{opacity:1}50%{transform:translate(8px,-18px) rotate(8deg) scale(1)}100%{transform:translate(-2px,-38px) rotate(-6deg) scale(1);opacity:0}}'+
   '@keyframes fa-float2{0%{transform:translate(0px,0px) rotate(8deg) scale(.7);opacity:0}15%{opacity:1}50%{transform:translate(-8px,-18px) rotate(-8deg) scale(1)}100%{transform:translate(2px,-38px) rotate(6deg) scale(1);opacity:0}}'+
   eggAnim('.fa-float','fa-float 2s ease-in-out infinite',-.6)+eggAnim('.fa-float2','fa-float2 2s ease-in-out infinite',-1.4)+`.fa-float3{${eggDelay(-1.6)}}`,
  still:stillHead,
  draw:({p,style,w})=>{
   const soft=mix(p.accent,'#FFFFFF',.35),band=v4PhoneBand(style);
   const sparkle=`<path d="${STAR4(6)}" fill="#FFFFFF"/>`;
   return {
    head:line(band,INK,10)+line(band,soft,5)+CUPS.map(x=>musicCup(x,'fa-bounce',soft,w,sparkle)).join(''),
    over:eggAt('translate(222 110) scale(1.4)','fa-float',NOTE1)+eggAt('translate(24 116) scale(1.4)','fa-float2',NOTE2)+eggAt('translate(230 160) scale(1.1)','fa-float fa-float3',NOTE2)};}},
];
// Each egg owns an equal slice of the seed space. The first eight keep the draw they were
// released with (a second random pick among them); eggs added later take new slices above it,
// so a seed that already showed an egg keeps it.
const EGG_SLICE=0.0125,FIRST_EGGS=8;
export const V4_EGG_RATE=Math.round(V4_EGGS.length*EGG_SLICE*1e6)/1e6;
export function v4EggIndex(seed){
 const random=seededRng('egg:',String(seed)),r=random();
 if(r<FIRST_EGGS*EGG_SLICE)return Math.floor(random()*FIRST_EGGS);
 const i=Math.floor(r/EGG_SLICE);return i<V4_EGGS.length?i:-1;
}
// An egg that does not fit the final traits (a cowlick under a beanie) yields to the next one.
export function v4PickEgg(index,t,style){
 if(!(index>=0))return null;
 for(let k=0;k<V4_EGGS.length;k++){const e=V4_EGGS[(index+k)%V4_EGGS.length];if(!e.fits||e.fits(t,style))return e;}
 return null;
}
// `force` names an egg id to draw regardless of the seed (previews, tests).
export function v4ResolveEgg(seed,t,style,force){const i=V4_EGGS.findIndex(x=>x.id===force);return v4PickEgg(i>=0?i:v4EggIndex(seed),t,style);}
export function v4EggMarkup(egg,ctx){
 const out={defs:'',bg:'',neck:'',face:'',head:'',over:''};
 if(!egg)return out;
 out.defs=`<style>.fa-m{transform-box:view-box;transform-origin:0 0}${egg.css}@media (prefers-reduced-motion:reduce){.fa-m{animation:none!important}${egg.still||''}}</style>`;
 const drawn=egg.draw(ctx),parts=typeof drawn==='string'?{[egg.slot]:drawn}:drawn;
 for(const [slot,markup] of Object.entries(parts))if(markup)out[slot]=`<g data-egg="${egg.id}">${markup}</g>`;
 return out;
}
// One still frame of an animated avatar at `seconds` into its loop: every animation is paused and
// its clock offset through --fa-t. SVGs without egg styles come back unchanged.
export function v4FreezeFrame(svg,seconds){
 const t=Number.isFinite(seconds)?Math.round(seconds*1000)/1000:0;
 return String(svg).replace('<style>',`<style>svg{--fa-t:${t}s}svg *{animation-play-state:paused!important}`);
}
