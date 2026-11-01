// v5 masks: pushed up onto the upper left of the head and leaning, its axis running from upper
// right to lower left, resting on the hair at the side. The lowest point stays left of the eyes
// (head frame x < 80) and the highest stays inside the canvas (head frame y >= 27).
import {INK,mix,line} from '../v4/util.js';
const MASK_OVAL='M0 -30C17 -30 24 -14 23 2C22 20 12 30 0 30C-12 30 -22 20 -23 2C-24 -14 -17 -30 0 -30Z';
const maskPath=(d,fill,w)=>`<path d="${d}" fill="${fill}" stroke="${INK}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const holes=pts=>pts.map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.6" fill="${INK}"/>`).join('');
const eyePair=(rx,ry,fill,tilt=0)=>[-1,1].map(s=>`<ellipse cx="${s*9.5}" cy="-5" rx="${rx}" ry="${ry}" transform="rotate(${s*tilt} ${s*9.5} -5)" fill="${fill}"/>`).join('');
const EAR_L='M-21 -12L-17 -36L-4 -26Z',EAR_R='M21 -12L17 -36L4 -26Z';
const INNER_EARS='<path d="M-16 -20L-15.5 -30L-8.5 -25.5ZM16 -20L15.5 -30L8.5 -25.5Z" fill="#E8A0A8"/>';
const catFace=(w,lod,eye)=>eyePair(5,3.2,eye,-8)+eyePair(2,2.6,INK,-8)+`<path d="M-2.8 5H2.8L0 8.6Z" fill="#E58C9A"/>`+line('M-5 11C-3 14 -1 14 0 11C1 14 3 14 5 11',INK,1.8)+
 (lod<2?line('M-11 8L-22 5M-11 11.5L-22 12.5M11 8L22 5M11 11.5L22 12.5',INK,1.6):'');
