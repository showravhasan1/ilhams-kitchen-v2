// ========================================
// ILHAM's Kitchen - Main Application
// ========================================

// Product Data
const PRODUCTS = [
    { id: 1, weight: '250', unit: 'গ্রাম', price: 300, perUnit: '১.২০ টাকা/গ্রাম' },
    { id: 2, weight: '500', unit: 'গ্রাম', price: 600, perUnit: '১.২০ টাকা/গ্রাম', popular: true },
    { id: 3, weight: '1', unit: 'কেজি', price: 1200, perUnit: '১.২০ টাকা/গ্রাম' },
    { id: 4, weight: '2', unit: 'কেজি', price: 2350, perUnit: '১.১৭ টাকা/গ্রাম' },
];

const DELIVERY_CHARGES = { dhaka: 60, outside: 120 };
const ADMIN_PASSWORD = 'ilham2024';

// State
let cart = {};
let currentArea = 'dhaka';

// ========================================
// ROUTER
// ========================================
function router() {
    const hash = window.location.hash || '#/';
    const app = document.getElementById('app');

    if (hash === '#/admin') {
        renderAdmin(app);
    } else {
        renderLanding(app);
        initLandingPage();
    }
}

window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', router);

// ========================================
// LANDING PAGE RENDER
// ========================================
function renderLanding(container) {
    container.innerHTML = `
    <!-- Navbar -->
    <nav class="navbar" id="navbar">
      <div class="navbar-brand">
        <div class="navbar-logo">I</div>
        <span class="navbar-name">ILHAM's Kitchen</span>
      </div>
      <ul class="navbar-links">
        <li><a href="#products">পণ্যসমূহ</a></li>
        <li><a href="#features">কেন বেছে নেবেন</a></li>
        <li><a href="#gallery">গ্যালারি</a></li>
        <li><a href="#delivery">ডেলিভারি</a></li>
      </ul>
      <a href="#order" class="navbar-cta">🛒 অর্ডার করুন</a>
      <button class="navbar-menu-btn" id="menuBtn" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </nav>

    <!-- Mobile Nav -->
    <div class="mobile-nav" id="mobileNav">
      <button class="mobile-nav-close" id="mobileNavClose">✕</button>
      <a href="#products" class="mobile-nav-link">পণ্যসমূহ</a>
      <a href="#features" class="mobile-nav-link">কেন বেছে নেবেন</a>
      <a href="#gallery" class="mobile-nav-link">গ্যালারি</a>
      <a href="#delivery" class="mobile-nav-link">ডেলিভারি</a>
      <a href="#order" class="mobile-nav-link">🛒 অর্ডার করুন</a>
    </div>

    <!-- Hero -->
    <section class="hero" id="hero">
      <div class="hero-container">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="dot"></span>
            এখন অর্ডার নেওয়া হচ্ছে
          </div>
          <h1 class="hero-title">
            প্রিমিয়াম ক্রিসপি<br>
            <span class="highlight">পেয়াজ বেরেস্তা</span>
          </h1>
          <p class="hero-subtitle">
            ১০০% খাঁটি ও কুড়কুড়ে পেয়াজ বেরেস্তা। বিরিয়ানি, পোলাও, খিচুড়ি
            বা কোরমার স্বাদ বাড়িয়ে দিন কয়েক গুণ!
          </p>
          <div class="hero-actions">
            <a href="#order" class="btn-primary">🛒 এখনই অর্ডার করুন</a>
            <a href="#products" class="btn-secondary">📦 দাম দেখুন</a>
          </div>
          <div class="hero-stats">
            <div class="hero-stat">
              <div class="hero-stat-value">500+</div>
              <div class="hero-stat-label">সন্তুষ্ট গ্রাহক</div>
            </div>
            <div class="hero-stat">
              <div class="hero-stat-value">100%</div>
              <div class="hero-stat-label">খাঁটি উপাদান</div>
            </div>
            <div class="hero-stat">
              <div class="hero-stat-value">4.9★</div>
              <div class="hero-stat-label">গ্রাহক রেটিং</div>
            </div>
          </div>
        </div>
        <div class="hero-image-wrapper">
          <div class="hero-image-glow"></div>
          <img src="/images/beresta-bowls.jpeg" alt="ILHAM's Kitchen প্রিমিয়াম পেয়াজ বেরেস্তা" class="hero-image" loading="eager">
        </div>
      </div>
    </section>

    <!-- Products -->
    <section class="section" id="products">
      <div class="section-header reveal">
        <span class="section-label">🧅 PRODUCTS</span>
        <h2 class="section-title">আমাদের প্যাকেজসমূহ</h2>
        <p class="section-subtitle">সুলভ মূল্যে প্রিমিয়াম কোয়ালিটির পেয়াজ বেরেস্তা</p>
      </div>
      <div class="products-grid" id="productsGrid"></div>
    </section>

    <!-- Features -->
    <section class="section features-section" id="features">
      <div class="section-header reveal">
        <span class="section-label">✨ WHY US</span>
        <h2 class="section-title">কেন আমাদের বেরেস্তা বেছে নেবেন?</h2>
      </div>
      <div class="features-grid">
        <div class="feature-card reveal">
          <div class="feature-icon">🌿</div>
          <h3 class="feature-title">১০০% খাঁটি ও ন্যাচারাল</h3>
          <p class="feature-desc">কোন কেমিক্যাল বা প্রিজারভেটিভ ছাড়াই তৈরি। সম্পূর্ণ প্রাকৃতিক উপায়ে ভাজা তাজা পেয়াজ দিয়ে প্রস্তুত।</p>
        </div>
        <div class="feature-card reveal">
          <div class="feature-icon">⚡</div>
          <h3 class="feature-title">রেডি টু ইউজ</h3>
          <p class="feature-desc">কোন ঝামেলা নেই! প্যাকেট থেকে বের করেই সরাসরি খাবারে ব্যবহার করুন। সময় ও শ্রম দুটোই বাঁচান।</p>
        </div>
        <div class="feature-card reveal">
          <div class="feature-icon">🏆</div>
          <h3 class="feature-title">রেস্তোরাঁ মানের মান</h3>
          <p class="feature-desc">ঘরোয়া স্বাদ কিন্তু রেস্তোরাঁ মানের কোয়ালিটি। আপনার প্রতিটি রান্নাকে করে তুলবে অসাধারণ।</p>
        </div>
      </div>
    </section>

    <!-- Gallery -->
    <section class="section" id="gallery">
      <div class="section-header reveal">
        <span class="section-label">📸 GALLERY</span>
        <h2 class="section-title">আমাদের পণ্যের ছবি</h2>
      </div>
      <div class="gallery-grid reveal">
        <div class="gallery-item">
          <img src="/images/beresta-bowls.jpeg" alt="পেয়াজ বেরেস্তা বাউলে" loading="lazy">
        </div>
        <div class="gallery-item">
          <img src="/images/beresta-jars.jpeg" alt="পেয়াজ বেরেস্তা জারে" loading="lazy">
        </div>
        <div class="gallery-item">
          <img src="/images/beresta-tray.jpeg" alt="পেয়াজ বেরেস্তা ট্রেতে" loading="lazy">
        </div>
      </div>
    </section>

    <!-- Delivery Info -->
    <section class="section" id="delivery">
      <div class="section-header reveal">
        <span class="section-label">🚚 DELIVERY</span>
        <h2 class="section-title">ডেলিভারি তথ্য</h2>
        <p class="section-subtitle">সারা বাংলাদেশে ক্যাশ অন ডেলিভারি সার্ভিস</p>
      </div>
      <div class="delivery-cards reveal">
        <div class="delivery-card">
          <div class="delivery-icon">🏙️</div>
          <div class="delivery-area">ঢাকার ভিতরে</div>
          <div class="delivery-price">৳<span class="currency-sm">60</span></div>
          <p style="color: var(--color-text-muted); font-size: 0.85rem; margin-top: 8px;">১ থেকে ২ দিনে ডেলিভারি</p>
        </div>
        <div class="delivery-card">
          <div class="delivery-icon">🌍</div>
          <div class="delivery-area">ঢাকার বাইরে</div>
          <div class="delivery-price">৳<span class="currency-sm">120</span></div>
          <p style="color: var(--color-text-muted); font-size: 0.85rem; margin-top: 8px;">২ থেকে ৩ দিনে ডেলিভারি</p>
        </div>
        <div class="delivery-card">
          <div class="delivery-icon">💳</div>
          <div class="delivery-area">পেমেন্ট</div>
          <div class="delivery-price" style="font-size: 1.2rem; color: var(--color-success);">ক্যাশ অন ডেলিভারি</div>
          <p style="color: var(--color-text-muted); font-size: 0.85rem; margin-top: 8px;">পণ্য হাতে পেয়ে টাকা দিন</p>
        </div>
      </div>
    </section>

    <!-- Order Form -->
    <section class="section order-section" id="order">
      <div class="section-header reveal">
        <span class="section-label">🛒 ORDER NOW</span>
        <h2 class="section-title">অর্ডার করুন এখনই</h2>
        <p class="section-subtitle">আপনার তথ্য দিন, আমরা আপনার দোরগোড়ায় পৌঁছে দেবো</p>
      </div>
      <div class="order-container reveal">
        <div class="order-form-card">
          <h3 class="order-form-title">📋 আপনার তথ্য</h3>
          <div class="form-group">
            <label class="form-label" for="customerName">আপনার নাম *</label>
            <input type="text" id="customerName" class="form-input" placeholder="আপনার পুরো নাম লিখুন">
          </div>
          <div class="form-group">
            <label class="form-label" for="customerPhone">মোবাইল নম্বর *</label>
            <input type="tel" id="customerPhone" class="form-input" placeholder="01XXXXXXXXX">
          </div>
          <div class="form-group">
            <label class="form-label" for="customerAddress">সম্পূর্ণ ঠিকানা *</label>
            <textarea id="customerAddress" class="form-input" rows="3" placeholder="আপনার বিস্তারিত ঠিকানা লিখুন"></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">ডেলিভারি এরিয়া *</label>
            <div class="form-radio-group">
              <label class="form-radio-label">
                <input type="radio" name="area" value="dhaka" checked onchange="updateArea('dhaka')">
                <span class="radio-dot"></span>
                🏙️ ঢাকার ভিতরে
              </label>
              <label class="form-radio-label">
                <input type="radio" name="area" value="outside" onchange="updateArea('outside')">
                <span class="radio-dot"></span>
                🌍 ঢাকার বাইরে
              </label>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label" for="customerNote">বিশেষ নোট (ঐচ্ছিক)</label>
            <textarea id="customerNote" class="form-input" rows="2" placeholder="কোন বিশেষ কথা থাকলে লিখুন"></textarea>
          </div>
        </div>
        <div class="cart-summary" id="cartSummary">
          <h3 class="cart-title">🛒 আপনার কার্ট</h3>
          <div id="cartContent"></div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-container">
        <div>
          <div class="footer-brand-name">ILHAM's Kitchen</div>
          <p class="footer-desc">প্রিমিয়াম ক্রিসপি পেয়াজ বেরেস্তা। ঘরোয়া স্বাদ, রেস্তোরাঁ মানের মান।</p>
        </div>
        <div>
          <div class="footer-heading">দ্রুত লিংক</div>
          <ul class="footer-links">
            <li><a href="#products">পণ্যসমূহ</a></li>
            <li><a href="#features">কেন আমরা</a></li>
            <li><a href="#order">অর্ডার করুন</a></li>
            <li><a href="#/admin">অ্যাডমিন প্যানেল</a></li>
          </ul>
        </div>
        <div>
          <div class="footer-heading">যোগাযোগ</div>
          <ul class="footer-links">
            <li>📞 01679226855</li>
            <li>📍 বাংলাদেশ</li>
          </ul>
          <div class="footer-social" style="margin-top: 16px;">
            <a href="https://www.facebook.com/profile.php?id=61561058960023" target="_blank" rel="noopener" aria-label="Facebook">📘</a>
            <a href="tel:01679226855" aria-label="Phone">📞</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        &copy; 2026 ILHAM's Kitchen. সর্বস্বত্ব সংরক্ষিত।
      </div>
    </footer>

    <!-- Floating CTA -->
    <div class="floating-cta">
      <a href="tel:01679226855" class="floating-btn phone" aria-label="Call us">📞</a>
      <a href="https://www.facebook.com/profile.php?id=61561058960023" target="_blank" rel="noopener" class="floating-btn facebook" aria-label="Facebook">📘</a>
    </div>
  `;
}

