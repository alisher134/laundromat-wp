(function () {
  let sectionSpring = null;
  let lastTime = performance.now();
  let animationFrameId = null;
  let isAnimating = false;
  let faqSectionScrollListenersAdded = false;

  // Load FAQs from API and render them
  async function loadFAQsFromAPI() {
    if (typeof LaundroAPI === 'undefined') {
      console.log('[FAQ Section] LaundroAPI not available, keeping static content');
      initAccordion();
      return;
    }

    try {
      console.log('[FAQ Section] Loading FAQs from WordPress API...');
      const faqs = await LaundroAPI.getFAQs();

      if (faqs && faqs.length > 0) {
        console.log('[FAQ Section] Loaded', faqs.length, 'FAQs from API');
        renderFAQs(faqs);
        initAccordion();
      } else {
        console.log('[FAQ Section] No FAQs from API, keeping static content');
        initAccordion();
      }
    } catch (error) {
      console.error('[FAQ Section] Failed to load FAQs:', error);
      initAccordion();
    }
  }

  // Render FAQs into the accordion container
  function renderFAQs(faqs) {
    const container = document.getElementById('faq-accordion');
    if (!container) return;

    // Limit to 5 FAQs for the home page section
    const faqsToRender = faqs.slice(0, 5);

    const html = faqsToRender
      .map((faq, index) => {
        const number = String(index + 1).padStart(2, '0');
        return `
        <div
          class="faq-item group overflow-hidden rounded-[11px] border border-transparent bg-white backdrop-blur-[30px] md:rounded-[16px] xl:rounded-[11px] 2xl:rounded-[16px]"
          data-state="closed"
        >
          <div
            class="accordion-trigger flex cursor-pointer items-center justify-between pt-4 pr-3 pb-[17px] pl-4 text-left md:pt-[33px] md:pr-9 md:pb-9 md:pl-6 xl:pt-6 xl:pr-6 xl:pb-[25px] xl:pl-[22px] 2xl:pt-[33px] 2xl:pr-9 2xl:pb-9 2xl:pl-8"
          >
            <div class="flex w-full items-center justify-between">
              <div class="flex items-start md:gap-[54px] xl:gap-[104px] 2xl:gap-[143px] transition-transform duration-300 group-hover:scale-[1.02] origin-left">
                <span
                  class="text-brand/70 hidden leading-[132%] font-normal tracking-[-0.01em] md:block md:text-lg xl:text-sm 2xl:text-lg"
                >
                  ( ${number} )
                </span>
                <span
                  class="text-text max-w-[230px] text-base leading-[132%] font-normal tracking-[-0.02em] md:max-w-[448px] md:text-[21px] xl:text-base 2xl:max-w-[545px] 2xl:text-[21px]"
                >
                  ${faq.question}
                </span>
              </div>
              <span
                class="icon-box bg-brand/10 text-brand group-data-[state=open]:bg-brand/20 flex h-[40px] w-[40px] items-center justify-center rounded-[9px] transition-all duration-300 md:size-[55px] md:rounded-[12px] xl:size-[40px] 2xl:size-[55px] 2xl:rounded-[12px]"
              >
                <div
                  class="flex items-center justify-center transition-transform duration-300 group-data-[state=open]:rotate-45"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-[10px] w-[10px] transition-transform duration-300 md:h-[12px] md:w-[12px] xl:h-[10px] xl:w-[10px] 2xl:h-[12px] 2xl:w-[12px]"
                  >
                    <path
                      d="M6 1V11"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M1 6H11"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
              </span>
            </div>
          </div>
          <div
            class="accordion-content h-0 overflow-hidden bg-transparent opacity-0 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
          >
            <div class="flex items-start pl-4 pr-5 pt-0 pb-5 md:gap-[54px] md:pl-6 md:pr-6 md:pb-6 xl:gap-[104px] xl:pl-[22px] xl:pr-[22px] xl:pb-[25px] 2xl:gap-[143px] 2xl:pl-8 2xl:pr-8 2xl:pb-9">
              <span
                class="pointer-events-none hidden font-normal opacity-0 md:block md:text-lg xl:text-sm 2xl:text-lg"
                aria-hidden="true"
              >
                ( 00 )
              </span>
              <div class="text-text max-w-full text-base leading-[150%] font-normal tracking-[-0.01em] md:max-w-[448px] md:text-lg xl:max-w-[500px] xl:text-base 2xl:max-w-[680px] 2xl:text-lg">
                ${faq.answer || ''}
              </div>
            </div>
          </div>
        </div>
      `;
      })
      .join('');

    container.innerHTML = html;
  }

  function initSectionAnimation() {
    const section = document.getElementById('faqs-section');
    if (!section) return;

    sectionSpring = new Spring(SPRING_CONFIGS.FAQ);

    section.style.willChange = 'transform, opacity';
    section.style.transform = 'translateY(220px)';
    section.style.opacity = '0.3';

    function updateSection() {
      if (!document.contains(section)) {
        animationFrameId = null;
        isAnimating = false;
        section.style.willChange = 'auto';
        return;
      }
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      const scrollProgress = getScrollProgress(section);
      sectionSpring.setTarget(scrollProgress);
      const smoothProgress = sectionSpring.update(deltaTime);

      const y = transformProgress(smoothProgress, [0, 0.7], [220, 0]);
      const opacity = transformProgress(smoothProgress, [0, 0.5], [0.3, 1]);

      section.style.transform = `translateY(${y}px)`;
      section.style.opacity = opacity;

      // Check if spring needs more updates (matching Framer Motion behavior)
      const springValue = sectionSpring.getValue();
      const velocity = sectionSpring.velocity;

      const needsUpdate = Math.abs(springValue - scrollProgress) > 0.001 || Math.abs(velocity) > 0.001;

      if (needsUpdate) {
        animationFrameId = requestAnimationFrame(updateSection);
        isAnimating = true;
      } else {
        animationFrameId = null;
        isAnimating = false;
        section.style.willChange = 'auto';
      }
    }

    function onScroll() {
      if (!isAnimating && !animationFrameId) {
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(updateSection);
      }
    }

    if (!faqSectionScrollListenersAdded) {
      faqSectionScrollListenersAdded = true;
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
    }

    onScroll();
  }

  function initAccordion() {
    const items = document.querySelectorAll('#faq-accordion .faq-item');

    items.forEach((item) => {
      const trigger = item.querySelector('.accordion-trigger');
      const content = item.querySelector('.accordion-content');
      const iconBox = item.querySelector('.icon-box');
      const icon = iconBox ? iconBox.querySelector('div') : null;

      if (!trigger || !content) return;

      content.style.height = '0';
      content.style.opacity = '0';
      item.setAttribute('data-state', 'closed');

      trigger.addEventListener('click', () => {
        const isOpen = item.getAttribute('data-state') === 'open';

        items.forEach((otherItem) => {
          if (otherItem !== item && otherItem.getAttribute('data-state') === 'open') {
            const otherContent = otherItem.querySelector('.accordion-content');
            const otherIconBox = otherItem.querySelector('.icon-box');
            const otherIcon = otherIconBox ? otherIconBox.querySelector('div') : null;

            if (otherContent) {
              otherItem.setAttribute('data-state', 'closed');
              otherContent.style.height = '0';
              otherContent.style.opacity = '0';
              if (otherIcon) {
                otherIcon.style.transform = '';
              }
              if (otherIconBox) {
                otherIconBox.classList.remove('bg-brand/20');
                otherIconBox.classList.add('bg-brand/10');
              }
            }
          }
        });

        if (isOpen) {
          item.setAttribute('data-state', 'closed');
          content.style.height = '0';
          content.style.opacity = '0';
          if (icon) {
            icon.style.transform = '';
          }
          if (iconBox) {
            iconBox.classList.remove('bg-brand/20');
            iconBox.classList.add('bg-brand/10');
          }
        } else {
          item.setAttribute('data-state', 'open');
          const inner = content.querySelector('div');
          if (inner) {
            content.style.height = inner.offsetHeight + 'px';
          }
          content.style.opacity = '1';
          if (icon) {
            icon.style.transform = 'rotate(45deg)';
          }
          if (iconBox) {
            iconBox.classList.remove('bg-brand/10');
            iconBox.classList.add('bg-brand/20');
          }
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initSectionAnimation();
      loadFAQsFromAPI();
    });
  } else {
    initSectionAnimation();
    loadFAQsFromAPI();
  }
})();
