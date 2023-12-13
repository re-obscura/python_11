const express = require('express');
const cors = require('cors');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '.')));
app.use(express.static(path.join(__dirname, 'res')));

app.post('/save-order', async (req, res) => {
  const order = req.body;

  let csvWriter;
  let records = [];

  // Проверяем, существует ли файл
  if (!fs.existsSync('orders.csv')) {
    // Если файла не существует, создаем новый CSV Writer с заголовками столбцов
    csvWriter = createCsvWriter({
      path: 'orders.csv',
      header: [
        { id: 'orderId', title: 'ID Заказа' },
        { id: 'itemName', title: 'Товар' },
        { id: 'price', title: 'Цена' },
        { id: 'quantity', title: 'Кол-во' },
        { id: 'total', title: 'Общая' },
        { id: 'orderTotal', title: 'Сумма' }, // новый столбец
        { id: 'phoneNumber', title: 'Номер телефона' }, // новый столбец
      ],
    });
  } else {
    // Если файл существует, создаем новый CSV Writer без заголовков столбцов
    csvWriter = createCsvWriter({
      path: 'orders.csv',
      append: true,
      header: [
        { id: 'orderId', title: '' },
        { id: 'itemName', title: '' },
        { id: 'price', title: '' },
        { id: 'quantity', title: '' },
        { id: 'total', title: '' },
        { id: 'orderTotal', title: '' }, // новый столбец
        { id: 'phoneNumber', title: '' }, // новый столбец
      ],
    });
  }

  // Добавляем пустую строку для разделения заказов
  records.push({});

  // Рассчитываем общую стоимость заказа
  let orderTotal = 0;
  for (const item of order.items) {
    const itemTotal = item.price * item.count;
    orderTotal += itemTotal;
    records.push({
      orderId: order.orderId,
      itemName: item.name,
      price: item.price,
      quantity: item.count,
      total: itemTotal,
      orderTotal: '', // пока оставляем пустым
      phoneNumber: order.phoneNumber, // добавляем номер телефона
    });
  }

  // Добавляем общую стоимость заказа в последнюю строку
  records[records.length - 1].orderTotal = orderTotal;

  // Записываем данные в файл
  await csvWriter.writeRecords(records);

  res.send({ status: 'success' });
});

app.listen(3000, () => console.log('Server is running on port 3000'));
