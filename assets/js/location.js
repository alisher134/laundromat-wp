// LocationSection initialization
(function () {
  const SPRING_CONFIG = { stiffness: 80, damping: 25, mass: 0.8 };

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

  // --- Data ---
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

  // Calculate scroll progress for map container
  // Framer Motion offset: ['start end', 'start 0.3']
  // 'start end' = container start at viewport end (progress = 0)
  // 'start 0.3' = container start at 30% of viewport height (progress = 1)
  function getMapScrollProgress(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const elementTop = rect.top;
    
    // When element start is at viewport bottom: progress = 0
    // When element start is at 30% of viewport height: progress = 1
    const startPoint = windowHeight; // elementTop when progress = 0
    const endPoint = windowHeight * 0.3; // elementTop when progress = 1
    
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

  // Initialize map animations
  function initMapAnimation() {
    const mapContainer = document.getElementById('location-map-container');
    if (!mapContainer) return;

    const desktopMap = document.getElementById('location-map-desktop');
    if (!desktopMap) return;

    mapSpring = new Spring(SPRING_CONFIG);
    markersOpacitySpring = new Spring(SPRING_CONFIG);
    
    // Set initial values (mapY starts at 150, markers opacity starts at 0)
    mapSpring.current = 0; // progress starts at 0
    mapSpring.target = 0;
    markersOpacitySpring.current = 0;
    markersOpacitySpring.target = 0;
    
    // Apply initial transform
    const initialMapY = 150; // mapY = [150, 0] when progress = [0, 1]
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
    
    // Set initial markers opacity
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
      
      // Map Y: [0, 1] -> [150, 0]
      const mapY = transformProgress(smoothMapProgress, [0, 1], [150, 0]);
      
      // Markers opacity: [0.95, 1] -> [0, 1]
      const markersOpacity = transformProgress(smoothMarkersProgress, [0.95, 1], [0, 1], true);
      
      // Apply map Y transform
      // In Next.js, Framer Motion applies y as translateY() which is added to existing transforms
      // Base transforms from Next.js: -translate-x-[50px] md:translate-x-[53px] md:translate-y-[-100px] lg:translate-x-[183px] lg:translate-y-[-100px] xl:translate-x-[503px] xl:translate-y-[-50px] 2xl:translate-x-[800px]
      // We apply all transforms via inline styles to match exactly
      
      const width = window.innerWidth;
      let baseTranslateX = 0;
      let baseTranslateY = 0;
      
      // Match Next.js breakpoints: 2xl (1536px), xl (1280px), lg (1024px), md (768px)
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
      
      // Apply base transform + mapY (Framer Motion adds y on top of existing transforms)
      // mapY starts at 150 and goes to 0, so we add it to baseTranslateY
      desktopMap.style.transform = `translateX(${baseTranslateX}px) translateY(${baseTranslateY + mapY}px)`;
      
      // Apply markers opacity
      const desktopMarkers = document.querySelectorAll('#location-map-desktop .location-marker');
      desktopMarkers.forEach((marker) => {
        marker.style.opacity = markersOpacity;
      });

      const needsUpdate = 
        Math.abs(mapSpring.getValue() - mapProgress) > 0.001 ||
        Math.abs(markersOpacitySpring.getValue() - mapProgress) > 0.001;

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
      // Recalculate base transform on resize
      const mapProgress = getMapScrollProgress(mapContainer);
      mapSpring.setTarget(mapProgress);
      markersOpacitySpring.setTarget(mapProgress);
      onScroll();
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
      }
      if (nextBtn) {
        nextBtn.disabled = track.rel === track.slides.length - 1;
        nextBtn.setAttribute('aria-disabled', track.rel === track.slides.length - 1);
      }
    }

    sliderInstance.on('slideChanged', updateButtons);
    sliderInstance.on('created', updateButtons);
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
  function handleLocationSelect(index) {
    if (activeLocationIndex === index) return;
    activeLocationIndex = index;
    
    updateActiveCards();
    updateStaticMarkers();
  }

  // Initialize click handlers
  function initClickHandlers() {
    // Desktop cards
    const desktopCards = document.querySelectorAll('.location-slide');
    desktopCards.forEach((card) => {
      card.addEventListener('click', () => {
        const cardIndex = parseInt(card.getAttribute('data-location-index'));
        handleLocationSelect(cardIndex);
      });
    });

    // Map markers
    const markers = document.querySelectorAll('.location-marker');
    markers.forEach((marker) => {
      marker.addEventListener('click', () => {
        const markerId = parseInt(marker.getAttribute('data-location-id'));
        handleLocationSelect(markerId);
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
