// Carrito de compras — persistencia en localStorage
import { getProduct, productPrice, productIva } from './products.js';

const STORAGE_KEY = 'elace_cart_v1';
const PROMO_CODE = 'ELACE10';
const PROMO_RATE = 0.1;
const SHIPPING_FLAT = 12000;
const SHIPPING_FREE_FROM = 150000;

let lines = load();
let promoApplied = false;

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data.filter((l) => getProduct(l.id)) : [];
  } catch {
    return [];
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
}

export function onChange(fn) {
  document.addEventListener('elace:cart-change', fn);
}

function emit() {
  save();
  document.dispatchEvent(new CustomEvent('elace:cart-change'));
}

export function getLines() {
  return lines.map((line) => {
    const product = getProduct(line.id);
    return { ...line, product, lineTotal: productPrice(product) * line.qty };
  });
}

export function countItems() {
  return lines.reduce((sum, l) => sum + l.qty, 0);
}

export function add(id, size, qty = 1) {
  const existing = lines.find((l) => l.id === id && l.size === size);
  if (existing) {
    existing.qty += qty;
  } else {
    lines.push({ id, size, qty });
  }
  emit();
}

export function setQty(id, size, qty) {
  const line = lines.find((l) => l.id === id && l.size === size);
  if (!line) return;
  line.qty = Math.max(1, Math.min(99, qty));
  emit();
}

export function removeLine(id, size) {
  lines = lines.filter((l) => !(l.id === id && l.size === size));
  emit();
}

export function clear() {
  lines = [];
  promoApplied = false;
  emit();
}

export function applyPromo(code) {
  if (String(code || '').trim().toUpperCase() === PROMO_CODE) {
    promoApplied = true;
    emit();
    return true;
  }
  return false;
}

export function hasPromo() {
  return promoApplied;
}

export function getTotals() {
  let subtotal = 0;
  let iva = 0;
  for (const line of lines) {
    const product = getProduct(line.id);
    subtotal += productPrice(product) * line.qty;
    iva += productIva(product) * line.qty;
  }
  const discount = promoApplied ? Math.round(subtotal * PROMO_RATE) : 0;
  const shipping = subtotal === 0 || subtotal - discount >= SHIPPING_FREE_FROM ? 0 : SHIPPING_FLAT;
  const total = subtotal - discount + shipping;
  return { subtotal, iva, discount, shipping, total };
}
