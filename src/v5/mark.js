// v5 site signature: a tiny, low-contrast line of text worked into the design like a maker's mark.
// It reads as texture at normal size and only becomes legible when zoomed. Placement comes from its
// own seed namespace, so it never shifts trait draws; about a third of seeds carry none. It only
// sits on a part the character has, in that part's own colour, and never on the face.
import {seededRng,mix,INK} from '../v4/util.js';
const SIG='有点.意思.com';
// Garments with a plain chest: sweatshirt, hoodie, turtleneck, T-shirt.
const PLAIN_CHEST=[0,4,5,6],MARK_HOODIE=4,MARK_BEANIE=4;
export const V5_MARK_NONE=1/3;
// The spots that fit these traits. frame: up the background edge; chest: under the pocket;
// label: a sewn tab on the right sleeve; seam: along the left shoulder's outline; cord: printed
// down a hoodie drawstring; lens: a lens corner; hat: a woven tag on the beanie cuff.
export function v5MarkSpots(t,hasLens){
 const spots=['frame','label','seam'];
 if(PLAIN_CHEST.includes(t.outfit))spots.push('chest');
 if(t.outfit===MARK_HOODIE)spots.push('cord');
 if(hasLens)spots.push('lens');
 if(t.accessory===MARK_BEANIE)spots.push('hat');
 return spots;
}
export function v5MarkPlace(seed,t,hasLens){
 const random=seededRng('mark:',String(seed)),skip=random(),pick=random();
 if(skip<V5_MARK_NONE)return null;
 const spots=v5MarkSpots(t,hasLens);
 return spots[Math.floor(pick*spots.length)];
}
const lum=hex=>{const [r,g,b]=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));return .299*r+.587*g+.114*b;};
// A shade a little darker (or lighter, on dark cloth) than what it sits on.
const tone=(hex,k)=>lum(hex)>110?mix(hex,'#000000',k):mix(hex,'#FFFFFF',k);
const sig=(attrs,fill,size)=>`<text ${attrs} font-family="sans-serif" font-size="${size}" text-anchor="middle" dominant-baseline="central" fill="${fill}">${SIG}</text>`;
// The left shoulder of the garment outline (the first curve of V4_BODY), from the collar to the arm.
const SEAM='M110 188C84 190 56 198 42 216';
// Markup per slot: frame (canvas, behind the hair), chest (canvas, on the garment), lens (head frame,
// over the glasses) and hat (head frame, inside the beanie group so it follows the hat's tilt).
export function v5MarkMarkup(place,p,dark,lod){
 const out={frame:'',chest:'',lens:'',hat:''};
 if(!place||lod===2)return out;
 if(place==='frame')out.frame=sig('transform="translate(251.6 128) rotate(90)"',tone(p.bg,.16),3.2);
 if(place==='chest')out.chest=sig('x="164" y="250"',tone(p.shirt,.2),3.4);
 if(place==='label'){const tab=tone(p.shirt,.14);
  out.chest=`<g transform="translate(206 242) rotate(-22)"><rect x="-10" y="-3.6" width="20" height="7.2" rx="1.2" fill="${tab}" stroke="${tone(p.shirt,.3)}" stroke-width=".6"/>`+sig('x="0" y="0"',tone(tab,.22),2.1)+'</g>';}
 if(place==='seam')out.chest=`<defs><path id="fuli-avatar-seam" d="${SEAM}"/></defs><text font-family="sans-serif" font-size="2.6" dominant-baseline="central" fill="${mix(INK,'#FFFFFF',.16)}"><textPath href="#fuli-avatar-seam" startOffset="30%">${SIG}</textPath></text>`;
 if(place==='cord')out.chest=sig('transform="translate(138 225) rotate(90)"',tone(mix(p.accent,'#FFFFFF',.35),.28),1.9);
 if(place==='lens')out.lens=sig('transform="translate(157 140.5) rotate(-8)"',dark?'#FFFFFF':INK,2.2).replace('<text ','<text opacity=".3" ');
 if(place==='hat'){const cuff=mix(p.accent,'#000000',.2),tag=tone(cuff,.16);
  out.hat=`<g transform="translate(172 92) rotate(4)"><rect x="-10" y="-3.8" width="20" height="7.6" rx="1" fill="${tag}" stroke="${tone(cuff,.32)}" stroke-width=".6"/>`+sig('x="0" y="0"',tone(tag,.24),2.1)+'</g>';}
 return out;
}
