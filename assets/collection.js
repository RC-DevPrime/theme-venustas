const $header = $('.shopify-section-group-header-group .header');
if($('.filter-list-container').length){
    
    const headerHeight = $header.outerHeight();
    $('.filter-list-container .sticky-filter').css('top', headerHeight + 50);
}

$(window).on('load resize', function () {
  const $header = $('.shopify-section-group-header-group .header');
  if ($header.length) {
    const headerHeight = $header.outerHeight();
    $('.filter-list-container .sticky-filter').css('top', headerHeight + 50);
  }
});

let isProgrammaticSortUpdate = false;

$(document).ready(function () {

  // ---------------------------
  // INIT: Price range sliders
  // ---------------------------
  function initPriceRangeSliders(root = document) {
    root.querySelectorAll(".filter-group-display__price-range").forEach((filterGroup) => {
      const rangeInput = filterGroup.querySelectorAll(".range-input input");
      const priceInput = filterGroup.querySelectorAll(".range-data input");
      const progress = filterGroup.querySelector(".slider .progress");
      if (!rangeInput.length || !priceInput.length || !progress) return;

      let priceGap = 1;

      let maxValue = parseInt(rangeInput[0].max || "0", 10);
      if (!maxValue) return;

      let progressMin = parseInt(rangeInput[0].value || "0", 10);
      let progressMax = parseInt(rangeInput[1].value || "0", 10);

      progress.style.left = `${(progressMin / maxValue) * 100}%`;
      progress.style.right = `${100 - ((progressMax / maxValue) * 100)}%`;

      priceInput.forEach((input) => {
        input.addEventListener("input", (e) => {
          let minPrice = parseInt(priceInput[0].value || "0", 10);
          let maxPrice = parseInt(priceInput[1].value || "0", 10);

          if (maxPrice - minPrice >= priceGap && maxPrice <= parseInt(rangeInput[1].max || "0", 10)) {
            if (e.target.classList.contains("input-min")) {
              rangeInput[0].value = minPrice;
              progress.style.left = (minPrice / maxValue) * 100 + "%";
            } else {
              rangeInput[1].value = maxPrice;
              progress.style.right = 100 - (maxPrice / maxValue) * 100 + "%";
            }
          }
        });
      });

      rangeInput.forEach((input) => {
        input.addEventListener("input", (e) => {
          let minVal = parseInt(rangeInput[0].value || "0", 10);
          let maxVal = parseInt(rangeInput[1].value || "0", 10);

          if (maxVal - minVal < priceGap) {
            if (e.target.classList.contains("range-min")) {
              rangeInput[0].value = maxVal - priceGap;
            } else {
              rangeInput[1].value = minVal + priceGap;
            }
          } else {
            priceInput[0].value = minVal;
            priceInput[1].value = maxVal;
            progress.style.left = (minVal / maxValue) * 100 + "%";
            progress.style.right = 100 - (maxVal / maxValue) * 100 + "%";
          }
        });
      });
    });
  }

  // ---------------------------
  // Active filter list helpers
  // ---------------------------
  function addFilterItem(id, labelText) {
    const $filterList = $('.filter-list-container-tab');
    if ($filterList.find('[data-id="' + id + '"]').length) return;

    const filterItem = `
      <div class="filter-item" data-id="${id}">
        <span class="pp-regular l-h-normal body-sm f-black">${labelText}</span>
        <div class="remove-filter" tabindex="0">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10">
            <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
      </div>
    `;
    $filterList.append(filterItem);
  }

  function rebuildFilterList() {
    $('.filter-list-container-tab .filter-item').remove();

    $('.filter-form.desktop input[type="checkbox"]:checked').each(function () {
      const $checkbox = $(this);
      const id = $checkbox.attr('id');
      const labelText = $checkbox.closest('label').clone().children().remove().end().text().trim();
      addFilterItem(id, labelText);
    });
  }

  // initial init
  initPriceRangeSliders(document);
  rebuildFilterList();

  // ---------------------------
  // Pagination click (delegated)
  // ---------------------------
  $(document).on('click', '.main-collection .paginate a', function (e) {
    e.preventDefault();
    const newUrl = $(this).attr('href');
    filterCollection(newUrl);

    $('html, body').animate({
      scrollTop: $('.main-collection').offset().top - 50
    }, 0);
  });

  // ---------------------------
  // Clear filters (delegated)
  // ---------------------------
  $(document).on('click', '.main-collection-section .clear-filter a', function (e) {
    e.preventDefault();

    const baseUrl = window.location.pathname;

    // Uncheck all checkboxes
    $('.filter-form input[type="checkbox"]').prop('checked', false);

    // Reset range sliders UI
    let maxValue = $('.range-min').attr('max') || 0;
    $('.range-min').val(0);
    $('.range-max').val(maxValue);
    $('.input-min').val(0);
    $('.input-max').val(maxValue);
    $('.slider .progress').css({ left: '0%', right: '0%' });

    // Clear active filter list UI
    $('.filter-list-container-tab .filter-item').remove();
    $('.main-collection-page .filter-counter-products').text('All');

    // Reset sort UI (DO NOT trigger handlers)
    const defaultSort = $('.sort-by.desktop select option:first').val() || '';
    isProgrammaticSortUpdate = true;
    $('.sort-by.desktop select, .sort-by.mobile select').val(defaultSort);
    $(`input[type="radio"][name="radio-sort"][value="${defaultSort}"]`).prop('checked', true);
    isProgrammaticSortUpdate = false;

    filterCollection(baseUrl);
  });

  /* =========================
     DESKTOP FILTER SUBMIT FLOW
  ========================== */

  // Trigger submit when any filter changes
  $(document).on('change', '.filter-form.desktop input', function () {
    $(this).closest('form').trigger('submit');
  });

  // Submit handler
  $(document).on('submit', '.filter-form.desktop', function (e) {
    e.preventDefault();

    const formData = $(this).serialize();
    const params = new URLSearchParams(formData);

    // Force sort to default (first option) when filters change
    const defaultSort = $('.sort-by.desktop select option:first').val();
    if (defaultSort) params.set('sort_by', defaultSort);

    const baseUrl = window.location.pathname;
    const newUrl = `${baseUrl}?${params.toString()}`;

    // Update sort UI WITHOUT triggering change handlers
    isProgrammaticSortUpdate = true;
    $('.sort-by.desktop select, .sort-by.mobile select').val(defaultSort);
    $(`input[type="radio"][name="radio-sort"][value="${defaultSort}"]`).prop('checked', true);
    isProgrammaticSortUpdate = false;

    filterCollection(newUrl);
  });

  // Desktop sort select change (delegated + guarded)
  $(document).on('change', '.sort-by.desktop select', function () {
    if (isProgrammaticSortUpdate) return;

    const url = new URL(window.location.href);
    url.searchParams.set("sort_by", $(this).val());
    filterCollection(url.toString());
  });

  // Active filter list add/remove (delegated)
  $(document).on('change', '.main-collection-section .filter-form.desktop input[type="checkbox"]', function () {
    const $checkbox = $(this);
    const labelText = $checkbox.closest('label').clone().children().remove().end().text().trim();
    const filterKey = $checkbox.attr('id');

    if ($checkbox.is(':checked')) {
      addFilterItem(filterKey, labelText);
    } else {
      $('.filter-list-container-tab').find('[data-id="' + filterKey + '"]').remove();
    }
  });

  // Remove filter item (delegated)
  $(document).on('click', '.filter-list-container-tab .remove-filter', function () {
    const $item = $(this).closest('.filter-item');
    const id = $item.data('id');
    const safeId = CSS.escape(id);
    const $checkbox = $('#' + safeId);

    if ($checkbox.length) {
      $checkbox.prop('checked', false).trigger('change');
    }
    $item.remove();
  });

  /* =========================
     MOBILE FILTERS
  ========================== */

  $(document).on('change', '.filter-form.mobile input', function () {
    $(this).closest('form').trigger('submit');

    // Reset mobile sort WITHOUT firing handlers
    const defaultSort = $('.sort-by.mobile select option:first').val() || '';
    isProgrammaticSortUpdate = true;
    $('.sort-by.mobile select').val(defaultSort);
    isProgrammaticSortUpdate = false;
  });

  $(document).on('submit', '.filter-form.mobile', function (e) {
    e.preventDefault();

    const formData = $(this).serialize();
    const baseUrl = window.location.pathname;
    const newUrl = `${baseUrl}?${formData}`;

    filterCollection(newUrl);
  });

  // Toggle filter overlay
  $(document).on('click', '.toggle-filter', function () {
    $('.filter-list-container').addClass('show');
    $('body').css('overflow-y', 'hidden');
  });

  $(document).on('click', '.main-collection .filter-list-container .overlay, .main-collection .filter-list-container .btn-mav-close', function () {
    $('.filter-list-container').removeClass('show');
    $('body').css('overflow-y', 'visible');
  });

  $(document).on('click', '.toggle-filter-close', function () {
    $('.mobile-filter-container').hide();
    $('body').css('overflow-y', 'visible');
  });


  
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
              spaceBetween: 10,
            },
          },
        });
      });
    }
});

