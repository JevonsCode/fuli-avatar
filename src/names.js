// Friendly character names, deterministic from the seed. Curated given and family names are
// combined at random; lists avoid famous given+family pairings, and Chinese pairs never repeat
// a character. A name is a display nicety, not an identity: different seeds can share one.
import {seededRng} from './v4/util.js';
const NAME_LISTS={
 es:{given:['Lucía','Mateo','Valentina','Joaquín','Inés','Tomás','Carmen','Alba','Bruno','Elena','Hugo','Martina','Pablo','Sofía','Nico','Julián','Marisol','Rocío','Emilio','Ximena',
   'Lucas','Daniel','Martín','Diego','Gabriel','Samuel','Adrián','Marco','Gael','Iker','Santiago','Andrés','Rafael','Mario','Javier','Manuel','Ramiro','Rubén',
   'Lola','Paula','Daniela','Carla','Sara','Noa','Julia','Valeria','Irene','Laura','Marina','Claudia','Vera','Aitana','Celia','Lara','Nora','Mía','Gala','Candela'],
  family:['Navarro','Bermejo','Ortega','Romero','Vega','Delgado','Campos','Serrano','Robles','Prieto','Paredes','Solís','Aguilar','Castillo','Ibarra','Marín','Quintana','Arroyo',
   'García','Fernández','López','Martínez','Sánchez','Pérez','Gómez','Jiménez','Ruiz','Hernández','Díaz','Moreno','Muñoz','Gutiérrez','Molina','Morales','Suárez','Ortiz',
   'Rubio','Castro','Ramos','Gil','Medina','Garrido','Cortés','Santos','Guerrero','Lozano','Cano','Méndez','Herrera','Peña','Flores','Cabrera','León','Vidal','Fuentes','Carrasco','Nieto','Pascual','Calvo','Gallego']},
 // Family names include the twenty most common (王李张刘陈杨黄赵吴周徐孙马朱胡郭何林罗高) and the
 // familiar 百家姓 openers. Given names mix quiet literary pairs, a few everyday ones and single characters.
 zh:{given:['知夏','予安','青禾','南乔','清和','若溪','听澜','一苇','观月','时雨','小满','晚舟','明川','安歌','书白','念初','嘉木','云舒','知远','星遥',
   '子涵','浩然','欣怡','雨桐','思远','佳宁','文博','晓峰','梓萱','一诺','可馨','俊熙','语嫣','明轩','诗涵','宇航','沐阳','安然','亦舒','景行','怀瑾','清越','砚秋','暮云',
   '川','远','晨','悦','禾','屿','安','默','遥','澈','然','岚','朗','昕'],
  family:['王','李','张','刘','陈','杨','黄','赵','吴','周','徐','孙','马','朱','胡','郭','何','林','罗','高',
   '钱','郑','梁','谢','宋','唐','许','韩','冯','邓','曹','彭','曾','田','董','袁','蒋','余','叶','程','魏','苏','吕','丁','任','沈','姚','卢','姜','崔','钟','陆','范','金','夏','傅','方','白','秦','江','顾','温','韦','邹']},
 en:{given:['Milo','Iris','Theo','Hazel','Felix','June','Arlo','Wren','Oscar','Mabel','Jasper','Ivy','Rowan','Clara','Ezra','Poppy','Otis','Nell','Ada','Silas',
   'Noah','Liam','Owen','Henry','Jack','Sam','Ben','Max','Finn','Jude','Toby','Alfie','Rory','Miles','Caleb','Eli','Reuben',
   'Ava','Lily','Grace','Ruby','Rose','Elsie','Alice','Evie','Freya','Isla','Maisie','Florence','Daisy','Matilda','Esme','Phoebe','Imogen','Willa','Beatrix'],
  family:['Reed','Hart','Finch','Brooks','Lane','Wells','Hale','Quinn','Sutton','Marsh','Ashby','Fairley','Penrose','Holloway','Pike','Calloway',
   'Bennett','Hayes','Foster','Fletcher','Harper','Ellis','Cole','Grant','Walsh','Price','Shaw','Bishop','Barnes','Blake','Lowe','Mercer','Sloane','Ward','Hollis',
   'Thorne','Vance','Winslow','Abbott','Bailey','Chambers','Dalton','Everett','Garner','Hadley','Kendall','Lyons','Norris','Prescott','Rowe','Talbot','Whitaker','Wilder','Ainsley','Booker','Pembroke']},
};
export const NAME_LOCALES=Object.freeze(Object.keys(NAME_LISTS));
const pickFrom=(list,random)=>list[Math.floor(random()*list.length)];
// { name, locale, given, family }. `locales` narrows the mix; unknown entries are ignored.
export function characterName(seed='fuli',config={}){
 const asked=config&&Array.isArray(config.locales)?NAME_LOCALES.filter(l=>config.locales.includes(l)):[];
 const locales=asked.length?asked:NAME_LOCALES,random=seededRng('name:',String(seed));
 const locale=locales[Math.floor(random()*locales.length)],lists=NAME_LISTS[locale];
 const given=pickFrom(lists.given,random);
 let family=pickFrom(lists.family,random);
 // A family character repeated in the given name (白书白) reads oddly; step to the next family.
 for(let i=lists.family.indexOf(family);locale==='zh'&&given.includes(family);)family=lists.family[i=(i+1)%lists.family.length];
 return Object.freeze({name:locale==='zh'?family+given:given+' '+family,locale,given,family});
}
