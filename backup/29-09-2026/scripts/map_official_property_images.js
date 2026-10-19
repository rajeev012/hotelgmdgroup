const fs = require('fs');
const path = require('path');

const bundle = fs.readFileSync(path.join(__dirname, 'official_site.js'), 'utf8');

// Build map of identifier -> asset url
const varToAsset = {};
const regex = /\b([a-zA-Z0-9_$]+)\s*=\s*["'](\/assets\/[^"']+\.(jpg|jpeg|png|webp|svg))["']/g;
let m;
while ((m = regex.exec(bundle)) !== null) {
  varToAsset[m[1]] = m[2];
}

// Find property_name and property_img
const propRegex = /property_name:\s*["']([^"']+)["'][\s\S]*?property_img:\s*\[([^\]]+)\]/g;
const hotelImages = {};

while ((m = propRegex.exec(bundle)) !== null) {
  const name = m[1].trim();
  const vars = m[2].split(',').map(s => s.trim());
  const assets = vars.map(v => {
    const rawAsset = varToAsset[v];
    if (rawAsset) {
      const filename = path.basename(decodeURIComponent(rawAsset));
      return `assets/images/official/${filename}`;
    }
    return null;
  }).filter(Boolean);

  hotelImages[name] = assets;
}

console.log('Mapped hotel images:');
for (const [name, imgs] of Object.entries(hotelImages)) {
  console.log(`${name}: ${imgs.length} images ->`, imgs[0]);
}

fs.writeFileSync(path.join(__dirname, 'official_hotel_images.json'), JSON.stringify(hotelImages, null, 2));
