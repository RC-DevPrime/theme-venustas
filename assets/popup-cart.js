$(document).ready(function () {
    let urlParams = new URLSearchParams(window.location.search);
    const shouldOpenCartOnLoad = urlParams.get('cart') === 'open';

    if (shouldOpenCartOnLoad) {
        openCart();
    }

    if ($('.cart-ymal .cart-ymal-swiper').length) {

        const swiper = new Swiper('.cart-ymal .cart-ymal-swiper', {
            slidesPerView: 1.2,
            speed: 800,
            spaceBetween: 10,
        });

        $('.cart-ymal .slide-prev').on('click', function () {
            swiper.slidePrev();
        });

        $('.cart-ymal .slide-next').on('click', function () {
            swiper.slideNext();
        });
    }

});

// open cart on navigation
$('.header .icon-cart').on('click', function() {
    openCart();
    console.log('Open Cart')
});

function openCart(shouldRefresh = true) {
    const $popup = $('#popup-cart');
    if (!$popup.is(':visible')) $popup.css('display', 'flex').hide().fadeIn();
    $('body').css('overflow-y', 'hidden');
    if (shouldRefresh) {
        refreshCart();
    }

    if ($('.popup-order').length && $('.popup-order').css('display') == 'flex')
        $('.popup-order').fadeOut();
}

// close cart
$(document).on('click', '#popup-cart .cart-close', function (e) {
    closeCart();
});

function closeCart() {
    $('#popup-cart').fadeOut();
    $('body').css('overflow-y', 'visible');
}

// preventing scroll
function preventScroll(event) {
    event.preventDefault();
}

// Show confirmed additions immediately, without waiting for section rendering.
function showAddedCartItems(data) {
    const $popup = $('#popup-cart');
    const $body = $popup.find('.cart-body');
    const items = Array.isArray(data.items) ? data.items : [data];
    items.forEach(item => {
        if (!item.key) return;
        let $row = $body.children('.product-cart').filter(function () {
            return $(this).attr('data-key') === item.key;
        }).first();
        if (!$row.length) {
            if (!$body.children('.product-cart').length) $body.empty();
            $row = $('<div class="product-cart">').attr('data-key', item.key);
            const imageUrl = item.featured_image && item.featured_image.url || item.image;
            const $image = $('<div class="product-image">');
            if (imageUrl) $image.append($('<img>').attr({ src: imageUrl, alt: item.product_title || item.title }));
            $row.append($('<a>').attr('href', item.url).append($image));
            const $details = $('<div class="product-details">');
            $details.append($('<a class="product-title pp-semibold f-black">').attr('href', item.url).text(item.product_title || item.title));
            if (item.variant_title && item.variant_title !== 'Default Title') {
                $details.append($('<p class="product-variant">').text(item.variant_title));
            }
            $details.append($('<div class="product-quantity">').append(
                $('<input class="qty" type="number" readonly disabled>').attr('data-key', item.key)
            ));
            $details.append('<div class="product-price body-sm"></div>');
            $row.append($details);
            $body.prepend($row);
        }
        $row.find('.product-quantity .qty').val(item.quantity);
        $row.find('.product-price').last().text('Updating price…');
    });
    if ($body.children('.product-cart').length) {
        $body.show();
        $popup.find('.empty-body').hide();
        $popup.find('.cart-checkout, .cart-promotion, .yml-container, .cart-footer').show();
    }
}

function addItemsToCart(payload) {
    return fetch('/cart/add.js', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
    })
        .then(function (response) {
            return response.json().then(function (data) {
                if (!response.ok) {
                    throw data;
                }

                return data;
            });
        })
        .then(function (data) {
            showAddedCartItems(data);
            try { refreshCart(); } catch (e) { console.error('refreshCart error:', e); }
            try { openCart(false); } catch (e) { console.error('openCart error:', e); }

            return data;
        });
}

// form add to cart

