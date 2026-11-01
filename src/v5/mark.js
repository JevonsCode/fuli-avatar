// v5 site signature: a tiny, low-contrast line of text worked into the design like a maker's mark.
// It reads as texture at normal size and only becomes legible when zoomed. Placement comes from its
// own seed namespace, so it never shifts trait draws; about a third of seeds carry none. It only
// sits on a part the character has, in that part's own colour, and never on the face.
import {seededRng,mix,INK} from '../v4/util.js';
import {V5_LENSES} from './sunglasses.js';
const SIG='有点.意思.com';
// Garments with a plain chest: sweatshirt, hoodie, turtleneck, T-shirt.
const PLAIN_CHEST=[0,4,5,6],MARK_HOODIE=4,MARK_BEANIE=4;
export const V5_MARK_NONE=1/3;
// The spots that fit these traits, all on clothing or the background. frame: up the background
// edge; chest: under the pocket; label: a sewn tab on the right sleeve; seam: along the left
// shoulder's outline; cord: printed down a hoodie drawstring; hat: a woven tag on the beanie cuff.
export function v5MarkSpots(t){
 const spots=['frame','label','seam'];
 if(PLAIN_CHEST.includes(t.outfit))spots.push('chest');
 if(t.outfit===MARK_HOODIE)spots.push('cord');
 if(t.accessory===MARK_BEANIE)spots.push('hat');
 return spots;
}
export function v5MarkPlace(seed,t){
 const random=seededRng('mark:',String(seed)),skip=random(),pick=random();
 if(skip<V5_MARK_NONE)return null;
 const spots=v5MarkSpots(t);
 return spots[Math.floor(pick*spots.length)];
}
const lum=hex=>{const [r,g,b]=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));return .299*r+.587*g+.114*b;};
// A shade a little darker (or lighter, on dark cloth) than what it sits on.
const tone=(hex,k)=>lum(hex)>110?mix(hex,'#000000',k):mix(hex,'#FFFFFF',k);
const sig=(attrs,fill,size)=>`<text ${attrs} font-family="sans-serif" font-size="${size}" text-anchor="middle" dominant-baseline="central" fill="${fill}">${SIG}</text>`;
// The left shoulder of the garment outline (the first curve of V4_BODY), from the collar to the arm.
const SEAM='M110 188C84 190 56 198 42 216';
// A separate lens etching: about one sunglasses wearer in seven gets 「FULI」 etched in the viewer's
// left lens, near its top outer corner, slanted with the top rim and clipped to the lens so it never
// touches the frame. Its own seed namespace keeps it independent of the site mark above.
export const V5_ETCH_RATE=0.15;
export const v5LensEtch=(seed,t)=>t.accessory>=7&&t.accessory<=10&&seededRng('etch:',String(seed))()<V5_ETCH_RATE;
// Keyed by accessory 7-10: [lens outline, x, y, slant].
const LENS_MARKS={
 7:[V5_LENSES[0],-14,-8,4],8:[V5_LENSES[1],-12.5,-8,-8],9:[V5_LENSES[2],-13,-4.4,-4],10:[V5_LENSES[3],-11.5,-7,-16],
};
// Markup per slot: frame (canvas, behind the hair), chest (canvas, on the garment), lens (head frame,
// over the sunglasses) and hat (head frame, inside the beanie group so it follows the hat's tilt).
export function v5MarkMarkup(place,p,accessory,etch,lod){
 const out={frame:'',chest:'',lens:'',hat:''};
 if(lod===2)return out;
 // Etched into the tint: thin light italic in white at low opacity.
 if(etch){const [d,x,y,slant]=LENS_MARKS[accessory],id='fuli-avatar-lens-'+accessory;
  out.lens=`<g transform="translate(106 130)"><defs><clipPath id="${id}"><path d="${d}"/></clipPath></defs><g clip-path="url(#${id})">`+
   `<text transform="translate(${x} ${y}) rotate(${slant})" font-family="Georgia, serif" font-style="italic" font-weight="300" font-size="2.6" letter-spacing=".3" dominant-baseline="central" fill="#FFFFFF" opacity=".45">FULI</text></g></g>`;}
 if(!place)return out;
 if(place==='frame')out.frame=sig('transform="translate(251.6 128) rotate(90)"',tone(p.bg,.16),3.2);
 if(place==='chest')out.chest=sig('x="164" y="250"',tone(p.shirt,.2),3.4);
 if(place==='label'){const tab=tone(p.shirt,.14);
  out.chest=`<g transform="translate(206 242) rotate(-22)"><rect x="-10" y="-3.6" width="20" height="7.2" rx="1.2" fill="${tab}" stroke="${tone(p.shirt,.3)}" stroke-width=".6"/>`+sig('x="0" y="0"',tone(tab,.22),2.1)+'</g>';}
 if(place==='seam')out.chest=`<defs><path id="fuli-avatar-seam" d="${SEAM}"/></defs><text font-family="sans-serif" font-size="2.6" dominant-baseline="central" fill="${mix(INK,'#FFFFFF',.16)}"><textPath href="#fuli-avatar-seam" startOffset="30%">${SIG}</textPath></text>`;
 if(place==='cord')out.chest=sig('transform="translate(138 225) rotate(90)"',tone(mix(p.accent,'#FFFFFF',.35),.28),1.9);
 if(place==='hat'){const cuff=mix(p.accent,'#000000',.2),tag=tone(cuff,.16);
  out.hat=`<g transform="translate(172 92) rotate(4)"><rect x="-10" y="-3.8" width="20" height="7.6" rx="1" fill="${tag}" stroke="${tone(cuff,.32)}" stroke-width=".6"/>`+sig('x="0" y="0"',tone(tag,.24),2.1)+'</g>';}
 return out;
}
