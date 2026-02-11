(function () {
  const DEFAULT_ITEMS_PER_PAGE = 8;

  let categories = [];
  let activeCategory = 'all';
  let mobileSlider = null;

  let totalItems = 0;
  let totalPages = 0;
  let currentPage = 1;
  let currentPerPage = DEFAULT_ITEMS_PER_PAGE;
  let isLoading = false;
  let mobileAccumulatedData = [];

  let sectionSpring = null;
  let lastTime = performance.now();
  let animationFrameId = null;
  let isAnimating = false;
  let faqPageScrollListenersAdded = false;

  const accordionContainer = document.getElementById('faq-accordion');
  const pagination = document.getElementById('faq-pagination');

  // Init
  function init() {
    initSectionAnimation();
    loadData();
    setTimeout(triggerEntranceAnimations, 100);
  }

  // Load Categories first, then paginated FAQs
  async function loadData() {
    if (typeof LaundroAPI === 'undefined') {
      console.error('[FAQ] LaundroAPI not available');
      showEmptyState();
      return;
    }

    try {
      const [apiCategories] = await Promise.all([LaundroAPI.getFAQCategories()]);

      if (apiCategories && Array.isArray(apiCategories)) {
        categories = apiCategories;
      } else {
        categories = [{ key: 'all', label: 'All', id: 0 }];
      }

      const urlState = getStateFromURL();
      currentPage = urlState.page;
      currentPerPage = urlState.perPage;
      if (urlState.category && urlState.category !== 'all') {
        activeCategory = urlState.category;
      }

      renderCategories();

      // Load paginated FAQs
      if (isMobile() && currentPage > 1) {
        for (let p = 1; p <= currentPage; p++) {
          await loadPageData(p, p === 1);
        }
      } else {
        await loadPageData(currentPage, true);
      }
    } catch (error) {
      console.error('[FAQ] Failed to load data:', error);
      showEmptyState();
    }
  }

  function getStateFromURL() {
    const params = new URLSearchParams(window.location.search);
    return {
      page: parseInt(params.get('page')) || 1,
      category: params.get('category') || 'all',
      perPage: parseInt(params.get('perPage')) || DEFAULT_ITEMS_PER_PAGE,
    };
  }

  function updateURL(page, category, perPage) {
    const params = new URLSearchParams(window.location.search);

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

    if (perPage && perPage !== DEFAULT_ITEMS_PER_PAGE) {
      params.set('perPage', perPage);
    } else {
      params.delete('perPage');
    }

    const newURL = params.toString() ? `${window.location.pathname}?${params.toString()}` : window.location.pathname;
    window.history.replaceState({}, '', newURL);
  }

  async function loadPageData(page, resetAccumulated = false, showFullLoader = true) {
    if (isLoading || typeof LaundroAPI === 'undefined') return;

    isLoading = true;

    const loadMoreBtn = document.getElementById('faq-load-more-btn');
    if (loadMoreBtn && !resetAccumulated && isMobile()) {
      loadMoreBtn.disabled = true;
      loadMoreBtn.textContent = 'Loading...';
    }

    if (accordionContainer && showFullLoader && (resetAccumulated || !isMobile())) {
      accordionContainer.style.opacity = '0.5';
    }

    try {
      const params = activeCategory && activeCategory !== 'all' ? { faq_category: activeCategory } : {};
      const result = await LaundroAPI.getFAQsWithPagination(page, currentPerPage, params);

      const newItems = result.items || [];
      totalItems = result.totalItems;
      totalPages = result.totalPages;
      currentPage = page;

      if (resetAccumulated) {
        mobileAccumulatedData = [...newItems];
      } else {
        mobileAccumulatedData = [...mobileAccumulatedData, ...newItems];
      }

      if (newItems.length === 0 && resetAccumulated) {
        showEmptyState();
      } else {
        const shouldAppend = !resetAccumulated && isMobile();
        renderFAQs(shouldAppend, newItems);
      }

      updateURL(currentPage, activeCategory, currentPerPage);

      isLoading = false;
      renderPagination();
    } catch (error) {
      console.error('[FAQ] Error loading data:', error);
      showEmptyState();
      isLoading = false;
    } finally {
      if (accordionContainer) {
        accordionContainer.style.opacity = '1';
      }
    }
  }

  function isMobile() {
    return window.innerWidth < 768;
  }

  // Render Categories
  function renderCategories() {
    const desktopContainer = document.getElementById('desktop-categories');
    const mobileContainer = document.getElementById('mobile-categories-slider');

    if (!desktopContainer && !mobileContainer) return;

    const html = categories
      .map((cat) => {
        const isActive = cat.key === activeCategory;
        const activeClass = 'border-transparent bg-brand/6 text-brand';
        const inactiveClass = 'border-text/20 text-text';

        return `
        <button 
          class="category-btn action-tile keen-slider__slide inline-flex cursor-pointer items-center justify-center rounded-[12px] border px-[18px] py-[14px] text-sm leading-[132%] font-normal tracking-[-0.01em] whitespace-nowrap transition-colors duration-200 md:rounded-[16px] 2xl:text-lg min-w-fit ${isActive ? activeClass : inactiveClass}"
          data-key="${cat.key}"
        >
          ${cat.label}
        </button>
      `;
      })
      .join('');

    if (desktopContainer) {
      desktopContainer.innerHTML = html;
    }

    if (mobileContainer) {
      mobileContainer.innerHTML = html;
      initMobileSlider();
    }

    initCategoryInteractions();
  }

  function initMobileSlider() {
    const sliderEl = document.getElementById('mobile-categories-slider');
    if (!sliderEl) return;

    if (mobileSlider) mobileSlider.destroy();

    mobileSlider = new KeenSlider(sliderEl, {
      mode: 'free-snap',
      slides: {
        perView: 'auto',
        spacing: 8,
      },
    });
  }

  function initCategoryInteractions() {
    document.querySelectorAll('.category-btn').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const key = e.currentTarget.dataset.key;
        if (key === activeCategory) return;

        activeCategory = key;
        currentPage = 1;
        renderCategories();
        await loadPageData(1, true);
      });
    });
  }

  // Render FAQs into the accordion container
  function renderFAQs(isAppend = false, newItems = []) {
    if (!accordionContainer) return;

    let dataToRender;

    if (isMobile()) {
      dataToRender = [...mobileAccumulatedData];
    } else {
      dataToRender = newItems.length > 0 ? newItems : [];
    }

    if (isAppend && newItems.length > 0) {
      const newHtml = newItems.map((faq, idx) => createFAQItemHtml(faq, mobileAccumulatedData.length - newItems.length + idx)).join('');
      accordionContainer.insertAdjacentHTML('beforeend', newHtml);
    } else {
      if (dataToRender.length === 0) {
        showEmptyState();
        accordionContainer.innerHTML = '';
        return;
      }
      hideEmptyState();
      const html = dataToRender.map((faq, index) => createFAQItemHtml(faq, index)).join('');
      accordionContainer.innerHTML = html;
    }

    initAccordion();
  }

  function createFAQItemHtml(faq, index) {
    const number = String(index + 1).padStart(2, '0');
    return `
      <div
        class="faq-item group overflow-hidden rounded-[11px] border border-transparent bg-white backdrop-blur-[30px] md:rounded-[16px] xl:rounded-[11px] 2xl:rounded-[16px]"
        data-state="closed"
      >
        <div
          class="accordion-trigger flex cursor-pointer items-center justify-between pt-4 pr-3 pb-[17px] pl-4 text-left md:pt-[33px] md:pr-9 md:pb-9 md:pl-6 xl:pt-6 xl:pr-6 xl:pb-[25px] xl:pl-[22px] 2xl:pt-[33px] 2xl:pr-9 2xl:pb-9 2xl:pl-8"
        >
          <div class="flex w-full items-center justify-between">
            <div class="flex items-center md:gap-[54px] xl:gap-[104px] 2xl:gap-[143px] transition-transform duration-300 group-hover:scale-[1.02] origin-left">
              <span
                class="text-brand/70 hidden font-normal leading-[132%] tracking-[-0.01em] md:inline-block md:text-[21px] xl:text-base 2xl:text-[21px]"
              >
                ( ${number} )
              </span>
              <span
                class="text-text max-w-[230px] text-base leading-[132%] font-normal tracking-[-0.02em] md:max-w-[448px] md:text-[21px] xl:text-base 2xl:max-w-[545px] 2xl:text-[21px]"
              >
                ${faq.question}
              </span>
            </div>
            <span
              class="icon-box bg-brand/10 text-brand group-data-[state=open]:bg-brand/20 flex h-[40px] w-[40px] items-center justify-center rounded-[9px] transition-all duration-300 md:size-[55px] md:rounded-[12px] xl:size-[40px] 2xl:size-[55px] 2xl:rounded-[12px]"
            >
              <div
                class="flex items-center justify-center transition-transform duration-300 group-data-[state=open]:rotate-45"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-[10px] w-[10px] transition-transform duration-300 md:h-[12px] md:w-[12px] xl:h-[10px] xl:w-[10px] 2xl:h-[12px] 2xl:w-[12px]"
                >
                  <path
                    d="M6 1V11"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M1 6H11"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </span>
          </div>
        </div>
        <div
          class="accordion-content h-0 overflow-hidden bg-transparent opacity-0 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
        >
          <div class="flex items-start pl-4 pr-5 pt-0 pb-5 md:gap-[54px] md:pl-6 md:pr-6 md:pb-6 xl:gap-[104px] xl:pl-[22px] xl:pr-[22px] xl:pb-[25px] 2xl:gap-[143px] 2xl:pl-8 2xl:pr-8 2xl:pb-9">
            <span
              class="text-brand/70 pointer-events-none hidden leading-[132%] font-normal tracking-[-0.01em] opacity-0 md:block md:text-[21px] xl:text-base 2xl:text-[21px]"
              aria-hidden="true"
            >
              ( ${number} )
            </span>
            <div class="text-text max-w-full text-base leading-[150%] font-normal tracking-[-0.01em] md:max-w-[448px] md:text-lg xl:max-w-[500px] xl:text-base 2xl:max-w-[680px] 2xl:text-lg">
              ${faq.answer || ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderPagination() {
    if (!pagination) return;

    const desktopPaginationContainer = pagination.querySelector('.hidden.items-center.gap-1.md\\:flex');
    const loadMoreBtn = document.getElementById('faq-load-more-btn');

    // Desktop: numbered pagination
    if (desktopPaginationContainer) {
      if (totalPages <= 1) {
        const baseClasses =
          'flex cursor-pointer items-center justify-center border md:rounded-card 2xl:rounded-[6px] md:text-sm leading-[132%] font-normal tracking-[-0.01em] transition-colors';
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
          'flex cursor-pointer items-center justify-center border md:rounded-card 2xl:rounded-[6px] md:text-sm leading-[132%] font-normal tracking-[-0.01em] transition-colors';
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

        desktopPaginationContainer.querySelectorAll('button[data-page]').forEach((btn) => {
          btn.addEventListener('click', async (e) => {
            const page = parseInt(e.currentTarget.dataset.page);
            if (page !== currentPage && !isLoading) {
              await loadPageData(page, true);
              const categoriesWrapper = document.getElementById('categories-wrapper');
              if (categoriesWrapper) {
                categoriesWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }
          });
        });
      }
    }

    // Mobile: Load more button
    if (loadMoreBtn) {
      const allLoaded = totalPages <= 1;

      if (allLoaded) {
        loadMoreBtn.style.display = 'none';
      } else {
        loadMoreBtn.style.display = 'flex';
        loadMoreBtn.textContent = 'Load more';
        loadMoreBtn.disabled = false;

        const newBtn = loadMoreBtn.cloneNode(true);
        loadMoreBtn.parentNode.replaceChild(newBtn, loadMoreBtn);

        newBtn.addEventListener('click', async () => {
          if (!isLoading) {
            newBtn.textContent = 'Loading...';
            newBtn.disabled = true;
            currentPerPage += DEFAULT_ITEMS_PER_PAGE;
            await loadPageData(1, true, false);
          }
        });
      }
    }
  }

  function showEmptyState() {
    const emptyMessage = document.getElementById('empty-message');
    const accordionWrapper = document.getElementById('accordion-container-wrapper');

    if (emptyMessage) {
      emptyMessage.classList.remove('hidden');
      setTimeout(() => {
        emptyMessage.classList.remove('opacity-0', 'translate-y-[100px]');
      }, 10);
    }
    if (pagination) {
      pagination.style.display = 'none';
    }
  }

  function hideEmptyState() {
    const emptyMessage = document.getElementById('empty-message');
    const accordionWrapper = document.getElementById('accordion-container-wrapper');

    if (emptyMessage) {
      emptyMessage.classList.add('hidden');
      emptyMessage.classList.add('opacity-0', 'translate-y-[100px]');
    }
    if (pagination) {
      pagination.style.display = 'flex';
    }
  }

  function triggerEntranceAnimations() {
    const title = document.getElementById('faq-title');
    if (title) {
      title.classList.remove('opacity-0', 'translate-y-[100px]');
    }

    const categoriesWrapper = document.getElementById('categories-wrapper');
    if (categoriesWrapper) {
      categoriesWrapper.classList.remove('opacity-0', 'translate-y-[80px]');
    }

    const accordionWrapper = document.getElementById('accordion-container-wrapper');
    if (accordionWrapper) {
      accordionWrapper.classList.remove('opacity-0', 'translate-y-[150px]');
    }
  }

  function initSectionAnimation() {
    const section = document.getElementById('faqs-section');
    if (!section) return;

    sectionSpring = new Spring(SPRING_CONFIGS.FAQ);

    section.style.willChange = 'transform, opacity';
    section.style.transform = 'translateY(220px)';
    section.style.opacity = '0.3';

    function updateSection() {
      if (!document.contains(section)) {
        animationFrameId = null;
        isAnimating = false;
        section.style.willChange = 'auto';
        return;
      }
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      const scrollProgress = getScrollProgress(section);
      sectionSpring.setTarget(scrollProgress);
      const smoothProgress = sectionSpring.update(deltaTime);

      const y = transformProgress(smoothProgress, [0, 0.7], [220, 0]);
      const opacity = transformProgress(smoothProgress, [0, 0.5], [0.3, 1]);

      section.style.transform = `translateY(${y}px)`;
      section.style.opacity = opacity;

      const springValue = sectionSpring.getValue();
      const velocity = sectionSpring.velocity;

      const needsUpdate = Math.abs(springValue - scrollProgress) > 0.001 || Math.abs(velocity) > 0.001;

      if (needsUpdate) {
        animationFrameId = requestAnimationFrame(updateSection);
        isAnimating = true;
      } else {
        animationFrameId = null;
        isAnimating = false;
        section.style.willChange = 'auto';
      }
    }

    function onScroll() {
      if (!isAnimating && !animationFrameId) {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(updateSection);
      }
    }

    if (!faqPageScrollListenersAdded) {
      faqPageScrollListenersAdded = true;
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
    }

    onScroll();
  }

  function initAccordion() {
    const items = document.querySelectorAll('#faq-accordion .faq-item');

    items.forEach((item) => {
      const trigger = item.querySelector('.accordion-trigger');
      const content = item.querySelector('.accordion-content');
      const iconBox = item.querySelector('.icon-box');
      const icon = iconBox ? iconBox.querySelector('div') : null;

      if (!trigger || !content) return;

      content.style.height = '0';
      content.style.opacity = '0';
      item.setAttribute('data-state', 'closed');

      trigger.onclick = () => {
        const isOpen = item.getAttribute('data-state') === 'open';

        items.forEach((otherItem) => {
          if (otherItem !== item && otherItem.getAttribute('data-state') === 'open') {
            const otherContent = otherItem.querySelector('.accordion-content');
            const otherIconBox = otherItem.querySelector('.icon-box');
            const otherIcon = otherIconBox ? otherIconBox.querySelector('div') : null;

            if (otherContent) {
              otherItem.setAttribute('data-state', 'closed');
              otherContent.style.height = '0';
              otherContent.style.opacity = '0';
              if (otherIcon) otherIcon.style.transform = '';
              if (otherIconBox) {
                otherIconBox.classList.remove('bg-brand/20');
                otherIconBox.classList.add('bg-brand/10');
              }
            }
          }
        });

        if (isOpen) {
          item.setAttribute('data-state', 'closed');
          content.style.height = '0';
          content.style.opacity = '0';
          if (icon) icon.style.transform = '';
          if (iconBox) {
            iconBox.classList.remove('bg-brand/20');
            iconBox.classList.add('bg-brand/10');
          }
        } else {
          item.setAttribute('data-state', 'open');
          const inner = content.querySelector('div');
          if (inner) {
            content.style.height = inner.offsetHeight + 'px';
          }
          content.style.opacity = '1';
          if (icon) icon.style.transform = 'rotate(45deg)';
          if (iconBox) {
            iconBox.classList.remove('bg-brand/10');
            iconBox.classList.add('bg-brand/20');
          }
        }
      };
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
