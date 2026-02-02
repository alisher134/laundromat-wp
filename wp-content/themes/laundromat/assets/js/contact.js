/**
 * Load contact data from WordPress API and update the contact cards
 */
async function loadContactData() {
  // Check if LaundroAPI is available
  if (typeof window.LaundroAPI === 'undefined') {
    console.warn('[Contact Page] LaundroAPI not available');
    return;
  }

  try {
    // Fetch settings from WordPress
    const settings = await window.LaundroAPI.getSettings();

    if (!settings) {
      console.warn('[Contact Page] No settings data received from API');
      return;
    }

    console.log('[Contact Page] Loaded settings from API:', settings);

    // Update contact cards with API data
    updateContactCards(settings);
  } catch (error) {
    console.error('[Contact Page] Error loading settings:', error);
  }
}

/**
 * Update contact information cards with data from API
 */
function updateContactCards(settings) {
  // Update Address
  if (settings.address) {
    const addressElement = document.querySelector('.contact-address');
    if (addressElement) {
      addressElement.textContent = settings.address;
    }
  }

  // Update Phone
  if (settings.phone) {
    const phoneLinks = document.querySelectorAll('.contact-phone');
    phoneLinks.forEach((link) => {
      const cleanPhone = settings.phone.replace(/\s/g, '');
      link.href = `tel:${cleanPhone}`;
      link.textContent = settings.phone;
    });
  }

  // Update Email
  if (settings.email) {
    const emailLinks = document.querySelectorAll('.contact-email');
    emailLinks.forEach((link) => {
      link.href = `mailto:${settings.email}`;
      link.textContent = settings.email;
    });
  }

  // Update Social Media Links
  if (settings.facebook) {
    const facebookLinks = document.querySelectorAll('.contact-facebook');
    facebookLinks.forEach((link) => {
      link.href = settings.facebook;
    });
  }

  if (settings.instagram) {
    const instagramLinks = document.querySelectorAll('.contact-instagram');
    instagramLinks.forEach((link) => {
      link.href = settings.instagram;
    });
  }

  console.log('[Contact Page] Contact cards updated successfully');
}

document.addEventListener('DOMContentLoaded', async () => {
  // Load contact data from WordPress API
  await loadContactData();

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
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const checkbox = form.querySelector('input[name="consent"]');
      if (!checkbox.checked) return;

      // Collect form data
      const firstName = form.querySelector('input[name="firstName"]')?.value || '';
      const lastName = form.querySelector('input[name="lastName"]')?.value || '';
      const formData = {
        name: `${firstName} ${lastName}`.trim(),
        phone: form.querySelector('input[name="phone"]')?.value || '',
        email: form.querySelector('input[name="email"]')?.value || '',
        message: form.querySelector('textarea[name="message"]')?.value || '',
      };

      // Get submit button for loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn?.innerHTML;

      // Use API if available, otherwise fallback to console.log
      if (typeof LaundroAPI !== 'undefined') {
        // Show loading state
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = 'Sending...';
        }

        try {
          const result = await LaundroAPI.submitContact(formData);

          if (result.success) {
            alert('Thank you! Your message has been sent successfully.');
            form.reset();

            // Reset visual checkbox
            const consentVisual = document.getElementById('consent-visual');
            if (consentVisual) consentVisual.innerHTML = '';
          } else {
            alert(result.message || 'Failed to send message. Please try again.');
          }
        } catch (error) {
          console.error('Contact form error:', error);
          alert('An error occurred. Please try again later.');
        } finally {
          // Restore button state
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
          }
        }
      } else {
        // Fallback for when API is not available
        console.log('Form submitted:', formData);
        alert('Thank you! Your message has been "sent" (logged to console).');
        form.reset();

        // Reset visual checkbox
        const consentVisual = document.getElementById('consent-visual');
        if (consentVisual) consentVisual.innerHTML = '';
      }
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
