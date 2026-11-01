// v5 garment details: the v4 cuts, with the accent colour on collars, trims, linings and pockets.
import {INK,mix,shape,line} from '../v4/util.js';
const crew5='M106 189C114 206 142 206 150 189';
const rib5='M104 188C112 210 144 210 152 188L146 186C140 200 116 200 110 186Z';
const dot5=(x,y,r,fill)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
export const V5_OUTFITS=[
 // Sweatshirt: accent rib collar and two chest stripes.
 {name:'圆领卫衣',draw:(p,w,lod)=>shape(rib5,p.accent,INK,w*.75)+(lod<2?line('M40 236C88 228 168 228 216 236',p.accent,6)+line('M86 196C80 210 76 226 74 230M170 196C176 210 180 226 182 230',mix(p.shirt,'#000000',.28),2.6):'')},
 // Shirt: accent collar points and buttons on the main colour.
 {name:'翻领衬衫',draw:(p,w,lod)=>{const c=mix(p.accent,'#FFFFFF',.2);return shape('M110 187L128 210L146 187Z',mix(p.shirt,'#000000',.25),'none')+line('M128 210V262',INK,w*.6)+shape('M108 184L128 210L106 214L96 196Z',c,INK,w*.75)+shape('M148 184L128 210L150 214L160 196Z',c,INK,w*.75)+(lod<2?dot5(132,226,2.6,c)+dot5(132,244,2.6,c):'')}},
 // Cardigan over an accent tee.
 {name:'开衫',draw:(p,w,lod)=>shape('M108 188L148 188L140 262L116 262Z',p.accent,INK,w*.75)+line(crew5,INK,w*.6)+line('M108 188C112 214 116 238 116 262M148 188C144 214 140 238 140 262',INK,w*.75)+(lod<2?dot5(145,222,2.6,INK)+dot5(143,242,2.6,INK):'')},
 // Blazer: light accent tee and an accent pocket square.
 {name:'西装外套',draw:(p,w,lod)=>{const tee=mix(p.accent,'#FFFFFF',.55),lap=mix(p.shirt,'#000000',.18);return shape('M108 188L148 188L136 262L120 262Z',tee,INK,w*.75)+line(crew5,INK,w*.6)+shape('M108 186L98 202L108 208L104 216L124 262L110 262L92 222L90 198Z',lap,INK,w*.75)+shape('M148 186L158 202L148 208L152 216L132 262L146 262L164 222L166 198Z',lap,INK,w*.75)+(lod<2?shape('M170 226L186 226L182 218Z',p.accent,INK,2.4):'')}},
 // Hoodie: accent hood lining and light drawstrings.
 {name:'连帽衫',draw:(p,w,lod)=>{const hood=mix(p.shirt,'#000000',.16),tip=mix(p.accent,'#FFFFFF',.35);return shape('M92 196C84 186 96 176 110 180L128 206L146 180C160 176 172 186 164 196C156 214 140 222 128 222C116 222 100 214 92 196Z',hood,INK,w*.75)+shape('M110 184L128 206L146 184C140 196 116 196 110 184Z',p.accent,'none')+(lod<2?line('M118 214V236M138 214V236',tip,3)+dot5(118,238,2.6,tip)+dot5(138,238,2.6,tip):'')}},
 // Turtleneck: the rolled collar in the accent colour.
 {name:'高领毛衣',draw:(p,w,lod)=>shape('M106 168C106 162 150 162 150 168L152 196C140 206 116 206 104 196Z',p.accent,INK,w*.75)+(lod<2?line('M114 172V198M122 172V202M130 172V202M138 172V202M146 172V198',mix(p.accent,'#000000',.25),2):'')},
 // T-shirt: accent rib collar and pocket.
 {name:'T 恤',draw:(p,w,lod)=>shape(rib5,p.accent,INK,w*.75)+(lod<2?shape('M160 220H184V236C178 242 166 242 160 236Z',p.accent,INK,2.6):'')},
];