$(document).on('submit', '.atc-form', function (event) {
    event.preventDefault();
    let form = $(this);

    if (form.closest('.collection-list').length) {
        return;
    }

    let formData = form.serialize();  // 🔥 NOW IT IS CLEAN

    form.find('.btn-atc span').css('visibility', 'hidden');
    form.find('.btn-atc .atc-overlay').css('display', 'flex');

    $.ajax({
        type: 'POST',
        url: '/cart/add.js',
        data: formData,
        dataType: 'json',
        success: function (response) {
            showAddedCartItems(response);
            refreshCart();
            openCart(false);

            form.find('.btn-atc span').css('visibility', 'visible');
            form.find('.btn-atc .atc-overlay').css('display', 'none');
        },
        error: function (xhr, status, error) {
            console.error('Error adding product to cart:', xhr.responseText);
            form.find('.btn-atc span').css('visibility', 'visible');
            form.find('.btn-atc .atc-overlay').css('display', 'none');
        }
    });
});



$(document).off('submit.productAtc').on('submit.productAtc', '.product-atc-form.form', function (event) {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    const form = $(this);

    if (form.data('loading')) return false;
    form.data('loading', true);

    const isNavForm = form.attr('id') === 'header-nav-product-form' || form.closest('.product-variant-selector').length > 0;

    const $btn = form.find('.btn-atc');
    const $btnText = $btn.find('span');
    const $overlay = $btn.find('.atc-overlay');
    const $errorBox = isNavForm
        ? form.closest('.product-variant-selector').find('.main-product-error').first()
        : form.closest('.main-product-form').find('.main-product-error').first();

    let errorMsg = 'Something went wrong. Please try again.';

    if ($errorBox.length) {
        $errorBox.stop(true, true).hide();
    }

    $btnText.css('visibility', 'hidden');
    if ($overlay.length) {
        $overlay.css('display', 'flex');
    }

    let mainId = '';
    let mainQty = 1;

    try {
        if (isNavForm) {
            const $navWrapper = form.closest('.product-variant-selector');

            mainId = form.find('[name="id"]').val() || $navWrapper.find('#main-product-id-nav').val();

            mainQty = parseInt(
                $navWrapper.find('.nav-quantity__input').val() ||
                form.find('[name="quantity"]').val(),
                10
            ) || 1;

            form.find('[name="quantity"]').val(mainQty);
        } else {
            const $mainWrapper = form.closest('.main-product-form');

            mainId =
                form.find('.product-main-id').val() ||
                form.find('.main-product-main-id').val() ||
                form.find('[name="id"]').first().val();

            mainQty = parseInt(
                $mainWrapper.find('.quantity__input[name="quantity"]').first().val() ||
                form.find('[name="quantity"]').first().val(),
                10
            ) || 1;
        }

        if (!mainId) {
            throw { message: 'Variant ID not found.' };
        }
    } catch (err) {
        handleProductAtcError(err);
        return false;
    }

    const payload = {
        items: [
            {
                id: Number(mainId),
                quantity: mainQty
            }
        ]
    };

    console.log('FINAL PAYLOAD:', payload);

    function finalizeProductAtc() {
        if ($overlay.length) {
            $overlay.css('display', 'none');
        }
        $btnText.css('visibility', 'visible');
        form.data('loading', false);
        if (form.closest('[data-product-nav-new]').length) {
            form[0].dispatchEvent(new CustomEvent('nav:cart-settled', { bubbles: true }));
        }
    }

    function handleProductAtcError(err) {
        console.error('ADD TO CART ERROR:', err);
        form.data('loading', false);

        if (err && err.description) {
            errorMsg = err.description;
        } else if (err && err.message) {
            errorMsg = err.message;
        } else if (typeof err === 'string') {
            errorMsg = err;
        }
        if (form.closest('[data-product-nav-new]').length) {
            form.closest('[data-product-nav-new]').find('[data-purchase-error]').text(errorMsg).prop('hidden', false);
        }

        if ($errorBox.length) {
            $errorBox.show();
            $errorBox.find('p').text(errorMsg);

            setTimeout(function () {
                $errorBox.fadeOut();
            }, 60000);
        }
        if (form.closest('[data-product-nav-new]').length) {
            form[0].dispatchEvent(new CustomEvent('nav:cart-error', { bubbles: true }));
        }
    }

    addItemsToCart(payload)
        .then(function (data) {
            if (form.closest('[data-product-nav-new]').length) {
                form[0].dispatchEvent(new CustomEvent('nav:cart-success', { bubbles: true }));
            }
            console.log('SUCCESS:', data);
        })
        .catch(handleProductAtcError)
        .then(finalizeProductAtc, finalizeProductAtc);

    return false;
});

