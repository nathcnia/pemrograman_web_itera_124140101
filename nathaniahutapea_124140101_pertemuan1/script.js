const STORAGE_KEY = 'racik-mini-pos-cart';
const DISCOUNT_THRESHOLD = 50_000;
const DISCOUNT_RATE = 0.1;

const elements = {
  form: document.querySelector('#product-form'),
  name: document.querySelector('#product-name'),
  price: document.querySelector('#product-price'),
  qty: document.querySelector('#product-qty'),
  cartItems: document.querySelector('#cart-items'),
  emptyState: document.querySelector('#empty-state'),
  itemCount: document.querySelector('#item-count'),
  sidebarCount: document.querySelector('#sidebar-count'),
  footerItemCount: document.querySelector('#footer-item-count'),
  subtotal: document.querySelector('#subtotal-value'),
  discount: document.querySelector('#discount-value'),
  total: document.querySelector('#total-value'),
  discountStatus: document.querySelector('#discount-status'),
  remaining: document.querySelector('#remaining-value'),
  payment: document.querySelector('#payment-amount'),
  changeLabel: document.querySelector('#change-label'),
  change: document.querySelector('#change-value'),
  paymentMessage: document.querySelector('#payment-message'),
  reset: document.querySelector('#reset-button'),
  toast: document.querySelector('#toast'),
  date: document.querySelector('#today-date'),
};

let cart = loadCart();
let toastTimer;

function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function loadCart() {
  try {
    const storedCart = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(storedCart)) return [];

    return storedCart.filter((item) => (
      item
      && typeof item.id === 'string'
      && typeof item.name === 'string'
      && item.name.trim().length >= 3
      && Number.isSafeInteger(item.price)
      && item.price >= 500
      && Number.isSafeInteger(item.qty)
      && item.qty >= 1
    ));
  } catch (error) {
    console.warn('Keranjang tersimpan tidak dapat dibaca:', error);
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Keranjang tidak dapat disimpan:', error);
    showToast('Penyimpanan lokal tidak tersedia di browser ini.');
  }
}

function clearStoredCart() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Keranjang tersimpan tidak dapat dibersihkan:', error);
    showToast('Penyimpanan lokal tidak dapat dibersihkan.');
  }
}

function calculateTotals() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discount = subtotal >= DISCOUNT_THRESHOLD ? Math.round(subtotal * DISCOUNT_RATE) : 0;

  return { subtotal, discount, total: subtotal - discount };
}

function createCell(text, className = '') {
  const cell = document.createElement('td');
  if (className) cell.className = className;
  cell.textContent = text;
  return cell;
}

function renderCart() {
  elements.cartItems.replaceChildren();

  cart.forEach((item, index) => {
    const row = document.createElement('tr');
    row.append(
      createCell(String(index + 1)),
      createCell(item.name, 'product-cell'),
      createCell(formatRupiah(item.price)),
      createCell(String(item.qty)),
      createCell(formatRupiah(item.price * item.qty), 'subtotal-cell'),
    );

    const actionCell = document.createElement('td');
    const removeButton = document.createElement('button');
    removeButton.className = 'remove-button';
    removeButton.type = 'button';
    removeButton.dataset.removeId = item.id;
    removeButton.setAttribute('aria-label', `Hapus ${item.name} dari keranjang`);
    removeButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3"/></svg>';
    actionCell.append(removeButton);
    row.append(actionCell);
    elements.cartItems.append(row);
  });

  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const countLabel = `${itemCount} barang`;
  elements.itemCount.textContent = countLabel;
  elements.sidebarCount.textContent = String(itemCount);
  elements.footerItemCount.textContent = `${itemCount} item`;
  elements.emptyState.hidden = cart.length > 0;

  renderSummary();
}

function renderSummary() {
  const { subtotal, discount, total } = calculateTotals();
  elements.subtotal.textContent = formatRupiah(subtotal);
  elements.discount.textContent = `− ${formatRupiah(discount)}`;
  elements.total.textContent = formatRupiah(total);

  const remaining = Math.max(0, DISCOUNT_THRESHOLD - subtotal);
  elements.remaining.textContent = formatRupiah(remaining);
  elements.discountStatus.classList.toggle('discount-active', discount > 0);
  elements.discountStatus.querySelector('span:last-child').innerHTML = discount > 0
    ? 'Diskon 10% berhasil diterapkan ke pesananmu.'
    : `Belanja <strong>${formatRupiah(remaining)}</strong> lagi untuk diskon 10%.`;

  updatePayment();
}

