/* ============================================
   DERMASLIM — Cart Module
   Alışveriş sepeti işlemleri (localStorage tabanlı).
   ============================================ */

(function () {
  'use strict';

  const STORAGE_KEY = 'dermaslim_cart_v1';
  let cart = [];

  /* ---------- XSS koruması ---------- */
  function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    const div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
  }

  /* ---------- Storage helpers ---------- */
  function loadCart() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      cart = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(cart)) cart = [];
    } catch (e) {
      console.warn('Cart yüklenemedi, sıfırlanıyor.', e);
      cart = [];
      try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
    }
  }

  function saveCart() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.warn('Cart kaydedilemedi.', e);
    }
  }

  /* ---------- Cart operations ---------- */
  function addToCart(name, price, boxes) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: Date.now(),
        name: name,
        price: price,
        boxes: boxes,
        quantity: 1
      });
    }
    saveCart();
    updateCartUI();
    showToast(name + ' sepete eklendi');
    toggleCart(true);
  }

  function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
  }

  function updateQuantity(id, change) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.quantity += change;
    if (item.quantity <= 0) {
      removeFromCart(id);
    } else {
      saveCart();
      updateCartUI();
    }
  }

  function clearCart() {
    cart = [];
    saveCart();
    updateCartUI();
  }

  function getCartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  function getCartCount() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  function getCartData() {
    return cart.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity
    }));
  }

  /* ---------- UI rendering ---------- */
  function formatPrice(amount) {
    return '₺' + amount.toLocaleString('tr-TR');
  }

  function updateCartUI() {
    // Header badge
    const badge = document.getElementById('cartCount');
    if (badge) {
      const count = getCartCount();
      badge.textContent = count;
      badge.classList.toggle('visible', count > 0);
    }

    // Cart drawer body
    const body = document.getElementById('cartBody');
    const totalEl = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (!body) return;

    if (cart.length === 0) {
      body.innerHTML = `
        <div class="cart-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          <p>Sepetiniz boş</p>
          <small>Fiyatlar bölümünden paket seçin.</small>
        </div>`;
      if (totalEl) totalEl.textContent = '₺0';
      if (checkoutBtn) checkoutBtn.disabled = true;
      updateOrderSummary();
      return;
    }

    body.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-info">
          <h4>${escapeHTML(item.name)}</h4>
          <p>${formatPrice(item.price)} / paket</p>
          <div class="cart-item-qty">
            <button type="button" onclick="Dermaslim.updateQuantity(${item.id}, -1)" aria-label="Azalt">−</button>
            <span>${item.quantity}</span>
            <button type="button" onclick="Dermaslim.updateQuantity(${item.id}, 1)" aria-label="Artır">+</button>
          </div>
        </div>
        <div class="cart-item-price">
          <strong>${formatPrice(item.price * item.quantity)}</strong>
          <button type="button" class="cart-item-remove" onclick="Dermaslim.removeFromCart(${item.id})">Kaldır</button>
        </div>
      </div>
    `).join('');

    const total = getCartTotal();
    if (totalEl) totalEl.textContent = formatPrice(total);
    if (checkoutBtn) checkoutBtn.disabled = false;

    updateOrderSummary();
  }

  function updateOrderSummary() {
    const box = document.getElementById('orderSummaryBox');
    const items = document.getElementById('orderSummaryItems');
    const total = document.getElementById('orderTotal');
    const hiddenCart = document.getElementById('hiddenCartData');
    const hiddenTotal = document.getElementById('hiddenTotalData');

    if (!box) return;

    if (cart.length === 0) {
      box.style.display = 'none';
      return;
    }

    box.style.display = 'block';
    const sum = getCartTotal();

    if (items) {
      items.innerHTML = cart.map(item => `
        <div class="order-summary-item">
          <span>${escapeHTML(item.name)} × ${item.quantity}</span>
          <span>${formatPrice(item.price * item.quantity)}</span>
        </div>
      `).join('');
    }

    if (total) total.textContent = formatPrice(sum);
    if (hiddenCart) hiddenCart.value = JSON.stringify(getCartData());
    if (hiddenTotal) hiddenTotal.value = String(sum);
  }

  /* ---------- Toast ---------- */
  let toastTimer = null;
  function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();
    if (toastTimer) clearTimeout(toastTimer);

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    toastTimer = setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 3200);
  }

  /* ---------- Cart drawer ---------- */
  function toggleCart(forceOpen) {
    const drawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('cartOverlay');
    if (!drawer || !overlay) return;

    const shouldOpen = forceOpen === true ? true :
                       forceOpen === false ? false :
                       !drawer.classList.contains('active');

    drawer.classList.toggle('active', shouldOpen);
    overlay.classList.toggle('active', shouldOpen);
    drawer.setAttribute('aria-hidden', !shouldOpen);
    document.body.style.overflow = shouldOpen ? 'hidden' : '';
  }

  function proceedToCheckout() {
    if (cart.length === 0) return;
    toggleCart(false);
    setTimeout(() => {
      const form = document.getElementById('siparis-formu');
      if (form) {
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 200);
  }

  /* ---------- Init ---------- */
  loadCart();

  /* ---------- Public API ---------- */
  window.Dermaslim = window.Dermaslim || {};
  Object.assign(window.Dermaslim, {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartData,
    getCartTotal,
    getCartCount,
    updateCartUI,
    updateOrderSummary,
    toggleCart,
    proceedToCheckout,
    showToast,
    escapeHTML
  });

  // Geriye dönük uyumluluk (inline onclick için)
  window.addToCart = addToCart;
  window.removeFromCart = removeFromCart;
  window.updateQuantity = updateQuantity;
  window.toggleCart = toggleCart;
  window.proceedToCheckout = proceedToCheckout;

  document.addEventListener('DOMContentLoaded', updateCartUI);
})();
