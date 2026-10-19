/* ============================================================
   JMD GROUP OF HOTELS — Wishlist (localStorage)
   ============================================================ */

JMD.Wishlist = {
  STORAGE_KEY: 'jmd_wishlist',

  getAll() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
    } catch { return []; }
  },

  has(hotelId) {
    return this.getAll().includes(hotelId);
  },

  add(hotelId) {
    const list = this.getAll();
    if (!list.includes(hotelId)) {
      list.push(hotelId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
      JMD.Utils.showToast('Added to favorites', 'success');
      this._updateUI();
    }
  },

  remove(hotelId) {
    let list = this.getAll();
    list = list.filter(id => id !== hotelId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
    JMD.Utils.showToast('Removed from favorites', 'info');
    this._updateUI();
  },

  toggle(hotelId) {
    if (this.has(hotelId)) {
      this.remove(hotelId);
    } else {
      this.add(hotelId);
    }
  },

  count() {
    return this.getAll().length;
  },

  _updateUI() {
    // Update all wishlist buttons on page
    document.querySelectorAll('[data-wishlist-id]').forEach(btn => {
      const id = btn.getAttribute('data-wishlist-id');
      const isActive = this.has(id);
      btn.classList.toggle('hotel-card__wishlist--active', isActive);
      btn.classList.toggle('featured-card__wishlist--active', isActive);
      btn.innerHTML = isActive
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
    });

    // Update favorites count badge if present
    const badge = document.querySelector('.favorites-count');
    if (badge) {
      const count = this.count();
      badge.textContent = count;
      badge.style.display = count > 0 ? '' : 'none';
    }
  }
};

/* ============================================================
   Recently Viewed (localStorage)
   ============================================================ */
JMD.RecentlyViewed = {
  STORAGE_KEY: 'jmd_recently_viewed',
  MAX_ITEMS: 10,

  getAll() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
    } catch { return []; }
  },

  add(hotelId) {
    let list = this.getAll();
    list = list.filter(id => id !== hotelId);
    list.unshift(hotelId);
    if (list.length > this.MAX_ITEMS) list = list.slice(0, this.MAX_ITEMS);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
  },

  clear() {
    localStorage.removeItem(this.STORAGE_KEY);
  }
};
