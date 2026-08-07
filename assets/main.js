/* Header Height ----------------------------- */
hAnnouncementbarDynamic = $('.shopify-section-group-header-group .header').outerHeight();
$('body').css('padding-top', `${ hAnnouncementbarDynamic }px`);
$('.predictive-search .wrapper').css('margin-top', `${ $('.shopify-section-group-header-group .header .announcement-bar').outerHeight() + 2 }px`);
    
// ANNOUNCEMENT BAR ------------------------------------------>
if ($('.announcement-bar').length) {

    $('.announcement-swiper').each(function () {

        let autoplaySeconds = $(this).data('autoplay');
        let autoplayEnabled = autoplaySeconds > 0;

        let container = this;
        let fixedSlideHeight = 0;

        let swiper = new Swiper(container, {
            direction: 'vertical',
            loop: true,
            speed: 400,
            autoHeight: false, 

            autoplay: autoplayEnabled ? {
                delay: autoplaySeconds * 1000,
                disableOnInteraction: false
            } : false,

            navigation: {
                nextEl: '.announcement-next',
                prevEl: '.announcement-prev',
            },

            on: {
                init: function () {
                    applyFixedSlideHeight(this);
                },
                slideChangeTransitionEnd: function () {
                    applyFixedSlideHeight(this);
                }
            }
        });

        function getMaxSlideHeight(swiperInstance) {
            let maxHeight = 0;

            swiperInstance.slides.forEach(function (slide) {
                let content = slide.querySelector('.announcement-content');
                if (!content) return;
                maxHeight = Math.max(maxHeight, Math.ceil(content.scrollHeight));
            });

            return maxHeight;
        }

        function applyFixedSlideHeight(swiperInstance) {
            if (!fixedSlideHeight) {
                fixedSlideHeight = getMaxSlideHeight(swiperInstance);
            }
            if (!fixedSlideHeight) return;

            swiperInstance.slides.forEach(function (slide) {
                slide.style.height = fixedSlideHeight + 'px';
            });

            container.style.height = fixedSlideHeight + 'px';
            container.querySelector('.swiper-wrapper').style.height = fixedSlideHeight + 'px';

            // 🔥 Add your dynamic header update here
            setTimeout(function () {
                let hAnnouncementbarDynamic = $('.shopify-section-group-header-group .header').outerHeight();

                // Update header padding
                $('body').css('padding-top', `${hAnnouncementbarDynamic}px`);

                // Update predictive search offset
                $('.predictive-search .wrapper').css(
                    'margin-top',
                    `${$('.shopify-section-group-header-group .header .announcement-bar').outerHeight() + 2}px`
                );
            }, 150); // short delay for height update
        }

        // Recalculate fixed height when viewport changes to avoid wrap-induced jumps.
        $(window).on('resize', function () {
            fixedSlideHeight = 0;
            applyFixedSlideHeight(swiper);
        });

    });

  
    if ($('.announcement-bar .countdown-bar').length) {
        // Get the target date from the .countdown-bar element
        var targetDate = new Date($('.countdown-bar').data('set-date')).getTime();
        
        // Update the countdown every 1 second
        var countdownInterval = setInterval(function() {
            var now = new Date().getTime();
            var timeDifference = targetDate - now;
        
            var days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            var hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
        
            // Add leading zeros
            days = days < 10 ? '0' + days : days;
            hours = hours < 10 ? '0' + hours : hours;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;
        
            // Update DOM
            $('.data-day').text(days);
            $('.data-hours').text(hours);
            $('.data-minutes').text(minutes);
            $('.data-seconds').text(seconds);
        
            // Stop the timer if the date is in the past
            if (timeDifference < 0) {
                clearInterval(countdownInterval);
                $('.data-day, .data-hours, .data-minutes, .data-seconds').text('00');
                $('.announcement-bar .countdown-bar').hide();
            }
        }, 1000);

    }
  
    $('.predictive-search .wrapper').css('margin-top', `${ $('.shopify-section-group-header-group .header .announcement-bar').outerHeight() + 2 }px`);
    
}
if ($('.header .header-wrapper').length) {
    
    $('.header .nav-item').on('mouseover', function() {

        $('.header .nav-items').find('.underline').css('width', '0');
        $(this).find('.underline').css('width', '100%');

        let $this = $(this);
        let dropValue = $this.data('drop');

        $('.header .nav-item i').css('transform', 'scale(1)');
        $this.find('i').css('transform', 'scale(-1)');

        $('.header .drop .item i').css('transform', 'scale(1)');
        
        $('.drop').hide();
        
        if (dropValue !== undefined) {
            let $drop = $('.drop[data-drop="' + dropValue + '"]');
            $drop.show();

            let navItemOffset = $this.offset();
            let navItemWidth = $this.outerWidth();
            let dropWidth = $drop.outerWidth();
            
            let leftPosition = navItemOffset.left + (navItemWidth / 2) - (dropWidth / 2);

            $drop.css({
                'left': leftPosition
            });
        }

    });

    let isMouseOverDrop = false;

    $('.header .nav-items').on('mouseleave', function(event) {

        let $navItems = $(this);
        let navItemsOffset = $navItems.offset();
        let navItemsWidth = $navItems.outerWidth();
        let navItemsHeight = $navItems.outerHeight();
        let buffer = 30;

        let extendedLeft = navItemsOffset.left - buffer;
        let extendedRight = navItemsOffset.left + navItemsWidth + buffer;
        let extendedTop = navItemsOffset.top - buffer;
        let extendedBottom = navItemsOffset.top + navItemsHeight + buffer;

        $(document).on('mousemove.navItemsCheck', function(event) {
            let mouseX = event.pageX;
            let mouseY = event.pageY;

            if (mouseX < extendedLeft || mouseX > extendedRight || mouseY < extendedTop || mouseY > extendedBottom) {
                if (!isMouseOverDrop) {
                    $('.drop').hide();
                    $('.header .nav-item i').css('transform', 'scale(1)');
                    $('.header .nav-items').find('.underline').css('width', '0');
                }
            }
        });
    });

    $('.header .nav-items').on('mouseenter', function() {
        $(document).off('mousemove.navItemsCheck');
    });

    $('.drop1').on('mouseenter', function() {
        isMouseOverDrop = true;
    });

    $('.drop1').on('mouseleave', function() {
        isMouseOverDrop = false;
        $('.header .nav-items').trigger('mouseleave');
    });

    $('.mega-nav').on('click', function() {
        $(this).addClass('active').siblings().removeClass('active');
        $('.mega-tab').hide();

        let tab = $(this).data('tab');

        $(`.mega-tab[data-tab="${tab}"]`).css('display', 'flex').hide().fadeIn();
    });

    $('.icon-search').on('click', function() {
        $('.predictive-search').fadeIn();
    });

    $('.predictive-search .overlay').on('click', function() {
        $('.predictive-search').fadeOut();
        $('.predictive-search input').val('');
    });

    $('.predictive-search .icon-close').on('click', function() {
        $('.predictive-search').fadeOut();
        $('.predictive-search input').val('');
    });

    $(document).on('click', '#predictive-search .view-all', function() {
        $('predictive-search form').trigger('submit');
    });

    $('.header .nav-toggle').on('click', function() {
        $(this).toggleClass('active');
        $('inbox-online-store-chat').toggleClass('extra');
        if ($('body').hasClass('menu-open')) {
            $('body').removeClass('menu-open');
            $('body').css('overflow-y', 'visible');
        }
        else {
            $('body').addClass('menu-open');
            $('body').css('overflow-y', 'hidden');
        }
    });
    $('.header .nav-mobile .btn-mav-close').on('click', function(){
        $('body').removeClass('menu-open');
        $('body').css('overflow-y', 'visible');
        $('inbox-online-store-chat').removeClass('extra');
        $('.nav-mobile .main-nav-content .inner-nav-content').removeAttr('style');
    });

    $('.nav-mobile a[data-mega]').on('click', function() {
        let mega = $(this).data('mega');
        $(`.mega-mobile[data-mega="${mega}"]`).addClass('show');
        $('.nav-mobile .main-nav-content .inner-nav-content').css('overflow','hidden');
    });
    
    $('.nav-mobile button[data-mega]').on('click', function() {
        let mega = $(this).data('mega');
        $(`.mega-mobile[data-mega="${mega}"]`).addClass('show');
        $('.nav-mobile .main-nav-content .inner-nav-content').css('overflow','hidden');
    });

    $('.nav-mobile .mega-title').on('click', function() {
        $('.mega-mobile[data-mega]').removeClass('show');
        $('.nav-mobile .main-nav-content .inner-nav-content').removeAttr('style');
    });

    $(document).on('click', '.nav-mobile .accordion-button', function (e) {
        const $target = $(e.target);

        if ($target.is('a')) {
            const href = $target.attr('href');
            
            window.location.href = href;

            e.preventDefault();
            e.stopImmediatePropagation();
            return false;
        }

        const $button = $(this);
        const target = $button.attr('data-bs-target');
        $(target).collapse('toggle');
    });

    $('.mega-menu-tab-list .menu-list-tab li').on('mouseenter', function () {
    var tab = $(this).data('tab');
    var $container = $(this).closest('.mega-menu-tab-list');
    var $megaMenu = $(this).closest('.mega-menu');

    $container.find('.menu-list-tab li').removeClass('active');
    $container.find('.mega-menu-tab-list-content').removeClass('active');
    $megaMenu.find('.display-2-top-link').removeClass('active');
    
    $(this).addClass('active');
    $container.find('.mega-menu-tab-list-content[data-tab="' + tab + '"]').addClass('active');
    $megaMenu.find('.display-2-top-link[data-tab-link="' + tab + '"]').addClass('active');
    });

}

