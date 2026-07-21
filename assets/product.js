var wSize = $(window).outerWidth();
var hSize = $(window).innerHeight();

var sliderThumbs;
var sliderImages;
var gallerySlider;

var headerHeight = $('.shopify-section-group-header-group .header').outerHeight();

$(document).ready(function() {
    if ($('.product').length) {
        
        $('.sticky-top').css('top', headerHeight + 25 + 'px');

        if (wSize >= 1280) {
            $('.thumbnail-slider.mobile').remove();
        }
        else {
            $('.thumbnail-slider.desktop').remove();
        }

        sliderThumbs = new Swiper(".thumbnail-slider", {
            direction: "vertical",
            slidesPerView: 7,
            spaceBetween: 10,
            speed: 1500,
            freeMode: true,
            watchSlidesProgress: true,
            breakpoints: {
                0: {
                    direction: "horizontal",
                    slidesPerView: 5,
                    spaceBetween: 6,
                    speed: 1000,
                },
                1280: {
                    direction: "vertical"
                }
            },
            on: {
                init: function () {
                    // Delay 100ms (adjust as needed)
                        $('.thumbnail-slider').removeClass('slider-hidden');
                }
            }
        });


        // MAIN SLIDER

        sliderImages = new Swiper('.main-slider', {
            direction: 'horizontal',
            slidesPerView: 1,
            spaceBetween: 0,
            speed: 1000,
            grabCursor: true,

            navigation: {
                nextEl: '.slider-next',
                prevEl: '.slider-prev'
            },

            thumbs: {
                swiper: sliderThumbs
            },

            on: {
                init() {
                    const swiper = this;
                    const sliderElement = swiper.el;
                    const mainMedia = sliderElement.closest('.main-media');
                    const tagContainer = mainMedia ? mainMedia.querySelector('.main-product-tag-container') : null;
                    if (!tagContainer) return;

                    // Show the slider
                    sliderElement.classList.remove('slider-hidden');

                    const setWidth = (img) => {
                        if (!img) return;
                        const width = Math.round(img.getBoundingClientRect().width);
                        if (width > 0) {
                            tagContainer.style.width = width + 'px';
                        }
                    };

                    const getActiveMainImage = () => {
                        const activeSlide = sliderElement.querySelector('.swiper-slide-active') || swiper.slides[swiper.activeIndex];
                        if (!activeSlide) return null;

                        const slideImages = Array.from(activeSlide.querySelectorAll('img'))
                            .filter((img) => !img.closest('.media-icon'));

                        if (!slideImages.length) return null;

                        slideImages.sort((a, b) => {
                            const widthA = a.getBoundingClientRect().width || 0;
                            const widthB = b.getBoundingClientRect().width || 0;
                            return widthB - widthA;
                        });

                        return slideImages[0];
                    };

                    const syncActiveImageWidth = (attempt = 0) => {
                        const activeImage = getActiveMainImage();
                        if (!activeImage) return;

                        if (!activeImage.complete || activeImage.naturalWidth === 0) {
                            activeImage.addEventListener('load', () => syncActiveImageWidth(), { once: true });
                            return;
                        }

                        requestAnimationFrame(() => {
                            const width = Math.round(activeImage.getBoundingClientRect().width);

                            if (width > 160 || attempt >= 2) {
                                setWidth(activeImage);
                                return;
                            }

                            window.setTimeout(() => syncActiveImageWidth(attempt + 1), 80);
                        });
                    };

                    swiper.syncActiveImageWidth = syncActiveImageWidth;

                    syncActiveImageWidth();

                    // Update width on window resize
                    let resizeTimer;
                    window.addEventListener('resize', () => {
                        clearTimeout(resizeTimer);
                        resizeTimer = setTimeout(syncActiveImageWidth, 100); // debounce to avoid multiple rapid calls
                    });
                },
                slideChangeTransitionEnd() {
                    if (typeof this.syncActiveImageWidth === 'function') {
                        this.syncActiveImageWidth();
                    }
                },
                resize() {
                    if (typeof this.syncActiveImageWidth === 'function') {
                        this.syncActiveImageWidth();
                    }
                }
            }
        });

        
        gallerySlider = new Swiper(".gallery-slider", {
            direction: 'horizontal',
            slidesPerView: 1,
            spaceBetween: 20,
            speed: 1000,
            navigation: {
                nextEl: ".slider-next",
                prevEl: ".slider-prev"
            },
            grabCursor: true,
            watchSlidesProgress: true,
            thumbs: {
                swiper: sliderThumbs,
                swiper: sliderImages
            },
            on: {
                init: function () {
                    $('.gallery-slider').removeClass('slider-hidden');
                    // Put your code here
                }
            }
        });


        // HIGHLIGHTS ----------------------------------------------------------------------------
        const accordions = document.querySelectorAll('.highlights-accordion');

        accordions.forEach(accordion => {
            const heading = accordion.querySelector('.accrodion-heading');
            const content = accordion.querySelector('.accordion-content');

            // Initially open
            content.style.height = content.scrollHeight + 'px';
            content.style.overflow = 'hidden';
            content.style.transition = 'height 0.3s ease';

            heading.addEventListener('click', () => {
                if (content.style.height === '0px' || content.style.height === '0') {
                    // Expand
                    content.style.height = content.scrollHeight + 'px';
                    heading.querySelector('i').classList.replace('fa-chevron-down', 'fa-chevron-up');
                } else {
                    // Collapse
                    content.style.height = '0';
                    heading.querySelector('i').classList.replace('fa-chevron-up', 'fa-chevron-down');
                }
            });
        });
        

        // When any variant radio changes
        function getVariantInfoSelector($radio) {
            const $fieldset = $radio.closest('fieldset');
            const $variantInfo = $fieldset.find('.variant-info').first();

            if ($variantInfo.length) {
                const variantInfoClass = ($variantInfo.attr('class') || '')
                    .split(/\s+/)
                    .find((className) => className.indexOf('variant--') === 0);

                if (variantInfoClass) {
                    return '.' + variantInfoClass;
                }
            }

            const rawName = $radio.attr('name') || '';
            const normalizedName = rawName
                .replace(/^nav-/, '')
                .trim()
                .toLowerCase()
                .replace(/['"]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');

            return normalizedName ? '.variant--' + normalizedName : '';
        }

        $(document).on('change', '.variant-radio, .nav-variant-radio', function () {
            let $radio = $(this);
            let value = $radio.val();
            let targetClass = getVariantInfoSelector($radio);

            if (!targetClass || !value) return;

            $(targetClass).each(function () {
                $(this).text(' : ' + value);
            });
        });


        // Optional: when using .variants-selector click (for custom swatches)
        $(document).on('click', '.variants-selector', function () {
            let $selector = $(this);
            let $radio = $selector.next('.variants-option').find('.nav-variant-radio');

            if ($radio.length && !$radio.hasClass('disabled')) {
            $radio.prop('checked', true).trigger('change');
            }
        });


            const productSection = document.querySelector('.product') || document;
            const modal = productSection.querySelector('.size-chart-modal') || document.querySelector('.size-chart-modal');
            const variantSize = productSection.querySelector('.variant-size');
            const fallbackVariant = productSection.querySelector('.variant');
            const targetVariant = variantSize || fallbackVariant;

            if (modal && targetVariant) {
                const legend = targetVariant.querySelector('legend');
                if (legend) {
                    let sizeBtn = legend.querySelector('.size-chart-button') || productSection.querySelector('.size-chart-button');

                    if (!sizeBtn) {
                        sizeBtn = document.createElement('button');
                        sizeBtn.type = 'button';
                        sizeBtn.className = 'size-chart-button';
                        sizeBtn.innerHTML = `
                            <img src="https://cdn.shopify.com/s/files/1/0457/1099/9709/files/size-chart-icon.png?v=1765009516" alt="size-chart-icon">
                            <span class="pp-regular italic body-sm f-gray">Size Guide</span>
                        `;
                    }

                    if (targetVariant === variantSize) {
                        variantSize.classList.add('size-chart');

                        // Avoid duplicate init
                        if (!legend.classList.contains('size-chart-initialized')) {
                            legend.classList.add('size-chart-initialized');

                            // Get the first NON-empty text node
                            const textNode = Array.from(legend.childNodes).find(
                                (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim().length
                            );

                            const labelText = textNode ? textNode.textContent.trim() : 'Size';

                            // Find the span
                            const sizeSpan =
                                legend.querySelector('.variant-info.variant--size') ||
                                legend.querySelector('.variant-info');

                            // Build wrapper without wiping the whole legend, so app-injected buttons
                            // or other live-storefront nodes are preserved.
                            const labelContainer = document.createElement('div');
                            labelContainer.className = 'label-container';
                            labelContainer.appendChild(document.createTextNode(labelText + ' '));

                            if (sizeSpan) labelContainer.appendChild(sizeSpan);

                            const existingLabelContainer = legend.querySelector('.label-container');
                            if (existingLabelContainer) {
                                existingLabelContainer.replaceWith(labelContainer);
                            } else {
                                const nodesToRemove = [];
                                legend.childNodes.forEach((node) => {
                                    const isTextNode = node.nodeType === Node.TEXT_NODE;
                                    const isVariantInfo =
                                        node.nodeType === Node.ELEMENT_NODE &&
                                        node.classList &&
                                        node.classList.contains('variant-info');

                                    if (isTextNode || isVariantInfo) {
                                        nodesToRemove.push(node);
                                    }
                                });

                                nodesToRemove.forEach((node) => node.remove());
                                legend.insertBefore(labelContainer, legend.firstChild);
                            }
                        }
                    }

                    sizeBtn.style.display = '';
                    if (!legend.contains(sizeBtn)) {
                        legend.appendChild(sizeBtn);
                    }

                    if (!sizeBtn.dataset.sizeChartBound) {
                        sizeBtn.addEventListener('click', function () {
                            modal.classList.add('open');
                            document.body.classList.add('no-scroll');
                        });
                        sizeBtn.dataset.sizeChartBound = 'true';
                    }
                }
            }

            if (variantSize) {
            const $toggle = $('.toggle-size-chart');
            if ($toggle.length > 0) {
                const $labels = $toggle.find('.unit-label');
                const $left = $toggle.find('.unit-label.left');
                const $right = $toggle.find('.unit-label.right');
                const $box = $toggle.find('.toggle-box');
                const $cells = $('.size-chart-table tbody td:not(:first-child)');

                let originalValues = [];

                // Base table values are IN
                $cells.each(function (i) {
                    originalValues[i] = $(this).text().trim();
                });

                function inToCm(val) {
                    let converted = (parseFloat(val) * 2.54).toFixed(1);
                    converted = converted.replace(/\.0$/, '');
                    return converted;
                }

                function convertValueToCm(text) {
                    text = text.trim();

                    if (text.includes('-')) {
                        let [min, max] = text.split('-').map(n => n.trim());
                        return inToCm(min) + ' - ' + inToCm(max);
                    }

                    return inToCm(text);
                }

                function getUnitFromLabel($el) {
                    return $el.text().trim().toLowerCase() === 'cm' ? 'cm' : 'in';
                }

                function setUnit(unit) {
                    unit = unit === 'cm' ? 'cm' : 'in';

                    $toggle.attr('data-unit', unit);

                    $labels.removeClass('active');

                    $labels.each(function () {
                        const $label = $(this);
                        const labelUnit = getUnitFromLabel($label);

                        if (labelUnit === unit) {
                            $label.addClass('active');
                        }
                    });

                    if (unit === 'in') {
                        $box.removeClass('right');
                    } else {
                        $box.addClass('right');
                    }

                    $cells.each(function (i) {
                        if (unit === 'in') {
                            // IN is the original/base table data
                            $(this).text(originalValues[i]);
                        } else {
                            // Convert IN → CM only when CM is selected
                            $(this).text(convertValueToCm(originalValues[i]));
                        }
                    });
                }

                $labels.on('click', function () {
                    const clickedUnit = getUnitFromLabel($(this));
                    setUnit(clickedUnit);
                });

                $box.on('click', function () {
                    const current = $toggle.attr('data-unit');
                    setUnit(current === 'in' ? 'cm' : 'in');
                });

                // Initialize from theme setting
                let defaultUnit = $toggle.attr('data-unit') || 'in';
                setUnit(defaultUnit);
            }

            const table = document.querySelector('.size-chart-table');
            if (table) {

            const cells = table.querySelectorAll('tbody td');

            function clearAll() {
                table.querySelectorAll('.grey, .red')
                    .forEach(el => el.classList.remove('grey', 'red'));
            }

            const isMobile = window.matchMedia('(hover: none)').matches;

            cells.forEach(cell => {
                if (!isMobile) {
                    cell.addEventListener('mouseenter', function () {
                        highlightCell(this);
                    });
                } else {
                    cell.addEventListener('click', function (e) {
                        e.stopPropagation();
                        highlightCell(this);
                    });

                    document.body.addEventListener('click', function () {
                        clearAll();
                    });
                }
            });

            function highlightCell(cell) {
                clearAll();

                const row = cell.parentElement;
                const colIndex = cell.cellIndex;
                const rowIndex = row.rowIndex;

                const headerCell = table.rows[0].cells[colIndex];
                if (headerCell) headerCell.classList.add('red');

                for (let i = 1; i < rowIndex; i++) {
                    if (table.rows[i] && table.rows[i].cells[colIndex]) {
                        table.rows[i].cells[colIndex].classList.add('grey');
                    }
                }

                cell.classList.add('red');

                for (let i = 0; i < colIndex; i++) {
                    const leftCell = row.cells[i];
                    if (!leftCell) continue;

                    if (i === 0) {
                        leftCell.classList.add('red');
                    } else {
                        leftCell.classList.add('grey');
                    }
                }
            }

            if (!isMobile) {
                table.addEventListener('mouseleave', clearAll);
            }

            const tabItems = document.querySelectorAll('.size-chart-tab-list .tab-item');
            const tabContents = document.querySelectorAll('.size-chart-tab-content');

            tabItems.forEach(item => {
                item.addEventListener('click', function () {
                    let target = this.getAttribute('tab-data');

                    tabItems.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');

                    tabContents.forEach(content => {
                        content.style.display = 'none';
                    });

                    const targetContent = document.querySelector(`.size-chart-tab-content[tab-data="${target}"]`);
                    if (targetContent) {
                        targetContent.style.display = 'block';
                    }
                });
            });
            }
            }


    }



    if ($('.product-faqs-section').length) {
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
    
    if ($('.product-specification-section').length) {
        if ($('.specification-metaobjects-list').children().length != 0) {

            const $specItems = $(".specification-metaobjects-list .specification-item");
            const $loadBtn = $(".load-full-specs");

            if (!$specItems.length || !$loadBtn.length) return;

            // Hide all except first item on load
            $specItems.slice(1).addClass("d-none");

            $loadBtn.on("click", function (e) {
                e.preventDefault();

                if ($loadBtn.hasClass("expanded")) {
                // Collapse back to first item
                $specItems.slice(1).addClass("d-none");
                $loadBtn.text("Load Full Specs >").removeClass("expanded");

                // Scroll back to first spec
                $("html, body").animate({
                    scrollTop: $specItems.first().offset().top - headerHeight - 25
                }, 500);

                } else {
                // Expand: show all specs
                $specItems.removeClass("d-none");
                $loadBtn.text("Hide Full Specs >").addClass("expanded");

                // Optional: scroll to the list start (or remove this block if you don't want scroll)
                $("html, body").animate({
                    scrollTop: $specItems.first().offset().top - headerHeight - 25
                }, 500);
                }
            });
        }
    }
    
    if ($('.product-centered-image-slider-section').length) {
        $('.product-centered-image-slider-section').each(function () {
            var $section = $(this); // Each section
            var $slider = $section.find('.centered-image-slider'); // Slider inside this section
            var $pagination = $section.find('.swiper-pagination'); // Pagination inside this section
            var originalSlideCount = $slider.find('.swiper-wrapper > .swiper-slide').not('.duplicate-slide').length;
            var bulletClassName = 'swiper-pagination-bullet';

            function syncOriginalPagination(swiper) {
                var activeOriginalIndex = swiper.realIndex % originalSlideCount;

                $pagination.find('.' + bulletClassName).removeClass('swiper-pagination-bullet-active');
                $pagination.find('.' + bulletClassName + '[data-index="' + activeOriginalIndex + '"]').addClass('swiper-pagination-bullet-active');
            }

            var swiper = new Swiper($slider[0], {
                slidesPerView: 1.8,
                spaceBetween: 140,
                centeredSlides: true,
                preventClicks:true,
                grabCursor: false,
                loop:true,  
                effect: 'coverflow',
                coverflowEffect: {
                    rotate: 15,
                    stretch: 10,
                    depth: 100,
                    modifier: 1,
                    slideShadows: false,
                },
                navigation: {
                    nextEl: $section.find('.float-nav .owl-next')[0],
                    prevEl: $section.find('.float-nav .owl-prev')[0],
                },
                pagination: {
                    el: $pagination[0],
                    clickable: false,
                    renderBullet: function (index, className) {
                        if (index >= originalSlideCount) return '';
                        return '<span class="' + className + '" data-index="' + index + '"></span>';
                    },
                },
                breakpoints: {
                    1524: {
                        slidesPerView: 1.8,
                        spaceBetween: 140,
                        coverflowEffect: {
                            rotate: 15,
                            stretch: 10,
                            depth: 100,
                            modifier: 1,
                            slideShadows: false,
                        },
                    },
                    1024: {
                        slidesPerView: 1.8,
                        spaceBetween: 140,
                        coverflowEffect: {
                            rotate: 15,
                            stretch: 10,
                            depth: 100,
                            modifier: 1,
                            slideShadows: false,
                        },
                    },
                    768: {
                        slidesPerView: 1.8,
                        spaceBetween: 140,
                        coverflowEffect: {
                            rotate: 15,
                            stretch: 10,
                            depth: 100,
                            modifier: 1,
                            slideShadows: false,
                        },
                    },
                    0: {
                        slidesPerView: 1.2,
                        spaceBetween: 40,
                        coverflowEffect: {
                            rotate: 10,
                            stretch: 10,
                            depth: 50,
                            modifier: 1,
                            slideShadows: false,
                        },
                    },
                },
                on: {
                    init: function () {
                        syncOriginalPagination(this);
                    },
                    slideChange: function () {
                        syncOriginalPagination(this);
                    },
                },
            });

            $pagination.on('click', '.swiper-pagination-bullet', function () {
                var index = Number($(this).attr('data-index'));

                if (!Number.isNaN(index)) {
                    swiper.slideToLoop(index);
                }
            });
        });
    }
    
    if ($('.product-centered-image-slider-section-v2').length) {
        $('.product-centered-image-slider-section-v2').each(function () {
            var $section = $(this);
            var $slider = $section.find('.centered-image-slider');
            var $pagination = $section.find('.swiper-pagination');

            function setContentState(swiper, phase) {
            // remove states from all slides
            swiper.slides.forEach(function (slideEl) {
                slideEl.classList.remove('is-content-in', 'is-content-out');
            });

            // mark active slide as "in"
            var active = swiper.slides[swiper.activeIndex];
            if (active) active.classList.add('is-content-in');

            // mark previous slide as "out" (so it fades out on exit)
            var prevIndex = swiper.previousIndex;
            if (typeof prevIndex === 'number' && prevIndex >= 0) {
                var prev = swiper.slides[prevIndex];
                if (prev && prev !== active) prev.classList.add('is-content-out');
            }
            }

            var swiper = new Swiper($slider[0], {
            slidesPerView: 1.8,
            spaceBetween: 140,
            centeredSlides: true,
            preventClicks: true,
            grabCursor: false,
            loop: true,
            effect: 'coverflow',
            coverflowEffect: {
                rotate: 15,
                stretch: 10,
                depth: 100,
                modifier: 1,
                slideShadows: false,
            },
            navigation: {
                nextEl: $section.find('.float-nav .owl-next')[0],
                prevEl: $section.find('.float-nav .owl-prev')[0],
            },
            pagination: {
                el: $pagination[0],
                clickable: true,
            },
            breakpoints: {
                1524: { slidesPerView: 1.8, spaceBetween: 140, coverflowEffect: { rotate: 15, stretch: 10, depth: 100, modifier: 1, slideShadows: false } },
                1024: { slidesPerView: 1.8, spaceBetween: 140, coverflowEffect: { rotate: 15, stretch: 10, depth: 100, modifier: 1, slideShadows: false } },
                768:  { slidesPerView: 1.8, spaceBetween: 140, coverflowEffect: { rotate: 15, stretch: 10, depth: 100, modifier: 1, slideShadows: false } },
                0:    { slidesPerView: 1.2, spaceBetween: 40,  coverflowEffect: { rotate: 10, stretch: 10, depth: 50,  modifier: 1, slideShadows: false } },
            },

            on: {
                init: function () {
                // ensure correct initial animation state
                setContentState(this, 'init');
                },

                slideChangeTransitionStart: function () {
                // trigger exit for previous slide right as transition begins
                // and keep active slide ready to enter
                setContentState(this, 'start');
                },

                slideChangeTransitionEnd: function () {
                // finalize "in" state on active slide after transition
                setContentState(this, 'end');
                }
            }
            });
        });
    }
    
    if ($('.image-content-expand-section').length) {
        $('.image-content-expand-section').each(function () {
            var $section = $(this); // Each section
            var $button = $section.find('.explore-btn');
            var $target = $section.find('.images-tab-section');
            $button.on('click', function (e) {
                e.preventDefault();
                
                $target.removeClass('open');
                if ($target.length) {
                    setTimeout(function () {
                        $('html, body').animate({
                            scrollTop: $target.offset().top - headerHeight - 50
                        }, 800); // 800ms scroll speed
                    }, 200); // 0.2s delay before scrolling
                }
            });

        });
    }

    window.playSliderVideo = function (video) {
        if (!video) return;

        video.muted = true;
        video.defaultMuted = true;
        video.autoplay = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = 'auto';
        video.setAttribute('muted', '');
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', 'true');
        video.setAttribute('autoplay', '');
        video.setAttribute('preload', 'auto');
        video.setAttribute('disablepictureinpicture', '');
        video.removeAttribute('controls');

        var tryPlay = function () {
            video.muted = true;
            video.defaultMuted = true;
            video.autoplay = true;
            video.playsInline = true;

            var playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch(function () {});
            }
        };

        if (video.readyState >= 2) {
            tryPlay();
            requestAnimationFrame(tryPlay);
            setTimeout(tryPlay, 120);
            setTimeout(tryPlay, 350);
        } else {
            ['loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough'].forEach(function (eventName) {
                video.addEventListener(eventName, tryPlay, { once: true });
            });
            if (typeof video.load === 'function') {
                video.load();
            }
            setTimeout(tryPlay, 200);
            setTimeout(tryPlay, 500);
        }
    };

    function getActiveSwiperSlide(swiper) {
        if (!swiper || !swiper.slides) return null;

        var activeSlide = swiper.el ? swiper.el.querySelector('.swiper-slide-active') : null;
        if (activeSlide) return activeSlide;

        return swiper.slides[swiper.activeIndex] || null;
    }

    function preloadSectionVideos(container) {
        if (!container) return;

        container.querySelectorAll('video').forEach(function (video) {
            video.muted = true;
            video.defaultMuted = true;
            video.playsInline = true;
            video.preload = 'auto';
            video.setAttribute('muted', '');
            video.setAttribute('playsinline', '');
            video.setAttribute('webkit-playsinline', 'true');
            video.setAttribute('autoplay', '');
            video.setAttribute('preload', 'auto');
            video.setAttribute('disablepictureinpicture', '');
            video.removeAttribute('controls');

            if (typeof video.load === 'function') {
                video.load();
            }
        });
    }

    function playSwiperVideoByIndex(swiper, targetIndex) {
        if (!swiper || !swiper.slides) return;

        Array.from(swiper.slides).forEach(function (slide) {
            var video = slide.querySelector('video');
            if (!video) return;

            window.playSliderVideo(video);

            requestAnimationFrame(function () {
                window.playSliderVideo(video);
            });

            setTimeout(function () {
                window.playSliderVideo(video);
            }, 200);
        });
    }


    function forcePlayFirstSliderVideo(swiper) {
        if (!swiper) return;

        var activeSlide = getActiveSwiperSlide(swiper);
        if (!activeSlide) return;

        var activeVideo = activeSlide.querySelector('video');
        if (!activeVideo) return;

        window.playSliderVideo(activeVideo);

        requestAnimationFrame(function () {
            window.playSliderVideo(activeVideo);
        });

        setTimeout(function () {
            window.playSliderVideo(activeVideo);
        }, 250);

        setTimeout(function () {
            playSwiperVideoByIndex(swiper, swiper.activeIndex);
        }, 400);
    }

    if ($('.content-slider-section').length) {

        $('.content-slider-section').each(function () {
            var $section = $(this);
            var $sectionContent = $section.find('.section-content').first();
            var $content_slider = $section.find('.content-slider');
            var $image_video_slider = $section.find('.content-video-image-slider');
            var desktopSliderAutoplayEnabled = String($sectionContent.data('desktop-slider-autoplay')) === 'true';
            var mobileSliderAutoplayEnabled = String($sectionContent.data('mobile-slider-autoplay')) === 'true';

            var contentAnimTimer = null;
            var isSyncing = false;

            function runContentAnimation(swiper, prevIndex, activeIndex) {
                const $slides = $(swiper.slides);

                $slides.find('.content-details').css({
                    transform: 'scale(1)',
                    opacity: '0',
                    transition: 'none'
                });

                const $prevSlide = $slides.eq(prevIndex).find('.content-details');
                const $activeSlide = $slides.eq(activeIndex).find('.content-details');

                $prevSlide.css({
                    transform: 'scale(1.2)',
                    opacity: '0',
                    transition: 'transform 1.5s ease, opacity 1s ease'
                });

                if (contentAnimTimer) clearTimeout(contentAnimTimer);

                contentAnimTimer = setTimeout(() => {
                    $activeSlide.css({
                        transform: 'scale(1)',
                        opacity: '1',
                        transition: 'transform 0s ease, opacity 1s ease'
                    });
                }, 800);
            }

            function showFirstContent(swiper) {
                const $slides = $(swiper.slides);

                $slides.find('.content-details').css({
                    transform: 'scale(1)',
                    opacity: '0',
                    transition: 'none'
                });

                $slides.eq(swiper.activeIndex).find('.content-details').css({
                    transform: 'scale(1)',
                    opacity: '1',
                    transition: 'transform 0s ease, opacity 1s ease'
                });
            }

            function handleSlideVideos(swiper) {
                playSwiperVideoByIndex(swiper, swiper.activeIndex);
            }

            // =========================
            // Fade content swiper
            // =========================
            var imageVideoContentSwiper = new Swiper($content_slider[0], {
                slidesPerView: 1,
                spaceBetween: 0,
                allowTouchMove: true,
                loop: false,
                effect: 'fade',
                fadeEffect: { crossFade: true },
                speed: 1000,
                autoplay: desktopSliderAutoplayEnabled ? {
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                } : false,

                pagination: {
                    el: $section.find('.swiper-pagination')[0],
                    clickable: true,
                    renderBullet: function (index, className) {
                        var number = index + 1;
                        var formatted = number < 10 ? '0' + number : number;
                        return '<span class="' + className + '">' + formatted + '</span>';
                    }
                },

                on: {
                    init: function () {
                        showFirstContent(this);
                    },

                    slideChangeTransitionStart: function () {
                        runContentAnimation(this, this.previousIndex, this.activeIndex);

                        if (isSyncing) return;
                        isSyncing = true;
                        if (imageVideoSwiper && imageVideoSwiper.activeIndex !== this.activeIndex) {
                            imageVideoSwiper.slideTo(this.activeIndex, 1000, false);
                            playSwiperVideoByIndex(imageVideoSwiper, this.activeIndex);
                        }
                        isSyncing = false;
                    }
                }
            });

            // =========================
            // Vertical image/video swiper
            // =========================
            var imageVideoSwiper = new Swiper($image_video_slider[0], {
                direction: 'vertical',
                slidesPerView: 1,
                spaceBetween: 0,
                allowTouchMove: true,
                loop: false,
                speed: 1000,

                mousewheel: {
                    enabled: false,
                    forceToAxis: true,
                    releaseOnEdges: true,
                    sensitivity: 1
                },

                on: {
                    init: function () {
                        preloadSectionVideos(this.el);
                        handleSlideVideos(this);
                        forcePlayFirstSliderVideo(this);

                        const swiper = this;
                        const el = swiper.el;

                        el.addEventListener('pointerenter', () => swiper.mousewheel.enable());
                        el.addEventListener('pointerleave', () => swiper.mousewheel.disable());
                    },

                    slideChangeTransitionStart: function () {
                        runContentAnimation(imageVideoContentSwiper, this.previousIndex, this.activeIndex);
                        playSwiperVideoByIndex(this, this.activeIndex);

                        if (isSyncing) return;
                        isSyncing = true;
                        if (imageVideoContentSwiper.activeIndex !== this.activeIndex) {
                            imageVideoContentSwiper.slideTo(this.activeIndex, 1000, false);
                        }
                        isSyncing = false;
                    },

                    slideChangeTransitionEnd: function () {
                        handleSlideVideos(this);
                    },

                    activeIndexChange: function () {
                        handleSlideVideos(this);
                    }
                }
            });
        });

        var mobileSlider = new Swiper('.mobile-content-slider-container', {
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
            slidesPerView: 1,
            allowTouchMove: true,
            loop: true,
            autoHeight: true,
            speed: 800,
            autoplay: String($('.content-slider-section').find('.section-content').first().data('mobile-slider-autoplay')) === 'true' ? {
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            } : false,
            pagination: {
                el: '.mobile-content-slider-container .swiper-pagination',
                clickable: true,
                renderBullet: function (index, className) {
                    var number = index + 1;
                    var formatted = number < 10 ? '0' + number : number;
                    return '<span class="' + className + '">' + formatted + '</span>';
                },
            },
            on: {
                init: function () {
                    preloadSectionVideos(this.el);
                    handleMobileSlideVideos(this);
                    forcePlayFirstSliderVideo(this);
                },
                slideChange: function () {
                    handleMobileSlideVideos(this);
                },
                slideChangeTransitionEnd: function () {
                    handleMobileSlideVideos(this);
                },
                activeIndexChange: function () {
                    handleMobileSlideVideos(this);
                }
            }
        });

            function handleMobileSlideVideos(swiper) {
                playSwiperVideoByIndex(swiper, swiper.activeIndex);
        }

    }

    if ($('.product-hotspot-section').length) {
        $('.product-hotspot-section').each(function () {
            var $section = $(this); // Each section
            var $video_image_slider = $section.find('.hotspot-video-image-slider'); // Horizontal fade slider
            var $hotspot_content = $section.find('.hotspot-content-slider'); // Horizontal fade slider

            
            var hotspot_videoimage_slider = new Swiper($video_image_slider[0], {
                effect: 'fade',              // 👈 enables fade effect
                fadeEffect: {
                    crossFade: true,         // smoother fade transition
                },
                slidesPerView: 1,
                spaceBetween: 0,
                allowTouchMove: false,
                loop: false,
                speed: 1000,
                on: {
                    init: function () {
                        HotspotplayVideoInActiveSlide(this);
                    },
                    slideChangeTransitionEnd: function () {
                        HotspotplayVideoInActiveSlide(this);
                    },
                },
            });

            var hotspot_content = new Swiper($hotspot_content[0], {
                direction: 'vertical',
                slidesPerView: 1,
                spaceBetween: 0,
                allowTouchMove: false,
                loop: false,
                speed: 1000,
                centeredSlides: true, // Centers the active slide
                autoHeight: true,       
            });

            hotspot_content.controller.control = hotspot_videoimage_slider;
            hotspot_videoimage_slider.controller.control = hotspot_content;
            
            // Function to play/pause videos based on active slide
            function HotspotplayVideoInActiveSlide(swiper) {
                // Pause & reset all videos
                swiper.slides.forEach(function (slide) {
                    var video = slide.querySelector('video');
                    if (video) {
                        video.pause();
                        video.currentTime = 0;
                    }
                });

                // Play video in active slide (if exists)
                var activeSlide = swiper.slides[swiper.activeIndex];
                if (activeSlide) {
                    var activeVideo = activeSlide.querySelector('video');
                    if (activeVideo) {
                        activeVideo.play();
                    }
                }
            }

            // ✅ When hotspot is clicked, slide to its corresponding index
            $section.find('.spot').on('click', function () {
                var index = parseInt($(this).attr('data-i'), 10) - 1;

                $section.find('.bottom-content-container').addClass('show');

                if ($(window).width() <= 767) {
                    hotspot_videoimage_slider.slideTo(index);

                    hotspot_videoimage_slider.once('slideChangeTransitionEnd', function () {
                        var $target = $section.find('.hotspot-content-slider');

                        if ($target.length) {
                            $('html, body').stop().animate({
                                scrollTop: $target.offset().top - 300
                            }, 400);
                        }
                    });
                } else {
                    hotspot_videoimage_slider.slideTo(index);
                }
            });

        });
    }

    if ($('.product-battery-performance-section').length && !$('.product-battery-performance-section').hasClass('v2')) {
        function normalizeTabKey(name) {
            name = name.replace(/\s+/g, '');

            const lower = name.toLowerCase();
            const match = Object.keys(batteryData).find(
                key => key.toLowerCase() === lower
            );

            return match || name;
        }

        function getNearestStep(value) {
            const steps = [0, 50, 100];
            return steps.reduce((prev, curr) =>
                Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
            );
        }

        function getProgressPercent(current, values) {
            const numericValues = values
                .map(value => Number(value) || 0);
            const minPercent = 10;

            const minValue = Math.min.apply(null, numericValues);
            const maxValue = Math.max.apply(null, numericValues);

            if (maxValue === minValue) {
                return maxValue > 0 ? 100 : minPercent;
            }

            return minPercent + (((current - minValue) / (maxValue - minValue)) * (100 - minPercent));
        }

        $('.product-battery-performance-section').each(function () {
            const $section = $(this);
            const $rangeInput = $section.find('.range-container input[type="range"]');
            const $temperature = $section.find('.temperature-range-container .temperature-data');
            const $duration = $section.find('.heating-duration-range-container .temperature-data');
            const $tempProgress = $section.find('.temperature-range-container .progress-status');
            const $durationProgress = $section.find('.heating-duration-range-container .progress-status');
            const $battery_image_slider = $section.find('.battery-performance-image-slider');
            let battery_slider = null;
            let activeTab = normalizeTabKey($section.find('.tab-item.active').text().trim());

            function updateProgress() {
                const value = parseInt($rangeInput.val(), 10);
                let level = 'low';

                if (value === 50) level = 'medium';
                else if (value === 100) level = 'high';

                const data = batteryData[activeTab];

                if (!data) {
                    return;
                }

                const temperature = Number(data[`${level}_range_temperature`] || 0);
                const duration = Number(data[`${level}_range_heating_duration`] || 0);
                const temperatureValues = [
                    data.low_range_temperature,
                    data.medium_range_temperature,
                    data.high_range_temperature
                ];
                const durationValues = [
                    data.low_range_heating_duration,
                    data.medium_range_heating_duration,
                    data.high_range_heating_duration
                ];

                $temperature.text(`${temperature}${temperature_unit}`);
                $duration.text(`${duration.toFixed(1)}h`);

                $tempProgress.css('width', `${getProgressPercent(temperature, temperatureValues)}%`);
                $durationProgress.css('width', `${getProgressPercent(duration, durationValues)}%`);
            }

            if (enabled_image_slider) {
                battery_slider = new Swiper($battery_image_slider[0], {
                    effect: 'fade',
                    fadeEffect: { crossFade: true },
                    slidesPerView: 1,
                    spaceBetween: 0,
                    allowTouchMove: false,
                    loop: false,
                    speed: 1000
                });
            }

            $section.find('.tab-list-battery .tab-item').on('click', function () {
                const index = $(this).index();

                if (enabled_image_slider) {
                    battery_slider.slideTo(index);
                }

                $section.find('.tab-list-battery .tab-item').removeClass('active');
                $(this).addClass('active');

                $section.find('.range-container input').val(0);
                $section.find('.range-container').css('--value', 0);

                activeTab = normalizeTabKey($(this).text().trim());

                updateProgress();
            });

            $section.find('.range-container input').attr({
                min: 0,
                max: 100,
                step: 50
            });

            $section.find('.range-container input').on('input change', function () {
                const snappedValue = getNearestStep(parseInt(this.value, 10));
                this.value = snappedValue;
                this.parentNode.style.setProperty('--value', snappedValue);
                updateProgress();
            });

            $section.find('.range-labels span').on('click', function () {
                const label = $(this).text().trim().toLowerCase();

                if (label === 'low') $rangeInput.val(0);
                if (label === 'medium') $rangeInput.val(50);
                if (label === 'high') $rangeInput.val(100);

                $rangeInput.parent().css('--value', $rangeInput.val());
                updateProgress();
            });

            $rangeInput.parent().css('--value', getNearestStep(parseInt($rangeInput.val(), 10) || 0));
            $rangeInput.val(getNearestStep(parseInt($rangeInput.val(), 10) || 0));
            $section.find('.tab-list-battery .tab-item').first().trigger('click');
        });
    }

    if ($('.product-page-nav-header-section').length) {
      
        $('.product-page-nav-header-section').each(function () {
            var $container = $(this); 
            $container.find('.nav-content .link-nav .link-nav-item').click(function(){
              
              
                $('.nav-content .link-nav .link-nav-item').removeClass('active');
                $(this).addClass('active');
                $('.selected-nav').text($(this).text());
        
              
                var targetAttr = $(this).attr('data-scroll');
                var $targetSection = $('.section-scroll[data-scroll="' + targetAttr + '"]').offset().top - 50;
                $("html, body").animate({
                    scrollTop: $targetSection
                }, 1);
            });

            $container.find('.nav-header-buy-now').click(function(){
                $container.find('.product-variant-selector').addClass('open');
                $('body').addClass('no-scroll');
                if (window.venustasRegionalInventoryGate && typeof window.venustasRegionalInventoryGate.syncNavInventoryMarkup === 'function') {
                    window.venustasRegionalInventoryGate.syncNavInventoryMarkup();
                }
            });

        });

        $('.nav-variants-selector').on('click', function() {
            let id = $(this).data('id');

            $(this).addClass('selected').siblings().removeClass('selected');

            $(`.nav-variants-option #${id}`).trigger('click');
        });

        
            
        
        function scrollActiveLinkIntoView() {
            
            if (!$('.main-nav-header-section').hasClass('product-header-sticky')) return;
            const $activeLink = $('.mobile-nav .link-nav .link-nav-item.active');
            if ($activeLink.length) {
                    $activeLink[0].scrollIntoView({
                    behavior: 'smooth',
                    inline: 'center',
                    block: 'nearest'
                });
            }
        }

        // ScrollSpy: update active nav item on scroll
        $(window).on('scroll', function () {

            $(".section-scroll").each(function() {
                var sectionTop = $(this).offset().top - 100;
                var sectionBottom = sectionTop + $(this).outerHeight();
                var scrollPosition = $(window).scrollTop();
                
                var targetButton = $('.product-page-nav-header-section .nav-content .link-nav-item[data-scroll="' + $(this).attr('data-scroll') + '"]');
            
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    targetButton.addClass("active");
                    
                    // Check if the section has a data-child-scroll attribute
                    var childScroll = $(this).attr("data-child-scroll");
                    if (childScroll) {
                        $('.product-page-nav-header-section .nav-content .link-nav-item[data-scroll="' + childScroll + '"]').addClass("active");
                    }
                    scrollActiveLinkIntoView(targetButton);
                } else {
                    if (!$(this).attr("data-child-scroll")) {
                        targetButton.removeClass("active");
                    }
                }
            });
        });
    }
    
    if ($('.product-expand-image-section').length) {
        $('.expand-image-item').each(function() {
            var container = $(this);
            container.find('.btn-toggle').on('click', function() {
                $('.expand-image-item').removeClass('active');
                $('.expand-image-item .block-heading').removeClass('title-xs');
                $('.expand-image-item .block-heading').addClass('pretitle');
                container.addClass('active');
                container.find('.block-heading').removeClass('pretitle').addClass('title-xs');
            });
        });
    }
    
    if ($('.product-whats-included-section').length) {
        $('.product-whats-included-section .included-list-slider').each(function () {
            let $section = $(this);

            new Swiper(this, {
                slidesPerView: 2,
                spaceBetween: 10,
                allowTouchMove: true,
                loop: false,
                pagination: {
                    el: $section.find('.swiper-pagination')[0],
                    clickable: true,
                },
            });
        });
    }

    if ($('.product .product-list-container').length) {
        

        $('.comp-product-item').each(function () {
        const $item = $(this);
        const $select = $item.find('.variant-select');
        const $checkbox = $item.find('.additional_checkbox');
        const $price = $item.find('.price span.money');
        const $compare = $item.find('.compare span.money');
        const $btn = $item.find('.button-atc');
        const $label = $item.find('.btn-label');
        const $iconPlus = $item.find('.icon-plus');
        const $iconChecked = $item.find('.icon-checked');
        const $titleLink = $item.find('a.pp-regular'); // product title link

        function formatMoney(cents) {
            return (cents / 100).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
            });
        }

        function initVariant() {
            if (!$select.length) return;

            const $selected = $select.find('option:selected');
            const variantId = $selected.val();
            const price = Number($selected.data('price')) || 0;
            const compare = Number($selected.data('compare')) || 0;

            // Update checkbox ID + value
            $checkbox.attr('id', variantId);
            $checkbox.val(variantId);

            // Update product URL with variant
            const baseHref = ($titleLink.attr('href') || '').split('?')[0];
            if (baseHref) $titleLink.attr('href', `${baseHref}?variant=${variantId}`);

            // Price update
            if (price) $price.text(formatMoney(price));

            if (compare && compare > price) {
            $compare.text(formatMoney(compare)).show();
            } else {
            $compare.hide();
            }
        }

        function resetBtnUI() {
            $btn.removeClass('selected');
            $label.text('Add');
            $iconChecked.hide();
            $iconPlus.show();
        }

        function setBtnAddingUI() {
            $btn.addClass('selected');
            $label.text('Adding...');
            $iconPlus.hide();
            $iconChecked.show();
        }

        function setBtnAddedUI() {
            $btn.addClass('selected');
            $label.text('Added');
            $iconPlus.hide();
            $iconChecked.show();
        }

        function addVariantToCart(variantId) {
            // Build form data for /cart/add.js
            const formData = {
            items: [{ id: Number(variantId), quantity: 1 }]
            };

            // OPTIONAL: show your overlay/spinner if you have it
            // $btn.find('.atc-overlay').show();

            $.ajax({
            type: 'POST',
            url: '/cart/add.js',
            data: JSON.stringify(formData),
            contentType: 'application/json',
            dataType: 'json',

            beforeSend: function () {
                setBtnAddingUI();
            },

            success: function (response) {
                // Your existing functions
                if (typeof refreshCart === 'function') refreshCart();
                if (typeof refreshMainCart === 'function') refreshMainCart();
                if (typeof openCart === 'function') openCart();

                // if you still have this overlay in your theme:
                $item.find('.btn-atc span').css('visibility', 'visible');
                $item.find('.btn-atc .atc-overlay').css('display', 'none');

                // Show "Added" briefly then remove selected
                setBtnAddedUI();
                setTimeout(function () {
                resetBtnUI();
                $checkbox.prop('checked', false); // remove check state too (optional)
                }, 800);
            },

            error: function (xhr) {
                console.error('Error adding product to cart:', xhr.responseText);

                $item.find('.btn-atc span').css('visibility', 'visible');
                $item.find('.btn-atc .atc-overlay').css('display', 'none');

                resetBtnUI();
                $checkbox.prop('checked', false);
            }
            });
        }

        // Init
        if ($select.length) initVariant();

        // On variant change
        $select.on('change', function () {
            initVariant();
        });

        // Button click toggles checkbox (select action)
        $btn.on('click', function (e) {
            e.preventDefault();
            $checkbox.prop('checked', true).trigger('change');
        });

        // Checkbox change -> add to cart via AJAX
        $checkbox.on('change', function () {
            const variantId = $(this).val();
            if (!variantId) return;

            // Only add when checked
            if ($(this).is(':checked')) {
            addVariantToCart(variantId);
            } else {
            resetBtnUI();
            }
        });
        });

    }

    if ($('.product-battery-performance-section.v2').length) {

        const data = batteryData[0];

        const $rangeInput = $('.range-container input[type="range"]');
        const $temperature = $('.temperature-range-container .temperature-data');
        const $duration = $('.heating-duration-range-container .temperature-data');
        const $tempProgress = $('.temperature-range-container .progress-status');
        const $durationProgress = $('.heating-duration-range-container .progress-status');

        function getNearestStep(value) {
            const steps = [0, 50, 100];
            return steps.reduce((prev, curr) =>
                Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
            );
        }

        function getProgressPercent(current, values) {
            const numericValues = values
                .map(value => Number(value) || 0);
            const minPercent = 10;

            const minValue = Math.min.apply(null, numericValues);
            const maxValue = Math.max.apply(null, numericValues);

            if (maxValue === minValue) {
                return maxValue > 0 ? 100 : minPercent;
            }

            return minPercent + (((current - minValue) / (maxValue - minValue)) * (100 - minPercent));
        }

        $rangeInput.attr({
            min: 0,
            max: 100,
            step: 50
        });

        $rangeInput.on('input change', function () {
            const snappedValue = getNearestStep(parseInt(this.value, 10));
            this.value = snappedValue;
            $(this).parent().css('--value', snappedValue);
            updateProgress();
        });

        $('.range-labels span').on('click', function () {
            const label = $(this).text().trim().toLowerCase();

            if (label === 'low') $rangeInput.val(0);
            if (label === 'medium') $rangeInput.val(50);
            if (label === 'high') $rangeInput.val(100);

            $rangeInput.parent().css('--value', $rangeInput.val());
            updateProgress();
        });

        function updateProgress() {
            const value = parseInt($rangeInput.val(), 10);
            let level = 'low';

            if (value === 50) level = 'medium';
            else if (value === 100) level = 'high';

            const temperature = data[`${level}_range_temperature`];
            const duration = data[`${level}_range_heating_duration`];
            const temperatureValues = [
                data.low_range_temperature,
                data.medium_range_temperature,
                data.high_range_temperature
            ];
            const durationValues = [
                data.low_range_heating_duration,
                data.medium_range_heating_duration,
                data.high_range_heating_duration
            ];

            $temperature.text(`${temperature}${temperature_unit}`);
            $duration.text(`${duration.toFixed(1)}h`);

            $tempProgress.css('width', `${getProgressPercent(temperature, temperatureValues)}%`);
            $durationProgress.css('width', `${getProgressPercent(duration, durationValues)}%`);
        }

        $rangeInput.val(getNearestStep(parseInt($rangeInput.val(), 10) || 0));
        $rangeInput.parent().css('--value', $rangeInput.val());
        updateProgress();

        $('.product-battery-performance-section.v2 .smart-button').each(function () {
            let $btn = $(this);

            let $tooltipTrigger = $btn.find('.hover-tooltip');
            let $tooltipContent = $btn.find('.hover-tooltip-content');

            $tooltipContent.hide();

            $tooltipTrigger.on('mouseenter', function () {
                $tooltipContent.stop(true, true).fadeIn(150);
            });

            $tooltipTrigger.on('mouseleave', function () {
                $tooltipContent.stop(true, true).fadeOut(150);
            });
        });

        let smartInterval;
        let smartLevelIndex = 0;
        const smartLevels = ['low', 'medium', 'high'];
        let savedSliderValue = 0;

        $('#smart-input').on('change', function () {

            if ($(this).is(':checked')) {

                savedSliderValue = getNearestStep(parseInt($rangeInput.val(), 10) || 0);

                $rangeInput.prop('disabled', true);
                $('.range-container').addClass('disabled');

                smartLevelIndex = 0;
                updateProgressSmart(smartLevels[smartLevelIndex]);

                smartInterval = setInterval(() => {
                    smartLevelIndex = (smartLevelIndex + 1) % smartLevels.length;
                    let level = smartLevels[smartLevelIndex];
                    updateProgressSmart(level);
                }, 2000);

            } else {

                clearInterval(smartInterval);

                $rangeInput.val(savedSliderValue);
                $rangeInput.parent().css('--value', savedSliderValue);
                $rangeInput.prop('disabled', false);
                $('.range-container').removeClass('disabled');

                updateProgress();
            }
        });

        function updateProgressSmart(level) {
            const temperature = data[`${level}_range_temperature`];
            const duration = data[`${level}_range_heating_duration`];
            const temperatureValues = [
                data.low_range_temperature,
                data.medium_range_temperature,
                data.high_range_temperature
            ];
            const durationValues = [
                data.low_range_heating_duration,
                data.medium_range_heating_duration,
                data.high_range_heating_duration
            ];

            $('.temperature-range-container .temperature-data').text(`${temperature}${temperature_unit}`);
            $('.heating-duration-range-container .temperature-data').text(`${duration.toFixed(1)}h`);

            $('.temperature-range-container .progress-status').css('width', `${getProgressPercent(temperature, temperatureValues)}%`);
            $('.heating-duration-range-container .progress-status').css('width', `${getProgressPercent(duration, durationValues)}%`);
        }

    }

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

(() => {
    function getCustomerCountry() {
        const documentCountry = (document.documentElement.getAttribute('data-country') || '').trim().toUpperCase();
        if (documentCountry) return documentCountry;

        const bodyCountry = (document.body && document.body.getAttribute('data-country') || '').trim().toUpperCase();
        if (bodyCountry) return bodyCountry;

        const browserCountry = (window.Shopify && Shopify.country ? String(Shopify.country) : '')
            .trim()
            .toUpperCase()
            .replace(/[^A-Z]/g, '')
            .slice(0, 2);

        if (browserCountry) return browserCountry;

        const localeCountry = (document.documentElement.lang || '')
            .split('-')
            .slice(1)
            .join('-')
            .trim()
            .toUpperCase();

        return localeCountry || '';
    }

    function getInventoryRoot() {
        return document.querySelector('.product .availability-section #inventory-info-app') || document.getElementById('inventory-info-app');
    }

    function getNavInventoryRoot() {
        return document.querySelector('.product-page-nav-header-section .nav-inventory-info-app');
    }

    function getInventoryMarkupSource() {
        const renderedContainer = document.querySelector('.product .availability-section .iia-container');
        if (renderedContainer) return renderedContainer;

        const inventoryRoot = getInventoryRoot();
        if (!inventoryRoot) return null;

        return inventoryRoot.querySelector('.iia-container') || inventoryRoot;
    }

    function getParsedInventoryContainer(parsedDocument) {
        return parsedDocument.querySelector('#inventory-info-app .iia-container')
            || parsedDocument.querySelector('#inventory-info-app.iia-container')
            || parsedDocument.querySelector('.availability-section .iia-container');
    }

    function getInventoryMarkupHtml(sourceNode, options) {
        if (!sourceNode) return '';

        const clone = sourceNode.cloneNode(true);
        if (options && options.stripId) {
            clone.removeAttribute('id');
        }

        return clone.outerHTML;
    }

    function hasMeaningfulInventoryContent(root) {
        if (!root) return false;

        return !!(
            root.querySelector('.iia-list-item, .iia-details-container, .iia-list') ||
            ((root.textContent || '').trim() && (root.textContent || '').trim().length > 20)
        );
    }

    function loadInventoryMarkupViaIframe(variantId, callback) {
        if (!variantId || typeof callback !== 'function') return;

        const iframe = document.createElement('iframe');
        const requestUrl = new URL(window.location.href);
        requestUrl.searchParams.set('variant', variantId);

        iframe.setAttribute('aria-hidden', 'true');
        iframe.tabIndex = -1;
        iframe.style.position = 'absolute';
        iframe.style.width = '1px';
        iframe.style.height = '1px';
        iframe.style.opacity = '0';
        iframe.style.pointerEvents = 'none';
        iframe.style.left = '-9999px';
        iframe.style.top = '0';

        let settled = false;

        function cleanup(markup) {
            if (settled) return;
            settled = true;

            window.clearTimeout(timeoutId);
            window.clearInterval(pollId);

            if (iframe.parentNode) {
                iframe.parentNode.removeChild(iframe);
            }

            callback(markup || '');
        }

        function readMarkup() {
            try {
                const iframeDocument = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document);
                if (!iframeDocument) return '';

                const container = getParsedInventoryContainer(iframeDocument);
                if (!container) return '';

                const meaningfulContent = hasMeaningfulInventoryContent(container);
                if (!meaningfulContent) return '';

                return getInventoryMarkupHtml(container, { stripId: true });
            } catch (error) {
                return '';
            }
        }

        const pollId = window.setInterval(function () {
            const markup = readMarkup();
            if (markup) {
                cleanup(markup);
            }
        }, 250);

        const timeoutId = window.setTimeout(function () {
            const markup = readMarkup();
            cleanup(markup);
        }, 5000);

        iframe.onload = function () {
            const markup = readMarkup();
            if (markup) {
                cleanup(markup);
            }
        };

        iframe.src = requestUrl.toString();
        document.body.appendChild(iframe);
    }

    function syncNavInventoryMarkup(force) {
        const inventorySource = getInventoryMarkupSource();
        const navTargets = document.querySelectorAll('.product-page-nav-header-section .nav-inventory-info-app');

        if (!navTargets.length) return;

        navTargets.forEach(function (target) {
            if (!force && hasMeaningfulInventoryContent(target)) {
                return;
            }

            if (!inventorySource) {
                target.innerHTML = '';
                return;
            }

            const nextMarkup = getInventoryMarkupHtml(inventorySource, { stripId: true });
            if (target.innerHTML === nextMarkup) {
                return;
            }

            target.innerHTML = nextMarkup;

            const mirroredContainer = target.querySelector('.iia-container');
            if (mirroredContainer) {
                mirroredContainer.style.display = 'block';
            }
        });
    }

    function getVariantData() {
        const jsonNode = document.querySelector('variant-radios script[type="application/json"], variant-selects script[type="application/json"], [id^="ProductJson-"]');
        if (!jsonNode) return [];

        try {
            const parsed = JSON.parse(jsonNode.textContent);
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            console.warn('Unable to parse variant data for regional inventory gating.', error);
            return [];
        }
    }

    function getVariantById(variantId) {
        const numericVariantId = Number(variantId);
        if (!numericVariantId) return null;

        return getVariantData().find(function (variant) {
            return Number(variant.id) === numericVariantId;
        }) || null;
    }

    function getSelectedVariantId() {
        const mainInput = document.getElementById('main-product-id');
        const navInput = document.getElementById('main-product-id-nav');
        const rawValue = (mainInput && mainInput.value) || (navInput && navInput.value) || '';
        const variantId = Number(rawValue);
        return Number.isFinite(variantId) ? variantId : null;
    }

    function getSelectedVariant() {
        return getVariantById(getSelectedVariantId());
    }

    function getCountryMatchers(countryCode) {
        switch (countryCode) {
            case 'US':
                return ['ship to us only', 'united states warehouse', 'usa warehouse', 'us warehouse'];
            case 'CA':
                return ['ship to canada only', 'canada warehouse'];
            default:
                return [];
        }
    }

    function getRegionalAvailabilityFromRoot(root, countryCode) {
        if (!root) return null;

        const matchers = getCountryMatchers(countryCode);
        if (!matchers.length) return null;

        const items = Array.from(root.querySelectorAll('.iia-list-item'));
        if (!items.length) return null;

        const match = items.find(function (item) {
            const text = item.textContent.toLowerCase();
            return matchers.some(function (matcher) {
                return text.indexOf(matcher) !== -1;
            });
        });

        if (!match) return null;

        const text = match.textContent.toLowerCase();
        const isUnavailable = ['out of stock', 'sold out', 'unavailable', 'not available', 'no stock'].some(function (phrase) {
            return text.indexOf(phrase) !== -1;
        });
        const isAvailable = ['in stock', 'high stock', 'available', 'limited stock', 'low stock'].some(function (phrase) {
            return text.indexOf(phrase) !== -1;
        });

        if (isUnavailable) {
            return {
                matched: true,
                available: false,
                text: text
            };
        }

        if (isAvailable) {
            return {
                matched: true,
                available: true,
                text: text
            };
        }

        return {
            matched: true,
            available: null,
            text: text
        };
    }

    function getRegionalAvailability(countryCode) {
        return getRegionalAvailabilityFromRoot(getInventoryRoot(), countryCode);
    }

    function setButtonState(button, enabled, text) {
        if (!button) return;

        button.toggleAttribute('disabled', !enabled);
        button.dataset.regionBlocked = enabled ? 'false' : 'true';

        const textNode = button.querySelector('span');
        if (textNode && text) {
            textNode.textContent = text;
        } else if (text) {
            button.textContent = text;
        }
    }

    function getVariantAvailabilityState(variantId, inventoryRoot) {
        const selectedVariant = getVariantById(variantId);
        if (!selectedVariant) {
            return {
                selectedVariant: null,
                finalAvailable: false,
                buttonText: 'Unavailable'
            };
        }

        const countryCode = getCustomerCountry();
        const regionalAvailability = getRegionalAvailabilityFromRoot(inventoryRoot, countryCode);
        const baseAvailable = !!selectedVariant.available;
        const isBlockedByRegion = !!(
            regionalAvailability &&
            regionalAvailability.matched &&
            regionalAvailability.available === false
        );
        const finalAvailable = baseAvailable && !isBlockedByRegion;

        return {
            selectedVariant: selectedVariant,
            finalAvailable: finalAvailable,
            buttonText: finalAvailable ? 'Add To Cart' : 'Out Of Stock'
        };
    }

    function refreshInventoryInfoForVariant(variantId, options) {
        if (!variantId || typeof fetch === 'undefined' || typeof DOMParser === 'undefined') return;

        const inventoryRoot = options && options.targetRoot ? options.targetRoot : getInventoryRoot();
        if (!inventoryRoot) return;

        if (options && options.context === 'nav') {
            loadInventoryMarkupViaIframe(variantId, function (markup) {
                if (!markup) return;

                const currentContainer = inventoryRoot.querySelector('.iia-container');
                if (currentContainer && currentContainer.outerHTML === markup) {
                    return;
                }

                if (currentContainer) {
                    currentContainer.outerHTML = markup;
                } else {
                    inventoryRoot.innerHTML = markup;
                }

                const visibleContainer = inventoryRoot.querySelector('.iia-container');
                if (visibleContainer) {
                    visibleContainer.style.display = 'block';
                }

                updateNavRegionalInventoryGate();
            });
            return;
        }

        const requestUrl = new URL(window.location.href);
        requestUrl.searchParams.set('variant', variantId);

        fetch(requestUrl.toString(), { credentials: 'same-origin' })
            .then(function (response) {
                return response.text();
            })
            .then(function (htmlText) {
                const parsed = new DOMParser().parseFromString(htmlText, 'text/html');
                const nextContainer = getParsedInventoryContainer(parsed);
                if (!nextContainer) return;

                const nextMarkup = getInventoryMarkupHtml(nextContainer, {
                    stripId: !!(options && options.context === 'nav')
                });
                if (!nextMarkup) return;

                const currentContainer = inventoryRoot.querySelector('.iia-container');
                if (currentContainer && currentContainer.outerHTML === nextMarkup) {
                    return;
                }

                if (currentContainer) {
                    currentContainer.outerHTML = nextMarkup;
                } else {
                    inventoryRoot.innerHTML = nextMarkup;
                }

                const visibleContainer = inventoryRoot.querySelector('.iia-container');
                if (visibleContainer) {
                    visibleContainer.style.display = 'block';
                }

                if (options && options.context === 'nav') {
                    updateNavRegionalInventoryGate();
                } else {
                    updateMainRegionalInventoryGate();
                }

                if (
                    (!options || options.context !== 'nav') &&
                    window.venustasRegionalInventoryGate &&
                    typeof window.venustasRegionalInventoryGate.syncNavInventoryMarkup === 'function'
                ) {
                    window.venustasRegionalInventoryGate.syncNavInventoryMarkup();
                }
            })
            .catch(function (error) {
                console.warn('Unable to refresh inventory info for nav variant selection.', error);
            });
    }

    function updateMainRegionalInventoryGate() {
        if (!document.querySelector('.product')) return;

        const mainButton = document.querySelector('.main-product-form .product-atc-form [name="add"]')
            || document.querySelector('.main-product-form .product-atc-form .btn-atc');
        const mainVariantId = document.getElementById('main-product-id');
        const state = getVariantAvailabilityState(mainVariantId ? mainVariantId.value : '', getInventoryRoot());

        if (!state.selectedVariant) {
            setButtonState(mainButton, false, 'Unavailable');
            return;
        }

        setButtonState(mainButton, state.finalAvailable, state.buttonText);

        document.querySelectorAll('.btn-bn').forEach(function (button) {
            button.toggleAttribute('disabled', !state.finalAvailable);
        });
    }

    function updateNavRegionalInventoryGate() {
        const navButton = document.querySelector('#header-nav-product-form [name="add"]')
            || document.querySelector('#header-nav-product-form .btn-atc')
            || document.querySelector('#header-nav-product-form .btn-main')
            || document.querySelector('#header-nav-product-form button[type="submit"]');
        const navVariantId = document.getElementById('main-product-id-nav');
        const navInventoryRoot = getNavInventoryRoot() || getInventoryRoot();
        const state = getVariantAvailabilityState(navVariantId ? navVariantId.value : '', navInventoryRoot);

        if (!state.selectedVariant) {
            setButtonState(navButton, false, 'Unavailable');
            return;
        }

        setButtonState(navButton, state.finalAvailable, state.buttonText);
    }

    function updateRegionalInventoryGate() {
        updateMainRegionalInventoryGate();
        updateNavRegionalInventoryGate();
    }

    function canAddSelectedVariant() {
        const selectedVariant = getVariantById(document.getElementById('main-product-id') ? document.getElementById('main-product-id').value : '');
        if (!selectedVariant || !selectedVariant.available) {
            return {
                allowed: false,
                reason: selectedVariant && selectedVariant.name
                    ? "The product '" + selectedVariant.name + "' is already sold out."
                    : 'This variant is currently out of stock.'
            };
        }

        const regionalAvailability = getRegionalAvailability(getCustomerCountry());
        if (regionalAvailability && regionalAvailability.matched && regionalAvailability.available === false) {
            return {
                allowed: false,
                reason: 'This item is out of stock for your shipping region.'
            };
        }

        return {
            allowed: true
        };
    }

    function queueUpdate() {
        if (typeof window.requestAnimationFrame === 'function') {
            window.requestAnimationFrame(function () {
                updateRegionalInventoryGate();
                syncNavInventoryMarkup();
            });
            return;
        }

        window.setTimeout(function () {
            updateRegionalInventoryGate();
            syncNavInventoryMarkup();
        }, 0);
    }

    function watchInventoryMarkup() {
        if (typeof MutationObserver === 'undefined') return;

        const observer = new MutationObserver(function () {
            queueUpdate();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        if (!document.querySelector('.product')) return;

        window.venustasRegionalInventoryGate = {
            update: updateRegionalInventoryGate,
            canAddSelectedVariant: canAddSelectedVariant,
            syncNavInventoryMarkup: syncNavInventoryMarkup,
            refreshInventoryInfoForVariant: refreshInventoryInfoForVariant,
            getVariantAvailabilityState: getVariantAvailabilityState
        };

        queueUpdate();
        watchInventoryMarkup();

        document.addEventListener('change', function (event) {
            if (
                event.target.matches('#main-product-id, #main-product-id-nav') ||
                event.target.matches('.product-form__input input, .product-form__input select') ||
                event.target.matches('.variant-radio, .nav-variant-radio')
            ) {
                queueUpdate();
            }

            if (event.target.matches('.product .variant-radio, .product .product-form__input select')) {
                const mainInput = document.getElementById('main-product-id');
                const variantId = mainInput ? mainInput.value : '';
                if (variantId) {
                    refreshInventoryInfoForVariant(variantId, {
                        targetRoot: getInventoryRoot(),
                        context: 'main'
                    });
                }
            }

            if (event.target.matches('.nav-variant-radio')) {
                const navInput = document.getElementById('main-product-id-nav');
                const variantId = navInput ? navInput.value : '';
                if (variantId) {
                    refreshInventoryInfoForVariant(variantId, {
                        targetRoot: getNavInventoryRoot(),
                        context: 'nav'
                    });
                }
            }
        });
    });
})();


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

    $('.prorw_preview_badge_setup').on('click', function (e) {
        e.preventDefault();

        const $target = $('.product-review-section').first();
        if (!$target.length) return;

        $('html, body').stop().animate(
            { scrollTop: $target.offset().top - 100},
            600
        );
    });


    if ($('.product-content-counter-section').length) {

        document.querySelectorAll('.product-content-counter-section .item-description strong').forEach(strong => {
            const text = strong.textContent;                 // e.g. "95%"
            const match = text.match(/(\d+(\.\d+)?)/);       // supports decimals
            if (!match) return;

            const num = match[1];                            // "95"
            const rest = text.replace(match[0], '');         // "%" or ""
            strong.innerHTML =
            `<span class="counter-number odometer" data-count="${num}">0</span>${rest}`;
        });
        function startOdometer() {
        document.querySelectorAll('.odometer').forEach(el => {
            const finalValue = el.getAttribute('data-count');
            if (!finalValue) return;

            // IMPORTANT: remove "done" if it exists, and force start at 0
            el.classList.remove('done');
            el.innerHTML = '0';

            // Create odometer instance (requires Odometer.js loaded)
            if (!el._odo && window.Odometer) {
            el._odo = new Odometer({
                el: el,
                value: 0
            });
            }

            const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting || el.classList.contains('done')) return;

                el.classList.add('done');

                // Trigger odometer animation
                if (el._odo) {
                el._odo.update(Number(finalValue));
                } else {
                // fallback if library not present
                el.innerHTML = finalValue;
                }

                obs.unobserve(el);
            });
            }, { threshold: 0.5 });

            observer.observe(el);
        });
        }
        startOdometer();
    }

    nav_header_scroll();
});

