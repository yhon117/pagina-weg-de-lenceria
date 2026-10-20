// ELACE Lencería Boutique — lógica de la tienda
import { PRODUCTS, CATEGORIES, SIZES, getProduct, productPrice, productIva } from './products.js';
import * as cart from './cart.js';
import { initCheckout, fmt } from './checkout.js';

const state = {
  category: 'todas',
  query: '',
  currentProduct: null,
  currentSize: 'S',
  currentQty: 1,
};

const $ = (sel) => document.querySelector(sel);

/* ---------- Utilidades ---------- */

function toast(html) {
  const wrap = document.getElementById('toast-wrap');
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = html;
  wrap.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transition = 'opacity .3s';
    setTimeout(() => el.remove(), 320);
  }, 2400);
}

function attachImageFallback(img) {
  img.addEventListener('error', () => {
    if (img.dataset.fallbackApplied) return;
    img.dataset.fallbackApplied = '1';
    img.src = 'img/placeholder.svg';
  });
}

document.querySelectorAll('img[data-fallback]').forEach(attachImageFallback);

/* ---------- Catálogo ---------- */

function filteredProducts() {
  const q = state.query.trim().toLowerCase();
  return PRODUCTS.filter((p) => {
    const catOk = state.category === 'todas' || p.category === state.category;
    const text = `${p.name} ${p.desc} ${CATEGORIES[p.category].label}`.toLowerCase();
    return catOk && (!q || text.includes(q));
  });
}