export const V5_MASKS=[
 {name:'冰球面具',en:'Hockey mask',draw:(w,lod)=>maskPath(MASK_OVAL,'#F1ECE1',w)+
  `<path d="M-15 -3C-13 -10 -6 -11 -3 -6C-4 -1 -11 1 -15 -3ZM15 -3C13 -10 6 -11 3 -6C4 -1 11 1 15 -3Z" fill="${INK}"/>`+
  (lod<2?holes([[-8,-21],[0,-23],[8,-21],[-4,-15],[4,-15],[-16,7],[-11,11],[11,11],[16,7],[-6,19],[0,21],[6,19]])+line('M0 -2V9M-4 12L-2.5 15.5M4 12L2.5 15.5',mix('#F1ECE1','#000000',.35),1.8):'')},
 {name:'小丑面具',en:'Clown mask',draw:(w,lod)=>maskPath(MASK_OVAL,'#FBF8F2',w)+
  `<path d="M-9.5 -16L-5 -5L-9.5 6L-14 -5ZM9.5 -16L14 -5L9.5 6L5 -5Z" fill="#6E9BD6"/>`+eyePair(2.4,3.2,INK)+
  maskPath('M-15 9C-9 22 9 22 15 9C9 15 -9 15 -15 9Z','#D9534F',2)+
  `<circle cx="0" cy="3" r="5.4" fill="#D9534F" stroke="${INK}" stroke-width="2.4"/>`+(lod<2?'<circle cx="-1.6" cy="1.4" r="1.5" fill="#FFFFFF"/>':'')},
 {name:'英雄面具',en:'Silver hero mask',draw:(w,lod)=>maskPath(MASK_OVAL,'#C7CCD2',w)+
  maskPath('M-2.6 -30L2.6 -30L2 -8L-2 -8Z','#E7EAEE',2)+
  `<g stroke="${INK}" stroke-width="2.4">${eyePair(8.2,5.4,'#FFE7A1',-22)}</g>`+
  (lod<2?eyePair(3.4,1.8,'#FFFBEA',-22)+line('M-7 16H7',INK,2.4)+line('M-18 -14C-14 -20 -8 -22 -4 -22M18 -14C14 -20 8 -22 4 -22',mix('#C7CCD2','#000000',.3),1.8):'')},
 // Silver shaded cat: a soft radial shade from silvery white to grey at the edges and ear tips.
 // The gradient ids are shared by every silver cat on a page; all copies are identical.
 {name:'银渐层猫面具',en:'Silver cat mask',draw:(w,lod)=>
  '<defs><radialGradient id="fuli-avatar-silver-cat" cx="0.5" cy="0.55" r="0.62"><stop offset="0.45" stop-color="#F4F5F6"/><stop offset="1" stop-color="#9EA4AB"/></radialGradient>'+
  '<linearGradient id="fuli-avatar-silver-ear" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#E9EBED"/><stop offset="1" stop-color="#7E858D"/></linearGradient></defs>'+
  maskPath(EAR_L,'url(#fuli-avatar-silver-ear)',w)+maskPath(EAR_R,'url(#fuli-avatar-silver-ear)',w)+INNER_EARS+
  maskPath(MASK_OVAL,'url(#fuli-avatar-silver-cat)',w)+catFace(w,lod,'#4FA392')},
 // Bi-colour cat: white with a bold orange patch over the left ear and around the left eye.
 {name:'两花猫面具',en:'Bi-colour cat mask',draw:(w,lod)=>{const patch='#D98A3D';
  return maskPath(EAR_L,patch,w)+maskPath(EAR_R,'#FBF8F2',w)+'<path d="M16 -20L15.5 -30L8.5 -25.5Z" fill="#E8A0A8"/>'+
   `<path d="${MASK_OVAL}" fill="#FBF8F2"/>`+
   `<path d="M-23 2C-24 -14 -17 -30 0 -30C1 -24 -1 -17 -3 -12C-2 -5 -4 1 -9 4C-14 6 -20 6 -23 2Z" fill="${patch}"/>`+
   `<path d="${MASK_OVAL}" fill="none" stroke="${INK}" stroke-width="${w}" stroke-linejoin="round"/>`+catFace(w,lod,'#E2B23A');}},
];
// A rarer cat drawn from a sketch: cream face shading to warm taupe on its right side and cheeks,
// a notched right ear, big glossy eyes with thin gold rims under worried brows, a "w" mouth.
const RARE_HEAD='M-24 -14C-26 -24 -20 -30 -14 -28C-8 -32 8 -32 14 -28C20 -31 27 -24 25 -12C28 0 24 18 12 26C4 31 -6 31 -14 26C-24 18 -28 0 -24 -14Z';
export const V5_RARE_MASK={name:'愁眉猫面具',en:'Worried cat mask',draw:(w,lod)=>
 maskPath('M-21 -22L-25 -35L-11 -29Z','#F3EDE2',w)+maskPath('M13 -29L23 -36L22.5 -30L26.5 -29L24 -18Z','#CDB89A',w)+
 `<path d="${RARE_HEAD}" fill="#F3EDE2"/>`+
 '<path d="M2 -31C14 -32 26 -26 25 -12C28 0 24 18 12 26C6 30 0 30 -4 29C2 20 6 8 4 -4C3 -16 0 -24 2 -31Z" fill="#CDB89A"/>'+
 '<ellipse cx="-13" cy="15" rx="7" ry="4.2" fill="#E3D5C0"/>'+
 `<path d="${RARE_HEAD}" fill="none" stroke="${INK}" stroke-width="${w}" stroke-linejoin="round"/>`+
 [[-10,-8],[9,-9]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="6.2" fill="#1E2329" stroke="#C9A04A" stroke-width="1.6"/>`+(lod<2?`<circle cx="${x-2.2}" cy="${y-2.2}" r="1.9" fill="#FFFFFF"/>`:'')).join('')+
 line('M-17 -16C-12 -19 -8 -21 -4 -21M4 -22C8 -22 12 -20 17 -17',INK,2.2)+
 '<path d="M-2.4 1H2.4L0 3.8Z" fill="#E58C9A"/>'+line('M-4 6C-3 8.5 -1 8.5 0 6C1 8.5 3 8.5 4 6',INK,1.6)+
 (lod<2?line('M-27 3L-25 8M23 15L26 19',INK,2.2):'')};
// Drawn in the head frame over the fringe. Outline width is divided by the 1.2 scale so it matches
// the rest of the character.
export function v5MaskMarkup(index,w,lod){
 const m=index<V5_MASKS.length?V5_MASKS[index]:V5_RARE_MASK;
 return `<g data-part="mask" data-style="${index}"><g transform="translate(74 75) rotate(28) scale(1.2)">${m.draw(Math.round(w/1.2*100)/100,lod)}</g></g>`;
}
