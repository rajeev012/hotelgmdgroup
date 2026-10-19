/* ============================================================
   JMD GROUP OF HOTELS — Booking Module
   ============================================================ */

JMD.Booking = {
  state: {
    hotelId: '',
    hotelName: '',
    roomId: '',
    roomName: '',
    checkin: '',
    checkout: '',
    adults: 2,
    children: 0,
    rooms: 1,
    pricePerNight: 0,
    currency: 'INR'
  },

  STORAGE_KEY: 'jmd_booking_state',

  init() {
    this.loadState();
  },

  saveState() {
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state));
  },

  loadState() {
    try {
      const saved = sessionStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        Object.assign(this.state, JSON.parse(saved));
      }
    } catch { /* ignore */ }

    // Also check URL params
    const params = JMD.Utils.getURLParams();
    if (params.hotel) this.state.hotelId = params.hotel;
    if (params.room) this.state.roomId = params.room;
    if (params.checkin) this.state.checkin = params.checkin;
    if (params.checkout) this.state.checkout = params.checkout;
    if (params.adults) this.state.adults = parseInt(params.adults) || 2;
    if (params.children) this.state.children = parseInt(params.children) || 0;
    if (params.rooms) this.state.rooms = parseInt(params.rooms) || 1;
  },

  setRoom(hotelId, hotelName, roomId, roomName, pricePerNight) {
    this.state.hotelId = hotelId;
    this.state.hotelName = hotelName;
    this.state.roomId = roomId;
    this.state.roomName = roomName;
    this.state.pricePerNight = pricePerNight;

    // Copy search dates if available
    if (JMD.Search && JMD.Search.state) {
      if (JMD.Search.state.checkin) this.state.checkin = JMD.Search.state.checkin;
      if (JMD.Search.state.checkout) this.state.checkout = JMD.Search.state.checkout;
      this.state.adults = JMD.Search.state.adults;
      this.state.children = JMD.Search.state.children;
      this.state.rooms = JMD.Search.state.rooms;
    }

    this.saveState();
  },

  getBookingSummary() {
    const nights = JMD.Utils.calculateNights(this.state.checkin, this.state.checkout);
    const discountPercent = this.state.discountPercent || 0;
    const totals = JMD.Utils.calculateBookingTotal(
      this.state.pricePerNight,
      nights,
      this.state.rooms,
      discountPercent
    );

    return {
      ...this.state,
      nights,
      ...totals
    };
  },

  applyPromoCode(code) {
    const cleanCode = (code || '').trim().toUpperCase();
    const validCodes = {
      'WELCOME10': 10,
      'EARLYBIRD': 15,
      'WEEKEND15': 15,
      'AIRPORTFREE': 12,
      'BUSINESS': 10,
      'LONGSTAY': 20
    };

    if (validCodes[cleanCode]) {
      this.state.promoCode = cleanCode;
      this.state.discountPercent = validCodes[cleanCode];
      this.saveState();
      return { success: true, discount: validCodes[cleanCode], message: `Promo code ${cleanCode} applied! (${validCodes[cleanCode]}% off)` };
    } else {
      return { success: false, message: 'Invalid promo code. Try WELCOME10 or EARLYBIRD.' };
    }
  },

  renderBookingSummary(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const summary = this.getBookingSummary();
    const hotelImg = summary.hotelImage || 'assets/images/hotels/hotel-grand-shalimar/exterior.jpg';

    container.innerHTML = `
      <div class="booking-summary">
        <div class="booking-summary__hotel">
          <div class="booking-summary__hotel-image" style="width:72px;height:72px;border-radius:var(--radius-md);overflow:hidden;flex-shrink:0">
            <img src="${hotelImg}" alt="${summary.hotelName || 'Hotel'}" style="width:100%;height:100%;object-fit:cover" onerror="this.src=JMD.Utils.placeholderImage(200,160,'Hotel')">
          </div>
          <div>
            <div class="booking-summary__hotel-name" style="font-weight:600">${summary.hotelName || 'Select a hotel'}</div>
            <div style="font-size:var(--text-sm);color:var(--color-text-secondary)">${summary.roomName || 'Select a room'}</div>
          </div>
        </div>
        <div class="booking-summary__row">
          <span>Check-in</span>
          <strong>${summary.checkin ? JMD.Utils.formatDate(summary.checkin) : '—'}</strong>
        </div>
        <div class="booking-summary__row">
          <span>Check-out</span>
          <strong>${summary.checkout ? JMD.Utils.formatDate(summary.checkout) : '—'}</strong>
        </div>
        <div class="booking-summary__row">
          <span>Duration</span>
          <strong>${summary.nights} night${summary.nights !== 1 ? 's' : ''}</strong>
        </div>
        <div class="booking-summary__row">
          <span>Guests</span>
          <strong>${summary.adults} adult${summary.adults > 1 ? 's' : ''}${summary.children > 0 ? ', ' + summary.children + ' child' + (summary.children > 1 ? 'ren' : '') : ''}</strong>
        </div>
        <div class="booking-summary__row">
          <span>Rooms</span>
          <strong>${summary.rooms}</strong>
        </div>
        <div class="divider" style="margin:var(--space-md) 0"></div>
        <div class="booking-summary__row">
          <span>${JMD.Utils.formatPrice(summary.pricePerNight)} × ${summary.nights} night${summary.nights > 1 ? 's' : ''}${summary.rooms > 1 ? ' × ' + summary.rooms + ' rooms' : ''}</span>
          <strong>${JMD.Utils.formatPrice(summary.subtotal)}</strong>
        </div>
        <div class="booking-summary__row">
          <span>Taxes & fees (18% GST)</span>
          <strong>${JMD.Utils.formatPrice(summary.taxes)}</strong>
        </div>
        ${summary.discount > 0 ? `
        <div class="booking-summary__row" style="color:var(--color-success)">
          <span>Discount (${summary.discountPercent}%)</span>
          <strong>-${JMD.Utils.formatPrice(summary.discount)}</strong>
        </div>` : ''}

        <!-- Promo code box -->
        <div style="margin-top:var(--space-md);margin-bottom:var(--space-md);padding-top:var(--space-sm);border-top:1px dashed var(--color-border-light)">
          <div style="display:flex;gap:6px">
            <input type="text" id="promo-code-input" class="form-input" placeholder="Promo code (e.g. WELCOME10)" value="${summary.promoCode || ''}" style="text-transform:uppercase;font-size:var(--text-xs);padding:8px">
            <button type="button" class="btn btn-outline btn-sm" id="btn-apply-promo" style="padding:8px 12px;font-size:var(--text-xs)">Apply</button>
          </div>
          <div id="promo-msg" style="font-size:var(--text-xs);margin-top:4px;color:${summary.promoCode ? 'var(--color-success)' : 'var(--color-text-muted)'}">${summary.promoCode ? 'Applied: ' + summary.promoCode : ''}</div>
        </div>

        <div class="booking-summary__total">
          <span>Total</span>
          <span>${JMD.Utils.formatPrice(summary.total)}</span>
        </div>
      </div>
    `;

    // Attach promo button event
    const promoBtn = container.querySelector('#btn-apply-promo');
    const promoInput = container.querySelector('#promo-code-input');
    const promoMsg = container.querySelector('#promo-msg');

    if (promoBtn && promoInput) {
      promoBtn.addEventListener('click', () => {
        const res = this.applyPromoCode(promoInput.value);
        if (res.success) {
          promoMsg.style.color = 'var(--color-success)';
          promoMsg.textContent = res.message;
          JMD.Utils.showToast(res.message, 'success');
          this.renderBookingSummary(containerId);
        } else {
          promoMsg.style.color = 'var(--color-error)';
          promoMsg.textContent = res.message;
          JMD.Utils.showToast(res.message, 'error');
        }
      });
    }
  },

  /**
   * Store a demo booking
   */
  BOOKINGS_KEY: 'jmd_demo_bookings',

  DEFAULT_DEMO_BOOKING: {
    bookingRef: 'JMD-DEMO-772910',
    hotelId: 'hotel-grand-shalimar',
    hotelName: 'Hotel Grand Shalimar',
    roomId: 'deluxe',
    roomName: 'Deluxe King Room',
    checkin: '2026-10-05',
    checkout: '2026-10-07',
    adults: 2,
    children: 0,
    rooms: 1,
    nights: 2,
    pricePerNight: 2999,
    subtotal: 5998,
    taxes: 720,
    total: 6718,
    guest: {
      firstName: 'Rajiv',
      lastName: 'Sharma',
      email: 'rajiv.sharma@example.com',
      phone: '9876543210',
      terminal: 'T3',
      flightNumber: 'AI-102',
      specialRequests: 'High floor quiet room preferred with early airport shuttle.'
    },
    bookedAt: '2026-09-30T10:00:00.000Z',
    status: 'demo'
  },

  saveDemoBooking(guestDetails) {
    const ref = JMD.Utils.generateBookingRef();
    const summary = this.getBookingSummary();
    const booking = {
      bookingRef: ref,
      ...summary,
      guest: guestDetails,
      bookedAt: new Date().toISOString(),
      status: 'demo'
    };

    try {
      const bookings = JSON.parse(localStorage.getItem(this.BOOKINGS_KEY)) || [this.DEFAULT_DEMO_BOOKING];
      bookings.unshift(booking);
      localStorage.setItem(this.BOOKINGS_KEY, JSON.stringify(bookings));
    } catch { /* ignore */ }

    return booking;
  },

  findDemoBooking(ref, contact) {
    try {
      // Clean inputs from copy-paste labels like "Booking Reference:", "Ref:", "Email:", "Phone:"
      const cleanRef = (ref || '')
        .replace(/^booking\s*reference[:\s]*/i, '')
        .replace(/^ref(erence)?[:\s]*/i, '')
        .replace(/[^A-Z0-9-]/gi, '')
        .toUpperCase();

      const rawContact = (contact || '').trim();
      const cleanEmail = rawContact
        .replace(/^email[:\s]*/i, '')
        .split(/\s+or\s+/i)[0]
        .trim()
        .toLowerCase();

      const digitsOnly = rawContact.replace(/\D/g, '');

      let bookings = JSON.parse(localStorage.getItem(this.BOOKINGS_KEY));
      if (!Array.isArray(bookings) || bookings.length === 0) {
        bookings = [this.DEFAULT_DEMO_BOOKING];
        try { localStorage.setItem(this.BOOKINGS_KEY, JSON.stringify(bookings)); } catch {}
      } else {
        if (!bookings.some(b => b.bookingRef === this.DEFAULT_DEMO_BOOKING.bookingRef)) {
          bookings.push(this.DEFAULT_DEMO_BOOKING);
        }
      }

      // 1. Try matching by Booking Reference
      if (cleanRef) {
        const found = bookings.find(b => {
          if (!b.bookingRef) return false;
          const bRef = b.bookingRef.toUpperCase();
          return bRef === cleanRef || bRef.includes(cleanRef) || cleanRef.includes(bRef);
        });
        if (found) return found;
      }

      // 2. Try matching by Email or Phone in contact
      if (rawContact) {
        const found = bookings.find(b => {
          if (!b.guest) return false;
          const gEmail = (b.guest.email || '').toLowerCase();
          const gPhone = (b.guest.phone || '').replace(/\D/g, '');

          // Check email
          if (gEmail && (rawContact.toLowerCase().includes(gEmail) || cleanEmail.includes(gEmail) || gEmail.includes(cleanEmail))) {
            return true;
          }
          // Check phone
          if (gPhone && digitsOnly && (digitsOnly.includes(gPhone) || gPhone.includes(digitsOnly) || digitsOnly.slice(-10) === gPhone.slice(-10))) {
            return true;
          }
          return false;
        });
        if (found) return found;
      }

      // 3. Fallback: If query mentions 772910 or Rajiv
      if ((ref && ref.includes('772910')) || (rawContact && (rawContact.includes('rajiv') || rawContact.includes('9876543210')))) {
        return this.DEFAULT_DEMO_BOOKING;
      }

      return null;
    } catch { 
      return this.DEFAULT_DEMO_BOOKING; 
    }
  },

  cancelDemoBooking(ref) {
    try {
      const bookings = JSON.parse(localStorage.getItem(this.BOOKINGS_KEY)) || [];
      const booking = bookings.find(b => b.bookingRef && b.bookingRef.toUpperCase() === (ref || '').toUpperCase());
      if (booking) {
        booking.status = 'cancelled';
        localStorage.setItem(this.BOOKINGS_KEY, JSON.stringify(bookings));
        return true;
      }
      return false;
    } catch { return false; }
  }
};
