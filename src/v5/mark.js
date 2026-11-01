// v5 site signature: a tiny, low-contrast line of text that reads as texture at normal size and
// only becomes legible when zoomed. Placement comes from its own seed namespace, so it never
// shifts trait draws; about a third of seeds carry none. Never over the face.
import {seededRng,mix} from '../v4/util.js';
const SIG='有点.意思.com';
// Garments with a plain chest: sweatshirt, hoodie, turtleneck, T-shirt.
const PLAIN_CHEST=[0,4,5,6];
export const V5_MARK_NONE=1/3;
// Which spot a seed's signature takes for these traits: 'frame', 'chest', 'lens' or null.
export function v5MarkPlace(seed,t,hasLens){
 const random=seededRng('mark:',String(seed)),skip=random(),pick=random();
 if(skip<V5_MARK_NONE)return null;
 const spots=['frame'];
 if(PLAIN_CHEST.includes(t.outfit))spots.push('chest');
 if(hasLens)spots.push('lens');
 return spots[Math.floor(pick*spots.length)];
}
const lum=hex=>{const [r,g,b]=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));return .299*r+.587*g+.114*b;};
// A shade a little darker (or lighter, on dark cloth) than what it sits on.
const tone=(hex,k)=>lum(hex)>110?mix(hex,'#000000',k):mix(hex,'#FFFFFF',k);
const sig=(attrs,fill,size)=>`<text ${attrs} font-family="sans-serif" font-size="${size}" text-anchor="middle" fill="${fill}">${SIG}</text>`;
// Markup per slot: frame (canvas, behind the hair), chest (canvas, on the garment), lens (head frame).
export function v5MarkMarkup(place,p,dark,lod){
 const out={frame:'',chest:'',lens:''};
 if(!place||lod===2)return out;
 if(place==='frame')out.frame=sig('transform="translate(251.6 128) rotate(90)"',tone(p.bg,.16),3.2);
 if(place==='chest')out.chest=sig('x="164" y="251"',tone(p.shirt,.2),3.4);
 if(place==='lens')out.lens=sig('transform="translate(157 140.5) rotate(-8)"',dark?'#FFFFFF':'#22303D',2.2).replace('<text ','<text opacity=".3" ');
 return out;
}
