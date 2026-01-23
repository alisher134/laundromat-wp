// Header and Hero Section animations and interactions
(function () {
  const header = document.getElementById('header');
  const heroSection = document.getElementById('hero-section');
  const heroTitle = document.getElementById('hero-title');
  const heroMap = document.getElementById('hero-map');
  let shouldAnimate = false;

  if (window.scrollY < 50) {
    shouldAnimate = true;
    header.classList.add('hero-fade', 'hero-fade-1');
    heroSection.classList.add('hero-entrance');
    heroTitle.classList.add('hero-fade', 'hero-fade-2');
    heroMap.classList.add('hero-fade', 'hero-fade-0');
  }

  // Set viewport height
  function setViewportHeight() {
    heroSection.style.height = window.innerHeight + 'px';
  }
  setViewportHeight();
  window.addEventListener('resize', setViewportHeight);

  // Header scroll effect
  function handleScroll() {
    const scrollThreshold = window.innerHeight * 0.9;
    const isScrolled = window.scrollY > scrollThreshold;

    if (isScrolled) {
      header.classList.add('bg-white/30', 'backdrop-blur-sm');
      // Change text color to dark
      header.querySelectorAll('.text-white').forEach((el) => {
        el.classList.remove('text-white');
        el.classList.add('text-text');
      });
      // Change logo color
      header.querySelector('svg').classList.remove('text-white');
      header.querySelector('svg').classList.add('text-brand');
      // Change burger icon
      const burgerIcon = header.querySelector('#mobile-menu-btn svg');
      if (burgerIcon) {
        burgerIcon.classList.remove('text-white');
        burgerIcon.classList.add('text-text');
      }
    } else {
      header.classList.remove('bg-white/30', 'backdrop-blur-sm');
      // Change text color back to white
      header.querySelectorAll('.text-text').forEach((el) => {
        el.classList.remove('text-text');
        el.classList.add('text-white');
      });
      // Change logo color back
      const logo = header.querySelector('svg');
      if (logo.classList.contains('text-brand')) {
        logo.classList.remove('text-brand');
        logo.classList.add('text-white');
      }
      // Change burger icon back
      const burgerIcon = header.querySelector('#mobile-menu-btn svg');
      if (burgerIcon && burgerIcon.classList.contains('text-text')) {
        burgerIcon.classList.remove('text-text');
        burgerIcon.classList.add('text-white');
      }
    }
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // Language switcher
  const langButton = document.getElementById('lang-button');
  const langDropdown = document.getElementById('lang-dropdown');
  const langSwitcher = document.getElementById('lang-switcher');

  if (langButton && langDropdown) {
    langButton.addEventListener('click', () => {
      langDropdown.classList.toggle('hidden');
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!langSwitcher.contains(e.target)) {
        langDropdown.classList.add('hidden');
      }
    });
  }

  // Mobile menu
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  const mobileMenuContent = document.getElementById('mobile-menu-content');
  const mobileMenuClose = document.getElementById('mobile-menu-close');

  function openMobileMenu() {
    // Make menu visible and enable interactions
    mobileMenu.classList.remove('invisible');
    mobileMenu.style.pointerEvents = 'auto';
    document.body.style.overflow = 'hidden';

    // Force reflow to ensure browser registers the initial state
    mobileMenu.offsetHeight;

    // Start animation
    mobileMenuOverlay.classList.remove('opacity-0');
    mobileMenuOverlay.classList.add('opacity-100');
    mobileMenuContent.classList.remove('translate-x-full');
    mobileMenuContent.classList.add('translate-x-0');
  }

  function closeMobileMenu() {
    // Start closing animation
    mobileMenuOverlay.classList.remove('opacity-100');
    mobileMenuOverlay.classList.add('opacity-0');
    mobileMenuContent.classList.remove('translate-x-0');
    mobileMenuContent.classList.add('translate-x-full');

    // Wait for animation to complete, then hide
    setTimeout(() => {
      mobileMenu.classList.add('invisible');
      mobileMenu.style.pointerEvents = 'none';
      document.body.style.overflow = '';
    }, 500); // Match duration-500 from CSS
  }

  if (mobileMenuBtn && mobileMenu && mobileMenuClose) {
    mobileMenuBtn.addEventListener('click', openMobileMenu);
    mobileMenuClose.addEventListener('click', closeMobileMenu);
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMobileMenu);
    });
  }
})();
