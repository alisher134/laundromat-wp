(function () {
  // FAQ data
  let faqs = [];
  let categories = [];
  let activeCategory = 'all';
  let mobileSlider = null;

  let sectionSpring = null;
  let lastTime = performance.now();
  let animationFrameId = null;
  let isAnimating = false;
  let faqPageScrollListenersAdded = false;

  // Init
  function init() {
    initSectionAnimation();
    loadData();

    // Trigger entrance animations after a short delay
    setTimeout(triggerEntranceAnimations, 100);
  }

  // Load Categories and FAQs
  async function loadData() {
    if (typeof LaundroAPI === 'undefined') {
      console.error('[FAQ] LaundroAPI not available');
      showEmptyState();
      return;
    }

    try {
      // Parallel fetch
      const [apiCategories, apiFaqs] = await Promise.all([LaundroAPI.getFAQCategories(), LaundroAPI.getFAQs()]);

      // Process Categories
      if (apiCategories && Array.isArray(apiCategories)) {
        categories = apiCategories;
        // Ensure "All" exists or is added if not coming from backend (backend usually sends it or we add it)
        //Backend "laundromat_get_faq_categories" adds "All" with key='all'
      } else {
        categories = [{ key: 'all', label: 'All', id: 0 }];
      }

      renderCategories();

      // Process FAQs
      if (apiFaqs && apiFaqs.length > 0) {
        faqs = apiFaqs;
        renderFAQs(faqs);
        // initAccordion called inside renderFAQs
        // triggerEntranceAnimations called in init
      } else {
        showEmptyState();
      }
    } catch (error) {
      console.error('[FAQ] Failed to load data:', error);
      showEmptyState();
    }
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

        // Update UI
        renderCategories(); // Re-renders to update active classes

        // Fetch new data
        await fetchFAQsByCategory(key);
      });
    });
  }

  async function fetchFAQsByCategory(categoryKey) {
    const container = document.getElementById('faq-accordion');
    if (container) {
      container.style.opacity = '0.5'; // Loading indication
    }

    try {
      const params = categoryKey === 'all' ? {} : { faq_category: categoryKey };
      const newFaqs = await LaundroAPI.getFAQs(params);

      if (newFaqs && newFaqs.length > 0) {
        renderFAQs(newFaqs);
      } else {
        renderFAQs([]); // Show empty
      }
    } catch (error) {
      console.error('Error fetching filtered FAQs:', error);
    } finally {
      if (container) {
        container.style.opacity = '1';
      }
    }
  }

  // Render FAQs into the accordion container
  function renderFAQs(faqsToRender) {
    const container = document.getElementById('faq-accordion');
    if (!container) return;

    if (!faqsToRender || faqsToRender.length === 0) {
      showEmptyState();
      container.innerHTML = '';
      return;
    }

    hideEmptyState();

    const html = faqsToRender
      .map((faq, index) => {
        const number = String(index + 1).padStart(2, '0');
        // NOTE: We rely on the existing CSS classes and structure
        return `
        <div
          class="faq-item group overflow-hidden rounded-[11px] border border-transparent bg-white backdrop-blur-[30px] md:rounded-[16px] xl:rounded-[11px] 2xl:rounded-[16px]"
          data-state="closed"
        >
          <div
            class="accordion-trigger flex cursor-pointer items-center justify-between pt-4 pr-3 pb-[17px] pl-4 text-left md:pt-[33px] md:pr-9 md:pb-9 md:pl-6 xl:pt-6 xl:pr-6 xl:pb-[25px] xl:pl-[22px] 2xl:pt-[33px] 2xl:pr-9 2xl:pb-9 2xl:pl-8"
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
            <div class="flex items-start px-5 pt-0 pb-5 md:gap-[54px] md:px-6 md:pb-6 xl:gap-[104px] xl:px-[22px] xl:pb-[25px] 2xl:gap-[143px] 2xl:px-8 2xl:pb-9">
              <span
                class="pointer-events-none hidden font-normal opacity-0 md:block md:text-lg xl:text-sm 2xl:text-lg"
                aria-hidden="true"
              >
                ( 00 )
              </span>
              <div class="text-text max-w-full text-base leading-[150%] font-normal tracking-[-0.01em] md:max-w-[448px] md:text-lg xl:max-w-[500px] xl:text-base 2xl:max-w-[680px] 2xl:text-lg">
                ${faq.answer || ''}
              </div>
            </div>
          </div>
        </div>
      `;
      })
      .join('');

    container.innerHTML = html;
    initAccordion();
  }

  // Show empty state
  function showEmptyState() {
    const emptyMessage = document.getElementById('empty-message');
    const accordionWrapper = document.getElementById('accordion-container-wrapper');

    if (emptyMessage) {
      emptyMessage.classList.remove('hidden');
      setTimeout(() => {
        emptyMessage.classList.remove('opacity-0', 'translate-y-[100px]');
      }, 10);
    }
    if (accordionWrapper) {
      // Don't fully hide it, just clear content or let renderFAQs handle it
      // but if we want to hide the whole wrapper:
      // accordionWrapper.classList.add('hidden');
    }
  }

  // Hide empty state
  function hideEmptyState() {
    const emptyMessage = document.getElementById('empty-message');
    const accordionWrapper = document.getElementById('accordion-container-wrapper');

    if (emptyMessage) {
      emptyMessage.classList.add('hidden');
      emptyMessage.classList.add('opacity-0', 'translate-y-[100px]'); // reset generic anim setup
    }
    if (accordionWrapper) {
      accordionWrapper.classList.remove('hidden');
    }
  }

  // Trigger entrance animations
  function triggerEntranceAnimations() {
    // Title animation
    const title = document.getElementById('faq-title');
    if (title) {
      title.classList.remove('opacity-0', 'translate-y-[100px]');
    }

    // Categories animation
    const categoriesWrapper = document.getElementById('categories-wrapper');
    if (categoriesWrapper) {
      categoriesWrapper.classList.remove('opacity-0', 'translate-y-[80px]');
    }

    // Accordion animation
    const accordionWrapper = document.getElementById('accordion-container-wrapper');
    if (accordionWrapper) {
      accordionWrapper.classList.remove('opacity-0', 'translate-y-[150px]');
    }
  }

  function initSectionAnimation() {
    const section = document.getElementById('faqs-section'); // Note: ID might need verification globally but it's not in faq.html main tag?
    // In faq.html main doesn't have ID 'faqs-section'.
    // It seems 'faqs-section' might be from home page or other references.
    // The previous code had it, but unique to faq.html page, maybe not needed or should target 'main'.
    // Let's target main or just return if not found to avoid errors
    if (!section) return;

    // ... (Keep existing Spring logic if section exists, or remove if unused in standalone page)
    // For now, keeping it safe
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

      // Initial state
      content.style.height = '0';
      content.style.opacity = '0';
      item.setAttribute('data-state', 'closed');

      trigger.onclick = () => {
        // Using onclick to replace previous listeners clearly
        const isOpen = item.getAttribute('data-state') === 'open';

        // Close others
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

        // Toggle current
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