if ($('.language-selector-container').length) {
    $('.language-selector').on('click', function (e) {
        e.stopPropagation(); // Prevents click from bubbling up
        $(this).find('i').toggleClass('rotated');
        $('.language-dropdown').fadeToggle(200);
    });

    // Optional: close dropdown and reset rotation if clicking outside
    $(document).on('click', function () {
        $('.language-dropdown').fadeOut(200);
        $('.language-selector i').removeClass('rotated');
    });
}


var headerHeight = $('.shopify-section-group-header-group .header').outerHeight();

$(document).ready(function() {
    


    document.dispatchEvent(new CustomEvent("swym:collections-loaded"));

    /* DATA AOS ---------------------------------- */
    $('[data-aos]').addClass('aos-init');

    if ($('.banner-slider:not(.v2)').length) {
        $('.banner-slider').css('--headerHeight', headerHeight + 'px');
    }
    if ($('.language-dropdown').length){
        $('.language-dropdown').css('--headerHeight', headerHeight + 'px');
    }
    
    if ($('.logo-slider-section').length){
        $('.logo-slider-section .footer-icon-list-slider').each(function () {
            let $section = $(this);
            let $sectionRecommendation = $('.logo-slider-section');

            new Swiper(this, {
                slidesPerView: 4,
                spaceBetween: 10,
                allowTouchMove: true,
                loop: false,
                pagination: {
                    el: $sectionRecommendation.find('.swiper-pagination')[0],
                    clickable: true,
                },
            });
        });
    }

    $(document).on('click', '.announcement-close', function () {
        $('.announcement-bar').stop(true, true).slideUp(200, function () {
          if ($('.banner-slider').length) $('.banner-slider').css('height', '94vh');

          if($('.about-us-timeline-slider-section .swiper-pagination-timeline').length) $('.about-us-timeline-slider-section .swiper-pagination-timeline').css('top', '115px');
          // wait for layout/paint
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              updateHeaderDependentUI();

              // ✅ notify other scripts (like the about-us slider)
              window.dispatchEvent(new CustomEvent('header:heightchange'));
            });
          });
        });
    });


    function getHeaderHeight() {
      const header = document.querySelector('.shopify-section-group-header-group .header');
      return header ? header.offsetHeight : 0;
    }

    function updateHeaderDependentUI() {
      const h = getHeaderHeight();
      const hSize = window.innerHeight;

      $('body').css('padding-top', `${h}px`);
      $('.sticky-top').css('top', `${h + 30}px`);
      $('.nav-mobile').css('height', `${hSize - h}px`);
      $('.predictive-search .wrapper').css('margin-top', `0`);

      $('.header-nav-section, .main-support-nav, .main-product-support-nav').css('top', `${h}px`);

      setHeaderHeightVar(h);

    }


    animate_section();
});

$(window).on('scroll', function() {
    section_scroll_animation();
    aos_animate();
    animate_section();
    backToTop();
});

function setHeaderHeightVar(headerHeight) {
  // fallback: if not passed, compute it
  if (headerHeight == null) {
    const header = document.querySelector('header'); // change selector
    headerHeight = header ? header.getBoundingClientRect().height : 0;
  }

  headerHeight = Math.round(headerHeight);

  document.documentElement.style.setProperty('--headerHeight', `${headerHeight}px`);
  return headerHeight;
}

// run once
setHeaderHeightVar(headerHeight);




$(window).resize(function() {
    if ($('.banner-slider:not(.v2)').length) {
        $('.banner-slider').css('--headerHeight', headerHeight + 'px');
    }
    if ($('.language-dropdown').length){
        $('.language-dropdown').css('--headerHeight', headerHeight + 'px');
    }
    setHeaderHeightVar(headerHeight);
});



function visiblePercent($element) {
    let windowHeight = $(window).height();
    let scrollTop = $(window).scrollTop();
    let elementOffset = $element.offset().top;
    let elementHeight = $element.outerHeight();

    let distanceFromTop = elementOffset - scrollTop;
    let visiblePercent = (windowHeight - distanceFromTop) / elementHeight * 100;

    visiblePercent = Math.max(0, Math.min(100, visiblePercent));

    return visiblePercent;
}

function sectionPercent($element) {
    let elementHeight = $element.outerHeight();
    let viewportHeight = $(window).height();
    
    let elementOffset = $element.offset();
    let elementTop = elementOffset.top - $(window).scrollTop();

    let scrollPercentage = Math.min(100, Math.max(0, ((viewportHeight - elementTop) / elementHeight) * 100));

    return scrollPercentage;
}

function section_scroll_animation() {
    $('.section-animation').each(function() {
            let el = $(this);
      
        if (visiblePercent(el) > 70){
            $(this).addClass('animate');
        }
      
    });
}

function aos_animate() {
    $('.aos-section-animate').each(function () {
        let el = $(this);

        // If any child inside has both data-aos and class 'play-now', animate immediately
        if (el.find('[data-aos].play-now').length > 0) {
            el.find('.aos-init').addClass('aos-animate');
        } 
        // Otherwise, animate if 50% of section is visible
        else if (visiblePercent(el) >= 50) {
            el.find('.aos-init').addClass('aos-animate');
        }
    });
}

function animate_section(){
  if ($('.animate-section').length) {
      $('.animate-section').each(function() {
        let el = $(this);
        if (visiblePercent(el) > 40) {
          $(this).addClass('animate');
        }
        
      });     
  }
}

function backToTop() {
    if ($('.back-to-top').length) {
        let scrollDistance = $(window).scrollTop();
        let vh50 = $(window).height() * 0.5;

        if (scrollDistance >= vh50) {
            $('.back-to-top').fadeIn();
        }
        else {
            $('.back-to-top').fadeOut();
        }
    }
}

$('.back-to-top').click(function () {
    $('html, body').animate({ scrollTop: 0 }, 'fast');
});


// PRODUCT ITEM CARD JS

