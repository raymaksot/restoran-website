// Меню товаров - можно расширить
const products = [
  { id: 1, name: 'Kazy', price: 18000, imgSrc: './kazy.jpg' },
  { id: 2, name: 'Beshbarmak', price: 15000, imgSrc: './beshbarmak.jpg' },
  { id: 3, name: 'Kuyrdak', price: 14000, imgSrc: './kuyrdak.jpg' },
  { id: 4, name: 'Shashlik', price: 16000, imgSrc: './shashlik.jpg' },
];

let cart = [];

// Функция обновления корзины
function updateCart() {
  const cartBadge = document.getElementById('cart-badge');
  cartBadge.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartItemsContainer = document.getElementById('cart-items');
  cartItemsContainer.innerHTML = '';
  
  cart.forEach(item => {
    const productElem = document.createElement('div');
    productElem.classList.add('flex', 'justify-between', 'items-center', 'py-2', 'border-b');
    productElem.innerHTML = `
      <span>${item.name} x ${item.quantity}</span>
      <span>${item.quantity * item.price} ₸</span>
    `;
    cartItemsContainer.appendChild(productElem);
  });

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById('total-price').textContent = `${totalPrice} ₸`;
}

// Добавление в корзину
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existingProduct = cart.find(item => item.id === id);
  
  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCart();
}

// Удаление из корзины
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
}

// Открыть/закрыть корзину
function toggleCart() {
  document.getElementById('cart-modal').classList.toggle('hidden');
}

// Отправка данных в WhatsApp
function checkout() {
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const address = document.getElementById('address').value;
  const deliveryTime = document.getElementById('delivery-time').value;

  if (!name || !phone || !address || !deliveryTime) {
    alert('Пожалуйста, заполните все поля!');
    return;
  }

  let message = `Здравствуйте! Хочу заказать:\n`;
  cart.forEach(item => {
    message += `- ${item.name} – ${item.quantity} кг (${item.quantity * item.price} ₸)\n`;
  });

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  message += `\nИтого: ${totalPrice} ₸\n\nИмя: ${name}\nТелефон: ${phone}\nАдрес: ${address}\nВремя доставки: ${deliveryTime}`;

  const encodedMessage = encodeURIComponent(message);
  const waPhone = '77064109931'; // WhatsApp менеджера
  const waLink = `https://wa.me/${waPhone}?text=${encodedMessage}`;

  window.open(waLink, '_blank');
}

// Генерация карточек товаров
function displayProducts() {
  const productContainer = document.getElementById('product-list');
  products.forEach(p => {
    const productElem = document.createElement('div');
    productElem.classList.add('shadow-lg', 'p-4', 'rounded-lg', 'bg-white');
    productElem.innerHTML = `
      <img src="${p.imgSrc}" alt="${p.name}" class="rounded-md mb-3">
      <h3 class="text-xl font-semibold mb-2">${p.name}</h3>
      <p class="text-lg font-bold mb-4">${p.price} ₸/кг</p>
      <button class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700" onclick="addToCart(${p.id})">Добавить в корзину</button>
      <a href="https://wa.me/77064109931?text=Здравствуйте! Хочу заказать ${p.name}" target="_blank" class="block mt-3 text-center text-white bg-blue-600 py-2 rounded-lg hover:bg-blue-700">Написать в WhatsApp</a>
    `;
    productContainer.appendChild(productElem);
  });
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  displayProducts();
  updateCart();
});
