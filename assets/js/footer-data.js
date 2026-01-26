/**
 * Footer Data Loader
 * Fetches contact settings from WordPress API and updates footer dynamically
 */
(function () {
  // Wait for both DOM and API to be ready
  document.addEventListener('DOMContentLoaded', async () => {
    // Check if LaundroAPI is available
    if (typeof window.LaundroAPI === 'undefined') {
      console.warn('[Footer Data] LaundroAPI not available');
      return;
    }

    try {
      // Fetch settings from WordPress
      const settings = await window.LaundroAPI.getSettings();

      if (!settings) {
        console.warn('[Footer Data] No settings data received from API');
        return;
      }

      console.log('[Footer Data] Loaded settings from API:', settings);

      // Update footer contact information
      updateFooterContacts(settings);
    } catch (error) {
      console.error('[Footer Data] Error loading settings:', error);
    }
  });

  /**
   * Update footer phone and email with API data
   */
  function updateFooterContacts(settings) {
    // Find footer phone link
    const phoneLinks = document.querySelectorAll('footer a[href^="tel:"]');
    if (phoneLinks.length > 0 && settings.phone) {
      phoneLinks.forEach((link) => {
        // Update href and text content
        const cleanPhone = settings.phone.replace(/\s/g, ''); // Remove spaces for tel: link
        link.href = `tel:${cleanPhone}`;
        link.textContent = settings.phone;
      });
      console.log('[Footer Data] Updated phone to:', settings.phone);
    }

    // Find footer email link
    const emailLinks = document.querySelectorAll('footer a[href^="mailto:"]');
    if (emailLinks.length > 0 && settings.email) {
      emailLinks.forEach((link) => {
        // Update href and text content
        link.href = `mailto:${settings.email}`;
        link.textContent = settings.email;
      });
      console.log('[Footer Data] Updated email to:', settings.email);
    }

    // Note: Social media links and other footer content can be added here
    // if the HTML structure includes placeholders for them
  }
})();