// =========================
// FILTER COLLECTION (AJAX)
// =========================

/* =========================================================
   Helpers: Accordion state
========================================================= */
function getOpenAccordionIds($scope) {
  return $scope.find('.accordion-collapse.show').map(function () {
    return this.id;
  }).get();
}

function restoreAccordionState($scope, openIds) {
  $scope.find('.accordion-collapse').removeClass('show');
  $scope.find('.accordion-button').addClass('collapsed').attr('aria-expanded', 'false');

  openIds.forEach(function (id) {
    const $collapse = $scope.find('#' + CSS.escape(id));
    if (!$collapse.length) return;

    $collapse.addClass('show');

    const $btn = $scope.find(`[data-bs-target="#${CSS.escape(id)}"]`);
    $btn.removeClass('collapsed').attr('aria-expanded', 'true');
  });
}

/* =========================================================
   Helpers: Detect "real" filters
   - checkbox checked => real filter
   - price params only count if not full range
   - any other filter.* query param => real filter
========================================================= */
function hasRealFilters(urlObj, $scope) {
  // 1) Any checked checkbox
  if ($scope.find('input[type="checkbox"]:checked').length > 0) return true;

  // 2) Price filter: only real if not full range
  const hasPriceParam =
    urlObj.searchParams.has('filter.v.price.gte') ||
    urlObj.searchParams.has('filter.v.price.lte');

  if (hasPriceParam) {
    const gte = parseFloat(urlObj.searchParams.get('filter.v.price.gte') || 'NaN');
    const lte = parseFloat(urlObj.searchParams.get('filter.v.price.lte') || 'NaN');

    const minAttr = $scope.find('.filter-group-display__price-range .range-min').attr('min');
    const maxAttr = $scope.find('.filter-group-display__price-range .range-max').attr('max');

    const defaultMin = parseFloat(minAttr || '0');
    const defaultMax = parseFloat(maxAttr || 'NaN');

    const tol = 0.01;

    if (!Number.isNaN(defaultMax)) {
      const curMin = Number.isNaN(gte) ? defaultMin : gte;
      const curMax = Number.isNaN(lte) ? defaultMax : lte;

      const priceIsDefault =
        Math.abs(curMin - defaultMin) <= tol &&
        Math.abs(curMax - defaultMax) <= tol;

      if (!priceIsDefault) return true; // real price filter applied
    } else {
      // can't read max => treat as filter if any price param exists
      return true;
    }
  }

  // 3) Any other filter.* param besides price.*
  const keys = Array.from(urlObj.searchParams.keys());
  const hasOtherFilterParams = keys.some(
    (k) => k.startsWith('filter.') && !k.startsWith('filter.v.price.')
  );

  return hasOtherFilterParams;
}

