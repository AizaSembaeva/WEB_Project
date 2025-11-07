document.querySelectorAll('.nav-toggle').forEach(toggle => {
  toggle.addEventListener('click', () => {
    const nav = document.getElementById('mainNav');
    if (nav) nav.classList.toggle('show');
  });
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", e => {
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
      
      const nav = document.getElementById('mainNav');
      if (nav) nav.classList.remove("show");
    }
  });
});

const form = document.getElementById("contactForm");
if (form) {
  form.addEventListener("submit", e => {
    e.preventDefault();
    
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    
    document.querySelectorAll('.error-message, .form-message').forEach(msg => msg.remove());
    
    let hasError = false;
    
    if (!name) {
      showError('name', 'Please enter your name');
      hasError = true;
    }
    
    if (!phone) {
      showError('phone', 'Please enter your phone number');
      hasError = true;
    } else if (!/^\+7\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/.test(phone)) {
      showError('phone', 'Please use format: +7 (777) 123-4567');
      hasError = true;
    }
    
    if (hasError) return;
    
    showSuccess('Thank you! We will contact you soon.');
    form.reset();
  });
  
  function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const error = document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    error.style.cssText = 'color: red; font-size: 0.85rem; margin-top: 0.25rem;';
    field.style.borderColor = 'red';
    field.parentNode.appendChild(error);
  }
  
  function showSuccess(message) {
    const success = document.createElement('div');
    success.className = 'form-message';
    success.textContent = message;
    success.style.cssText = 'color: green; margin-top: 1rem; padding: 1rem; background: #f8fff9; border-radius: 8px;';
    form.appendChild(success);
  }
  

  document.getElementById('phone')?.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    value = value.substring(0, 11);
    
    if (value.startsWith('7') || value.startsWith('8')) {
        value = '7' + value.substring(1); // Убираем + для простоты
    }
  
    let formatted = '+7';
    if (value.length > 1) formatted += ' (' + value.substring(1, 4);
    if (value.length > 4) formatted += ') ' + value.substring(4, 7);
    if (value.length > 7) formatted += '-' + value.substring(7, 9);
    if (value.length > 9) formatted += '-' + value.substring(9, 11);
    
    e.target.value = formatted;
  });
}

$(window).on('scroll', function() {
  $('.fade-in').each(function() {
    const elementTop = $(this).offset().top;
    const windowBottom = $(window).scrollTop() + $(window).height();
    
    if (elementTop < windowBottom - 100) {
      $(this).addClass('visible');
    }
  });
});

$(window).trigger('scroll');