$(document).on('click', '.product-item .variant-option-block .variant-colors li', function () {

    let $clicked = $(this);
    let $productItem = $clicked.closest('.product-item');
    let $variantBlock = $productItem.find('.variant-option-block');

    $variantBlock.find('.variant-color-item').removeClass('on');
    $clicked.addClass('on');

    let colorId = $clicked.data('color');
    let variantId = $clicked.data('id');

    $productItem.find('.product-main-id').val(variantId);
    $productItem.find('.swym-button').attr('data-variant-id', variantId);

    $productItem.find('.product-image img').each(function () {
        $(this).toggleClass('active', $(this).data('variant') == colorId);
    });

});



$(document).on('click', '.product-item .product-image', function () {
    let link = $(this).data('link');
    if (link) {
        window.location.href = link;
    }
});

document.addEventListener("DOMContentLoaded", function () {
  const isDesktopHover = window.matchMedia("(hover: hover) and (pointer: fine)");
  const CLOSE_DELAY = 200; // adjust 150-300

  function getClosest(el, selector) {
    // If it's a text node, use parent element
    if (el && el.nodeType === 3) el = el.parentElement;
    // Only Elements have closest()
    if (!el || el.nodeType !== 1 || typeof el.closest !== "function") return null;
    return el.closest(selector);
  }

  function setIcon(btn, isOpen) {
    const icon = btn ? btn.querySelector("i") : null;
    if (!icon) return;
    icon.classList.toggle("fa-chevron-down", !isOpen);
    icon.classList.toggle("fa-chevron-up", isOpen);
  }

  function openDropdown(btn, dropdown) {
    if (!btn || !dropdown) return;
    dropdown.style.display = "flex";
    btn.classList.add("open");
    setIcon(btn, true);
  }

  function closeDropdown(btn, dropdown) {
    if (!btn || !dropdown) return;
    dropdown.style.display = "none";
    btn.classList.remove("open");
    setIcon(btn, false);
  }

  function toggleDropdown(btn, dropdown) {
    if (!btn || !dropdown) return;
    const isOpen = btn.classList.contains("open");
    if (isOpen) closeDropdown(btn, dropdown);
    else openDropdown(btn, dropdown);
  }

  function initProduct(product) {
    if (!product || product.__dropdownInit) return;
    product.__dropdownInit = true;

    const btn = product.querySelector(".view-all-options-btn");
    const dropdown = product.querySelector(".variant-colors-dropdown");
    if (!btn || !dropdown) return;

    // Default closed
    closeDropdown(btn, dropdown);

    // Desktop hover behavior with delay (so you can move into dropdown)
    if (isDesktopHover.matches) {
      let closeTimer = null;

      function cancelClose() {
        if (closeTimer) clearTimeout(closeTimer);
        closeTimer = null;
      }

      function scheduleClose() {
        cancelClose();
        closeTimer = setTimeout(function () {
          closeDropdown(btn, dropdown);
        }, CLOSE_DELAY);
      }

      btn.addEventListener("mouseenter", function () {
        cancelClose();
        openDropdown(btn, dropdown);
      });

      btn.addEventListener("mouseleave", function () {
        scheduleClose();
      });

      dropdown.addEventListener("mouseenter", function () {
        cancelClose();
        openDropdown(btn, dropdown);
      });

      dropdown.addEventListener("mouseleave", function () {
        scheduleClose();
      });

      product.addEventListener("mouseenter", function () {
        cancelClose();
      });

      product.addEventListener("mouseleave", function () {
        scheduleClose();
      });
    }
  }

  // ✅ Init current items (works for existing HTML)
  document.querySelectorAll(".product-item").forEach(initProduct);

  // ✅ Observe appended items (works for AJAX/append/filters)
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (m) {
      m.addedNodes.forEach(function (node) {
        if (!node || node.nodeType !== 1) return;

        // If the added node is a product-item
        if (node.matches && node.matches(".product-item")) {
          initProduct(node);
        }

        // Or contains product items inside it
        if (node.querySelectorAll) {
          node.querySelectorAll(".product-item").forEach(initProduct);
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // ✅ Mobile/touch click delegation (works for appended items too)
  document.addEventListener("click", function (e) {
    // if desktop hover device, ignore click toggling
    if (isDesktopHover.matches) return;

    const btn = getClosest(e.target, ".view-all-options-btn");
    if (!btn) return;

    const product = getClosest(btn, ".product-item") || getClosest(e.target, ".product-item");
    if (!product) return;

    const dropdown = product.querySelector(".variant-colors-dropdown");
    if (!dropdown) return;

    e.preventDefault();
    e.stopPropagation();

    // Close others (optional)
    document.querySelectorAll(".product-item").forEach(function (p) {
      if (p === product) return;
      const b = p.querySelector(".view-all-options-btn");
      const d = p.querySelector(".variant-colors-dropdown");
      if (b && d) closeDropdown(b, d);
    });

    toggleDropdown(btn, dropdown);
  });

  // ✅ Mobile: close when clicking outside any product
  document.addEventListener("click", function (e) {
    if (isDesktopHover.matches) return;

    const product = getClosest(e.target, ".product-item");
    if (product) return;

    document.querySelectorAll(".product-item").forEach(function (p) {
      const b = p.querySelector(".view-all-options-btn");
      const d = p.querySelector(".variant-colors-dropdown");
      if (b && d) closeDropdown(b, d);
    });
  });
});



// POPUP MODAL
$('.popup-modal').each(function () {
    var $container = $(this);
    $container.find('.popup-close').click(function(){
        $container.removeClass('open');
        $('body').removeClass('no-scroll');
    });
    $container.find('.popup-overlay').click(function(){
        $container.removeClass('open');
        $('body').removeClass('no-scroll');
    });

});




function startOdometer() {

  document.querySelectorAll('.odometer').forEach(el => {
    const finalValue = el.getAttribute('data-count');
    if (!finalValue) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !el.classList.contains('done')) {
          el.classList.add('done');
          el.textContent = finalValue;     // <- number only
          obs.unobserve(el);               // <- stop observing after run
        }
      });
    }, { threshold: 0.5 });

    observer.observe(el);
  });
}

document.addEventListener('DOMContentLoaded', startOdometer);


$(document).on('click', '.icon-gift', function () {
    const panelContainer   = document.querySelector('.smile-panel-frame-container');
    const launcherIframe   = document.querySelector('#smile-lite-launcher-frame') 
                          || document.querySelector('.smile-launcher-frame');

    // 1. If panel is OPEN, try to close it via the panel iframe
    if (panelContainer) {
        const panelIframe = panelContainer.querySelector('iframe.smile-panel-frame');
        if (panelIframe) {
            const panelDoc = panelIframe.contentDocument || panelIframe.contentWindow.document;
            if (panelDoc) {
                // Try several common selectors for Smile close / back buttons
                const closeBtn =
                    panelDoc.querySelector('[aria-label*="close" i]') ||
                    panelDoc.querySelector('[aria-label*="dismiss" i]') ||
                    panelDoc.querySelector('button[class*="close" i]') ||
                    panelDoc.querySelector('.close-icon') ||
                    panelDoc.querySelector('[data-testid*="close" i]');

                if (closeBtn) {
                    closeBtn.click();
                    return; // done
                }
            }
        }
    }

    // 2. If we get here, panel is closed (or we failed to close it) → try to OPEN via launcher iframe
    if (!launcherIframe) return;

    const launcherDoc = launcherIframe.contentDocument || launcherIframe.contentWindow.document;
    if (!launcherDoc) return;

    // In the launcher iframe, there is usually a single <button> that opens the panel
    const openBtn = launcherDoc.querySelector('button');

    if (openBtn) {
        openBtn.click();
    }
});


// Open popup modal from ATC button
$(document).on('click', '.form-btn.popup-atc .btn-atc', function (e) {
  e.preventDefault();
  e.stopPropagation();
  var popupId = $(this).attr('data-popup-id');
  if (!popupId) return;

  var $popup = $('.product-update.popup-modal[data-popup-id="' + popupId + '"]').first();
  if (!$popup.length) return;

  $popup.addClass('open');
  $('body').addClass('no-scroll');
});

