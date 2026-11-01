import test from 'node:test';
import assert from 'node:assert/strict';
import {framePlan,renderGif,GIF_SIZE} from '../dist/gif.js';
import {createAvatar,eggs} from '../dist/avatar.js';

test('frame plan spreads 24-36 frames evenly over one loop',()=>{
 for(const e of eggs){
  const p=framePlan(e.loop);
  assert.ok(p.count>=24&&p.count<=36,e.id);
  assert.equal(p.times.length,p.count);assert.equal(p.times[0],0);
  assert.ok(p.times.at(-1)<e.loop);
  assert.ok(Math.abs(p.delay*p.count-e.loop*1000)<p.count,e.id);
 }
 // A still character has no loop: one frame.
 for(const still of [NaN,0,undefined,-1])assert.deepEqual(framePlan(still),{count:1,delay:0,times:[0]});
});
test('GIF encoder samples each frame time and merges identical frames',async()=>{
 const svg=createAvatar('gif',{egg:'hiphop'}),asked=[];
 // Fake rasteriser: four alternating flat colours, then one still stretch.
 const raster=async(frame,size)=>{
  asked.push(Number(frame.match(/--fa-t:([\d.]+)s/)[1]));
  const px=new Uint8ClampedArray(size*size*4),k=asked.length;
  px.fill(k<=4?(k%2?40:200):120);for(let i=3;i<px.length;i+=4)px[i]=255;
  return px;
 };
 const bytes=await renderGif(svg,2.4,raster);
 assert.deepEqual(asked,framePlan(2.4).times);
 assert.equal(String.fromCharCode(...bytes.slice(0,6)),'GIF89a');
 assert.equal(bytes[6]|bytes[7]<<8,GIF_SIZE);
 // Graphic control blocks followed by an image descriptor: 4 changing frames plus one merged still.
 let frames=0;for(let i=0;i<bytes.length-8;i++)if(bytes[i]===0x21&&bytes[i+1]===0xF9&&bytes[i+2]===4&&bytes[i+8]===0x2C)frames++;
 assert.equal(frames,5);
});
test('a still character exports a valid single-frame GIF',async()=>{
 const svg=createAvatar('still-gif'),asked=[];
 const raster=async(frame,size)=>{asked.push(frame);const px=new Uint8ClampedArray(size*size*4).fill(180);for(let i=3;i<px.length;i+=4)px[i]=255;return px;};
 const bytes=await renderGif(svg,0,raster);
 assert.equal(asked.length,1);assert.equal(asked[0],svg);
 assert.equal(String.fromCharCode(...bytes.slice(0,6)),'GIF89a');
 assert.equal(bytes[6]|bytes[7]<<8,GIF_SIZE);assert.equal(bytes[8]|bytes[9]<<8,GIF_SIZE);
 let frames=0;for(let i=0;i<bytes.length-8;i++)if(bytes[i]===0x21&&bytes[i+1]===0xF9&&bytes[i+2]===4&&bytes[i+8]===0x2C)frames++;
 assert.equal(frames,1);assert.equal(bytes.at(-1),0x3B);
 assert.ok(bytes.length<4000,String(bytes.length));
});
