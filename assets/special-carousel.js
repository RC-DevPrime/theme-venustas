/**
 * Shared mobile carousel (≤749px) for SD Who / Steps / Values.
 * Root: [data-sd-carousel="who"|"steps"|"values"]
 * data-autoplay="true|false", data-interval-ms — Who autoplay only
 * data-mobile-arrows="false" — hide prev/next (CSS + JS)
 */
(function (w) {
  var NS = '__sdCarouselV1';
  var MQ = 749;

  var PRESETS = {
    who: {
      viewport: '.sd-special-who__viewport',
      track: '.sd-special-who__grid',
      slide: '.sd-special-who__card',
      prev: '.sd-special-who__arrow--prev',
      next: '.sd-special-who__arrow--next',
      dots: '.sd-special-who__dots',
      dot: '.sd-special-who__dot',
      dotActiveClass: 'sd-special-who__dot--active',
    },
    steps: {
      viewport: '.sd-special-steps__viewport',
      track: '.sd-special-steps__row',
      slide: '.sd-special-steps__step',
      prev: '.sd-special-steps__arrow--prev',
      next: '.sd-special-steps__arrow--next',
      dots: '.sd-special-steps__dots',
      dot: '.sd-special-steps__dot',
      dotActiveClass: 'sd-special-steps__dot--active',
    },
    values: {
      viewport: '.sd-special-values__viewport',
      track: '.sd-special-values__grid',
      slide: '.sd-special-values__col',
      prev: '.sd-special-values__arrow--prev',
      next: '.sd-special-values__arrow--next',
      dots: '.sd-special-values__dots',
      dot: '.sd-special-values__dot',
      dotActiveClass: 'sd-special-values__dot--active',
    },
  };

  function q(root, sel) {
    return root.querySelector(sel);
  }

  function qa(root, sel) {
    return Array.prototype.slice.call(root.querySelectorAll(sel));
  }

  function initRoot(root) {
    if (!root || root.getAttribute('data-sd-carousel-bound') === '1') return;
    var kind = root.getAttribute('data-sd-carousel');
    var cfg = PRESETS[kind];
    if (!cfg) return;
    root.setAttribute('data-sd-carousel-bound', '1');

    var viewport = q(root, cfg.viewport);
    var track = q(root, cfg.track);
    var prev = q(root, cfg.prev);
    var next = q(root, cfg.next);
    if (!viewport || !track || !prev || !next) return;

    var dotsWrap = cfg.dots ? q(root, cfg.dots) : null;
    var dots = dotsWrap && cfg.dot ? qa(dotsWrap, cfg.dot) : [];
    var dotActiveClass = cfg.dotActiveClass || '';

    var index = 0;
    var timer = null;
    var enableAutoplay = root.getAttribute('data-autoplay') === 'true';
    var intervalMs = parseInt(root.getAttribute('data-interval-ms') || '5000', 10) || 5000;
    var showArrows = root.getAttribute('data-mobile-arrows') !== 'false';

    function isMobile() {
      return w.innerWidth <= MQ;
    }

    function slides() {
      return qa(track, cfg.slide);
    }

    function maxIndex() {
      return Math.max(0, slides().length - 1);
    }

    function stepWidth() {
      var list = slides();
      if (!list.length) return 0;
      var gapRaw = w.getComputedStyle(track).gap;
      var gap = parseFloat(gapRaw);
      if (!isFinite(gap)) gap = 0;
      var slideW = list[0].getBoundingClientRect().width;
      var vpW = viewport.clientWidth || 0;
      if (!slideW || slideW < 2) slideW = vpW;
      if (!slideW || slideW < 2) slideW = 320;
      var total = slideW + gap;
      if (!isFinite(total) || total <= 0) total = vpW || 320;
      return total;
    }

    function stopAuto() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    function startAuto() {
      stopAuto();
      if (!enableAutoplay || !isMobile() || slides().length <= 1) return;
      timer = setInterval(function () {
        var max = maxIndex();
        if (max <= 0) return;
        index = index >= max ? 0 : index + 1;
        update({ restartTimer: false });
      }, intervalMs);
    }

    function syncDots() {
      if (!dotActiveClass || !dots.length) return;
      dots.forEach(function (d, i) {
        d.classList.toggle(dotActiveClass, i === index);
      });
    }

    function update(opts) {
      opts = opts || {};
      var list = slides();
      if (!isMobile() || list.length <= 1) {
        stopAuto();
        track.style.transform = '';
        prev.style.display = 'none';
        next.style.display = 'none';
        prev.disabled = true;
        next.disabled = true;
        return;
      }
      var max = maxIndex();
      if (index > max) index = max;
      var sw = stepWidth();
      if (!isFinite(sw) || sw <= 0) sw = viewport.clientWidth || 320;
      track.style.transform = 'translateX(-' + index * sw + 'px)';
      if (showArrows) {
        prev.style.display = 'inline-flex';
        next.style.display = 'inline-flex';
        prev.disabled = false;
        next.disabled = false;
      } else {
        prev.style.display = 'none';
        next.style.display = 'none';
        prev.disabled = true;
        next.disabled = true;
      }
      syncDots();
      if (opts.restartTimer !== false) startAuto();
    }

    function nextSlide() {
      var max = maxIndex();
      if (max <= 0) return;
      index = index >= max ? 0 : index + 1;
      update();
    }

    prev.addEventListener('click', function () {
      stopAuto();
      var max = maxIndex();
      if (max <= 0) return;
      index = index <= 0 ? max : index - 1;
      update();
    });

    next.addEventListener('click', function () {
      stopAuto();
      nextSlide();
    });

    dots.forEach(function (d) {
      d.addEventListener('click', function () {
        stopAuto();
        var idx = parseInt(d.getAttribute('data-index'), 10);
        if (!isNaN(idx)) {
          index = idx;
          update();
        }
      });
    });

    var touchStartX = 0;
    var touchStartY = 0;
    var dragging = false;
    viewport.addEventListener(
      'touchstart',
      function (e) {
        if (!isMobile() || slides().length <= 1) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        dragging = true;
        stopAuto();
      },
      { passive: true }
    );
    viewport.addEventListener(
      'touchend',
      function (e) {
        if (!dragging) return;
        dragging = false;
        if (!isMobile() || slides().length <= 1) return;
        var dx = e.changedTouches[0].clientX - touchStartX;
        var dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
          if (dx < 0) nextSlide();
          else {
            var max = maxIndex();
            if (max > 0) index = index <= 0 ? max : index - 1;
            update();
          }
        } else {
          startAuto();
        }
      },
      { passive: true }
    );

    function onResize() {
      if (!isMobile()) index = 0;
      update();
    }

    w.addEventListener('resize', onResize);

    function onVis() {
      if (document.hidden) stopAuto();
      else update();
    }

    document.addEventListener('visibilitychange', onVis);

    update();
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        update();
      });
    });
  }

  function scan() {
    document.querySelectorAll('[data-sd-carousel]:not([data-sd-carousel-bound])').forEach(initRoot);
  }

  if (!w[NS]) {
    w[NS] = true;
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', scan);
    } else {
      scan();
    }
    document.addEventListener('shopify:section:load', scan);
  } else {
    scan();
  }
})(window);
