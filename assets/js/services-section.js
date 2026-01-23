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
    document.addEventListener('DOMContentLoaded', initServiceCards);
  } else {
    initServiceCards();
  }
})();
