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

  // --- DOM Elements ---
  const filtersContainer = document.getElementById('tips-filters');
  const pagination = document.getElementById('tips-pagination');
  const isTipsPage = !!filtersContainer && !!pagination;

  const gridDesktop = document.getElementById(isTipsPage ? 'tips-grid-desktop' : 'tips-grid');
  const sliderMobile = document.getElementById('tips-slider-mobile');

  // --- Initialization ---
  if (isTipsPage) {
    initPage();
  } else {
    initSection();
  }

  function initPage() {
    renderFilters();
    renderContent();
    renderPagination();
  }

  function initSection() {
    setTimeout(() => {
      initTipsSlider();
    }, 100);
  }

  function initTipsSlider() {
    const sliderEl = document.getElementById('tips-slider-mobile');
    if (!sliderEl || typeof KeenSlider === 'undefined') return;

    if (mobileTipsSlider) {
      mobileTipsSlider.destroy();
    }

    mobileTipsSlider = new KeenSlider('#tips-slider-mobile', {
      loop: false,
      mode: 'free',
      rtl: false,
      rubberband: true,
      slides: {
        perView: 'auto',
        spacing: 8,
        origin: 0,
      },
      created: (slider) => {
        updateTipsButtons(slider);
      },
      slideChanged: (slider) => {
        updateTipsButtons(slider);
      },
    });

    const prevBtn = document.getElementById('tips-prev-btn-mobile');
    const nextBtn = document.getElementById('tips-next-btn-mobile');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => mobileTipsSlider.prev());
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => mobileTipsSlider.next());
    }
  }

  function updateTipsButtons(slider) {
    if (!slider) return;
    const prevBtn = document.getElementById('tips-prev-btn-mobile');
    const nextBtn = document.getElementById('tips-next-btn-mobile');
    if (!prevBtn || !nextBtn) return;

    const track = slider.track.details;
    if (!track) return;

    prevBtn.disabled = track.rel === 0;
    prevBtn.setAttribute('aria-disabled', track.rel === 0);
    if (track.rel === 0) {
      prevBtn.classList.add('opacity-40');
    } else {
      prevBtn.classList.remove('opacity-40');
    }

    nextBtn.disabled = track.rel === track.slides.length - 1;
    nextBtn.setAttribute('aria-disabled', track.rel === track.slides.length - 1);
    if (track.rel === track.slides.length - 1) {
      nextBtn.classList.add('opacity-40');
    } else {
      nextBtn.classList.remove('opacity-40');
    }
  }

  window.addEventListener('homepageTipsLoaded', () => {
    initTipsSlider();
  });

  // --- Rendering Filters ---
  function renderFilters() {
    if (!filtersContainer) return;

    const categoriesHtml = CATEGORIES.map((cat) => {
      const isActive = cat.key === activeCategory;
      const activeClass = 'border-transparent bg-brand/6 text-brand';
      const inactiveClass = 'border-text/20 text-text';

      return `
                <button 
                    class="category-btn keen-slider__slide inline-flex cursor-pointer items-center justify-center rounded-card border px-[18px] py-[14px] text-sm leading-[132%] font-normal tracking-[-0.01em] whitespace-nowrap transition-colors duration-200 md:rounded-card 2xl:text-lg min-w-fit ${isActive ? activeClass : inactiveClass}"
                    data-key="${cat.key}"
                >
                    ${cat.label}
                </button>
            `;
    }).join('');

    const sortLabel = SORT_OPTIONS.find((o) => o.value === currentSort)?.label || 'Sort by';
    const sortLabelClass = currentSort ? 'text-text' : 'text-text/50';

    const sortHtml = `
            <div class="relative w-full md:w-[120px]" id="sort-dropdown">
                <button id="sort-trigger" class="cursor-pointer border-text/20 text-text flex min-h-[45px] w-full items-center justify-between rounded-card border px-[18px] py-[14px] text-sm leading-[132%] font-normal tracking-[-0.01em] shadow-none md:w-[120px]">
                    <span id="sort-current-label" class="${sortLabelClass}">${sortLabel}</span>
                    <svg class="text-text h-[15px] w-[15px] shrink-0 ml-auto" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.63346 1.77859V12.4505M2.07617 5.30624L5.63346 1.74895M8.59787 1.80824V12.4801L12.1552 8.92282" stroke="currentColor" stroke-width="1.06719" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <div id="sort-options" class="absolute top-full left-0 z-100 mt-1 hidden w-full overflow-hidden rounded-md border border-neutral-200 bg-white shadow-md">
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

    initFilterInteractions();
  }

  function initFilterInteractions() {
    document.querySelectorAll('.category-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const key = e.currentTarget.dataset.key;
        if (key !== activeCategory) {
          activeCategory = key;
          renderFilters();
          renderContent();
        }
      });
    });

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
          renderFilters();
          renderContent();
        });
      });
    }
  }

  function renderContent() {
    let filtered = DATA;
    if (activeCategory !== 'all') {
      const catLabel = CATEGORIES.find((c) => c.key === activeCategory)?.label;
      filtered = DATA.filter((t) => t.category === catLabel);
    }

    filtered.sort((a, b) => {
      if (currentSort === 'latest' || currentSort === '') return new Date(b.date) - new Date(a.date);
      if (currentSort === 'oldest') return new Date(a.date) - new Date(b.date);
      if (currentSort === 'title-asc') return a.title.localeCompare(b.title);
      if (currentSort === 'title-desc') return b.title.localeCompare(a.title);
      return 0;
    });

    const cardsHtml = filtered.map((item) => createDesktopCardHtml(item)).join('');

    if (gridDesktop) {
      gridDesktop.innerHTML = cardsHtml;
    }

    if (sliderMobile) {
      const mobileCardsHtml = filtered.map((item) => createMobileCardHtml(item)).join('');
      sliderMobile.innerHTML = mobileCardsHtml;
    }
  }

  function renderPagination() {
    if (!pagination) return;

    const totalPages = 10;
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
      'flex cursor-pointer items-center justify-center border md:rounded-card 2xl:rounded-[6px] md:text-sm leading-[132%] font-normal tracking-[-0.01em] transition-colors';
    const activeClasses = 'border-[#414242]/25 text-[#414242] md:size-[52px] 2xl:h-[54px] 2xl:w-[56px]';
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

    const paginationContainer = pagination.querySelector('.hidden.items-center.gap-1.md\\:flex');
    if (paginationContainer) {
      paginationContainer.innerHTML = paginationHtml;
      paginationContainer.querySelectorAll('button[data-page]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const page = parseInt(e.currentTarget.dataset.page);
          if (page !== currentPage) {
            currentPage = page;
            renderPagination();
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
        <article class="tips-card flex flex-col rounded-card bg-white/80 backdrop-blur-[30px] backdrop-filter ${heightClass} 2xl:rounded-card ${bigImageClass} ${paddingClass} transition-all duration-300">
            ${
              item.bigImage
                ? `
                <div class="relative h-[277px] w-full lg:mb-10 2xl:mb-12 2xl:h-[390px] shrink-0">
                  <img alt="${item.title}" class="rounded-t-card object-cover object-top 2xl:rounded-t-card w-full h-full" src="${item.image}" />
                </div>
            `
                : ''
            }

            <div class="flex items-start justify-between px-6 2xl:px-8 ${item.bigImage ? 'mb-20 2xl:mb-[120px]' : 'pt-6 lg:mb-[7px] 2xl:mb-[23px] 2xl:pt-8'}">
                <div class="border-brand/40 text-brand rounded-badge border px-[13px] py-[9px] text-xs leading-[132%] font-normal tracking-[-0.01em] 2xl:rounded-badge 2xl:px-[18px] 2xl:py-[10px] 2xl:text-sm">
                  ${item.category}
                </div>
                ${
                  !item.bigImage
                    ? `
                    <div class="relative h-[87px] w-[149px] shrink-0 md:h-[99px] md:w-[149px] lg:h-[127px] lg:w-[186px] 2xl:h-[177px] 2xl:w-[258px]">
                        <img alt="${item.title}" class="rounded-badge object-cover w-full h-full" src="${item.image}" />
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
                <span class="bg-brand/6 flex size-[41px] items-center justify-center rounded-badge 2xl:size-[57px]">
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
        <article class="tips-card w-full min-h-[418px] shrink-0 md:min-h-[386px] transition-all duration-300">
          <div class="flex h-full w-full flex-1 flex-col rounded-card bg-white p-[20px] transition-all duration-300">
            <div class="flex justify-end">
              <div class="relative mb-[47px] h-[87px] w-[127px] md:mb-[35px] md:h-[99px] md:w-[149px]">
                 <img
                    alt="${item.title}"
                    class="rounded-badge object-cover w-full h-full"
                    src="${item.image}"
                 />
              </div>
            </div>

            <div class="border-brand/40 text-brand mb-9 flex h-[33px] w-[123px] items-center justify-center rounded-badge border px-3 py-1 text-xs leading-[132%] font-normal tracking-[-0.01em] md:mb-[27px]">
              ${item.category}
            </div>

            <p class="text-text mb-[50px] line-clamp-3 max-w-[284px] text-lg leading-[132%] font-normal tracking-[-0.01em] md:mb-[27px]">
              ${item.title}
            </p>

            <a class="mt-auto flex items-center justify-between" href="${link}">
              <p class="text-text/60 paragraph-sm-default">${item.date}</p>

              <span class="bg-brand/6 flex size-[41px] items-center justify-center rounded-badge">
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
