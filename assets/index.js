$(function () { // shorthand for $(document).ready
    
    // Fade in product list sections
    document.querySelectorAll('.tab-product-list-section').forEach(function (section) {
      section.style.transition = 'opacity 0.6s ease';
      section.style.opacity = '1';
    });

    // Autoplay hero videos only after page load (prevents LCP delay)
    window.addEventListener('load', function () {

      // Handle hero videos inside banner slider
      document.querySelectorAll('.banner-slider video.hero-video[data-autoplay="true"]').forEach(function (video) {

        // Skip videos that are not visible (desktop/mobile duplicates)
        const isHidden =
          video.offsetParent === null ||
          video.closest('.d-none') ||
          window.getComputedStyle(video).display === 'none';

        if (isHidden) return;

        const playPromise = video.play();
        if (playPromise && playPromise.catch) {
          playPromise.catch(function () {});
        }

        video.classList.add('is-playing');
      });

      

    });


    // ---- Banner Slider v1 (Swiper) ----
    const $bannerSlider = $('.banner-slider:not(.v2)');

    if ($bannerSlider.length) {

      if (enabled_transparent_banner_slider) {
        const headerH =
          $('.header .header-wrapper').height() ||
          $('.header .header-wrapper-mobile').height() ||
          0;

        $bannerSlider.css('margin-top', `-${headerH}px`);
      }

      $bannerSlider.each(function () {
        const $section = $(this);
        const swiperEl = $section.find('.banner-swiper')[0];
        const $floatNav = $section.find('.float-nav');
        const $prevBtn = $floatNav.find('.owl-prev');
        const $nextBtn = $floatNav.find('.owl-next');
        const $dots = $floatNav.find('.owl-dots');
        const isAdaptiveHeight = $section.data('height-type') === 'adapt_image_height';

        // -------------------------------
        // Helpers
        // -------------------------------

        const pauseAllVideos = () => {
          $section.find('video.hero-video').each((_, v) => {
            try {
              v.pause();
              v.currentTime = 0;
            } catch (e) {}
            v.classList.remove('is-playing');
          });
        };

        const getVisibleVideo = slide => {
          const videos = slide.querySelectorAll('video.hero-video');
          let visibleVideo = null;

          videos.forEach(video => {
            const isVisible =
              video.offsetParent !== null &&
              window.getComputedStyle(video).display !== 'none';

            if (isVisible && !visibleVideo) {
              visibleVideo = video;
            }
          });

          return visibleVideo;
        };

        const refreshAdaptiveHeight = swiper => {
          if (!isAdaptiveHeight) return;

          requestAnimationFrame(() => {
            swiper.updateAutoHeight(0);
          });
        };

        const playActiveVideo = swiper => {
          pauseAllVideos();

          const activeSlide = swiper.slides[swiper.activeIndex];
          if (!activeSlide) return;

          const videoEl = getVisibleVideo(activeSlide);
          if (!videoEl) return;

          const playPromise = videoEl.play();
          if (playPromise && playPromise.catch) {
            playPromise.catch(() => {
              videoEl.muted = true;
              videoEl.play().catch(() => {});
            });
          }

          videoEl.classList.add('is-playing');
        };

        const updateArrowState = swiper => {
          if (enabled_banner_loop) {
            $prevBtn.prop('disabled', false).removeClass('is-disabled');
            $nextBtn.prop('disabled', false).removeClass('is-disabled');
            return;
          }

          $prevBtn
            .prop('disabled', swiper.isBeginning)
            .toggleClass('is-disabled', swiper.isBeginning);

          $nextBtn
            .prop('disabled', swiper.isEnd)
            .toggleClass('is-disabled', swiper.isEnd);
        };

        // -------------------------------
        // Swiper Init
        // -------------------------------
        const swiper = new Swiper(swiperEl, {
          slidesPerView: 1,
          speed: 800,
          loop: enabled_banner_loop,
          autoHeight: isAdaptiveHeight,
          allowTouchMove: true,
          watchSlidesProgress: true,

          pagination: {
            el: $dots[0],
            clickable: true,
            renderBullet: (index, className) => {
              return `
                <button
                  class="${className}"
                  type="button"
                  aria-label="Go to slide ${index + 1}">
                </button>
              `;
            }
          },

          on: {
            init(swiper) {
              updateArrowState(swiper);
              playActiveVideo(swiper);
              refreshAdaptiveHeight(swiper);
            },

            slideChange(swiper) {
              updateArrowState(swiper);
              playActiveVideo(swiper);
            },

            slideChangeTransitionEnd(swiper) {
              refreshAdaptiveHeight(swiper);
            }
          }
        });

        // -------------------------------
        // Manual Navigation
        // -------------------------------
        $prevBtn.on('click', () => swiper.slidePrev());
        $nextBtn.on('click', () => swiper.slideNext());

        // -------------------------------
        // Pause videos when tab inactive
        // -------------------------------
        document.addEventListener('visibilitychange', () => {
          if (document.hidden) {
            pauseAllVideos();
          }
        });

        // -------------------------------
        // Re-evaluate video on resize
        // (handles orientation changes)
        // -------------------------------
        let resizeTimeout;
        $(window).on('resize', () => {
          clearTimeout(resizeTimeout);
          resizeTimeout = setTimeout(() => {
            playActiveVideo(swiper);
            if (isAdaptiveHeight) swiper.updateAutoHeight(0);
          }, 200);
        });

      });
    }

  // ---- Generic Swiper Init Function ----
  const initSwiper = ($sections, options) => {
    $sections.each(function () {
      const $section = $(this);
      if ($section.data('swiperInit')) return;
      $section.data('swiperInit', true);

      const $slider = $section.find(options.sliderSelector);
      if (!$slider.length) return;

      const config = Object.assign({}, options.swiperOptions);
      const slideCount = $slider.find('.swiper-wrapper > .swiper-slide').length;

      const getActiveBreakpointConfig = () => {
        if (!config.breakpoints) return config;

        const activeWidth = window.innerWidth || document.documentElement.clientWidth || 0;
        const matched = Object.keys(config.breakpoints)
          .map(Number)
          .filter((bp) => !Number.isNaN(bp) && bp <= activeWidth)
          .sort((a, b) => b - a)[0];

        return matched !== undefined ? Object.assign({}, config, config.breakpoints[matched]) : config;
      };

      const activeConfig = getActiveBreakpointConfig();
      const slidesPerView = activeConfig.slidesPerView === 'auto'
        ? 1
        : Math.ceil(Number(activeConfig.slidesPerView) || 1);

      if (config.loop && slideCount <= slidesPerView) {
        config.loop = false;
      }

      if (options.navigation) {
        config.navigation = {
          nextEl: $section.find('.float-nav .owl-next')[0],
          prevEl: $section.find('.float-nav .owl-prev')[0]
        };
      }
      if (options.pagination) {
        const $pagination = $section.find('.swiper-pagination');
        if ($pagination.length) config.pagination = { el: $pagination[0], clickable: true };
      }

      new Swiper($slider[0], config);
    });
  };

  const initWhenVisible = ($sections, initFn, rootMargin = '300px 0px') => {
    if (!$sections.length) return;

    if (!('IntersectionObserver' in window)) {
      initFn($sections);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const $section = $(entry.target);
        observer.unobserve(entry.target);
        initFn($section);
      });
    }, { rootMargin });

    $sections.each(function () {
      observer.observe(this);
    });
  };

  // ---- Tab Product List ----
  initSwiper($('.tab-product-list-section .tab-container-item'), {
    sliderSelector: '.tab-product-list-slider',
    navigation: true,
    pagination: true,
    swiperOptions: {
      slidesPerView: 4,
      slidesPerGroup: 4,
      spaceBetween: 15,
      loop: true,
      loopAddBlankSlides: true,
      breakpoints: {
        1524: { slidesPerView: 4, slidesPerGroup: 4 },
        1024: { slidesPerView: 4, slidesPerGroup: 4 },
        768: { slidesPerView: 2, slidesPerGroup: 2 },
        0: { slidesPerView: 2, slidesPerGroup: 2 }
      }
    }
  });

  // ---- Featured Image Slider ----
  initWhenVisible($('.featured-image-slider-section'), ($sections) => {
    initSwiper($sections, {
      sliderSelector: '.featured-image-slider',
      navigation: true,
      pagination: true,
      swiperOptions: {
        slidesPerView: 3.2,
        spaceBetween: 15,
        loop: false,
        breakpoints: {
          1024: { slidesPerView: 3.2 },
          768: { slidesPerView: 2 },
          0: { slidesPerView: 1.2 }
        }
      }
    });
  });

