// v4 renderer: assembles layers back to front. Seed is only hashed; no input reaches the markup.
import {v4Rng,mix,INK,pen,shape,line} from './util.js';
import {V4_PALETTES,V4_SKINS,V4_HAIR} from './palettes.js';
import {V4_HAIRSTYLES} from './hair.js';
import {V4_FACE,V4_NECK,v4Ears,V4_EYES,V4_BROWS,V4_MOUTHS,v4Features} from './face.js';
import {V4_BODY,V4_OUTFITS,V4_FOLDS} from './outfit.js';
import {V4_ACCESSORIES,v4Accessory} from './accessory.js';
import {V4_EGGS,v4ResolveEgg,v4EggMarkup} from './eggs.js';
// 1.15x about (128,182): head fills ~55% of the tile width and sits higher.
const HEAD='matrix(1.15 0 0 1.15 -19.2 -27.3)';
export const V4_OPTIONS=Object.freeze({palette:V4_PALETTES.length,skin:V4_SKINS.length,hairColor:V4_HAIR.length,hair:V4_HAIRSTYLES.length,eyes:V4_EYES.length,brows:V4_BROWS.length,mouth:V4_MOUTHS.length,outfit:V4_OUTFITS.length,accessory:V4_ACCESSORIES.length});
export const V4_COMBINATIONS=Object.values(V4_OPTIONS).reduce((a,b)=>a*b,1);
export function getTraitsV4(seed='fuli',overrides={}){const random=v4Rng(String(seed)),o=overrides&&typeof overrides==='object'?overrides:{};return Object.fromEntries(Object.entries(V4_OPTIONS).map(([key,count])=>{const value=o[key],sample=Math.floor(random()*count);return[key,Number.isInteger(value)&&value>=0&&value<count?value:sample];}));}
// The easter egg { eggs: true } would draw for this seed and traits, or null.
export function getEggV4(seed='fuli',overrides={}){const t=getTraitsV4(seed,overrides);return v4ResolveEgg(seed,t,V4_HAIRSTYLES[t.hair]);}
export function createAvatarV4(seed='fuli',config={}){
 const c=config&&typeof config==='object'?config:{},t=getTraitsV4(seed,c.traits);
 return composeAvatar(seed,c,t,{id:'v4',palette:V4_PALETTES[t.palette],outfit:V4_OUTFITS[t.outfit].draw,accessory:v4Accessory});
}
// Layer assembly shared by render versions 4 and 5. `look` supplies the version's clip id, colours
// ({ bg, shirt, accent }), garment detail drawer and accessory drawer, plus optional eggClash and
// mark (v5); everything else is common, so v4 output stays byte-identical.
export function composeAvatar(seed,c,t,look){
 const size=Number.isInteger(c.size)&&c.size>=16&&c.size<=4096?c.size:256;
 // Level of detail: 0 full, 1 medium (≤96 px), 2 icon (≤48 px). Fine lines drop out as size shrinks.
 const lod=size<=48?2:size<=96?1:0,w=pen(lod);
 const p=look.palette,skin=V4_SKINS[t.skin],hc=V4_HAIR[t.hairColor].base,style=V4_HAIRSTYLES[t.hair];
 const light=t.hairColor>=4,beanie=t.accessory===4;
 const rounded=c.rounded!==false,rx=rounded?36:0;
 // Eggs are opt-in: without `eggs: true` or a known `egg` id every slot is empty and output is unchanged.
 const wantsEgg=c.eggs===true||V4_EGGS.some(e=>e.id===c.egg);
 const egg=v4EggMarkup(wantsEgg?v4ResolveEgg(seed,t,style,c.egg,look.eggClash):null,{p,skin,hc,style,t,w},c.animate!==false);
 const mark=look.mark?look.mark(lod):{frame:'',chest:'',lens:''};
 const strand=mix(hc,light?'#5A4630':'#FFFFFF',light?.35:.16),shine=mix(hc,'#FFFFFF',light?.6:.38);
 let s=`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 256 256" role="img" aria-label="Generated FULI avatar">`;
 s+=`<defs><clipPath id="fuli-avatar-${look.id}-${rounded?'r':'s'}"><rect width="256" height="256" rx="${rx}"/></clipPath>${egg.defs}</defs>`;
 s+=`<rect width="256" height="256" rx="${rx}" fill="${c.transparent?'none':p.bg}"/>`;
 s+=`<g data-part="portrait" clip-path="url(#fuli-avatar-${look.id}-${rounded?'r':'s'})">`+egg.bg+mark.frame;
 const hairShape=d=>shape(d,hc,INK,w);
 // Head, hair and head-worn pieces share one frame scaled about the chin so the neck joint stays put.
 const head=`<g data-part="head" transform="${HEAD}">`;
 let back='';
 if(!beanie)back+=hairShape(style.tufts);
 if(style.bun&&!beanie)back+=hairShape(style.bun)+(lod<2?line(style.bunShine,shine,3,' opacity=".8"'):'');
 back+=hairShape(style.back);
 s+=head+'<g data-part="hair-back">'+back+'</g></g>';
 s+='<g data-part="neck">'+shape(V4_NECK,skin,INK,w)+shape('M110 180C118 190 138 190 146 180L146 190C138 196 118 196 110 190Z',mix(skin,'#9A5A44',.22),'none')+'</g>';
 s+=`<g data-part="outfit" data-style="${t.outfit}">`+shape(V4_BODY,p.shirt,INK,w)+(lod<2?line(V4_FOLDS,mix(p.shirt,'#000000',.3),2.6):'')+look.outfit(p,w,lod)+'</g>'+mark.chest;
 const acc=look.accessory(t,p,style,w,lod);
 s+=acc.neck+egg.neck+head;
 if(style.ears)s+='<g data-part="ears">'+v4Ears(skin,lod,w)+'</g>';
 s+='<g data-part="face">'+shape(V4_FACE,skin,INK,w)+v4Features(t,skin,lod,false)+'</g>'+egg.face;
 let front=lod<2?shape(style.locks,hc,INK,w*.8):'';
 front+=hairShape(style.fringe);
 if(lod<2&&!beanie)front+=line(style.strands,strand,lod===0?2.6:3);
 if(!beanie)front+=line(style.shine,shine,lod===0?5:lod===1?6:7,' opacity=".75"');
 s+='<g data-part="hair-front">'+front+'</g>';
 s+=acc.front+mark.lens+egg.head+'</g>';
 return s+egg.over+'</g></svg>';
}
