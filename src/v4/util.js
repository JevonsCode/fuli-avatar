// Shared v4 helpers. Every value written into SVG comes from built-in tables or finite numbers.
export function v4Rng(seed){let h=2166136261;for(const c of `4:${seed}`){h^=c.codePointAt(0);h=Math.imul(h,16777619);}return()=>{h+=0x6D2B79F5;let t=h;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
// Mix two #RRGGBB colors; used to derive shade and highlight tones from curated base colors.
export function mix(a,b,k){const n=s=>[1,3,5].map(i=>parseInt(s.slice(i,i+2),16));const x=n(a),y=n(b);return '#'+x.map((v,i)=>Math.round(v+(y[i]-v)*k).toString(16).padStart(2,'0')).join('').toUpperCase();}
export const INK='#22303D';
// Outline width scales up when the avatar is drawn small so the silhouette stays readable.
export function pen(lod){return lod===0?5.6:lod===1?4.6:4;}
export const shape=(d,fill,stroke=INK,w=4)=>`<path d="${d}" fill="${fill}"${stroke==='none'?'':` stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`}/>`;
export const line=(d,stroke,w,extra='')=>`<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