// ---- Influencer Image Slider ----
initSwiper($('.influencer-slider-section'), {
  sliderSelector: '.featured-image-slider',
  navigation: true,
  pagination: true,
  swiperOptions: {
    slidesPerView: 4,
    spaceBetween: 18,
    loop: false,
    centeredSlides: false,

    breakpoints: {
      1024: { slidesPerView: 4, spaceBetween: 18, loop: false, centeredSlides: false },
      768:  { slidesPerView: 3, spaceBetween: 18, loop: false, centeredSlides: false },
      0:    { slidesPerView: 1.2, spaceBetween: 14, loop: true, centeredSlides: true, centeredSlidesBounds: true }
    },

    on: {
      // ✅ do NOT autoplay on init (per your requirement)
      init(swiper) {
        // optional: make sure nothing is playing on load
        stopAllVideos(swiper.el);
      },

      // ✅ when user slides: stop all, then on MOBILE autoplay active slide video (if exists)
      slideChangeTransitionStart(swiper) {
        stopAllVideos(swiper.el);
      },

      slideChangeTransitionEnd(swiper) {
        if (!isMobileBreakpoint(swiper)) return;

        // do NOT autoplay if this slide change wasn't triggered by user interaction
        // (extra safety; usually slideChange only happens after user swipe anyway)
        const touchDiff = swiper.touches && swiper.touches.diff;
        const mousewheelLastScrollTime = swiper.mousewheel && swiper.mousewheel.lastScrollTime;
        if (!touchDiff && !mousewheelLastScrollTime && !swiper.animating) {
          // still allow autoplay after swipe; this guard can be too strict on some setups
          // so we won't block here
        }

        playActiveSlideVideo(swiper);
      }
    }
  }
});

