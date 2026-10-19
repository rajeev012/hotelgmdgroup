const fs = require('fs');
const path = require('path');

const bundle = fs.readFileSync(path.join(__dirname, 'official_site.js'), 'utf8');

// Find all property_name matches
const regex = /property_name:\s*["']([^"']+)["']/g;
let m;
const hotelNames = [];
while ((m = regex.exec(bundle)) !== null) {
  hotelNames.push(m[1]);
}
console.log('Hotel names on official site:', hotelNames);

// Find surrounding blocks
hotelNames.forEach(name => {
  const idx = bundle.indexOf(name);
  if (idx !== -1) {
    const chunk = bundle.substring(Math.max(0, idx - 100), Math.min(bundle.length, idx + 1500));
    console.log(`=== ${name} ===`);
    console.log(chunk.substring(0, 500));
  }
});