$(window).scroll(function() {
    nav_header_scroll();
});

// FUNCTIONS ----------------------------------------------------------------------------------------------

function nav_header_scroll(){
  if ($('.product-page-nav-header-section').length) {
      $('.product-page-nav-header-section').each(function () {

        // Get the top offset of the .product-header-section
        var productHeaderTop = $('.product-page-nav-header-section').offset().top + 150;
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
        

      });

  }
}

$(document).ready(function () {

  $('.product-variant-selector').each(function () {
    const $container = $(this);
    const $variantsWrapper = $container.find('.nav-variants .no-js-hidden.variants');
    const $quantityInput = $container.find('input.qty.quantity__input');
    const $form = $container.find('#header-nav-product-form');

    if (!$variantsWrapper.length || !$form.length) return;

    // ✅ IMPORTANT: if Liquid outputs disabled="", remove it so JS can control states
    $variantsWrapper.find('input[type="radio"]').prop('disabled', false).removeClass('disabled');
    $variantsWrapper.find('.nav-variants-selector').removeClass('disabled soldout');

    // Hidden quantity in form
    if ($form.find('input[name="quantity"]').length === 0) {
      $('<input>', { type: 'hidden', name: 'quantity', value: 1 }).appendTo($form);
    }
    const $hiddenQuantity = $form.find('input[name="quantity"]');

    $quantityInput.on('input change', function () {
      $hiddenQuantity.val($(this).val());
    });

    $form.on('submit', function () {
      $hiddenQuantity.val($quantityInput.val() || 1);
    });

    // Parse variants ONCE (scoped)
    const variantsJson = $variantsWrapper.find('script[type="application/json"]').first().text();
    const variants = JSON.parse(variantsJson || '[]');

    const optionCount = $variantsWrapper.find('fieldset').length;

    function getSelectedOptions() {
      const opts = $variantsWrapper.find('fieldset').map(function () {
        return $(this).find('input[type="radio"]:checked').val() || null;
      }).get();

      // Ensure consistent length
      while (opts.length < optionCount) opts.push(null);
      return opts;
    }

    function findExactVariant(selectedOptions) {
      return variants.find(v =>
        v.options.length === selectedOptions.length &&
        v.options.every((opt, idx) => opt === selectedOptions[idx])
      );
    }

    function findClosestVariant(selectedOptions) {
      // prefer available + match all chosen (non-null)
      let v = variants.find(variant =>
        variant.available &&
        selectedOptions.every((opt, idx) => !opt || variant.options[idx] === opt)
      );
      if (v) return v;

      // otherwise any match
      v = variants.find(variant =>
        selectedOptions.every((opt, idx) => !opt || variant.options[idx] === opt)
      );
      return v || null;
    }

    function setButtonText($btn, text) {
      const $span = $btn.find('span');
      if ($span.length) $span.text(text);
      else $btn.text(text);
    }

    function getMainVariantRadios() {
      return document.querySelector('.product variant-radios');
    }

    function getMainSelectedVariant() {
      const mainInput = document.getElementById('main-product-id');
      const variantId = mainInput ? String(mainInput.value || '') : '';
      if (!variantId) return null;

      return variants.find(function (variant) {
        return String(variant.id) === variantId;
      }) || null;
    }

    function applyNavSelectionToMain(selectedOptions) {
      const mainVariantRadios = getMainVariantRadios();
      if (!mainVariantRadios) return false;

      const fieldsets = mainVariantRadios.querySelectorAll('fieldset');
      let changed = false;

      selectedOptions.forEach(function (value, index) {
        if (!value) return;

        const fieldset = fieldsets[index];
        if (!fieldset) return;

        const radio = Array.from(fieldset.querySelectorAll('input[type="radio"]')).find(function (input) {
          return input.value === value;
        });

        if (!radio) return;

        if (!radio.checked) {
          radio.checked = true;
          changed = true;
        }
      });

      if (typeof mainVariantRadios.updateOptions === 'function') {
        mainVariantRadios.updateOptions();
      }
      if (typeof mainVariantRadios.updateMasterId === 'function') {
        mainVariantRadios.updateMasterId();
      }
      if (typeof mainVariantRadios.onVariantChange === 'function') {
        mainVariantRadios.onVariantChange();
        changed = true;
      }

      return changed;
    }

    function mirrorMainStateToNav() {
      const mainVariantRadios = getMainVariantRadios();
      if (!mainVariantRadios) return;

      const mainFieldsets = Array.from(mainVariantRadios.querySelectorAll('fieldset'));
      const navFieldsets = Array.from($variantsWrapper.find('fieldset'));
      const mainSelectedVariant = getMainSelectedVariant();

      navFieldsets.forEach(function (navFieldsetEl, fieldsetIndex) {
        const mainFieldset = mainFieldsets[fieldsetIndex];
        const $navFieldset = $(navFieldsetEl);
        if (!mainFieldset) return;

        const mainChecked = mainFieldset.querySelector('input[type="radio"]:checked');
        const selectedValue = mainChecked ? mainChecked.value : '';

        $navFieldset.find('.nav-variants-selector').removeClass('selected disabled soldout');

        $navFieldset.find('input[type="radio"]').each(function () {
          const $navRadio = $(this);
          const value = $navRadio.val();
          const navId = $navRadio.attr('id');

          const mainRadio = Array.from(mainFieldset.querySelectorAll('input[type="radio"]')).find(function (input) {
            return input.value === value;
          });

          if (!mainRadio) return;

          const mainSelector = mainFieldset.querySelector('.variants-selector[data-id="' + mainRadio.id + '"]');
          const $navSelector = $navFieldset.find('.nav-variants-selector[data-id="' + navId + '"]');

          $navRadio.prop('checked', !!mainRadio.checked);

          if ($navSelector.length && mainSelector) {
            $navSelector.toggleClass('selected', !!mainRadio.checked);
            $navSelector.toggleClass('disabled', mainSelector.classList.contains('disabled'));
            $navSelector.toggleClass('soldout', mainSelector.classList.contains('soldout'));

            var mainDisplay = window.getComputedStyle(mainSelector).display;
            $navSelector.css('display', mainDisplay === 'none' ? 'none' : '');
          }
        });

        const $info = $navFieldset.find('.variant-info');
        if ($info.length && selectedValue) {
          const base = ($info.text().split(':')[0] || '').trim();
          $info.text((base ? base : '') + (base ? ' : ' : ': ') + selectedValue);
        }
      });

      const $idInput = $form.find('#main-product-id-nav, input[name="id"]').first();
      if (mainSelectedVariant && $idInput.length) {
        $idInput.val(mainSelectedVariant.id);
      }

      updateAddToCart(mainSelectedVariant || findExactVariant(getSelectedOptions()));

      if (
        window.venustasRegionalInventoryGate &&
        typeof window.venustasRegionalInventoryGate.syncNavInventoryMarkup === 'function'
      ) {
        window.venustasRegionalInventoryGate.syncNavInventoryMarkup();
      }
    }

    function syncMainVariantRadios(currentVariant) {
      if (!currentVariant || !Array.isArray(currentVariant.options)) return;

      const mainVariantRadios = document.querySelector('.product variant-radios');
      if (!mainVariantRadios) return;

      const fieldsets = mainVariantRadios.querySelectorAll('fieldset');
      let hasSelectionChanged = false;

      currentVariant.options.forEach(function (value, index) {
        const fieldset = fieldsets[index];
        if (!fieldset) return;

        const radio = Array.from(fieldset.querySelectorAll('input[type="radio"]')).find(function (input) {
          return input.value === value;
        });

        if (!radio) return;

        if (!radio.checked) {
          radio.checked = true;
          hasSelectionChanged = true;
        }

        fieldset.querySelectorAll('.variants-selector').forEach(function (selector) {
          selector.classList.remove('selected');
        });

        const selector = fieldset.querySelector('.variants-selector[data-id="' + radio.id + '"]');
        if (selector) {
          selector.classList.add('selected');
        }
      });

      if (typeof mainVariantRadios.updateOptions === 'function') {
        mainVariantRadios.updateOptions();
      }
      if (typeof mainVariantRadios.updateMasterId === 'function') {
        mainVariantRadios.updateMasterId();
      }

      const mainInput = document.getElementById('main-product-id');
      if (mainInput && String(mainInput.value) !== String(currentVariant.id)) {
        mainInput.value = currentVariant.id;
        hasSelectionChanged = true;
      }

      if (hasSelectionChanged && typeof mainVariantRadios.onVariantChange === 'function') {
        mainVariantRadios.onVariantChange();
      } else if (mainInput) {
        mainInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }

    function updateAddToCart(currentVariant) {
      const $idInput = $form.find('#main-product-id, input[name="id"]').first();
      const $addBtn = $form.find('[name="add"]').first();
      if (!$addBtn.length) return;

      if (!currentVariant) {
        $idInput.val('');
        $addBtn.prop('disabled', true);
        setButtonText($addBtn, 'Unavailable');
        return;
      }

      $idInput.val(currentVariant.id);

      if (!currentVariant.available) {
        $addBtn.prop('disabled', true);
        setButtonText($addBtn, 'Out Of Stock');
      } else {
        $addBtn.prop('disabled', false);
        setButtonText($addBtn, 'Add To Cart');
      }
    }

    function applyVariantToUI(variant) {
      if (!variant) return;

      $variantsWrapper.find('fieldset').each(function (idx) {
        const value = variant.options[idx];
        const $fieldset = $(this);

        $fieldset.find('.nav-variants-selector').removeClass('selected');

        $fieldset.find('input[type="radio"]').each(function () {
          const $radio = $(this);
          const isMatch = $radio.val() === value;
          $radio.prop('checked', isMatch);

          if (isMatch) {
            const id = $radio.attr('id');
            $fieldset.find(`.nav-variants-selector[data-id="${id}"]`).addClass('selected');
          }
        });

        const $info = $fieldset.find('.variant-info');
        if ($info.length) {
          const base = ($info.text().split(':')[0] || '').trim();
          $info.text(`${base ? base : ''}${base ? ' : ' : ': '}${value}`);
        }
      });
    }

    // ✅ KEY FIX: PARTIAL MATCH existence check
    // "exists" = there is ANY variant matching this candidate val + current selections on other options (non-null)
    function updateDisabledStates(selectedOptions) {
      $variantsWrapper.find('fieldset').each(function (optionIndex) {
        const $fieldset = $(this);

        $fieldset.find('input[type="radio"]').each(function () {
          const $radio = $(this);
          const val = $radio.val();

          const matchesOtherSelected = (variant) => {
            return variant.options.every((opt, idx) => {
              if (idx === optionIndex) return opt === val;              // candidate
              const selected = selectedOptions[idx];
              if (!selected) return true;                                // not chosen yet -> ignore
              return opt === selected;                                    // must match chosen
            });
          };

          const exists = variants.some(v => matchesOtherSelected(v));
          const available = variants.some(v => v.available && matchesOtherSelected(v));

          // Disable ONLY if it doesn't exist at all
          $radio.prop('disabled', !exists).toggleClass('disabled', !exists);

          const id = $radio.attr('id');
          const $swatch = $fieldset.find(`.nav-variants-selector[data-id="${id}"]`);

          $swatch
            .toggleClass('disabled', !exists)
            .toggleClass('soldout', exists && !available);
        });
      });
    }

    function updateVariantInputs() {
      let selectedOptions = getSelectedOptions();
      let currentVariant = findExactVariant(selectedOptions);

      // If invalid combo, snap to closest (prefer available)
      if (!currentVariant) {
        const closest = findClosestVariant(selectedOptions);
        if (closest) {
          applyVariantToUI(closest);
          selectedOptions = getSelectedOptions();
          currentVariant = findExactVariant(selectedOptions);
        }
      }

      updateDisabledStates(selectedOptions);
      updateAddToCart(currentVariant);

      if (currentVariant) {
        applyNavSelectionToMain(selectedOptions);
        syncMainVariantRadios(currentVariant);
        if (
          window.venustasRegionalInventoryGate &&
          typeof window.venustasRegionalInventoryGate.refreshInventoryInfoForVariant === 'function'
        ) {
          window.venustasRegionalInventoryGate.refreshInventoryInfoForVariant(currentVariant.id);
        }
      }

      window.setTimeout(mirrorMainStateToNav, 0);
      window.setTimeout(mirrorMainStateToNav, 120);
    }

    // Swatch click (allow soldout; block only truly disabled)
    $variantsWrapper.on('click', '.nav-variants-selector:not(.disabled)', function () {
      const inputId = $(this).data('id');
      const $input = $variantsWrapper.find('#' + inputId);

      if ($input.length && !$input.prop('disabled')) {
        $input.prop('checked', true).trigger('change');

        $(this).closest('fieldset').find('.nav-variants-selector').removeClass('selected');
        $(this).addClass('selected');
      }
    });

    $variantsWrapper.on('change', 'input[type="radio"]', updateVariantInputs);

    $(document).on('change.navInventorySync', '#main-product-id, .product .variant-radio', function () {
      window.setTimeout(mirrorMainStateToNav, 0);
    });

    // Init
    updateVariantInputs();
  });

});

$(document).ready(function () {
  $('.product-variant-selector').each(function () {
    const $container = $(this);
    const $variantsWrapper = $container.find('.nav-variants .no-js-hidden.variants');
    const $quantityInput = $container.find('input.qty.quantity__input');
    const $form = $container.find('#header-nav-product-form');

    if (!$variantsWrapper.length || !$form.length) return;
    return;

    const $hiddenQuantity = $form.find('input[name="quantity"]');

    const variantsJson = $variantsWrapper.find('script[type="application/json"]').first().text();
    const variants = JSON.parse(variantsJson || '[]');
    const optionCount = $variantsWrapper.find('fieldset').length;

    function getNavAddButton() {
      return $form.find('[name="add"], .btn-atc, .btn-main, button[type="submit"]').first();
    }

    function setButtonText($btn, text) {
      const $span = $btn.find('span');
      if ($span.length) $span.text(text);
      else $btn.text(text);
    }

    function getSelectedOptions() {
      const opts = $variantsWrapper.find('fieldset').map(function () {
        return $(this).find('input[type="radio"]:checked').val() || null;
      }).get();

      while (opts.length < optionCount) opts.push(null);
      return opts;
    }

    function findExactVariant(selectedOptions) {
      return variants.find(function (variant) {
        return variant.options.length === selectedOptions.length &&
          variant.options.every(function (opt, idx) {
            return opt === selectedOptions[idx];
          });
      }) || null;
    }

    function findClosestVariant(selectedOptions) {
      let variant = variants.find(function (candidate) {
        return candidate.available && selectedOptions.every(function (opt, idx) {
          return !opt || candidate.options[idx] === opt;
        });
      });
      if (variant) return variant;

      return variants.find(function (candidate) {
        return selectedOptions.every(function (opt, idx) {
          return !opt || candidate.options[idx] === opt;
        });
      }) || null;
    }

    function applyVariantToUI(variant) {
      if (!variant) return;

      $variantsWrapper.find('fieldset').each(function (idx) {
        const value = variant.options[idx];
        const $fieldset = $(this);

        $fieldset.find('.nav-variants-selector').removeClass('selected');

        $fieldset.find('input[type="radio"]').each(function () {
          const $radio = $(this);
          const isMatch = $radio.val() === value;
          $radio.prop('checked', isMatch);

          if (isMatch) {
            $fieldset.find('.nav-variants-selector[data-id="' + $radio.attr('id') + '"]').addClass('selected');
          }
        });

        const $info = $fieldset.find('.variant-info');
        if ($info.length) {
          const base = ($info.text().split(':')[0] || '').trim();
          $info.text((base ? base : '') + (base ? ' : ' : ': ') + value);
        }
      });
    }

    function updateDisabledStates(selectedOptions) {
      $variantsWrapper.find('fieldset').each(function (optionIndex) {
        const $fieldset = $(this);

        $fieldset.find('input[type="radio"]').each(function () {
          const $radio = $(this);
          const value = $radio.val();

          const matchesOtherSelected = function (variant) {
            return variant.options.every(function (opt, idx) {
              if (idx === optionIndex) return opt === value;
              const selected = selectedOptions[idx];
              if (!selected) return true;
              return opt === selected;
            });
          };

          const exists = variants.some(function (variant) {
            return matchesOtherSelected(variant);
          });
          const available = variants.some(function (variant) {
            return variant.available && matchesOtherSelected(variant);
          });

          $radio.prop('disabled', !exists).toggleClass('disabled', !exists);

          const $swatch = $fieldset.find('.nav-variants-selector[data-id="' + $radio.attr('id') + '"]');
          $swatch.toggleClass('disabled', !exists);
          $swatch.toggleClass('soldout', exists && !available);
        });
      });
    }

    function updateNavButtonState(variant) {
      const $navButton = getNavAddButton();
      if (!$navButton.length) return;

      if (!variant) {
        $navButton.prop('disabled', true);
        setButtonText($navButton, 'Unavailable');
        return;
      }

      const inventoryGate = window.venustasRegionalInventoryGate;
      const state = inventoryGate && typeof inventoryGate.getVariantAvailabilityState === 'function'
        ? inventoryGate.getVariantAvailabilityState(variant.id, document.querySelector('.product-page-nav-header-section .nav-inventory-info-app'))
        : { finalAvailable: !!variant.available, buttonText: variant.available ? 'Add To Cart' : 'Out Of Stock' };

      $navButton.prop('disabled', !state.finalAvailable);
      setButtonText($navButton, state.buttonText);
    }

    function updateNavVariantInputs() {
      let selectedOptions = getSelectedOptions();
      let currentVariant = findExactVariant(selectedOptions);

      if (!currentVariant) {
        const closestVariant = findClosestVariant(selectedOptions);
        if (closestVariant) {
          applyVariantToUI(closestVariant);
          selectedOptions = getSelectedOptions();
          currentVariant = findExactVariant(selectedOptions);
        }
      }

      updateDisabledStates(selectedOptions);

      const $idInput = $form.find('#main-product-id-nav, input[name="id"]').first();
      if ($idInput.length) {
        $idInput.val(currentVariant ? currentVariant.id : '');
      }

      if ($hiddenQuantity.length && $quantityInput.length) {
        $hiddenQuantity.val($quantityInput.val() || 1);
      }

      updateNavButtonState(currentVariant);

      if (
        currentVariant &&
        window.venustasRegionalInventoryGate &&
        typeof window.venustasRegionalInventoryGate.refreshInventoryInfoForVariant === 'function'
      ) {
        window.venustasRegionalInventoryGate.refreshInventoryInfoForVariant(currentVariant.id, {
          targetRoot: document.querySelector('.product-page-nav-header-section .nav-inventory-info-app'),
          context: 'nav'
        });
      }
    }

    $variantsWrapper.off('click', '.nav-variants-selector');
    $variantsWrapper.off('change', 'input[type="radio"]');
    $(document).off('change.navInventorySync');
    $(document).off('change.navProxySync');

    $variantsWrapper.on('click', '.nav-variants-selector:not(.disabled)', function () {
      const inputId = $(this).data('id');
      const $input = $variantsWrapper.find('#' + inputId);

      if ($input.length && !$input.prop('disabled')) {
        $input.prop('checked', true).trigger('change');
      }
    });

    $variantsWrapper.on('change', 'input[type="radio"]', function () {
      updateNavVariantInputs();
    });

    updateNavVariantInputs();
  });
});


if(enabled_option_indicator){
    $(document).ready(function initVariantSizeToggle() {
        $('.variant-size').each(function() {
            const $fieldset = $(this);

            // don't init twice
            if ($fieldset.data('vst-initialized')) return;
            $fieldset.data('vst-initialized', true);

            // insert toggles if not present
            if (!$fieldset.find('.variant-type-toggle').length) {
            const toggleButtons = `
                <div class="variant-type-toggle">
                    <button type="button" class="variant-type-btn active" data-type="standard">Standard</button>
                    <button type="button" class="variant-type-btn" data-type="tall">Tall</button>
                </div>
            `;
            $fieldset.find('legend').after(toggleButtons);
            }


            function getOptionPairs() {
            return $fieldset.find('.variants-selector, .nav-variants-selector').map(function() {
                const $selector = $(this);
                const text = $selector.text().trim();
                const $option = $selector.next('.variants-option, .nav-variants-option');
                const $input = $option.find('input.variant-radio, input.nav-variant-radio');

                return {
                selector: $selector,
                option: $option,
                input: $input,
                text: text
                };
            }).get();
            }

            function isSizeVisibleForType(text, type) {
            if (type === 'tall') return tallSizes.includes(text);
            return standardSizes.includes(text);
            }

            function showSizes(type) {
            getOptionPairs().forEach(function(pair) {
                const shouldShow = isSizeVisibleForType(pair.text, type);
                pair.selector.toggle(shouldShow);
                pair.option.toggle(shouldShow);
            });
            }

            // Robust detection of the currently selected size text
            function getSelectedSizeText() {
            let text = '';

            // 1) Prefer selector with 'selected' class
            const $sel = $fieldset.find('.variants-selector.selected, .nav-variants-selector.selected');
            if ($sel.length) {
                text = $sel.first().text().trim();
                if (text) return text;
            }

            // 2) Check for a checked input and find its related selector
            const $checked = $fieldset.find('input.variant-radio:checked, input.nav-variant-radio:checked');
            if ($checked.length) {
                // common markup: <span class="variants-selector">...</span><span class="variants-option"><input ...></span>
                const $prevSelector = $checked.closest('.variants-option').prev('.variants-selector, .nav-variants-selector');
                if ($prevSelector.length) {
                text = $prevSelector.text().trim();
                if (text) return text;
                }

                // maybe input is inside the selector itself
                const $insideSelector = $checked.closest('.variants-selector, .nav-variants-selector');
                if ($insideSelector.length) {
                text = $insideSelector.text().trim();
                if (text) return text;
                }

                // fallback: attempt to match by index between inputs and selector list
                const idx = $fieldset.find('input.variant-radio, input.nav-variant-radio').index($checked);
                if (idx >= 0) {
                const $selByIndex = $fieldset.find('.variants-selector, .nav-variants-selector').eq(idx);
                if ($selByIndex.length) {
                    text = $selByIndex.text().trim();
                    if (text) return text;
                }
                }
            }

            // 3) For <select> dropdown fallback
            const $select = $fieldset.find('select[name="Size"], select');
            if ($select.length) {
                const val = $select.val();
                if (val) return String(val).trim();
            }

            return text; // may be empty if not found
            }

            function getCurrentType() {
            return $fieldset.data('variantTypeMode') || null;
            }

            function setCurrentType(type) {
            $fieldset.data('variantTypeMode', type);
            $fieldset.find('.variant-type-btn').removeClass('active');
            $fieldset.find(`.variant-type-btn[data-type="${type}"]`).addClass('active');
            showSizes(type);
            }

            function detectSelectedType() {
            const existingType = getCurrentType();
            if (existingType) {
                showSizes(existingType);
                $fieldset.find('.variant-type-btn').removeClass('active');
                $fieldset.find(`.variant-type-btn[data-type="${existingType}"]`).addClass('active');
                return;
            }

            const selectedText = getSelectedSizeText();
            let selectedType = 'standard';
            if (selectedText && tallSizes.includes(selectedText)) selectedType = 'tall';

            setCurrentType(selectedType);
            }

            // Initial detection on page load
            detectSelectedType();

            // React when user changes a radio or a select inside this fieldset
            $fieldset.on('change', 'input.variant-radio, input.nav-variant-radio, select', function() {
            const currentType = getCurrentType();
            if (currentType) {
                showSizes(currentType);
                return;
            }

            detectSelectedType();
            });

            // Toggle click handler
            $fieldset.on('click', '.variant-type-btn', function() {
            const type = $(this).data('type');
            setCurrentType(type);
            });
        });
    });
}