/* =========================================================
   MAIN: AJAX filter reload
   - Keeps accordion open state
   - Counter:
       * no real filters => "All"
       * real filters + no products => "No products"
       * else => "X Results"
========================================================= */
function filterCollection(newUrl) {
  $.ajax({
    type: "GET",
    url: newUrl,
    success: function (data) {
      const $data = $(data);

      // ✅ Save accordion open state BEFORE replace
      const $currentFilter = $('.sticky-filter .filter-form');
      const openAccordionIds = getOpenAccordionIds($currentFilter);

      // ✅ Safe URL object (handles relative URLs too)
      const urlObj = new URL(newUrl, window.location.origin);

      // product count update
      $('.item-found span').html($data.find('.item-found span').html());

      // replace filter form html
      const $newForm = $data.find('.sticky-filter .filter-form');
      if ($newForm.length) {
        $('.sticky-filter .filter-form').html($newForm.html());
      }

      // ✅ Restore accordion open state AFTER replace
      const $newFilter = $('.sticky-filter .filter-form');
      restoreAccordionState($newFilter, openAccordionIds);

      // update product list
      const $newProductList = $data.find('.main-collection-product-list');
      const hasProducts = $newProductList.find('.products').length > 0;

      if (hasProducts) {
        $('.main-collection-product-list').html($newProductList.html());
      } else {
        $('.main-collection-product-list').html('<h3 class="pretitle-lg mt-bold f-black">No product found.</h3>');
      }

      if (window.applySwatchFallbacks) {
        window.applySwatchFallbacks(document.querySelector('.main-collection-product-list') || document);
      }

      // pagination show/hide
      if ($('.paginate').find('.page:not(.disable)').length > 0) $('.paginate').css('display', 'flex');
      else $('.paginate').css('display', 'none');

      // ✅ Counter logic (All / No products / X Results)
      const totalProductsRaw = $data.find('.collection-footer').data('product-count');
      const totalProducts = Number(totalProductsRaw);

      const realFilter = hasRealFilters(urlObj, $newFilter);
      
      console.log('total product here ', totalProducts)
      
      if (!realFilter) {
        $('.filter-counter-products').text('All');
      } else if (!hasProducts) {
        $('.main-collection-page .filter-counter-products').text('No products');
      } else if (!Number.isNaN(totalProducts)) {
        $('.main-collection-page .filter-counter-products').text(totalProducts + ' Results');
      } else {
        $('.filter-counter-products').text('Results');
      }

      // re-apply sort state from URL (don’t trigger handlers)
      const sortBy = urlObj.searchParams.get('sort_by');
      if (sortBy) {
        isProgrammaticSortUpdate = true;
        $('.sort-by.desktop select, .sort-by.mobile select').val(sortBy);
        $(`input[name="radio-sort"][value="${sortBy}"]`).prop('checked', true);
        isProgrammaticSortUpdate = false;
      }

      // optional re-init hook
      $(document).trigger('filters:refreshed');

      // ✅ Update URL LAST (prevents revert)
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, null, urlObj.pathname + urlObj.search);
      }
      document.dispatchEvent(new CustomEvent("swym:collections-loaded"));
    },
    error: function () {
      console.log("Error occurred while filtering products.");
    },
  });
}


