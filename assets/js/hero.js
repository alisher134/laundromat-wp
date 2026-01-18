// Hero section animations and viewport height
(function () {
  const header = document.getElementById('header');
  const heroSection = document.getElementById('hero-section');
  const heroTitle = document.getElementById('hero-title');
  const heroMap = document.getElementById('hero-map');

  // Only run if hero section exists (not on 404 page)
  if (!heroSection) return;

  let shouldAnimate = false;

  // Check if should play entrance animation
  if (window.scrollY < 50) {
    shouldAnimate = true;
    header.classList.add('hero-fade', 'hero-fade-3'); // 3.5s - appears first
    heroSection.classList.add('hero-entrance');
    heroTitle.classList.add('hero-fade', 'hero-fade-2'); // 4s - appears second
    heroMap.classList.add('hero-fade', 'hero-fade-0'); // 4.7s - appears last
  }

  // Set viewport height
  function setViewportHeight() {
    heroSection.style.height = window.innerHeight + 'px';
  }
  setViewportHeight();
  window.addEventListener('resize', setViewportHeight);
})();
