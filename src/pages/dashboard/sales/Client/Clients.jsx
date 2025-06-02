import React, { useState, useEffect } from "react";
import { Plus, Search, UserPlus2 } from "lucide-react";
import ActionMenu from "../../../../components/layout/ActionMenu"; // ← поправь путь, если нужно
import AddClientModal from "./AddClientModal";
import EditClientModal from "./EditClientModal";
import DeleteClientModal from "./DeleteClientModal";
import { BASE_URL } from "../../../../utils/auth";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [deletingClient, setDeletingClient] = useState(null);
  const token = localStorage.getItem("token");

  const fetchClients = () => {
    fetch(`${BASE_URL}/api/clients`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setClients(data))
      .catch((err) => console.error("Ошибка загрузки клиентов:", err));
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleAddClient = (form) => {
    fetch(`${BASE_URL}/api/clients`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка добавления клиента");
        return res.json();
      })
      .then(() => fetchClients())
      .catch((err) => alert(err.message));
  };

  const handleEditClient = (form) => {
    if (!editingClient?.id) return;
    fetch(`${BASE_URL}/api/clients/${editingClient.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка при редактировании");
        return res.json();
      })
      .then(() => fetchClients())
      .catch((err) => alert(err.message));
  };

  const handleDeleteClient = () => {
    if (!deletingClient?.id) return;
    fetch(`${BASE_URL}/api/clients/${deletingClient.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка удаления клиента");
        return res.json();
      })
      .then(() => {
        fetchClients();
        setIsDeleteOpen(false);
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className="space-y-4 bg-gray-50">
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

      <div className="bg-white rounded-2xl">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="text-xs font-semibold uppercase tracking-wide text-gray-600">
            <tr>
              <th className="px-6 py-4 bg-gray-100 rounded-tl-xl">Имя</th>
              <th className="px-6 py-4 bg-gray-100">Телефон</th>
              <th className="px-6 py-4 bg-gray-100">Адрес</th>
              <th className="px-6 py-4 bg-gray-100">Контактное лицо</th>
              <th className="px-6 py-4 bg-gray-100">Долг</th>
              <th className="px-6 py-4 bg-gray-100 rounded-tr-xl text-center">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {clients.map((client, i) => (
              <tr key={client.id} className="hover:bg-indigo-50 transition-colors duration-150">
                <td className="px-6 py-4 font-medium">{client.name}</td>
                <td className="px-6 py-4">{client.phone}</td>
                <td className="px-6 py-4">{client.address}</td>
                <td className="px-6 py-4">{client.contact_person}</td>
                <td
                  className={`px-6 py-4 ${
                    client.debt > 0 ? "text-red-500" : "text-gray-400"
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

      <AddClientModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSubmit={handleAddClient} />
      <EditClientModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} client={editingClient} onSubmit={handleEditClient} />
      <DeleteClientModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleDeleteClient} client={deletingClient} />
    </div>
  );
};

export default Clients;
