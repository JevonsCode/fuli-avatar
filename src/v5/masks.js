// v5 masks: pushed up onto the upper left of the head, resting on the hair at the side. The long
// axis runs from upper right (forehead) down to lower left (chin) at about 48 degrees, and the
// face is turned toward the upper left in a 3/4 view: the oval is squeezed across its width, the
// features shift toward the far side, and the far eye is smaller and narrower than the near one.
// It never reaches the eyes (lowest point head-frame x < 72) and stays inside the canvas (y >= 27).
import {INK,mix,line} from '../v4/util.js';
import {RARE_CAT_PNG} from './rare-cat.js';
const MASK_OVAL='M0 -30C17 -30 24 -14 23 2C22 20 12 30 0 30C-12 30 -22 20 -23 2C-24 -14 -17 -30 0 -30Z';
const maskPath=(d,fill,w)=>`<path d="${d}" fill="${fill}" stroke="${INK}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const holes=pts=>pts.map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.6" fill="${INK}"/>`).join('');
const EAR_L='M-21 -12L-17 -36L-4 -26Z',EAR_R='M21 -12L17 -36L4 -26Z';
const INNER_EARS='<path d="M-16 -20L-15.5 -30L-8.5 -25.5ZM16 -20L15.5 -30L8.5 -25.5Z" fill="#E8A0A8"/>';
const catEye=fill=>`<ellipse cx="0" cy="0" rx="5" ry="3.2" transform="rotate(-8)" fill="${fill}"/><ellipse cx="0" cy="0" rx="2" ry="2.6" fill="${INK}"/>`;
const catMid=lod=>'<path d="M-2.8 5H2.8L0 8.6Z" fill="#E58C9A"/>'+line('M-5 11C-3 14 -1 14 0 11C1 14 3 14 5 11',INK,1.8)+
 (lod<2?line('M-11 8L-22 5M-11 11.5L-22 12.5M11 8L22 5M11 11.5L22 12.5',INK,1.6):'');
