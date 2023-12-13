// Массив для хранения элементов корзины
let cart = {};

// Функция для добавления элемента в корзину
function addToCart(item) {
  if (cart[item.name]) {
    // Если этот элемент уже есть в корзине, увеличиваем его количество
    cart[item.name].count++;
  } else {
    // Если этого элемента еще нет в корзине, добавляем его
    cart[item.name] = { ...item, count: 1 };
  }
  updateCart();
}

// Функция для обновления содержимого корзины на странице
function updateCart() {
  let orderContent = document.getElementById('cart');
  orderContent.innerHTML = '';

  // Проверяем, есть ли что-то в корзине
  if (Object.keys(cart).length > 0) {
    // Если в корзине есть элементы, отображаем заголовок и элементы
    let title = document.createElement('h2');
    title.innerText = 'Ваш заказ:';
    orderContent.appendChild(title);

    let total = 0; // Добавьте эту строку

    Object.values(cart).forEach((item, index) => {
      let itemElement = document.createElement('div');
      itemElement.className = 'cart-item';
      itemElement.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div>
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <p>Цена: ${item.price} руб.</p>
          <p>Количество (шт): <input type="number" value="${item.count}" min="0" onchange="updateItemCount('${item.name}', this.value)"></p>
        </div>
        <button onclick="removeFromCart('${item.name}')">Удалить из заказа</button>
      `;
      orderContent.appendChild(itemElement);

      total += item.price * item.count;
    });

    // Добавляем итоговую стоимость заказа
    let totalElement = document.createElement('p');
    totalElement.className = 'total-price';
    totalElement.innerText = `Итого: ${total} руб.`;
    orderContent.appendChild(totalElement);

    // Добавляем поле для ввода номера телефона
    let phoneInput = document.createElement('input');
    phoneInput.className = 'phoneInput';
    phoneInput.type = 'tel';
    phoneInput.id = 'phone';
    phoneInput.name = 'phone';
    phoneInput.placeholder = 'Введите ваш номер телефона';
    phoneInput.required = true;
    phoneInput.pattern = "^\\+7\\d{10}$";
    orderContent.appendChild(phoneInput);

    // Добавляем кнопку "Оплатить"
    let payButton = document.createElement('button');
    payButton.className = 'payButton';
    payButton.innerText = 'Оплатить';
    payButton.onclick = function() {
      const order = {
        orderId: generateOrderId(),
        items: Object.values(cart),
        phoneNumber: document.getElementById('phone').value,
      };

      fetch('http://localhost:3000/save-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 'success') {
            alert('Оплата прошла успешно! Ваш заказ сохранен.');
            location.reload();
          } else {
            alert('Произошла ошибка при сохранении заказа.');
          }
        })
        .catch((error) => console.error('Ошибка при сохранении заказа:', error));
    };
    orderContent.appendChild(payButton);
  }
}

// Функция для обновления количества элемента в корзине
function updateItemCount(itemName, count) {
  if (count > 0) {
    cart[itemName].count = count;
  } else {
    removeFromCart(itemName);
  }
  updateCart();
}

// Функция для удаления элемента из корзины
function removeFromCart(itemName) {
  delete cart[itemName];
  updateCart();
}

// Функция для генерации уникального идентификатора заказа
function generateOrderId() {
  return 'ORD-' + Math.random().toString(36).substr(2, 9);
}