function renderCatalog() {
  const grid = document.getElementById('product-grid');
  const empty = document.getElementById('catalog-empty');
  const count = document.getElementById('catalog-count');
  const items = filteredProducts();

  grid.innerHTML = '';
  empty.hidden = items.length > 0;
  count.textContent = items.length === 1 ? '1 producto' : `${items.length} productos`;

  for (const p of items) {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-card-media" data-open-product="${p.id}">
        <span class="product-tag">${CATEGORIES[p.category].label}</span>
        <img src="${p.img}" alt="${p.name}" loading="lazy">
      </div>
      <div class="product-card-body">
        <h3><button data-open-product="${p.id}">${p.name}</button></h3>
        <p class="product-price">${fmt(productPrice(p))}</p>
        <button class="btn btn-outline" data-open-product="${p.id}">Ver detalle</button>
      </div>
    `;
    attachImageFallback(card.querySelector('img'));
    grid.appendChild(card);
  }
}

document.getElementById('category-filters').addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  state.category = btn.dataset.category;
  document.querySelectorAll('.filter-btn').forEach((b) => b.classList.toggle('active', b === btn));
  renderCatalog();
});

document.getElementById('header-search-form').addEventListener('submit', (e) => {
  e.preventDefault();
  document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('search-input').addEventListener('input', (e) => {
  state.query = e.target.value;
  renderCatalog();
});

/* ---------- Modal de producto ---------- */

function openProduct(id) {
  const p = getProduct(id);
  if (!p) return;

  state.currentProduct = p;
  state.currentSize = 'S';
  state.currentQty = 1;

  const price = productPrice(p);
  const iva = productIva(p);

  const imgEl = document.getElementById('pm-image');
  imgEl.dataset.fallbackApplied = '';
  imgEl.src = p.img;
  imgEl.alt = p.name;

  document.getElementById('pm-category').textContent = CATEGORIES[p.category].label;
  document.getElementById('pm-title').textContent = p.name;
  document.getElementById('pm-price').textContent = fmt(price);
  document.getElementById('pm-desc').textContent = p.desc;
  document.getElementById('pm-iva').textContent = `IVA 19% incluido: ${fmt(iva)} · Garantía de fábrica`;
  document.getElementById('pm-qty').textContent = '1';

  const sizes = document.getElementById('pm-sizes');
  sizes.innerHTML = '';
  for (const s of SIZES) {
    const btn = document.createElement('button');
    btn.className = 'size-btn' + (s === state.currentSize ? ' active' : '');
    btn.textContent = s;
    btn.addEventListener('click', () => {
      state.currentSize = s;
      sizes.querySelectorAll('.size-btn').forEach((b) => b.classList.toggle('active', b === btn));
    });
    sizes.appendChild(btn);
  }

  openModal('product-modal');
}

document.getElementById('pm-qty-minus').addEventListener('click', () => {
  state.currentQty = Math.max(1, state.currentQty - 1);
  document.getElementById('pm-qty').textContent = state.currentQty;
});

document.getElementById('pm-qty-plus').addEventListener('click', () => {
  state.currentQty = Math.min(20, state.currentQty + 1);
  document.getElementById('pm-qty').textContent = state.currentQty;
});

document.getElementById('pm-add').addEventListener('click', () => {
  const p = state.currentProduct;
  if (!p) return;
  cart.add(p.id, state.currentSize, state.currentQty);
  closeModal('product-modal');
  toast(`<strong>${p.name}</strong> (${state.currentSize}) agregado al carrito`);
});

/* ---------- Carrito ---------- */

function renderCart() {
  const wrap = document.getElementById('cart-items');
  const lines = cart.getLines();
  const badge = document.getElementById('cart-count');
  const count = cart.countItems();

  badge.hidden = count === 0;
  badge.textContent = count;

  if (lines.length === 0) {
    wrap.innerHTML = '<p class="cart-empty">Tu carrito está vacío.<br>Descubre nuestra colección.</p>';
  } else {
    wrap.innerHTML = '';
    for (const line of lines) {
      const row = document.createElement('div');
      row.className = 'cart-line';
      row.innerHTML = `
        <img src="${line.product.img}" alt="${line.product.name}" loading="lazy">
        <div>
          <h4>${line.product.name}</h4>
          <p class="cart-line-meta">Talla ${line.size} · ${CATEGORIES[line.product.category].label}</p>
          <p class="cart-line-price">${fmt(productPrice(line.product))}</p>
          <span class="line-qty">
            <button data-qty-minus aria-label="Disminuir">−</button>
            <span>${line.qty}</span>
            <button data-qty-plus aria-label="Aumentar">+</button>
          </span>
          <button class="cart-line-remove" data-remove>Quitar</button>
        </div>
        <span class="line-total">${fmt(line.lineTotal)}</span>
      `;
      attachImageFallback(row.querySelector('img'));

      row.querySelector('[data-qty-minus]').addEventListener('click', () => {
        cart.setQty(line.id, line.size, line.qty - 1);
      });
      row.querySelector('[data-qty-plus]').addEventListener('click', () => {
        cart.setQty(line.id, line.size, line.qty + 1);
      });
      row.querySelector('[data-remove]').addEventListener('click', () => {
        cart.removeLine(line.id, line.size);
        toast('Producto retirado del carrito');
      });

      wrap.appendChild(row);
    }
  }

  const t = cart.getTotals();
  document.getElementById('cart-totals').innerHTML = `
    <div><dt>Subtotal</dt><dd>${fmt(t.subtotal)}</dd></div>
    ${t.discount ? `<div class="discount-row"><dt>Descuento ELACE10</dt><dd>−${fmt(t.discount)}</dd></div>` : ''}
    <div><dt>IVA 19% (incluido)</dt><dd>${fmt(t.iva)}</dd></div>
    <div><dt>Envío</dt><dd>${t.shipping ? fmt(t.shipping) : 'Gratis'}</dd></div>
    <div class="total-row"><dt>Total</dt><dd>${fmt(t.total)}</dd></div>
  `;

  document.getElementById('checkout-btn').disabled = lines.length === 0;
}

cart.onChange(renderCart);

function openCart() {
  document.getElementById('cart-drawer').classList.add('open');
  document.getElementById('cart-drawer').setAttribute('aria-hidden', 'false');
  const overlay = document.getElementById('overlay');
  overlay.hidden = false;
  document.body.classList.add('no-scroll');
}

function closeCart() {
  document.getElementById('cart-drawer').classList.remove('open');
  document.getElementById('cart-drawer').setAttribute('aria-hidden', 'true');
  if (!document.querySelector('.modal:not([hidden])')) {
    document.getElementById('overlay').hidden = true;
    document.body.classList.remove('no-scroll');
  }
}

document.getElementById('cart-toggle').addEventListener('click', openCart);
document.getElementById('cart-close').addEventListener('click', closeCart);
document.getElementById('overlay').addEventListener('click', closeCart);

/* ---------- Modales ---------- */

function openModal(id) {
  document.getElementById(id).hidden = false;
  document.body.classList.add('no-scroll');
}

function closeModal(id) {
  document.getElementById(id).hidden = true;
  if (!document.querySelector('.modal:not([hidden])') && !document.getElementById('cart-drawer').classList.contains('open')) {
    document.getElementById('overlay').hidden = true;
    document.body.classList.remove('no-scroll');
  }
}

document.addEventListener('click', (e) => {
  const opener = e.target.closest('[data-open-product]');
  if (opener) {
    openProduct(opener.dataset.openProduct);
    return;
  }
  const closer = e.target.closest('[data-close-modal]');
  if (closer) {
    const modal = closer.closest('.modal');
    if (modal) closeModal(modal.id);
  }
});

document.querySelectorAll('.modal').forEach((modal) => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal(modal.id);
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const open = document.querySelector('.modal:not([hidden])');
  if (open) closeModal(open.id);
  else closeCart();
});

/* ---------- Promo ---------- */

document.getElementById('promo-apply').addEventListener('click', () => {
  const input = document.getElementById('promo-input');
  if (cart.hasPromo()) {
    toast('El código ya está aplicado');
    return;
  }
  if (cart.applyPromo(input.value)) {
    toast('Código <strong>ELACE10</strong> aplicado: 10% de descuento');
    input.value = '';
  } else {
    toast('Código no válido. Prueba con <strong>ELACE10</strong>');
  }
});

document.getElementById('copy-promo').addEventListener('click', async () => {
  const code = document.getElementById('promo-code').textContent.trim();
  try {
    await navigator.clipboard.writeText(code);
    toast(`Código <strong>${code}</strong> copiado`);
  } catch {
    toast(` Usa el código <strong>${code}</strong> en el carrito`);
  }
});

/* ---------- Menú móvil ---------- */

const burger = document.getElementById('nav-burger');
const nav = document.getElementById('main-nav');

burger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(open));
});

nav.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }
});

/* ---------- Init ---------- */

document.getElementById('footer-year').textContent = `© ${new Date().getFullYear()} ELACE Lencería Boutique S.A.S`;
initCheckout();
renderCatalog();
renderCart();