// (Optional) close handlers
$(document).on('click', '.product-update.popup-modal .popup-close, .product-update.popup-modal .popup-backdrop', function (e) {
  e.preventDefault();
  var $popup = $(this).closest('.product-update.popup-modal');
  $popup.removeClass('open');
  $('body').removeClass('no-scroll');
});


// =======================================================
// PRODUCT PAGE: Load #productEditPopupHTML via AJAX
// Then open .product-update.popup-modal + handle:
// - Standard/Tall toggle (Size option)
// - Variant selection + availability disabling
// - AJAX add to cart (refreshCart(); openCart();)
// - Close popup on success (and on X/overlay)
// =======================================================
$(function () {
  // -------------------------
  // CONFIG
  // -------------------------
  const BTN_SEL = '.form-btn.popup-atc .btn-atc';
  const HOST_ID = 'ajaxProductEditPopupHost';

  // -------------------------
  // Button loading UI (YOUR markup)
  // -------------------------
  function setBtnLoading($btn, isLoading) {
    const $wrap = $btn.closest('.form-btn.popup-atc');
    if (!$wrap.length) return;

    const $span = $btn.find('span').first();
    const $overlay = $btn.find('.atc-overlay').first();

    if (isLoading) {
      $span.css('visibility', 'hidden');
      $overlay.css('display', 'flex');
      $btn.css('pointer-events', 'none');
    } else {
      $span.css('visibility', 'visible');
      $overlay.css('display', 'none');
      $btn.css('pointer-events', '');
    }
  }

  // -------------------------
  // Host where we inject popups
  // -------------------------
  function getHost() {
    let $host = $('#' + HOST_ID);
    if (!$host.length) {
      $host = $('<div/>', { id: HOST_ID }).appendTo('body');
    }
    return $host;
  }

  const popupRequestCache = {};

  function normalizeProductHandle(handle) {
    if (!handle) return '';

    let normalized = String(handle).trim();
    if (!normalized) return '';

    normalized = normalized.split('?')[0].split('#')[0];

    const productsMatch = normalized.match(/\/products\/([^/]+)/i);
    if (productsMatch && productsMatch[1]) {
      normalized = productsMatch[1];
    }

    return normalized.replace(/^\/+|\/+$/g, '');
  }

  function buildProductPageUrl(handle) {
    const normalizedHandle = normalizeProductHandle(handle);
    const root = (
      (window.Shopify && window.Shopify.routes && window.Shopify.routes.root) ||
      '/'
    ).replace(/\/+$/, '/');

    return root + 'products/' + encodeURIComponent(normalizedHandle);
  }

  function buildProductPopupViewUrl(handle) {
    return buildProductPageUrl(handle) + '?view=popup';
  }

  function findPopupInProductHtml(response) {
    const htmlNodes = $.parseHTML(response, document, true) || [];
    const $doc = $('<div>').append(htmlNodes);

    let $popupContainer = $doc.find('#productEditPopupHTML .popup-container').first();
    if (!$popupContainer.length) {
      $popupContainer = $doc.find('#productEditPopupHTML').find('.popup-container').first();
    }

    if (!$popupContainer.length) {
      const $directPopup = $doc.find('.product-update.popup-modal').first();
      if ($directPopup.length) {
        return {
          popupHtml: $directPopup.prop('outerHTML')
        };
      }
    }

    const $popup = $popupContainer.find('.product-update.popup-modal').first();
    if (!$popup.length) return null;

    return {
      containerHtml: $popupContainer.html(),
      popupHtml: $popup.prop('outerHTML')
    };
  }

  // -------------------------
  // Popup open/close
  // -------------------------
  function openPopup($popup) {
    if (!$popup || !$popup.length) return;
    $popup.addClass('open');
    $('body').addClass('no-scroll');

    // Init variants UI every time we open (safe)
    refreshPopupVariantUI($popup);
  }

  function closePopup($popup) {
    if (!$popup || !$popup.length) return;
    $popup.removeClass('open is-loading');
    $('body').removeClass('no-scroll');
  }

  // -------------------------
  // Load popup HTML from product page
  // expects product page has:
  // <div id="productEditPopupHTML" style="display:none!important;">
  //   <div class="popup-container">
  //     <div class="product-update popup-modal"> ... </div>
  //   </div>
  // </div>
  // -------------------------
  function loadPopupFromProductPage(handle) {
    const $host = getHost();
    const normalizedHandle = normalizeProductHandle(handle);

    if (!normalizedHandle) {
      return Promise.reject(new Error('Missing product handle for popup.'));
    }

    // Reuse if already loaded
    const $existingWrap = $host.find('.ajax-popup-wrap[data-handle="' + normalizedHandle + '"]').first();
    if ($existingWrap.length) {
      return Promise.resolve($existingWrap.find('.product-update.popup-modal').first());
    }

    if (popupRequestCache[normalizedHandle]) {
      return popupRequestCache[normalizedHandle];
    }

    const requestPromise = new Promise(function (resolve, reject) {
      const productUrl = buildProductPageUrl(normalizedHandle);
      const popupViewUrl = buildProductPopupViewUrl(normalizedHandle);
      const fallbackUrl = '/products/' + encodeURIComponent(normalizedHandle);
      const fallbackPopupViewUrl = fallbackUrl + '?view=popup';
      const attempts = [
        { url: popupViewUrl, label: 'popup view URL' },
        { url: productUrl, label: 'localized product URL' }
      ];

      if (fallbackPopupViewUrl !== popupViewUrl) {
        attempts.push({ url: fallbackPopupViewUrl, label: 'default popup view URL' });
      }

      if (fallbackUrl !== productUrl) {
        attempts.push({ url: fallbackUrl, label: 'default product URL' });
      }

      function finalizeWithPopup(parsed) {
        const $wrap = $('<div/>', {
          class: 'ajax-popup-wrap popup-container',
          'data-handle': normalizedHandle
        });

        if (parsed.containerHtml) {
          $wrap.append(parsed.containerHtml);
        } else if (parsed.popupHtml) {
          $wrap.append(parsed.popupHtml);
        }

        $host.append($wrap);

        const $popup = $wrap.find('.product-update.popup-modal').first();
        if ($popup.length) {
          resolve($popup);
          return true;
        }

        return false;
      }

      function tryLoad(attemptIndex, lastError) {
        if (attemptIndex >= attempts.length) {
          reject(lastError || new Error('Failed to load product page HTML.'));
          return;
        }

        const attempt = attempts[attemptIndex];

        $.ajax({
          url: attempt.url,
          method: 'GET',
          dataType: 'html',
          cache: true,
          success: function (response, textStatus, jqXHR) {
            const parsed = findPopupInProductHtml(response);

            if (parsed && finalizeWithPopup(parsed)) {
              return;
            }

            const status = jqXHR && jqXHR.status ? ' (status ' + jqXHR.status + ')' : '';
            tryLoad(
              attemptIndex + 1,
              new Error('Popup HTML not found on product page' + status + '.')
            );
          },
          error: function (jqXHR, textStatus) {
            const status = jqXHR && jqXHR.status ? ' (status ' + jqXHR.status + ')' : '';
            const reason = textStatus ? ' ' + textStatus : '';

            if (jqXHR && jqXHR.status === 429) {
              reject(new Error('Requests are too frequent. Please try again in a moment.'));
              return;
            }

            tryLoad(
              attemptIndex + 1,
              new Error('Failed to load product page HTML from ' + attempt.label + status + reason + '.')
            );
          }
        });
      }

      tryLoad(0);
    });

    popupRequestCache[normalizedHandle] = requestPromise.then(function (result) {
      delete popupRequestCache[normalizedHandle];
      return result;
    }, function (error) {
      delete popupRequestCache[normalizedHandle];
      throw error;
    });

    return popupRequestCache[normalizedHandle];
  }

  // =======================================================
  // VARIANT UI LOGIC (popup only)
  // =======================================================
  function parsePopupVariants($popup) {
    const cached = $popup.data('variants');
    if (cached) return cached;

    const $json = $popup.find('script[type="application/json"]').first();
    if (!$json.length) return null;

    try {
      const variants = JSON.parse($json.html());
      if (Array.isArray(variants) && variants.length) {
        $popup.data('variants', variants);
        return variants;
      }
    } catch (e) {
      console.warn('Popup variants JSON parse failed', e);
    }
    return null;
  }

  function getFieldsets($popup) {
    return $popup.find('fieldset.variant[data-option-position]');
  }

  function getSelections($popup) {
    const selections = {};
    getFieldsets($popup).each(function () {
      const $fs = $(this);
      const pos = parseInt($fs.attr('data-option-position'), 10);
      if (!pos) return;

      let val = $fs.find('.nav-variants-selector.selected').first().attr('data-option-value');

      if (!val) {
        val = $fs.find('input.nav-variant-radio:checked').first().val();
      }

      if (val) selections[pos] = String(val);
    });
    return selections;
  }

  function setLegendValue($fieldset, value) {
    const $info = $fieldset.find('.variant-info').first();
    if ($info.length) {
      $info.text(' : ' + value);
    } else {
      $fieldset.find('legend').first().find('.variant-info').remove();
      $fieldset.find('legend').first().append('<span class="variant-info"> : ' + value + '</span>');
    }
  }

  function setSelectedValue($fieldset, value) {
    const $selectors = $fieldset.find('.nav-variants-selector');
    const $radios = $fieldset.find('input.nav-variant-radio');

    $selectors.removeClass('selected');
    $selectors
      .filter(function () {
        return String($(this).attr('data-option-value') || '') === String(value);
      })
      .addClass('selected');

    $radios.prop('checked', false);
    $radios
      .filter(function () {
        return String($(this).val() || '') === String(value);
      })
      .prop('checked', true);

    setLegendValue($fieldset, value);
  }

  function variantMatchesSelections(variant, selections) {
    if (selections[1] && variant.option1 !== selections[1]) return false;
    if (selections[2] && variant.option2 !== selections[2]) return false;
    if (selections[3] && variant.option3 !== selections[3]) return false;
    return true;
  }

  function findMatchingVariant(variants, selections) {
    if (!variants) return null;

    const availableMatch = variants.find(function (v) {
      return v && v.available && variantMatchesSelections(v, selections);
    });
    if (availableMatch) return availableMatch;

    const anyMatch = variants.find(function (v) {
      return v && variantMatchesSelections(v, selections);
    });
    return anyMatch || null;
  }

  function updateFeaturedImage($popup, variant) {
    if (!variant) return;

    const imgSrc =
      (variant.featured_image && variant.featured_image.src) ||
      (variant.featured_media &&
        variant.featured_media.preview_image &&
        variant.featured_media.preview_image.src) ||
      '';

    if (!imgSrc) return;

    const $img = $popup.find('.product-featured-image img').first();
    if ($img.length) $img.attr('src', imgSrc);
  }

  function updateDisabledStates($popup) {
    const variants = parsePopupVariants($popup);
    if (!variants) return;

    const selections = getSelections($popup);
    const $fieldsets = getFieldsets($popup);

    $fieldsets.each(function () {
      const $fs = $(this);
      const pos = parseInt($fs.attr('data-option-position'), 10);

      $fs.find('.nav-variants-selector').each(function () {
        const $opt = $(this);
        const val = $opt.attr('data-option-value');
        if (!val) return;

        const testSel = $.extend({}, selections);
        testSel[pos] = String(val);

        const existsAvailable = variants.some(function (v) {
          return v && v.available && variantMatchesSelections(v, testSel);
        });

        $opt.toggleClass('disabled', !existsAvailable);

        const id = $opt.attr('data-id');
        if (id) {
          const $radio = $fs.find('#' + CSS.escape(id));
          if ($radio.length) {
            $radio.prop('disabled', !existsAvailable);
            $radio.toggleClass('disabled', !existsAvailable);
          }
        } else {
          $fs
            .find('input.nav-variant-radio')
            .filter(function () {
              return String($(this).val() || '') === String(val);
            })
            .prop('disabled', !existsAvailable)
            .toggleClass('disabled', !existsAvailable);
        }
      });
    });

    // Store current selected variant for add-to-cart
    const matched = findMatchingVariant(variants, selections);
    if (matched) {
      $popup.data('selectedVariantId', matched.id);
      $popup.data('selectedVariantAvailable', !!matched.available);
      updateFeaturedImage($popup, matched);
    } else {
      $popup.removeData('selectedVariantId');
      $popup.removeData('selectedVariantAvailable');
    }
  }

  function ensureValidSelections($popup) {
    const $fieldsets = getFieldsets($popup);

    $fieldsets.each(function () {
      const $fs = $(this);

      const $selected = $fs.find('.nav-variants-selector.selected').first();
      const selectedDisabled = $selected.length && $selected.hasClass('disabled');

      if (selectedDisabled || !$selected.length) {
        const $firstEnabled = $fs.find('.nav-variants-selector').not('.disabled').filter(':visible').first();
        if ($firstEnabled.length) {
          setSelectedValue($fs, $firstEnabled.attr('data-option-value'));
        }
      }
    });

    updateDisabledStates($popup);
  }

  

  function refreshPopupVariantUI($popup) {
    updateDisabledStates($popup);
    ensureValidSelections($popup);
  }

  $(document).on('click', '.product-update.popup-modal .nav-variants-selector', function (e) {
    e.preventDefault();

    const $opt = $(this);
    if ($opt.hasClass('disabled') || !$opt.is(':visible')) return;

    const $popup = $opt.closest('.product-update.popup-modal');
    const $fs = $opt.closest('fieldset.variant');

    const val = $opt.attr('data-option-value');
    if (!val) return;

    setSelectedValue($fs, val);
    refreshPopupVariantUI($popup);
  });

  $(document).on('change', '.product-update.popup-modal input.nav-variant-radio', function () {
    const $radio = $(this);
    if ($radio.prop('disabled')) return;

    const $popup = $radio.closest('.product-update.popup-modal');
    const $fs = $radio.closest('fieldset.variant');
    const val = $radio.val();

    if (!val) return;

    setSelectedValue($fs, val);
    refreshPopupVariantUI($popup);
  });

  function normalizeVariantId(id) {
    if (id == null) return null;
    if (typeof id === 'number') return id;

    const str = String(id).trim();
    if (/^\d+$/.test(str)) return Number(str);

    const m = str.match(/(\d+)(?!.*\d)/);
    return m ? Number(m[1]) : null;
  }

  function readErrorMessage(response, fallbackMessage) {
    return response.json()
      .then(function (err) {
        let msg = fallbackMessage;
        if (err && err.description) msg = err.description;
        if (err && err.message) msg = err.message;
        throw new Error(msg);
      })
      .catch(function (err) {
        if (err instanceof Error) throw err;
        throw new Error(fallbackMessage);
      });
  }

  function ajaxAddToCart(variantId, quantity) {
    return fetch('/cart/add.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ id: variantId, quantity: quantity })
    }).then(function (res) {
      if (!res.ok) {
        return readErrorMessage(res, 'Failed to add to cart.');
      }

      return res.json();
    });
  }

  function ajaxChangeCartLine(line, quantity) {
    return fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ line: line, quantity: quantity })
    }).then(function (res) {
      if (!res.ok) {
        return readErrorMessage(res, 'Failed to update cart item.');
      }

      return res.json();
    });
  }

  function getCart() {
    return fetch('/cart.js', { headers: { Accept: 'application/json' } }).then(function (res) {
      if (!res.ok) {
        return readErrorMessage(res, 'Failed to read cart.');
      }

      return res.json();
    });
  }

  function findLineByKey(cart, key) {
    if (!cart || !Array.isArray(cart.items) || !key) return null;
    const idx = cart.items.findIndex(i => i && i.key === key);
    return idx >= 0 ? (idx + 1) : null;
  }

  function findLineByVariantId(cart, variantId) {
    if (!cart || !Array.isArray(cart.items) || !variantId) return null;
    const idx = cart.items.findIndex(i => normalizeVariantId(i.id) === normalizeVariantId(variantId));
    return idx >= 0 ? (idx + 1) : null;
  }

  function getLineQuantity(cart, line) {
    if (!cart || !Array.isArray(cart.items) || !line) return 0;

    const item = cart.items[line - 1];
    const quantity = item && parseInt(item.quantity, 10);
    return Number.isFinite(quantity) ? quantity : 0;
  }

  function triggerCartRefresh() {
    if (typeof refreshCart === 'function') refreshCart();
    if (typeof openCart === 'function') openCart();
  }

  $(document).on('click', '.product-update.popup-modal .bottom-container .btn-main', function (e) {
    e.preventDefault();
    e.stopPropagation();

    const $btn = $(this);
    const $popup = $btn.closest('.product-update.popup-modal');

    if ($popup.closest('#popup-cart, .main-cart').length) {
      return;
    }

    refreshPopupVariantUI($popup);

    const variants = parsePopupVariants($popup);
    if (!variants) return;

    const selections = getSelections($popup);
    const matched = findMatchingVariant(variants, selections);

    const newVariantId = normalizeVariantId(matched && matched.id);
    if (!newVariantId) {
      alert('Please select a valid option.');
      return;
    }

    if (!matched.available) {
      alert('This variant is currently sold out.');
      return;
    }

    const $qtyInput = $popup.find('.nav-quantity__input').first();
    let qty = parseInt($qtyInput.val(), 10);
    if (isNaN(qty) || qty < 1) qty = 1;

    const lineKey = $popup.attr('data-line-key') || $btn.attr('data-line-key');
    const currentVariantId = normalizeVariantId($popup.attr('data-current-variant-id') || $btn.attr('data-current-variant-id'));

    $btn.addClass('is-loading');
    $btn.find('.atc-overlay').addClass('show').css('display', 'flex');
    $btn.css('pointer-events', 'none');

    getCart()
      .then(function (cart) {
        const currentLine =
          findLineByKey(cart, lineKey) ||
          (currentVariantId ? findLineByVariantId(cart, currentVariantId) : null);

        if (currentLine) {
          const currentItem = cart.items[currentLine - 1];
          const currentLineVariantId = normalizeVariantId(currentItem && currentItem.id);

          if (currentLineVariantId && currentLineVariantId === newVariantId) {
            return ajaxChangeCartLine(currentLine, qty);
          }

          return ajaxChangeCartLine(currentLine, 0).then(function (updatedCart) {
            const existingNewLine = findLineByVariantId(updatedCart, newVariantId);
            if (existingNewLine) {
              return ajaxChangeCartLine(existingNewLine, qty);
            }

            return ajaxAddToCart(newVariantId, qty);
          });
        }

        const existingLine = findLineByVariantId(cart, newVariantId);
        if (existingLine) {
          return ajaxChangeCartLine(existingLine, getLineQuantity(cart, existingLine) + qty);
        }

        return ajaxAddToCart(newVariantId, qty);
      })
      .then(function () {
        triggerCartRefresh();
        closePopup($popup);
      })
      .catch(function (err) {
        console.warn(err);
        alert(err.message || 'Failed to update cart.');
      })
      .then(function () {
        $btn.removeClass('is-loading');
        $btn.find('.atc-overlay').removeClass('show').css('display', '');
        $btn.css('pointer-events', '');
      }, function () {
        $btn.removeClass('is-loading');
        $btn.find('.atc-overlay').removeClass('show').css('display', '');
        $btn.css('pointer-events', '');
      });
  });

  // Close popup (X / overlay)
  $(document).on('click', '.product-update.popup-modal .popup-close, .product-update.popup-modal .popup-overlay', function () {
    closePopup($(this).closest('.product-update.popup-modal'));
  });

  // =======================================================
  // MAIN BUTTON: load HTML + open popup
  // =======================================================
  $(document).on('click', BTN_SEL, function (e) {
    e.preventDefault();
    e.stopPropagation();

    const $btn = $(this);
    const handle = ($btn.attr('data-popup-handle') || '').trim();
    if (!handle) return;

    setBtnLoading($btn, true);

    loadPopupFromProductPage(handle)
      .then(function ($popup) {
        openPopup($popup);
      })
      .catch(function (err) {
        console.warn(err);
        alert(err.message || 'Failed to open popup.');
      })
      .then(function () {
        // hide loading once popup is shown (or on error)
        setBtnLoading($btn, false);
      }, function () {
        // hide loading once popup is shown (or on error)
        setBtnLoading($btn, false);
      });
  });

});

