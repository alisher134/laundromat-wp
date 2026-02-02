document.addEventListener('DOMContentLoaded', async () => {
  // --- Fallback Data (used if API is unavailable) ---
  const FALLBACK_DATA = {
    title: 'Privacy Policy',
    content: '<p>Content is loading...</p>',
  };

  // --- Fetch Data from API ---
  let pageData = FALLBACK_DATA;

  try {
    if (typeof LaundroAPI !== 'undefined') {
      const apiData = await LaundroAPI.getPrivacyPolicy();
      if (apiData && (apiData.title || apiData.content)) {
        pageData = {
          title: apiData.title || 'Privacy Policy', // Fallback title
          content: apiData.content || '',
        };
      }
    }
  } catch (error) {
    console.error('[PrivacyPolicy] Failed to fetch data:', error);
  }

  // --- Render Article Header ---
  const headerContainer = document.getElementById('article-header');
  if (headerContainer) {
    headerContainer.innerHTML = `
      <div class="mb-8 md:mb-9 xl:mb-[46px] xl:flex xl:items-end xl:justify-between 2xl:mb-[56px]">
        <h1 class="animate-fade-up paragraph-heading-md text-text mb-8 max-w-[328px] md:mb-9 md:max-w-[576px] md:text-[45px] md:leading-[110%] xl:mb-0 xl:max-w-[614px] xl:text-[45px] 2xl:max-w-[1012px] 2xl:text-[64px]">
          ${pageData.title}
        </h1>
      </div>
    `;
  }

  // --- Render Article Content ---
  const contentContainer = document.getElementById('article-content');
  if (contentContainer) {
    // Add prose styling classes to the content
    contentContainer.innerHTML = `
      <div class="reveal-on-scroll prose prose-lg max-w-none
        prose-headings:text-text prose-headings:font-semibold
        prose-h2:text-lg prose-h2:leading-[168%] prose-h2:tracking-[-0.02em] prose-h2:mb-6
        md:prose-h2:text-[21px] md:prose-h2:mb-[46px]
        xl:prose-h2:text-2xl xl:prose-h2:leading-[156%]
        2xl:prose-h2:text-[28px] 2xl:prose-h2:mb-[56px]
        prose-h3:text-lg prose-h3:leading-[168%] prose-h3:tracking-[-0.02em] prose-h3:mb-[18px]
        md:prose-h3:text-[21px]
        xl:prose-h3:text-2xl xl:prose-h3:leading-[156%] xl:prose-h3:mb-[28px]
        2xl:prose-h3:text-[28px]
        prose-p:text-text prose-p:text-lg prose-p:leading-[168%] prose-p:font-normal prose-p:tracking-[-0.02em] prose-p:mb-6
        md:prose-p:text-[21px] md:prose-p:mb-[46px]
        xl:prose-p:text-2xl xl:prose-p:leading-[156%]
        2xl:prose-p:text-[26px] 2xl:prose-p:leading-[160%] 2xl:prose-p:mb-[56px]
        prose-a:text-text prose-a:underline
        prose-ul:text-text prose-ul:text-lg prose-ul:leading-[168%]
        md:prose-ul:text-[21px] xl:prose-ul:text-2xl 2xl:prose-ul:text-[26px]
        prose-ol:text-text prose-ol:text-lg prose-ol:leading-[168%]
        md:prose-ol:text-[21px] xl:prose-ol:text-2xl 2xl:prose-ol:text-[26px]
        prose-li:mb-2">
        ${pageData.content}
      </div>
    `;
  }

  // --- Scroll Reveal Observer ---
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  revealElements.forEach((el) => observer.observe(el));
});