// document.addEventListener('click', function (event) {
//     const button = event.target.closest('.lb-widget-cpal lb-button .lb-button, .lb-widget-cpal .lb-button-host .lb-button');
//     if (!button) return;

//     const card = button.closest('lb-upsell-flat-card');
//     if (!card) return;

//     event.preventDefault();
//     event.stopPropagation();
//     event.stopImmediatePropagation();

//     if (card.dataset.loading === 'true') return;
//     card.dataset.loading = 'true';

//     const buttonHost = button.closest('lb-button') || button.closest('.lb-button-host');
//     const quantityInput = card.querySelector('.lb-qty-count');
//     const variantId =
//         card.getAttribute('lb-variant-id') ||
//         card.dataset.variantId ||
//         (buttonHost && buttonHost.getAttribute('lb-variant-id'));
//     const quantity = Math.max(parseInt(quantityInput && quantityInput.value, 10) || 1, 1);
//     const originalText = button.textContent;

//     if (!variantId) {
//         console.error('Selleasy upsell variant ID not found.');
//         card.dataset.loading = 'false';
//         return;
//     }

//     button.style.pointerEvents = 'none';
//     button.textContent = 'Adding...';

//     addItemsToCart({
//         items: [
//             {
//                 id: Number(variantId),
//                 quantity: quantity
//             }
//         ]
//     })
//         .catch(function (error) {
//             console.error('Selleasy upsell add to cart error:', error);
//         })
//         .finally(function () {
//             button.style.pointerEvents = '';
//             button.textContent = originalText;
//             card.dataset.loading = 'false';
//         });
// }, true);

document.addEventListener('click', function (event) {
  if (
    event.target.closest('.lb-widget-cpal') ||
    event.target.closest('[data-selleasy]') ||
    event.target.closest('.selleasy') ||
    event.target.closest('.se-app')
  ) {
    return; 
  }

  const button = event.target.closest(
    '.lb-widget-cpal, .lb-button, .lb-widget-cpal .lb-button-host .lb-button'
  );
  if (!button) return;
  const card = button.closest('.lb-upsell-flat-card');
  if (!card) return;
  event.preventDefault();
  if (card.dataset.loading === 'true') return;
  card.dataset.loading = 'true';

  const buttonHost = button.closest('.lb-button') || button.closest('.lb-button-host');

  const quantityInput = card.querySelector('.lb-qty-input');
  const variantId =
    card.getAttribute('data-variant-id') ||
    card.dataset.variantId ||
    (buttonHost && buttonHost.getAttribute('data-variant-id'));

  const quantity = Math.max(
    parseInt(quantityInput && quantityInput.value, 10) || 1,
    1
  );

  if (!variantId) {
    console.error('Variant ID not found');
    card.dataset.loading = 'false';
    return;
  }

  const originalText = button.textContent;
  button.style.pointerEvents = 'none';
  button.textContent = 'Adding...';
  fetch('/cart/add.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      items: [
        {
          id: variantId,
          quantity: quantity,
        },
      ],
    }),
  })
    .then((res) => res.json().then((data) => {
      if (!res.ok) {
        throw data;
      }

      return data;
    }))
    .then((data) => {
      showAddedCartItems(data);
      refreshCart();
      button.textContent = 'Added';
      setTimeout(() => {
        button.textContent = originalText;
        button.style.pointerEvents = '';
      }, 1500);
    })
    .catch((err) => {
      console.error('Cart error:', err);
      button.textContent = originalText;
      button.style.pointerEvents = '';
    })
    .finally(() => {
      card.dataset.loading = 'false';
    });
});

