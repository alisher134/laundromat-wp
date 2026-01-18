// Mobile menu interactions
(function () {
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
