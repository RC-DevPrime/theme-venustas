$(document).ready(function () {
    let searchKeyword = '';


    if ($('.blog-search-bar-section').length) {
        let searchDelay;

        $('.blog-search-bar-section .search-input').on('input', function(){

            clearTimeout(searchDelay);

            const value = $(this).val().trim().toLowerCase();
            
            searchDelay = setTimeout(function(){
                searchKeyword = value;
                applyFilterSortAndRender();

                // $('html, body').animate({
                //     scrollTop: $('.main-blog-container').offset().top - 120
                // }, 400);

            }, 600); // adjust speed here
        });

        $('.blog-search-bar-section .delete-btn').on('click', function(){
            $('.blog-search-bar-section .search-input').val('');
            searchKeyword = '';
            applyFilterSortAndRender();

        });

    }

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

    if ($('.main-page-section').length) {

        const $nav = $('.main-page-section .mobile-blog-list-tags-nav');
        const $inner = $nav.find('.main-page-section .inner-section');
        const $overlay = $nav.find('.main-page-section .overlay');

        // ✅ Open panel
        $('.main-page-section .nav-hover-blog-nav').on('click', function() {
            $nav.addClass('open');
            $('body').addClass('overflow-hidden');
        });

        // ✅ Close panel (slide right → left with fade)
        $('.main-page-section .btn-close-toc, .main-page-section .mobile-blog-list-tags-nav .overlay').on('click', function() {
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

        const $header = $('.shopify-section-group-header-group .header');
        const headerHeight = $header.outerHeight();
        $('.main-page-section .sticky-article-tag').css('top', headerHeight + 30);
        
        $(window).on('load resize', function () {
            const $header = $('.shopify-section-group-header-group .header');
            if ($header.length) {
                const headerHeight = $header.outerHeight();
                $('.main-page-section .sticky-article-tag').css('top', headerHeight + 30);
            }
        });
        
        // ----------------------
        // Utilities
        // ----------------------
        const parseDate = (d) => new Date(d); // "Nov 07, 2025" is fine for Date()

        const getSlugFromURL = () => {
            const m = window.location.pathname.split('/tagged/');
            return (m.length > 1) ? decodeURIComponent(m[1].split('/')[0]) : '';
        };

        const setActiveSidebarBySlug = (slug) => {
            $('.main-page-section .list-article-tags').each(function () {

                const $items = $(this).find('.list-article-item');
                $items.removeClass('active');

                if (!slug) {
                const $all = $items.filter(function () {
                    const href = $(this).attr('href') || '';
                    return !/\/tagged\//.test(href);
                }).first();

                ($all.length ? $all : $items.first()).addClass('active');
                return;
                }

                $items.each(function(){
                const href = $(this).attr('href') || '';
                if (href.includes('/tagged/')) {
                    const linkSlug = href.split('/tagged/')[1]?.split('/')[0] || '';
                    if (linkSlug === slug) {
                    $(this).addClass('active');
                    }
                }
                });
            });
        };

        const readBlogPayload = (root = document) => {
            const script = root.querySelector('#blog-articles-data');
            if (!script) {
                return {
                    blogUrl: window.location.pathname,
                    currentTagSlug: getSlugFromURL(),
                    totalItems: 0,
                    currentPage: 1,
                    pages: 1,
                    nextPageUrl: null,
                    articles: []
                };
            }

            try {
                const payload = JSON.parse(script.textContent);
                return {
                    blogUrl: payload.blogUrl || window.location.pathname,
                    currentTagSlug: payload.currentTagSlug || '',
                    totalItems: Number(payload.totalItems || 0),
                    currentPage: Number(payload.currentPage || 1),
                    pages: Number(payload.pages || 1),
                    nextPageUrl: payload.nextPageUrl || null,
                    articles: Array.isArray(payload.articles) ? payload.articles : []
                };
            } catch (error) {
                console.error('Failed to parse blog payload', error);
                return {
                    blogUrl: window.location.pathname,
                    currentTagSlug: getSlugFromURL(),
                    totalItems: 0,
                    currentPage: 1,
                    pages: 1,
                    nextPageUrl: null,
                    articles: []
                };
            }
        };

        let pagePayload = readBlogPayload();
        let currentBlogBaseUrl = pagePayload.blogUrl || window.location.pathname;
        let expectedTotalItems = pagePayload.totalItems || pagePayload.articles.length;
        let nextPageUrl = pagePayload.nextPageUrl || null;

        // Master data from Liquid
        let ALL = [...pagePayload.articles];

        // State
        let currentTagSlug = pagePayload.currentTagSlug || getSlugFromURL();
        let sortOrder = 'desc';
        let index = 0;
        let perload = 10;
        let loading = false;
        let tagLoading = false;
        let hydrateRequestId = 0;

        // Working lists
        let FILTERED = [];
        let REMAINING = [];
        let originalTotal = 0;

        // ----------------------
        // Rendering
        // ----------------------
        const pickDisplayTag = (tags, slug) => {
            if (!Array.isArray(tags) || tags.length === 0) return '';
            if (slug) {
                const match = tags.find(t => t.slug === slug);
                if (match) return match.label !== '' ? match.label : match.slug.replace(/-/g,' ').replace(/\b\w/g, c => c.toUpperCase());
            }
            return tags[0].label !== '' ? tags[0].label : tags[0].slug.replace(/-/g,' ').replace(/\b\w/g, c => c.toUpperCase());
        };

        function renderArticleItem(item){
            const displayTag = pickDisplayTag(item.tags || [], currentTagSlug);
            return `
            <div class="article-item" data-tags="${item.tags ? item.tags.map(t=>t.slug).join(',') : ''}">
                <a href="${item.url}" class="article-featured-image">
                    ${item.img ? `<img src="${item.img}" width="100%" height="100%">` : ''}
                    ${displayTag ? `<p class="pp-regular article-tag">${displayTag}</p>` : ''}
                </a>

                <div class="article-detail">
                    <a href="${item.url}" class="pp-bold pretitle-lg f-black pb-2">
                        <span class="pretitle d-lg-block d-md-block d-sm-none">${item.title || ''}</span>
                        <span class="body-xl d-lg-none d-md-none d-sm-block">${item.title || ''}</span>
                    </a>

                    <div class="article-description pp-regular f-white-gray l-h-normal pb-2">
                        <div class="d-lg-block d-md-block d-sm-none">
                            <span class="body excerpt-3">${item.excerpt || ''}</span>
                        </div>
                        <div class="d-lg-none d-md-none d-sm-block">
                            <span class="body-sm excerpt-3">${item.excerpt || ''}</span>
                        </div>
                    </div>

                    <div class="article-date-time pp-regular f-main l-h-normal">
                        <span class="body d-lg-block d-md-block d-sm-none">${item.date || ''}</span>
                        <span class="body-sm d-lg-none d-md-none d-sm-block">${item.date || ''}</span>
                    </div>
                </div>
            </div>`;
        }


        function updateCounter(){
            const showing = $('#blog-section .article-item').length;
            const visibleStart = showing > 0 ? 1 : 0;
            const totalForCounter = Math.max(originalTotal, expectedTotalItems);
            $('#viewingCounter').text(`Viewing ${visibleStart} - ${showing} of ${totalForCounter} articles`);
        }

        function applyFilterSortAndRender(){
            FILTERED = [...ALL];

            if ($('.blog-search-bar-section').length) {
                FILTERED = FILTERED.filter(i => {
                    return i.title.toLowerCase().includes(searchKeyword) ||
                        i.excerpt.toLowerCase().includes(searchKeyword);
                });
                // 2) SEARCH FILTER
                // UPDATE RESULT INFO STATUS
                const searchTotal = FILTERED.length;

                if(searchTotal === 0 && searchKeyword !== '') {
                    $('.result-info').show().text(`No results found for "${searchKeyword}"`);
                    $('.blog-featured-articles-section').hide();
                } else if(searchKeyword !== '') {
                    $('.result-info').show().text(`Found ${searchTotal} results for "${searchKeyword}"`);
                    $('.blog-featured-articles-section').hide();
                } else {
                    $('.result-info').hide().text('');
                    $('.blog-featured-articles-section').show();
                }
            }


            FILTERED.sort((a,b) => {
                const da = parseDate(a.date), db = parseDate(b.date);
                return sortOrder === 'desc' ? (db - da) : (da - db);
            });

            originalTotal = FILTERED.length;

            $('#blog-section').empty();
            const firstBatch = FILTERED.slice(0, 10);
            firstBatch.forEach(item => $('#blog-section').append(renderArticleItem(item)));

            REMAINING = FILTERED.slice(10);
            index = 0; 
            updateCounter();

            if (REMAINING.length > 0) {
                $('#loadMoreBtn').show();
                // $(window).off('scroll.blogLoad').on('scroll.blogLoad', infiniteScrollCheck);
            } else {
                $('#loadMoreBtn').hide();
                // $(window).off('scroll.blogLoad');
            }

            setActiveSidebarBySlug(currentTagSlug);
        }

        async function fetchBlogPayload(url) {
            const response = await fetch(url, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (!response.ok) {
                throw new Error(`Request failed with ${response.status}`);
            }

            const html = await response.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');
            return readBlogPayload(doc);
        }

        function mergeArticles(existingArticles, incomingArticles) {
            const seen = new Set(existingArticles.map(article => article.url));
            const merged = [...existingArticles];

            incomingArticles.forEach(article => {
                if (!seen.has(article.url)) {
                    seen.add(article.url);
                    merged.push(article);
                }
            });

            return merged;
        }

        async function hydrateAllPages(requestId) {
            let pendingUrl = nextPageUrl;
            let mergedArticles = [...ALL];

            while (pendingUrl && requestId === hydrateRequestId) {
                const payload = await fetchBlogPayload(pendingUrl);
                mergedArticles = mergeArticles(mergedArticles, payload.articles || []);
                pendingUrl = payload.nextPageUrl || null;
                expectedTotalItems = Math.max(expectedTotalItems, payload.totalItems || mergedArticles.length);
            }

            if (requestId !== hydrateRequestId) return;

            ALL = mergedArticles;
            nextPageUrl = pendingUrl;
            applyFilterSortAndRender();
        }

        function updateBrowserUrl(url, replace = false) {
            if (replace) {
                history.replaceState({ path: url }, '', url);
            } else {
                history.pushState({ path: url }, '', url);
            }
        }

        function setTagLoadingState(targetHref = '') {
            $('.list-article-tags .list-article-item').removeClass('loading');

            if (!targetHref) return;

            $('.list-article-tags .list-article-item').filter(function(){
                return ($(this).attr('href') || '') === targetHref;
            }).addClass('loading');
        }

        async function loadBlogPage(url, options = {}) {
            if (tagLoading) return;
            tagLoading = true;

            const {
                pushHistory = true,
                preserveSearch = true
            } = options;

            const $grid = $('#blog-section');
            const previousHtml = $grid.html();
            const previousAll = [...ALL];
            const previousBaseUrl = currentBlogBaseUrl;
            const previousTagSlug = currentTagSlug;

            setTagLoadingState(url);
            $grid.addClass('is-loading');
            $('#loadMoreBtn').prop('disabled', true);

            try {
                const payload = await fetchBlogPayload(url);

                ALL = [...payload.articles];
                currentBlogBaseUrl = payload.blogUrl || currentBlogBaseUrl;
                currentTagSlug = payload.currentTagSlug || '';
                expectedTotalItems = payload.totalItems || payload.articles.length;
                nextPageUrl = payload.nextPageUrl || null;
                hydrateRequestId += 1;
                const requestId = hydrateRequestId;

                if (!preserveSearch) {
                    searchKeyword = '';
                    $('.blog-search-bar-section .search-input').val('');
                }

                applyFilterSortAndRender();
                if (nextPageUrl) {
                    await hydrateAllPages(requestId);
                }

                if (pushHistory) {
                    updateBrowserUrl(url);
                } else {
                    updateBrowserUrl(url, true);
                }

                $('html, body').animate({
                    scrollTop: $('.main-blog-container').offset().top - 200
                }, 100);
            } catch (error) {
                console.error('Failed to load blog page via AJAX', error);
                ALL = previousAll;
                currentBlogBaseUrl = previousBaseUrl;
                currentTagSlug = previousTagSlug;
                expectedTotalItems = previousAll.length;
                nextPageUrl = null;
                $grid.html(previousHtml);
                window.location.href = url;
            } finally {
                tagLoading = false;
                setTagLoadingState('');
                $grid.removeClass('is-loading');
                $('#loadMoreBtn').prop('disabled', false);
            }
        }

        // Sort UI
        $('.filter-sort-by-container .custom-select').on('click', function(){
            $(this).next('.custom-select-option').toggleClass('show');
        });

        $('.filter-sort-by-container .custom-select-option span').on('click', function(){
            const selected = $(this).text().trim();
            $(this).closest('.filter-sort-by-container').find('.custom-select span.pp-bold').text(selected);
            $(this).parent().removeClass('show');

            sortOrder = (selected === 'Date Latest first') ? 'desc' : 'asc';
            applyFilterSortAndRender();
        });

        $(document).on('click', function(e){
            if (!$(e.target).closest('.filter-sort-by-container').length) {
                $('.custom-select-option').removeClass('show');
            }
        });

        // Load More
        function loadMoreBlogs(){
        if (loading) return;
        loading = true;

        const items = REMAINING.slice(index, index + perload);
        items.forEach(item => $('#blog-section').append(renderArticleItem(item)));

        index += perload;
        loading = false;

        updateCounter();

        if (index >= REMAINING.length) {
            $('#loadMoreBtn').hide();
        }
        }


        // function infiniteScrollCheck(){
        //     if ($(window).scrollTop() + $(window).height() >= $(document).height() - 600) {
        //         loadMoreBlogs();
        //     }
        // }

        $('#loadMoreBtn').on('click', loadMoreBlogs);

        $('.list-article-tags .list-article-item').on('click', function(e){
            const href = $(this).attr('href') || '';
            if (!href || e.which === 2 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

            e.preventDefault();
            loadBlogPage(href);
        });

        window.addEventListener('popstate', function(){
            loadBlogPage(window.location.pathname + window.location.search, {
                pushHistory: false
            });
        });

        currentTagSlug = pagePayload.currentTagSlug || getSlugFromURL();
        setActiveSidebarBySlug(currentTagSlug);
        applyFilterSortAndRender();
        if (nextPageUrl) {
            hydrateRequestId += 1;
            hydrateAllPages(hydrateRequestId);
        }
    }

});
