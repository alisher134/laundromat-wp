// Language switcher functionality for WordPress + Polylang
// This script handles dropdown toggle behavior only.
// Language URLs are populated by header.js using the WordPress REST API.
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

    // Language links are populated by header.js with correct URLs from Polylang
    // The links will navigate naturally to preserve the current page in the new language
    console.log('[LangSwitcher] Initialized switcher:', buttonId);
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

    console.log('[LangSwitcher] All switchers initialized. Language URLs will be loaded from WordPress API.');
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
