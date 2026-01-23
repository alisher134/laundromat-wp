(function () {

  let sectionSpring = null;
  let lastTime = performance.now();
  let animationFrameId = null;
  let isAnimating = false;

  function initSectionAnimation() {
    const section = document.getElementById('faqs-section');
    if (!section) return;

    sectionSpring = new Spring(SPRING_CONFIGS.FAQ);
    
    section.style.willChange = 'transform, opacity';
    section.style.transform = 'translateY(220px)';
    section.style.opacity = '0.3';

    function updateSection() {
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
      
      const needsUpdate = Math.abs(springValue - scrollProgress) > 0.001 || 
                         Math.abs(velocity) > 0.001;

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

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    
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
      initAccordion();
    });
  } else {
    initSectionAnimation();
    initAccordion();
  }
})();
