(() => {
  if (customElements.get('product-new-card')) return;

  let dialog = null;
  let lastTrigger = null;
  let previousOverflow = null;
  let token = 0;
  const cache = new Map();

  const moneyFormatters = new WeakMap();

  function formatMoney(root, cents) {
    if (!Number.isFinite(Number(cents))) return '';
    let formatter = moneyFormatters.get(root);
    if (!formatter) {
      let config = {};
      try {
        config = JSON.parse(root.querySelector('[data-quick-add-money]')?.textContent || '{}');
      } catch (error) {
        config = {};
      }
      formatter = new Intl.NumberFormat(config.locale || 'en', {
        style: 'currency',
        currency: config.currency || 'USD'
      });
      moneyFormatters.set(root, formatter);
    }
    return formatter.format(Number(cents) / 100);
  }

  function ensureDialog() {
    if (dialog) return dialog;
    dialog = document.createElement('dialog');
    dialog.className = 'product-new-quick-add';
    dialog.setAttribute('aria-label', 'Quick add');
    document.body.appendChild(dialog);

    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) {
        dialog.close();
        return;
      }
      if (event.target.closest('[data-quick-add-close]')) dialog.close();
    });

    dialog.addEventListener('close', () => {
      if (previousOverflow !== null) {
        document.documentElement.style.overflow = previousOverflow;
        previousOverflow = null;
      }
      if (lastTrigger && typeof lastTrigger.focus === 'function') {
        lastTrigger.focus({ preventScroll: true });
      }
      lastTrigger = null;
    });

    return dialog;
  }

  function showError(message, productUrl) {
    const host = ensureDialog();
    host.replaceChildren();
    const content = document.createElement('div');
    content.className = 'product-new-quick-add__content';
    const text = document.createElement('p');
    text.className = 'product-new-quick-add__error';
    text.textContent = message || 'Quick add is unavailable right now.';
    content.appendChild(text);
    if (productUrl) {
      const link = document.createElement('a');
      link.className = 'product-new-quick-add__details';
      link.href = productUrl;
      link.textContent = 'View full details';
      content.appendChild(link);
    }
    host.appendChild(content);
    openDialog(host);
  }

  function openDialog(host) {
    if (previousOverflow === null) previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    if (!host.open) host.showModal();
  }

  function buildQuickAddUrl(trigger) {
    const raw = trigger.getAttribute('href') || trigger.dataset.productUrl || '';
    if (!raw) return '';
    const url = new URL(raw, window.location.origin);
    url.searchParams.set('view', 'quick-add');
    return url.toString();
  }

  async function fetchQuickAdd(url) {
    if (cache.has(url)) return cache.get(url);
    const response = await fetch(url, { credentials: 'same-origin' });
    if (!response.ok) throw new Error('Quick add request failed: ' + response.status);
    const html = await response.text();
    if (!html.includes('data-quick-add-content')) throw new Error('Quick add content missing');
    cache.set(url, html);
    if (cache.size > 20) cache.delete(cache.keys().next().value);
    return html;
  }

  function parseQuickAddContent(html) {
    const parsed = new DOMParser().parseFromString(html, 'text/html');
    const content = parsed.querySelector('[data-quick-add-content]');
    return content ? document.importNode(content, true) : null;
  }

  function variantValues(fieldsets) {
    return fieldsets.map((fieldset) => fieldset.querySelector('.nav-variant-radio:checked')?.value || '');
  }

  function findVariant(variants, values) {
    return variants.find((variant) => variant.options.every((option, index) => option === values[index]));
  }

  function findRadioForSelector(fieldset, selector) {
    const id = selector.dataset.id;
    return Array.from(fieldset.querySelectorAll('.nav-variant-radio')).find((radio) => radio.id === id);
  }

  function setupQuickAdd(root, wantedColor) {
    const variantsScript = root.querySelector('.nav-variants script[type="application/json"]');
    let variants = [];
    try {
      variants = variantsScript ? JSON.parse(variantsScript.textContent || '[]') : [];
    } catch (error) {
      variants = [];
    }
    if (!Array.isArray(variants) || variants.length === 0) return;

    const fieldsets = Array.from(root.querySelectorAll('.nav-variants fieldset'));
    const sizeFieldset = fieldsets.find((fieldset) => /size/i.test(fieldset.querySelector('.variant-name')?.textContent || ''));
    const sizeIndex = sizeFieldset ? fieldsets.indexOf(sizeFieldset) : -1;
    const colorFieldset = fieldsets.find((fieldset) => /colou?r/i.test(fieldset.querySelector('.variant-name')?.textContent || ''));
    const colorIndex = colorFieldset ? fieldsets.indexOf(colorFieldset) : -1;

    const variantIdInput = root.querySelector('[data-quick-add-variant-id]');
    const priceCurrent = root.querySelector('[data-price-current]');
    const priceCompare = root.querySelector('[data-price-compare]');
    const cta = root.querySelector('[data-quick-add-cta]');
    const ctaLabel = root.querySelector('[data-quick-add-cta-label]');
    const form = root.querySelector('[data-quick-add-form]');
    const errorBox = root.querySelector('[data-quick-add-error]');

    function syncSelectors(values) {
      fieldsets.forEach((fieldset, index) => {
        Array.from(fieldset.querySelectorAll('.nav-variants-selector')).forEach((selector) => {
          const radio = findRadioForSelector(fieldset, selector);
          const isSelected = Boolean(radio && radio.checked);
          selector.classList.toggle('selected', isSelected);
          if (!radio) return;
          const available = variants.some((variant) =>
            variant.available && variant.options.every((option, optionIndex) =>
              optionIndex === index ? option === radio.value : option === values[optionIndex]
            )
          );
          selector.classList.toggle('disabled', !available);
          radio.disabled = !available;
        });
        const info = fieldset.querySelector('.variant-info');
        if (info) info.textContent = ' : ' + (values[index] || '');
      });
    }

    function sync(options = {}) {
      const values = variantValues(fieldsets);
      const variant = findVariant(variants, values);
      syncSelectors(values);

      if (variant) {
        if (variantIdInput) variantIdInput.value = variant.id;
        if (priceCurrent) priceCurrent.textContent = formatMoney(root, variant.price);
        if (priceCompare) {
          if (variant.compare_at_price > variant.price) {
            priceCompare.textContent = formatMoney(root, variant.compare_at_price);
            priceCompare.hidden = false;
          } else {
            priceCompare.hidden = true;
          }
        }
        if (cta && ctaLabel) {
          ctaLabel.textContent = variant.available ? 'Add to cart' : 'Sold out';
          cta.disabled = !variant.available;
        }
      } else {
        if (priceCurrent) priceCurrent.textContent = '';
      }

      if (options.applySizeType !== false) applySizeType();
    }

    function setVariant(variant) {
      if (!variant) return;
      fieldsets.forEach((fieldset, index) => {
        const value = variant.options[index];
        const radio = Array.from(fieldset.querySelectorAll('.nav-variant-radio')).find((input) => input.value === value);
        if (radio) radio.checked = true;
      });
      sync();
    }

    // Size type toggle (Regular / Tall) for products with LT sizes.
    let sizeTypeButtons = null;
    function applySizeType() {
      if (!sizeFieldset || !sizeTypeButtons) return;
      const type = sizeTypeButtons.querySelector('[aria-pressed="true"]')?.dataset.sizeType || 'standard';
      const selectors = Array.from(sizeFieldset.querySelectorAll('.nav-variants-selector'));
      selectors.forEach((selector) => {
        const radio = findRadioForSelector(sizeFieldset, selector);
        const isTall = String(radio?.value || '').toUpperCase().includes('LT');
        const visible = type === 'tall' ? isTall : !isTall;
        selector.hidden = !visible;
        if (radio) {
          const option = radio.closest('.nav-variants-option');
          if (option) option.hidden = !visible;
        }
      });
    }

    function buildSizeTypeToggle() {
      if (!sizeFieldset) return;
      const sizeValues = Array.from(sizeFieldset.querySelectorAll('.nav-variant-radio')).map((radio) => String(radio.value).toUpperCase());
      const hasTall = sizeValues.some((value) => value.includes('LT'));
      if (!hasTall) return;
      const legend = sizeFieldset.querySelector('legend');
      if (!legend) return;
      const group = document.createElement('div');
      group.className = 'product-option-panel__size-type';
      group.setAttribute('role', 'group');
      group.setAttribute('aria-label', 'Size type');
      group.innerHTML = '<button type="button" data-size-type="standard" aria-pressed="true">Regular</button><button type="button" data-size-type="tall" aria-pressed="false">Tall</button>';
      legend.insertAdjacentElement('afterend', group);
      sizeTypeButtons = group;
      group.addEventListener('click', (event) => {
        const button = event.target.closest('[data-size-type]');
        if (!button) return;
        const previous = group.querySelector('[aria-pressed="true"]');
        const type = button.dataset.sizeType;
        if (previous === button) return;
        group.querySelectorAll('[data-size-type]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
        const selectedRadio = sizeFieldset.querySelector('.nav-variant-radio:checked');
        const selectedIsTall = String(selectedRadio?.value || '').toUpperCase().includes('LT');
        if ((type === 'tall') !== selectedIsTall) {
          const visibleRadios = Array.from(sizeFieldset.querySelectorAll('.nav-variant-radio')).filter((radio) => {
            const isTall = String(radio.value).toUpperCase().includes('LT');
            return type === 'tall' ? isTall : !isTall;
          });
          const preferred = visibleRadios.find((radio) => !radio.disabled && radio.value.toUpperCase() === 'L')
            || visibleRadios.find((radio) => !radio.disabled)
            || visibleRadios[0];
          if (!preferred) {
            if (previous) previous.setAttribute('aria-pressed', 'true');
            applySizeType();
            return;
          }
          preferred.checked = true;
          sync();
          return;
        }
        applySizeType();
      });
    }

    // Size chart entry moves into the Size legend.
    const sizeGuide = root.querySelector('.size-chart-component__button');
    if (sizeGuide) {
      const legend = sizeFieldset?.querySelector('legend');
      if (legend) legend.appendChild(sizeGuide);
      else sizeGuide.hidden = true;
    }

    Array.from(root.querySelectorAll('.nav-variants-selector')).forEach((selector) => {
      selector.addEventListener('click', (event) => {
        event.preventDefault();
        if (selector.classList.contains('disabled') || selector.hidden) return;
        const fieldset = selector.closest('fieldset');
        const radio = fieldset ? findRadioForSelector(fieldset, selector) : null;
        if (!radio || radio.disabled) return;
        radio.checked = true;
        sync();
      });
    });

    Array.from(root.querySelectorAll('.nav-variant-radio')).forEach((radio) => {
      radio.addEventListener('change', () => sync());
    });

    buildSizeTypeToggle();

    // Default variant: requested colour + L when available, otherwise first available size.
    let candidates = variants;
    if (wantedColor && colorIndex >= 0) {
      const colorCandidates = variants.filter((variant) => variant.options[colorIndex] === wantedColor);
      if (colorCandidates.length) candidates = colorCandidates;
    }
    const getSize = (variant) => (sizeIndex >= 0 ? variant.options[sizeIndex] : '');
    const selectedVariant = candidates.find((variant) => variant.available && String(getSize(variant)).toUpperCase() === 'L')
      || candidates.find((variant) => variant.available)
      || candidates.find((variant) => String(getSize(variant)).toUpperCase() === 'L')
      || candidates[0]
      || variants[0];

    if (selectedVariant) {
      setVariant(selectedVariant);
      if (sizeTypeButtons && String(getSize(selectedVariant)).toUpperCase().includes('LT')) {
        sizeTypeButtons.querySelectorAll('[data-size-type]').forEach((item) => item.setAttribute('aria-pressed', String(item.dataset.sizeType === 'tall')));
      }
      applySizeType();
    } else {
      sync();
    }

    if (form) {
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const variant = variants.find((item) => String(item.id) === String(variantIdInput?.value));
        if (!variant || !variant.available) return;
        if (errorBox) {
          errorBox.hidden = true;
          errorBox.textContent = '';
        }
        if (cta) {
          cta.disabled = true;
          cta.setAttribute('aria-busy', 'true');
        }
        try {
          const response = await fetch('/cart/add.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ items: [{ id: Number(variant.id), quantity: 1 }] })
          });
          if (!response.ok) {
            let message = 'This item could not be added. Please try again.';
            try {
              const data = await response.json();
              if (data && data.description) message = data.description;
            } catch (error) {
              message = 'This item could not be added. Please try again.';
            }
            throw new Error(message);
          }
          if (dialog) dialog.close();
          if (typeof window.refreshCart === 'function') window.refreshCart();
          if (typeof window.openCart === 'function') window.openCart(false);
        } catch (error) {
          if (errorBox) {
            errorBox.textContent = error.message || 'This item could not be added.';
            errorBox.hidden = false;
          }
        } finally {
          if (cta) {
            cta.removeAttribute('aria-busy');
            cta.disabled = !variant.available;
          }
        }
      });
    }
  }

  async function openQuickAdd(trigger) {
    const url = buildQuickAddUrl(trigger);
    if (!url) return;
    if (dialog && dialog.open) return;

    lastTrigger = trigger;
    const host = ensureDialog();
    const requestToken = ++token;
    trigger.setAttribute('aria-busy', 'true');

    try {
      const html = await fetchQuickAdd(url);
      if (requestToken !== token) return;
      const content = parseQuickAddContent(html);
      if (!content) throw new Error('Quick add content missing');
      host.replaceChildren(content);
      setupQuickAdd(host, trigger.dataset.color || '');
      openDialog(host);
    } catch (error) {
      if (requestToken === token) {
        showError('Quick add is unavailable right now. Please open the product page.', trigger.getAttribute('href') || '');
      }
    } finally {
      trigger.removeAttribute('aria-busy');
    }
  }

  class ProductNewCard extends HTMLElement {
    connectedCallback() {
      this.abort?.abort();
      const controller = new AbortController();
      this.abort = controller;
      const options = { signal: controller.signal };

      this.addEventListener('click', (event) => {
        const toggle = event.target.closest('[data-swatch-toggle]');
        if (toggle) {
          const wrapper = toggle.closest('[data-swatches]');
          if (wrapper) {
            const expanded = wrapper.toggleAttribute('data-expanded');
            toggle.setAttribute('aria-expanded', String(expanded));
          }
          return;
        }

        const swatch = event.target.closest('[data-swatch]');
        if (swatch) {
          event.preventDefault();
          this.selectSwatch(swatch);
          return;
        }

        const quickAdd = event.target.closest('[data-quick-add]');
        if (quickAdd) {
          event.preventDefault();
          openQuickAdd(quickAdd);
        }
      }, options);
    }

    selectSwatch(swatch) {
      this.querySelectorAll('[data-swatch]').forEach((item) => {
        const selected = item === swatch;
        item.classList.toggle('is-selected', selected);
        item.setAttribute('aria-pressed', String(selected));
      });

      const image = this.querySelector('[data-card-image]');
      if (image && swatch.dataset.image) {
        image.src = swatch.dataset.image;
        if (swatch.dataset.imageSrcset) image.srcset = swatch.dataset.imageSrcset;
        if (swatch.dataset.imageAlt) image.alt = swatch.dataset.imageAlt;
      }

      const current = this.querySelector('[data-price-current]');
      if (current && swatch.dataset.priceText) current.textContent = swatch.dataset.priceText;

      const compare = this.querySelector('[data-price-compare]');
      if (compare) {
        if (swatch.dataset.compareVisible === 'true' && swatch.dataset.compareText) {
          compare.textContent = swatch.dataset.compareText;
          compare.hidden = false;
        } else {
          compare.hidden = true;
        }
      }

      const quickAdd = this.querySelector('[data-quick-add]');
      if (quickAdd) quickAdd.dataset.color = swatch.dataset.color || '';

      const form = this.querySelector('.product-new-card__quick-add-form');
      if (form) {
        const input = form.querySelector('input[name="id"]');
        if (input && swatch.dataset.variantId) input.value = swatch.dataset.variantId;
      }

      const wishlist = this.querySelector('.swym-button');
      if (wishlist && swatch.dataset.variantId) wishlist.setAttribute('data-variant-id', swatch.dataset.variantId);
    }

    disconnectedCallback() {
      this.abort?.abort();
    }
  }

  customElements.define('product-new-card', ProductNewCard);
})();
