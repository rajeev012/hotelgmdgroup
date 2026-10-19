/* ============================================================
   JMD GROUP OF HOTELS — Data Layer
   ============================================================
   Single source of truth for all data access.
   Currently reads from JSON files.
   Future PHP: replace fetch calls with server-provided data.
   ============================================================ */

JMD.Data = {
  _cache: {},

  /**
   * Generic fetch with caching
   */
  async _fetch(url) {
    if (this._cache[url]) return this._cache[url];
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to load ${url}`);
      const data = await response.json();
      this._cache[url] = data;
      return data;
    } catch (error) {
      console.error(`Data load error: ${url}`, error);
      return null;
    }
  },

  /* ---- Hotels ---- */
  async getHotels() {
    return (await this._fetch('data/hotels.json')) || [];
  },

  async getHotelBySlug(slug) {
    const hotels = await this.getHotels();
    return hotels.find(h => h.slug === slug) || null;
  },

  async getHotelById(id) {
    const hotels = await this.getHotels();
    return hotels.find(h => h.id === id) || null;
  },

  async getFeaturedHotels() {
    const hotels = await this.getHotels();
    return hotels.filter(h => h.featured);
  },

  async getPopularHotels() {
    const hotels = await this.getHotels();
    return hotels.filter(h => h.popular);
  },

  async searchHotels(query = {}) {
    let hotels = await this.getHotels();

    // Filter by destination
    if (query.destination) {
      const dest = query.destination.toLowerCase();
      hotels = hotels.filter(h =>
        h.location.city.toLowerCase().includes(dest) ||
        h.location.area.toLowerCase().includes(dest) ||
        h.name.toLowerCase().includes(dest) ||
        h.location.state.toLowerCase().includes(dest)
      );
    }

    // Filter by star rating
    if (query.stars && query.stars.length > 0) {
      hotels = hotels.filter(h => query.stars.includes(h.starRating));
    }

    // Filter by guest rating
    if (query.minRating) {
      hotels = hotels.filter(h => h.guestRating >= query.minRating);
    }

    // Filter by price range
    if (query.minPrice !== undefined) {
      hotels = hotels.filter(h => h.priceFrom >= query.minPrice);
    }
    if (query.maxPrice !== undefined && query.maxPrice > 0) {
      hotels = hotels.filter(h => h.priceFrom <= query.maxPrice);
    }

    // Filter by amenities
    if (query.amenities && query.amenities.length > 0) {
      hotels = hotels.filter(h =>
        query.amenities.every(a => h.amenities.includes(a))
      );
    }

    // Sort
    if (query.sort) {
      switch (query.sort) {
        case 'price-asc':
          hotels.sort((a, b) => (a.priceFrom || 0) - (b.priceFrom || 0));
          break;
        case 'price-desc':
          hotels.sort((a, b) => (b.priceFrom || 0) - (a.priceFrom || 0));
          break;
        case 'rating':
          hotels.sort((a, b) => (b.guestRating || 0) - (a.guestRating || 0));
          break;
        case 'stars':
          hotels.sort((a, b) => (b.starRating || 0) - (a.starRating || 0));
          break;
        case 'reviews':
          hotels.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
          break;
        case 'recommended':
        default:
          hotels.sort((a, b) => {
            const scoreA = (a.featured ? 10 : 0) + (a.popular ? 5 : 0) + (a.guestRating || 0);
            const scoreB = (b.featured ? 10 : 0) + (b.popular ? 5 : 0) + (b.guestRating || 0);
            return scoreB - scoreA;
          });
      }
    }

    return hotels;
  },

  /* ---- Rooms ---- */
  async getRooms() {
    return (await this._fetch('data/rooms.json')) || [];
  },

  async getRoomsByHotel(hotelId) {
    const rooms = await this.getRooms();
    return rooms.filter(r => r.hotelId === hotelId);
  },

  async getRoomById(roomId) {
    const rooms = await this.getRooms();
    return rooms.find(r => r.id === roomId) || null;
  },

  /* ---- Reviews ---- */
  async getReviews() {
    return (await this._fetch('data/reviews.json')) || [];
  },

  async getReviewsByHotel(hotelId) {
    const reviews = await this.getReviews();
    return reviews.filter(r => r.hotelId === hotelId);
  },

  /* ---- Amenities ---- */
  async getAmenities() {
    return (await this._fetch('data/amenities.json')) || [];
  },

  async getAmenityById(id) {
    const amenities = await this.getAmenities();
    return amenities.find(a => a.id === id) || { id, name: id, icon: 'default' };
  },

  async resolveAmenities(amenityIds) {
    const amenities = await this.getAmenities();
    return amenityIds.map(id => amenities.find(a => a.id === id) || { id, name: id, icon: 'default' });
  },

  /* ---- Destinations ---- */
  async getDestinations() {
    return (await this._fetch('data/destinations.json')) || [];
  },

  async searchDestinations(query) {
    const destinations = await this.getDestinations();
    const hotels = await this.getHotels();
    const q = query.toLowerCase();

    const matchedDests = destinations.filter(d =>
      d.name.toLowerCase().includes(q) ||
      (d.city && d.city.toLowerCase().includes(q)) ||
      (d.state && d.state.toLowerCase().includes(q))
    );

    const matchedHotels = hotels.filter(h =>
      h.name.toLowerCase().includes(q)
    ).map(h => ({
      id: h.slug,
      name: h.name,
      type: 'hotel',
      city: h.location.city,
      state: h.location.state,
      country: h.location.country,
      propertyCount: 1
    }));

    return [...matchedDests, ...matchedHotels].slice(0, 8);
  },

  /* ---- Offers ---- */
  async getOffers() {
    return (await this._fetch('data/offers.json')) || [];
  },

  /* ---- FAQs ---- */
  async getFAQs() {
    return (await this._fetch('data/faqs.json')) || [];
  },

  /* ---- Site Config ---- */
  async getSiteConfig() {
    return (await this._fetch('data/site.json')) || {};
  }
};
