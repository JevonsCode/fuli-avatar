// v5 sunglasses: four classic, generic frames worn like the v4 glasses (front layer, head frame,
// lenses centred on the eyes at x 106 / 150, y 130). Each lens is drawn once in local coordinates
// for the viewer's left lens (outer side toward -x) and mirrored for the right one.
import {INK,line} from '../v4/util.js';
export const V5_SUNGLASSES=['方框墨镜','飞行员墨镜','眉框墨镜','圆框墨镜'];
const TINT='#2B3440';
const shadeGlint=lod=>lod<2?line('M5 -2L9 -6','#FFFFFF',2.2,' opacity=".7"'):'';
const pair=body=>`<g transform="translate(106 130)">${body}</g><g transform="translate(150 130) scale(-1 1)">${body}</g>`;
// Lens outlines in local coordinates; also used to clip the lens mark.
export const V5_LENSES=[
 // Trapezoid: slightly upswept outer corner, narrowing toward the bottom.
 'M-18 -14C-12 -13 8 -12 16 -11L14 9C13 12 10 13 7 13L-8 13C-12 13 -14 11 -15 8Z',
 // Aviator teardrop: wide at the top, drooping toward the nose.
 'M-16 -10C-12 -14 10 -14 15 -10C18 -6 16 6 9 12C4 16 -6 15 -11 9C-16 3 -18 -6 -16 -10Z',
 // Browline: a rounded lens under the brow bar.
 'M-16 -9L16 -9C17 0 15 9 8 12C2 14 -6 14 -11 11C-16 7 -17 -2 -16 -9Z',
 // Round.
 'M-15 0A15 15 0 1 0 15 0A15 15 0 1 0 -15 0Z',
];
const STYLES=[
 // Thick acetate: dark tint, heavy top bar with the outer end flicked up.
 lod=>pair(`<path d="${V5_LENSES[0]}" fill="${TINT}" fill-opacity=".92" stroke="${INK}" stroke-width="3.6" stroke-linejoin="round"/>`+line('M-20 -16C-12 -13 4 -12 18 -11',INK,6.4)+shadeGlint(lod))+
  line('M123 121C126 118 130 118 133 121M88 121L70 118M168 121L186 118',INK,3.4),
 // Thin metal rim, brown gradient tint, double bridge.
 lod=>'<defs><linearGradient id="fuli-avatar-aviator-tint" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A2A20" stop-opacity=".95"/><stop offset="1" stop-color="#8A6A50" stop-opacity=".8"/></linearGradient></defs>'+
  pair(`<path d="${V5_LENSES[1]}" fill="url(#fuli-avatar-aviator-tint)" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>`+shadeGlint(lod))+
  line('M121 119H135M122 127C126 124 130 124 134 127M90 122L70 119M166 122L186 119',INK,2.2),
 // Thick dark brow bar, thin metal rim round the lower half, dark green tint.
 lod=>pair(`<path d="${V5_LENSES[2]}" fill="#2E4A40" fill-opacity=".9"/>`+line('M-16 -7C-17 0 -15 8 -9 12C-3 14 4 14 9 12C15 8 17 0 16 -7','#8F99A1',1.8)+
  `<path d="M-18 -13C-10 -15 10 -15 18 -12L17 -6C10 -9 -10 -9 -17 -6Z" fill="${INK}" stroke="${INK}" stroke-width="1.6" stroke-linejoin="round"/>`+shadeGlint(lod))+
  line('M124 120C127 118 129 118 132 120M88 120L70 117M168 120L186 117',INK,3),
 // Thin round frames.
 lod=>pair(`<path d="${V5_LENSES[3]}" fill="${TINT}" fill-opacity=".92" stroke="${INK}" stroke-width="3.6"/>`+shadeGlint(lod))+
  line('M121 128C125 124 131 124 135 128M91 126L70 122M165 126L186 122',INK,3.4),
];
export function v5Sunglasses(index,lod){return `<g data-part="sunglasses" data-style="${index}">`+STYLES[index](lod)+'</g>';}
