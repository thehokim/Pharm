import React from "react";
import { Plus, Search, MoreVertical } from "lucide-react";

const suppliers = [
  {
    name: "МедТрейд УЗ",
    phone: "+998 90 111 22 33",
    address: "г. Ташкент, ул. Буюк Ипак Йули 15",
    products: 120,
  },
  {
    name: "ФармаЛогистик",
    phone: "+998 91 444 55 66",
    address: "г. Наманган, ул. Ислам Каримов 8",
    products: 75,
  },
  {
    name: "MedGlobal",
    phone: "+998 93 777 88 99",
    address: "г. Андижан, ул. Навоий 3",
    products: 200,
  },
];

const Suppliers = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Список поставщиков</h2>
        <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded shadow hover:bg-gray-900">
          <Plus size={16} />
          Добавить поставщика
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Поиск поставщиков..."
          className="pl-10 pr-4 py-2 border rounded w-full focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="border-b bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-2">Название</th>
              <th className="px-4 py-2">Телефон</th>
              <th className="px-4 py-2">Адрес</th>
              <th className="px-4 py-2">Кол-во товаров</th>
              <th className="px-4 py-2">Действия</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{s.name}</td>
                <td className="px-4 py-2">{s.phone}</td>
                <td className="px-4 py-2">{s.address}</td>
                <td className="px-4 py-2">{s.products}</td>
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

export default Suppliers;
