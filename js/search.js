/* ============================================================
   JMD GROUP OF HOTELS — Search Module
   ============================================================ */

JMD.Search = {
  state: {
    destination: '',
    checkin: '',
    checkout: '',
    adults: 2,
    children: 0,
    rooms: 1
  },

  init() {
    // Load state from URL params
    const params = JMD.Utils.getURLParams();
    if (params.destination) this.state.destination = params.destination;
    if (params.checkin) this.state.checkin = params.checkin;
    if (params.checkout) this.state.checkout = params.checkout;
    if (params.adults) this.state.adults = parseInt(params.adults) || 2;
    if (params.children) this.state.children = parseInt(params.children) || 0;
    if (params.rooms) this.state.rooms = parseInt(params.rooms) || 1;

    this.initDestinationSearch();
    this.initDatePicker();
    this.initGuestSelector();
    this.initSearchForm();
    this.initQuickChips();
    this.populateFields();
  },

  initQuickChips() {
    document.querySelectorAll('.search-widget__quick-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.preventDefault();
        const dest = chip.dataset.dest;
        const destInput = document.getElementById('search-destination');
        if (destInput && dest) {
          destInput.value = dest;
          this.state.destination = dest;
          destInput.focus();
          chip.style.transform = 'scale(0.95)';
          setTimeout(() => { chip.style.transform = ''; }, 150);
        }
      });
    });
  },

  populateFields() {
    const destInput = document.getElementById('search-destination');
    if (destInput && this.state.destination) {
      destInput.value = this.state.destination;
    }

    const checkinInput = document.getElementById('search-checkin');
    if (checkinInput && this.state.checkin) {
      checkinInput.value = JMD.Utils.formatDateShort(this.state.checkin);
      checkinInput.dataset.value = this.state.checkin;
    }

    const checkoutInput = document.getElementById('search-checkout');
    if (checkoutInput && this.state.checkout) {
      checkoutInput.value = JMD.Utils.formatDateShort(this.state.checkout);
      checkoutInput.dataset.value = this.state.checkout;
    }

    const guestsInput = document.getElementById('search-guests');
    if (guestsInput) {
      guestsInput.value = this.getGuestsText();
    }
  },

  getGuestsText() {
    let text = `${this.state.adults} adult${this.state.adults > 1 ? 's' : ''}`;
    if (this.state.children > 0) {
      text += ` · ${this.state.children} child${this.state.children > 1 ? 'ren' : ''}`;
    }
    text += ` · ${this.state.rooms} room${this.state.rooms > 1 ? 's' : ''}`;
    return text;
  },

  /* ---- Destination Autocomplete ---- */
  initDestinationSearch() {
    const input = document.getElementById('search-destination');
    const dropdown = document.getElementById('destination-dropdown');
    if (!input || !dropdown) return;

    input.addEventListener('focus', () => {
      this.showDestinationResults('');
    });

    input.addEventListener('input', JMD.Utils.debounce((e) => {
      this.showDestinationResults(e.target.value);
    }, 200));

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        dropdown.classList.remove('search-dropdown--open');
      }
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-widget__field--destination')) {
        dropdown.classList.remove('search-dropdown--open');
      }
    });
  },

  async showDestinationResults(query) {
    const dropdown = document.getElementById('destination-dropdown');
    if (!dropdown) return;

    const results = await JMD.Data.searchDestinations(query || '');

    if (results.length === 0) {
      dropdown.classList.remove('search-dropdown--open');
      return;
    }

    dropdown.innerHTML = results.map(item => {
      const icon = item.type === 'hotel'
        ? JMD.Utils.getIcon('hotel', 18)
        : item.type === 'area'
        ? JMD.Utils.getIcon('location', 18)
        : item.type === 'landmark'
        ? JMD.Utils.getIcon('airport', 18)
        : JMD.Utils.getIcon('city', 18);
      const subtext = item.type === 'hotel'
        ? `Hotel · ${item.city}`
        : `${item.type.charAt(0).toUpperCase() + item.type.slice(1)} · ${item.state || item.country}`;
      return `
        <div class="search-dropdown__item" data-value="${item.name}" data-type="${item.type}">
          <div class="search-dropdown__item-icon" style="color:var(--color-primary);display:flex;align-items:center">${icon}</div>
          <div>
            <div class="search-dropdown__item-text">${item.name}</div>
            <div class="search-dropdown__item-subtext">${subtext}</div>
          </div>
        </div>
      `;
    }).join('');

    dropdown.classList.add('search-dropdown--open');

    // Attach click handlers
    dropdown.querySelectorAll('.search-dropdown__item').forEach(item => {
      item.addEventListener('click', () => {
        const input = document.getElementById('search-destination');
        input.value = item.dataset.value;
        this.state.destination = item.dataset.value;
        dropdown.classList.remove('search-dropdown--open');
      });
    });
  },

  /* ---- Date Picker ---- */
  initDatePicker() {
    const checkinInput = document.getElementById('search-checkin');
    const checkoutInput = document.getElementById('search-checkout');
    const checkinPicker = document.getElementById('checkin-datepicker');
    const checkoutPicker = document.getElementById('checkout-datepicker');

    if (checkinInput && checkinPicker) {
      this._setupDatePicker(checkinInput, checkinPicker, 'checkin');
    }
    if (checkoutInput && checkoutPicker) {
      this._setupDatePicker(checkoutInput, checkoutPicker, 'checkout');
    }

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-widget__field--checkin')) {
        if (checkinPicker) checkinPicker.classList.remove('datepicker--open');
      }
      if (!e.target.closest('.search-widget__field--checkout')) {
        if (checkoutPicker) checkoutPicker.classList.remove('datepicker--open');
      }
    });
  },

  _currentMonth: new Date().getMonth(),
  _currentYear: new Date().getFullYear(),

  _setupDatePicker(input, picker, type) {
    input.addEventListener('click', (e) => {
      e.stopPropagation();
      // Close other pickers
      document.querySelectorAll('.datepicker--open').forEach(p => {
        if (p !== picker) p.classList.remove('datepicker--open');
      });
      document.querySelectorAll('.guest-selector--open').forEach(g => g.classList.remove('guest-selector--open'));
      document.querySelectorAll('.search-dropdown--open').forEach(d => d.classList.remove('search-dropdown--open'));

      this._currentMonth = new Date().getMonth();
      this._currentYear = new Date().getFullYear();
      this._renderCalendar(picker, type);
      picker.classList.toggle('datepicker--open');
    });
  },

  _renderCalendar(picker, type) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const month = this._currentMonth;
    const year = this._currentYear;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthName = new Date(year, month).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

    const nights = this.state.checkin && this.state.checkout
      ? JMD.Utils.calculateNights(this.state.checkin, this.state.checkout)
      : 0;

    let html = `
      <div class="datepicker__header">
        <button class="datepicker__nav datepicker__nav--prev" aria-label="Previous month">‹</button>
        <span class="datepicker__month-title">${monthName}</span>
        <button class="datepicker__nav datepicker__nav--next" aria-label="Next month">›</button>
      </div>
      <div class="datepicker__weekdays">
        <span class="datepicker__weekday">Su</span>
        <span class="datepicker__weekday">Mo</span>
        <span class="datepicker__weekday">Tu</span>
        <span class="datepicker__weekday">We</span>
        <span class="datepicker__weekday">Th</span>
        <span class="datepicker__weekday">Fr</span>
        <span class="datepicker__weekday">Sa</span>
      </div>
      <div class="datepicker__grid">
    `;

    // Empty cells for days before first
    for (let i = 0; i < firstDay; i++) {
      html += '<span class="datepicker__day datepicker__day--disabled"></span>';
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = JMD.Utils.formatDateISO(date);
      const isPast = date < today;
      const isToday = date.getTime() === today.getTime();
      const isCheckin = dateStr === this.state.checkin;
      const isCheckout = dateStr === this.state.checkout;
      const isInRange = this.state.checkin && this.state.checkout &&
        date > new Date(this.state.checkin) && date < new Date(this.state.checkout);

      let classes = 'datepicker__day';
      if (isPast) classes += ' datepicker__day--disabled';
      if (isToday) classes += ' datepicker__day--today';
      if (isCheckin || isCheckout) classes += ' datepicker__day--selected';
      if (isInRange) classes += ' datepicker__day--in-range';
      if (isCheckin) classes += ' datepicker__day--range-start';
      if (isCheckout) classes += ' datepicker__day--range-end';

      html += `<button class="${classes}" data-date="${dateStr}" ${isPast ? 'disabled' : ''}>${day}</button>`;
    }

    html += '</div>';
    if (nights > 0) {
      html += `<div class="datepicker__footer">${nights} night${nights > 1 ? 's' : ''} selected</div>`;
    }

    picker.innerHTML = html;

    // Nav handlers
    picker.querySelector('.datepicker__nav--prev').addEventListener('click', (e) => {
      e.stopPropagation();
      this._currentMonth--;
      if (this._currentMonth < 0) { this._currentMonth = 11; this._currentYear--; }
      this._renderCalendar(picker, type);
    });

    picker.querySelector('.datepicker__nav--next').addEventListener('click', (e) => {
      e.stopPropagation();
      this._currentMonth++;
      if (this._currentMonth > 11) { this._currentMonth = 0; this._currentYear++; }
      this._renderCalendar(picker, type);
    });

    // Day click handlers
    picker.querySelectorAll('.datepicker__day:not(.datepicker__day--disabled)').forEach(dayBtn => {
      dayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const selectedDate = dayBtn.dataset.date;

        if (type === 'checkin') {
          this.state.checkin = selectedDate;
          const checkinInput = document.getElementById('search-checkin');
          if (checkinInput) {
            checkinInput.value = JMD.Utils.formatDateShort(selectedDate);
            checkinInput.dataset.value = selectedDate;
          }
          // Auto-set checkout to next day if not set or if before checkin
          if (!this.state.checkout || new Date(this.state.checkout) <= new Date(selectedDate)) {
            const nextDay = new Date(selectedDate);
            nextDay.setDate(nextDay.getDate() + 1);
            this.state.checkout = JMD.Utils.formatDateISO(nextDay);
            const checkoutInput = document.getElementById('search-checkout');
            if (checkoutInput) {
              checkoutInput.value = JMD.Utils.formatDateShort(this.state.checkout);
              checkoutInput.dataset.value = this.state.checkout;
            }
          }
          picker.classList.remove('datepicker--open');
          // Open checkout picker
          const checkoutPicker = document.getElementById('checkout-datepicker');
          if (checkoutPicker) {
            this._renderCalendar(checkoutPicker, 'checkout');
            checkoutPicker.classList.add('datepicker--open');
          }
        } else {
          this.state.checkout = selectedDate;
          const checkoutInput = document.getElementById('search-checkout');
          if (checkoutInput) {
            checkoutInput.value = JMD.Utils.formatDateShort(selectedDate);
            checkoutInput.dataset.value = selectedDate;
          }
          picker.classList.remove('datepicker--open');
        }
      });
    });
  },

  /* ---- Guest Selector ---- */
  initGuestSelector() {
    const guestsInput = document.getElementById('search-guests');
    const selector = document.getElementById('guest-selector');
    if (!guestsInput || !selector) return;

    guestsInput.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.datepicker--open').forEach(p => p.classList.remove('datepicker--open'));
      document.querySelectorAll('.search-dropdown--open').forEach(d => d.classList.remove('search-dropdown--open'));
      this._renderGuestSelector(selector);
      selector.classList.toggle('guest-selector--open');
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-widget__field--guests')) {
        selector.classList.remove('guest-selector--open');
      }
    });
  },

  _renderGuestSelector(selector) {
    selector.innerHTML = `
      <div class="guest-selector__row">
        <div>
          <div class="guest-selector__label-text">Adults</div>
          <div class="guest-selector__label-sub">Age 13+</div>
        </div>
        <div class="guest-selector__controls">
          <button class="guest-selector__btn" data-action="decrease" data-field="adults" ${this.state.adults <= 1 ? 'disabled' : ''} aria-label="Decrease adults">−</button>
          <span class="guest-selector__value">${this.state.adults}</span>
          <button class="guest-selector__btn" data-action="increase" data-field="adults" aria-label="Increase adults">+</button>
        </div>
      </div>
      <div class="guest-selector__row">
        <div>
          <div class="guest-selector__label-text">Children</div>
          <div class="guest-selector__label-sub">Age 0–12</div>
        </div>
        <div class="guest-selector__controls">
          <button class="guest-selector__btn" data-action="decrease" data-field="children" ${this.state.children <= 0 ? 'disabled' : ''} aria-label="Decrease children">−</button>
          <span class="guest-selector__value">${this.state.children}</span>
          <button class="guest-selector__btn" data-action="increase" data-field="children" aria-label="Increase children">+</button>
        </div>
      </div>
      <div class="guest-selector__row">
        <div>
          <div class="guest-selector__label-text">Rooms</div>
        </div>
        <div class="guest-selector__controls">
          <button class="guest-selector__btn" data-action="decrease" data-field="rooms" ${this.state.rooms <= 1 ? 'disabled' : ''} aria-label="Decrease rooms">−</button>
          <span class="guest-selector__value">${this.state.rooms}</span>
          <button class="guest-selector__btn" data-action="increase" data-field="rooms" aria-label="Increase rooms">+</button>
        </div>
      </div>
      <button class="btn btn-primary btn-sm guest-selector__done">Done</button>
    `;

    selector.querySelectorAll('.guest-selector__btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const field = btn.dataset.field;
        const action = btn.dataset.action;
        const mins = { adults: 1, children: 0, rooms: 1 };
        const maxs = { adults: 10, children: 6, rooms: 5 };

        if (action === 'increase' && this.state[field] < maxs[field]) {
          this.state[field]++;
        } else if (action === 'decrease' && this.state[field] > mins[field]) {
          this.state[field]--;
        }

        this._renderGuestSelector(selector);
        const guestsInput = document.getElementById('search-guests');
        if (guestsInput) guestsInput.value = this.getGuestsText();
      });
    });

    selector.querySelector('.guest-selector__done').addEventListener('click', (e) => {
      e.stopPropagation();
      selector.classList.remove('guest-selector--open');
    });
  },

  /* ---- Search Form ---- */
  initSearchForm() {
    const form = document.getElementById('search-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.performSearch();
    });
  },

  performSearch() {
    const destInput = document.getElementById('search-destination');
    if (destInput) this.state.destination = destInput.value;

    const url = JMD.Utils.buildURL('hotels.html', {
      destination: this.state.destination,
      checkin: this.state.checkin,
      checkout: this.state.checkout,
      adults: this.state.adults,
      children: this.state.children,
      rooms: this.state.rooms
    });

    window.location.href = url;
  }
};
