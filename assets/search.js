$(document).ready(function () {
    console.log('Search JS');

    if ($('.main-search-section').length) {
        
        $('.main-search-section .product-recommendations').each(function () {
            var $section = $(this); // Each section
            var $slider = $section.find('.recommendation-slider'); // Slider inside this section

            new Swiper($slider[0], {
                slidesPerView: 4,
                spaceBetween: 15,
                allowTouchMove: true,
                loop: true,
                navigation: {
                    nextEl: $section.find('.float-nav .owl-next')[0],
                    prevEl: $section.find('.float-nav .owl-prev')[0],
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

        
        $('.main-search-section .link-banner-container').each(function () {
            var $section = $(this); // Each section
            var $slider = $section.find('.link-banner-slider'); // Slider inside this section

            new Swiper($slider[0], {
                slidesPerView: 3,
                spaceBetween: 15,
                allowTouchMove: true,
                loop: true,
                navigation: {
                    nextEl: $section.find('.float-nav .owl-next')[0],
                    prevEl: $section.find('.float-nav .owl-prev')[0],
                },
                breakpoints: {
                    1524: {
                        slidesPerView: 3,
                    },
                    1024: {
                        slidesPerView: 2,
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

    $('.filter-btn').click(function() {
        $('.filter-list-container').toggleClass('hide-filter');
        $('.product-list-container').toggleClass('col-lg-12 col-lg-9');
        $('.main-collection-product-list').toggleClass('max-height');
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

});
