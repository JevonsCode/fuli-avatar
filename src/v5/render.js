// v5 renderer: v4's character with two-colour outfits, sunglasses, rare masks and tilted beanies.
// Traits draw from the '5:' namespace; layer assembly is shared with v4 (composeAvatar).
import {seededRng} from '../v4/util.js';
import {V4_PALETTES,V4_SKINS,V4_HAIR} from '../v4/palettes.js';
import {V4_HAIRSTYLES} from '../v4/hair.js';
import {V4_EYES,V4_BROWS,V4_MOUTHS} from '../v4/face.js';
import {V4_ACCESSORIES,v4Accessory} from '../v4/accessory.js';
import {v4ResolveEgg} from '../v4/eggs.js';
import {composeAvatar} from '../v4/render.js';
import {V5_CLOTH,V5_COMBOS} from './colors.js';
import {V5_OUTFITS} from './outfit.js';
import {V5_SUNGLASSES,v5Sunglasses} from './sunglasses.js';
import {V5_MASKS,V5_RARE_MASK,v5MaskMarkup} from './masks.js';
import {v5MarkPlace,v5MarkMarkup} from './mark.js';
// Accessory indexes: 0-6 as v4, then sunglasses, then the masks, then the rare mask.
const SHADES_FIRST=V4_ACCESSORIES.length,MASK_FIRST=SHADES_FIRST+V5_SUNGLASSES.length,RARE_MASK=MASK_FIRST+V5_MASKS.length,BEANIE=4;
export const V5_ACCESSORIES=[...V4_ACCESSORIES,...V5_SUNGLASSES,...V5_MASKS.map(m=>m.name),V5_RARE_MASK.name];
export const V5_HAT_POSES=['正戴','向左歪戴','向右歪戴'];
// One seed in fifty wears a mask. Of those, one in five hundred gets the rare mask; the rest pick
// one of the regular masks, equally likely. A third of beanies tilt.
export const V5_MASK_RATE=0.02;
export const V5_RARE_MASK_SHARE=0.002;
const TILT_RATE=1/3;
export const V5_OPTIONS=Object.freeze({palette:V4_PALETTES.length,skin:V4_SKINS.length,hairColor:V4_HAIR.length,hair:V4_HAIRSTYLES.length,eyes:V4_EYES.length,brows:V4_BROWS.length,mouth:V4_MOUTHS.length,outfit:V5_OUTFITS.length,outfitColor:V5_CLOTH.length,outfitAccent:V5_CLOTH.length,accessory:V5_ACCESSORIES.length,hatPose:V5_HAT_POSES.length});
// Distinct looks: the hat pose only changes a beanie, so it multiplies that one accessory.
export const V5_COMBINATIONS=Object.entries(V5_OPTIONS).filter(([k])=>k!=='accessory'&&k!=='hatPose').reduce((a,[,n])=>a*n,1)*(V5_OPTIONS.accessory-1+V5_OPTIONS.hatPose);
export const isMask=t=>t.accessory>=MASK_FIRST;
export function getTraitsV5(seed='fuli',overrides={}){
 const random=seededRng('5:',String(seed)),o=overrides&&typeof overrides==='object'?overrides:{},t={};
 // Every draw is taken whether or not it is overridden, so overrides never reshuffle other traits.
 const pick=(key,sample)=>{const v=o[key];return Number.isInteger(v)&&v>=0&&v<V5_OPTIONS[key]?v:sample;};
 for(const key of ['palette','skin','hairColor','hair','eyes','brows','mouth','outfit'])t[key]=pick(key,Math.floor(random()*V5_OPTIONS[key]));
 const [main,accent]=V5_COMBOS[Math.floor(random()*V5_COMBOS.length)];
 t.outfitColor=pick('outfitColor',main);t.outfitAccent=pick('outfitAccent',accent);
 const m=random(),a=random(),rare=random();
 const mask=rare<V5_RARE_MASK_SHARE?RARE_MASK:MASK_FIRST+Math.floor(m/V5_MASK_RATE*V5_MASKS.length);
 t.accessory=pick('accessory',m<V5_MASK_RATE?mask:Math.floor(a*MASK_FIRST));
 const tilt=random(),side=random();
 t.hatPose=pick('hatPose',tilt<TILT_RATE?(side<.5?1:2):0);
 return t;
}
const v5Palette=t=>({bg:V4_PALETTES[t.palette].bg,shirt:V5_CLOTH[t.outfitColor].hex,accent:V5_CLOTH[t.outfitAccent].hex});
// A tilted beanie rotates about the crown and slides toward the low side; the cuff then reaches
// the brow line on that side and lifts off the hair on the other, never down to the eyes.
const TILTS=[null,{deg:-12,dx:-4},{deg:12,dx:4}];
function v5Accessory(t,p,style,w,lod){
 if(t.accessory>=MASK_FIRST)return {neck:'',front:v5MaskMarkup(t.accessory-MASK_FIRST,w,lod)};
 if(t.accessory>=SHADES_FIRST)return {neck:'',front:v5Sunglasses(t.accessory-SHADES_FIRST,lod)};
 const out=v4Accessory(t,p,style,w,lod),tilt=t.accessory===BEANIE&&TILTS[t.hatPose];
 if(tilt)out.front=out.front.replace('<g data-part="beanie">',`<g data-part="beanie" data-pose="${t.hatPose}" transform="translate(${tilt.dx} -2) rotate(${tilt.deg} 128 100)">`);
 return out;
}
// A mask rests on the upper side of the head, where the top hat and music headphones would go.
const eggClash=t=>egg=>isMask(t)&&(egg.id==='tophat'||egg.id==='hiphop'||egg.id==='pop');
export function getEggV5(seed='fuli',overrides={}){const t=getTraitsV5(seed,overrides);return v4ResolveEgg(seed,t,V4_HAIRSTYLES[t.hair],undefined,eggClash(t));}
export function createAvatarV5(seed='fuli',config={}){
 const c=config&&typeof config==='object'?config:{},t=getTraitsV5(seed,c.traits);
 const lens=t.accessory===1||t.accessory===2||(t.accessory>=SHADES_FIRST&&t.accessory<MASK_FIRST);
 const p=v5Palette(t),place=v5MarkPlace(seed,t,lens),mark=lod=>v5MarkMarkup(place,p,t.accessory>=SHADES_FIRST,lod);
 // A hat tag goes inside the beanie group, so it follows the hat's tilt.
 const accessory=(t,p,style,w,lod)=>{const out=v5Accessory(t,p,style,w,lod),hat=mark(lod).hat;if(hat)out.front=out.front.replace(/<\/g>$/,hat+'</g>');return out;};
 return composeAvatar(seed,c,t,{id:'v5',palette:p,outfit:V5_OUTFITS[t.outfit].draw,accessory,eggClash:eggClash(t),mark});
}
