document.addEventListener('DOMContentLoaded', () => {
  // --- Data ---
  const PRIVACY_POLICY_DATA = {
    title: 'Privacy Policy',
    introText:
      "Follow these seven laundry hacks and tips and you'll be able to breathe easy whether it's snowing or scorching outside!",
    subtitle: 'Top 7 Laundry Tips For Winter Clothes',
    sections: [
      {
        title: '1. Separate Your Laundry Carefully To Prevent Fabric Damage',
        description:
          "This laundry tip may seem like common sense, but it's important enough that it's worth repeating. When washing various fabrics in the same load, try to stick with fabrics that require the same amount of care. For instance, wool coats are oftentimes dry clean only while some fleece jackets can be washed on the gentle cycle in cold water without any problems whatsoever. By grouping like fabrics together, you'll be able to prevent the damage that can happen when certain types of fabric get too rough or too hot during the wash.",
      },
      {
        title: '2. Sort Clothes Into Light, Medium, And Heavy Fabrics',
        description:
          "Another tip that's particularly helpful in the winter is to sort your laundry into three different categories: light, medium, and heavy fabrics. The reason for this laundry tip is to distribute weight evenly among all of your laundry garments so that everything has a chance to agitate freely inside the washing machine. By sorting your clothes into categories, you'll avoid the problem of having too much weight on one side of your laundry load.",
      },
      {
        title: '3. Check The Care Instructions Before Washing',
        description:
          "Make sure that you are actually laundering your winter clothes correctly by reading the clothing labels carefully! Many coats, jackets, sweaters, and other winter clothes are [dry clean only](https://example.com). This means that they should not be washed at home with the rest of your laundry. If there is any doubt whether or not a garment can be machine washed, check for specific instructions on how to wash it – usually right on the label itself. If there are no instructions, then it's best to send that garment out to a professional dry cleaner or [laundry service](https://example.com).",
      },
      {
        title: '4. Clean Wool Clothing Properly',
        description:
          "Wool clothing needs special care during both the laundry process as well as drying – another laundry-related issue winter brings with it! To clean wool clothing, use cool or lukewarm water instead of hot water. Wool is an absorbent fabric that needs to be washed gently in order to prevent it from getting worn out or stretched out too much. When drying wool clothes, make sure they are hung up – never put them in the dryer! When it comes to washing them, make sure you read your clothing labels before putting any kind of wool garment in the laundry! Washing wool incorrectly can cause damage and shrinkage – not fun when you're trying to stay warm!",
      },
      {
        title: '5. Launder Your Cold Weather Accessories',
        description:
          "Another laundry tip that's important in the winter is to launder your cold-weather accessories like hats, scarves, mittens, and even leather gloves if need be! These accessories can easily pick up odors from being crammed into a drawer all winter long. Not only does this laundry tip keep your accessories from smelling awful all the time, but it also helps to extend their life by washing away any perspiration that may have seeped into them.",
      },
    ],
  };

  // --- Format Text with Links (same as tips-details.js) ---
  const parseLinks = (text) => {
    if (!text) return '';
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    return text.replace(linkRegex, (match, linkText, url) => {
      const isExternal = url.startsWith('http');
      return `<a class="text-text mb-6 text-lg leading-[168%] font-normal tracking-[-0.02em] underline md:mb-[46px] md:text-[21px] xl:text-2xl xl:leading-[156%] 2xl:mb-[56px] 2xl:text-[26px] 2xl:leading-[160%]" href="${url}" ${isExternal ? 'target="_blank" rel="noopener noreferrer"' : ''}>${linkText}</a>`;
    });
  };

  // --- Render Article Header (same classes as tips-details.js) ---
  const headerContainer = document.getElementById('article-header');
  if (headerContainer) {
    headerContainer.innerHTML = `
      <div class="mb-8 md:mb-9 xl:mb-[46px] xl:flex xl:items-end xl:justify-between 2xl:mb-[56px]">
        <h1 class="animate-fade-up paragraph-heading-md text-text mb-8 max-w-[328px] md:mb-9 md:max-w-[576px] md:text-[45px] md:leading-[110%] xl:mb-0 xl:max-w-[614px] xl:text-[45px] 2xl:max-w-[1012px] 2xl:text-[64px]">
          ${PRIVACY_POLICY_DATA.title}
        </h1>
      </div>
    `;
  }

  // --- Render Article Content (same classes as tips-details.js) ---
  const contentContainer = document.getElementById('article-content');
  if (contentContainer) {
    const sectionsHtml = PRIVACY_POLICY_DATA.sections
      .map(
        (section) => `
            <div class="reveal-on-scroll mb-[86px] 2xl:mb-[120px]">
                <h3 class="text-text mb-[18px] text-lg leading-[168%] font-semibold tracking-[-0.02em] md:mb-[18px] md:text-[21px] xl:mb-[28px] xl:text-2xl xl:leading-[156%] 2xl:mb-[28px] 2xl:text-[28px]">
                  ${section.title}
                </h3>
                <p class="text-text mb-[86px] text-lg leading-[168%] font-normal tracking-[-0.02em] md:mb-[56px] md:text-[21px] xl:mb-[86px] xl:text-2xl xl:leading-[156%] 2xl:mb-[86px] 2xl:text-[26px] 2xl:leading-[160%]">
                  ${parseLinks(section.description)}
                </p>
            </div>
        `,
      )
      .join('');

    contentContainer.innerHTML = `
            ${
              PRIVACY_POLICY_DATA.subtitle
                ? `
                <h2 class="reveal-on-scroll text-text mb-6 text-lg leading-[168%] font-semibold tracking-[-0.02em] md:mb-[46px] md:text-[21px] xl:text-2xl xl:leading-[156%] 2xl:mb-[56px] 2xl:text-[28px]">
                  ${PRIVACY_POLICY_DATA.subtitle}
                </h2>
            `
                : ''
            }
            <div>${sectionsHtml}</div>
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
