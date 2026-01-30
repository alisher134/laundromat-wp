/**
 * Laundromat API - WordPress REST API Wrapper
 *
 * This module handles all communication with the WordPress headless backend.
 * Data is fetched and transformed to match the existing frontend data structures.
 */
const LaundroAPI = (function () {
  // Configuration
  const CONFIG = {
    // Change this to your WordPress installation URL
    API_BASE: 'http://localhost:8080/wp-json',
    WP_API: '/wp/v2',
    CUSTOM_API: '/laundromat/v1',
    // Set to true to enable console logging
    DEBUG: true,
  };

  // Current language (for Polylang support)
  // Auto-detect language from URL path
  function detectLanguage() {
    const pathParts = window.location.pathname.split('/').filter(p => p);
    // Check if we're in the /el/ directory
    if (pathParts.includes('el')) {
      return 'el';
    }
    return 'en';
  }

  let currentLang = detectLanguage();

  // Log initial language detection
  if (CONFIG.DEBUG) {
    console.log('[LaundroAPI] Auto-detected language:', currentLang);
  }

  /**
   * Helper: Log debug messages
   */
  function log(...args) {
    if (CONFIG.DEBUG) {
      console.log('[LaundroAPI]', ...args);
    }
  }

  /**
   * Helper: Fetch JSON from URL with error handling
   */
  async function fetchJSON(endpoint, options = {}) {
    const url = `${CONFIG.API_BASE}${endpoint}`;
    log('Fetching:', url);

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      log('Response:', data);
      return data;
    } catch (error) {
      console.error('[LaundroAPI] Error:', error.message);
      return null;
    }
  }

  /**
   * Build query string with language parameter
   */
  function buildQuery(params = {}) {
    const queryParams = new URLSearchParams({
      per_page: 100,
      ...params,
    });

    // Add language parameter if Polylang is being used
    if (currentLang) {
      queryParams.set('lang', currentLang);
    }

    return '?' + queryParams.toString();
  }

  // Public API
  return {
    /**
     * Set current language for API requests
     * @param {string} lang - Language code (e.g., 'en', 'el')
     */
    setLanguage(lang) {
      currentLang = lang;
      log('Language set to:', lang);
    },

    /**
     * Get current language
     * @returns {string}
     */
    getLanguage() {
      return currentLang;
    },

    /**
     * Enable/disable debug mode
     * @param {boolean} enabled
     */
    setDebug(enabled) {
      CONFIG.DEBUG = enabled;
    },

    /**
     * Update API base URL
     * @param {string} url - New API base URL
     */
    setApiBase(url) {
      CONFIG.API_BASE = url.replace(/\/$/, ''); // Remove trailing slash
      log('API base set to:', CONFIG.API_BASE);
    },

    /**
     * Fetch locations and map to existing frontend format
     * @returns {Promise<Array|null>}
     */
    async getLocations() {
      const data = await fetchJSON(`${CONFIG.WP_API}/locations${buildQuery()}`);
      if (!data) return null;

      return data.map((item) => ({
        id: item.id,
        key: `location-${item.id}`,
        title: item.title.rendered,
        storeHours: item.meta?.store_hours || '',
        address: item.meta?.address || '',
        phone: item.meta?.phone || '',
        lat: item.meta?.latitude,
        lng: item.meta?.longitude,
      }));
    },

    /**
     * Fetch location map positions
     * @returns {Promise<Object|null>}
     */
    async getLocationPositions() {
      const data = await fetchJSON(`${CONFIG.WP_API}/locations${buildQuery()}`);
      if (!data) return null;

      return {
        mobile: data.map((item) => ({
          id: item.id,
          top: item.map_position?.mobile?.top || '0%',
          left: item.map_position?.mobile?.left || '0%',
        })),
        desktop: data.map((item) => ({
          id: item.id,
          top: item.map_position?.desktop?.top || '0%',
          left: item.map_position?.desktop?.left || '0%',
        })),
      };
    },

    /**
     * Fetch tips and map to existing frontend format
     * @returns {Promise<Array|null>}
     */
    async getTips() {
      const data = await fetchJSON(`${CONFIG.WP_API}/tips${buildQuery()}`);
      if (!data) return null;

      return data.map((item) => ({
        id: item.id,
        key: `tip-${item.id}`,
        image: item.featured_image_url || './assets/images/tips-1.png',
        category: item.category || 'Tips and tricks',
        title: item.title?.rendered || '',
        date: item.formatted_date || new Date(item.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        content: item.content?.rendered || '',
      }));
    },

    /**
     * Fetch homepage tips (only tips selected in admin settings)
     * If no tips are selected, returns all tips
     * @returns {Promise<Array|null>}
     */
    async getHomepageTips() {
      const data = await fetchJSON(`${CONFIG.CUSTOM_API}/homepage-tips${buildQuery()}`);
      if (!data) return null;

      return data.map((item) => ({
        id: item.id,
        key: `tip-${item.id}`,
        image: item.featured_image_url || './assets/images/tips-1.png',
        category: item.category || 'Tips and tricks',
        title: item.title?.rendered || '',
        date: item.formatted_date || new Date(item.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        content: item.content?.rendered || '',
      }));
    },

    /**
     * Fetch instructions and map to existing frontend format
     * @returns {Promise<Array|null>}
     */
    async getInstructions() {
      const data = await fetchJSON(`${CONFIG.WP_API}/instructions${buildQuery()}`);
      if (!data) return null;

      return data.map((item) => ({
        id: item.id,
        key: `instruction-${item.id}`,
        image: item.featured_image_url || './assets/images/tips-1.png',
        category: item.category || 'Tips and tricks',
        title: item.title?.rendered || '',
        date: item.formatted_date || new Date(item.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        content: item.content?.rendered || '',
      }));
    },

    /**
     * Fetch FAQs and map to existing frontend format
     * @returns {Promise<Array|null>}
     */
    async getFAQs() {
      const data = await fetchJSON(`${CONFIG.WP_API}/faqs${buildQuery()}`);
      if (!data) return null;

      return data.map((item, index) => ({
        id: item.id,
        number: String(index + 1).padStart(2, '0'),
        question: item.title.rendered,
        answer: item.answer || item.content?.rendered?.replace(/<[^>]*>/g, '') || '',
      }));
    },

    /**
     * Fetch services and map to existing frontend format
     * @returns {Promise<Array|null>}
     */
    async getServices() {
      const data = await fetchJSON(`${CONFIG.WP_API}/services${buildQuery()}`);
      if (!data) return null;

      return data.map((item) => ({
        id: item.id,
        title: item.title?.rendered || '',
        slug: item.slug || '',
        description: item.content?.rendered || '',
        category: item.meta?.service_category || 'laundry',
        image: item.featured_image_url || '',
        // Price rows array: each row has { feature, time, time_unit, price }
        priceRows: (item.price_rows || []).map((row) => ({
          feature: row.feature || '',
          time: row.time || '',
          timeUnit: row.time_unit || 'min',
          price: row.price || '',
        })),
        // Action link: { text, url }
        actionLink: {
          text: item.action_link?.text || '',
          url: item.action_link?.url || '',
        },
      }));
    },

    /**
     * Fetch about items and map to existing frontend format
     * @returns {Promise<Array|null>}
     */
    async getAboutItems() {
      const data = await fetchJSON(`${CONFIG.WP_API}/about_items${buildQuery()}`);
      if (!data) return null;

      return data.map((item) => ({
        id: item.id,
        title: item.title?.rendered || '',
        secondaryTitle: item.meta?.secondary_title || '',
        description: item.meta?.description || '',
        iconImageUrl: item.icon_image_url || '',
      }));
    },

    /**
     * Fetch reviews and map to existing frontend format
     * @returns {Promise<Array|null>}
     */
    async getReviews() {
      const data = await fetchJSON(`${CONFIG.WP_API}/reviews${buildQuery()}`);
      if (!data) return null;

      return data.map((item) => ({
        id: item.id,
        authorName: item.author_name || item.title?.rendered || '',
        reviewText: item.review_text || item.content?.rendered?.replace(/<[^>]*>/g, '') || '',
        photoUrl: item.photo_url || '',
      }));
    },

    /**
     * Fetch contact settings from WordPress options
     * @returns {Promise<Object|null>}
     */
    async getSettings() {
      return await fetchJSON(`${CONFIG.CUSTOM_API}/settings`);
    },

    /**
     * Fetch content categories
     * @returns {Promise<Array|null>}
     */
    async getCategories() {
      return await fetchJSON(`${CONFIG.CUSTOM_API}/categories`);
    },

    /**
     * Fetch available languages from Polylang
     * @returns {Promise<Object|null>}
     */
    async getLanguages() {
      return await fetchJSON(`${CONFIG.CUSTOM_API}/languages`);
    },

    /**
     * Fetch a single tip by ID
     * @param {number} id - Tip ID
     * @returns {Promise<Object|null>}
     */
    async getTipById(id) {
      const data = await fetchJSON(`${CONFIG.WP_API}/tips/${id}`);
      if (!data) return null;

      return {
        id: data.id,
        key: `tip-${data.id}`,
        title: data.title.rendered,
        content: data.content?.rendered || '',
        image: data.featured_image_url || './assets/images/tips-1.png',
        category: data.category || 'Tips and tricks',
        date: data.formatted_date || new Date(data.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      };
    },

    /**
     * Fetch a single instruction by ID
     * @param {number} id - Instruction ID
     * @returns {Promise<Object|null>}
     */
    async getInstructionById(id) {
      const data = await fetchJSON(`${CONFIG.WP_API}/instructions/${id}`);
      if (!data) return null;

      return {
        id: data.id,
        key: `instruction-${data.id}`,
        title: data.title.rendered,
        content: data.content?.rendered || '',
        image: data.featured_image_url || './assets/images/tips-1.png',
        category: data.category || 'Instructions',
        date: data.formatted_date || new Date(data.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      };
    },

    /**
     * Submit contact form
     * @param {Object} formData - Form data { name, phone, email, message }
     * @returns {Promise<Object>}
     */
    async submitContact(formData) {
      try {
        const response = await fetch(`${CONFIG.API_BASE}${CONFIG.CUSTOM_API}/contact`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (!response.ok) {
          return {
            success: false,
            message: result.message || 'Failed to send message',
          };
        }

        return result;
      } catch (error) {
        console.error('[LaundroAPI] Contact form error:', error);
        return {
          success: false,
          message: 'Network error. Please try again.',
        };
      }
    },

    /**
     * Check if API is available
     * @returns {Promise<boolean>}
     */
    async isAvailable() {
      try {
        const response = await fetch(`${CONFIG.API_BASE}`, {
          method: 'HEAD',
        });
        return response.ok;
      } catch {
        return false;
      }
    },

    /**
     * Fetch Privacy Policy page
     * @returns {Promise<Object|null>}
     */
    async getPrivacyPolicy() {
      return await fetchJSON(`${CONFIG.CUSTOM_API}/legal/privacy-policy${buildQuery()}`);
    },

    /**
     * Fetch Personal Data page
     * @returns {Promise<Object|null>}
     */
    async getPersonalData() {
      return await fetchJSON(`${CONFIG.CUSTOM_API}/legal/personal-data${buildQuery()}`);
    },
  };
})();

// Make available globally
if (typeof window !== 'undefined') {
  window.LaundroAPI = LaundroAPI;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LaundroAPI;
}
