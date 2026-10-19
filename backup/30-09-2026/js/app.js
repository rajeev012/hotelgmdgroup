/* ============================================================
   JMD GROUP OF HOTELS — Main Application
   ============================================================ */

JMD.App = {
  init() {
    this.initHeader();
    this.initMobileNav();
    this.initBackToTop();
    this.initWhatsAppWidget();
    JMD.Utils.initLazyImages();
    JMD.Wishlist._updateUI();
    this.handleImageErrors();
  },

  /* ---- Header Scroll Behavior ---- */
  initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    const isHomepage = header.classList.contains('header--transparent');

    const handleScroll = () => {
      if (window.scrollY > 50) {
        header.classList.add('header--scrolled');
        if (isHomepage) header.classList.remove('header--transparent');
      } else {
        header.classList.remove('header--scrolled');
        if (isHomepage) header.classList.add('header--transparent');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  },

  /* ---- Mobile Navigation (Single Unified Responsive Menu) ---- */
  initMobileNav() {
    const toggle = document.querySelector('.header__mobile-toggle');
    const headerNav = document.querySelector('.header__nav');
    const mobileNav = document.querySelector('.mobile-nav');
    const overlay = document.querySelector('.header__nav-overlay') || document.querySelector('.mobile-nav-overlay');
    const closeBtn = document.querySelector('.header__nav-close') || document.querySelector('.mobile-nav__close');

    if (!toggle) return;

    const nav = headerNav || mobileNav;
    if (!nav) return;

    const openNav = () => {
      if (headerNav) headerNav.classList.add('header__nav--open');
      if (mobileNav) mobileNav.classList.add('mobile-nav--open');
      toggle.setAttribute('aria-expanded', 'true');
      if (overlay) {
        overlay.classList.add('header__nav-overlay--visible', 'mobile-nav-overlay--visible');
      }
      document.body.style.overflow = 'hidden';
    };

    const closeNav = () => {
      if (headerNav) headerNav.classList.remove('header__nav--open');
      if (mobileNav) mobileNav.classList.remove('mobile-nav--open');
      toggle.setAttribute('aria-expanded', 'false');
      if (overlay) {
        overlay.classList.remove('header__nav-overlay--visible', 'mobile-nav-overlay--visible');
      }
      document.body.style.overflow = '';
    };

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = (headerNav && headerNav.classList.contains('header__nav--open')) ||
                     (mobileNav && mobileNav.classList.contains('mobile-nav--open'));
      if (isOpen) {
        closeNav();
      } else {
        openNav();
      }
    });

    // Setup SVG close icon on all close buttons
    document.querySelectorAll('.header__nav-close, .mobile-nav__close').forEach(btn => {
      btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeNav();
      });
    });

    // Hide 'Book Now' button in mobile menu per user request
    document.querySelectorAll('.header__nav-drawer-footer .btn, .header__nav .header__nav-drawer-footer a[href*="hotels.html"].btn').forEach(btn => {
      btn.style.display = 'none';
    });

    // Inject stylish Concierge Help card into mobile drawer if not present
    const drawerList = document.querySelector('.header__nav-list');
    if (drawerList && !document.querySelector('.header__nav-drawer-help')) {
      const help = document.createElement('div');
      help.className = 'header__nav-drawer-help';
      help.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between">
          <span style="font-size:11px;font-weight:700;color:#93c5fd;text-transform:uppercase;letter-spacing:0.8px;display:inline-flex;align-items:center;gap:6px">
            <span style="width:7px;height:7px;border-radius:50%;background:#22c55e;display:inline-block"></span>
            Airport Concierge
          </span>
          <span style="font-size:11px;color:#febb02;font-weight:700">★ 4.8 Rating</span>
        </div>
        <a href="tel:+919319366279" style="font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;display:flex;align-items:center;gap:6px">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          +91 93193 66279
        </a>
        <div style="font-size:11px;color:rgba(255,255,255,0.7);line-height:1.4">
          Free airport shuttle assistance on direct bookings
        </div>
      `;
      if (drawerList.parentNode) {
        const footer = drawerList.parentNode.querySelector('.header__nav-drawer-footer');
        if (footer) {
          drawerList.parentNode.insertBefore(help, footer);
        } else {
          drawerList.parentNode.appendChild(help);
        }
      }
    }

    if (overlay) overlay.addEventListener('click', closeNav);

    // Global delegation for close button
    document.addEventListener('click', (e) => {
      if (e.target.closest('.header__nav-close, .mobile-nav__close')) {
        e.preventDefault();
        closeNav();
      }
    });

    // Close on any link click inside the navigation
    document.querySelectorAll('.header__nav a, .mobile-nav a').forEach(link => {
      link.addEventListener('click', closeNav);
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeNav();
    });
  },

  /* ---- Back to Top ---- */
  initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('back-to-top--visible', window.scrollY > 400);
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  },

  /* ---- Floating WhatsApp Chat with Live Blinker ---- */
  initWhatsAppWidget() {
    if (document.getElementById('whatsapp-widget')) return;

    const widget = document.createElement('div');
    widget.className = 'whatsapp-widget';
    widget.id = 'whatsapp-widget';
    widget.innerHTML = `
      <div class="whatsapp-bubble" id="whatsapp-bubble">
        <div class="whatsapp-bubble__header">
          <div class="whatsapp-avatar">
            <img src="assets/brand/logo.webp" alt="JMD Support">
            <span class="whatsapp-online-dot"></span>
          </div>
          <div>
            <div class="whatsapp-bubble__title">JMD Concierge Desk</div>
            <div class="whatsapp-bubble__status">Online · Replies in 1 min</div>
          </div>
          <button class="whatsapp-bubble__close" id="whatsapp-close" aria-label="Close chat">&times;</button>
        </div>
        <div class="whatsapp-bubble__body">
          <div class="whatsapp-message">
            <p>Namaste! Welcome to JMD Group of Hotels.</p>
            <p>Looking for the best hotel near Delhi Airport or room booking discount?</p>
            <span class="whatsapp-time">Just now</span>
          </div>
        </div>
        <a href="https://wa.me/919319366279?text=Hello%20JMD%20Group%20Hotels,%20I%20would%20like%20to%20inquire%20about%20booking%20a%20stay." target="_blank" rel="noopener" class="whatsapp-bubble__btn">
          ${JMD.Utils.getIcon('whatsapp', 18)} Start Chat on WhatsApp
        </a>
      </div>
      <button class="whatsapp-btn" id="whatsapp-btn" aria-label="Chat with us on WhatsApp" title="24/7 Hotel Assistance">
        ${JMD.Utils.getIcon('whatsapp', 28)}
        <span class="whatsapp-blinker" title="Support Online"></span>
      </button>
    `;
    document.body.appendChild(widget);

    const btn = document.getElementById('whatsapp-btn');
    const bubble = document.getElementById('whatsapp-bubble');
    const close = document.getElementById('whatsapp-close');

    if (btn && bubble) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        bubble.classList.toggle('whatsapp-bubble--open');
      });
    }

    if (close && bubble) {
      close.addEventListener('click', (e) => {
        e.stopPropagation();
        bubble.classList.remove('whatsapp-bubble--open');
      });
    }

    document.addEventListener('click', (e) => {
      if (bubble && !bubble.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
        bubble.classList.remove('whatsapp-bubble--open');
      }
    });
  },

  /* ---- Handle broken images globally ---- */
  handleImageErrors() {
    document.querySelectorAll('img').forEach(img => {
      if (!img.dataset.fallbackSet) {
        img.addEventListener('error', function() {
          if (!this.dataset.fallbackSet) {
            this.dataset.fallbackSet = 'true';
            this.src = JMD.Utils.placeholderImage(
              this.width || 600,
              this.height || 400,
              this.alt || 'JMD Hotels'
            );
          }
        });
      }
    });
  },

  /* ---- Render Header HTML (Single Unified Responsive Navigation) ---- */
  renderHeader(options = {}) {
    const isTransparent = options.transparent !== false;
    const activePage = options.activePage || '';

    return `
    <header class="header ${isTransparent ? 'header--transparent' : 'header--scrolled'}" role="banner">
      <div class="header__inner">
        <a href="index.html" class="header__logo" aria-label="JMD Group of Hotels - Home">
          <img src="assets/brand/logo.webp" alt="JMD Group of Hotels" class="header__logo-img">
          <div class="header__logo-text">
            JMD Group
            <span>of Hotels</span>
          </div>
        </a>

        <!-- Single Unified Responsive Menu (Converts automatically on mobile) -->
        <nav class="header__nav" id="main-nav" aria-label="Main navigation">
          <!-- Mobile Drawer Header -->
          <div class="header__nav-drawer-head">
            <div class="header__nav-drawer-brand">
              <img src="assets/brand/logo.webp" alt="JMD Logo">
              <div>
                <div style="font-weight:700;color:#fff;font-size:15px">JMD Group</div>
                <div style="font-size:11px;color:var(--color-secondary);font-weight:500">of Hotels · New Delhi</div>
              </div>
            </div>
            <button type="button" class="header__nav-close" aria-label="Close menu">&times;</button>
          </div>

          <!-- Navigation Links -->
          <ul class="header__nav-list">
            <li><a href="index.html" class="header__nav-link ${activePage === 'home' ? 'header__nav-link--active' : ''}">Home</a></li>
            <li><a href="hotels.html" class="header__nav-link ${activePage === 'hotels' ? 'header__nav-link--active' : ''}">Hotels</a></li>
            <li><a href="about.html" class="header__nav-link ${activePage === 'about' ? 'header__nav-link--active' : ''}">About</a></li>
            <li><a href="offers.html" class="header__nav-link ${activePage === 'offers' ? 'header__nav-link--active' : ''}">Offers</a></li>
            <li><a href="experiences.html" class="header__nav-link ${activePage === 'experiences' ? 'header__nav-link--active' : ''}">Experiences</a></li>
            <li><a href="contact.html" class="header__nav-link ${activePage === 'contact' ? 'header__nav-link--active' : ''}">Contact</a></li>
          </ul>

          <!-- Mobile Drawer Quick Actions -->
          <div class="header__nav-drawer-footer">
            <a href="my-booking.html" class="header__nav-drawer-link">
              ${JMD.Utils.getIcon('calendar', 16)} My Booking
            </a>
            <a href="favorites.html" class="header__nav-drawer-link">
              ${JMD.Utils.getIcon('heart', 16)} Saved Hotels
            </a>
            <a href="hotels.html" class="btn btn-primary" style="width:100%;margin-top:6px;text-align:center">Book Now</a>
          </div>
        </nav>

        <div class="header__actions">
          <a href="my-booking.html" class="header__booking-link">
            ${JMD.Utils.getIcon('calendar', 16)} My Booking
          </a>
          <a href="hotels.html" class="btn btn-primary header__book-btn">Book Now</a>
          <button class="header__mobile-toggle" aria-label="Open menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>
    <div class="header__nav-overlay" aria-hidden="true"></div>
    `;
  },

  /* ---- Render Footer HTML ---- */
  renderFooter() {
    return `
    <footer class="footer" role="contentinfo">
      <div class="container">
        <!-- Trust Bar -->
        <div class="footer__trust-bar">
          <div class="footer__trust-item">
            <div class="footer__trust-icon">${JMD.Utils.getIcon('verified', 22)}</div>
            <div>
              <div class="footer__trust-title">Best Rate Guarantee</div>
              <div class="footer__trust-desc">Direct booking perks & discounts</div>
            </div>
          </div>
          <div class="footer__trust-item">
            <div class="footer__trust-icon">${JMD.Utils.getIcon('airport', 22)}</div>
            <div>
              <div class="footer__trust-title">Free Airport Transfers</div>
              <div class="footer__trust-desc">IGI Airport T1, T2 & T3 connectivity</div>
            </div>
          </div>
          <div class="footer__trust-item">
            <div class="footer__trust-icon">${JMD.Utils.getIcon('clock', 22)}</div>
            <div>
              <div class="footer__trust-title">24/7 Front Desk</div>
              <div class="footer__trust-desc">Round-the-clock concierge & room service</div>
            </div>
          </div>
          <div class="footer__trust-item">
            <div class="footer__trust-icon">${JMD.Utils.getIcon('shield', 22)}</div>
            <div>
              <div class="footer__trust-title">100% Secure Booking</div>
              <div class="footer__trust-desc">Instant confirmation · Zero hidden charges</div>
            </div>
          </div>
        </div>

        <div class="footer__grid">
          <div class="footer__brand">
            <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
              <img src="assets/brand/logo.webp" alt="JMD Group of Hotels" class="footer__logo-img">
              <div>
                <div class="footer__brand-title">JMD Group</div>
                <span class="footer__brand-subtitle">of Hotels · New Delhi</span>
              </div>
            </div>
            <p class="footer__description">JMD Group of Hotels offers premier hospitality experiences with handpicked boutique & luxury properties near Indira Gandhi International Airport, Mahipalpur and Aerocity, New Delhi.</p>
            <div class="footer__social">
              <a href="https://wa.me/919319366279" target="_blank" rel="noopener" class="footer__social-link" aria-label="WhatsApp">${JMD.Utils.getIcon('whatsapp', 18)}</a>
              <a href="tel:+919319366279" class="footer__social-link" aria-label="Call">${JMD.Utils.getIcon('phone', 18)}</a>
              <a href="mailto:info@jmdgrouphotels.com" class="footer__social-link" aria-label="Email">${JMD.Utils.getIcon('mail', 18)}</a>
            </div>
          </div>

          <div>
            <h4 class="footer__column-title">Company</h4>
            <a href="about.html" class="footer__link">About JMD Group</a>
            <a href="hotels.html" class="footer__link">Our Hotels</a>
            <a href="offers.html" class="footer__link">Special Offers</a>
            <a href="experiences.html" class="footer__link">Dining & Experiences</a>
            <a href="contact.html" class="footer__link">Contact Us</a>
          </div>

          <div>
            <h4 class="footer__column-title">Destinations</h4>
            <a href="hotels.html?destination=Mahipalpur" class="footer__link">Hotels near IGI Airport</a>
            <a href="hotels.html?destination=Aerocity" class="footer__link">Aerocity Luxury Stays</a>
            <a href="hotels.html?destination=Delhi" class="footer__link">South Delhi Hotels</a>
            <a href="hotels.html" class="footer__link">All 7+ Properties</a>
          </div>

          <div>
            <h4 class="footer__column-title">24/7 Assistance</h4>
            <div class="footer__contact-item">
              <span class="footer__contact-icon">${JMD.Utils.getIcon('phone', 16)}</span>
              <span><strong>Reservations:</strong><br>+91-9319366279</span>
            </div>
            <div class="footer__contact-item">
              <span class="footer__contact-icon">${JMD.Utils.getIcon('mail', 16)}</span>
              <span>info@jmdgrouphotels.com</span>
            </div>
            <div class="footer__contact-item">
              <span class="footer__contact-icon">${JMD.Utils.getIcon('location', 16)}</span>
              <span>Mahipalpur, Near IGI Airport, New Delhi - 110037</span>
            </div>
          </div>
        </div>

        <div class="footer__bottom">
          <span class="footer__copyright">© 2026 JMD Group of Hotels. All Rights Reserved.</span>
          <div class="footer__bottom-links">
            <a href="my-booking.html" class="footer__bottom-link">Manage Booking</a>
            <a href="faq.html" class="footer__bottom-link">FAQ</a>
            <a href="contact.html" class="footer__bottom-link">Privacy Policy</a>
            <a href="contact.html" class="footer__bottom-link">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </footer>

    <button class="back-to-top" aria-label="Back to top">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 15l-6-6-6 6"/></svg>
    </button>
    `;
  },

  /* ---- Render Search Widget ---- */
  renderSearchWidget() {
    return `
    <section class="search-widget" aria-label="Hotel Search">
      <div class="search-widget__inner">
        <div class="search-widget__perks-bar">
          <div class="search-widget__perk-item">
            <span class="search-widget__perk-dot"></span>
            <span class="search-widget__perk-badge">Official Booking</span>
            <span>Best Price Guarantee &middot; Extra 15% Off (Code: <strong>WELCOME10</strong>)</span>
          </div>
          <div class="search-widget__perk-item search-widget__perk-item--desktop">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>
            Free Delhi Airport Transfers
          </div>
          <div class="search-widget__perk-item search-widget__perk-item--desktop">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="20 6 9 17 4 12"/></svg>
            Pay at Hotel &middot; Zero Booking Fee
          </div>
        </div>

        <form class="search-widget__form" id="search-form">
          <div class="search-widget__field search-widget__field--destination">
            <label class="search-widget__label" for="search-destination">Destination / Hotel</label>
            <svg class="search-widget__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" class="search-widget__input" id="search-destination" placeholder="Where are you going?" autocomplete="off" aria-label="Search destination">
            <div class="search-dropdown" id="destination-dropdown" role="listbox"></div>
          </div>
          <div class="search-widget__field search-widget__field--checkin">
            <label class="search-widget__label" for="search-checkin">Check-in Date</label>
            <svg class="search-widget__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            <input type="text" class="search-widget__input" id="search-checkin" placeholder="Select date" readonly aria-label="Check-in date">
            <div class="datepicker" id="checkin-datepicker"></div>
          </div>
          <div class="search-widget__field search-widget__field--checkout">
            <label class="search-widget__label" for="search-checkout">Check-out Date</label>
            <svg class="search-widget__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
            <input type="text" class="search-widget__input" id="search-checkout" placeholder="Select date" readonly aria-label="Check-out date">
            <div class="datepicker" id="checkout-datepicker"></div>
          </div>
          <div class="search-widget__field search-widget__field--guests">
            <label class="search-widget__label" for="search-guests">Guests & Rooms</label>
            <svg class="search-widget__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
            <input type="text" class="search-widget__input" id="search-guests" placeholder="2 adults · 1 room" readonly aria-label="Guests and rooms">
            <div class="guest-selector" id="guest-selector"></div>
          </div>
          <button type="submit" class="btn btn-primary search-widget__btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <span>Search Hotels</span>
          </button>
        </form>

        <div class="search-widget__quick-tags">
          <span class="search-widget__quick-label">Popular:</span>
          <button type="button" class="search-widget__quick-chip" data-dest="IGI Airport">Near Airport Terminal 3</button>
          <button type="button" class="search-widget__quick-chip" data-dest="Aerocity">Aerocity Metro</button>
          <button type="button" class="search-widget__quick-chip" data-dest="Mahipalpur">Mahipalpur Hub</button>
          <button type="button" class="search-widget__quick-chip" data-dest="Vasant Kunj">Vasant Kunj</button>
        </div>
      </div>
    </section>
    `;
  },

  /* ---- Render Featured Hotel Card ---- */
  renderFeaturedCard(hotel) {
    const isWished = JMD.Wishlist.has(hotel.id);
    const imgSrc = hotel.images && hotel.images.length > 0
      ? hotel.images[0]
      : JMD.Utils.placeholderImage(600, 450, hotel.name);
    const originalPrice = hotel.priceFrom ? Math.round(hotel.priceFrom * 1.35) : null;

    return `
    <article class="featured-card" style="border:1px solid #e2e8f0;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,53,128,0.06);transition:all 0.25s">
      <div class="featured-card__image" style="position:relative;aspect-ratio:4/3;overflow:hidden">
        <img src="${imgSrc}" alt="${hotel.name}" loading="lazy" style="width:100%;height:100%;object-fit:cover"
          onerror="this.src=JMD.Utils.placeholderImage(600,450,'${hotel.name.replace(/'/g, "\\'")}')">
        <span class="card-badge" style="position:absolute;top:12px;left:12px;background:#003580;color:#fff;font-weight:700;font-size:11px;padding:4px 10px;border-radius:4px;text-transform:uppercase;letter-spacing:0.5px">
          ${hotel.badges && hotel.badges.length > 0 ? hotel.badges[0] : 'Top Pick'}
        </span>
        <button class="featured-card__wishlist ${isWished ? 'featured-card__wishlist--active hotel-card__wishlist--active' : ''}"
          data-wishlist-id="${hotel.id}" onclick="JMD.Wishlist.toggle('${hotel.id}')" aria-label="Add to favorites"
          style="position:absolute;top:12px;right:12px;background:rgba(255,255,255,0.9);width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:none;cursor:pointer">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="${isWished ? '#d4111e' : 'none'}" stroke="${isWished ? '#d4111e' : '#1f2937'}" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>
      <div class="featured-card__body" style="padding:18px">
        <div class="hotel-card__stars" style="margin-bottom:6px">${JMD.Utils.renderStars(hotel.starRating)}</div>
        <h3 class="featured-card__name" style="margin-bottom:6px"><a href="hotel.html?slug=${hotel.slug}" style="color:#00224f;font-weight:700;text-decoration:none">${hotel.name}</a></h3>
        <div class="featured-card__location" style="display:flex;align-items:center;gap:4px;font-size:13px;color:#4b5563;margin-bottom:12px">
          ${JMD.Utils.getIcon('location', 14)}
          <span>${hotel.location.city} · ${hotel.location.area}</span>
        </div>
        ${hotel.guestRating ? `
        <div class="hotel-card__rating" style="display:flex;align-items:center;gap:8px;margin-bottom:12px">
          <span style="background:#003580;color:#fff;font-weight:700;padding:3px 7px;border-radius:4px;font-size:12px">${hotel.guestRating}</span>
          <span style="font-weight:600;font-size:13px;color:#1f2937">${JMD.Utils.getRatingLabel(hotel.guestRating)}</span>
          <span style="font-size:12px;color:#6b7280">(${hotel.reviewCount.toLocaleString()} reviews)</span>
        </div>` : ''}
        <div class="featured-card__meta" style="display:flex;align-items:flex-end;justify-content:space-between;border-top:1px solid #f1f5f9;padding-top:12px">
          <div class="featured-card__price">
            ${originalPrice ? `<div style="font-size:11px;color:#9ca3af;text-decoration:line-through">₹${originalPrice.toLocaleString('en-IN')}</div>` : ''}
            <div style="font-size:18px;font-weight:800;color:#003580">
              ${hotel.priceFrom ? `${JMD.Utils.formatPrice(hotel.priceFrom)} <span style="font-size:12px;font-weight:400;color:#6b7280">/ night</span>` : 'Price on request'}
            </div>
          </div>
          <a href="hotel.html?slug=${hotel.slug}" class="btn btn-primary btn-sm" style="background:#006ce4;color:#fff;font-weight:600;padding:8px 16px;border-radius:6px;text-decoration:none">View Deal</a>
        </div>
      </div>
    </article>
    `;
  },

  /* ---- Render Hotel List Card ---- */
  renderHotelCard(hotel) {
    const isWished = JMD.Wishlist.has(hotel.id);
    const imgSrc = hotel.images && hotel.images.length > 0
      ? hotel.images[0]
      : JMD.Utils.placeholderImage(600, 400, hotel.name);

    const originalPrice = hotel.priceFrom ? Math.round(hotel.priceFrom * 1.35) : null;
    const amenityMap = {
      'free-wifi': { name: 'Free WiFi', icon: 'wifi' },
      'parking': { name: 'Free Parking', icon: 'parking' },
      'restaurant': { name: 'Restaurant', icon: 'restaurant' },
      'room-service': { name: 'Room Service', icon: 'roomService' },
      'air-conditioning': { name: 'AC', icon: 'ac' },
      'airport-transfer': { name: 'Airport Shuttle', icon: 'airport' },
      'breakfast': { name: 'Breakfast', icon: 'breakfast' },
      'laundry': { name: 'Laundry', icon: 'laundry' },
      '24hr-reception': { name: '24h Desk', icon: 'clock' },
      'gym': { name: 'Fitness Gym', icon: 'gym' },
      'conference-facilities': { name: 'Conference', icon: 'conference' }
    };

    const renderedAmenities = hotel.amenities.slice(0, 4).map(a => {
      const item = amenityMap[a] || { name: a, icon: 'check' };
      return `<span class="hotel-card__amenity" style="display:inline-flex;align-items:center;gap:4px;background:#f3f4f6;padding:3px 8px;border-radius:4px;font-size:11px;font-weight:500;color:#374151">
        ${JMD.Utils.getIcon(item.icon, 12)} ${item.name}
      </span>`;
    }).join('');

    return `
    <article class="hotel-card" id="hotel-card-${hotel.id}">
      <div class="hotel-card__image" style="position:relative">
        <img src="${imgSrc}" alt="${hotel.name}" loading="lazy"
          onerror="this.src=JMD.Utils.placeholderImage(600,400,'${hotel.name.replace(/'/g, "\\'")}')">
        <button class="hotel-card__wishlist ${isWished ? 'hotel-card__wishlist--active' : ''}"
          data-wishlist-id="${hotel.id}" onclick="JMD.Wishlist.toggle('${hotel.id}')" aria-label="Add to favorites">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="${isWished ? '#d4111e' : 'none'}" stroke="${isWished ? '#d4111e' : '#1f2937'}" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
        ${hotel.badges && hotel.badges.length > 0 ? `<span class="hotel-card__badge" style="background:#003580">${hotel.badges[0]}</span>` : ''}
        ${hotel.images && hotel.images.length > 1 ? `
          <span class="hotel-card__image-count">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
            ${hotel.images.length} Photos
          </span>
        ` : ''}
      </div>
      <div class="hotel-card__info">
        <div style="display:flex;align-items:center;gap:8px">
          <div class="hotel-card__stars">${JMD.Utils.renderStars(hotel.starRating)}</div>
          <span style="font-size:11px;color:#006ce4;font-weight:600;text-transform:uppercase;background:#e8f2fd;padding:2px 6px;border-radius:3px">Airport Hotel</span>
        </div>
        <h3 class="hotel-card__name" style="margin:4px 0"><a href="hotel.html?slug=${hotel.slug}">${hotel.name}</a></h3>
        <div class="hotel-card__location">
          ${JMD.Utils.getIcon('location', 14)}
          <span>${hotel.location.city} · ${hotel.location.area} · <strong style="color:#006ce4">Show on map</strong></span>
        </div>
        ${hotel.guestRating ? `
        <div class="hotel-card__rating">
          <span class="hotel-card__rating-badge" style="background:#003580 !important;color:#ffffff !important;display:inline-flex;align-items:center;justify-content:center;min-width:32px;height:30px;padding:0 6px;border-radius:6px;font-weight:700;font-size:13px">${hotel.guestRating}</span>
          <span class="hotel-card__rating-text">${JMD.Utils.getRatingLabel(hotel.guestRating)}</span>
          <span class="hotel-card__rating-count">· ${hotel.reviewCount.toLocaleString()} reviews</span>
        </div>` : ''}

        <!-- Booking.com style green perks -->
        <div class="hotel-card__perks">
          <span class="hotel-card__perk">${JMD.Utils.getIcon('check', 13)} Free Cancellation available</span>
          <span class="hotel-card__perk">${JMD.Utils.getIcon('check', 13)} Free Airport Shuttle Pick &amp; Drop</span>
          <span class="hotel-card__perk">${JMD.Utils.getIcon('check', 13)} Pay at Hotel option</span>
        </div>

        <div class="hotel-card__amenities" style="margin-top:6px">
          ${renderedAmenities}
        </div>
      </div>
      <div class="hotel-card__pricing">
        <span class="hotel-card__deal-tag">Early Booker Deal</span>
        <div class="hotel-card__price">
          ${originalPrice ? `<div class="hotel-card__price-original">₹${originalPrice.toLocaleString('en-IN')}</div>` : ''}
          <div class="hotel-card__price-amount">${hotel.priceFrom ? JMD.Utils.formatPrice(hotel.priceFrom) : 'N/A'}</div>
          <span class="hotel-card__price-period">per room / night</span>
          <span class="hotel-card__price-tax">+ ₹${hotel.priceFrom ? Math.round(hotel.priceFrom * 0.12).toLocaleString('en-IN') : 0} taxes &amp; fees</span>
        </div>
        <div class="hotel-card__actions">
          <a href="hotel.html?slug=${hotel.slug}" class="btn btn-primary btn-sm">Book Now</a>
          <a href="https://wa.me/919319366279?text=Hello%20JMD%20Hotels,%20I%20am%20interested%20in%20${encodeURIComponent(hotel.name)}" target="_blank" rel="noopener" class="btn btn-outline btn-sm" style="display:inline-flex;align-items:center;gap:4px">
            ${JMD.Utils.getIcon('whatsapp', 14)} WhatsApp
          </a>
        </div>
      </div>
    </article>
    `;
  },

  /* ---- Render Room Card ---- */
  renderRoomCard(room, hotelSlug, hotelName) {
    const imgSrc = room.images && room.images.length > 0
      ? room.images[0]
      : JMD.Utils.placeholderImage(480, 320, room.name);

    return `
    <div class="room-card">
      <div class="room-card__image">
        <img src="${imgSrc}" alt="${room.name}" loading="lazy"
          onerror="this.src=JMD.Utils.placeholderImage(480,320,'${room.name.replace(/'/g, "\\'")}')">
      </div>
      <div class="room-card__info">
        <h4 class="room-card__name">${room.name}</h4>
        ${room.description ? `<p style="font-size:var(--text-sm);color:var(--color-text-secondary);margin-bottom:var(--space-sm)">${room.description}</p>` : ''}
        <div class="room-card__features">
          ${room.bedType ? `<span class="room-card__feature">${JMD.Utils.getIcon('bed', 14)} ${room.bedType}</span>` : ''}
          ${room.maxGuests ? `<span class="room-card__feature">${JMD.Utils.getIcon('user', 14)} ${room.maxGuests} Guest${room.maxGuests > 1 ? 's' : ''}</span>` : ''}
          ${room.size ? `<span class="room-card__feature"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline-block;vertical-align:-1px"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg> ${room.size} ${room.sizeUnit || 'sqm'}</span>` : ''}
        </div>
        <div class="room-card__policies">
          ${room.breakfastIncluded ? `<span class="room-card__policy room-card__policy--positive">${JMD.Utils.getIcon('check', 13)} Breakfast included</span>` : ''}
          ${room.cancellationPolicy ? `<span class="room-card__policy room-card__policy--positive">${JMD.Utils.getIcon('check', 13)} Free cancellation</span>` : ''}
        </div>
      </div>
      <div class="room-card__pricing">
        <div>
          <span class="room-card__price-amount">${room.pricePerNight ? JMD.Utils.formatPrice(room.pricePerNight) : 'N/A'}</span>
          <span class="room-card__price-period">per night</span>
        </div>
        <button class="btn btn-primary btn-sm" onclick="JMD.App.selectRoom('${room.hotelId}', '${hotelName.replace(/'/g, "\\'")}', '${room.id}', '${room.name.replace(/'/g, "\\'")}', ${room.pricePerNight || 0})">
          Select Room
        </button>
      </div>
    </div>
    `;
  },

  selectRoom(hotelId, hotelName, roomId, roomName, price) {
    JMD.Booking.setRoom(hotelId, hotelName, roomId, roomName, price);

    const params = {
      hotel: hotelId,
      room: roomId,
      checkin: JMD.Search.state.checkin || '',
      checkout: JMD.Search.state.checkout || '',
      adults: JMD.Search.state.adults,
      children: JMD.Search.state.children,
      rooms: JMD.Search.state.rooms
    };
    window.location.href = JMD.Utils.buildURL('booking.html', params);
  }
};

/* ---- Initialize on DOM ready ---- */
document.addEventListener('DOMContentLoaded', () => {
  JMD.App.init();
});