// =======================================
// SHARED SIZE GROUPS (STANDARD / TALL)
// =======================================
$(function () {

  // ======================================================
  // SUPPORT BOTH CARTS: .main-cart AND #popup-cart
  // ======================================================
  const CART_SCOPES = ['.main-cart', '#popup-cart'];

  CART_SCOPES.forEach(CART_SCOPE => {
    if (!document.querySelector(CART_SCOPE)) return;

    const MAX_EXTRA_ITEMS = 10; // max added product-update-item


    // ======================================================
    // VARIANT JSON LOADER
    // ======================================================
    function getPopupVariants($popup) {
      const cached = $popup.data('variants');
      if (cached) return cached;

      const $json = $popup.find('script[type="application/json"]').first();
      if (!$json.length) return null;

      try {
        const variants = JSON.parse($json.html());
        if (Array.isArray(variants)) {
          $popup.data('variants', variants);
          return variants;
        }
      } catch (e) {
        console.warn('Variant JSON parse error', e);
      }
      return null;
    }

    function getCartData() {
      return $.ajax({
        type: 'GET',
        url: '/cart.js',
        dataType: 'json',
        cache: false
      });
    }

    function findCartItemByKey(cart, key) {
      if (!cart || !Array.isArray(cart.items) || !key) return null;
      return cart.items.find(item => item && item.key === key) || null;
    }

    function getCartQuantityByVariant(cart, variantId, excludeKey) {
      if (!cart || !Array.isArray(cart.items) || !variantId) return 0;

      return cart.items.reduce(function (total, item) {
        if (!item || item.key === excludeKey) return total;
        if (String(item.id) !== String(variantId)) return total;

        return total + (parseInt(item.quantity, 10) || 0);
      }, 0);
    }


    // ======================================================
    // PER-ITEM HELPERS
    // ======================================================
    function getItemSelection($item) {
      const selection = {};
      $item.find('fieldset.variant').each(function (idx) {
        const $fs = $(this);
        const pos = parseInt($fs.data('option-position'), 10) || idx + 1;
        const val = $fs.find('.nav-variant-radio:checked').val();
        if (val) selection[pos] = val;
      });
      return selection;
    }

    function findVariantForItem($item, variants) {
      const selection = getItemSelection($item);
      const keys = Object.keys(selection);

      return variants.find(v => {
        if (!v.available) return false;
        return keys.every(k => v[`option${k}`] === selection[k]);
      }) || null;
    }

    function updateVariantInfoForItem($item) {
      $item.find('fieldset.variant').each(function () {
        const val = $(this).find('.nav-variant-radio:checked').val();
        $(this).find('.variant-info').text(val ? ' : ' + val : '');
      });
    }

    function updatePriceImageForPopup($popup, variant) {
      if (!variant) return;

      const $price = $popup.find('.product-price .final .money').first();
      const $cap = $popup.find('.product-price .original .money').first();
      const $img = $popup.find('.product-featured-image img').first();

      if ($price.length) {
        if (window.Shopify && Shopify.formatMoney) {
          $price.text(Shopify.formatMoney(variant.price, Shopify.money_format));
        } else {
          $price.text('$' + (variant.price / 100).toFixed(2));
        }
      }

      if ($cap.length) {
        if (variant.compare_at_price > variant.price) {
          $cap.text('$' + (variant.compare_at_price / 100).toFixed(2));
          $cap.closest('.original').show();
        } else {
          $cap.closest('.original').hide();
        }
      }

      if ($img.length && variant.featured_image && variant.featured_image.src) {
        $img.attr('src', variant.featured_image.src);
      }
    }

    function recomputeAvailabilityForItem($item, variants) {
      const selection = getItemSelection($item);

      $item.find('fieldset.variant').each(function (idx) {
        const $fs = $(this);
        const pos = parseInt($fs.data('option-position'), 10) || idx + 1;

        $fs.find('.nav-variants-selector').each(function () {
          const $sel = $(this);
          const value = $sel.data('option-value');
          if (!value) return;

          const enabled = variants.some(v => {
            if (!v.available) return false;
            if (v[`option${pos}`] !== value) return false;

            return Object.keys(selection).every(k => {
              if (Number(k) === pos) return true;
              return v[`option${k}`] === selection[k];
            });
          });

          const $radio = $fs.find(`.nav-variant-radio[value="${value}"]`);

          if (enabled) {
            $sel.removeClass('disabled');
            $radio.prop('disabled', false).removeClass('disabled');
          } else {
            $sel.addClass('disabled').removeClass('selected');
            $radio.prop('disabled', true).prop('checked', false).addClass('disabled');
          }
        });
      });
    }

    function refreshItemState($item, variants, $popup) {
      recomputeAvailabilityForItem($item, variants);
      updateVariantInfoForItem($item);
      const variant = findVariantForItem($item, variants);
      updatePriceImageForPopup($popup, variant);
    }


    // ======================================================
    // PER-ITEM STANDARD/TALL TOGGLE
    // ======================================================
    function initVariantTypeToggleForItem($item) {
      const $fieldset = $item.find('fieldset.variant-size').first();
      if (!$fieldset.length) return;
      if ($fieldset.data('vst-initialized')) return;

      $fieldset.data('vst-initialized', true);

      function isTallSize(label) {
        return String(label || '').trim().toUpperCase().includes('LT');
      }

      const hasTallSizes = $fieldset.find('.nav-variants-selector').toArray().some(function (selector) {
        return isTallSize($(selector).data('option-value'));
      });

      if (!hasTallSizes) {
        $fieldset.find('.variant-type-toggle').remove();
        $fieldset.find('.nav-variants-selector').show().removeClass('hidden-type');
        $fieldset.find('.nav-variants-option').show();
        return;
      }

      if (!$fieldset.find('.variant-type-toggle').length) {
        $fieldset.find('legend').after(`
          <div class="variant-type-toggle">
            <button type="button" class="variant-type-btn active" data-type="standard">Standard</button>
            <button type="button" class="variant-type-btn" data-type="tall">Tall</button>
          </div>
        `);
      }

      const $buttons = $fieldset.find('.variant-type-btn');

      function getSelectedSizeLabel() {
        const $selected = $fieldset.find('.nav-variants-selector.selected').first();
        if ($selected.length) {
          return $selected.data('option-value');
        }

        const $checked = $fieldset.find('.nav-variant-radio:checked').first();
        return $checked.length ? $checked.val() : '';
      }

      function applyType(type) {
        $buttons.removeClass('active');
        $buttons.filter(`[data-type="${type}"]`).addClass('active');
        $item.attr('data-variant-type', type);

        const $selectors = $fieldset.find('.nav-variants-selector');

        $selectors.each(function () {
          const val = $(this).data('option-value');
          const label = String(val).trim();
          const $option = $(this).next('.nav-variants-option');

          const show =
            (type === 'standard' && !isTallSize(label)) ||
            (type === 'tall' && isTallSize(label));

          if (show) {
            $(this).show().removeClass('hidden-type');
            $option.show();
          } else {
            $(this).hide().addClass('hidden-type').removeClass('selected');
            $option.hide();
          }
        });

        const $popup = $item.closest('.product-update.popup-modal');
        const variants = getPopupVariants($popup);
        if (variants) refreshItemState($item, variants, $popup);
      }

      $fieldset.on('click.popupItem', '.variant-type-btn', function () {
        applyType($(this).data('type'));
      });

      applyType(isTallSize(getSelectedSizeLabel()) ? 'tall' : 'standard');
    }


    // ======================================================
    // INITIALIZE EACH POPUP ITEM (original or clone)
    // ======================================================
    function initPopupItem($item, variants, $popup, isOriginal) {
      $item.off('.popupItem');

      let $removeBtn = $item.find('.btn-remove-item');
      if (!isOriginal) {
        if (!$removeBtn.length) {
          $removeBtn = $('<button type="button" class="btn-remove-item">Remove</button>');
          $item.append($removeBtn);
        }
        $removeBtn.show();
      } else if ($removeBtn.length) {
        $removeBtn.hide();
      }

      $item.on('click.popupItem', '.nav-variants-selector', function () {
        const $sel = $(this);
        if ($sel.hasClass('disabled')) return;

        const val = $sel.data('option-value');
        const $fs = $sel.closest('fieldset.variant');
        const $radio = $fs.find(`.nav-variant-radio[value="${val}"]`);
        if (!$radio.length || $radio.prop('disabled')) return;

        $fs.find('.nav-variants-selector').removeClass('selected');
        $sel.addClass('selected');
        $fs.find('.nav-variant-radio').prop('checked', false);
        $radio.prop('checked', true);

        refreshItemState($item, variants, $popup);
      });

      $item.on('change.popupItem', '.nav-variant-radio', function () {
        const val = $(this).val();
        const $fs = $(this).closest('fieldset.variant');

        $fs.find('.nav-variant-radio').not(this).prop('checked', false);
        $fs.find('.nav-variants-selector').each(function () {
          $(this).toggleClass('selected', $(this).data('option-value') === val);
        });

        refreshItemState($item, variants, $popup);
      });

      initVariantTypeToggleForItem($item);
      refreshItemState($item, variants, $popup);
    }


    // ======================================================
    // OPEN POPUP
    // ======================================================
    $(document).on('click', `${CART_SCOPE} .product-variant .update-btn, 
                              ${CART_SCOPE} .product-variant .btn-update`, function () {

      const $row = $(this).closest('.product-cart, .main-cart-item');
      const $popup = $row.find('.product-update.popup-modal');
      const variants = getPopupVariants($popup);

      if (!$popup.length || !variants) return;

      $popup.addClass('open');
      $('body').addClass('no-scroll');

      const qty = parseInt($row.find('.quantity__input').val(), 10) || 1;

      const $firstItem = $popup.find('.product-update-item').first();
      $popup.find('.product-update-item').not($firstItem).remove();
      $firstItem.find('.nav-quantity__input').val(qty);

      const lineKey = $popup.data('line-key') || $row.data('line-key');
      if (lineKey) $popup.data('line-key', lineKey);

      const variantId = parseInt(String(lineKey).split(':')[0], 10);
      const currentVariant = variants.find(v => v.id === variantId) || variants[0];

      $firstItem.find('fieldset.variant').each(function () {
        const $fs = $(this);
        const pos = $fs.data('option-position');
        const val = currentVariant[`option${pos}`];

        const $radio = $fs.find(`.nav-variant-radio[value="${val}"]`);
        if ($radio.length) {
          $fs.find('.nav-variant-radio').prop('checked', false);
          $radio.prop('checked', true);

          $fs.find('.nav-variants-selector').each(function () {
            $(this).toggleClass('selected', $(this).data('option-value') === val);
          });
        }
      });

      initPopupItem($firstItem, variants, $popup, true);
    });


    // ======================================================
    // CLOSE POPUP
    // ======================================================
    $(document).on('click', `${CART_SCOPE} .popup-overlay, 
                              ${CART_SCOPE} .popup-close`, function () {
      const $popup = $(this).closest('.product-update.popup-modal');
      $popup.removeClass('open is-loading');
      $('body').removeClass('no-scroll');
    });


    // ======================================================
    // ADD MORE ITEMS
    // ======================================================
    $(document).on('click', `${CART_SCOPE} .btn-add-more`, function () {
      const $popup = $(this).closest('.product-update.popup-modal');
      const variants = getPopupVariants($popup);

      const $items = $popup.find('.product-update-item');
      const extra = $items.length - 1;

      if (extra >= MAX_EXTRA_ITEMS) {
        alert(`Maximum ${MAX_EXTRA_ITEMS} extra items allowed.`);
        return;
      }

      const $template = $items.last();
      const $clone = $template.clone(false);

      $clone.find('.nav-quantity__input').val(1);
      $clone.find('.variant-info').text('');

      $clone.find('.nav-variant-radio')
        .prop('checked', false)
        .prop('disabled', false)
        .removeClass('disabled');

      $clone.find('.nav-variants-selector')
        .removeClass('disabled selected hidden-type')
        .show();

      const uid = Date.now() + Math.floor(Math.random() * 10000);

      $clone.find('fieldset.variant').each(function (fsIndex) {
        const $fs = $(this);
        const newName = `popup-variant-${uid}-${fsIndex}`;

        $fs.find('.nav-variant-radio').each(function (radioIndex) {
          const $radio = $(this);
          const newId = `${newName}-${radioIndex}`;
          const $sel = $radio.closest('.nav-variants-option').prev('.nav-variants-selector');
          if ($sel.length) $sel.attr('data-id', newId);
          $radio.attr({ id: newId, name: newName });
        });
      });

      $clone.append('<button type="button" class="btn-remove-item">Remove</button>');
      $template.after($clone);

      initPopupItem($clone, variants, $popup, false);
    });


    // ======================================================
    // REMOVE ITEM
    // ======================================================
    $(document).on('click', `${CART_SCOPE} .btn-remove-item`, function () {
      const $popup = $(this).closest('.product-update.popup-modal');
      const $items = $popup.find('.product-update-item');

      if ($items.length <= 1) return;
      $(this).closest('.product-update-item').remove();
    });


    // ======================================================
    // SAVE / APPLY CHANGES (merge identical variants)
    // ======================================================
    $(document).on('click', `${CART_SCOPE} .btn-main`, function (e) {
      e.preventDefault();

      const $popup = $(this).closest('.product-update.popup-modal');
      const variants = getPopupVariants($popup);
      const lineKey = $popup.data('line-key');

      if (!lineKey || !variants) return;

      const groups = {};
      $popup.find('.product-update-item').each(function () {
        const $item = $(this);
        const qty = parseInt($item.find('.nav-quantity__input').val(), 10) || 1;

        const variant = findVariantForItem($item, variants);
        if (!variant) return;

        if (!groups[variant.id]) groups[variant.id] = 0;
        groups[variant.id] += qty;
      });

      $popup.addClass('is-loading');

      getCartData()
        .done(function (cart) {
          const originalItem = findCartItemByKey(cart, lineKey);
          const originalVariantId = originalItem && originalItem.id;
          const updates = {};

          if (originalVariantId && Object.prototype.hasOwnProperty.call(groups, originalVariantId)) {
            updates[lineKey] = groups[originalVariantId];
            delete groups[originalVariantId];
          } else {
            updates[lineKey] = 0;
          }

          Object.keys(groups).forEach(function (variantId) {
            updates[variantId] = getCartQuantityByVariant(cart, variantId, lineKey) + groups[variantId];
          });

          $.ajax({
            type: 'POST',
            url: '/cart/update.js',
            dataType: 'json',
            data: { updates: updates },
            success() {
              $popup.removeClass('open is-loading');
              $('body').removeClass('no-scroll');
              if (window.refreshCart) refreshCart();
              if (window.refreshMainCart) refreshMainCart();
            },
            error() {
              $popup.removeClass('is-loading');
            }
          });
        })
        .fail(function () {
          $popup.removeClass('is-loading');
        });

    });


  }); // END CART_SCOPES LOOP


}); // END jQuery ready




