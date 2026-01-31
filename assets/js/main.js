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

  // Block scroll immediately when preloader is active
  blockScroll();

  // Preloader logic - only affects hero section
  function handleLoad() {
    // Wait 3 seconds after page load, then fade out preloader
    setTimeout(() => {
      preloader.style.opacity = '0';
      // After fade transition (300ms), hide preloader and show hero section
      setTimeout(() => {
        preloader.style.display = 'none';
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
            // Use requestAnimationFrame to ensure layout is ready
            const scrollEvent = new Event('scroll', { bubbles: true });
            window.dispatchEvent(scrollEvent);
            const resizeEvent = new Event('resize', { bubbles: true });
            window.dispatchEvent(resizeEvent);
          });
        });
      }, 300);
    }, 3000);
  }

  // Check if page is already loaded
  if (document.readyState === 'complete') {
    handleLoad();
  } else {
    window.addEventListener('load', handleLoad);
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

  // Set viewport height for hero section
  function setViewportHeight() {
    if (heroSection) {
      const viewportHeight = window.innerHeight;
      heroSection.style.height = `${viewportHeight}px`;
    }
  }

  // Initialize viewport height immediately
  setViewportHeight();
  window.addEventListener('resize', setViewportHeight);

  // Hide hero section when scrolling down to prevent it from showing in footer
  function handleHeroVisibility() {
    if (heroSection) {
      if (window.scrollY > window.innerHeight) {
        heroSection.style.visibility = 'hidden';
      } else {
        heroSection.style.visibility = 'visible';
      }
    }
  }

  window.addEventListener('scroll', handleHeroVisibility);
  handleHeroVisibility();
})();
