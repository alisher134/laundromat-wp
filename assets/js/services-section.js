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
      const border = card.querySelector('[data-card-border]');

      if (!imageWrapper) return;

      // Set initial styles and CSS transition for fixed 250ms duration
      const breakpoint = getBreakpoint();
      const smallSize = CARD_SIZES.small[breakpoint];
      imageWrapper.style.height = `${smallSize.height}px`;
      imageWrapper.style.width = `${smallSize.width}px`;
      imageWrapper.style.transition = 'all 4000ms cubic-bezier(0.23, 1, 0.32, 1)'; // Extremely slow, gradual expansion
      imageWrapper.style.willChange = 'height, width';

      if (border) {
        border.style.transition = 'transform 4000ms cubic-bezier(0.23, 1, 0.32, 1), opacity 4000ms ease-out';
        border.style.transformOrigin = 'left';
        border.style.transform = 'scaleX(0)';
        border.style.opacity = '0';
      }

      const entry = {
        card,
        imageWrapper,
        border,
        index,
        isExpanded: false,
      };

      entries.push(entry);
    });

    function updateCards() {
      const windowHeight = window.innerHeight;
      const breakpoint = getBreakpoint();

      entries.forEach((entry, i) => {
        if (!document.contains(entry.card)) return;

        const rect = entry.card.getBoundingClientRect();
        // Trigger as soon as the card top enters the viewport (plus a small buffer)
        const shouldExpand = rect.top < windowHeight - 50;

        if (shouldExpand !== entry.isExpanded) {
          entry.isExpanded = shouldExpand;
          const size = shouldExpand ? CARD_SIZES.large[breakpoint] : CARD_SIZES.small[breakpoint];

          entry.imageWrapper.style.height = `${size.height}px`;
          entry.imageWrapper.style.width = `${size.width}px`;

          // If this card expands, it potentially triggers the PREVIOUS card's border
          if (i > 0 && shouldExpand) {
            const prevEntry = entries[i - 1];
            if (prevEntry.border) {
              prevEntry.border.style.transform = 'scaleX(1)';
              prevEntry.border.style.opacity = '1';
            }
          } else if (i > 0 && !shouldExpand) {
            const prevEntry = entries[i - 1];
            if (prevEntry.border) {
              prevEntry.border.style.transform = 'scaleX(0)';
              prevEntry.border.style.opacity = '0';
            }
          }

          // Last card handles its own border
          if (i === entries.length - 1 && entry.border) {
            entry.border.style.transform = shouldExpand ? 'scaleX(1)' : 'scaleX(0)';
            entry.border.style.opacity = shouldExpand ? '1' : '0';
          }
        }
      });

      animationFrameId = null;
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
