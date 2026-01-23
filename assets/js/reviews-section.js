(function () {

  let mobileSliderInstance = null;

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

  function initDesktopGrid() {
    const grid = document.getElementById('reviews-grid');
    if (!grid) return;

    const cards = grid.querySelectorAll('.review-card');
    if (cards.length === 0) return;

    const gridSpring = new Spring(SPRING_CONFIGS.REVIEWS_GRID);
    
    const cardSprings = new Map();
    let lastTime = performance.now();
    let animationFrameId = null;

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
