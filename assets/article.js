$(document).ready(function () {
    console.log('ARTICLE JS');
    
    const $header = $('.shopify-section-group-header-group .header');
    const headerHeight = $header.outerHeight();
    $('.main-article-section .sticky-article-tag').css('top', headerHeight + 30);
    
    $(window).on('load resize', function () {
        const $header = $('.shopify-section-group-header-group .header');
        if ($header.length) {
            const headerHeight = $header.outerHeight();
            $('.main-article-section .sticky-article-tag').css('top', headerHeight + 30);
        }
    });

    if ($('.main-article-section').length) {
        const $section = $('.main-article-nav');
        const $nav = $section.find('.mobile-toc-nav');
        const $inner = $nav.find('.inner-section');
        const $overlay = $nav.find('.overlay');

        // ✅ Open panel
        $('.nav-hover-toc').on('click', function() {
            $nav.addClass('open');
            $('body').addClass('overflow-hidden');
        });

        // ✅ Close panel (slide right → left with fade)
        $('.btn-close-toc, .mobile-toc-nav .overlay').on('click', function() {
            $('body').removeClass('overflow-hidden');
            // trigger slide + fade before removing open
            $inner.css({
                transform: 'translateX(-100%)',
                opacity: '0'
            });
            $overlay.css({ opacity: '0' });
            $nav.css({ opacity: '0' });

            // wait for transition to finish, THEN remove open
            setTimeout(() => {
                $nav.removeClass('open');
                $inner.removeAttr('style');
                $overlay.removeAttr('style');
                $nav.removeAttr('style');
            }, 700); // same as transition duration
        });
    }
        
    if ($('.article-recommendation-section').length) {
        $('.article-recommendation-section').each(function() {
            const $section = $(this);

            const sliderEl = $section.find('.article-recommendation-slider')[0];
            if (!sliderEl) return;

            const nextEl = $section.find('.float-nav .owl-next')[0];
            const prevEl = $section.find('.float-nav .owl-prev')[0];
            const paginationEl = $section.find('.swiper-pagination')[0];

            const swiperOptions = {
                slidesPerView: 3,
                spaceBetween: 15,
                allowTouchMove: true,
                centeredSlides: false,
                loop: false,
                pagination: {
                    el: paginationEl,
                    clickable: true,
                },
                breakpoints: {
                    1524: {
                        slidesPerView: 3,
                        centeredSlides: false,
                    },
                    1024: {
                        slidesPerView: 3,
                        centeredSlides: false,
                    },
                    768: {
                        slidesPerView: 2,
                        centeredSlides: false,
                    },
                    0: {
                        slidesPerView: 1.1,
                        centeredSlides: true,
                    },
                },
            };

            if (nextEl && prevEl) {
                swiperOptions.navigation = {
                    nextEl,
                    prevEl,
                };
            }

            new Swiper(sliderEl, swiperOptions);
        });
    }

    if ($('.featured-product').length) {
        $('.featured-product').each(function() {
            const $section = $(this);

            const sliderEl = $section.find('.featured-product-slider')[0];
            if (!sliderEl) return;

            const nextEl = $section.find('.float-nav .owl-next')[0];
            const prevEl = $section.find('.float-nav .owl-prev')[0];
            const paginationEl = $section.find('.swiper-pagination')[0];

            const swiperOptions = {
                slidesPerView: 2,
                spaceBetween: 12,
                allowTouchMove: true,
                centeredSlides: false,
                loop: false,
                pagination: {
                    el: paginationEl,
                    clickable: true,
                },
            };

            if (nextEl && prevEl) {
                swiperOptions.navigation = {
                    nextEl,
                    prevEl,
                };
            }

            new Swiper(sliderEl, swiperOptions);
        });
    }

    
// ==========================
// Load product HTML for each article
// ==========================
$('.article-content .product-article').each(function() {
    var productHandle = $(this).attr('product-handle'); 
    var $productArticle = $(this); 
    
    $.ajax({
        url: `/products/${productHandle}`, 
        method: 'GET',
        dataType: 'html',
        success: function (response) {

            // Convert HTML string to DOM
            let htmlDoc = $('<div>').html(response);

            // Find the product HTML block
            let templateHTML = htmlDoc.find('#productArticleHTML').html();

            // Insert into article page
            $productArticle.html(templateHTML);
            setTimeout(() => {
                // Dispatch custom event
                document.dispatchEvent(new CustomEvent("swym:collections-loaded"));
            }, 300);
            
        },
        error: function (err) {
            console.error("Failed loading product page:", err);
        }
    });
});

// ==========================
// Handle variant selection
// ==========================
$(document).on('click', '.variants-selector.color', function() {
    if ($(this).hasClass('disabled')) return;

    const $group = $(this).closest('.select-variant');
    const productId = $group.data('product-id');
    const optionType = $(this).data('option-type');

    // Remove selected from other swatches
    $group.find('.variants-selector.color').removeClass('selected');

    // Add selected to clicked swatch
    $(this).addClass('selected');

    // Update hidden input
    $group.find('input.variant-radio[value="' + $(this).data('variant-value') + '"]')
          .prop('checked', true)
          .trigger('change');

    const productJson = window.productDataMap?.[productId];
    if (!productJson) return;

    // Collect selected options
    const selectedOptions = [];
    $group.find('input.variant-radio:checked, .variant-option-select').each(function() {
        selectedOptions.push($(this).val());
    });

    const matchedVariant = productJson.variants.find(v => JSON.stringify(v.options) === JSON.stringify(selectedOptions));
    if (!matchedVariant) return;

    // Update main image
    const $images = $group.closest('.product-article').find('.product-image img');
    $images.removeClass('active');

    const $newImage = $images.filter(function() {
        const variants = $(this).data('variant')?.toString().split(',') || [];
        return variants.includes(matchedVariant.id.toString());
    });

    if ($newImage.length) $newImage.addClass('active');

    // Update Add-to-Cart & prices
    updateVariant($group, productId);
});


// ==========================
// Update variant, price & image
// ==========================
function updateVariant($group, productId) {
    // Collect all selected option values
    const selectedOptions = [];
    $group.find('input.variant-radio:checked, .variant-option-select').each(function () {
        selectedOptions.push($(this).val());
    });

    const productJson = window.productDataMap?.[productId];
    if (!productJson) {
        console.warn("Missing product JSON for", productId);
        return;
    }

    // Find matching variant
    const matchedVariant = productJson.variants.find(v => JSON.stringify(v.options) === JSON.stringify(selectedOptions));
    if (!matchedVariant) return;

    // Update hidden field
    $('#product-form-' + productId).find('.product-main-id').val(matchedVariant.id);

    // Update Add-to-Cart button
    const $btn = $('#product-form-' + productId).find('.btn-atc');
    const $btn_icon = $('#product-form-' + productId).find('.icon-atc');

    if (!matchedVariant.available) {
        $btn.prop('disabled', true).addClass('sold').find('span').text('Sold');
        $btn_icon.hide();
    } else {
        $btn.prop('disabled', false).removeClass('sold').find('span').text('Add');
        $btn_icon.show();
    }

    // ---- Update prices dynamically ----
    const $priceContainer = $group.closest('.product-article').find('.price-container');
    if ($priceContainer.length) {
        $priceContainer.find('.text-sale-price .money').each(function () {
            $(this).text(formatMoney(matchedVariant.price));
        });

        if (matchedVariant.compare_at_price && matchedVariant.compare_at_price > matchedVariant.price) {
            $priceContainer.find('.text-compare-price .money').each(function () {
                $(this).text(formatMoney(matchedVariant.compare_at_price));
            });
            $priceContainer.find('.text-compare-price').show();
        } else {
            $priceContainer.find('.text-compare-price').hide();
        }
    }

    // ---- Update product image ----
    const $images = $group.closest('.product-article').find('.product-image img');
    $images.removeClass('active');
    const $newImage = $images.filter('[data-variant="' + matchedVariant.id + '"]');
    if ($newImage.length) $newImage.addClass('active');
}

// ==========================
// Format money helper
// ==========================
function formatMoney(cents, format) {
    if (typeof cents === 'string') cents = cents.replace('.', '');
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = format || this.money_format || "{{amount}}";

    function defaultOption(opt, def) { return (typeof opt === 'undefined' ? def : opt); }
    function formatWithDelimiters(number, precision, thousands, decimal) {
        precision = defaultOption(precision, 2);
        thousands = defaultOption(thousands, ',');
        decimal   = defaultOption(decimal, '.');
        if (isNaN(number) || number == null) return 0;
        number = (number / 100.0).toFixed(precision);
        var parts = number.split('.');
        var dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
        var cents = parts[1] ? (decimal + parts[1]) : '';
        return dollars + cents;
    }

    var match = formatString.match(placeholderRegex);
    if (!match) {
        console.warn("Invalid money format:", formatString);
        return formatWithDelimiters(cents, 2);
    }

    let value;
    switch (match[1]) {
        case 'amount': value = formatWithDelimiters(cents, 2); break;
        case 'amount_no_decimals': value = formatWithDelimiters(cents, 0); break;
        case 'amount_with_comma_separator': value = formatWithDelimiters(cents, 2, '.', ','); break;
        case 'amount_no_decimals_with_comma_separator': value = formatWithDelimiters(cents, 0, '.', ','); break;
        default: value = formatWithDelimiters(cents, 2); break;
    }

    return formatString.replace(placeholderRegex, value);
}

    
    
        
    if ($('.ambassador-profile-information-display-section').length) {
        function getAmbassadorModal($trigger) {
            var $sectionRoot = $trigger.closest('.shopify-section');
            var $modal = $sectionRoot.find('.mansonry-slider.popup-modal').first();

            if (!$modal.length) {
                $modal = $('.ambassador-profile-information-display-section .mansonry-slider.popup-modal').first();
            }

            if (!$modal.length) {
                $modal = $('.mansonry-slider.popup-modal').first();
            }

            return $modal;
        }

        function pauseAmbassadorModalVideos($modal) {
            $modal.find('video').each(function () {
                this.pause();
                this.currentTime = 0;
            });
        }
        
        $('.ambassador-profile-information-display-section .ambassador-profile-section').each(function () {
            var $section = $(this);
            var $slider = $section.find('.masonry-swiper');
            var $sliderMobile = $section.find('.gallery-mobile-slider');
            var $mobileNext = $section.find('.gallery-mobile-slider .float-nav .owl-next');
            var $mobilePrev = $section.find('.gallery-mobile-slider .float-nav .owl-prev');
            var $mobilePagination = $section.find('.gallery-mobile-slider .swiper-pagination');

            if ($slider.length) {
                new Swiper($slider[0], {
                    slidesPerView: 1,
                    spaceBetween: 10,
                    loop: false,
                    pagination: {
                        el: $section.find('.swiper-pagination-mansonry')[0],
                        clickable: true,
                    },
                });
            }

            if ($sliderMobile.length) {
                new Swiper($sliderMobile[0], {
                    slidesPerView: 1.1,
                    spaceBetween: 14,
                    centeredSlides: true,
                    loop: false,
                    observer: true,
                    observeParents: true,
                    navigation: {
                        nextEl: $mobileNext[0],
                        prevEl: $mobilePrev[0],
                    },
                    pagination: {
                        el: $mobilePagination[0],
                        clickable: true,
                    },
                });
            }

        });

        
        // Store all modal swiper instances
        let modalSwipers = [];

        // Initialize modal sliders
        $('.mansonry-slider.popup-modal').each(function (index) {

            var $section = $(this);
            var $slider = $section.find('.ambassador-gallery-modal-slider');
            var $pagination = $section.find('.swiper-pagination');

            let modalSwiper = new Swiper($slider[0], {
                slidesPerView: 1,
                spaceBetween: 10,
                loop: false,
                navigation: {
                    nextEl: $section.find('.float-nav .owl-next')[0],
                    prevEl: $section.find('.float-nav .owl-prev')[0],
                },
                pagination: {
                    el: $pagination[0],
                    clickable: true,
                },
                on: {
                    slideChange: function () {
                        pauseAmbassadorModalVideos($section);
                    },
                },
            });

            // Save each swiper instance by index
            modalSwipers[index] = modalSwiper;
        });

        $('.ambassador-profile-information-display-section').on('click', '.masonry-item, .gallery-mobile-slider .gallery-item', function (event) {
            event.preventDefault();

            var slideNumber = Number($(this).data('slide-item'));
            var indexToGo = Math.max(slideNumber - 1, 0);
            var $modal = getAmbassadorModal($(this));

            $modal.addClass('open');
            $('body').addClass('no-scroll');

            if (modalSwipers[0]) {
                modalSwipers[0].update();
                modalSwipers[0].slideTo(indexToGo, 0);
            }
        });

        $('.ambassador-profile-information-display-section').on('click', '.masonry-item .media-link, .gallery-mobile-slider .gallery-item .media-link', function (event) {
            event.preventDefault();
            event.stopPropagation();
            $(this).closest('.masonry-item, .gallery-item').trigger('click');
        });

        $('.ambassador-profile-information-display-section').on('click', '.mansonry-slider.popup-modal .popup-close, .mansonry-slider.popup-modal .popup-overlay', function () {
            pauseAmbassadorModalVideos($(this).closest('.mansonry-slider.popup-modal'));
        });

    }

});

