/** fuli-avatar v0.5.0. Pure, dependency-free, deterministic SVG generator. */
// Public API. Render version 5 is the default; { version: 4 } and { version: 3 } redraw stored
// identities byte-identically.
import {V3_VERSION,V3_PALETTES,V3_OPTIONS,V3_COMBINATIONS,getTraitsV3,createAvatarV3} from './v3.js';
import {V4_PALETTES,V4_HAIR} from './v4/palettes.js';
import {V4_OPTIONS,V4_COMBINATIONS,getTraitsV4,createAvatarV4,getEggV4} from './v4/render.js';
import {V4_EGGS,V4_EGG_RATE,v4FreezeFrame} from './v4/eggs.js';
import {V4_HAIRSTYLES} from './v4/hair.js';
import {V4_EYES,V4_BROWS,V4_MOUTHS} from './v4/face.js';
import {V4_OUTFITS} from './v4/outfit.js';
import {V4_ACCESSORIES} from './v4/accessory.js';
import {V5_OPTIONS,V5_COMBINATIONS,V5_ACCESSORIES,V5_HAT_POSES,V5_MASK_RATE,getTraitsV5,createAvatarV5,getEggV5} from './v5/render.js';
import {V5_CLOTH,V5_COMBOS} from './v5/colors.js';
import {V5_MASKS,V5_RARE_MASK} from './v5/masks.js';
import {NAME_LOCALES,characterName} from './names.js';
export const VERSION='5';
export const VERSIONS=Object.freeze(['3','4','5']);
// Background tones (v5 uses each palette's bg; v4 also takes its shirt and accent).
export const palettes=V4_PALETTES;
export const hairColors=V4_HAIR;
export const outfitColors=Object.freeze(V5_CLOTH.map(c=>Object.freeze({...c})));
// Curated [main, accent] outfit colour pairs that random characters draw from.
export const outfitCombos=Object.freeze(V5_COMBOS.map(pair=>Object.freeze(pair.slice())));
export const masks=Object.freeze([...V5_MASKS,V5_RARE_MASK].map(({name,en})=>Object.freeze({name,en})));
export const maskRate=V5_MASK_RATE;
export const options=V5_OPTIONS;
export const combinationCount=V5_COMBINATIONS;
const v4Parts=Object.freeze({hairColor:V4_HAIR.map(h=>h.name),hair:V4_HAIRSTYLES.map(h=>h.name),eyes:V4_EYES.map(e=>e.name),brows:V4_BROWS.map(b=>b.name),mouth:V4_MOUTHS.map(m=>m.name),outfit:V4_OUTFITS.map(o=>o.name),accessory:V4_ACCESSORIES.slice()});
// Display names for every selectable v5 part, in trait index order.
export const partNames=Object.freeze({...v4Parts,outfitColor:V5_CLOTH.map(c=>c.name),outfitAccent:V5_CLOTH.map(c=>c.name),accessory:V5_ACCESSORIES.slice(),hatPose:V5_HAT_POSES.slice()});
export const v3=Object.freeze({VERSION:V3_VERSION,palettes:V3_PALETTES,options:V3_OPTIONS,combinationCount:V3_COMBINATIONS,getTraits:getTraitsV3,createAvatar:createAvatarV3});
export const v4=Object.freeze({VERSION:'4',palettes:V4_PALETTES,options:V4_OPTIONS,combinationCount:V4_COMBINATIONS,partNames:v4Parts,getTraits:getTraitsV4,createAvatar:createAvatarV4});
const versionOf=config=>{const v=config&&typeof config==='object'?String(config.version):'';return v==='3'||v==='4'?v:'5';};
const objectOr=o=>o&&typeof o==='object'?o:{};
export function getTraits(seed='fuli',overrides={},config={}){const v=versionOf(config);return v==='3'?getTraitsV3(seed,objectOr(overrides)):v==='4'?getTraitsV4(seed,overrides):getTraitsV5(seed,overrides);}
export function createAvatar(seed='fuli',config={}){const v=versionOf(config);return v==='3'?createAvatarV3(seed,config):v==='4'?createAvatarV4(seed,config):createAvatarV5(seed,config);}
// Opt-in easter eggs (render versions 4 and 5): createAvatar(seed, { eggs: true }) draws one for
// eggRate of seeds (one in eight); { egg: id } forces one; { animate: false } keeps it still.
// getEgg says which egg a seed would show.
export const eggs=Object.freeze(V4_EGGS.map(({id,name,en,loop})=>Object.freeze({id,name,en,loop})));
export const eggRate=V4_EGG_RATE;
export function getEgg(seed='fuli',overrides={},config={}){
 const v=versionOf(config);if(v==='3')return null;
 const e=v==='4'?getEggV4(seed,overrides):getEggV5(seed,overrides);
 return e?eggs.find(x=>x.id===e.id):null;
}
// A still frame `seconds` into an egg's animation (`loop` seconds long), e.g. for GIF export.
export function freezeFrame(svg,seconds){return v4FreezeFrame(svg,seconds);}
// Character names mixed across Spanish, Chinese and English, deterministic from the seed.
export const nameLocales=NAME_LOCALES;
// nameDetails adds { locale, given, family }; config.locales narrows the mix, e.g. ['zh'].
export function nameFor(seed='fuli',config={}){return characterName(seed,config).name;}
export function nameDetails(seed='fuli',config={}){return characterName(seed,config);}
