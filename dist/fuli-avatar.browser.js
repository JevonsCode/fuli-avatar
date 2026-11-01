/* Generated from src/ by npm run build; do not edit. */
(function(root){'use strict';
/** fuli-avatar v0.5.0. Pure, dependency-free, deterministic SVG generator. */
/* Generated from src/ by npm run build; do not edit. */
/** Render version 3, kept verbatim so stored v3 identities still draw identically. Do not change output. */
const V3_VERSION = '3';
const V3_PALETTES = [
 {name:'苔原绿',bg:'#E3E9E2',shirt:'#345B3C',accent:'#D77632',hair:'#192D3C'},
 {name:'海盐蓝',bg:'#DEE8EC',shirt:'#3B7685',accent:'#E8B75B',hair:'#263B4B'},
 {name:'莓果紫',bg:'#EAE2E8',shirt:'#75516A',accent:'#D7976C',hair:'#403A49'},
 {name:'暖麦黄',bg:'#F0E9D7',shirt:'#BC8C38',accent:'#47766B',hair:'#594536'},
 {name:'赤陶橙',bg:'#EEDFD6',shirt:'#B86446',accent:'#59786F',hair:'#483B35'},
 {name:'雾松灰',bg:'#D6DFDA',shirt:'#566C69',accent:'#C7A45A',hair:'#F0F0E8'},
];
const V3_OPTIONS = Object.freeze({palette:6,skin:5,hair:10,eyes:8,mouth:6,outfit:10,accessory:11,decoration:3});
const V3_COMBINATIONS=Object.values(V3_OPTIONS).reduce((a,b)=>a*b,1);
const V3_SKINS=['#FFE8CF','#F4D2AD','#DDB18B','#BA8768','#8E604C'];
const V3_INK='#1D3040';
function v3Rng(seed){let h=2166136261;for(const c of `${V3_VERSION}:${seed}`){h^=c.codePointAt(0);h=Math.imul(h,16777619);}return()=>{h+=0x6D2B79F5;let t=h;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
function getTraitsV3(seed='fuli',overrides={}){const random=v3Rng(String(seed));return Object.fromEntries(Object.entries(V3_OPTIONS).map(([key,count])=>{const value=overrides[key],sample=Math.floor(random()*count);return[key,Number.isInteger(value)&&value>=0&&value<count?value:sample];}));}
function createAvatarV3(seed='fuli',config={}){
 const t=getTraitsV3(seed,config.traits);const p=V3_PALETTES[t.palette],skin=V3_SKINS[t.skin];const size=Number.isInteger(config.size)&&config.size>=16&&config.size<=4096?config.size:256;
 const path=(d,fill='none',width=5)=>`<path d="${d}" fill="${fill}" stroke="${V3_INK}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
 const circle=(x,y,r,fill,stroke=V3_INK,w=5)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${w}"/>`;
 // Shared ear anchors: left (57, 132), right (197, 132).
 const hair=[
 'M53 139Q33 106 56 69Q72 38 111 32Q170 18 197 62Q217 93 203 135L184 156L72 159Z',
 'M51 139Q33 109 48 84L40 64L58 72Q75 37 108 36Q143 21 173 38Q189 45 205 36L201 54Q219 61 216 83L205 81Q215 111 200 140Z',
 'M61 173Q32 166 36 127Q30 89 57 59Q90 20 142 29Q196 28 209 77Q216 104 210 134Q229 168 186 177Z',
 'M51 140Q34 112 47 91Q32 73 55 62Q51 41 78 43Q84 22 108 34Q128 17 148 34Q174 23 183 45Q209 39 210 63Q229 81 207 106L203 139Z',
 'M51 140Q35 94 60 61Q86 27 130 29Q179 25 201 65Q218 93 202 140Z',
 'M52 139Q36 100 59 68Q69 45 101 37L92 31Q128 12 154 30Q186 29 199 58Q215 73 208 103L201 139Z',
 'M51 137Q37 110 46 88L36 90Q43 59 69 54L63 43Q101 44 114 28Q136 38 157 26L160 38Q191 50 208 39Q210 55 197 63Q226 81 213 101L204 94L201 138Z',
 'M52 139Q34 105 52 72L43 60L63 63Q85 34 118 36Q143 21 173 36Q191 46 211 40L201 59Q220 81 204 137Z'];
 let out=`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 256 256" role="img" aria-label="Generated FULI avatar"><rect width="256" height="256" rx="${config.rounded===false?0:36}" fill="${config.transparent?'none':p.bg}"/>`;
 if(t.decoration===1)out+='<g fill="'+p.accent+'" opacity=".35"><circle cx="37" cy="151" r="5"/><circle cx="215" cy="48" r="7"/></g>';
 if(t.decoration===2)out+=`<path d="M29 74h12m-6-6v12M211 157h12m-6-6v12" stroke="${p.accent}" stroke-width="4" stroke-linecap="round"/>`;
 hair.push('M42 143Q23 137 30 118Q18 105 29 89Q20 72 36 61Q30 42 49 38Q54 20 73 25Q87 8 104 20Q122 7 138 20Q155 8 169 24Q191 17 199 37Q221 38 219 58Q238 70 227 88Q239 105 225 120Q229 142 209 147L187 167L69 166Z',
 'M44 141Q27 126 40 109Q26 91 42 77Q34 57 55 52Q54 31 77 34Q89 15 109 29Q126 12 143 27Q165 14 178 35Q200 30 204 52Q224 57 215 77Q231 93 215 109Q226 129 206 144Z');
 // One shared transform keeps every wearable attached while giving the portrait breathing room.
 out+='<g data-part="portrait" transform="translate(20.48 22) scale(.84)">';
 // Both hair layers are filled AND edged with the selected hair color. There is no dark scalp base.
 const hairPath=d=>`<path d="${d}" fill="${p.hair}" stroke="${p.hair}" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>`;
 out+='<g data-part="hair-back">'+hairPath(hair[t.hair])+'</g>';
 // Neck first, then garments with a real neckline cutout, then the overlapping face.
 out+='<g data-part="neck">'+path('M111 163L110 186Q127 204 148 186L147 162Z',skin,4.5)+'</g>';
 const cream='#F6EBDD';
 const body='M108 184L92 187Q59 193 55 223L55 235Q128 240 201 235L201 223Q197 193 164 187L148 184Q128 204 108 184Z';
 out+='<g data-part="outfit" data-style="'+t.outfit+'">'+path(body,p.shirt,5);
 if(t.outfit===0){ // Crewneck with sewn-on pocket.
  out+=path('M106 185Q128 209 150 185','none',3.5)+path('M160 207H181V220Q170 226 160 220Z','none',2.8);
 }else if(t.outfit===1){ // Open work jacket over a light tee; lapels share the shoulder seam.
  out+=path('M109 185Q128 203 147 185L151 237H105Z',cream,3.5);
  out+=path('M100 185L88 196L103 202L94 215L108 237L115 191Z',p.shirt,3.5);
  out+=path('M156 185L168 196L153 202L162 215L148 237L141 191Z',p.shirt,3.5);
  out+=path('M68 211H86M170 211H188','none',2.5);
 }else if(t.outfit===2){ // Button cardigan; no unexplained vertical blocks.
  out+=path('M108 184Q128 201 148 184L128 210Z',cream,3);
  out+=path('M108 185L128 210L148 185M128 210V237','none',3.5);
  out+=circle(132,217,1.7,cream,V3_INK,1)+circle(132,228,1.7,cream,V3_INK,1);
 }else if(t.outfit===3){ // Breton tee stripes stay within the garment silhouette.
  out+=path('M106 185Q128 209 150 185','none',3.5);
  out+=path('M67 208H189M62 220H194M60 232H196', 'none',4).replace(`stroke="${V3_INK}"`,`stroke="${cream}"`);
 }else if(t.outfit===4){ // Hoodie: two soft hood folds, a V opening, and paired drawstrings.
  out+=path('M108 184L96 188Q98 202 112 207L128 199L144 207Q158 202 160 188L148 184Q128 203 108 184Z',p.shirt,3.5);
  out+=path('M112 207V220M144 207V220','none',2.6);
  out+=circle(112,220,1.8,cream,V3_INK,1)+circle(144,220,1.8,cream,V3_INK,1);
  out+=path('M111 225L105 234H151L145 225','none',2.5);
 }else if(t.outfit===5){ // Oxford shirt, folded collar and center placket.
  out+=path('M108 184L99 191L115 204L127 194L139 204L157 191L148 184Q128 201 108 184Z',cream,3);
  out+=path('M127 196V237','none',2.5);
  out+=circle(133,212,1.6,cream,V3_INK,1)+circle(133,224,1.6,cream,V3_INK,1);
 }else if(t.outfit===6){ // Dungarees over a tee, straps meet the bib rather than the neck.
  out+=path('M106 185Q128 209 150 185','none',3);
  out+=path('M91 188L99 187L104 209H153L158 187L166 190L163 237H94Z',p.accent,3.5);
  out+=circle(104,210,2.5,cream,V3_INK,1.5)+circle(153,210,2.5,cream,V3_INK,1.5);
  out+=path('M116 217H141V227Q129 231 116 227Z','none',2.5);
 }else if(t.outfit===7){ // Soft high-neck knit with a distinct folded collar.
  out+=path('M108 183Q128 193 148 183L151 196Q128 205 105 196Z',p.shirt,3.5);
  out+=path('M113 190V196M123 193V199M133 193V199M143 190V196M72 216V233M184 216V233','none',2);
 }else if(t.outfit===8){ // Rugby polo, contrasting yoke and a compact collar.
  out+=path('M65 207H191M61 216H195','none',5).replace(`stroke="${V3_INK}"`,`stroke="${cream}"`);
  out+=path('M108 184L101 191L117 201L128 193L140 201L155 191L148 184Q128 201 108 184Z',cream,3);
  out+=path('M128 196V207','none',2.5);
 }else{ // Raglan sweatshirt with coherent sleeve seams and ribbed hem.
  out+=path('M106 185Q128 209 150 185M96 189L76 218M160 189L180 218M59 230Q128 235 197 230','none',3);
  out+=path('M117 201L128 211L139 201','none',2.5);
 }
 out+='</g>';
 // The upper skull is fill-only: a hidden dark outline would peek through light fringes.
 out+='<g data-part="face">'+path('M68 93Q88 65 129 65Q168 65 185 92L191 118Q201 109 209 121Q218 142 194 147Q187 174 156 181Q119 191 88 173Q74 165 68 147Q48 155 43 137Q37 119 52 115Q59 114 65 121Z',skin,0)+path('M207 119Q218 142 194 147Q187 174 156 181Q119 191 88 173Q74 165 68 147Q48 155 43 137Q39 126 45 121','none',5.5)+'</g>';
 const fringe=[
 'M50 119Q39 89 64 62Q101 25 147 35Q183 39 193 76L190 112Q185 84 169 65Q141 97 92 97Q81 98 78 111L70 126L65 121Q57 113 50 119Z',
 'M49 119Q41 87 66 63Q99 34 145 37Q183 36 195 69L195 112Q184 88 168 77Q149 91 123 85Q131 81 135 77Q111 88 95 79Q86 101 76 107L70 126L64 120Q57 114 49 119Z',
 'M47 121Q35 93 61 60Q95 28 141 32Q182 32 198 73L197 115Q188 86 172 65Q144 94 95 96Q90 112 78 126L68 121Q56 111 47 121Z',
 'M49 120Q40 88 66 66Q102 36 145 40Q181 38 196 74L196 114L183 98Q164 105 152 88Q136 108 117 91Q99 110 83 101L72 124L65 120Q58 115 49 120Z',
 'M48 119Q39 86 67 61Q102 31 148 36Q185 40 197 76L194 119L180 112L175 84Q128 94 83 86L76 121L68 124Q56 113 48 119Z',
 'M49 119Q42 89 67 64Q103 33 150 35Q185 40 196 76L194 116L182 103Q180 76 160 61Q142 57 125 70Q107 83 82 87L73 122L65 121Q57 114 49 119Z',
 'M49 120Q39 86 68 62Q99 34 151 36Q185 41 197 76L194 119L181 109Q181 89 171 80L171 97Q148 88 143 65Q128 70 132 96Q110 92 105 77Q104 95 85 108L72 125L64 120Q57 114 49 120Z',
 'M48 120Q40 88 66 65Q103 35 149 38Q183 40 197 77L194 118L183 104Q181 84 166 73Q146 91 125 82Q108 104 82 100L73 124L64 120Q57 114 48 120Z'];
 fringe.push('M42 119Q31 86 57 61Q96 30 149 35Q194 37 211 78L208 120Q194 111 184 125L176 99Q158 108 143 97Q126 110 110 99Q94 110 81 101L71 124Q57 110 42 119Z',
 'M43 121Q34 89 59 63Q97 32 148 37Q191 40 208 78L205 122L188 115L180 98Q168 111 155 98Q142 111 129 98Q116 113 103 100Q90 112 79 105L69 124Q55 113 43 121Z');
 out+='<g data-part="hair-front">'+hairPath(fringe[t.hair])+'</g>';
 if(t.hair===8||t.hair===9)out+=path('M52 79Q47 70 56 65M81 47Q90 39 97 46M121 34Q131 28 137 36M173 49Q184 45 188 56M202 84Q210 89 204 97','none',2.5).replace(`stroke="${V3_INK}"`,'stroke="#ffffff" opacity=".12"');
 // Ear cushions remain at the shared anchors. Only the upper headband expands for fuller hair.
 if(t.accessory===2){const full=t.hair>=8,left=full?27:43,right=full?229:213,top=full?3:19;
  const arch=`M48 127Q${left} 113 ${left} 94Q${left} ${top} 128 ${top}Q${right} ${top} ${right} 94Q${right} 113 208 127`;
  out+='<g data-part="headphone-band">'+path(arch,'none',10)+path(arch,'none',4).replace(`stroke="${V3_INK}"`,`stroke="${p.accent}"`)+'</g>';
 }
 const eyes=[`<ellipse cx="105" cy="129" rx="8" ry="11" fill="${V3_INK}"/><ellipse cx="157" cy="125" rx="8" ry="11" fill="${V3_INK}"/>`,path('M95 130Q103 119 111 130M149 130Q157 119 165 130','none',5),path('M96 129H110','none',5)+`<ellipse cx="157" cy="125" rx="8" ry="11" fill="${V3_INK}"/>`,`<ellipse cx="103" cy="129" rx="6" ry="9" fill="${V3_INK}"/><ellipse cx="157" cy="129" rx="6" ry="9" fill="${V3_INK}"/>`,path('M94 124L103 130L112 124M148 124L157 130L166 124','none',5),circle(103,128,7,V3_INK,V3_INK,1)+circle(157,128,7,V3_INK,V3_INK,1)+circle(105,126,2,'white','none',0)+circle(159,126,2,'white','none',0)];
 eyes.push(path('M95 127Q104 137 113 127M149 124Q157 134 165 124','none',4),path('M97 124L104 128L98 132','none',4)+`<ellipse cx="157" cy="125" rx="7" ry="10" fill="${V3_INK}"/>`);
 // Glasses cover the eye area; avoid eyebrows or pupils poking through star/cat-eye points.
 if(t.accessory<8)out+=path('M96 111Q103 107 111 110M150 107Q157 102 164 106','none',4)+eyes[t.eyes];
 out+=path('M130 137Q126 143 132 144','none',3);
 out+=['M118 153Q132 164 146 150','M119 153Q130 157 142 151','M123 152Q130 164 137 152Z','M122 154H139','M119 151Q132 170 146 149Z','M127 153Q128 146 135 148Q141 153 136 159Q129 162 127 153Z'].map((d,i)=>i===t.mouth?path(d,i===2||i===4||i===5?V3_INK:'none',4):'').join('');
 out+=`<ellipse cx="87" cy="146" rx="9" ry="4" fill="#DC8F79" opacity=".30"/><ellipse cx="174" cy="146" rx="9" ry="4" fill="#DC8F79" opacity=".30"/>`;
 const accessories=['',
 circle(105,129,19,'none',V3_INK,4)+circle(157,125,19,'none',V3_INK,4)+path('M124 127Q131 121 138 125M85 126L69 121M176 121L190 117','none',4),
 `<g><rect x="36" y="111" width="25" height="42" rx="11" fill="${V3_INK}"/><rect x="39" y="114" width="16" height="36" rx="8" fill="${p.accent}"/><path d="M43 120v22" stroke="#FFF5DF" stroke-opacity=".55" stroke-width="2.5" stroke-linecap="round"/><rect x="55" y="118" width="7" height="28" rx="3.5" fill="${V3_INK}"/><rect x="195" y="111" width="25" height="42" rx="11" fill="${V3_INK}"/><rect x="201" y="114" width="16" height="36" rx="8" fill="${p.accent}"/><path d="M212 120v22" stroke="#FFF5DF" stroke-opacity=".55" stroke-width="2.5" stroke-linecap="round"/><rect x="194" y="118" width="7" height="28" rx="3.5" fill="${V3_INK}"/><path d="M209 151Q209 167 178 165" fill="none" stroke="${V3_INK}" stroke-width="4" stroke-linecap="round"/><rect x="166" y="161" width="15" height="8" rx="4" fill="${V3_INK}"/></g>`,
 `<g data-part="perched-hat" transform="translate(0 ${-[0,0,3,5,0,4,5,0,14,9][t.hair]}) rotate(-25 80 58)">`+
 path('M53 54V39Q53 18 76 18Q99 18 99 39V54Z','#27323A',3.5)+
 path('M53 46Q76 52 99 46V55Q76 61 53 55Z','#46535A',2)+
 `<ellipse cx="76" cy="57" rx="38" ry="8" fill="#27323A" stroke="${V3_INK}" stroke-width="3.5"/>`+
 path('M58 29Q66 21 77 23','none',2).replace(`stroke="${V3_INK}"`,'stroke="#677178"')+`</g>`,
 `<g transform="rotate(-8 128 73)">`+path('M51 76Q51 31 120 28Q181 25 199 73L198 90L51 94Z',p.accent,5)+path('M50 76Q122 64 199 74L198 94Q121 83 51 96Z',p.accent,5)+path('M69 78V89M86 76V87M104 74V86M122 74V85M140 74V85M158 75V86M177 77V88','none',2)+`<rect x="146" y="76" width="21" height="14" rx="3" fill="#F7E9D2"/>`+path('M152 86L157 80L162 86','none',2)+`</g>`,
 `<g transform="rotate(24 182 99)"><rect x="167" y="93" width="29" height="10" rx="5" fill="${p.accent}" stroke="${V3_INK}" stroke-width="2.5"/><path d="M174 98h14" stroke="#FFF4D8" stroke-width="2" stroke-linecap="round"/></g>`,
 circle(200,146,3,'#F5D381',V3_INK,1.5)+`<ellipse cx="201" cy="156" rx="7" ry="9" fill="none" stroke="${V3_INK}" stroke-width="5"/><ellipse cx="201" cy="156" rx="7" ry="9" fill="none" stroke="#D5A94D" stroke-width="3"/><path d="M197 151Q194 155 197 160" fill="none" stroke="#FCE3A0" stroke-width="1.5" stroke-linecap="round"/>`];
 // Sunglasses belong to the same small-accessories selector as the chain and hats.
 const lens='#20303C',shine='#A4C5C2';
 const arms=path('M84 124L69 119M176 121L192 116M121 126Q130 120 139 124','none',3.5);
 const sunglasses=[
  arms+path('M85 117Q102 112 121 117L119 132Q115 142 101 140Q89 139 87 130Z',lens,3)+path('M139 114Q157 109 175 114L174 128Q171 139 157 137Q143 136 141 128Z',lens,3)+path('M94 121L104 119M149 118L159 116','none',2.5).replace(`stroke="${V3_INK}"`,`stroke="${shine}"`),
  arms+path('M103 109L109 120L122 121L113 130L115 143L103 137L91 143L94 130L84 121L97 120Z',lens,3)+path('M156 106L162 117L175 118L166 127L168 140L156 134L144 140L147 127L137 118L150 117Z',lens,3)+path('M98 123L103 120M151 120L156 117','none',2).replace(`stroke="${V3_INK}"`,`stroke="${shine}"`),
  arms+path('M82 114L121 118Q125 136 108 141Q93 144 88 128Z',lens,3)+path('M137 117L178 109L174 125Q172 138 157 139Q140 139 137 117Z',lens,3)+path('M92 119L102 121M150 121L161 118','none',2.5).replace(`stroke="${V3_INK}"`,`stroke="${shine}"`)
 ];
 if(t.accessory<7)out+=accessories[t.accessory];
 if(t.accessory===7){
  // One gold chain, no pendant and no independently randomized jewelry layer.
  out+='<g data-part="gold-chain">';
  const links=[[105,190,-20],[108,197,-35],[114,203,-55],[122,207,-75],[131,208,90],[140,206,70],[148,202,50],[154,196,30],[156,189,15]];
  for(const [i,[x,y,angle]] of links.entries())out+=`<g transform="translate(${x} ${y}) rotate(${angle})"><ellipse rx="3" ry="4.8" fill="none" stroke="#765021" stroke-width="3.5"/><ellipse rx="3" ry="4.8" fill="none" stroke="#DDB453" stroke-width="2.3"/><path d="M-1.7-3Q-3-1-1.8 1" fill="none" stroke="#FFE6A1" stroke-width="1" stroke-linecap="round"/></g>`;
  out+='</g>';
 }
 if(t.accessory>=8)out+='<g data-part="sunglasses">'+sunglasses[t.accessory-8]+'</g>';
 return out+'</g></svg>';
}

// Shared v4 helpers. Every value written into SVG comes from built-in tables or finite numbers.
// Seeded PRNG (FNV-1a into a mulberry32 stream). Each namespace draws independently, so
// optional extras (eggs, names) never shift the trait draws of an existing seed.
function seededRng(ns,seed){let h=2166136261;for(const c of `${ns}${seed}`){h^=c.codePointAt(0);h=Math.imul(h,16777619);}return()=>{h+=0x6D2B79F5;let t=h;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
const v4Rng=seed=>seededRng('4:',seed);
// Mix two #RRGGBB colors; used to derive shade and highlight tones from curated base colors.
function mix(a,b,k){const n=s=>[1,3,5].map(i=>parseInt(s.slice(i,i+2),16));const x=n(a),y=n(b);return '#'+x.map((v,i)=>Math.round(v+(y[i]-v)*k).toString(16).padStart(2,'0')).join('').toUpperCase();}
const INK='#22303D';
// Outline width scales up when the avatar is drawn small so the silhouette stays readable.
function pen(lod){return lod===0?5.6:lod===1?4.6:4;}
const shape=(d,fill,stroke=INK,w=4)=>`<path d="${d}" fill="${fill}"${stroke==='none'?'':` stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`}/>`;
const line=(d,stroke,w,extra='')=>`<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;

// Curated v4 tones sampled from the four built-in portraits: muted, warm, never candy.
const V4_PALETTES=[
 {name:'苔原绿',bg:'#DCE3DA',shirt:'#3F6B4E',accent:'#C9773F'},
 {name:'赤陶橙',bg:'#E9DFD4',shirt:'#B5603F',accent:'#3F6B5E'},
 {name:'莓果紫',bg:'#E5DEE3',shirt:'#6E4F68',accent:'#D2A25C'},
 {name:'海盐蓝',bg:'#DBE4E8',shirt:'#3E6E80',accent:'#D39A55'},
 {name:'暖麦黄',bg:'#EDE6D6',shirt:'#B88D3E',accent:'#4D6E66'},
 {name:'雾松灰',bg:'#DEE2DF',shirt:'#55666A',accent:'#C58A5B'},
];
const V4_SKINS=['#FCE3CE','#F4D0B0','#E2B48E','#C08E6B','#8E6450'];
const V4_HAIR=[
 {name:'墨蓝',base:'#25334A'},
 {name:'深棕',base:'#4A3428'},
 {name:'栗色',base:'#7B4A2E'},
 {name:'铜红',base:'#A65A35'},
 {name:'亚麻',base:'#C9A46A'},
 {name:'银灰',base:'#B7B8B4'},
];

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
const V4_HAIRSTYLES=BASE.map((s,i)=>Object.freeze({...s,top:SHAPES[i].top,tufts:SHAPES[i].tufts.map(spike).join(''),locks:SHAPES[i].locks.map(lock).join('')}));

// v4 head: ears, face, neck and features. Features use ink only; no outlines inside the face.
const V4_FACE='M68 104C68 76 94 62 128 62C162 62 188 76 188 104L188 128C188 160 162 182 128 182C94 182 68 160 68 128Z';
const V4_NECK='M110 166L110 196C120 204 136 204 146 196L146 166Z';
function v4Ears(skin,lod,w){
 const ear=(d,inner)=>shape(d,skin,INK,w)+(lod===0?line(inner,mix(skin,'#9A5A44',.45),2.4):'');
 return ear('M72 118C62 112 54 118 56 130C58 142 64 148 74 146Z','M66 124C62 128 63 136 68 140')+
  ear('M184 118C194 112 202 118 200 130C198 142 192 148 182 146Z','M190 124C194 128 193 136 188 140');
}
// Eyes sit at (106,130) and (150,130): large dark ovals like the built-ins, one catchlight
// upper-right and a short upper-lid stroke. Only friendly expressions; no lidded or sleepy eyes.
const EL=106,ER=150,EY=130;
const oval=(x,rx,ry)=>`<ellipse cx="${x}" cy="${EY}" rx="${rx}" ry="${ry}" fill="${INK}"/>`;
const glint=(x,lod,r,dy=4.5)=>lod===2?'':`<circle cx="${x+3.4}" cy="${EY-dy}" r="${r}" fill="#FFFFFF"/>`;
const lid=x=>`M${x-9} ${EY-9}C${x-6} ${EY-15} ${x+4} ${EY-16} ${x+10} ${EY-11}`;
const V4_EYES=[
 {name:'亮眼睛',draw:lod=>oval(EL,8.5,11)+oval(ER,8.5,11)+glint(EL,lod,lod===0?2.8:3.2)+glint(ER,lod,lod===0?2.8:3.2)+line(lid(EL)+lid(ER),INK,3.4)},
 {name:'笑眯眯',draw:()=>line(`M${EL-10} ${EY+3}C${EL-6} ${EY-9} ${EL+6} ${EY-9} ${EL+10} ${EY+3}M${ER-10} ${EY+3}C${ER-6} ${EY-9} ${ER+6} ${EY-9} ${ER+10} ${EY+3}`,INK,5.2)},
 {name:'圆眼睛',draw:lod=>oval(EL,9,9.5)+oval(ER,9,9.5)+glint(EL,lod,lod===0?3:3.4,3.5)+glint(ER,lod,lod===0?3:3.4,3.5)},
];
const V4_BROWS=[
 {name:'柔和',d:'M96 108C101 104 108 103 114 105M142 105C148 103 155 104 160 108'},
 {name:'平直',d:'M96 106L114 104M142 104L160 106'},
 {name:'上扬',d:'M97 109C102 103 108 101 115 101M141 101C148 101 154 103 159 109'},
];
// Every mouth smiles; flat, pursed and downturned shapes are excluded on purpose.
const V4_MOUTHS=[
 {name:'微笑',draw:()=>line('M117 152C123 159 133 159 139 152',INK,4.2)},
 {name:'开心',draw:()=>shape('M115 150C120 151 136 151 141 150C140 160 134 165 128 165C122 165 116 160 115 150Z',INK,INK,3)+shape('M121 160C125 157 131 157 135 160C133 163 130 164 128 164C126 164 123 163 121 160Z','#D9786A','none')},
 {name:'坏笑',draw:()=>line('M117 153C123 158 132 158 139 150',INK,4.2)},
];
function v4Features(t,skin,lod,hideBrows){
 let s='';
 // Soft cheek warmth and a tiny nose hook, dropped at icon sizes.
 if(lod<2)s+=`<ellipse cx="92" cy="148" rx="9" ry="5" fill="#E88F7A" opacity=".26"/><ellipse cx="164" cy="148" rx="9" ry="5" fill="#E88F7A" opacity=".26"/>`;
 if(lod<2)s+=line('M129 136C127 140 127 142 131 143',mix(skin,'#7A4636',.55),2.8);
 if(!hideBrows)s+=line(V4_BROWS[t.brows].d,INK,lod===2?5:4.2);
 s+=V4_EYES[t.eyes].draw(lod)+V4_MOUTHS[t.mouth].draw(lod);
 return s;
}

// v4 garments. Body is cropped by the canvas bottom like the built-ins; only collars carry detail.
const V4_BODY='M110 188C84 190 56 198 42 216C32 228 28 246 27 262L229 262C228 246 224 228 214 216C200 198 172 190 146 188Z';
const crew='M106 189C114 206 142 206 150 189';
const rib='M104 188C112 210 144 210 152 188L146 186C140 200 116 200 110 186Z';
// Small ink folds near the armpits suggest arms against the torso.
const folds='M64 230C68 240 70 250 70 262M192 230C188 240 186 250 186 262';
const V4_OUTFITS=[
 {name:'圆领卫衣',draw:(p,w,lod)=>shape(rib,mix(p.shirt,'#000000',.15),INK,w*.75)+(lod<2?line('M86 196C80 210 76 226 74 240M170 196C176 210 180 226 182 240',mix(p.shirt,'#000000',.28),2.6):'')},
 {name:'翻领衬衫',draw:(p,w,lod)=>{const c=mix(p.shirt,'#FFFFFF',.82);return shape('M110 187L128 210L146 187Z',mix(p.shirt,'#000000',.25),'none')+line('M128 210V262',INK,w*.6)+shape('M108 184L128 210L106 214L96 196Z',c,INK,w*.75)+shape('M148 184L128 210L150 214L160 196Z',c,INK,w*.75)+(lod<2?`<circle cx="132" cy="226" r="2.4" fill="${c}"/><circle cx="132" cy="244" r="2.4" fill="${c}"/>`:'')}},
 {name:'开衫',draw:(p,w,lod)=>{const tee=mix(p.accent,'#FFFFFF',.55);return shape('M108 188L148 188L140 262L116 262Z',tee,INK,w*.75)+line(crew,INK,w*.6)+line('M108 188C112 214 116 238 116 262M148 188C144 214 140 238 140 262',INK,w*.75)+(lod<2?`<circle cx="145" cy="222" r="2.6" fill="${INK}"/><circle cx="143" cy="242" r="2.6" fill="${INK}"/>`:'')}},
 {name:'西装外套',draw:(p,w)=>{const tee=mix(p.shirt,'#FFFFFF',.85),lap=mix(p.shirt,'#000000',.18);return shape('M108 188L148 188L136 262L120 262Z',tee,INK,w*.75)+line(crew,INK,w*.6)+shape('M108 186L98 202L108 208L104 216L124 262L110 262L92 222L90 198Z',lap,INK,w*.75)+shape('M148 186L158 202L148 208L152 216L132 262L146 262L164 222L166 198Z',lap,INK,w*.75)}},
 {name:'连帽衫',draw:(p,w,lod)=>{const hood=mix(p.shirt,'#000000',.16),inner=mix(p.shirt,'#000000',.38);return shape('M92 196C84 186 96 176 110 180L128 206L146 180C160 176 172 186 164 196C156 214 140 222 128 222C116 222 100 214 92 196Z',hood,INK,w*.75)+shape('M110 184L128 206L146 184C140 196 116 196 110 184Z',inner,'none')+(lod<2?line('M118 214V236M138 214V236',mix(p.accent,'#FFFFFF',.4),3)+`<circle cx="118" cy="238" r="2.6" fill="${mix(p.accent,'#FFFFFF',.4)}"/><circle cx="138" cy="238" r="2.6" fill="${mix(p.accent,'#FFFFFF',.4)}"/>`:'')}},
 {name:'高领毛衣',draw:(p,w,lod)=>{const c=mix(p.shirt,'#000000',.12);return shape('M106 168C106 162 150 162 150 168L152 196C140 206 116 206 104 196Z',c,INK,w*.75)+(lod<2?line('M114 172V198M122 172V202M130 172V202M138 172V202M146 172V198',mix(p.shirt,'#000000',.32),2):'')}},
 {name:'T 恤',draw:(p,w,lod)=>shape(rib,mix(p.shirt,'#FFFFFF',.2),INK,w*.75)+(lod<2?shape('M160 220H184V236C178 242 166 242 160 236Z','none',mix(p.shirt,'#000000',.32),2.6):'')},
];
const V4_FOLDS=folds;

// v4 accessories: a short list that reads at 32 px. Each returns markup for its layer.
const lens=(x,y,round)=>round?`<circle cx="${x}" cy="${y}" r="15" fill="#FFFFFF" fill-opacity=".18" stroke="${INK}" stroke-width="3.6"/>`:`<rect x="${x-16}" y="${y-14}" width="32" height="28" rx="9" fill="#FFFFFF" fill-opacity=".18" stroke="${INK}" stroke-width="3.6"/>`;
function glasses(round){return '<g data-part="glasses">'+lens(106,130,round)+lens(150,130,round)+line('M121 128C125 124 131 124 135 128M90 126L70 122M166 126L186 122',INK,3.4)+'</g>';}
// Headphone band over the skull top; shared with the music eggs so both sit on the same arc.
function v4PhoneBand(style){const top=Math.max(style.top-10,26);return `M60 122C50 ${top+40} 80 ${top} 128 ${top}C176 ${top} 206 ${top+40} 196 122`;}
const V4_ACCESSORIES=['无','圆框眼镜','方框眼镜','耳机','毛线帽','围巾','发夹'];
// Layer "front": drawn after the fringe. Layer "neck": drawn over the garment, under the face.
function v4Accessory(t,p,style,w,lod){
 const a=t.accessory,out={neck:'',front:''};
 if(a===1||a===2)out.front=glasses(a===1);
 if(a===3){const band=v4PhoneBand(style);
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

// v4 easter eggs: rare, gently animated extras. Opt-in only ({ eggs: true }); without it the
// renderer output is byte-identical. The egg comes from its own seed namespace, so it never
// shifts trait draws. Rest poses are the static markup: renderers that skip CSS animation, PNG
// export and prefers-reduced-motion all show the decoration standing still.
const eggR2=n=>Math.round(n*100)/100;
// Wrapper places a part; the inner group animates about the wrapper's local origin.
const eggAt=(transform,cls,body)=>`<g transform="${transform}"><g class="fa-m ${cls}">${body}</g></g>`;
const eggPath=(d,fill,w)=>`<path d="${d}" fill="${fill}" stroke="${INK}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
// Every animation delay is offset by --fa-t, so a frame sampler can pause the clock at any time.
const eggDelay=s=>`animation-delay:calc(${s}s - var(--fa-t, 0s))`;
const eggAnim=(sel,spec,delay=0)=>`${sel}{animation:${spec};${eggDelay(delay)}}`;
const STAR4=s=>{const a=eggR2(s*.16),b=eggR2(s*.3);return `M0 ${-s}C${a} ${-b} ${b} ${-a} ${s} 0C${b} ${a} ${a} ${b} 0 ${s}C${-a} ${b} ${-b} ${a} ${-s} 0C${-b} ${-a} ${-a} ${-b} 0 ${-s}Z`;};
const STAR5=(()=>{let d='';for(let i=0;i<10;i++){const r=i%2?5.4:12,a=Math.PI*(i/5-.5);d+=(i?'L':'M')+eggR2(r*Math.cos(a))+' '+eggR2(r*Math.sin(a));}return d+'Z';})();
const LEAF='M0 -10C8 -8 10 2 0 11C-10 2 -8 -8 0 -10Z';
const CLOUD='M-18 6C-25 6 -25 -5 -16 -5C-15 -13 -4 -15 1 -8C5 -14 17 -12 16 -4C24 -4 24 6 16 6Z';
const HEART='M0 5C-9 -1 -10 -8 -5.5 -10C-2.5 -11.3 0 -9 0 -6.5C0 -9 2.5 -11.3 5.5 -10C10 -8 9 -1 0 5Z';
const AHOGE='M0 4C-4 -10 2 -24 14 -28C22 -30 24 -22 17 -19';
// Music eggs: over-ear cups centred on the ears (head frame), on the same band as the accessory.
const CUPS=[56,200];
const musicCup=(x,cls,fill,w,extra='')=>eggAt(`translate(${x} 132)`,cls,`<rect x="-12" y="-22" width="24" height="44" rx="12" fill="${fill}" stroke="${INK}" stroke-width="${w}"/>`+extra);
const NOTE1=`<ellipse cx="0" cy="0" rx="4.6" ry="3.4" transform="rotate(-22)" fill="${INK}"/>`+line('M4 -1V-17C9 -15 11 -11 9 -7',INK,2.6);
const NOTE2=`<ellipse cx="0" cy="0" rx="4.6" ry="3.4" transform="rotate(-22)" fill="${INK}"/><ellipse cx="11" cy="-3" rx="4.6" ry="3.4" transform="rotate(-22 11 -3)" fill="${INK}"/>`+line('M4 -1V-16M15 -4V-19',INK,2.6)+`<path d="M4 -17L15 -20L15 -15.5L4 -12.5Z" fill="${INK}"/>`;
// The music eggs move the whole head. :has() scopes the rule to the SVG that carries the egg,
// because an inline <style> applies to the whole page. Without :has() the head simply stays still.
const headAnim=(id,spec)=>eggAnim(`svg:has([data-egg="${id}"]) [data-part="head"]`,spec);
const stillHead='svg [data-part="head"]{animation:none!important}';
// Slots: bg (behind the character), neck (over the garment, under the face), face (over the face,
// under the fringe, head frame), head (over head-worn accessories, head frame), over (canvas top).
// `loop` is the seconds after which every part of the egg repeats; GIF export samples one loop.
const V4_EGGS=[
 {id:'blink',name:'眨眨眼',en:'Blink',slot:'face',loop:4.8,
  css:'@keyframes fa-blink{0%,88%,100%{opacity:0}90%,95%{opacity:1}}'+eggAnim('.fa-blink','fa-blink 4.8s infinite'),
  // Reduced motion keeps a still wink instead of a blink.
  still:'.fa-wink{opacity:1}',
  draw:({skin})=>{const lid=x=>`<ellipse cx="${x}" cy="129" rx="12.5" ry="13.5" fill="${skin}"/>`+line(`M${x-9} 131C${x-5} 136 ${x+5} 136 ${x+9} 131`,INK,4.2);
   return `<g class="fa-m fa-blink" opacity="0">${lid(106)}</g><g class="fa-m fa-blink fa-wink" opacity="0">${lid(150)}</g>`;}},
 {id:'sparkle',name:'闪闪亮',en:'Sparkle',slot:'over',loop:2.4,
  css:'@keyframes fa-tw{0%,100%{transform:scale(1) rotate(0deg)}50%{transform:scale(.55) rotate(45deg)}}'+eggAnim('.fa-tw','fa-tw 2.4s ease-in-out infinite')+`.fa-tw2{${eggDelay(-1.2)}}`,
  draw:({p})=>{const c=mix(p.accent,'#FFFFFF',.6);return eggAt('translate(212 50)','fa-tw',eggPath(STAR4(21),c,3))+eggAt('translate(236 88)','fa-tw fa-tw2',eggPath(STAR4(11),c,2.6))+eggAt('translate(190 24)','fa-tw fa-tw2',eggPath(STAR4(8),c,2.4));}},
 {id:'leaf',name:'落叶飘飘',en:'Falling leaf',slot:'bg',loop:10,
  css:'@keyframes fa-leaf{0%{transform:translate(0px,0px) rotate(0deg);opacity:0}6%{opacity:1}25%{transform:translate(12px,58px) rotate(50deg)}50%{transform:translate(-8px,118px) rotate(-15deg)}75%{transform:translate(10px,178px) rotate(40deg);opacity:1}100%{transform:translate(0px,236px) rotate(0deg);opacity:0}}'+eggAnim('.fa-leaf','fa-leaf 10s linear infinite',-1)+`.fa-leaf2{${eggDelay(-6)}}`,
  draw:({p})=>{const leaf=eggPath(LEAF,p.accent,2.2)+line('M0 -6V7',mix(p.accent,'#000000',.3),1.6);return eggAt('translate(26 30) rotate(-20) scale(1.6)','fa-leaf',leaf)+eggAt('translate(230 20) rotate(25) scale(1.5)','fa-leaf fa-leaf2',leaf);}},
 {id:'star',name:'小星星',en:'Little star',slot:'over',loop:3.2,
  css:'@keyframes fa-bob{0%,100%{transform:translate(0px,0px) rotate(-8deg)}50%{transform:translate(0px,-7px) rotate(8deg)}}'+eggAnim('.fa-bob','fa-bob 3.2s ease-in-out infinite'),
  draw:({p})=>eggAt('translate(34 56) scale(1.7)','fa-bob',eggPath(STAR5,mix(p.accent,'#FFFFFF',.45),2.4)+`<circle cx="-2.6" cy="0.6" r="1.3" fill="${INK}"/><circle cx="2.6" cy="0.6" r="1.3" fill="${INK}"/>`)},
 {id:'ahoge',name:'呆毛',en:'Cowlick',slot:'head',loop:2.6,
  // A crown strand drawn over the hair; a borderless hair-colour dab hides the root cap.
  // Scaled so its tip never rises above head y 27.
  fits:(t,style)=>t.accessory!==4&&!style.bun&&style.top>=36,
  css:'@keyframes fa-sway{0%,100%{transform:rotate(-7deg)}50%{transform:rotate(9deg)}}'+eggAnim('.fa-sway','fa-sway 2.6s ease-in-out infinite'),
  draw:({hc,style})=>{const k=Math.min(1,eggR2((style.top+10-27)/30));return eggAt(`translate(130 ${style.top+10}) scale(${k})`,'fa-sway',line(AHOGE,INK,9)+line(AHOGE,hc,4.6)+`<circle cx="0" cy="4" r="4.6" fill="${hc}"/>`);}},
 {id:'clouds',name:'云朵慢游',en:'Drifting clouds',slot:'bg',loop:12,
  css:'@keyframes fa-drift{0%,100%{transform:translate(0px,0px)}50%{transform:translate(16px,2px)}}'+eggAnim('.fa-drift','fa-drift 12s ease-in-out infinite')+'.fa-drift2{animation-direction:reverse}',
  draw:()=>{const cloud=`<path d="${CLOUD}" fill="#FFFFFF" fill-opacity=".72"/>`;return eggAt('translate(44 46) scale(1.5)','fa-drift',cloud)+eggAt('translate(214 30) scale(1.15)','fa-drift fa-drift2',cloud)+eggAt('translate(228 118) scale(.9)','fa-drift',cloud);}},
 {id:'tophat',name:'迷你礼帽',en:'Tiny top hat',slot:'head',loop:2.2,
  fits:t=>t.accessory!==3&&t.accessory!==4,
  css:'@keyframes fa-wob{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(7deg)}}'+eggAnim('.fa-wob','fa-wob 2.2s ease-in-out infinite'),
  draw:({p,style})=>{const k=Math.min(1.5,eggR2((style.top+16-29)/19)),dark=mix(p.shirt,'#000000',.45);
   return eggAt(`translate(164 ${style.top+16}) rotate(18) scale(${k})`,'fa-wob',eggPath('M-8 0L-7 -16C-7 -19 7 -19 7 -16L8 0Z',dark,2.8)+`<path d="M-7.6 -6L7.6 -6L7.9 -1.5L-7.9 -1.5Z" fill="${p.accent}"/>`+eggPath('M-14 0C-14 -3.5 14 -3.5 14 0C14 3.5 -14 3.5 -14 0Z',dark,2.8));}},
 {id:'hearts',name:'冒爱心',en:'Floating hearts',slot:'over',loop:3.4,
  css:'@keyframes fa-rise{0%{transform:translate(0px,0px) scale(.7);opacity:0}15%{opacity:1}70%{opacity:1}100%{transform:translate(4px,-40px) scale(1.1);opacity:0}}'+eggAnim('.fa-rise','fa-rise 3.4s ease-out infinite',-1.4)+`.fa-rise2{${eggDelay(-2.6)}}`,
  draw:()=>eggAt('translate(222 150) scale(1.6)','fa-rise',eggPath(HEART,'#E88F7A',2))+eggAt('translate(36 172) scale(1.25)','fa-rise fa-rise2',eggPath(HEART,'#E88F7A',2.2))},
 // Hip-hop: a firm nod with a short snap at 100 bpm, thumping cups, equaliser bars and a chain.
 // Replaces the plain headphones accessory (same band, bigger cups); skipped under a beanie.
 {id:'hiphop',name:'嘻哈节拍',en:'Hip-hop beat',slot:'head',loop:2.4,
  fits:t=>t.accessory!==4,
  css:'@keyframes fa-nod{0%,100%{translate:0px 0px}12%{translate:0px 4px}30%{translate:0px 0px}}'+headAnim('hiphop','fa-nod .6s cubic-bezier(.2,.9,.3,1) infinite')+
   '@keyframes fa-thump{0%,100%{transform:scale(1)}12%{transform:scale(1.1)}35%{transform:scale(1)}}'+eggAnim('.fa-thump','fa-thump .6s ease-out infinite')+
   '@keyframes fa-eq{0%,100%{transform:scaleY(.35)}12%{transform:scaleY(1)}45%{transform:scaleY(.55)}}'+eggAnim('.fa-eq','fa-eq .6s ease-out infinite')+`.fa-eq2{${eggDelay(-.15)}}.fa-eq3{${eggDelay(-.3)}}`,
  still:stillHead,
  draw:({p,t,style,w})=>{
   const dark=mix(INK,'#000000',.15),gold='#D2A25C',band=v4PhoneBand(style);
   const ring='<rect x="-6.5" y="-14" width="13" height="28" rx="6.5" fill="none" stroke="'+gold+'" stroke-width="2.6"/>';
   const bar=(x,y,h,k)=>eggAt(`translate(${x} ${y})`,'fa-eq'+(k?' fa-eq'+k:''),`<rect x="-3.2" y="${-h}" width="6.4" height="${h}" rx="2" fill="${p.accent}" stroke="${INK}" stroke-width="2.2"/>`);
   return {
    head:line(band,INK,11)+line(band,dark,6)+CUPS.map(x=>musicCup(x,'fa-thump',dark,w,ring)).join(''),
    // The chain is dropped when a scarf already wraps the neck.
    neck:t.accessory===5?'':line('M104 196C112 214 144 214 152 196',INK,6.4)+`<path d="M104 196C112 214 144 214 152 196" fill="none" stroke="${gold}" stroke-width="3.4" stroke-dasharray="4.5 2.5" stroke-linecap="round"/>`,
    over:bar(214,62,16,0)+bar(224,62,28,2)+bar(234,62,20,3)+bar(22,68,20,3)+bar(32,68,28,2)+bar(42,68,16,0)};}},
 // Pop: a light side-to-side sway about the chin, bouncing pastel cups with a sparkle, notes in arcs.
 {id:'pop',name:'流行小调',en:'Pop tune',slot:'head',loop:2,
  fits:t=>t.accessory!==4,
  // Rotating about the chin (128,182) with translate compensating, so the neck joint stays put.
  css:'@keyframes fa-groove{0%,50%,100%{rotate:0deg;translate:0px 0px}25%{rotate:3deg;translate:9.7px -6.45px}75%{rotate:-3deg;translate:-9.35px 6.95px}}'+headAnim('pop','fa-groove 2s ease-in-out infinite')+
   '@keyframes fa-bounce{0%,100%{transform:scale(1)}20%{transform:scale(1.06)}}'+eggAnim('.fa-bounce','fa-bounce .5s ease-out infinite')+
   '@keyframes fa-float{0%{transform:translate(0px,0px) rotate(-8deg) scale(.7);opacity:0}15%{opacity:1}50%{transform:translate(8px,-18px) rotate(8deg) scale(1)}100%{transform:translate(-2px,-38px) rotate(-6deg) scale(1);opacity:0}}'+
   '@keyframes fa-float2{0%{transform:translate(0px,0px) rotate(8deg) scale(.7);opacity:0}15%{opacity:1}50%{transform:translate(-8px,-18px) rotate(-8deg) scale(1)}100%{transform:translate(2px,-38px) rotate(6deg) scale(1);opacity:0}}'+
   eggAnim('.fa-float','fa-float 2s ease-in-out infinite',-.6)+eggAnim('.fa-float2','fa-float2 2s ease-in-out infinite',-1.4)+`.fa-float3{${eggDelay(-1.6)}}`,
  still:stillHead,
  draw:({p,style,w})=>{
   const soft=mix(p.accent,'#FFFFFF',.35),band=v4PhoneBand(style);
   const sparkle=`<path d="${STAR4(6)}" fill="#FFFFFF"/>`;
   return {
    head:line(band,INK,10)+line(band,soft,5)+CUPS.map(x=>musicCup(x,'fa-bounce',soft,w,sparkle)).join(''),
    over:eggAt('translate(222 110) scale(1.4)','fa-float',NOTE1)+eggAt('translate(24 116) scale(1.4)','fa-float2',NOTE2)+eggAt('translate(230 160) scale(1.1)','fa-float fa-float3',NOTE2)};}},
];
// Each egg owns an equal slice of the seed space. The first eight keep the draw they were
// released with (a second random pick among them); eggs added later take new slices above it,
// so a seed that already showed an egg keeps it.
const EGG_SLICE=0.0125,FIRST_EGGS=8;
const V4_EGG_RATE=Math.round(V4_EGGS.length*EGG_SLICE*1e6)/1e6;
function v4EggIndex(seed){
 const random=seededRng('egg:',String(seed)),r=random();
 if(r<FIRST_EGGS*EGG_SLICE)return Math.floor(random()*FIRST_EGGS);
 const i=Math.floor(r/EGG_SLICE);return i<V4_EGGS.length?i:-1;
}
// An egg that does not fit the final traits (a cowlick under a beanie) yields to the next one.
// `clash` lets a render version rule out eggs for parts only it has.
function v4PickEgg(index,t,style,clash){
 if(!(index>=0))return null;
 for(let k=0;k<V4_EGGS.length;k++){const e=V4_EGGS[(index+k)%V4_EGGS.length];if((!e.fits||e.fits(t,style))&&!(clash&&clash(e)))return e;}
 return null;
}
// `force` names an egg id to draw regardless of the seed (previews, tests).
function v4ResolveEgg(seed,t,style,force,clash){const i=V4_EGGS.findIndex(x=>x.id===force);return v4PickEgg(i>=0?i:v4EggIndex(seed),t,style,clash);}
// animate=false keeps the decoration but drops every animation: the still pose that reduced motion
// shows (a wink instead of a blink), for hosts whose own motion setting cannot reach inside an <img>.
function v4EggMarkup(egg,ctx,animate=true){
 const out={defs:'',bg:'',neck:'',face:'',head:'',over:''};
 if(!egg)return out;
 const stillCss=(egg.still||'').replace(stillHead,'');
 out.defs=animate?`<style>.fa-m{transform-box:view-box;transform-origin:0 0}${egg.css}@media (prefers-reduced-motion:reduce){.fa-m{animation:none!important}${egg.still||''}}</style>`:stillCss?`<style>${stillCss}</style>`:'';
 const drawn=egg.draw(ctx),parts=typeof drawn==='string'?{[egg.slot]:drawn}:drawn;
 for(const [slot,markup] of Object.entries(parts))if(markup)out[slot]=`<g data-egg="${egg.id}">${markup}</g>`;
 return out;
}
// One still frame of an animated avatar at `seconds` into its loop: every animation is paused and
// its clock offset through --fa-t. SVGs without egg styles come back unchanged.
function v4FreezeFrame(svg,seconds){
 const t=Number.isFinite(seconds)?Math.round(seconds*1000)/1000:0;
 return String(svg).replace('<style>',`<style>svg{--fa-t:${t}s}svg *{animation-play-state:paused!important}`);
}

// v4 renderer: assembles layers back to front. Seed is only hashed; no input reaches the markup.
// 1.15x about (128,182): head fills ~55% of the tile width and sits higher.
const HEAD='matrix(1.15 0 0 1.15 -19.2 -27.3)';
const V4_OPTIONS=Object.freeze({palette:V4_PALETTES.length,skin:V4_SKINS.length,hairColor:V4_HAIR.length,hair:V4_HAIRSTYLES.length,eyes:V4_EYES.length,brows:V4_BROWS.length,mouth:V4_MOUTHS.length,outfit:V4_OUTFITS.length,accessory:V4_ACCESSORIES.length});
const V4_COMBINATIONS=Object.values(V4_OPTIONS).reduce((a,b)=>a*b,1);
function getTraitsV4(seed='fuli',overrides={}){const random=v4Rng(String(seed)),o=overrides&&typeof overrides==='object'?overrides:{};return Object.fromEntries(Object.entries(V4_OPTIONS).map(([key,count])=>{const value=o[key],sample=Math.floor(random()*count);return[key,Number.isInteger(value)&&value>=0&&value<count?value:sample];}));}
// The easter egg { eggs: true } would draw for this seed and traits, or null.
function getEggV4(seed='fuli',overrides={}){const t=getTraitsV4(seed,overrides);return v4ResolveEgg(seed,t,V4_HAIRSTYLES[t.hair]);}
function createAvatarV4(seed='fuli',config={}){
 const c=config&&typeof config==='object'?config:{},t=getTraitsV4(seed,c.traits);
 return composeAvatar(seed,c,t,{id:'v4',palette:V4_PALETTES[t.palette],outfit:V4_OUTFITS[t.outfit].draw,accessory:v4Accessory});
}
// Layer assembly shared by render versions 4 and 5. `look` supplies the version's clip id, colours
// ({ bg, shirt, accent }), garment detail drawer and accessory drawer, plus optional eggClash and
// mark (v5); everything else is common, so v4 output stays byte-identical.
function composeAvatar(seed,c,t,look){
 const size=Number.isInteger(c.size)&&c.size>=16&&c.size<=4096?c.size:256;
 // Level of detail: 0 full, 1 medium (≤96 px), 2 icon (≤48 px). Fine lines drop out as size shrinks.
 const lod=size<=48?2:size<=96?1:0,w=pen(lod);
 const p=look.palette,skin=V4_SKINS[t.skin],hc=V4_HAIR[t.hairColor].base,style=V4_HAIRSTYLES[t.hair];
 const light=t.hairColor>=4,beanie=t.accessory===4;
 const rounded=c.rounded!==false,rx=rounded?36:0;
 // Eggs are opt-in: without `eggs: true` or a known `egg` id every slot is empty and output is unchanged.
 const wantsEgg=c.eggs===true||V4_EGGS.some(e=>e.id===c.egg);
 const egg=v4EggMarkup(wantsEgg?v4ResolveEgg(seed,t,style,c.egg,look.eggClash):null,{p,skin,hc,style,t,w},c.animate!==false);
 const mark=look.mark?look.mark(lod):{frame:'',chest:'',lens:''};
 const strand=mix(hc,light?'#5A4630':'#FFFFFF',light?.35:.16),shine=mix(hc,'#FFFFFF',light?.6:.38);
 let s=`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 256 256" role="img" aria-label="Generated FULI avatar">`;
 s+=`<defs><clipPath id="fuli-avatar-${look.id}-${rounded?'r':'s'}"><rect width="256" height="256" rx="${rx}"/></clipPath>${egg.defs}</defs>`;
 s+=`<rect width="256" height="256" rx="${rx}" fill="${c.transparent?'none':p.bg}"/>`;
 s+=`<g data-part="portrait" clip-path="url(#fuli-avatar-${look.id}-${rounded?'r':'s'})">`+egg.bg+mark.frame;
 const hairShape=d=>shape(d,hc,INK,w);
 // Head, hair and head-worn pieces share one frame scaled about the chin so the neck joint stays put.
 const head=`<g data-part="head" transform="${HEAD}">`;
 let back='';
 if(!beanie)back+=hairShape(style.tufts);
 if(style.bun&&!beanie)back+=hairShape(style.bun)+(lod<2?line(style.bunShine,shine,3,' opacity=".8"'):'');
 back+=hairShape(style.back);
 s+=head+'<g data-part="hair-back">'+back+'</g></g>';
 s+='<g data-part="neck">'+shape(V4_NECK,skin,INK,w)+shape('M110 180C118 190 138 190 146 180L146 190C138 196 118 196 110 190Z',mix(skin,'#9A5A44',.22),'none')+'</g>';
 s+=`<g data-part="outfit" data-style="${t.outfit}">`+shape(V4_BODY,p.shirt,INK,w)+(lod<2?line(V4_FOLDS,mix(p.shirt,'#000000',.3),2.6):'')+look.outfit(p,w,lod)+'</g>'+mark.chest;
 const acc=look.accessory(t,p,style,w,lod);
 s+=acc.neck+egg.neck+head;
 if(style.ears)s+='<g data-part="ears">'+v4Ears(skin,lod,w)+'</g>';
 s+='<g data-part="face">'+shape(V4_FACE,skin,INK,w)+v4Features(t,skin,lod,false)+'</g>'+egg.face;
 let front=lod<2?shape(style.locks,hc,INK,w*.8):'';
 front+=hairShape(style.fringe);
 if(lod<2&&!beanie)front+=line(style.strands,strand,lod===0?2.6:3);
 if(!beanie)front+=line(style.shine,shine,lod===0?5:lod===1?6:7,' opacity=".75"');
 s+='<g data-part="hair-front">'+front+'</g>';
 s+=acc.front+mark.lens+egg.head+'</g>';
 return s+egg.over+'</g></svg>';
}

// v5 garment colours: soft, friendly tones that sit with the v4 backgrounds, never neon.
const V5_CLOTH=[
 {name:'苔绿',hex:'#3F6B4E'},
 {name:'赤陶',hex:'#B5603F'},
 {name:'莓紫',hex:'#6E4F68'},
 {name:'海蓝',hex:'#3E6E80'},
 {name:'麦黄',hex:'#B88D3E'},
 {name:'雾灰',hex:'#55666A'},
 {name:'奶白',hex:'#EDE6D8'},
 {name:'墨蓝',hex:'#2F3E57'},
 {name:'樱粉',hex:'#D8958C'},
 {name:'薄荷',hex:'#86B19C'},
 {name:'杏橙',hex:'#D98E4F'},
 {name:'丁香',hex:'#9D8DBA'},
 {name:'砖红',hex:'#993F37'},
 {name:'燕麦',hex:'#C8B596'},
];
// Curated [main, accent] pairs: a neutral with one pop colour, analogous neighbours, or soft
// complements. Random characters draw from these; the studio can still pick any two.
const V5_COMBOS=[
 [0,10],[0,6],[0,4],[1,3],[1,6],[1,13],[2,4],[2,8],[2,6],[3,10],[3,6],[3,9],
 [4,7],[4,0],[5,10],[5,8],[5,9],[6,7],[6,12],[6,0],[7,4],[7,8],[7,6],[8,7],
 [8,6],[9,7],[9,6],[10,7],[11,4],[11,6],[12,13],[12,6],[13,0],[13,12],
];

// v5 garment details: the v4 cuts, with the accent colour on collars, trims, linings and pockets.
const crew5='M106 189C114 206 142 206 150 189';
const rib5='M104 188C112 210 144 210 152 188L146 186C140 200 116 200 110 186Z';
const dot5=(x,y,r,fill)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
const V5_OUTFITS=[
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

// v5 sunglasses: dark tinted lenses with a small glint, worn like the v4 glasses (front layer, head
// frame, lenses centred on the eyes at x 106 / 150, y 130).
const V5_SUNGLASSES=['方框墨镜','圆框墨镜'];
const TINT='#2B3440';
const shadeGlint=(x,lod)=>lod<2?line(`M${x-9} 127L${x-5} 123`,'#FFFFFF',2.2,' opacity=".7"'):'';
// Wayfarer-style: a trapezoid lens under a thick top bar.
const wayLens=x=>`<path d="M${x-17} 119L${x+17} 119L${x+14} 139C${x+13} 142 ${x+10} 143 ${x+7} 143L${x-8} 143C${x-12} 143 ${x-14} 141 ${x-15} 138Z" fill="${TINT}" fill-opacity=".92" stroke="${INK}" stroke-width="3.4" stroke-linejoin="round"/>`+line(`M${x-18} 119H${x+18}`,INK,6.4);
const roundLens=x=>`<circle cx="${x}" cy="130" r="15" fill="${TINT}" fill-opacity=".92" stroke="${INK}" stroke-width="3.6"/>`;
function v5Sunglasses(index,lod){
 if(index===0)return '<g data-part="sunglasses" data-style="0">'+wayLens(106)+wayLens(150)+line('M123 122C126 119 130 119 133 122M89 121L70 118M167 121L186 118',INK,3.4)+shadeGlint(106,lod)+shadeGlint(150,lod)+'</g>';
 return '<g data-part="sunglasses" data-style="1">'+roundLens(106)+roundLens(150)+line('M121 128C125 124 131 124 135 128M91 126L70 122M165 126L186 122',INK,3.4)+shadeGlint(106,lod)+shadeGlint(150,lod)+'</g>';
}

// The rare mask is Jevons' own cat drawing (his avatar): the whole cat, head and body, cut from the
// original at 160 x 141 px with a transparent background and embedded as a PNG data URL.
// Generated from the cut-out; do not edit by hand.
const RARE_CAT_PNG='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACNCAYAAAAw/XHFAACO5klEQVR42ux9d3TUd3b9/pFssnuS/JLfbnZdAGN6sY0rGGwM7hh7jY0RNsY2NsU2ptj03qsoQhIIhApqqI26Rr3XURn1Ue/SqEtIFEkggXN/577vzCCB2LUDu8kvsc6Zoz7SzNzve+/ed9/7/OpXv7z9xbe09PRh9fX66QUFOrNfno1f3v4mb+dsbadv37lLNXP2a6rZr7+pWbJ0uf7LpcsxbcbLqv3791uUlpZO/+VZ+uXtgb/5BwSum/Xa63j0scfx7w8PG/I24vExmPzUM7A+fUafk5v3CxB/efvpb7qC/OmhoaFmR44eNTtjc9bC/Nhx1bbtO1TLv/5W89Y772LshMmDwPaHR4bfBcA/8P1Dj+LREY9j7p/mwdHRUaXNyvoFiL+83X7rbKsfFhIaanb23DkLF1dXLPlqKcw++RTPvjANw0eOFvA89OiIu8D1x0eHS/T7/UOPyufG94N/ZvDvPTLiccx+/U3ExcVrujov/QLE/01vGk2qmaWV1bply79WvTVnrmbBwkV4570/YeITU/DYqLESwZgyCay7ItkjwzF6/ET88ZHhArT5H32I1MQw5GclIiMzE42NTSgu0sHPzwdz3nnHlJYHgpL3YQTksJGjsPzrb2FxyhInLU5pnF1cVFbWp1Xbtm1dZ37M3GLV6jVmHh4eZgGBAWaxcbFm+fkFZuUVFdPLy8t/ITf/v70FBgaa7dq9R/Xl0mWY/tIreHjYY0NGK6ZLRroRo8Zg5JhxeOHFGZg5+zXMeu0NLP78MwT5e2LRok/w0cJPkJIQjraGEnQ0lePWrR/R39+Pvhs96L7agdysVOzZs1NA/errr2OB2QKMHT9xEAB5e+aFaZj+8iyMGT8Jzzw/FROfeAoTn5yC8ZOelM/fe/8DvP/BfHwwfwG++PIrmH2ySL90+QosX/G16sTJEypvlY9Zg75+2C+v8H/Tt+qa2umbt2zVP/n0s/KCD5VGjTd+7+2578HTyxtNTc3o7e3GzZu3cPPmTdy6dQuX2+vQ3liGKx0NuHHjhnzcWl+Iyx169PX14sb1a+i9dgk9V9vRfbkVVy41IiM1GvVVBbjUXInaijwcPLBbUvC9/gdjDTlULTkojQ8fqdSWDw/De/M+0McnJK775dX+b/QWn5Aw7LvVa1ULPl6EPzwyDP/4m9/i17/+B/zfPzx814v54kszsX3nLqSkpKK7uwe3BHS3BHQEHyNbf991dDSVobOlEpdaKnGzvx/tjaVy6+3uwvWeK7jec1mA132lTQHhlTYB56WWKsPPlqG9sRynrY79WdY81I1R00hmhqo3SYb27d+vUqvVv9SU/9Vv5uZHhy1dvkLzxwFRhOD7u7/7O/z2n/5ZXjiSihkvz4LjBUdcvdYtqfPmzX5JpbcEfD8K+G7295kASeARSB3NFabPO1urcb37Mnq7OwV0PZcb0Xu1Bd1XWnGtq1m+drWzUdK0AsBStDcUY9r06QIq/o+Mdg8NGyER+JERIzF2wiSpNZmOn3rmObwyexbenvM2tm3diF3bN2LNmpVY8uXneO+9dzB2/Hg898ILch+Miu/+aR78/X1+qRH/q968vL3XTZsxU17cgRHin/75/wgAFRD+E87Y2KCjvR0//vgfcuvvv4H+vhsCRKnn+m4oIOzvMwDzFvpuXMe1rhb0XLskP993vVs+ZqRj5Ou52mGIgK3oIQA7mwSE1zob5We62uskjXe01KC9qQJlhVoU5KSjIC8DjfWVaNTXoLWpDpcvNeP69R50X2nH5Xa9gLejuRKtjQYQN5WjrlyLsvwE6NKC4O1iie0bV2Lai9OEPD0+djxZvF6TEvcLEH8+WQg2sz1vZ3bU/JjFh/PnmwWHhOD0mTNmScnJZmXlFWZdl1rvWXCHhYZajBw9zkQmBtZRzz47BWNGjTCBcNTo0UhNTTUBkLe+vuvo7++Tj43gk+jX3y83gvJG71X5ueu9VwQg3ZdbFNCx5uvQK4Drapaod62rSd4bgUlAXr3UID/H91c79PL71y63oqu9AVcuNSnAN6R/ITTXutDaUA59VR6qi1JRW5qJlvoStNTp0FyrQ1NtAUpzYpAR7YoE9XlYHV6PN16bKSSLdW96ahwfj+akhYWZl7fqF0AO9ebgeMHsq+Ur9NNmvIyHh4/EsMdGDapxWN9MelKRScZNfAJTp8/AshXfYN+Bg6qmpiZVf3+/PjIqCk9MUYjG6HET8MqsV/D1sk9heXQL1CoblOXGoLooEYs/nod/+Zd/FhD+87/8C+bNm4e4uDhcu9YtJOJG7zWJbEy/BBuB02uIcgTTpZYadDRX43J7PbraanCpuQJXO5twvecqLrfVKOAS8DXj2uUW9F7rlM/5M0YAEphdbXXoaq9Hc10JmmoK5H75twk8U1S+eRM93VeEaRdnRaAwMxTlebGoLU1HbVkmOpqrcLWrTaJkc10hUsIckBh0FkkhdohTO8N8/yZs2rAaJUW5+MjMDCNHj8XzU1/E19+uxN59+1WHjhxdl5yS+r+7Zjx33s6MHQWphf4MM7yTFfJnR42dgHXr1yMhIQFPP/cCnp82Dd98swwqdztkJIehIj8KlQWRqNbFS6Rg+kqP8cAPXy/EP//Tb0zRcMSIESKteLjZQ6uJw9WuVolEkjZbawQ0bY2VSEuOwpIln+Pbr5eivblagNFSV4DO1hqJhiQorfVFSspsqUVHa50CSEbGziZhzwQjiUlLXRFaG0pRX5EtkUz5m9cHAZB1Zk/PNbToS1CaE4XcZD+U5kSjrixToiJB3CNRuFmIUHVxGlLDHJCnUaNEG4FKXSKykoNRUZSOEF9HzP9grojqo8aOF4mJIvv8BQv1e/cfWBcXn/C/E4ivvv7mnwUdn7B7dRR4m/ve+9BmalBdmICGikw01+RJemqsKcSOzavw/TcL8fQzT8vVP3b8BLz26svYunYxYvzPYP3Kj00gHHj7x9/8Bn/84x8xatQojBk9GsOGPYrf/va3pu+T0GSlhIgE01ybL3/PGPXaGorQWqfDsEcfxr/+67+iqiwf5XlxyEsJQKu+TIBaW1mAnCRf1JWlo64sA1VFGmHH1y63S+o3AvB6bw9a6ouRnxKEmdOfw+QJo5Aa5YGa4lSRePg7nW11El15sZCJX+XXmyrR0daChup8VBUloyQnFrlJvijNjUWgj5tkkYHPpfFiphLg5Oz6vweIiz77QmOMbKzdvlq2AhaWVnBydoHbRQ8+GXBwdIKl9WmcsDiFLVu3yPfXfv+D/M7wx0cjTO2LjsZStNTlo74sDcW5ifhu5TK8PHMGRowciSefnIRHho/AiJGjpC6aMPkJecJnz34ZlofW4uLpTdi46jNMe3YSfv9//w2//vWvhwSlArxfY9KkiTi8f7tEvtZ6HVpq8tBQkSFgvNalsN1mfbkJsNu3/IDE4LOI87dGsvocMqLdUF2cLvVcTYlGPq4qTEVOsh+yk3yhr8hCY2WegNLP0w7ffLkQv/u3fzH9Dzbmm1CWE4XCDDXqyzLQ0VCBzrZaYeGsGRkRr3Y2o6IgCUVZ0chO8EFhRihykv2RleAFXWY47K0P4KkpU0SeuvOCfmvOXHy8aLEqMDDwfzYQc7Mzh42deLuRb+/gaJA+FMlDIQVK8W+SRchI+/tRXVWB1998C55eXmiqzkJzbR4aytKQkxyKMeMnmJ7YgXrZUF2Pd956GXvWL4E21h2xfpZI8j8FF5u9+PTjeZg543lMf3Eqnn/uGbw040V8tngh1EF+uNJRL3oghWVKMJ3Nlagr1chF0NlahRZDRJw0cZwJNDs3LoMm3AExftYCRm2cBwq10SjURqKiIBG5ST5Ij3RCnJ8lwrxPw+HsMUwa//jgqPyP/4BZL0+FNsYNpdnhyEtWIT/FB1UF8WipLZDoS0LDCMjak1+r1CWjpiQd9ZX5yNMEIzclEBkxF6FLC0ZavD+enPLMkM8Lb2+8NQd79++3+B8LQNYdAx/wOVtbk/ArnYcBQDTqcZRDWCex3uH7y+21qC1OQmVBFBIjvfHs889JxJs69VlsX7cQG7+bj++WzcOKL+dh7juz8eqsFzF58sRBtebv/vgIvv5iHsIvHkS06jgSA62QFW2PmqIE0fuY3pQOSCla9UVSRxKAt9+XQF+ebgIeI2F7QwncHU5gwrgxJgA98sffYf67s/HVonew4btPsWP9MhzcsxlbN3yHz83ewhszn8X4MSPxd3//94OA97vf/R5r13wHTXIs9FX5qCxMRbE2HDmJ3kiPuIC8+IsoyQxGlS5BUjIlnM7WWvRcvYTaknTUlGaiQBOM7ESVRMKsBG9kJfgiM+YiAtwssOrbr+7ZdeHXlyxdjl179lr8+ON//M+KiNt27FINfLCLFn8u2pqxBlKA2K90IiiP9F1H341ek/bGeqeuJBXlOaGoLYrG8qWLJfK9MXsaLliuwu6NizDy8ZFK5+OhRwRoY8eNwZQpk0SCUZ7gYSIAjxk3FquWzUeY+2HE+hxHYsAplGWFoU1fKAAkESH4mObJeptqctFQmWWq/+pKkoR8MC236YsFnPkpvrCz2otHHvr3e6b0e93+/u//HqNHj8Lq1auxZ89uODrYwdLKEvsPHsKRI4eh8nJFTKgXshJ8oEtXI1V9VgBYmB6MphqdkJuOpkpcaq1FTUkaCjPDkJsSIHVnfqo/8lIDkRnjjpRQeySoHfDunNeHNF+Y+tXPT8W2HTv1+QX5/3Pafa/Mfm0QAEeMGovKqmrcZCfi1i2DKNwrmhvfy+d91yUSsuXVVJ2NUm0w6kqSEaBywmOjaJkaCYt9X6GrpRQNDXq0t3egrLwcu/fuF3nnXr69Z5+ZjEmTJ2LH958hJeQ8koKtkRHtJJGPMsr13quKlHKpQboeTL0EYktNvhCfhkqtfNxYnQN9eRpKtKFIDLZBUvBZxPpbwvrwOnzy0RwMf/SP+O1vfjMIbP/wD/+A3//+93j1tVexevVK+Hm7wUflgc2bNmDyU0/fRbyMvWw+nieffgbbtm5ApI81MqKckRxsg7QIR5TlxaJCl4TG6jzUlWeJhEMSpI3zlMiXk+gjgMyIvijSTVyQHXat+xwn9q3F3s1f4c3ZUwd7GQ230eMmSq989Zq1+uVff6OKio5Stbe3//8ZGd98+x3VnYA4fvKk0gq7pYi/fdd7TFGPzX5jNLzSXg99eSbykzxRkRuFTRvXSDR75+1X0Xu5dpC4bJQzPv18idLAHyLdvDjtaVgdXoe33piF4IsnEB9gjcxoF1y51IAb17vlxpYaZRSyT6Y4gpN1oES+2nxJw3VlaWiqykFRhhoxvhaI8T0pUSY92g0JAaeRGGwL9cWjsD+yGk6WW5AY7Y+SfA06WutFR6wsL8LSZculTXhnbcZIrXgJR962dRkey6xZL8PT8RiiPA8jzk/5u4xyZL+1JWmoKkpBsTZCas2CtGBkxnogSW2L1HBHASTr3xifEwh22o0IzyPwtduGYT+hV02n0IcLzETOef3Nt8XWtnT51yLtvPr6myq+xhs2bVEdOHRY9cP69euOHjtmxqbCfw8AzpmruvMBzV+w0NB56BNRmOCTRn/vVQEBuwE5SX7obKkSaYMRxsPxOMZPGC+/7+Nucxf4jLf1Gzb+GWeJYs0aNWYMTuz+RurBZLWt1FT8HygQM+Vfaq6SYp8CdGdzheiAbQ3FwoKZlvWVmZKScxK9UJQZjux4L8T6nUSsvzWCLuyTqJMQdBbZiX5Sj/Hx1JRm4EpXC9RqNaY8+8LPMigMvBG0R3esQKjrXgGhJuICGmsKUF2SKWw4XwAZgwINU7EPorxPICn4HOICrBHivBdql32IcD+EYKc9OH98vZQsvP05x85PvRlJ4KOPjZKIPmHyk2JxW/HNSny+5EuNnZ296m8OwJl3pOA/GFwpSgT80URGKC0QhJQWEgJPI87fCqmhdsIkc5NUsDq+W9IvI0R1ng/6rl+5C3x1dfV4buqL93yCZr/yoqTv4SOVFzFadRKxvpYCQGnH3bolF4S03dgRudQgEbCrtVp0R315Bhors6CvyERZTiQyY9ykNov3t4bvuU0IdT2IcHdzpIbZIz3SWaQYpr/qwhTcuNGL4uJCSbf3evF4gYweOwaTJk8QE+u9HseUKZNhc3StsGltrIdcpCQh1cUalGRFoiA9BPmpTL0u0i1JCLRBlNcxiXoRHocRdvGgANDvwgHMffsVjBk37q7/heB7fMxYjB47DqPGjMOwx0aa6kcj0O7FrIcCpfHiofxz8NAhvZ+fr0V5edlfN633XG2fvnXbVv2dV9Xbc99V+q03bqCnh/66XkNbrF9qsVhfC6RFOiFZbSNPZG6iO44e3IjpL7+C2bOm49qlcnQ1ZYl8033tGjo7O1FVVY2XZ7064O8MG6R/8Yqc/6eZ+ODdWZg0eRLOHd+ASK/jiPQwR3d7q4kQ8UJg9JO2nPRvW9DRVCGslxGwTV+Ehgot2hrKUKFLRnLoBQRd2AVP6x/gYfUDQlz2QhPpgsKMMDTXFSE17AJa9OVo0Nfi408XD2n1f/utV3Dy+D7kp7ghPfwIIr13w8XuMF556fkhNTxJi88/hXi/UyjNS0RRZpjUgflpahRnxwiD5teYinOTAxDjcwo+ZzciyHEX/M9vFpmoPC9B/reEIBvYntqNGS8+h8lPTMITT0zEh++/BUernYhRnUBxZhjSo9wQ6X0Sni42+G7ZIny26CO8/darmDnzZUx68im5qB8dMfJnWc7GTZyM71atgY+Pt6aktPyvZ7RduGjxXSl43ofz8dkXX4oNif1gCtIEAFNg99VLaGssR1qkM2L8LJEV7478WCuYH9yEp56egsQgc2jCT+HNV6dj8edf4Kmnn8bjY8YN2T258/b5ovewYunHGDlqNI7vWSl1GxkmQddvMChQ6GX/lxcCP+691iZglOh8SS9pmcw4L9kf5flJSFafR4D9dqhdDyL4wm6Euu6TtJcYeBb1FTloqC5Cc10xvlu1apBJllFnw+qFyEmwRUX6OTic3iHWrYeMfsAhbkoJclvzXLJ4HvI0QdBX5qK6OFWYMAXv8vwEqQGz4r1FD9REOCmZJNkPJdmRyEvxl+iZGmovdXBi4Gn5fxODbBDtY4H81CCEuO5HtPcxRHsfR3FGOFr0lciMUSHs4hEkBp9HtMoKKeEu0GVEIDLQBbbWR/Hdik/x6aKP8OKL00SnfeQvgNLYAWNJtnnrNs2WrVsffN342RdL7gLgwPTCf+L0mbO40duNIm2EMLe6ihzRtAIddkh6qc71gpvtLpjv+hKdFV74ZvkiU5T7KVecsZb5eulHWLdqMV6Y+iw87Q8iwsMcKWHOuN7dZapFjaUA3zMqk4kbHdA0LDAlV+UnSIqN9TmFUNf9CLt4CEEXdsv/G+KyD/EBZ5AS6ojsJD+U5yeitKRQDBbG/4fM1vHsHnRWq9HTUYDeK4241NaIzEwtdu7afU8AvjTjBSxa+J7p8Tw8bAQ2r/0SpdlRqCnWoLJQgyp2XorTUKSNRL4mSIhIepQr8lKDoI1XIS8lEPGBZyS6MR1HeZkj0vMoIjyOICXEHpoIZ0R6HkP4xUMC2NxkfylVIjzNkRHlKd9TOx9GiMtRRKsskZMchJzkEHmcaREuiPG1hs+FEzhvfQDHzA9iypQnpbTghTXwArwzfROIzHAbN215sCD8/of1qnuG4keGC5u6cf06SrKj5GokU+OtsiAJIa4HkZPgiu9XLcXjY0bDyvx7dDfFYMKkiUMWyQNt7g8Pf+yuv7dv+woc2bUc78+bh9igCyjOTkB5bpy4YQiyfpF+rhgI0RWD+1n5nAAkGy7Q+CM13AHR3uZCYtj5iPQ6gUivowj3OCyRO9rXCpGe5tBp/JAWcQGfL/liwKTcSFgc3YgrlW7o7+u5q46tqakd0s1tvK1e/iG87TZg1svPmV7IC+eOQpcegqLMUBRnRwv5YGsuK85dAKSN95IoGO9vJZGPgAp3Pyyfx/pbwM92swCQdXeo6wGEuh1AUtBZJAafE1Yf4rwb/ue3yIV18dQPcLdcD/dT64Rw+Z3fiWCnfYgLPI/0aE+5X//z25CothOwJoc4Ikx1Fju+/xyfLTLD7Fkz8NwL0zBj5iuY9errgy5M3swWfqzX5Wc/mNrwxx//wyy/QDdkeuQLwUGcjo4OISNtjRUiFaSGOSLW10oiSIS7OexObpY6ieTj3PHVuKqPwviJE4asK4aecBuGCU88JR972W+Bw+md2L59Kwq1UfKCUcxV9MfrJh8gQccIeMMQAauLUpCf4o+ceHcpCbRxFxHnbymCNiMDowUjH2vBAPttSA6xQ2asu0SZ7PRYzH71NdP/c2Dnt5J2rY9tgI3NGZw8ZYlT0hd3hp2DIxYuWvxnC/pnnnkC7YVnUKe1wlef/Um+NuLx0bA4uhsFaSECRArRbPnx+SQRyor3QkaUC+L9LeWiIfEiUHjREHAEZFq0hzDoxEAbhLkdlAuIIGSa9rL+XsoMP5vN8Dq9Hl6nN8DPdisC7HfC7cQquJ9aC7XLQfm6k/m3CPc4gUCHnQh3P4JQ10MSSAIcdsPv/C74nN2KINej2LZts7jA76ptp03HqjVrzB4UANcVFhUNORfBCbHc3DyTKVSGgTr0aNOXICtOeTJ4hX77lZn8/KgxY+F1fh16mhPx8swXf5Y0sO/AQQQEBkFfEoa0aAckRgehLC8B8QE2QjCEAFESMoKPwOu9gq62ejTV5AspilIpUS7e/xRS1GdF/4v3Py0vJl9EvriR3sdEFkmLcBIAsJVmbW0lZgrpNDz7NNReFnh55kyp5X4Kixx8I9hGoVVniys1frA6tlXu44+PDMO4iZMQq3ZGZWEKakq1EnlZz/FCSAm1Q1qUC1JC7KTOi/E5ieQQW2jC7OXz9OiLSAqykY95UVJSivM9JVEx1ueElBpKrbsT3mc2QHVmvZAalc0GBDvth/fp9YjwOA4v6x9EY3Q78Z18LcztMIKdWepQuzyG4At7YXVwjfTf7/UYzT7+BJER4fcPwIbGxmHHjp/Q02B65x+ZPOUZFBYWDWrHiXeOGlt5hmhrjDjZCV547bVZIgEwAu7d8gUuN8TD3X7XT67/jCl588ZV6NInQpfshNrybKkzKwsSRIS+1FKNzpZqtOjLpJYic2SxzqufUktC4BnR3PgCMYIwZTHqMYqwKCcAowyRMMxtPwpSA9DZWieP69U33pJabeLkiTi8cxkeHz36P60BSpdi7Fi0FZ5FW8lFMU88/cwziAt1RUqMr/SEG6ryRBdMj3ZFfKC1SFqx/lamSEgfYZqQEk8pefhxdrynRGt+PzPKTXrlFKwlsjvvgdppD4Icd8P33GZ4Wn0PlxOrcWrXUpzavxobV3+Oj+e9jg/nvIQlH8/F1tUfw/P0Rvic3Qy1y37E+VojSmUJ+5Ob8af3//RnpxXpXTx67Pj9twELdLphO3bt1nBPyl1P4PiJiIyKHlT3MNW11udDX5EhjhMCj1ctn4inn34KL01X5Aj2eL9Z/glsTnyPzWsX/UUQihRjYJzhXvtQnGqPjCgnlBcki27WXJ2H6sJkibgJgWeRFHxexFoCThvtJaUAARYfcBpR3scQ62clBT31vmiVBWJ9LBDnfxphFw8jzHWfEJJgp11orMrH9Z5r0CRFiP3soUeHY9PaRTi6d6VEq/8s+KghvvnmbFwqdUB62BGRPvbtWoe6Mi3qyrPFh9hYUyQeyfqybHH/MC2TgPD/To9ylhZkioH9xvkSdB4S3RjRYyWqWwv7ZQRlRyeG9eLFQ7hgsQm7NizDp/PfwHtvz5TXZczYMXJxDRLKHxuJj96bDa+z2xGrspTnz/rwekyb9ufF9xkzZ2HlqjUWTU3N9y/JrP1hnQXt8nf+kd/94WH4BwTeVXjT+l6eGyb93sq8aLkaGW0YdRZ88DYevYNQEFiMivd0d9zRUx03biyWmL0Bv/PbEKuyQEV+vHjs2hpKpVhOCLBGjP85JIVcgKfVenif2w5P601QO+9HoP1WBDruRqDjXkPa2YrK/DR4WK2XuoYpKMBum3wvWnUCBRkR6L7ahfLsaHw8f64i6I4dj8byWGzb+sPPBh0jPx8va9w33p6Der0elxu1WPuNGT6Z/xraa1Nx5XI79NVFEnVb6otQX5knkbChMgflBQnSGSnOihKfImu7WJ+TEsnD3A4oLNggTpPZE4yRHkcQH2glLJo1pfPJNRg3fpzpuSfoHh0+Ao89fm+x/MiOVXA+vgbmO5abSONQrxHvb+v2HUhMTHwwxGPdho0WQ0U+3k5anEJvT++g3i21to6GEuk01JYkobY4EfkpfnKlUp9ytt6JqdOm3QXAe33+xFNT8OKMGYam+jhJeWtWmOH0geXwt9smWp0m/IJ0J9S+F/DNl2Z4f+6beOP1V7Bg/nuwO/wdfM9vh6/tZnhYr8dFi9XwsFoHT6u18vuasAuI9rVG+EVzqXvYZWCNQ3ZZkh2Ny5dapB+bGOIoo5T8P5Z+uQhdVb5Yu/KTnw1AShjyog9/TC46tac58lPdcXjX12gqcEDP5Xph6QTfpZZatDdWoqmuGA3VhSjLjZUUTGZOSYWdJRIkgjDO7xQS/E4p9jTvY/Jz1PxSQmzlvSbcEfnJgciMdMPx3StNPerZM6fh6PYVCPWwQEFGFJLCXOHlcBw71y3Be3PflMj4wrRpCHA/IyL/pwvmDvm4KMV9tWy5ftv2HQ/OeePr62fx0LDHhvyDS5YuG2RD58cUnmlpaqzKQqu+GC1MiboYlOWEIj3cQXrA6RH2Qv/fevMVWaNxr+KcVyN7mo+N4oq0p2D24ds4snstgpz2Qu20DyFOuxDqsl/qnQjVKXzx+cdKAX9HTfLwoyMwetQYvD5zKsy3fQG7A1/Byfw7eFquhZvFKsT4WiFRbS/pKdB+O4Kd9ooGmB7pIjoco2C090lYHlhjIk/N5RHorA7C96s+u6/6b/arr6C7KQ49TbG4WheE7s5qRb+83o2ujgYhTZ1t9ZJROASVnxYiF0aE1wlJu2TF7DARYGzNxfnydlKiINuH8j7UTmpaApJyjuiIka7YvX4J1ixfAG+bTfC22YpoH0uEXjyG1EB7FKSFKnJPrIdckJHep5Aa4QR/hwMYKhNyJODSpU7i4MF1QNLSM9Z9/uVXQz5xHCTKyckd7FyRrkMXutpqxVvHNldtSTJqC+PEcl+ZG4PcZF/kJnjKjbVbUrgL7M4cxdED23Bk/1bs37kWluY74XDuGNwcrKH2c5EZjuKscOmDxtGp4mMhkTTQfpuk2vMnt+CZZ6aYimFqkWMnTBQr/8DUPXXyJAwb8Ri+nD9bWmzO5t+IpMBptAjP40iPcBGgkVFSiKaGpkgYB6RmWrdysdzf6pVLcLU5Hb3tmfB2t/2LzNc4xD7U984c34BufYiAsPtShXSNenuu4urldnS163HtSoeMfRKEnL7TV+QIK2ftx/RKksGPmYpjVMfF0EDSxCjIDk6suHrsEOF+WB5nQpCt6InFmZFICLRFlNdJqGw2IdLjqKRqf7udiPW3Rbj7MaV29LFEiOshhLkeRoyPFSK8reR5Nf7/3Lvj5a2S9itHSB/s3MfizzXcNnXnk0ahMSIichD4lAU/it+Pfjv2Vznk01STg/rSVDGAEowcQEoNU+SCzBhXkQhotGQNx5kKDu1U6eJRV5oGfWUOmmsLUJIVIU92ToK3FN7ZiT7yZFJCOXNij2n1BV/k995+G96nzNFYWYoMa3PYrFqGBdNfwIQxY2U1Bv//SRMnwPH4epERMmI8oEsPRZyfFQLsdwhhYX81/OJhKdbTIl0Q5rofgQ7b8c2SeVJ7RvpZobM6GL2tKagvDhaw/yTmfsfnM196Hk2lQehtTUJPVyW6L7eJG5qmXQLw2pVLMrrZ2VovkbDrUpuYVSnJsP5TGLAiu4S67ROJJYo6oMsexHgfhzbaDamh56GNvYgUta24sosywiRyasKdhXS5n/oBcX5nkBmrQozfOfjabhX2z546JZbEoPOI87VCnP8ZRHqfQIjrPkx5eopJDrM9bz8wCz44Z4y7h6dmqEU8fLFXrflezKcDAUhHtNGKxQjIoZ/GKq2k4triFGHClflRKNWqUZEfg6L0YFTkRqOmMFkAyJnZ7isdqMiNQUV+HGpLNKgvz0R62Hkkqc9JzUPhNS/FTzFpJqlQrA3DlKefknpq4vgJOPvDSmQf2Yn6yGBc0dehNTMV9aG+KDhjjpTDW3FyxadYPP99jBwxEo+PHoM929YKo2T0S4twFsE5+MJOASLZI4VoRkJGE3+7rfCw/EFeILXTXuQnOKI0wwUfL5grdeFfWpw0sFNEb+OKr1egrTIcN3o60XulSUB3hQ7u9gaZsOu+2omea13iYaTnkCmY46Jkw2UcWtJGICtBJbYsxYh7VnRKplkZpGI9GHgGmdGuKEgNRIEmEF2XmlFekCRDT0yrMSoLAWGIywGphcM9T8Dfbrvc1IYyJ8z1IEJcDkraj/I+KTrp6q8XmcocErLv121Aa6uYPx4M6fDx9Zs+b/6CIZ9MzqU6u7jexXoVS/4t09wH5zAaKpR5i7rSFDRV58gMSHVhLGp08SjPiRALVFN1rkQ71o1Xu1rEJNpUnSfmAKbtnAQPZMV7Svqlfpcd7y7tsLKccFTmRWDunDnSLWG9uOuLT5C5az0Kz57AtZpKdJYUojk5Fvludsi1P4WMc0cR53keU598Qq7eGdNfUGSWC7tFIFfZrBdNjNoYayZqgvQARnmbCwADHXZJrzXC46jUhTqNCscPbRbpZKg24UDQKdODYyVlmR87jurqavT1XkHvtQ7FENGupFhuWCDwrvdekyjY3lSNloZKtDZUoLIoDeX58SjKikOBJkjqObbjSEIIPnacmCEIFj4eko6sWHfxNiaH2qM8KwbJoQ7SaoxWnUKw8z7pbPBx+dvvQqSfPYIcdsPHZgMiPY8jyHGPXIBUBfzs94hoTXBa71+Jp6c8MegxbtqylWn4wUTAPXv36e/1ZG7cvBXd3d2DWK9xAMk4Gcf3TMVcW8FakOm3riQRtUVJMvpYW5Io4GriGGNVtoCPZlC6VTi5xiFxfVmqWORpmWdETFafRV6yD4oy1SjOCEZZdgjKsvyRqHaUMU0l0gzH7g/mIm3bWpTYW6EhMgidBdk4umYFjmzdiCAXW0x9/nnT1Tv/3VcVULH95n4YIc774HNuG4IcdwgZiQs4K5GXLzodyLRjUR/ki0CiQuNreV48VB4XMGfOW0NKSP/27w/J/LO3yhsNDY2yo6a3+zKucgUIp+C6WnC5Q3Fqd7bp5eK9drlNvna5o0FcRA01RaIJkomX5saJsZfEg24YRrYM0QMvIkMIwxloY9ylV0wTCCMe37NLkhbpiiT1eaWrE+Uqj4W9XfdT3yM+0E4iaYEmRNJtotpBOik+ZzeJYO1pvV4uTB+bjfLz+zcuueuxbt22TX/f4AsODp4+dfpL97ySExISB7TafryLBQ/cTsWoKCsyrrQqc7j1hagv1UjUY51IMHJegyDl0LdxFQZ9eo3V2TJM1CSzGpkSETlAVFuYAH2ZBtW6OJRlB8tgU2FaAOzNt2LpO2/gkWEjsOSN2Uje8C3C7c9i9YrlGDdhEqZPfQ4zXnwekyZPxqzZs7B6xSdwtlgHf3s25bcK6KgRqp33It7fBtHeFtLmivOzlv6pOJD9LBHosBuxPkqEITEhCJvqSiRKJcVHwt/PB+4eHlKYR0RGobyiAj097EH3oIeP73KHbFLgjamWALzS2SKg49c4O8Paj18j8Wis0aGuIhc1JRkyClqaEyslSEGaWvrDtO/zY12aWsBF0FCCkVo5wVtIH3vcJFaJQaeVGtF1v9jLqIXSFxhgvwuBDnvgarVFIiLTcrTXcUnDZNbMBswMjIA+9ntwcNMXeO2VqXfhg0aE+wJfvb5hGKe47mU0YKNZ39BginwDgXhnSjZ+nWYApmUaQlvrClBfliqAuzZgdYbscrneLT/L9h3TNwFIIkO3CifoGDEZQetKEyS1k9jU6OJQlR+BkrQAUfljj2/B+DFj5UKZN/15RfB9eBgmThiHSMdDKNEGo6YoGQ35KSjLCkF+so+kL8fDKxDtpehmfMITA8/Ik07Fn10RDc2bnubSLSH5YdvO13aLAtwLe8QEUVWiRVdHM650tcnFdP16r+JF7Lki4CPAeDFe6WqXdSDCcGUHTZt8rbfnshAQruxgKm5rKEdHYwUaa0vEo8gZYdqjWL/RI0jXdkVBvJAo+gPZacpPCZS2nC49SIRqiv9ksgkBViLTEITS672wS0BIkkU1IcBuO6z2fouHH3kUOzd9h2AnRbIJtN8hGYHg9LJej2O7vrnnvAmf8x/Wb7i/COjk4mp25+b4gd4uXtnGFHsv4A0eKLqpDChxI5W4UZQ5EWWR0FV58vukZuyU79ObR3MoZ3apITbRMl+RKe08zm1wmo7jkzLDUZGBqoIYSe2V+THIinVBpNth7Fi5ULosDz1q8Ns9PwUq661IDLRGeoQjkoLOCABIjsi2s2MVtw6HgKJUp6TwZsqhm4RapTbOS6JEariTtPXYUWB0YbRhpCBg6TShTZ9m0dLcBNSWaoVxttSXor25BpcvNeHqFZphr+AaZZbuy0I6FEtYpzwP7Q1lsh+G6b40N17KDiPwuJajtiwLlYXJqC7VihjNVhwjINMwa+SC9FBxS1NVoDbI+i85REm3bEtykEkT5iA/zxTOEoLyEqMao6HHuT1Kd+aR4Xj2uWeQGusv96GvyENZbjxiA85hwqTJQ5YZnLjjsqn7Tr+bNm+xGMqP99Irr+KDjxagvr7e5HL5S+C7DcJ+06ScMhl3QzGE9l41Danzc4KQdnmJDsKiiww3nUg5HCJnvdhQlS0pvLkmV9p8SmRMEFsVr3gy1XlzZgopef75Z7BxxQdyBadHXkBekrdEPrphqvKjZTKvLDtclgclBDsgioxQyMcRqY/UTvuFKaaEOSI11EHYIhkyzZ6sp+iaoW5IRklTKNdncISyOCsWqREu4syu0qWiLC8e1UXpYvmnRY0Rjg5tmiYY8fk4abcncAozQsSCX5AWJC5ofVWBbGDghoTKIg30lXmy0o2DUdySoIxruoskI6QjwVtSLx3SLA9YwyYGnZOPOfLJOpYXEx8jSVbwhT3wt98BP7sdGDV6jAlgnyz8ACFuh5AS6gRtvD+ifCzx5JSnBhlwx4yfiA8/MqP7eV1UdMz9C9Cvvfm2aqAJdNjI0Th05KiApr2tRcCi7Fz+8ScA79aQadnoSmYUJPB6DHuZTbuZDYsg2xtK0VpXKB8TlCQqlGqyDTMRjBB8AakTNlXmICvWFamhZ8XndnTrl1i/Yj58rdfD//wmRHoegTbaUVJwWVYwqnNjkB7FaOAmM8Rk1pzLpdZHpwhTK90iNGyGuuwVMTfW/7RYnOJo1XLZL4NKSUHnJOXR7p6fGgxtrBeyEwOREu4gkZMvenFWJLJiLyLay1zKhKxYNxlCrypMRHletJQX3BdDmxdBSBOvNs4dZXlxMhdMU0JjtQ6XO1vFGcNRAOqWlI+ojSrDUk7IiHFTZm7oW4xxk/ugW4akhJ0Qaq75yX7yPda2IuYHnBYFIOjCXrFkzXl9mmnjBFWCd954GX7nd4hgrY3zxUKzDwas/3hHttPeuNH34NzOnyz+TD9QsaeVxtXNTVInZ1+NBs+fGv3udeP9CAAZBa91KltKDZtKjXv4SFBY/3FvH8cnCURuFmX/kymQEYD1Un2ZBnVFqchNcEdSkDVcT6zFtOefxoQJ4+F9ai18z21ElOchZMU4QafxR6FGBV2irzhFkkQvs4QmzA4ZEQ6iAfqc3SAADLDbqriKLx5ESqgtktV20qpL8DmB0IsHkZPkL0uLmKqTgm3lf8qK9RDmzA0NjGZ0L5dow5Ad5y4snoDMSfRAdoKn9MZLMkNRU5SEyvxYEeBJGJQIGiWpmA4fAq6toULacKz/mNpJOjivTJGcgGLqzTB0Q5KDzyE9ykX5+/GewmzjxJF+CtoYV3H7sB6kuTRCJJidogSQ7e5dvxgfz38L33w5H6/MfFEC0ck9a+B+bg/2b1yGyU8+acLGpCefJg4ebOfjvfc/0Nzp7ad2dcT8GHp7rkk6ZfQybiL9z96MY5tkycbakGA0RkNOrRF8ZM0yv6svljRFYqKvzJaoUF+hNaXf0qxg5MS6IDngNF6Z/qw0+z+aOwsXT66E+sJuJAVxWMcGObHO0CV7QRNyThkTDbCSQXBGuJwET8T7nRQ5hp0A1kdhLvskrTOKKAzzrBheU0LPKzauSBekhDpINKEuyDqLoE4LtRfmSTZKI0Bq2HlFlws9L3+HLci0CHsBRE68B4q1oRIlM2MvIpt7Y6JcJHIqG7hSUKQNl+VEjJBMo6zhSDqk9ktTy/JLfq58zQtJ6rOimxKM/FqGGFdtJZpHeR4RYZ1tTPEEGuZewt0PyUXCx8DnJsbvFCY/8cQAU8jgdiOPpui6fOXBTr6RxRhbbe++9yeYfbxIpptycnJMdd+tmzd/EshuyThkr7Dbm0MAVtmW1WdaZiTp2LCdnmtxCUCuQeOWqMbqXKkBSUpIRKS9V84+cwoq86NRmhUEbYyzPIEjR43C8MdGwvHEWjgdWSFpNDPyAtLCziMvyQt5ie7IiLogg9yUJMgQNWHnkRXnBm20s3wc5LAdfuc2im2LUktGmLOAMoatKJd9CHHZLyxSUrbrfsW0evGQMGnaoFj0s+Bnu5HA49+guzpb0qKzRCuWDARjeW4MijKCJTVzNQfBQpGZs8AkHxWFqSK1sPNBUJIsFWsjJeqRYLDW4/4YZWApWMRpeh3ZrmREVNqXzsJ28xI9ZRaEvWKCL9LLXGpauqyjvI/L77GLEu55FJHeFhg/8d4txjnvvodfPeg3jlWyq8D9y8ZtVsYOx8+Ncr3XugwbqJQjDuiSuVMv7DeA0LjjmdGQ4GO65Xwun3jOxRKAzXUFwlwpTNcWJyMv2RcFbOHlhCI3/qKk4GDH3eJrmzBhnMw02B/8Cp6n18sVnxntjPSw08hP9kZhmq+QEgKxINUPuhRuq7ITUBAoYa57EeVxCOGueyUCUgNMCnEQSYbmBM5KkE2zFlRmLY5JFOTPsoXH5j9fXL6o2lg3GXaK9zsuQ+YFKX4C9MwoJ2kn6tICpDQgmLgrmn49bs8qzAwXNlycHSfjmEzLrA+rS3NQmqeMaDIqsu7jjZGX0a+qKE3SL+eGSZaY9klKSEZ0yYGIUR1DuNsBKTdY71J8ZzRnLzwx6Iw8fo4qfLfczJQJ77TKUY7bt//Ag13/ZnP2nMa447mlpXnwUM/1axKpfg4Alf0rFcrRCFx721Qx6D5EzpEuSr8iWF+/JroY1+JSipFNqVWKGYGRj+m3sVIrGmBtSapoYFzfWyH95SCkhpzF/k3LpO869YVnxYwZ4WWJULejiHQ/gBT1GXnhs2KckRvvjEC7LXKryImGLtUPBSnewoq10U4yMxGnOobUUEW6YHRjBGTNx/fx/meEhEjq9T4hg0uMjME0MbgfVFw0fDEDTss0YEqI0q9lymRUYjpktEuPcJALoCg1UKIhjQMEDMcXyHq5+qOcckxBMsooyZRmihGhKCtKyBjZL9d3sEvSWFsoHQ+maUZBRkyl5lRJnUgXkbjEKUp7m0ttyzKDeidrQfaOSWhCPE9i4Ydz7hoG+2rZcmzctAlHjh7jPsh19fUP8IQnOweHYexRGpfmREVFGiKgsuXqpzLfgTcyVO6BMe7jo+xgvI9bhvszpnXZKC/HGtSJBEPQsgNCvY9A1FdoUalLQEVBgvSNm+t0ssSR6bgiNxKFGj8c3bcOT015Uh7D+AkTcWjbcpnmcj62EuFu+8WomRHuiLSwc8iMsIffuQ3wP7dBwJeX5IHsOFeRcnITvaAJPSc3rmnjpgLWS0EOOxDjfVKiISOGdAtUJxDKyTnHnVLMMyJS5CUAeePPJQXbCKCV8dRTEhUTgs5Ies6IsJNFlVxYyb9LXyOBQ/mFq3pry7TS/21tKENTXRHamqpQX54l7ThdRqjUf5wVYZlSXpAoXZLKgkSRYijPMBpTsmENyQ4JgcjIneBvJY8nWJj+NpFiGC0ZzfdsWDJkyt29dx+6uznmevPBEg9NWvr0r5at0BvPxt1/8OB9EYyBNSBbT3Rz8P3tYaVbJn2QKZibs4QJX25RDAyVWmnXMc02lGWII4a7ktkHpUZWW6qRthxJib4sA1nJgZg1a6bJ3Tt+/Djx/DFt7Fj1EdxPrZY2myKDOEAb64TsGCdkRFK+oKMlSECg05BJOiIzylF6zdmxrsiOcUOQPaWZHVA77RJWzKjC9Ea7Fj/ni8aakA5q9o/FrOB5RNZjEKyMMkJGQs8radHLHNG+pyTiZMdfhE4TgIJUlezKKZY6L0JZy1FTJFsYBHy1xWhvqpIzShjxlKjHfTbZohlSJ+TiopKsKMP2BC85WSDS/ZDMkMj/rDoOXZK/KAUxMv98QP7PWNVJqW3ZcqQV7fiBDUMCkGflVVfXPNi6r729fdgXXy7Vc8EMmeO773+A6zdu3Df4+m/0So+TCv+dqVscM/19hnldRQs07vBrqVd6v7yR/Sor1AqlBqwuSpZULEsly9LFP+jlfMokDbB9OOOF5xBrtR+ffTDXsPDnCezf8JlMc5EoME2nh9siLcxWZijSw84hL8kTOfEXkRJ8WoDCSMElRUXpAVKnMUp6W34PX+sfEOa8D+nRHtL1iOBIotMeASK3MbBvquxq2SGFvNSAXuaKETTwNOI5HBSgTLTFGxg4oyDNFYrJIlRIhiLDREOXoZY6kN0REo+SnGh5zy0JuswIiWyUZagXMs0yfcrscLSbXGzKBNxBJHPPIaUjl73SDWInh1GbHydx20OInbQYeVPZbMbR7UsxbeozsurkThD6+vnqHygAPTw9TUZOFpzOhn0u9yWx9PeZ9u+1N5VJBDSlXkP7TobDOa8rOiANmB1S+zFlt9TqJBJ2tVbJ5zQk8NbRWCaumsq8OEkvUX5n8ORTT0qPmlNp33+xAL4HtyDuyHa4bV+FkXRDPzIcs2e+KJNw9LvREZIUeEpeHLXTdiQGWIiRgSSA4KTxVFhsrBty41xQWRArw0nxXqyX9ilrLZK8Ea+2R7DjTknBjBrSTbDbZhCy9wkwGfEIPP4M6y1NiK1EPUaiOP9TUk8S7NQJ8xK9RYhmKjXKKRwn5VJyhfnGiPhMIb40L0kyQUWhRmnT5cTInDBt9ox+BDCFd9ac3qfXydpiApAApSBNuYU34ywxUzG7IGzNRXodkecmzOMw4gOssGn1Z4MWFH278rsHl3537923juOFRqbzznvv4fKVq/cNQO6DIengdBqBxEhoPLVSjsjq61W0PxPrVc7KEPnlSpPhpCLl6AJ+LJvra/NRU5gi3jY+kayVKFf42O+D9YFVUNnuRJyPJfKS/JDhaY1UB3PYHlgjcszESZMEVCqbjUgJtpHCn+8VhngGpZlBKM4IknosnnPCAdbIT/EWyYYzxjqNr9Rx7CSU58WgPDdaZBB2RTgvwYVGJBsJAWekr8p0TH1QMS8ckIjD+1T2Fp6VqCfdiygnlGjDhc1TsCbo2FpjpGMaJutldONWLNZ6XFTOjou06nJi0FRXiobqAiEcGWK/UknnIy7gtERdGbRXnRADL++b6Tgh0BrBzkq9pzY6vz2OKvtkGP2DbRBFliybFk7KCO2KJfNNAFyw8JMHl4LffX/eIJezOiTkgdR+rO0U1lsm75X2nUHANrBq44Igbiq4YRCgZX80T6hsrxMfIb92mVvtm8tF8yvJiZLIRzNlWvgFiUZMRZW6JDRU5aK1vgRNtTrpv3L2hE5gy/3fYeOaL4VIkKUyAlGIZYrNS1ShODNIUm1+Mp0knuLSLtWGoiwnQkyvbJWV5UahPDcSFXkx4uquLU1DZUG8iMf8f8g8KXNweo7rfQkyCslkvHR6U1Lh/0xphpJMTqKnLMHUpQXKffL/5AVFvY61W0tDmUgpZL3ciMDDbXJSgoR0kJzwCIii7BhhwgUZ4XKEg7jF6YhJVEk3RY7+EtJjhQKNGtp4b2nXxftZGrZjHZM+MCNwrMwOKxFZTflJZqUtpXuSGGKPXZtXmFqzb86ZiwcV/TQPD5h049bL6729P59o3IMZC+BuXDeJ1rcMm/KVZeU9poMFGQEFgFcvyTwEj0q43FYr4GW91ypnqhXIVcyxSzb8ldOJCsU1zJvcrxw23WsQtK8IgBsqs0XayI53k2jA9hhXcFDjoyhN1psd54K8eDdU5EVLFCxIobao3EoyQ1CaHYHSrDAZHaCDm8I3Izv3TNOtI8sjsyNljS7JUmVBHOrL01BVmCQCc5UuUbS+jMgLyI5ja+6i9J0Z8XhQIc2kFJ0JWGUfoE62O5Dpcg6GjJggLM6OksMN68pzJSrSF8iWXF1FtkRB2rPYIZF0nR0lQOUFkZPoq2iA7EHHeymD6ezm+FsLa+deQe8z6yQa0hHDpUUyX+xxCD6O+3Hm8Bo8+9zt5ZuvvzXn/gGYk5s37PlpMwYVl9wR/CCi371AqpwT0m/ojFwz2fblIEDjOW4GzVCOVKDMUq8TPyDZLlV/LrWkk4SWJvrrBh7JatQSTUdE9PcLwSFQKaWQ7WojnQQACf4W0gIjy82JczFogF4ozlBDl+qDQo2PMNNimVmJQUlWKCryY8U0wL4tnctcdi63nqtS4xKMZObt+hIhTwQoh+SrCpNRlhshgjlBR7LByMdUSzOFCMzaSEmzrP8IID5OAshkNE0PVEhHboyAs5TOmtIsOQKMa4K5R5Bsubo0U1gw3S4cJSVhKUgPR1ac4tBhpGZ3heUBRWfqghSjWQMa0zGHmgIcd2P18gV4ecYLmHjH8DnPA7xvAJ60OGU20HLFjz/59LO/KgAJEGVXnxL9lPN5Owx1XpNY8LnAiGd7kPXyY+VgQGWbKYeVKNWYjmOV1bs/GoTsmwOOZr1p6qzwa9QUmSqLtSHQUnqJcJBjHIo0/ihKD0JmNCWXQGTHu0o3hJIMUzJ9gqVZ4TL0RNGbqZjnmdSWJEBfmXV7F3avsv5NjoOgeF6vE82Th1y31ReKd5E+P7J7uZ/caMXnlx2NirxEKR/YRuNFoJMVvP6KzT4tRFpp+WlMveFir+deQgKoKCcehdQK82JkbW9xZoRYvrjti0I15RnuYSTIWabUlaZLacK/lZ8ZjXCPY8LcmXpZC3LWhfUtW4QCSqc9sD32A6a/NGOIIx+m4UGkX9Wdm6a++GrpXxV8xpR7QzbmXzetSCMB4a5mRjlGPrbbWDcSlPye8SBpxYFz6/Yh1BSwjdHP4DM0AVAAqcypUNxurskXALKmy0vwlJZbTpyr6H3ZsS4S7Rj5cpM8UZgeICcZ1RSniEOlvlwraZVTfOU5UXKyUXluuMxpEFwU1+XoVsMJR636QmH+XVJGlJsOxCGDJwBFPhJPXohYsooMFixGOnYpsuI8pR6UdlxKoMgwuowwqTUFmBlh4vkTswANs+wzB54Rxktyw+1gVbpkpIbYIy3sAlIjlO0JdE3TA8hBc87+su6kfsn7IXtmR4VEhgyY7p4Y3xMIdDkEsw/eHgTAJ55+9v4A2NneYHbU/OhdyOY5bw8MdIbzcm+aNuZ3m+z2Rv2PqZjSCwFyybCrmdGDRzgQcMZ1asbDbgb2ovv6bw6qP+WwahkJvRuIBEZdiQYl2hBJo7KIMuwcYn2PQxvhiNQQG6SFn0dm5HkUJHuiJCMYpZlqhe1mhct0HudROIFXkReFkqwwJdIUp0ibkGZZrh8Rw2xDiTwODlXxoqJ5greGqhxDfZggBIYpU7aeFmoMByH6CiDL8hNFx6PFSsDIbka8l7ITOslPyAzFbcojZN1+tptECqK4nRZ1ETnJAciM8ZQziQloo02Lbm7OAicFnhNywhYl5RiaaYtzEqU3XaFLR0F6JMI8j4hoTbMCz0rhrsQpA0yoEyY/dX8ALCjQmX3x1bK7du0tW/H1A418JAXSYiPpYLQzHNcgZtS+XpMGSMBxhRo1Q0aMbjmjt+v2fmc5XPrqEGL2jwM28veb0vDA9h5TPo2sJA00fJbmRKJSFy8stIwnFIXYQBNqKwxYnNLacNSVpgrTrS5MFMAyalXnJ6IsNxL60nRhuUzP1bpY+Rk5Ab2hWA65oXjOx6CMV1ahrbFMrGM8dpUaHzU8sueqwhQhChSUFfdzlPS1uTg8N1El9R9ZPckJoyFTMWs2Om04OiBbG9wOiNTCth9TprKQ6Lh83892i3RtuP+PY5iMojRL0MuoTfARO399ZY5yaFBvt9Sf2Qm+ssZX7bZP2oUKM7aU9x++f/tEVJ4P2NzU+J/f+2Lv4GA2Z+57d0VA6jvGDoWxW3H/csxNw4LwLkm3YkI1HChtPLvjsgGAZL48O44p17haV9nt3Ht7jsRwIPSd8yjG1GyMvMbTyqkhtjdVoKWuUMDEG1kphV+mW/aE2REpSPERmxS/R6s++86K1StVNjVUFyRI3caeMxkxgVRTlGiaZWbUazJEwUstlehoLJc5FnZvWHvVlWYI4NjpKM2OFHs+D60mw83XBAogGB1Ls6OFlPCIV5IKbjMgeZD+LbsZvhaiBLCPy9pNpBQ5I++kmCLi5URPWwQ57BTNj79Tq0sVGSYl7IKQk5oy+inzceVSs0zedV+7Ij7P4qwYRcAW7+Np6dgwvbOj89kn7w9YQPrK/UXAxIQ4s6+WLbsLgO++/6GJOTJF/lzny9D13y3T8JHsZu5V0qqRCcv8q8zGNsih0CQl/caazpCq+X8o3sAKcUUzlQ/NsPuU3zWdTXJZhtw51thSV4zy7Ehp0nP2gzUYl02yF5wZfQEJAZbQJXtImqTxtVFmTpSIRhBW6Qw1YG6EDNWX5kQIGBktufuGsosI7/oy1JelC5B59ltJVrhILXRxU0vkEa0EL79PIOo0gchN8RUhmq00Ao7vKUBT6+M2WQrdXKhJnU4Txj61s6RojgVQ3KZWl20wHnCzA3+W4rMsKJdZ50PSJgxy2i+rkRUv4AHE+lmLkM8BqipdEqpLMuQwcE4DRvuckr8nv+t+EG+8dntEl4fT3BcAtVnZ0+ebfXzX0Pms2bPlhaZ+RnDcr+XeWJsx8il63+UB9eA1gwNa6YIotWCbAM4IXGWIqc+kJzI6kqQoUVCRdFjfcbjbpC0aLF0SXXuvGWaMWySqMQrKIFJhoojQZMY5cTyCy0JacBSaL3fUiR5JsHODA2UXApAf8/v8vfK8KNQUxUmLrkoXI3PKSjpOkHFP1obsWevLFPcOgcdlkdwMSy2zVKsI59QIyVIJUF16sHge6YamcSCPK9fC7MXIQJs/xwUY2Siic0VJknys1IHU9JKDbaWmSzDsiibIZKLPXzEX8IwTteGoCc5/JMgci6MMsROcXF4uoPQ5KQNWdHxzkTntZt98tUDWBxtx8t2atfc3+dZ1qXXYx4s+1dy11+2xUaivrVQ2yMuk2g0Tofip/d+BhlPj+SAy72tIt8ZuCL9m3FRvPErrpkFWGQzg24RCiYb9g8ys1OO4hpfdkz4DCE0/39+HK1cuGdJMl4CYFwEjFHU9SjBc+ZEj4PAVfU8IRW2+RMIGg92/qiAO1UVJqKbtPzscFfnRaKnNU8TpvFhZtlRvOGeuMj8SuezpZiqEp0wbKfO5/JxOFQJNhGfKIxwop+itCZRIV61TNrpSKJZVG8FKX1qO33LcIR5EDk2RHMgAvdNuZWDcZR80Ea4ylUdnDkGmslkn9SCHiYJlwfoOeFquhofl9/LzBBmNFHTucNic9xVgt0UWlstycx9rcUvbH1iK5555csAU3GNwdLC//wGktT+sG/KIhZUrv0H31Q6D+bTfRCRuDvDuDSYAiuBrdEzflkB+NIFSUq4h7Srvewak5asGkPbfNUFnun/T7EifYR75dr1H8bpdJJuW26dzGm9915X23o2eQeI367KybB40HSfEhBGK6ZJMuaVOASBZLeWUJoMBlgDTF2kk5VbkRihySqkiSnMstKYwUYBakh2OwrQgRV7JCBGQF2WGyOGHBBrFb7bn6P0jwchLDZAeLZlqpuG0TEY7+vVoZGAEZFSjnZ8GhgTDgLns+BNThI9EuXg/K2kzEnwcpgpxVlzaNEgQlAQwSUiAmCV2SAdEtv877lAm4hx3CzD5NRIP7gVkiubWhMUL5pg2itEFrSssvP/lQ/6BAdPHT3ryLgDyWIC83GwlzRmizsD5X77o3AFnlDpuGKKZWOv7rt9FXoQFywDTDdM4p1GMlmhlqNfu1TkxzY0YhtsVmWXADhrD+R/Gv3G713x90ME08rnhqFiybEY4Sin83X4Baqds7yI4Wf/R9i9D8DV5aG8oQn1JGmokJafI+/qSZPk5fWGSaIRk15RnynOjpLfLj0kySrIjpA5kd4O2e86BaCIcxfdHkZtApbOG03EcIMqOV3RAnh8sC8W9j4mrmi1E1nWF6SEKEQm1l9kP6oL8nCYI9YVdCHfbJ4DzsFyNBD8LRF48IMDyObdFzAY0RajFgr9HNiHQOmYcQaXThxGR7u4UtZ2QHV/bnfj2q49MZhUeSv7AjAiHj5prePrhnSD8btVKEVHZZrrZ32/S80x12c1bpsOojdHspmH4yFiHye+ZtifcUqz9hmhoHMe8+ROm6owbGET7M5w5bPqfDJqf1JLdl00D7gPPKe6RaN5tSs/8mLoj17411+oM31Put6u9TkhHY4UWLTL0nqd0MQzD8HWlyRLl2A+mJlhTmCByDTsb7JIwyomHkBEvLUhAxS4Kb2S/jID8mK04Tr/Jpi8xJngI++T3CTAyYpIUfkxCwpRMcZgTeSQWeanBQkKUuRN7AYy4sB13STuN45UEFx3aXqfXSer2t9shKzaYYrlqjQP3TNFcO8JllUy7XLbE+2dEVDsfgK/tNrltX71QDjYc/vgYhISGPbhDCHNyc6e/POtV/d1nyE4XKzg7EawFb5pS34+3wWdIu6boYgCesdshYjPT8h192hvGVCzttFs/uZNijKBGlmtMw0qU65TFR1IHDjog+7pyQLWhzjQCk1+jFsjOS5/hYuB7um5Y8zH6NROIlZkiLHOOhbMoZLokGdQAqQkq6+HCUJgeJH5CyjSMdox+TL9CLtIC5fsEI2tAvhcA0oigCRBywvYX+9N0yXAOmB5AGhEaKnNl9wtTNZ0uNBWkRzjLgYRiKAg8K0dwcVdfsGGVCOs61oVc2h7svFfsZ8pmq13S8+XJn2E8MYnHkLkekJRLokEjKu+HK+d4VgiJCX8vwGEXtq1eKEdGvPr6mw9+As7Ly2vYmu/XDdr1wYEebVqcqPlsLZGhGvuvA8//EAAYVmoYo55EOQMAjeTllmnw6KapE/JzNEaTsYB1o0g3nSYXNY2sXF8rPWX+r1c7TNGWP0PmzPrQCEr+bxzzpPOFIrI4cQyMnEuSWMs1cfVHZRaaa3LkEGtqe4yELZW5Aj6SEKnx0gKQl8h5XrUMFRWmB0q3hWmYVq5iITmeQkA465FPw0NaoJgiCDpttCuyeIJU6HlJzekRTpKaCS6K4nlJyjo1LTccxLqLhkepJT+d6zjCUFWcgeQQB4lgClN2kqPFWLdxzjfAYYcM5Ade2C0bD/zttwrwGBlVZzYY6sC9UDvuRYDDTvl5CtoEJVdweJ3ZIHXkYrN3ZLRh4SeLNL/6a7zl5uUNW/DxJxZ/mvehnkdtTn/pJehrSmQvHUHY3FiNqooS0wtoMpUaSMXtSHhDwGIkAcJqjSYBqRNvmqLkz7V5GdM2SQVTqHLqeZVob3KhdLUIIaEhgLoif4YptaulSlJoV1u1YftCO2q4XSovEg0l6aL5KZ2SMjRVKz1fgq5BJu/S0FCVJQfsUJRmfVjIw6K52zrJG5lRFyTyZbNlFusmUY/2KWp9JBs0FRSmBcrPMuXmJXsjPdRGBtNp3+JgOuePORlHe1Y6N3v5nJDpOXoX08IdBJhsxZXSnp8ejsKMcHG36NLCUZAagtykAEnV2lgu73SXsVFGQ4KLUY+EI57b/j2PSWQj8BjZZCjdYad8zA1ftOoHOu6R48k4QkBtkaz44qk1mDhpgjiiv1258q97KHXfjZ7pnR0t6GjVy4tNe3xMpBrvvPueHJsaHOSv1FGmLkXPYIZpEJCN9ZlCIPqHjGg/V0+8blhvxn15PPja1OrSl4hVnzVrj+Egarb2qOPJ8qLafMXOX69DQ2WmDDmVZqtRp4sXYLHmo6TSQJNpUYJEQOp6ZLgEI40HVQWxkkZzEz2FWDC1Zka7SM2njVZmiukdFMClB6EsO0JkHbbc6EJhT5mDR/QCkuGyn8vUTHAx4nH8MjPaCSkc1Qy1lXFN7vDj32CqZqckPy1MiXIRLsjThMm+aGqIbY2VKMmOR0aUBzKiLsqGBqZP1nYkFl6nf5A1I57W68RmxdFRLiJXmPAOSckkIawPlfbdbpFqyI5pbt2yerHp9M5Nmzf+bU5Fv9F7dR1rNWqCo8aOkyk5zozMePkVg/mzf3DdZ4iG/NrtjsQNUxq+aZByBs6E/Hw3zU3DBtF6OQWdLPZSc7niHWwqE/8dazr2k2XpZbNi4adZgKm2TNJipHQz+Hk1Ix1XB8toZ77Udpy0qylSiEVDhUEHrFAMpnRJU99jjUcCIyIyRzmTVaIlamXDgYdogzSw0gNIlsszSwhURkjxH8Z7KHuts8IkApJk8H4V6UYtKZduamXOI0ohGaoTslw8LsAG2jhvxW5Vlm04wDoNmbFeogOmhjsbznDbC9cTqyW6hRgYMMEWcGGfSDHep39QDijk7huHXbIjJuyiMt/M9B12URlO8jy9Ac8aNEAeIulof+5vA0C+3bzZv06rTcfz016UFR0cUOaR7ASgKf0aTAXGzQn8WJFjBswRG2q/+94h098nyxwbq3KlT0oXsmJ1KhWjAafjmmrzJCoSgFx3prDYQolArMNoIlB6saGoyI2SPi6/31iZLYBi14JCMyMXQVpMdwpBS+uUGEiDxLBKlzX3tfA+Ka3kM/ol+0gUy0/ykojITkh1YZI4UAi4spxoiX48G4VWfIKYKTY7gQD2kmjHxUSsCdmOY1RkhEuLcjMdxcrl4ElqOwFhlLeF+P16uq/KlgQeuVCRnyKTetz/HOJ6WFIxj1aQrf882y3ARjQ+t5OrZUKQDJmnRAXa75IjGjjLwluwSDQ7sHml2W1iOvUFWJ08vO5Xf8u38rKydU8YTkbi6TfZ2VnSLus1iLsDxWRjMd8/oNjvM8yB3E9L75ZB7jH6CRkFeVQVX2CuKWOkoWuEDJS2fQLykiH6iZmgOFnSok5kEV8lAiX7CrB4H3VlGXLslbBV7maJc0NxplqYLL/GCFdEm77GX+zt7AHzexyKF5dMYZLY9ukT5FQdo6J0WBK9JGoysvI+Zcl6rKuAVFJ3jIukX27Iyon3FBcM68fMGBepCSlW08PH3dNsuxFY4e5HRe9Lj3ZHQWoQshN9xXrFJZWUZvJS+H+GSj1IwZopN9TtINQuBxR2zANo3A4jwGGb1Id+ov0dENmGR7XyFExPqx9EJzy5d5Vs8TcC8KMFHyE2KtjsbwrA3u7LwzZs2iwR8PMlX6KnWwGc+PiudpiWCCnH3ncOqglvz31cf0CG1psGPfG6tN8IOm4KrS1Jk3TMbQkUg5mKCUTqbWI40ARI/5XSBx2/dJVIDaYJEPsTHSj1ZZkSbWgSoBzCKFiSxS6GWoAkbbRUf2mjUfMTTx/XBZdrJcU3VeWjtljxGxalB6IwTSEfuhQfuT+yXjpueBGwDuQFwPSryDDuMiuiaIBqZcWwz0nZbsBjFerKspAcYi9bWWkmpTEhzOOYtNLIeAnMvFS1rIljRKQ4zZ+To8uc9iHGx1LGRGXcUibfjsv4JW1dZLzslJAB+9pukvFN1oRkym+9NtgJ/fkXS/QN+prpv/pbv/Fg6mvXZBWDgKGsrEwG179Z+S1ysjNMxlGTxcpwvJSRCd/vCrfBvWalE8JThJppLKjOl2EdamZ8cTmoI5EjSdHZeFN2oria7EyMOgQjmSyBK12KbA7+hIpHr4A1XaK31GUyF8wdfql+AkKCWlp2ZekSXZmqaTQlCCnLFGYESReEZIRRkKOflF/SIx1QnkP7fZwAmeSDYwH8HyT9RjkJ82Ubjr1gttUSAmygy4iQTQucavOz3SbjlnRCixPG77TMHne26LkcEn19fbhx4wZKdRnY/P0yzJrxHDav/xZqTys5boHCc6DjLqn9eCp8avgFOf+XX/c+oxxLoTbMMk+b+uxd23Hf/+BD1a/+q94GguCzL5bI+Cb3Bf5p3ge4dlU58p5p2Fj7GaOfMRX/fAfNTTn48M7UbSQ0jIb0r11qrkZ9Ra5yZkZmqEQ6zlSwyU9AKpsC7GQtmaQ1rkXjYdNZESL6UuRVhOMIWW/BvnCBQTA2isiMojXShktFbWmG7CMk6GqKUoRssL4kM2ZUZFonA2ZtWZoVIc5ngox/l9YrAp9khffNFCwRMd5D/g/uraZJVuZ4fTjEfkg5EiJdLSZSevk4Msl91ZRa+Ni4HGnlsk+xdNkKNDfWIy8zHjNfmWk4J2+4clrluhUCKnZGKE6z9vO13wNf+73wPLsdF46tEtYrmqGLBVZ/vXgQ8IwfL/xk0X8pAPVGECz+7HMBIDdocaSzublRoqBx5W6fse1l3H5qGD7/yQPtN/pw/PhRmdDz8fUbcsWv0ZjAW2N1vnjt6J0jiErkhfaX9Cqra2lRCjwtIGQUZPrjLS3cEWW50ZLCKUzTdk8iQ0AyFfN7rBEVkyi3VOUqMyD1JaIHkkQwGhKkJDLc3iCDVr3dElkFzIbpN35MEZngTg2xlR1+RRmhogtmRDrK5gNGbq7JSA45J/sKuT2LfjwRhp33yjwxZRKCMDNOJbMbqTEqjJ80WWq1rBS1nLN352lW339tJud5MPqFuB2WEy5Hjx1jOi72ueefwYfv/L/2vsQ77vLKsv+IOT1neshGSEJYAyEEkzAJJOlOQsNk0nGW7hAySUgmJBAMWejsYV+MbMA2GIxtvFveJe+LbEuybMmWbO27SqWSSktVSVXaF+g359733lclYkgCxun0wefUkS1rqfrV+73vvfvuu/d/yVduuZHO7K+nA1hQyH3xuX/1AMQTgSom1BSwQ5JJY5l8LDtz5Shs3OR8M1ww50LR9ORZ8b/XquxHIhFmV+rUvPt9ct/PfiEnyitmkQ/CTJiTmEmqMAA0h4GfbpVt4zGMlUZAH1wEP6KGLSSAHs1nlsMSuBJTt/II5eLR6SJmNxBXUWei2wZ/kHXmmUMMQqxpYlkJqqX9sUbSsEAJ89cAAmwbs/Ju/lxkPgQ1HroauZFg9WnrfiuLVrNBgWgSFfwLFnN5HM8X7JU9qx+WLc/fL0UkiD5m6qWLCJv87J475OmHfsLlpLyH7g3rFe+76APy87u/JbvWPMaGAxnw7ju+yv/7hzdwc3o9t/P2dr6+eX/1I3h8fEJ2FBRK/qZN0tPTwyPRpTW4Mml0KxADMqkYd2NBuZ80EsJrR3AzhhX659PpjHz+5lvkXabpAhoQ1Pmh2DA2NpqFfaYmc8irr2qwJ3vosYasCP80dJEq46FqBCAJ4LhFBsQxjblsR+1R7WRP7iG00ll/jFkR3XVvtJ7HKxnM1UcYlDBORO3HXZGGUgYeAhDMGhjOeKkQj9SQUt8A2KfqICchOIbBXFZq1jaTZNsk1SWKBYKJjHoQch3VRkgFkQDUKpd9Q3OB7hbYYAmNvxdyXIYJRuHqx+WuH94uP513p+Q9ej9tuKCMD6FJkA0e/cVt8q7X8fc4uyv9u4I1x5Pzn5KWltayv0oT8kbdKT0uRgdlZDCm7ORUt4mM91BoHNMUl9t1sgD9QMYzYZry2sxYXlFxVqO/WFfnrDozlzGD7twp/Ah27GlgowzZEKAusqQuqddS5gL1F1jHsEHANMEbEnwO+yAY9SEQAYs4BgiYBgGJoEXtx92Q6iK6GKEjxnolXC2VuTPBoDyNjHd4HbfV0NUCCkLHDVwQJNdIbQnhGzQmR3Y8Q7EgrEsig4P5XF28RaGSF1W/Dyxn0KsKXn6AJUWJKd1XHFovVSXbSVpAp8zZ8v7VUrxzBX1CwCvctOQXcs+d35b/ccF73pSnMbiAq1avOX/H8PTUxFznAjr96rWWXHjTxygoNEBKFAINopQj9ProMIr/AAMRwemL6GPDA0rNt8DJ2nqhm5uQz33+C3+0tbd12zbWk5n0kBQWFsrLq1ZJfX1DkPadstVPfEQ2RnGPwBnjMruxYSbGuKSEwMS2mW7KHWATE4W0BeTPTu0l3NJ0ah9ntLBwQAZFN02ZDxzddcdsdXI9a8eu5lP0eIvUH6ej5TS60okxav2hs0Uw4mfi57ew9gSv8Chp/bCNwLELQSGsWyK7abeeT+CYRNOXHyDBgBZaG3VvF7UtggsWEZTeLVfbBkj1qldIPnFEQDvooCuKNpJqv+iRe+iA7q7vf8nj+hs+Jfn5G+eeBwxwcK6vNYas43u3OdAKyQcGv6jpTJpzWcqyUaKiidgcghJBiMyo3L0chQMDr4nzGbnhzJkquemzn2Ozk7W4f69c/bGP06nbCZLo9m6+5UtyqOhQAL+n7IiGtC0AXmKXYQ9FZ9kIpH3rH+GUYf+GR+X47hfZwEQaSkjkhDY0WCpwHQcwS6rT2kfVn3j9YyQAQKEUpE0EJ451LPa0Vh9h9sK6JUuKZFwaKvZIoqeVtlsqbnScxzbm0Bj5gVsI82nsd+zPf0pdLzkn3kSFe/x++NftMsNsaLccKVhCCj5GdcfofKSqqhAwgldI+aG1DHY8Lyyr4/Ueyp9PQUoVI1ogu9Y+Ib+971vyf26+Ud79vj//aP7RXXfL25/9bLlH1UsngubK2XA93XzLZh4EmsrsdoR9XzBWUAuCoTLBTbg+fu20MZpdqNJZNfhdcJVEPfg/3/M+AUsnG3TvltmyIhfI5R+5WqLRTi4iKXVrVKpOlsm6lc9IS2NtDh1LH8hIgGYOb1tIu9JVC+6VwlUPE8jFMB+DfGQiYGM61L+XgeGLQtzb2KOWp/AqQVYETqgNkI7XENAIPMA3+D4IUmINgJo30VrWeaDd43lgxHdk+9Pm5bGQzBiUBFCzwgiP/L+CJVKy6wUGFQTIoXBwunQrgw2ClGBHs9su28HsqHPrY8a63qQyHOug/fckF46w5ATu4N4Nj3EL7oUn7pGf/vib8sGLP8QOGdcbnnBXXXW53HTjDXLddR+jhuSVV39MhobS897Oum+OM41dVs3nudk9jVfCYhCPQOuAVeU0rgHYr8EHiAJZEfNZkFzJ4QNlCh5xk2NsYHzf18duvlfS0NjIAviyK6+aZY58NpO8O398lwymEmECc9vtt8ull18h/3bbbXLieFlOhz4mlRUl8q2v/7N8+ZbPyGc//XGZc+1VcusXPi2P/OYuKVj5IAFbZDvMSLFngW00ZBK1RVhONjOEJ8FcAakU0w7UdtDugzQamgwEJoIAm24IZtR32MQDSwc6MZTr3bxADm1dxEakvnw79z2gK40yoKvpBIMZXTpgJbKqjxdIU+V+lheQ4Kgn23o3ZTxgEYaatrqskAGIDUCXyMN8GZkTrwUC6siedP7c+iwzKNY9fY1z6VO/oDDR5z5zgzz4yx/KhhcfkO2rHpONLz4g3/7mvzAZpFKp2NTk2AVvSwBOTY2XufCOkkln/sgXxNnRuWQBavvRZCZJbh6CDIGH7Md/p/tz3JD6FMA2m64sgK0cw9waE9m3Lx6TZcuel3++9VZSw/6ePiYX/VEgwmL23p/+TL7y1a+RRu7Beu2c6+Wl5culrKxU1q1bR8Po1ztiFj18N8dWu1b+QQpX/FrNZXY/z2yHejHeWcfOGlgd9jUwruPUhQ5HW6mAgK9DN47OGjxBzHzxede/wfjvAKxTCxYziNEZI1thLq3L7NU6VsTMuek4py3AOdHsoP7E1AYmhmiUaF5YX6ILStueoVIqJh1BZSxWz4y/a+3DLCX2rH5Iti79JZkvXNHc9qzs2/AEGx2IFCFL7oN3Cl3XFxsA/qwcpiTIM/KpG66jlB9Op8/ffEvZL3/16/wtW7fMOZfNR1iBzFWe+mM5jNlmhb7zoUGVlJFBFexBsA2b9RaVrgbjMpZJZLtlUv/TOV3syCwl/RlTVkAdWVtVKnnzH5Ev3vwF+dAllwVp4T+ndnnX+94vV14N+9b3nNWGVsHZ98jKp3/OVUhqLOc/ru5B2Fbbs0wV+ptPsvinSObel+jHhgYFRx9kNqD1gqwEogMgHtR83BNurSBoTbPupnKuXSIrAtMDUxqdOwizLFv6I5R7A1EW0E+SOtn1NGnsbKmSrtZTqoZfe5TsHGQ5BC7WOXG8Htq6kONKqjbE6kntOrhlIee8KCVATABDBkA3KFpg2mAhCYRVND24sSAhzF1k8xmGnvXzT/5crvzIFbOu3YUf+JB87/s/iK1es/aCc3H8zjsbjcoXwd0Z3Y9J1oW5mdCtWW0R3T8OD3bLKGV3eywYYwzCsUw/GxI8clc6/e/4Xux74EgftoDuwRvbUCK1FQdk6YLfyHe/9o9yzdVXztIx/vs3CMT//g9ZaAeP91z4frnumivlO/96q+zZvJxHKwKOZi0bH6dcWdmeF5nx0FwgwOjvgT0NCE8eUK82HItYs3T1Azo81RQRN8QoDwEIpjVAc1wHt8LCkYuMSS4jGNzdalMLSRAEV0/HGWZdqODToLBsB3UCm6sPUxuQDCDzYAGlDM8XoDXqznJOf7aQ84eHOiPNJ2B/dMfzJCnAGXTL0l/SQxigdeHLvyMmecjqUfjp7d34lKx67kG5/VvfkK/O/TLV8nNtu1CH3/S5f5KtW7e+tQ55ZmamjPowtkIZAuuPtFj+PIqVLvxkZThGbceE0rz2cDNrX1TyJSZfbEezQup9qofGhLBoxUYaVAkaKwq58bVh0b2y+umfys/v/Krc/Z0vyY9vv0W+9/V/lJ/c8VX5wW23yPf/7fPyva99Vn74zS/I/XfOlV//5F9l9bP3y9In5snqZ6AbrX4gqN0QGAq7vMz9XGgJYjcXpFEGFnh7Rbqj0US9l50czYHR0sqZsO0ag2nTeooBBD1BwD9g8lC8aCDCjhnBixoME5Wh/k4ZhEVtDM4A7QzatloVMeKOsVlU0DkK2n/lO/lcgDSkrNbDMY3G5RjtIJ5idj15eL3OvSsPcKwHhgyUUtE5IyOqdPBSrn1yKR31aoGWF6gT8Xc8x9LdL8qhrU8TnyzavkQe/vWP5MqPXD7rpv/BD++MxXt757zVLFjmshphEX1m5k2xmQN7Omd6oYGXCfQtzZRWA/qecVDSHyFojayJY4gP+MV1nJLuluNkMRcXLJK965+UPTAXXPMwGcBrFvxE1j99t2x58VeyJu8n3A5bm/cjWfbQd2Xds/eaBb0ub2MfYt/6h8w/ZA0zxTGDLqAuv+vlX/PNoLNl1SHK4aK2jTZXcJyG4CCWWF7AGTLMYiiCVFes9VvHGWY0TE2GIMJJvcBWogIoRzBBQYOGpgyBB9ItIBtIrCGj4aaAZRnlO8p2kG3TUHmAcrzQDcTvcWVZNDxFW/JYPqChOLFvFUeK2HYDORbHbdG2RXLq6BbSuDBBUYekhbL9pV9xpEesETvJm+ZzNg0SLAIU8r0Mvm3Pcrf5SMFiWfzEz8LSuu+VP38udoenp6fyHHyenpqITU9N5uN4fvXV/8h79dX/yD+bRNrrsZkdAgnbcbY3kmXN2F4JccTBAP/4PjGPcHNcGh6Kq2F1awUVCXBhAG/s3fA46xXAJpibgvmxbuHdsvVFcN3ul5ceuUNWPvEDWfbw92T5o9/jrgQkK3a//HvZveoPVIMv3qHK8jh+jxEeWcYloZ2rfkdleRyzoGahG+3taiBLBlkPgDGCk6O+yn1k22Dts5lMmmPMfqjlUJMhUKCeRdZ2opNHMU4FNGyDyR7KCWOMF20F37FYmqqKqJ7KACzfTZk1ZEJMXcAC6mg8QZ8QzJjBBkIDAg1sVc16mNIe+9c/Ro4hsEYEmptYw+8OX49JCo5t1L24KdFw7KKxzpOqlAB62I7FBts8zsYE2fJo4XOy6LHZhjaY4d98y61y8uTJeW8xAGcuYABMTaDdnnO2WhEkBZVzm8lZWp+Z3ahYPejbdAG8zhnJuVSbCgrlSHVgzjw6yDfJPUew6wEAF/VUtKGEFqhgihwtXCJ71z/GhgH7D1jCWTX/R7J79cOy4vEfyHO/+5a8/MT3Zf0zP5V1C+9iLYQtsZ0v/44LOLigpTuhRoCabz7Vssr2aqdbunspya4Y0YENjZEcSApg4WB/BFALeH90KYKgedU+MqdxPAI+QWeLEWAfO+DGYF+mK6O92owN9ZLogM45Hqll4wHRc/wO6EaD7dNkwuM45hHogH1UZ/CAwjCH1xMuorbfpqdIaADgXO5Y4r6V7OhRE+L4haQHoCLsoegi1GIetQxGOD2tfYQ2E2hWKNUGg50dS6QIilz0wVssa577vbz3/Vk04sOXXi7fveMOOVFe/tbpW3/KiBhz4pnXaMdg1KXNynTwf3MFBZXU1cw37HNiWDFkEgGScQjGFQvw85AxejvP0BcORx/o9tjbjTaBQLpOync/Jyc4P93Mfdx9ax+Vxb/9NovpghW/kTXz76DIzsZn75Nnf32bvPDg/2WQrl1wl+xe8xj3ICDQSDdMwA52hMFXBD7C/ba6Ce1q6Fjjd2COmzAfFEAlyD48ftl8lNrKQBlJDQhSZL9Bw0VRRqA75SbfyKCkBmI8ktGgoIZDswGlfNhsxaONnGXDiLDWVBNQxqATB9kCR39zTTHJDGiMOJ6DAffWBbJ/AzSg5/N1oLGCFBs4hiOZQeluOc3fU1m8mfAQ6Gkn6Ce8lFkT4z5mUJtDY/6MhgwQDQIQUxVYXcDy66WFv5SLL76YDd2tX/qSvLR8hWCd41wsJv3JtjpsvOWQRR27wyyULkjQZ8mBdgDF8AgaiOp4Do1JJhFoXDrMt52TiVF+Pd7Evkg1nZMQiMiA7XWHpOH4VumoxWy1mOuTzScL6PtBy9QtC3jhwSBBkK1deJ+seOxOWZN3F2vCHSZlgfoIhjPIdpSt3TRfnYw2P8WPuvjUyI/A6sBWwSTDbWjRVCDgIDJUz92O3WxEVKatmP8HAUvXikYgAmrB60Y2RIDjAWY39agpklkjPR01rDOhsIqsB30ZgM9uzQVFLbgn4YGZL7pj1IBgAGnX+zj3ixFUeE0QtUSD0tl8irgjNAghGdded4xLULjZAEaj/j248UkGrmbBR/XjukekePvT1KvBDVpCH7wlDPgDO1bI8sUPyYa1K6Ti5CkoqF5wXggLOIZV7WDSRnEpU0PNqGRGui/AMdmA6tU3o7dVJySJLr4RmIj47ofXf2TawCmpt1WzYLSWQ/z2mn0SpX5KvrSe3s2/g43cVL5RThWtlMPbFhBMBfJfU7JR6ks3yMH1j8mavHtomYW7mYKPe17iUQStPBxbUArAnixIobte/i2zCAgNeL4AgzHox5GPLKwuoC20kcAYDm8+ggTwC47r3mi1RBqOEyxWx88aGext49GL74UOITIrxpMx27QDbojMCQwRNR7qTOwW4+ejAwYLG8GIRaTj+5bzyEWtSiPryv3saIFR7lv7EBfgAacU05VzGQMRWb6GokYbqBWNWTasX4cGuthMIXvTcengKmZAHMdYLdi39hFKd6C2hFDS9mX/Loc25TFzIiuyBj65T2pOH5d4PH5e1zcVw5uetilIwmq74TD14IzXdJ5x5CLr6VHUKplkN+Vs8aagE/TOm93xaDoU6MNGZkAnCeWCnvaT0oc3uPYIF4Haaw9Jc+UuGlbDuBrYFdx+MOttKt8uDWX5dEmHHzAcMdGxcsH8oIo/4k5GUNKGFROKbQtpZF1k2RBfg+KdLkTFm0iVR/D1ddXx6AXjRTvU7dSToU9IXzu1ZiBu2WuWs25bq1/TZK4AdYr5GVANHxQEIOpG/GyY8kQby9nc4MgFDANoRMUpFxOrA+ewpaaYIzzcJIe35jH4UKvhhqk8vIHZrYhTnWUMXkh+ALMEJJPsi8rE2IikU32sLSEFgnUBFb1cIEe3PUtBTAQxrgcDcXOeGjsWPk8KWE/zKUn1x2QonZlzvrIfGxVOPjhe02J60swHMQkJavdTKkI5kuokBkY1g0SUzQXeBHa4SVXH99oRf2eXiCCeGKF4UK6hDRbK26sPSNvpXdJStVvaqvdLYwX0WQq5ewF39FNHIJmxRRpP7pCm8s38v4Zj+dJevZ+BDGkN+MFBh+UYjiocvVsWyO41D/KNxN/xBvhoCiM4YHf7Nz3B5XLcSOyES3VJvfb4VsoII8BS8WZmQWgMJskMauCyOzLhQHe9Lc6f4qQEAuddzWXEAaH2AAVVeH30dTVZQ3JMmrHffGofSQfE+HboJAWQCLHHyn1UTzh9dJPZkv2e2R117Z51j1J5AdZdqPVQdoDShckJoJfuSF0YLkB9Ar8fdDV8/dGt2tQA3N724r/zOIeCwk5Ieax9hF00ArOzuVLGRjJyXoJvbDhxwfT0ZD5hFh6rcVvVTBpDOhmIqI7z+XGKYEMNBGBWjambGVAgLyC4VNQ8HbIljmhOQti0qADROLvjuCRRl0HNoLGUHLu6Y/nScGKL1B/fLE0V27kwDrC6q+k4WShdTcekHWTSkwUSxXSCCqigy++l4TWYI7izoZ3CTq9gsU4swCSxXQ3ulOxbTuYLMhWPn3LlHiIQIGaJGwzagtHmUulqPsabBVIg3SYHgkBEkwF9aGQ53AwUwWytoIIroBusl6JhYTYd6GQGpdVDXQkJD8xiResIyaAmxBGIhgLcP6dzcQqS/yTZNXju9C8uXMqshSwKWIbd8qanqLgATiO268ZH0myIcLSjIcEC/cGgGf1IUORHGYNZMjzrxjIUhjo/tP3pqYl5DjAjY434UTmosMJoGvNepVwhAFH7aVAmCLYmWQt1UZEKRxmyG4IQAQj1hXGO7+KS4dHcxUBEnahBndCfaUd6Mt5Gc+tI3UFpqiigfl9D+TZprdoj9eVb2WE6DQtgL9yO8P/QdMax11FdJNH6IxKDv1vtETmQ/wRXFgE78E2Dvy7kK9Y/wiMbcAccz0FWBQRCxkrZVtZnEc58y/l8UDNCUxDBlYJdg4keQYsGwUir1M0L+BE8RHwfMiKCD0d7ItZk6g8tofuHiY8GdzVhHhzL6I5xzCK4QBxA8wWeIGWAS7fyGEW9hwYEXwPNFwgeAZZBk8aSA2Y1oHiRy1jG1YbR4UE2JzgFcCwjG6IRQV2NJgXZFQF4fO8Krh8AscCpeF4C8JVXXo0ZTmgkzxHrbtt4xI4QYO3PesKZEybJCZlEmATgwlLFaiDKThBZENMBBO5IKkbrBvIJ0aQY89rtuqZNGg6BDUFJHGUNFQWEZ6BmUFe2mYKSPupzUUwynisRqPt4dLeegfL9fumoOyzVpRu4cwE8EbNgvHlwFIcqAXYrcHzhyMXy0LHCxVJ5YDUbBAz7McHAAxkOr6W95gD/D7WUOkHVEj7qbjjGbIfAQ52K4wvdL45mdMuAesAiR/DhtMDNh+Mb14yqX7gmfe0MYtCvAEHRYmvrQisfHmJgIMNiSoLnjCyF8eEBdMPbnmGtC2BZj+mnWStryfE0PY3xOdaBReukqmiNHNqSJ8d2LydNDXa2JTuek5MHVjLD9gCdGIjx+D5f2a8sTDGYBceDFwjk0JDVMmwopsKUgxYN5gmCjIYLiguJLlANalopt4bv5W6J0bnSA/qzXH4NRzBIDfhdClZP8c7r7VRLhcYTW6XpZKHUl21iYLVW7uGbhSMdGROB3Fy5U1qrdjNDwesDdSQ0/5orC9nIAE9DrYcAxuokim5kFcxI1TlzDxUOILMBfh+AaKjp45gHXAT5XgQH6kvCIflPMujx/PB1OPZxJAMABqZGomp1EaXicNw63uhdNo5eXAdcD1Da8L1o2tBpY0SIsSKJrDCWMRV9lAxwWwduiMDEFAQ3EwKUy075+j3FnHBobUjoCo7usGg1riMCeTenIk/wa9D4KG/wYfIlIRfX3V5NsYDJiZF556v5mC1EmbMzosETZ7D4hpxmwEFmRHS6+P8UL26rmhMSymiQTEq1/VDvITDxtRjQp22fZHioPzQhOPKnjbSALIgiH/4d9SfypeX0LmmsKJAI1ii7aqURq5HFa6WrpUxqjq6RWHMZg9YVHcCuaUMWqyxg1oJRYQdFxw9Ia9VeHm+lu5+X9rrD0t16gvJt3S0acOzE646yG2+v2U8POdSUmNKgtjuwZSFryF1rHmTwqiJXNU8JZCiaz2xZyOMVNxoyIOAm9ZlrZX1M+IZgfA2PaPw71dvMxgWeIGhC8FE7+SdZ3yHroR4EkQFroKeObCZ7B0GEJgr1I0eLpVsoCYfAg3AlghDZ0cd1uPkQgKdLtrF7xgNHNubH+B3YFESJMD46lHe+gm9e7txXVU8ncvZ1J5RylVuzjdjW3GC37Yaoj5pfYB4vYE5bE4I3B0GoXXVcj2n7HL43QyrXQNCpUShoiN/fWXeYGa766DqaD8L/t/5YvtSVbmDnG2+vCkqrTn5AAENJK1KDTbdCaYLFQtUe6agtkkhdEY9mBFWsuVR1oRtL2bECXkHnTVIElPLrj/LfYOl01BXx/6ENg3oMJAdkyyi9hht4A4KSlrEbUk+CVj4/qPJTpb+rlqA7mhlkvZ42DT4Eqx7X9QS6YQNBL7kSddIEAQK1Lmq4RLydnS5Gd8A8sXGHwAP/UBfzy3hMI0MDeEf3XLz9GduVeZxZ/wAFK5/miig+D7Iu6j7Mprvba2gGNJTOXHAe6r5XsCUXm36Nn4cvFnmtBTwQF5ZBk7SL7FlssEcFJDkLjYYZL9+QoT7JoNul82R36IAJ1vZ3hMUm5xLmqnFNGhsbPwfOReiAEXT1ZZt5LDec2MzP4yh2HWu/aSZN3YtTia4aZr5o/VEGGzJepO6wdNQXqSBR83HWmDhqkUmjDaXSXnNQOuuLpbfztLom4f8bivV7G4oZmPg+xwJTXFGIhJMCvxfXAccvAjDeeoqNCgBuhXFOSy9Y0hGtL/F54IXIiPRTNtwR1xHXBmUMrc+SPbwuALRbqo9Kddk2TmXwHFRFrDU42uN3KFC9WI5ue5rTDQ84zsl3vcDMiIwIQBp4J5a+kn0R1qVvN9gcU4D41SDPm0tWnXY1VGNIuyIC4RbWdB5QXeyAccHJCuEFaGFwcSaMwCXc0mVLTZ3MdmlmQM1+/nO0u84EB/ZcGwcEVJJ8uhLiYgCPGyt2yMhgb9je89GgNzHTkxPBMGcsnZD+zjrpxNHacJimNpG6QwrhYCEdLOSG4+x0AYBHGo5QBg5varytggGEz/UyYCpp84VRIbpcwEbs7lM9YRKEmwokBWS5uFlEoFvuB6O5u5FHbW+kksGJrBg3KwlXf0UQkmGDBm6oL9yoCMp0Stnn2FXpqCuxwGsLgwCcQvheHMlu4wDIhk1KwRL93PrHWT+W7XqBAYkdZxzt/d1t+vOHE3PfNqAZBNVp8/ZVBayxsKL5ehQs/B8CymeeuCM1k3WwlkHQcW2zR23vPQCdtu8ZAZ8f5NEcsa26KBsYDvEBxdAoejIEX24tis9XVBwnPegDF18i13/yk7J40dNBPgRz6uFMymwjJkMgu441Pq+q+WXSVnNQOmoOMft0mTccAgyZrcdYOW1n9oagoNtmY4nqTDeXSTfgF6v98JpR56qKaytfky8O4eilIHrnGdaCYP7ghsTfIS+MwEPAwdo22a3SxL73oadLnDcZy5fMgGpfw8W9BXzEJsuSLXr9wUvsbuJzqKvYJcWFS6Rs7zIGWgmlP54lJY2E1oOrCXxjxAcvuurSbaaV00rQ+pwG4NhwYo7R8vPdHoGSaJkEgwiZByCwQiCZs5JU3YxmkEdBu6RTPZb1tLND3YeshuAkQ6RPsyLuRnR56Zx6z+EHwhFgRFtWxdehs87lJLpgkTNqEokBufGznyNLw+lC3/v+DyRvQR45axddfAn/ffzEifAzfFc5l1CLNwzZFAEFDxEc0wCMAXyjNkTdh2BExsMb2kkHpSOEhYAzItgydjR6yeE3H4IcwYfgijUpDoiHHseV/MhdkkgV68KkYaWug6h1szq1U6yd71OnnSBR+uix5jQ/ZleVRV2J2hGrBtjyA0aIB7piBBk6aTQZ6HgBF+HzmHic2L2M5AWo1GJsN5wmLntu6r+J8eE8p015Pefumbij8AKx00vCwfAA9zly7RuyFg7G5RsbVFzQoBYcv7g4lNGllG4bLxRZwUNxfgTMoly5rkBfwvcraUEvaoaCRwPKnrY9FV/pJKPGMD/Ue7GuLvn2d77LxRmovP63HPZu8Mh774Xy+S/eLMtXrJSRkdFZr8cfI0P9mpE5xWmXdH+ExyOsHPAGA0JSgkKb1m+dtXRI99eN56+8xq4cJ/WmMAHCz0KG7aVD52ke1QgYZtXIadslVtOcYbuZ/ftxTTNeX1smVGC/zZo9zXrAJsne6W3jchMmOcf2vCjFYD3vfIF7x+ioUQti7IZaEGQEkk+3LyZxobZsl3S1VMpAV7MMJXp4jc9JAE5Njs2jeSA0W0wF3y1WEXyu86J+HP22+6uTDNRuwdPNlPLxfRgfeTPhb1zG7k5QsYbsSMVxoHWiLrTjIz6nx3PESAjtmh2JI8aCH4gTXZ1h7b7EY6baSmWuqQlpamqSOZ+44aw7xbmPf/rizRKNRs8qFYwb0H2NoVeN5xIY3Ua2wCQIRyMCCFmJZQcy30CE/1YH9SYejQgorBd4HQzyAYFoBLdBU2BSs2nobuBHNCAZ099BsOM6DlpHzYw6oJMj3NAJuwHwOzXwI4EShmDEzgkY5cDzADqXgjFDyGkZR5DAAovMgw7TIIz3YOna1V5PUshoJonkdG6YL5MTozEsC7nYEI5an+cS/M30hzksC91kV+i2cME4n7Wd4FCv4Y2y+k13g+Ph/7yz1aDr4s9Xf49+A6g7mEF4QZk94tnGJBG1Tbqh8OYz2BB0I1lKv9L7R63jnab2YGHBNqoovFEQ/vjueySZTM1axHKyrSs84OOk1Y8+5sPvpWNTuG794fl7BudOS7zZvI8bbWk/ytfbaxlO3Zl0y22I10pvXozn6Gti0xG+J9gsHE4QWeB1tOTA92dASyDNkl1ZxMEaEBAOsD8MmAYQDTboAFjDNBEqqtDWBlif6NaRIH4GbhLcFEPJOK/35PjwW8f/piZG59C317l8xudTOlWvBp69UIzYOJfFGzGgvLYhA439eGENYt0dJxu2++tZU/l/WQwsY+M5LukM9RkAHbHg7Q5f58FNkSNjUDv1y0kPehNph8wLZJlcXZymOeLaVbBZrr1uzusGIHaHt23fMWutwAm3fozSfSnH/ovilGa+7TsweD5pCzy8Rna7HnxoICwAkdnxWr1DVa5gUm9wa9JwcjB4MMLEVITJIBEYQ6pMpgA9Pg7RhV7rZWRjZEWft6fsNAJPEQxpBGBF0TqO9Gh8fWgNoRtkWP3atuwud6afCENmsFdn9qPpc8F8nimbtqXw3KNLjaRTgdenDN5YyAAabBE7Xtss6Lp1etGvdz3l2uzYHjHcy4MwbZhfxrFC7gx3M0vw2Cau1WNf18M31HcotAvOGDNmKMi/ZRk5aXsdyaDSikyINxtZ5uSxPXLjTTeeVQ/v3RdeJH944AGZmprOWcDXIx43ik5ierMyxFZzajZKGelBM3nCOn42IlaKOPiObELszsD3XEaQw0MKvGvw+kSIdV6qJ8ibhBqaJ4ieWGm79gTx+9t1pt6H5fYGY2VHpC9ab97ELxHIJgunpVw6zhy27NmmBNqBDv5sxVk7yJihto+WbHPfavab6w6U3nh4LYUj1bMfj+H0gC4RQYCS0w2V3vB6zuujtMlxqBqWXhxVSPBRnGoHakOhmZRNTqqbv1PvuG5eeM4/h/RuGza2TdqOQRU4Up0ZKvbnULXYKOVkQFdsxYUFkwSFfmNtOQ2YXf7tmo/PkW/edpv85ne/lwMHDpgyxEzY5uOa6NiwkmTTfUESTldLMzKc6gq/V+e4un7JUSM6UWuo0gPtgYY2aKA0O/z+dpseJZT7OJy0Rq0z58aN8iZC6cKmDYnBXr/fgLQysxPKyx0dfTZxhNfH7bw2e17N9rGRNSmuDbIznguCzZMBj3Zc/6EB/nyd7RPAn/eWs58LArm5jGfDKdPv06NXj8BpJx9MqTEN60FcILtLdXlcs99oWkkDqogQD6oIuKB+VA/2t9tkoDPUfm67hS5blREGDI5pCYD0KLvmHmXHWAZ06lfQnMmhbfHnEJtsZ0dJPK2/i3IdCMD585+U0dGRrAnPVK7XSa40ySuzjHqmbZqivsVKO2P9iuAD89maDs18TTLU38qaCmM07pkQk2tXGho0dVLdrPP4Wg0LTRv7xW9q/zhqx7CeUP0WhAlzDx2wDBgNZRD+njKiA2tMGwQMcCel3iYtp3hkJ+2oT3uCoVRIk0kxjwQ31JmZmTefAcdHB/N8bdIzn1tsaU0zGFwoXVzIdzscoqH9KV4cpXjxRKOmhNXNO9P3Q4aNnoVsmOEITo9w6qD0tfFoZ9NhzYpnRAQ279aupmzGYPPSrZQvNke91jwNhXrQs6AqbylvcDgZNb3CBkIeZ06VygXvfi+tyOI9PTlexllLWW9ics2zc1UcgjXt1GSwlSWsYt2m24hpBmzl603mYHIEpANc00ooZ6CrIWzPpWxG7kFH1AFlAE8UNWX0LOjHr5IshgOqMGhIAknAhGKarTlpkwE2NvUB5gHWmIidsWBUYF1Hf2oCxCYvyOhNvPkABODsbBDvet1Xd9IFhtyMJm2CQsMD4bgJx/X0JFMzO7m+Dhufdefsu3rn3MtshY8MwGS36Ucb88UgHVxYZrSRpMEYWmNCL4XBAwkLq2+GjeyAN4I3ism86V6K1YXWmRNGSkQYCPD+BRC7ZdNaee+FF1GPesmSJbS98qznUr9e5+UGoO8x68RlKkfPRm9I1EyeXXxrzqEX5fhpYBE/tGwERkmyx4KVIHUk1NMufex1t/8dN7MGX19o9PA6Cadxmd8gGiQIXvOYDMTqrMtu5vNBoHHmTIJDLYMTQYidG5AfyOaOVqtQUk+zDHMA4M5YiJNM3put/ea5nJrWd/18EH4ZSYa07vAL76zRFLOTB6png4xBJLxDrWFQ5rLWZ4pzRbRusfrJ7+aU1UiDdkw4roeLqkB0OxnP4VhAA5SIGUewR8bScT5HPWq1PsXz1wYqGWoyLn4De8MAv7NG+rub5Ktfm6tO4O+9kGA0XEEXLV4kI8PpWVzHXGH1oBhmSrE+fckKK71CuEZLjrhyJAE8QzrDuH7DBjdpx9shye5m61g7cm7E7iD26ZAK/25jNgfttQPutgDU6476zOv3kRxBKIV+mrKybRzxnVTH0KjOlZGxnRiLG6TPPuqR3UZvFohupnqjhkQMv7kMOD01OdfrJW00+nM6ykSgvnsgjvPN9K643+qsjPH3umZ1smSq2LGndUdbwPKcWu94nnv+4g0A/OOL6xmHDPAAbYviRN0M6nTO7xq1zIo3XVVWh60YTwRYyWsrkjtBa+88I+1NVXLZFR+hnQFsIaBp8r73f0Du+P7/k9HR0TBTnhVYQQHi1TDtcU5iriJEEFuyJsUli/3IHTVm9+iQTn0GrVNOG9CNQOTIEwHo1zbhZIxYToNoJY1dU8+IXjdrUuljqcImxoBoLERp1m0muYF2tjGtSX2ig5vVpy1DDgVB0YH1KEB1XZ2YnBid92aP4AsCxJJ28LQ/BN4sWMMKfce7vObQnY2uUJcph69PMTJmAT0WcEGR9bRzjRtVqzOM3HB34673JkjrlbaAg7Fe6esIX5seiMzqsnUqMsaO1bN5toRI2iSljawRZsBotRzYvUku+uCHmAEvvOiDFLu87757jLY/HbRpchXCCEZPTc9i3ryRYJNLkKDc0LqrjbPasJzV36FwDAineK2GASJIRwKgHDOSQY/V1IOhQUT5g/fFTbr1WuS8d8j8aR0aDBqu6gwkZ9F4o4SmCJ0vno+THLxzV3goQgSCTWZSycEgdLylJmRqcjyW3V5LZFO7dVSO6k+M6XgrKF1ht4Nzx1godFnbmRKq3oEJa0oiYYKhGn9xI5d2hbmwwxAO5nrXR2zMQFMdaemd6B20Hy/IBv69euGTActEQKLwRkEd55y1khDMru1r6QzEx8WXyP333ydt9cfISXQVL5eK879nhTlnchboX31jk0Vr1FwRTGvuIV5rXA81064Lp4DS8dsDmsBmbrA3wFgqdzeRI2k3Hk4iZjyfKNn0iiq1hGE6yK5RQYC2MB+m6Te6cTuauRLQo4oP2X0cPeZ18Swe4K/pqckywHhvhfkyb8IgCheCzNZ+A6GYd3kNhRnUfgtIOLhgOtFQmbGMK6BaYBClB+8t3hxgFgTesHW3+HzaltRRF01PjmcvmHWMLMSthtKA7AjQRMbUV72Byt1Nzgwl+DUosLkcVLGdrBVQ7THc37ZppVx6xUf0cfkV8rvf/FxWLn1SCraskcqq01JZVSVnqqulvb1Npqey9hQwBXRw+k/5IGfZRFOB9IoyQ0HrAR53rMeC0bbPdhX4JS46mg6NBjPcSHLWzeGkWjZblkAcH3QEg1DMQCQgDsQjE9EAF6HO67el+UHjCOq172IwkjxrJAeDtGKInXPDgBnLzPOtNsf8xq3O87/rXDiR0932ZUdyKQ20cBx6bcIX3smvcyB0MIzsVEHf+X48QtIDQQHBaw7dsOucRclPWxC79rQetxp8rFH69U4HDQoUqShlPA5y2ajpxDZpO7OPXV7lsZ1yzbXXhSD88GVXyEev/bhcfMmlzIiXXH4FsyP+/c+3/G85WlwyyxiHU5I30Ex0rFCDLp1t7NLZOXq2GagNGCdJCwn9GLDTHFSB5YbBRD5AyNrnJnOaSX0fMoYFpoxXORjXWbSfKv3WFYPswP0cQGF2onm37c0M6m/83HO+ejk1OZ6XFYvMhIfjaONWK+qT6gkjOcruGpN5ZNBHQYlACWKmYgaLBHo+6wjbCSFsA4qWYX/erQ0Ze8SPXGd5ZJzgkDNtIdg8mg7DeiiF4oKCCg8qU9jVOLNfWiFvdmaPjpvqj8qC+Q+SmIAAvOTyK/nx4ksukw9fdrlcfOll/Ds/XnqZ/OHBh2bZUkxMjM1yDshlzXjgTZo8iU9zlHDbE5oJYoQxlWxjPUyQPWo3aERveNZ+fQHvY2lhShFuaaFCAANhZOq1u5Y7nTZ1abJpiF6flCl09TP7toSbgZ4udl090ehRHnfCydu3+YbGZGpybC54gS6pFrridG+oEbU47mYmGjOYY9i6MD9+nVSAhWxnRnu3zLox1RvAUE/vJFAyY3ZQytYpXE7j8lmx75sQEhpNhwtK+lKsTvq6aiQOtXm4oTMTFislvqWMxNKeMyVkNmNpqPRwoTzx6O/lM5+5Sa766MfkS7d+Qa6+5hoG3aUWlHjcc+99s4STZssVvxLIrK4K4Q6i3rEG14CEBh93N9zQh8dcNBAT8IYT+7PZr775iVCXO0BOto/jnjyC4+GE8hn7EBudxkB04A4Jr5M2GP22CjpkK7EUB7B6E7/HJzSE3iZGz8/mm/EDL5icGClzmpFzBXUtMh7uaqX/9IRtNRzJntG8YfCg0vqvJywjkXo/4IHVm9NgREPT4fjiWCA0aPPDN2Vk0N7EliB/RkyLG2QVEie7uNIWhRBwR0mX72oqka5GsJYPUQ0BtHtssUE1Cn5rG1Yuki988YvMisiGOJ5/+/s/zArAmRz3AAek/RRxStsEAfWUPXc7PYasmM/x0kvZvJWvc0RHXf59nGebeKdqbMcJifm0R6G0QRJms4yhGNWuXLY38BCt0SAmya7cG7v2Wd2ucv1MWIqBTtrbX8eqFeqok+MIxLGYU7a80OfRYB/9aGRwGITgS+dOwVdmRkdgOCcNH0znHK1ZaEbpXBQnt7Ge1pwAvWP2+/uJD/q8FfVMb6SaG2QIQOB9+DfczRFkkfrDtli0TyI1h7lQxBXK2oNcyeysP0jFhPkP/YoYIQJPA/ByWb78pVldcFjQcttY80vWZk3Hgq5vHYgCRmkby8VYma1iOWD6cCDUhqUrnzdj1cHqdD+Og/6O0eiUCeNNXHsQL9cs2BI6bp9VO5UfY0otqXoNS8xkheTHM389s+o/Iq6OD6NpyZ8wBSxy3gy3yx6xPVb3dVotFwkZzY9UnwNnjDqux0/CAOPW2fNPo7ArUSGiw3GrEfE7/fgFvEKoJYL9Cl0a72o0pYLmMmqzYNUS+77MiMiCdYels+awNJ3aJR3Vh7iA9I1vfIXZz+tCuES+tPylAMkEkNonIIYbThshgU2AzaI9kyiwnArjQeUrJoOkXXbpa9SYRj0MKNXozs7np2wXZ9y7XrsxnUDshN8wj7YdEl8nIMnVThovY0bNQCgX6WAWVlrb3L/7z/pnZnpqnrIuYpwTphhQUdN60Zmlkydx3KppYU/ADnNBaNR8CCx2zX1tYZfYd4apLt/doF1d3NgzfU3G0q3RjTGsLGKY3t1EiAPHL+a+4LlhthlrPiad9RCy3Cbtp/dKrKmEi0NoUjpqDkpr9X6JNpbJnOuvpxM57MEQfCCobtiwYdYawGt3RkjiyNlRdmzSd2j8OGWmGs/YY5gZzYkfnkld2B3XLSsUP5kNdAtCzVTDNp3C5Cdtc+F4qJNTdtymrOvVqUpnmCU7XObZOtuInkOo5W1WSpgzZcpXfpcPG5g9buTWQK40MNM7Q1fD8q6Zn7Oph3aFRmOHzl6kMqxj4vv14qpuChQLqBzVroN1BB4/T7kz7XgpYFm1m+uVWJFEzQdBI+BfqBXbaw9TVqP6+E658aab5IqrrpaPfPRjctU11/KxYd0qVXD19c0ASGf97XLB4Ry2yCzGzKRNMKZMTYLNno0RfVneM6vXlP71DpD7Q+f0DrUomD8yGM8JtGgoedy3mbWoaS461ObsJqv5yybGMnP/7m/pz8RYet6EGco4LueC404I9WLWjyVnyODCYDymRjS9wd41O/loD9tnxBUxX05EczbHaqW79biqENQfZcChTkRXiZqvp+WkHrs1h6T1zD6J1hdz7RFL5fi9/NkdVaEePF22kwGHrIcA9Mem/HV87uqfNzPL1ck28mKcYztBYWoipqY/r85yD8gN3lwpYu9sNZNOhoBkA5KD+ykDSRk5rj6La5IxsiqeY8bo+d7YcISn+xthCjOWkxwAw8EbGo3nOVuxPN9/QO/CxZsY1/rB/EXAts7zi+mYlS8MKT2+RXqjDSYl0R3o96FjTnZpg2G+ZxzK885uD+Mk3NHROj1Gob3SVnNA4s2nJFJ7iAEN9Svs6fY0ou47QtAVNSGWwLtNsw/B2Vl3RFrO7JcbPvVpBiA+Xn3NtfLRj31c9uzaruNIc3DKecx9LZR1tlMidz48E+bM7gY1HATaCSybQ6mqyg4Hje3cIFSmkU09nBFttDPX5w7NibnTh01Hvo6ZudgF+psNuNfDEV/vTcDngKDjDXvllVfznE82blDFhNVN0Cl2kNVJpiyQM71WQ6UDREE5Nxu3ofZD9ms9vVdaqnZSlg16MO2V+1WAsqHYXModDyxWnRcoGDSfkI56Vb6CetV3v/ttue76T8r1n7hB5lx/g1x3/SekrPQI39jXTD3m/SWlymu1dGYH5XRgm0+FbbuxUFu69YXDYlqKJLIuA6bNnbsm4Ec6TIYQcHgO/6UC7q2qbIXayHaJvSDPOrRPiSvwZ3l306poRdf1Id0z4cZYswx01lCjpaUSgpF7qOmCDIdZMKXWTu9l4AGe6aAs7x5ihFHigsdJDAAuuGPLKrn99tvk69/4OjmDX/6XL8vpU2VWA2Yz4JsQd8pXDqayd3KnKF4jT4Zl++msW73Vfw71+EniUI9r3ahx+EgZpJPxu1ACIOjeibY/oT8DXeHpqYl8rZumg8zGLOfM6al8r5u84Pc73cdPI0aMdS8OCu/gmDYpCooFRU6zhkR3jEYFmCFqQV9XJD091iilR/bJQw8/Ig88+CBJqv3xqBw+coQL7lBPgJ/eX648kZkbmNrDSTuKs4LsTvzVG3EiK7qkkA/t0iACiWwGpTL8HbAYdnOnpybeCbRz0VEj0FQkiAV67JVXXp3ndRYuOrSp8RFvwvT0JN+EibF0/sRYuszHhiOkaA0GOtKs+arNoale4ITX3pYsBSzot3RI8ZGDUlhYIG2tjVJRXiZPPZUnixYvkf0HDoKM8Bd3iqiTfarkhILsCC8d2OiwJ0OAI4vhtU9PTc6bmZl+J8DOI9idNzkxkvfnODWdZXwYJgg+uZkILO9+mx4kDJhtC902N/8HojYuiweoAt+L7Ldq9WpZ+sIL8vzSF2TRoiVSdfpM2Zt5bWpPOxGynNeAOW7xZRNj6XeC7W/1D0wWZ2ZemedqrZPjI5AcyR8fHYz5GEt5it02ssqKH2VscceH+FxBHB+WSFuDLF+xQl54cZksfeFFBiL2ht/sjB37OMzgU5PzcrtoZMh33sH/Oh35vNf5PFi8MR/yu/B5AGexcG5NDokWqW6JdbbKipdXykvLl8vLq1bLho0b5cyZM/LOVX7nz1sE0DNzUcSjARofHcLRlz8+ksIkoCxLRUsSr6yqrJB9+/dLRcVJqa6plbb29ney1Tt/3n5w3Y/FVKJ3TrynOz+VTMxLJFPvBN9b+PP/AZNp8iB0ME/gAAAAAElFTkSuQmCC';

// v5 masks: pushed up onto the upper left of the head, resting on the hair at the side. The long
// axis runs from upper right (forehead) down to lower left (chin) at about 48 degrees, and the
// face is turned toward the upper left in a 3/4 view: the oval is squeezed across its width, the
// features shift toward the far side, and the far eye is smaller and narrower than the near one.
// It never reaches the eyes (lowest point head-frame x < 72) and stays inside the canvas (y >= 27).
const MASK_OVAL='M0 -30C17 -30 24 -14 23 2C22 20 12 30 0 30C-12 30 -22 20 -23 2C-24 -14 -17 -30 0 -30Z';
const maskPath=(d,fill,w)=>`<path d="${d}" fill="${fill}" stroke="${INK}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const holes=pts=>pts.map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.6" fill="${INK}"/>`).join('');
const EAR_L='M-21 -12L-17 -36L-4 -26Z',EAR_R='M21 -12L17 -36L4 -26Z';
const INNER_EARS='<path d="M-16 -20L-15.5 -30L-8.5 -25.5ZM16 -20L15.5 -30L8.5 -25.5Z" fill="#E8A0A8"/>';
const catEye=fill=>`<ellipse cx="0" cy="0" rx="5" ry="3.2" transform="rotate(-8)" fill="${fill}"/><ellipse cx="0" cy="0" rx="2" ry="2.6" fill="${INK}"/>`;
const catMid=lod=>'<path d="M-2.8 5H2.8L0 8.6Z" fill="#E58C9A"/>'+line('M-5 11C-3 14 -1 14 0 11C1 14 3 14 5 11',INK,1.8)+
 (lod<2?line('M-11 8L-22 5M-11 11.5L-22 12.5M11 8L22 5M11 11.5L22 12.5',INK,1.6):'');
// Each mask has a base (outline, ears, patches; not shifted), one eye drawn for the near (right)
// side at the origin and mirrored for the far side, and mid features on the centre line.
const V5_MASKS=[
 {name:'冰球面具',en:'Hockey mask',
  base:w=>maskPath(MASK_OVAL,'#F1ECE1',w),
  eye:()=>`<path d="M-6 3C-4 -4 3 -6 6 -1C5 4 -2 6 -6 3Z" fill="${INK}"/>`,
  mid:lod=>lod<2?holes([[-8,-21],[0,-23],[8,-21],[-4,-15],[4,-15],[-16,7],[-11,11],[11,11],[16,7],[-6,19],[0,21],[6,19]])+line('M0 -2V9M-4 12L-2.5 15.5M4 12L2.5 15.5',mix('#F1ECE1','#000000',.35),1.8):''},
 {name:'小丑面具',en:'Clown mask',
  base:w=>maskPath(MASK_OVAL,'#FBF8F2',w),
  eye:()=>`<path d="M0 -11L4.5 0L0 11L-4.5 0Z" fill="#6E9BD6"/><ellipse cx="0" cy="0" rx="2.4" ry="3.2" fill="${INK}"/>`,
  mid:lod=>maskPath('M-15 9C-9 22 9 22 15 9C9 15 -9 15 -15 9Z','#D9534F',2)+`<circle cx="0" cy="3" r="5.4" fill="#D9534F" stroke="${INK}" stroke-width="2.4"/>`+(lod<2?'<circle cx="-1.6" cy="1.4" r="1.5" fill="#FFFFFF"/>':'')},
 {name:'英雄面具',en:'Silver hero mask',
  base:w=>maskPath(MASK_OVAL,'#C7CCD2',w),
  eye:lod=>`<ellipse cx="0" cy="0" rx="8.2" ry="5.4" transform="rotate(-22)" fill="#FFE7A1" stroke="${INK}" stroke-width="2.4"/>`+(lod<2?'<ellipse cx="0" cy="0" rx="3.4" ry="1.8" transform="rotate(-22)" fill="#FFFBEA"/>'+line('M-5 -17C-1 -17 4 -15 8 -9',mix('#C7CCD2','#000000',.3),1.8):''),
  mid:lod=>maskPath('M-2.6 -30L2.6 -30L2 -8L-2 -8Z','#E7EAEE',2)+(lod<2?line('M-7 16H7',INK,2.4):'')},
 // Silver shaded cat: a soft radial shade from silvery white to grey at the edges and ear tips.
 // The gradient ids are shared by every silver cat on a page; all copies are identical.
 {name:'银渐层猫面具',en:'Silver cat mask',
  base:w=>'<defs><radialGradient id="fuli-avatar-silver-cat" cx="0.5" cy="0.55" r="0.62"><stop offset="0.45" stop-color="#F4F5F6"/><stop offset="1" stop-color="#9EA4AB"/></radialGradient>'+
   '<linearGradient id="fuli-avatar-silver-ear" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#E9EBED"/><stop offset="1" stop-color="#7E858D"/></linearGradient></defs>'+
   maskPath(EAR_L,'url(#fuli-avatar-silver-ear)',w)+maskPath(EAR_R,'url(#fuli-avatar-silver-ear)',w)+INNER_EARS+maskPath(MASK_OVAL,'url(#fuli-avatar-silver-cat)',w),
  eye:()=>catEye('#4FA392'),mid:catMid},
 // Bi-colour cat: white with a bold orange patch over the far ear and around the far eye.
 {name:'两花猫面具',en:'Bi-colour cat mask',
  base:w=>{const patch='#D98A3D';return maskPath(EAR_L,patch,w)+maskPath(EAR_R,'#FBF8F2',w)+'<path d="M16 -20L15.5 -30L8.5 -25.5Z" fill="#E8A0A8"/>'+
   `<path d="${MASK_OVAL}" fill="#FBF8F2"/>`+`<path d="M-23 2C-24 -14 -17 -30 0 -30C1 -24 -1 -17 -3 -12C-2 -5 -4 1 -9 4C-14 6 -20 6 -23 2Z" fill="${patch}"/>`+
   `<path d="${MASK_OVAL}" fill="none" stroke="${INK}" stroke-width="${w}" stroke-linejoin="round"/>`;},
  eye:()=>catEye('#E2B23A'),mid:catMid},
];
// The rare mask is Jevons' own cat drawing, embedded as a PNG. It sits in the same place and 3/4 turn
// as the other masks, a little smaller because the whole cat is taller, with a soft ink shadow so
// it rests on the hair. The filter id is shared by every copy on a page; all copies are identical.
const V5_RARE_MASK={name:'愁眉猫面具',en:'Worried cat mask',
 picture:()=>'<defs><filter id="fuli-avatar-cat-shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0.8" dy="1.2" stdDeviation="0.9" flood-color="#22303D" flood-opacity=".35"/></filter></defs>'+
  `<image href="${RARE_CAT_PNG}" x="-28" y="-24.68" width="56" height="49.35" preserveAspectRatio="none" filter="url(#fuli-avatar-cat-shadow)"/>`};
// 3/4 view: width squeezed, features shifted toward the far (left, -x) side, far eye mirrored and
// smaller. Drawn in the head frame over the fringe; outline width is divided by the 1.2 scale.
const TURN='scale(.78 1)',SHIFT=-3.5;
function v5MaskMarkup(index,w,lod){
 const m=index<V5_MASKS.length?V5_MASKS[index]:V5_RARE_MASK,ey=-5,mw=Math.round(w/1.2*100)/100;
 const place='<g data-part="mask" data-style="'+index+'"><g transform="translate(70 76) rotate(48) scale(1.2)">';
 // A picture cannot move its own features, so the turn is a squeeze plus a slight skew.
 if(m.picture)return place+`<g transform="${TURN} skewY(-6)">${m.picture()}</g></g></g>`;
 const far=`<g transform="translate(${-9.5+SHIFT} ${ey}) scale(-.7 .86)">${m.eye(lod)}</g>`,near=`<g transform="translate(${9.5+SHIFT/2} ${ey}) scale(1.04 1)">${m.eye(lod)}</g>`;
 return place+`<g transform="${TURN}">`+
  m.base(mw,lod)+far+near+`<g transform="translate(${SHIFT} 0)">${m.mid(lod)}</g></g></g></g>`;
}

// v5 site signature: a tiny, low-contrast line of text that reads as texture at normal size and
// only becomes legible when zoomed. Placement comes from its own seed namespace, so it never
// shifts trait draws; about a third of seeds carry none. Never over the face.
const SIG='有点.意思.com';
// Garments with a plain chest: sweatshirt, hoodie, turtleneck, T-shirt.
const PLAIN_CHEST=[0,4,5,6];
const V5_MARK_NONE=1/3;
// Which spot a seed's signature takes for these traits: 'frame', 'chest', 'lens' or null.
function v5MarkPlace(seed,t,hasLens){
 const random=seededRng('mark:',String(seed)),skip=random(),pick=random();
 if(skip<V5_MARK_NONE)return null;
 const spots=['frame'];
 if(PLAIN_CHEST.includes(t.outfit))spots.push('chest');
 if(hasLens)spots.push('lens');
 return spots[Math.floor(pick*spots.length)];
}
const lum=hex=>{const [r,g,b]=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));return .299*r+.587*g+.114*b;};
// A shade a little darker (or lighter, on dark cloth) than what it sits on.
const tone=(hex,k)=>lum(hex)>110?mix(hex,'#000000',k):mix(hex,'#FFFFFF',k);
const sig=(attrs,fill,size)=>`<text ${attrs} font-family="sans-serif" font-size="${size}" text-anchor="middle" fill="${fill}">${SIG}</text>`;
// Markup per slot: frame (canvas, behind the hair), chest (canvas, on the garment), lens (head frame).
function v5MarkMarkup(place,p,dark,lod){
 const out={frame:'',chest:'',lens:''};
 if(!place||lod===2)return out;
 if(place==='frame')out.frame=sig('transform="translate(251.6 128) rotate(90)"',tone(p.bg,.16),3.2);
 if(place==='chest')out.chest=sig('x="164" y="251"',tone(p.shirt,.2),3.4);
 if(place==='lens')out.lens=sig('transform="translate(157 140.5) rotate(-8)"',dark?'#FFFFFF':'#22303D',2.2).replace('<text ','<text opacity=".3" ');
 return out;
}

// v5 renderer: v4's character with two-colour outfits, sunglasses, rare masks and tilted beanies.
// Traits draw from the '5:' namespace; layer assembly is shared with v4 (composeAvatar).
// Accessory indexes: 0-6 as v4, then sunglasses, then the masks, then the rare mask.
const SHADES_FIRST=V4_ACCESSORIES.length,MASK_FIRST=SHADES_FIRST+V5_SUNGLASSES.length,RARE_MASK=MASK_FIRST+V5_MASKS.length,BEANIE=4;
const V5_ACCESSORIES=[...V4_ACCESSORIES,...V5_SUNGLASSES,...V5_MASKS.map(m=>m.name),V5_RARE_MASK.name];
const V5_HAT_POSES=['正戴','向左歪戴','向右歪戴'];
// One seed in fifty wears a mask. Of those, one in five hundred gets the rare mask; the rest pick
// one of the regular masks, equally likely. A third of beanies tilt.
const V5_MASK_RATE=0.02;
const V5_RARE_MASK_SHARE=0.002;
const TILT_RATE=1/3;
const V5_OPTIONS=Object.freeze({palette:V4_PALETTES.length,skin:V4_SKINS.length,hairColor:V4_HAIR.length,hair:V4_HAIRSTYLES.length,eyes:V4_EYES.length,brows:V4_BROWS.length,mouth:V4_MOUTHS.length,outfit:V5_OUTFITS.length,outfitColor:V5_CLOTH.length,outfitAccent:V5_CLOTH.length,accessory:V5_ACCESSORIES.length,hatPose:V5_HAT_POSES.length});
// Distinct looks: the hat pose only changes a beanie, so it multiplies that one accessory.
const V5_COMBINATIONS=Object.entries(V5_OPTIONS).filter(([k])=>k!=='accessory'&&k!=='hatPose').reduce((a,[,n])=>a*n,1)*(V5_OPTIONS.accessory-1+V5_OPTIONS.hatPose);
const isMask=t=>t.accessory>=MASK_FIRST;
function getTraitsV5(seed='fuli',overrides={}){
 const random=seededRng('5:',String(seed)),o=overrides&&typeof overrides==='object'?overrides:{},t={};
 // Every draw is taken whether or not it is overridden, so overrides never reshuffle other traits.
 const pick=(key,sample)=>{const v=o[key];return Number.isInteger(v)&&v>=0&&v<V5_OPTIONS[key]?v:sample;};
 for(const key of ['palette','skin','hairColor','hair','eyes','brows','mouth','outfit'])t[key]=pick(key,Math.floor(random()*V5_OPTIONS[key]));
 const [main,accent]=V5_COMBOS[Math.floor(random()*V5_COMBOS.length)];
 t.outfitColor=pick('outfitColor',main);t.outfitAccent=pick('outfitAccent',accent);
 const m=random(),a=random(),rare=random();
 const mask=rare<V5_RARE_MASK_SHARE?RARE_MASK:MASK_FIRST+Math.floor(m/V5_MASK_RATE*V5_MASKS.length);
 t.accessory=pick('accessory',m<V5_MASK_RATE?mask:Math.floor(a*MASK_FIRST));
 const tilt=random(),side=random();
 t.hatPose=pick('hatPose',tilt<TILT_RATE?(side<.5?1:2):0);
 return t;
}
const v5Palette=t=>({bg:V4_PALETTES[t.palette].bg,shirt:V5_CLOTH[t.outfitColor].hex,accent:V5_CLOTH[t.outfitAccent].hex});
// A tilted beanie rotates about the crown and slides toward the low side; the cuff then reaches
// the brow line on that side and lifts off the hair on the other, never down to the eyes.
const TILTS=[null,{deg:-12,dx:-4},{deg:12,dx:4}];
function v5Accessory(t,p,style,w,lod){
 if(t.accessory>=MASK_FIRST)return {neck:'',front:v5MaskMarkup(t.accessory-MASK_FIRST,w,lod)};
 if(t.accessory>=SHADES_FIRST)return {neck:'',front:v5Sunglasses(t.accessory-SHADES_FIRST,lod)};
 const out=v4Accessory(t,p,style,w,lod),tilt=t.accessory===BEANIE&&TILTS[t.hatPose];
 if(tilt)out.front=out.front.replace('<g data-part="beanie">',`<g data-part="beanie" data-pose="${t.hatPose}" transform="translate(${tilt.dx} -2) rotate(${tilt.deg} 128 100)">`);
 return out;
}
// A mask rests on the upper side of the head, where the top hat and music headphones would go.
const eggClash=t=>egg=>isMask(t)&&(egg.id==='tophat'||egg.id==='hiphop'||egg.id==='pop');
function getEggV5(seed='fuli',overrides={}){const t=getTraitsV5(seed,overrides);return v4ResolveEgg(seed,t,V4_HAIRSTYLES[t.hair],undefined,eggClash(t));}
function createAvatarV5(seed='fuli',config={}){
 const c=config&&typeof config==='object'?config:{},t=getTraitsV5(seed,c.traits);
 const lens=t.accessory===1||t.accessory===2||(t.accessory>=SHADES_FIRST&&t.accessory<MASK_FIRST);
 const p=v5Palette(t),place=v5MarkPlace(seed,t,lens);
 return composeAvatar(seed,c,t,{id:'v5',palette:p,outfit:V5_OUTFITS[t.outfit].draw,accessory:v5Accessory,eggClash:eggClash(t),
  mark:lod=>v5MarkMarkup(place,p,t.accessory>=SHADES_FIRST,lod)});
}

// Friendly character names, deterministic from the seed. Curated given and family names are
// combined at random; lists avoid famous given+family pairings, and Chinese pairs never repeat
// a character. A name is a display nicety, not an identity: different seeds can share one.
const NAME_LISTS={
 es:{given:['Lucía','Mateo','Valentina','Joaquín','Inés','Tomás','Carmen','Alba','Bruno','Elena','Hugo','Martina','Pablo','Sofía','Nico','Julián','Marisol','Rocío','Emilio','Ximena'],
  family:['Navarro','Bermejo','Ortega','Romero','Vega','Delgado','Campos','Serrano','Robles','Prieto','Paredes','Solís','Aguilar','Castillo','Ibarra','Marín','Quintana','Arroyo']},
 zh:{given:['知夏','予安','青禾','南乔','清和','若溪','听澜','一苇','观月','时雨','小满','晚舟','明川','安歌','书白','念初','嘉木','云舒','知远','星遥'],
  family:['林','周','陈','许','沈','江','苏','程','叶','顾','宋','白','秦','夏','温','陆']},
 en:{given:['Milo','Iris','Theo','Hazel','Felix','June','Arlo','Wren','Oscar','Mabel','Jasper','Ivy','Rowan','Clara','Ezra','Poppy','Otis','Nell','Ada','Silas'],
  family:['Reed','Hart','Finch','Brooks','Lane','Wells','Hale','Quinn','Sutton','Marsh','Ashby','Fairley','Penrose','Holloway','Pike','Calloway']},
};
const NAME_LOCALES=Object.freeze(Object.keys(NAME_LISTS));
const pickFrom=(list,random)=>list[Math.floor(random()*list.length)];
// { name, locale, given, family }. `locales` narrows the mix; unknown entries are ignored.
function characterName(seed='fuli',config={}){
 const asked=config&&Array.isArray(config.locales)?NAME_LOCALES.filter(l=>config.locales.includes(l)):[];
 const locales=asked.length?asked:NAME_LOCALES,random=seededRng('name:',String(seed));
 const locale=locales[Math.floor(random()*locales.length)],lists=NAME_LISTS[locale];
 const given=pickFrom(lists.given,random);
 let family=pickFrom(lists.family,random);
 // A family character repeated in the given name (白书白) reads oddly; step to the next family.
 for(let i=lists.family.indexOf(family);locale==='zh'&&given.includes(family);)family=lists.family[i=(i+1)%lists.family.length];
 return Object.freeze({name:locale==='zh'?family+given:given+' '+family,locale,given,family});
}

// Public API. Render version 5 is the default; { version: 4 } and { version: 3 } redraw stored
// identities byte-identically.
const VERSION='5';
const VERSIONS=Object.freeze(['3','4','5']);
// Background tones (v5 uses each palette's bg; v4 also takes its shirt and accent).
const palettes=V4_PALETTES;
const hairColors=V4_HAIR;
const outfitColors=Object.freeze(V5_CLOTH.map(c=>Object.freeze({...c})));
// Curated [main, accent] outfit colour pairs that random characters draw from.
const outfitCombos=Object.freeze(V5_COMBOS.map(pair=>Object.freeze(pair.slice())));
const masks=Object.freeze([...V5_MASKS,V5_RARE_MASK].map(({name,en})=>Object.freeze({name,en})));
const maskRate=V5_MASK_RATE;
const options=V5_OPTIONS;
const combinationCount=V5_COMBINATIONS;
const v4Parts=Object.freeze({hairColor:V4_HAIR.map(h=>h.name),hair:V4_HAIRSTYLES.map(h=>h.name),eyes:V4_EYES.map(e=>e.name),brows:V4_BROWS.map(b=>b.name),mouth:V4_MOUTHS.map(m=>m.name),outfit:V4_OUTFITS.map(o=>o.name),accessory:V4_ACCESSORIES.slice()});
// Display names for every selectable v5 part, in trait index order.
const partNames=Object.freeze({...v4Parts,outfitColor:V5_CLOTH.map(c=>c.name),outfitAccent:V5_CLOTH.map(c=>c.name),accessory:V5_ACCESSORIES.slice(),hatPose:V5_HAT_POSES.slice()});
const v3=Object.freeze({VERSION:V3_VERSION,palettes:V3_PALETTES,options:V3_OPTIONS,combinationCount:V3_COMBINATIONS,getTraits:getTraitsV3,createAvatar:createAvatarV3});
const v4=Object.freeze({VERSION:'4',palettes:V4_PALETTES,options:V4_OPTIONS,combinationCount:V4_COMBINATIONS,partNames:v4Parts,getTraits:getTraitsV4,createAvatar:createAvatarV4});
const versionOf=config=>{const v=config&&typeof config==='object'?String(config.version):'';return v==='3'||v==='4'?v:'5';};
const objectOr=o=>o&&typeof o==='object'?o:{};
function getTraits(seed='fuli',overrides={},config={}){const v=versionOf(config);return v==='3'?getTraitsV3(seed,objectOr(overrides)):v==='4'?getTraitsV4(seed,overrides):getTraitsV5(seed,overrides);}
function createAvatar(seed='fuli',config={}){const v=versionOf(config);return v==='3'?createAvatarV3(seed,config):v==='4'?createAvatarV4(seed,config):createAvatarV5(seed,config);}
// Opt-in easter eggs (render versions 4 and 5): createAvatar(seed, { eggs: true }) draws one for
// eggRate of seeds (one in eight); { egg: id } forces one; { animate: false } keeps it still.
// getEgg says which egg a seed would show.
const eggs=Object.freeze(V4_EGGS.map(({id,name,en,loop})=>Object.freeze({id,name,en,loop})));
const eggRate=V4_EGG_RATE;
function getEgg(seed='fuli',overrides={},config={}){
 const v=versionOf(config);if(v==='3')return null;
 const e=v==='4'?getEggV4(seed,overrides):getEggV5(seed,overrides);
 return e?eggs.find(x=>x.id===e.id):null;
}
// A still frame `seconds` into an egg's animation (`loop` seconds long), e.g. for GIF export.
function freezeFrame(svg,seconds){return v4FreezeFrame(svg,seconds);}
// Character names mixed across Spanish, Chinese and English, deterministic from the seed.
const nameLocales=NAME_LOCALES;
// nameDetails adds { locale, given, family }; config.locales narrows the mix, e.g. ['zh'].
function nameFor(seed='fuli',config={}){return characterName(seed,config).name;}
function nameDetails(seed='fuli',config={}){return characterName(seed,config);}

root.FuliAvatar=Object.freeze({VERSION,VERSIONS,palettes,hairColors,outfitColors,outfitCombos,masks,maskRate,options,combinationCount,partNames,v3,v4,getTraits,createAvatar,eggs,eggRate,getEgg,freezeFrame,nameLocales,nameFor,nameDetails});
})(typeof globalThis!=='undefined'?globalThis:window);
