// Builds the single-file ESM (dist/avatar.js) and browser IIFE from src/ using only Node built-ins.
import {readFile,writeFile} from 'node:fs/promises';
const files=['v3.js','v4/util.js','v4/palettes.js','v4/hair.js','v4/face.js','v4/outfit.js','v4/accessory.js','v4/eggs.js','v4/render.js','v5/colors.js','v5/outfit.js','v5/sunglasses.js','v5/rare-cat.js','v5/masks.js','v5/wordmark.js','v5/mark.js','v5/render.js','names.js','index.js'];
const read=f=>readFile(new URL('../src/'+f,import.meta.url),'utf8').then(s=>s.replace(/\r\n/g,'\n').replace(/^import [^;]+;\n/gm,''));
const parts=await Promise.all(files.map(read));
const index=parts.pop(),banner=index.match(/^\/\*\*.*\*\/\n/)[0];
// Internal modules lose their export keyword; only index.js defines the public surface.
const internal=parts.map(s=>s.replace(/^export /gm,'')).join('\n');
const esm=`${banner}/* Generated from src/ by npm run build; do not edit. */\n${internal}\n${index.slice(banner.length)}`;
await writeFile(new URL('../dist/avatar.js',import.meta.url),esm);
const bundle=`/* Generated from src/ by npm run build; do not edit. */\n(function(root){'use strict';\n${esm.replace(/^export /gm,'')}\nroot.FuliAvatar=Object.freeze({VERSION,VERSIONS,palettes,hairColors,outfitColors,outfitCombos,masks,maskRate,options,combinationCount,partNames,v3,v4,getTraits,createAvatar,eggs,eggRate,getEgg,freezeFrame,nameLocales,nameFor,nameDetails});\n})(typeof globalThis!=='undefined'?globalThis:window);\n`;
await writeFile(new URL('../dist/fuli-avatar.browser.js',import.meta.url),bundle);
