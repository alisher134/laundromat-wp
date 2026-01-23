(function () {
  const locations = [
    {
      id: 0,
      key: 'location-1',
      title: 'Ethniki Palaiokastritsas, Kerkira 491 00, Greece',
      storeHours: 'Mon-Sun 7am - 11pm',
    },
    {
      id: 1,
      key: 'location-2',
      title: 'Emergency Assistance of Kyklades S.A',
      storeHours: 'Mon-Sun 7am - 11pm',
    },
    {
      id: 2,
      key: 'location-3',
      title: 'Ethniki Palaiokastritsas, Kerkira 491 00, Greece',
      storeHours: 'Mon-Sun 7am - 11pm',
    },
  ];

  const LOCATIONS_POSITIONS = {
    mobile: [
      { id: 0, top: '21%', left: '47%' },
      { id: 1, top: '32%', left: '54%' },
      { id: 2, top: '45%', left: '55%' },
    ],
    desktop: [
      { id: 0, top: '21%', left: '36%' },
      { id: 1, top: '32%', left: '42%' },
      { id: 2, top: '45%', left: '34%' },
    ],
  };

  let activeLocationIndex = null;
  let sliderInstance = null;
  let mapSpring = null;
  let markersOpacitySpring = null;
  let lastTime = performance.now();
  let animationFrameId = null;

  function initMapAnimation() {
    const mapContainer = document.getElementById('location-map-container');
    if (!mapContainer) return;

    const desktopMap = document.getElementById('location-map-desktop');
    if (!desktopMap) return;

    mapSpring = new Spring(SPRING_CONFIGS.LOCATION);
    markersOpacitySpring = new Spring(SPRING_CONFIGS.LOCATION);
    
    mapSpring.current = 0;
    mapSpring.target = 0;
    markersOpacitySpring.current = 0;
    markersOpacitySpring.target = 0;
    
    const initialMapY = 150;
    const width = window.innerWidth;
    let baseTranslateX = 0;
    let baseTranslateY = 0;
    
    if (width >= 1536) {
      baseTranslateX = 800;
      baseTranslateY = 0;
    } else if (width >= 1280) {
      baseTranslateX = 503;
      baseTranslateY = -50;
    } else if (width >= 1024) {
      baseTranslateX = 183;
      baseTranslateY = -100;
    } else if (width >= 768) {
      baseTranslateX = 53;
      baseTranslateY = -100;
    } else {
      baseTranslateX = -50;
      baseTranslateY = 0;
    }
    
    desktopMap.style.transform = `translateX(${baseTranslateX}px) translateY(${baseTranslateY + initialMapY}px)`;
    
    const desktopMarkers = document.querySelectorAll('#location-map-desktop .location-marker');
    desktopMarkers.forEach((marker) => {
      marker.style.opacity = '0';
    });

    function updateMapAnimation() {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      const mapProgress = getMapScrollProgress(mapContainer);
      mapSpring.setTarget(mapProgress);
      markersOpacitySpring.setTarget(mapProgress);
      
      const smoothMapProgress = mapSpring.update(deltaTime);
      const smoothMarkersProgress = markersOpacitySpring.update(deltaTime);
      
      const mapY = transformProgress(smoothMapProgress, [0, 1], [150, 0]);
      const markersOpacity = transformProgress(smoothMarkersProgress, [0.95, 1], [0, 1], true);
      
      // Apply map Y transform
      // In Next.js, Framer Motion applies y as translateY() which is added to existing transforms
      // Base transforms from Next.js: -translate-x-[50px] md:translate-x-[53px] md:translate-y-[-100px] lg:translate-x-[183px] lg:translate-y-[-100px] xl:translate-x-[503px] xl:translate-y-[-50px] 2xl:translate-x-[800px]
      // We apply all transforms via inline styles to match exactly
      
      const width = window.innerWidth;
      let baseTranslateX = 0;
      let baseTranslateY = 0;
      
      if (width >= 1536) {
        baseTranslateX = 800;
        baseTranslateY = 0;
      } else if (width >= 1280) {
        baseTranslateX = 503;
        baseTranslateY = -50;
      } else if (width >= 1024) {
        baseTranslateX = 183;
        baseTranslateY = -100;
      } else if (width >= 768) {
        baseTranslateX = 53;
        baseTranslateY = -100;
      } else {
        baseTranslateX = -50;
        baseTranslateY = 0;
      }
      
      desktopMap.style.transform = `translateX(${baseTranslateX}px) translateY(${baseTranslateY + mapY}px)`;
      
      const desktopMarkers = document.querySelectorAll('#location-map-desktop .location-marker');
      desktopMarkers.forEach((marker) => {
        marker.style.opacity = markersOpacity;
      });

      const mapSpringValue = mapSpring.getValue();
      const mapSpringVelocity = mapSpring.velocity;
      const markersSpringValue = markersOpacitySpring.getValue();
      const markersSpringVelocity = markersOpacitySpring.velocity;
      
      const needsUpdate = 
        Math.abs(mapSpringValue - mapProgress) > 0.001 ||
        Math.abs(mapSpringVelocity) > 0.001 ||
        Math.abs(markersSpringValue - mapProgress) > 0.001 ||
        Math.abs(markersSpringVelocity) > 0.001;

      if (needsUpdate) {
        animationFrameId = requestAnimationFrame(updateMapAnimation);
      } else {
        animationFrameId = null;
      }
    }

    function onScroll() {
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(updateMapAnimation);
      }
    }
    
    function onResize() {
      lastTime = performance.now();
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(updateMapAnimation);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    onScroll();
  }

  // Initialize mobile slider
  function initMobileSlider() {
    const sliderEl = document.getElementById('location-slider');
    if (!sliderEl || typeof KeenSlider === 'undefined') return;

    sliderInstance = new KeenSlider('#location-slider', {
      loop: false,
      mode: 'free',
      rtl: false,
      rubberband: true,
      slides: {
        perView: 'auto',
        spacing: 8,
        origin: 0,
      },
    });

    const prevBtn = document.getElementById('location-prev-btn');
    const nextBtn = document.getElementById('location-next-btn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => sliderInstance.prev());
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => sliderInstance.next());
    }

    // Update buttons state
    function updateButtons() {
      if (!sliderInstance) return;
      const track = sliderInstance.track.details;
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

    // Sync slider position with active location
    function syncSliderWithActiveLocation() {
      if (!sliderInstance) return;
      const track = sliderInstance.track.details;
      if (!track) return;
      
      const currentSlideIndex = track.rel;
      if (activeLocationIndex !== currentSlideIndex) {
        activeLocationIndex = currentSlideIndex;
        updateActiveCards();
        updateStaticMarkers();
      }
    }

    sliderInstance.on('slideChanged', () => {
      updateButtons();
      syncSliderWithActiveLocation();
    });
    sliderInstance.on('created', () => {
      updateButtons();
      syncSliderWithActiveLocation();
    });
    updateButtons();
  }

  // Update active cards
  function updateActiveCards() {
    const allCards = document.querySelectorAll('.location-slide');
    allCards.forEach((card) => {
      const cardIndex = parseInt(card.getAttribute('data-location-index'));
      const isActive = activeLocationIndex === cardIndex;
      const title = card.querySelector('.location-title');
      
      if (isActive) {
        card.classList.add('border-brand');
        card.classList.remove('border-text/16');
        if (title) {
          title.classList.add('text-brand');
          title.classList.remove('text-text');
        }
      } else {
        card.classList.remove('border-brand');
        card.classList.add('border-text/16');
        if (title) {
          title.classList.remove('text-brand');
          title.classList.add('text-text');
        }
      }
    });
  }

  // Update static markers (for preview map)
  function updateStaticMarkers() {
    const mobileMarkers = document.querySelectorAll('#location-map-container > div:not([id]) .location-marker');
    const desktopMarkers = document.querySelectorAll('#location-map-desktop .location-marker');
    
    [...mobileMarkers, ...desktopMarkers].forEach((marker) => {
      const markerId = parseInt(marker.getAttribute('data-location-id'));
      const isActive = activeLocationIndex === markerId;
      
      const outlineIcon = marker.querySelector('.location-marker-outline');
      const filledIcon = marker.querySelector('.location-marker-filled');
      
      if (isActive) {
        if (outlineIcon) outlineIcon.style.display = 'none';
        if (filledIcon) filledIcon.style.display = 'block';
      } else {
        if (outlineIcon) outlineIcon.style.display = 'block';
        if (filledIcon) filledIcon.style.display = 'none';
      }
    });
  }

  // Handle location select
  function handleLocationSelect(index, shouldMoveSlider = false) {
    if (activeLocationIndex === index) return;
    activeLocationIndex = index;
    
    updateActiveCards();
    updateStaticMarkers();
    
    if (shouldMoveSlider && sliderInstance) {
      sliderInstance.moveToIdx(index);
    }
  }

  // Initialize click handlers
  function initClickHandlers() {
    // Desktop cards
    const desktopCards = document.querySelectorAll('.location-slide');
    desktopCards.forEach((card) => {
      card.addEventListener('click', () => {
        const cardIndex = parseInt(card.getAttribute('data-location-index'));
        handleLocationSelect(cardIndex, false);
      });
    });

    // Map markers
    const markers = document.querySelectorAll('.location-marker');
    markers.forEach((marker) => {
      marker.addEventListener('click', () => {
        const markerId = parseInt(marker.getAttribute('data-location-id'));
        handleLocationSelect(markerId, true);
      });
    });
  }

  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initMobileSlider();
      initMapAnimation();
      initClickHandlers();
    });
  } else {
    initMobileSlider();
    initMapAnimation();
    initClickHandlers();
  }
})();
