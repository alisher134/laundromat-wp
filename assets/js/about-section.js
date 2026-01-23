// AboutSection slider initialization
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
      initSlider();
      setupButtons();
    });
  } else {
    initSlider();
    setupButtons();
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
