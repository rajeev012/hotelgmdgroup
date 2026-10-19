const fs = require('fs');
const path = require('path');

const bundle = fs.readFileSync(path.join(__dirname, 'official_site.js'), 'utf8');

// Search for hotel names or arrays of hotels in the bundle
const matches = bundle.match(/\{[^}]*name:[^}]*Mahipalpur[^}]*\}/gi) || [];
console.log('Matches with Mahipalpur:', matches.length);
if (matches.length > 0) {
  console.log(matches.slice(0, 5));
}

// Search for hotel names like "Shalimar", "Kian", etc.
const keywords = ['Shalimar', 'Kian', 'Urban', 'Paradise', 'Villa', 'Grand', 'Good Luck', 'Plaza', 'Regency'];
keywords.forEach(kw => {
  const idx = bundle.indexOf(kw);
  if (idx !== -1) {
    console.log(`Found "${kw}" at ${idx}:`);
    console.log(bundle.substring(Math.max(0, idx - 100), Math.min(bundle.length, idx + 250)));
    console.log('---');
  }
});
