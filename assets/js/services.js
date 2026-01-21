document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initSlider();
  initCategories();
  initFaqAccordion();
});

function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1,
    },
  );

  document.querySelectorAll('.animate-fade-up').forEach((el) => observer.observe(el));
}

function initSlider() {
  const sliderEl = document.querySelector('.keen-slider');
  if (!sliderEl) return;

  // Based on Next.js config: { slides: { perView: 'auto', spacing: 16 } }
  new KeenSlider(sliderEl, {
    slides: {
      perView: 'auto',
      spacing: 8, // Using 8 (gap-2) to be safe or 16 if spacing is larger
    },
  });
}

function initCategories() {
  const allCategoryButtons = document.querySelectorAll('.keen-slider__slide, .category-btn');

  allCategoryButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;

      // Update UI for ALL buttons of this category across mobile/desktop
      allCategoryButtons.forEach((b) => {
        if (b.dataset.category === category) {
          // Active state matches Category.tsx logic:
          // activeClassName = 'border-transparent bg-brand/6 text-brand'
          b.classList.remove('border-text/20', 'text-text');
          b.classList.add('border-transparent', 'bg-brand/6', 'text-brand');
        } else {
          // Inactive state:
          // inactiveClassName = 'border-text/20 text-text'
          b.classList.remove('border-transparent', 'bg-brand/6', 'text-brand');
          b.classList.add('border-text/20', 'text-text');
        }
      });
    });
  });
}

function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    // Set initial closed state
    content.setAttribute('data-state', 'closed');

    trigger.addEventListener('click', () => {
      const isOpen = content.getAttribute('data-state') === 'open';

      if (isOpen) {
        // Close current item
        content.setAttribute('data-state', 'closed');
        if (icon) icon.style.transform = '';
      } else {
        // Close all other items first (single mode like Radix type="single")
        items.forEach((otherItem) => {
          if (otherItem !== item) {
            const otherContent = otherItem.querySelector('.faq-content');
            const otherIcon = otherItem.querySelector('.faq-icon');
            otherContent.setAttribute('data-state', 'closed');
            if (otherIcon) otherIcon.style.transform = '';
          }
        });

        // Open current item
        content.style.setProperty('--radix-accordion-content-height', content.scrollHeight + 'px');
        content.setAttribute('data-state', 'open');
        if (icon) icon.style.transform = 'rotate(45deg)'; // Plus becomes X
      }
    });
  });
}
