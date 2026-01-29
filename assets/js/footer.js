document.addEventListener('DOMContentLoaded', () => {
  const footer = document.querySelector('footer');
  const formContainer = document.getElementById('footer-form-container');
  const newsletterForm = document.getElementById('newsletter-form');
  const bottomBar = document.getElementById('footer-bottom-bar');

  if (!footer || !formContainer || !bottomBar || !newsletterForm) return;

  // Spring physics constants matching Next.js (stiffness: 80, damping: 25, mass: 0.8)
  const springConfig = {
    stiffness: 80,
    damping: 25,
    mass: 0.8,
  };

  const state = {
    current: 0,
    target: 0,
    velocity: 0,
  };

  let lastTime = performance.now();

  const applyStyles = (progress) => {
    // Form Width: 0 -> 60%, 1 -> 100%
    // In framer-motion: [0, 1] -> ['60%', '100%']
    const widthPercentage = 60 + 40 * progress;
    newsletterForm.style.width = widthPercentage + '%';

    // Bottom Block Scale: 0.8 -> 0.85, 1 -> 1
    // In framer-motion: [0.8, 1] -> [0.85, 1]
    let scale = 0.85;
    if (progress >= 0.8) {
      // normalize 0.8-1 range to 0-1
      const subProgress = (progress - 0.8) / 0.2;
      scale = 0.85 + 0.15 * subProgress;
    }
    // Also clamp simply to avoid going below 0.85 if spring undershoots < 0.8
    if (scale < 0.85) scale = 0.85;

    bottomBar.style.transform = `scaleX(${scale})`;
  };

  const updatePhysics = (time) => {
    const dt = Math.min((time - lastTime) / 1000, 0.1);
    lastTime = time;

    const displacement = state.current - state.target;
    // F = -k*x - c*v
    const force = -springConfig.stiffness * displacement - springConfig.damping * state.velocity;
    const acceleration = force / springConfig.mass;

    state.velocity += acceleration * dt;
    state.current += state.velocity * dt;

    // Apply
    applyStyles(state.current);

    requestAnimationFrame(updatePhysics);
  };

  const onScroll = () => {
    if (!formContainer || !document.contains(formContainer)) return;
    const rect = formContainer.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Calculate progress: 'start end' to 'end end'
    // start end: top of element reaches bottom of viewport (rect.top = windowHeight) -> progress 0
    // end end: bottom of element reaches bottom of viewport (rect.bottom = windowHeight) -> progress 1

    // rect.top is relative to viewport top.
    // When element is below viewport, rect.top > windowHeight.
    // When element is fully in view (bottom aligned), rect.bottom = windowHeight => rect.top = windowHeight - rect.height.

    // progress = (windowHeight - rect.top) / rect.height
    // Check:
    // If rect.top = windowHeight -> (windowHeight - windowHeight)/h = 0. Correct.
    // If rect.top = windowHeight - height -> (windowHeight - (windowHeight - height))/h = height/height = 1. Correct.

    let progress = (windowHeight - rect.top) / rect.height;

    // Clamp target to [0, 1]
    progress = Math.max(0, Math.min(1, progress));

    state.target = progress;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  // Initial call
  onScroll();

  // Start loop
  requestAnimationFrame(updatePhysics);
});
