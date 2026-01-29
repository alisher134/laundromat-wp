document.addEventListener('DOMContentLoaded', () => {
  const isInstructionsPage =
    window.location.pathname.includes('instructions.html') ||
    window.location.href.includes('instructions.html') ||
    document.querySelector('h1#tips-title')?.textContent.trim() === 'Instructions';

  const DATA = isInstructionsPage ? INSTRUCTIONS_DATA : TIPS_DATA;

  let activeCategory = 'all';
  let currentSort = '';
  let currentPage = 1;
  let mobileFilterSlider = null;
  let mobileTipsSlider = null;

  const filtersContainer = document.getElementById('tips-filters');
  const gridDesktop = document.getElementById('tips-grid-desktop');
  const sliderMobile = document.getElementById('tips-slider-mobile');
  const pagination = document.getElementById('tips-pagination');

  const imageSprings = new Map();
  let lastTime = performance.now();
  let animationFrameId = null;
  let scrollListenersAdded = false;

  initPage();

  function initPage() {
    renderFilters();
    renderContent();
    renderPagination();
    initScrollAnimations();
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
        const initialScale = getImageScrollProgress(img);
        spring.current = initialScale;
        spring.target = initialScale;
        spring.velocity = 0;
        imageSprings.set(img, spring);
        img.style.transform = `scale(${initialScale})`;
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
        const initialScale = getImageScrollProgress(img);
        spring.current = initialScale;
        spring.target = initialScale;
        spring.velocity = 0;
        imageSprings.set(img, spring);
        img.style.transformOrigin = 'top left';
        img.style.willChange = 'transform';
      }
      const targetScale = getImageScrollProgress(img);
      const spring = imageSprings.get(img);
      if (spring) {
        spring.setTarget(targetScale);
        const smoothScale = spring.update(deltaTime);
        img.style.transform = `scale(${smoothScale})`;
      }
    });

    const needsUpdate = Array.from(imageSprings.values()).some(
      (spring) =>
        Math.abs(spring.getValue() - spring.target) > 0.001 || Math.abs(spring.velocity) > 0.001
    );

    if (needsUpdate) {
      animationFrameId = requestAnimationFrame(updateAnimations);
    } else {
      animationFrameId = null;
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

    // Note: The structure requires a mobile slider container AND a desktop container
    // OR we use the same elements and CSS handles layout.
    // The reference has a mobile slider div AND a hidden desktop flex div.

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
    const sortLabel = SORT_OPTIONS.find((o) => o.value === currentSort)?.label || 'Sort by';
    const sortLabelClass = currentSort ? 'text-text' : 'text-text/50';

    const sortHtml = `
            <div class="relative w-full md:w-[120px]" id="sort-dropdown">
                <button id="sort-trigger" class="cursor-pointer border-text/20 text-text flex min-h-[45px] w-full items-center justify-between rounded-[12px] border px-[18px] py-[14px] text-sm leading-[132%] font-normal tracking-[-0.01em] shadow-none md:w-[120px]">
                    <span id="sort-current-label" class="${sortLabelClass}">${sortLabel}</span>
                    <svg class="text-text h-[15px] w-[15px] shrink-0 ml-auto" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
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
      btn.addEventListener('click', (e) => {
        const key = e.currentTarget.dataset.key;
        if (key !== activeCategory) {
          activeCategory = key;
          renderFilters(); // Re-render to update active state styles
          renderContent(); // Filter content
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
        btn.addEventListener('click', (e) => {
          const val = e.currentTarget.dataset.value;
          currentSort = val;
          sortOptionsDiv.classList.add('hidden');
          renderFilters(); // Update label
          renderContent(); // Sort content
        });
      });
    }
  }

  // --- Rendering Content (Tips/Instructions) ---
  function renderContent() {
    // 1. Filter
    let filtered = DATA;
    if (activeCategory !== 'all') {
      const catLabel = CATEGORIES.find((c) => c.key === activeCategory)?.label;
      filtered = DATA.filter((t) => t.category === catLabel);
    }

    // 2. Sort
    filtered.sort((a, b) => {
      if (currentSort === 'latest' || currentSort === '') return new Date(b.date) - new Date(a.date);
      if (currentSort === 'oldest') return new Date(a.date) - new Date(b.date);
      if (currentSort === 'title-asc') return a.title.localeCompare(b.title);
      if (currentSort === 'title-desc') return b.title.localeCompare(a.title);
      return 0;
    });

    const cardsHtml = filtered.map((item) => createDesktopCardHtml(item)).join('');

    // Desktop Grid
    if (gridDesktop) {
      gridDesktop.innerHTML = cardsHtml;
    }

    // Mobile Slider (actually just a grid, no slider!)
    if (sliderMobile) {
      // Use specialized Mobile Card function - render directly without Keen Slider
      const mobileCardsHtml = filtered.map((item) => createMobileCardHtml(item)).join('');

      // Just inject cards directly - no keen-slider wrapper!
      sliderMobile.innerHTML = mobileCardsHtml;

      // Don't initialize Keen Slider for mobile - it's just a grid!
    }

    // Refresh animations for new content
    initScrollAnimations();
  }

  // --- Rendering Pagination ---
  function renderPagination() {
    if (!pagination) return;

    const totalPages = 10; // Static for now, matches reference
    const siblingCount = 1;

    // Generate page items (similar to getPageItems in reference)
    const pageItems = [];
    const leftSibling = Math.max(currentPage - siblingCount, 1);
    const rightSibling = Math.min(currentPage + siblingCount, totalPages);

    // Always show first page
    pageItems.push(1);

    // Add ellipsis if needed
    if (leftSibling > 2) {
      pageItems.push('ellipsis-left');
    }

    // Add sibling pages
    for (let i = leftSibling; i <= rightSibling; i++) {
      if (i !== 1 && i !== totalPages) {
        pageItems.push(i);
      }
    }

    // Add ellipsis if needed
    if (rightSibling < totalPages - 1) {
      pageItems.push('ellipsis-right');
    }

    // Always show last page
    if (totalPages > 1) {
      pageItems.push(totalPages);
    }

    // Generate HTML
    // Base: Common classes
    const baseClasses =
      'flex cursor-pointer items-center justify-center border md:rounded-[8px] 2xl:rounded-[6px] md:text-sm leading-[132%] font-normal tracking-[-0.01em] transition-colors';

    // Active: Specific dimensions and colors
    const activeClasses = 'border-[#414242]/25 text-[#414242] md:size-[52px] 2xl:h-[54px] 2xl:w-[56px]';

    // Inactive: Specific dimensions and colors
    const inactiveClasses =
      'border-transparent text-[#414242]/40 hover:text-[#414242]/60 2xl:w-[47px] 2xl:h-[56px] md:h-[42px] md:w-[35px]';

    const paginationHtml = pageItems
      .map((item, index) => {
        if (typeof item === 'string' && item.startsWith('ellipsis')) {
          return `<span class="${baseClasses} ${inactiveClasses}" key="${item}">…</span>`;
        }

        const isActive = item === currentPage;
        return `<button class="${baseClasses} ${isActive ? activeClasses : inactiveClasses}" data-page="${item}">${item}</button>`;
      })
      .join('');

    // Find pagination container and update
    const paginationContainer = pagination.querySelector('.hidden.items-center.gap-1.md\\:flex');
    if (paginationContainer) {
      paginationContainer.innerHTML = paginationHtml;

      // Attach click handlers
      paginationContainer.querySelectorAll('button[data-page]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const page = parseInt(e.currentTarget.dataset.page);
          if (page !== currentPage) {
            currentPage = page;
            renderPagination();
            // In a real app, you'd also re-fetch/filter content here
            console.log(`Navigated to page ${page}`);
          }
        });
      });
    }
  }

  function createDesktopCardHtml(item) {
    const bigImageClass = item.bigImage ? 'lg:row-span-2' : '';
    const heightClass = item.bigImage ? 'lg:h-[576px] 2xl:h-[796px]' : 'lg:h-[278px] 2xl:h-[390px]';
    const paddingClass = item.bigImage ? 'p-0' : '';
    const link = 'tips-details.html';

    return `
        <article class="tips-card rounded-[12px] bg-white/80 backdrop-blur-[30px] backdrop-filter ${heightClass} 2xl:rounded-[16px] ${bigImageClass} ${paddingClass}">
            ${
              item.bigImage
                ? `
                <div class="relative h-[277px] w-full origin-top-left overflow-hidden lg:mb-10 2xl:mb-12 2xl:h-[390px] shrink-0">
                  <img alt="${item.title}" class="scroll-scale-image rounded-t-[12px] object-cover object-top 2xl:rounded-t-[16px] w-full h-full origin-top-left" src="${item.image}" />
                </div>
            `
                : ''
            }

            <div class="flex items-start justify-between px-6 2xl:px-8 ${item.bigImage ? 'mb-20 2xl:mb-[120px]' : 'pt-6 lg:mb-[7px] 2xl:mb-[23px] 2xl:pt-8'}">
                <div class="border-brand/40 text-brand rounded-[9px] border px-[13px] py-[9px] text-xs leading-[132%] font-normal tracking-[-0.01em] 2xl:rounded-[10px] 2xl:px-[18px] 2xl:py-[10px] 2xl:text-sm">
                  ${item.category}
                </div>
                ${
                  !item.bigImage
                    ? `
                    <div class="relative h-[87px] w-[149px] shrink-0 overflow-hidden md:h-[99px] md:w-[149px] lg:h-[127px] lg:w-[186px] 2xl:h-[177px] 2xl:w-[258px]">
                        <img alt="${item.title}" class="scroll-scale-image rounded-[6px] object-cover w-full h-full origin-top-left" src="${item.image}" />
                    </div>
                `
                    : ''
                }
            </div>

            <a class="text-text hover:text-brand block cursor-pointer pl-6 text-lg leading-[132%] font-normal tracking-[-0.01em] transition-colors md:max-w-[390px] lg:mb-4 2xl:mb-[3px] 2xl:max-w-[515px] 2xl:text-2xl 2xl:leading-[136%] 2xl:tracking-[-0.02em] ${item.bigImage ? '2xl:max-w-[560px]' : ''}" href="${link}">
                <span class="line-clamp-2 ${item.bigImage ? 'line-clamp-3' : ''}">${item.title}</span>
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
    const link = 'tips-details.html';

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
});
