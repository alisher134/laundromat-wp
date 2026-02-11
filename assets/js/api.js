/**
 * Laundromat API - WordPress REST API Wrapper
 *
 * This module handles all communication with the WordPress headless backend.
 * Data is fetched and transformed to match the existing frontend data structures.
 */
const LaundroAPI = (function () {
  // Path to WordPress (no trailing slash). Set window.LAUNDROMAT_WP_PATH before this script to override.
  // Option B (WP in root): use '' so API = origin + '/wp-json'. Option A (WP in /wp): use '/wp'.
  const isLocal = /localhost|127\.0\.0\.1/i.test(window.location.hostname);
  const isFileProtocol = window.location.protocol === 'file:';

  if (isFileProtocol) {
    console.warn(
      '[LaundroAPI] Site opened via file:// protocol. WordPress API calls will likely fail due to CORS. Please use a local web server (e.g., Live Server or npm run dev).',
    );
  }

  const wpPath =
    typeof window !== 'undefined' && window.LAUNDROMAT_WP_PATH != null
      ? window.LAUNDROMAT_WP_PATH
      : isLocal
        ? 'http://localhost:8080'
        : '';

  // Ensure origin is correctly determined even on file://
  const origin = window.location.origin === 'null' ? '' : window.location.origin;
  const apiBase = wpPath.startsWith('http') ? wpPath + '/wp-json' : (origin || '') + (wpPath || '') + '/wp-json';

  const CONFIG = {
    API_BASE: apiBase,
    WP_API: '/wp/v2',
    CUSTOM_API: '/laundromat/v1',
    DEBUG: /localhost|127\.0\.0\.1/i.test(window.location.hostname),
  };

  // Current language (for Polylang support)
  // Auto-detect language from URL path
  function detectLanguage() {
    const pathParts = window.location.pathname.split('/').filter((p) => p);
    // Check if we're in the /gr/ directory (Greek language)
    if (pathParts.includes('gr')) {
      return 'gr';
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

  // Simple memory cache to speed up repeat requests
  const cache = new Map();
  let apiWasAvailable = false;

  /**
   * Helper: Fetch JSON from URL with error handling and caching
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Fetch options
   * @param {boolean} returnHeaders - If true, return { data, headers } object
   * @param {boolean} useCache - If true, check cache first
   */
  async function fetchJSON(endpoint, options = {}, returnHeaders = false, useCache = true) {
    const url = `${CONFIG.API_BASE}${endpoint}`;

    // Check cache first
    if (useCache && !returnHeaders && cache.has(url)) {
      log('Cache Hit:', url);
      return cache.get(url);
    }

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

      apiWasAvailable = true;

      // Store in cache (only if not returning headers which includes pagination metadata)
      if (useCache && !returnHeaders) {
        cache.set(url, data);
      }

      if (returnHeaders) {
        return {
          data,
          totalItems: parseInt(response.headers.get('X-WP-Total') || '0', 10),
          totalPages: parseInt(response.headers.get('X-WP-TotalPages') || '0', 10),
        };
      }

      return data;
    } catch (error) {
      console.error('[LaundroAPI] Error:', error.message);
      return returnHeaders ? { data: null, totalItems: 0, totalPages: 0 } : null;
    }
  }

  /**
   * Build query string with language parameter
   * @param {Object} params - Query parameters
   * @param {boolean} includeDefaultPerPage - If true, include per_page=100 default
   */
  function buildQuery(params = {}, includeDefaultPerPage = true) {
    const queryParams = new URLSearchParams(includeDefaultPerPage ? { per_page: 100, ...params } : params);

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
     * @param {string} lang - Language code (e.g., 'en', 'gr')
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
      const data = await fetchJSON(`${CONFIG.CUSTOM_API}/locations${buildQuery()}`);
      if (!data) return null;

      return data.map((item) => ({
        id: item.id,
        key: `location-${item.id}`,
        title: item.title.rendered,
        storeHours: item.meta?.store_hours || '',
        address: item.meta?.address || '',
        phone: item.meta?.phone || '',
        googleMapsUrl: item.meta?.google_maps_url || '',
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
        tablet: data.map((item) => ({
          id: item.id,
          top: item.map_position?.tablet?.top || '0%',
          left: item.map_position?.tablet?.left || '0%',
        })),
        medium: data.map((item) => ({
          id: item.id,
          top: item.map_position?.medium?.top || '0%',
          left: item.map_position?.medium?.left || '0%',
        })),
        large: data.map((item) => ({
          id: item.id,
          top: item.map_position?.large?.top || '0%',
          left: item.map_position?.large?.left || '0%',
        })),
      };
    },

    /**
     * Fetch tips and map to existing frontend format
     * @returns {Promise<Array|null>}
     */
    async getTips(params = {}) {
      const data = await fetchJSON(`${CONFIG.WP_API}/tips${buildQuery(params)}`);
      if (!data) return null;

      return data.map((item) => ({
        id: item.id,
        key: `tip-${item.id}`,
        image: item.featured_image_url || './assets/images/tips-1.png',
        image_large: item.featured_image_large || item.featured_image_url || './assets/images/tips-1.png',
        category: item.category || 'Tips and tricks',
        title: item.title?.rendered || '',
        categorySlug: item.category_slug || '',
        date:
          item.formatted_date ||
          new Date(item.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        content: item.content?.rendered || '',
      }));
    },

    /**
     * Fetch tips with pagination support
     * @param {number} page - Page number (1-indexed)
     * @param {number} perPage - Items per page
     * @returns {Promise<Object>} { items: Array, totalItems: number, totalPages: number }
     */
    async getTipsWithPagination(page = 1, perPage = 6, params = {}) {
      const result = await fetchJSON(
        `${CONFIG.CUSTOM_API}/tips${buildQuery({ page, per_page: perPage, ...params }, false)}`,
        {},
        true,
      );

      if (!result.data) {
        return { items: [], totalItems: 0, totalPages: 0 };
      }

      return {
        items: result.data.map((item) => ({
          id: item.id,
          key: `tip-${item.id}`,
          image: item.featured_image_url || './assets/images/tips-1.png',
          category: item.category || 'Tips and tricks',
          title: item.title?.rendered || '',
          categorySlug: item.category_slug || '',
          date:
            item.formatted_date ||
            new Date(item.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
          content: item.content?.rendered || '',
        })),
        totalItems: result.totalItems,
        totalPages: result.totalPages,
      };
    },

    /**
     * Fetch homepage tips (only tips selected in admin settings)
     * If no tips are selected, returns all tips
     * @returns {Promise<Array|null>}
     */
    async getHomepageTips() {
      const data = await fetchJSON(`${CONFIG.CUSTOM_API}/homepage-tips${buildQuery({ per_page: 10 }, false)}`);
      if (!data) return null;

      return data.map((item) => ({
        id: item.id,
        key: `tip-${item.id}`,
        image: item.featured_image_url || './assets/images/tips-1.png',
        category: item.category || 'Tips and tricks',
        title: item.title?.rendered || '',
        categorySlug: item.category_slug || '',
        date:
          item.formatted_date ||
          new Date(item.date).toLocaleDateString('en-US', {
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
    async getInstructions(params = {}) {
      const data = await fetchJSON(`${CONFIG.WP_API}/instructions${buildQuery(params)}`);
      if (!data) return null;

      return data.map((item) => ({
        id: item.id,
        key: `instruction-${item.id}`,
        image: item.featured_image_url || './assets/images/tips-1.png',
        category: item.category || 'Tips and tricks',
        title: item.title?.rendered || '',
        categorySlug: item.category_slug || '',
        date:
          item.formatted_date ||
          new Date(item.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        content: item.content?.rendered || '',
      }));
    },

    /**
     * Fetch instructions with pagination support
     * @param {number} page - Page number (1-indexed)
     * @param {number} perPage - Items per page
     * @returns {Promise<Object>} { items: Array, totalItems: number, totalPages: number }
     */
    async getInstructionsWithPagination(page = 1, perPage = 6, params = {}) {
      const result = await fetchJSON(
        `${CONFIG.CUSTOM_API}/instructions${buildQuery({ page, per_page: perPage, ...params }, false)}`,
        {},
        true,
      );

      if (!result.data) {
        return { items: [], totalItems: 0, totalPages: 0 };
      }

      return {
        items: result.data.map((item) => ({
          id: item.id,
          key: `instruction-${item.id}`,
          image: item.featured_image_url || './assets/images/tips-1.png',
          category: item.category || 'Tips and tricks',
          title: item.title?.rendered || '',
          categorySlug: item.category_slug || '',
          date:
            item.formatted_date ||
            new Date(item.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
          content: item.content?.rendered || '',
        })),
        totalItems: result.totalItems,
        totalPages: result.totalPages,
      };
    },

    /**
     * Fetch FAQs and map to existing frontend format
     * @param {Object} params - Query parameters (e.g. { faq_category: 'slug' })
     * @returns {Promise<Array|null>}
     */
    async getFAQs(params = {}) {
      const data = await fetchJSON(`${CONFIG.CUSTOM_API}/faqs${buildQuery(params)}`);

      let items = [];
      if (Array.isArray(data)) {
        items = data;
      } else if (data && typeof data === 'object') {
        // Fallback if data is returned as an object
        items = Object.values(data);
      }

      if (!items || items.length === 0) return null;

      return items.map((item, index) => {
        const title = item.title?.rendered || item.question || '';
        const rawContent = item.content?.rendered || item.answer || item.content || '';
        const answer = typeof rawContent === 'string' ? rawContent.replace(/<[^>]*>/g, '') : '';

        return {
          id: item.id,
          number: String(index + 1).padStart(2, '0'),
          question: title,
          answer: answer,
        };
      });
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
        categoryName: item.category_name || '', // Human-readable category name
        menu_order: item.menu_order || 0,
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
        aggregatorUrl: item.aggregator_url || '',
      }));
    },

    /**
     * Fetch contact settings from WordPress options
     * @returns {Promise<Object|null>}
     */
    async getSettings() {
      return await fetchJSON(`${CONFIG.CUSTOM_API}/settings${buildQuery()}`);
    },

    /**
     * Fetch content categories
     * @returns {Promise<Array|null>}
     */
    async getCategories() {
      return await fetchJSON(`${CONFIG.CUSTOM_API}/categories${buildQuery()}`);
    },

    /**
     * Fetch instruction categories
     * @returns {Promise<Array|null>}
     */
    async getInstructionCategories() {
      return await fetchJSON(`${CONFIG.CUSTOM_API}/instruction-categories${buildQuery()}`);
    },

    /**
     * Fetch FAQ categories
     * @returns {Promise<Array|null>}
     */
    async getFAQCategories() {
      return await fetchJSON(`${CONFIG.CUSTOM_API}/faq-categories${buildQuery()}`);
    },

    /**
     * Fetch service categories
     * @returns {Promise<Array|null>}
     */
    async getServiceCategories() {
      return await fetchJSON(`${CONFIG.CUSTOM_API}/service-categories${buildQuery()}`);
    },

    /**
     * Fetch available languages from Polylang
     * @returns {Promise<Object|null>}
     */
    async getLanguages() {
      return await fetchJSON(`${CONFIG.CUSTOM_API}/languages${buildQuery()}`);
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
        categorySlug: data.category_slug || '',
        date:
          data.formatted_date ||
          new Date(data.date).toLocaleDateString('en-US', {
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
        categorySlug: data.category_slug || '',
        date:
          data.formatted_date ||
          new Date(data.date).toLocaleDateString('en-US', {
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
      if (apiWasAvailable) return true;
      try {
        const response = await fetch(`${CONFIG.API_BASE}`, {
          method: 'HEAD',
        });
        const isOk = response.ok;
        if (isOk) apiWasAvailable = true;
        return isOk;
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
