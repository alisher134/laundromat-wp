document.addEventListener('DOMContentLoaded', () => {
  // --- Get article ID and type from URL ---
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get('id');
  const articleType = urlParams.get('type') || 'tip'; // 'tip' or 'instruction'

  // Article data - loaded from API
  let articleData = null;
  let relatedArticles = [];

  // --- Load Article from API ---
  async function loadArticle() {
    if (!articleId) {
      showError('No article ID provided');
      return;
    }

    if (typeof LaundroAPI === 'undefined') {
      console.log('[Tips Details] LaundroAPI not available');
      showError('Unable to load article');
      return;
    }

    try {
      console.log('[Tips Details] Loading article ID:', articleId, 'Type:', articleType);

      // Load article based on type
      if (articleType === 'instruction') {
        articleData = await LaundroAPI.getInstructionById(parseInt(articleId));
      } else {
        articleData = await LaundroAPI.getTipById(parseInt(articleId));
      }

      if (!articleData) {
        showError('Article not found');
        return;
      }

      console.log('[Tips Details] Loaded article:', articleData.title);

      // Render the article
      renderArticleHeader();
      renderArticleContent();

      // Load related articles
      await loadRelatedArticles();

      // Initialize scroll reveal
      initScrollReveal();
    } catch (error) {
      console.error('[Tips Details] Failed to load article:', error);
      showError('Failed to load article');
    }
  }

  // --- Load Related Articles ---
  async function loadRelatedArticles() {
    try {
      // Load tips or instructions based on article type
      let articles;
      if (articleType === 'instruction') {
        articles = await LaundroAPI.getInstructions();
      } else {
        articles = await LaundroAPI.getTips();
      }

      if (articles && articles.length > 0) {
        // Filter out current article and take up to 3 related
        relatedArticles = articles
          .filter(item => item.key !== `${articleType}-${articleId}`)
          .slice(0, 3);

        renderSliders();
      }
    } catch (error) {
      console.error('[Tips Details] Failed to load related articles:', error);
    }
  }

  // --- Show Error State ---
  function showError(message) {
    const headerContainer = document.getElementById('article-header');
    const contentContainer = document.getElementById('article-content');

    if (headerContainer) {
      headerContainer.innerHTML = `
        <div class="text-center py-20">
          <h1 class="text-text text-2xl mb-4">${message}</h1>
          <a href="tips.html" class="text-brand underline">Back to Tips</a>
        </div>
      `;
    }

    if (contentContainer) {
      contentContainer.innerHTML = '';
    }
  }

  // --- Render Article Header ---
  function renderArticleHeader() {
    const headerContainer = document.getElementById('article-header');
    if (!headerContainer || !articleData) return;

    headerContainer.innerHTML = `
      <div class="mb-8 md:mb-9 xl:mb-[46px] xl:flex xl:items-end xl:justify-between 2xl:mb-[56px]">
        <h1 class="animate-fade-up paragraph-heading-md text-text mb-8 max-w-[328px] md:mb-9 md:max-w-[576px] md:text-[45px] md:leading-[110%] xl:mb-0 xl:max-w-[614px] xl:text-[45px] 2xl:max-w-[1012px] 2xl:text-[64px]">
          ${articleData.title}
        </h1>
        <div class="animate-fade-up delay-100 flex items-center gap-[6px]">
          <span class="border-brand/40 text-brand rounded-[12px] border px-[18px] py-[14px] text-sm leading-[132%] font-normal tracking-[-0.01em]">
            ${articleData.category}
          </span>
          <span class="text-text/60 rounded-[12px] border border-text/20 px-[18px] py-[14px] text-sm leading-[132%] font-normal tracking-[-0.01em]">
            ${articleData.date}
          </span>
        </div>
      </div>
      <div class="animate-fade-up delay-200 relative h-[380px] w-full md:h-[380px] xl:h-[560px] 2xl:h-[910px]">
        <img
          alt="${articleData.title}"
          class="rounded-[6px] object-cover h-full w-full"
          src="${articleData.image}"
        />
      </div>
    `;
  }

  // --- Render Article Content ---
  function renderArticleContent() {
    const contentContainer = document.getElementById('article-content');
    if (!contentContainer || !articleData) return;

    // WordPress content is already HTML, just display it
    const content = articleData.content || '';

    contentContainer.innerHTML = `
      <div class="reveal-on-scroll prose prose-lg max-w-none">
        <div class="text-text text-lg leading-[168%] font-normal tracking-[-0.02em] md:text-[21px] xl:text-2xl xl:leading-[156%] 2xl:text-[26px] 2xl:leading-[160%]
          [&>p]:mb-6 [&>p]:md:mb-8 [&>p]:xl:mb-10
          [&>h2]:text-text [&>h2]:mb-4 [&>h2]:mt-8 [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:md:text-2xl [&>h2]:xl:text-3xl
          [&>h3]:text-text [&>h3]:mb-3 [&>h3]:mt-6 [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:md:text-xl [&>h3]:xl:text-2xl
          [&>ul]:pl-6 [&>ul]:mb-6 [&>ul>li]:list-disc [&>ul>li]:mb-2
          [&>ol]:pl-6 [&>ol]:mb-6 [&>ol>li]:list-decimal [&>ol>li]:mb-2
          [&>a]:text-brand [&>a]:underline
          [&>blockquote]:border-l-4 [&>blockquote]:border-brand [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-6
          [&>img]:rounded-lg [&>img]:my-8">
          ${content}
        </div>
      </div>
    `;
  }

  // --- Render Sliders ---
  function renderSliders() {
    const mobileContainer = document.getElementById('keen-slider-mobile');
    const desktopContainer = document.getElementById('keen-slider-desktop');

    if (relatedArticles.length === 0) {
      // Hide slider section if no related articles
      const sliderSection = document.querySelector('.related-articles-section');
      if (sliderSection) sliderSection.style.display = 'none';
      return;
    }

    if (mobileContainer) {
      mobileContainer.innerHTML = relatedArticles.map(item => createSlideHtml(item, true)).join('');
    }

    if (desktopContainer) {
      desktopContainer.innerHTML = relatedArticles.map(item => createSlideHtml(item, false)).join('');
    }

    initSliders();
  }

  // --- Create Slide HTML ---
  function createSlideHtml(item, isMobile = false) {
    const slideClass = 'keen-slider__slide';
    const detailUrl = `tips-details.html?id=${item.key.split('-')[1]}&type=${articleType}`;

    if (isMobile) {
      return `
        <article class="${slideClass} min-h-[418px] max-w-[324px] shrink-0 md:min-h-[386px] md:max-w-[379px]">
          <div class="flex h-full w-full flex-1 flex-col rounded-[16px] bg-white p-[20px]">
            <div class="flex justify-end">
              <div class="relative mb-[47px] h-[87px] w-[127px] md:mb-[35px] md:h-[99px] md:w-[149px]">
                <img alt="${item.title}" class="rounded-[6px] object-cover h-full w-full" src="${item.image}" />
              </div>
            </div>
            <div class="border-brand/40 text-brand mb-9 flex h-[33px] w-[123px] items-center justify-center rounded-[9px] border px-3 py-1 text-xs leading-[132%] font-normal tracking-[-0.01em] md:mb-[27px]">
              ${item.category}
            </div>
            <p class="text-text mb-[50px] line-clamp-3 max-w-[284px] text-lg leading-[132%] font-normal tracking-[-0.01em] md:mb-[27px]">
              ${item.title}
            </p>
            <a class="mt-auto flex items-center justify-between group" href="${detailUrl}">
              <p class="text-text/60 paragraph-sm-default">${item.date}</p>
              <span class="bg-brand/6 flex size-[41px] items-center justify-center rounded-[9px] group-hover:bg-brand/10 transition-colors">
                <svg viewBox="0 0 9 9" fill="none" class="text-brand h-[7px] w-[8px]"><path d="M0.5 3.98242L7.56066 4.02154M7.56066 4.02154L4.25395 0.5M7.56066 4.02154L4.25395 7.54308" stroke="currentColor" stroke-linecap="round"/></svg>
              </span>
            </a>
          </div>
        </article>
      `;
    }

    return `
      <article class="${slideClass} rounded-[12px] bg-white/80 backdrop-blur-[30px] backdrop-filter lg:h-[278px] 2xl:h-[390px] 2xl:rounded-[16px] pt-6 lg:mb-[7px] 2xl:mb-[23px] 2xl:pt-8 flex flex-col justify-between">
        <div class="flex items-start justify-between px-6 2xl:px-8">
          <div class="border-brand/40 text-brand rounded-[9px] border px-[13px] py-[9px] text-xs leading-[132%] font-normal tracking-[-0.01em] 2xl:rounded-[10px] 2xl:px-[18px] 2xl:py-[10px] 2xl:text-sm">
            ${item.category}
          </div>
          <div class="relative h-[87px] md:h-[99px] md:w-[149px] lg:h-[127px] lg:w-[186px] 2xl:h-[177px] 2xl:w-[258px]">
            <img alt="${item.title}" class="rounded-[6px] object-cover h-full w-full" src="${item.image}" />
          </div>
        </div>
        <div class="mt-auto">
          <a class="text-text hover:text-brand block cursor-pointer pl-6 text-lg leading-[132%] font-normal tracking-[-0.01em] transition-colors md:max-w-[390px] lg:mb-4 2xl:mb-[3px] 2xl:max-w-[515px] 2xl:text-2xl 2xl:leading-[136%] 2xl:tracking-[-0.02em]" href="${detailUrl}">
            <span class="line-clamp-2">${item.title}</span>
          </a>
          <a class="flex items-center justify-between px-6 pb-6 2xl:px-8 group" href="${detailUrl}">
            <p class="text-text/60 paragraph-sm-default 2xl:text-lg">${item.date}</p>
            <span class="bg-brand/6 flex size-[41px] items-center justify-center rounded-[9px] 2xl:size-[57px] group-hover:bg-brand/10 transition-colors">
              <svg viewBox="0 0 9 9" fill="none" class="text-brand h-[7px] w-[8px] 2xl:size-[10px]"><path d="M0.5 3.98242L7.56066 4.02154M7.56066 4.02154L4.25395 0.5M7.56066 4.02154L4.25395 7.54308" stroke="currentColor" stroke-linecap="round"/></svg>
            </span>
          </a>
        </div>
      </article>
    `;
  }

  // --- Initialize Sliders ---
  let sliderInstanceMobile = null;
  let sliderInstanceDesktop = null;

  function initSliders() {
    const mobileContainer = document.getElementById('keen-slider-mobile');
    const desktopContainer = document.getElementById('keen-slider-desktop');

    if (mobileContainer && window.KeenSlider) {
      sliderInstanceMobile = new KeenSlider('#keen-slider-mobile', {
        slides: { perView: 'auto', spacing: 8 },
        breakpoints: {
          '(min-width: 768px)': { slides: { perView: 'auto', spacing: 16 } },
        },
        created(slider) {
          updateSliderButtons(slider);
        },
        slideChanged(slider) {
          updateSliderButtons(slider);
        },
      });
    }

    if (desktopContainer && window.KeenSlider) {
      sliderInstanceDesktop = new KeenSlider('#keen-slider-desktop', {
        slides: { perView: 2, spacing: 21 },
        breakpoints: {
          '(min-width: 1440px)': { slides: { perView: 2, spacing: 16 } },
        },
        created(slider) {
          updateSliderButtons(slider);
        },
        slideChanged(slider) {
          updateSliderButtons(slider);
        },
      });

      // Bind Buttons
      const prevBtn = document.getElementById('slider-prev');
      const nextBtn = document.getElementById('slider-next');

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          if (window.innerWidth >= 1280) sliderInstanceDesktop.prev();
          else sliderInstanceMobile?.prev();
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          if (window.innerWidth >= 1280) sliderInstanceDesktop.next();
          else sliderInstanceMobile?.next();
        });
      }
    }
  }

  function updateSliderButtons(slider) {
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    if (!prevBtn || !nextBtn) return;
    const track = slider.track.details;
    if (!track) return;

    prevBtn.disabled = track.rel === 0;
    prevBtn.setAttribute('aria-disabled', track.rel === 0);
    if (track.rel === 0) {
      prevBtn.classList.add('opacity-40');
    } else {
      prevBtn.classList.remove('opacity-40');
    }

    nextBtn.disabled = track.rel === track.slides.length - 1;
    nextBtn.setAttribute('aria-disabled', track.rel === track.slides.length - 1);
    if (track.rel === track.slides.length - 1) {
      nextBtn.classList.add('opacity-40');
    } else {
      nextBtn.classList.remove('opacity-40');
    }
  }

  // --- Scroll Reveal Observer ---
  function initScrollReveal() {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach((el) => observer.observe(el));
  }

  // --- Initialize ---
  loadArticle();
});
