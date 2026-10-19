const fs = require('fs');
const path = require('path');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
let brokenLinks = 0;
let totalLinks = 0;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const linkRegex = /href=["']([^"']+)["']/g;
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const rawHref = match[1];
    if (rawHref.startsWith('http://') || rawHref.startsWith('https://') || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:') || rawHref.startsWith('#')) {
      continue;
    }
    const cleanHref = rawHref.split('?')[0].split('#')[0];
    if (!cleanHref) continue;

    totalLinks++;
    if (!fs.existsSync(cleanHref)) {
      console.error(`[BROKEN LINK] in ${file}: "${rawHref}" -> target "${cleanHref}" not found`);
      brokenLinks++;
    }
  }
});

console.log(`\nLink verification complete:`);
console.log(`Total internal links checked: ${totalLinks}`);
console.log(`Broken links found: ${brokenLinks}`);

if (brokenLinks === 0) {
  console.log('SUCCESS: All internal links are valid!');
}