// accessory add to cart
$('.accessory-form').on('submit', function (event) {
    event.preventDefault();

    let form = $(this);

    let formData = form.serialize();  // 🔥 NOW IT IS CLEAN

    form.find('.btn-atc span').css('visibility', 'hidden');
    form.find('.btn-atc .atc-overlay').css('display', 'flex');

    $.ajax({
        type: 'POST',
        url: '/cart/add.js',
        data: formData,
        dataType: 'json',
        success: function (response) {
            showAddedCartItems(response);
            refreshCart();
            openCart(false);
            form.find('.btn-atc span').css('visibility', 'visible');
            form.find('.btn-atc .atc-overlay').css('display', 'none');
        },
        error: function (xhr, status, error) {
            console.error('Error adding product to cart:', error);
            form.find('.btn-atc span').css('visibility', 'visible');
            form.find('.btn-atc .atc-overlay').css('display', 'none');
        }
    });
});


// ymal add to cart
$('.ymal-form').on('submit', function (event) {
    event.preventDefault();

    let form = $(this);

    let formData = form.serialize();  // 🔥 NOW IT IS CLEAN

    form.find('.btn-atc span').css('visibility', 'hidden');
    form.find('.btn-atc .atc-overlay').css('display', 'flex');

    $.ajax({
        type: 'POST',
        url: '/cart/add.js',
        data: formData,
        dataType: 'json',
        success: function (response) {
            showAddedCartItems(response);
            refreshCart();
            form.find('.btn-atc span').css('visibility', 'visible');
            form.find('.btn-atc .atc-overlay').css('display', 'none');
        },
        error: function (xhr, status, error) {
            console.error('Error adding product to cart:', error);
            form.find('.btn-atc span').css('visibility', 'visible');
            form.find('.btn-atc .atc-overlay').css('display', 'none');
        }
    });
});

// Cart writes stay locked until prices and discount labels have refreshed.
$(document).on('click', '.product-remove', function (event) {
    event.preventDefault();
    event.stopPropagation();
    if (cartMutationPending || cartNeedsRefresh) return;
    const $item = $(this).closest('.product-cart, .main-cart-item');
    const key = $(this).data('key') || $item.data('key');
    if (key) {
        const $buttons = $item.find('.product-remove');
        $buttons.addClass('is-removing').attr('aria-busy', 'true').prop('disabled', true);
        changeCart('change.js', { id: key, quantity: 0 })
            .catch(showCartError)
            .finally(() => {
                $buttons.removeClass('is-removing').removeAttr('aria-busy').prop('disabled', false);
            });
    }
});

function getInt(val, fallback = 0) {
    const n = parseInt(val, 10);
    return Number.isFinite(n) ? n : fallback;
}

function updateMembershipPoints(cart) {
    const $message = $('[data-membership-points-message]').first();
    if (!$message.length) return;

    const subtotal = cart && typeof cart.items_subtotal_price === 'number' ? cart.items_subtotal_price : 0;
    const rate = Number($message.data('points-rate')) || 1;
    const template = String($message.data('points-template') || 'and earn [points] points on this order now!');
    const points = Math.floor((subtotal / 100) * rate);
    const nextText = template.replace(/\[points\]/g, points);

    $message.find('[data-membership-points-copy]').text(nextText);
}

// ===============================
// Cart UI & Quantity Handling
// ===============================
function updateCartUI(cart) {
    if (!cart) return;

    $('.header .icon-cart .dot')
        .css('display', cart.item_count > 0 ? 'flex' : 'none')
        .text(cart.item_count);

    updateMembershipPoints(cart);
}

