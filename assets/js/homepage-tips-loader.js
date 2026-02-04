/**
 * Homepage Tips Loader
 *
 * Loads tips selected in WordPress admin for display on the homepage.
 * Replaces static tip cards with dynamically loaded content.
 */
(function () {
  // Only run on homepage
  const isHomepage =
    window.location.pathname === '/' ||
    window.location.pathname === '/index.html' ||
    window.location.pathname.endsWith('/laundromat-wp/') ||
    window.location.pathname.endsWith('/laundromat-wp/index.html') ||
    window.location.pathname.endsWith('/el/') ||
    window.location.pathname.endsWith('/el/index.html');

  if (!isHomepage) {
    return;
  }

  // Check if API is available
  if (typeof LaundroAPI === 'undefined') {
    console.log('[Homepage Tips] LaundroAPI not available, using static content');
    return;
  }

  /**
   * Create HTML for a desktop tip card
   */
  function createDesktopCardHtml(item, index) {
    // Make first card a big image card
    const isBigImage = index === 0;
    const bigImageClass = isBigImage ? 'lg:row-span-2' : '';
    const heightClass = isBigImage ? 'lg:h-[576px] 2xl:h-[796px]' : 'lg:h-[278px] 2xl:h-[390px]';
    const paddingClass = isBigImage ? 'p-0' : '';
    const link = 'tips-details.html?id=' + item.id;

    return `
      <article class="tips-card flex flex-col rounded-[12px] bg-white/80 backdrop-blur-[30px] backdrop-filter ${heightClass} 2xl:rounded-[16px] ${bigImageClass} ${paddingClass}" data-tip-index="${index}">
        ${
          isBigImage
            ? `
            <div class="relative h-[277px] w-full origin-top-left overflow-hidden lg:mb-10 2xl:mb-12 2xl:h-[390px] shrink-0">
              <img alt="${item.title}" class="scroll-scale-image rounded-t-[12px] object-cover object-top 2xl:rounded-t-[16px] w-full h-full origin-top-left" src="${item.image_large || item.image}" />
            </div>
          `
            : ''
        }

        <div class="flex items-start justify-between px-6 2xl:px-8 ${isBigImage ? 'mb-20 2xl:mb-[120px]' : 'pt-6 lg:mb-[7px] 2xl:mb-[23px] 2xl:pt-8'}">
          <div class="border-brand/40 text-brand rounded-[9px] border px-[13px] py-[9px] text-xs leading-[132%] font-normal tracking-[-0.01em] 2xl:rounded-[10px] 2xl:px-[18px] 2xl:py-[10px] 2xl:text-sm">
            ${item.category}
          </div>
          ${
            !isBigImage
              ? `
              <div class="relative h-[87px] w-[149px] shrink-0 overflow-hidden md:h-[99px] md:w-[149px] lg:h-[127px] lg:w-[186px] 2xl:h-[177px] 2xl:w-[258px]">
                <img alt="${item.title}" class="scroll-scale-image rounded-[6px] object-cover w-full h-full origin-top-left" src="${item.image}" />
              </div>
            `
              : ''
          }
        </div>

        <a class="text-text hover:text-brand block cursor-pointer pl-6 text-lg leading-[132%] font-normal tracking-[-0.01em] transition-colors md:max-w-[390px] lg:mb-4 2xl:mb-[3px] 2xl:max-w-[515px] 2xl:text-2xl 2xl:leading-[136%] 2xl:tracking-[-0.02em] ${isBigImage ? '2xl:max-w-[560px]' : ''}" href="${link}">
          <span class="line-clamp-2 ${isBigImage ? 'line-clamp-3' : ''}">${item.title}</span>
        </a>

        <a class="flex items-center justify-between px-6 pb-6 2xl:px-8 mt-auto" href="${link}">
          <p class="text-text/60 paragraph-sm-default 2xl:text-lg">${item.date}</p>
          <span class="bg-brand/6 flex size-[41px] items-center justify-center rounded-[9px] 2xl:size-[57px]">
            <svg class="text-brand h-[7px] w-[8px] 2xl:size-[10px]" viewBox="0 0 9 9" fill="none">
              <path d="M0.75009 0.750399L7.62744 7.87305M7.62744 7.87305L7.84096 1.08657M7.62744 7.87305L0.840964 8.08657" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </span>
        </a>
      </article>
    `;
  }

  /**
   * Create HTML for a mobile tip card
   */
  function createMobileCardHtml(item) {
    const link = 'tips-details.html?id=' + item.id;

    return `
      <article class="keen-slider__slide min-w-[300px] max-w-[300px] md:min-w-[379px] md:max-w-[379px]">
        <div class="flex h-full w-full flex-1 flex-col rounded-[16px] bg-white p-[20px] min-h-[418px] md:min-h-[386px]">
          <div class="flex justify-end">
            <div class="relative mb-[47px] h-[87px] w-[127px] md:mb-[35px] md:h-[99px] md:w-[149px]">
              <img
                alt="${item.title}"
                class="rounded-[6px] object-cover w-full h-full"
                src="${item.image}"
              />
            </div>
          </div>

          <div class="border-brand/40 text-brand mb-9 flex h-[33px] w-[123px] items-center justify-center rounded-[9px] border px-3 py-1 text-xs leading-[132%] font-normal tracking-[-0.01em] md:mb-[27px]">
            ${item.category}
          </div>

          <p class="text-text mb-[50px] line-clamp-3 max-w-[284px] text-lg leading-[132%] font-normal tracking-[-0.01em] md:mb-[27px]">
            ${item.title}
          </p>

          <a class="mt-auto flex items-center justify-between" href="${link}">
            <p class="text-text/60 paragraph-sm-default">${item.date}</p>

            <span class="bg-brand/6 flex size-[41px] items-center justify-center rounded-[9px]">
              <svg class="text-brand h-[7px] w-[8px]" viewBox="0 0 9 9" fill="none">
                <path d="M0.75009 0.750399L7.62744 7.87305M7.62744 7.87305L7.84096 1.08657M7.62744 7.87305L0.840964 8.08657" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </span>
          </a>
        </div>
      </article>
    `;
  }

  /**
   * Load and render homepage tips
   */
  async function loadHomepageTips() {
    try {
      console.log('[Homepage Tips] Starting to load tips from WordPress...');
      console.log('[Homepage Tips] API Base URL:', LaundroAPI ? 'Available' : 'NOT AVAILABLE');

      // Check if API is available
      const apiAvailable = await LaundroAPI.isAvailable();
      console.log('[Homepage Tips] API availability check:', apiAvailable);

      if (!apiAvailable) {
        console.warn('[Homepage Tips] WordPress API is not available, keeping static content');
        return;
      }

      // Fetch homepage tips from custom endpoint
      console.log('[Homepage Tips] Fetching from getHomepageTips()...');
      const tips = await LaundroAPI.getHomepageTips();
      console.log('[Homepage Tips] API Response:', tips);

      if (!tips) {
        console.warn('[Homepage Tips] API returned null, keeping static content');
        return;
      }

      if (tips.length === 0) {
        console.warn('[Homepage Tips] No tips returned from API. This could mean:');
        console.warn('  1. No tips have been published in WordPress yet');
        console.warn('  2. No tips have been selected in Homepage Settings');
        console.warn('  3. Language filter is blocking tips');
        console.warn('[Homepage Tips] Keeping static content');
        return;
      }

      console.log('[Homepage Tips] Successfully loaded', tips.length, 'tips');
      console.log('[Homepage Tips] First tip:', tips[0]);

      // Show all tips (previously limited to 5)
      const displayTips = tips;
      console.log('[Homepage Tips] Displaying', displayTips.length, 'tips');

      // Render desktop grid
      const desktopGrid = document.getElementById('tips-grid');
      if (desktopGrid) {
        console.log('[Homepage Tips] Found desktop grid element');
        const desktopHtml = displayTips.map((tip, index) => createDesktopCardHtml(tip, index)).join('');
        desktopGrid.innerHTML = desktopHtml;
        console.log('[Homepage Tips] ✓ Rendered desktop grid with', desktopGrid.children.length, 'cards');
      } else {
        console.warn('[Homepage Tips] Desktop grid element not found (#tips-grid)');
      }

      // Render mobile slider
      const mobileSlider = document.getElementById('tips-slider-mobile');
      if (mobileSlider) {
        console.log('[Homepage Tips] Found mobile slider element');
        const mobileHtml = displayTips.map(createMobileCardHtml).join('');
        mobileSlider.innerHTML = mobileHtml;
        console.log('[Homepage Tips] ✓ Rendered mobile slider with', mobileSlider.children.length, 'cards');

        // Trigger a custom event to notify that content has been updated
        window.dispatchEvent(new CustomEvent('homepageTipsLoaded'));
      } else {
        console.warn('[Homepage Tips] Mobile slider element not found (#tips-slider-mobile)');
      }

      // Dispatch event for animations to reinitialize
      setTimeout(() => {
        console.log('[Homepage Tips] Triggering scroll event for animations');
        window.dispatchEvent(new Event('scroll'));
      }, 100);

      console.log('[Homepage Tips] ✓ Load complete!');
    } catch (error) {
      console.error('[Homepage Tips] ❌ Failed to load tips:', error);
      console.error('[Homepage Tips] Error details:', error.message, error.stack);
      // Keep static content on error
    }
  }

  // Load tips when DOM is ready and API is available
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Small delay to ensure LaundroAPI is fully loaded
      setTimeout(loadHomepageTips, 200);
    });
  } else {
    // DOM already loaded, wait for API
    setTimeout(loadHomepageTips, 200);
  }
})();
