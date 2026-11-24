(() => {
  if (window.venustasHeaderNew) {
    window.venustasHeaderNew.init(document);
    return;
  }

  class HeaderNavigation {
    constructor(root) {
      this.root = root;
      this.media = window.matchMedia('(max-width: 1199px)');
      this.abort = new AbortController();
      this.drawer = root.querySelector('[data-header-drawer]');
      this.mainList = root.querySelector('[data-header-main-list]');
      this.opener = root.querySelector('[data-header-mobile-open]');
      this.panels = [...root.querySelectorAll('[data-header-panel]')];
      this.prepareNavToggles();
      this.toggles = [...root.querySelectorAll('[data-header-toggle]')];
      this.columns = [...root.querySelectorAll('[data-header-column]')];
      this.drawerOpen = false;
      this.activePanel = null;
      this.bind(root, 'click', (event) => this.click(event));
      this.bind(root, 'keydown', (event) => this.keydown(event));
      this.bind(root, 'pointerleave', () => {
        if (this.media.matches || root.contains(document.activeElement)) return;
        if (this.activePanel?.classList.contains('header-new__panel--help')) return;
        this.showPanel(null);
      });
      this.bind(root, 'focusout', () => {
        queueMicrotask(() => {
          if (!this.media.matches && !root.contains(document.activeElement)) this.showPanel(null);
        });
      });
      this.bind(document, 'click', (event) => {
        if (!root.contains(event.target)) this.close();
        if (this.searchLayer && event.target.closest('.predictive-search .overlay, .predictive-search .icon-close, [data-header-search-overlay], [data-header-search-close]')) this.closeSearch();
      });
      this.bind(document, 'keydown', (event) => this.searchKeydown(event));
      this.bind(document, 'cart:updated', (event) => this.updateCartCount(event.detail?.cart || event.detail));
      this.bind(this.media, 'change', () => this.reset());
      this.toggles.forEach((toggle) => {
        const panel = this.panels.find((item) => item.dataset.headerPanel === toggle.dataset.headerToggle);
        if (!panel) {
          toggle.disabled = true;
          return;
        }
        toggle.setAttribute('aria-controls', panel.id);
        if (toggle.hasAttribute('data-header-no-hover')) return;
        this.bind(toggle, 'pointerenter', (event) => {
          if (!toggle.disabled && !this.media.matches && event.pointerType !== 'touch') this.showPanel(panel);
        });
      });
      this.panels.forEach((panel) => this.preparePanel(panel));
      root.querySelectorAll('[data-header-campaign]').forEach((campaign) => this.prepareCampaign(campaign));
      this.bind(root, 'pointerover', (event) => {
        const tab = event.target.closest('[data-header-campaign-tab]');
        if (tab && !this.media.matches && event.pointerType !== 'touch') {
          const content = tab.closest('[data-header-campaign]')?.querySelector('[data-header-campaign-content]:not([hidden])');
          if (!content?.contains(document.activeElement)) this.selectCampaignTab(tab);
        }
      });
      this.bind(root, 'focusin', (event) => {
        const tab = event.target.closest('[data-header-campaign-tab]');
        if (tab && !this.media.matches) this.selectCampaignTab(tab);
      });
      this.toggles.forEach((toggle) => {
        const panel = this.panels.find((item) => item.dataset.headerPanel === toggle.dataset.headerToggle);
        if (panel?.dataset.emphasize === 'true') toggle.classList.add('header-new__nav-link--emphasis');
      });
      this.bind(this.mainList, 'pointerover', (event) => {
        if (!this.media.matches && !this.activePanel?.contains(document.activeElement) && event.target.closest('a[href]')) this.showPanel(null);
      });
      this.bind(this.mainList, 'focusin', (event) => {
        if (!this.media.matches && event.target.closest('a[href]')) this.showPanel(null);
      });
      this.reset();
      this.observer = new ResizeObserver(() => this.measure());
      this.observer.observe(root);
    }

    bind(target, name, callback) {
      target?.addEventListener(name, callback, { signal: this.abort.signal });
    }

    updateCartCount(cart) {
      if (!cart || !Number.isFinite(Number(cart.item_count))) return;
      const count = Math.max(0, Number(cart.item_count));
      this.root.querySelectorAll('[data-header-cart-count]').forEach((badge) => {
        badge.textContent = String(count);
        badge.hidden = count === 0;
      });
      this.root.querySelectorAll('[data-header-cart]').forEach((button) => button.setAttribute('aria-label', `Cart (${count} items)`));
    }

    closeCountries() {
      this.root.querySelectorAll('[data-header-country-toggle]').forEach((button) => {
        button.setAttribute('aria-expanded', 'false');
        const menu = document.getElementById(button.getAttribute('aria-controls'));
        if (menu) menu.hidden = true;
      });
    }

    toggleCountry(button) {
      const menu = document.getElementById(button.getAttribute('aria-controls'));
      if (!menu) return;
      const open = button.getAttribute('aria-expanded') !== 'true';
      this.closeCountries();
      menu.hidden = !open;
      button.setAttribute('aria-expanded', String(open));
    }

    openSearch(trigger) {
      if (this.searchLayer) {
        this.searchLayer.querySelector('input[name="q"]')?.focus();
        return true;
      }
      const layer = this.media.matches ? document.querySelector('[data-header-search-layer]') || document.querySelector('.predictive-search') : document.querySelector('.predictive-search');
      if (!layer) return false;
      this.close();
      this.searchTrigger = trigger;
      this.searchOverflow = document.body.style.overflow;
      this.searchLayer = layer;
      this.searchAttributes = ['role', 'aria-modal', 'aria-label'].map((name) => [name, layer.getAttribute(name)]);
      layer.style.display = 'block';
      if (layer.hasAttribute('data-header-search-layer')) {
        layer.hidden = false;
        layer.getBoundingClientRect();
        layer.setAttribute('data-search-open', '');
      }
      layer.setAttribute('role', 'dialog');
      layer.setAttribute('aria-modal', 'true');
      layer.setAttribute('aria-label', 'Search');
      this.searchClose = layer.querySelector('[data-header-search-close], .icon-close');
      this.searchCloseAttributes = [];
      if (this.searchClose) {
        this.searchCloseAttributes = ['role', 'tabindex', 'aria-label'].map((name) => [name, this.searchClose.getAttribute(name)]);
        this.searchClose.setAttribute('role', 'button');
        this.searchClose.setAttribute('tabindex', '0');
        this.searchClose.setAttribute('aria-label', 'Close search');
      }
      document.body.style.overflow = 'hidden';
      layer.querySelector('input[name="q"]')?.focus({ preventScroll: true });
      return true;
    }

    closeSearch(restoreFocus = true) {
      if (!this.searchLayer) return;
      this.searchLayer.style.display = 'none';
      this.searchLayer.removeAttribute('data-search-open');
      if (this.searchLayer.hasAttribute('data-header-search-layer')) this.searchLayer.hidden = true;
      this.searchAttributes.forEach(([name, value]) => {
        if (value === null) this.searchLayer.removeAttribute(name);
        else this.searchLayer.setAttribute(name, value);
      });
      this.searchCloseAttributes?.forEach(([name, value]) => {
        if (value === null) this.searchClose.removeAttribute(name);
        else this.searchClose.setAttribute(name, value);
      });
      this.searchLayer = null;
      document.body.style.overflow = this.searchOverflow;
      if (restoreFocus) this.searchTrigger?.focus();
    }

    searchKeydown(event) {
      if (!this.searchLayer) return;
      if (event.key === 'Escape' || (event.target === this.searchClose && ['Enter', ' '].includes(event.key))) {
        event.preventDefault();
        this.closeSearch();
      } else if (event.key === 'Tab') {
        const items = [...this.searchLayer.querySelectorAll('input, button, a[href], [tabindex="0"]')]
          .filter((item) => !item.disabled && item.tabIndex >= 0 && item.getClientRects().length && !item.closest('[hidden]'));
        const first = items[0];
        const last = items.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    }

    openWishlist() {
      const swym = window.venustasHeaderNew.swym || window._swat;
      if (typeof swym?.ui?.open === 'function') {
        this.pendingWishlist = false;
        this.root.querySelectorAll('[data-header-wishlist]').forEach((button) => button.removeAttribute('aria-busy'));
        this.close();
        swym.ui.open();
      } else {
        this.pendingWishlist = true;
        this.root.querySelectorAll('[data-header-wishlist]').forEach((button) => button.setAttribute('aria-busy', 'true'));
      }
    }

    toggleGift() {
      const frameDocument = (frame) => {
        try { return frame?.contentDocument || frame?.contentWindow?.document; }
        catch { return null; }
      };
      const panel = frameDocument(document.querySelector('.smile-panel-frame-container iframe.smile-panel-frame'));
      const close = panel?.querySelector('[aria-label*="close" i], [aria-label*="dismiss" i], button[class*="close" i], .close-icon, [data-testid*="close" i]');
      if (close) { close.click(); return true; }
      const launcher = frameDocument(document.querySelector('#smile-lite-launcher-frame, .smile-launcher-frame'));
      const open = launcher?.querySelector('button');
      if (open) { open.click(); return true; }
      return false;
    }

    // Theme blocks don't expose their settings to the parent section, so the
    // main nav item is upgraded to a panel toggle from the rendered panels.
    prepareNavToggles() {
      if (!this.mainList) return;
      this.mainList.querySelectorAll('[data-nav-key]').forEach((item) => {
        const key = item.dataset.navKey;
        const panel = this.panels.find((candidate) => candidate.dataset.headerPanel === key);
        const link = item.querySelector('a.header-new__nav-link');
        if (!panel || !key) {
          item.querySelector('.header-new__nav-chevron')?.remove();
          return;
        }
        if (!link) return;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = link.className;
        button.dataset.headerToggle = key;
        button.setAttribute('aria-expanded', 'false');
        if (link.hasAttribute('aria-current')) button.setAttribute('aria-current', link.getAttribute('aria-current'));
        button.innerHTML = link.innerHTML;
        link.replaceWith(button);
      });
    }

    preparePanel(panel) {
      const inner = panel.querySelector('.header-new__panel-inner');
      if (!inner) return;
      const columns = [...inner.children].filter((item) => item.matches('[data-header-column]'));
      const promos = [...inner.children].filter((item) => item.matches('.header-new__promo'));
      inner.style.setProperty('--header-column-count', Math.max(columns.length, 1));
      inner.style.setProperty('--header-promo-count', Math.min(promos.length, 2));
      inner.dataset.hasPromos = String(promos.length > 0);
      columns.forEach((column, index) => column.style.setProperty('--header-column-index', index + 1));
      promos.forEach((promo, index) => {
        promo.style.setProperty('--header-promo-index', columns.length + index + 2);
        if (index > 1) promo.hidden = true;
      });
    }

    measure() {
      const height = Math.ceil(this.root.getBoundingClientRect().height);
      if (height === this.height) return;
      this.height = height;
      document.documentElement.style.setProperty('--headerHeight', `${height}px`);
      window.dispatchEvent(new CustomEvent('header:heightchange'));
    }

    prepareCampaign(campaign) {
      const categories = [...campaign.querySelectorAll('[data-header-campaign-category]')];
      const layout = campaign.querySelector('.header-new__campaign-layout');
      if (!layout) return;
      layout.style.setProperty('--campaign-category-count', categories.length);
      layout.style.setProperty('--campaign-footer-row', categories.length + 2);
      layout.style.setProperty('--campaign-content-span', categories.length + 2);
      layout.style.setProperty('--campaign-mobile-content-row', Math.ceil(categories.length / 2) + 1);
      categories.forEach((category, index) => {
        category.style.setProperty('--campaign-tab-row', index + 2);
        category.style.setProperty('--campaign-mobile-row', Math.floor(index / 2) + 1);
        category.style.setProperty('--campaign-mobile-column', index % 2 + 1);
        const help = campaign.querySelector('.header-new__campaign-keyboard-help');
        const button = category.querySelector('button[data-header-campaign-tab]');
        if (help && button) button.setAttribute('aria-describedby', help.id);
      });
      if (categories.length) {
        this.selectCampaignTab(categories[0].querySelector('[data-header-campaign-tab]'));
      } else {
        const panel = campaign.closest('[data-header-panel]');
        if (panel) panel.dataset.campaignEmpty = 'true';
        this.toggles.filter((toggle) => toggle.dataset.headerToggle === panel?.dataset.headerPanel)
          .forEach((toggle) => { toggle.disabled = true; });
      }
    }

    selectCampaignTab(tab) {
      if (!tab) return;
      const campaign = tab.closest('[data-header-campaign]');
      const selected = tab.closest('[data-header-campaign-category]');
      if (!campaign || !selected) return;
      campaign.querySelectorAll('[data-header-campaign-category]').forEach((category) => {
        const active = category === selected;
        category.dataset.active = String(active);
        category.querySelectorAll('[data-header-campaign-tab]').forEach((control) => {
          control.dataset.active = String(active);
          control.setAttribute('aria-expanded', String(active));
          if (control.tagName === 'BUTTON') {
            control.setAttribute('aria-pressed', String(active));
            control.tabIndex = active ? 0 : -1;
          }
        });
        const content = category.querySelector('[data-header-campaign-content]');
        if (content) content.hidden = !active;
      });
    }

    syncColumns() {
      this.columns.forEach((column) => {
        const button = column.querySelector('[data-header-column-toggle]');
        const content = column.querySelector('[data-header-column-content]');
        if (!button || !content) return;
        const category = column.dataset.columnRole === 'category';
        const expanded = !this.media.matches || category || column.dataset.mobileExpanded === 'true';
        button.hidden = category && this.media.matches;
        button.disabled = !this.media.matches;
        button.setAttribute('aria-expanded', String(expanded));
        content.hidden = !expanded;
      });
    }

    showPanel(panel, focus = false) {
      if (panel) this.closeCountries();
      if (panel?.dataset.campaignEmpty === 'true') panel = null;
      this.activePanel = panel;
      this.panels.forEach((item) => { item.hidden = item !== panel; });
      this.toggles.forEach((toggle) => {
        toggle.setAttribute('aria-expanded', String(toggle.dataset.headerToggle === panel?.dataset.headerPanel));
      });
      if (this.mainList) this.mainList.hidden = this.media.matches && Boolean(panel);
      this.root.toggleAttribute('data-panel-open', Boolean(panel));
      this.root.toggleAttribute('data-help-open', Boolean(panel?.classList.contains('header-new__panel--help')));
      if (focus && panel) panel.querySelector('[data-header-mobile-back], a[href], button:not([disabled])')?.focus();
    }

    openDrawer() {
      if (!this.drawer || this.drawerOpen) return;
      this.drawerOpen = true;
      this.previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      this.root.setAttribute('data-drawer-open', '');
      const backdrop = this.root.querySelector('[data-header-backdrop]');
      if (backdrop) backdrop.hidden = false;
      this.drawer.setAttribute('role', 'dialog');
      this.drawer.setAttribute('aria-modal', 'true');
      this.drawer.setAttribute('aria-label', 'Navigation');
      this.drawer.removeAttribute('inert');
      this.drawer.setAttribute('aria-hidden', 'false');
      this.opener?.setAttribute('aria-expanded', 'true');
      this.showPanel(null);
      this.drawer.querySelector('[data-header-mobile-close], [data-header-toggle], a[href]')?.focus();
    }

    close(restoreFocus = false) {
      this.pendingWishlist = false;
      this.root.querySelectorAll('[data-header-wishlist]').forEach((button) => button.removeAttribute('aria-busy'));
      this.closeCountries();
      this.showPanel(null);
      if (!this.drawerOpen) return;
      this.drawerOpen = false;
      this.root.removeAttribute('data-drawer-open');
      const backdrop = this.root.querySelector('[data-header-backdrop]');
      if (backdrop) backdrop.hidden = true;
      document.body.style.overflow = this.previousOverflow;
      this.opener?.setAttribute('aria-expanded', 'false');
      this.drawer.removeAttribute('role');
      this.drawer.removeAttribute('aria-modal');
      if (this.media.matches) {
        this.drawer.setAttribute('inert', '');
        this.drawer.setAttribute('aria-hidden', 'true');
      }
      if (restoreFocus) this.opener?.focus();
    }

    reset() {
      this.close();
      this.columns.forEach((column) => { column.dataset.mobileExpanded = column.dataset.mobileOpen || 'false'; });
      this.syncColumns();
      if (this.drawer) {
        this.drawer.toggleAttribute('inert', this.media.matches);
        if (this.media.matches) this.drawer.setAttribute('aria-hidden', 'true');
        else this.drawer.removeAttribute('aria-hidden');
      }
      this.measure();
    }

    click(event) {
      if (event.target.closest('[data-header-backdrop]')) {
        this.close(true);
        return;
      }
      const target = event.target.closest('button, a');
      if (!target) return;
      if (target.matches('[data-header-gift]')) {
        this.close();
        if (this.toggleGift()) event.preventDefault();
      } else if (target.matches('[data-header-search]')) {
        if (this.openSearch(target)) event.preventDefault();
      } else if (target.matches('[data-header-cart]')) {
        event.preventDefault();
        this.close();
        if (typeof window.openCart === 'function' && document.getElementById('popup-cart')) window.openCart();
        else window.location.assign(target.getAttribute('href') || this.root.dataset.cartUrl || '/cart');
      } else if (target.matches('[data-header-wishlist]')) {
        event.preventDefault();
        this.openWishlist();
      } else if (target.matches('[data-header-country-toggle]')) this.toggleCountry(target);
      else if (target.matches('button[data-header-campaign-tab]')) this.selectCampaignTab(target);
      else if (target.matches('[data-header-mobile-open]')) this.openDrawer();
      else if (target.matches('[data-header-mobile-close]')) this.close(true);
      else if (target.matches('[data-header-mobile-back]')) {
        const toggle = this.toggles.find((item) => item.dataset.headerToggle === this.activePanel?.dataset.headerPanel);
        this.showPanel(null);
        toggle?.focus();
      } else if (target.matches('[data-header-toggle]')) {
        const panel = this.panels.find((item) => item.dataset.headerPanel === target.dataset.headerToggle);
        this.showPanel(this.activePanel === panel ? null : panel, this.media.matches);
      } else if (target.matches('[data-header-column-toggle]') && this.media.matches) {
        const column = target.closest('[data-header-column]');
        column.dataset.mobileExpanded = String(column.dataset.mobileExpanded !== 'true');
        this.syncColumns();
      } else if (target.matches('a[href]')) this.close();
    }

    keydown(event) {
      if (this.media.matches && event.target.matches('button[data-header-campaign-tab]') && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) {
        const campaign = event.target.closest('[data-header-campaign]');
        const controls = [...campaign.querySelectorAll('button[data-header-campaign-tab]')];
        const index = controls.indexOf(event.target);
        const offset = event.key === 'ArrowUp' ? -2 : event.key === 'ArrowDown' ? 2 : event.key === 'ArrowLeft' ? -1 : 1;
        const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? controls.length - 1 : (index + offset + controls.length) % controls.length;
        event.preventDefault();
        this.selectCampaignTab(controls[nextIndex]);
        controls[nextIndex]?.focus();
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        const country = this.root.querySelector('[data-header-country-toggle][aria-expanded="true"]');
        if (country) {
          this.closeCountries();
          country.focus();
          return;
        }
        if (this.activePanel) {
          const toggle = this.toggles.find((item) => item.dataset.headerToggle === this.activePanel.dataset.headerPanel);
          this.showPanel(null);
          toggle?.focus();
        } else this.close(true);
      }
      if (event.key === 'ArrowDown' && !this.media.matches && event.target.matches('[data-header-toggle]')) {
        const panel = this.panels.find((item) => item.dataset.headerPanel === event.target.dataset.headerToggle);
        if (panel) {
          event.preventDefault();
          this.showPanel(panel);
          [...panel.querySelectorAll('a[href], button:not([disabled])')]
            .find((item) => item.getClientRects().length && !item.closest('[hidden]'))?.focus();
        }
      }
      if (event.key !== 'Tab' || !this.media.matches || !this.drawerOpen) return;
      const focusable = [...this.drawer.querySelectorAll('a[href], button:not([disabled]), [tabindex="0"]')]
        .filter((item) => item.tabIndex >= 0 && item.getClientRects().length && !item.closest('[hidden]'));
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    selectBlock(event) {
      const block = event.target;
      const panel = block.closest('[data-header-panel]') || block.querySelector('[data-header-panel]');
      if (!panel || !this.root.contains(panel)) return;
      if (this.media.matches) this.openDrawer();
      this.showPanel(panel);
      const category = block.closest('[data-header-campaign-category]');
      if (category) this.selectCampaignTab(category.querySelector('[data-header-campaign-tab]'));
      const column = block.closest('[data-header-column]');
      if (column) {
        column.dataset.mobileExpanded = 'true';
        this.syncColumns();
      }
    }

    destroy() {
      this.closeSearch(false);
      this.close();
      this.abort.abort();
      this.observer.disconnect();
      delete this.root.headerNewController;
    }
  }

  class HeaderAnnouncementBar {
    constructor(root) {
      this.root = root;
      this.swiperEl = root.querySelector('[data-header-announcement-swiper]');
      this.mobile = window.matchMedia('(max-width: 767px)');
      this.abort = new AbortController();
      this.frame = 0;
      this.countdownTimer = 0;
      this.autoplayResumeTimer = 0;
      this.swiper = null;
      this.bind();
      this.initSwiper();
      this.initCountdown();
      this.scheduleBuild();
    }

    on(target, type, handler, options) {
      target?.addEventListener(type, handler, { ...options, signal: this.abort.signal });
    }

    bind() {
      this.on(this.root.querySelector('[data-header-announcement-close]'), 'click', () => this.hide());
      this.on(this.root, 'mouseenter', () => this.setAutoplay(false));
      this.on(this.root, 'mouseleave', () => this.setAutoplay(true));
      this.on(this.mobile, 'change', () => this.scheduleBuild());
      this.on(window, 'orientationchange', () => this.scheduleBuild());
      if (document.fonts?.ready) {
        document.fonts.ready.then(() => {
          if (this.root.isConnected) this.scheduleBuild();
        });
      }
    }

    hide() {
      this.root.hidden = true;
      document.documentElement.style.setProperty('--announcement-current-height', '0px');
    }

    setAutoplay(resume) {
      if (!this.swiper || this.mobile.matches || !this.swiper.autoplay) return;
      if (resume) this.swiper.autoplay.start();
      else this.swiper.autoplay.pause();
    }

    initSwiper() {
      if (!this.swiperEl) return;

      const start = () => {
        if (!this.root.isConnected || this.swiper) return;

        const autoplayEnabled = this.swiperEl.dataset.autoplayEnabled === 'true';
        const delay = (Number(this.swiperEl.dataset.autoplay) || 4) * 1000;
        const next = this.root.querySelector('[data-header-announcement-next]');
        const prev = this.root.querySelector('[data-header-announcement-prev]');
        const options = {
          direction: 'horizontal',
          loop: true,
          speed: 750,
          autoHeight: false,
          breakpoints: {
            768: { direction: 'vertical', allowTouchMove: false, speed: 400 }
          },
          autoplay: autoplayEnabled ? { delay, disableOnInteraction: false } : false,
          on: {
            init: () => this.scheduleBuild(),
            slideChangeTransitionStart: () => this.stopMarquees(),
            slideChangeTransitionEnd: () => this.startMarquee(),
            touchEnd: (swiper) => {
              if (!this.mobile.matches || !autoplayEnabled || !swiper.autoplay) return;
              clearTimeout(this.autoplayResumeTimer);
              swiper.autoplay.stop();
              this.autoplayResumeTimer = setTimeout(() => {
                if (!swiper.destroyed && this.mobile.matches) swiper.autoplay.start();
              }, 8000);
            }
          }
        };

        if (next && prev) options.navigation = { nextEl: next, prevEl: prev };
        this.swiper = new Swiper(this.swiperEl, options);
        this.scheduleBuild();
      };

      if (window.Swiper) start();
      else this.on(document, 'DOMContentLoaded', start, { once: true });
    }

    scheduleBuild() {
      if (this.frame) return;
      this.frame = requestAnimationFrame(() => {
        this.frame = 0;
        this.buildMarquees();
      });
    }

    resetMarquees() {
      this.root.querySelectorAll('.header-announcement__marquee-viewport').forEach((viewport) => {
        viewport.querySelectorAll('[data-marquee-clone]').forEach((clone) => clone.remove());
        viewport.classList.remove('is-marquee', 'is-marquee-playing');
        viewport.closest('.swiper-slide')?.classList.remove('has-marquee');
        viewport.style.removeProperty('--header-announcement-marquee-distance');
        viewport.style.removeProperty('--header-announcement-marquee-duration');
      });
    }

    buildMarquees() {
      if (!this.root.isConnected || this.root.hidden) return;
      this.resetMarquees();
      if (!this.mobile.matches) return;

      const marquees = [];
      this.root.querySelectorAll('.header-announcement__marquee-viewport').forEach((viewport) => {
        const track = viewport.querySelector('.header-announcement__marquee-track');
        const slide = viewport.closest('.swiper-slide');
        const item = track?.querySelector('.header-announcement__marquee-item');
        if (!track || !slide || !item) return;
        const available = Math.max(Math.min(viewport.clientWidth, slide.clientWidth - 36), 0);
        if (item.scrollWidth <= available) return;
        marquees.push({ viewport, track, slide, item });
      });

      marquees.forEach(({ viewport, track, slide, item }) => {
        const clone = item.cloneNode(true);
        clone.dataset.marqueeClone = 'true';
        clone.setAttribute('aria-hidden', 'true');
        clone.querySelectorAll('[id]').forEach((element) => element.removeAttribute('id'));
        clone.querySelectorAll('a, button, input, select, textarea, summary, iframe, object, embed, [tabindex], [contenteditable]').forEach((element) => {
          element.setAttribute('tabindex', '-1');
          if (element.matches('button, input, select, textarea')) element.disabled = true;
        });
        track.appendChild(clone);

        const distance = item.getBoundingClientRect().width + 32;
        viewport.style.setProperty('--header-announcement-marquee-distance', `${distance}px`);
        viewport.style.setProperty('--header-announcement-marquee-duration', `${Math.max(distance / 40, 8)}s`);
        viewport.classList.add('is-marquee');
        slide.classList.add('has-marquee');
      });

      this.startMarquee();
    }

    stopMarquees() {
      this.root.querySelectorAll('.header-announcement__marquee-viewport.is-marquee-playing')
        .forEach((viewport) => viewport.classList.remove('is-marquee-playing'));
    }

    startMarquee() {
      this.stopMarquees();
      if (!this.mobile.matches) return;
      const viewport = this.root.querySelector('.swiper-slide-active .header-announcement__marquee-viewport.is-marquee');
      if (!viewport) return;
      void viewport.offsetWidth;
      viewport.classList.add('is-marquee-playing');
    }

    initCountdown() {
      const slide = this.root.querySelector('[data-header-announcement-countdown]');
      if (!slide) return;
      const target = new Date(slide.dataset.date).getTime();
      if (!Number.isFinite(target)) return;

      const units = {};
      slide.querySelectorAll('[data-header-announcement-unit]').forEach((element) => {
        units[element.dataset.headerAnnouncementUnit] = element;
      });
      const pad = (value) => String(value).padStart(2, '0');

      const tick = () => {
        const diff = target - Date.now();
        if (diff <= 0) {
          clearInterval(this.countdownTimer);
          slide.hidden = true;
          const hasOthers = [...this.root.querySelectorAll('.swiper-slide')].some((item) => (
            item !== slide &&
            !item.classList.contains('swiper-slide-duplicate') &&
            !item.classList.contains('header-announcement__slide--countdown') &&
            !item.hidden
          ));
          if (!hasOthers) this.hide();
          return;
        }
        if (units.days) units.days.textContent = pad(Math.floor(diff / 86400000));
        if (units.hours) units.hours.textContent = pad(Math.floor(diff / 3600000) % 24);
        if (units.minutes) units.minutes.textContent = pad(Math.floor(diff / 60000) % 60);
        if (units.seconds) units.seconds.textContent = pad(Math.floor(diff / 1000) % 60);
      };

      tick();
      this.countdownTimer = setInterval(tick, 1000);
    }

    destroy() {
      this.abort.abort();
      if (this.frame) cancelAnimationFrame(this.frame);
      clearInterval(this.countdownTimer);
      clearTimeout(this.autoplayResumeTimer);
      if (this.swiper && !this.swiper.destroyed) this.swiper.destroy(true, true);
      this.swiper = null;
      delete this.root.headerAnnouncementController;
      document.documentElement.style.removeProperty('--announcement-current-height');
    }
  }

  const initAnnouncements = (scope) => {
    const roots = [...scope.querySelectorAll('[data-header-announcement]')];
    if (scope.matches?.('[data-header-announcement]')) roots.push(scope);
    if (!roots.length) return;
    document.documentElement.style.removeProperty('--announcement-current-height');
    roots.forEach((root) => {
      if (!root.headerAnnouncementController) root.headerAnnouncementController = new HeaderAnnouncementBar(root);
    });
  };

  const init = (scope) => {
    const roots = [...scope.querySelectorAll('[data-header-new]')];
    if (scope.matches?.('[data-header-new]')) roots.push(scope);
    roots.forEach((root) => {
      if (!root.headerNewController) root.headerNewController = new HeaderNavigation(root);
    });
  };
  window.venustasHeaderNew = { init };
  window.SwymCallbacks = window.SwymCallbacks || [];
  window.SwymCallbacks.push((swym) => {
    window.venustasHeaderNew.swym = swym;
    document.querySelectorAll('[data-header-new]').forEach((root) => {
      if (root.headerNewController?.pendingWishlist) root.headerNewController.openWishlist();
    });
  });
  document.addEventListener('shopify:section:load', (event) => {
    init(event.target);
    initAnnouncements(event.target);
  });
  document.addEventListener('shopify:section:unload', (event) => {
    event.target.querySelectorAll('[data-header-new]').forEach((root) => root.headerNewController?.destroy());
    event.target.querySelectorAll('[data-header-announcement]').forEach((root) => root.headerAnnouncementController?.destroy());
  });
  document.addEventListener('shopify:block:select', (event) => {
    event.target.closest('[data-header-new]')?.headerNewController?.selectBlock(event);
  });
  init(document);
  initAnnouncements(document);
})();
