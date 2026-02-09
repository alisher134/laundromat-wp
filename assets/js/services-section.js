(function () {
  // Map card index to service category (normalized)
  const CARD_CATEGORIES = ['laundry', 'drying', 'specialCleaning'];

  /**
   * Normalize category name from API to frontend format
   * API returns: 'laundry-services-en', 'drying-services', 'special-cleaning'
   * Or URL-encoded Greek: '%cf%80%ce%bb%cf%8d%cf%83%ce%b9%ce%bc%ce%bf-%cf%81%ce%bf%cf%8d%cf%87%cf%89%ce%bd'
   * Frontend expects: 'laundry', 'drying', 'specialCleaning'
   */
  function normalizeCategory(apiCategory, categoryName = null) {
    if (!apiCategory) {
      console.warn('[Services Section] normalizeCategory: apiCategory is empty');
      return null;
    }
    
    // Decode URL-encoded category (for Greek characters)
    let decodedCategory = apiCategory;
    try {
      // Check if it's URL-encoded
      if (apiCategory.includes('%')) {
        decodedCategory = decodeURIComponent(apiCategory);
        console.log('[Services Section] normalizeCategory: decoded URL-encoded category', apiCategory, '->', decodedCategory);
      }
    } catch (e) {
      console.warn('[Services Section] normalizeCategory: failed to decode category:', apiCategory, e);
      decodedCategory = apiCategory;
    }
    
    // Use categoryName if available (it's already decoded)
    const textToCheck = categoryName ? categoryName.toLowerCase() : decodedCategory.toLowerCase();
    const category = textToCheck.trim();
    
    console.log('[Services Section] normalizeCategory: normalizing', apiCategory, '->', category, '(using categoryName:', categoryName, ')');
    
    // Map API categories to frontend categories
    // IMPORTANT: Check in order - more specific first to avoid false matches
    // Check for special cleaning FIRST (most specific)
    // Greek: "ειδικοί καθαρισμοί" or "ειδικοί-καθαρισμοί"
    if (category.includes('special') || 
        category.includes('cleaning') || 
        category.includes('ειδικό') || 
        category.includes('eidiko') ||
        category.includes('ειδικοί') ||
        category.includes('eidikoi') ||
        category.includes('καθαρισμό') || 
        category.includes('katharismo') ||
        category.includes('καθαρισμοί') ||
        category.includes('katharismoi') ||
        category.includes('ειδικός') ||
        category.includes('eidikos')) {
      console.log('[Services Section] normalizeCategory: ✅ matched specialCleaning');
      return 'specialCleaning';
    }
    // Check for drying SECOND (before laundry, as both contain "ρούχων")
    // Greek: "στέγνωμα ρούχων" or "στέγνωμα-ρούχων"
    if (category.includes('drying') || 
        category.includes('στεγνώσιμο') || 
        category.includes('stegnosimo') || 
        category.includes('dry') ||
        category.includes('στέγνωμα') ||
        category.includes('stegnoma') ||
        category.includes('στεγνώνω') ||
        category.includes('stegnono') ||
        category.includes('στέγνωση') ||
        category.includes('stegnosi')) {
      console.log('[Services Section] normalizeCategory: ✅ matched drying');
      return 'drying';
    }
    // Check for laundry LAST (least specific, contains "ρούχων" which also appears in drying)
    // Greek: "πλύσιμο ρούχων" or "πλύσιμο-ρούχων"
    // Must check for "πλύσιμο" specifically, not just "ρούχων"
    if (category.includes('laundry') || 
        category.includes('πλύσιμο') || 
        category.includes('plysimo')) {
      console.log('[Services Section] normalizeCategory: ✅ matched laundry');
      return 'laundry';
    }
    
    console.warn('[Services Section] normalizeCategory: ❌ NO MATCH for category:', apiCategory, '(decoded:', decodedCategory, ', categoryName:', categoryName, ')');
    return null;
  }

  /**
   * Fetch services from API and update all content (titles, descriptions, images, prices)
   * Only shows content if data is successfully loaded from WordPress
   */
  async function loadServices() {
    const serviceSection = document.getElementById('service-section');
    
    // Detect current language
    const isGreek = window.location.pathname.includes('/gr/');
    const currentLang = isGreek ? 'gr' : 'en';
    
    console.log('[Services Section] Current language:', currentLang, 'Path:', window.location.pathname);
    
    // Hide section initially - will show only after successful data load
    if (serviceSection) {
      serviceSection.style.opacity = '0';
      serviceSection.style.visibility = 'hidden';
    }

    if (typeof LaundroAPI === 'undefined') {
      console.error('[Services Section] LaundroAPI not available - showing static content');
      // Show static content if API is not available
      if (serviceSection) {
        serviceSection.style.opacity = '1';
        serviceSection.style.visibility = 'visible';
      }
      return;
    }

    try {
      console.log('[Services Section] Loading services from WordPress API...');
      const apiLang = LaundroAPI.getLanguage ? LaundroAPI.getLanguage() : currentLang;
      console.log('[Services Section] API language:', apiLang);
      
      const services = await LaundroAPI.getServices();
      console.log('[Services Section] API returned', services ? services.length : 0, 'services');
      
      if (!services || services.length === 0) {
        console.warn('[Services Section] No services returned from API - showing static content');
        // Show static content if no data from API
        if (serviceSection) {
          serviceSection.style.opacity = '1';
          serviceSection.style.visibility = 'visible';
        }
        return;
      }

      console.log('[Services Section] Loaded', services.length, 'services from API');
      
      // Log ALL service data to verify it's from WordPress
      console.log('[Services Section] ALL services from WordPress:', services.map(s => ({
        id: s.id,
        title: s.title,
        category: s.category,
        menu_order: s.menu_order,
        hasImage: !!s.image,
        hasDescription: !!s.description,
        priceRowsCount: s.priceRows ? s.priceRows.length : 0
      })));
      
      // Log raw categories to debug normalization
      console.log('[Services Section] Raw categories from WordPress:', services.map(s => s.category));
      
      // Log full service objects for debugging
      services.forEach((service, index) => {
        console.log(`[Services Section] Service ${index}:`, JSON.stringify({
          id: service.id,
          title: service.title,
          category: service.category,
          menu_order: service.menu_order
        }, null, 2));
      });

      // Sort services by menu_order from WordPress
      services.sort((a, b) => (a.menu_order || 0) - (b.menu_order || 0));
      console.log('[Services Section] Services sorted by menu_order:', services.map(s => ({ title: s.title, menu_order: s.menu_order, category: s.category })));

      // Map services by normalized category, preserving order from menu_order
      const servicesByCategory = {};
      const orderedCategories = []; // Track order based on menu_order
      
      services.forEach((service) => {
        console.log('[Services Section] Processing service:', {
          title: service.title,
          category: service.category,
          categoryName: service.categoryName,
          menu_order: service.menu_order
        });
        
        // Use categoryName if available (it's already decoded and human-readable)
        const normalizedCategory = normalizeCategory(service.category, service.categoryName);
        console.log('[Services Section] Normalized category:', service.category, '->', normalizedCategory);
        
        if (normalizedCategory) {
          // Only take the first service for each category (they're already sorted by menu_order)
          if (!servicesByCategory[normalizedCategory]) {
            servicesByCategory[normalizedCategory] = service;
            orderedCategories.push(normalizedCategory);
            console.log(`[Services Section] ✅ Mapped API category "${service.category}" (${service.categoryName || 'no name'}) to "${normalizedCategory}" (menu_order: ${service.menu_order})`);
          } else {
            console.log(`[Services Section] ⚠️ Category "${normalizedCategory}" already mapped, skipping duplicate`);
          }
        } else {
          console.error(`[Services Section] ❌ Failed to normalize category "${service.category}" (${service.categoryName || 'no name'}) for service "${service.title}"`);
        }
      });

      console.log('[Services Section] Mapped services by category:', Object.keys(servicesByCategory));
      console.log('[Services Section] Order based on menu_order:', orderedCategories);

      // Check if we have all required categories
      const hasAllCategories = CARD_CATEGORIES.every(cat => servicesByCategory[cat]);
      if (!hasAllCategories) {
        const missingCategories = CARD_CATEGORIES.filter(cat => !servicesByCategory[cat]);
        console.warn(`[Services Section] Missing required categories: ${missingCategories.join(', ')}`);
        console.warn('[Services Section] Available categories:', Object.keys(servicesByCategory));
        console.warn('[Services Section] Showing static content due to missing categories');
        // Show static content if categories are missing
        if (serviceSection) {
          serviceSection.style.opacity = '1';
          serviceSection.style.visibility = 'visible';
        }
        return;
      }

      // Determine card order based STRICTLY on WordPress menu_order
      // Use orderedCategories which already respects menu_order from WordPress
      // Only use categories that exist in both orderedCategories and CARD_CATEGORIES
      let cardOrder = [];
      
      // Build cardOrder strictly from orderedCategories (which respects menu_order)
      // This ensures the order matches WordPress exactly
      orderedCategories.forEach(cat => {
        if (CARD_CATEGORIES.includes(cat) && !cardOrder.includes(cat)) {
          cardOrder.push(cat);
        }
      });
      
      // If we don't have all 3 categories from WordPress, log a warning
      // but still use what we have (don't add from CARD_CATEGORIES as that would break WordPress order)
      if (cardOrder.length < CARD_CATEGORIES.length) {
        const missing = CARD_CATEGORIES.filter(cat => !cardOrder.includes(cat));
        console.warn(`[Services Section] Some categories missing from WordPress order: ${missing.join(', ')}`);
        console.warn('[Services Section] Using only categories that exist in WordPress with menu_order');
      }
      
      console.log('[Services Section] Card display order (STRICTLY based on WordPress menu_order):', cardOrder);
      console.log('[Services Section] Card 0 ->', cardOrder[0] || 'N/A', ', Card 1 ->', cardOrder[1] || 'N/A', ', Card 2 ->', cardOrder[2] || 'N/A');
      
      // Log the actual menu_order values for debugging
      cardOrder.forEach((cat, index) => {
        const service = servicesByCategory[cat];
        if (service) {
          console.log(`[Services Section] Card ${index} (${cat}): menu_order=${service.menu_order}, title="${service.title}"`);
        }
      });

      let cardsUpdated = 0;

      // Update desktop cards (with data-service-card attribute)
      // Cards are displayed in order based on WordPress menu_order
      const desktopCards = document.querySelectorAll('[data-service-card]');
      console.log('[Services Section] Found', desktopCards.length, 'desktop cards');
      
      // Sort cards by their data-service-card index to ensure correct order
      const sortedDesktopCards = Array.from(desktopCards).sort((a, b) => {
        const indexA = parseInt(a.getAttribute('data-service-card'), 10);
        const indexB = parseInt(b.getAttribute('data-service-card'), 10);
        return indexA - indexB;
      });

      sortedDesktopCards.forEach((card) => {
        const cardIndex = parseInt(card.getAttribute('data-service-card'), 10);
        // Use cardOrder which STRICTLY respects WordPress menu_order
        const category = cardOrder[cardIndex];
        
        if (!category) {
          console.warn(`[Services Section] No category mapped for card index ${cardIndex} - card will not be updated`);
          return;
        }
        
        const service = servicesByCategory[category];

        if (!service) {
          console.warn(`[Services Section] No service found for category "${category}" (card index ${cardIndex})`);
          return;
        }

        console.log(`[Services Section] Updating desktop card ${cardIndex} -> category "${category}" -> service:`, service.title, `(menu_order: ${service.menu_order})`);
        updateCard(card, service);
        cardsUpdated++;
      });

      // Update mobile cards (without data-service-card, in order)
      // Cards are displayed in order based on WordPress menu_order
      if (serviceSection) {
        const mobileCards = serviceSection.querySelectorAll('.lg\\:hidden');
        console.log('[Services Section] Found', mobileCards.length, 'mobile cards');
        
        // Mobile cards are in DOM order, so we use cardOrder which STRICTLY respects WordPress menu_order
        Array.from(mobileCards).forEach((card, index) => {
          const category = cardOrder[index];
          
          if (!category) {
            console.warn(`[Services Section] No category mapped for mobile card index ${index} - card will not be updated`);
            return;
          }
          
          const service = servicesByCategory[category];

          if (!service) {
            console.warn(`[Services Section] No service found for category "${category}" (mobile card index ${index})`);
            return;
          }

          console.log(`[Services Section] Updating mobile card ${index} -> category "${category}" -> service:`, service.title, `(menu_order: ${service.menu_order})`);
          updateCard(card, service);
          cardsUpdated++;
        });
      }

      // Only show section if at least some cards were updated
      if (cardsUpdated > 0 && serviceSection) {
        // Show section with smooth transition
        serviceSection.style.transition = 'opacity 0.3s ease-in-out, visibility 0.3s ease-in-out';
        serviceSection.style.opacity = '1';
        serviceSection.style.visibility = 'visible';
        console.log('[Services Section] ✅ SUCCESS: Content updated from WordPress API - section is now visible');
        console.log('[Services Section] ✅ Total cards updated:', cardsUpdated);
        
        // Verify that data was actually updated by checking DOM
        setTimeout(() => {
          const firstCard = document.querySelector('[data-service-card="0"]');
          if (firstCard) {
            const firstTitle = firstCard.querySelector('h3');
            if (firstTitle) {
              console.log('[Services Section] ✅ VERIFICATION: First card title in DOM:', firstTitle.textContent);
            }
          }
        }, 100);
      } else {
        console.error('[Services Section] ❌ FAILED: No cards were updated - showing static content');
        console.error('[Services Section] This means data from WordPress was NOT applied to the page');
        // Show static content if cards weren't updated (e.g., wrong language or missing categories)
        if (serviceSection) {
          serviceSection.style.opacity = '1';
          serviceSection.style.visibility = 'visible';
        }
      }
    } catch (error) {
      console.error('[Services Section] Error loading services:', error);
      console.warn('[Services Section] Showing static content due to error');
      // Show static content on error
      if (serviceSection) {
        serviceSection.style.opacity = '1';
        serviceSection.style.visibility = 'visible';
      }
    }
  }

  /**
   * Update a single service card with API data
   */
  function updateCard(card, service) {
    console.log('[Services Section] updateCard called for service:', {
      title: service.title,
      category: service.category,
      menu_order: service.menu_order,
      hasImage: !!service.image,
      hasDescription: !!service.description
    });
    
    // Update title - find ALL h3 elements in the card (mobile and desktop might have different structures)
    const titles = card.querySelectorAll('h3');
    let titleUpdated = false;
    
    console.log('[Services Section] Found', titles.length, 'h3 elements in card');
    
    if (titles.length === 0) {
      console.error('[Services Section] ❌ No h3 elements found in card! Card HTML:', card.outerHTML.substring(0, 200));
    }
    
    titles.forEach((title, index) => {
      if (service.title) {
        const oldText = title.textContent.trim();
        title.textContent = service.title;
        titleUpdated = true;
        console.log(`[Services Section] ✅ Updated h3[${index}]: "${oldText}" -> "${service.title}"`);
        
        // Verify the update worked
        setTimeout(() => {
          const currentText = title.textContent.trim();
          if (currentText !== service.title) {
            console.error(`[Services Section] ❌ Title update failed! Expected: "${service.title}", Got: "${currentText}"`);
          } else {
            console.log(`[Services Section] ✅ Verified: Title is now "${currentText}"`);
          }
        }, 50);
      } else {
        console.warn(`[Services Section] ⚠️ service.title is empty for h3[${index}]`);
      }
    });
    
    if (!titleUpdated) {
      console.error('[Services Section] ❌ No titles were updated!');
      console.error('[Services Section] Card structure:', card.innerHTML.substring(0, 500));
    }

    // Update description - find ALL description paragraphs
    // Mobile uses text-text/60, desktop uses text-text/80
    const descriptions = card.querySelectorAll('p[class*="text-text/60"], p[class*="text-text/80"]');
    
    // Fallback: find all paragraphs and check their classes
    let descriptionElements = Array.from(descriptions);
    if (descriptionElements.length === 0) {
      const allParagraphs = card.querySelectorAll('p');
      allParagraphs.forEach((p) => {
        const classes = p.className || '';
        if (classes.includes('text-text/60') || classes.includes('text-text/80')) {
          descriptionElements.push(p);
        }
      });
    }
    
    let descriptionUpdated = false;
    if (descriptionElements.length > 0 && service.description) {
      // Strip HTML tags from description
      const cleanDescription = service.description.replace(/<[^>]*>/g, '').trim();
      if (cleanDescription) {
        descriptionElements.forEach((desc) => {
          const oldText = desc.textContent.trim();
          desc.textContent = cleanDescription;
          descriptionUpdated = true;
          console.log('[Services Section] Updated description:', oldText.substring(0, 50) + '...', '->', cleanDescription.substring(0, 50) + '...');
        });
      }
    } else {
      if (descriptionElements.length === 0) {
        console.warn('[Services Section] Description element not found in card');
      } else if (!service.description) {
        console.warn('[Services Section] service.description missing');
      }
    }

    // Update image - find ALL images in the card
    const images = card.querySelectorAll('img');
    let imageUpdated = false;
    images.forEach((image) => {
      if (service.image) {
        const oldSrc = image.src;
        // Handle image loading errors
        image.onerror = function() {
          console.warn('[Services Section] Failed to load image:', service.image);
          // Keep the original image if loading fails
        };
        image.src = service.image;
        image.alt = service.title || 'Service';
        imageUpdated = true;
        console.log('[Services Section] Updated image:', oldSrc, '->', service.image);
      } else {
        console.warn('[Services Section] No image URL provided for service');
      }
    });
    
    if (images.length === 0) {
      console.warn('[Services Section] No img elements found in card');
    }

    // Update action link (Learn more button) - find ALL action links
    if (service.actionLink && service.actionLink.url) {
      const actionLinks = card.querySelectorAll('a.action-tile');
      let linkUpdated = false;
      actionLinks.forEach((link) => {
        const oldHref = link.href;
        link.href = service.actionLink.url;
        const linkText = link.querySelector('p');
        if (linkText && service.actionLink.text) {
          const oldText = linkText.textContent.trim();
          linkText.textContent = service.actionLink.text;
          console.log('[Services Section] Updated action link text:', oldText, '->', service.actionLink.text);
        }
        linkUpdated = true;
        console.log('[Services Section] Updated action link:', oldHref, '->', service.actionLink.url);
      });
      
      if (actionLinks.length === 0) {
        console.warn('[Services Section] No action-tile links found in card');
      }
    } else {
      console.warn('[Services Section] No actionLink data provided for service');
    }
    
    console.log('[Services Section] updateCard completed for:', service.title);

    // Update prices (both mobile static prices and desktop animated prices)
    if (service.priceRows && service.priceRows.length > 0) {
      // Find the lowest price and shortest time across all rows
      let minPrice = Infinity;
      let minTime = Infinity;
      let timeUnit = 'min';

      service.priceRows.forEach((row) => {
        if (row.price && parseFloat(row.price) < minPrice) {
          minPrice = parseFloat(row.price);
        }
        if (row.time && parseFloat(row.time) < minTime) {
          minTime = parseFloat(row.time);
          timeUnit = row.timeUnit || 'min';
        }
      });

      // Update all price displays (both mobile and desktop, both static and animated)
      const priceElements = card.querySelectorAll('p.text-text');
      priceElements.forEach((el) => {
        // Check if this is a price element by looking at its content or siblings
        const prevSibling = el.previousElementSibling;
        if (prevSibling && prevSibling.classList.contains('price-label')) {
          const labelText = prevSibling.textContent.trim();
          if (labelText === 'Price from' && minPrice !== Infinity) {
            el.textContent = `${minPrice} $`;
          } else if (labelText === 'Time from' && minTime !== Infinity) {
            el.textContent = `${minTime} ${timeUnit}`;
          }
        }
      });

      // Update desktop animated price info
      const priceInfo = card.querySelector('.service-price-info');
      if (priceInfo) {
        const priceValueEls = priceInfo.querySelectorAll('.price-value');
        if (priceValueEls.length >= 2) {
          if (minPrice !== Infinity) {
            priceValueEls[0].textContent = `${minPrice} $`;
          }
          if (minTime !== Infinity) {
            priceValueEls[1].textContent = `${minTime} ${timeUnit}`;
          }
        }
      }
    }
  }

  let serviceCardsScrollListenersAdded = false;

  function initServiceCards() {
    const cards = document.querySelectorAll('[data-service-card]');
    if (cards.length === 0) return;

    const entries = [];
    let lastTime = performance.now();
    let animationFrameId = null;

    cards.forEach((card, index) => {
      const imageWrapper = card.querySelector('.service-image-wrapper');
      const border = card.querySelector('[data-card-border]');

      if (!imageWrapper) return;

      // Set initial styles and CSS transition for fixed 250ms duration
      const breakpoint = getBreakpoint();
      const smallSize = CARD_SIZES.small[breakpoint];
      imageWrapper.style.height = `${smallSize.height}px`;
      imageWrapper.style.width = `${smallSize.width}px`;
      imageWrapper.style.transition = 'width 5500ms cubic-bezier(0.23, 1, 0.32, 1), height 2700ms cubic-bezier(0.23, 1, 0.32, 1)'; // Extremely slow, gradual expansion
      imageWrapper.style.willChange = 'height, width';

      if (border) {
        border.style.transition = 'transform 4000ms cubic-bezier(0.23, 1, 0.32, 1), opacity 4000ms ease-out';
        border.style.transformOrigin = 'left';
        border.style.transform = 'scaleX(0)';
        border.style.opacity = '0';
      }

      const entry = {
        card,
        imageWrapper,
        border,
        index,
        isExpanded: false,
      };

      entries.push(entry);
    });

    function updateCards() {
      const windowHeight = window.innerHeight;
      const breakpoint = getBreakpoint();

      entries.forEach((entry, i) => {
        if (!document.contains(entry.card)) return;

        const rect = entry.card.getBoundingClientRect();
        // Trigger as soon as the card top enters the viewport (plus a small buffer)
        const shouldExpand = rect.top < windowHeight - 50;

        if (shouldExpand !== entry.isExpanded) {
          entry.isExpanded = shouldExpand;
          const size = shouldExpand ? CARD_SIZES.large[breakpoint] : CARD_SIZES.small[breakpoint];

          // Force browser to apply both properties simultaneously
          requestAnimationFrame(() => {
            entry.imageWrapper.style.width = `${size.width}px`;
            entry.imageWrapper.style.height = `${size.height}px`;
          });

          // If this card expands, it potentially triggers the PREVIOUS card's border
          if (i > 0 && shouldExpand) {
            const prevEntry = entries[i - 1];
            if (prevEntry.border) {
              prevEntry.border.style.transform = 'scaleX(1)';
              prevEntry.border.style.opacity = '1';
            }
          } else if (i > 0 && !shouldExpand) {
            const prevEntry = entries[i - 1];
            if (prevEntry.border) {
              prevEntry.border.style.transform = 'scaleX(0)';
              prevEntry.border.style.opacity = '0';
            }
          }

          // Last card handles its own border
          if (i === entries.length - 1 && entry.border) {
            entry.border.style.transform = shouldExpand ? 'scaleX(1)' : 'scaleX(0)';
            entry.border.style.opacity = shouldExpand ? '1' : '0';
          }
        }
      });

      animationFrameId = null;
    }

    function onScroll() {
      if (!animationFrameId) {
        lastTime = performance.now(); // Reset lastTime to avoid huge deltaTime
        animationFrameId = requestAnimationFrame(updateCards);
      }
    }

    if (!serviceCardsScrollListenersAdded) {
      serviceCardsScrollListenersAdded = true;
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', () => {
        const breakpoint = getBreakpoint();
        entries.forEach((entry) => {
          if (!document.contains(entry.card)) return;
          const { imageWrapper } = entry;
          const smallSize = CARD_SIZES.small[breakpoint];
          imageWrapper.style.height = `${smallSize.height}px`;
          imageWrapper.style.width = `${smallSize.width}px`;
        });
        onScroll();
      });
    }

    onScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      loadServices();
      initServiceCards();
    });
  } else {
    loadServices();
    initServiceCards();
  }
})();