function syncQtyUI(key, qty) {
    $(`.qty[data-key="${key}"]`).val(qty);

    const $wrap = $(`.product-quantity[data-key="${key}"]`).first();
    const $input = $wrap.find('.qty');
    const min = getInt($input.attr('min'), 0);
    const maxAttr = getInt($input.attr('max'), NaN);
    const max = Number.isFinite(maxAttr) ? maxAttr : getInt($wrap.data('max'), NaN);

    const atMin = qty <= min;
    const atMax = Number.isFinite(max) ? qty >= max : false;

    $(`.less_qty[data-key="${key}"]`).prop('disabled', atMin).toggleClass('disabled', atMin);
    $(`.add_qty[data-key="${key}"]`).prop('disabled', atMax).toggleClass('disabled', atMax);
}

function updateQty(key, qty) {
    if (cartMutationPending || cartNeedsRefresh) return;
    const previousQty = getInt($(`.qty[data-key="${key}"]`).first().val());
    syncQtyUI(key, qty);
    return changeCart('change.js', { id: key, quantity: qty }, () => syncQtyUI(key, previousQty)).catch(showCartError);
}

function initQtyStates() {
    $('.product-quantity').each(function () {
        const key = $(this).data('key');
        const qty = getInt($(this).find('.qty').val(), 0);
        syncQtyUI(key, qty);
    });
}

// ===============================
// Event Listeners
// ===============================
$(document).ready(initQtyStates);

$(document).on('click', '#popup-cart .less_qty, .main-cart .less_qty', function () {
    if (cartMutationPending) return;
    const $wrap = $(this).closest('.product-quantity');
    const key = $(this).data('key') || $wrap.data('key');
    const $input = $wrap.find('.qty');
    const min = getInt($input.attr('min'), 0);
    let qty = getInt($input.val(), 0);
    if (qty <= min) return;

    qty--;
    updateQty(key, qty);
});

$(document).on('click', '#popup-cart .add_qty, .main-cart .add_qty', function () {
    if (cartMutationPending) return;
    const $wrap = $(this).closest('.product-quantity');
    const key = $(this).data('key') || $wrap.data('key');
    const $input = $wrap.find('.qty');
    const maxAttr = getInt($input.attr('max'), NaN);
    const max = Number.isFinite(maxAttr) ? maxAttr : getInt($(this).data('max') || $wrap.data('max'), NaN);

    let qty = getInt($input.val(), 0);
    if (Number.isFinite(max) && qty >= max) return;

    qty++;
    updateQty(key, qty);
});

// ===============================
// Cart Refresh Functions
// ===============================
let cartMutationPending = false;
let cartRefreshRequest = null;
let cartRefreshVersion = 0;
let cartNeedsRefresh = false;

function cartUrl(path) {
    return ((window.Shopify && window.Shopify.routes && window.Shopify.routes.root) || '/') + path;
}

function setCartBusy(busy) {
    $('#popup-cart, .main-cart').attr('aria-busy', String(busy));
    $('#popup-cart .cart-body, #popup-cart .discount-wrapper, #popup-cart .yml-container, .main-cart .main-cart-data').prop('inert', busy);
    const checkoutBlocked = busy || cartNeedsRefresh;
    $('#popup-cart .cart-checkout, .main-cart .cart-checkout').prop('inert', checkoutBlocked);
    $('#popup-cart .cart-checkout a, .main-cart .cart-checkout a').attr('aria-disabled', String(checkoutBlocked));
}

function showCartError(error) {
    if (cartNeedsRefresh) { showCartRefreshError(error); return; }
    console.error('Cart update failed:', error);
    $('#popup-cart .cart-header, .main-cart .main-cart-data').each(function () {
        $(this).find('.cart-update-error').remove();
        $('<p class="cart-update-error" role="alert">').text('Unable to update your cart. Please try again.').appendTo(this);
    });
    initQtyStates();
}

