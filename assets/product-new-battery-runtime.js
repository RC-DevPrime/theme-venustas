if (!customElements.get('product-new-battery-runtime')) {
    customElements.define('product-new-battery-runtime', class extends HTMLElement {
      connectedCallback() {
        this.abort?.abort();
        this.abort = new AbortController();
        cancelAnimationFrame(this.initFrame);
        const initialize = () => {
          this.initFrame = requestAnimationFrame(() => { if (this.isConnected) this.initialize(); });
        };
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true, signal: this.abort.signal });
        else initialize();
      }

      initialize() {
        this.observer?.disconnect();
        const options = { signal: this.abort.signal };
        this.track = this.querySelector('[data-track]');
        this.cards = [...this.querySelectorAll('[data-card]')];
        this.dots = [...this.querySelectorAll('[data-dot]')];
        this.mobile = window.matchMedia('(max-width: 767px)');
        this.index = 0;
        this.addEventListener('click', (event) => {
          const dot = event.target.closest('[data-dot]');
          if (dot) this.scrollToCard(Number(dot.dataset.dot));
        }, options);
        this.track?.addEventListener('scroll', () => {
          if (!this.mobile.matches) return;
          cancelAnimationFrame(this.frame);
          this.frame = requestAnimationFrame(() => {
            const left = this.track.getBoundingClientRect().left;
            let nearest = 0;
            this.cards.forEach((card, index) => {
              if (Math.abs(card.getBoundingClientRect().left - left) < Math.abs(this.cards[nearest].getBoundingClientRect().left - left)) nearest = index;
            });
            this.setActive(nearest);
          });
        }, { ...options, passive: true });
        this.observer = new ResizeObserver(() => {
          if (this.mobile.matches) this.scrollToCard(this.index, false);
        });
        if (this.track) this.observer.observe(this.track);
      }

      setActive(index) {
        this.index = index;
        this.dots.forEach((dot, dotIndex) => dot.setAttribute('aria-current', String(dotIndex === index)));
      }

      scrollToCard(index, smooth = true) {
        const card = this.cards[index];
        if (!card || !this.track) return;
        this.track.scrollTo({ left: this.track.scrollLeft + card.getBoundingClientRect().left - this.track.getBoundingClientRect().left, behavior: smooth && !window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'auto' });
        this.setActive(index);
      }

      disconnectedCallback() {
        this.abort?.abort();
        cancelAnimationFrame(this.initFrame);
        cancelAnimationFrame(this.frame);
        this.observer?.disconnect();
      }
    });
  }

if (!customElements.get('product-new-runtime-picker')) {
  customElements.define('product-new-runtime-picker', class extends HTMLElement {
    connectedCallback() {
      this.abort?.abort();
      this.abort = new AbortController();
      const options = { signal: this.abort.signal };
      const trigger = this.querySelector('.choose-runtime__help');
      this.dialog = this.querySelector('.runtime-comparison');
      const close = this.querySelector('.runtime-comparison__close');
      if (!trigger || !this.dialog || !close) return;
      trigger.addEventListener('click', () => {
        if (this.dialog.open) return;
        this.dialog.showModal();
        requestAnimationFrame(() => {
          const cards = this.dialog.querySelector('product-new-battery-runtime');
          cards?.scrollToCard?.(cards.index || 0, false);
        });
      }, options);
      close.addEventListener('click', () => this.dialog.close(), options);
      this.dialog.addEventListener('click', (event) => {
        if (event.target === this.dialog) this.dialog.close();
      }, options);
    }

    disconnectedCallback() {
      this.abort?.abort();
      if (this.dialog?.open) this.dialog.close();
    }
  });
}
