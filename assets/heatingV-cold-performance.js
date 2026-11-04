if (!customElements.get('heating-v-cold-performance')) {
  customElements.define('heating-v-cold-performance', class extends HTMLElement {
    connectedCallback() {
      this.controller = new AbortController();
      const options = { signal: this.controller.signal };
      const desktop = window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)');
      const toggle = this.querySelector('.heatingV-cold__toggle');
      const animationDelay = Math.max(0, Number(this.dataset.animationDelay) || 0);
      let animationTimer;
      const setExpanded = (expanded) => {
        const active = expanded && desktop.matches;
        this.classList.toggle('is-expanded', active);
        toggle.setAttribute('aria-expanded', String(active));
      };

      const cancelAnimation = () => {
        window.clearTimeout(animationTimer);
        animationTimer = undefined;
      };
      const playAnimation = () => {
        cancelAnimation();
        if (!this.inView) return;
        animationTimer = window.setTimeout(() => {
          if (this.inView) setExpanded(true);
        }, animationDelay);
      };
      const reset = () => {
        cancelAnimation();
        this.classList.add('heatingV-cold--no-transition');
        setExpanded(false);
        void this.offsetWidth;
        this.classList.remove('heatingV-cold--no-transition');
      };
      toggle.addEventListener('click', (event) => {
        cancelAnimation();
        setExpanded(!this.classList.contains('is-expanded'));
      }, options);
      this.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          cancelAnimation();
          setExpanded(false);
        }
      }, options);
      toggle.addEventListener('blur', () => setExpanded(false), options);
      desktop.addEventListener('change', () => {
        reset();
        if (this.inView) playAnimation();
      }, options);
      this.inView = false;
      reset();

      if ('IntersectionObserver' in window) {
        this.observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            const visible = entry.isIntersecting;
            if (visible === this.inView) return;
            this.inView = visible;
            if (visible) playAnimation();
            else reset();
          });
        }, { threshold: 0 });
        this.observer.observe(this);
      } else {
        this.inView = true;
        playAnimation();
      }
    }

    disconnectedCallback() {
      this.controller.abort();
      cancelAnimation();
      this.observer?.disconnect();
    }
  });
}
