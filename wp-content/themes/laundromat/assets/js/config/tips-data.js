/**
 * Tips and Instructions Data
 *
 * Data is loaded from WordPress REST API.
 * Empty arrays are used as initial state while data loads.
 */

// Categories - loaded from API, with fallback
let CATEGORIES = [
  { key: 'all', label: 'All articles' },
];

// Sort options (static, no need for API)
const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'title-asc', label: 'Title A-Z' },
  { value: 'title-desc', label: 'Title Z-A' },
];

// Data arrays - start empty, loaded from API
let TIPS_DATA = [];
let INSTRUCTIONS_DATA = [];

// Flag to track if data has been loaded from API
let dataLoadedFromAPI = false;
let categoriesLoadedFromAPI = false;

/**
 * Load data from WordPress API
 * Call this function to refresh data from the backend
 */
async function loadDataFromAPI() {
  if (typeof LaundroAPI === 'undefined') {
    console.log('[Tips Data] LaundroAPI not available, cannot load data');
    // Dispatch event even with empty data so pages can handle it
    window.dispatchEvent(new CustomEvent('laundromatDataReady', {
      detail: { tips: TIPS_DATA, instructions: INSTRUCTIONS_DATA, fromAPI: false }
    }));
    return false;
  }

  try {
    console.log('[Tips Data] Loading data from WordPress API...');

    // Load categories, tips, and instructions in parallel
    const [categories, tips, instructions] = await Promise.all([
      LaundroAPI.getCategories(),
      LaundroAPI.getTips(),
      LaundroAPI.getInstructions()
    ]);

    if (categories && categories.length > 0) {
      CATEGORIES = categories;
      categoriesLoadedFromAPI = true;
      console.log('[Tips Data] Loaded', categories.length, 'categories from API');
    }

    if (tips && tips.length > 0) {
      TIPS_DATA = tips;
      console.log('[Tips Data] Loaded', tips.length, 'tips from API');
    }

    if (instructions && instructions.length > 0) {
      INSTRUCTIONS_DATA = instructions;
      console.log('[Tips Data] Loaded', instructions.length, 'instructions from API');
    }

    dataLoadedFromAPI = true;

    // Dispatch event when data is ready
    window.dispatchEvent(new CustomEvent('laundromatDataReady', {
      detail: { tips: TIPS_DATA, instructions: INSTRUCTIONS_DATA, categories: CATEGORIES, fromAPI: true }
    }));

    return true;
  } catch (error) {
    console.error('[Tips Data] Failed to load from API:', error);
    // Dispatch event even on error so pages can handle it
    window.dispatchEvent(new CustomEvent('laundromatDataReady', {
      detail: { tips: TIPS_DATA, instructions: INSTRUCTIONS_DATA, fromAPI: false, error: error.message }
    }));
    return false;
  }
}

/**
 * Check if data was loaded from API
 */
function isDataFromAPI() {
  return dataLoadedFromAPI;
}

/**
 * Check if categories were loaded from API
 */
function isCategoriesFromAPI() {
  return categoriesLoadedFromAPI;
}

// Auto-load from API when script is loaded
(function () {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadDataFromAPI);
  } else {
    // Small delay to ensure LaundroAPI is loaded
    setTimeout(loadDataFromAPI, 100);
  }
})();
