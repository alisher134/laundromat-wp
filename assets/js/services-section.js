(function () {
  // Map card index to service category
  const CARD_CATEGORIES = ['laundry', 'drying', 'specialCleaning'];

  /**
   * Fetch services from API and update all content (titles, descriptions, images, prices)
   */
  async function loadServices() {
    if (typeof LaundroAPI === 'undefined') {
      console.warn('[Services Section] LaundroAPI not available');
      return;
    }

    try {
      const services = await LaundroAPI.getServices();
      if (!services || services.length === 0) return;

      // Map services by category (API returns newest first, so we only take the first one for each category)
      const servicesByCategory = {};
      services.forEach((service) => {
        if (!servicesByCategory[service.category]) {
          servicesByCategory[service.category] = service;
        }
      });

      // Update desktop cards (with data-service-card attribute)
      const desktopCards = document.querySelectorAll('[data-service-card]');
      desktopCards.forEach((card) => {
        const cardIndex = parseInt(card.getAttribute('data-service-card'), 10);
        const category = CARD_CATEGORIES[cardIndex];
        const service = servicesByCategory[category];

        if (!service) return;

        updateCard(card, service);
      });

      // Update mobile cards (without data-service-card, in order)
      const serviceSection = document.getElementById('service-section');
      if (serviceSection) {
        const mobileCards = serviceSection.querySelectorAll('.lg\\:hidden');
        mobileCards.forEach((card, index) => {
          const category = CARD_CATEGORIES[index];
          const service = servicesByCategory[category];

          if (!service) return;

          updateCard(card, service);
        });
      }

      console.log('[Services Section] Content updated from API');
    } catch (error) {
      console.error('[Services Section] Error loading services:', error);
    }
  }

  /**
   * Update a single service card with API data
   */
  function updateCard(card, service) {
    // Update title
    const title = card.querySelector('h3');
    if (title && service.title) {
      title.textContent = service.title;
    }

    // Update description
    const description = card.querySelector('p.text-text\\/60, p.text-text\\/80');
    if (description && service.description) {
      // Strip HTML tags from description
      const cleanDescription = service.description.replace(/<[^>]*>/g, '').trim();
      if (cleanDescription) {
        description.textContent = cleanDescription;
      }
    }

    // Update image
    const image = card.querySelector('img');
    if (image && service.image) {
      image.src = service.image;
      image.alt = service.title || 'Service';
    }

    // Update prices (both mobile static prices and desktop animated prices)
    if (service.priceRows && service.priceRows.length > 0) {
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

      // Update all price displays (both mobile and desktop, both static and animated)
      const priceElements = card.querySelectorAll('p.text-text');
      priceElements.forEach((el) => {
        // Check if this is a price element by looking at its content or siblings
        const prevSibling = el.previousElementSibling;
        if (prevSibling && prevSibling.classList.contains('price-label')) {
          const labelText = prevSibling.textContent.trim();
          if (labelText === 'Price from' && minPrice !== Infinity) {
            el.textContent = `${minPrice} $`;
          } else if (labelText === 'Time from' && minTime !== Infinity) {
            el.textContent = `${minTime} ${timeUnit}`;
          }
        }
      });

      // Update desktop animated price info
      const priceInfo = card.querySelector('.service-price-info');
      if (priceInfo) {
        const priceValueEls = priceInfo.querySelectorAll('.price-value');
        if (priceValueEls.length >= 2) {
          if (minPrice !== Infinity) {
            priceValueEls[0].textContent = `${minPrice} $`;
          }
          if (minTime !== Infinity) {
            priceValueEls[1].textContent = `${minTime} ${timeUnit}`;
          }
        }
      }
    }
  }

  let serviceCardsScrollListenersAdded = false;

  function initServiceCards() {
    const cards = document.querySelectorAll('[data-service-card]');
    if (cards.length === 0) return;

    const entries = [];
    let lastTime = performance.now();
    let animationFrameId = null;

    cards.forEach((card, index) => {
      const imageWrapper = card.querySelector('.service-image-wrapper');
      const borders = card.querySelectorAll('[data-card-border]');

      if (!imageWrapper) return;

      const spring = new Spring(SPRING_CONFIGS.SERVICES);
      const entry = {
        spring,
        card,
        imageWrapper,
        borders,
        index,
        smoothProgress: 0,
        targetProgress: 0,
      };

      entries.push(entry);

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

      // Pass 1: Update all spring values and store current smooth progress
      entries.forEach((entry) => {
        if (!document.contains(entry.card)) return;

        const scrollProgress = getScrollProgressCenter(entry.card);
        // Trigger immediately: if the card enters the active zone (> 0), target becomes 1 (fully expanded)
        // effectively playing the animation automatically instead of scrubbing with scroll
        const target = scrollProgress > 0 ? 1 : 0;

        entry.targetProgress = target;
        entry.smoothProgress = entry.spring.update(deltaTime);
        entry.spring.setTarget(target);
      });

      // Pass 2: Apply styles based on own or next card's progress
      entries.forEach((entry, i) => {
        if (!document.contains(entry.card)) return;

        const { spring, smoothProgress, targetProgress, imageWrapper, borders } = entry;
        const expandProgress = transformProgress(smoothProgress, [0, 0.8], [0, 1]);

        const smallSize = CARD_SIZES.small[breakpoint];
        const largeSize = CARD_SIZES.large[breakpoint];

        // Image expansion logic
        const height = transformProgress(expandProgress, [0, 0.9], [smallSize.height, largeSize.height]);
        const width = transformProgress(expandProgress, [0, 1], [smallSize.width, largeSize.width]);

        imageWrapper.style.height = `${height}px`;
        imageWrapper.style.width = `${width}px`;

        // Border drawing logic
        let borderDrawProgress = 0;
        if (i < entries.length - 1) {
          // Non-last card: Border draws when NEXT card starts its expansion
          // Balanced range: 0 to 0.4
          const nextEntry = entries[i + 1];
          borderDrawProgress = transformProgress(nextEntry.smoothProgress, [0, 0.4], [0, 1], true);
        } else {
          // Last card: Border draws after its OWN expansion
          // Balanced range: 0.8 to 1.0
          borderDrawProgress = transformProgress(smoothProgress, [0.8, 1.0], [0, 1], true);
        }

        if (borders.length > 0) {
          borders.forEach((border) => {
            border.style.transformOrigin = 'left';
            border.style.transform = `scaleX(${borderDrawProgress})`;
            border.style.opacity = borderDrawProgress;
          });
        }

        // Monitoring for next frame
        const springValue = spring.getValue();
        const velocity = spring.velocity;
        if (Math.abs(springValue - targetProgress) > 0.001 || Math.abs(velocity) > 0.001) {
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
        lastTime = performance.now(); // Reset lastTime to avoid huge deltaTime
        animationFrameId = requestAnimationFrame(updateCards);
      }
    }

    if (!serviceCardsScrollListenersAdded) {
      serviceCardsScrollListenersAdded = true;
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', () => {
        const breakpoint = getBreakpoint();
        entries.forEach((entry) => {
          if (!document.contains(entry.card)) return;
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      loadServices();
      initServiceCards();
    });
  } else {
    loadServices();
    initServiceCards();
  }
})();
