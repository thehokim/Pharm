import React, { useState, useEffect, useMemo } from "react";
import { Plus, Search, UserPlus2, User, Phone, MapPin, Contact, DollarSign, Users } from "lucide-react";
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
          page: result.meta?.page || 1,
          pageSize: result.meta?.pageSize || PAGE_SIZE,
          total: result.meta?.total || 0,
          totalPages: result.meta?.totalPages || 1,
        });
      })
      .catch((err) => console.error(t("error_loading_clients"), err));
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
        if (!res.ok) throw new Error(t("error_adding_client"));
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
        if (!res.ok) throw new Error(t("error_updating_client"));
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
        if (!res.ok) throw new Error(t("error_deleting_client"));
        return res.json();
      })
      .then(() => {
        fetchClients(page, PAGE_SIZE);
        setIsDeleteOpen(false);
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black p-6 space-y-6">
      {/* Декоративные неоновые элементы */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/5 rounded-full blur-3xl"></div>

      {/* Header */}
      <div className="relative bg-gray-900/90 backdrop-blur-xl border-2 border-cyan-400/30 rounded-3xl p-6 overflow-hidden"
           style={{ boxShadow: '0 0 50px rgba(6, 182, 212, 0.2)' }}>
        
        {/* Неоновое свечение заголовка */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-transparent to-emerald-400/10"></div>
        
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-400 rounded-2xl blur-md opacity-50"></div>
              <div className="relative bg-gray-800 border-2 border-cyan-400 p-4 rounded-2xl">
                <div className="flex items-center gap-2">
                  <Users className="text-cyan-400 w-7 h-7" 
                         style={{ filter: 'drop-shadow(0 0 10px #06b6d4)' }} />
                  <UserPlus2 className="text-emerald-400 w-5 h-5" 
                             style={{ filter: 'drop-shadow(0 0 8px #10b981)' }} />
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white"
                  style={{ textShadow: '0 0 20px rgba(6, 182, 212, 0.5)' }}>
                {t("clients.title")}
              </h1>
              <p className="text-cyan-400 text-sm mt-1">
                {t("client_base_management")}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Кнопка добавления */}
            <button
              onClick={() => setIsAddOpen(true)}
              className="relative bg-gradient-to-r from-cyan-500 to-emerald-500 p-4 rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-lg group overflow-hidden"
              style={{ 
                boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)',
                filter: 'drop-shadow(0 0 15px rgba(6, 182, 212, 0.5))'
              }}
              title={t("clients.addClient")}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Plus className="w-6 h-6 text-white relative z-10" />
            </button>
            
            {/* Поиск */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Search className="text-cyan-400 w-5 h-5" 
                        style={{ filter: 'drop-shadow(0 0 8px #06b6d4)' }} />
              </div>
              <input
                type="text"
                placeholder={t("clients.search")}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-80 bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400 pl-12 pr-4 py-4 rounded-2xl focus:border-cyan-400 focus:outline-none transition-all duration-300"
                style={{ 
                  boxShadow: search ? '0 0 20px rgba(6, 182, 212, 0.2)' : 'none'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="relative bg-gray-900/90 backdrop-blur-xl border-2 border-gray-700/50 rounded-3xl  hidden md:block"
           style={{ boxShadow: '0 0 30px rgba(0, 0, 0, 0.5)' }}>
        
        <div className="">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-800/50 border-b border-gray-700/50">
              <tr>
                <th className="px-6 py-5 font-semibold text-gray-300">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-cyan-400" 
                          style={{ filter: 'drop-shadow(0 0 8px #06b6d4)' }} />
                    {t("clients.table.name")}
                  </div>
                </th>
                <th className="px-6 py-5 font-semibold text-gray-300">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-400" 
                           style={{ filter: 'drop-shadow(0 0 8px #10b981)' }} />
                    {t("clients.table.phone")}
                  </div>
                </th>
                <th className="px-6 py-5 font-semibold text-gray-300">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-400" 
                           style={{ filter: 'drop-shadow(0 0 8px #a855f7)' }} />
                    {t("clients.table.address")}
                  </div>
                </th>
                <th className="px-6 py-5 font-semibold text-gray-300">
                  <div className="flex items-center gap-2">
                    <Contact className="w-4 h-4 text-amber-400" 
                             style={{ filter: 'drop-shadow(0 0 8px #f59e0b)' }} />
                    {t("clients.table.contactPerson")}
                  </div>
                </th>
                <th className="px-6 py-5 font-semibold text-gray-300">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-red-400" 
                               style={{ filter: 'drop-shadow(0 0 8px #ef4444)' }} />
                    {t("clients.table.debt")}
                  </div>
                </th>
                <th className="px-6 py-5 font-semibold text-gray-300 text-center">{t("clients.table.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    className="text-center px-6 py-12"
                    colSpan={6}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <Users className="w-12 h-12 text-gray-600" />
                      <span className="text-gray-400 font-medium text-lg">
                        {t("clients.noData")}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((client) => (
                  <tr
                    key={client.id}
                    className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-all duration-300 group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full"
                             style={{ boxShadow: '0 0 8px #06b6d4' }}></div>
                        <span className="font-medium text-white group-hover:text-cyan-400 transition-colors">
                          {client.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-emerald-400 font-medium">
                        {client.phones}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-purple-400">
                        {client.address}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-amber-400">
                        {client.contact_person}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${
                        Number(client.debt) > 0 
                          ? "text-red-400" 
                          : "text-gray-400"
                      }`}>
                        {(client.debt ?? 0).toLocaleString()} {t("editClientModal.delete_sum")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
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
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="block md:hidden">
        {filtered.length === 0 ? (
          <div className="bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-3xl py-12 text-center">
            <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <span className="text-gray-400 font-medium">{t("clients.noData")}</span>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((client) => (
              <div
                key={client.id}
                className="bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-6 space-y-4"
                style={{ boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)' }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"
                         style={{ boxShadow: '0 0 8px #06b6d4' }}></div>
                    <span className="text-lg font-semibold text-white">{client.name}</span>
                  </div>
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
                </div>
                
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-400" 
                           style={{ filter: 'drop-shadow(0 0 8px #10b981)' }} />
                    <span className="text-gray-400">{t("phone_colon")}</span>
                    <span className="text-emerald-400 font-medium">{client.phones}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-400" 
                            style={{ filter: 'drop-shadow(0 0 8px #a855f7)' }} />
                    <span className="text-gray-400">{t("clients.table.address")}</span>
                    <span className="text-purple-400">{client.address}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Contact className="w-4 h-4 text-amber-400" 
                             style={{ filter: 'drop-shadow(0 0 8px #f59e0b)' }} />
                    <span className="text-gray-400">{t("clients.table.contactPerson")}</span>
                    <span className="text-amber-400">{client.contact_person}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-red-400" 
                               style={{ filter: 'drop-shadow(0 0 8px #ef4444)' }} />
                    <span className="text-gray-400">{t("clients.table.debt")}</span>
                    <span className={`font-semibold ${
                      Number(client.debt) > 0 
                        ? "text-red-400" 
                        : "text-gray-400"
                    }`}>
                      {(client.debt ?? 0).toLocaleString()} {t("editClientModal.delete_sum")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center">
        <Pagination
          page={meta.page}
          pageSize={meta.pageSize}
          total={meta.total}
          totalPages={meta.totalPages}
          onPageChange={setPage}
        />
      </div>

      {/* Модальные окна */}
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