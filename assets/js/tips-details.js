document.addEventListener('DOMContentLoaded', () => {
  // --- Data ---
  const TIP_DETAIL_DATA = {
    id: 'winter-laundry-tips',
    title: '5 Amazingly simple laundry tips for winter clothes',
    category: 'Articles',
    date: 'April 20, 2023',
    mainImage: './assets/images/tips-6.png',
    introText:
      "Follow these seven laundry hacks and tips and you'll be able to breathe easy whether it's snowing or scorching outside!",
    subtitle: 'Top 7 Laundry Tips For Winter Clothes',
    tips: [
      {
        number: 1,
        title: 'Separate Your Laundry Carefully To Prevent Fabric Damage',
        description:
          "This laundry tip may seem like common sense, but it's important enough that it's worth repeating. When washing various fabrics in the same load, try to stick with fabrics that require the same amount of care. For instance, wool coats are oftentimes dry clean only while some fleece jackets can be washed on the gentle cycle in cold water without any problems whatsoever. By grouping like fabrics together, you'll be able to prevent the damage that can happen when certain types of fabric get too rough or too hot during the wash.",
      },
      {
        number: 2,
        title: 'Sort Clothes Into Light, Medium, And Heavy Fabrics',
        description:
          "Another tip that's particularly helpful in the winter is to sort your laundry into three different categories: light, medium, and heavy fabrics. The reason for this laundry tip is to distribute weight evenly among all of your laundry garments so that everything has a chance to agitate freely inside the washing machine. By sorting your clothes into categories, you'll avoid the problem of having too much weight on one side of your laundry load.",
      },
      {
        number: 3,
        title: 'Check The Care Instructions Before Washing',
        description:
          "Make sure that you are actually laundering your winter clothes correctly by reading the clothing labels carefully! Many coats, jackets, sweaters, and other winter clothes are [dry clean only](https://example.com). This means that they should not be washed at home with the rest of your laundry. If there is any doubt whether or not a garment can be machine washed, check for specific instructions on how to wash it – usually right on the label itself. If there are no instructions, then it's best to send that garment out to a professional dry cleaner or [laundry service](https://example.com).",
      },
      {
        number: 4,
        title: 'Clean Wool Clothing Properly',
        description:
          "Wool clothing needs special care during both the laundry process as well as drying – another laundry-related issue winter brings with it! To clean wool clothing, use cool or lukewarm water instead of hot water. Wool is an absorbent fabric that needs to be washed gently in order to prevent it from getting worn out or stretched out too much. When drying wool clothes, make sure they are hung up – never put them in the dryer! When it comes to washing them, make sure you read your clothing labels before putting any kind of wool garment in the laundry! Washing wool incorrectly can cause damage and shrinkage – not fun when you're trying to stay warm!",
      },
      {
        number: 5,
        title: 'Launder Your Cold Weather Accessories',
        description:
          "Another laundry tip that's important in the winter is to launder your cold-weather accessories like hats, scarves, mittens, and even leather gloves if need be! These accessories can easily pick up odors from being crammed into a drawer all winter long. Not only does this laundry tip keep your accessories from smelling awful all the time, but it also helps to extend their life by washing away any perspiration that may have seeped into them.",
      },
    ],
    secondImage: './assets/images/laundry-detergent-pods.png',
    bonusTip: {
      title: 'Bonus Tips! Protect Your Winter Coat During The Dryer Cycle With A Tennis Ball',
      items: [
        "Tennis balls aren't just for playing tennis! To protect your winter coat during the dryer cycle, simply toss one into the machine with your wet clothes. Tossing in a tennis ball will help to keep down any static cling while also protecting your garment from being stretched out of shape or torn by the tumbling of the dryer. The best part of this laundry hack is that it's free!",
        'Once the cycle is done, remove the coat and shake it out vigorously. The tennis balls will help fluff up your coat by restoring any lost volume while also protecting it from too much wear and tear!',
        "Of course, washing your winter clothes isn't rocket science but it can help to prevent some common problems like fabric damage or funky smells! With these seven surprisingly simple laundry tips for winter clothes, you'll have no problem keeping your wardrobe fresh all year long.",
      ],
    },
  };

  const TIPS_CATEGORIES = [
    { key: 'all', label: 'All articles' },
    { key: 'april292025', label: 'April 29, 2025' },
  ];

  const TIPS_SLIDES_DATA = [
    {
      key: 'tip-1',
      title: '5 Amazingly simple laundry tips for winter clothes',
      category: 'Articles',
      date: 'April 20, 2023',
      image: './assets/images/tips-1.png',
    },
    {
      key: 'tip-2',
      title: '5 Amazingly simple laundry tips for winter clothes',
      category: 'Articles',
      date: 'April 20, 2023',
      image: './assets/images/tips-2.png',
    },
    {
      key: 'tip-3',
      title: '5 Amazingly simple laundry tips for winter clothes',
      category: 'Articles',
      date: 'April 20, 2023',
      image: './assets/images/tips-3.png',
    },
  ];

  // --- Format Text with Links ---
  const parseLinks = (text) => {
    // Poor man's markdown link parser: [text](url) -> <a href="url">text</a>
    // And handles simple text without links
    if (!text) return '';
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    return text.replace(linkRegex, (match, linkText, url) => {
      const isExternal = url.startsWith('http');
      return `<a class="text-text mb-6 text-lg leading-[168%] font-normal tracking-[-0.02em] underline md:mb-[46px] md:text-[21px] xl:text-2xl xl:leading-[156%] 2xl:mb-[56px] 2xl:text-[26px] 2xl:leading-[160%]" href="${url}" ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''}>${linkText}</a>`;
    });
  };

  // --- Render Article Header ---
  const headerContainer = document.getElementById('article-header');
  if (headerContainer) {
    const categoriesHtml = TIPS_CATEGORIES.map((cat) => {
      const isActive = cat.key === 'all';
      // Base classes
      const baseClasses =
        'rounded-[12px] border px-[18px] py-[14px] text-sm leading-[132%] font-normal tracking-[-0.01em] cursor-pointer transition-all duration-200 active:scale-95';

      // State classes
      // If active: Brand text, Brand border, maybe slight BG?
      // If inactive: Text color, Transparent/Faint border, Hover effects
      const activeState = 'text-brand border-brand/40 bg-brand/5';
      const inactiveState = 'text-text border-text/20 hover:text-brand hover:border-brand/40';

      const currentClasses = isActive ? activeState : inactiveState;

      return `
            <button
              class="${baseClasses} ${currentClasses}"
              data-key="${cat.key}"
              type="button"
            >
              ${cat.label}
            </button>`;
    }).join('');

    headerContainer.innerHTML = `
            <div class="mb-8 md:mb-9 xl:mb-[46px] xl:flex xl:items-end xl:justify-between 2xl:mb-[56px]">
                <h1 class="animate-fade-up paragraph-heading-md text-text mb-8 max-w-[328px] md:mb-9 md:max-w-[576px] md:text-[45px] md:leading-[110%] xl:mb-0 xl:max-w-[614px] xl:text-[45px] 2xl:max-w-[1012px] 2xl:text-[64px]">
                  ${TIP_DETAIL_DATA.title}
                </h1>
                <div class="animate-fade-up delay-100 flex items-center gap-[6px] category-buttons">
                  ${categoriesHtml}
                </div>
            </div>
            <div class="animate-fade-up delay-200 relative h-[380px] w-full md:h-[380px] xl:h-[560px] 2xl:h-[910px]">
                <img
                  alt="${TIP_DETAIL_DATA.title}"
                  class="rounded-[6px] object-cover h-full w-full"
                  src="${TIP_DETAIL_DATA.mainImage}"
                />
            </div>
        `;

    // Category Interaction
    headerContainer.querySelectorAll('button[data-key]').forEach((btn) => {
      btn.addEventListener('click', () => {
        // Reset ALL buttons to inactive state
        headerContainer.querySelectorAll('button').forEach((b) => {
          b.classList.remove('text-brand', 'border-brand/40', 'bg-brand/5');
          b.classList.add('text-text', 'border-text/20', 'hover:text-brand', 'hover:border-brand/40');
        });

        // Set THIS button to active state
        btn.classList.add('text-brand', 'border-brand/40', 'bg-brand/5');
        btn.classList.remove('text-text', 'border-text/20', 'hover:text-brand', 'hover:border-brand/40');
      });
    });
  }

  // --- Render Article Content ---
  const contentContainer = document.getElementById('article-content');
  if (contentContainer) {
    const tipsHtml = TIP_DETAIL_DATA.tips
      .map(
        (tip) => `
            <div class="reveal-on-scroll mb-[86px] 2xl:mb-[120px]">
                <h3 class="text-text mb-[18px] text-lg leading-[168%] font-semibold tracking-[-0.02em] md:mb-[18px] md:text-[21px] xl:mb-[28px] xl:text-2xl xl:leading-[156%] 2xl:mb-[28px] 2xl:text-[28px]">
                  ${tip.number}. ${tip.title}
                </h3>
                <p class="text-text mb-[86px] text-lg leading-[168%] font-normal tracking-[-0.02em] md:mb-[56px] md:text-[21px] xl:mb-[86px] xl:text-2xl xl:leading-[156%] 2xl:mb-[86px] 2xl:text-[26px] 2xl:leading-[160%]">
                  ${parseLinks(tip.description)}
                </p>
            </div>
        `,
      )
      .join('');

    const bonusHtml = TIP_DETAIL_DATA.bonusTip
      ? `
            <div class="reveal-on-scroll mb-16 space-y-4 2xl:mb-[96px]">
              <h3 class="text-text mb-[10px] text-lg leading-[168%] font-semibold tracking-[-0.02em] md:mb-[10px] md:text-[21px] xl:mb-[20px] xl:text-2xl xl:leading-[156%] 2xl:mb-7 2xl:text-[28px]">
                ${TIP_DETAIL_DATA.bonusTip.title}
              </h3>
              <ul class="pl-6 2xl:pl-8">
                ${TIP_DETAIL_DATA.bonusTip.items
                  .map(
                    (item) => `
                  <li class="text-text mb-[10px] list-disc text-lg leading-[168%] font-normal tracking-[-0.02em] md:mb-[10px] md:text-[21px] xl:mb-[20px] xl:text-2xl xl:leading-[156%] 2xl:mb-6 2xl:text-[26px] 2xl:leading-[160%]">
                    ${parseLinks(item)}
                  </li>
                `,
                  )
                  .join('')}
              </ul>
            </div>
        `
      : '';

    const secondImageHtml = TIP_DETAIL_DATA.secondImage
      ? `
            <div class="reveal-on-scroll relative mb-[56px] h-[338px] w-full md:mb-[116px] md:h-[475px] xl:h-[475px] 2xl:mb-[48px] 2xl:h-[600px]">
                <img
                    alt="Laundry detergent"
                    class="rounded-[6px] object-cover 2xl:rounded-[12px] h-full w-full"
                    src="${TIP_DETAIL_DATA.secondImage}"
                />
            </div>
        `
      : '';

    contentContainer.innerHTML = `
            <p class="reveal-on-scroll text-text mb-[46px] text-2xl leading-[136%] font-normal tracking-[-0.02em] md:mb-16 md:text-4xl md:tracking-[-0.04em] xl:mb-[86px] xl:text-xl 2xl:mb-[72px] 2xl:text-[32px] 2xl:leading-[140%]">
                ${TIP_DETAIL_DATA.introText}
            </p>
            ${
              TIP_DETAIL_DATA.subtitle
                ? `
                <h2 class="reveal-on-scroll text-text mb-6 text-lg leading-[168%] font-semibold tracking-[-0.02em] md:mb-[46px] md:text-[21px] xl:text-2xl xl:leading-[156%] 2xl:mb-[56px] 2xl:text-[28px]">
                  ${TIP_DETAIL_DATA.subtitle}
                </h2>
            `
                : ''
            }
            <div>${tipsHtml}</div>
            ${secondImageHtml}
            ${bonusHtml}
        `;
  }

  // --- Render Slider Strings ---
  const createSlideHtml = (item, isMobile = false) => {
    const slideClass = 'keen-slider__slide';
    // Mobile Slide (TipsSlide.tsx)
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
                <a class="mt-auto flex items-center justify-between group" href="#">
                  <p class="text-text/60 paragraph-sm-default">${item.date}</p>
                  <span class="bg-brand/6 flex size-[41px] items-center justify-center rounded-[9px] group-hover:bg-brand/10 transition-colors">
                    <svg viewBox="0 0 9 9" fill="none" class="text-brand h-[7px] w-[8px]"><path d="M0.5 3.98242L7.56066 4.02154M7.56066 4.02154L4.25395 0.5M7.56066 4.02154L4.25395 7.54308" stroke="currentColor" stroke-linecap="round"/></svg>
                  </span>
                </a>
              </div>
            </article>
            `;
    }

    // Desktop Card (TipsCard.tsx)
    // Note: To replicate the 'scale' animation of framer-motion easily, we can add a hover effect or just basic styling.
    // For strict parity, implementing scroll-based scale is complex in pure JS without a library like GSAP or manual requestAnimationFrame.
    // I will implement the base consistent layout.
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
                 <a class="text-text hover:text-brand block cursor-pointer pl-6 text-lg leading-[132%] font-normal tracking-[-0.01em] transition-colors md:max-w-[390px] lg:mb-4 2xl:mb-[3px] 2xl:max-w-[515px] 2xl:text-2xl 2xl:leading-[136%] 2xl:tracking-[-0.02em]" href="#">
                    <span class="line-clamp-2">${item.title}</span>
                 </a>

                 <a class="flex items-center justify-between px-6 pb-6 2xl:px-8 group" href="#">
                    <p class="text-text/60 paragraph-sm-default 2xl:text-lg">${item.date}</p>
                    <span class="bg-brand/6 flex size-[41px] items-center justify-center rounded-[9px] 2xl:size-[57px] group-hover:bg-brand/10 transition-colors">
                        <svg viewBox="0 0 9 9" fill="none" class="text-brand h-[7px] w-[8px] 2xl:size-[10px]"><path d="M0.5 3.98242L7.56066 4.02154M7.56066 4.02154L4.25395 0.5M7.56066 4.02154L4.25395 7.54308" stroke="currentColor" stroke-linecap="round"/></svg>
                    </span>
                 </a>
             </div>
        </article>
        `;
  };

  // --- Initialize Sliders ---
  const mobileContainer = document.getElementById('keen-slider-mobile');
  const desktopContainer = document.getElementById('keen-slider-desktop');
  let sliderInstanceMobile = null;
  let sliderInstanceDesktop = null;

  if (mobileContainer) {
    mobileContainer.innerHTML = TIPS_SLIDES_DATA.map((item) => createSlideHtml(item, true)).join('');

    if (window.KeenSlider) {
      sliderInstanceMobile = new KeenSlider('#keen-slider-mobile', {
        slides: { perView: 'auto', spacing: 8 },
        breakpoints: {
          '(min-width: 768px)': { slides: { perView: 'auto', spacing: 16 } },
        },
      });
    }
  }

  if (desktopContainer) {
    desktopContainer.innerHTML = TIPS_SLIDES_DATA.map((item) => createSlideHtml(item, false)).join('');

    if (window.KeenSlider) {
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
      if (prevBtn)
        prevBtn.addEventListener('click', () => {
          // Trigger both or just the visible one? Usually logic detects viewport.
          // Assuming desktop buttons control desktop slider for now since they are hidden on mobile usually?
          // Wait, design shows "Blog" + arrows on top.
          // The arrows are visible on ALL screens in the HTML structure I copied?
          // No, "Slider Controls" div is inside the block "mt-[120px] mb-20".
          // In `RelatedArticlesSlider.tsx` logic:
          // onPrev checks `isDesktop`.
          // I will do the same check based on window width.
          if (window.innerWidth >= 1280) sliderInstanceDesktop.prev();
          else sliderInstanceMobile?.prev();
        });

      if (nextBtn)
        nextBtn.addEventListener('click', () => {
          if (window.innerWidth >= 1280) sliderInstanceDesktop.next();
          else sliderInstanceMobile?.next();
        });
    }
  }

  function updateSliderButtons(slider) {
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    if (!prevBtn || !nextBtn) return;
    const track = slider.track.details;
    if (!track) return;
    prevBtn.disabled = track.rel === 0;
    nextBtn.disabled = track.rel === track.slides.length - 1;
  }

  // Handle Resize for buttons state?
  // Ideally yes, but acceptable to skip for simple static migration if not strictly requested.

  // --- Scroll Reveal Observer ---
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Reveal once
      }
    });
  }, observerOptions);

  // Attach to existing elements (rendered above)
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  revealElements.forEach(el => observer.observe(el));

});