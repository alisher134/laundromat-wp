// Add at top level
let dataLoaded = false;
let DATA = [];
let isInstructionsPage = false;

// Server-side pagination state
let totalItems = 0;
let totalPages = 0;
const DEFAULT_ITEMS_PER_PAGE = 2;

document.addEventListener('DOMContentLoaded', () => {
  isInstructionsPage =
    window.location.pathname.includes('instructions.html') ||
    window.location.href.includes('instructions.html') ||
    document.querySelector('h1#tips-title')?.textContent.trim() === 'Instructions';

  showLoadingState();

  // Listen for API data (for categories and initial load)
  window.addEventListener('laundromatDataReady', handleDataReady);

  // Timeout fallback
  setTimeout(() => {
    if (!dataLoaded) {
      showErrorState('Data loading timeout. Please refresh the page.');
    }
  }, 10000);
});

function handleDataReady(event) {
  const { tips, instructions, fromAPI, error } = event.detail;

  if (error) {
    showErrorState('Failed to load tips: ' + error);
    return;
  }

  dataLoaded = true;
  hideLoadingState();

  // We'll use the server-side pagination, so just initialize the page
  // The initial data comes from tips-data.js for categories, but we'll fetch paginated data
  initPage();
}

// Phase 2: Add UI state functions (global scope)
function showLoadingState() {
  const gridDesktop = document.getElementById('tips-grid-desktop');
  const sliderMobile = document.getElementById('tips-slider-mobile');

  const loadingHtml = `
    <div class="col-span-2 flex flex-col items-center justify-center py-20">
      <div class="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-brand/20 border-t-brand"></div>
      <p class="text-text/60 text-lg">Loading ${isInstructionsPage ? 'instructions' : 'tips'}...</p>
    </div>
  `;

  if (gridDesktop) gridDesktop.innerHTML = loadingHtml;
  if (sliderMobile) sliderMobile.innerHTML = loadingHtml;
}

function hideLoadingState() {
  // Handled by renderContent
}

function showErrorState(message) {
  const gridDesktop = document.getElementById('tips-grid-desktop');
  const sliderMobile = document.getElementById('tips-slider-mobile');

  const errorHtml = `
    <div class="col-span-2 flex flex-col items-center justify-center py-20">
      <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <svg class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p class="text-text mb-4 text-lg">${message}</p>
      <button onclick="window.location.reload()" class="rounded-lg bg-brand px-6 py-2 text-white transition-colors hover:bg-brand/90">
        Retry
      </button>
    </div>
  `;

  if (gridDesktop) gridDesktop.innerHTML = errorHtml;
  if (sliderMobile) sliderMobile.innerHTML = errorHtml;
}

function showEmptyState() {
  const gridDesktop = document.getElementById('tips-grid-desktop');
  const sliderMobile = document.getElementById('tips-slider-mobile');

  const emptyHtml = `
    <div class="col-span-2 flex flex-col items-center justify-center py-20">
      <p class="text-text/60 text-lg">No ${isInstructionsPage ? 'instructions' : 'tips'} found.</p>
    </div>
  `;

  if (gridDesktop) gridDesktop.innerHTML = emptyHtml;
  if (sliderMobile) sliderMobile.innerHTML = emptyHtml;
}

