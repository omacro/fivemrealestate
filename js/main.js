/* ============================================
   FIVE M REAL ESTATE — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // --- Preloader ---
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('loaded');
      }, 1200);
    });
    // Fallback: hide after 3s even if load event doesn't fire
    setTimeout(() => {
      preloader.classList.add('loaded');
    }, 3000);
  }

  // --- Navigation Scroll ---
  const nav = document.querySelector('.nav');
  let lastScroll = 0;

  function handleNavScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // --- Mobile Nav Toggle ---
  const navToggle = document.querySelector('.nav-toggle');
  const navMobile = document.querySelector('.nav-mobile');

  if (navToggle && navMobile) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMobile.classList.toggle('active');
      document.body.style.overflow = navMobile.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    navMobile.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMobile.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // --- Scroll Reveal Animation ---
  const revealElements = document.querySelectorAll('.reveal, .stat-item');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optional: unobserve after reveal for performance
        // revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // --- Counter Animation ---
  const counters = document.querySelectorAll('.stat-number[data-count]');
  
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo
      const eased = 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(eased * target);
      el.textContent = prefix + current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = prefix + target.toLocaleString() + suffix;
    }

    requestAnimationFrame(update);
  }

  // --- Parallax Effect ---
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  function handleParallax() {
    const scrollY = window.scrollY;
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.3;
      const rect = el.getBoundingClientRect();
      const offset = (rect.top + scrollY - window.innerHeight / 2) * speed;
      el.style.transform = `translateY(${offset * 0.1}px)`;
    });
  }

  if (parallaxElements.length) {
    window.addEventListener('scroll', handleParallax, { passive: true });
  }

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- Active Nav Link ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --- Calendar / Scheduler Widget ---
  initScheduler();
});

/* ============================================
   MEETING SCHEDULER
   ============================================ */
