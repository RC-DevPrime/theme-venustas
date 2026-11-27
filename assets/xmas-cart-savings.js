if (!customElements.get('xmas-cart-savings')) {
  customElements.define('xmas-cart-savings', class extends HTMLElement {
    connectedCallback() {
      this.controller = new AbortController();
      this.config = JSON.parse(this.querySelector('[data-cart-config]').textContent);
      const initialCart = JSON.parse(this.querySelector('[data-cart-initial]').textContent);
      const { signal } = this.controller;
      this.version = 0;
      this.render(initialCart);
      document.addEventListener('cart:updated', (event) => {
        if (!event.detail || !Number.isFinite(event.detail.total_price)) return;
        // A confirmed cart event wins over any older refresh still in flight.
        ++this.version;
        this.render(event.detail);
      }, { signal });
      window.addEventListener('pageshow', (event) => { if (event.persisted) this.refresh(); }, { signal });
      window.addEventListener('focus', () => this.refresh(), { signal });
      this.refresh();
    }

    async refresh() {
      const version = ++this.version;
      try {
        const root = (window.Shopify?.routes?.root || '/').replace(/\/?$/, '/');
        const response = await fetch(`${root}cart.js`, { credentials: 'same-origin', cache: 'no-store', signal: this.controller.signal });
        if (!response.ok) return;
        const cart = await response.json();
        if (version === this.version && this.isConnected && Number.isFinite(cart.total_price)) this.render(cart);
      } catch (error) {
        // Retain the last confirmed cart if a refresh fails or the section unloads.
      }
    }

    calculate(cart) {
      const total = Math.max(0, Math.round(Number(cart.total_price) || 0));
      const title = (this.config.discountTitle || '').trim().toLowerCase();
      const matches = application => title && String(application?.title || '').trim().toLowerCase() === title;
      let discount = 0;
      (cart.cart_level_discount_applications || []).forEach(application => {
        if (matches(application)) discount += Math.max(0, Math.round(Number(application.total_allocated_amount) || 0));
      });
      // Line-level allocations exclude cart-level discounts, avoiding double counting.
      (cart.items || []).forEach(item => {
        (item.line_level_discount_allocations || []).forEach(allocation => {
          if (matches(allocation.discount_application)) discount += Math.max(0, Math.round(Number(allocation.amount) || 0));
        });
      });
      const subtotal = total + discount;
      const empty = cart.item_count === 0 || Array.isArray(cart.items) && cart.items.length === 0;
      return { total, subtotal, discount, remaining: Math.max(0, 30000 - subtotal), state: empty ? 'empty' : subtotal >= 30000 ? 'unlocked' : 'partial' };
    }

    render(cart) {
      const result = this.calculate(cart);
      const currency = cart.currency || 'USD';
      const money = cents => new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(cents / 100);
      this.dataset.state = result.state;
      this.querySelectorAll('[data-state]').forEach(element => element.setAttribute('aria-current', String(element.dataset.state === result.state)));
      this.querySelectorAll('[data-view]').forEach(element => { element.hidden = element.dataset.view !== result.state; });
      this.querySelectorAll('[data-headline]').forEach(element => { element.hidden = element.dataset.headline !== result.state; });
      const values = { subtotal: result.subtotal, remaining: result.remaining, discount: result.discount, pay: result.total };
      this.querySelectorAll('[data-money]').forEach(element => { element.textContent = money(values[element.dataset.money]); });
      this.querySelector('[data-cart-label]').textContent = `YOUR CART · ${result.state === 'empty' ? 'EMPTY' : result.state === 'unlocked' ? 'UNLOCKED' : 'IN CART'}`;
      this.querySelector('[data-fill]').style.width = `${Math.min(100, result.subtotal / 300)}%`;
      const progress = this.querySelector('[role="progressbar"]');
      progress.setAttribute('aria-valuenow', String(Math.min(300, result.subtotal / 100)));
      progress.setAttribute('aria-valuetext', `${money(result.subtotal)} in cart; $300 target`);
      this.querySelector('[data-progress-badge]').textContent = result.discount > 0 ? `-${money(result.discount)} applied` : result.state === 'unlocked' ? '-$30 eligible' : '-$30';
      this.querySelector('[data-discount-line]').textContent = result.discount > 0 ? `-${money(result.discount)}` : 'Not applied yet';
      this.querySelector('[data-calculation]').hidden = result.state === 'unlocked';
      this.querySelector('[data-unlocked-hint]').hidden = result.state !== 'unlocked';

      const view = this.querySelector(`[data-view="${result.state}"]`);
      if (result.state !== 'unlocked' && view) {
        const picks = [...view.querySelectorAll('[data-pick]')];
        const featured = picks.find(pick => pick.hasAttribute('data-best-fit')) || picks[0];
        const price = Number(featured?.dataset.price) || 0;
        const tokens = {
          product_price: money(price),
          after_savings: money(Math.max(0, price - (result.subtotal + price >= 30000 ? 3000 : 0))),
          remaining: money(result.remaining), cart_total: money(result.subtotal)
        };
        const note = view.querySelector('[data-note]');
        const template = result.state === 'empty' ? this.config.emptyNote : this.config.partialNote;
        note.hidden = !template || /\{(product_price|after_savings)\}/.test(template) && !featured;
        // Only merchant-authored richtext becomes markup; token values are text nodes.
        note.innerHTML = template || '';
        const walker = document.createTreeWalker(note, NodeFilter.SHOW_TEXT);
        let textNode;
        while ((textNode = walker.nextNode())) textNode.textContent = textNode.textContent.replace(/\{(\w+)\}/g, (match, key) => tokens[key] ?? match);
        picks.forEach(pick => {
          if (pick.hasAttribute('data-best-fit')) return;
          const badge = pick.querySelector('[data-pick-badge]');
          if (badge) badge.textContent = (pick.dataset.badge || '').replaceAll('{shortfall}', money(Math.max(0, result.remaining - Number(pick.dataset.price))));
        });
        view.querySelector('.xmas-cart-savings__picks-heading').hidden = !picks.length;
      }
      this.querySelector('[data-panel]').hidden = false;
    }

    disconnectedCallback() {
      ++this.version;
      this.controller.abort();
    }
  });
}