function showCartRefreshError(error) {
    console.error('Cart display refresh failed:', error);
    $('#popup-cart .cart-header, .main-cart .main-cart-data').each(function () {
        $(this).find('.cart-update-error').remove();
        $('<p class="cart-update-error" role="alert">')
            .text('Your cart could not be refreshed. Your last action may already be saved. Refresh the cart before checking out. ')
            .append($('<button type="button" class="cart-refresh-retry">').text('Refresh cart'))
            .appendTo(this);
    });
}

async function cartRequest(path, body) {
    const response = await fetch(cartUrl(path), {
        method: body ? 'POST' : 'GET',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        credentials: 'same-origin',
        cache: 'no-store',
        ...(body ? { body: JSON.stringify(body) } : {})
    });
    if (!response.ok) throw new Error('Cart request failed: ' + response.status);
    return response.json();
}

async function changeCart(path, body, rollback) {
    if (cartMutationPending) return;
    if (cartNeedsRefresh) return refreshCart().catch(() => {});
    cartMutationPending = true;
    setCartBusy(true);
    $('.cart-update-error').remove();
    try {
        // Invalidate any read already in flight before changing the cart.
        ++cartRefreshVersion;
        const cart = await cartRequest('cart/' + path, body);
        // The write succeeded; a display failure must not report a failed write.
        await refreshCart().catch(() => {});
        return cart;
    } catch (error) {
        // Undo the preview before reading Shopify's actual state.
        if (rollback) rollback();
        await refreshCart().catch(() => {});
        throw error;
    } finally {
        cartMutationPending = false;
        setCartBusy(false);
    }
}

function updateCartItems($target, $source, itemSelector) {
    const $nextItems = $source.children(itemSelector);
    if (!$target.children(itemSelector).length) $target.empty();
    const keys = $nextItems.map(function () { return $(this).attr('data-key'); }).get();
    $target.children(itemSelector).each(function () {
        if (!keys.includes($(this).attr('data-key'))) $(this).remove();
    });
    $nextItems.each(function (index) {
        const $next = $(this);
        const $current = $target.children(itemSelector).filter(function () {
            return $(this).attr('data-key') === $next.attr('data-key');
        }).first();
        const html = this.outerHTML;
        if ($current.length && ($current.data('cart-rendered-html') || $current[0].outerHTML) === html) {
            $current.find('.product-quantity .qty').each(function (index) {
                $(this).val($next.find('.product-quantity .qty').eq(index).val());
            });
            return;
        }
        $next.data('cart-rendered-html', html);
        if ($current.length) {
            $current.replaceWith($next);
        } else {
            const $position = $target.children(itemSelector).eq(index);
            if ($position.length) $position.before($next);
            else $target.append($next);
        }
    });
}

