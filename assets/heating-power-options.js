(() => {
  if (window.heatingPowerOptionsReady) return;
  window.heatingPowerOptionsReady = true;

  document.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-heating-power-add]');
    if (!button || button.disabled) return;

    const variantId = Number(button.dataset.variantId);
    if (!variantId) return;

    button.disabled = true;
    button.setAttribute('aria-busy', 'true');

    try {
      const response = await fetch(`${window.Shopify?.routes?.root || '/'}cart/add.js`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ items: [{ id: variantId, quantity: 1 }] })
      });

      if (!response.ok) throw new Error('Unable to add battery to cart');

      if (typeof window.refreshCart === 'function') window.refreshCart();
      if (typeof window.refreshMainCart === 'function') window.refreshMainCart();
      document.dispatchEvent(new Event('cart:refresh'));
      if (typeof window.openCart === 'function') window.openCart(false);
    } catch (error) {
      console.error(error);
    } finally {
      button.disabled = false;
      button.removeAttribute('aria-busy');
    }
  });
})();
