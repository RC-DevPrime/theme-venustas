if (!customElements.get('xmas-weekly-deals')) {
  customElements.define('xmas-weekly-deals', class extends HTMLElement {
    connectedCallback() {
      this.controller = new AbortController();
      this.animations = new Map();
      this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      const { signal } = this.controller;
      this.digits = [...this.querySelectorAll('[data-unit]')];
      const rawEnd = (this.dataset.end || '').trim();
      this.end = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})$/.test(rawEnd) ? Date.parse(rawEnd) : NaN;
      const clock = this.querySelector('[role="timer"]');
      if (clock) clock.hidden = !Number.isFinite(this.end);
      if (clock && !clock.hidden) {
        this.tick(false);
        if (this.end > Date.now()) this.timer = window.setInterval(() => this.tick(true), 1000);
      }

      this.addEventListener('wheel', (event) => {
        const digit = event.target.closest('[data-unit]');
        if (digit && (event.deltaX || event.deltaY)) this.flip(digit, digit.dataset.value);
      }, { passive: true, signal });
      this.addEventListener('click', (event) => {
        const digit = event.target.closest('[data-unit]');
        if (digit) this.flip(digit, digit.dataset.value);
        const dot = event.target.closest('[data-page]');
        if (dot && this.slider) this.slider.slideToLoop(Number(dot.dataset.page));
      }, { signal });
      this.addEventListener('pointerdown', (event) => {
        const digit = event.target.closest('[data-unit]');
        if (digit) this.drag = { digit, x: event.clientX, y: event.clientY, id: event.pointerId };
      }, { signal });
      window.addEventListener('pointermove', (event) => {
        if (!this.drag || this.drag.id !== event.pointerId) return;
        if (Math.hypot(event.clientX - this.drag.x, event.clientY - this.drag.y) < 16) return;
        this.flip(this.drag.digit, this.drag.digit.dataset.value);
        this.drag = null;
      }, { passive: true, signal });
      const clearDrag = () => { this.drag = null; };
      window.addEventListener('pointerup', clearDrag, { signal });
      window.addEventListener('pointercancel', clearDrag, { signal });
      window.addEventListener('blur', clearDrag, { signal });
      window.addEventListener('load', () => this.initSlider(), { once: true, signal });
      this.initSlider();
    }

    tick(animate) {
      const remaining = Math.max(0, Math.ceil((this.end - Date.now()) / 1000));
      const values = [Math.floor(remaining / 86400), Math.floor(remaining / 3600) % 24, Math.floor(remaining / 60) % 60, remaining % 60];
      this.digits.forEach((digit, index) => {
        const value = String(values[index]).padStart(2, '0');
        if (value === digit.dataset.value) return;
        if (animate) this.flip(digit, value, true);
        else this.setValue(digit, value);
      });
      if (!remaining) window.clearInterval(this.timer);
    }

    setValue(digit, value) {
      digit.dataset.value = value;
      digit.querySelector('.xmas-weekly-deals__value').textContent = value;
      const label = digit.parentElement.querySelector('.xmas-weekly-deals__unit-label').textContent;
      digit.setAttribute('aria-label', `${value} ${label}`);
      digit.style.fontSize = value.length > 2 ? `${Math.max(18, digit.clientWidth / (value.length * .72))}px` : '';
    }

    flip(digit, value, update = false) {
      if (value === undefined) return;
      if (this.animations.has(digit)) {
        if (!update) return;
        this.stopFlip(digit);
      }
      const previous = digit.dataset.value || value;
      this.setValue(digit, value);
      if (this.reducedMotion.matches || !digit.animate) return;
      const top = digit.querySelector('.xmas-weekly-deals__flap--top');
      const bottom = digit.querySelector('.xmas-weekly-deals__flap--bottom');
      const old = digit.querySelector('.xmas-weekly-deals__flap--old');
      top.firstElementChild.textContent = previous;
      old.firstElementChild.textContent = previous;
      bottom.firstElementChild.textContent = value;
      [top, bottom, old].forEach(flap => { flap.hidden = false; });
      const animations = [
        top.animate([{ transform: 'rotateX(0deg)' }, { transform: 'rotateX(-90deg)' }], { duration: 200, fill: 'forwards', easing: 'ease-in' }),
        bottom.animate([{ transform: 'rotateX(90deg)' }, { transform: 'rotateX(0deg)' }], { delay: 200, duration: 200, fill: 'both', easing: 'ease-out' })
      ];
      this.animations.set(digit, animations);
      animations[1].finished.then(() => {
        if (this.animations.get(digit) === animations) this.stopFlip(digit);
      }).catch(() => {});
    }

    stopFlip(digit) {
      (this.animations.get(digit) || []).forEach(animation => animation.cancel());
      this.animations.delete(digit);
      digit.querySelectorAll('.xmas-weekly-deals__flap').forEach(flap => { flap.hidden = true; });
    }

    initSlider() {
      if (this.slider || !window.Swiper) return;
      const viewport = this.querySelector('[data-viewport]');
      if (!viewport) return;
      const track = viewport.querySelector('.swiper-wrapper');
      const originals = [...track.querySelectorAll('[data-original]')];
      const count = originals.length;
      if (!count) return;
      // A four-card desktop loop needs spare slides. Repeat the same products,
      // retaining four logical positions and unique IDs for copied forms.
      if (count > 1) {
        const total = Math.ceil(8 / count) * count;
        for (let index = count; index < total; index++) {
          const copy = originals[index % count].cloneNode(true);
          copy.removeAttribute('data-original');
          copy.dataset.loopCopy = 'true';
          const ids = new Map();
          copy.querySelectorAll('[id]').forEach(element => {
            const id = `${element.id}-${this.id}-${index}`;
            ids.set(element.id, id);
            element.id = id;
          });
          copy.querySelectorAll('[for], [form], [aria-labelledby], [aria-describedby]').forEach(element => {
            ['for', 'form', 'aria-labelledby', 'aria-describedby'].forEach(attribute => {
              const value = element.getAttribute(attribute);
              if (value) element.setAttribute(attribute, value.split(' ').map(id => ids.get(id) || id).join(' '));
            });
          });
          track.append(copy);
        }
      }
      const updateDots = (slider) => {
        this.querySelectorAll('[data-page]').forEach((dot, index) => dot.setAttribute('aria-current', String(index === slider.realIndex % count)));
      };
      this.slider = new window.Swiper(viewport, {
        slidesPerView: 2,
        slidesPerGroup: 1,
        spaceBetween: 12,
        loop: count > 1,
        watchOverflow: true,
        speed: this.reducedMotion.matches ? 0 : 300,
        breakpoints: { 768: { slidesPerView: 4, spaceBetween: 10 } },
        navigation: { prevEl: this.querySelector('[data-prev]'), nextEl: this.querySelector('[data-next]') },
        on: { init: updateDots, slideChange: updateDots }
      });
      this.querySelectorAll('[data-prev], [data-next]').forEach(button => { button.hidden = count < 2; });
    }

    disconnectedCallback() {
      this.controller.abort();
      window.clearInterval(this.timer);
      this.digits.forEach(digit => this.stopFlip(digit));
      if (this.slider) this.slider.destroy(true, true);
      this.slider = null;
      this.querySelectorAll('[data-loop-copy]').forEach(copy => copy.remove());
    }
  });
}
