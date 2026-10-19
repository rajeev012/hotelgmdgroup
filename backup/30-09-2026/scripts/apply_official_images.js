const fs = require('fs');
const path = require('path');

const hotels = JSON.parse(fs.readFileSync('data/hotels.json', 'utf8'));
const officialImages = JSON.parse(fs.readFileSync('scripts/official_hotel_images.json', 'utf8'));

// Mapping by name or ID
hotels.forEach(h => {
  let mapped = null;
  for (const [name, imgs] of Object.entries(officialImages)) {
    if (h.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(h.name.toLowerCase())) {
      mapped = imgs;
      break;
    }
  }

  // Specific id overrides if needed
  if (!mapped) {
    if (h.id === 'hotel-aerovilla' && officialImages['Aerovilla']) mapped = officialImages['Aerovilla'];
    if (h.id === 'hotel-palm-view' && officialImages['Palm View']) mapped = officialImages['Palm View'];
    if (h.id === 'hotel-good-luck' && officialImages['Hotel Good Luck']) mapped = officialImages['Hotel Good Luck'];
    if (h.id === 'hotel-grand-regency' && officialImages['Hotel Grand Regency']) mapped = officialImages['Hotel Grand Regency'];
    if (h.id === 'hotel-kian' && officialImages['Hotel Kian']) mapped = officialImages['Hotel Kian'];
    if (h.id === 'hotel-urban-luxury' && officialImages['Hotel Urban Luxury']) mapped = officialImages['Hotel Urban Luxury'];
    if (h.id === 'hotel-grand-shalimar' && officialImages['Hotel Grand Shalimar']) mapped = officialImages['Hotel Grand Shalimar'];
  }

  if (mapped && mapped.length > 0) {
    h.images = mapped;
    console.log(`Updated ${h.name} with ${mapped.length} official images`);
  }
});

fs.writeFileSync('data/hotels.json', JSON.stringify(hotels, null, 2), 'utf8');
console.log('data/hotels.json updated successfully!');
