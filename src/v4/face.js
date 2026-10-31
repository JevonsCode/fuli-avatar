// v4 head: ears, face, neck and features. Features use ink only; no outlines inside the face.
import {INK,mix,shape,line} from './util.js';
export const V4_FACE='M68 104C68 76 94 62 128 62C162 62 188 76 188 104L188 128C188 160 162 182 128 182C94 182 68 160 68 128Z';
export const V4_NECK='M110 166L110 196C120 204 136 204 146 196L146 166Z';
export function v4Ears(skin,lod,w){
 const ear=(d,inner)=>shape(d,skin,INK,w)+(lod===0?line(inner,mix(skin,'#9A5A44',.45),2.4):'');
 return ear('M72 118C62 112 54 118 56 130C58 142 64 148 74 146Z','M66 124C62 128 63 136 68 140')+
  ear('M184 118C194 112 202 118 200 130C198 142 192 148 182 146Z','M190 124C194 128 193 136 188 140');
}
// Eyes sit at (106,130) and (150,130): large dark ovals like the built-ins, one catchlight
// upper-right and a short upper-lid stroke. Only friendly expressions; no lidded or sleepy eyes.
const EL=106,ER=150,EY=130;
const oval=(x,rx,ry)=>`<ellipse cx="${x}" cy="${EY}" rx="${rx}" ry="${ry}" fill="${INK}"/>`;
const glint=(x,lod,r,dy=4.5)=>lod===2?'':`<circle cx="${x+3.4}" cy="${EY-dy}" r="${r}" fill="#FFFFFF"/>`;
const lid=x=>`M${x-9} ${EY-9}C${x-6} ${EY-15} ${x+4} ${EY-16} ${x+10} ${EY-11}`;
export const V4_EYES=[
 {name:'亮眼睛',draw:lod=>oval(EL,8.5,11)+oval(ER,8.5,11)+glint(EL,lod,lod===0?2.8:3.2)+glint(ER,lod,lod===0?2.8:3.2)+line(lid(EL)+lid(ER),INK,3.4)},
 {name:'笑眯眯',draw:()=>line(`M${EL-10} ${EY+3}C${EL-6} ${EY-9} ${EL+6} ${EY-9} ${EL+10} ${EY+3}M${ER-10} ${EY+3}C${ER-6} ${EY-9} ${ER+6} ${EY-9} ${ER+10} ${EY+3}`,INK,5.2)},
 {name:'圆眼睛',draw:lod=>oval(EL,9,9.5)+oval(ER,9,9.5)+glint(EL,lod,lod===0?3:3.4,3.5)+glint(ER,lod,lod===0?3:3.4,3.5)},
];
export const V4_BROWS=[
 {name:'柔和',d:'M96 108C101 104 108 103 114 105M142 105C148 103 155 104 160 108'},
 {name:'平直',d:'M96 106L114 104M142 104L160 106'},
 {name:'上扬',d:'M97 109C102 103 108 101 115 101M141 101C148 101 154 103 159 109'},
];
// Every mouth smiles; flat, pursed and downturned shapes are excluded on purpose.
export const V4_MOUTHS=[
 {name:'微笑',draw:()=>line('M117 152C123 159 133 159 139 152',INK,4.2)},
 {name:'开心',draw:()=>shape('M115 150C120 151 136 151 141 150C140 160 134 165 128 165C122 165 116 160 115 150Z',INK,INK,3)+shape('M121 160C125 157 131 157 135 160C133 163 130 164 128 164C126 164 123 163 121 160Z','#D9786A','none')},
 {name:'坏笑',draw:()=>line('M117 153C123 158 132 158 139 150',INK,4.2)},
];
export function v4Features(t,skin,lod,hideBrows){
 let s='';
 // Soft cheek warmth and a tiny nose hook, dropped at icon sizes.
 if(lod<2)s+=`<ellipse cx="92" cy="148" rx="9" ry="5" fill="#E88F7A" opacity=".26"/><ellipse cx="164" cy="148" rx="9" ry="5" fill="#E88F7A" opacity=".26"/>`;
 if(lod<2)s+=line('M129 136C127 140 127 142 131 143',mix(skin,'#7A4636',.55),2.8);
 if(!hideBrows)s+=line(V4_BROWS[t.brows].d,INK,lod===2?5:4.2);
 s+=V4_EYES[t.eyes].draw(lod)+V4_MOUTHS[t.mouth].draw(lod);
 return s;
}
