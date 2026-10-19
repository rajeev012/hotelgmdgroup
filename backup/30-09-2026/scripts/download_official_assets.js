const https = require('https');
const fs = require('fs');
const path = require('path');

const officialDir = path.join(__dirname, '..', 'assets', 'images', 'official');
if (!fs.existsSync(officialDir)) {
  fs.mkdirSync(officialDir, { recursive: true });
}

// Download function
function downloadFile(assetPath) {
  return new Promise((resolve, reject) => {
    const filename = path.basename(decodeURIComponent(assetPath));
    const dest = path.join(officialDir, filename);

    if (fs.existsSync(dest) && fs.statSync(dest).size > 500) {
      return resolve({ path: assetPath, file: filename, cached: true });
    }

    const url = `https://jmdgrouphotels.com${assetPath}`;
    const file = fs.createWriteStream(dest);

    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        file.close();
        fs.unlink(dest, () => {});
        return resolve({ path: assetPath, error: res.statusCode });
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve({ path: assetPath, file: filename, success: true }));
      });
    }).on('error', (err) => {
      file.close();
      fs.unlink(dest, () => {});
      resolve({ path: assetPath, error: err.message });
    });
  });
}

async function main() {
  const bundle = fs.readFileSync(path.join(__dirname, 'official_site.js'), 'utf8');
  const imgMatches = bundle.match(/["'](\/assets\/[^"']+\.(jpg|jpeg|png|webp|svg))["']/gi) || [];
  const uniqueAssets = Array.from(new Set(imgMatches.map(m => m.replace(/['"]/g, ''))));

  console.log(`Starting download of ${uniqueAssets.length} official assets...`);
  let count = 0;
  for (const asset of uniqueAssets) {
    const res = await downloadFile(asset);
    count++;
    if (count % 10 === 0 || res.error) {
      console.log(`[${count}/${uniqueAssets.length}] ${asset} -> ${res.success ? 'OK' : res.cached ? 'CACHED' : res.error}`);
    }
  }
  console.log('All official assets processed successfully!');
}

main();