$(document).ready(function () {
    if ($('.product-recommendations').length) {
      $('.product-recommendations .recommendation-slider').each(function () {
        let $section = $(this);
        let $sectionRecommendation = $('.collection-recommendation-section');

        new Swiper(this, {
          slidesPerView: 4,
          spaceBetween: 15,
          allowTouchMove: true,
          loop: true,
          navigation: {
            nextEl: $sectionRecommendation.find('.float-nav .owl-next')[0],
            prevEl: $sectionRecommendation.find('.float-nav .owl-prev')[0],
          },
          breakpoints: {
            1524: {
              slidesPerView: 4,
            },
            1024: {
              slidesPerView: 4,
            },
            768: {
              slidesPerView: 2,
            },
            0: {
              slidesPerView: 2,
            },
          },
        });
      });
    }
});



// function syncProductCardQuantities() {
//   fetch('/cart.js')
//     .then(response => response.json())
//     .then(cart => {
//       const productMap = {};

//       cart.items.forEach(item => {
//         const productId = String(item.product_id);
//         productMap[productId] = (productMap[productId] || 0) + item.quantity;
//       });

//       document.querySelectorAll('.product-item').forEach(card => {
//         const productId = card.getAttribute('data-product-id');
//         const badge = card.querySelector('.in-cart-badge');

