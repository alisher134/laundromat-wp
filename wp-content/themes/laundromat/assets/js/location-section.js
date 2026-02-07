(function () {
  // Locations data - loaded from API (start empty)
  let locations = [];

  // Positions - loaded from API (start empty, fallback handled in updateMarkerPositions)
  let LOCATIONS_POSITIONS = {
    mobile: [],
    desktop: [],
  };

  // Load locations from API
  async function loadLocationsFromAPI() {
    if (typeof LaundroAPI === 'undefined') {
      console.log('[Locations] LaundroAPI not available, cannot load data');
      return;
    }

    try {
      console.log('[Locations] Loading data from WordPress API...');

      const [apiLocations, apiPositions] = await Promise.all([
        LaundroAPI.getLocations(),
        LaundroAPI.getLocationPositions(),
      ]);

      if (apiLocations && apiLocations.length > 0) {
        locations = apiLocations;
        console.log('[Locations] Loaded', apiLocations.length, 'locations from API');
      }

      if (apiPositions && apiPositions.mobile && apiPositions.desktop) {
        LOCATIONS_POSITIONS = apiPositions;
        console.log('[Locations] Loaded positions from API');
      }

      // Render cards and markers (after both locations and positions are loaded)
      if (locations.length > 0) {
        updateLocationCards();
        updateMapMarkers();
      }
    } catch (error) {
      console.error('[Locations] Failed to load from API:', error);
    }
  }

  // Dynamically render map markers from API data
  function updateMapMarkers() {
    function updateGroup(parentSelector, isDesktop) {
      const parent = document.querySelector(parentSelector);
      if (!parent) return;

      const img = parent.querySelector('img');
      if (!img) return;

      // Wait for image to load to get dimensions
      if (!img.complete || img.naturalWidth === 0) {
        img.onload = () => updateMapMarkers();
        return;
      }

      // 1. Calculate the actual visible area of the image (object-fit: contain logic)
      const containerRect = parent.getBoundingClientRect();
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const containerRatio = containerRect.width / containerRect.height;

      let actualWidth, actualHeight, offsetLeft, offsetTop;

      if (containerRatio > imgRatio) {
        // Limited by height
        actualHeight = containerRect.height;
        actualWidth = actualHeight * imgRatio;
        offsetLeft = (containerRect.width - actualWidth) / 2;
        offsetTop = 0;
      } else {
        // Limited by width
        actualWidth = containerRect.width;
        actualHeight = actualWidth / imgRatio;
        offsetLeft = 0;
        offsetTop = (containerRect.height - actualHeight) / 2;
      }

      // 2. Create or get the wrapper that matches the image dimensions exactly
      let wrapper = parent.querySelector('.marker-container-wrapper');
      if (!wrapper) {
        // Clean up any old markers that might be directly in the parent
        parent.querySelectorAll(':scope > .location-marker').forEach((m) => m.remove());

        wrapper = document.createElement('div');
        wrapper.className = 'marker-container-wrapper absolute z-10 pointer-events-none';
        parent.appendChild(wrapper);
      }

      // Update wrapper to match image visual bounds
      Object.assign(wrapper.style, {
        left: offsetLeft + 'px',
        top: offsetTop + 'px',
        width: actualWidth + 'px',
        height: actualHeight + 'px',
        position: 'absolute',
      });

      // 3. Render markers with percentage positions relative to the wrapper (the actual image)
      const positions = isDesktop ? LOCATIONS_POSITIONS.desktop : LOCATIONS_POSITIONS.mobile;

      const markersHTML = locations
        .map((location, index) => {
          const position = positions.find((p) => p.id === location.id) || { top: '0%', left: '0%' };
          // For desktop, markers start hidden and are shown by initMapAnimation
          const initialOpacity = isDesktop ? '0' : '1';

          return `
          <a
            href="${location.googleMapsUrl || '#'}"
            target="_blank"
            rel="noopener noreferrer"
            class="location-marker absolute z-10 flex -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center transition-transform hover:scale-110"
            style="top: ${position.top}; left: ${position.left}; pointer-events: auto; opacity: ${initialOpacity};"
            data-location-index="${index}"
          >
            <svg width="18" height="18" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg" class="location-marker-outline">
              <rect x="0.75" y="0.75" width="23.5" height="23.5" rx="11.75" stroke="#3A6D90" stroke-width="1.5" />
              <path d="M9 15.4438C9.76384 16.315 10.8294 16.8632 11.9814 16.9777C13.1333 17.0921 14.2857 16.7642 15.2055 16.0602C16.1253 15.3563 16.744 14.3288 16.9364 13.1855C17.1289 12.0422 16.8807 10.8683 16.2421 9.90124M15.7658 9.29721C15.1778 8.66849 14.4245 8.21884 13.5926 8" stroke="#3A6D90" stroke-width="1.5" />
            </svg>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" class="location-marker-filled text-brand" style="display: none">
              <rect width="18" height="18" rx="9" fill="currentColor" />
              <path d="M6.40332 10.9878C6.94676 11.6077 7.70489 11.9977 8.52446 12.0791C9.34402 12.1605 10.1639 11.9272 10.8183 11.4264C11.4727 10.9256 11.9129 10.1946 12.0498 9.38114C12.1867 8.56773 12.0101 7.73258 11.5558 7.04454M11.2169 6.6148C10.7986 6.1675 10.2626 5.84759 9.67075 5.69189" stroke="white" stroke-width="1.06719" />
            </svg>
          </a>
        `;
        })
        .join('');

      wrapper.innerHTML = markersHTML;
    }

    // Update Mobile
    updateGroup('#location-map-container > div:first-child', false);

    // Update Desktop
    updateGroup('#location-map-desktop', true);
  }

  // Dynamically render location cards from API data
  function updateLocationCards() {
    const sliderContainer = document.getElementById('location-slider');
    if (!sliderContainer || locations.length === 0) return;

    // Generate HTML for all location cards
    const cardsHTML = locations
      .map(
        (location, index) => `
      <div
        class="location-slide keen-slider__slide group hover:border-brand rounded-card border-text/16 max-w-[306px] shrink-0 cursor-pointer border bg-white/10 px-[20px] py-4 backdrop-blur-[30px] transition-colors duration-200 md:max-w-[306px] 2xl:max-w-[430px] 2xl:rounded-[16px] 2xl:p-6"
        data-location-index="${index}"
      >
        <div class="mb-[31px] flex items-center justify-between md:mb-[27px] 2xl:mb-[41px]">
          <h2
            class="location-title text-text group-hover:text-brand max-w-[184px] text-base leading-[132%] font-normal tracking-[-0.01em] transition-colors duration-200 md:text-sm xl:text-sm 2xl:max-w-[307px] 2xl:text-lg 2xl:leading-[132%] 2xl:tracking-[-0.01em]"
          >
            ${location.title}
          </h2>
          <a
            href="${location.googleMapsUrl || '#'}"
            target="_blank"
            rel="noopener noreferrer"
            class="bg-brand/6 hover:bg-brand/12 flex size-[33px] items-center justify-center rounded-[6px] transition-colors 2xl:size-[42px]"
            onclick="event.stopPropagation()"
          >
            <svg
              aria-hidden="true"
              class="text-brand size-4 2xl:size-[22px]"
              viewBox="0 0 23 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.1563 19.0809H8.8078C7.63992 19.0809 6.51987 18.6169 5.69405 17.7911C4.86824 16.9653 4.4043 15.8453 4.4043 14.6774C4.4043 13.5095 4.86824 12.3895 5.69405 11.5636C6.51987 10.7378 7.63992 10.2739 8.8078 10.2739H13.5049C14.2056 10.2739 14.8776 9.99551 15.3731 9.50002C15.8686 9.00453 16.147 8.3325 16.147 7.63178C16.147 6.93105 15.8686 6.25902 15.3731 5.76353C14.8776 5.26804 14.2056 4.98967 13.5049 4.98967H11.1563C10.9228 4.98967 10.6988 4.89689 10.5336 4.73172C10.3684 4.56656 10.2756 4.34255 10.2756 4.10897C10.2756 3.8754 10.3684 3.65139 10.5336 3.48622C10.6988 3.32106 10.9228 3.22827 11.1563 3.22827H13.5049C14.6728 3.22827 15.7928 3.69221 16.6186 4.51803C17.4444 5.34385 17.9084 6.46389 17.9084 7.63178C17.9084 8.79966 17.4444 9.91971 16.6186 10.7455C15.7928 11.5713 14.6728 12.0353 13.5049 12.0353H8.8078C8.10707 12.0353 7.43504 12.3136 6.93955 12.8091C6.44406 13.3046 6.1657 13.9767 6.1657 14.6774C6.1657 15.3781 6.44406 16.0501 6.93955 16.5456C7.43504 17.0411 8.10707 17.3195 8.8078 17.3195H11.1563C11.3899 17.3195 11.6139 17.4123 11.7791 17.5774C11.9442 17.7426 12.037 17.9666 12.037 18.2002C12.037 18.4338 11.9442 18.6578 11.7791 18.8229C11.6139 18.9881 11.3899 19.0809 11.1563 19.0809Z"
                fill="currentColor"
              />
              <path
                d="M4.10994 0C3.01991 0 1.97454 0.43301 1.20377 1.20377C0.43301 1.97454 0 3.01991 0 4.10994C0 6.50192 2.13717 7.91339 3.55216 8.84811L3.78701 9.00194C3.88337 9.06606 3.99654 9.10027 4.11229 9.10027C4.22803 9.10027 4.3412 9.06606 4.43756 9.00194L4.67241 8.84811C6.08271 7.91339 8.21988 6.50192 8.21988 4.10994C8.21988 3.01991 7.78686 1.97454 7.0161 1.20377C6.24534 0.43301 5.19996 0 4.10994 0Z"
                fill="currentColor"
                fill-opacity="0.2"
              />
              <path
                d="M4.13328 5.28515C3.82184 5.28671 3.52255 5.16448 3.30123 4.94537C3.07991 4.72625 2.9547 4.42819 2.95314 4.11675C2.95158 3.80532 3.07381 3.50602 3.29292 3.2847C3.51204 3.06338 3.8101 2.93817 4.12154 2.93661H4.13328C4.44471 2.93661 4.74339 3.06033 4.96361 3.28055C5.18383 3.50077 5.30755 3.79945 5.30755 4.11088C5.30755 4.42232 5.18383 4.721 4.96361 4.94122C4.74339 5.16143 4.44471 5.28515 4.13328 5.28515Z"
                fill="currentColor"
              />
              <path
                d="M18.2017 13.2105C17.1117 13.2105 16.0663 13.6435 15.2956 14.4143C14.5248 15.185 14.0918 16.2304 14.0918 17.3204C14.0918 19.7124 16.229 21.1239 17.644 22.0586L17.8788 22.2124C17.9752 22.2766 18.0883 22.3108 18.2041 22.3108C18.3198 22.3108 18.433 22.2766 18.5294 22.2124L18.7642 22.0586C20.1733 21.1192 22.3164 19.7101 22.3164 17.3204C22.3164 16.7803 22.2099 16.2455 22.0031 15.7466C21.7962 15.2476 21.4931 14.7943 21.1109 14.4126C20.7288 14.0309 20.2752 13.7283 19.776 13.522C19.2768 13.3157 18.7419 13.2099 18.2017 13.2105Z"
                fill="currentColor"
                fill-opacity="0.2"
              />
              <path
                d="M18.2251 18.4957C18.0709 18.4964 17.918 18.4668 17.7753 18.4085C17.6325 18.3502 17.5026 18.2644 17.393 18.1559C17.2834 18.0474 17.1963 17.9184 17.1366 17.7762C17.0768 17.634 17.0457 17.4815 17.0449 17.3273C17.0442 17.1731 17.0738 17.0202 17.1321 16.8774C17.1904 16.7347 17.2762 16.6048 17.3847 16.4952C17.4932 16.3856 17.6222 16.2985 17.7644 16.2388C17.9066 16.179 18.0591 16.1479 18.2133 16.1471H18.2251C18.5365 16.1471 18.8352 16.2708 19.0554 16.4911C19.2756 16.7113 19.3993 17.01 19.3993 17.3214C19.3993 17.6328 19.2756 17.9315 19.0554 18.1517C18.8352 18.3719 18.5365 18.4957 18.2251 18.4957Z"
                fill="currentColor"
              />
            </svg>
          </a>
        </div>
        <div class="flex items-center justify-between">
          <div class="space-y-[4px] 2xl:space-y-[6px]">
            <p class="text-text/60 paragraph-sm-default md:text-xs xl:text-xs 2xl:text-base">Store hours</p>
            <p class="store-hours text-text text-base leading-[132%] font-normal tracking-[-0.01em] md:text-sm xl:text-xs 2xl:text-base">
              ${location.storeHours}
            </p>
          </div>
        </div>
      </div>
    `,
      )
      .join('');

    // Replace slider content
    sliderContainer.innerHTML = cardsHTML;
  }

  // Update marker positions based on API data (regenerate on resize)
  function updateMarkerPositions() {
    // If no positions loaded, don't update
    if (!LOCATIONS_POSITIONS.mobile || !LOCATIONS_POSITIONS.desktop) return;
    if (locations.length === 0) return;

    // Regenerate markers with correct positions for current screen size
    updateMapMarkers();
  }

  let activeLocationIndex = null;
  let sliderInstance = null;
  let mapSpring = null;
  let markersOpacitySpring = null;
  let lastTime = performance.now();
  let animationFrameId = null;
  let mapAnimationScrollListenersAdded = false;

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
      if (!document.contains(mapContainer) || !document.contains(desktopMap)) {
        animationFrameId = null;
        return;
      }
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      const mapProgress = getMapScrollProgress(mapContainer);
      mapSpring.setTarget(mapProgress);
      markersOpacitySpring.setTarget(mapProgress);

      const smoothMapProgress = mapSpring.update(deltaTime);
      const smoothMarkersProgress = markersOpacitySpring.update(deltaTime);

      const mapY = transformProgress(smoothMapProgress, [0, 1], [150, 0]);
      const markersOpacity = transformProgress(smoothMarkersProgress, [0.4, 0.7], [0, 1], true);

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

    if (!mapAnimationScrollListenersAdded) {
      mapAnimationScrollListenersAdded = true;
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onResize, { passive: true });
    }
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
      const markerIndex = parseInt(marker.getAttribute('data-location-index'));
      const isActive = activeLocationIndex === markerIndex;

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
    // Desktop cards (slider items) & Mobile Cards - handle via Event Delegation on the slider container
    const sliderContainer = document.getElementById('location-slider');
    if (sliderContainer) {
      sliderContainer.addEventListener('click', (e) => {
        const card = e.target.closest('.location-slide');
        if (card) {
          const index = parseInt(card.getAttribute('data-location-index'));
          handleLocationSelect(index, false);
        }
      });
    }

    // Map markers click handlers removed - now handled by <a> tags directly for navigation only
  }

  // Initialize all components
  async function initAll() {
    initMapAnimation();

    // Load data from API FIRST
    await loadLocationsFromAPI();

    // THEN initialize slider (after cards are rendered)
    initMobileSlider();
    initClickHandlers();

    // Listen for window resize to update marker positions
    window.addEventListener('resize', updateMarkerPositions);
  }

  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