function refreshCart() {
    cartNeedsRefresh = true;
    ++cartRefreshVersion;
    if (cartRefreshRequest) return cartRefreshRequest;
    setCartBusy(true);
    cartRefreshRequest = (async function () {
        let version;
        do {
            version = cartRefreshVersion;
            const mainSectionId = $('.main-cart').attr('data-section-id');
            const popupSectionId = $('#popup-cart').attr('data-section-id') ||
                ($('#popup-cart').closest('.shopify-section').attr('id') || '').replace(/^shopify-section-/, '') || 'popup-cart';
            const sectionIds = [popupSectionId, mainSectionId].filter(Boolean).join(',');
            const sections = await cartRequest('cart?sections=' + encodeURIComponent(sectionIds));
            if (version !== cartRefreshVersion) continue;
            // Validate every fragment before replacing any visible prices.
            // Retry missing sections in their original page context.
            async function getCartFragment(sectionId, selector) {
                function parseFragment(html) {
                    const doc = new DOMParser().parseFromString(html || '', 'text/html');
                    // Returned section scripts must never execute during a display refresh.
                    doc.querySelectorAll('script:not([type="application/json"])').forEach(script => script.remove());
                    return $(doc).find(selector);
                }
                let fragment = parseFragment(sections[sectionId]);
                if (!fragment.length) {
                    const url = new URL(window.location.pathname, window.location.origin);
                    url.searchParams.set('section_id', sectionId);
                    const response = await fetch(url.toString(), { credentials: 'same-origin', cache: 'no-store' });
                    if (!response.ok) throw new Error('Cart section request failed: ' + response.status);
                    fragment = parseFragment(await response.text());
                }
                return fragment;
            }
            const [popup, main] = await Promise.all([
                getCartFragment(popupSectionId, '#popup-cart'),
                mainSectionId ? getCartFragment(mainSectionId, '.main-cart') : Promise.resolve($())
            ]);
            if (version !== cartRefreshVersion) continue;
            if (!popup.length || ($('.main-cart').length && !main.length)) {
                throw new Error('Cart sections could not be rendered');
            }
            const cart = JSON.parse(popup.find('[data-cart-snapshot]').text());
            if (main.length && JSON.stringify(cart) !== JSON.stringify(JSON.parse(main.find('[data-cart-snapshot]').text()))) {
                throw new Error('Cart changed while sections were rendering');
            }
            const selectors = ['.cart-header-title', '.cart-footer'];
            if (!popup.find('.cart-body').length || selectors.some(selector => !popup.find(selector).length) || (main.length && !main.find('.main-cart-data').length)) {
                throw new Error('Cart section content is incomplete');
            }
            const $popup = $('#popup-cart');
            const hasProducts = cart.item_count > 0;
            updateCartItems($popup.find('.cart-body'), popup.find('.cart-body'), '.product-cart');
            selectors.forEach(selector => {
                $popup.find(selector).each(function (index) {
                    const html = popup.find(selector).eq(index).html();
                    if ($(this).html() !== html) $(this).html(html);
                });
            });
            if (main.length) {
                const $main = $('.main-cart');
                if (Boolean($main.find('.main-cart-item').length) !== hasProducts) {
                    $main.find('.main-cart-data').html(main.find('.main-cart-data').html());
                } else if (hasProducts) {
                    updateCartItems($main.find('tbody').first(), main.find('tbody').first(), '.main-cart-item');
                    $main.find('.order-summary').html(main.find('.order-summary').html());
                    $main.find('.total-item').html(main.find('.total-item').html());
                }
            }
            $('#popup-cart, .main-cart').find('.discount-message').hide();
            $('.cart-update-error').remove();
            $popup.find('.cart-checkout, .cart-promotion, .cart-body, .yml-container, .cart-footer').toggle(hasProducts);
            $popup.find('.empty-body').toggle(!hasProducts);
            $popup.find('.cart-checkout a').toggleClass('disabled', !hasProducts);
            updateCartUI(cart);
            initQtyStates();
            document.dispatchEvent(new CustomEvent('cart:updated', { detail: cart }));
            document.dispatchEvent(new CustomEvent('swym:collections-loaded'));
        } while (version !== cartRefreshVersion);
        cartNeedsRefresh = false;
    })().finally(function () {
        cartRefreshRequest = null;
        if (!cartMutationPending) setCartBusy(false);
    });
    // Existing add-to-cart callers do not await refreshCart.
    cartRefreshRequest.catch(showCartRefreshError);
    return cartRefreshRequest;
}

function refreshMainCart() {
    if (!$('.main-cart').length) return Promise.resolve();
    return cartRefreshRequest || refreshCart();
}

$('#popup-cart .overlay').on('click', closeCart);

$(document).on('click', '.cart-refresh-retry', function () {
    refreshCart().catch(() => {});
});

function getDiscountCodes(cart) {
    // Allocations omit shipping and currently ineligible codes. Never rebuild a
    // replacement list from them when Shopify's complete code list is missing.
    if (!Array.isArray(cart.discount_codes)) {
        throw new Error('The current discount codes could not be verified. Please refresh the cart and try again.');
    }
    return [...new Set(cart.discount_codes.map(discount => discount.code.trim().toUpperCase()))];
}

