# JMD Group of Hotels — Digital Booking & Hospitality Platform

> **A luxury hotel discovery and booking web application engineered from scratch for the JMD Group of Hotels in New Delhi, India.** Built with semantic HTML5, modern CSS3 (custom design system), modular vanilla JavaScript, and JSON as the single source of truth, specifically engineered for seamless future PHP migration.

---

## 🌟 Table of Contents
1. [Project Overview](#project-overview)
2. [Key Highlights & Architectural Decisions](#key-highlights--architectural-decisions)
3. [Design System & Aesthetics](#design-system--aesthetics)
4. [File & Folder Structure](#file--folder-structure)
5. [JSON Data Schema (Single Source of Truth)](#json-data-schema)
6. [Interactive Features Walkthrough](#interactive-features-walkthrough)
7. [Future PHP Migration Guide](#future-php-migration-guide)
8. [Local Development & Testing](#local-development--testing)
9. [Feature Verification Checklist](#feature-verification-checklist)

---

## 1. Project Overview

The **JMD Group of Hotels** operates a portfolio of 10+ hotel properties strategically clustered along the Indira Gandhi International Airport (IGI) corridor in Mahipalpur and Aerocity, New Delhi. This web application provides a polished, high-performance, and responsive hotel discovery and booking platform tailored for corporate travellers, transit guests, couples, and vacationing families.

### Technology Stack
- **Structure:** Semantic HTML5 with Schema.org JSON-LD microdata
- **Styling:** Modular Vanilla CSS3 (Custom design system with CSS custom properties, zero Tailwind/Bootstrap dependencies)
- **Logic:** Vanilla ES6+ JavaScript modules (namespaced under `window.JMD`)
- **Data Source:** Static JSON files (`/data/*.json`) serving as the single source of truth
- **Assets:** Scalable Vector Graphics (SVG) icons and branding + optimized local photography

---

## 2. Key Highlights & Architectural Decisions

1. **Strict Zero-Framework Frontend:**
   - No React, Vue, Angular, Svelte, or TypeScript dependencies.
   - Clean, lightweight runtime that operates effortlessly in any modern browser.
2. **Future PHP Compatibility Built-In:**
   - Every page is structured with modular sections that mirror PHP partials (`header.php`, `footer.php`, `search-widget.php`).
   - Data fetching is cleanly encapsulated in `js/data.js`, enabling instant replacement with PHP server-side data models.
3. **Data Separated from Presentation:**
   - Hotel names, rates, room options, amenities, images, reviews, destinations, and FAQ items are strictly stored in JSON files.
   - Modifying a property price, description, or photo only requires editing JSON without touching presentation files.
4. **Complete Booking Flow Simulation:**
   - Dynamic room selection with real-time rate calculation, 18% GST computation, and discount codes (e.g. `WELCOME10`, `EARLYBIRD`).
   - LocalStorage persistence for bookings, reviews, wishlists, and recently viewed hotels.
   - Instant booking lookup and cancellation in the "Manage Booking" portal.

---

## 3. Design System & Aesthetics

The visual identity embodies contemporary Indian luxury hospitality with an editorial warm palette:

### Color Palette
- **Primary Navy:** `#0c192c` (Deep luxury navy for primary navigation and text headers)
- **Warm Gold Accent:** `#c9a96e` (Refined metallic gold for buttons, badges, highlights)
- **Deep Accent Gold:** `#a88340` (Hover and interactive states)
- **Surface Background:** `#f8f6f2` (Warm linen background offering high contrast)
- **Card Surface:** `#ffffff` (Crisp elevated containers with subtle border treatments)
- **Rating Colors:** `#059669` (Excellent 8.0+), `#0d9488` (Good 7.0+), `#f59e0b` (Average)

### Typography
- **Headings:** `Playfair Display`, `Georgia`, serif
- **Body & Controls:** `Outfit`, `Inter`, system-ui, sans-serif
- **Codes & Prices:** `JetBrains Mono`, `Consolas`, monospace

---

## 4. File & Folder Structure

```
d:/rajiv/hotelgmdgroup/
├── 404.html                     # Custom 404 error page
├── about.html                   # Group background, values, milestones & stats
├── booking-confirmation.html    # Confirmation receipt, booking ref & print view
├── booking.html                 # Guest checkout form & real-time price summary
├── contact.html                 # Direct contact info, enquiry form & map embed
├── experiences.html             # Travel persona editorial guides (Business, Transit, Dining)
├── faq.html                     # Accessible FAQ accordion with Schema.org microdata
├── favorites.html               # Wishlisted hotel list with instant booking actions
├── hotel.html                   # Detailed hotel view (Gallery, Rooms, Amenities, Reviews)
├── hotels.html                  # Filterable & searchable hotel directory
├── index.html                   # High-impact homepage with search widget & highlights
├── my-booking.html              # Booking lookup & reservation cancellation portal
├── offers.html                  # Special promotions & promo code clipboard copying
│
├── assets/
│   ├── brand/
│   │   ├── favicon.svg          # Luxury SVG favicon
│   │   └── logo.svg             # JMD Group brand SVG mark
│   └── images/
│       ├── destinations/        # High-res photography for Delhi destinations
│       ├── general/             # Special offer & lifestyle imagery
│       └── hotels/              # Exteriors, lobbies, rooms, and restaurants
│
├── css/
│   ├── main.css                 # Comprehensive design system, components & utilities
│   └── responsive.css           # Media queries for tablet, mobile, and desktop
│
├── data/
│   ├── amenities.json           # Master amenity catalog with icons & categorization
│   ├── destinations.json        # Delhi areas (Aerocity, Mahipalpur, IGI Airport)
│   ├── faqs.json                # Structured FAQs
│   ├── hotels.json              # 10 property profiles (coordinates, ratings, tags)
│   ├── offers.json              # Promotional deals & promo codes
│   ├── reviews.json             # Verified guest reviews with category ratings
│   ├── rooms.json               # Room tiers, dimensions, occupancies, and prices
│   └── site.json                # Global brand metadata, contact info, and socials
│
├── js/
│   ├── app.js                   # UI controllers, header behaviors, back-to-top, toast
│   ├── booking.js               # State management, promo code calculation, bookings
│   ├── data.js                  # Asynchronous data fetcher and cache layer
│   ├── filters.js               # Dynamic faceted search, filtering, and sorting
│   ├── gallery.js               # High-res image gallery modal with keyboard navigation
│   ├── search.js                # Search widget controller, datepicker, and guest counter
│   ├── utils.js                 # Formatting utilities, debouncing, DOM helpers
│   └── wishlist.js              # Favorites management with LocalStorage sync
│
├── scripts/
│   ├── setup_images.js          # Image asset downloader utility
│   ├── verify_json.js           # JSON schema validation script
│   └── verify_links.js          # Internal anchor link verification script
│
├── server.js                    # Zero-dependency local development static server
└── README.md                    # Project documentation
```

---

## 5. JSON Data Schema

All content is strictly separated into JSON files inside `data/`:

| File | Purpose | Example Fields |
|---|---|---|
| `hotels.json` | Hotel properties | `id`, `slug`, `name`, `starRating`, `guestRating`, `priceFrom`, `images`, `amenities`, `nearbyPlaces` |
| `rooms.json` | Room types per hotel | `id`, `hotelId`, `name`, `bedType`, `maxGuests`, `size`, `pricePerNight`, `cancellationPolicy` |
| `reviews.json` | Guest feedback | `id`, `hotelId`, `author`, `authorType`, `rating`, `title`, `comment`, `verifiedBooking`, `ratings` |
| `amenities.json`| Feature directory | `id`, `name`, `category`, `icon` |
| `offers.json` | Active promotions | `id`, `title`, `subtitle`, `discount`, `code`, `image` |
| `destinations.json`| Locations | `id`, `name`, `type`, `propertyCount`, `image` |
| `faqs.json` | Q&A pairs | `id`, `category`, `question`, `answer` |
| `site.json` | Global metadata | `name`, `phone`, `email`, `socialLinks`, `address` |

---

## 6. Interactive Features Walkthrough

1. **Homepage Search Widget:**
   - Destination autocomplete with instant area matching.
   - Interactive date selection for Check-in & Check-out.
   - Adults & Children counter with room selector.
   - URL parameter serialization (`hotels.html?destination=...&checkin=...`).
2. **Hotels Discovery & Filtering (`hotels.html`):**
   - Live price range slider.
   - Filter by Star Rating (3-star, 4-star, 5-star).
   - Filter by Guest Score (8.0+, 7.0+, 6.0+).
   - Filter by Amenities (Free WiFi, Parking, Restaurant, Airport Shuttle).
   - Sort by: Recommended, Price Low to High, Price High to Low, Rating.
3. **Property Detail Experience (`hotel.html`):**
   - 5-photo responsive hero grid with full-screen lightbox modal.
   - Room selection cards with amenities, dimensions, and direct booking actions.
   - Full Guest Reviews section with category score bars (Cleanliness, Service, Location, Comfort).
   - Interactive "Write a Review" modal with 5-star rating picker and instant preview.
4. **End-to-End Booking Flow (`booking.html` & `booking-confirmation.html`):**
   - Sticky summary calculating nights, room total, and 18% GST.
   - Promo code application (`WELCOME10`, `EARLYBIRD`, `WEEKEND15`, `AIRPORTFREE`).
   - Demo booking generation storing record into `localStorage['jmd_demo_bookings']`.
   - Printable confirmation with reference number (`JMD-DEMO-XXXXXX`).
5. **Manage Booking Portal (`my-booking.html`):**
   - Lookup by booking reference code or guest email/phone.
   - Displays reservation status, stay details, and paid total.
   - In-page booking cancellation with confirmation modal and status update.
6. **Special Offers & Clipboard Copy (`offers.html`):**
   - Clean promo cards displaying active discounts.
   - One-click "Copy Code" button with clipboard API and toast feedback.

---

## 7. Future PHP Migration Guide

The application architecture was specifically planned for effortless PHP migration:

### Phase 1: Shared Partials
Convert repetitive layouts into PHP partials:
```php
<!-- Replace in all pages -->
<?php include __DIR__ . '/includes/header.php'; ?>

<!-- Page content -->

<?php include __DIR__ . '/includes/footer.php'; ?>
```

### Phase 2: Server-Side Data Ingestion
Replace client-side `fetch('data/hotels.json')` with PHP:
```php
<?php
// helpers/data.php
function getHotels() {
    $json = file_get_contents(__DIR__ . '/../data/hotels.json');
    return json_decode($json, true);
}

function getHotelBySlug($slug) {
    $hotels = getHotels();
    foreach ($hotels as $hotel) {
        if ($hotel['slug'] === $slug) return $hotel;
    }
    return null;
}
?>
```

### Phase 3: Transition to MySQL Database
Replace the JSON file reads with MySQL PDO queries:
```php
function getHotels() {
    global $pdo;
    $stmt = $pdo->query("SELECT * FROM hotels WHERE active = 1 ORDER BY featured DESC");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
```

---

## 8. Local Development & Testing

A lightweight, zero-dependency Node.js static server is included:

```bash
# Start local server
node server.js

# Server starts at:
# http://localhost:8080/
```

### Run Automated Verifications
```bash
# Verify all internal navigation links (281 links checked, 0 broken)
node scripts/verify_links.js

# Verify all JSON files are valid and well-formed
node scripts/verify_json.js
```

---

## 9. Feature Verification Checklist

- [x] Hotel cards with badges, prices, ratings, and wishlist toggles
- [x] Hotel detail page with room listings, location, policies, and amenities
- [x] High-resolution photo gallery modal with lightbox navigation
- [x] Comprehensive Guest Reviews section with score breakdown and write-review modal
- [x] Live search widget with destination autocomplete and guest selector
- [x] Interactive hotel listing filters (price slider, stars, ratings, amenities, sort)
- [x] Wishlist functionality synchronized across all pages via LocalStorage
- [x] Recently viewed properties tracking
- [x] End-to-end checkout with guest details and promo code discounts
- [x] Printable booking confirmation page
- [x] Manage booking portal with lookup and cancellation
- [x] Special offers page with clipboard copy interactions
- [x] Editorial experiences page with high-res lifestyle photography
- [x] Contact page with validation and enquiry submission
- [x] Accessible FAQ accordion with Schema.org JSON-LD microdata
- [x] Favorites page with empty state handling
- [x] Custom 404 error page
- [x] Zero console errors across all pages
- [x] 100% verified internal links (281 links, 0 broken)
- [x] Zero missing/broken images across all properties

---
*Developed for JMD Group of Hotels. All Rights Reserved.*
