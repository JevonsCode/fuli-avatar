// v5 sunglasses: dark tinted lenses with a small glint, worn like the v4 glasses (front layer, head
// frame, lenses centred on the eyes at x 106 / 150, y 130).
import {INK,line} from '../v4/util.js';
export const V5_SUNGLASSES=['方框墨镜','圆框墨镜'];
const TINT='#2B3440';
const shadeGlint=(x,lod)=>lod<2?line(`M${x-9} 127L${x-5} 123`,'#FFFFFF',2.2,' opacity=".7"'):'';
// Wayfarer-style: a trapezoid lens under a thick top bar.
const wayLens=x=>`<path d="M${x-17} 119L${x+17} 119L${x+14} 139C${x+13} 142 ${x+10} 143 ${x+7} 143L${x-8} 143C${x-12} 143 ${x-14} 141 ${x-15} 138Z" fill="${TINT}" fill-opacity=".92" stroke="${INK}" stroke-width="3.4" stroke-linejoin="round"/>`+line(`M${x-18} 119H${x+18}`,INK,6.4);
const roundLens=x=>`<circle cx="${x}" cy="130" r="15" fill="${TINT}" fill-opacity=".92" stroke="${INK}" stroke-width="3.6"/>`;
export function v5Sunglasses(index,lod){
 if(index===0)return '<g data-part="sunglasses" data-style="0">'+wayLens(106)+wayLens(150)+line('M123 122C126 119 130 119 133 122M89 121L70 118M167 121L186 118',INK,3.4)+shadeGlint(106,lod)+shadeGlint(150,lod)+'</g>';
 return '<g data-part="sunglasses" data-style="1">'+roundLens(106)+roundLens(150)+line('M121 128C125 124 131 124 135 128M91 126L70 122M165 126L186 122',INK,3.4)+shadeGlint(106,lod)+shadeGlint(150,lod)+'</g>';
}
