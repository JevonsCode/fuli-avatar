// v4 hairstyles. Face spans x 68-188, skull top y 62, ears at x 58-68 / 188-198, y 118-146.
// back: silhouette behind the head. fringe: front mass drawn over the face, outlined in ink.
// strands: inner strand lines. shine: crown highlight. top: skull-hair top y (headphone band fit).
// tufts: spikes drawn behind the back mass so they break the top silhouette.
// locks: fringe strands drawn under the fringe so only their tips hang over the forehead.
// The renderer scales the head 1.15x about the chin, so nothing may rise above y 27.
const r1=n=>Math.round(n*10)/10;
// Scalloped outline for curly hair: bumps along an ellipse arc, bulging by `push`.
function scallop(cx,cy,rx,ry,from,to,n,push){
 const at=(a,k)=>[r1(cx+rx*k*Math.cos(a)),r1(cy+ry*k*Math.sin(a))];
 let d='',step=(to-from)/n;
 for(let i=0;i<=n;i++){const a=from+i*step,[x,y]=at(a,1);
  if(i===0){d+=`${x} ${y}`;continue;}const [qx,qy]=at(a-step/2,push);d+=`Q${qx} ${qy} ${x} ${y}`;}
 return d;
}
const P=Math.PI;
const curlTop=scallop(128,104,80,64,.9*P,2.1*P,11,1.15);
// Inner forehead edge: small curls hanging over the brow line, right temple to left temple.
const curlEdge='Q194 104 184 98Q178 106 170 98Q164 108 156 96Q146 106 140 94Q130 104 122 92Q114 104 104 94Q96 106 88 98Q80 108 74 100Q64 106 64 126';
const BASE=[
 {name:'波波头',ears:false,
  back:'M58 150C50 112 56 74 82 56C104 41 152 41 174 56C200 74 206 112 198 150Z',
  fringe:'M60 158C50 118 56 76 82 57C106 41 150 41 174 57C200 76 206 118 196 158C190 161 184 158 182 152C184 132 186 112 180 96C168 104 156 104 148 94C138 106 120 108 110 96C100 104 86 104 76 98C70 114 72 134 74 152C72 158 66 161 60 158Z',
  strands:'M110 96C112 80 118 68 128 60M148 94C146 80 140 70 130 62M66 120C64 134 66 146 68 154M190 120C192 134 190 146 188 154',
  shine:'M84 66C96 57 112 52 126 52'},
 {name:'碎短发',ears:true,
  back:'M62 132C54 104 58 74 76 60C80 48 94 42 104 46C112 36 128 34 138 42C150 36 166 42 170 52C186 56 198 74 196 96C200 110 198 122 194 132Z',
  fringe:'M66 112C60 88 68 66 86 56C104 46 150 44 170 54C188 64 196 84 192 110C186 100 180 92 176 84C172 94 166 100 160 102C160 92 156 84 152 80C144 92 132 98 120 98C124 92 126 86 126 80C116 90 102 96 90 96C92 90 92 86 90 82C82 92 74 100 66 112Z',
  strands:'M120 98C122 84 130 72 142 64M90 96C92 84 98 74 108 66M160 102C166 88 170 76 168 66',
  shine:'M96 58C108 52 122 50 134 52'},
 {name:'侧分大波浪',ears:true,
  back:'M60 138C50 108 54 76 76 58C98 40 156 38 180 56C202 74 206 108 196 138Z',
  fringe:'M64 120C58 92 64 68 84 56C110 40 156 40 180 56C200 70 204 100 196 128C192 112 186 100 178 92C176 100 170 106 162 108C164 98 162 90 158 84C146 96 126 102 104 100C116 94 124 86 128 78C112 88 92 94 74 96C70 104 66 112 64 120Z',
  strands:'M104 100C120 96 140 88 150 74M74 96C96 92 112 84 120 72M182 66C192 80 196 96 192 112',
  shine:'M88 62C104 52 124 48 142 50'},
 {name:'中分长发',ears:false,
  back:'M58 222C46 180 46 120 56 88C66 58 94 42 128 42C162 42 190 58 200 88C210 120 210 180 198 222Z',
  fringe:'M58 206C50 160 52 106 66 76C80 54 104 44 128 44C152 44 176 54 190 76C204 106 206 160 198 206C192 204 186 196 184 180C186 140 186 108 176 88C162 98 146 94 132 70C130 66 126 66 124 70C110 94 94 98 80 88C70 108 70 140 72 180C70 196 64 204 58 206Z',
  strands:'M76 122C74 150 76 178 68 198M180 122C182 150 180 178 188 198M124 72C112 88 98 92 86 86',
  shine:'M92 58C104 51 114 48 122 48M136 48C148 50 158 54 166 60'},
 {name:'清爽短发',ears:true,
  back:'M64 128C58 100 62 76 78 62C98 46 158 46 178 62C194 76 198 100 192 128Z',
  fringe:'M66 114C62 90 70 70 86 60C108 48 150 48 170 60C186 70 194 90 190 114C186 104 182 96 176 90C150 96 112 94 84 88C76 96 70 104 66 114Z',
  strands:'M110 92L118 76M138 94L144 78M162 92L165 80',
  shine:'M92 62C110 54 134 52 150 54'},
 {name:'丸子头',ears:true,
  back:'M64 128C58 100 62 76 78 62C98 46 158 46 178 62C194 76 198 100 192 128Z',
  fringe:'M66 118C60 92 68 70 86 58C108 46 150 46 170 58C188 70 196 92 190 118C184 104 176 94 166 88C144 98 118 100 96 94C108 90 116 84 120 78C104 86 86 92 74 96C70 104 68 110 66 118Z',
  strands:'M96 94C112 88 124 80 132 68M166 88C156 78 144 70 132 66',
  shine:'M94 60C110 52 132 50 150 54',
  bun:'M106 56C100 40 112 29 128 29C144 29 156 40 150 56Z', bunShine:'M116 40C120 35 126 33 133 34'},
 {name:'自然卷',ears:true,
  back:`M58 134L52 84Q${curlTop.slice(curlTop.indexOf('Q')+1)}L204 134Z`,
  fringe:`M64 126L52 84Q${curlTop.slice(curlTop.indexOf('Q')+1)}L194 126${curlEdge}Z`,
  strands:'M86 70q6-6 12 0M118 54q6-6 12 0M150 58q6-6 12 0M174 80q6-6 12 0M70 92q6-6 12 0',
  shine:'M100 52C112 44 128 42 140 44'},
 {name:'后梳飞机头',ears:true,
  back:'M66 130C60 104 62 80 74 66C82 50 100 40 124 38C150 34 176 44 186 62C196 80 196 104 190 130Z',
  fringe:'M68 112C64 90 70 72 82 62C92 46 112 34 136 32C160 30 182 42 188 62C194 80 192 98 188 112C184 100 178 92 170 86C154 74 130 70 108 76C94 80 80 90 74 100C70 104 68 108 68 112Z',
  strands:'M100 70C114 54 136 44 160 46M118 74C130 60 150 54 172 60',
  shine:'M96 52C110 42 126 37 142 37'},
];
// Spike from a base buried in the hair mass (x,y, half-width w) to a tip (tx,ty).
const spike=([x,y,w,tx,ty])=>`M${x-w} ${y}Q${r1(x-w*.3)} ${r1(ty+(y-ty)*.4)} ${tx} ${ty}Q${r1(x+w*.5)} ${r1(ty+(y-ty)*.5)} ${x+w} ${y}Z`;
const lock=([x,y,w,tx,ty])=>`M${x-w} ${y}Q${r1(x-w*.7)} ${r1((y+ty)/2)} ${tx} ${ty}Q${r1(x+w)} ${r1((y+ty)/2)} ${x+w} ${y}Z`;
const SHAPES=[
 {top:44,tufts:[[118,58,8,122,30],[142,58,7,158,35],[100,62,6,90,42]],locks:[[122,94,6,120,112],[134,94,5,136,109]]},
 {top:38,tufts:[[112,52,8,104,30],[136,50,8,146,28],[160,58,7,176,40]],locks:[[110,82,5,104,98],[134,86,5,132,108]]},
 {top:44,tufts:[[116,56,8,110,32],[138,56,7,152,34]],locks:[[128,88,6,124,110],[146,84,5,152,96]]},
 {top:44,tufts:[[122,56,6,112,32],[134,56,6,146,34]],locks:[[122,64,4,114,96],[134,64,4,142,96]]},
 {top:50,tufts:[[108,64,7,100,40],[128,62,8,130,36],[150,64,7,162,42]],locks:[[112,86,5,108,96],[128,88,6,128,110],[146,86,5,152,96]]},
 {top:50,tufts:[[96,64,6,86,46],[162,64,6,172,46]],locks:[[126,90,6,124,110],[142,88,5,150,96]]},
 {top:36,tufts:[[112,48,6,106,28],[146,48,6,156,30]],locks:[[128,92,5,126,108]]},
 {top:32,tufts:[[128,46,7,146,28],[150,46,8,170,31],[176,56,6,190,42]],locks:[[132,66,5,122,94]]},
];
export const V4_HAIRSTYLES=BASE.map((s,i)=>Object.freeze({...s,top:SHAPES[i].top,tufts:SHAPES[i].tufts.map(spike).join(''),locks:SHAPES[i].locks.map(lock).join('')}));
