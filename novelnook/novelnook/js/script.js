/* =========================================================
   NovelNook — Main Script
   Handles: navigation, slider, accordion, novel catalog
   (search/filter/sort), modal, gallery lightbox, form
   validation, back-to-top, misc UI helpers.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Hamburger / Mobile Nav ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });
    // Close menu when a link is clicked (mobile UX)
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ---------- Back to Top ---------- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('show', window.scrollY > 400);
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Animated Stat Counter (Home) ---------- */
  const statBooks = document.getElementById('statBooks');
  if (statBooks && typeof NOVELS !== 'undefined') {
    let count = 0;
    const target = NOVELS.length * 12; // stylised bigger number
    const step = Math.max(1, Math.floor(target / 40));
    const counter = setInterval(() => {
      count += step;
      if (count >= target) { count = target; clearInterval(counter); }
      statBooks.textContent = count;
    }, 30);
  }

  /* =====================================================
     FEATURED SLIDER (Home page)
     ===================================================== */
  const sliderTrack = document.getElementById('sliderTrack');
  const sliderDotsWrap = document.getElementById('sliderDots');
  if (sliderTrack && typeof NOVELS !== 'undefined') {
    const featured = NOVELS.slice(0, 5);
    let currentSlide = 0;
    let autoSlideTimer = null;

    sliderTrack.innerHTML = featured.map(book => `
      <div class="slide">
        <div class="slide-cover"><img src="${book.cover}" alt="${book.title} cover" loading="lazy"></div>
        <div class="slide-info">
          <span class="tag">${book.tag}</span>
          <h3>${book.title}</h3>
          <p class="author">by ${book.author}</p>
          <p class="desc">${book.desc}</p>
          <p class="stars">${renderStars(book.rating)} <span style="color:#7a746b;font-size:0.85rem;">(${book.rating})</span></p>
        </div>
      </div>
    `).join('');

    sliderDotsWrap.innerHTML = featured.map((_, i) =>
      `<span class="dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>`
    ).join('');

    const dots = sliderDotsWrap.querySelectorAll('.dot');

    function goToSlide(index) {
      currentSlide = (index + featured.length) % featured.length;
      sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
    }

    document.getElementById('nextBtn').addEventListener('click', () => { goToSlide(currentSlide + 1); resetAutoSlide(); });
    document.getElementById('prevBtn').addEventListener('click', () => { goToSlide(currentSlide - 1); resetAutoSlide(); });
    dots.forEach(dot => dot.addEventListener('click', (e) => {
      goToSlide(parseInt(e.target.dataset.index, 10));
      resetAutoSlide();
    }));

    function startAutoSlide() {
      autoSlideTimer = setInterval(() => goToSlide(currentSlide + 1), 5000);
    }
    function resetAutoSlide() {
      clearInterval(autoSlideTimer);
      startAutoSlide();
    }
    startAutoSlide();
  }

  /* =====================================================
     ACCORDION (About page FAQ)
     ===================================================== */
  const accordionItems = document.querySelectorAll('.accordion-item');
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const body = item.querySelector('.accordion-body');
    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // close all others (single-open accordion)
      accordionItems.forEach(other => {
        other.classList.remove('open');
        other.querySelector('.accordion-body').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  /* =====================================================
     NOVELS CATALOG (Novels page)
     ===================================================== */
  const novelGrid = document.getElementById('novelGrid');
  if (novelGrid && typeof NOVELS !== 'undefined') {
    const searchInput = document.getElementById('searchInput');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sortSelect');
    const resultsCount = document.getElementById('resultsCount');
    const noResults = document.getElementById('noResults');

    let activeFilter = 'all';
    let searchTerm = '';
    let sortOrder = 'default';

    function renderNovels() {
      let list = NOVELS.filter(n => activeFilter === 'all' || n.lang === activeFilter);

      if (searchTerm.trim() !== '') {
        list = list.filter(n =>
          n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          n.author.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (sortOrder === 'az') list = [...list].sort((a, b) => a.title.localeCompare(b.title));
      if (sortOrder === 'za') list = [...list].sort((a, b) => b.title.localeCompare(a.title));
      if (sortOrder === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);

      resultsCount.textContent = `Showing ${list.length} of ${NOVELS.length} novels`;
      noResults.hidden = list.length !== 0;

      novelGrid.innerHTML = list.map(book => `
        <div class="novel-card" data-id="${book.id}" tabindex="0">
          <div class="novel-cover">
            <span class="lang-badge">${book.lang === 'urdu' ? 'Urdu' : 'English'}</span>
            <img src="${book.cover}" alt="${book.title} cover" loading="lazy">
          </div>
          <div class="novel-info">
            <h3>${book.title}</h3>
            <p class="author">by ${book.author}</p>
            <p class="stars">${renderStars(book.rating)} (${book.rating})</p>
          </div>
        </div>
      `).join('');

      // Attach click + keyboard handlers to open modal
      novelGrid.querySelectorAll('.novel-card').forEach(card => {
        card.addEventListener('click', () => openModal(parseInt(card.dataset.id, 10)));
        card.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') openModal(parseInt(card.dataset.id, 10));
        });
      });
    }

    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value;
      renderNovels();
    });

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.filter;
        renderNovels();
      });
    });

    sortSelect.addEventListener('change', (e) => {
      sortOrder = e.target.value;
      renderNovels();
    });

    // Support #urdu / #english deep links from Home page category cards
    const hash = window.location.hash.replace('#', '');
    if (hash === 'urdu' || hash === 'english') {
      activeFilter = hash;
      filterBtns.forEach(b => b.classList.toggle('active', b.dataset.filter === hash));
    }

    renderNovels();

    /* ----- Modal ----- */
    const modalOverlay = document.getElementById('modalOverlay');
    const modalContent = document.getElementById('modalContent');
    const modalClose = document.getElementById('modalClose');

    function openModal(id) {
      const book = NOVELS.find(n => n.id === id);
      if (!book) return;
      modalContent.innerHTML = `
        <div class="modal-cover"><img src="${book.cover}" alt="${book.title} cover"></div>
        <div class="modal-details">
          <span class="tag">${book.tag}</span>
          <h2>${book.title}</h2>
          <p class="author">by ${book.author}</p>
          <p class="stars">${renderStars(book.rating)} (${book.rating} / 5)</p>
          <p class="desc">${book.desc}</p>
          <a href="contact.html" class="btn btn-primary">Request This Novel</a>
        </div>
      `;
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  /* =====================================================
     GALLERY (Gallery page) + Lightbox
     ===================================================== */
  const galleryGrid = document.getElementById('galleryGrid');
  if (galleryGrid && typeof NOVELS !== 'undefined') {
    galleryGrid.innerHTML = NOVELS.map(book => `
      <div class="gallery-item" data-id="${book.id}" data-title="${book.title} — ${book.author}">
        <img src="${book.cover}" alt="${book.title} cover" loading="lazy">
      </div>
    `).join('');

    const lightboxOverlay = document.getElementById('lightboxOverlay');
    const lightboxBox = document.getElementById('lightboxBox');
    const lightboxClose = document.getElementById('lightboxClose');

    galleryGrid.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const book = NOVELS.find(n => n.id === parseInt(item.dataset.id, 10));
        lightboxBox.innerHTML = `
          <div class="lightbox-cover"><img src="${book.cover}" alt="${book.title} cover"></div>
          <h3 style="margin-top:14px;">${book.title}</h3>
          <p style="opacity:0.85;font-size:0.9rem;margin-top:6px;">by ${book.author}</p>
          <p style="margin-top:10px;">${renderStars(book.rating)}</p>
        `;
        lightboxOverlay.classList.add('active');
      });
    });

    lightboxClose.addEventListener('click', () => lightboxOverlay.classList.remove('active'));
    lightboxOverlay.addEventListener('click', (e) => {
      if (e.target === lightboxOverlay) lightboxOverlay.classList.remove('active');
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') lightboxOverlay.classList.remove('active');
    });
  }

  /* =====================================================
     CONTACT FORM VALIDATION
     ===================================================== */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');
    const agree = document.getElementById('agree');
    const charCount = document.getElementById('charCount');
    const formSuccess = document.getElementById('formSuccess');

    message.addEventListener('input', () => {
      const len = message.value.length;
      charCount.textContent = `${len} / 400`;
      if (len > 400) {
        message.value = message.value.slice(0, 400);
        charCount.textContent = `400 / 400`;
      }
    });

    function setError(input, errorId, msg) {
      const errEl = document.getElementById(errorId);
      const group = input.closest('.form-group');
      if (msg) {
        group.classList.add('invalid');
        errEl.textContent = msg;
        return false;
      } else {
        group.classList.remove('invalid');
        errEl.textContent = '';
        return true;
      }
    }

    function validateForm() {
      let valid = true;

      if (fullName.value.trim().length < 3) {
        setError(fullName, 'err-fullName', 'Please enter your full name (min 3 characters).');
        valid = false;
      } else {
        setError(fullName, 'err-fullName', '');
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.value.trim())) {
        setError(email, 'err-email', 'Please enter a valid email address.');
        valid = false;
      } else {
        setError(email, 'err-email', '');
      }

      if (subject.value === '') {
        setError(subject, 'err-subject', 'Please select a subject.');
        valid = false;
      } else {
        setError(subject, 'err-subject', '');
      }

      if (message.value.trim().length < 10) {
        setError(message, 'err-message', 'Message should be at least 10 characters long.');
        valid = false;
      } else {
        setError(message, 'err-message', '');
      }

      const agreeGroup = agree.closest('.form-group');
      const agreeErr = document.getElementById('err-agree');
      if (!agree.checked) {
        agreeGroup.classList.add('invalid');
        agreeErr.textContent = 'You must agree before sending your message.';
        valid = false;
      } else {
        agreeGroup.classList.remove('invalid');
        agreeErr.textContent = '';
      }

      return valid;
    }

    // Live validation as user types (clears error once fixed)
    [fullName, email, subject, message].forEach(field => {
      field.addEventListener('blur', validateForm);
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateForm()) {
        formSuccess.hidden = false;
        contactForm.reset();
        charCount.textContent = '0 / 400';
        setTimeout(() => { formSuccess.hidden = true; }, 6000);
      } else {
        formSuccess.hidden = true;
      }
    });
  }

  /* =====================================================
     NEWSLETTER FORM (Home page)
     ===================================================== */
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    const newsletterEmail = document.getElementById('newsletterEmail');
    const newsletterMsg = document.getElementById('newsletterMsg');

    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailPattern.test(newsletterEmail.value.trim())) {
        newsletterMsg.textContent = '✅ Subscribed! Thanks for joining our reading circle.';
        newsletterForm.reset();
      } else {
        newsletterMsg.textContent = '⚠ Please enter a valid email address.';
      }
      setTimeout(() => { newsletterMsg.textContent = ''; }, 5000);
    });
  }

  /* ---------- Helper: render star rating string ---------- */
  function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    let stars = '★'.repeat(full);
    if (half) stars += '½';
    stars += '☆'.repeat(5 - full - (half ? 1 : 0));
    return stars;
  }

});
