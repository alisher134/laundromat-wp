// ReviewsSection - Dynamic content from API with mobile slider and desktop grid
(function () {
  let mobileSliderInstance = null;

  // Default user icon SVG
  const defaultUserIconSVG = `<svg
    aria-hidden="true"
    class="text-brand size-[26px] md:size-[32px] 2xl:size-[44px]"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M14.3479 22.8263C14.3458 21.2081 14.809 19.6234 15.6823 18.2611H5.54756C4.76921 18.2611 4.02274 18.5703 3.47237 19.1207C2.92199 19.6711 2.61279 20.4175 2.61279 21.1959V22.3946C2.61279 23.1407 2.84757 23.8685 3.27931 24.4763C5.2906 27.2989 8.58276 28.6958 13.0436 28.6958C14.2601 28.6958 15.3871 28.5915 16.4245 28.3828C15.0843 26.843 14.3467 24.8702 14.3479 22.8289M19.5653 9.13987C19.5653 7.4102 18.8782 5.75138 17.6551 4.52833C16.4321 3.30527 14.7733 2.61816 13.0436 2.61816C11.3139 2.61816 9.65512 3.30527 8.43206 4.52833C7.20901 5.75138 6.5219 7.4102 6.5219 9.13987C6.5219 10.8695 7.20901 12.5283 8.43206 13.7514C9.65512 14.9745 11.3139 15.6616 13.0436 15.6616C14.7733 15.6616 16.4321 14.9745 17.6551 13.7514C18.8782 12.5283 19.5653 10.8695 19.5653 9.13987ZM30 22.8263C30 20.9237 29.2442 19.099 27.8988 17.7536C26.5535 16.4083 24.7288 15.6524 22.8262 15.6524C20.9235 15.6524 19.0988 16.4083 17.7535 17.7536C16.4081 19.099 15.6523 20.9237 15.6523 22.8263C15.6523 24.7289 16.4081 26.5536 17.7535 27.899C19.0988 29.2444 20.9235 30.0002 22.8262 30.0002C24.7288 30.0002 26.5535 29.2444 27.8988 27.899C29.2442 26.5536 30 24.7289 30 22.8263Z"
      fill="currentColor"
    />
    <path
      d="M18.9468 25.6184C19.7333 26.4956 20.8306 27.0475 22.0168 27.1628C23.2031 27.278 24.3897 26.9478 25.3369 26.2391C26.284 25.5303 26.9211 24.4957 27.1193 23.3446C27.3174 22.1934 27.0619 21.0115 26.4043 20.0378M25.9138 19.4296C25.3083 18.7966 24.5326 18.3439 23.6759 18.1235"
      stroke="#ECF3F8"
      stroke-width="1.06719"
    />
  </svg>`;

  /**
   * Generate user icon HTML (either custom photo or default SVG icon)
   */
  function generateUserIcon(photoUrl, authorName, size = 'mobile') {
    const sizeClasses = size === 'desktop' ? 'size-[69px] 2xl:size-[96px]' : 'size-[50px]';

    if (photoUrl) {
      return `<img src="${photoUrl}" alt="${authorName}" class="${sizeClasses} rounded-[14px] object-cover" />`;
    }

    return `<span class="bg-brand-bg/10 flex ${sizeClasses} items-center justify-center rounded-[14px]">
      ${defaultUserIconSVG}
    </span>`;
  }

  /**
   * Generate HTML for mobile review slide
   */
  function generateMobileReview(review) {
    return `
      <div class="keen-slider__slide min-w-[320px] rounded-[16px] bg-white/80 px-[20px] pt-[20px] pb-[32px] backdrop-blur-[42px] md:min-w-[385px]">
        <div class="flex items-start justify-between">
          <div class="mb-[80px] flex items-center gap-[18px]">
            ${generateUserIcon(review.photoUrl, review.authorName, 'mobile')}
            <h4 class="text-text text-lg leading-[132%] font-normal tracking-[-0.01em]">${review.authorName}</h4>
          </div>
          <span class="bg-brand h-[6px] w-[6px] rounded-full"></span>
        </div>
        <div class="bg-text/20 h-px w-full"></div>
        <p class="text-text mt-5 mb-[46px] text-sm leading-[146%] font-normal tracking-[-0.01em]">
          ${review.reviewText}
        </p>
        ${review.aggregatorUrl ? `<a class="link-brand" href="${review.aggregatorUrl}" target="_blank" rel="noopener noreferrer">Read more</a>` : ''}
      </div>
    `;
  }

  /**
   * Generate HTML for desktop review card
   */
  function generateDesktopReview(review, index) {
    const number = String(index + 1).padStart(2, '0');
    const iconContent = review.photoUrl
      ? `<img src="${review.photoUrl}" alt="${review.authorName}" class="size-[69px] 2xl:size-[96px] rounded-[14px] object-cover" />`
      : defaultUserIconSVG;

    return `
      <div
        class="review-card relative flex min-w-[648px] items-start justify-between rounded-[16px] bg-white/80 px-[28px] pt-[20px] pb-[32px] backdrop-blur-[21px] backdrop-filter 2xl:min-w-[915px] 2xl:px-9"
        data-review-index="${index}"
        style="opacity: 0; transform: translateY(30px)"
      >
        <div class="flex h-full flex-1 flex-col">
          <p class="text-text text-2xl leading-[136%] font-normal tracking-[-0.02em] 2xl:text-[32px]">${number}.</p>
          <span
            class="review-icon ${review.photoUrl ? '' : 'bg-brand-bg/10'} mt-auto flex size-[69px] origin-bottom-left items-center justify-center rounded-[14px] 2xl:size-[96px]"
            style="opacity: 0; transform: scale(0)"
          >
            ${iconContent}
          </span>
        </div>
        <div class="border-text/16 border-l pl-[32px] 2xl:pl-[46px]">
          <h4 class="text-text mb-[75px] text-2xl leading-[136%] font-normal tracking-[-0.02em] 2xl:mb-[114px] 2xl:text-[32px]">
            ${review.authorName}
          </h4>
          <p class="text-text mt-5 mb-[26px] max-w-full text-sm leading-[146%] font-normal tracking-[-0.01em] lg:max-w-[280px] xl:max-w-[348px] 2xl:mb-9 2xl:max-w-[489px] 2xl:text-lg">
            ${review.reviewText}
          </p>
          ${review.aggregatorUrl ? `<a class="link-brand-lg" href="${review.aggregatorUrl}" target="_blank" rel="noopener noreferrer">Read more</a>` : ''}
        </div>
        <span class="bg-brand absolute top-[12px] right-[12px] h-[6px] w-[6px] rounded-full"></span>
      </div>
    `;
  }

  /**
   * Load reviews from API and render them
   */
  async function loadReviews() {
    if (typeof LaundroAPI === 'undefined') {
      console.warn('[Reviews Section] LaundroAPI not available, using static content');
      initMobileSlider();
      initDesktopGrid();
      return;
    }

    try {
      const reviews = await LaundroAPI.getReviews();

      if (!reviews || reviews.length === 0) {
        console.warn('[Reviews Section] No reviews found, using static content');
        initMobileSlider();
        initDesktopGrid();
        return;
      }

      // Update mobile slider
      const mobileSlider = document.getElementById('reviews-slider-mobile');
      if (mobileSlider) {
        mobileSlider.innerHTML = '';
        reviews.forEach((review) => {
          mobileSlider.insertAdjacentHTML('beforeend', generateMobileReview(review));
        });
      }

      // Update desktop grid
      const desktopGrid = document.getElementById('reviews-grid');
      if (desktopGrid) {
        desktopGrid.innerHTML = '';
        reviews.forEach((review, index) => {
          desktopGrid.insertAdjacentHTML('beforeend', generateDesktopReview(review, index));
        });
      }

      console.log('[Reviews Section] Loaded', reviews.length, 'reviews from API');

      // Initialize mobile slider and desktop grid animations
      initMobileSlider();
      initDesktopGrid();
    } catch (error) {
      console.error('[Reviews Section] Error loading reviews:', error);
      initMobileSlider();
      initDesktopGrid();
    }
  }

  function initMobileSlider() {
    const sliderEl = document.getElementById('reviews-slider-mobile');
    if (!sliderEl || typeof KeenSlider === 'undefined') return;

    const prevBtn = document.getElementById('reviews-prev-btn-mobile');
    const nextBtn = document.getElementById('reviews-next-btn-mobile');

    if (mobileSliderInstance) {
      mobileSliderInstance.destroy();
    }

    mobileSliderInstance = new KeenSlider('#reviews-slider-mobile', {
      loop: false,
      mode: 'free',
      rtl: false,
      rubberband: true,
      slides: {
        perView: 1,
        spacing: 8,
        origin: 0,
      },
      breakpoints: {
        '(min-width: 768px)': {
          slides: {
            perView: 1,
            spacing: 8,
          },
        },
      },
      created: (slider) => {
        updateButtons(slider);
      },
      slideChanged: (slider) => {
        updateButtons(slider);
      },
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (mobileSliderInstance) mobileSliderInstance.prev();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (mobileSliderInstance) mobileSliderInstance.next();
      });
    }

    function updateButtons(slider) {
      if (!slider) return;
      const track = slider.track.details;
      if (!track) return;

      const maxIdx = track.maxIdx || track.slides.length - 1;
      const currentSlide = track.rel;

      if (prevBtn) {
        const isFirstSlide = currentSlide === 0;
        prevBtn.disabled = isFirstSlide;
        prevBtn.setAttribute('aria-disabled', isFirstSlide);
        if (isFirstSlide) {
          prevBtn.classList.add('opacity-40');
        } else {
          prevBtn.classList.remove('opacity-40');
        }
      }
      if (nextBtn) {
        const isLastSlide = currentSlide >= maxIdx;
        nextBtn.disabled = isLastSlide;
        nextBtn.setAttribute('aria-disabled', isLastSlide);
        if (isLastSlide) {
          nextBtn.classList.add('opacity-40');
        } else {
          nextBtn.classList.remove('opacity-40');
        }
      }
    }
  }

  let desktopGridRAF = null;
  let desktopGridScrollListenersAdded = false;

  function initDesktopGrid() {
    const grid = document.getElementById('reviews-grid');
    if (!grid) return;

    if (desktopGridRAF) {
      cancelAnimationFrame(desktopGridRAF);
      desktopGridRAF = null;
    }

    const cards = grid.querySelectorAll('.review-card');
    if (cards.length === 0) return;

    const gridSpring = new Spring(SPRING_CONFIGS.REVIEWS_GRID);
    const cardSprings = new Map();
    let lastTime = performance.now();

    cards.forEach((card) => {
      const icon = card.querySelector('.review-icon');
      if (!icon) return;

      const cardSpring = new Spring(SPRING_CONFIGS.REVIEWS_CARD);
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      icon.style.opacity = '0';
      icon.style.transform = 'scale(0)';
      cardSprings.set(card, { spring: cardSpring, icon, card });
    });

    function updateGrid() {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      let needsUpdate = false;

      const gridProgress = getGridScrollProgress(grid);
      gridSpring.setTarget(gridProgress);
      const gridSmoothProgress = gridSpring.update(deltaTime);

      const gridY = transformProgress(gridSmoothProgress, [0, 1], [30, -60]);
      grid.style.transform = `translateY(${gridY}px)`;

      cardSprings.forEach(({ spring, icon, card }) => {
        if (!document.contains(card)) {
          cardSprings.delete(card);
          return;
        }
        const cardProgress = getCardScrollProgress(card);
        spring.setTarget(cardProgress);
        const cardSmoothProgress = spring.update(deltaTime);

        const iconScale = transformProgress(cardSmoothProgress, [0, 1], [0, 1]);
        const iconOpacity = transformProgress(cardSmoothProgress, [0, 0.3], [0, 1], true);
        const cardOpacity = transformProgress(cardSmoothProgress, [0, 0.5], [0, 1], true);
        const cardY = transformProgress(cardSmoothProgress, [0, 0.5], [30, 0], true);

        icon.style.transform = `scale(${iconScale})`;
        icon.style.opacity = iconOpacity;
        card.style.opacity = cardOpacity;
        card.style.transform = `translateY(${cardY}px)`;

        const springValue = spring.getValue();
        const velocity = spring.velocity;
        if (Math.abs(springValue - cardProgress) > 0.001 || Math.abs(velocity) > 0.001) {
          needsUpdate = true;
        }
      });

      const gridSpringValue = gridSpring.getValue();
      const gridVelocity = gridSpring.velocity;
      if (Math.abs(gridSpringValue - gridProgress) > 0.001 || Math.abs(gridVelocity) > 0.001 || needsUpdate) {
        desktopGridRAF = requestAnimationFrame(updateGrid);
      } else {
        desktopGridRAF = null;
      }
    }

    function onScroll() {
      if (!desktopGridRAF) {
        lastTime = performance.now();
        desktopGridRAF = requestAnimationFrame(updateGrid);
      }
    }

    if (!desktopGridScrollListenersAdded) {
      desktopGridScrollListenersAdded = true;
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
    }

    onScroll();
  }

  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      loadReviews();
    });
  } else {
    loadReviews();
  }
})();
