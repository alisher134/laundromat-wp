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

  // Active page detection and styling
  function setActivePage() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    // Find all navigation links in header
    const navLinks = header.querySelectorAll('nav a[href]');
    
    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      const linkPage = href.split('/').pop();
      
      // Check if this link matches current page
      if (linkPage === currentPage) {
        // Set active styles
        const parentLi = link.closest('li');
        if (parentLi) {
          parentLi.classList.remove('text-text', 'text-white', 'hover:text-brand');
          parentLi.classList.add('text-brand', 'font-semibold');
        }
        // Also update the link itself
        link.classList.remove('text-text', 'text-white', 'hover:text-brand');
        link.classList.add('text-brand', 'font-semibold');
      } else {
        // Set inactive styles with hover
        const parentLi = link.closest('li');
        if (parentLi) {
          parentLi.classList.remove('text-brand', 'font-semibold');
          // Keep text-text or text-white based on header theme, but ensure hover is present
          const isDark = header.dataset.theme === 'dark' && !header.classList.contains('bg-white/30');
          if (!isDark) {
            parentLi.classList.add('text-text', 'hover:text-brand');
          } else {
            parentLi.classList.add('text-white', 'hover:text-brand');
          }
        }
        link.classList.remove('text-brand', 'font-semibold');
        link.classList.add('hover:text-brand', 'transition-colors');
      }
    });

    // Also handle mobile menu links
    const mobileMenu = document.getElementById('mobile-menu-content');
    if (mobileMenu) {
      const mobileLinks = mobileMenu.querySelectorAll('a[href]');
      mobileLinks.forEach((link) => {
        const href = link.getAttribute('href');
        const linkPage = href.split('/').pop();
        
        if (linkPage === currentPage) {
          link.classList.remove('text-text', 'hover:text-brand');
          link.classList.add('text-brand', 'font-semibold');
        } else {
          link.classList.remove('text-brand', 'font-semibold');
          link.classList.add('text-text', 'hover:text-brand');
        }
      });
    }
  }

  // Set active page on load and after scroll (in case header theme changes)
  setActivePage();
  window.addEventListener('scroll', () => {
    // Re-apply active styles after scroll in case colors changed
    setTimeout(setActivePage, 100);
  });
})();
