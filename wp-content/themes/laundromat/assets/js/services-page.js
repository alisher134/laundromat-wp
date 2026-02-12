(function () {
  /**
   * Create a price row for Laundry (simple structure) or desktop section of Drying/Special cleaning.
   * Matches static HTML exactly.
   */
  function createPriceRowDesktop(row) {
    const timeDisplay = row.time ? `${row.time} ${row.timeUnit}` : '';
    const priceDisplay = row.price ? `${row.price} $` : '';

    const div = document.createElement('div');
    div.className =
      'border-text/12 flex items-center justify-between border-t py-[10px] last:border-b md:py-[12px] xl:py-4 2xl:py-4';
    div.innerHTML = `
      <p class="text-text text-base leading-[132%] font-normal tracking-[-0.01em] md:text-lg xl:text-lg 2xl:text-[21px]">
        ${row.feature}
      </p>
      <div class="flex items-center justify-end gap-3 md:gap-9 xl:gap-[64px]">
        <p class="text-text text-lg leading-[132%] font-normal tracking-[-0.01em] md:text-[21px] xl:text-[21px] xl:leading-[136%] xl:tracking-[-0.02em] 2xl:text-[24px]">
          ${timeDisplay}
        </p>
        <div class="bg-text/12 h-[42px] w-[0.5px]"></div>
        <p class="text-text text-lg leading-[132%] font-normal tracking-[-0.01em] md:text-[21px] xl:text-[21px] xl:leading-[136%] xl:tracking-[-0.02em] 2xl:text-[24px]">
          ${priceDisplay}
        </p>
      </div>
    `;
    return div;
  }

  /**
   * Create a price row for mobile section (block md:hidden) of Drying/Special cleaning.
   * Matches static HTML exactly.
   */
  function createPriceRowMobile(row) {
    const timeDisplay = row.time ? `${row.time} ${row.timeUnit}` : '';
    const priceDisplay = row.price ? `${row.price} $` : '';

    const div = document.createElement('div');
    div.className =
      'border-text/12 flex items-center justify-between border-t py-[10px] last:border-b md:py-[12px]';
    div.innerHTML = `
      <p class="text-text col-span-2 text-base leading-[132%] font-normal tracking-[-0.01em] md:text-lg">
        ${row.feature}
      </p>
      <div class="flex items-center justify-end gap-3">
        <p class="text-text text-lg leading-[132%] font-normal tracking-[-0.01em] md:text-[21px] md:leading-[136%] md:tracking-[-0.02em]">
          ${timeDisplay}
        </p>
        <div class="bg-text/12 h-[42px] w-[0.5px]"></div>
        <p class="text-text text-lg leading-[132%] font-normal tracking-[-0.01em] md:text-[21px] md:leading-[136%] md:tracking-[-0.02em]">
          ${priceDisplay}
        </p>
      </div>
    `;
    return div;
  }

  /**
   * Render price rows into container. Uses structure matching static HTML:
   * - isLaundryStructure (section 0): simple direct rows
   * - else (sections 1,2): block md:hidden (mobile) + hidden md:block (desktop)
   */
  function renderPriceRows(priceContainer, priceRows, isLaundryStructure) {
    const header = priceContainer.querySelector('.text-brand');
    Array.from(priceContainer.children).forEach((child) => {
      if (child !== header) child.remove();
    });

    if (!priceRows || priceRows.length === 0) {
      const placeholder = document.createElement('p');
      placeholder.className = 'text-text/60 text-base py-4';
      placeholder.textContent = 'Pricing information coming soon';
      priceContainer.appendChild(placeholder);
      return;
    }

    if (isLaundryStructure) {
      priceRows.forEach((row) => {
        priceContainer.appendChild(createPriceRowDesktop(row));
      });
    } else {
      const mobileWrapper = document.createElement('div');
      mobileWrapper.className = 'block md:hidden';
      priceRows.forEach((row) => {
        mobileWrapper.appendChild(createPriceRowMobile(row));
      });
      priceContainer.appendChild(mobileWrapper);

      const desktopWrapper = document.createElement('div');
      desktopWrapper.className = 'hidden md:block';
      priceRows.forEach((row) => {
        desktopWrapper.appendChild(createPriceRowDesktop(row));
      });
      priceContainer.appendChild(desktopWrapper);
    }
  }

  /**
   * Helper to create a category button
   * @param {Object} category - category object from API
   * @param {Boolean} isActive - is this the active category
   * @param {Boolean} isMobile - applies different classes for mobile slider
   */
  function createCategoryButton(category, isActive, isMobile) {
    const btn = document.createElement('button');
    btn.setAttribute('data-category', category.key);

    // Base classes common to both
    let classes =
      'inline-flex min-w-fit cursor-pointer items-center justify-center !rounded-[12px] rounded-[12px] border px-[18px] py-[14px] !text-sm text-base leading-[132%] font-normal tracking-[-0.01em] whitespace-nowrap transition-colors duration-200 md:rounded-[16px] 2xl:text-lg';

    // Active vs Inactive classes
    if (isActive) {
      classes += ' bg-brand/6 text-brand border-transparent';
    } else {
      classes += ' border-text/20 text-text';
    }

    // Mobile specific (slider class) checks
    if (isMobile) {
      classes += ' keen-slider__slide category-btn';
    } else {
      classes += ' category-btn';
    }

    btn.className = classes;
    btn.textContent = category.label;

    return btn;
  }

  // Fetch services from WordPress API and update DOM
  async function loadServicesFromAPI() {
    if (typeof LaundroAPI === 'undefined') {
      console.warn('[Services] LaundroAPI not available');
      return;
    }

    try {
      const services = await LaundroAPI.getServices();
      if (!services || services.length === 0) {
        console.warn('[Services] No services returned from API');
        return;
      }

      console.log(`[Services] Loaded ${services.length} services from API`);

      // Sort services by menu_order
      services.sort((a, b) => (a.menu_order || 0) - (b.menu_order || 0));

      const servicesList = document.getElementById('services-list');
      if (!servicesList) return;

      const serviceSections = servicesList.querySelectorAll('[data-service]');

      // Map services to sections by index
      serviceSections.forEach((section, index) => {
        const serviceData = services[index];
        if (!serviceData) return;

        // CRITICAL: Update the data-service attribute to match the API category key
        // This links the service section to the correct category button
        if (serviceData.category) {
          section.setAttribute('data-service', serviceData.category);
          console.log(`[Services] Linked section ${index} to category "${serviceData.category}"`);
        }

        // Update title
        const titleEl = section.querySelector('h2');
        if (titleEl && serviceData.title) titleEl.textContent = serviceData.title;

        // Update description
        const descriptionEl = section.querySelector('p.text-text[class*="max-w-"]');
        if (descriptionEl && serviceData.description) {
          const cleanDescription = serviceData.description.replace(/<[^>]*>/g, '').trim();
          if (cleanDescription) descriptionEl.textContent = cleanDescription;
        }

        // Update image
        const imageEl = section.querySelector('img');
        if (imageEl && serviceData.image) {
          imageEl.src = serviceData.image;
          imageEl.alt = serviceData.title || 'Service';
        }

        // Update price rows (structure matches static HTML: laundry=simple, drying/specialCleaning=mobile+desktop split)
        const priceContainer = section.querySelector('[data-price-rows]');
        if (priceContainer && serviceData.priceRows !== undefined) {
          const category = section.getAttribute('data-service') || serviceData.category || '';
          const isLaundryStructure = category === 'laundry';
          renderPriceRows(priceContainer, serviceData.priceRows, isLaundryStructure);
        }

        // Update action link
        const actionLink = section.querySelector('a[href*="instructions"], a.group');
        if (actionLink && serviceData.actionLink) {
          if (serviceData.actionLink.url) actionLink.href = serviceData.actionLink.url;
          if (serviceData.actionLink.text) {
            const p = actionLink.querySelector('p');
            if (p) p.textContent = serviceData.actionLink.text;
          }
          if (!serviceData.actionLink.text && !serviceData.actionLink.url) {
            actionLink.style.display = 'none';
          } else {
            actionLink.style.display = '';
          }
        }
      });
    } catch (error) {
      console.error('[Services] Error loading services:', error);
    }
  }

  // Fetch categories from WordPress API and render buttons
  async function loadCategoriesFromAPI() {
    if (typeof LaundroAPI === 'undefined') return;

    try {
      const categories = await LaundroAPI.getServiceCategories();
      if (!categories || categories.length === 0) {
        console.warn('[Services] No categories returned from API');
        return;
      }

      console.log(`[Services] Loaded ${categories.length} categories from API`);

      // Sort by order
      categories.sort((a, b) => (parseInt(a.order) || 0) - (parseInt(b.order) || 0));

      const mobileSlider = document.getElementById('services-mobile-categories-slider');
      const desktopContainer = document.getElementById('services-desktop-categories-container');

      if (mobileSlider) mobileSlider.innerHTML = '';
      if (desktopContainer) desktopContainer.innerHTML = '';

      categories.forEach((cat, index) => {
        const isActive = index === 0; // First one active by default

        if (mobileSlider) {
          mobileSlider.appendChild(createCategoryButton(cat, isActive, true));
        }
        if (desktopContainer) {
          desktopContainer.appendChild(createCategoryButton(cat, isActive, false));
        }
      });
    } catch (err) {
      console.error('[Services] Error loading categories', err);
    }
  }

  let serviceCardsScrollListenersAdded = false;

  function initServiceCards() {
    const cards = document.querySelectorAll('[data-service-card]');
    if (cards.length === 0) return;

    const springs = new Map();
    let lastTime = performance.now();
    let animationFrameId = null;

    cards.forEach((card) => {
      const wrapper = card.querySelector('.service-card-wrapper');
      const imageWrapper = card.querySelector('.service-image-wrapper');
      const priceInfo = card.querySelector('.service-price-info');

      if (!wrapper || !imageWrapper) return;

      if (typeof Spring === 'undefined' || typeof SPRING_CONFIGS === 'undefined') return;

      const spring = new Spring(SPRING_CONFIGS.SERVICES);
      springs.set(card, { spring, card, wrapper, imageWrapper, priceInfo });

      const breakpoint = getBreakpoint();
      if (typeof CARD_SIZES !== 'undefined' && CARD_SIZES.small && CARD_SIZES.small[breakpoint]) {
        const smallSize = CARD_SIZES.small[breakpoint];
        imageWrapper.style.height = `${smallSize.height}px`;
        imageWrapper.style.width = `${smallSize.width}px`;
      }
    });

    function updateCards() {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      const breakpoint = getBreakpoint();
      let needsUpdate = false;

      springs.forEach((entry, card) => {
        if (!document.contains(card)) {
          springs.delete(card);
          return;
        }
        const { spring, wrapper, imageWrapper, priceInfo } = entry;
        const scrollProgress = getScrollProgressCenter(card);
        spring.setTarget(scrollProgress);
        const smoothProgress = spring.update(deltaTime);

        const expandProgress = transformProgress(smoothProgress, [0, 0.8], [0, 1]);
        const smallSize = CARD_SIZES.small[breakpoint];
        const largeSize = CARD_SIZES.large[breakpoint];

        const height = transformProgress(expandProgress, [0, 0.9], [smallSize.height, largeSize.height]);
        const width = transformProgress(expandProgress, [0, 1], [smallSize.width, largeSize.width]);
        const isActiveProgress = transformProgress(expandProgress, [0, 0.4], [0, 1], true);
        const justifyContentValue = expandProgress < 0.3 ? 'flex-start' : '';
        const paddingBottomValue = transformProgress(expandProgress, [0, 0.3], [12, 0]);

        imageWrapper.style.height = `${height}px`;
        imageWrapper.style.width = `${width}px`;
        wrapper.style.justifyContent = justifyContentValue;
        wrapper.style.paddingBottom = `${paddingBottomValue}px`;

        if (priceInfo) {
          priceInfo.style.opacity = isActiveProgress;
          priceInfo.style.display = isActiveProgress > 0 ? 'flex' : 'none';
        }

        const springValue = spring.getValue();
        if (Math.abs(springValue - scrollProgress) > 0.001 || Math.abs(spring.velocity) > 0.001) {
          needsUpdate = true;
        }
      });

      if (needsUpdate) {
        animationFrameId = requestAnimationFrame(updateCards);
      } else {
        animationFrameId = null;
      }
    }

    function onScroll() {
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(updateCards);
      }
    }

    if (!serviceCardsScrollListenersAdded) {
      serviceCardsScrollListenersAdded = true;
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', () => {
        const breakpoint = getBreakpoint();
        springs.forEach((entry, card) => {
          // update size on resize
          const { imageWrapper } = entry;
          const smallSize = CARD_SIZES.small[breakpoint];
          imageWrapper.style.height = `${smallSize.height}px`;
          imageWrapper.style.width = `${smallSize.width}px`;
        });
        onScroll();
      });
    }

    onScroll();
  }

  function initCategoryButtons() {
    const categoryButtons = document.querySelectorAll('[data-category]');
    const servicesList = document.getElementById('services-list');

    if (!categoryButtons.length || !servicesList) return;

    // Helper: find card by data-service attribute
    function getServiceCard(category) {
      return servicesList.querySelector(`[data-service="${category}"]`);
    }

    function setActiveCategory(category) {
      categoryButtons.forEach((btn) => {
        const btnCategory = btn.getAttribute('data-category');
        if (btnCategory === category) {
          btn.classList.remove('border-text/20', 'text-text');
          btn.classList.add('bg-brand/6', 'text-brand', 'border-transparent');
        } else {
          btn.classList.remove('bg-brand/6', 'text-brand', 'border-transparent');
          btn.classList.add('border-text/20', 'text-text');
        }
      });

      const targetCard = getServiceCard(category);
      if (targetCard) {
        const headerHeight = 120;
        const cardPosition = targetCard.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: Math.max(0, cardPosition),
          behavior: 'smooth',
        });
      }
    }

    categoryButtons.forEach((btn) => {
      // Remove old listeners to prevent duplicates if re-inited
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);

      newBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const category = newBtn.getAttribute('data-category');
        if (category) {
          setActiveCategory(category);
        }
      });
    });

    // Re-select fresh buttons after cloning
    // Initialize KeenSlider for mobile
    const mobileSliderElement = document.getElementById('services-mobile-categories-slider');

    if (mobileSliderElement && typeof KeenSlider !== 'undefined' && mobileSliderElement.children.length > 0) {
      try {
        // Destroy existing instance if any (not easily tracked here without global var, but new instance usually ok)
        new KeenSlider(mobileSliderElement, {
          mode: 'free-snap',
          slides: {
            perView: 'auto',
            spacing: 8,
          },
        });
      } catch (e) {
        console.warn('Could not initialize category slider:', e);
      }
    }
  }

  // FAQ accordion functionality
  function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length === 0) return;

    faqItems.forEach((item) => {
      const trigger = item.querySelector('.faq-trigger');
      const content = item.querySelector('.faq-content');
      const icon = item.querySelector('.faq-icon');

      if (!trigger || !content) return;

      // Set initial state - all closed
      content.setAttribute('data-state', 'closed');
      content.style.maxHeight = '0';
      content.style.opacity = '0';
      content.style.overflow = 'hidden';
      content.style.transition = 'max-height 0.3s ease-out, opacity 0.3s ease-out';
      if (icon) {
        icon.style.transition = 'transform 0.3s ease-out';
        icon.style.transform = 'rotate(0deg)';
      }

      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = content.getAttribute('data-state') === 'open';

        // Close all other items
        faqItems.forEach((otherItem) => {
          if (otherItem !== item) {
            const otherContent = otherItem.querySelector('.faq-content');
            const otherIcon = otherItem.querySelector('.faq-icon');
            if (otherContent) {
              otherContent.setAttribute('data-state', 'closed');
              otherContent.style.maxHeight = '0';
              otherContent.style.opacity = '0';
              if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
            }
          }
        });

        if (isOpen) {
          content.setAttribute('data-state', 'closed');
          content.style.maxHeight = '0';
          content.style.opacity = '0';
          if (icon) icon.style.transform = 'rotate(0deg)';
        } else {
          content.setAttribute('data-state', 'open');
          content.style.maxHeight = content.scrollHeight + 'px';
          content.style.opacity = '1';
          if (icon) icon.style.transform = 'rotate(45deg)';
        }
      });
    });
  }

  async function initPage() {
    // Parallel fetch
    await Promise.all([loadServicesFromAPI(), loadCategoriesFromAPI()]);

    initServiceCards();
    initCategoryButtons();
    initFAQAccordion();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage);
  } else {
    initPage();
  }
})();
