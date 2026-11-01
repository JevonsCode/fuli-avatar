import test from 'node:test';
import assert from 'node:assert/strict';
import {nameFor,nameDetails,nameLocales} from '../dist/avatar.js';

const CJK=/^[一-鿿]{3}$/,LATIN=/^[A-Z][a-zá-úñ]+ [A-Z][a-zá-úñ]+$/;

test('names are deterministic from the seed',()=>{
 for(let i=0;i<1000;i++){
  const s='agent-'+i;
  assert.equal(nameFor(s),nameFor(s));
  assert.deepEqual(nameDetails(s),nameDetails(s));
  assert.equal(nameFor(s),nameDetails(s).name);
 }
 assert.equal(nameFor(42),nameFor('42'));
});
test('the default mix covers Spanish, Chinese and English',()=>{
 assert.deepEqual([...nameLocales],['es','zh','en']);
 const count={es:0,zh:0,en:0},names=new Set();
 for(let i=0;i<3000;i++){const d=nameDetails('mix-'+i);count[d.locale]++;names.add(d.name);}
 for(const l of nameLocales)assert.ok(count[l]>800,l+' '+count[l]);
 assert.ok(names.size>500,String(names.size));
});
test('each locale produces names in its own script and shape',()=>{
 for(let i=0;i<500;i++){
  const s='shape-'+i,zh=nameDetails(s,{locales:['zh']}),es=nameDetails(s,{locales:['es']}),en=nameDetails(s,{locales:['en']});
  assert.equal(zh.locale,'zh');assert.match(zh.name,CJK);assert.equal(zh.name,zh.family+zh.given);
  // A Chinese family character never repeats inside the given name.
  assert.ok(!zh.given.includes(zh.family),zh.name);
  assert.equal(es.locale,'es');assert.match(es.name,LATIN);
  assert.equal(en.locale,'en');assert.match(en.name,/^[A-Z][a-z]+ [A-Z][a-z]+$/);
  assert.match(nameFor(s,{locales:['es','en']}),LATIN);
 }
});
test('locale filters ignore unknown values and never interpolate input',()=>{
 for(const config of [{locales:['xx']},{locales:'zh'},null,{locales:[]}])assert.equal(nameFor('same',config),nameFor('same'));
 assert.equal(nameFor('same',{locales:['zh','xx']}),nameFor('same',{locales:['zh']}));
 const odd=nameFor('<script>alert(1)</script>');assert.ok(!/[<>&"]/.test(odd));
});
