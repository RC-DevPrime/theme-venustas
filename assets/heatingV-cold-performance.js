if (!customElements.get('heating-v-cold-performance')) {
  customElements.define('heating-v-cold-performance', class extends HTMLElement {
    connectedCallback() {
      this.controller = new AbortController();
      const options = { signal: this.controller.signal };
      const desktop = window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)');
      const toggle = this.querySelector('.heatingV-cold__toggle');
      const setExpanded = (expanded) => {
        const active = expanded && desktop.matches;
        this.classList.toggle('is-expanded', active);
        toggle.setAttribute('aria-expanded', String(active));
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
        if (event.key === 'Escape') setExpanded(false);
      }, options);
      toggle.addEventListener('blur', () => setExpanded(false), options);
      desktop.addEventListener('change', () => {
        reset();
        setExpanded(this.inView);
      }, options);
      this.inView = false;
      reset();

      if ('IntersectionObserver' in window) {
        this.observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            const visible = entry.isIntersecting;
            if (visible === this.inView) return;
            this.inView = visible;
            if (visible) setExpanded(true);
            else reset();
          });
        }, { threshold: 0 });
        this.observer.observe(this);
      } else {
        this.inView = true;
        setExpanded(true);
      }
    }

    disconnectedCallback() {
      this.controller.abort();
      this.observer?.disconnect();
    }
  });
}