async function updateDiscountCodes(code, remove) {
    if (cartMutationPending) return;
    if (cartNeedsRefresh) return refreshCart().catch(() => {});
    cartMutationPending = true;
    setCartBusy(true);
    $('.discount-message').hide();
    try {
        ++cartRefreshVersion;
        const current = await cartRequest('cart.js');
        const codes = getDiscountCodes(current).filter(value => value !== code.toUpperCase());
        if (!remove) codes.push(code);
        const cart = await cartRequest('cart/update.js', { discount: codes.join(',') });
        const refreshed = await refreshCart().then(() => true, () => false);
        if (!refreshed) return;
        if (!remove && !(cart.discount_codes || []).some(discount => discount.code.toUpperCase() === code.toUpperCase() && discount.applicable === true)) {
            $('.discount-message').show();
        }
    } catch (error) {
        await refreshCart().catch(() => {});
        showCartError(error);
    } finally {
        cartMutationPending = false;
        setCartBusy(false);
    }
}

function applyDiscountCode(scopeSelector) {
    const code = $(scopeSelector).find('.discount-form input').val().trim();
    if (code) return updateDiscountCodes(code, false);
}

$(document).on('click', '#popup-cart .discount-form button, .main-cart .discount-form button', function(event) {
    event.preventDefault();

    const scopeSelector = $(this).closest('#popup-cart').length ? '#popup-cart' : '.main-cart';
    applyDiscountCode(scopeSelector);
});

$(document).on('keydown', '#popup-cart .discount-form input, .main-cart .discount-form input', function(event) {
    if (event.key !== 'Enter') {
        return;
    }

    event.preventDefault();

    const scopeSelector = $(this).closest('#popup-cart').length ? '#popup-cart' : '.main-cart';
    applyDiscountCode(scopeSelector);
});

// remove discount in popup
$(document).on('click', '#popup-cart .remove-discount', function() {
    if (cartMutationPending) return;
    $('#popup-cart .discount-form input').val('');

    removeDiscount($(this).data('code'));
});

// remove discount in main
$(document).on('click', '.main-cart .remove-discount', function() {
    if (cartMutationPending) return;
    $('.main-cart .discount-form input').val('');

    removeDiscount($(this).data('code'));
});

$(document).on('click', '#popup-cart .cart-checkout a, .main-cart .cart-checkout a', function(event) {
    if (cartMutationPending || cartRefreshRequest || cartNeedsRefresh) { event.preventDefault(); return; }
    if ($(this).closest('#popup-cart').length) return;
    event.preventDefault();
    let note = $(document).find('[name="order-note"]').val() || '';

    if (note != '') {
        fetch('/cart/update.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                note: note
            }),
        })
        .then(response => {
            if (response.ok) {
                window.location.href = '/checkout';
            }
        })
        .catch(error => {
            console.error('Error updating cart note:', error);
        });
    }
    else {
        window.location.href = '/checkout';
    }
});

function removeDiscount(code) {
    return updateDiscountCodes(String(code), true);
}


$('.ymal-variant').on('change', function() {
    let ymal = $(this).data('ymal');

    let selectedValue = $(this).val();
    let $form = $(`form#${ymal}`);
    $form.find('input[name="id"]').val(selectedValue);
});

//custom collection add to cart {
$(document).on('submit', '.collection-list .atc-form', function (event) {
    event.preventDefault();
    let formData = $(this).serialize();

    $.ajax({
        type: 'POST',
        url: '/cart/add.js',
        data: formData,
        dataType: 'json',
        success: function (response) {
            showAddedCartItems(response);
            refreshCart();
            openCart(false);
        },
        error: function (xhr, status, error) {
            console.error('Error adding product to cart:', error);
        }
    });
});



