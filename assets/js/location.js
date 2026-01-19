document.addEventListener('DOMContentLoaded', () => {
  // --- Data ---
  // --- Data ---
  const locations = [
    {
      id: 1,
      key: 'location-1',
      title: 'Ethniki Palaiokastritsas, Kerkira 491 00, Greece',
      phone: '8 800 600 14 41',
      storeHours: 'Mon-Sun 7am - 11pm',
      geo: { lat: 39.6243, lng: 19.9217 },
    },
    {
      id: 2,
      key: 'location-2',
      title: 'Emergency Assistance of Kyklades S.A',
      phone: '8 800 600 14 41',
      storeHours: 'Mon-Sun 7am - 11pm',
      geo: { lat: 37.9838, lng: 23.7275 },
    },
    {
      id: 3,
      key: 'location-3',
      title: 'Ethniki Palaiokastritsas, Kerkira 491 00, Greece',
      phone: '8 800 600 14 41',
      storeHours: 'Mon-Sun 7am - 11pm',
      geo: { lat: 39.6243, lng: 19.9217 },
    },
  ];

  let activeLocationId = null;
  let map = null;
  let markers = [];
  let sliderInstance = null;

  // --- Animation Observer ---
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('translate-y-[100px]', 'translate-y-[150px]', 'translate-y-[80px]', 'opacity-0');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Animate Elements
  const title = document.getElementById('location-title');
  const mapContainer = document.getElementById('map-container');
  const desktopList = document.getElementById('locations-desktop');
  const mobileSliderWrapper = document.getElementById('locations-mobile');

  if (title) observer.observe(title);
  if (mapContainer) observer.observe(mapContainer);
  if (desktopList) observer.observe(desktopList);
  if (mobileSliderWrapper) observer.observe(mobileSliderWrapper);

  // --- Helper: Render Location Card ---
  function createLocationCardStr(loc, isActive, isSlide = false) {
    const activeClass = isActive ? 'bg-[#488EBE]/10' : 'bg-white';
    const slideClass = isSlide ? 'keen-slider__slide' : '';
    // Structure matches LocationCard.tsx with Tailwind classes
    return `
      <div 
        class="${slideClass} rounded-card max-w-[328px] shrink-0 cursor-pointer px-[20px] py-4 transition-colors duration-300 md:max-w-[360px] xl:max-w-[425px] 2xl:max-w-[605px] 2xl:rounded-[16px] 2xl:p-6 ${activeClass}"
        data-id="${loc.id}"
      >
        <div class="mb-[31px] flex items-center justify-between md:mb-[27px] xl:mb-[46px] 2xl:mb-[88px] pointer-events-none">
          <h2 class="text-text max-w-[184px] text-base leading-[132%] font-normal tracking-[-0.01em] md:text-sm xl:text-sm 2xl:max-w-[307px] 2xl:text-2xl 2xl:leading-[136%] 2xl:tracking-[-0.02em]">
            ${loc.title}
          </h2>
          <span class="flex size-[33px] items-center justify-center rounded-[6px] bg-white 2xl:size-[42px]">
             <!-- Location Icon -->
             <svg class="size-4 text-[#3A6D90] 2xl:size-[22px]" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.1563 19.0809H8.8078C7.63992 19.0809 6.51987 18.6169 5.69405 17.7911C4.86824 16.9653 4.4043 15.8453 4.4043 14.6774C4.4043 13.5095 4.86824 12.3895 5.69405 11.5636C6.51987 10.7378 7.63992 10.2739 8.8078 10.2739H13.5049C14.2056 10.2739 14.8776 9.99551 15.3731 9.50002C15.8686 9.00453 16.147 8.3325 16.147 7.63178C16.147 6.93105 15.8686 6.25902 15.3731 5.76353C14.8776 5.26804 14.2056 4.98967 13.5049 4.98967H11.1563C10.9228 4.98967 10.6988 4.89689 10.5336 4.73172C10.3684 4.56656 10.2756 4.34255 10.2756 4.10897C10.2756 3.8754 10.3684 3.65139 10.5336 3.48622C10.6988 3.32106 10.9228 3.22827 11.1563 3.22827H13.5049C14.6728 3.22827 15.7928 3.69221 16.6186 4.51803C17.4444 5.34385 17.9084 6.46389 17.9084 7.63178C17.9084 8.79966 17.4444 9.91971 16.6186 10.7455C15.7928 11.5713 14.6728 12.0353 13.5049 12.0353H8.8078C8.10707 12.0353 7.43504 12.3136 6.93955 12.8091C6.44406 13.3046 6.1657 13.9767 6.1657 14.6774C6.1657 15.3781 6.44406 16.0501 6.93955 16.5456C7.43504 17.0411 8.10707 17.3195 8.8078 17.3195H11.1563C11.3899 17.3195 11.6139 17.4123 11.7791 17.5774C11.9442 17.7426 12.037 17.9666 12.037 18.2002C12.037 18.4338 11.9442 18.6578 11.7791 18.8229C11.6139 18.9881 11.3899 19.0809 11.1563 19.0809Z" fill="currentColor"/>
                <path d="M4.10994 0C3.01991 0 1.97454 0.43301 1.20377 1.20377C0.43301 1.97454 0 3.01991 0 4.10994C0 6.50192 2.13717 7.91339 3.55216 8.84811L3.78701 9.00194C3.88337 9.06606 3.99654 9.10027 4.11229 9.10027C4.22803 9.10027 4.3412 9.06606 4.43756 9.00194L4.67241 8.84811C6.08271 7.91339 8.21988 6.50192 8.21988 4.10994C8.21988 3.01991 7.78686 1.97454 7.0161 1.20377C6.24534 0.43301 5.19996 0 4.10994 0Z" fill="currentColor" fill-opacity="0.2"/>
                <path d="M4.13328 5.28515C3.82184 5.28671 3.52255 5.16448 3.30123 4.94537C3.07991 4.72625 2.9547 4.42819 2.95314 4.11675C2.95158 3.80532 3.07381 3.50602 3.29292 3.2847C3.51204 3.06033 3.8101 2.93817 4.12154 2.93661H4.13328C4.44471 2.93661 4.74339 3.06033 4.96361 3.28055C5.18383 3.50077 5.30755 3.79945 5.30755 4.11088C5.30755 4.42232 5.18383 4.721 4.96361 4.94122C4.74339 5.16143 4.44471 5.28515 4.13328 5.28515Z" fill="currentColor"/>
                <path d="M18.2017 13.2105C17.1117 13.2105 16.0663 13.6435 15.2956 14.4143C14.5248 15.185 14.0918 16.2304 14.0918 17.3204C14.0918 19.7124 16.229 21.1239 17.644 22.0586L17.8788 22.2124C17.9752 22.2766 18.0883 22.3108 18.2041 22.3108C18.3198 22.3108 18.433 22.2766 18.5294 22.2124L18.7642 22.0586C20.1733 21.1192 22.3164 19.7101 22.3164 17.3204C22.3164 16.7803 22.2099 16.2455 22.0031 15.7466C21.7962 15.2476 21.4931 14.7943 21.1109 14.4126C20.7288 14.0309 20.2752 13.7283 19.776 13.522C19.2768 13.3157 18.7419 13.2099 18.2017 13.2105Z" fill="currentColor" fill-opacity="0.2"/>
                <path d="M18.2251 18.4957C18.0709 18.4964 17.918 18.4668 17.7753 18.4085C17.6325 18.3502 17.5026 18.2644 17.393 18.1559C17.2834 18.0474 17.1963 17.9184 17.1366 17.7762C17.0768 17.634 17.0457 17.4815 17.0449 17.3273C17.0442 17.1731 17.0738 17.0202 17.1321 16.8774C17.1904 16.7347 17.2762 16.6048 17.3847 16.4952C17.4932 16.3856 17.6222 16.2985 17.7644 16.2388C17.9066 16.179 18.0591 16.1479 18.2133 16.1471H18.2251C18.5365 16.1471 18.8352 16.2708 19.0554 16.4911C19.2756 16.7113 19.3993 17.01 19.3993 17.3214C19.3993 17.6328 19.2756 17.9315 19.0554 18.1517C18.8352 18.3719 18.5365 18.4957 18.2251 18.4957Z" fill="currentColor"/>
             </svg>
          </span>
        </div>

        <div class="flex items-center justify-between pointer-events-none">
          <div class="space-y-[4px] 2xl:space-y-[6px]">
            <p class="paragraph-sm-default text-text/60 md:text-xs xl:text-xs 2xl:text-lg">Store hours</p>
            <p class="text-text text-base leading-[132%] font-normal tracking-[-0.01em] md:text-sm xl:text-xs 2xl:text-lg">
              ${loc.storeHours}
            </p>
          </div>
          <div class="space-y-[4px]">
            <p class="paragraph-sm-default text-text/60 text-right md:text-sm xl:text-xs 2xl:text-lg">
              Phone
            </p>
            <p class="text-text text-base leading-[132%] font-normal tracking-[-0.01em] md:text-sm xl:text-xs 2xl:text-lg">
              ${loc.phone}
            </p>
          </div>
        </div>
      </div>
    `;
  }

  // --- Render Lists ---
  const desktopContainer = document.getElementById('location-list-container');
  const sliderContainer = document.getElementById('keen-slider-locations');

  // Render Desktop List
  if (desktopContainer) {
    desktopContainer.innerHTML = locations.map((loc) => createLocationCardStr(loc, false, false)).join('');

    // Add Click Listeners
    Array.from(desktopContainer.children).forEach((bg) => {
      bg.addEventListener('click', () => {
        handleLocationSelect(parseInt(bg.dataset.id));
      });
    });
  }

  // Render Mobile Slider
  if (sliderContainer) {
    sliderContainer.innerHTML = locations.map((loc) => createLocationCardStr(loc, false, true)).join('');
    // Add Click Listeners logic is handled by slider click if needed, but inner divs have pointer-events for now?
    // Actually the card itself is clickable. I added data-id.

    // Initialize Keen Slider
    if (window.KeenSlider) {
      sliderInstance = new KeenSlider('#keen-slider-locations', {
        slides: {
          perView: 'auto',
          spacing: 8,
        },
        slideChanged(slider) {
          updateSliderButtons(slider);
        },
        created(slider) {
          updateSliderButtons(slider);
        },
      });

      // Add click listeners to slides
      sliderInstance.slides.forEach((slide) => {
        slide.addEventListener('click', () => {
          handleLocationSelect(parseInt(slide.dataset.id));
        });
      });

      // Render Buttons
      const controlsContainer = document.getElementById('slider-controls');
      if (controlsContainer) {
        controlsContainer.innerHTML = `
           <div aria-label="Slider navigation" class="flex items-center gap-[8px]" role="group">
             <button
               id="slider-prev"
               aria-label="Previous slide"
               class="border-brand group hover:bg-brand focus-brand flex size-[40px] cursor-pointer items-center justify-center rounded-[8px] border transition-colors duration-200 disabled:pointer-events-none disabled:opacity-40"
               type="button"
             >
               <svg viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="text-brand size-[10px] group-hover:text-white transition-colors">
                  <path d="M12.0264 6.25L1.02637 6.25M1.02637 6.25L6.16447 0.75M1.02637 6.25L6.16447 11.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
               </svg>
             </button>
             <button
               id="slider-next"
               aria-label="Next slide"
               class="border-brand group hover:bg-brand focus-brand flex size-[40px] cursor-pointer items-center justify-center rounded-[8px] border transition-colors duration-200 disabled:pointer-events-none disabled:opacity-40"
               type="button"
             >
               <svg viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="text-brand size-[10px] group-hover:text-white transition-colors">
                  <path d="M0.5 3.98242L7.56066 4.02154M7.56066 4.02154L4.25395 0.5M7.56066 4.02154L4.25395 7.54308" stroke="currentColor" stroke-linecap="round"/>
               </svg>
             </button>
           </div>
         `;

        document.getElementById('slider-prev').addEventListener('click', () => sliderInstance.prev());
        document.getElementById('slider-next').addEventListener('click', () => sliderInstance.next());
      }
    }
  }

  function updateSliderButtons(slider) {
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    if (!prevBtn || !nextBtn) return;

    const track = slider.track.details;
    if (!track) return;

    prevBtn.disabled = track.rel === 0;
    nextBtn.disabled = track.rel === track.slides.length - 1;
  }

  // --- Interaction Logic ---
  function handleLocationSelect(id) {
    if (activeLocationId === id) return;
    activeLocationId = id;

    // Update Map
    updateMap();

    // Update UI (Highlight active card)
    updateActiveCards();
  }

  function updateActiveCards() {
    const allCards = document.querySelectorAll('[data-id]');
    allCards.forEach((card) => {
      if (parseInt(card.dataset.id) === activeLocationId) {
        card.classList.remove('bg-white');
        card.classList.add('bg-[#488EBE]/10');
      } else {
        card.classList.add('bg-white');
        card.classList.remove('bg-[#488EBE]/10');
      }
    });
  }

  function updateMap() {
    if (!map) return;

    // Pan to active location
    const activeLoc = locations.find((l) => l.id === activeLocationId);
    if (activeLoc) {
      map.panTo(activeLoc.geo);
      map.setZoom(15);
    }

    // Update Markers Icons
    markers.forEach((marker, index) => {
      const isSelected = index + 1 === activeLocationId;
      const iconUrl = isSelected ? './assets/images/marker-active.svg' : './assets/images/marker.svg';
      marker.setIcon({
        url: iconUrl,
        scaledSize: new google.maps.Size(40, 40),
      });
    });
  }

  // --- Google Maps ---
  window.initMap = function () {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    // Use first location as center default
    const center = locations[0].geo;

    const mapOptions = {
      center: center,
      zoom: 12, // Zoomed out a bit initially
      disableDefaultUI: true,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [
        {
          featureType: 'all',
          elementType: 'geometry',
          stylers: [{ saturation: -30 }],
        },
        {
          featureType: 'water',
          elementType: 'geometry.fill',
          stylers: [{ color: '#87BCE0' }],
        },
      ],
    };

    map = new google.maps.Map(mapElement, mapOptions);

    // Create Markers
    locations.forEach((loc, index) => {
      const marker = new google.maps.Marker({
        position: loc.geo,
        map: map,
        icon: {
          url: './assets/images/marker.svg',
          scaledSize: new google.maps.Size(40, 40),
        },
        title: loc.title,
      });

      marker.addListener('click', () => {
        handleLocationSelect(loc.id);
      });

      markers.push(marker);
    });
  };

  // --- Load Map Script ---
  // Placeholder Key - User will need to provide real key
  const API_KEY = 'AIzaSyDL1-M4UBOI_WrsvbEAdCzklSJ_4ZJdB_w';
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=initMap`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
});
