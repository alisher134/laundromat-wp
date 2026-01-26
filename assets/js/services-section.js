(function () {

  // Map card index to service category
  const CARD_CATEGORIES = ['laundry', 'drying', 'specialCleaning'];

  /**
   * Fetch services from API and update price info on cards
   */
  async function loadServicePrices() {
    if (typeof LaundroAPI === 'undefined') {
      console.warn('[Services Section] LaundroAPI not available');
      return;
    }

    try {
      const services = await LaundroAPI.getServices();
      if (!services || services.length === 0) return;

      // Map services by category
      const servicesByCategory = {};
      services.forEach((service) => {
        servicesByCategory[service.category] = service;
      });

      // Update each card's price info
      const cards = document.querySelectorAll('[data-service-card]');
      cards.forEach((card) => {
        const cardIndex = parseInt(card.getAttribute('data-service-card'), 10);
        const category = CARD_CATEGORIES[cardIndex];
        const service = servicesByCategory[category];

        if (!service || !service.priceRows || service.priceRows.length === 0) return;

        const priceInfo = card.querySelector('.service-price-info');
        if (!priceInfo) return;

        // Get first price row for "from" values
        const firstRow = service.priceRows[0];

        // Find the lowest price and shortest time across all rows
        let minPrice = Infinity;
        let minTime = Infinity;
        let timeUnit = 'min';

        service.priceRows.forEach((row) => {
          if (row.price && parseFloat(row.price) < minPrice) {
            minPrice = parseFloat(row.price);
          }
          if (row.time && parseFloat(row.time) < minTime) {
            minTime = parseFloat(row.time);
            timeUnit = row.timeUnit || 'min';
          }
        });

        // Update price value
        const priceValueEl = priceInfo.querySelector('.price-value');
        if (priceValueEl && minPrice !== Infinity) {
          priceValueEl.textContent = `${minPrice} $`;
        }

        // Update time value
        const divs = priceInfo.querySelectorAll('div');
        if (divs.length >= 3 && minTime !== Infinity) {
          const timeValueEl = divs[2].querySelector('.price-value');
          if (timeValueEl) {
            timeValueEl.textContent = `${minTime} ${timeUnit}`;
          }
        }
      });

      console.log('[Services Section] Prices updated from API');
    } catch (error) {
      console.error('[Services Section] Error loading prices:', error);
    }
  }

  function initServiceCards() {
    const cards = document.querySelectorAll('[data-service-card]');
    if (cards.length === 0) return;

    const springs = new Map();
    let lastTime = performance.now();
    let animationFrameId = null;

    cards.forEach((card, index) => {
      const wrapper = card.querySelector('.service-card-wrapper');
      const imageWrapper = card.querySelector('.service-image-wrapper');
      const priceInfo = card.querySelector('.service-price-info');
      
      if (!wrapper || !imageWrapper) return;

      const spring = new Spring(SPRING_CONFIGS.SERVICES);
      springs.set(card, { spring, card, wrapper, imageWrapper, priceInfo });

      const breakpoint = getBreakpoint();
      const smallSize = CARD_SIZES.small[breakpoint];
      imageWrapper.style.height = `${smallSize.height}px`;
      imageWrapper.style.width = `${smallSize.width}px`;
    });

    function updateCards() {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      const breakpoint = getBreakpoint();
      let needsUpdate = false;

      springs.forEach(({ spring, card, wrapper, imageWrapper, priceInfo }) => {
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
        const velocity = spring.velocity;
        if (Math.abs(springValue - scrollProgress) > 0.001 || Math.abs(velocity) > 0.001) {
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

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      const breakpoint = getBreakpoint();
      springs.forEach(({ imageWrapper }) => {
        const smallSize = CARD_SIZES.small[breakpoint];
        imageWrapper.style.height = `${smallSize.height}px`;
        imageWrapper.style.width = `${smallSize.width}px`;
      });
      onScroll();
    });

    onScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initServiceCards();
      loadServicePrices();
    });
  } else {
    initServiceCards();
    loadServicePrices();
  }
})();
