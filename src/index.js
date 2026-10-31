/** fuli-avatar v0.4.0. Pure, dependency-free, deterministic SVG generator. */
// Public API. Render version 4 is the default; pass { version: 3 } to redraw a stored v3 identity.
import {V3_VERSION,V3_PALETTES,V3_OPTIONS,V3_COMBINATIONS,getTraitsV3,createAvatarV3} from './v3.js';
import {V4_PALETTES,V4_HAIR} from './v4/palettes.js';
import {V4_OPTIONS,V4_COMBINATIONS,getTraitsV4,createAvatarV4} from './v4/render.js';
import {V4_HAIRSTYLES} from './v4/hair.js';
import {V4_EYES,V4_BROWS,V4_MOUTHS} from './v4/face.js';
import {V4_OUTFITS} from './v4/outfit.js';
import {V4_ACCESSORIES} from './v4/accessory.js';
export const VERSION='4';
export const VERSIONS=Object.freeze(['3','4']);
export const palettes=V4_PALETTES;
export const hairColors=V4_HAIR;
export const options=V4_OPTIONS;
export const combinationCount=V4_COMBINATIONS;
// Display names for every selectable v4 part, in trait index order.
export const partNames=Object.freeze({hairColor:V4_HAIR.map(h=>h.name),hair:V4_HAIRSTYLES.map(h=>h.name),eyes:V4_EYES.map(e=>e.name),brows:V4_BROWS.map(b=>b.name),mouth:V4_MOUTHS.map(m=>m.name),outfit:V4_OUTFITS.map(o=>o.name),accessory:V4_ACCESSORIES.slice()});
export const v3=Object.freeze({VERSION:V3_VERSION,palettes:V3_PALETTES,options:V3_OPTIONS,combinationCount:V3_COMBINATIONS,getTraits:getTraitsV3,createAvatar:createAvatarV3});
const isV3=config=>config&&typeof config==='object'&&(config.version===3||config.version==='3');
export function getTraits(seed='fuli',overrides={},config={}){return isV3(config)?getTraitsV3(seed,overrides&&typeof overrides==='object'?overrides:{}):getTraitsV4(seed,overrides);}
export function createAvatar(seed='fuli',config={}){return isV3(config)?createAvatarV3(seed,config):createAvatarV4(seed,config);}
