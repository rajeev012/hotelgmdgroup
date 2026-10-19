const fs = require('fs');

const hotels = JSON.parse(fs.readFileSync('data/hotels.json', 'utf8'));
const rooms = JSON.parse(fs.readFileSync('data/rooms.json', 'utf8'));

rooms.forEach(r => {
  const hotel = hotels.find(h => h.id === r.hotelId);
  if (hotel && hotel.images && hotel.images.length > 0) {
    // pick 1-2 images from the hotel's gallery
    const imgIndex = rooms.indexOf(r) % hotel.images.length;
    r.images = [hotel.images[imgIndex] || hotel.images[0]];
  }
});

fs.writeFileSync('data/rooms.json', JSON.stringify(rooms, null, 2), 'utf8');
console.log('rooms.json updated with official hotel photography!');
