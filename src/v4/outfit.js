// v4 garments. Body is cropped by the canvas bottom like the built-ins; only collars carry detail.
import {INK,mix,shape,line} from './util.js';
export const V4_BODY='M110 188C84 190 56 198 42 216C32 228 28 246 27 262L229 262C228 246 224 228 214 216C200 198 172 190 146 188Z';
const crew='M106 189C114 206 142 206 150 189';
const rib='M104 188C112 210 144 210 152 188L146 186C140 200 116 200 110 186Z';
// Small ink folds near the armpits suggest arms against the torso.
const folds='M64 230C68 240 70 250 70 262M192 230C188 240 186 250 186 262';
export const V4_OUTFITS=[
 {name:'圆领卫衣',draw:(p,w,lod)=>shape(rib,mix(p.shirt,'#000000',.15),INK,w*.75)+(lod<2?line('M86 196C80 210 76 226 74 240M170 196C176 210 180 226 182 240',mix(p.shirt,'#000000',.28),2.6):'')},
 {name:'翻领衬衫',draw:(p,w,lod)=>{const c=mix(p.shirt,'#FFFFFF',.82);return shape('M110 187L128 210L146 187Z',mix(p.shirt,'#000000',.25),'none')+line('M128 210V262',INK,w*.6)+shape('M108 184L128 210L106 214L96 196Z',c,INK,w*.75)+shape('M148 184L128 210L150 214L160 196Z',c,INK,w*.75)+(lod<2?`<circle cx="132" cy="226" r="2.4" fill="${c}"/><circle cx="132" cy="244" r="2.4" fill="${c}"/>`:'')}},
 {name:'开衫',draw:(p,w,lod)=>{const tee=mix(p.accent,'#FFFFFF',.55);return shape('M108 188L148 188L140 262L116 262Z',tee,INK,w*.75)+line(crew,INK,w*.6)+line('M108 188C112 214 116 238 116 262M148 188C144 214 140 238 140 262',INK,w*.75)+(lod<2?`<circle cx="145" cy="222" r="2.6" fill="${INK}"/><circle cx="143" cy="242" r="2.6" fill="${INK}"/>`:'')}},
 {name:'西装外套',draw:(p,w)=>{const tee=mix(p.shirt,'#FFFFFF',.85),lap=mix(p.shirt,'#000000',.18);return shape('M108 188L148 188L136 262L120 262Z',tee,INK,w*.75)+line(crew,INK,w*.6)+shape('M108 186L98 202L108 208L104 216L124 262L110 262L92 222L90 198Z',lap,INK,w*.75)+shape('M148 186L158 202L148 208L152 216L132 262L146 262L164 222L166 198Z',lap,INK,w*.75)}},
 {name:'连帽衫',draw:(p,w,lod)=>{const hood=mix(p.shirt,'#000000',.16),inner=mix(p.shirt,'#000000',.38);return shape('M92 196C84 186 96 176 110 180L128 206L146 180C160 176 172 186 164 196C156 214 140 222 128 222C116 222 100 214 92 196Z',hood,INK,w*.75)+shape('M110 184L128 206L146 184C140 196 116 196 110 184Z',inner,'none')+(lod<2?line('M118 214V236M138 214V236',mix(p.accent,'#FFFFFF',.4),3)+`<circle cx="118" cy="238" r="2.6" fill="${mix(p.accent,'#FFFFFF',.4)}"/><circle cx="138" cy="238" r="2.6" fill="${mix(p.accent,'#FFFFFF',.4)}"/>`:'')}},
 {name:'高领毛衣',draw:(p,w,lod)=>{const c=mix(p.shirt,'#000000',.12);return shape('M106 168C106 162 150 162 150 168L152 196C140 206 116 206 104 196Z',c,INK,w*.75)+(lod<2?line('M114 172V198M122 172V202M130 172V202M138 172V202M146 172V198',mix(p.shirt,'#000000',.32),2):'')}},
 {name:'T 恤',draw:(p,w,lod)=>shape(rib,mix(p.shirt,'#FFFFFF',.2),INK,w*.75)+(lod<2?shape('M160 220H184V236C178 242 166 242 160 236Z','none',mix(p.shirt,'#000000',.32),2.6):'')},
];
export const V4_FOLDS=folds;
