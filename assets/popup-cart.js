$(document).ready(function () {
    let urlParams = new URLSearchParams(window.location.search);
    const shouldOpenCartOnLoad = urlParams.get('cart') === 'open';

    if ($('.main-cart').length) {
        refreshMainCart();
    }

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
    $('#popup-cart').css('display', 'flex').hide().fadeIn();
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
            try { refreshCart(); } catch (e) { console.error('refreshCart error:', e); }
            try { refreshMainCart(); } catch (e) { console.error('refreshMainCart error:', e); }
            try { openCart(false); } catch (e) { console.error('openCart error:', e); }

            return data;
        });
}

// form add to cart

$(document).on('submit', '.atc-form', function (event) {
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
            refreshCart();
            refreshMainCart();
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
    }

    function handleProductAtcError(err) {
        console.error('ADD TO CART ERROR:', err);

        if (err && err.description) {
            errorMsg = err.description;
        } else if (err && err.message) {
            errorMsg = err.message;
        } else if (typeof err === 'string') {
            errorMsg = err;
        }

        if ($errorBox.length) {
            $errorBox.show();
            $errorBox.find('p').text(errorMsg);

            setTimeout(function () {
                $errorBox.fadeOut();
            }, 60000);
        }
    }

    addItemsToCart(payload)
        .then(function (data) {
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
    .then((res) => res.json())
    .then((data) => {
      document.dispatchEvent(new CustomEvent('cart:updated', { detail: data }));
      document.dispatchEvent(new Event('cart:refresh'));
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
            refreshCart();
            refreshMainCart();
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
            refreshCart();
            refreshMainCart();
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

// Remove item from cart
$(document).on('click', '.product-remove', function (event) {
    event.preventDefault();

    const $item = $(this).closest('.product-cart, .main-cart-item');
    const key = $(this).data('key') || $item.data('key');

    if (!key) {
        console.error('Missing cart item key');
        return;
    }

    $('.main-cart .el-overlay, #popup-cart .el-overlay').show();

    // Optimistic UI (instant feedback)
    $item.slideUp(150);

    $.ajax({
        type: 'POST',
        url: '/cart/change.js',
        dataType: 'json',
        data: {
            id: key,
            quantity: 0
        }
    })
    .done(function (cart) {
        updateCartUI(cart); // your existing refresh logic
        
        refreshCart();
        refreshMainCart();
    })
    .fail(function (xhr) {
        console.error('Cart remove failed:', xhr.responseText);
        $item.show(); // rollback UI if needed
    })
    .always(function () {
        $('.main-cart .el-overlay, #popup-cart .el-overlay').hide();
    });
});


// ===============================
// Utils
// ===============================
function getInt(val, fallback = 0) {
    const n = parseInt(val, 10);
    return Number.isFinite(n) ? n : fallback;
}

function formatMoney(cents) {
    if (window.Shopify && typeof Shopify.formatMoney === 'function') {
        return Shopify.formatMoney(cents);
    }
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: window.Shopify && window.Shopify.currency && window.Shopify.currency.active || 'USD'
    }).format(cents / 100);
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
    $('.header .icon-cart .dot')
        .css('display', cart.item_count > 0 ? 'flex' : 'none')
        .text(cart.item_count);

    $('.cart-total-price .cart-total-less span, .total-price').text(formatMoney(cart.total_price));
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

let qtyTimer = null;
let qtyTimerV2 = null;

function updateQty(key, qty) {
    clearTimeout(qtyTimer);
    clearTimeout(qtyTimerV2);
    qtyTimer = setTimeout(() => {
            $.ajax({
            type: 'POST',
            url: '/cart/update.js',
            dataType: 'json',
            data: { updates: { [key]: qty } },
            success: function (cart) {
                updateCartUI(cart);
                document.dispatchEvent(new CustomEvent('cart:updated', { detail: cart }));
                
                qtyTimerV2 = setTimeout(() => {
                    refreshCart();
                    refreshMainCart();
                }, 300);
                
            },
            error: function (xhr) {
                console.error('Cart update error', xhr);
                document.dispatchEvent(new CustomEvent('cart:updated'));

            }
            });
    }, 400);
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
    const $wrap = $(this).closest('.product-quantity');
    const key = $(this).data('key') || $wrap.data('key');
    const $input = $wrap.find('.qty');
    const min = getInt($input.attr('min'), 0);
    let qty = getInt($input.val(), 0);
    if (qty <= min) return;

    qty--;
    syncQtyUI(key, qty);
    updateQty(key, qty);
});

$(document).on('click', '#popup-cart .add_qty, .main-cart .add_qty', function () {
    const $wrap = $(this).closest('.product-quantity');
    const key = $(this).data('key') || $wrap.data('key');
    const $input = $wrap.find('.qty');
    const maxAttr = getInt($input.attr('max'), NaN);
    const max = Number.isFinite(maxAttr) ? maxAttr : getInt($(this).data('max') || $wrap.data('max'), NaN);

    let qty = getInt($input.val(), 0);
    if (Number.isFinite(max) && qty >= max) return;

    qty++;
    syncQtyUI(key, qty);
    updateQty(key, qty);
});

// ===============================
// Cart Refresh Functions
// ===============================
function refreshCart() {
    const $popup = $('#popup-cart');
    $popup.find('.el-overlay').show();

    $.ajax({
        type: 'GET',
        url: `${window.location.pathname}?section_id=popup-cart`,
        dataType: 'html',
        success: function (cartHtml) {
            const $html = $(cartHtml);
            const $popupSource = $html.filter('#popup-cart').add($html.find('#popup-cart')).first();

            if (!$popupSource.length) {
                $popup.find('.el-overlay').hide();
                return;
            }

            $popup.find('.cart-body').html($popupSource.find('.cart-body').html());
            $popup.find('.cart-header').html($popupSource.find('.cart-header').html());
            $popup.find('.cart-footer').html($popupSource.find('.cart-footer').html());
            $popup.find('.cart-checkout').html($popupSource.find('.cart-checkout').html());
            $popup.find('.discount-code-wrapper').html($popupSource.find('.discount-code-wrapper').html());
            $popup.find('.yml-container').html($popupSource.find('.yml-container').html());
            $popup.find('.empty-body').html($popupSource.find('.empty-body').html());

            const $cartIconSource = $html.find('.nav-icon.icon-cart, .header .icon-cart').first();
            if ($cartIconSource.length) {
                const $cartIconTarget = $('.nav-icon.icon-cart, .header .icon-cart').first();
                if ($cartIconTarget.length) {
                    $cartIconTarget.html($cartIconSource.html());
                }
            }

            const hasProducts = $popup.find('.cart-body .product-cart').length > 0;
            const sections = '.cart-checkout, .cart-promotion, .cart-body, .yml-container, .cart-footer';
            $popup.find(sections).toggle(hasProducts);
            $popup.find('.empty-body').toggle(!hasProducts);
            $popup.find('.cart-checkout a').toggleClass('disabled', !hasProducts);

            $popup.find('.el-overlay').hide();
            initQtyStates();
            
            document.dispatchEvent(new CustomEvent('swym:collections-loaded'));

        },
        error: function () {
        $popup.find('.el-overlay').hide();
        }
    });
}

function refreshMainCart() {
    const $main = $('.main-cart');
    if (!$main.length) return;

    $main.find('.el-overlay').show();
    $.ajax({
        type: 'GET',
        url: '/cart?section_id=main-cart',
        dataType: 'html',
        success: function (html) {
            const $html = $(html);
            const $mainSource = $html.filter('.main-cart').add($html.find('.main-cart')).first();

            if ($mainSource.length) {
                $main.find('.main-cart-data').html($mainSource.find('.main-cart-data').html());
                initQtyStates();
                document.dispatchEvent(new CustomEvent('swym:collections-loaded'));
            }

            $main.find('.el-overlay').hide();
        },
        error: function () {
            $main.find('.el-overlay').hide();
        }
    });
}



// close if away
$('#popup-cart .overlay').on('click', function () {
    closeCart();
});

function getAppliedDiscountTitles(cartData) {
    const itemDiscounts = (cartData.items || [])
        .flatMap(item => (item.discounts || []).map(discount => discount.title));
    const cartDiscounts = (cartData.cart_level_discount_applications || [])
        .map(discount => discount.title);

    return [...itemDiscounts, ...cartDiscounts]
        .filter(title => title)
        .map(title => title.toLowerCase());
}

function applyDiscountCode(scopeSelector) {
    const $scope = $(scopeSelector);
    const code = $scope.find('.discount-form input').val().trim();

    if (!code) {
        return;
    }

    $scope.find('.el-overlay').show();
    $scope.find('.discount-wrapper .discount-message').hide();

    const discountApplyUrl = `${window.location.origin}/discount/${encodeURIComponent(code)}?redirect=/cart/`;

    fetch(discountApplyUrl, {
        method: 'GET',
        credentials: 'include'
    })
        .then(() => fetch(`${window.location.origin}/cart.json`, {
            method: 'GET',
            credentials: 'include',
            cache: 'no-store'
        }))
        .then(response => response.json())
        .then(cartData => {
            const discountTitles = getAppliedDiscountTitles(cartData);

            if (discountTitles.includes(code.toLowerCase())) {
                refreshCart();
                refreshMainCart();
                return;
            }

            $scope.find('.discount-wrapper .discount-message').show();
            $scope.find('.el-overlay').hide();
        })
        .catch(() => {
            $scope.find('.discount-wrapper .discount-message').show();
            $scope.find('.el-overlay').hide();
        });
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
    $('#popup-cart .el-overlay').show();
    $('#popup-cart .discount-form input').val('');

    removeDiscount($(this).data('code'));
});

// remove discount in main
$(document).on('click', '.main-cart .remove-discount', function() {
    $('.main-cart .el-overlay').show();
    $('.main-cart .discount-form input').val('');

    removeDiscount($(this).data('code'));
});

$(document).on('click', '.main-cart .cart-checkout a', function() {
    let note = $(document).find('[name="order-note"]').val();

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
    const discountToRemove = code

    fetch(`${window.location.origin}/cart.json`, {
        credentials: 'include',
        cache: 'no-store'
    })
        .then(response => response.json())
        .then(cartData => {
            let discountTitles = getAppliedDiscountTitles(cartData)
                .map(title => title.toUpperCase());

            let remainingDiscounts = discountTitles.filter(title => title !== discountToRemove.toUpperCase());

            if (remainingDiscounts.length > 0) {
                remainingDiscounts.forEach(discount => {
                    fetch(`${window.location.origin}/checkout?discount=${encodeURIComponent(discount)}`)
                        .then(function() {
                            refreshCart();
                            refreshMainCart();
                        }, function() {
                            refreshCart();
                            refreshMainCart();
                        });
                });
            } else {
                fetch(`${window.location.origin}/checkout?discount=CLEAR`).then(function() {
                    refreshCart();
                    refreshMainCart();
                }, function() {
                    refreshCart();
                    refreshMainCart();
                });
            }
        })
        .catch(error => console.error("Error fetching cart:", error));
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
            refreshCart();
            refreshMainCart();
            openCart(false);
        },
        error: function (xhr, status, error) {
            console.error('Error adding product to cart:', error);
        }
    });
});



