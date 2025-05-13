import React, { useState } from "react";
import { Box, Plus, Search } from "lucide-react";

const initialProducts = [
  {
    name: "Парацетамол",
    category: "Жаропонижающее",
    price: 4500,
    stock: 120,
    active: true,
  },
  {
    name: "Амоксициллин",
    category: "Антибиотик",
    price: 7200,
    stock: 30,
    active: true,
  },
  {
    name: "Нурофен",
    category: "Болеутоляющее",
    price: 8800,
    stock: 0,
    active: false,
  },
  {
    name: "Цитрамон",
    category: "Обезболивающее",
    price: 3000,
    stock: 65,
    active: true,
  },
];

const Products = () => {
  const [products, setProducts] = useState(initialProducts);

  return (
    <div className="space-y-4 bg-gray-50">
      {/* Header */}
      <div className="bg-white flex items-center justify-between p-4 rounded-xl">
        <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
          <Box /> Каталог товаров
        </h2>
        <div className="flex items-center gap-2">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Поиск товаров..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full focus:outline-none transition"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl overflow-hidden">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="text-xs font-semibold uppercase tracking-wide text-gray-600">
            <tr>
              <th className="px-6 py-4 bg-gray-100 rounded-tl-xl">Название</th>
              <th className="px-6 py-4 bg-gray-100">Категория</th>
              <th className="px-6 py-4 bg-gray-100">Цена</th>
              <th className="px-6 py-4 bg-gray-100">Остаток</th>
              <th className="px-6 py-4 bg-gray-100 rounded-tr-xl">Статус</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((item, i) => (
              <tr
                key={i}
                className="hover:bg-indigo-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 font-medium">{item.name}</td>
                <td className="px-6 py-4">{item.category}</td>
                <td className="px-6 py-4">{item.price.toLocaleString()} сум</td>
                <td className="px-6 py-4">{item.stock}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      item.active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.active ? "Активен" : "Неактивен"}
                  </span>
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
