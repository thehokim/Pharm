import React from "react";
import { Search, MoreVertical } from "lucide-react";

const products = [
  { name: "Парацетамол", category: "Жаропонижающее", price: 4500, stock: 120 },
  { name: "Амоксициллин", category: "Антибиотик", price: 7200, stock: 15 },
];

const Products = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Товары</h2>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Поиск товаров..."
          className="pl-10 pr-4 py-2 border rounded w-full"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b text-gray-700">
            <tr>
              <th className="px-4 py-2">Название</th>
              <th className="px-4 py-2">Категория</th>
              <th className="px-4 py-2">Цена</th>
              <th className="px-4 py-2">Остаток</th>
              <th className="px-4 py-2">Действия</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{p.name}</td>
                <td className="px-4 py-2">{p.category}</td>
                <td className="px-4 py-2">{p.price.toLocaleString()} сум</td>
                <td className="px-4 py-2">{p.stock}</td>
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
