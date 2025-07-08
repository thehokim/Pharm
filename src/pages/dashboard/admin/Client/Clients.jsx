import React, { useState, useEffect, useMemo } from "react";
import { Plus, Search, UserPlus2 } from "lucide-react";
import ActionMenu from "../../../../components/layout/ActionMenu";
import AddClientModal from "./AddClientModal";
import EditClientModal from "./EditClientModal";
import DeleteClientModal from "./DeleteClientModal";
import Pagination from "../../../../components/layout/Pagination";
import { BASE_URL } from "../../../../utils/auth";
import { useTranslation } from "react-i18next";

const PAGE_SIZE = 10;

const Clients = () => {
  const { t } = useTranslation("client");
  const [clients, setClients] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [deletingClient, setDeletingClient] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const token = localStorage.getItem("token");

  const fetchClients = (page = 1, pageSize = PAGE_SIZE) => {
    fetch(`${BASE_URL}/api/clients?page=${page}&pageSize=${pageSize}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setClients(Array.isArray(result.data) ? result.data : []);
        setMeta({
          page: (result.meta?.page ?? 0) + 1,
          totalPages: result.meta?.totalPages || 1,
        });
      })
      .catch((err) => console.error("Ошибка загрузки клиентов:", err));
  };

  useEffect(() => {
    fetchClients(page, PAGE_SIZE);
    // eslint-disable-next-line
  }, [page]);

  // Фильтрация по всем полям таблицы (только для текущей страницы)
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return clients.filter((c) =>
      [c.name, c.phones, c.address, c.contact_person, String(c.debt || 0)]
        .some((v) => (v || "").toLowerCase().includes(q))
    );
  }, [clients, search]);

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
      .then(() => fetchClients(page, PAGE_SIZE))
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
      .then(() => fetchClients(page, PAGE_SIZE))
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
        fetchClients(page, PAGE_SIZE);
        setIsDeleteOpen(false);
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className="space-y-4 bg-gray-50 p-4 min-h-screen">
      <div className="bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl border border-gray-200">
        <div className="flex items-center justify-center gap-3">
          <div className="rounded-full bg-indigo-100 p-3">
          <UserPlus2 className="text-indigo-700" />
          </div>
          <span className="text-2xl font-bold text-gray-800">
            {t("clients.title")}
          </span>
        </div>
        <div className="flex gap-3 items-center w-full md:w-auto">
          <button
            onClick={() => setIsAddOpen(true)}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-indigo-50 text-indigo-600 text-2xl font-bold hover:bg-indigo-100 hover:text-indigo-800 transition-colors focus:outline-none"
            title={t("clients.addClient")}
          >
            <Plus size={20} />
          </button>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={t("clients.search")}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-full bg-gray-50 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 ">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold">{t("clients.table.name")}</th>
              <th className="px-6 py-4 font-semibold">{t("clients.table.phones")}</th>
              <th className="px-6 py-4 font-semibold">{t("clients.table.address")}</th>
              <th className="px-6 py-4 font-semibold">{t("clients.table.contactPerson")}</th>
              <th className="px-6 py-4 font-semibold">{t("clients.table.debt")}</th>
              <th className="px-6 py-4 font-semibold text-center">{t("clients.table.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((client) => (
                <tr
                  key={client.id}
                  className="hover:bg-indigo-50 border-b border-gray-100 transition-colors"
                >
                  <td className="px-6 py-4 font-medium">{client.name}</td>
                  <td className="px-6 py-4">{client.phones}</td>
                  <td className="px-6 py-4">{client.address}</td>
                  <td className="px-6 py-4">{client.contact_person}</td>
                  <td className={`px-6 py-4 font-semibold
                    ${Number(client.debt) > 0 ? "text-[#ff0000]" : "text-gray-400"}`}>
                    {(client.debt ?? 0).toLocaleString()} {t("editClientModal.delete_sum")}
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
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center px-6 py-8 text-gray-400 font-medium"
                >
                  {t("clients.noData")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={meta.page}
        totalPages={meta.totalPages}
        onPageChange={setPage}
      />

      {/* Модалки */}
      <AddClientModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onSubmit={handleAddClient} />
      <EditClientModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} client={editingClient} onSubmit={handleEditClient} />
      <DeleteClientModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleDeleteClient} client={deletingClient} />
    </div>
  );
};

export default Clients;
