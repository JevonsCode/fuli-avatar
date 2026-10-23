import {readFile,writeFile} from 'node:fs/promises';
const source=await readFile(new URL('../dist/avatar.js',import.meta.url),'utf8');
const bundle=`/* Generated from avatar.js. Run npm run build; do not edit. */\n(function(root){'use strict';\n${source.replace(/^export /gm,'')}\nroot.FuliAvatar=Object.freeze({VERSION,palettes,options,combinationCount,getTraits,createAvatar});\n})(typeof globalThis!=='undefined'?globalThis:window);\n`;
await writeFile(new URL('../dist/fuli-avatar.browser.js',import.meta.url),bundle);
