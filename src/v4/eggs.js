// v4 easter eggs: rare, gently animated extras. Opt-in only ({ eggs: true }); without it the
// renderer output is byte-identical. The egg comes from its own seed namespace, so it never
// shifts trait draws. Rest poses are the static markup: renderers that skip CSS animation, PNG
// export and prefers-reduced-motion all show the decoration standing still.
import {seededRng,INK,mix,line} from './util.js';
export const V4_EGG_RATE=0.1;
const eggR2=n=>Math.round(n*100)/100;
// Wrapper places a part; the inner group animates about the wrapper's local origin.
const eggAt=(transform,cls,body)=>`<g transform="${transform}"><g class="fa-m ${cls}">${body}</g></g>`;
const eggPath=(d,fill,w)=>`<path d="${d}" fill="${fill}" stroke="${INK}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const STAR4=s=>{const a=eggR2(s*.16),b=eggR2(s*.3);return `M0 ${-s}C${a} ${-b} ${b} ${-a} ${s} 0C${b} ${a} ${a} ${b} 0 ${s}C${-a} ${b} ${-b} ${a} ${-s} 0C${-b} ${-a} ${-a} ${-b} 0 ${-s}Z`;};
const STAR5=(()=>{let d='';for(let i=0;i<10;i++){const r=i%2?5.4:12,a=Math.PI*(i/5-.5);d+=(i?'L':'M')+eggR2(r*Math.cos(a))+' '+eggR2(r*Math.sin(a));}return d+'Z';})();
const LEAF='M0 -10C8 -8 10 2 0 11C-10 2 -8 -8 0 -10Z';
const CLOUD='M-18 6C-25 6 -25 -5 -16 -5C-15 -13 -4 -15 1 -8C5 -14 17 -12 16 -4C24 -4 24 6 16 6Z';
const HEART='M0 5C-9 -1 -10 -8 -5.5 -10C-2.5 -11.3 0 -9 0 -6.5C0 -9 2.5 -11.3 5.5 -10C10 -8 9 -1 0 5Z';
const AHOGE='M0 4C-4 -10 2 -24 14 -28C22 -30 24 -22 17 -19';
// Slots: bg (behind the character), face (over the face, under the fringe, head frame),
// head (over head-worn accessories, head frame), over (top of the canvas).
export const V4_EGGS=[
 {id:'blink',name:'眨眨眼',en:'Blink',slot:'face',
  css:'@keyframes fa-blink{0%,88%,100%{opacity:0}90%,95%{opacity:1}}.fa-blink{animation:fa-blink 4.8s infinite}',
  // Reduced motion keeps a still wink instead of a blink.
  still:'.fa-wink{opacity:1}',
  draw:({skin})=>{const lid=x=>`<ellipse cx="${x}" cy="129" rx="12.5" ry="13.5" fill="${skin}"/>`+line(`M${x-9} 131C${x-5} 136 ${x+5} 136 ${x+9} 131`,INK,4.2);
   return `<g class="fa-m fa-blink" opacity="0">${lid(106)}</g><g class="fa-m fa-blink fa-wink" opacity="0">${lid(150)}</g>`;}},
 {id:'sparkle',name:'闪闪亮',en:'Sparkle',slot:'over',
  css:'@keyframes fa-tw{0%,100%{transform:scale(1) rotate(0deg)}50%{transform:scale(.55) rotate(45deg)}}.fa-tw{animation:fa-tw 2.4s ease-in-out infinite}.fa-tw2{animation-delay:-1.2s}',
  draw:({p})=>{const c=mix(p.accent,'#FFFFFF',.6);return eggAt('translate(212 50)','fa-tw',eggPath(STAR4(21),c,3))+eggAt('translate(236 88)','fa-tw fa-tw2',eggPath(STAR4(11),c,2.6))+eggAt('translate(190 24)','fa-tw fa-tw2',eggPath(STAR4(8),c,2.4));}},
 {id:'leaf',name:'落叶飘飘',en:'Falling leaf',slot:'bg',
  css:'@keyframes fa-leaf{0%{transform:translate(0px,0px) rotate(0deg);opacity:0}6%{opacity:1}25%{transform:translate(12px,58px) rotate(50deg)}50%{transform:translate(-8px,118px) rotate(-15deg)}75%{transform:translate(10px,178px) rotate(40deg);opacity:1}100%{transform:translate(0px,236px) rotate(0deg);opacity:0}}.fa-leaf{animation:fa-leaf 10s linear -1s infinite}.fa-leaf2{animation-delay:-6s}',
  draw:({p})=>{const leaf=eggPath(LEAF,p.accent,2.2)+line('M0 -6V7',mix(p.accent,'#000000',.3),1.6);return eggAt('translate(26 30) rotate(-20) scale(1.6)','fa-leaf',leaf)+eggAt('translate(230 20) rotate(25) scale(1.5)','fa-leaf fa-leaf2',leaf);}},
 {id:'star',name:'小星星',en:'Little star',slot:'over',
  css:'@keyframes fa-bob{0%,100%{transform:translate(0px,0px) rotate(-8deg)}50%{transform:translate(0px,-7px) rotate(8deg)}}.fa-bob{animation:fa-bob 3.2s ease-in-out infinite}',
  draw:({p})=>eggAt('translate(34 56) scale(1.7)','fa-bob',eggPath(STAR5,mix(p.accent,'#FFFFFF',.45),2.4)+`<circle cx="-2.6" cy="0.6" r="1.3" fill="${INK}"/><circle cx="2.6" cy="0.6" r="1.3" fill="${INK}"/>`)},
 {id:'ahoge',name:'呆毛',en:'Cowlick',slot:'head',
  // A crown strand drawn over the hair; a borderless hair-colour dab hides the root cap.
  // Scaled so its tip never rises above head y 27.
  fits:(t,style)=>t.accessory!==4&&!style.bun&&style.top>=36,
  css:'@keyframes fa-sway{0%,100%{transform:rotate(-7deg)}50%{transform:rotate(9deg)}}.fa-sway{animation:fa-sway 2.6s ease-in-out infinite}',
  draw:({hc,style})=>{const k=Math.min(1,eggR2((style.top+10-27)/30));return eggAt(`translate(130 ${style.top+10}) scale(${k})`,'fa-sway',line(AHOGE,INK,9)+line(AHOGE,hc,4.6)+`<circle cx="0" cy="4" r="4.6" fill="${hc}"/>`);}},
 {id:'clouds',name:'云朵慢游',en:'Drifting clouds',slot:'bg',
  css:'@keyframes fa-drift{0%,100%{transform:translate(0px,0px)}50%{transform:translate(16px,2px)}}.fa-drift{animation:fa-drift 11s ease-in-out infinite}.fa-drift2{animation-duration:14s;animation-direction:reverse}',
  draw:()=>{const cloud=`<path d="${CLOUD}" fill="#FFFFFF" fill-opacity=".72"/>`;return eggAt('translate(44 46) scale(1.5)','fa-drift',cloud)+eggAt('translate(214 30) scale(1.15)','fa-drift fa-drift2',cloud)+eggAt('translate(228 118) scale(.9)','fa-drift',cloud);}},
 {id:'tophat',name:'迷你礼帽',en:'Tiny top hat',slot:'head',
  fits:t=>t.accessory!==3&&t.accessory!==4,
  css:'@keyframes fa-wob{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(7deg)}}.fa-wob{animation:fa-wob 2.2s ease-in-out infinite}',
  draw:({p,style})=>{const k=Math.min(1.5,eggR2((style.top+16-29)/19)),dark=mix(p.shirt,'#000000',.45);
   return eggAt(`translate(164 ${style.top+16}) rotate(18) scale(${k})`,'fa-wob',eggPath('M-8 0L-7 -16C-7 -19 7 -19 7 -16L8 0Z',dark,2.8)+`<path d="M-7.6 -6L7.6 -6L7.9 -1.5L-7.9 -1.5Z" fill="${p.accent}"/>`+eggPath('M-14 0C-14 -3.5 14 -3.5 14 0C14 3.5 -14 3.5 -14 0Z',dark,2.8));}},
 {id:'hearts',name:'冒爱心',en:'Floating hearts',slot:'over',
  css:'@keyframes fa-rise{0%{transform:translate(0px,0px) scale(.7);opacity:0}15%{opacity:1}70%{opacity:1}100%{transform:translate(4px,-40px) scale(1.1);opacity:0}}.fa-rise{animation:fa-rise 3.4s ease-out -1.4s infinite}.fa-rise2{animation-delay:-2.6s}',
  draw:()=>eggAt('translate(222 150) scale(1.6)','fa-rise',eggPath(HEART,'#E88F7A',2))+eggAt('translate(36 172) scale(1.25)','fa-rise fa-rise2',eggPath(HEART,'#E88F7A',2.2))},
];
// The seed alone decides whether an egg appears (about V4_EGG_RATE) and which one.
export function v4EggIndex(seed){const random=seededRng('egg:',String(seed));return random()<V4_EGG_RATE?Math.floor(random()*V4_EGGS.length):-1;}
// An egg that does not fit the final traits (a cowlick under a beanie) yields to the next one.
export function v4PickEgg(index,t,style){
 if(!(index>=0))return null;
 for(let k=0;k<V4_EGGS.length;k++){const e=V4_EGGS[(index+k)%V4_EGGS.length];if(!e.fits||e.fits(t,style))return e;}
 return null;
}
// `force` names an egg id to draw regardless of the seed (previews, tests).
export function v4ResolveEgg(seed,t,style,force){const i=V4_EGGS.findIndex(x=>x.id===force);return v4PickEgg(i>=0?i:v4EggIndex(seed),t,style);}
export function v4EggMarkup(egg,ctx){
 const out={defs:'',bg:'',face:'',head:'',over:''};
 if(!egg)return out;
 out.defs=`<style>.fa-m{transform-box:view-box;transform-origin:0 0}${egg.css}@media (prefers-reduced-motion:reduce){.fa-m{animation:none!important}${egg.still||''}}</style>`;
 out[egg.slot]=`<g data-egg="${egg.id}">${egg.draw(ctx)}</g>`;
 return out;
}
