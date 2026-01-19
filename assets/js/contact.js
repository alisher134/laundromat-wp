document.addEventListener('DOMContentLoaded', () => {
  // Animation Observer
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const delay = element.dataset.delay || 0;

        setTimeout(() => {
          element.classList.remove(
            'opacity-0',
            'translate-y-[100px]',
            'translate-y-[150px]',
            '-translate-x-[50px]',
            'scale-90',
            '-translate-x-[30px]',
          );
          element.classList.add('opacity-100', 'translate-y-0', 'translate-x-0', 'scale-100');
        }, delay);

        observer.unobserve(element);
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  animatedElements.forEach((el) => observer.observe(el));

  // Form Handling
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const checkbox = form.querySelector('input[name="consent"]');
      if (!checkbox.checked) return;

      console.log('submitted');
      // Here you would typically handle the form submission, e.g., send data to a server
      alert('Thank you! Your message has been "sent" (logged to console).');
      form.reset();

      // Reset visual checkbox
      const consentVisual = document.getElementById('consent-visual');
      if (consentVisual) consentVisual.innerHTML = '';
    });
  }

  // Agreement Checkbox Visual Toggle
  const consentCheckbox = document.getElementById('consent');
  const consentVisual = document.getElementById('consent-visual');
  const submitBtn = document.querySelector('button[type="submit"]'); // Target the button broadly first

  // Set initial state of button
  if (submitBtn && consentCheckbox) {
    submitBtn.disabled = !consentCheckbox.checked;
  }

  if (consentCheckbox && consentVisual) {
    consentCheckbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        consentVisual.innerHTML = '<div class="bg-brand size-[11px] rounded-[3px]"></div>';
        if (submitBtn) submitBtn.disabled = false;
      } else {
        consentVisual.innerHTML = '';
        if (submitBtn) submitBtn.disabled = true;
      }
    });
  }
});