// =========================
// RADIO SORT (delegated + guarded)
// =========================
$(document).on('change', 'input[type="radio"][name="radio-sort"]', function () {
  if (isProgrammaticSortUpdate) return;

  const selectedValue = this.value;

  isProgrammaticSortUpdate = true;
  $('.sort-by.mobile select, .sort-by.desktop select').val(selectedValue);
  isProgrammaticSortUpdate = false;

  const url = new URL(window.location.href);
  url.searchParams.set('sort_by', selectedValue);

  filterCollection(url.toString());

  if (this.checked) {
    const spanHtml = $(this).next('span').html();
    $('#heading-sortBy button span').html(`Sort By: ${spanHtml}`);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const contentSwiper = new Swiper(".content-swiper", {
    direction: "vertical",
    slidesPerView: 2.5,
    centeredSlides: true,
    speed: 700,
    spaceBetween: 50,
    allowTouchMove: false, // controlled by scroll
  });

  const section = document.querySelector(".collection-vertical-slider-section");
  const images = document.querySelectorAll(".image-slider-container .image-item");
  const totalSlides = images.length;

  document.addEventListener("scroll", function () {
    if (!section) return;

    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const scrollable = sectionHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY - sectionTop) / scrollable : 0;

    const clamped = Math.max(0, Math.min(1, progress));
    const index = Math.min(Math.floor(clamped * totalSlides), totalSlides - 1);

    // ✅ Update Swiper active slide
    contentSwiper.slideTo(index);

    // ✅ Crossfade left-side images
    images.forEach((img, i) => {
      img.style.opacity = i === index ? 1 : 0;
      img.style.transition = "opacity 0.6s ease";
    });
  });
});


