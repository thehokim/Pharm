import React, { useState } from "react";
import { Plus, Search, UserPlus2 } from "lucide-react";
import ActionMenu from "../../../../components/layout/ActionMenu"; // путь подкорректируй
import AddClientModal from "./AddClientModal";
import EditClientModal from "./EditClientModal";
import DeleteClientModal from "./DeleteClientModal";

const initialClients = [
  {
    name: "Аптека Акме",
    phone: "+998 90 123 45 67",
    address: "г. Ташкент, ул. Шифокор 12",
    status: "Active",
    orders: 25,
    totalAmount: 12500000,
    debt: 2300000,
  },
  {
    name: "МедПлюс",
    phone: "+998 91 555 66 77",
    address: "г. Самарканд, ул. Буюк Ипак Йули 45",
    status: "Inactive",
    orders: 8,
    totalAmount: 3200000,
    debt: 0,
  },
  {
    name: "Городская Клиника",
    phone: "+998 93 888 22 11",
    address: "г. Бухара, ул. Темур Малик 9",
    status: "Active",
    orders: 42,
    totalAmount: 21300000,
    debt: 5400000,
  },
];

const Clients = () => {
  const [clients, setClients] = useState(initialClients);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [deletingClient, setDeletingClient] = useState(null);

  const handleAddClient = (newClient) => {
    setClients((prev) => [...prev, newClient]);
  };

  const handleEditClient = (updatedClient) => {
    setClients((prev) =>
      prev.map((c) => (c.name === editingClient.name ? updatedClient : c))
    );
  };

  const handleDeleteClient = () => {
    setClients((prev) => prev.filter((c) => c.name !== deletingClient.name));
    setIsDeleteOpen(false);
  };

  return (
    <div className="space-y-4 bg-gray-50">
      {/* Header */}
      <div className="bg-white flex items-center justify-between p-4 rounded-xl">
        <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
          <UserPlus2 /> Список клиентов
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 bg-black text-white px-3 py-3 rounded-full hover:bg-gray-900 transition"
          >
            <Plus size={16} />
          </button>

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
      <div className="bg-white rounded-2xl">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="text-xs font-semibold uppercase tracking-wide text-gray-600">
            <tr>
              <th className="px-6 py-4 bg-gray-100 rounded-tl-xl">Имя</th>
              <th className="px-6 py-4 bg-gray-100">Телефон</th>
              <th className="px-6 py-4 bg-gray-100">Адрес</th>
              <th className="px-6 py-4 bg-gray-100">Статус</th>
              <th className="px-6 py-4 bg-gray-100">Заказы</th>
              <th className="px-6 py-4 bg-gray-100">Сумма</th>
              <th className="px-6 py-4 bg-gray-100">Долг</th>
              <th className="px-6 py-4 bg-gray-100 rounded-tr-xl text-center">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {clients.map((client, i) => (
              <tr
                key={i}
                className="hover:bg-indigo-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 font-medium">{client.name}</td>
                <td className="px-6 py-4">{client.phone}</td>
                <td className="px-6 py-4">{client.address}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      client.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {client.status === "Active" ? "Активен" : "Неактивен"}
                  </span>
                </td>
                <td className="px-6 py-4">{client.orders}</td>
                <td className="px-6 py-4 text-gray-700">
                  {(client.totalAmount ?? 0).toLocaleString()} сум
                </td>
                <td
                  className={`px-6 py-4 ${
                    (client.debt ?? 0) > 0 ? "text-red-500" : "text-gray-400"
                  }`}
                >
                  {(client.debt ?? 0).toLocaleString()} сум
                </td>

                <td className="px-6 py-4 flex justify-center">
                  <ActionMenu
                    onEdit={() => {
                      setEditingClient(client);
                      setIsEditOpen(true);
                    }}
                    onDelete={() => {
                      setDeletingClient(client);
                      setIsDeleteOpen(true);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddClientModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAddClient}
      />

      <EditClientModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        client={editingClient}
        onSubmit={handleEditClient}
      />

      <DeleteClientModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteClient}
        client={deletingClient}
      />
    </div>
  );
};

export default Clients;
