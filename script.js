// Продукты
const products = [
  { id: 1, name: 'Бешбармак', category: 'meat', price: 15000, img: './beshbarmak.jpg' },
  { id: 2, name: 'Шашлык', category: 'meat', price: 16000, img: './shashlik.jpg' },
  { id: 3, name: 'Қуырдақ', category: 'hot', price: 14000, img: './kuyrdak.jpg' },
  { id: 4, name: 'Қазы', category: 'meat', price: 18000, img: './kazy.jpg' },
  { id: 5, name: 'Манты', category: 'hot', price: 12000, img: './manty.jpeg' },
  { id: 6, name: 'Салат овощной', category: 'salads', price: 4500, img: './salat.jpg' },
  { id: 7, name: 'Закуска сырная', category: 'snacks', price: 3500, img: './zakuska.jpg' },
  { id: 8, name: 'Кунжутный десерт', category: 'desserts', price: 3000, img: './kunzhut.jpg' }
];

const WA_PHONE = '77064109931';

let cart = JSON.parse(localStorage.getItem('cart_v1') || '[]');

// Utilities
const formatPrice = n => n.toLocaleString('ru-RU') + ' ₸';

function saveCart() {
  localStorage.setItem('cart_v1', JSON.stringify(cart));
}

function getCartCount() { return cart.reduce((s, it) => s + it.quantity, 0); }

// Toast notification
function showToast(text) {
  const toast = document.getElementById('toast');
  toast.textContent = text;
  toast.classList.remove('opacity-0');
  toast.classList.add('opacity-100');
  toast.classList.add('fade-in');
  setTimeout(() => {
    toast.classList.remove('fade-in');
    toast.classList.add('fade-out');
    setTimeout(() => {
      toast.classList.remove('opacity-100', 'fade-out');
      toast.classList.add('opacity-0');
    }, 400);
  }, 2200);
}

// Bounce animation for cart icon
function bounceCartIcon() {
  const cartBtn = document.getElementById('cart-button');
  cartBtn.classList.add('animate-bounce-cart');
  setTimeout(() => {
    cartBtn.classList.remove('animate-bounce-cart');
  }, 400);
}

function updateCartUI() {
  const countEl = document.getElementById('cart-count');
  if (countEl) countEl.textContent = getCartCount();

  const itemsContainer = document.querySelector('#cart-panel #cart-items');
  itemsContainer.innerHTML = '';

  if (cart.length === 0) {
    itemsContainer.innerHTML = '<p class="text-gray-600">Корзина пуста</p>';
  } else {
    cart.forEach(item => {
      const row = document.createElement('div');
      row.className = 'flex items-center gap-3 p-3 bg-gray-50 rounded-lg';
      row.innerHTML = `
        <img src="${item.img}" alt="${item.name}" class="w-16 h-12 object-cover rounded">
        <div class="flex-1">
          <div class="font-semibold">${item.name}</div>
          <div class="text-sm text-gray-600">${formatPrice(item.price)} /кг</div>
        </div>
        <div class="flex items-center gap-2">
          <button class="qty-decrease p-1 bg-gray-200 rounded">−</button>
          <div class="w-6 text-center">${item.quantity}</div>
          <button class="qty-increase p-1 bg-gray-200 rounded">+</button>
        </div>
        <div class="ml-3 font-semibold">${formatPrice(item.price * item.quantity)}</div>
        <button class="ml-2 text-red-500 remove-item">✕</button>
      `;

      // handlers
      row.querySelector('.qty-decrease').addEventListener('click', () => {
        changeQuantity(item.id, item.quantity - 1);
      });
      row.querySelector('.qty-increase').addEventListener('click', () => {
        changeQuantity(item.id, item.quantity + 1);
      });
      row.querySelector('.remove-item').addEventListener('click', () => {
        removeFromCart(item.id);
      });

      itemsContainer.appendChild(row);
    });
  }

  // total
  const total = cart.reduce((s, it) => s + it.price * it.quantity, 0);
  document.getElementById('cart-total').textContent = formatPrice(total);
  saveCart();
}

function changeQuantity(id, qty) {
  if (qty <= 0) { removeFromCart(id); return; }
  const it = cart.find(c => c.id === id);
  if (it) it.quantity = qty;
  updateCartUI();
}

function addToCart(id, qty = 1) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  const existing = cart.find(c => c.id === id);
  if (existing) existing.quantity += qty;
  else cart.push({ id: p.id, name: p.name, price: p.price, quantity: qty, img: p.img });
  updateCartUI();
  showToast(`${p.name} добавлено в корзину`);
  bounceCartIcon();
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  updateCartUI();
}

function clearCart() { cart = []; updateCartUI(); }

// Render products with category filter
let activeCategory = 'all';
const productListEl = document.getElementById('product-list');

