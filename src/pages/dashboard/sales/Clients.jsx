import React, { useState } from "react";
import { Users, Plus, Search } from "lucide-react";

const initialClients = [
  {
    name: "Аптека Надежда",
    phone: "+998 90 111 22 33",
    orders: 21,
    status: "Active",
  },
  {
    name: "Городская Аптека",
    phone: "+998 91 444 55 66",
    orders: 8,
    status: "Inactive",
  },
];

const Clients = () => {
  const [clients, setClients] = useState(initialClients);
  return (
    <div className="space-y-4 bg-gray-50">
      {/* Header */}
      <div className="bg-white flex items-center justify-between p-4 rounded-xl">
        <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
          <Users /> Клиенты
        </h2>
        <div className="flex items-center gap-2">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Поиск клиентов..."
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
              <th className="px-6 py-4 bg-gray-100 rounded-tl-xl">Имя</th>
              <th className="px-6 py-4 bg-gray-100">Телефон</th>
              <th className="px-6 py-4 bg-gray-100">Заказы</th>
              <th className="px-6 py-4 bg-gray-100 rounded-tr-xl">Статус</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {clients.map((c, i) => (
              <tr
                key={i}
                className="hover:bg-indigo-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 font-medium">{c.name}</td>
                <td className="px-6 py-4">{c.phone}</td>
                <td className="px-6 py-4">{c.orders}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      c.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {c.status === "Active" ? "Активен" : "Неактивен"}
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

export default Clients;
