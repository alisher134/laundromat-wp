// ReviewsSection initialization
(function () {
  const SPRING_CONFIG_GRID = { stiffness: 120, damping: 35, mass: 0.8 };
  const SPRING_CONFIG_CARD = { stiffness: 120, damping: 35, mass: 0.8 };

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

  // Calculate scroll progress for grid
  // Framer Motion offset: ['start end', 'end end']
  // 'start end' = element start at viewport end (progress = 0)
  // 'end end' = element end at viewport end (progress = 1)
  function getGridScrollProgress(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const elementTop = rect.top;
    const elementHeight = rect.height;
    const elementBottom = elementTop + elementHeight;
    
    // When element start is at viewport bottom: progress = 0
    // When element end is at viewport bottom: progress = 1
    // Progress = (windowHeight - elementTop) / (elementHeight + windowHeight - elementBottom)
    // Simplified: progress = (windowHeight - elementTop) / elementHeight
    // But more accurate: progress = (windowHeight - elementTop) / (elementHeight)
    let progress = (windowHeight - elementTop) / elementHeight;
    progress = Math.max(0, Math.min(1, progress));
    
    return progress;
  }

  // Calculate scroll progress for card
  // Framer Motion offset: ['start end', 'center center']
  // 'start end' = element start at viewport end (progress = 0)
  // 'center center' = element center at viewport center (progress = 1)
  function getCardScrollProgress(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const elementTop = rect.top;
    const elementHeight = rect.height;
    const elementCenter = elementTop + elementHeight / 2;
    const viewportCenter = windowHeight / 2;
    
    // When element start is at viewport bottom: progress = 0
    // When element center is at viewport center: progress = 1
    // Start: elementTop = windowHeight (progress = 0)
    // End: elementCenter = viewportCenter (progress = 1)
    const startPoint = windowHeight; // elementTop when progress = 0
    const endPoint = viewportCenter - elementHeight / 2; // elementTop when progress = 1
    
    // Calculate progress based on elementTop position
    let progress = (startPoint - elementTop) / (startPoint - endPoint);
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

  // Initialize mobile slider
  function initMobileSlider() {
    const sliderEl = document.getElementById('reviews-slider-mobile');
    if (!sliderEl || typeof KeenSlider === 'undefined') return;

    const sliderInstance = new KeenSlider('#reviews-slider-mobile', {
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

    const prevBtn = document.getElementById('reviews-prev-btn-mobile');
    const nextBtn = document.getElementById('reviews-next-btn-mobile');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => sliderInstance.prev());
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => sliderInstance.next());
    }

    function updateButtons(slider) {
      if (!slider) return;
      const track = slider.track.details;
      if (!track) return;

      if (prevBtn) {
        prevBtn.disabled = track.rel === 0;
        prevBtn.setAttribute('aria-disabled', track.rel === 0);
        if (track.rel === 0) {
          prevBtn.classList.add('opacity-40');
        } else {
          prevBtn.classList.remove('opacity-40');
        }
      }
      if (nextBtn) {
        nextBtn.disabled = track.rel === track.slides.length - 1;
        nextBtn.setAttribute('aria-disabled', track.rel === track.slides.length - 1);
        if (track.rel === track.slides.length - 1) {
          nextBtn.classList.add('opacity-40');
        } else {
          nextBtn.classList.remove('opacity-40');
        }
      }
    }
  }

  // Initialize desktop grid animations
  function initDesktopGrid() {
    const grid = document.getElementById('reviews-grid');
    if (!grid) return;

    const cards = grid.querySelectorAll('.review-card');
    if (cards.length === 0) return;

    // Grid spring for overall grid movement
    const gridSpring = new Spring(SPRING_CONFIG_GRID);
    
    // Card springs for individual card animations
    const cardSprings = new Map();
    let lastTime = performance.now();
    let animationFrameId = null;

    cards.forEach((card) => {
      const icon = card.querySelector('.review-icon');
      if (!icon) return;

      const cardSpring = new Spring(SPRING_CONFIG_CARD);
      
      // Initialize card and icon with correct starting values
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

      // Update grid Y position
      const gridProgress = getGridScrollProgress(grid);
      gridSpring.setTarget(gridProgress);
      const gridSmoothProgress = gridSpring.update(deltaTime);
      
      // Grid Y: [0, 1] -> [30, -60]
      const gridY = transformProgress(gridSmoothProgress, [0, 1], [30, -60]);
      grid.style.transform = `translateY(${gridY}px)`;

      // Update individual cards
      cardSprings.forEach(({ spring, icon, card }) => {
        const cardProgress = getCardScrollProgress(card);
        spring.setTarget(cardProgress);
        const cardSmoothProgress = spring.update(deltaTime);
        
        // Icon scale: [0, 1] -> [0, 1]
        const iconScale = transformProgress(cardSmoothProgress, [0, 1], [0, 1]);
        
        // Icon opacity: [0, 0.3] -> [0, 1] (clamped)
        const iconOpacity = transformProgress(cardSmoothProgress, [0, 0.3], [0, 1], true);
        
        // Card opacity: [0, 0.5] -> [0, 1] (clamped)
        const cardOpacity = transformProgress(cardSmoothProgress, [0, 0.5], [0, 1], true);
        
        // Card Y: [0, 0.5] -> [30, 0] (clamped)
        const cardY = transformProgress(cardSmoothProgress, [0, 0.5], [30, 0], true);

        icon.style.transform = `scale(${iconScale})`;
        icon.style.opacity = iconOpacity;
        card.style.opacity = cardOpacity;
        card.style.transform = `translateY(${cardY}px)`;

        if (Math.abs(spring.getValue() - cardProgress) > 0.001) {
          needsUpdate = true;
        }
      });

      if (Math.abs(gridSpring.getValue() - gridProgress) > 0.001 || needsUpdate) {
        animationFrameId = requestAnimationFrame(updateGrid);
      } else {
        animationFrameId = null;
      }
    }

    function onScroll() {
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(updateGrid);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
  }

  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initMobileSlider();
      initDesktopGrid();
    });
  } else {
    initMobileSlider();
    initDesktopGrid();
  }
})();
