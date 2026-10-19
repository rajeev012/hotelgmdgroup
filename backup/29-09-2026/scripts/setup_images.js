const fs = require('fs');
const path = require('path');
const https = require('https');

// Curated high quality hotel & hospitality images from Unsplash
const UNSPLASH_IMAGES = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80', // luxury resort/hotel exterior
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80', // luxury bedroom
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1200&q=80', // luxury room
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200&q=80', // modern room
  'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=1200&q=80', // hotel suite
  'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200&q=80', // stylish hotel lobby
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80', // hotel facade
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80', // elegant restaurant
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200&q=80', // hotel entrance
  'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&q=80', // resort / pool
  'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&q=80', // business / conference
  'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200&q=80', // modern bed
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80', // boutique hotel
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200&q=80', // hotel pool twilight
  'https://images.unsplash.com/photo-1561501900-3701fa6a0864?w=1200&q=80', // luxury interior
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80', // resort view
  'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=1200&q=80', // deluxe room
  'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1200&q=80', // cozy bed
  'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1200&q=80', // luxury suite view
  'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=1200&q=80'  // hotel travel
];

// Destination specific images
const DESTINATION_IMAGES = {
  'new-delhi': 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80', // India Gate New Delhi
  'mahipalpur': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80', // Hotel district
  'aerocity': 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80', // Modern Aerocity
  'igi-airport': 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80', // Airport
  'vasant-kunj': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80', // South Delhi
  'rangpuri': 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80' // Airport corridor
};

function downloadUrl(url, destPath) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(destPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
      return resolve(destPath); // already downloaded
    }

    const file = fs.createWriteStream(destPath);
    https.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        // handle redirect
        return downloadUrl(response.headers.location, destPath).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        file.close();
        fs.unlink(destPath, () => {});
        return reject(new Error(`Failed with status ${response.statusCode}`));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve(destPath));
      });
    }).on('error', (err) => {
      file.close();
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

async function main() {
  const dataFiles = ['hotels.json', 'rooms.json', 'destinations.json', 'offers.json'];
  const allPaths = new Set();

  dataFiles.forEach(file => {
    const fullPath = path.join(__dirname, '..', 'data', file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const matches = content.match(/assets\/images\/[^"'\s]+/g);
      if (matches) {
        matches.forEach(m => allPaths.add(m));
      }
    }
  });

  console.log(`Found ${allPaths.size} image references.`);
  let i = 0;
  for (const imgPath of allPaths) {
    const fullDest = path.join(__dirname, '..', imgPath);
    
    // Choose appropriate image url
    let targetUrl = UNSPLASH_IMAGES[i % UNSPLASH_IMAGES.length];
    
    // Check destination specific
    for (const [key, url] of Object.entries(DESTINATION_IMAGES)) {
      if (imgPath.includes(key)) {
        targetUrl = url;
        break;
      }
    }

    // Check restaurant
    if (imgPath.includes('restaurant')) {
      targetUrl = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80';
    } else if (imgPath.includes('lobby')) {
      targetUrl = 'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=1200&q=80';
    } else if (imgPath.includes('conference')) {
      targetUrl = 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&q=80';
    }

    try {
      await downloadUrl(targetUrl, fullDest);
      console.log(`[${i + 1}/${allPaths.size}] Saved: ${imgPath}`);
    } catch (e) {
      console.error(`Failed ${imgPath}:`, e.message);
    }
    i++;
  }
  console.log('Finished downloading all images!');
}

main();
