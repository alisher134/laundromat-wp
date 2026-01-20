// Header scroll effects and language switcher
(function () {
  const header = document.getElementById('header');

  // Header scroll effect
  function handleScroll() {
    // Check if header is forced dark (for non-hero pages like FAQ)
    if (header.getAttribute('data-header-style') === 'dark') {
      header.classList.add('bg-white/30', 'backdrop-blur-sm');
      return;
    }

    // Use a small fixed threshold to ensure visibility immediately upon scrolling
    const scrollThreshold = 50;
    const isScrolled = window.scrollY > scrollThreshold;

    if (isScrolled) {
      header.classList.add('bg-white/30', 'backdrop-blur-sm');
      // Change text color to dark
      header.querySelectorAll('.text-white').forEach((el) => {
        // Skip if this is the logo or inside the logo
        if (el.closest('a[href="index.html"]')) return;

        el.classList.remove('text-white');
        el.classList.add('text-text');
      });
      // Change logo color
      const logo = header.querySelector('a[href="index.html"] svg');
      if (logo) {
        logo.classList.remove('text-white');
        logo.classList.add('text-brand');
      }
      // Change burger icon
      const burgerIcon = header.querySelector('#mobile-menu-btn svg');
      if (burgerIcon) {
        burgerIcon.classList.remove('text-white');
        burgerIcon.classList.add('text-text');
      }
    } else {
      header.classList.remove('bg-white/30', 'backdrop-blur-sm');

      const isLight = header.dataset.theme === 'light';

      // Change text color back
      header.querySelectorAll(isLight ? '.text-white' : '.text-text').forEach((el) => {
        el.classList.remove(isLight ? 'text-white' : 'text-text');
        el.classList.add(isLight ? 'text-text' : 'text-white');
      });
      // Change logo color back
      const logo = header.querySelector('a[href="index.html"] svg');
      if (logo) {
        logo.classList.remove(isLight ? 'text-white' : 'text-brand');
        logo.classList.add(isLight ? 'text-brand' : 'text-white');
      }
      // Change burger icon back
      const burgerIcon = header.querySelector('#mobile-menu-btn svg');
      if (burgerIcon) {
        burgerIcon.classList.remove(isLight ? 'text-white' : 'text-text');
        burgerIcon.classList.add(isLight ? 'text-text' : 'text-white');
      }
    }
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // Language switcher setup
  function setupLangSwitcher(switcherId, buttonId, dropdownId) {
    const switcher = document.getElementById(switcherId);
    const button = document.getElementById(buttonId);
    const dropdown = document.getElementById(dropdownId);

    if (switcher && button && dropdown) {
      // Toggle
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('hidden');
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if (!switcher.contains(e.target)) {
          dropdown.classList.add('hidden');
        }
      });
    }
  }

  // Init Header Switcher
  setupLangSwitcher('lang-switcher', 'lang-button', 'lang-dropdown');
  // Init Footer Switcher
  setupLangSwitcher('lang-switcher-footer', 'lang-button-footer', 'lang-dropdown-footer');
  // Init Mobile Footer Switcher
  setupLangSwitcher('lang-switcher-footer-mobile', 'lang-button-footer-mobile', 'lang-dropdown-footer-mobile');
})();
