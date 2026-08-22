// =========================================================
// ORÈVA — Shared UI: header, footer, drawer, toasts, helpers
// Included on every page so header/nav/footer stay in sync.
// =========================================================
import { cartCount, wishlistCount, isWishlisted, toggleWishlist } from './cart.js';

const NAV_LINKS = [
  { href: 'shop.html', label: 'Shop' },
  { href: 'shop.html?filter=new', label: 'New Arrivals' },
  { href: 'shop.html?filter=bestsellers', label: 'Best Sellers' },
  { href: 'about.html', label: 'About' },
  { href: 'contact.html', label: 'Contact' },
];

const ICONS = {
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 21s-7.5-4.6-10-9.3C.4 8.1 2.4 4.5 6 4c2.1-.3 4 .8 6 3 2-2.2 3.9-3.3 6-3 3.6.5 5.6 4.1 4 7.7C19.5 16.4 12 21 12 21z"/></svg>',
  heartFill: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.6-10-9.3C.4 8.1 2.4 4.5 6 4c2.1-.3 4 .8 6 3 2-2.2 3.9-3.3 6-3 3.6.5 5.6 4.1 4 7.7C19.5 16.4 12 21 12 21z"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>',
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 8h12l-1 12H7L6 8z"/><path d="M9 8V6a3 3 0 016 0v2"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2zm5.8 14.3c-.3.7-1.4 1.3-2 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.6-.6-2.9-1.3-4.8-4.2-4.9-4.4-.1-.2-1.2-1.6-1.2-3 0-1.4.7-2.1 1-2.4.3-.3.6-.3.8-.3h.5c.2 0 .4 0 .6.5.2.5.7 1.8.8 1.9.1.2.1.3 0 .5-.1.2-.1.3-.3.5-.1.2-.3.4-.4.5-.1.2-.3.3-.1.6.2.3.9 1.4 1.9 2.3 1.3 1.1 2.4 1.5 2.7 1.6.3.1.5.1.7-.1.2-.2.8-.9 1-1.2.2-.3.4-.2.7-.1.3.1 1.8.8 2.1 1 .3.1.5.2.6.3.1.2.1.9-.2 1.6z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12s0-3.2-.4-4.7c-.3-.9-1-1.6-1.9-1.8C18 5 12 5 12 5s-6 0-7.7.5c-.9.2-1.6.9-1.9 1.8C2 8.8 2 12 2 12s0 3.2.4 4.7c.3.9 1 1.6 1.9 1.8C6 19 12 19 12 19s6 0 7.7-.5c.9-.2 1.6-.9 1.9-1.8.4-1.5.4-4.7.4-4.7zM10 15.2V8.8L15.5 12 10 15.2z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
};

export const CONTACT = {
  name: 'Abdur Rahman Mallik',
  email: 'mallikabdurrahman37@gmail.com',
  phone: '+91 9239529167',
  whatsapp: '919239529167',
  address: 'Ashiana Complex near SM memorial school, Hooghly, WB 712701',
  instagram: 'https://www.instagram.com/mallik.abdur?igsh=YXNwdm52OWxydnpz',
  youtube: 'https://youtube.com/@ayatserenity-t4i?si=5ok6YzqJ8EmMzwir',
};

export function formatINR(n){
  const v = Number(n) || 0;
  return '\u20B9' + v.toLocaleString('en-IN');
}