$(document).on('click', '.load-more-btn', function (e) {
    e.preventDefault();

    const $btn = $(this);
    const nextUrl = $btn.data('next-url');
    if (!nextUrl) return;

    $btn.text('Loading...').prop('disabled', true);

    $.ajax({
        type: "GET",
        url: nextUrl,
        success: function (data) {
            const $data = $(data);

            // Get new products from next page
            const newProducts = $data.find('.main-collection-product-list .products');

            if (newProducts.length > 0) {
                // Append new products
                $('.main-collection-product-list .products-row').append(newProducts);

                if (window.applySwatchFallbacks) {
                    window.applySwatchFallbacks(document.querySelector('.main-collection-product-list .products-row') || document);
                }

                // --- Update product count ---
                const totalText = $data.find('.product-count-text').text();
                // Extract total number safely (last number)
                const totalMatch = totalText.match(/(\d+)\s*products?/i);
                const totalProducts = totalMatch ? parseInt(totalMatch[1], 10) : $('.main-collection-product-list .products').length;

                const currentCount = $('.main-collection-product-list .products').length;
                $('.current-range').text(`1–${currentCount}`);

                // Optional: console log
                console.log(`Loaded ${newProducts.length} items, showing ${currentCount} of ${totalProducts}`);
            }

            // --- Handle next page ---
            const nextUrlData = $data.find('.load-more-btn').data('next-url');
            if (nextUrlData) {
                $btn.data('next-url', nextUrlData).text('Load More').prop('disabled', false);
            } else {
                $btn.hide(); // no more pages
            }
            document.dispatchEvent(new CustomEvent("swym:collections-loaded"));
        },
        error: function () {
            console.error("Error loading more products.");
            $btn.text('Load More').prop('disabled', false);
        },
    });
});
if ($('.main-collection-page').length) {
    $(window).on('scroll', function() {
        const $btn = $('.load-more-btn:visible').last();
        if ($btn.length && !$btn.prop('disabled')) {
            const scrollBottom = $(window).scrollTop() + $(window).height();
            const listBottom = $('.main-collection-page .main-collection-product-list').offset().top + $('.main-collection-page .main-collection-product-list').outerHeight();
            
            // When user reaches near the end (e.g., within 150px)
            if (scrollBottom + 150 >= listBottom) {
                $btn.trigger('click');
            }
        }
    });
}

if ($('.collection-list-section').length) {
    $('.collection-list-section .collection-list-slider').each(function () {
        let $section = $(this);

        new Swiper(this, {
            slidesPerView: 2.15,
            spaceBetween: 10,
            allowTouchMove: true,
            loop: true,
            pagination: {
                el: $section.find('.swiper-pagination')[0],
                clickable: true,
            },
        });
    });
}

if ($('.collection-list-v2-section').length) {
    $('.collection-list-v2-section .collection-list-slider-v2').each(function () {
        let $section = $(this);

        new Swiper(this, {
            slidesPerView: 2.15,
            spaceBetween: 10,
            allowTouchMove: true,
            loop: true,
            pagination: {
                el: $section.find('.swiper-pagination')[0],
                clickable: true,
            },
        });
    });
}

if ($('.collection-vertical-slider-section').length) {
    $('.collection-vertical-slider-section .collection-vertical-slider').each(function () {
        let $section = $(this);

        new Swiper(this, {
            slidesPerView: 1,
            spaceBetween: 10,
            allowTouchMove: true,
            loop: true,
            autoHeight: true,
            navigation: {
                nextEl: $section.find('.float-nav .owl-next')[0],
                prevEl: $section.find('.float-nav .owl-prev')[0],
            },
            pagination: {
                el: $section.find('.swiper-pagination')[0],
                clickable: true,
            },
        });
    });
}



$('.filter-btn').click(function() {
  $('.filter-list-container').toggleClass('hide-filter');
  $('.product-list-container').toggleClass('col-lg-12 col-lg-9');
  $('.main-collection-product-list').toggleClass('max-height');
});



$(document).on('click', '.main-collection .clear-filter', function (e) {
    e.preventDefault();

    const baseUrl = window.location.pathname;

    // Uncheck all checkboxes
    $('.filter-form input[type="checkbox"]').prop('checked', false);

    // Reset price range sliders
    $('.filter-group-display__price-range').each(function () {
        const minInput = $(this).find('.range-min');
        const maxInput = $(this).find('.range-max');
        const inputMin = $(this).find('.input-min');
        const inputMax = $(this).find('.input-max');
        const progress = $(this).find('.slider .progress');

        const maxVal = parseFloat(maxInput.attr('max')) || 0;

        minInput.val(0);
        maxInput.val(maxVal);
        inputMin.val(0);
        inputMax.val(maxVal);
        progress.css({ left: '0%', right: '0%' });
    });

    // Clear active filter list
    $('.filter-list-container-tab .filter-item').remove();

    // Reset product counter
    $('.main-collection-page .filter-counter-products').text('All');

    // Reset sort dropdown WITHOUT triggering handlers
    const defaultSort = $('.sort-by select option:first').val() || '';
    isProgrammaticSortUpdate = true;
    $('.sort-by select').val(defaultSort);
    $(`input[type="radio"][name="radio-sort"][value="${defaultSort}"]`).prop('checked', true);
    isProgrammaticSortUpdate = false;

    // Trigger collection reload
    filterCollection(baseUrl);
});