// ========================================
// LANDING PAGE INIT
// ========================================
function initLandingPage() {
    renderProductCards();
    renderCartContent();
    initScrollEffects();
    initNavbar();
    trackPixel('ViewContent', { content_name: 'Peyaz Beresta', content_category: 'Food' });
}

// ========================================
// PRODUCT CARDS
// ========================================
function renderProductCards() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    grid.innerHTML = PRODUCTS.map(product => {
        const qty = cart[product.id] || 0;
        return `
      <div class="product-card ${product.popular ? 'popular' : ''} reveal">
        ${product.popular ? '<span class="popular-badge">জনপ্রিয়</span>' : ''}
        <div class="product-weight">${product.weight}</div>
        <div class="product-weight-unit">${product.unit}</div>
        <div class="product-price">৳${product.price.toLocaleString()} <span class="currency">টাকা</span></div>
        <div class="product-per-unit">${product.perUnit}</div>
        ${qty > 0 ? `
          <div class="qty-selector">
            <button class="qty-btn" onclick="updateCart(${product.id}, -1)">−</button>
            <span class="qty-value">${qty}</span>
            <button class="qty-btn" onclick="updateCart(${product.id}, 1)">+</button>
          </div>
        ` : `
          <button class="product-add-btn ${product.popular ? 'filled' : 'outline'}" onclick="addToCart(${product.id})">
            🛒 কার্টে যোগ করুন
          </button>
        `}
      </div>
    `;
    }).join('');

    // Re-apply scroll reveal
    initScrollReveal();
}