function isMobileBreakpoint(swiper) {
  // Swiper sets swiper.currentBreakpoint when breakpoints are used
  // It can be number (0/768/1024) or string depending on version.
  return String(swiper.currentBreakpoint) === '0';
}

function stopAllVideos(swiperEl) {
  const root = swiperEl instanceof HTMLElement ? swiperEl : document;

  root.querySelectorAll('video').forEach(v => {
    try {
      v.pause();
      v.currentTime = 0; // remove if you want resume instead of restart
    } catch (e) {}
  });
}

function playActiveSlideVideo(swiper) {
  const activeSlide = swiper.slides[swiper.activeIndex];
  if (!activeSlide) return;

  const v = activeSlide.querySelector('video');
  if (!v) return;

  // Make sure it's allowed to autoplay on mobile:
  // must be muted + playsinline, otherwise iOS will block it.
  v.muted = true;
  v.playsInline = true;
  v.setAttribute('muted', '');
  v.setAttribute('playsinline', '');

  // If your videos are lazy-loaded, ensure metadata is ready
  const tryPlay = () => {
    const p = v.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  };

  if (v.readyState >= 2) {
    tryPlay();
  } else {
    v.addEventListener('canplay', tryPlay, { once: true });
    if (v.load) {
      v.load();
    }
  }
}



  // ---- Half Banner Slider ----
  initWhenVisible($('.half-banner-slider-section'), ($sections) => {
    initSwiper($sections, {
      sliderSelector: '.half-banner-slider',
      navigation: true,
      pagination: true,
      swiperOptions: {
        slidesPerView: 1,
        spaceBetween: 10,
        loop: false
      }
    });
  });

  // ---- Logo Slider ----
  initSwiper($('.logo-slider-section'), {
    sliderSelector: '.logo-slider',
    navigation: false,
    swiperOptions: {
      slidesPerView: 'auto',
      spaceBetween: 30,
      loop: true,
      allowTouchMove: false,
      freeMode: true,
      freeModeMomentum: false,
      watchSlidesProgress: true,
      autoplay: {
        delay: 0,
        disableOnInteraction: false,
        pauseOnMouseEnter: false
      },
      speed: animation_scroll_speed,
      on: {
        init(swiper) {
          if (swiper.autoplay) swiper.autoplay.start();
        }
      }
    }
  });

  // ---- Instagram Gallery Slider ----
  initWhenVisible($('.instagram-gallery-slider-section'), ($sections) => {
    initSwiper($sections, {
      sliderSelector: '.instagram-gallery-slider',
      navigation: true,
      pagination: true,
      swiperOptions: {
        slidesPerView: 4.4,
        spaceBetween: 12,
        loop: true,
        centeredSlides: true,
        breakpoints: {
          1024: { slidesPerView: 4.4 },
          768: { slidesPerView: 2 },
          0: { slidesPerView: 1 }
        }
      }
    });
  }, '500px 0px');


  
});