(function () {
  // --- URL State Management ---
  function getStateFromURL() {
    const params = new URLSearchParams(window.location.search);
    return {
      page: parseInt(params.get('page')) || 1,
      category: params.get('category') || 'all',
      sort: params.get('sort') || '',
      perPage: parseInt(params.get('perPage')) || DEFAULT_ITEMS_PER_PAGE,
    };
  }

  function updateURL(page, category, sort, perPage) {
    const params = new URLSearchParams(window.location.search);

    // Update or remove params
    if (page > 1) {
      params.set('page', page);
    } else {
      params.delete('page');
    }

    if (category && category !== 'all') {
      params.set('category', category);
    } else {
      params.delete('category');
    }

    if (sort) {
      params.set('sort', sort);
    } else {
      params.delete('sort');
    }

    if (perPage && perPage !== DEFAULT_ITEMS_PER_PAGE) {
      params.set('perPage', perPage);
    } else {
      params.delete('perPage');
    }

    const newURL = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname;

    window.history.replaceState({}, '', newURL);
  }

  // Initialize state from URL
  const urlState = getStateFromURL();
  let activeCategory = urlState.category;
  let currentSort = urlState.sort;
  let currentPage = urlState.page;
  let currentPerPage = urlState.perPage;
  let mobileFilterSlider = null;

  // Server-side pagination state (local to IIFE)
  let isLoading = false;

  // Mobile: accumulated data for Load More
  let mobileAccumulatedData = [];

  // --- DOM Elements ---
  const filtersContainer = document.getElementById('tips-filters');
  const gridDesktop = document.getElementById('tips-grid-desktop');
  const sliderMobile = document.getElementById('tips-slider-mobile');
  const pagination = document.getElementById('tips-pagination');

  const imageSprings = new Map();
  let lastTime = performance.now();
  let animationFrameId = null;
  let scrollListenersAdded = false;

  // On tips/instructions use scale(1) so images fill the container (no scroll-scale animation)
  const TIPS_PAGE_SCALE = 1;

  window.initPage = initPage;

  async function initPage() {
    renderFilters();
    // Load from URL state - for mobile, load all pages up to current
    if (isMobile() && currentPage > 1) {
      // Load pages 1 to currentPage for mobile accumulated view
      for (let p = 1; p <= currentPage; p++) {
        await loadPageData(p, p === 1);
      }
    } else {
      await loadPageData(currentPage, true);
    }
    initScrollAnimations();
  }

  /**
   * Check if current viewport is mobile
   */
  function isMobile() {
    return window.innerWidth < 768;
  }

  /**
   * Fetch data from server with pagination
   * @param {number} page - Page number to fetch
   * @param {boolean} resetAccumulated - If true, reset mobile accumulated data
   */
  async function loadPageData(page, resetAccumulated = false) {
    if (isLoading || typeof LaundroAPI === 'undefined') return;

    isLoading = true;

    // Show loading only on initial load or desktop page switch
    if (resetAccumulated || !isMobile()) {
      showContentLoading();
    }

    try {
      let result;
      console.log('[Tips Page] Loading with perPage:', currentPerPage);
      if (isInstructionsPage) {
        result = await LaundroAPI.getInstructionsWithPagination(page, currentPerPage);
      } else {
        result = await LaundroAPI.getTipsWithPagination(page, currentPerPage);
      }

      const newItems = result.items || [];
      totalItems = result.totalItems;
      // Calculate totalPages on client based on current perPage
      totalPages = Math.ceil(totalItems / currentPerPage);
      currentPage = page;

      console.log('[Tips Page] Loaded:', { totalItems, totalPages, currentPerPage, itemsLoaded: newItems.length });

      // Desktop: replace data
      DATA = newItems;

      // Mobile: accumulate data for Load More
      if (resetAccumulated) {
        mobileAccumulatedData = [...newItems];
      } else {
        mobileAccumulatedData = [...mobileAccumulatedData, ...newItems];
      }

      if (newItems.length === 0 && resetAccumulated) {
        showEmptyState();
      } else {
        renderContent();
      }

      // Update URL with current state including perPage
      updateURL(currentPage, activeCategory, currentSort, currentPerPage);

      // Set isLoading to false BEFORE rendering pagination
      // so the button shows correct text
      isLoading = false;
      renderPagination();
    } catch (error) {
      console.error('[Tips Page] Error loading data:', error);
      showErrorState('Failed to load data. Please try again.');
      isLoading = false;
    }
  }

  /**
   * Handle Load More button click (mobile)
   */
  async function handleLoadMore() {
    if (currentPage < totalPages) {
      await loadPageData(currentPage + 1, false); // false = don't reset, accumulate
    }
  }

  function showContentLoading() {
    const loadingHtml = `
      <div class="col-span-2 flex flex-col items-center justify-center py-20">
        <div class="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-brand/20 border-t-brand"></div>
        <p class="text-text/60 text-lg">Loading...</p>
      </div>
    `;
    if (gridDesktop) gridDesktop.innerHTML = loadingHtml;
    if (sliderMobile) sliderMobile.innerHTML = loadingHtml;
  }

  function initScrollAnimations() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }

    const images = document.querySelectorAll('.scroll-scale-image');
    images.forEach((img) => {
      if (!imageSprings.has(img)) {
        const spring = new Spring(SPRING_CONFIGS.TIPS);
        spring.current = TIPS_PAGE_SCALE;
        spring.target = TIPS_PAGE_SCALE;
        spring.velocity = 0;
        imageSprings.set(img, spring);
        img.style.transform = `scale(${TIPS_PAGE_SCALE})`;
        img.style.transformOrigin = 'top left';
        img.style.willChange = 'transform';
      }
    });

    if (!scrollListenersAdded) {
      scrollListenersAdded = true;
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
    }

    onScroll();
  }

  function updateAnimations() {
    const currentTime = performance.now();
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    const images = document.querySelectorAll('.scroll-scale-image');
    imageSprings.forEach((spring, img) => {
      if (!document.contains(img)) imageSprings.delete(img);
    });

    images.forEach((img) => {
      if (!imageSprings.has(img)) {
        const spring = new Spring(SPRING_CONFIGS.TIPS);
        spring.current = TIPS_PAGE_SCALE;
        spring.target = TIPS_PAGE_SCALE;
        spring.velocity = 0;
        imageSprings.set(img, spring);
        img.style.transformOrigin = 'top left';
        img.style.willChange = 'transform';
      }
      const spring = imageSprings.get(img);
      if (spring) {
        spring.setTarget(TIPS_PAGE_SCALE);
        const smoothScale = spring.update(deltaTime);
        img.style.transform = `scale(${smoothScale})`;
      }
    });

    const needsUpdate = Array.from(imageSprings.values()).some(
      (spring) => Math.abs(spring.getValue() - spring.target) > 0.001 || Math.abs(spring.velocity) > 0.001,
    );

    if (needsUpdate) {
      animationFrameId = requestAnimationFrame(updateAnimations);
    } else {
      animationFrameId = null;
      images.forEach((img) => {
        img.style.willChange = 'auto';
      });
    }
  }

  function onScroll() {
    if (!animationFrameId) {
      lastTime = performance.now();
      animationFrameId = requestAnimationFrame(updateAnimations);
    }
  }

  // --- Rendering Filters ---
  function renderFilters() {
    if (!filtersContainer) return;

    const categoriesHtml = CATEGORIES.map((cat) => {
      const isActive = cat.key === activeCategory;
      const activeClass = 'border-transparent bg-brand/6 text-brand';
      const inactiveClass = 'border-text/20 text-text';

      return `
                <button 
                    class="category-btn keen-slider__slide inline-flex cursor-pointer items-center justify-center rounded-[12px] border px-[18px] py-[14px] text-sm leading-[132%] font-normal tracking-[-0.01em] whitespace-nowrap transition-colors duration-200 md:rounded-[16px] 2xl:text-lg min-w-fit ${isActive ? activeClass : inactiveClass}"
                    data-key="${cat.key}"
                >
                    ${cat.label}
                </button>
            `;
    }).join('');

    // Sort HTML
    const sortLabel =
      SORT_OPTIONS.find((o) => o.value === currentSort)?.label ||
      (typeof SORT_BY_LABEL !== 'undefined' ? SORT_BY_LABEL : 'Sort by');
    const sortLabelClass = currentSort ? 'text-text' : 'text-text/50';

    const sortHtml = `
            <div class="relative w-full md:w-auto" id="sort-dropdown">
                <button id="sort-trigger" class="cursor-pointer border-text/20 text-text flex min-h-[45px] w-full items-center justify-between gap-2 rounded-[12px] border px-[18px] py-[14px] text-sm leading-[132%] font-normal tracking-[-0.01em] shadow-none md:min-w-[120px]">
                    <span id="sort-current-label" class="${sortLabelClass} whitespace-nowrap">${sortLabel}</span>
                    <svg class="text-text h-[15px] w-[15px] shrink-0" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.63346 1.77859V12.4505M2.07617 5.30624L5.63346 1.74895M8.59787 1.80824V12.4801L12.1552 8.92282" stroke="currentColor" stroke-width="1.06719" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <div id="sort-options" class="absolute top-full left-0 z-[100] mt-1 hidden w-full overflow-hidden rounded-md border border-neutral-200 bg-white shadow-md">
                    ${SORT_OPTIONS.map((opt) => {
                      const isSelected = currentSort === opt.value;
                      return `
                        <button class="sort-option hover:bg-brand/5 w-full pl-2 pr-8 py-1.5 text-left text-sm leading-[132%] tracking-[-0.01em] transition-colors text-text relative flex items-center gap-2" data-value="${opt.value}">
                            ${
                              isSelected
                                ? `<span class="absolute right-2 flex size-3.5 items-center justify-center">
                                    <svg class="size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                                   </span>`
                                : ''
                            }
                            ${opt.label}
                        </button>
                    `;
                    }).join('')}
                </div>
            </div>
            `;

    filtersContainer.innerHTML = `
            <div class="-mx-container-mobile md:hidden">
                <div class="keen-slider pl-container-mobile" id="filter-slider-mobile">
                    ${categoriesHtml}
                </div>
            </div>
            <div class="hidden gap-2 md:flex">
                ${categoriesHtml}
            </div>
            <div class="flex justify-start">
                ${sortHtml}
            </div>
        `;

    // Re-attach listeners and init slider
    initFilterInteractions();
  }

  function initFilterInteractions() {
    // Category Clicks
    document.querySelectorAll('.category-btn').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const key = e.currentTarget.dataset.key;
        if (key !== activeCategory) {
          activeCategory = key;
          currentPage = 1;
          renderFilters();
          await loadPageData(1, true); // Reset and load first page
        }
      });
    });

    // Filter Slider (Mobile)
    const filterSliderEl = document.getElementById('filter-slider-mobile');
    if (filterSliderEl) {
      if (mobileFilterSlider) mobileFilterSlider.destroy();
      mobileFilterSlider = new KeenSlider(filterSliderEl, {
        mode: 'free-snap',
        slides: {
          perView: 'auto',
          spacing: 8,
        },
      });
    }

    // Sort Dropdown
    const sortTrigger = document.getElementById('sort-trigger');
    const sortOptionsDiv = document.getElementById('sort-options');
    const sortOptionsBtns = document.querySelectorAll('.sort-option');

    if (sortTrigger && sortOptionsDiv) {
      sortTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        sortOptionsDiv.classList.toggle('hidden');
      });

      document.addEventListener('click', (e) => {
        if (!sortTrigger.contains(e.target) && !sortOptionsDiv.contains(e.target)) {
          sortOptionsDiv.classList.add('hidden');
        }
      });

      sortOptionsBtns.forEach((btn) => {
        btn.addEventListener('click', async (e) => {
          const val = e.currentTarget.dataset.value;
          currentSort = val;
          currentPage = 1;
          sortOptionsDiv.classList.add('hidden');
          renderFilters();
          // Sort is done client-side on current data
          renderContent();
        });
      });
    }
  }

  // --- Rendering Content (Tips/Instructions) ---
  function renderContent() {
    // Desktop: use current page data (DATA)
    // Mobile: use accumulated data (mobileAccumulatedData)

    let desktopDisplayData = [...DATA];
    let mobileDisplayData = [...mobileAccumulatedData];

    // Apply local sorting
    const sortFn = (a, b) => {
      if (currentSort === 'latest' || currentSort === '') return new Date(b.date) - new Date(a.date);
      if (currentSort === 'oldest') return new Date(a.date) - new Date(b.date);
      if (currentSort === 'title-asc') return a.title.localeCompare(b.title);
      if (currentSort === 'title-desc') return b.title.localeCompare(a.title);
      return 0;
    };

    desktopDisplayData.sort(sortFn);
    mobileDisplayData.sort(sortFn);

    // Desktop Grid
    if (gridDesktop) {
      const cardsHtml = desktopDisplayData.map((item, index) => createDesktopCardHtml(item, index)).join('');
      gridDesktop.innerHTML = cardsHtml;
    }

    // Mobile Grid with Load More
    if (sliderMobile) {
      const mobileCardsHtml = mobileDisplayData.map((item) => createMobileCardHtml(item)).join('');
      sliderMobile.innerHTML = mobileCardsHtml;
    }

    // Refresh animations for new content
    initScrollAnimations();
  }

  // --- Rendering Pagination ---
  function renderPagination() {
    if (!pagination) return;

    // Use existing HTML elements
    // Desktop: div with classes 'hidden items-center gap-1 md:flex'
    // Mobile: button with id 'load-more-btn'
    const desktopPaginationContainer = pagination.querySelector('.hidden.items-center.gap-1.md\\:flex');
    const loadMoreBtn = document.getElementById('load-more-btn');

    // === DESKTOP: Numbered pagination (uses totalPages calculated from currentPerPage) ===
    // Always visible on desktop (hidden on mobile via CSS classes)
    if (desktopPaginationContainer) {
      if (totalPages <= 1) {
        // Show at least page 1 even when there's only one page
        const baseClasses =
          'flex cursor-pointer items-center justify-center border md:rounded-[8px] 2xl:rounded-[6px] md:text-sm leading-[132%] font-normal tracking-[-0.01em] transition-colors';
        const activeClasses = 'border-[#414242]/25 text-[#414242] md:size-[52px] 2xl:h-[54px] 2xl:w-[56px]';
        desktopPaginationContainer.innerHTML = `<button class="${baseClasses} ${activeClasses}" data-page="1">1</button>`;
      } else {
        const siblingCount = 1;
        const pageItems = [];
        const leftSibling = Math.max(currentPage - siblingCount, 1);
        const rightSibling = Math.min(currentPage + siblingCount, totalPages);

        pageItems.push(1);

        if (leftSibling > 2) {
          pageItems.push('ellipsis-left');
        }

        for (let i = leftSibling; i <= rightSibling; i++) {
          if (i !== 1 && i !== totalPages) {
            pageItems.push(i);
          }
        }

        if (rightSibling < totalPages - 1) {
          pageItems.push('ellipsis-right');
        }

        if (totalPages > 1) {
          pageItems.push(totalPages);
        }

        const baseClasses =
          'flex cursor-pointer items-center justify-center border md:rounded-[8px] 2xl:rounded-[6px] md:text-sm leading-[132%] font-normal tracking-[-0.01em] transition-colors';
        const activeClasses = 'border-[#414242]/25 text-[#414242] md:size-[52px] 2xl:h-[54px] 2xl:w-[56px]';
        const inactiveClasses =
          'border-transparent text-[#414242]/40 hover:text-[#414242]/60 2xl:w-[47px] 2xl:h-[56px] md:h-[42px] md:w-[35px]';

        const paginationHtml = pageItems
          .map((item) => {
            if (typeof item === 'string' && item.startsWith('ellipsis')) {
              return `<span class="${baseClasses} ${inactiveClasses}">…</span>`;
            }
            const isActive = item === currentPage;
            return `<button class="${baseClasses} ${isActive ? activeClasses : inactiveClasses}" data-page="${item}">${item}</button>`;
          })
          .join('');

        desktopPaginationContainer.innerHTML = paginationHtml;

        // Attach click handlers for desktop pagination
        desktopPaginationContainer.querySelectorAll('button[data-page]').forEach((btn) => {
          btn.addEventListener('click', async (e) => {
            const page = parseInt(e.currentTarget.dataset.page);
            if (page !== currentPage && !isLoading) {
              // Only change page, not perPage
              await loadPageData(page, true);
              const tipsSection = document.getElementById('tips-filters');
              if (tipsSection) {
                tipsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }
          });
        });
      }
    }

    // === MOBILE: Load More button ===
    if (loadMoreBtn) {
      // All loaded when totalPages is 1 (all items fit in current perPage)
      const allLoaded = totalPages <= 1;

      if (allLoaded) {
        // Hide button when all loaded
        loadMoreBtn.style.display = 'none';
      } else {
        loadMoreBtn.style.display = 'flex';
        loadMoreBtn.textContent = 'Load more';
        loadMoreBtn.disabled = false;

        // Remove old listener and add new one
        const newBtn = loadMoreBtn.cloneNode(true);
        loadMoreBtn.parentNode.replaceChild(newBtn, loadMoreBtn);

        newBtn.addEventListener('click', async () => {
          if (!isLoading) {
            newBtn.textContent = 'Loading...';
            newBtn.disabled = true;

            // Increase perPage and reload all data
            currentPerPage += DEFAULT_ITEMS_PER_PAGE;

            // Load from page 1 with increased perPage
            await loadPageData(1, true);
          }
        });
      }
    }
  }

  function createDesktopCardHtml(item, index) {
    const isBigImage = false;
    const bigImageClass = '';
    const heightClass = 'lg:h-[278px] 2xl:h-[390px]';
    const paddingClass = '';

    const itemType = isInstructionsPage ? 'instruction' : 'tip';
    const link = `tips-details.html?id=${item.id}&type=${itemType}`;

    return `
        <article class="tips-card rounded-[12px] bg-white/80 backdrop-blur-[30px] backdrop-filter ${heightClass} 2xl:rounded-[16px] ${bigImageClass} ${paddingClass}">
            ${
              isBigImage
                ? `
                <div class="relative h-[277px] w-full origin-top-left overflow-hidden lg:mb-10 2xl:mb-12 2xl:h-[390px] shrink-0">
                  <img alt="${item.title}" class="scroll-scale-image rounded-t-[12px] object-cover object-top 2xl:rounded-t-[16px] w-full h-full origin-top-left" src="${item.image}" />
                </div>
            `
                : ''
            }

            <div class="flex items-start justify-between px-6 2xl:px-8 ${isBigImage ? 'mb-20 2xl:mb-[120px]' : 'pt-6 lg:mb-[7px] 2xl:mb-[23px] 2xl:pt-8'}">
                <div class="border-brand/40 text-brand rounded-[9px] border px-[13px] py-[9px] text-xs leading-[132%] font-normal tracking-[-0.01em] 2xl:rounded-[10px] 2xl:px-[18px] 2xl:py-[10px] 2xl:text-sm">
                  ${item.category}
                </div>
                ${
                  !isBigImage
                    ? `
                    <div class="relative h-[87px] w-[149px] shrink-0 overflow-hidden md:h-[99px] md:w-[149px] lg:h-[127px] lg:w-[186px] 2xl:h-[177px] 2xl:w-[258px]">
                        <img alt="${item.title}" class="scroll-scale-image rounded-[6px] object-cover w-full h-full origin-top-left" src="${item.image}" />
                    </div>
                `
                    : ''
                }
            </div>

            <a class="text-text hover:text-brand block cursor-pointer pl-6 text-lg leading-[132%] font-normal tracking-[-0.01em] transition-colors md:max-w-[390px] lg:mb-4 2xl:mb-[3px] 2xl:max-w-[515px] 2xl:text-2xl 2xl:leading-[136%] 2xl:tracking-[-0.02em] ${isBigImage ? '2xl:max-w-[560px]' : ''}" href="${link}">
                <span class="line-clamp-2 ${isBigImage ? 'line-clamp-3' : ''}">${item.title}</span>
            </a>

            <a class="flex items-center justify-between px-6 pb-6 2xl:px-8 mt-auto" href="${link}">
                <p class="text-text/60 paragraph-sm-default 2xl:text-lg">${item.date}</p>
                <span class="bg-brand/6 flex size-[41px] items-center justify-center rounded-[9px] 2xl:size-[57px]">
                  <svg class="text-brand h-[7px] w-[8px] 2xl:size-[10px]" viewBox="0 0 9 9" fill="none">
                    <path d="M0.75009 0.750399L7.62744 7.87305M7.62744 7.87305L7.84096 1.08657M7.62744 7.87305L0.840964 8.08657" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </span>
            </a>
        </article>
    `;
  }

  function createMobileCardHtml(item) {
    const itemType = isInstructionsPage ? 'instruction' : 'tip';
    const link = `tips-details.html?id=${item.id}&type=${itemType}`;

    return `
        <article class="w-full min-h-[418px] shrink-0 md:min-h-[386px]">
          <div class="flex h-full w-full flex-1 flex-col rounded-[16px] bg-white p-[20px]">
            <div class="flex justify-end">
              <div class="relative mb-[47px] h-[87px] w-[127px] md:mb-[35px] md:h-[99px] md:w-[149px]">
                 <img
                    alt="${item.title}"
                    class="rounded-[6px] object-cover w-full h-full"
                    src="${item.image}"
                 />
              </div>
            </div>

            <div class="border-brand/40 text-brand mb-9 flex h-[33px] w-[123px] items-center justify-center rounded-[9px] border px-3 py-1 text-xs leading-[132%] font-normal tracking-[-0.01em] md:mb-[27px]">
              ${item.category}
            </div>

            <p class="text-text mb-[50px] line-clamp-3 max-w-[284px] text-lg leading-[132%] font-normal tracking-[-0.01em] md:mb-[27px]">
              ${item.title}
            </p>

            <a class="mt-auto flex items-center justify-between" href="${link}">
              <p class="text-text/60 paragraph-sm-default">${item.date}</p>

              <span class="bg-brand/6 flex size-[41px] items-center justify-center rounded-[9px]">
                <svg class="text-brand h-[7px] w-[8px]" viewBox="0 0 9 9" fill="none">
                  <path d="M0.75009 0.750399L7.62744 7.87305M7.62744 7.87305L7.84096 1.08657M7.62744 7.87305L0.840964 8.08657" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </span>
            </a>
          </div>
        </article>
    `;
  }
})();
