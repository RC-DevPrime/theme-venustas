(() => {
  if (window.ProductNavNew) { window.ProductNavNew.scan(); return; }
  const instances = new Map();
  function init(root) {
    if (instances.has(root)) return;
    const controller = new AbortController();
    const timers = new Set();
    let chartObserver;
    let cleanupUI = () => {};
    const listen = (target, type, handler) => target?.addEventListener(type, handler, { signal: controller.signal });
    const schedule = (callback, delay) => { const timer = window.setTimeout(() => { timers.delete(timer); if (root.isConnected) callback(); }, delay); timers.add(timer); return timer; };
    instances.set(root, () => { controller.abort(); timers.forEach(clearTimeout); chartObserver?.disconnect(); root.navVariantCleanup?.(); cleanupUI(); delete root.dataset.ready; });
    try {
    const panel = root.querySelector('[data-product-panel]');
    const quantityInputs = root.querySelectorAll('[data-quantity-input]');
    const formQuantity = root.querySelector('[data-form-quantity]');
    const variantIdInput = root.querySelector('#main-product-id-nav');
    const variantJson = panel?.querySelector('script[type="application/json"]')?.textContent || '[]';
    let variants = [];
    try { variants = JSON.parse(variantJson); } catch (error) { variants = []; }
    const availabilityButtons = root.querySelectorAll('[data-nav-submit], [data-mobile-toggle]');
    const moneyConfig = JSON.parse(root.querySelector('[data-nav-prices]')?.textContent || '{}');
    const moneyFormatter = new Intl.NumberFormat(moneyConfig.locale || 'en', { style: 'currency', currency: moneyConfig.currency || 'USD' });
    const formatTotal = (cents) => moneyFormatter.format(cents / 100);
    const optionFieldsets = panel ? Array.from(panel.querySelectorAll('.nav-variants fieldset')) : [];
    const optionTriggers = Array.from(root.querySelectorAll('[data-open-panel]'));
    const classifyOption = (fieldset, index) => {
      const label = (optionTriggers[index]?.dataset.optionName || fieldset.querySelector('.variant-name')?.firstChild?.textContent || '').trim().toLowerCase();
      if (label === 'color' || label === 'colour') return 'color';
      if (label === 'heating zones') return 'heating-zones';
      if (label === 'size') return 'size';
      return 'other';
    };
    optionFieldsets.forEach((fieldset, index) => {
      fieldset.dataset.optionKind = classifyOption(fieldset, index);
      if (optionTriggers[index]) optionTriggers[index].dataset.optionKind = fieldset.dataset.optionKind;
    });
    const sizeGuideButton = root.querySelector('.product-nav-new__size-guide');
    const sizeLegend = panel?.querySelector('[data-option-kind="size"] legend');
    const sizeGuideModal = root.querySelector('[data-size-chart-modal]');
    if (sizeGuideButton && sizeLegend) sizeLegend.append(sizeGuideButton);
    else if (sizeGuideButton) sizeGuideButton.hidden = true;
    if (sizeGuideModal) {
      chartObserver = new MutationObserver(() => {
        if (sizeGuideModal.classList.contains('open')) {
          sizeGuideModal.focus({ preventScroll: true });
        } else if (root.classList.contains('is-open')) {
          document.body.style.overflow = 'hidden';
          sizeGuideButton?.focus({ preventScroll: true });
        }
      });
      chartObserver.observe(sizeGuideModal, { attributes: true, attributeFilter: ['class'] });
    }
    const desktopOptions = root.querySelector('[data-desktop-options]');
    let activeTrigger = null;
    const closeDesktopOptions = () => {
      desktopOptions.hidden = true;
      activeTrigger?.setAttribute('aria-expanded', 'false');
      activeTrigger = null;
    };
    const positionDesktopOptions = () => {
      if (!activeTrigger) return;
      const rect = activeTrigger.getBoundingClientRect();
      desktopOptions.style.left = `${Math.max(8, Math.min(rect.left, window.innerWidth - desktopOptions.offsetWidth - 8))}px`;
      desktopOptions.style.bottom = `${window.innerHeight - rect.top + 6}px`;
    };
    const renderDesktopOptions = () => {
      if (!activeTrigger) return;
      const fieldset = optionFieldsets[Number(activeTrigger.dataset.openPanel)];
      desktopOptions.replaceChildren();
      fieldset?.querySelectorAll('.nav-variant-radio').forEach((radio) => {
        const choice = document.createElement('button');
        choice.type = 'button';
        choice.className = 'product-nav-new__option-choice';
        choice.textContent = `${activeTrigger.dataset.optionName}: ${radio.value}`;
        choice.disabled = radio.disabled;
        choice.setAttribute('aria-pressed', String(radio.checked));
        const source = Array.from(fieldset.querySelectorAll('.nav-variants-selector')).find((item) => item.dataset.id === radio.id);
        const swatch = source?.querySelector('.color-swatch');
        if (swatch) { const icon = swatch.cloneNode(true); icon.classList.add('product-nav-new__swatch'); choice.prepend(icon); }
        listen(choice, 'click', () => {
          source?.click();
          closeDesktopOptions();
          schedule(() => { syncAvailability(); syncTriggerLabels(); }, 0);
        });
        desktopOptions.append(choice);
      });
      positionDesktopOptions();
    };
    const showOption = (trigger) => {
      if (activeTrigger === trigger) { closeDesktopOptions(); return; }
      closeDesktopOptions();
      activeTrigger = trigger;
      trigger.setAttribute('aria-expanded', 'true');
      desktopOptions.hidden = false;
      renderDesktopOptions();
    };
    const syncTriggerLabels = () => {
      optionTriggers.forEach((trigger, index) => {
        const fieldset = optionFieldsets[index];
        const radio = fieldset?.querySelector('.nav-variant-radio:checked');
        if (!radio) return;
        trigger.textContent = `${trigger.dataset.optionName}: ${radio.value}`;
        if (trigger.dataset.optionKind === 'color') {
          const source = Array.from(fieldset.querySelectorAll('.nav-variants-selector')).find((item) => item.dataset.id === radio.id);
          const swatch = source?.querySelector('.color-swatch');
          if (swatch) { const icon = swatch.cloneNode(true); icon.classList.add('product-nav-new__swatch'); trigger.prepend(icon); }
        }
      });
      renderDesktopOptions();
    };
    const syncAvailability = () => {
      const selectedVariant = variants.find((variant) => String(variant.id) === String(variantIdInput?.value));
      const gate = window.venustasRegionalInventoryGate;
      const state = gate?.getVariantAvailabilityState?.(selectedVariant?.id, root.querySelector('.nav-inventory-info-app'));
      const available = Boolean(selectedVariant?.available) && (state ? state.finalAvailable : true);
      if (selectedVariant) {
        const quantity = Math.max(1, Math.floor(Number(formQuantity?.value) || 1));
        const discounted = selectedVariant.compare_at_price > selectedVariant.price;
        root.querySelectorAll('.product-nav-new__price-current').forEach((element) => { element.textContent = formatTotal(selectedVariant.price * quantity); });
        root.querySelectorAll('.product-nav-new__price-compare').forEach((element) => { element.textContent = formatTotal((selectedVariant.compare_at_price || 0) * quantity); element.hidden = !discounted; });
        root.querySelectorAll('.product-nav-new__panel-save').forEach((element) => { element.textContent = `Save ${formatTotal(Math.max(0, selectedVariant.compare_at_price - selectedVariant.price) * quantity)}`; element.hidden = !discounted; });
      }
      availabilityButtons.forEach((button) => {
        const busy = root.querySelector('#header-nav-product-form')?.getAttribute('aria-busy') === 'true';
        button.disabled = !available || busy;
        button.textContent = busy ? 'Adding…' : available ? 'ADD TO CART' : 'Out of Stock';
      });
    };
    let previousFocus;
    const mobileQuery = window.matchMedia('(max-width: 767px)');
    let previousOverflow;
    const togglePanel = (open) => {
      const wasOpen = root.classList.contains('is-open');
      root.classList.toggle('is-open', open);
      panel?.setAttribute('aria-hidden', String(!open));
      root.querySelector('[data-mobile-toggle]')?.setAttribute('aria-expanded', String(open));
      if (open && !wasOpen) {
        previousFocus = document.activeElement;
        if (mobileQuery.matches) { previousOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; }
        panel?.focus({ preventScroll: true });
      } else if (!open && wasOpen) {
        if (previousOverflow !== undefined) { document.body.style.overflow = previousOverflow; previousOverflow = undefined; }
        previousFocus?.focus({ preventScroll: true });
      }
    };
    root.querySelector('[data-mobile-toggle]')?.setAttribute('aria-controls', panel.id);
    cleanupUI = () => {
      closeDesktopOptions();
      if (root.classList.contains('is-open')) togglePanel(false);
      if (sizeGuideModal?.classList.contains('open')) window.SizeChartComponent?.close(sizeGuideModal);
    };
    root.querySelectorAll('[data-open-panel]').forEach((button) => {
      button.setAttribute('aria-expanded', 'false');
      if (!optionFieldsets[Number(button.dataset.openPanel)]) button.hidden = true;
      listen(button, 'click', () => showOption(button));
    });
    listen(document, 'click', (event) => {
      if (activeTrigger && !desktopOptions.contains(event.target) && !activeTrigger.contains(event.target)) closeDesktopOptions();
    });
    listen(document, 'keydown', (event) => { if (event.key === 'Escape' && activeTrigger) { const trigger = activeTrigger; closeDesktopOptions(); trigger.focus(); } });
    listen(window, 'resize', positionDesktopOptions);
    listen(root.querySelector('[data-mobile-toggle]'), 'click', () => { panel?.removeAttribute('data-option-filter'); togglePanel(true); });
    listen(root.querySelector('[data-mobile-close]'), 'click', () => togglePanel(false));
    listen(root.querySelector('[data-mobile-backdrop]'), 'click', () => togglePanel(false));
    listen(root, 'keydown', (event) => {
      if (sizeGuideModal?.classList.contains('open')) return;
      if (!root.classList.contains('is-open')) return;
      if (event.key === 'Escape') togglePanel(false);
      if (event.key === 'Tab' && mobileQuery.matches) {
        const controls = Array.from(panel.querySelectorAll('button:not(:disabled), [tabindex="0"], input:not([type="hidden"]):not(:disabled)')).filter((control) => control.getClientRects().length);
        const first = controls[0], last = controls[controls.length - 1];
        if (event.shiftKey && (document.activeElement === first || document.activeElement === panel)) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && (document.activeElement === last || document.activeElement === panel)) { event.preventDefault(); first?.focus(); }
      }
    });
    listen(mobileQuery, 'change', () => { closeDesktopOptions(); togglePanel(false); });
    panel?.querySelectorAll('.nav-variants-selector').forEach((selector) => {
      selector.tabIndex = 0;
      selector.setAttribute('role', 'button');
      selector.setAttribute('aria-label', selector.textContent.trim() || selector.nextElementSibling?.querySelector('input')?.value || 'Option');
      listen(selector, 'keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selector.click(); }
      });
    });
    const setQuantity = (value) => { const numeric = Number(value); const next = Number.isFinite(numeric) ? Math.max(1, Math.floor(numeric)) : 1; quantityInputs.forEach((input) => { input.value = next; }); if (formQuantity) formQuantity.value = next; syncAvailability(); };
    const purchaseForm = root.querySelector('#header-nav-product-form');
    listen(root, 'nav:cart-error', () => {
      const error = root.querySelector('[data-purchase-error]');
      error.textContent = root.querySelector('.main-product-error p')?.textContent || 'Unable to add this item. Please try again.';
      error.hidden = false;
      purchaseForm.removeAttribute('aria-busy');
      if (mobileQuery.matches) togglePanel(true);
      syncAvailability();
    });
    listen(root, 'nav:cart-success', () => { closeDesktopOptions(); togglePanel(false); document.body.style.overflowY = 'hidden'; });
    listen(root, 'nav:cart-settled', () => { purchaseForm.removeAttribute('aria-busy'); syncAvailability(); });
    listen(purchaseForm, 'submit', (event) => {
      if (purchaseForm.getAttribute('aria-busy') === 'true') { event.preventDefault(); event.stopImmediatePropagation(); return; }
      setQuantity(quantityInputs[0]?.value);
      root.querySelector('[data-purchase-error]').hidden = true;
      syncAvailability();
      if (root.querySelector('[data-nav-submit]').disabled) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const error = root.querySelector('.main-product-error');
        error.style.display = 'block';
        error.querySelector('p').textContent = 'This variant is currently unavailable. Please select another option.';
        if (mobileQuery.matches) togglePanel(true);
        return;
      }
      purchaseForm.setAttribute('aria-busy', 'true');
      root.querySelectorAll('[data-nav-submit]').forEach((button) => { button.disabled = true; button.textContent = 'Adding…'; });
    });
    root.querySelectorAll('[data-quantity-decrease]').forEach((button) => listen(button, 'click', () => setQuantity(Number(quantityInputs[0].value) - 1)));
    root.querySelectorAll('[data-quantity-increase]').forEach((button) => listen(button, 'click', () => setQuantity(Number(quantityInputs[0].value) + 1)));
    quantityInputs.forEach((input) => listen(input, 'change', () => setQuantity(input.value)));
    panel?.querySelectorAll('.nav-variants-selector').forEach((selector) => listen(selector, 'click', () => schedule(() => { syncAvailability(); syncTriggerLabels(); }, 0)));
    panel?.querySelectorAll('.nav-variant-radio').forEach((input) => listen(input, 'change', () => {
      schedule(syncAvailability, 0);
      schedule(syncAvailability, 120);
      schedule(syncTriggerLabels, 120);
    }));
    listen(document, 'change', (event) => {
      if (event.target.matches('.nav-variant-radio, .variant-radio, #main-product-id-nav')) {
        schedule(syncAvailability, 0);
        schedule(syncAvailability, 120);
        schedule(syncTriggerLabels, 120);
      }
    });
    syncAvailability();
    syncTriggerLabels();
    schedule(syncAvailability, 250);

    window.initNavProductVariants?.(root);
    root.dataset.ready = 'true';
    } catch (error) { controller.abort(); timers.forEach(clearTimeout); chartObserver?.disconnect(); instances.delete(root); delete root.dataset.ready; console.error('Product navigation initialization failed:', error); }
  }
  function scan() {
    instances.forEach((cleanup, root) => { if (!root.isConnected) { cleanup(); instances.delete(root); } });
    document.querySelectorAll('[data-product-nav-new]').forEach(init);
  }
  window.ProductNavNew = { scan };
  document.addEventListener('shopify:section:load', scan);
  document.addEventListener('shopify:section:unload', (event) => {
    instances.forEach((cleanup, root) => { if (event.target.contains(root)) { cleanup(); instances.delete(root); } });
  });
  new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
  scan();
})();