$(document).ready(function () {
  venustas_mask();


if ($('.product-image-location-section').length) {

  function animateHotspots(swiper) {
    $(swiper.el).find('.hotspot-product-content').removeClass('is-in');

    const $activeSlide = $(swiper.slides[swiper.activeIndex]);
    const $items = $activeSlide.find('.hotspot-product-content');

    $items.each(function(i, el) {
      el.offsetHeight;
      setTimeout(function () {
        $(el).addClass('is-in');
      }, 50 + (i * 100));
    });
  }

  function buildProductListSlides(mainSwiper, productListSwiper) {
    const $activeSlide = $(mainSwiper.slides[mainSwiper.activeIndex]);

    // ONLY from active slide
    const $containers = $activeSlide.find('.product-hotspot-item .product-hotspot-item-container');

    const slidesHtml = [];

    $containers.each(function () {
      const $clone = $(this).clone(true, true);

      // show it
      $clone.css('display', '');

      // key from liquid: data-hotspot-key="{{ block.id }}"
      const key = $clone.attr('data-hotspot-key') || '';

      slidesHtml.push(
        `<div class="swiper-slide product-list-slide" data-hotspot-key="${key}">
          ${$clone.prop('outerHTML')}
        </div>`
      );
    });

    productListSwiper.removeAllSlides();
    if (slidesHtml.length) productListSwiper.appendSlide(slidesHtml);

    productListSwiper.update();
    productListSwiper.slideTo(0, 0);
  }

  $('.product-image-location-section').each(function () {
    var $section = $(this);

    var $main = $section.find('.featured-image-slider');
    var $pagination = $section.find('.swiper-pagination');

    var $productList = $section.find('.product-list-slider-container');
    var $productListWrapper = $productList.find('.swiper-wrapper');

    if (!$main.length) return;
    if (!$productList.length || !$productListWrapper.length) return;

    // ensure swiper container class
    $productList.addClass('swiper');

    // PRODUCT LIST SWIPER
    var productListSwiper = new Swiper($productList[0], {
      slidesPerView: 1,
      spaceBetween: 10,
      loop: false,
      navigation: {
        nextEl: $section.find('.float-nav .owl-next')[0],
        prevEl: $section.find('.float-nav .owl-prev')[0],
      },
      watchOverflow: true
    });

    // MAIN SWIPER
    var mainSwiper = new Swiper($main[0], {
      slidesPerView: 1,
      spaceBetween: 0,
      loop: false,
      pagination: {
        el: $pagination[0],
        clickable: true,
      },
      on: {
        init: function () {
          animateHotspots(this);
          buildProductListSlides(this, productListSwiper);

          // store refs
          $section.data('productListSwiper', productListSwiper);
        },
        slideChangeTransitionStart: function () {
          $(this.el).find('.hotspot-product-content').removeClass('is-in');
        },
        slideChangeTransitionEnd: function () {
          animateHotspots(this);
          buildProductListSlides(this, productListSwiper);
        }
      }
    });

    // HOTSPOT CLICK -> SLIDE PRODUCT LIST
    $section.on('click', '.spot', function (e) {
      // If user clicked a link/button (or anything explicitly clickable), let it work normally
      if ($(e.target).closest('a, button, input, select, textarea, label, [role="button"], .btn, .btn-explore-more').length) {
        return; // do NOT preventDefault / stopPropagation
      }

      // Otherwise, treat it as a hotspot click
      e.preventDefault();
      e.stopPropagation();

      const $spot = $(this); // .spot itself
      const key = $spot.attr('data-hotspot-key');
      if (!key) return;

      const listSwiper = $section.data('productListSwiper');
      if (!listSwiper) return;

      // find slide index by key
      const idx = Array.prototype.findIndex.call(listSwiper.slides, function (sl) {
        return sl.getAttribute('data-hotspot-key') === key;
      });

      if (idx >= 0) listSwiper.slideTo(idx);
    });


  });

    document.querySelectorAll('.product-image-location-section .variant-option-block').forEach(block => {
      const mainList = block.querySelector('ul.variant-colors:not(.variant-colors-dropdown)');
      const dropdownList = block.querySelector('ul.variant-colors.variant-colors-dropdown');
      const viewAllBtn = block.querySelector('.view-all-options-btn');

      if (!mainList) return;

      // move dropdown items into main list
      if (dropdownList) {
        dropdownList.querySelectorAll('li.variant-color-item').forEach(li => {
          mainList.appendChild(li);
        });
        dropdownList.remove();
      }

      // remove the view all button
      if (viewAllBtn) viewAllBtn.remove();
    });
    
    document.addEventListener('click', function (e) {
      const swatch = e.target.closest('.product-hotspot-item-container .variant-color-item');
      if (!swatch) return;

      const container = swatch.closest('.product-hotspot-item-container');
      if (!container) return;

      const variantId = swatch.getAttribute('data-color') || swatch.getAttribute('data-id');
      if (!variantId) return;

      // swatch active state (optional)
      const swatchList = swatch.closest('ul');
      if (swatchList) {
        swatchList.querySelectorAll('.variant-color-item').forEach(li => li.classList.remove('active', 'on'));
      }
      swatch.classList.add('active', 'on');

      // image switching
      const imagesWrap = container.querySelector('.product-image');
      if (!imagesWrap) return;

      const imgs = imagesWrap.querySelectorAll('img[data-variant]');
      if (!imgs.length) return;

      imgs.forEach(img => img.classList.remove('active'));

      // match exact variant
      let target = imagesWrap.querySelector(`img[data-variant="${CSS.escape(variantId)}"]`);

      // fallback: if no exact match, use the swatch's data-product-img and swap the currently active image src
      if (!target) {
        const fallbackUrl = swatch.getAttribute('data-product-img');
        const activeImg = imagesWrap.querySelector('img.active') || imgs[0];

        if (fallbackUrl && activeImg) {
          // keep srcset/sizes untouched unless you also store them
          activeImg.src = fallbackUrl;
          activeImg.classList.add('active');
        }
        return;
      }

      target.classList.add('active');
    });

}
  
});

