(function () {
  /**
   * Create a price row element matching the frontend HTML structure
   * @param {Object} row - { feature, time, timeUnit, price }
   * @returns {HTMLElement}
   */
  function createPriceRowElement(row) {
    const div = document.createElement('div');
    div.className =
      'border-text/12 flex items-center justify-between border-t py-[10px] last:border-b md:py-[12px] xl:py-4 2xl:py-4';

    const timeDisplay = row.time ? `${row.time} ${row.timeUnit}` : '';
    const priceDisplay = row.price ? `${row.price} $` : '';

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

        // Update price rows
        const priceContainer = section.querySelector('[data-price-rows]');
        if (priceContainer && serviceData.priceRows) {
          const header = priceContainer.querySelector('.text-brand');
          Array.from(priceContainer.children).forEach((child) => {
            if (child !== header) child.remove();
          });

          if (serviceData.priceRows.length > 0) {
            serviceData.priceRows.forEach((row) => {
              priceContainer.appendChild(createPriceRowElement(row));
            });
          } else {
            const placeholder = document.createElement('p');
            placeholder.className = 'text-text/60 text-base py-4';
            placeholder.textContent = 'Pricing information coming soon';
            priceContainer.appendChild(placeholder);
          }
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

      const spring = new Spring(SPRING_CONFIGS.SERVICES_LAYOUT);
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

  // Fetch FAQs from WordPress API
  async function loadFAQsFromAPI() {
    if (typeof LaundroAPI === 'undefined') {
      console.warn('[Services] LaundroAPI not available');
      return;
    }

    try {
      const faqsList = document.getElementById('services-faq-list');
      if (!faqsList) return;

      // Add loading state
      faqsList.innerHTML = '<div class="text-text/60 text-center py-8">Loading FAQs...</div>';

      const faqs = await LaundroAPI.getFAQs();

      if (!faqs || faqs.length === 0) {
        faqsList.innerHTML = '<div class="text-text/60 text-center py-8">No FAQs available</div>';
        return;
      }

      console.log(`[Services] Loaded ${faqs.length} FAQs from API`);

      // Clear list
      faqsList.innerHTML = '';

      // Create and append FAQ items
      faqs.forEach((faq, index) => {
        const number = String(index + 1).padStart(2, '0');
        const item = document.createElement('div');
        item.className =
          'faq-item overflow-hidden rounded-[11px] bg-white backdrop-blur-[30px] md:rounded-[16px] xl:rounded-[11px] 2xl:rounded-[16px]';
        item.setAttribute('data-state', 'closed');

        item.innerHTML = `
          <button
            class="faq-trigger group flex w-full cursor-pointer items-center justify-between pt-4 pr-3 pb-[17px] pl-4 text-left transition-all outline-none md:pt-[33px] md:pr-9 md:pb-9 md:pl-6 xl:pt-6 xl:pr-6 xl:pb-[25px] xl:pl-[22px] 2xl:pt-[33px] 2xl:pr-9 2xl:pb-9 2xl:pl-8"
          >
            <div class="flex w-full items-center justify-between">
              <div class="flex items-start md:gap-[54px] xl:gap-[104px] 2xl:gap-[143px] transition-transform duration-300 group-hover:scale-[1.02] origin-left">
                <span
                  class="text-brand/70 hidden leading-[132%] font-normal tracking-[-0.01em] md:block md:text-lg xl:text-sm 2xl:text-lg"
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
                class="bg-brand/10 text-brand flex h-[40px] w-[40px] items-center justify-center rounded-[9px] md:size-[55px] md:rounded-[12px] xl:size-[40px] 2xl:size-[55px] 2xl:rounded-[12px]"
              >
                <div class="faq-icon transition-transform duration-300">
                  <svg
                    class="h-[10px] w-[10px] md:h-[12px] md:w-[12px] xl:h-[10px] xl:w-[10px] 2xl:h-[12px] 2xl:w-[12px]"
                    viewBox="0 0 11 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.76795 0.5V4.5V10.5M2.5 5.5H10.5H0.5"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </span>
            </div>
          </button>
          <div class="faq-content overflow-hidden text-sm" data-state="closed" style="max-height: 0; opacity: 0; transition: max-height 0.3s ease-out, opacity 0.3s ease-out;">
            <div class="text-text px-5 pb-5 text-base leading-[150%] font-normal tracking-[-0.01em] md:px-6 md:pb-6 xl:px-[22px] xl:pb-[25px] 2xl:px-8 2xl:pb-9">
              ${faq.answer}
            </div>
          </div>
        `;

        faqsList.appendChild(item);
      });

      // Re-init accordion logic for new elements
      initFAQAccordion();
    } catch (error) {
      console.error('[Services] Error loading FAQs:', error);
      const faqsList = document.getElementById('services-faq-list');
      if (faqsList) {
        faqsList.innerHTML =
          '<div class="text-error/60 text-center py-8">Failed to load FAQs. Please try again later.</div>';
      }
    }
  }

  // FAQ accordion functionality
  function initFAQAccordion() {
    const faqItems = document.querySelectorAll('#services-faq-list .faq-item');
    if (faqItems.length === 0) return;

    faqItems.forEach((item) => {
      // Avoid re-binding if already bound
      if (item.hasAttribute('data-bound')) return;
      item.setAttribute('data-bound', 'true');

      const trigger = item.querySelector('.faq-trigger');
      const content = item.querySelector('.faq-content');
      const icon = item.querySelector('.faq-icon');
      const iconBox = item.querySelector('span.bg-brand\\/10');

      if (!trigger || !content) return;

      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = content.getAttribute('data-state') === 'open';

        // Close all other items
        faqItems.forEach((otherItem) => {
          if (otherItem !== item) {
            const otherContent = otherItem.querySelector('.faq-content');
            const otherIcon = otherItem.querySelector('.faq-icon');
            const otherIconBox = otherItem.querySelector('span.bg-brand\\/10');

            if (otherContent) {
              otherContent.setAttribute('data-state', 'closed');
              otherContent.style.maxHeight = '0';
              otherContent.style.opacity = '0';
              if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
              if (otherIconBox) {
                otherIconBox.classList.remove('bg-brand/20');
                otherIconBox.classList.add('bg-brand/10');
              }
            }
          }
        });

        if (isOpen) {
          content.setAttribute('data-state', 'closed');
          content.style.maxHeight = '0';
          content.style.opacity = '0';
          if (icon) icon.style.transform = 'rotate(0deg)';
          if (iconBox) {
            iconBox.classList.remove('bg-brand/20');
            iconBox.classList.add('bg-brand/10');
          }
        } else {
          content.setAttribute('data-state', 'open');

          const inner = content.children[0];
          const height = inner ? inner.offsetHeight + 40 : content.scrollHeight;
          content.style.maxHeight = height + 'px';
          content.style.opacity = '1';
          if (icon) icon.style.transform = 'rotate(45deg)';
          if (iconBox) {
            iconBox.classList.remove('bg-brand/10');
            iconBox.classList.add('bg-brand/20');
          }
        }
      });
    });
  }

  async function initPage() {
    // Parallel fetch
    await Promise.all([loadServicesFromAPI(), loadCategoriesFromAPI(), loadFAQsFromAPI()]);

    initServiceCards();
    initCategoryButtons();
    // initFAQAccordion called inside loadFAQsFromAPI
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage);
  } else {
    initPage();
  }
})();
