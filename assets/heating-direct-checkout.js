(() => {
  if (window.heatingDirectCheckoutReady) return;
  window.heatingDirectCheckoutReady = true;

  document.addEventListener('click', async (event) => {
    const trigger = event.target.closest('[data-heating-direct-checkout]');
    if (!trigger) return;

    const variantId = trigger.dataset.variantId;
    if (!variantId || trigger.getAttribute('aria-disabled') === 'true') {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    if (trigger.getAttribute('aria-busy') === 'true') return;

    trigger.setAttribute('aria-busy', 'true');
    const rootUrl = trigger.dataset.rootUrl || '/';

    try {
      const clearResponse = await fetch(`${rootUrl}cart/clear.js`, {
        method: 'POST',
        headers: { Accept: 'application/json' }
      });
      if (!clearResponse.ok) throw new Error('Unable to clear cart');

      const addResponse = await fetch(`${rootUrl}cart/add.js`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items: [{ id: Number(variantId), quantity: 1 }] })
      });
      if (!addResponse.ok) throw new Error('Unable to add reservation');

      window.location.assign(`${rootUrl}checkout`);
    } catch (error) {
      trigger.removeAttribute('aria-busy');
      window.location.assign(trigger.href);
    }
  });
})();
