/*
  Minify and validate question JSON files.
  Usage: node scripts/minify-and-validate.js
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const LOCALES = ['en', 'es', 'zh'];
const FILES = ['gov.json', 'history.json', 'civics.json'];

function readJSON(p) {
  const s = fs.readFileSync(p, 'utf8');
  return JSON.parse(s);
}

function validateItem(it, idx, file) {
  const fail = (msg) => { throw new Error(`${file} [${idx}]: ${msg}`); };
  if (typeof it !== 'object' || it === null) fail('item is not object');
  if (typeof it.id !== 'string' || !it.id) fail('missing id');
  if (typeof it.category !== 'string' || !it.category) fail('missing category');
  if (typeof it.text !== 'string' || !it.text) fail('missing text');
  if (!Array.isArray(it.options) || it.options.length < 2) fail('options invalid');
  if (typeof it.answer !== 'number' || it.answer < 0 || it.answer >= it.options.length) fail('answer index invalid');
}

function main() {
  let total = 0;
  for (const locale of LOCALES) {
    const dir = path.join(ROOT, 'data', 'questions', locale);
    for (const f of FILES) {
      const p = path.join(dir, f);
      if (!fs.existsSync(p)) continue; // skip if missing
      const arr = readJSON(p);
      if (!Array.isArray(arr)) throw new Error(`${p} is not an array`);
      arr.forEach((it, i) => validateItem(it, i, p));
      // Minify (no spaces/newlines)
      fs.writeFileSync(p, JSON.stringify(arr));
      total += arr.length;
      console.log(`Validated & minified: ${p} (${arr.length} items)`);
    }
  }
  console.log(`Done. Total items processed: ${total}`);
}

main();