// ========================================
// CART MANAGEMENT
// ========================================
function addToCart(productId) {
    cart[productId] = 1;
    renderProductCards();
    renderCartContent();
    showToast('✅ পণ্য কার্টে যোগ হয়েছে!', 'success');
    trackPixel('AddToCart', {
        content_ids: [productId],
        content_type: 'product',
        value: PRODUCTS.find(p => p.id === productId).price,
        currency: 'BDT'
    });
}

function updateCart(productId, delta) {
    const newQty = (cart[productId] || 0) + delta;
    if (newQty <= 0) {
        delete cart[productId];
    } else {
        cart[productId] = newQty;
    }
    renderProductCards();
    renderCartContent();
}

// Make functions global for onclick handlers
window.addToCart = addToCart;
window.updateCart = updateCart;
window.updateArea = function (area) {
    currentArea = area;
    renderCartContent();
};
window.submitOrder = submitOrder;

function getCartTotal() {
    let subtotal = 0;
    Object.entries(cart).forEach(([id, qty]) => {
        const product = PRODUCTS.find(p => p.id === parseInt(id));
        if (product) subtotal += product.price * qty;
    });
    const delivery = DELIVERY_CHARGES[currentArea];
    return { subtotal, delivery, total: subtotal + delivery };
}

function renderCartContent() {
    const container = document.getElementById('cartContent');
    if (!container) return;

    const cartItems = Object.entries(cart);
    if (cartItems.length === 0) {
        container.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon">🛒</div>
        <p>আপনার কার্ট খালি</p>
        <p style="font-size: 0.82rem; margin-top: 4px;">উপরে থেকে পণ্য যোগ করুন</p>
      </div>
    `;
        return;
    }

    const { subtotal, delivery, total } = getCartTotal();

    container.innerHTML = `
    <div class="cart-items">
      ${cartItems.map(([id, qty]) => {
        const product = PRODUCTS.find(p => p.id === parseInt(id));
        return `
          <div class="cart-item">
            <div>
              <div class="cart-item-name">${product.weight} ${product.unit}</div>
              <div class="cart-item-qty">x${qty}</div>
            </div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <span class="cart-item-price">৳${(product.price * qty).toLocaleString()}</span>
              <button class="cart-item-remove" onclick="updateCart(${product.id}, -${qty})">✕</button>
            </div>
          </div>
        `;
    }).join('')}
    </div>
    <div class="cart-divider"></div>
    <div class="cart-row">
      <span>মোট পণ্য</span>
      <span>৳${subtotal.toLocaleString()}</span>
    </div>
    <div class="cart-row">
      <span>ডেলিভারি (${currentArea === 'dhaka' ? 'ঢাকা' : 'ঢাকার বাইরে'})</span>
      <span>৳${delivery}</span>
    </div>
    <div class="cart-divider"></div>
    <div class="cart-row total">
      <span>সর্বমোট</span>
      <span>৳${total.toLocaleString()}</span>
    </div>
    <button class="order-submit-btn" id="submitOrderBtn" onclick="submitOrder()">
      ✅ অর্ডার কনফার্ম করুন (ক্যাশ অন ডেলিভারি)
    </button>
    <div class="cod-badge">
      🔒 পণ্য হাতে পেয়ে টাকা দিন
    </div>
  `;
}

// ========================================
// ORDER SUBMISSION
// ========================================
function submitOrder() {
    const name = document.getElementById('customerName')?.value.trim();
    const phone = document.getElementById('customerPhone')?.value.trim();
    const address = document.getElementById('customerAddress')?.value.trim();
    const note = document.getElementById('customerNote')?.value.trim();

    // Validation
    if (!name) { showToast('❌ অনুগ্রহ করে আপনার নাম লিখুন', 'error'); return; }
    if (!phone || phone.length < 11) { showToast('❌ সঠিক মোবাইল নম্বর লিখুন', 'error'); return; }
    if (!address) { showToast('❌ অনুগ্রহ করে আপনার ঠিকানা লিখুন', 'error'); return; }
    if (Object.keys(cart).length === 0) { showToast('❌ কার্টে কোন পণ্য নেই', 'error'); return; }

    const { subtotal, delivery, total } = getCartTotal();

    const order = {
        id: generateOrderId(),
        customer: { name, phone, address, area: currentArea, note },
        items: Object.entries(cart).map(([id, qty]) => {
            const product = PRODUCTS.find(p => p.id === parseInt(id));
            return {
                productId: product.id,
                weight: product.weight + ' ' + product.unit,
                price: product.price,
                qty,
                total: product.price * qty
            };
        }),
        subtotal,
        delivery,
        total,
        status: 'pending',
        createdAt: new Date().toISOString(),
    };

    // Save to localStorage
    const orders = JSON.parse(localStorage.getItem('ilham_orders') || '[]');
    orders.push(order);
    localStorage.setItem('ilham_orders', JSON.stringify(orders));

    // Track pixel
    trackPixel('Purchase', {
        content_ids: order.items.map(i => i.productId),
        content_type: 'product',
        value: total,
        currency: 'BDT',
        num_items: order.items.reduce((sum, i) => sum + i.qty, 0)
    });

    // Reset cart and form
    cart = {};
    document.getElementById('customerName').value = '';
    document.getElementById('customerPhone').value = '';
    document.getElementById('customerAddress').value = '';
    document.getElementById('customerNote').value = '';
    renderProductCards();
    renderCartContent();

    // Show success modal
    showOrderSuccessModal(order.id);
}

function generateOrderId() {
    const now = new Date();
    const dateStr = now.getFullYear().toString().slice(2) +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0');
    const rand = Math.floor(Math.random() * 900 + 100);
    return `IK${dateStr}${rand}`;
}

function showOrderSuccessModal(orderId) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'successModal';
    modal.innerHTML = `
    <div class="modal-card">
      <div class="modal-icon">🎉</div>
      <h3 class="modal-title">অর্ডার সফল হয়েছে!</h3>
      <p class="modal-text">
        আপনার অর্ডার আইডি: <strong style="color: var(--color-primary-light);">${orderId}</strong><br>
        আমরা শীঘ্রই আপনার সাথে যোগাযোগ করবো।<br>
        ধন্যবাদ ILHAM's Kitchen থেকে অর্ডার করার জন্য!
      </p>
      <button class="modal-close-btn" onclick="closeSuccessModal()">ধন্যবাদ ✨</button>
    </div>
  `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeSuccessModal();
    });
}

window.closeSuccessModal = function () {
    const modal = document.getElementById('successModal');
    if (modal) modal.remove();
};

// ========================================
// SCROLL EFFECTS
// ========================================
function initScrollEffects() {
    // Navbar scroll
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 60);
        }
    });

    initScrollReveal();
}

function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => {
        if (!el.classList.contains('visible')) {
            observer.observe(el);
        }
    });
}

// ========================================
// NAVBAR
// ========================================
function initNavbar() {
    const menuBtn = document.getElementById('menuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavClose = document.getElementById('mobileNavClose');

    if (menuBtn && mobileNav) {
        menuBtn.addEventListener('click', () => mobileNav.classList.add('open'));
        mobileNavClose?.addEventListener('click', () => mobileNav.classList.remove('open'));
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => mobileNav.classList.remove('open'));
        });
    }
}

// ========================================
// TOAST NOTIFICATION
// ========================================
function showToast(message, type = 'info') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ========================================
// FACEBOOK PIXEL HELPER
// ========================================
function trackPixel(event, params = {}) {
    if (typeof fbq === 'function') {
        fbq('track', event, params);
    }
}

// ========================================
// ADMIN DASHBOARD
// ========================================
function renderAdmin(container) {
    const isLoggedIn = sessionStorage.getItem('ilham_admin') === 'true';

    if (!isLoggedIn) {
        renderAdminLogin(container);
        return;
    }

    renderAdminDashboard(container);
}

function renderAdminLogin(container) {
    container.innerHTML = `
    <div class="admin-login">
      <div class="admin-login-card">
        <div style="font-size: 3rem; margin-bottom: 16px;">🔐</div>
        <h2 style="font-size: 1.4rem; font-weight: 700;">অ্যাডমিন লগইন</h2>
        <p style="color: var(--color-text-muted); font-size: 0.9rem; margin-top: 8px;">ILHAM's Kitchen Dashboard</p>
        <input type="password" id="adminPassword" class="form-input" placeholder="পাসওয়ার্ড লিখুন" onkeydown="if(event.key==='Enter')adminLogin()">
        <button class="admin-login-btn" onclick="adminLogin()">লগইন করুন</button>
        <div id="adminError" class="admin-error" style="display:none;"></div>
        <a href="#/" style="display: inline-block; margin-top: 16px; color: var(--color-text-muted); font-size: 0.85rem;">← মূল পৃষ্ঠায় ফিরুন</a>
      </div>
    </div>
  `;
}

window.adminLogin = function () {
    const password = document.getElementById('adminPassword')?.value;
    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('ilham_admin', 'true');
        renderAdmin(document.getElementById('app'));
    } else {
        const err = document.getElementById('adminError');
        if (err) {
            err.textContent = '❌ পাসওয়ার্ড ভুল হয়েছে';
            err.style.display = 'block';
        }
    }
};

window.adminLogout = function () {
    sessionStorage.removeItem('ilham_admin');
    window.location.hash = '#/';
};

let adminSearchQuery = '';
let adminFilterStatus = 'all';

function renderAdminDashboard(container) {
    const orders = getOrders();
    const stats = getOrderStats(orders);
    const filtered = filterOrders(orders);

    container.innerHTML = `
    <div class="admin-page">
      <div class="admin-header">
        <div class="admin-header-left">
          <span class="admin-header-title">📊 ILHAM's Kitchen Dashboard</span>
          <a href="#/" class="admin-back-btn">← মূল পৃষ্ঠা</a>
        </div>
        <button class="admin-logout-btn" onclick="adminLogout()">লগআউট</button>
      </div>

      <div class="admin-stats">
        <div class="stat-card">
          <div class="stat-card-icon">📦</div>
          <div class="stat-card-value">${stats.totalOrders}</div>
          <div class="stat-card-label">মোট অর্ডার</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon">⏳</div>
          <div class="stat-card-value">${stats.pending}</div>
          <div class="stat-card-label">পেন্ডিং</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon">✅</div>
          <div class="stat-card-value">${stats.delivered}</div>
          <div class="stat-card-label">ডেলিভার্ড</div>
        </div>
        <div class="stat-card">
          <div class="stat-card-icon">💰</div>
          <div class="stat-card-value">৳${stats.revenue.toLocaleString()}</div>
          <div class="stat-card-label">মোট আয়</div>
        </div>
      </div>

      <div class="admin-controls">
        <input type="text" class="admin-search" id="adminSearch" placeholder="🔍 ফোন নম্বর বা নাম দিয়ে খুঁজুন..." value="${adminSearchQuery}" oninput="handleAdminSearch(this.value)">
        <select class="admin-filter" id="adminFilter" onchange="handleAdminFilter(this.value)">
          <option value="all" ${adminFilterStatus === 'all' ? 'selected' : ''}>সব অর্ডার</option>
          <option value="pending" ${adminFilterStatus === 'pending' ? 'selected' : ''}>পেন্ডিং</option>
          <option value="confirmed" ${adminFilterStatus === 'confirmed' ? 'selected' : ''}>কনফার্মড</option>
          <option value="delivered" ${adminFilterStatus === 'delivered' ? 'selected' : ''}>ডেলিভার্ড</option>
          <option value="cancelled" ${adminFilterStatus === 'cancelled' ? 'selected' : ''}>ক্যান্সেলড</option>
        </select>
        <button class="admin-export-btn" onclick="exportOrders()">📋 এক্সপোর্ট CSV</button>
      </div>

      <div class="admin-orders">
        ${filtered.length === 0 ? `
          <div class="orders-table">
            <div class="order-no-results">
              <div class="order-no-results-icon">📭</div>
              <p>কোন অর্ডার পাওয়া যায়নি</p>
            </div>
          </div>
        ` : `
          <div class="orders-table">
            <div class="orders-table-header">
              <div>ID</div>
              <div>গ্রাহক</div>
              <div>ফোন</div>
              <div>মোট</div>
              <div>স্ট্যাটাস</div>
              <div>তারিখ</div>
            </div>
            ${filtered.map(order => `
              <div class="order-row" onclick="showOrderDetail('${order.id}')">
                <div class="order-id">#${order.id}</div>
                <div class="order-customer-name">${order.customer.name}</div>
                <div class="order-customer-phone">${order.customer.phone}</div>
                <div class="order-total">৳${order.total.toLocaleString()}</div>
                <div><span class="status-badge status-${order.status}">${getStatusLabel(order.status)}</span></div>
                <div style="font-size: 0.82rem; color: var(--color-text-muted); font-family: var(--font-english);">${formatDate(order.createdAt)}</div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    </div>
  `;
}

// Admin helpers
function getOrders() {
    return JSON.parse(localStorage.getItem('ilham_orders') || '[]').reverse();
}

function getOrderStats(orders) {
    return {
        totalOrders: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        confirmed: orders.filter(o => o.status === 'confirmed').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
        revenue: orders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0)
    };
}

function filterOrders(orders) {
    return orders.filter(o => {
        const matchesStatus = adminFilterStatus === 'all' || o.status === adminFilterStatus;
        const matchesSearch = !adminSearchQuery ||
            o.customer.name.toLowerCase().includes(adminSearchQuery.toLowerCase()) ||
            o.customer.phone.includes(adminSearchQuery) ||
            o.id.toLowerCase().includes(adminSearchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });
}

function getStatusLabel(status) {
    const labels = {
        pending: 'Pending',
        confirmed: 'Confirmed',
        delivered: 'Delivered',
        cancelled: 'Cancelled'
    };
    return labels[status] || status;
}

function formatDate(isoDate) {
    const d = new Date(isoDate);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

window.handleAdminSearch = function (query) {
    adminSearchQuery = query;
    renderAdminDashboard(document.getElementById('app'));
    // Re-focus and set cursor position
    const input = document.getElementById('adminSearch');
    if (input) {
        input.focus();
        input.setSelectionRange(query.length, query.length);
    }
};

window.handleAdminFilter = function (status) {
    adminFilterStatus = status;
    renderAdminDashboard(document.getElementById('app'));
};

window.showOrderDetail = function (orderId) {
    const orders = getOrders();
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const modal = document.createElement('div');
    modal.className = 'modal-overlay order-detail-modal';
    modal.id = 'orderDetailModal';
    modal.innerHTML = `
    <div class="modal-card">
      <div class="order-detail-header">
        <div>
          <h3 style="font-size: 1.2rem; font-weight: 700;">অর্ডার ডিটেইলস</h3>
          <div class="order-detail-id">#${order.id}</div>
        </div>
        <button class="order-detail-close" onclick="closeOrderDetail()">✕</button>
      </div>

      <div class="order-detail-section">
        <div class="order-detail-section-title">Customer Info</div>
        <div class="order-detail-info">
          <div class="order-detail-info-item">
            <div class="order-detail-info-label">নাম</div>
            <div class="order-detail-info-value">${order.customer.name}</div>
          </div>
          <div class="order-detail-info-item">
            <div class="order-detail-info-label">ফোন</div>
            <div class="order-detail-info-value">${order.customer.phone}</div>
          </div>
          <div class="order-detail-info-item" style="grid-column: 1 / -1;">
            <div class="order-detail-info-label">ঠিকানা</div>
            <div class="order-detail-info-value">${order.customer.address}</div>
          </div>
          <div class="order-detail-info-item">
            <div class="order-detail-info-label">এরিয়া</div>
            <div class="order-detail-info-value">${order.customer.area === 'dhaka' ? 'ঢাকার ভিতরে' : 'ঢাকার বাইরে'}</div>
          </div>
          ${order.customer.note ? `
            <div class="order-detail-info-item">
              <div class="order-detail-info-label">নোট</div>
              <div class="order-detail-info-value">${order.customer.note}</div>
            </div>
          ` : ''}
        </div>
      </div>

      <div class="order-detail-section">
        <div class="order-detail-section-title">Order Items</div>
        <div class="order-detail-items">
          ${order.items.map(item => `
            <div class="order-detail-item">
              <span>${item.weight} x${item.qty}</span>
              <span style="font-family: var(--font-english); font-weight: 600; color: var(--color-primary-light);">৳${item.total.toLocaleString()}</span>
            </div>
          `).join('')}
          <div class="order-detail-item">
            <span>ডেলিভারি</span>
            <span style="font-family: var(--font-english);">৳${order.delivery}</span>
          </div>
          <div class="order-detail-total-row">
            <span>সর্বমোট</span>
            <span>৳${order.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div class="order-detail-section">
        <div class="order-detail-section-title">Update Status</div>
        <select class="status-select" id="statusSelect" onchange="updateOrderStatus('${order.id}', this.value)">
          <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>⏳ Pending</option>
          <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>✅ Confirmed</option>
          <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>📦 Delivered</option>
          <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>❌ Cancelled</option>
        </select>
      </div>
    </div>
  `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeOrderDetail();
    });
};

window.closeOrderDetail = function () {
    const modal = document.getElementById('orderDetailModal');
    if (modal) modal.remove();
};

window.updateOrderStatus = function (orderId, newStatus) {
    const orders = JSON.parse(localStorage.getItem('ilham_orders') || '[]');
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx !== -1) {
        orders[idx].status = newStatus;
        localStorage.setItem('ilham_orders', JSON.stringify(orders));
        showToast(`✅ অর্ডার #${orderId} স্ট্যাটাস আপডেট হয়েছে`, 'success');
        closeOrderDetail();
        renderAdminDashboard(document.getElementById('app'));
    }
};

window.exportOrders = function () {
    const orders = getOrders();
    if (orders.length === 0) {
        showToast('❌ কোন অর্ডার নেই', 'error');
        return;
    }
    const header = 'Order ID,Name,Phone,Address,Area,Items,Subtotal,Delivery,Total,Status,Date\n';
    const rows = orders.map(o => {
        const items = o.items.map(i => `${i.weight}x${i.qty}`).join(' | ');
        return `${o.id},"${o.customer.name}",${o.customer.phone},"${o.customer.address}",${o.customer.area},"${items}",${o.subtotal},${o.delivery},${o.total},${o.status},${formatDate(o.createdAt)}`;
    }).join('\n');

    const csv = header + rows;
    navigator.clipboard.writeText(csv).then(() => {
        showToast('✅ CSV ক্লিপবোর্ডে কপি হয়েছে!', 'success');
    }).catch(() => {
        // Fallback: download
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ilham_orders.csv';
        a.click();
        URL.revokeObjectURL(url);
        showToast('✅ CSV ফাইল ডাউনলোড হচ্ছে!', 'success');
    });
};

// Remove default Vite files
const defaultStyles = document.querySelector('link[href="/src/style.css"]');
if (defaultStyles) defaultStyles.remove();
