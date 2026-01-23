// ServiceSection scroll animations
(function () {
  const SPRING_CONFIG = { stiffness: 35, damping: 18, mass: 1.3 };
  const CARD_SIZES = {
    small: {
      lg: { height: 280, width: 350 },
      xl: { height: 390, width: 475 },
      '2xl': { height: 520, width: 720 },
    },
    large: {
      lg: { height: 508, width: 700 },
      xl: { height: 580, width: 900 },
      '2xl': { height: 790, width: 1120 },
    },
  };

  // Get breakpoint
  function getBreakpoint() {
    const width = window.innerWidth;
    if (width >= 1536) return '2xl';
    if (width >= 1280) return 'xl';
    return 'lg';
  }

  // Spring physics simulation
  class Spring {
    constructor(config) {
      this.stiffness = config.stiffness;
      this.damping = config.damping;
      this.mass = config.mass;
      this.velocity = 0;
      this.current = 0;
      this.target = 0;
    }

    update(deltaTime) {
      const deltaTimeSeconds = deltaTime / 1000;
      const force = (this.target - this.current) * this.stiffness;
      const damping = this.velocity * this.damping;
      const acceleration = (force - damping) / this.mass;
      
      this.velocity += acceleration * deltaTimeSeconds;
      this.current += this.velocity * deltaTimeSeconds;
      
      if (Math.abs(this.target - this.current) < 0.001 && Math.abs(this.velocity) < 0.001) {
        this.current = this.target;
        this.velocity = 0;
      }
      
      return this.current;
    }

    setTarget(value) {
      this.target = value;
    }

    getValue() {
      return this.current;
    }
  }

  // Calculate scroll progress
  // Framer Motion offset: ['center end', 'center center']
  // 'center end' = element center at viewport bottom (progress = 0)
  // 'center center' = element center at viewport center (progress = 1)
  function getScrollProgress(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const elementCenter = rect.top + rect.height / 2;
    const viewportCenter = windowHeight / 2;
    const viewportBottom = windowHeight;
    
    // When element center is at viewport bottom: progress = 0
    // When element center is at viewport center: progress = 1
    const startPosition = viewportBottom; // center end
    const endPosition = viewportCenter; // center center
    
    const distance = startPosition - endPosition; // windowHeight / 2
    const currentPosition = elementCenter;
    
    // Calculate progress: 0 when at bottom, 1 when at center
    let progress = 1 - (currentPosition - endPosition) / distance;
    progress = Math.max(0, Math.min(1, progress));
    
    return progress;
  }

  // Transform progress value
  function transformProgress(progress, inputRange, outputRange, clamp = false) {
    const [inputMin, inputMax] = inputRange;
    const [outputMin, outputMax] = outputRange;
    
    if (progress <= inputMin) return clamp ? outputMin : outputMin;
    if (progress >= inputMax) return clamp ? outputMax : outputMax;
    
    const inputRangeSize = inputMax - inputMin;
    const outputRangeSize = outputMax - outputMin;
    const normalizedProgress = (progress - inputMin) / inputRangeSize;
    
    return outputMin + normalizedProgress * outputRangeSize;
  }

  // Initialize service cards
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

      const spring = new Spring(SPRING_CONFIG);
      springs.set(card, { spring, card, wrapper, imageWrapper, priceInfo });

      // Set initial sizes
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
        const scrollProgress = getScrollProgress(card);
        spring.setTarget(scrollProgress);
        const smoothProgress = spring.update(deltaTime);
        
        // Transform: [0, 0.8] -> [0, 1]
        const expandProgress = transformProgress(smoothProgress, [0, 0.8], [0, 1]);
        
        const smallSize = CARD_SIZES.small[breakpoint];
        const largeSize = CARD_SIZES.large[breakpoint];
        
        // Height: [0, 0.9] -> [small, large]
        const height = transformProgress(expandProgress, [0, 0.9], [smallSize.height, largeSize.height]);
        
        // Width: [0, 1] -> [small, large]
        const width = transformProgress(expandProgress, [0, 1], [smallSize.width, largeSize.width]);
        
        // Active progress: [0, 0.4] -> [0, 1] (clamped)
        const isActiveProgress = transformProgress(expandProgress, [0, 0.4], [0, 1], true);
        
        // Justify content: [0, 0.3] -> ['flex-start', '']
        const justifyContentValue = expandProgress < 0.3 ? 'flex-start' : '';
        
        // Padding bottom: [0, 0.3] -> [12, 0]
        const paddingBottomValue = transformProgress(expandProgress, [0, 0.3], [12, 0]);

        // Update styles
        imageWrapper.style.height = `${height}px`;
        imageWrapper.style.width = `${width}px`;
        wrapper.style.justifyContent = justifyContentValue;
        wrapper.style.paddingBottom = `${paddingBottomValue}px`;
        
        if (priceInfo) {
          priceInfo.style.opacity = isActiveProgress;
          priceInfo.style.display = isActiveProgress > 0 ? 'flex' : 'none';
        }

        if (Math.abs(spring.getValue() - scrollProgress) > 0.001) {
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
      // Reset sizes on resize
      const breakpoint = getBreakpoint();
      springs.forEach(({ imageWrapper }) => {
        const smallSize = CARD_SIZES.small[breakpoint];
        imageWrapper.style.height = `${smallSize.height}px`;
        imageWrapper.style.width = `${smallSize.width}px`;
      });
      onScroll();
    });

    // Initial update
    onScroll();
  }

  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initServiceCards);
  } else {
    initServiceCards();
  }
})();
