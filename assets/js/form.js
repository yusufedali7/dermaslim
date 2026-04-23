/* ============================================
   DERMASLIM — Form Module
   Sipariş formu submit, validation ve
   Netlify Forms entegrasyonu.
   ============================================ */

(function () {
  'use strict';

  const D = window.Dermaslim || {};

  /* ---------- URL encoder for Netlify ---------- */
  function encode(data) {
    return Object.keys(data)
      .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(data[k]))
      .join('&');
  }

  /* ---------- Validation ---------- */
  function validate(formData) {
    const required = ['ad_soyad', 'telefon', 'il', 'ilce', 'adres', 'odeme_sekli'];
    for (const field of required) {
      if (!formData[field] || String(formData[field]).trim() === '') {
        return { ok: false, message: 'Lütfen tüm zorunlu alanları doldurunuz.' };
      }
    }

    const phone = String(formData.telefon).replace(/\s/g, '');
    if (phone.length < 10 || phone.length > 13 || !/^[0-9]+$/.test(phone)) {
      return { ok: false, message: 'Lütfen geçerli bir telefon numarası giriniz.' };
    }

    return { ok: true };
  }

  /* ---------- Submit handler ---------- */
  function handleSubmit(event) {
    event.preventDefault();

    const form = event.target;
    if (!form) return false;

    // Sepet boşsa uyar
    const cart = D.getCartData ? D.getCartData() : [];
    if (!cart || cart.length === 0) {
      if (D.showToast) D.showToast('Lütfen önce sepete ürün ekleyin.');
      const pricing = document.getElementById('siparis');
      if (pricing) pricing.scrollIntoView({ behavior: 'smooth' });
      return false;
    }

    // Cart verisini gizli alanlara yaz (son kez)
    if (D.updateOrderSummary) D.updateOrderSummary();

    // Form verilerini topla
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => { data[key] = value; });

    // Validate
    const result = validate(data);
    if (!result.ok) {
      if (D.showToast) D.showToast(result.message);
      return false;
    }

    // Submit button disable + loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalHTML = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Gönderiliyor...';
    }

    // Netlify submit
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode(data)
    })
    .then(response => {
      if (!response.ok) throw new Error('Submit failed: ' + response.status);
      onSuccess(data);
    })
    .catch(error => {
      console.error('Form submit error:', error);
      if (D.showToast) D.showToast('Bir hata oluştu. Lütfen tekrar deneyin.');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
      }
    });

    return false;
  }

  /* ---------- Success handler ---------- */
  function onSuccess(data) {
    const cartSummary = D.getCartData ? D.getCartData() : [];
    const total = D.getCartTotal ? D.getCartTotal() : 0;
    const escape = D.escapeHTML || (s => s);

    const msg = document.getElementById('successMessage');
    if (msg) {
      msg.innerHTML = `
        Sayın <strong>${escape(data.ad_soyad || '')}</strong>, siparişiniz başarıyla alındı.
        Kısa süre içinde <strong>${escape(data.telefon || '')}</strong> numaralı telefonunuzdan
        aranarak onay yapılacaktır. Ürününüz 2-3 iş günü içinde adresinize ulaşacaktır.
      `;
    }

    const modal = document.getElementById('successModal');
    if (modal) modal.classList.add('active');

    // Sepeti temizle
    if (D.clearCart) D.clearCart();

    // Formu resetle
    const form = document.getElementById('orderForm');
    if (form) form.reset();
  }

  /* ---------- Close modal ---------- */
  function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) modal.classList.remove('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ---------- Init ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('successModal');
    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) closeSuccessModal();
      });
    }
  });

  /* ---------- Public API ---------- */
  window.handleSubmit = handleSubmit;
  window.closeSuccessModal = closeSuccessModal;

  window.Dermaslim = window.Dermaslim || {};
  Object.assign(window.Dermaslim, {
    handleSubmit,
    closeSuccessModal,
    validateForm: validate
  });
})();
