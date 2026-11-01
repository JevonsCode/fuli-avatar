import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createAvatar} from '../dist/avatar.js';
const read=(p)=>readFile(new URL('../'+p,import.meta.url),'utf8');
test('project logo is reproducible from the existing generator',async()=>{
 const {seed,size,version}=JSON.parse(await read('scripts/logo-seed.json'));
 // The logo is a stored v3 identity; it must keep rendering byte-identically under v4.
 assert.equal(version,3);assert.equal(await read('dist/logo.svg'),createAvatar(seed,{size,version}));
});
test('header and favicon keep the static logo as the no-JS fallback',async()=>{
 const html=await read('dist/index.html');
 assert.match(html,/<link rel="icon" id="favicon" type="image\/svg\+xml" href="logo.svg">/);
 assert.match(html,/<img class="logo" id="logo" src="logo.svg" width="37" height="37" alt="" draggable="false">/);
});
test('Pages deploys only dist and tests before deployment',async()=>{
 const workflow=await read('.github/workflows/pages.yml');
 assert.match(workflow,/branches: \[main\]/);assert.match(workflow,/run: npm test/);
 assert.match(workflow,/path: dist/);assert.match(workflow,/needs: build/);
});