function initScheduler() {
  const calendarGrid = document.getElementById('calendarGrid');
  const calendarTitle = document.getElementById('calendarTitle');
  const prevMonth = document.getElementById('prevMonth');
  const nextMonth = document.getElementById('nextMonth');
  const timeSlotsContainer = document.getElementById('timeSlots');
  const selectedDisplay = document.getElementById('selectedDateTime');
  const confirmBtn = document.getElementById('confirmBooking');

  if (!calendarGrid) return; // Not on contact page

  let currentDate = new Date();
  let currentMonth = currentDate.getMonth();
  let currentYear = currentDate.getFullYear();
  let selectedDate = null;
  let selectedTime = null;

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '1:00 PM', '1:30 PM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
    '4:00 PM', '4:30 PM'
  ];

  function renderCalendar() {
    calendarGrid.innerHTML = '';
    calendarTitle.textContent = `${monthNames[currentMonth]} ${currentYear}`;

    // Day labels
    dayLabels.forEach(day => {
      const label = document.createElement('div');
      label.className = 'calendar-day-label';
      label.textContent = day;
      calendarGrid.appendChild(label);
    });

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();

    // Empty cells
    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('div');
      empty.className = 'calendar-day empty';
      calendarGrid.appendChild(empty);
    }

    // Day cells
    for (let d = 1; d <= daysInMonth; d++) {
      const dayEl = document.createElement('div');
      dayEl.className = 'calendar-day';
      dayEl.textContent = d;

      const dateObj = new Date(currentYear, currentMonth, d);
      const dayOfWeek = dateObj.getDay();

      // Disable past dates and weekends
      if (dateObj < new Date(today.getFullYear(), today.getMonth(), today.getDate()) || dayOfWeek === 0 || dayOfWeek === 6) {
        dayEl.classList.add('disabled');
      } else {
        dayEl.addEventListener('click', () => selectDate(d, dayEl));
      }

      // Highlight today
      if (d === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
        dayEl.classList.add('today');
      }

      // Highlight selected
      if (selectedDate && d === selectedDate.getDate() && currentMonth === selectedDate.getMonth() && currentYear === selectedDate.getFullYear()) {
        dayEl.classList.add('selected');
      }

      calendarGrid.appendChild(dayEl);
    }
  }

  function selectDate(day, el) {
    selectedDate = new Date(currentYear, currentMonth, day);
    selectedTime = null;
    
    // Update UI
    calendarGrid.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
    el.classList.add('selected');
    
    renderTimeSlots();
    updateSelectedDisplay();
  }

  function renderTimeSlots() {
    if (!timeSlotsContainer) return;
    timeSlotsContainer.innerHTML = '';
    timeSlotsContainer.style.display = selectedDate ? 'grid' : 'none';

    if (!selectedDate) return;

    timeSlots.forEach(time => {
      const slot = document.createElement('div');
      slot.className = 'time-slot';
      slot.textContent = time;
      slot.addEventListener('click', () => {
        selectedTime = time;
        timeSlotsContainer.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
        slot.classList.add('selected');
        updateSelectedDisplay();
      });
      timeSlotsContainer.appendChild(slot);
    });
  }

  function updateSelectedDisplay() {
    if (!selectedDisplay) return;
    
    if (selectedDate && selectedTime) {
      const dateStr = selectedDate.toLocaleDateString('en-US', { 
        weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' 
      });
      selectedDisplay.innerHTML = `Selected: <strong>${dateStr} at ${selectedTime}</strong>`;
      if (confirmBtn) confirmBtn.style.display = 'inline-flex';
    } else if (selectedDate) {
      const dateStr = selectedDate.toLocaleDateString('en-US', { 
        weekday: 'long', month: 'long', day: 'numeric' 
      });
      selectedDisplay.innerHTML = `Date: <strong>${dateStr}</strong> — Select a time below`;
      if (confirmBtn) confirmBtn.style.display = 'none';
    } else {
      selectedDisplay.innerHTML = 'Select a date to see available times';
      if (confirmBtn) confirmBtn.style.display = 'none';
    }
  }

  // Navigation
  if (prevMonth) {
    prevMonth.addEventListener('click', () => {
      currentMonth--;
      if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
      }
      renderCalendar();
    });
  }

  if (nextMonth) {
    nextMonth.addEventListener('click', () => {
      currentMonth++;
      if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
      }
      renderCalendar();
    });
  }

  // Confirm booking
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      if (selectedDate && selectedTime) {
        const dateStr = selectedDate.toLocaleDateString('en-US', { 
          weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' 
        });
        
        // Show confirmation
        const widget = document.querySelector('.scheduler-widget');
        if (widget) {
          widget.innerHTML = `
            <div style="text-align: center; padding: 40px 0;">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="1.5" style="margin-bottom: 20px;">
                <circle cx="12" cy="12" r="10"/>
                <path d="M8 12l3 3 5-5"/>
              </svg>
              <h3 style="margin-bottom: 12px; font-size: 1.5rem;">Consultation Requested</h3>
              <p style="margin-bottom: 8px;">${dateStr} at ${selectedTime}</p>
              <p style="font-size: 0.85rem; color: #666; margin-top: 16px;">
                We'll confirm your appointment via email within 24 hours.
              </p>
            </div>
          `;
        }
      }
    });
  }

  // Initialize
  renderCalendar();
  if (timeSlotsContainer) timeSlotsContainer.style.display = 'none';
  updateSelectedDisplay();
}

/* ============================================
   CONTACT FORM
   ============================================ */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());
    
    // Simple validation
    if (!data.name || !data.email || !data.message) {
      alert('Please fill in all required fields.');
      return;
    }
    
    // Simulate submission
    const submitBtn = contactForm.querySelector('.form-submit .btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.style.opacity = '0.6';
    submitBtn.style.pointerEvents = 'none';
    
    setTimeout(() => {
      contactForm.innerHTML = `
        <div style="text-align: center; padding: 60px 0;">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="1.5" style="margin-bottom: 20px;">
            <circle cx="12" cy="12" r="10"/>
            <path d="M8 12l3 3 5-5"/>
          </svg>
          <h3 style="margin-bottom: 12px;">Message Sent</h3>
          <p>Thank you for reaching out. We'll be in touch within 24 hours.</p>
        </div>
      `;
    }, 1500);
  });
}
