if (!customElements.get('heating-v-cold-performance')) {
  customElements.define('heating-v-cold-performance', class extends HTMLElement {
    connectedCallback() {
      this.controller = new AbortController();
      const options = { signal: this.controller.signal };
      const desktop = window.matchMedia('(min-width: 768px) and (hover: hover) and (pointer: fine)');
      const summary = this.querySelector('.heatingV-cold__summary');
      const toggle = this.querySelector('.heatingV-cold__toggle');
      const setExpanded = (expanded) => {
        const active = expanded && desktop.matches;
        this.classList.toggle('is-expanded', active);
        toggle.setAttribute('aria-expanded', String(active));
      };

      summary.addEventListener('pointerenter', (event) => {
        if (event.pointerType === 'mouse') setExpanded(true);
      }, options);
      // The overlay never intercepts the pointer: entering it cannot undo the trigger.
      // Keep it raised until the pointer travels above the original banner's top edge.
      window.addEventListener('pointermove', (event) => {
        if (this.classList.contains('is-expanded') && event.clientY < this.getBoundingClientRect().top) {
          setExpanded(false);
        }
      }, options);
      toggle.addEventListener('click', (event) => {
        // Mouse hover already opens the panel; native keyboard clicks toggle it.
        if (event.detail === 0) setExpanded(!this.classList.contains('is-expanded'));
      }, options);
      this.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') setExpanded(false);
      }, options);
      toggle.addEventListener('blur', () => setExpanded(false), options);
      desktop.addEventListener('change', () => setExpanded(false), options);
      setExpanded(false);
    }

    disconnectedCallback() {
      this.controller.abort();
    }
  });
}
