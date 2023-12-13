import pandas as pd
import tkinter as tk
from pandastable import Table, TableModel

class OrderBaseViewer:
    def __init__(self, root, file_path):
        self.root = root
        self.file_path = file_path
        self.data = pd.read_csv(self.file_path)
        self.frame = tk.Frame(self.root)
        self.frame.pack(fill='both', expand=True)
        self.pt = Table(self.frame, dataframe=self.data, showtoolbar=False, showstatusbar=True)
        self.pt.autoResizeColumns()
        self.pt.show()

    def update_table(self):
        self.data = pd.read_csv(self.file_path)
        self.pt.updateModel(TableModel(self.data))
        self.pt.redraw()

root = tk.Tk()
root.title("OrderBaseViewer")
root.geometry("800x600")

app = OrderBaseViewer(root, 'orders.csv')

# Создание панели инструментов
toolbar = tk.Frame(root)
toolbar.pack(side='top', fill='x')

update_button = tk.Button(root, text="Обновить таблицу", command=app.update_table)
update_button.pack(side='left')

root.mainloop()
