const https = require('https');
const fs = require('fs');
const path = require('path');

function getUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function main() {
  try {
    console.log('Fetching official bundle...');
    const jsContent = await getUrl('https://jmdgrouphotels.com/assets/index-D1pihzTn.js');
    fs.writeFileSync(path.join(__dirname, 'official_site.js'), jsContent);
    console.log('Saved bundle, size:', jsContent.length);

    // Look for image strings and hotel objects
    const imgMatches = jsContent.match(/["'](\/assets\/[^"']+\.(jpg|jpeg|png|webp|svg))["']/gi) || [];
    const uniqueImgs = Array.from(new Set(imgMatches.map(m => m.replace(/['"]/g, ''))));
    console.log(`Found ${uniqueImgs.length} assets on official site:`);
    console.log(uniqueImgs);

    // Look for external URLs
    const extMatches = jsContent.match(/https?:\/\/[^"'\s]+\.(jpg|jpeg|png|webp)/gi) || [];
    console.log('Found external image URLs:', Array.from(new Set(extMatches)));
  } catch (err) {
    console.error('Error fetching bundle:', err);
  }
}

main();
