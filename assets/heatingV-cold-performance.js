if (!customElements.get('heating-v-cold-performance')) {
  customElements.define('heating-v-cold-performance', class extends HTMLElement {
    connectedCallback() {
      this.controller?.abort();
      this.controller = new AbortController();
      const options = { signal: this.controller.signal };
      this.start = this.querySelector('[data-cold-start]');
      this.end = this.querySelector('[data-cold-end]');
      this.morph = this.querySelector('.heatingV-cold__morph');
      this.texture = this.querySelector('.heatingV-cold__morph-texture');
      this.startLabel = this.querySelector('.heatingV-cold__summary .heatingV-cold__label');
      this.endLabel = this.querySelector('.heatingV-cold__overlay .heatingV-cold__label');
      this.endCopy = this.querySelector('.heatingV-cold__overlay .heatingV-cold__copy');
      if (!this.start || !this.end || !this.morph) return;
      this.motion = window.matchMedia('(prefers-reduced-motion: reduce)');
      const schedule = () => {
        if (!this.frame) this.frame = requestAnimationFrame(() => {
          this.frame = 0;
          if (this.needsMeasure) this.measure();
          this.render();
        });
      };
      const refresh = () => {
        this.needsMeasure = true;
        schedule();
      };
      window.addEventListener('scroll', schedule, { ...options, passive: true });
      window.addEventListener('resize', refresh, options);
      window.addEventListener('pageshow', refresh, options);
      this.motion.addEventListener('change', refresh, options);
      this.querySelectorAll('img').forEach((image) => image.addEventListener('load', refresh, options));
      if ('ResizeObserver' in window) {
        this.resizeObserver = new ResizeObserver(refresh);
        this.resizeObserver.observe(this);
        this.resizeObserver.observe(this.start);
        this.resizeObserver.observe(this.end);
      }
      // Section relocation and font swaps can change document coordinates without a resize.
      document.addEventListener('shopify:section:load', refresh, options);
      document.addEventListener('shopify:section:reorder', refresh, options);
      document.fonts?.addEventListener('loadingdone', refresh, options);
      document.fonts?.ready.then(() => {
        if (!this.controller.signal.aborted) refresh();
      });
      this.measure();
      this.render();
    }

    measure() {
      this.needsMeasure = false;
      const root = this.getBoundingClientRect();
      const start = this.start.getBoundingClientRect();
      const end = this.end.getBoundingClientRect();
      this.geometry = {
        x: start.left - root.left,
        y: start.top - root.top,
        dx: end.left - start.left,
        dy: end.top - start.top,
        scale: start.width / end.width,
        copyBottom: this.endCopy.getBoundingClientRect().bottom - root.top,
        // Start with the small stat visible; finish with the large stat near mid-screen.
        scrollStart: start.top + window.scrollY + start.height / 2 - window.innerHeight * 0.72,
        scrollEnd: end.top + window.scrollY + end.height / 2 - window.innerHeight * 0.58,
        valid: start.width > 0 && end.width > 0
      };
    }

    render() {
      const geometry = this.geometry;
      if (!geometry?.valid || this.motion.matches) {
        this.classList.remove('is-scroll-ready');
        this.startLabel.style.opacity = '';
        this.endLabel.style.opacity = '';
        this.endCopy.style.opacity = '';
        return;
      }
      // Reading the root offset also accounts for content loading above this section.
      const root = this.getBoundingClientRect();
      const startY = root.top + geometry.y;
      const startScroll = startY + window.scrollY + this.start.offsetHeight / 2 - window.innerHeight * 0.72;
      const distance = Math.max(1, geometry.scrollEnd - geometry.scrollStart);
      const progress = Math.max(0, Math.min(1, (window.scrollY - startScroll) / distance));
      const scale = geometry.scale + (1 - geometry.scale) * progress;
      this.morph.style.transform = `translate3d(${geometry.x + geometry.dx * progress}px, ${geometry.y + geometry.dy * progress}px, 0) scale(${scale})`;
      // Both fills share a single transform, so texture changes cannot produce double contours.
      this.texture.style.opacity = String(Math.max(0, Math.min(1, (progress - 0.15) / 0.7)));
      this.startLabel.style.opacity = String(1 - Math.min(1, progress * 3));
      this.endLabel.style.opacity = String(Math.max(0, (progress - 0.65) / 0.35));
      // Reveal the repeated copy only once the moving value has cleared its bounds.
      // This uses measured space rather than a fixed progress threshold (long copy/mobile).
      this.endCopy.style.opacity = String(Math.max(0, Math.min(1,
        (geometry.y + geometry.dy * progress - geometry.copyBottom - 16) / 32
      )));
      this.classList.add('is-scroll-ready');
    }

    disconnectedCallback() {
      this.controller?.abort();
      cancelAnimationFrame(this.frame);
      this.frame = 0;
      this.resizeObserver?.disconnect();
      this.classList.remove('is-scroll-ready');
    }
  });
}