$(window).on('scroll resize load', venustas_mask);

function venustas_mask() {
  if (!$('.venustas-mask').length) return;

  $('.venustas-mask').each(function () {
    const el = $(this);
    const videos = el.find('video');

    // =========================
    // Mask effect (your existing)
    // =========================
    const scrolled = visiblePercent(el) * 2;
    const mask = Math.min(Math.max(scrolled - 100, 0), 50);

    if (scrolled >= 90) {
      const scale = 100 + (mask * 5);
      const opacity = 1 - ((mask * 2) / 100);

      el.find('.sticky .mask, .sticky .mask-m').css({
        'background-size': `${scale}%`,
        'opacity': `${opacity}`
      });
    }

    // =========================
    // Video play/pause (your existing)
    // =========================
    if (scrolled >= 50) {
      videos.each(function () { this.play(); });
    } else {
      videos.each(function () {
        this.pause();
        this.currentTime = 0;
      });
    }

    // =========================
    // Fade-up trigger near bottom (custom, no AOS)
    // =========================
    const $w = $(window);
    const winTop = $w.scrollTop();
    const winH = $w.height();

    const sectionTop = el.offset().top;
    const sectionH = el.outerHeight();
    const endScroll = (sectionTop + sectionH) - winH;
    const total = endScroll - sectionTop;

    let progress = 0;
    if (total > 0) {
      progress = (winTop - sectionTop) / total; // 0..1
      progress = Math.max(0, Math.min(1, progress));
    } else {
      // short section fallback
      progress = (winTop + winH >= sectionTop + sectionH * 0.9) ? 1 : 0;
    }

    const addAt = 0.90;     // add at 90%
    const gap = 0.06;       // bigger gap = less flicker
    const removeAt = addAt - gap;

    const isActive = !!el.data('fadeActive');
    const shouldBeActive = progress >= addAt ? true : (progress <= removeAt ? false : isActive);

    if (shouldBeActive !== isActive) {
      el.data('fadeActive', shouldBeActive);
      el.find('.fadeup, .sticky').toggleClass('is-in', shouldBeActive);
    }
  });
}


