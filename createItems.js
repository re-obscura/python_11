// Функция для создания HTML-элементов для каждого товара
function createItems() {
  let menuContent = document.getElementById('menu-content');
  items.forEach(item => {
    let itemElement = document.createElement('div');
    itemElement.className = 'menu-item';
    itemElement.innerHTML = `
      <h3>${item.name}</h3>
      <img src="${item.image}" alt="${item.name}">
      <p>${item.description}</p>
      <div class="item-footer">
        <p class="price">Цена: ${item.price} руб.</p>
        <button onclick="addToCart({name: '${item.name}', image: '${item.image}', description: '${item.description}', price: ${item.price}})">В заказ</button>
      </div>
    `;
    menuContent.appendChild(itemElement);
  });
}

// Вызовите функцию createItems при загрузке страницы
window.onload = createItems;