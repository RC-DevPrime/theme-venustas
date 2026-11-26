if (!customElements.get('xmas-collection-tabs')) {
  customElements.define('xmas-collection-tabs', class extends HTMLElement {
    connectedCallback() {
      this.tabs = [...this.querySelectorAll('[role="tab"]')];
      this.panels = [...this.querySelectorAll('[role="tabpanel"]')];
      this.sliders = new Map();
      this.mobile = window.matchMedia('(max-width: 767px)');
      this.controller = new AbortController();
      const { signal } = this.controller;

      this.addEventListener('click', (event) => {
        const tab = event.target.closest('[role="tab"]');
        if (this.tabs.includes(tab)) this.selectTab(this.tabs.indexOf(tab));
        const dot = event.target.closest('[data-page]');
        if (dot && this.contains(dot)) {
          const panel = dot.closest('[role="tabpanel"]');
          const slider = this.sliders.get(panel);
          if (slider) slider.slideTo(Number(dot.dataset.page) * 2);
        }
      }, { signal });

      this.addEventListener('keydown', (event) => {
        const index = this.tabs.indexOf(event.target);
        if (index < 0) return;
        let next;
        if (event.key === 'ArrowRight') next = (index + 1) % this.tabs.length;
        if (event.key === 'ArrowLeft') next = (index - 1 + this.tabs.length) % this.tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = this.tabs.length - 1;
        if (next === undefined) return;
        event.preventDefault();
        this.selectTab(next);
        this.tabs[next].focus();
      }, { signal });

      this.mobile.addEventListener('change', () => this.syncSliders(), { signal });
      window.addEventListener('load', () => this.syncSliders(), { once: true, signal });
      document.addEventListener('shopify:block:select', (event) => {
        const index = this.tabs.findIndex(tab => tab.dataset.blockId === event.detail.blockId);
        if (index >= 0 && this.contains(event.target)) this.selectTab(index);
      }, { signal });
      this.syncSliders();
    }

    selectTab(index) {
      this.tabs.forEach((tab, tabIndex) => {
        const selected = tabIndex === index;
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
        this.panels[tabIndex].hidden = !selected;
      });
      this.syncSliders();
      const slider = this.sliders.get(this.panels[index]);
      if (slider) {
        slider.update();
        slider.slideTo(0, 0);
      }
    }

    syncSliders() {
      if (!this.mobile.matches) {
        this.sliders.forEach(slider => slider.destroy(true, true));
        this.sliders.clear();
        return;
      }
      if (!window.Swiper) return;
      this.panels.forEach(panel => {
        if (panel.hidden || this.sliders.has(panel) || !panel.querySelector('.swiper-slide')) return;
        const updateDots = (slider) => {
          panel.querySelectorAll('[data-page]').forEach((dot, index) => {
            dot.setAttribute('aria-current', String(index === slider.snapIndex));
          });
        };
        const slider = new window.Swiper(panel.querySelector('[data-viewport]'), {
          slidesPerView: 2,
          slidesPerGroup: 2,
          spaceBetween: 12,
          speed: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 300,
          on: { init: updateDots, slideChange: updateDots }
        });
        this.sliders.set(panel, slider);
      });
    }

    disconnectedCallback() {
      this.controller.abort();
      this.sliders.forEach(slider => slider.destroy(true, true));
      this.sliders.clear();
    }
  });
}