function updatePayment() {
  const paymentValue = elements.payment.value;
  const { total } = calculateTotals();
  elements.change.classList.remove('insufficient');
  elements.paymentMessage.className = 'payment-message';

  if (paymentValue === '') {
    elements.changeLabel.textContent = 'Kembalian';
    elements.change.textContent = '—';
    elements.paymentMessage.textContent = 'Masukkan jumlah uang yang diterima.';
    return;
  }

  const payment = Number(paymentValue);
  if (!Number.isFinite(payment) || payment < 0) {
    elements.changeLabel.textContent = 'Kembalian';
    elements.change.textContent = '—';
    elements.paymentMessage.textContent = 'Masukkan nominal pembayaran yang valid.';
    elements.paymentMessage.classList.add('error');
    return;
  }

  if (payment < total) {
    elements.changeLabel.textContent = 'Kekurangan';
    elements.change.textContent = formatRupiah(total - payment);
    elements.change.classList.add('insufficient');
    elements.paymentMessage.textContent = 'Uang yang dibayarkan belum mencukupi.';
    elements.paymentMessage.classList.add('error');
    return;
  }

  elements.changeLabel.textContent = 'Kembalian';
  elements.change.textContent = formatRupiah(payment - total);
  elements.paymentMessage.textContent = 'Pembayaran mencukupi. Siap untuk transaksi berikutnya.';
  elements.paymentMessage.classList.add('success');
}

function setFieldError(input, message) {
  const errorElement = document.querySelector(`#${input.id.replace('product-', '')}-error`);
  input.setAttribute('aria-invalid', String(Boolean(message)));
  errorElement.textContent = message;
}

function validateProduct(name, priceValue, qtyValue) {
  const normalizedName = name.trim();
  const price = Number(priceValue);
  const qty = Number(qtyValue);
  const nameError = normalizedName.length < 3 ? 'Nama barang wajib diisi, minimal 3 karakter.' : '';
  const priceError = priceValue === '' || !Number.isFinite(price) || price < 500
    ? 'Harga wajib berupa angka minimal Rp500.'
    : '';
  const qtyError = qtyValue === '' || !Number.isSafeInteger(qty) || qty < 1
    ? 'Jumlah wajib berupa angka bulat minimal 1.'
    : '';

  setFieldError(elements.name, nameError);
  setFieldError(elements.price, priceError);
  setFieldError(elements.qty, qtyError);

  return {
    valid: !nameError && !priceError && !qtyError,
    normalizedName,
    price,
    qty,
  };
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => elements.toast.classList.remove('show'), 2500);
}

elements.form.addEventListener('submit', (event) => {
  event.preventDefault();
  const result = validateProduct(elements.name.value, elements.price.value, elements.qty.value);
  if (!result.valid) {
    const firstInvalid = elements.form.querySelector('[aria-invalid="true"]');
    firstInvalid?.focus();
    return;
  }

  cart.push({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: result.normalizedName,
    price: result.price,
    qty: result.qty,
  });
  saveCart();
  renderCart();
  elements.form.reset();
  elements.qty.value = '1';
  [elements.name, elements.price, elements.qty].forEach((input) => input.removeAttribute('aria-invalid'));
  document.querySelectorAll('.field-error').forEach((error) => { error.textContent = ''; });
  elements.name.focus();
  showToast(`${result.normalizedName} ditambahkan ke pesanan.`);
});

[elements.name, elements.price, elements.qty].forEach((input) => {
  input.addEventListener('input', () => {
    if (input.getAttribute('aria-invalid') === 'true') {
      setFieldError(input, '');
    }
  });
});

elements.cartItems.addEventListener('click', (event) => {
  const removeButton = event.target.closest('[data-remove-id]');
  if (!removeButton) return;

  const item = cart.find((cartItem) => cartItem.id === removeButton.dataset.removeId);
  cart = cart.filter((cartItem) => cartItem.id !== removeButton.dataset.removeId);
  saveCart();
  renderCart();
  showToast(item ? `${item.name} dihapus dari pesanan.` : 'Barang dihapus dari pesanan.');
});

elements.payment.addEventListener('input', updatePayment);

elements.reset.addEventListener('click', () => {
  cart = [];
  elements.payment.value = '';
  clearStoredCart();
  renderCart();
  showToast('Transaksi baru siap dimulai.');
});

elements.date.textContent = new Intl.DateTimeFormat('id-ID', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}).format(new Date());

renderCart();
