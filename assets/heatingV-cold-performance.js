if (!customElements.get('heating-v-cold-performance')) {
  customElements.define('heating-v-cold-performance', class extends HTMLElement {
    connectedCallback() {
      this.controller = new AbortController();
      const options = { signal: this.controller.signal };
      const desktop = window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)');
      const toggle = this.querySelector('.heatingV-cold__toggle');
      const banner = this.querySelector('.heatingV-cold__banner');
      const setExpanded = (expanded) => {
        const active = expanded && desktop.matches;
        this.classList.toggle('is-expanded', active);
        toggle.setAttribute('aria-expanded', String(active));
      };

      const playAnimation = () => {
        if (this.hasAnimated || !desktop.matches) return;
        const bannerBottom = banner.getBoundingClientRect().bottom + window.scrollY;
        if (window.scrollY < bannerBottom) return;
        this.hasAnimated = true;
        setExpanded(true);
        window.removeEventListener('scroll', playAnimation);
        window.removeEventListener('resize', playAnimation);
      };
      const reset = () => {
        this.classList.add('heatingV-cold--no-transition');
        setExpanded(false);
        void this.offsetWidth;
        this.classList.remove('heatingV-cold--no-transition');
      };
      toggle.addEventListener('click', (event) => {
        setExpanded(!this.classList.contains('is-expanded'));
      }, options);
      this.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          setExpanded(false);
        }
      }, options);
      toggle.addEventListener('blur', () => setExpanded(false), options);
      desktop.addEventListener('change', () => {
        reset();
        playAnimation();
      }, options);
      reset();
      window.addEventListener('scroll', playAnimation, { ...options, passive: true });
      window.addEventListener('resize', playAnimation, options);
      playAnimation();
    }

    disconnectedCallback() {
      this.controller.abort();
    }
  });
}
