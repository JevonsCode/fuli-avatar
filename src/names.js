// Friendly character names, deterministic from the seed. Curated given and family names are
// combined at random; lists avoid famous given+family pairings, and Chinese pairs never repeat
// a character. A name is a display nicety, not an identity: different seeds can share one.
import {seededRng} from './v4/util.js';
const NAME_LISTS={
 es:{given:['Lucía','Mateo','Valentina','Joaquín','Inés','Tomás','Carmen','Alba','Bruno','Elena','Hugo','Martina','Pablo','Sofía','Nico','Julián','Marisol','Rocío','Emilio','Ximena'],
  family:['Navarro','Bermejo','Ortega','Romero','Vega','Delgado','Campos','Serrano','Robles','Prieto','Paredes','Solís','Aguilar','Castillo','Ibarra','Marín','Quintana','Arroyo']},
 zh:{given:['知夏','予安','青禾','南乔','清和','若溪','听澜','一苇','观月','时雨','小满','晚舟','明川','安歌','书白','念初','嘉木','云舒','知远','星遥'],
  family:['林','周','陈','许','沈','江','苏','程','叶','顾','宋','白','秦','夏','温','陆']},
 en:{given:['Milo','Iris','Theo','Hazel','Felix','June','Arlo','Wren','Oscar','Mabel','Jasper','Ivy','Rowan','Clara','Ezra','Poppy','Otis','Nell','Ada','Silas'],
  family:['Reed','Hart','Finch','Brooks','Lane','Wells','Hale','Quinn','Sutton','Marsh','Ashby','Fairley','Penrose','Holloway','Pike','Calloway']},
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
