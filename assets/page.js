$(document).ready(function () {
    console.log('Page JS');

    if ($('.about-us-nav-section').length) {
        // about_us_nav_section();
        $('.about-us-nav-section .nav-item').click(function(){

            var targetAttr = $(this).attr('data-scroll');
            var $targetSection = $('.about-us-section-scroll[data-scroll="' + targetAttr + '"]').offset().top - 70;
            $("html, body").animate({
                scrollTop: $targetSection
            }, 1);
        });
    }
    
    if ($('.about-us-nav-section').length) {
        const navSection = document.querySelector('.about-us-nav-section');
        const footerSection = document.querySelector('.shopify-section-group-footer-group');

        if (!navSection || !footerSection) return;

        function checkFooterIntersection() {
            const footerRect = footerSection.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;

            // ✅ When footer touches or enters the viewport
            if (footerRect.top <= windowHeight && footerRect.bottom >= 0) {
            navSection.classList.add('footer-active');
            } else {
            navSection.classList.remove('footer-active');
            }
        }

        window.addEventListener('scroll', checkFooterIntersection);
        window.addEventListener('resize', checkFooterIntersection);
        checkFooterIntersection();
    }

    if ($('.about-us-banner-slider-section').length) {
        const section = document.querySelector('.about-us-banner-slider-section');
        const stickySlider = section.querySelector('.sticky-slider');
        const slides = section.querySelectorAll('.banner-item');

        const swiper = new Swiper('.about-us-banner-slider-section .main-banner-slider-container', {
            direction: 'vertical',
            slidesPerView: 1,
            spaceBetween: 0,
            mousewheel: false,
            speed: 1000,
            allowTouchMove: false,
            touchReleaseOnEdges: true,
            touchAngle: 20,
        });

        const totalSlides = swiper.slides.length;
        const allowance = window.innerHeight * 0.7;

        function getHeaderHeight() {
            const header = document.querySelector('.shopify-section-group-header-group .header');
            return header ? header.offsetHeight : 0;
        }

        function updateHeights() {
            console.log('here here here ')
            const headerHeight = getHeaderHeight();
            const adjustedHeight = window.innerHeight - headerHeight;

            if (stickySlider) {
            stickySlider.style.top = `${headerHeight}px`;
            stickySlider.style.height = `${adjustedHeight}px`;
            }

            slides.forEach(slide => {
            slide.style.height = `${adjustedHeight}px`;
            });
        }

        // ✅ init + resize
        updateHeights();
        window.addEventListener('resize', updateHeights);

        // ✅ react to header changes (announcement removed, etc.)
        window.addEventListener('header:heightchange', () => {
            // wait for layout to settle (slideUp changes height)
            requestAnimationFrame(() => {
            updateHeights();
            swiper.update(); // optional but helps when container height changes
            });
        });

        // ✅ scroll-driven slide logic
        window.addEventListener('scroll', () => {
            const rect = section.getBoundingClientRect();
            const totalScrollable = (section.offsetHeight - window.innerHeight) - allowance;
            const progress = Math.min(Math.max(-rect.top / totalScrollable, 0), 1);
            const slideIndex = Math.floor(progress * (totalSlides - 1));
            swiper.slideTo(slideIndex);
        });
    }


    if ($('.about-us-timeline-slider-section').length) {
        const section = document.querySelector('.about-us-timeline-slider-section');
        const stickySlider = section.querySelector('.sticky-slider');
        const slides = section.querySelectorAll('.banner-item');

        const swiper = new Swiper('.about-us-timeline-slider-section .timeline-slider-container', {
            direction: 'vertical',
            slidesPerView: 1,
            spaceBetween: 0,
            mousewheel: false,
            speed: 1000,
            allowTouchMove: false,
            touchReleaseOnEdges: true,
            touchAngle: 20, // vertical scroll allowed
            pagination: {
            el: section.querySelector('.swiper-pagination'),
            clickable: true,
            renderBullet: function (index, className) {
                const slide = section.querySelectorAll('.timeline-slider-container .swiper-slide')[index];
                const year = slide ? slide.getAttribute('timeline-year') : '';
                return `<span class="${className}"><div class="year-tag pp-regular f-white">${year}</div></span>`;
            }
            },
            on: {
                init: function () {
                    fadeTimelineContent(this.activeIndex);
                    resetTimelineScroll(this.activeIndex);
                },
                slideChange: function () {
                    fadeTimelineContent(this.activeIndex);
                    resetTimelineScroll(this.activeIndex);
                }
            }
        });

        const timelineContents = section.querySelectorAll('.content-timeline');

        function updateTimelineOverflowState(content) {
            if (!content) return;

            const overflowThreshold = 4;
            const hasOverflow = content.scrollHeight - content.clientHeight > overflowThreshold;
            const scrollBottom = content.scrollTop + content.clientHeight;
            const isAtBottom = content.scrollHeight - scrollBottom <= overflowThreshold;
            const isScrolled = content.scrollTop > overflowThreshold;

            content.classList.toggle('has-overflow', hasOverflow);
            content.classList.toggle('is-at-bottom', !hasOverflow || isAtBottom);
            content.classList.toggle('is-scrolled', isScrolled);
        }

        function updateAllTimelineOverflowStates() {
            timelineContents.forEach(updateTimelineOverflowState);
        }

        timelineContents.forEach(content => {
            content.addEventListener('scroll', () => updateTimelineOverflowState(content), { passive: true });
        });

        function resetTimelineScroll(activeIndex) {
            const slides = document.querySelectorAll(
                '.about-us-timeline-slider-section .timeline-slider-container .swiper-slide'
            );

            const activeSlide = slides[activeIndex];
            if (!activeSlide) return;

            const content = activeSlide.querySelector('.content-timeline');
            if (content) {
                content.scrollTop = 0;
                updateTimelineOverflowState(content);
            }
        }


        function fadeTimelineContent(activeIndex) {
            document.querySelectorAll('.timeline-content-container')
            .forEach(el => el.classList.remove('fade-in'));

            const activeSlide = document.querySelectorAll('.timeline-slider-container .swiper-slide')[activeIndex];
            const activeContent = activeSlide ? activeSlide.querySelector('.timeline-content-container') : null;

            if (activeContent) {
            setTimeout(() => {
                activeContent.classList.add('fade-in');
            }, 100);
            }
        }

        const totalSlides = swiper.slides.length;
        const allowance = window.innerHeight * 0.7; // bottom allowance for last slide

        // ✅ Better header height getter (updates correctly when announcement bar changes)
        function getHeaderHeight() {
            const header = document.querySelector('.shopify-section-group-header-group .header');
            return header ? header.getBoundingClientRect().height : 0;
        }

        // ✅ Updated heights logic (with guards + swiper.update)
        function updateHeights() {
            const headerHeight = getHeaderHeight();
            const adjustedHeight = window.innerHeight - headerHeight;

            if (stickySlider) {
            stickySlider.style.top = `${headerHeight}px`;
            stickySlider.style.height = `${adjustedHeight}px`;
            }

            if (slides && slides.length) {
            slides.forEach(slide => {
                slide.style.height = `${adjustedHeight}px`;
            });
            }

            swiper.update();
            requestAnimationFrame(updateAllTimelineOverflowStates);
        }

        // ✅ Initialize + update on resize
        updateHeights();
        updateAllTimelineOverflowStates();
        window.addEventListener('resize', updateHeights);

        // ✅ Update when announcement/header height changes (your event)
        window.addEventListener('header:heightchange', () => {
            requestAnimationFrame(() => {
            requestAnimationFrame(updateHeights);
            });
        });

        // ✅ Scroll-driven slide logic
        window.addEventListener('scroll', () => {
            const rect = section.getBoundingClientRect();
            const totalScrollable = (section.offsetHeight - window.innerHeight) - allowance;
            const progress = Math.min(Math.max(-rect.top / totalScrollable, 0), 1);
            const slideIndex = Math.floor(progress * (totalSlides - 1));
            swiper.slideTo(slideIndex);
        });

        // ✅ Pagination visibility logic
        const sectionEl = document.querySelector('.about-us-timeline-slider-section');
        const pagEl = sectionEl.querySelector('.swiper-pagination-timeline');

        function handleTimelineVisibility50() {
            if (!sectionEl || !pagEl) return;

            const rect = sectionEl.getBoundingClientRect();
            const windowH = window.innerHeight;

            // 50vh range start and end boundaries
            const rangeStart = windowH * 0.90;
            const rangeEnd = windowH * 0.55;

            if (rect.top < rangeEnd && rect.bottom > rangeStart) {
            pagEl.classList.add('visible-pagination-timeline');
            } else {
            pagEl.classList.remove('visible-pagination-timeline');
            }
        }

        window.addEventListener('scroll', handleTimelineVisibility50);
        handleTimelineVisibility50();
    }


    if ($('.about-us-banner-with-content-slider-section').length) {
        const $sections = $('.about-us-banner-with-content-slider-section');
        const $timeline = $('.about-us-timeline-slider-section');

        // ✅ Create container structure with sticky-slider
        const $container = $(`
            <div class="about-us-banner-with-content-container-list-slider">
            <div class="sticky-slider">
                <div class="banner-slider-container">
                <div class="swiper-wrapper"></div>
                </div>
            </div>
            </div>
        `);

        // ✅ Move all sections into the swiper-wrapper
        $sections.appendTo($container.find('.swiper-wrapper'));

        // ✅ Place the container after timeline or before first section
        if ($timeline.length) {
            $timeline.after($container);
        } else {
            $sections.first().before($container);
        }

        // ✅ Calculate and apply height like calc(100vh * X)
        const totalSlides = $sections.length;
        $container.css('height', `calc(100vh * ${totalSlides})`);

        // ✅ Swiper + sticky scroll setup
        const section = document.querySelector('.about-us-banner-with-content-container-list-slider');
        const stickySlider = section ? section.querySelector('.sticky-slider') : null;
        const slides = section ? section.querySelectorAll('.about-us-banner-with-content-slider-section') : [];

        const swiper = new Swiper('.about-us-banner-with-content-container-list-slider .banner-slider-container', {
            direction: 'vertical',
            slidesPerView: 1,
            spaceBetween: 0,
            mousewheel: false,
            speed: 1000,
            allowTouchMove: false,
            touchReleaseOnEdges: true,
            touchAngle: 20,
        });

        const allowance = window.innerHeight * 0.7; // bottom allowance for last slide

        // ✅ Better header height getter (updates correctly when announcement bar changes)
        function getHeaderHeight() {
            const header = document.querySelector('.shopify-section-group-header-group .header');
            return header ? header.getBoundingClientRect().height : 0;
        }

        // ✅ Updated heights logic (with guards + swiper.update)
        function updateHeights() {
            const headerHeight = getHeaderHeight();
            const adjustedHeight = window.innerHeight - headerHeight;

            if (stickySlider) {
            stickySlider.style.top = `${headerHeight}px`;
            stickySlider.style.height = `${adjustedHeight}px`;
            }

            if (slides && slides.length) {
            slides.forEach(slide => {
                slide.style.height = `${adjustedHeight}px`;
            });
            }

            swiper.update();
        }

        // ✅ Initialize + resize
        updateHeights();
        window.addEventListener('resize', updateHeights);

        // ✅ Update when announcement/header height changes (your event)
        window.addEventListener('header:heightchange', () => {
            requestAnimationFrame(() => {
            requestAnimationFrame(updateHeights);
            });
        });

        // ✅ Scroll-driven slide logic
        window.addEventListener('scroll', () => {
            if (!section) return;

            const rect = section.getBoundingClientRect();
            const totalScrollable = (section.offsetHeight - window.innerHeight) - allowance;

            // avoid divide-by-zero
            if (totalScrollable <= 0) return;

            const progress = Math.min(Math.max(-rect.top / totalScrollable, 0), 1);
            const slideIndex = Math.floor(progress * (totalSlides - 1));
            swiper.slideTo(slideIndex);
        });

        // ✅ Move modals to body
        $('.content-slider-modal').each(function () {
            $(this).appendTo('body');
        });

        // ✅ Init modal swipers (avoid double init)
        $('.content-slider-modal').each(function () {
            const $modal = $(this);
            const $swiperContainer = $modal.find('.content-slider-dynamic');

            if ($swiperContainer.length && !$swiperContainer.hasClass('swiper-initialized')) {
            const modalSwiper = new Swiper($swiperContainer[0], {
                slidesPerView: 'auto',
                spaceBetween: 30,
                loop: false,
                centeredSlides: false,
                navigation: {
                nextEl: $modal.find('.owl-next')[0],
                prevEl: $modal.find('.owl-prev')[0],
                },
                on: {
                init(swiper) {
                    handleVideoPlayback(swiper);
                },
                slideChange(swiper) {
                    handleVideoPlayback(swiper);
                },
                },
                breakpoints: {
                1524: { spaceBetween: 30 },
                1024: { spaceBetween: 25 },
                768: { spaceBetween: 20 },
                0: { spaceBetween: 15 },
                },
            });

            $modal.data('swiper-instance', modalSwiper);
            }
        });

        // ✅ Handle video play/pause based on active or next slide
        function handleVideoPlayback(swiperInst) {
            $(swiperInst.slides).each(function () {
            const $slide = $(this);
            const video = $slide.find('video').get(0);

            if (video) {
                if ($slide.hasClass('swiper-slide-active') || $slide.hasClass('swiper-slide-next')) {
                // video.play().catch(() => {});
                } else {
                // video.pause();
                // video.currentTime = 0;
                }
            }
            });
        }

        // ✅ Open modal
        $(document).on('click', '.btn-learn-more', function () {
            const modalId = $(this).data('tab-modal');
            const $modal = $('.content-slider-modal[data-tab-modal="' + modalId + '"]');

            if ($modal.length) {
            $modal.addClass('open');
            $('body').addClass('modal-open');

            setTimeout(() => {
                const modalSwiper = $modal.data('swiper-instance');
                if (modalSwiper) {
                modalSwiper.update();
                modalSwiper.slideTo(0, 0);
                }
            }, 400);
            }
        });

        // ✅ Close modal
        $(document).on('click', '.btn-close-content-modal', function () {
            const $modal = $(this).closest('.content-slider-modal');
            $modal.removeClass('open');
            $('body').removeClass('no-scroll');
        });
    }
    
    // CAMPAIGN JS
    
    if ($('.campaign-featured-events-section').length) {
        $('.campaign-featured-events-section .event-list-container-slider').each(function () {
            let $section = $(this);
            let $sectionRecommendation = $('.campaign-featured-events-section');

            new Swiper(this, {
            slidesPerView: 3,
            spaceBetween: 35,
            allowTouchMove: true,
            loop: true,
            pagination: {
                el: $sectionRecommendation.find('.swiper-pagination')[0],
                clickable: true,
            },
            navigation: {
                nextEl: $sectionRecommendation.find('.float-nav .owl-next')[0],
                prevEl: $sectionRecommendation.find('.float-nav .owl-prev')[0],
            },
            breakpoints: {
                1524: {
                slidesPerView: 3,
                spaceBetween: 35,
                },
                1024: {
                slidesPerView: 3,
                spaceBetween: 35,
                },
                768: {
                slidesPerView: 2,
                spaceBetween: 20,
                },
                0: {
                slidesPerView: 1.1,
                centeredSlides:true,
                spaceBetween: 15,
                },
            },
            });
        });
    }

    if ($('.campaign-flash-sale-section').length) {
        $('.campaign-flash-sale-section .limited-time-offer-slider').each(function () {
            let $section = $(this);
            let $sectionRecommendation = $('.campaign-flash-sale-section');

            new Swiper(this, {
                slidesPerView: 2,
                spaceBetween: 20,
                allowTouchMove: true,
                loop: true,
                navigation: {
                    nextEl: $sectionRecommendation.find('.float-nav .owl-next')[0],
                    prevEl: $sectionRecommendation.find('.float-nav .owl-prev')[0],
                },
                breakpoints: {
                    1524: {
                        slidesPerView: 2,
                        spaceBetween: 15,
                    },
                    1024: {
                        slidesPerView: 2,
                        spaceBetween: 15,
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 15,
                    },
                    0: {
                        slidesPerView: 2,
                        spaceBetween: 10,
                    },
                },
            });
        });
    }

    if ($('.large-scale-promotion-container').length) {
        $('.large-scale-promotion-container .large-scale-promotion-slider').each(function () {
            let $section = $(this);
            let $sectionRecommendation = $('.large-scale-promotion-container');

            new Swiper(this, {
                slidesPerView: 4,
                spaceBetween: 15,
                allowTouchMove: true,
                loop: true,
                navigation: {
                    nextEl: $sectionRecommendation.find('.float-nav .owl-next')[0],
                    prevEl: $sectionRecommendation.find('.float-nav .owl-prev')[0],
                },
                pagination: {
                    el: $sectionRecommendation.find('.swiper-pagination')[0],
                    clickable: true,
                },
                breakpoints: {
                    1524: {
                        slidesPerView: 4,
                        spaceBetween: 15,
                    },
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 15,
                    },
                    768: {
                        slidesPerView: 2,
                        spaceBetween: 10,
                    },
                    0: {
                        slidesPerView: 2,
                        spaceBetween: 10,
                    },
                },
            });
        });
    }

    if ($('.campaign-tab-product-list-section').length) {
        const itemsDefault = 8;
        const itemsPerClick = 4;

        const desktopMQ = window.matchMedia('(min-width: 768px)'); // md+

        // -------- DESKTOP: Load more logic only --------
        function initDesktopLoadMore() {
            if (!desktopMQ.matches) return;

            $('.campaign-tab-product-list-section .tab-content-item .desktop-content').each(function () {
            const $desktop = $(this);
            const $items = $desktop.find('.tab-product-container');
            const $btn = $desktop.find('.btn-load-more');

            // reset state
            $items.hide().slice(0, itemsDefault).show();

            if ($items.length <= itemsDefault) $btn.hide();
            else $btn.show();

            // prevent double binding
            $btn.off('click.desktopLoadMore').on('click.desktopLoadMore', function () {
                loadMoreDesktop($desktop, $items, $btn);
            });
            });

            // Auto load more on scroll (DESKTOP ONLY)
            $(window)
            .off('scroll.desktopLoadMore')
            .on('scroll.desktopLoadMore', function () {
                if (!desktopMQ.matches) return;

                const $activeTab = $('.campaign-tab-product-list-section .tab-content-item.open');
                if (!$activeTab.length) return;

                const $desktop = $activeTab.find('.desktop-content');
                if (!$desktop.length) return;

                const $items = $desktop.find('.tab-product-container');
                const $btn = $desktop.find('.btn-load-more');

                const windowBottom = $(window).scrollTop() + $(window).height();
                const tabBottom = $activeTab.offset().top + $activeTab.outerHeight();

                if (windowBottom >= tabBottom - 100 && $btn.is(':visible')) {
                loadMoreDesktop($desktop, $items, $btn);
                }
            });
        }

        function loadMoreDesktop($desktop, $items, $btn) {
            const visibleCount = $desktop.find('.tab-product-container:visible').length;
            $items.slice(visibleCount, visibleCount + itemsPerClick).fadeIn();

            if ($items.length <= visibleCount + itemsPerClick) {
            $btn.fadeOut();
            }
        }

        // -------- MOBILE: Swiper only --------
        function initMobileSwipers() {
            if (desktopMQ.matches) return; // only init on mobile

            $('.campaign-tab-product-list-section .tab-content-item .mobile-content .tab-mobile-swiper').each(function () {
            const el = this;
            const $swiper = $(el);
            const $tab = $swiper.closest('.tab-content-item');

            // prevent double init
            if ($swiper.hasClass('swiper-initialized')) return;

            const swiperInstance = new Swiper(el, {
                slidesPerView: 2,
                spaceBetween: 10,
                allowTouchMove: true,
                loop: false,
                watchOverflow: true,

                navigation: {
                nextEl: $tab.find('.float-nav .owl-next')[0],
                prevEl: $tab.find('.float-nav .owl-prev')[0],
                },

                breakpoints: {
                0:   { slidesPerView: 2, spaceBetween: 10 },
                768: { slidesPerView: 2, spaceBetween: 10 }, // still ok if someone rotates
                1024:{ slidesPerView: 3, spaceBetween: 15 },
                },
            });

            // store instance for later update
            $swiper.data('swiperInstance', swiperInstance);
            });
        }

        // -------- TAB switching --------
        $('.campaign-tab-product-list-section .tab-list-container span').off('click.tabSwitch').on('click.tabSwitch', function () {
            const tabId = $(this).attr('tab-id');

            $('.campaign-tab-product-list-section .tab-list-container span').removeClass('active');
            $(this).addClass('active');

            $('.campaign-tab-product-list-section .tab-content-item').removeClass('open').hide();
            const $target = $(`.campaign-tab-product-list-section .tab-content-item[tab-id="${tabId}"]`);
            $target.addClass('open').fadeIn();

            // Desktop: reset pagination ONLY inside desktop-content
            if (desktopMQ.matches) {
            const $desktop = $target.find('.desktop-content');
            const $items = $desktop.find('.tab-product-container');
            const $btn = $desktop.find('.btn-load-more');

            $items.hide().slice(0, itemsDefault).show();
            if ($items.length > itemsDefault) $btn.show();
            else $btn.hide();
            } else {
            // Mobile: update swiper ONLY
            const $swiper = $target.find('.tab-mobile-swiper');
            const inst = $swiper.data('swiperInstance');
            if (inst) {
                inst.update();
                inst.slideTo(0, 0); // optional: reset to start
            }
            }
        });

        // Initial run
        initDesktopLoadMore();
        initMobileSwipers();

        // Re-run when resizing across breakpoints
        $(window).on('resize', function () {
            initDesktopLoadMore();
            initMobileSwipers();
        });
    }


    if ($('.campaign-gift-list-slider-section').length) {

        const $accordion = $('.custom-accordion-container');

        $accordion.find('.accordion-label').on('click', function() {
            const $clickedItem = $(this).closest('.custom-accordion-item');
            const $activeItem = $accordion.find('.custom-accordion-item.active');

            // If clicking the already active item — do nothing
            if ($clickedItem.is($activeItem)) return;

            // Close previous active content with animation
            $activeItem
            .removeClass('active')
            .find('.accordion-content')
            .stop(true, true)
            .animate({ opacity: 0, height: 0 }, 500, function() {
                $(this).hide(); // Hide after animation
            });

            // Open the clicked one with fade + slide animation
            const $newContent = $clickedItem.find('.accordion-content');
            $clickedItem.addClass('active');
            $newContent
            .show()
            .css({ opacity: 0, height: 'auto' }); // reset
            const newHeight = $newContent.height();
            $newContent
            .height(0)
            .animate({ opacity: 1, height: newHeight }, 600, function() {
                $(this).height('auto'); // reset height after animation
            });
        });
    }



    if ($('.page-header-nav-section').length) {
        
        // $('.page-header-nav-section').each(function () {

        //     // Get the top offset of the .product-header-section
        //     var productHeaderTop = $('.page-header-nav-section').offset().top + 150;
        //     var scrollPosition = $(window).scrollTop();

        //     // Check the scroll position
        //     if ($(window).scrollTop() >= productHeaderTop) {
        //         // Make the .product-header-section sticky
        //         $('.main-container-holder').addClass('product-header-sticky');
        //         // Hide the header
        //         $('nav.header').addClass('header-hide');
        //     } else {
        //         // Remove the sticky class when scrolling above the section
        //         $('.main-container-holder').removeClass('product-header-sticky');
        //         // Show the header again
        //         $('nav.header').removeClass('header-hide');
        //     }
            

        // });
    }

    if ($('.campaign-sale-steps-section').length) {
        $('.campaign-sale-steps-section .sale-product-slider').each(function () {
            let $section = $(this);
            let $sectionRecommendation = $('.campaign-sale-steps-section');

            new Swiper(this, {
                slidesPerView: 2,
                spaceBetween: 15,
                allowTouchMove: true,
                loop: true,
                navigation: {
                    nextEl: $sectionRecommendation.find('.float-nav .owl-next')[0],
                    prevEl: $sectionRecommendation.find('.float-nav .owl-prev')[0],
                },
                pagination: {
                    el: $sectionRecommendation.find('.swiper-pagination')[0],
                    clickable: true,
                },
                breakpoints: {
                    1524: {
                        slidesPerView: 2,
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
    


    // AMBASSADOR JS
    
    if ($('.ambassador-banner-main-section').length) {
        $('.ambassador-banner-main-section').each(function () {
            var container = $(this);
            $(this).find('.btn-join-banner').click(function(){
                container.find('.banner-join-section').addClass('open')
            });
        });
    }

    if ($('.ambassador-tab-list-section').length) {

        // Tab switching
        $('.ambassador-tab-list-section .tab-item').on('click', function() {
            var selectedTab = $(this).data('tab');

            $('.ambassador-tab-list-section .tab-item').removeClass('active');
            $(this).addClass('active');

            $('.ambassador-tab-list-section .tab-content-item')
                .hide()
                .removeClass('active');

            const $target = $('.ambassador-tab-list-section .tab-content-item[data-tab="' + selectedTab + '"]');
            $target.fadeIn(200).addClass('active');

            // Fade-up all visible items inside this tab
            fadeUpItems($target.find('.tab-ambassador-item'));
        });

        // Initialize
        const $default = $('.ambassador-tab-list-section .tab-content-item[data-tab="us"]');
        $('.ambassador-tab-list-section .tab-content-item').hide();
        $default.show().addClass('active');
        fadeUpItems($default.find('.tab-ambassador-item'));

        // Load More logic
        const increment = 4;
        const $btn = $('.load-more-canada');
        const $items = $('.ambassador-tab-list-section .tab-ambassador-item');

        $btn.on('click', function() {
            const $hidden = $items.filter(':hidden');

            // reveal items
            $hidden.slice(0, increment).slideDown(0).each(function(i) {
                let item = $(this);
                setTimeout(function() {
                    item.addClass('visible');
                }, i * 120); // stagger
            });

            if ($hidden.length <= increment) {
                $btn.fadeOut();
            }
        });

        // Helper function for fade-up on tab switch
        function fadeUpItems($list) {
            $list.removeClass('visible').each(function(i) {
                let item = $(this);
                setTimeout(function() {
                    item.addClass('visible');
                }, i * 120); // stagger animation
            });
        }
    }

    
    if ($('.ambassador-video-slider-section').length) {
        $('.ambassador-video-slider-section .ambassador-video-slider').each(function () {
            let $slider = $(this);
            let $section = $('.ambassador-video-slider-section');

            const swiper = new Swiper(this, {
                slidesPerView: 4,
                spaceBetween: 20,
                allowTouchMove: true,
                loop: true,
                navigation: {
                    nextEl: $section.find('.float-nav .owl-next')[0],
                    prevEl: $section.find('.float-nav .owl-prev')[0],
                },
                pagination: {
                    el: $section.find('.swiper-pagination')[0],
                    clickable: true,
                },
                breakpoints: {
                    1524: { slidesPerView: 4, spaceBetween: 15 },
                    1024: { slidesPerView: 3, spaceBetween: 15 },
                    768:  { slidesPerView: 2, spaceBetween: 15 },
                    0:    { slidesPerView: 1.3, spaceBetween: 15, centeredSlides: true },
                },
                on: {
                    // Stop all videos when the slide changes
                    slideChange: function () {
                        $slider.find('video').each(function () {
                            this.pause();
                            this.currentTime = 0; // reset
                            $(this).siblings('.play-button-icon').show(); // show button again
                        });
                    },
                },
            });

            // When play button is clicked
            $slider.find('.ambassador-item .play-button-icon').on('click', function () {
                const $item = $(this).closest('.ambassador-item');
                const $video = $item.find('video')[0];

                if ($video) {
                    // Pause and reset all other videos
                    $slider.find('video').each(function () {
                        if (this !== $video) {
                            this.pause();
                            this.currentTime = 0;
                            $(this).siblings('.play-button-icon').show();
                        }
                    });

                    // User gesture: unmute so playback includes audio (video_tag starts muted for autoplay policy compatibility)
                    $video.muted = false;
                    // Play this video and hide button
                    $video.play();
                    $(this).hide();
                }
            });

            // When video itself is clicked
            $slider.find('.ambassador-item video').on('click', function () {
                if (!this.paused) {
                    this.pause();
                    $(this).siblings('.play-button-icon').show();
                }
            });
        });
    }


    if ($('.ambassador-top-list-section').length) {
        $('.ambassador-top-list-section .top-list-slider-container').each(function () {
            let $section = $(this);
            let $sectionRecommendation = $('.ambassador-top-list-section');

            new Swiper(this, {
                slidesPerView: 1.7,
                spaceBetween: 30,
                centeredSlides:true,
                allowTouchMove: false,
                loop: true,
                navigation: {
                    nextEl: $sectionRecommendation.find('.float-nav .owl-next')[0],
                    prevEl: $sectionRecommendation.find('.float-nav .owl-prev')[0],
                },
                pagination: {
                    el: $sectionRecommendation.find('.swiper-pagination')[0],
                    clickable: true,
                },
            });
        });
    }

    if ($('.text-policy-content-section').length) {
        function adjustStickyNav() {
            const headerHeight = $('.shopify-section-group-header-group .header').outerHeight();
            $('.text-policy-content-section .sticky-nav').css('top', `${headerHeight + 30 }px`);
        }

        // Run on page load
        adjustStickyNav();

        // Run on resize
        $(window).on('resize', function() {
            adjustStickyNav();
        });

        if ($('.text-policy-content-section .text-policy-content .powr-form-builder').length > 0) {
            // Append the button after it
            $('.powr-form-builder').after(`
            <button class="btn-hover btn-main py-2">
                <span class="pp-semibold body f-white">Warranty Claim</span>
            </button>
            `);
        }

        $('.text-policy-content-section .warranty-claim-btn').click(function(){
            $('.text-policy-content-section .warranty-claim-modal').addClass('open');
            $('body').addClass('modal-open');
        })

        $('.text-policy-content-section .warranty-registration-btn').click(function(){
            $('.text-policy-content-section .register-warranty-modal').addClass('open');
            $('body').addClass('modal-open');
        })
    }
    
    if ($('.text-policy-content-section').length) {
        const $nav = $('.mobile-toc-nav');
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


    
    if ($('.main-press-content-section').length) {


        // When a tab is clicked
        $('.main-press-content-section .tab-item').on('click', function() {
            var selectedTab = $(this).data('tab');

            // Remove active class from all tabs
            $('.main-press-content-section .tab-item').removeClass('active');
            // Add active class to clicked tab
            $(this).addClass('active');

            // Hide all tab content
            $('.main-press-content-section .tab-content-item').hide().removeClass('active');
            // Show the matching content
            $('.main-press-content-section .tab-content-item[data-tab="' + selectedTab + '"]').fadeIn(200).addClass('active');
        });
    }

    if ($('.reward-event-slider-section').length) {
    }


    if ($('.reward-event-slider-section').length) {
        $('.reward-event-slider-section').each(function () { 
            const $section = $(this);
            const sliderEl = $section.find('.reward-slider-event-container')[0]; // DOM element

            if (!sliderEl) return;

            const paginationEl = $section.find('.swiper-pagination')[0];

            new Swiper(sliderEl, {
                slidesPerView: 1,
                spaceBetween: 0,
                allowTouchMove: true,
                loop: true,
                breakpoints: {
                    1524: { slidesPerView: 1, spaceBetween: 0 },
                    1024: { slidesPerView: 1, spaceBetween: 0 },
                    768:  { slidesPerView: 1, spaceBetween: 0 },
                    0:    { slidesPerView: 1.1, spaceBetween: 15 },
                },
                navigation: {
                    nextEl: $section.find('.float-nav .owl-next')[0],
                    prevEl: $section.find('.float-nav .owl-prev')[0],
                },
                pagination: {
                    el: paginationEl,
                    clickable: true,
                },
            });
        });
    }

    if ($('.reward-redeem-points-list-section').length) {
        $('.reward-redeem-points-list-section').each(function () {
            var $section = $(this); // Each section
            var $slider = $section.find('.redeem-points-list-slider'); // Slider inside this section
            var $pagination = $section.find('.swiper-pagination'); // Pagination inside this section

            new Swiper($slider[0], {
                slidesPerView: 1.2,
                spaceBetween: 15,
                centeredSlides: true,
                loop:false,  
                initialSlide: 1, // 🔥 Load second slide by default
                navigation: {
                    nextEl: $section.find('.float-nav .owl-next')[0],
                    prevEl: $section.find('.float-nav .owl-prev')[0],
                },
                pagination: {
                    el: $pagination[0],
                    clickable: true,
                },
            });
        });
    }

    if ($('.reward-benefits-section').length) {

        // When clicking on tab item
        $('.reward-benefits-section .tab-item').on('click', function () {

            let target = $(this).attr('tab-content-data');

            // Remove active class from all tabs
            $('.reward-benefits-section .tab-item').removeClass('active');

            // Add active to selected tab
            $(this).addClass('active');

            // Hide all tab contents
            $('.reward-benefits-section .tab-content-item').hide();

            // Target content
            let $targetContent = $('.reward-benefits-section .tab-content-item[tab-content-data="' + target + '"]');

            // Prepare fade-up styles
            $targetContent
                .css({
                    opacity: 0,
                    transform: 'translateY(20px)',
                    display: 'block'
                });

            // Animate fade-up
            setTimeout(function () {
                $targetContent.animate(
                    { opacity: 1, top: 0 },
                    {
                        duration: 300,
                        step: function (now, fx) {
                            // Smooth upward movement
                            if (fx.prop === "opacity") {
                                $(this).css('transform', 'translateY(' + (20 - 20 * now) + 'px)');
                            }
                        }
                    }
                );
            }, 10);

        });


        $('.reward-benefits-section .reward-item').each(function () {
            var $container = $(this);
            $container.find('.btn-rules').click(function(){
                $container.find('.rules-modal').addClass('open');
                $('body').addClass('no-scroll');
            });
        });

    }

    if ($('.reward-heatwave-points-section').length) {
        $('.reward-heatwave-points-section').each(function () {
            var $container = $(this);
            $container.find('.section-btn-rules').click(function(){
                $container.find('.heatwave-points-rules-modal').addClass('open');
                $('body').addClass('no-scroll');
            });
        });

    }

    if ($('.premium-selections-image-content-slider-section').length) {
        $('.premium-selections-image-content-slider-section').each(function () {

            let $section = $(this);
            let $slider = $section.find('.premium-selections-image-slider');
            let $pagination = $section.find('.swiper-pagination');

            let nextBtn = $section.find('.float-nav .owl-next').get(0);
            let prevBtn = $section.find('.float-nav .owl-prev').get(0);


            new Swiper($slider.get(0), {
                slidesPerView: 1,
                spaceBetween: 15,
                centeredSlides: true,
                loop: true,
                breakpoints: {
                    0: { slidesPerView: 1 },
                    768: { slidesPerView: 1 },
                    1024: { slidesPerView: 1 },
                    1524: { slidesPerView: 1 }
                },

                navigation: nextBtn && prevBtn ? {
                    nextEl: nextBtn,
                    prevEl: prevBtn,
                } : {},

                pagination: {
                    el: $pagination.get(0),
                    clickable: true,
                },
            });

        });
    }


    
    if ($('.premium-selections-tab-title-section').length) {
        $('.premium-selections-tab-title-section').each(function () {
            var $section = $(this); // Each section
            var $tab = $section.find('.tab-list-container'); // Slider inside this section

            $tab.find('.tab-list-item').click(function(){
                $section.find('.tab-list-item').removeClass('active');
                $(this).addClass('active');

                $section.find('.tab-image-list .tab-image-item').removeClass('active');
                $section.find('.tab-image-list .tab-image-item[data-tab-item="' + $(this).data('tab-item') + '"]').addClass('active');

            });

        });
    }

    if ($('.premium-selection-icon-list-section').length) {
        $('.premium-selection-icon-list-section').each(function () {
            var $section = $(this); // Each section
            var $slider = $section.find('.icon-list-slider-container'); // Slider inside this section
            var $pagination = $section.find('.swiper-pagination'); // Pagination inside this section

            new Swiper($slider[0], {
                slidesPerView: 1,
                spaceBetween: 18,
                centeredSlides: false,
                loop:true,  
                pagination: {
                    el: $pagination[0],
                    clickable: true,
                },
            });
        });
    }
    
    if ($('.premium-selections-featured-image-section').length) {
        $('.premium-selections-featured-image-section').each(function () {
            var $section = $(this); // Each section
            var $featured_image = $section.find('.featured-image-container'); // Slider inside this section

            $featured_image.find('.btn-view').click(function(){
                $featured_image.toggleClass('active');

            });

        });
    }
    

    if ($('.faqs-section').length) {
        let $faqItems = $("#faqAccordion .accordion-item");
        let $loadMoreBtn = $(".loadMoreFaqbtn");

        let visibleCount = 4; // default visible FAQs

        if ($loadMoreBtn.length) {
            $loadMoreBtn.on("click", function () {
                console.log("Click detected");
                let revealed = 0;

                $faqItems.each(function (index) {
                    if (index >= visibleCount && revealed < 4) {
                        console.log("Revealing item:", index);
                        $(this).removeClass("d-none").css("display", ""); // ✅ force show
                        revealed++;
                    }
                });

                visibleCount += revealed;

                // Hide button when all FAQs are visible
                if (visibleCount >= $faqItems.length) {
                    console.log("All items revealed, hiding button");
                    $loadMoreBtn.hide();
                }
            });
        }
    }

        
    if ($('.product-quiz-section').length) {
        $('.product-quiz-section').each(function () {
            let $section = $(this);

            const sliderEl = $section.find('.quiz-recommendation-slider')[0];
            const nextBtn = $section.find('.float-nav .owl-next')[0];
            const prevBtn = $section.find('.float-nav .owl-prev')[0];

            if (!sliderEl) {
                console.error("Slider element not found in section:", $section);
                return;
            }

            new Swiper(sliderEl, {
                slidesPerView: 4,
                spaceBetween: 15,
                allowTouchMove: true,
                loop: true,
                navigation: {
                    nextEl: nextBtn,
                    prevEl: prevBtn,
                },
                breakpoints: {
                    1524: { slidesPerView: 4 },
                    1024: { slidesPerView: 3 },
                    768: { slidesPerView: 2 },
                    0: { slidesPerView: 1.3 },
                },
            });
        });

    }

    page_nav_header_scroll()

});

$(window).scroll(function() {
    // about_us_nav_section();
    page_nav_header_scroll();
    
});

let aboutNav_lastMain = null;
let aboutNav_lastChild = null;
let aboutNav_ticking = false;

function aboutNav_getHeaderOffset() {
  const headerH = $('.shopify-section-group-header-group .header').outerHeight() || 0;
  const stickyTopRaw = $('.sticky-slider').first().css('top');
  const stickyTop = parseInt(stickyTopRaw, 10);
  const stickyH = Number.isFinite(stickyTop) ? stickyTop : 0;
  return Math.max(headerH, stickyH, 0) + 10;
}

function aboutNav_setActive(mainKey, childKey) {
  const $nav = $('.about-us-nav-section .nav-list-container');
  if (!$nav.length) return;

  const $items = $nav.find('.nav-item');
  $items.removeClass('active');

  let $main = $();
  let $child = $();

  if (mainKey) $main = $items.filter(`[data-scroll="${mainKey}"]`).addClass('active');
  if (childKey) $child = $items.filter(`[data-scroll="${childKey}"]`).addClass('active');

  if (mainKey && mainKey !== aboutNav_lastMain) {
    $main[0]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }
  if (childKey && childKey !== aboutNav_lastChild) {
    $child[0]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }

  aboutNav_lastMain = mainKey || null;
  aboutNav_lastChild = childKey || null;
}

/* ------------------------------------------
   IMPORTANT RULE:
   If sticky slider is inside a SECTION wrapper
   that already has data-scroll, do NOT treat it
   as "slide-key switching".
------------------------------------------ */
function aboutNav_isInsideKeyedSectionWrapper($sticky) {
  // This will match your timeline wrapper:
  // .about-us-timeline-slider-section.about-us-section-scroll[data-scroll="our-story"]
  const $wrapperKey = $sticky.closest('.about-us-section-scroll[data-scroll]');
  return $wrapperKey.length > 0;
}

/* ---------- detect sticky containers that use slide keys ---------- */
function aboutNav_findStickyKeyContainer($sticky) {
  // Skip section 2 (timeline) or any slider section that already has data-scroll on wrapper
  if (aboutNav_isInsideKeyedSectionWrapper($sticky)) return null;

  const vh = window.innerHeight;
  let $node = $sticky.parent();

  while ($node.length && !$node.is('body') && !$node.is('html')) {
    const keyCount = $node.find('.about-us-section-scroll[data-scroll]').length;
    const h = $node.outerHeight();

    // Must have 2+ keys (means keys are on slides), and scroll container height is bigger than viewport
    if (keyCount >= 2 && h > vh * 1.2) return $node;

    $node = $node.parent();
  }

  return null;
}

function aboutNav_getAllStickyKeyContainers() {
  const containers = [];
  const seen = new Set();

  $('.sticky-slider').each(function () {
    const $c = aboutNav_findStickyKeyContainer($(this));
    if ($c && $c.length) {
      const el = $c.get(0);
      if (!seen.has(el)) {
        seen.add(el);
        containers.push($c);
      }
    }
  });

  return containers;
}

/* ---------- 1) Active from sticky slide-key containers (section 1 & 3) ---------- */
function aboutNav_getActiveFromStickySlideKeyContainers() {
  const containers = aboutNav_getAllStickyKeyContainers();
  if (!containers.length) return null;

  const scrollTop = $(window).scrollTop() + aboutNav_getHeaderOffset();
  const vh = window.innerHeight;

  for (let i = 0; i < containers.length; i++) {
    const $wrap = containers[i];
    const top = $wrap.offset().top;
    const height = $wrap.outerHeight();

    const start = top;
    const end = top + Math.max(1, height - vh);

    // IMPORTANT: strict range (avoid overlap with next section)
    if (scrollTop >= start && scrollTop <= end) {
      const $keys = $wrap.find('.about-us-section-scroll[data-scroll]');
      const total = $keys.length;
      if (!total) return null;

      let p = (scrollTop - start) / (end - start);
      p = Math.max(0, Math.min(1, p));

      const index = Math.max(0, Math.min(total - 1, Math.round(p * (total - 1))));
      const $active = $keys.eq(index);

      return {
        mainKey: $active.attr('data-scroll') || null,
        childKey: $active.attr('data-child-scroll') || null
      };
    }
  }

  return null;
}

/* ---------- 2) Active from normal sections (section wrapper has data-scroll) ---------- */
function aboutNav_getActiveFromNormalSections() {
  const headerOffset = aboutNav_getHeaderOffset();

  // Only sections where data-scroll is on the wrapper (timeline / other sections)
  // This includes your Section 2: .about-us-timeline-slider-section.about-us-section-scroll[data-scroll="our-story"]
  const $sections = $('.about-us-section-scroll[data-scroll]').filter(function () {
    // Exclude slide-key sections that are inside the sticky slide-key containers
    // (so section 1 & 3 don't double-trigger here)
    return $(this).closest('.sticky-slider').length === 0;
  });

  if (!$sections.length) return null;

  let found = null;

  $sections.each(function () {
    const rect = this.getBoundingClientRect();
    if (rect.top <= headerOffset && rect.bottom > headerOffset) {
      found = {
        mainKey: $(this).attr('data-scroll') || null,
        childKey: $(this).attr('data-child-scroll') || null
      };
      return false;
    }
  });

  if (!found) {
    let bestEl = null;
    let bestTop = -Infinity;

    $sections.each(function () {
      const rect = this.getBoundingClientRect();
      if (rect.top <= headerOffset && rect.top > bestTop) {
        bestTop = rect.top;
        bestEl = this;
      }
    });

    if (bestEl) {
      found = {
        mainKey: $(bestEl).attr('data-scroll') || null,
        childKey: $(bestEl).attr('data-child-scroll') || null
      };
    }
  }

  return found;
}

function about_us_nav_section() {
  if (aboutNav_ticking) return;
  aboutNav_ticking = true;

  requestAnimationFrame(() => {
    // Priority 1: sections where slide has data-scroll (section 1 & 3)
    const stickyActive = aboutNav_getActiveFromStickySlideKeyContainers();
    if (stickyActive && stickyActive.mainKey) {
      if (stickyActive.mainKey !== aboutNav_lastMain || stickyActive.childKey !== aboutNav_lastChild) {
        aboutNav_setActive(stickyActive.mainKey, stickyActive.childKey);
      }
      aboutNav_ticking = false;
      return;
    }

    // Priority 2: keyed section wrapper (section 2 timeline)
    const normalActive = aboutNav_getActiveFromNormalSections();
    if (normalActive && normalActive.mainKey) {
      if (normalActive.mainKey !== aboutNav_lastMain || normalActive.childKey !== aboutNav_lastChild) {
        aboutNav_setActive(normalActive.mainKey, normalActive.childKey);
      }
    }

    aboutNav_ticking = false;
  });
}

$(window).on('scroll resize', about_us_nav_section);
$(document).ready(about_us_nav_section);

$(document).ready(function () {
  if (!$('.ambassador-profile-information-display-section').length) return;

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

    if ($slider.length && !$slider[0].swiper) {
      new Swiper($slider[0], {
        slidesPerView: 1,
        spaceBetween: 10,
        loop: false,
        pagination: {
          el: $section.find('.swiper-pagination-mansonry')[0],
          clickable: true
        }
      });
    }

    if ($sliderMobile.length && !$sliderMobile[0].swiper) {
      new Swiper($sliderMobile[0], {
        slidesPerView: 1.1,
        spaceBetween: 14,
        centeredSlides: true,
        loop: false,
        observer: true,
        observeParents: true,
        navigation: {
          nextEl: $mobileNext[0],
          prevEl: $mobilePrev[0]
        },
        pagination: {
          el: $mobilePagination[0],
          clickable: true
        }
      });
    }
  });

  var modalSwipers = [];

  $('.mansonry-slider.popup-modal').each(function (index) {
    var $modal = $(this);
    var $slider = $modal.find('.ambassador-gallery-modal-slider');
    var $pagination = $modal.find('.swiper-pagination');

    if (!$slider.length || $slider[0].swiper) {
      modalSwipers[index] = $slider.length ? $slider[0].swiper : null;
      return;
    }

    modalSwipers[index] = new Swiper($slider[0], {
      slidesPerView: 1,
      spaceBetween: 10,
      loop: false,
      navigation: {
        nextEl: $modal.find('.float-nav .owl-next')[0],
        prevEl: $modal.find('.float-nav .owl-prev')[0]
      },
      pagination: {
        el: $pagination[0],
        clickable: true
      },
      on: {
        slideChange: function () {
          pauseAmbassadorModalVideos($modal);
        }
      }
    });
  });

  $(document).on('click', '.ambassador-profile-information-display-section .masonry-item, .ambassador-profile-information-display-section .gallery-mobile-slider .gallery-item', function (event) {
    event.preventDefault();

    var $modal = getAmbassadorModal($(this));
    var slideNumber = Number($(this).data('slide-item'));
    var indexToGo = Math.max(slideNumber - 1, 0);
    var modalIndex = $('.mansonry-slider.popup-modal').index($modal);
    var modalSwiper = modalSwipers[modalIndex] || ($modal.find('.ambassador-gallery-modal-slider')[0] && $modal.find('.ambassador-gallery-modal-slider')[0].swiper);

    $modal.addClass('open');
    $('body').addClass('no-scroll');

    if (modalSwiper) {
      modalSwiper.update();
      modalSwiper.slideTo(indexToGo, 0);
    }
  });

  $(document).on('click', '.ambassador-profile-information-display-section .masonry-item .media-link, .ambassador-profile-information-display-section .gallery-mobile-slider .gallery-item .media-link', function (event) {
    event.preventDefault();
    event.stopPropagation();
    $(this).closest('.masonry-item, .gallery-item').trigger('click');
  });

  $(document).on('click', '.mansonry-slider.popup-modal .popup-close, .mansonry-slider.popup-modal .popup-overlay', function () {
    pauseAmbassadorModalVideos($(this).closest('.mansonry-slider.popup-modal'));
  });
});





function page_nav_header_scroll(){
  if ($('.page-header-nav-section').length) {
      $('.page-header-nav-section').each(function () {

        // Get the top offset of the .product-header-section
        var productHeaderTop = $('.page-header-nav-section').offset().top + 50;
        var scrollPosition = $(window).scrollTop();

        // Check the scroll position
        if ($(window).scrollTop() >= productHeaderTop) {
            // Make the .product-header-section sticky
            $('.main-nav-header-section').addClass('product-header-sticky');
            // Hide the header
            $('nav.header').addClass('header-hide');
        } else {
            // Remove the sticky class when scrolling above the section
            $('.main-nav-header-section').removeClass('product-header-sticky');
            // Show the header again
            $('nav.header').removeClass('header-hide');
        }


        $('.main-container-holder span').on('click', function(e) {
            e.preventDefault();

            var targetAttr = $(this).attr('data-scroll');
            var $target = $('.section-scroll[data-scroll="' + targetAttr + '"]');

            if ($target.length) {
                var targetTop = $target.offset().top - 10; // adjust offset for fixed header
                $('html, body').stop().animate({ scrollTop: targetTop }, 600, 'swing');
            } else {
                console.warn('Section not found for data-scroll:', targetAttr);
            }
        });


      });

    

      $(".section-scroll").each(function() {
          var sectionTop = $(this).offset().top - 100;
          var sectionBottom = sectionTop + $(this).outerHeight();
          var scrollPosition = $(window).scrollTop();
          
          var targetButton = $('.page-header-nav-section .main-container-holder span[data-scroll="' + $(this).attr('data-scroll') + '"]');
      
          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
              targetButton.addClass("active");
              
              // Check if the section has a data-child-scroll attribute
              var childScroll = $(this).attr("data-child-scroll");
              if (childScroll) {
                  $('.page-header-nav-section .main-container-holder span[data-scroll="' + childScroll + '"]').addClass("active");
              }
              scrollActiveLinkIntoViewPage()
          } else {
              if (!$(this).attr("data-child-scroll")) {
                  targetButton.removeClass("active");
              }
          }
      });
  }
}   
 function scrollActiveLinkIntoViewPage() {
    if (!$('.main-nav-header-section').hasClass('product-header-sticky')) return;
    const $activeLink = $('.main-container-holder .nav-item.active');
    if ($activeLink.length) {
        $activeLink[0].scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
        });
    }
}