function renderProducts(animate = true) {
  // filter
  const items = activeCategory === 'all' ? products : products.filter(p => p.category === activeCategory);

  // animate fade
  if (animate) productListEl.classList.add('opacity-0');
  setTimeout(() => {
    productListEl.innerHTML = '';
    items.forEach(p => {
      const card = document.createElement('article');
      card.className = 'product-card bg-white rounded-lg p-4 shadow';
      card.innerHTML = `
        <img src="${p.img}" alt="${p.name}" class="w-full h-40 object-cover rounded-md mb-3">
        <h4 class="font-bold text-lg">${p.name}</h4>
        <div class="mt-2 text-gray-600">${formatPrice(p.price)} /кг</div>
        <div class="mt-3 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <button class="qty-btn p-2 bg-gray-100 rounded-l" data-id="${p.id}">−</button>
            <input class="qty-input w-14 text-center border-t border-b" data-id="${p.id}" value="1" />
            <button class="qty-btn p-2 bg-gray-100 rounded-r" data-id="${p.id}">+</button>
          </div>
          <div class="flex gap-2">
            <button class="add-btn btn-primary" data-id="${p.id}">Добавить в корзину</button>
            <a class="wa-btn btn-outline flex items-center gap-2" href="https://wa.me/${WA_PHONE}?text=${encodeURIComponent('Здравствуйте! Хочу заказать ' + p.name)}" target="_blank">WhatsApp</a>
          </div>
        </div>
      `;

      // quantity controls
      const minus = card.querySelector('.qty-btn[data-id]');
      const plus = card.querySelectorAll('.qty-btn')[1];
      const input = card.querySelector('.qty-input');

      card.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = Number(e.currentTarget.dataset.id);
          const incr = e.currentTarget.textContent.trim() === '+' ? 1 : -1;
          const current = Number(input.value) || 1;
          const next = Math.max(1, current + incr);
          input.value = next;
        });
      });

      // add button
      card.querySelector('.add-btn').addEventListener('click', () => {
        const q = Math.max(1, parseInt(input.value) || 1);
        addToCart(p.id, q);
      });

      productListEl.appendChild(card);
    });
    if (animate) productListEl.classList.remove('opacity-0');
  }, animate ? 200 : 0);
}

// Category tabs
document.querySelectorAll('.category-tab').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.category-tab').forEach(b => b.classList.remove('active'));
    e.currentTarget.classList.add('active');
    activeCategory = e.currentTarget.dataset.cat;
    renderProducts(true);
  });
});

// Cart panel controls
const cartButton = document.getElementById('cart-button');
const cartPanel = document.getElementById('cart-panel');
const closeCart = document.getElementById('close-cart');
const openCartBtn = document.getElementById('open-cart');

function openCartPanel() {
  cartPanel.classList.remove('translate-x-full');
  cartPanel.classList.add('cart-slide-in');
  setTimeout(() => cartPanel.classList.remove('cart-slide-in'), 400);
}
function closeCartPanel() {
  cartPanel.classList.add('cart-slide-out');
  setTimeout(() => {
    cartPanel.classList.add('translate-x-full');
    cartPanel.classList.remove('cart-slide-out');
  }, 400);
}

cartButton.addEventListener('click', () => { openCartPanel(); });
closeCart.addEventListener('click', () => { closeCartPanel(); });
openCartBtn.addEventListener('click', () => { openCartPanel(); });

// Clear and checkout
document.getElementById('clear-cart').addEventListener('click', () => { clearCart(); });
document.getElementById('checkout-btn').addEventListener('click', () => { doCheckout(); });

// Contact FAB
const contactMain = document.getElementById('contact-main');
const contactExpand = document.getElementById('contact-expand');
const contactLabel = document.getElementById('contact-label');
const contactClose = document.getElementById('contact-close');

// Плавное появление текста при наведении
contactMain.addEventListener('mouseenter', () => {
  contactLabel.style.opacity = '1';
  contactLabel.style.transform = 'translateX(0)';
});
contactMain.addEventListener('mouseleave', () => {
  contactLabel.style.opacity = '0';
  contactLabel.style.transform = 'translateX(1.5rem)';
});

// Открытие/закрытие панели контактов
contactMain.addEventListener('click', () => {
  if (contactExpand.classList.contains('hidden')) {
    contactExpand.classList.remove('hidden');
    setTimeout(() => {
      contactExpand.querySelectorAll('a, button').forEach((btn, i) => {
        btn.classList.remove('scale-90', 'opacity-0');
        btn.classList.add('scale-100', 'opacity-100');
      });
    }, 50);
  }
});

contactClose.addEventListener('click', () => {
  contactExpand.querySelectorAll('a, button').forEach((btn, i) => {
    btn.classList.remove('scale-100', 'opacity-100');
    btn.classList.add('scale-90', 'opacity-0');
  });
  setTimeout(() => {
    contactExpand.classList.add('hidden');
  }, 350);
});

// Reveal on scroll
function setupReveal() {
  const els = document.querySelectorAll('.reveal');
  function check() {
    els.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 60) el.classList.add('visible');
    });
  }
  window.addEventListener('scroll', check);
  check();
}

// Form send
document.getElementById('send-order').addEventListener('click', () => {
  doCheckout();
});

function doCheckout() {
  const name = document.getElementById('cust-name').value.trim();
  const phone = document.getElementById('cust-phone').value.trim();
  const address = document.getElementById('cust-address').value.trim();
  const datetime = document.getElementById('cust-datetime').value.trim();
  const note = document.getElementById('cust-note').value.trim();

  if (!name || !phone) { alert('Пожалуйста, укажите имя и телефон.'); return; }
  if (cart.length === 0) { if (!confirm('Корзина пуста. Отправить пустой заказ?')) return; }

  let msg = `Здравствуйте! Хочу сделать заказ:\n`;
  cart.forEach(it => { msg += `- ${it.name} — ${it.quantity} кг — ${formatPrice(it.price * it.quantity)}\n`; });
  const total = cart.reduce((s, it) => s + it.price * it.quantity, 0);
  msg += `Итого: ${formatPrice(total)}\n\n`;
  msg += `Имя: ${name}\nТелефон: ${phone}\nАдрес: ${address}\nДата/время: ${datetime}\nКомментарий: ${note}`;

  const url = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  renderProducts(false);
  updateCartUI();
  setupReveal();
});