export function formatDate(d){
  if (!d) return '\u2014';
  const date = d.toDate ? d.toDate() : new Date(d);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function toast(msg){
  let wrap = document.querySelector('.toast-wrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.className = 'toast-wrap';
    document.body.appendChild(wrap);
  }
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

function logoMarkup(cls){
  return `
    <span class="brand ${cls}">
      <img class="brand-img" src="assets/logo.png" alt="ORÈVA" onerror="this.parentElement.classList.add('no-logo')">
      <span class="brand-text brand-fallback">OR\u00c8VA</span>
    </span>`;
}

export function renderHeader(activePage = ''){
  const mount = document.getElementById('site-header');
  if (!mount) return;
  mount.innerHTML = `
    <header class="site-header">
      <div class="container header-row">
        <a href="index.html" aria-label="ORÈVA home">${logoMarkup('')}</a>
        <nav class="nav-desktop" aria-label="Primary">
          ${NAV_LINKS.map(l => `<a href="${l.href}" class="${activePage === l.href.split('?')[0] ? 'active' : ''}">${l.label}</a>`).join('')}
        </nav>
        <div class="search-desktop">
          ${ICONS.search}
          <input type="search" id="header-search-input" placeholder="Search products">
        </div>
        <div class="header-actions">
          <button class="icon-btn hide-mobile" id="header-search-btn" aria-label="Search" style="display:none">${ICONS.search}</button>
          <a class="icon-btn" href="wishlist.html" aria-label="Wishlist">${ICONS.heart}<span class="badge" id="wishlist-badge" hidden>0</span></a>
          <a class="icon-btn" href="account.html" aria-label="Account">${ICONS.user}</a>
          <a class="icon-btn" href="cart.html" aria-label="Cart">${ICONS.bag}<span class="badge" id="cart-badge" hidden>0</span></a>
          <button class="hamburger" id="drawer-open" aria-label="Open menu">${ICONS.menu}</button>
        </div>
      </div>
    </header>
    <div class="drawer-overlay" id="drawer-overlay"></div>
    <aside class="mobile-drawer" id="mobile-drawer" aria-hidden="true">
      <div class="drawer-head">
        ${logoMarkup('')}
        <button class="drawer-close" id="drawer-close" aria-label="Close menu">${ICONS.close}</button>
      </div>
      <div class="drawer-body">
        <div class="drawer-search">
          ${ICONS.search}
          <input type="search" id="drawer-search-input" placeholder="Search products">
        </div>
        <nav class="drawer-nav">
          ${NAV_LINKS.map(l => `<a href="${l.href}">${l.label}</a>`).join('')}
          <a href="account.html">Account</a>
          <a href="my-orders.html">My Orders</a>
          <a href="wishlist.html">Wishlist</a>
        </nav>
      </div>
      <div class="drawer-foot">
        <a class="btn btn-outline btn-block" href="cart.html">View Cart</a>
        <a class="btn btn-primary btn-block" href="account.html">My Account</a>
      </div>
    </aside>
  `;
  wireHeader();
  refreshBadges();
  window.addEventListener('oreva:cart-updated', refreshBadges);
  window.addEventListener('oreva:wishlist-updated', refreshBadges);
}

function refreshBadges(){
  const cb = document.getElementById('cart-badge');
  const wb = document.getElementById('wishlist-badge');
  if (cb) {
    const n = cartCount();
    cb.textContent = n;
    cb.hidden = n === 0;
  }
  if (wb) {
    const n = wishlistCount();
    wb.textContent = n;
    wb.hidden = n === 0;
  }
}

function wireHeader(){
  const openBtn = document.getElementById('drawer-open');
  const closeBtn = document.getElementById('drawer-close');
  const overlay = document.getElementById('drawer-overlay');
  const drawer = document.getElementById('mobile-drawer');

  function open(){
    drawer.classList.add('open');
    overlay.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('drawer-locked');
  }
  function close(){
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('drawer-locked');
  }
  openBtn?.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  overlay?.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  function goSearch(input){
    const val = input.value.trim();
    if (val) window.location.href = `shop.html?q=${encodeURIComponent(val)}`;
  }
  document.getElementById('header-search-input')?.addEventListener('keydown', e => { if (e.key === 'Enter') goSearch(e.target); });
  document.getElementById('drawer-search-input')?.addEventListener('keydown', e => { if (e.key === 'Enter') goSearch(e.target); });
}

export function renderFooter(){
  const mount = document.getElementById('site-footer');
  if (!mount) return;
  mount.innerHTML = `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            ${logoMarkup('')}
            <p class="footer-desc">Considered pieces, made to be worn often. ORÈVA is an independent studio for the quietly premium.</p>
            <div class="footer-social">
              <a href="https://wa.me/${CONTACT.whatsapp}" target="_blank" rel="noopener" aria-label="WhatsApp">${ICONS.whatsapp}</a>
              <a href="${CONTACT.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${ICONS.instagram}</a>
              <a href="${CONTACT.youtube}" target="_blank" rel="noopener" aria-label="YouTube">${ICONS.youtube}</a>
              <a href="mailto:${CONTACT.email}" aria-label="Email">${ICONS.mail}</a>
            </div>
          </div>
          <div class="footer-col">
            <h5>Shop</h5>
            <a href="shop.html">All Products</a>
            <a href="shop.html?filter=new">New Arrivals</a>
            <a href="shop.html?filter=bestsellers">Best Sellers</a>
            <a href="wishlist.html">Wishlist</a>
          </div>
          <div class="footer-col">
            <h5>Support</h5>
            <a href="track-order.html">Track Order</a>
            <a href="faq.html">FAQ</a>
            <a href="shipping-policy.html">Shipping Policy</a>
            <a href="cancellation-policy.html">Cancellation Policy</a>
            <a href="return-policy.html">Return &amp; Refund</a>
          </div>
          <div class="footer-col">
            <h5>Company</h5>
            <a href="about.html">About ORÈVA</a>
            <a href="contact.html">Contact</a>
            <a href="privacy-policy.html">Privacy Policy</a>
            <a href="terms.html">Terms &amp; Conditions</a>
          </div>
        </div>
        <div class="footer-bottom">
          <span>&copy; ${new Date().getFullYear()} OR\u00c8VA. All rights reserved.</span>
          <div class="footer-bottom-links">
            <a href="tel:${CONTACT.phone.replace(/\s/g,'')}">${CONTACT.phone}</a>
            <a href="mailto:${CONTACT.email}">${CONTACT.email}</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}

export function wireWishlistButtons(products){
  document.querySelectorAll('[data-wish-id]').forEach(btn => {
    const p = products.find(x => x.id === btn.dataset.wishId);
    const paint = () => {
      const on = isWishlisted(btn.dataset.wishId);
      btn.innerHTML = on ? ICONS.heartFill : ICONS.heart;
      btn.style.color = on ? '#8C3A2B' : 'var(--ink)';
    };
    paint();
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!p) return;
      const on = toggleWishlist({ id: p.id, name: p.name, price: p.price, image: p.images[0] || '' });
      paint();
      toast(on ? 'Added to wishlist' : 'Removed from wishlist');
    });
  });
}

export function applyBackground(){
  const img = new Image();
  img.onload = () => { document.body.classList.add('has-bg'); };
  img.onerror = () => { document.body.classList.add('bg-fallback'); };
  img.src = 'assets/bg.png';
}
// =========================================================
// ORÈVA — PWA Install Prompt
// =========================================================

let deferredInstallPrompt = null;

export function initPWAInstallPrompt() {
  // Already installed as PWA
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  if (isStandalone) return;

  // Don't show the custom prompt again on this device/browser
  if (localStorage.getItem('oreva-pwa-prompt-shown') === 'true') {
    return;
  }

  // Chrome/Android gives us this event when the site is installable
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();

    deferredInstallPrompt = event;

    showPWAInstallPopup();
  });

  // When the app is successfully installed
  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    localStorage.setItem('oreva-pwa-prompt-shown', 'true');

    document.getElementById('pwa-install-popup')?.remove();
  });
}

function showPWAInstallPopup() {
  if (document.getElementById('pwa-install-popup')) return;

  const popup = document.createElement('div');

  popup.id = 'pwa-install-popup';

  popup.innerHTML = `
    <div class="pwa-install-card">
      <button class="pwa-install-close" aria-label="Close">
        ×
      </button>

      <img
        src="assets/logo.png"
        alt="ORÈVA"
        class="pwa-install-logo"
      >

      <div class="pwa-install-content">
        <h3>Install ORÈVA</h3>
        <p>
          Add ORÈVA to your home screen for a faster,
          more seamless shopping experience.
        </p>

        <div class="pwa-install-actions">
          <button class="pwa-install-btn" id="pwa-install-btn">
            Install
          </button>

          <button class="pwa-install-later" id="pwa-install-later">
            Maybe later
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(popup);

  const closePopup = () => {
    popup.remove();
    localStorage.setItem('oreva-pwa-prompt-shown', 'true');
  };

  popup.querySelector('.pwa-install-close')
    ?.addEventListener('click', closePopup);

  popup.querySelector('#pwa-install-later')
    ?.addEventListener('click', closePopup);

  popup.querySelector('#pwa-install-btn')
    ?.addEventListener('click', async () => {

      if (!deferredInstallPrompt) return;

      deferredInstallPrompt.prompt();

      const result = await deferredInstallPrompt.userChoice;

      if (result.outcome === 'accepted') {
        localStorage.setItem('oreva-pwa-prompt-shown', 'true');
      }

      deferredInstallPrompt = null;
      popup.remove();
    });
}

// Start PWA install handling
initPWAInstallPrompt();
export { ICONS };