// Each mask has a base (outline, ears, patches; not shifted), one eye drawn for the near (right)
// side at the origin and mirrored for the far side, and mid features on the centre line.
export const V5_MASKS=[
 {name:'冰球面具',en:'Hockey mask',
  base:w=>maskPath(MASK_OVAL,'#F1ECE1',w),
  eye:()=>`<path d="M-6 3C-4 -4 3 -6 6 -1C5 4 -2 6 -6 3Z" fill="${INK}"/>`,
  mid:lod=>lod<2?holes([[-8,-21],[0,-23],[8,-21],[-4,-15],[4,-15],[-16,7],[-11,11],[11,11],[16,7],[-6,19],[0,21],[6,19]])+line('M0 -2V9M-4 12L-2.5 15.5M4 12L2.5 15.5',mix('#F1ECE1','#000000',.35),1.8):''},
 {name:'小丑面具',en:'Clown mask',
  base:w=>maskPath(MASK_OVAL,'#FBF8F2',w),
  eye:()=>`<path d="M0 -11L4.5 0L0 11L-4.5 0Z" fill="#6E9BD6"/><ellipse cx="0" cy="0" rx="2.4" ry="3.2" fill="${INK}"/>`,
  mid:lod=>maskPath('M-15 9C-9 22 9 22 15 9C9 15 -9 15 -15 9Z','#D9534F',2)+`<circle cx="0" cy="3" r="5.4" fill="#D9534F" stroke="${INK}" stroke-width="2.4"/>`+(lod<2?'<circle cx="-1.6" cy="1.4" r="1.5" fill="#FFFFFF"/>':'')},
 {name:'英雄面具',en:'Silver hero mask',
  base:w=>maskPath(MASK_OVAL,'#C7CCD2',w),
  eye:lod=>`<ellipse cx="0" cy="0" rx="8.2" ry="5.4" transform="rotate(-22)" fill="#FFE7A1" stroke="${INK}" stroke-width="2.4"/>`+(lod<2?'<ellipse cx="0" cy="0" rx="3.4" ry="1.8" transform="rotate(-22)" fill="#FFFBEA"/>'+line('M-5 -17C-1 -17 4 -15 8 -9',mix('#C7CCD2','#000000',.3),1.8):''),
  mid:lod=>maskPath('M-2.6 -30L2.6 -30L2 -8L-2 -8Z','#E7EAEE',2)+(lod<2?line('M-7 16H7',INK,2.4):'')},
 // Silver shaded cat: a soft radial shade from silvery white to grey at the edges and ear tips.
 // The gradient ids are shared by every silver cat on a page; all copies are identical.
 {name:'银渐层猫面具',en:'Silver cat mask',
  base:w=>'<defs><radialGradient id="fuli-avatar-silver-cat" cx="0.5" cy="0.55" r="0.62"><stop offset="0.45" stop-color="#F4F5F6"/><stop offset="1" stop-color="#9EA4AB"/></radialGradient>'+
   '<linearGradient id="fuli-avatar-silver-ear" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#E9EBED"/><stop offset="1" stop-color="#7E858D"/></linearGradient></defs>'+
   maskPath(EAR_L,'url(#fuli-avatar-silver-ear)',w)+maskPath(EAR_R,'url(#fuli-avatar-silver-ear)',w)+INNER_EARS+maskPath(MASK_OVAL,'url(#fuli-avatar-silver-cat)',w),
  eye:()=>catEye('#4FA392'),mid:catMid},
 // Bi-colour cat: white with a bold orange patch over the far ear and around the far eye.
 {name:'两花猫面具',en:'Bi-colour cat mask',
  base:w=>{const patch='#D98A3D';return maskPath(EAR_L,patch,w)+maskPath(EAR_R,'#FBF8F2',w)+'<path d="M16 -20L15.5 -30L8.5 -25.5Z" fill="#E8A0A8"/>'+
   `<path d="${MASK_OVAL}" fill="#FBF8F2"/>`+`<path d="M-23 2C-24 -14 -17 -30 0 -30C1 -24 -1 -17 -3 -12C-2 -5 -4 1 -9 4C-14 6 -20 6 -23 2Z" fill="${patch}"/>`+
   `<path d="${MASK_OVAL}" fill="none" stroke="${INK}" stroke-width="${w}" stroke-linejoin="round"/>`;},
  eye:()=>catEye('#E2B23A'),mid:catMid},
];
// The rare mask is Jevons' own cat drawing, embedded as a PNG. It sits in the same place and 3/4 turn
// as the other masks, a little smaller because the whole cat is taller, with a soft ink shadow so
// it rests on the hair. The filter id is shared by every copy on a page; all copies are identical.
export const V5_RARE_MASK={name:'愁眉猫面具',en:'Worried cat mask',
 picture:()=>'<defs><filter id="fuli-avatar-cat-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0.8" dy="1.2" stdDeviation="0.9" flood-color="#22303D" flood-opacity=".35"/></filter></defs>'+
  `<image href="${RARE_CAT_PNG}" x="-28" y="-24.68" width="56" height="49.35" preserveAspectRatio="none" filter="url(#fuli-avatar-cat-shadow)"/>`};
// 3/4 view: width squeezed, features shifted toward the far (left, -x) side, far eye mirrored and
// smaller. Drawn in the head frame over the fringe; outline width is divided by the 1.2 scale.
const TURN='scale(.78 1)',SHIFT=-3.5;
export function v5MaskMarkup(index,w,lod){
 const m=index<V5_MASKS.length?V5_MASKS[index]:V5_RARE_MASK,ey=-5,mw=Math.round(w/1.2*100)/100;
 const place='<g data-part="mask" data-style="'+index+'"><g transform="translate(70 76) rotate(48) scale(1.2)">';
 // A picture cannot move its own features, so the turn is a squeeze plus a slight skew.
 if(m.picture)return place+`<g transform="${TURN} skewY(-6)">${m.picture()}</g></g></g>`;
 const far=`<g transform="translate(${-9.5+SHIFT} ${ey}) scale(-.7 .86)">${m.eye(lod)}</g>`,near=`<g transform="translate(${9.5+SHIFT/2} ${ey}) scale(1.04 1)">${m.eye(lod)}</g>`;
 return place+`<g transform="${TURN}">`+
  m.base(mw,lod)+far+near+`<g transform="translate(${SHIFT} 0)">${m.mid(lod)}</g></g></g></g>`;
}
