// Header scroll effects and language switcher
(function () {
  const header = document.getElementById('header');

  let lastScrollY = window.scrollY;
  const hideThreshold = 100; // Only hide after scrolling 100px

  // Header scroll effects (background and smart reveal)
  function handleScroll() {
    const currentScrollY = window.scrollY;

    // 1. Background and Theme effects (already existed)
    const scrollThreshold = window.innerHeight * 0.1;
    const isScrolled = currentScrollY > scrollThreshold;

    if (isScrolled) {
      header.classList.add('bg-white/30', 'backdrop-blur-sm');
      if (header.dataset.theme === 'dark') {
        header.querySelectorAll('.text-white').forEach((el) => {
          if (el.closest('a[href="index.html"]')) return;
          // Exclude only dropdown menus from color change (button should change)
          if (el.closest('#lang-dropdown') || el.closest('#lang-dropdown-mobile')) return;
          el.classList.remove('text-white');
          el.classList.add('text-text');
        });
        const logo = header.querySelector('a[href="index.html"] svg');
        if (logo) {
          logo.classList.remove('text-white');
          logo.classList.add('text-brand');
        }
        const burgerIcon = header.querySelector('#mobile-menu-btn svg');
        if (burgerIcon) {
          burgerIcon.classList.remove('text-white');
          burgerIcon.classList.add('text-text');
        }
      }
    } else {
      header.classList.remove('bg-white/30', 'backdrop-blur-sm');
      if (header.dataset.theme === 'dark') {
        header.querySelectorAll('.text-text').forEach((el) => {
          if (el.closest('a[href="index.html"]')) return;
          // Exclude only dropdown menus from color change (button should change)
          if (el.closest('#lang-dropdown') || el.closest('#lang-dropdown-mobile')) return;
          el.classList.remove('text-text');
          el.classList.add('text-white');
        });
        const logo = header.querySelector('a[href="index.html"] svg');
        if (logo && logo.classList.contains('text-brand')) {
          logo.classList.remove('text-brand');
          logo.classList.add('text-white');
        }
        const burgerIcon = header.querySelector('#mobile-menu-btn svg');
        if (burgerIcon && burgerIcon.classList.contains('text-text')) {
          burgerIcon.classList.remove('text-text');
          burgerIcon.classList.add('text-white');
        }
      }
    }

    // 2. Smart Reveal logic
    // Hide when scrolling down, show when scrolling up
    if (currentScrollY > lastScrollY && currentScrollY > hideThreshold) {
      // Scrolling DOWN
      header.classList.add('header-hidden');
    } else {
      // Scrolling UP or near the top
      header.classList.remove('header-hidden');
    }

    lastScrollY = currentScrollY;
  }

  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // Language switcher setup - NOTE: Now handled by lang-switcher.js
  // The setupLangSwitcher function is no longer used here to avoid conflicts
  // Language switching is managed by assets/js/lang-switcher.js

  // Initialize header and mobile menu contact data
  async function initHeaderContacts() {
    // Check if API is available
    if (typeof window.LaundroAPI === 'undefined') {
      console.warn('[Header] LaundroAPI not available for contact data');
      return;
    }

    try {
      const settings = await window.LaundroAPI.getSettings();

      if (!settings) {
        console.warn('[Header] No settings data received');
        return;
      }

      // Update header phone number
      if (settings.phone) {
        const headerPhoneLinks = header.querySelectorAll('a[href^="tel:"]');
        headerPhoneLinks.forEach((link) => {
          const cleanPhone = settings.phone.replace(/\s/g, '');
          link.href = `tel:${cleanPhone}`;
          link.textContent = settings.phone;
        });
      }

      // Update mobile menu contact information
      const mobileMenu = document.getElementById('mobile-menu-content');
      if (mobileMenu) {
        // Update phone
        if (settings.phone) {
          const phoneLinks = mobileMenu.querySelectorAll('a[href^="tel:"]');
          phoneLinks.forEach((link) => {
            const cleanPhone = settings.phone.replace(/\s/g, '');
            link.href = `tel:${cleanPhone}`;
            link.textContent = settings.phone;
          });
        }

        // Update email
        if (settings.email) {
          const emailLinks = mobileMenu.querySelectorAll('a[href^="mailto:"]');
          emailLinks.forEach((link) => {
            link.href = `mailto:${settings.email}`;
            link.textContent = settings.email;
          });
        }
      }

      console.log('[Header] Header and mobile menu contacts updated');
    } catch (error) {
      console.error('[Header] Error loading header contacts:', error);
    }
  }

  // Initialize language switcher with API data
  async function initLanguageSwitcher() {
    // Check if API is available
    if (typeof window.LaundroAPI === 'undefined') {
      console.warn('[Header] LaundroAPI not available for language switching');
      return;
    }

    try {
      const languageData = await window.LaundroAPI.getLanguages();

      if (!languageData || !languageData.languages) {
        console.warn('[Header] No language data received');
        return;
      }

      const { current, languages } = languageData;

      // Update all language switchers
      updateLanguageSwitcher('lang-button', 'lang-dropdown', current, languages);
      updateLanguageSwitcher('lang-button-mobile', 'lang-dropdown-mobile', current, languages);
      updateLanguageSwitcher('lang-button-footer', 'lang-dropdown-footer', current, languages);
      updateLanguageSwitcher('lang-button-footer-mobile', 'lang-dropdown-footer-mobile', current, languages);

      console.log('[Header] Language switcher initialized with', languages.length, 'languages');
    } catch (error) {
      console.error('[Header] Error initializing language switcher:', error);
    }
  }

  // Update a specific language switcher with data
  function updateLanguageSwitcher(buttonId, dropdownId, currentLang, languages) {
    const button = document.getElementById(buttonId);
    const dropdown = document.getElementById(dropdownId);

    if (!button || !dropdown) return;

    // Find current language object
    const currentLanguage = languages.find((lang) => lang.code === currentLang);
    if (!currentLanguage) return;

    // Update button text to show current language
    const buttonTextSpan = button.querySelector('span');
    if (buttonTextSpan) {
      buttonTextSpan.textContent = currentLanguage.code.toUpperCase();
    }

    // Determine if this is a footer switcher (different styling)
    const isFooter = buttonId.includes('footer');
    const isMobile = buttonId.includes('mobile');

    // Update dropdown container background for footer and mobile switchers
    if (isFooter || isMobile) {
      // Use white background without transparency for footer and mobile (same as header)
      dropdown.classList.remove('bg-white/90', 'bg-gray-900');
      dropdown.classList.add('bg-white');
      // Update border to match header dropdown (border-text/20 for consistency)
      if (isMobile) {
        dropdown.classList.remove('border-white/20', 'border-black/10');
        dropdown.classList.add('border-text/20');
      }
    }
    // Ensure header dropdown also uses border-text/20 for consistency
    if (!isFooter && !isMobile) {
      dropdown.classList.remove('border-white/20');
      dropdown.classList.add('border-text/20');
    }

    // Clear dropdown and populate with languages
    dropdown.innerHTML = '';

    languages.forEach((lang) => {
      const li = document.createElement('li');
      const link = document.createElement('a');

      link.href = lang.url;
      link.textContent = lang.code.toUpperCase();

      // Apply appropriate classes based on footer vs header
      // Mobile dropdown uses same styles as header dropdown
      if (isFooter) {
        // Footer style - matches header style (dark text on white background)
        if (lang.is_current) {
          link.className =
            'paragraph-body-sm bg-brand/10 text-brand flex w-full cursor-pointer items-center justify-center px-3 py-2 transition';
        } else {
          link.className =
            'paragraph-body-sm text-text hover:bg-brand/5 flex w-full cursor-pointer items-center justify-center px-3 py-2 transition';
        }
      } else {
        // Header and mobile style - same styling for both
        if (lang.is_current) {
          link.className =
            'paragraph-body-sm bg-brand/10 text-brand flex w-full cursor-pointer items-center justify-center px-3 py-2 transition';
        } else {
          link.className =
            'paragraph-body-sm text-text hover:bg-brand/5 flex w-full cursor-pointer items-center justify-center px-3 py-2 transition';
        }
      }

      li.appendChild(link);
      dropdown.appendChild(li);
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initLanguageSwitcher();
      initHeaderContacts();
    });
  } else {
    initLanguageSwitcher();
    initHeaderContacts();
  }

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
          link.classList.add('text-brand');
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
