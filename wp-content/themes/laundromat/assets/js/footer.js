document.addEventListener('DOMContentLoaded', () => {
  const footer = document.querySelector('footer');
  const formContainer = document.getElementById('footer-form-container');
  const newsletterForm = document.getElementById('newsletter-form');
  const bottomBar = document.getElementById('footer-bottom-bar');

  if (!footer || !formContainer || !bottomBar || !newsletterForm) return;

  // Consent Checkbox Elements
  const consentCheckbox = document.getElementById('footer-consent');
  const submitBtn = newsletterForm.querySelector('button[type="submit"]');

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
    const widthPercentage = 60 + 40 * progress;
    newsletterForm.style.width = widthPercentage + '%';

    let scale = 0.85;
    if (progress >= 0.8) {
      const subProgress = (progress - 0.8) / 0.2;
      scale = 0.85 + 0.15 * subProgress;
    }
    if (scale < 0.85) scale = 0.85;

    bottomBar.style.transform = `scaleX(${scale})`;
  };

  const updatePhysics = (time) => {
    const dt = Math.min((time - lastTime) / 1000, 0.1);
    lastTime = time;

    const displacement = state.current - state.target;
    const force = -springConfig.stiffness * displacement - springConfig.damping * state.velocity;
    const acceleration = force / springConfig.mass;

    state.velocity += acceleration * dt;
    state.current += state.velocity * dt;

    applyStyles(state.current);

    requestAnimationFrame(updatePhysics);
  };

  const onScroll = () => {
    if (!formContainer || !document.contains(formContainer)) return;
    const rect = formContainer.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    let progress = (windowHeight - rect.top) / rect.height;
    progress = Math.max(0, Math.min(1, progress));
    state.target = progress;
  };

  // Form Validation Logic
  function validateFooterForm() {
    if (!submitBtn || !consentCheckbox) return;
    const emailInput = document.getElementById('newsletter-email');
    const isEmailFilled = emailInput?.value.trim().length > 0;
    const isConsentChecked = consentCheckbox.checked;

    submitBtn.disabled = !(isEmailFilled && isConsentChecked);
    submitBtn.style.opacity = submitBtn.disabled ? '0.5' : '1';
  }

  if (consentCheckbox) {
    consentCheckbox.addEventListener('change', validateFooterForm);
  }

  const emailInput = document.getElementById('newsletter-email');
  if (emailInput) {
    emailInput.addEventListener('input', validateFooterForm);
  }

  newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (consentCheckbox && !consentCheckbox.checked) {
      alert('Please agree to the Privacy Policy to subscribe.');
      return;
    }

    const emailInput = document.getElementById('newsletter-email');
    const email = emailInput?.value?.trim() || '';
    if (!email) return;

    const formData = {
      email,
      consent: consentCheckbox?.checked ?? false,
    };

    if (typeof window.LaundroAPI !== 'undefined') {
      const originalOpacity = submitBtn?.style.opacity;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.5';
      }

      try {
        const result = await window.LaundroAPI.submitNewsletter(formData);

        if (result.success) {
          alert('Thank you! You have been subscribed successfully.');
          newsletterForm.reset();
          consentCheckbox && (consentCheckbox.checked = false);
          validateFooterForm();
        } else {
          alert(result.message || 'Failed to subscribe. Please try again.');
        }
      } catch (error) {
        console.error('[Footer] Newsletter submit error:', error);
        alert('An error occurred. Please try again later.');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.style.opacity = originalOpacity ?? '1';
        }
        validateFooterForm();
      }
    } else {
      alert('Thank you! You have been subscribed (API not available).');
      newsletterForm.reset();
      consentCheckbox && (consentCheckbox.checked = false);
      validateFooterForm();
    }
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  // Initial calls
  onScroll();
  validateFooterForm();

  // Start loop
  requestAnimationFrame(updatePhysics);
});