//         if (!badge || !productId) return;

//         if (productMap[productId] > 0) {
//           badge.textContent = `In cart: ${productMap[productId]}`;
//           badge.style.display = 'inline-block';
//         } else {
//           badge.textContent = '';
//           badge.style.display = 'none';
//         }
//       });
//     })
//     .catch(error => {
//       console.error('Cart sync error:', error);
//     });
// }

// document.addEventListener('DOMContentLoaded', function () {
//   syncProductCardQuantities();
// });

$(document).ready(function() {

    if ($('.blog-featured-articles-section').length) {
        $('.blog-featured-articles-section .featured-article-slider').each(function () {
            let $section = $(this);

            new Swiper(this, {
                slidesPerView: 1.5,
                spaceBetween: 30,
                allowTouchMove: true,
                loop: true,
                centeredSlides:true,
                navigation: {
                    nextEl: $section.find('.float-nav .owl-next')[0],
                    prevEl: $section.find('.float-nav .owl-prev')[0],
                },
                pagination: {
                    el: $section.find('.swiper-pagination')[0],
                    clickable: true,
                },
                breakpoints: {
                    1724: {
                        slidesPerView: 1.8,
                        spaceBetween: 30,
                    },
                    1524: {
                        slidesPerView: 1.7,
                        spaceBetween: 30,
                    },
                    1024: {
                        slidesPerView: 1.5,
                        spaceBetween: 30,
                    },
                    768: {
                        slidesPerView: 1.2,
                        spaceBetween: 30,
                    },
                    0: {
                        slidesPerView: 1.1,
                        spaceBetween: 15,
                    },
                },
            });
        });
    }
});


(function () {
    function applySwatchFallbacks(root) {
        var scope = root || document;

        scope.querySelectorAll('.color-swatch, .variant-color-box').forEach(function (swatch) {
            var primary = swatch.getAttribute('data-swatch-primary');
            var secondary = swatch.getAttribute('data-swatch-secondary');

            if (!primary || swatch.dataset.swatchFallbackApplied === 'true') return;

            swatch.dataset.swatchFallbackApplied = 'true';

            var img = new Image();

            img.onload = function () {
                swatch.style.backgroundImage = 'url("' + primary + '")';
            };

            img.onerror = function () {
                if (secondary) {
                    swatch.style.backgroundImage = 'url("' + secondary + '")';
                }
            };

            img.src = primary;
        });
    }

    window.applySwatchFallbacks = applySwatchFallbacks;

    document.addEventListener('DOMContentLoaded', function () {
        applySwatchFallbacks(document);

        
    });

    window.addEventListener('load', function () {
        applySwatchFallbacks(document);
    });
})();

