(function () {

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
        
        // Transform: [0, 0.8] -> [0, 1]
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
      initCategoryButtons();
    });
  } else {
    initServiceCards();
    initCategoryButtons();
  }

  function initCategoryButtons() {
    const categoryButtons = document.querySelectorAll('[data-category]');
    const servicesList = document.getElementById('services-list');
    
    if (!categoryButtons.length || !servicesList) return;

    const serviceCards = {
      laundry: servicesList.querySelector('[data-service="laundry"]') || servicesList.children[0],
      drying: servicesList.querySelector('[data-service="drying"]') || servicesList.children[1],
      specialCleaning: servicesList.querySelector('[data-service="specialCleaning"]') || servicesList.children[2],
    };

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

      const targetCard = serviceCards[category];
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
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const category = btn.getAttribute('data-category');
        if (category) {
          setActiveCategory(category);
        }
      });
    });

    const categoriesSection = document.querySelector('.animate-fade-up');
    const mobileSliderContainer = categoriesSection ? categoriesSection.querySelector('.keen-slider') : null;
    
    if (mobileSliderContainer && typeof KeenSlider !== 'undefined') {
      try {
        new KeenSlider(mobileSliderContainer, {
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
        
        // Close all other items (accordion behavior - only one open at a time)
        faqItems.forEach((otherItem) => {
          if (otherItem !== item) {
            const otherContent = otherItem.querySelector('.faq-content');
            const otherIcon = otherItem.querySelector('.faq-icon');
            if (otherContent) {
              otherContent.setAttribute('data-state', 'closed');
              otherContent.style.maxHeight = '0';
              otherContent.style.opacity = '0';
              if (otherIcon) {
                otherIcon.style.transform = 'rotate(0deg)';
              }
            }
          }
        });
        
        if (isOpen) {
          // Close current item
          content.setAttribute('data-state', 'closed');
          content.style.maxHeight = '0';
          content.style.opacity = '0';
          if (icon) {
            icon.style.transform = 'rotate(0deg)';
          }
        } else {
          // Open current item
          content.setAttribute('data-state', 'open');
          // Set maxHeight to scrollHeight for smooth animation
          content.style.maxHeight = content.scrollHeight + 'px';
          content.style.opacity = '1';
          if (icon) {
            icon.style.transform = 'rotate(45deg)';
          }
        }
      });
    });
  }

  // Initialize FAQ accordion
  initFAQAccordion();
})();
