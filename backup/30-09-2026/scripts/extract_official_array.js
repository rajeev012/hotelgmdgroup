const fs = require('fs');
const path = require('path');

const bundle = fs.readFileSync(path.join(__dirname, 'official_site.js'), 'utf8');

// Look for const Nt=[...
const match = bundle.match(/const\s+Nt\s*=\s*(\[\s*\{[\s\S]*?\}\s*\]);/);
if (match) {
  fs.writeFileSync(path.join(__dirname, 'official_hotels_data.js'), 'module.exports = ' + match[1]);
  console.log('Successfully extracted Nt hotel array!');
} else {
  // alternative extraction: look for property_name
  console.log('Nt array direct regex failed, doing substring search:');
  const start = bundle.indexOf('const Nt=[{');
  if (start !== -1) {
    const end = bundle.indexOf('}]', start) + 2;
    console.log('Found block of length:', end - start);
    fs.writeFileSync(path.join(__dirname, 'official_hotels_raw.txt'), bundle.substring(start, end));
  }
}
