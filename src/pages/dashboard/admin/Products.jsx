import React from "react";
import { Plus, Search, MoreVertical } from "lucide-react";

const products = [
  { name: "Парацетамол", category: "Жаропонижающее", price: 4500, stock: 120, active: true },
  { name: "Амоксициллин", category: "Антибиотик", price: 7200, stock: 30, active: true },
  { name: "Нурофен", category: "Болеутоляющее", price: 8800, stock: 0, active: false },
  { name: "Цитрамон", category: "Обезболивающее", price: 3000, stock: 65, active: true },
];

const Products = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Каталог товаров</h2>
        <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded shadow hover:bg-gray-900">
          <Plus size={16} />
          Добавить товар
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Поиск товаров..."
          className="pl-10 pr-4 py-2 border rounded w-full focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="border-b bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-2">Название</th>
              <th className="px-4 py-2">Категория</th>
              <th className="px-4 py-2">Цена (сум)</th>
              <th className="px-4 py-2">Остаток</th>
              <th className="px-4 py-2">Статус</th>
              <th className="px-4 py-2">Действия</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">{item.category}</td>
                <td className="px-4 py-2">{item.price.toLocaleString()}</td>
                <td className="px-4 py-2">{item.stock}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      item.active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.active ? "Активен" : "Неактивен"}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <MoreVertical size={18} className="text-gray-500 cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Products;
