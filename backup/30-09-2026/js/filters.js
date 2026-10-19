/* ============================================================
   JMD GROUP OF HOTELS — Filters Module (Hotels Page)
   ============================================================ */

JMD.Filters = {
  state: {
    stars: [],
    minRating: 0,
    maxPrice: 10000,
    amenities: [],
    sort: 'recommended'
  },

  init() {
    this.loadFromURL();
    this.render();
    this.bindEvents();
  },

  loadFromURL() {
    const params = JMD.Utils.getURLParams();
    if (params.stars) this.state.stars = params.stars.split(',').map(Number);
    if (params.minRating) this.state.minRating = parseFloat(params.minRating);
    if (params.maxPrice) this.state.maxPrice = parseInt(params.maxPrice);
    if (params.amenities) this.state.amenities = params.amenities.split(',');
    if (params.sort) this.state.sort = params.sort;
  },

  render() {
    const panel = document.getElementById('filter-panel');
    if (!panel) return;

    const renderFilterStars = (count) => {
      let starsHtml = '';
      for (let i = 0; i < count; i++) {
        starsHtml += `<svg width="13" height="13" viewBox="0 0 24 24" fill="#ffb700" stroke="#ffb700" stroke-width="1" style="display:inline-block;vertical-align:-1px;margin-right:1px"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
      }
      return starsHtml;
    };

    panel.innerHTML = `
      <div class="filters__header" style="display:flex;align-items:center;justify-content:space-between;padding-bottom:12px;margin-bottom:8px;border-bottom:2px solid #edf2f7;">
        <div style="display:flex;align-items:center;gap:8px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#003580" stroke-width="2.5"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          <span style="font-size:15px;font-weight:700;color:#00224f;letter-spacing:-0.2px">Filter by:</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <button type="button" class="btn btn-ghost btn-sm" id="clear-filters-top" style="padding:4px 8px;font-size:12px;color:#006ce4;font-weight:600;cursor:pointer;border:none;background:none">Reset</button>
          <button type="button" class="filters__close-mobile" id="filter-close" aria-label="Close filters" style="background:#f1f5f9;border:none;font-size:22px;line-height:1;width:32px;height:32px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;color:#1e293b">&times;</button>
        </div>
      </div>
      <div class="filter-section">
        <h3 class="filter-section__title">Price per night</h3>
        <div class="price-range">
          <input type="range" class="price-range__slider" id="price-slider" min="0" max="10000" step="500" value="${this.state.maxPrice}">
          <div class="price-range__values" style="display:flex;justify-content:space-between;margin-top:6px;font-size:13px;font-weight:600;color:#003580">
            <span>₹0</span>
            <span id="price-max-label">Up to ₹${this.state.maxPrice >= 10000 ? '10,000+' : JMD.Utils.formatPrice(this.state.maxPrice)}</span>
          </div>
        </div>
      </div>
      <div class="filter-section">
        <h3 class="filter-section__title">Star Rating</h3>
        ${[5, 4, 3, 2].map(s => `
          <label class="filter-option">
            <input type="checkbox" value="${s}" ${this.state.stars.includes(s) ? 'checked' : ''} data-filter="stars">
            <span class="filter-option__label" style="display:inline-flex;align-items:center;gap:4px">
              ${renderFilterStars(s)} <span style="font-size:13px;font-weight:600;color:#1f2937">${s} Star</span>
            </span>
          </label>
        `).join('')}
      </div>
      <div class="filter-section">
        <h3 class="filter-section__title">Guest Rating</h3>
        ${[
          { value: 9, label: 'Exceptional: 9+' },
          { value: 8, label: 'Excellent: 8+' },
          { value: 7, label: 'Very Good: 7+' },
          { value: 6, label: 'Good: 6+' }
        ].map(r => `
          <label class="filter-option">
            <input type="radio" name="rating" value="${r.value}" ${this.state.minRating === r.value ? 'checked' : ''} data-filter="rating">
            <span class="filter-option__label" style="font-size:13px;font-weight:500;color:#1f2937">${r.label}</span>
          </label>
        `).join('')}
      </div>
      <div class="filter-section">
        <h3 class="filter-section__title">Popular Amenities</h3>
        ${[
          { id: 'free-wifi', name: 'Free High-Speed WiFi' },
          { id: 'airport-transfer', name: 'Free Airport Shuttle' },
          { id: 'breakfast', name: 'Breakfast Included' },
          { id: 'parking', name: 'Free Parking' },
          { id: 'restaurant', name: 'Multi-Cuisine Restaurant' },
          { id: 'room-service', name: '24/7 Room Service' },
          { id: 'air-conditioning', name: 'Air Conditioning' },
          { id: 'laundry', name: 'Laundry Service' },
          { id: '24hr-reception', name: '24-Hour Front Desk' },
          { id: 'conference-facilities', name: 'Conference Facilities' },
          { id: 'gym', name: 'Fitness Center' }
        ].map(a => `
          <label class="filter-option">
            <input type="checkbox" value="${a.id}" ${this.state.amenities.includes(a.id) ? 'checked' : ''} data-filter="amenity">
            <span class="filter-option__label" style="font-size:13px;color:#374151">${a.name}</span>
          </label>
        `).join('')}
      </div>
      <div class="filter-section" style="border-bottom:none;padding-top:12px">
        <button type="button" class="btn btn-outline" id="clear-filters" style="width:100%;font-size:13px;padding:9px;border:1px solid #cbd5e1;border-radius:6px;font-weight:600;color:#334155;background:#fff">Clear All Filters</button>
        <button type="button" class="btn btn-primary" id="filter-apply-btn" style="width:100%;margin-top:10px;padding:10px;background:#006ce4;color:#fff;border-radius:6px;font-weight:700;border:none;cursor:pointer;font-size:14px">Apply Filters</button>
      </div>
    `;
  },

  bindEvents() {
    const panel = document.getElementById('filter-panel');
    if (!panel) return;

    // Price slider
    const priceSlider = document.getElementById('price-slider');
    if (priceSlider) {
      priceSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        this.state.maxPrice = val;
        document.getElementById('price-max-label').textContent =
          val >= 10000 ? '₹10,000+' : JMD.Utils.formatPrice(val);
      });
      priceSlider.addEventListener('change', () => this.applyFilters());
    }

    // Star filter
    panel.querySelectorAll('[data-filter="stars"]').forEach(cb => {
      cb.addEventListener('change', () => {
        this.state.stars = Array.from(panel.querySelectorAll('[data-filter="stars"]:checked'))
          .map(el => parseInt(el.value));
        this.applyFilters();
      });
    });

    // Rating filter
    panel.querySelectorAll('[data-filter="rating"]').forEach(rb => {
      rb.addEventListener('change', (e) => {
        this.state.minRating = parseFloat(e.target.value);
        this.applyFilters();
      });
    });

    // Amenity filter
    panel.querySelectorAll('[data-filter="amenity"]').forEach(cb => {
      cb.addEventListener('change', () => {
        this.state.amenities = Array.from(panel.querySelectorAll('[data-filter="amenity"]:checked'))
          .map(el => el.value);
        this.applyFilters();
      });
    });

    // Clear filters
    const resetFilters = () => {
      this.state = { stars: [], minRating: 0, maxPrice: 10000, amenities: [], sort: this.state.sort };
      this.render();
      this.bindEvents();
      this.applyFilters();
    };

    const clearBtn = document.getElementById('clear-filters');
    if (clearBtn) clearBtn.addEventListener('click', resetFilters);

    const clearTopBtn = document.getElementById('clear-filters-top');
    if (clearTopBtn) clearTopBtn.addEventListener('click', resetFilters);

    // Sort
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.value = this.state.sort;
      sortSelect.addEventListener('change', (e) => {
        this.state.sort = e.target.value;
        this.applyFilters();
      });
    }

    // Mobile drawer close / apply actions
    const closeDrawer = () => {
      panel.classList.remove('filters--open');
      const overlay = document.getElementById('filter-overlay');
      if (overlay) overlay.classList.remove('filter-overlay--visible');
      document.body.style.overflow = '';
    };

    const closeBtn = document.getElementById('filter-close');
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

    const applyBtn = document.getElementById('filter-apply-btn');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        this.applyFilters();
        closeDrawer();
      });
    }

    const overlay = document.getElementById('filter-overlay');
    if (overlay) overlay.addEventListener('click', closeDrawer);
  },

  async applyFilters() {
    const params = JMD.Utils.getURLParams();
    const searchQuery = {
      destination: params.destination || '',
      stars: this.state.stars,
      minRating: this.state.minRating,
      maxPrice: this.state.maxPrice >= 10000 ? undefined : this.state.maxPrice,
      amenities: this.state.amenities,
      sort: this.state.sort
    };

    const hotels = await JMD.Data.searchHotels(searchQuery);
    if (typeof JMD.HotelsList !== 'undefined' && JMD.HotelsList.renderResults) {
      JMD.HotelsList.renderResults(hotels);
    }
  }
};
