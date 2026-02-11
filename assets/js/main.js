// Main page state management
(function () {
  const preloader = document.getElementById('preloader');
  const heroSection = document.getElementById('hero-section');
  const heroTitle = document.getElementById('hero-title');
  const heroMap = document.getElementById('hero-map');
  const header = document.getElementById('header');

  if (!preloader || !heroSection) return;

  let isLoaded = false;

  // Block scrolling during preloader
  function blockScroll() {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  }

  // Unblock scrolling after preloader
  function unblockScroll() {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }

  // Check if preloader has already been shown in this session
  const hasShownPreloader = sessionStorage.getItem('preloader-shown');

  if (hasShownPreloader) {
    // Skip preloader
    preloader.style.display = 'none';
    heroSection.style.opacity = '1';
    isLoaded = true;
    unblockScroll();
    // Use requestAnimationFrame to ensure DOM is ready for animations
    requestAnimationFrame(() => {
      initHeroAnimation();
      // Trigger essential events
      window.dispatchEvent(new Event('scroll'));
      window.dispatchEvent(new Event('resize'));
    });
  } else {
    // Show preloader normally
    blockScroll();

    // Check if page is already loaded
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }
  }

  // Preloader logic - only affects hero section
  function handleLoad() {
    // Wait 3 seconds after page load, then fade out preloader
    setTimeout(() => {
      preloader.style.opacity = '0';
      // After fade transition (300ms), hide preloader and show hero section
      setTimeout(() => {
        preloader.style.display = 'none';
        sessionStorage.setItem('preloader-shown', 'true');
        isLoaded = true;
        // Unblock scrolling first
        unblockScroll();
        // Wait a bit for browser to recalculate layout after unblocking scroll
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            // Show hero section and initialize hero animation
            heroSection.style.opacity = '1';
            initHeroAnimation();
            // Trigger scroll-based animations to recalculate
            window.dispatchEvent(new Event('scroll', { bubbles: true }));
            window.dispatchEvent(new Event('resize', { bubbles: true }));
          });
        });
      }, 300);
    }, 3000);
  }

  function initHeroAnimation() {
    if (isLoaded && window.scrollY < 50) {
      if (header) {
        header.classList.add('hero-fade', 'hero-fade-1');
      }
      if (heroSection) {
        heroSection.classList.add('hero-entrance');
      }
      if (heroTitle) {
        heroTitle.classList.add('hero-fade', 'hero-fade-2');
      }
      if (heroMap) {
        heroMap.classList.add('hero-fade', 'hero-fade-0');
      }
    }
  }

  // Hero height: на iOS не обновлять при resize от скрытия адресной строки — только при смене ориентации
  const heroSpacer = document.getElementById('hero-spacer');
  const isTouchDevice = 'ontouchstart' in window;

  function setHeroHeight() {
    const h = window.innerHeight;
    if (heroSection) heroSection.style.height = h + 'px';
    if (heroSpacer) heroSpacer.style.height = h + 'px';
  }

  let lastWidth = window.outerWidth;
  function handleResize() {
    if (isTouchDevice) {
      // На iOS resize срабатывает при скрытии адресной строки — обновляем только при смене ориентации
      if (window.outerWidth !== lastWidth) {
        lastWidth = window.outerWidth;
        setHeroHeight();
      }
    } else {
      setHeroHeight();
    }
  }

  setHeroHeight();
  window.addEventListener('resize', handleResize);

  // Hide hero section when scrolling down to prevent it from showing in footer
  function handleHeroVisibility() {
    if (heroSection) {
      const heroHeight = heroSection.offsetHeight;
      heroSection.style.visibility = window.scrollY > heroHeight ? 'hidden' : 'visible';
    }
  }

  window.addEventListener('scroll', handleHeroVisibility);
  handleHeroVisibility();
})();
