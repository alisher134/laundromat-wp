// FAQ Configuration
const FAQ_CATEGORIES = [
  { key: 'general', label: 'General' },
  { key: 'prices', label: 'Prices and payment' },
  { key: 'location', label: 'Location' },
  { key: 'safety', label: 'Safety and convenience' },
];

const ALL_FAQ_SECTIONS = [
  {
    position: 1,
    title: 'How can I use the washing and drying machines at Laundromat?',
    content:
      'Our self-service washing and drying machines are very easy to use. Simply load your clothes, select a washing or drying cycle, insert coins, and press START. Read the full washing/drying instructions and what to avoid while using the machines here',
    category: 'general',
  },
  {
    position: 2,
    title: 'Do I need to bring my own detergent and other supplies, or are they available on-site for use?',
    content:
      'No, you do not need to bring detergent or any additional laundry supplies. All washing machines automatically dispense the required detergent during the wash cycle. Everything you need to do your laundry is available on-site at the laundromat.',
    category: 'general',
  },
  {
    position: 3,
    title: 'What are the prices for laundry and drying services at Laundromat?',
    // Placeholder content from config.ts
    content:
      'Our prices are competitive and displayed clearly on each machine. Please visit our location for current pricing information.',
    category: 'prices',
  },
  {
    position: 4,
    title: "What can't be washed at Laundromat?",
    content:
      'For safety and to protect the machines, please do not wash shoes, carpets or rugs, and pet equipment (such as beds, blankets, or accessories). Washing these items may damage the machines or affect wash quality for other customers.',
    category: 'general',
  },
  {
    position: 5,
    title: 'Can I wash large and bulky items such as blankets, duvets, or bed linen?',
    content:
      'Yes. Our machines are designed to handle large and bulky items, including duvets, blankets, bed linen, and pillows. For best results, please follow the recommended machine instructions and select the appropriate cycle.',
    category: 'general',
  },
  {
    position: 6,
    title: 'What are the operating hours of LAUNDROMAT, and is it open 24/7 or only at specific times?',
    content: 'We are open 7 days a week from 6:00 AM to 11:00 PM for your convenience.',
    category: 'location',
  },
  {
    position: 7,
    title: 'Is there video surveillance on the laundry area for security?',
    content: 'Yes, we have 24/7 video surveillance to ensure the safety of our customers and the facility.',
    category: 'safety',
  },
  {
    position: 8,
    title: 'What should I do if there are technical problems with the equipment?',
    content: 'If you encounter any issues, please call our support number listed on the wall or on the machines directly.',
    category: 'safety',
  },
];

// State
let activeCategory = 'all';

// DOM Elements
const categoryMobileList = document.getElementById('mobile-categories-slider');
const categoryDesktopList = document.getElementById('desktop-categories');
const faqAccordionContainer = document.getElementById('faq-accordion');
const emptyMessage = document.getElementById('empty-message');

