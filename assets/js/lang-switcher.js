// Language switcher functionality for static HTML files
(function () {
  // Setup function for a single language switcher
  function setupSwitcher(switcherId, buttonId, dropdownId) {
    const switcher = document.getElementById(switcherId);
    const button = document.getElementById(buttonId);
    const dropdown = document.getElementById(dropdownId);

    if (!button || !dropdown) return;

    // Toggle dropdown
    button.addEventListener('click', function (e) {
      e.stopPropagation();
      dropdown.classList.toggle('hidden');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function (e) {
      if (switcher && !switcher.contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    });

    // Language switching - handle both buttons and links
    const langOptions = dropdown.querySelectorAll('button, a');
    langOptions.forEach((option) => {
      option.addEventListener('click', function (e) {
        // Only prevent default for buttons, not links
        if (this.tagName === 'BUTTON') {
          e.preventDefault();
          const newLang = this.textContent.trim();
          switchLanguage(newLang);
        }
        // Links will navigate naturally
      });
    });
  }

  function switchLanguage(lang) {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';

    // Detect if we're in a subdirectory
    const pathParts = currentPath.split('/').filter((p) => p);
    const isInGreek = pathParts.includes('el');

    console.log('[LangSwitcher] Switching language:', {
      from: isInGreek ? 'el' : 'en',
      to: lang,
      currentPath,
      currentPage,
    });

    if (lang === 'Gr' || lang === 'GR') {
      // Switch to Greek - add /el/ prefix
      if (!isInGreek) {
        // Get the directory path without the filename
        let dirPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
        const newPath = dirPath + '/el/' + currentPage;
        console.log('[LangSwitcher] Navigating to:', newPath);
        window.location.href = newPath;
      }
    } else if (lang === 'En' || lang === 'EN') {
      // Switch to English - remove /el/ prefix
      if (isInGreek) {
        // Remove /el/ from path
        const newPath = currentPath.replace('/el/', '/');
        console.log('[LangSwitcher] Navigating to:', newPath);
        window.location.href = newPath;
      }
    }
  }

  // Initialize all language switchers after DOM is ready
  function init() {
    // Header switcher
    setupSwitcher('lang-switcher', 'lang-button', 'lang-dropdown');

    // Mobile header switcher
    setupSwitcher('lang-switcher-mobile', 'lang-button-mobile', 'lang-dropdown-mobile');

    // Footer switcher
    setupSwitcher('lang-switcher-footer', 'lang-button-footer', 'lang-dropdown-footer');

    // Mobile footer switcher
    setupSwitcher('lang-switcher-footer-mobile', 'lang-button-footer-mobile', 'lang-dropdown-footer-mobile');
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
