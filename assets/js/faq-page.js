// FaqsSection initialization
(function () {
  const SPRING_CONFIG = { stiffness: 35, damping: 20, mass: 1.2 };

  // Spring physics simulation
  class Spring {
    constructor(config) {
      this.stiffness = config.stiffness;
      this.damping = config.damping;
      this.mass = config.mass;
      this.velocity = 0;
      this.current = 0;
      this.target = 0;
    }

    update(deltaTime) {
      const deltaTimeSeconds = deltaTime / 1000;
      const force = (this.target - this.current) * this.stiffness;
      const damping = this.velocity * this.damping;
      const acceleration = (force - damping) / this.mass;
      
      this.velocity += acceleration * deltaTimeSeconds;
      this.current += this.velocity * deltaTimeSeconds;
      
      if (Math.abs(this.target - this.current) < 0.001 && Math.abs(this.velocity) < 0.001) {
        this.current = this.target;
        this.velocity = 0;
      }
      
      return this.current;
    }

    setTarget(value) {
      this.target = value;
    }

    getValue() {
      return this.current;
    }
  }

  // Calculate scroll progress
  // Framer Motion offset: ['start end', 'start 0.5']
  // 'start end' = element start at viewport end (progress = 0)
  // 'start 0.5' = element start at 50% of viewport height (progress = 1)
  function getScrollProgress(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const elementStart = rect.top;
    
    // When element start is at viewport bottom: progress = 0
    // When element start is at 50% of viewport height: progress = 1
    const startPosition = windowHeight; // start end
    const endPosition = windowHeight * 0.5; // start 0.5
    
    const distance = startPosition - endPosition; // windowHeight * 0.5
    const currentPosition = elementStart;
    
    // Calculate progress: 0 when at bottom, 1 when at 50%
    let progress = 1 - (currentPosition - endPosition) / distance;
    progress = Math.max(0, Math.min(1, progress));
    
    return progress;
  }

  // Transform progress value
  function transformProgress(progress, inputRange, outputRange) {
    const [inputMin, inputMax] = inputRange;
    const [outputMin, outputMax] = outputRange;
    
    if (progress <= inputMin) return outputMin;
    if (progress >= inputMax) return outputMax;
    
    const inputRangeSize = inputMax - inputMin;
    const outputRangeSize = outputMax - outputMin;
    const normalizedProgress = (progress - inputMin) / inputRangeSize;
    
    return outputMin + normalizedProgress * outputRangeSize;
  }

  let sectionSpring = null;
  let lastTime = performance.now();
  let animationFrameId = null;

  // Initialize section scroll animation
  function initSectionAnimation() {
    const section = document.getElementById('faqs-section');
    if (!section) return;

    sectionSpring = new Spring(SPRING_CONFIG);

    function updateSection() {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;

      const scrollProgress = getScrollProgress(section);
      sectionSpring.setTarget(scrollProgress);
      const smoothProgress = sectionSpring.update(deltaTime);
      
      // Y: [0, 0.7] -> [220, 0]
      const y = transformProgress(smoothProgress, [0, 0.7], [220, 0]);
      
      // Opacity: [0, 0.5] -> [0.3, 1]
      const opacity = transformProgress(smoothProgress, [0, 0.5], [0.3, 1]);

      section.style.transform = `translateY(${y}px)`;
      section.style.opacity = opacity;

      if (Math.abs(sectionSpring.getValue() - scrollProgress) > 0.001) {
        animationFrameId = requestAnimationFrame(updateSection);
  } else {
        animationFrameId = null;
      }
    }

    function onScroll() {
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(updateSection);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Initialize accordion
  function initAccordion() {
    const items = document.querySelectorAll('#faq-accordion .faq-item');

    items.forEach((item) => {
      const trigger = item.querySelector('.accordion-trigger');
      const content = item.querySelector('.accordion-content');
      const iconBox = item.querySelector('.icon-box');
      const icon = iconBox ? iconBox.querySelector('div') : null;

      if (!trigger || !content) return;

      // Set initial closed state
      content.style.height = '0';
      content.style.opacity = '0';
      item.setAttribute('data-state', 'closed');

      trigger.addEventListener('click', () => {
        const isOpen = item.getAttribute('data-state') === 'open';

        // Close all other items (single mode)
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
          // Close current item
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
          // Open current item
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

  // Initialize on load
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
