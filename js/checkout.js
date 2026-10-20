// Checkout simulado — no procesa pagos reales ni envía datos
import * as cart from './cart.js';

export function initCheckout() {
  const modal = document.getElementById('checkout-modal');
  const formView = document.getElementById('ck-form-view');
  const processingView = document.getElementById('ck-processing');
  const successView = document.getElementById('ck-success');
  const form = document.getElementById('checkout-form');
  const summary = document.getElementById('ck-summary');
  const orderIdEl = document.getElementById('ck-order-id');
  const orderMsgEl = document.getElementById('ck-order-msg');

  function renderSummary() {
    const t = cart.getTotals();
    const items = cart.countItems();
    summary.innerHTML = `
      <div><span>Productos (${items})</span><span>${fmt(t.subtotal)}</span></div>
      ${t.discount ? `<div><span>Descuento ELACE10</span><span>−${fmt(t.discount)}</span></div>` : ''}
      <div><span>Envío (simulado)</span><span>${t.shipping ? fmt(t.shipping) : 'Gratis'}</span></div>
      <div><span>IVA 19% (incluido)</span><span>${fmt(t.iva)}</span></div>
      <div class="total-row"><span>Total</span><span>${fmt(t.total)}</span></div>
    `;
  }

  function showView(view) {
    formView.hidden = view !== 'form';
    processingView.hidden = view !== 'processing';
    successView.hidden = view !== 'success';
  }

  function validate() {
    let ok = true;
    for (const input of form.querySelectorAll('input[required]')) {
      const value = input.value.trim();
      let valid = value.length > 1;
      if (input.type === 'email') {
        valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
      }
      if (input.type === 'tel') {
        valid = /^[0-9\s+()-]{7,}$/.test(value);
      }
      input.classList.toggle('invalid', !valid);
      if (!valid) ok = false;
    }
    return ok;
  }

  function orderId() {
    const n = Math.floor(1000 + Math.random() * 9000);
    return `ELACE-2026-${n}`;
  }

  document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.countItems() === 0) return;
    renderSummary();
    showView('form');
    form.reset();
    const drawer = document.getElementById('cart-drawer');
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    modal.hidden = false;
    document.body.classList.add('no-scroll');
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = new FormData(form);
    const method = data.get('pago');
    const ciudad = data.get('ciudad');
    const nombre = String(data.get('nombre')).trim().split(' ')[0];

    showView('processing');

    setTimeout(() => {
      const id = orderId();
      orderIdEl.textContent = id;
      orderMsgEl.textContent =
        `${nombre}, tu pedido por ${fmt(cart.getTotals().total)} será pago con ${method} ` +
        `y entregado en ${ciudad}. Te contactaremos por WhatsApp para confirmar.`;
      cart.clear();
      showView('success');
    }, 1900);
  });

  form.addEventListener('input', (e) => {
    if (e.target.matches('input.invalid')) e.target.classList.remove('invalid');
  });
}

export function fmt(value) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}
