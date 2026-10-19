/* ============================================================
   JMD GROUP OF HOTELS — Gallery Module
   ============================================================ */

JMD.Gallery = {
  currentIndex: 0,
  images: [],
  modal: null,

  open(images, startIndex = 0) {
    this.images = images;
    this.currentIndex = startIndex;
    this.createModal();
    this.showImage(this.currentIndex);
    document.body.style.overflow = 'hidden';
  },

  close() {
    if (this.modal) {
      this.modal.classList.remove('gallery-modal--open');
      setTimeout(() => {
        if (this.modal) this.modal.remove();
        this.modal = null;
      }, 300);
    }
    document.body.style.overflow = '';
  },

  createModal() {
    if (this.modal) this.modal.remove();

    this.modal = document.createElement('div');
    this.modal.className = 'gallery-modal gallery-modal--open';
    this.modal.innerHTML = `
      <button class="gallery-modal__close" aria-label="Close gallery">&times;</button>
      <button class="gallery-modal__nav gallery-modal__nav--prev" aria-label="Previous image">‹</button>
      <img class="gallery-modal__image" src="" alt="Hotel photo" />
      <button class="gallery-modal__nav gallery-modal__nav--next" aria-label="Next image">›</button>
      <div class="gallery-modal__counter"></div>
    `;

    document.body.appendChild(this.modal);

    // Event handlers
    this.modal.querySelector('.gallery-modal__close').addEventListener('click', () => this.close());
    this.modal.querySelector('.gallery-modal__nav--prev').addEventListener('click', () => this.prev());
    this.modal.querySelector('.gallery-modal__nav--next').addEventListener('click', () => this.next());

    // Background click
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.close();
    });

    // Keyboard navigation
    this._keyHandler = (e) => {
      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowLeft') this.prev();
      if (e.key === 'ArrowRight') this.next();
    };
    document.addEventListener('keydown', this._keyHandler);
  },

  showImage(index) {
    if (!this.modal || this.images.length === 0) return;
    this.currentIndex = index;
    const img = this.modal.querySelector('.gallery-modal__image');
    const src = this.images[index];

    // Check if image exists, use placeholder if not
    img.onerror = () => {
      img.src = JMD.Utils.placeholderImage(1200, 800, 'Photo ' + (index + 1));
    };
    img.src = src;
    img.alt = `Hotel photo ${index + 1} of ${this.images.length}`;

    this.modal.querySelector('.gallery-modal__counter').textContent =
      `${index + 1} / ${this.images.length}`;
  },

  prev() {
    const newIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.images.length - 1;
    this.showImage(newIndex);
  },

  next() {
    const newIndex = this.currentIndex < this.images.length - 1 ? this.currentIndex + 1 : 0;
    this.showImage(newIndex);
  },

  destroy() {
    if (this._keyHandler) {
      document.removeEventListener('keydown', this._keyHandler);
    }
    this.close();
  }
};
