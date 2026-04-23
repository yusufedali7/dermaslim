/* ============================================
   DERMASLIM — Main Module
   Navigasyon, geri sayım, SSS accordion,
   WhatsApp iletişim, scroll efektleri.
   ============================================ */

(function () {
  'use strict';

  const WHATSAPP_NUMBER = '905336095451';

  /* ============================================
     Header scroll shadow
     ============================================ */
  function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) return;

    let ticking = false;
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          header.classList.toggle('scrolled', window.scrollY > 12);
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ============================================
     Mobil menü drawer
     ============================================ */
  function toggleMenu() {
    const drawer = document.getElementById('menuDrawer');
    const overlay = document.getElementById('menuOverlay');
    if (!drawer || !overlay) return;

    const isOpen = drawer.classList.contains('active');
    drawer.classList.toggle('active', !isOpen);
    overlay.classList.toggle('active', !isOpen);
    drawer.setAttribute('aria-hidden', isOpen);
    document.body.style.overflow = isOpen ? '' : 'hidden';
  }

  /* ============================================
     Smooth scroll (hash linkler için)
     ============================================ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#' || href.length < 2) return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        const headerHeight = 68;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 8;

        window.scrollTo({ top: top, behavior: 'smooth' });

        // Mobil menü açıksa kapat
        const drawer = document.getElementById('menuDrawer');
        if (drawer && drawer.classList.contains('active')) {
          toggleMenu();
        }
      });
    });
  }

  /* ============================================
     Ay sonu kampanyası — dürüst geri sayım
     Cari ayın son gününe (23:59) kadar sayar.
     ============================================ */
  function getMonthEndDate() {
    const now = new Date();
    // Bir sonraki ayın 1'inin 00:00'ı = cari ayın son gün sonu
    return new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0);
  }

  function pad2(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function updateCountdown() {
    const daysEl = document.getElementById('cdDays');
    const hoursEl = document.getElementById('cdHours');
    const minutesEl = document.getElementById('cdMinutes');
    if (!daysEl || !hoursEl || !minutesEl) return;

    const now = new Date();
    const target = getMonthEndDate();
    const diff = target.getTime() - now.getTime();

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    daysEl.textContent = pad2(days);
    hoursEl.textContent = pad2(hours);
    minutesEl.textContent = pad2(minutes);
  }

  function initCountdown() {
    updateCountdown();
    setInterval(updateCountdown, 60 * 1000); // her dakika güncelle
  }

  /* ============================================
     FAQ accordion
     ============================================ */
  function initFAQ() {
    document.querySelectorAll('.faq-item').forEach(function (item) {
      const question = item.querySelector('.faq-question');
      if (!question) return;

      question.addEventListener('click', function () {
        const isActive = item.classList.contains('active');

        // Aynı anda sadece bir soru açık olsun
        document.querySelectorAll('.faq-item.active').forEach(function (other) {
          if (other !== item) other.classList.remove('active');
        });

        item.classList.toggle('active', !isActive);
      });
    });
  }

  /* ============================================
     WhatsApp iletişim
     ============================================ */
  function contactWhatsApp() {
    const message = encodeURIComponent(
      'Merhaba, Dermaslim ürünü hakkında bilgi almak istiyorum.'
    );
    const url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + message;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  /* ============================================
     Fade-in animasyonu (intersection observer)
     ============================================ */
  function initFadeInAnimations() {
    if (!('IntersectionObserver' in window)) return;

    const targets = document.querySelectorAll(
      '.section-header, .info-card, .ingredient, .step, .pricing-card, .feature-item, .testimonial'
    );

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    targets.forEach(function (el) { observer.observe(el); });
  }

  /* ============================================
     ESC tuşu ile drawer/modal kapat
     ============================================ */
  function initKeyboardHandlers() {
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;

      // Sepet açıksa kapat
      const cart = document.getElementById('cartDrawer');
      if (cart && cart.classList.contains('active')) {
        if (window.toggleCart) window.toggleCart(false);
        return;
      }

      // Mobil menü açıksa kapat
      const menu = document.getElementById('menuDrawer');
      if (menu && menu.classList.contains('active')) {
        toggleMenu();
        return;
      }

      // Success modal açıksa kapat
      const modal = document.getElementById('successModal');
      if (modal && modal.classList.contains('active')) {
        if (window.closeSuccessModal) window.closeSuccessModal();
      }
    });
  }

  /* ============================================
     Init
     ============================================ */
  function init() {
    initHeaderScroll();
    initSmoothScroll();
    initCountdown();
    initFAQ();
    initFadeInAnimations();
    initKeyboardHandlers();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  /* ============================================
     Public API
     ============================================ */
  window.toggleMenu = toggleMenu;
  window.contactWhatsApp = contactWhatsApp;

  window.Dermaslim = window.Dermaslim || {};
  Object.assign(window.Dermaslim, {
    toggleMenu: toggleMenu,
    contactWhatsApp: contactWhatsApp
  });
})();
