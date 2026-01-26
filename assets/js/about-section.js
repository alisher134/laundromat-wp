// AboutSection slider initialization with dynamic content from API
(function () {
  const sliderEl = document.getElementById('about-slider');
  if (!sliderEl || typeof KeenSlider === 'undefined') return;

  let sliderInstance = null;
  let currentSlide = 0;
  let totalSlides = 0;
  let maxIdx = 0;

  // Custom easing function: 1 - (1 - t)^4
  function customEasing(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  // Get spacing based on breakpoint
  function getSpacing() {
    if (window.innerWidth >= 1024) {
      return 18;
    }
    return 8;
  }

  /**
   * Generate HTML for about card
   */
  function generateAboutCard(item) {
    const iconHtml = item.iconImageUrl
      ? `<img src="${item.iconImageUrl}" alt="${item.title} icon" class="size-[22px] 2xl:size-9 object-contain" />`
      : '';

    return `
      <article
        class="keen-slider__slide bg-brand-bg/10 relative min-w-[293px] rounded-[16px] px-[20px] pt-[20px] pb-[30px] backdrop-blur-[60px] backdrop-filter md:flex md:h-[295px] md:min-w-[546px] md:gap-[46px] md:p-[28px] xl:min-w-[625px] xl:gap-[112px] 2xl:h-[414px] 2xl:min-w-[878px] 2xl:gap-[151px] 2xl:pt-[40px] 2xl:pb-9 2xl:pl-[42px]"
      >
        <div class="md:flex md:h-full md:flex-col-reverse md:justify-between">
          <span
            class="border-text/16 mt-auto flex size-[50px] items-center justify-center rounded-[14px] border md:size-[57px] md:rounded-[19px] 2xl:size-[80px] 2xl:rounded-[26px]"
          >
            ${iconHtml}
          </span>
          <h3
            class="text-text hidden text-[42px] leading-[110%] font-normal tracking-[-0.04em] md:block md:max-w-[144px] 2xl:max-w-[203px] 2xl:text-[64px]"
          >
            ${item.title || ''}
          </h3>
        </div>
        <span class="bg-brand absolute top-5 right-5 h-[6px] w-[6px] rounded-full" role="presentation"></span>
        <div
          class="md:border-l-text/20 md:flex md:h-full md:flex-col md:justify-end md:border-l md:pl-[32px] 2xl:pl-[48px]"
        >
          <h3 class="paragraph-heading-md mt-[74px] mb-[20px] block md:hidden">${item.title || ''}</h3>
          <div class="bg-text/20 block h-px w-full md:hidden"></div>
          <p
            class="text-text mt-[22px] mb-3 max-w-[214px] text-lg leading-[124%] font-normal tracking-[-0.01em] md:mb-[33px] md:text-[19px] md:leading-[124%] md:tracking-[-0.04em] 2xl:mb-[46px] 2xl:max-w-[302px] 2xl:text-[28px]"
          >
            ${item.secondaryTitle || ''}
          </p>
          <p class="paragraph-subtle paragraph-sm-default max-w-[192px] 2xl:max-w-[271px] 2xl:text-base">
            ${item.description || ''}
          </p>
        </div>
      </article>
    `;
  }

  /**
   * Load about items from API and render them
   */
  async function loadAboutItems() {
    if (typeof LaundroAPI === 'undefined') {
      console.warn('[About Section] LaundroAPI not available, using static content');
      // If API is not available, keep the static HTML and just initialize slider
      initSlider();
      setupButtons();
      return;
    }

    try {
      const items = await LaundroAPI.getAboutItems();

      if (!items || items.length === 0) {
        console.warn('[About Section] No about items found, using static content');
        initSlider();
        setupButtons();
        return;
      }

      // Clear existing content
      sliderEl.innerHTML = '';

      // Generate and append cards
      items.forEach((item) => {
        sliderEl.insertAdjacentHTML('beforeend', generateAboutCard(item));
      });

      console.log('[About Section] Loaded', items.length, 'items from API');

      // Initialize slider with new content
      initSlider();
      setupButtons();
    } catch (error) {
      console.error('[About Section] Error loading items:', error);
      // Keep static content and initialize slider
      initSlider();
      setupButtons();
    }
  }

  // Initialize slider
  function initSlider() {
    if (sliderInstance) {
      sliderInstance.destroy();
    }

    const spacing = getSpacing();

    sliderInstance = new KeenSlider('#about-slider', {
      loop: false,
      mode: 'free',
      rtl: false,
      rubberband: true,
      slides: {
        perView: 'auto',
        spacing: spacing,
        origin: 0,
      },
      defaultAnimation: {
        duration: 1200,
        easing: customEasing,
      },
      created: (slider) => {
        totalSlides = slider.track.details.slides.length;
        maxIdx = slider.track.details.maxIdx;
        updateButtons();
      },
      slideChanged: (slider) => {
        currentSlide = slider.track.details.rel;
        maxIdx = slider.track.details.maxIdx;
        updateButtons();
      },
    });
  }

  // Update button states
  function updateButtons() {
    const isFirstSlide = currentSlide === 0;
    const isLastSlide = currentSlide >= maxIdx;

    // Desktop buttons
    const prevBtnDesktop = document.getElementById('about-prev-btn-desktop');
    const nextBtnDesktop = document.getElementById('about-next-btn-desktop');

    // Mobile buttons
    const prevBtnMobile = document.getElementById('about-prev-btn-mobile');
    const nextBtnMobile = document.getElementById('about-next-btn-mobile');

    [prevBtnDesktop, prevBtnMobile].forEach((btn) => {
      if (btn) {
        btn.disabled = isFirstSlide;
        btn.setAttribute('aria-disabled', isFirstSlide);
        if (isFirstSlide) {
          btn.classList.add('opacity-40');
        } else {
          btn.classList.remove('opacity-40');
        }
      }
    });

    [nextBtnDesktop, nextBtnMobile].forEach((btn) => {
      if (btn) {
        btn.disabled = isLastSlide;
        btn.setAttribute('aria-disabled', isLastSlide);
        if (isLastSlide) {
          btn.classList.add('opacity-40');
        } else {
          btn.classList.remove('opacity-40');
        }
      }
    });
  }

  // Button handlers
  function setupButtons() {
    const prevBtnDesktop = document.getElementById('about-prev-btn-desktop');
    const nextBtnDesktop = document.getElementById('about-next-btn-desktop');
    const prevBtnMobile = document.getElementById('about-prev-btn-mobile');
    const nextBtnMobile = document.getElementById('about-next-btn-mobile');

    if (prevBtnDesktop) {
      prevBtnDesktop.addEventListener('click', () => {
        if (sliderInstance) sliderInstance.prev();
      });
    }

    if (nextBtnDesktop) {
      nextBtnDesktop.addEventListener('click', () => {
        if (sliderInstance) sliderInstance.next();
      });
    }

    if (prevBtnMobile) {
      prevBtnMobile.addEventListener('click', () => {
        if (sliderInstance) sliderInstance.prev();
      });
    }

    if (nextBtnMobile) {
      nextBtnMobile.addEventListener('click', () => {
        if (sliderInstance) sliderInstance.next();
      });
    }
  }

  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      loadAboutItems();
    });
  } else {
    loadAboutItems();
  }

  let resizeTimeout;
  const handleResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      initSlider();
    }, 250);
  };

  window.addEventListener('resize', handleResize, { passive: true });
})();
