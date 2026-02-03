/**
 * Tips and Instructions Data
 *
 * Data is loaded from WordPress REST API.
 * Empty arrays are used as initial state while data loads.
 */

// Detect language
const isGreek = window.location.pathname.includes('/el/');
const lang = isGreek ? 'el' : 'en';

const TRANSLATIONS = {
  en: {
    all_articles: 'All articles',
    latest: 'Latest',
    oldest: 'Oldest',
    title_asc: 'Title A-Z',
    title_desc: 'Title Z-A',
    sort_by: 'Sort by',
  },
  el: {
    all_articles: 'Όλα τα άρθρα',
    latest: 'Πιο πρόσφατα',
    oldest: 'Πιο παλιά',
    title_asc: 'Τίτλος Α-Ω',
    title_desc: 'Τίτλος Ω-Α',
    sort_by: 'Ταξινόμηση',
  },
};

const t = TRANSLATIONS[lang];
let SORT_BY_LABEL = t.sort_by;

// Categories - loaded from API, with fallback
let CATEGORIES = [{ key: 'all', label: t.all_articles }];

// Sort options (static, no need for API)
const SORT_OPTIONS = [
  { value: 'latest', label: t.latest },
  { value: 'oldest', label: t.oldest },
  { value: 'title-asc', label: t.title_asc },
  { value: 'title-desc', label: t.title_desc },
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
    window.dispatchEvent(
      new CustomEvent('laundromatDataReady', {
        detail: { tips: TIPS_DATA, instructions: INSTRUCTIONS_DATA, fromAPI: false },
      }),
    );
    return false;
  }

  try {
    console.log('[Tips Data] Loading data from WordPress API...');

    // Detect if we are on instructions page
    const isInstructionsPage =
      window.location.pathname.includes('instructions.html') ||
      window.location.href.includes('instructions.html') ||
      (document.querySelector('h1') && document.querySelector('h1').textContent.trim() === 'Instructions') ||
      (document.querySelector('h1') && document.querySelector('h1').textContent.trim() === 'Οδηγίες');

    const categoriesPromise =
      isInstructionsPage && LaundroAPI.getInstructionCategories
        ? LaundroAPI.getInstructionCategories()
        : LaundroAPI.getCategories();

    // Load categories, tips, and instructions in parallel
    const [categories, tips, instructions] = await Promise.all([
      categoriesPromise,
      LaundroAPI.getTips(),
      LaundroAPI.getInstructions(),
    ]);

    if (categories && categories.length > 0) {
      // Fix "All articles" translation - override API label with client-side translation
      const allCategory = categories.find((c) => c.key === 'all');
      if (allCategory) {
        allCategory.label = t.all_articles;
      }

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
    window.dispatchEvent(
      new CustomEvent('laundromatDataReady', {
        detail: { tips: TIPS_DATA, instructions: INSTRUCTIONS_DATA, categories: CATEGORIES, fromAPI: true },
      }),
    );

    return true;
  } catch (error) {
    console.error('[Tips Data] Failed to load from API:', error);
    // Dispatch event even on error so pages can handle it
    window.dispatchEvent(
      new CustomEvent('laundromatDataReady', {
        detail: { tips: TIPS_DATA, instructions: INSTRUCTIONS_DATA, fromAPI: false, error: error.message },
      }),
    );
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
