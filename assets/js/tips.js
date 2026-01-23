document.addEventListener('DOMContentLoaded', () => {
  // --- Detect Page Type ---
  const isInstructionsPage =
    window.location.pathname.includes('instructions.html') ||
    window.location.href.includes('instructions.html') ||
    document.querySelector('h1#tips-title')?.textContent.trim() === 'Instructions';

  // --- Data ---
  const CATEGORIES = [
    { key: 'all', label: 'All articles' },
    { key: 'tipsAndTricks', label: 'Tips and tricks' },
    { key: 'usefulResources', label: 'Useful resources' },
    { key: 'companyNews', label: 'Company news' },
  ];

  const SORT_OPTIONS = [
    { value: 'latest', label: 'Latest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'title-asc', label: 'Title A-Z' },
    { value: 'title-desc', label: 'Title Z-A' },
  ];

  const TIPS_DATA = [
    {
      key: 'tip-1',
      image: './assets/images/tips-1.png',
      category: 'Tips and tricks',
      title: 'Our washing machine and dryer broke down during the renovation in the basement renovation in the basemen',
      date: 'April 29, 2025',
    },
    {
      key: 'tip-2',
      image: './assets/images/tips-2.png',
      category: 'Useful resources',
      title: '10 Best Charlotte NC House Cleaning Services',
      date: 'April 26, 2025',
    },
    {
      key: 'tip-3',
      image: './assets/images/tips-3.png',
      category: 'Tips and tricks',
      title: 'Laundry Pick Up Service vs Laundromat – Which Is Better?',
      date: 'April 24, 2025',
    },
    {
      key: 'tip-4',
      image: './assets/images/tips-4.png',
      category: 'Tips and tricks',
      title: 'Laundry Bleach vs Laundry Whitener: Which Is Better For Your Clothes?',
      date: 'April 24, 2025',
    },
    {
      key: 'tip-5',
      image: './assets/images/tips-5.png',
      category: 'Company news',
      title: 'Dirty Secrets Of Airbnbs: 15 Airbnb Laundry Tips For A Perfect Trip',
      date: 'April 24, 2025',
    },
    {
      key: 'tip-6',
      image: './assets/images/tips-6.png',
      category: 'Useful resources',
      title: 'How To Prevent Clothes From Shrinking in the Wash FOREVER!',
      date: 'April 24, 2025',
    },
    {
      key: 'tip-7',
      image: './assets/images/tips-7.png',
      category: 'Tips and tricks',
      title: '7 Amazingly Simple Laundry Tips For Winter Clothes',
      date: 'April 24, 2025',
    },
    {
      key: 'tip-8',
      image: './assets/images/tips-8.png',
      category: 'Company news',
      title: '9 Huge Reasons To Use A Professional Laundry Service',
      date: 'April 24, 2025',
    },
  ];

  const INSTRUCTIONS_DATA = [
    {
      key: 'instruction-1',
      image: './assets/images/tips-1.png',
      category: 'Tips and tricks',
      title: 'How to Use Our Washing Machines: A Complete Guide',
      date: 'April 29, 2025',
    },
    {
      key: 'instruction-2',
      image: './assets/images/tips-2.png',
      category: 'Useful resources',
      title: 'Understanding Wash Cycles: When to Use Each Setting',
      date: 'April 26, 2025',
    },
    {
      key: 'instruction-3',
      image: './assets/images/tips-3.png',
      category: 'Tips and tricks',
      title: 'How to Properly Load Your Laundry for Best Results',
      date: 'April 24, 2025',
    },
    {
      key: 'instruction-4',
      image: './assets/images/tips-4.png',
      category: 'Tips and tricks',
      title: 'Choosing the Right Detergent for Your Clothes',
      date: 'April 24, 2025',
    },
    {
      key: 'instruction-5',
      image: './assets/images/tips-5.png',
      category: 'Company news',
      title: 'New Self-Service Features Available at Our Locations',
      date: 'April 24, 2025',
    },
    {
      key: 'instruction-6',
      image: './assets/images/tips-6.png',
      category: 'Useful resources',
      title: 'Step-by-Step Guide to Using Our Dryers',
      date: 'April 24, 2025',
    },
    {
      key: 'instruction-7',
      image: './assets/images/tips-7.png',
      category: 'Tips and tricks',
      title: 'How to Handle Delicate Fabrics at Our Laundromat',
      date: 'April 24, 2025',
    },
    {
      key: 'instruction-8',
      image: './assets/images/tips-8.png',
      category: 'Company news',
      title: 'Payment Options: Cards, Cash, and Mobile Payments',
      date: 'April 24, 2025',
    },
  ];

  // Use appropriate data based on page
  const DATA = isInstructionsPage ? INSTRUCTIONS_DATA : TIPS_DATA;

  // --- State ---
  let activeCategory = 'all';
  let currentSort = '';
  let currentPage = 1;
  let mobileFilterSlider = null;
  let mobileTipsSlider = null;

  // --- DOM Elements ---
  const filtersContainer = document.getElementById('tips-filters');
  const gridDesktop = document.getElementById('tips-grid-desktop');
  const sliderMobile = document.getElementById('tips-slider-mobile');
  const pagination = document.getElementById('tips-pagination');

  // --- Scroll Animation Variables (must be declared before initPage) ---
  const SPRING_CONFIG_TIPS = { stiffness: 55, damping: 16, mass: 0.85 };
  const imageSprings = new Map();
  let lastTime = performance.now();
  let animationFrameId = null;

  // --- Scroll Animations ---
  // Spring physics simulation for TipsSection images
  class Spring {
    constructor(config) {
      this.stiffness = config.stiffness;
      this.damping = config.damping;
      this.mass = config.mass;
      this.velocity = 0;
      this.current = 0;
      this.target = 0;
    }

    update(deltaTime) {
      const deltaTimeSeconds = deltaTime / 1000;
      const force = (this.target - this.current) * this.stiffness;
      const damping = this.velocity * this.damping;
      const acceleration = (force - damping) / this.mass;

      this.velocity += acceleration * deltaTimeSeconds;
      this.current += this.velocity * deltaTimeSeconds;

      if (Math.abs(this.target - this.current) < 0.001 && Math.abs(this.velocity) < 0.001) {
        this.current = this.target;
        this.velocity = 0;
      }

      return this.current;
    }

    setTarget(value) {
      this.target = value;
    }

    getValue() {
      return this.current;
    }
  }

  // --- Initialization ---
  initPage();

  function initPage() {
    renderFilters();
    renderContent();
    renderPagination();
    initScrollAnimations();
  }

  function initScrollAnimations() {
    const images = document.querySelectorAll('.scroll-scale-image');

    function getImageScrollProgress(img) {
      const card = img.closest('article') || img.closest('.tips-card');
      if (!card) return 0;

      const rect = card.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementTop = rect.top;

      // Framer Motion offset: ['start end', 'start center']
      // 0 = top of card meets bottom of viewport (start end)
      // 1 = top of card meets center of viewport (start center)
      const startEnd = windowHeight;
      const startCenter = windowHeight / 2;

      let progress = (startEnd - elementTop) / (startEnd - startCenter);
      progress = Math.min(Math.max(progress, 0), 1);

      // Transform progress [0, 0.65] to scale [0.8, 1]
      // useTransform(smoothProgress, [0, 0.65], [0.8, 1])
      if (progress <= 0) return 0.8;
      if (progress >= 0.65) return 1;

      const normalizedProgress = progress / 0.65;
      return 0.8 + 0.2 * normalizedProgress;
    }

    // Initialize spring for each image with initial scale based on scroll position
    images.forEach((img) => {
      if (!imageSprings.has(img)) {
        const spring = new Spring(SPRING_CONFIG_TIPS);
        // Calculate initial scale based on scroll position
        const initialScale = getImageScrollProgress(img);
        spring.current = initialScale;
        spring.target = initialScale;
        imageSprings.set(img, spring);
        img.style.transform = `scale(${initialScale})`;
        img.style.transition = 'transform 0.1s linear';
      }
    });

    function updateAnimations() {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      images.forEach((img) => {
        const targetScale = getImageScrollProgress(img);
        const spring = imageSprings.get(img);

        if (spring) {
          spring.setTarget(targetScale);
          const smoothScale = spring.update(deltaTime);
          img.style.transform = `scale(${smoothScale})`;
        }
      });

      // Continue animation if any spring is not at target
      const needsUpdate = Array.from(imageSprings.values()).some(
        (spring) => Math.abs(spring.getValue() - spring.target) > 0.001,
      );

      if (needsUpdate) {
        animationFrameId = requestAnimationFrame(updateAnimations);
      } else {
        animationFrameId = null;
      }
    }

    function onScroll() {
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(updateAnimations);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Initial call
    onScroll();
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
