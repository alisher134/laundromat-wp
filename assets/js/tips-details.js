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

      // Update document title for consistent sharing
      document.title = `${articleData.title} | Laundromat`;

      // Render the article
      renderArticleHeader();
      renderArticleContent();

      // Load related articles
      await loadRelatedArticles();

      // Initialize scroll reveal
      initScrollReveal();

      // Initialize share buttons after content is loaded
      renderShareButtons();
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
        relatedArticles = articles.filter((item) => item.key !== `${articleType}-${articleId}`).slice(0, 3);

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
    let content = articleData.content || '';

    // Remove empty paragraphs often returned by WordPress (<p>&nbsp;</p>)
    // Regex matches <p> followed by any amount of whitespace or &nbsp; followed by </p>
    content = content.replace(/<p>(\s|&nbsp;)*<\/p>/g, '');

    contentContainer.innerHTML = `
      <div class="reveal-on-scroll prose max-w-none">
        <div class="text-text text-base leading-[168%] font-normal tracking-[-0.02em] md:text-lg xl:text-xl xl:leading-[156%] 2xl:text-[22px] 2xl:leading-[160%]
          [&_p]:mb-6 [&_p]:md:mb-8 [&_p]:xl:mb-10
          [&_h2]:text-text [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:md:text-xl [&_h2]:xl:text-2xl
          [&_h3]:text-text [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:md:text-lg [&_h3]:xl:text-xl
          [&_ul]:pl-6 [&_ul]:mb-6 [&_ul_li]:list-disc [&_ul_li]:mb-2
          [&_ol]:pl-6 [&_ol]:mb-6 [&_ol_li]:list-decimal [&_ol_li]:mb-2
          [&_a]:text-brand [&_a]:underline
          [&_blockquote]:border-l-4 [&_blockquote]:border-brand [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6
          [&_img]:rounded-lg [&_figure]:m-0">
          ${content}
        </div>
      </div>
    `;

    // Apply styles to images manually
    styleImages(contentContainer);
  }

  function styleImages(container) {
    const images = container.querySelectorAll('img');
    images.forEach((img) => {
      // Unwrap image if it's inside a <p> tag that only contains images/whitespace
      const parent = img.parentElement;
      if (parent && parent.tagName === 'P') {
        const hasText = Array.from(parent.childNodes).some(
          (node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0,
        );

        // If the paragraph has no substantial text, it's just a wrapper -> unwrap it
        if (!hasText) {
          if (parent.parentNode) {
            parent.replaceWith(...parent.childNodes);
          }
        }
      }

      // Create wrapper for hero-style sizing
      const wrapper = document.createElement('div');
      // User provided classes
      wrapper.className =
        'relative mb-[56px] h-[338px] w-full md:mb-[116px] md:h-[475px] xl:h-[475px] 2xl:mb-[48px] 2xl:h-[600px]';

      // Insert wrapper before image
      if (img.parentNode) {
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);
      }

      // Apply styles to image to fill the wrapper
      img.classList.add('w-full', 'h-full', 'object-cover', 'rounded-[6px]', 'absolute', 'top-0', 'left-0');

      // Remove old margin classes and layout classes that conflict
      img.classList.remove(
        'my-8',
        'md:my-10',
        'xl:my-12',
        'my-12',
        'md:my-16',
        'xl:my-20',
        'max-w-full',
        'h-auto',
        'block',
        'static',
        'relative',
      );
    });
  }

  // --- Render Share Buttons ---
  function renderShareButtons() {
    // Select the container for share buttons matches: .xl:max-w-[144px] -> .flex (the wrapper for buttons)
    // Structure in HTML: <div class="xl:max-w-[144px]"> <h3>Share</h3> <div class="flex ..."> ... </div> </div>
    const shareWrapper = document.querySelector('.xl\\:max-w-\\[144px\\] .flex');

    if (!shareWrapper) {
      console.warn('[Tips] Share container wrapper not found');
      return;
    }

    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);

    // Common button classes
    const btnData =
      'border-text/16 text-brand flex size-[67px] items-center justify-center rounded-[12px] border cursor-pointer hover:border-brand hover:bg-brand/5 transition-all duration-300';

    // SVGs
    const tgIcon = `<svg class="h-[22px] w-[26px]" viewBox="0 0 26 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M19.916 21.7571C20.2648 22.0079 20.7144 22.0706 21.1152 21.9166C21.516 21.7615 21.8107 21.4139 21.8995 20.9926C22.8409 16.5002 25.1245 5.12947 25.9814 1.04296C26.0464 0.734964 25.9381 0.414864 25.6998 0.209163C25.4614 0.00346312 25.131 -0.0559371 24.8364 0.0551631C20.2941 1.76236 6.30529 7.09187 0.587584 9.24017C0.224676 9.37657 -0.0114854 9.73077 0.000430998 10.1191C0.0134307 10.5085 0.271258 10.8462 0.642833 10.9595C3.20702 11.7383 6.57286 12.8218 6.57286 12.8218C6.57286 12.8218 8.14583 17.6453 8.96589 20.0983C9.06881 20.4063 9.30605 20.6483 9.61913 20.7319C9.93112 20.8144 10.2648 20.7275 10.4977 20.5042C11.815 19.2414 13.8516 17.2889 13.8516 17.2889C13.8516 17.2889 17.7212 20.1698 19.916 21.7571ZM7.98875 12.2124L9.80762 18.3042L10.2117 14.4465C10.2117 14.4465 17.2391 8.01037 21.2452 4.34187C21.3622 4.23407 21.3784 4.05367 21.2809 3.92717C21.1845 3.80067 21.0069 3.77097 20.8736 3.85677C16.2306 6.86747 7.98875 12.2124 7.98875 12.2124Z" fill="currentColor"/></svg>`;

    const fbIcon = `<svg class="size-[26px]" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5656 0.00705096C6.00569 0.222635 0.485806 5.55476 0.0320985 12.136C-0.447609 19.0987 4.50677 24.9822 11.0576 25.9713V16.5287H8.95934C8.01552 16.5287 7.25111 15.7604 7.25111 14.8118C7.25111 13.8633 8.01552 13.095 8.95934 13.095H11.0563V10.8098C11.0563 7.02596 12.8906 5.3653 16.0197 5.3653C16.4839 5.3653 16.8804 5.37576 17.2171 5.39274C18.0439 5.43325 18.6848 6.12573 18.6848 6.95801C18.6848 7.82427 17.9867 8.5259 17.1248 8.5259H16.5502C15.2215 8.5259 14.7574 9.79197 14.7574 11.2187V13.0963H17.1885C17.9568 13.0963 18.5444 13.7849 18.4274 14.5479L18.287 15.4638C18.1921 16.0779 17.6669 16.5313 17.0481 16.5313H14.7574V26C21.1054 25.1337 26 19.6801 26 13.0662C26 5.70501 19.9432 -0.233358 12.5656 0.00705096Z" fill="currentColor"/></svg>`;

    const vkIcon = `<svg class="h-[20px] w-[31px]" viewBox="0 0 31 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M30.9483 4.12723C31.1918 4.7939 30.3978 6.32515 28.5661 8.72098C28.3121 9.05432 27.968 9.49702 27.5339 10.0491C27.1104 10.5804 26.8192 10.9554 26.6604 11.1741C26.5016 11.3929 26.3401 11.6507 26.176 11.9475C26.0119 12.2444 25.9484 12.4632 25.9855 12.6038C26.0225 12.7444 26.0913 12.9241 26.1919 13.1429C26.2925 13.3616 26.4645 13.5856 26.7081 13.8147C26.9516 14.0439 27.2533 14.3199 27.6133 14.6429C27.6556 14.6637 27.6821 14.6845 27.6927 14.7054C29.1855 16.0699 30.1966 17.221 30.726 18.1585C30.7577 18.2106 30.7922 18.2757 30.8292 18.3538C30.8663 18.4319 30.9033 18.5699 30.9404 18.7679C30.9774 18.9658 30.9748 19.1429 30.9324 19.2991C30.8901 19.4554 30.7577 19.5986 30.5354 19.7288C30.3131 19.859 30.0007 19.9241 29.5984 19.9241L25.5329 19.9866C25.2788 20.0387 24.9823 20.0126 24.6435 19.9085C24.3047 19.8043 24.0294 19.6897 23.8177 19.5647L23.5001 19.3772C23.1824 19.1585 22.8119 18.8252 22.3884 18.3772C21.9649 17.9293 21.6023 17.5257 21.3005 17.1663C20.9988 16.8069 20.6759 16.5048 20.3318 16.26C19.9877 16.0153 19.6886 15.9345 19.4345 16.0179C19.4027 16.0283 19.3604 16.0465 19.3074 16.0725C19.2545 16.0986 19.1645 16.1741 19.0375 16.2991C18.9104 16.4241 18.7966 16.5778 18.696 16.76C18.5954 16.9423 18.5054 17.2132 18.426 17.5725C18.3466 17.9319 18.3122 18.3356 18.3228 18.7835C18.3228 18.9397 18.3043 19.083 18.2672 19.2132C18.2302 19.3434 18.1905 19.4397 18.1481 19.5022L18.0846 19.5804C17.894 19.7783 17.6135 19.8929 17.2429 19.9241H15.4166C14.6649 19.9658 13.892 19.8798 13.0979 19.6663C12.3039 19.4528 11.6077 19.1767 11.0095 18.8382C10.4114 18.4996 9.8661 18.1559 9.37378 17.8069C8.88147 17.458 8.50826 17.1585 8.25416 16.9085L7.85713 16.5335C7.75126 16.4293 7.60568 16.2731 7.4204 16.0647C7.23512 15.8564 6.85662 15.3824 6.2849 14.6429C5.71318 13.9033 5.15204 13.1168 4.6015 12.2835C4.05095 11.4502 3.40247 10.3512 2.65606 8.98661C1.90964 7.62202 1.21881 6.20536 0.583568 4.73661C0.520044 4.56994 0.488281 4.42932 0.488281 4.31473C0.488281 4.20015 0.504162 4.11682 0.535925 4.06473L0.599449 3.97098C0.758261 3.77307 1.06 3.67411 1.50467 3.67411L5.85611 3.64286C5.98316 3.66369 6.10491 3.69754 6.22138 3.74442C6.33784 3.79129 6.42254 3.83557 6.47547 3.87723L6.55488 3.92411C6.72428 4.03869 6.85133 4.20536 6.93603 4.42411C7.14778 4.94494 7.39129 5.484 7.66656 6.0413C7.94183 6.59859 8.15888 7.02307 8.31769 7.31473L8.57178 7.76786C8.87882 8.39286 9.17527 8.93452 9.46113 9.39286C9.74699 9.85119 10.0037 10.208 10.2314 10.4632C10.459 10.7184 10.6787 10.9189 10.8904 11.0647C11.1022 11.2106 11.2822 11.2835 11.4304 11.2835C11.5786 11.2835 11.7215 11.2574 11.8592 11.2054C11.8804 11.1949 11.9068 11.1689 11.9386 11.1272C11.9704 11.0856 12.0339 10.971 12.1292 10.7835C12.2244 10.596 12.2959 10.3512 12.3436 10.0491C12.3912 9.74702 12.4415 9.32515 12.4944 8.78348C12.5474 8.24182 12.5474 7.59077 12.4944 6.83036C12.4733 6.41369 12.4256 6.03348 12.3515 5.68973C12.2774 5.34598 12.2033 5.1064 12.1292 4.97098L12.0339 4.78348C11.7692 4.42932 11.3192 4.20536 10.684 4.11161C10.5463 4.09077 10.5728 3.96577 10.7634 3.73661C10.9328 3.53869 11.1339 3.38244 11.3669 3.26786C11.928 2.99702 13.1932 2.87202 15.1625 2.89286C16.0306 2.90327 16.7453 2.97098 17.3064 3.09598C17.5182 3.14807 17.6955 3.21838 17.8384 3.30692C17.9814 3.39546 18.0899 3.52046 18.164 3.68192C18.2381 3.84338 18.2937 4.01004 18.3307 4.18192C18.3678 4.35379 18.3863 4.59077 18.3863 4.89286C18.3863 5.19494 18.381 5.4814 18.3705 5.75223C18.3599 6.02307 18.3466 6.39025 18.3307 6.8538C18.3149 7.31734 18.3069 7.74702 18.3069 8.14286C18.3069 8.25744 18.3016 8.47619 18.291 8.79911C18.2805 9.12202 18.2778 9.37202 18.2831 9.54911C18.2884 9.72619 18.3069 9.93713 18.3387 10.1819C18.3705 10.4267 18.4313 10.6298 18.5213 10.7913C18.6113 10.9528 18.7304 11.0804 18.8787 11.1741C18.9633 11.1949 19.0533 11.2158 19.1486 11.2366C19.2439 11.2574 19.3816 11.2002 19.5615 11.0647C19.7415 10.9293 19.9427 10.7496 20.165 10.5257C20.3874 10.3017 20.6626 9.95275 20.9908 9.4788C21.3191 9.00484 21.679 8.44494 22.0708 7.79911C22.706 6.71577 23.2724 5.5439 23.77 4.28348C23.8124 4.17932 23.8653 4.08817 23.9289 4.01004C23.9924 3.93192 24.0506 3.87723 24.1035 3.84598L24.1671 3.79911L24.2465 3.76004L24.4529 3.71317L24.7706 3.70536L29.3443 3.67411C29.7572 3.62202 30.096 3.63504 30.3607 3.71317C30.6254 3.79129 30.7895 3.87723 30.853 3.97098L30.9483 4.12723Z" fill="currentColor"/></svg>`;

    const copyIcon = `<svg class="size-[21px]" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.8982 12.1018C9.36397 12.5449 9.36397 13.2719 8.8982 13.715C8.45514 14.158 7.72808 14.158 7.28503 13.715C6.221 12.6493 5.62336 11.205 5.62336 9.6991C5.62336 8.1932 6.221 6.74885 7.28503 5.68322L11.3066 1.66167C12.3722 0.597633 13.8166 0 15.3225 0C16.8284 0 18.2727 0.597633 19.3383 1.66167C20.4024 2.7273 21 4.17164 21 5.67754C21 7.18344 20.4024 8.62779 19.3383 9.69342L17.6456 11.3861C17.657 10.4546 17.5093 9.52301 17.1912 8.63691L17.7252 8.09161C18.0436 7.77658 18.2965 7.4015 18.469 6.9881C18.6416 6.5747 18.7304 6.13119 18.7304 5.68322C18.7304 5.23526 18.6416 4.79174 18.469 4.37834C18.2965 3.96494 18.0436 3.58987 17.7252 3.27483C17.4101 2.95636 17.0351 2.70353 16.6217 2.53098C16.2083 2.35843 15.7647 2.26958 15.3168 2.26958C14.8688 2.26958 14.4253 2.35843 14.0119 2.53098C13.5985 2.70353 13.2234 2.95636 12.9084 3.27483L8.8982 7.28503C8.57972 7.60006 8.32689 7.97514 8.15434 8.38854C7.98179 8.80194 7.89295 9.24545 7.89295 9.69342C7.89295 10.1414 7.98179 10.5849 8.15434 10.9983C8.32689 11.4117 8.57972 11.7868 8.8982 12.1018ZM12.1018 7.28503C12.5449 6.84198 13.2719 6.84198 13.715 7.28503C14.779 8.35066 15.3766 9.795 15.3766 11.3009C15.3766 12.8068 14.779 14.2511 13.715 15.3168L9.69342 19.3383C8.62779 20.4024 7.18344 21 5.67754 21C4.17164 21 2.7273 20.4024 1.66167 19.3383C0.597633 18.2727 0 16.8284 0 15.3225C0 13.8166 0.597633 12.3722 1.66167 11.3066L3.35435 9.6139C3.34299 10.5454 3.49068 11.477 3.80877 12.3745L3.27483 12.9084C2.95636 13.2234 2.70353 13.5985 2.53098 14.0119C2.35843 14.4253 2.26958 14.8688 2.26958 15.3168C2.26958 15.7647 2.35843 16.2083 2.53098 16.6217C2.70353 17.0351 2.95636 17.4101 3.27483 17.7252C3.58987 18.0436 3.96494 18.2965 4.37834 18.469C4.79174 18.6416 5.23526 18.7304 5.68322 18.7304C6.13119 18.7304 6.5747 18.6416 6.9881 18.469C7.4015 18.2965 7.77658 18.0436 8.09161 17.7252L12.1018 13.715C12.4203 13.3999 12.6731 13.0249 12.8457 12.6115C13.0182 12.1981 13.1071 11.7545 13.1071 11.3066C13.1071 10.8586 13.0182 10.4151 12.8457 10.0017C12.6731 9.5883 12.4209 9.21323 12.1018 8.8982C11.9915 8.79481 11.9035 8.66988 11.8434 8.53115C11.7833 8.39241 11.7523 8.24282 11.7523 8.09161C11.7523 7.94041 11.7833 7.79081 11.8434 7.65208C11.9035 7.51334 11.9915 7.38842 12.1018 7.28503Z" fill="currentColor"/></svg>`;
    const checkIcon = `<svg class="size-[21px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

    // Generate HTML with buttons (using data attributes for popup URL)
    shareWrapper.innerHTML = `
      <div data-share-url="https://t.me/share/url?url=${url}&text=${title}" class="${btnData}">
        ${tgIcon}
      </div>
      <div data-share-url="https://www.facebook.com/sharer/sharer.php?u=${url}" class="${btnData}">
        ${fbIcon}
      </div>
      <div data-share-url="https://vk.com/share.php?url=${url}&title=${title}" class="${btnData}">
        ${vkIcon}
      </div>
      <div id="copy-link-btn" class="${btnData}">
        ${copyIcon}
      </div>
    `;

    // Function to open centered popup
    function openSharePopup(url) {
      const width = 600;
      const height = 400;
      const left = (window.innerWidth - width) / 2 + window.screenX;
      const top = (window.innerHeight - height) / 2 + window.screenY;

      window.open(url, 'shareWindow', `scrollbars=yes, width=${width}, height=${height}, top=${top}, left=${left}`);
    }

    // Attach Click Listeners for Share Buttons
    shareWrapper.querySelectorAll('[data-share-url]').forEach((btn) => {
      btn.addEventListener('click', () => {
        openSharePopup(btn.dataset.shareUrl);
      });
    });

    // Attach Copy Link Listener
    const copyBtn = document.getElementById('copy-link-btn');
    if (copyBtn) {
      copyBtn.onclick = async (e) => {
        e.preventDefault();
        try {
          await navigator.clipboard.writeText(window.location.href);
          // Visual feedback
          const originalContent = copyBtn.innerHTML;
          copyBtn.innerHTML = checkIcon;
          copyBtn.classList.add('bg-brand', 'text-white', 'border-brand');
          copyBtn.classList.remove('text-brand', 'border-text/16');
          setTimeout(() => {
            copyBtn.innerHTML = originalContent;
            copyBtn.classList.remove('bg-brand', 'text-white', 'border-brand');
            copyBtn.classList.add('text-brand', 'border-text/16');
          }, 2000);
        } catch (err) {
          console.error('Failed to copy link:', err);
        }
      };
    }
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
      mobileContainer.innerHTML = relatedArticles.map((item) => createSlideHtml(item, true)).join('');
    }

    if (desktopContainer) {
      desktopContainer.innerHTML = relatedArticles.map((item) => createSlideHtml(item, false)).join('');
    }

    initSliders();
  }

  // --- Create Slide HTML ---
  function createSlideHtml(item, isMobile = false) {
    const slideClass = 'keen-slider__slide';
    const detailUrl = `tips-details.html?id=${item.key.split('-')[1]}&type=${articleType}`;

    if (isMobile) {
      return `
        <article class="${slideClass} action-tile min-h-[418px] max-w-[324px] shrink-0 md:min-h-[386px] md:max-w-[379px]">
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
      <article class="${slideClass} action-tile rounded-[12px] bg-white/80 backdrop-blur-[30px] backdrop-filter lg:h-[278px] 2xl:h-[390px] 2xl:rounded-[16px] pt-6 lg:mb-[7px] 2xl:mb-[23px] 2xl:pt-8 flex flex-col justify-between">
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
          obs.unobserve(entry.target);
          const el = entry.target;
          requestAnimationFrame(() => {
            el.classList.add('is-visible');
          });
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach((el) => observer.observe(el));
  }

  // --- Initialize ---
  loadArticle();
});
