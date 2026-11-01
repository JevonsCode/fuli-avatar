// Animated GIF export for characters whose extras move, for places that will not animate an SVG.
// Frames are sampled from the SVG's own CSS clock (freezeFrame), rasterised by the caller and
// encoded with the vendored gifenc (MIT, see vendor/gifenc.LICENSE.md).
import {GIFEncoder,quantize,applyPalette} from './vendor/gifenc.esm.js';
import {freezeFrame} from './avatar.js';
export const GIF_SIZE=256;
// 24-36 evenly spaced frames over one loop, about ten per second; a still character (no loop) is a
// single frame.
export function framePlan(loop){
 if(!(Number.isFinite(loop)&&loop>0))return {count:1,delay:0,times:[0]};
 const count=Math.min(36,Math.max(24,Math.round(loop*10))),step=loop/count;
 return {count,delay:Math.round(step*1000),times:Array.from({length:count},(_,i)=>Math.round(i*step*1000)/1000)};
}
function samePixels(a,b){if(a.length!==b.length)return false;for(let i=0;i<a.length;i++)if(a[i]!==b[i])return false;return true;}
// rasterise(svg, size) resolves to RGBA pixels (Uint8ClampedArray of size*size*4).
export async function renderGif(svg,loop,rasterise){
 const plan=framePlan(loop),frames=[];
 for(const t of plan.times){
  const pixels=await rasterise(freezeFrame(svg,t),GIF_SIZE),prev=frames[frames.length-1];
  // A frame identical to the previous one (a blink's open-eye stretch) just extends its delay.
  if(prev&&samePixels(prev.pixels,pixels))prev.delay+=plan.delay;else frames.push({pixels,delay:plan.delay});
 }
 // One shared palette keeps colours steady between frames; 1-bit alpha keeps the rounded corners clear.
 const size=frames[0].pixels.length,all=new Uint8ClampedArray(frames.length*size);
 frames.forEach((f,i)=>all.set(f.pixels,i*size));
 const palette=quantize(all,256,{format:'rgba4444',oneBitAlpha:true}),clear=palette.findIndex(c=>c[3]===0);
 const gif=GIFEncoder();
 for(const f of frames)gif.writeFrame(applyPalette(f.pixels,palette,'rgba4444'),GIF_SIZE,GIF_SIZE,{palette,delay:f.delay,transparent:clear>=0,transparentIndex:Math.max(clear,0)});
 gif.finish();
 return gif.bytes();
}
