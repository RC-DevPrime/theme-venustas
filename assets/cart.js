$(document).ready(function () {
    
    if ($('.banner-link-slider-section').length) {
        $('.banner-link-slider-section').each(function () {
            var $section = $(this); // Each section
            var $slider = $section.find('.banner-link-slider-container'); // Slider inside this section

            new Swiper($slider[0], {
                slidesPerView: 3.4,
                spaceBetween: 12,
                allowTouchMove: true,
                loop: true,
                navigation: {
                    nextEl: $section.find('.float-nav .owl-next')[0],
                    prevEl: $section.find('.float-nav .owl-prev')[0],
                },
                breakpoints: {
                    1024: {
                        slidesPerView: 3.4,
                    },
                    768: {
                        slidesPerView: 2,
                    },
                    0: {
                        slidesPerView: 1.3,
                    },
                }
            });
        });
    }
    
    if ($('.cart-information-section').length) {
        // Hide all bodies initially
        $('.cart-information-section .accordion-body').hide();

        // Toggle accordion
        $('.cart-information-section .accordion-header').on('click', function () {

            const $item = $(this).closest('.accordion-item');
            const $body = $item.find('.accordion-body');
            const $icon = $(this).find('.accordion-icon');

            // If clicking an already open item → close it
            if ($item.hasClass('active')) {
                $item.removeClass('active');
                $body.slideUp(300);
                $icon.css('transform', 'rotate(0deg)');
                return;
            }

            // Close all others
            $('.accordion-item').removeClass('active');
            $('.accordion-body').slideUp(300);
            $('.accordion-icon').css('transform', 'rotate(0deg)');

            // Open the clicked one
            $item.addClass('active');
            $body.slideDown(300);
            $icon.css('transform', 'rotate(180deg)');
        });
        $('.cart-information-section .btn-learn-more').click(function(){
          $('.cart-information-section .cart-popup-information-section').addClass('open');
        })
    }

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