document.addEventListener('click', function (e) {
  const section = e.target.closest('.influencer-slider-section');
  if (!section) return;

  const item = e.target.closest('.influencer-slider-section .featured-image-item');
  if (!item) return;

  // 1) Open state (toggle open to clicked; close others)
  section.querySelectorAll('.featured-image-item.open').forEach(el => {
    if (el !== item) el.classList.remove('open');
  });
  item.classList.add('open');

  // 2) Stop videos in other items
  section.querySelectorAll('.featured-image-item video').forEach(v => {
    if (!item.contains(v)) {
      v.pause();
      try { v.currentTime = 0; } catch (err) {}
    }
  });

  // 3) Play + try unmute video in clicked item (if any)
  const vid = item.querySelector('video');
  if (!vid) return;

  // If your HTML/video_tag sets muted, we can override on click:
  vid.muted = false;     // try unmute
  vid.volume = 1;        // ensure volume
  vid.playsInline = true;

  // Some videos might not be ready yet
  const tryPlay = () => {
    const p = vid.play();
    if (p && typeof p.catch === 'function') {
      p.catch(() => {
        // If browser blocks unmuted play, fallback to muted play
        vid.muted = true;
        const p2 = vid.play();
        if (p2 && typeof p2.catch === 'function') p2.catch(() => {});
      });
    }
  };

  // If metadata not loaded, wait then play
  if (vid.readyState < 2) {
    const onCanPlay = () => {
      vid.removeEventListener('canplay', onCanPlay);
      tryPlay();
    };
    vid.addEventListener('canplay', onCanPlay);
    // still attempt immediately
    tryPlay();
  } else {
    tryPlay();
  }
});
