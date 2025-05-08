import React from "react";
import { Plus, Search, MoreVertical } from "lucide-react";

const clients = [
  {
    name: "Аптека Акме",
    phone: "+998 90 123 45 67",
    address: "г. Ташкент, ул. Шифокор 12",
    status: "Active",
    orders: 25,
  },
  {
    name: "МедПлюс",
    phone: "+998 91 555 66 77",
    address: "г. Самарканд, ул. Буюк Ипак Йули 45",
    status: "Inactive",
    orders: 8,
  },
  {
    name: "Городская Клиника",
    phone: "+998 93 888 22 11",
    address: "г. Бухара, ул. Темур Малик 9",
    status: "Active",
    orders: 42,
  },
];

const Clients = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Список клиентов</h2>
        <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded shadow hover:bg-gray-900">
          <Plus size={16} />
          Добавить клиента
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Поиск клиентов..."
          className="pl-10 pr-4 py-2 border rounded w-full focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="border-b bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-2">Имя</th>
              <th className="px-4 py-2">Телефон</th>
              <th className="px-4 py-2">Адрес</th>
              <th className="px-4 py-2">Статус</th>
              <th className="px-4 py-2">Заказы</th>
              <th className="px-4 py-2">Действия</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{client.name}</td>
                <td className="px-4 py-2">{client.phone}</td>
                <td className="px-4 py-2">{client.address}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      client.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {client.status}
                  </span>
                </td>
                <td className="px-4 py-2">{client.orders}</td>
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

export default Clients;
