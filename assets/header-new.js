(() => {
  if (window.venustasHeaderNew) {
    window.venustasHeaderNew.init(document);
    return;
  }

  class HeaderNavigation {
    constructor(root) {
      this.root = root;
      this.media = window.matchMedia('(max-width: 767px)');
      this.abort = new AbortController();
      this.drawer = root.querySelector('[data-header-drawer]');
      this.mainList = root.querySelector('[data-header-main-list]');
      this.opener = root.querySelector('[data-header-mobile-open]');
      this.panels = [...root.querySelectorAll('[data-header-panel]')];
      this.toggles = [...root.querySelectorAll('[data-header-toggle]')];
      this.columns = [...root.querySelectorAll('[data-header-column]')];
      this.drawerOpen = false;
      this.activePanel = null;
      this.bind(root, 'click', (event) => this.click(event));
      this.bind(root, 'keydown', (event) => this.keydown(event));
      this.bind(root, 'pointerleave', () => {
        if (!this.media.matches && !root.contains(document.activeElement)) this.showPanel(null);
      });
      this.bind(root, 'focusout', () => {
        queueMicrotask(() => {
          if (!this.media.matches && !root.contains(document.activeElement)) this.showPanel(null);
        });
      });
      this.bind(document, 'click', (event) => {
        if (!root.contains(event.target)) this.close();
      });
      this.bind(this.media, 'change', () => this.reset());
      this.toggles.forEach((toggle) => {
        const panel = this.panels.find((item) => item.dataset.headerPanel === toggle.dataset.headerToggle);
        if (!panel) {
          toggle.disabled = true;
          return;
        }
        toggle.setAttribute('aria-controls', panel.id);
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
      document.documentElement.style.setProperty('--header-nav-height', `${height}px`);
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
      if (panel?.dataset.campaignEmpty === 'true') panel = null;
      this.activePanel = panel;
      this.panels.forEach((item) => { item.hidden = item !== panel; });
      this.toggles.forEach((toggle) => {
        toggle.setAttribute('aria-expanded', String(toggle.dataset.headerToggle === panel?.dataset.headerPanel));
      });
      if (this.mainList) this.mainList.hidden = this.media.matches && Boolean(panel);
      this.root.toggleAttribute('data-panel-open', Boolean(panel));
      if (focus && panel) panel.querySelector('[data-header-mobile-back], a[href], button:not([disabled])')?.focus();
    }

    openDrawer() {
      if (!this.drawer || this.drawerOpen) return;
      this.drawerOpen = true;
      this.previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      this.root.setAttribute('data-drawer-open', '');
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
      this.showPanel(null);
      if (!this.drawerOpen) return;
      this.drawerOpen = false;
      this.root.removeAttribute('data-drawer-open');
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
      const target = event.target.closest('button, a');
      if (!target) return;
      if (target.matches('button[data-header-campaign-tab]')) this.selectCampaignTab(target);
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
      this.close();
      this.abort.abort();
      this.observer.disconnect();
      delete this.root.headerNewController;
    }
  }

  const init = (scope) => {
    const roots = [...scope.querySelectorAll('[data-header-new]')];
    if (scope.matches?.('[data-header-new]')) roots.push(scope);
    roots.forEach((root) => {
      if (!root.headerNewController) root.headerNewController = new HeaderNavigation(root);
    });
  };
  window.venustasHeaderNew = { init };
  document.addEventListener('shopify:section:load', (event) => init(event.target));
  document.addEventListener('shopify:section:unload', (event) => {
    event.target.querySelectorAll('[data-header-new]').forEach((root) => root.headerNewController?.destroy());
  });
  document.addEventListener('shopify:block:select', (event) => {
    event.target.closest('[data-header-new]')?.headerNewController?.selectBlock(event);
  });
  init(document);
})();
