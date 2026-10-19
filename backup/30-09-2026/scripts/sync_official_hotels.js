const fs = require('fs');
const path = require('path');

// We have the raw bundle with image variable definitions
const bundle = fs.readFileSync(path.join(__dirname, 'official_site.js'), 'utf8');

// Find all image imports / variables e.g. import ae from "/assets/1-vp0mat9t.png"; or const ae = "/assets/..."
const imgVarMap = {};
const varMatches = bundle.matchAll(/([a-zA-Z0-9_$]+)\s*=\s*["'](\/assets\/[^"']+\.(jpg|jpeg|png|webp|svg))["']/g);
for (const vm of varMatches) {
  imgVarMap[vm[1]] = vm[2];
}
console.log('Mapped image variables:', Object.keys(imgVarMap).length);

// Also look for direct /assets/ paths inside the official array
const rawData = fs.readFileSync(path.join(__dirname, 'official_hotels_data.js'), 'utf8');

// Let's print out what properties exist and what images they reference
console.log('Raw data sample:', rawData.substring(0, 1000));
