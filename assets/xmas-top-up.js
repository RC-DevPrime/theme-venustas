if (!customElements.get('xmas-top-up')) {
  customElements.define('xmas-top-up', class extends HTMLElement {
    connectedCallback() {
      this.controller = new AbortController();
      const { signal } = this.controller;
      this.mobile = window.matchMedia('(max-width: 767px)');
      this.mobile.addEventListener('change', () => this.syncSlider(), { signal });
      window.addEventListener('load', () => this.syncSlider(), { once: true, signal });
      this.addEventListener('click', (event) => {
        const dot = event.target.closest('[data-page]');
        if (dot && this.slider) this.slider.slideTo(Number(dot.dataset.page) * 2);
      }, { signal });
      this.syncSlider();
    }

    syncSlider() {
      if (!this.mobile.matches) {
        if (this.slider) this.slider.destroy(true, true);
        this.slider = null;
        return;
      }
      const viewport = this.querySelector('[data-viewport]');
      if (this.slider || !viewport || !window.Swiper) return;
      const updateDots = (slider) => {
        this.querySelectorAll('[data-page]').forEach((dot, index) => {
          dot.setAttribute('aria-current', String(index === slider.snapIndex));
        });
      };
      this.slider = new window.Swiper(viewport, {
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 12,
        watchOverflow: true,
        speed: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 300,
        on: { init: updateDots, slideChange: updateDots }
      });
    }

    disconnectedCallback() {
      this.controller.abort();
      if (this.slider) this.slider.destroy(true, true);
      this.slider = null;
    }
  });
}
