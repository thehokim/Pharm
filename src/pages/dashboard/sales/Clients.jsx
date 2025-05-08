import React from "react";
import { Search, MoreVertical } from "lucide-react";

const clients = [
  { name: "Аптека Надежда", phone: "+998 90 111 22 33", orders: 21, status: "Active" },
  { name: "Городская Аптека", phone: "+998 91 444 55 66", orders: 8, status: "Inactive" },
];

const Clients = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Клиенты</h2>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Поиск клиентов..."
          className="pl-10 pr-4 py-2 border rounded w-full"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b text-gray-700">
            <tr>
              <th className="px-4 py-2">Имя</th>
              <th className="px-4 py-2">Телефон</th>
              <th className="px-4 py-2">Заказы</th>
              <th className="px-4 py-2">Статус</th>
              <th className="px-4 py-2">Действия</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{c.name}</td>
                <td className="px-4 py-2">{c.phone}</td>
                <td className="px-4 py-2">{c.orders}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      c.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {c.status}
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

export default Clients;