// Icons
const PLUS_ICON = `
<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" class="h-[10px] w-[10px] transition-transform duration-300 md:h-[12px] md:w-[12px] xl:h-[10px] xl:w-[10px] 2xl:h-[12px] 2xl:w-[12px]">
  <path d="M6 1V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M1 6H11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

// Render Functions
function renderCategories() {
  const allCategories = [{ key: 'all', label: 'All' }, ...FAQ_CATEGORIES];

  const createButton = (key, label, isMobile) => {
    const isActive = key === activeCategory;
    const paddingClass = isMobile ? 'px-4 py-3' : 'px-6 py-4';
    const activeClass = isActive
      ? 'border-transparent bg-brand/6 text-brand'
      : 'border-text/20 text-text hover:border-brand/40';

    const btn = document.createElement('button');
    // Using exact classes from Category.tsx
    btn.className = `
      inline-flex cursor-pointer items-center justify-center rounded-[12px] border 
      text-base leading-[132%] font-normal tracking-[-0.01em] whitespace-nowrap 
      transition-colors duration-200 md:rounded-[16px] 2xl:text-lg
      min-w-fit ${paddingClass} ${activeClass}
    `;
    if (!isMobile) {
      btn.className += ' hidden text-sm md:block 2xl:text-lg'; // Desktop specific
    } else {
      btn.className += ' keen-slider__slide'; // Mobile slider class
    }

    btn.textContent = label;
    btn.onclick = () => {
      activeCategory = key;
      renderCategories(); // Re-render buttons to update active state
      renderAccordion(); // Re-render items
      handleEmptyState();
    };
    return btn;
  };

  // Clear existing
  categoryMobileList.innerHTML = '';
  categoryDesktopList.innerHTML = '';

  allCategories.forEach(({ key, label }) => {
    categoryMobileList.appendChild(createButton(key, label, true));
    categoryDesktopList.appendChild(createButton(key, label, false));
  });
}

function renderAccordion() {
  const filteredSections =
    activeCategory === 'all' ? ALL_FAQ_SECTIONS : ALL_FAQ_SECTIONS.filter((s) => s.category === activeCategory);

  faqAccordionContainer.innerHTML = '';

  filteredSections.forEach((section) => {
    const item = document.createElement('div');
    // Classes from FaqAccordion.tsx AccordionItem
    item.className =
      'group overflow-hidden rounded-[11px] bg-white backdrop-blur-[30px] md:rounded-[16px] xl:rounded-[11px] 2xl:rounded-[16px] border border-transparent';
    item.setAttribute('data-state', 'closed');

    const formatIndex = (i) => i.toString().padStart(2, '0');

    item.innerHTML = `
      <div class="accordion-trigger flex cursor-pointer items-center justify-between pt-4 pr-3 pb-[17px] pl-4 text-left md:pt-[33px] md:pr-9 md:pb-9 md:pl-6 xl:pt-6 xl:pr-6 xl:pb-[25px] xl:pl-[22px] 2xl:pt-[33px] 2xl:pr-9 2xl:pb-9 2xl:pl-8">
        <div class="flex w-full items-center justify-between">
          <div class="flex items-start md:gap-[58px] xl:gap-[143px] 2xl:gap-[200px]">
            <span class="text-brand/70 hidden leading-[132%] font-normal tracking-[-0.01em] md:block md:text-lg xl:text-sm 2xl:text-lg">
              ( ${formatIndex(section.position)} )
            </span>
            <span class="text-text max-w-[230px] text-base leading-[132%] font-normal tracking-[-0.02em] md:max-w-[448px] md:text-[21px] xl:text-base 2xl:max-w-[545px] 2xl:text-[21px]">
              ${section.title}
            </span>
          </div>

          <span class="icon-box bg-brand/10 text-brand flex h-[40px] w-[40px] items-center justify-center rounded-[9px] transition-all duration-300 group-data-[state=open]:bg-brand/20 md:size-[55px] md:rounded-[12px] xl:size-[40px] 2xl:size-[55px] 2xl:rounded-[12px]">
            <div class="transition-transform duration-300 group-data-[state=open]:rotate-45 flex items-center justify-center">
              ${PLUS_ICON}
            </div>
          </span>
        </div>
      </div>
      
      <div class="accordion-content bg-transparent overflow-hidden h-0 opacity-0 transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]">
        <div class="text-text px-5 pb-5 text-base leading-[150%] font-normal tracking-[-0.01em] pt-0">
          ${section.content}
        </div>
      </div>
    `;

    // Click Event
    const trigger = item.querySelector('.accordion-trigger');
    trigger.addEventListener('click', () => toggleAccordion(item));

    faqAccordionContainer.appendChild(item);
  });
}

function toggleAccordion(clickedItem) {
  const allItems = faqAccordionContainer.children;
  const isOpening = clickedItem.getAttribute('data-state') === 'closed';

  // Close all
  Array.from(allItems).forEach((item) => {
    if (item !== clickedItem && item.getAttribute('data-state') === 'open') {
      item.setAttribute('data-state', 'closed');
      const content = item.querySelector('.accordion-content');
      content.style.height = '0px';
      content.style.opacity = '0';
    }
  });

  // Toggle clicked
  if (isOpening) {
    clickedItem.setAttribute('data-state', 'open');
    const content = clickedItem.querySelector('.accordion-content');
    const inner = content.children[0];

    content.style.height = inner.offsetHeight + 'px';
    content.style.opacity = '1';
  } else {
    clickedItem.setAttribute('data-state', 'closed');
    const content = clickedItem.querySelector('.accordion-content');

    content.style.height = '0px';
    content.style.opacity = '0';
  }
}

function handleEmptyState() {
  const filteredSections =
    activeCategory === 'all' ? ALL_FAQ_SECTIONS : ALL_FAQ_SECTIONS.filter((s) => s.category === activeCategory);

  if (filteredSections.length === 0) {
    emptyMessage.classList.remove('hidden');
    requestAnimationFrame(() => {
      emptyMessage.classList.remove('opacity-0', 'translate-y-[100px]');
    });
  } else {
    emptyMessage.classList.add('hidden');
    emptyMessage.classList.add('opacity-0', 'translate-y-[100px]');
  }
}

// Animations based on Viewport (Intersection Observer)
function initAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          // Clean up the entrance classes to trigger the transition
          el.classList.remove('opacity-0', 'translate-y-[100px]', 'translate-y-[80px]', 'translate-y-[150px]');
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.1, rootMargin: '-50px' },
  );

  const targets = [
    document.getElementById('faq-title'),
    document.getElementById('categories-wrapper'),
    document.getElementById('accordion-container-wrapper'),
  ];

  targets.forEach((el) => {
    if (el) observer.observe(el);
  });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  renderCategories();
  renderAccordion();
  initAnimations();
});
