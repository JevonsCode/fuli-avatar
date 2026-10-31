// v4 accessories: a short list that reads at 32 px. Each returns markup for its layer.
import {INK,mix,shape,line} from './util.js';
const lens=(x,y,round)=>round?`<circle cx="${x}" cy="${y}" r="15" fill="#FFFFFF" fill-opacity=".18" stroke="${INK}" stroke-width="3.6"/>`:`<rect x="${x-16}" y="${y-14}" width="32" height="28" rx="9" fill="#FFFFFF" fill-opacity=".18" stroke="${INK}" stroke-width="3.6"/>`;
function glasses(round){return '<g data-part="glasses">'+lens(106,130,round)+lens(150,130,round)+line('M121 128C125 124 131 124 135 128M90 126L70 122M166 126L186 122',INK,3.4)+'</g>';}
export const V4_ACCESSORIES=['无','圆框眼镜','方框眼镜','耳机','毛线帽','围巾','发夹'];
// Layer "front": drawn after the fringe. Layer "neck": drawn over the garment, under the face.
export function v4Accessory(t,p,style,w,lod){
 const a=t.accessory,out={neck:'',front:''};
 if(a===1||a===2)out.front=glasses(a===1);
 if(a===3){const top=Math.max(style.top-10,26),band=`M60 122C50 ${top+40} 80 ${top} 128 ${top}C176 ${top} 206 ${top+40} 196 122`;
  out.front='<g data-part="headphones">'+line(band,INK,10)+line(band,p.accent,5)+
   `<rect x="46" y="112" width="20" height="40" rx="10" fill="${p.accent}" stroke="${INK}" stroke-width="${w}"/><rect x="190" y="112" width="20" height="40" rx="10" fill="${p.accent}" stroke="${INK}" stroke-width="${w}"/>`+
   (lod<2?line('M52 122V142M204 122V142',mix(p.accent,'#FFFFFF',.45),2.6):'')+'</g>';}
 if(a===4){const knit=mix(p.accent,'#000000',.08),cuff=mix(p.accent,'#000000',.2);
  out.front='<g data-part="beanie">'+shape('M62 98C60 62 90 42 128 42C166 42 196 62 194 98Z',knit,INK,w)+
   (lod<2?line('M96 54C92 66 92 78 94 92M128 44V92M160 54C164 66 164 78 162 92',mix(p.accent,'#000000',.24),2.4):'')+
   shape('M58 88C90 80 166 80 198 88L198 102C166 94 90 94 58 102Z',cuff,INK,w)+
   `<circle cx="128" cy="38" r="9" fill="${knit}" stroke="${INK}" stroke-width="${w}"/></g>`;}
 if(a===5){const c=p.accent,d=mix(c,'#000000',.2);
  out.neck='<g data-part="scarf">'+shape('M100 182C112 196 144 196 156 182L166 196C150 214 106 214 90 196Z',c,INK,w)+
   shape('M136 202L156 206L150 246L134 242Z',d,INK,w*.8)+(lod<2?line('M138 228L151 231',mix(c,'#FFFFFF',.35),2.4):'')+'</g>';}
 if(a===6)out.front='<g data-part="hair-clip" transform="rotate(-28 166 86)">'+`<rect x="152" y="80" width="30" height="11" rx="5.5" fill="${p.accent}" stroke="${INK}" stroke-width="3"/>`+(lod<2?line('M159 85.5H175',mix(p.accent,'#FFFFFF',.5),2.2):'')+'</g>';
 return out;
}
