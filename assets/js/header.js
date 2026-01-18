// Header scroll effects and language switcher
(function () {
  const header = document.getElementById('header');

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
})();
