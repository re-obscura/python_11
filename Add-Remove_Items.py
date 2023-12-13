import tkinter as tk
from tkinter import filedialog, ttk
import json
import os
from PIL import Image, ImageTk

# Создаем окно приложения
root = tk.Tk()
root.title("Редактор товаров")
root.geometry('500x600')  # Увеличиваем размер окна

# Создаем список для хранения товаров
items = []

# Функция для добавления нового товара
def add_item():
    # Получаем значения из полей ввода
    name = name_entry.get()
    image = image_entry.get()
    description = description_entry.get()
    price = price_entry.get()

    # Добавляем новый товар в список
    items.append({
        'name': name,
        'image': image,
        'description': description,
        'price': int(price)
    })

    # Обновляем список товаров в интерфейсе
    update_items_list()

# Функция для удаления выбранного товара
def remove_item():
    # Получаем выбранный товар
    selected_item = items_listbox.curselection()

    # Удаляем выбранный товар из списка
    if selected_item:
        items.pop(selected_item[0])

    # Обновляем список товаров в интерфейсе
    update_items_list()

# Функция для обновления списка товаров в интерфейсе
def update_items_list():
    # Очищаем текущий список
    items_listbox.delete(0, tk.END)

    # Добавляем все товары из списка в интерфейс
    for item in items:
        items_listbox.insert(tk.END, item['name'])

# Функция для сохранения товаров в файл
def save_items():
    # Преобразуем список товаров в JSON
    items_json = json.dumps(items)

    # Читаем существующий файл
    with open('items.json', 'r') as file:
        content = json.load(file)

    # Добавляем новые элементы в существующий массив
    content.extend(items)

    # Сохраняем обновленный массив обратно в файл
    with open('items.json', 'w') as file:
        json.dump(content, file)

    # Очищаем список товаров
    items.clear()

    # Обновляем список товаров в интерфейсе
    update_items_list()

# Функция для загрузки изображения
def load_image():
    # Открываем диалог выбора файла
    filename = filedialog.askopenfilename()

    # Устанавливаем путь к изображению в поле ввода
    image_entry.delete(0, tk.END)
    image_entry.insert(0, filename)

    # Отображаем превью изображения
    img = Image.open(filename)
    img = img.resize((50, 50), Image.ANTIALIAS)
    img = ImageTk.PhotoImage(img)
    panel = tk.Label(root, image=img)
    panel.image = img
    panel.pack()

# Функция для загрузки товаров из файла
def load_items():
    # Читаем существующий файл
    with open('items.json', 'r') as file:
        content = json.load(file)

    # Добавляем элементы из файла в список товаров
    items.extend(content)

    # Обновляем список товаров в интерфейсе
    update_items_list()

# Функция для редактирования выбранного товара
def edit_item():
    # Получаем выбранный товар
    selected_item = items_listbox.curselection()

    # Если товар выбран, заполняем поля ввода информацией о товаре
    if selected_item:
        item = items[selected_item[0]]
        name_entry.delete(0, tk.END)
        name_entry.insert(0, item['name'])
        image_entry.delete(0, tk.END)
        image_entry.insert(0, item['image'])
        description_entry.delete(0, tk.END)
        description_entry.insert(0, item['description'])
        price_entry.delete(0, tk.END)
        price_entry.insert(0, str(item['price']))

# Функция для сохранения изменений в выбранном товаре
def save_changes():
    # Получаем выбранный товар
    selected_item = items_listbox.curselection()

    # Если товар выбран, сохраняем изменения в товаре
    if selected_item:
        item = items[selected_item[0]]
        item['name'] = name_entry.get()
        item['image'] = image_entry.get()
        item['description'] = description_entry.get()
        item['price'] = int(price_entry.get())

    # Обновляем список товаров в интерфейсе
    update_items_list()

# Создаем поля ввода для нового товара
name_label = tk.Label(root, text="Название:")
name_label.pack()
name_entry = tk.Entry(root, width=50)
name_entry.pack()

image_label = tk.Label(root, text="Изображение:")
image_label.pack()
image_entry = tk.Entry(root, width=50)
image_entry.pack()

load_image_button = tk.Button(root, text="Загрузить изображение", command=load_image)
load_image_button.pack()

description_label = tk.Label(root, text="Описание:")
description_label.pack()
description_entry = tk.Entry(root, width=50)
description_entry.pack()

price_label = tk.Label(root, text="Цена:")
price_label.pack()
price_entry = tk.Entry(root, width=50)
price_entry.pack()

# Создаем кнопки для добавления и удаления товаров
add_button = tk.Button(root, text="Добавить товар", command=add_item)
add_button.pack()

remove_button = tk.Button(root, text="Удалить товар", command=remove_item)
remove_button.pack()

edit_button = tk.Button(root, text="Редактировать товар", command=edit_item)
edit_button.pack()

save_changes_button = tk.Button(root, text="Сохранить изменения", command=save_changes)
save_changes_button.pack()

# Создаем список для отображения товаров
items_listbox = tk.Listbox(root, width=50)
items_listbox.pack()

# Создаем кнопку для сохранения товаров в файл
save_button = tk.Button(root, text="Сохранить товары", command=save_items)
save_button.pack()

# Создаем кнопку для загрузки товаров из файла
load_button = tk.Button(root, text="Загрузить товары", command=load_items)
load_button.pack()

# Запускаем приложение
root.mainloop()
