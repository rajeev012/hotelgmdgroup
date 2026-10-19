const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));

let validCount = 0;
files.forEach(file => {
  const fullPath = path.join(dataDir, file);
  try {
    const raw = fs.readFileSync(fullPath, 'utf8');
    const parsed = JSON.parse(raw);
    const count = Array.isArray(parsed) ? parsed.length : Object.keys(parsed).length;
    console.log(`✓ ${file}: valid JSON (${count} entries)`);
    validCount++;
  } catch (err) {
    console.error(`✕ ${file}: INVALID JSON - ${err.message}`);
  }
});

console.log(`\nVerified ${validCount}/${files.length} JSON data files.`);
