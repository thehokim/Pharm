import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  Truck,
  User,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  TruckElectric,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import ActionMenu from "../../../../components/layout/ActionMenu";
import AddSupplierModal from "./AddSupplierModal";
import EditSupplierModal from "./EditSupplierModal";
import DeleteSupplierModal from "./DeleteSupplierModal";
import Pagination from "../../../../components/layout/Pagination";
import { BASE_URL } from "../../../../utils/auth";

const PAGE_SIZE = 10;

const Suppliers = () => {
  const { t } = useTranslation("supplier");

  const [suppliers, setSuppliers] = useState([]);
  const [meta, setMeta] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
    pageSize: PAGE_SIZE,
  });
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [deletingSupplier, setDeletingSupplier] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const token = localStorage.getItem("token");

  // Пагинированный fetch
  const fetchSuppliers = (page = 1, pageSize = PAGE_SIZE) => {
    fetch(`${BASE_URL}/api/suppliers?page=${page}&pageSize=${pageSize}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setSuppliers(Array.isArray(result.data) ? result.data : []);
        setMeta({
          page: result.meta?.page || 1,
          pageSize: result.meta?.pageSize || PAGE_SIZE,
          total: result.meta?.total || 0,
          totalPages: result.meta?.totalPages || 1,
        });
      })
      .catch((err) => console.error(t("error_loading_suppliers"), err));
  };

  useEffect(() => {
    fetchSuppliers(page, PAGE_SIZE);
    // eslint-disable-next-line
  }, [page]);

  const handleAdd = (supplier) => {
    fetch(`${BASE_URL}/api/suppliers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(supplier),
    })
      .then((res) => {
        if (!res.ok) throw new Error(t("error_adding_supplier"));
        return res.json();
      })
      .then(() => fetchSuppliers(page, PAGE_SIZE))
      .catch((err) => alert(err.message));
  };

  const handleEdit = (updated) => {
    if (!editingSupplier?.id) return;
    fetch(`${BASE_URL}/api/suppliers/${editingSupplier.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updated),
    })
      .then((res) => {
        if (!res.ok) throw new Error(t("error_updating_supplier"));
        return res.json();
      })
      .then(() => fetchSuppliers(page, PAGE_SIZE))
      .catch((err) => alert(err.message));
  };

  const handleDelete = () => {
    if (!deletingSupplier?.id) return;
    fetch(`${BASE_URL}/api/suppliers/${deletingSupplier.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(t("error_deleting_supplier"));
        return res.json();
      })
      .then(() => {
        fetchSuppliers(page, PAGE_SIZE);
        setIsDeleteOpen(false);
      })
      .catch((err) => alert(err.message));
  };

  // Фильтрация по всем столбцам только на текущей странице
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return suppliers.filter((s) =>
      [
        s.name,
        s.contact_person,
        s.phones,
        s.email,
        s.address,
        String(s.debt),
      ].some((v) => (v || "").toLowerCase().includes(q))
    );
  }, [suppliers, search]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black p-6 space-y-6">
      {/* Декоративные неоновые элементы */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-400/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400/5 rounded-full blur-3xl"></div>

      {/* Header */}
      <div
        className="relative bg-gray-900/90 backdrop-blur-xl border-2 border-orange-400/30 rounded-3xl p-6 overflow-hidden"
        style={{ boxShadow: "0 0 50px rgba(249, 115, 22, 0.2)" }}
      >
        {/* Неоновое свечение заголовка */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/10 via-transparent to-amber-400/10"></div>

        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-400 rounded-2xl blur-md opacity-50"></div>
              <div className="relative bg-gray-800 border-2 border-orange-400 p-4 rounded-2xl">
                <div className="flex items-center gap-2">
                  <TruckElectric
                    className="text-orange-400 w-7 h-7"
                    style={{ filter: "drop-shadow(0 0 10px #f97316)" }}
                  />
                </div>
              </div>
            </div>
            <div>
              <h1
                className="text-3xl font-bold text-white"
                style={{ textShadow: "0 0 20px rgba(249, 115, 22, 0.5)" }}
              >
                {t("suppliers")}
              </h1>
              <p className="text-orange-400 text-sm mt-1">
                {t("supplier_management")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Кнопка добавления */}
            <button
              onClick={() => setIsAddOpen(true)}
              className="relative bg-gradient-to-r from-orange-500 to-amber-500 p-4 rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-lg group overflow-hidden"
              style={{
                boxShadow: "0 0 20px rgba(249, 115, 22, 0.3)",
                filter: "drop-shadow(0 0 15px rgba(249, 115, 22, 0.5))",
              }}
              title={t("add_supplier")}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-amber-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Plus className="w-6 h-6 text-white relative z-10" />
            </button>

            {/* Поиск */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Search
                  className="text-orange-400 w-5 h-5"
                  style={{ filter: "drop-shadow(0 0 8px #f97316)" }}
                />
              </div>
              <input
                type="text"
                placeholder={t("search_placeholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-80 bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400 pl-12 pr-4 py-4 rounded-2xl focus:border-orange-400 focus:outline-none transition-all duration-300"
                style={{
                  boxShadow: search
                    ? "0 0 20px rgba(249, 115, 22, 0.2)"
                    : "none",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div
        className="relative bg-gray-900/90 backdrop-blur-xl border-2 border-gray-700/50 rounded-3xl  hidden md:block"
        style={{ boxShadow: "0 0 30px rgba(0, 0, 0, 0.5)" }}
      >
        <div className="">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-800/50 border-b border-gray-700/50">
              <tr>
                <th className="px-6 py-5 font-semibold text-gray-300">
                  <div className="flex items-center gap-2">
                    <Truck
                      className="w-4 h-4 text-orange-400"
                      style={{ filter: "drop-shadow(0 0 8px #f97316)" }}
                    />
                    {t("name")}
                  </div>
                </th>
                <th className="px-6 py-5 font-semibold text-gray-300">
                  <div className="flex items-center gap-2">
                    <User
                      className="w-4 h-4 text-cyan-400"
                      style={{ filter: "drop-shadow(0 0 8px #06b6d4)" }}
                    />
                    {t("contact_person")}
                  </div>
                </th>
                <th className="px-6 py-5 font-semibold text-gray-300">
                  <div className="flex items-center gap-2">
                    <Phone
                      className="w-4 h-4 text-emerald-400"
                      style={{ filter: "drop-shadow(0 0 8px #10b981)" }}
                    />
                    {t("phones")}
                  </div>
                </th>
                <th className="px-6 py-5 font-semibold text-gray-300">
                  <div className="flex items-center gap-2">
                    <Mail
                      className="w-4 h-4 text-purple-400"
                      style={{ filter: "drop-shadow(0 0 8px #a855f7)" }}
                    />
                    {t("email")}
                  </div>
                </th>
                <th className="px-6 py-5 font-semibold text-gray-300">
                  <div className="flex items-center gap-2">
                    <MapPin
                      className="w-4 h-4 text-indigo-400"
                      style={{ filter: "drop-shadow(0 0 8px #6366f1)" }}
                    />
                    {t("address")}
                  </div>
                </th>
                <th className="px-6 py-5 font-semibold text-gray-300">
                  <div className="flex items-center gap-2">
                    <DollarSign
                      className="w-4 h-4 text-red-400"
                      style={{ filter: "drop-shadow(0 0 8px #ef4444)" }}
                    />
                    {t("debt")}
                  </div>
                </th>
                <th className="px-6 py-5 font-semibold text-gray-300 text-center">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td className="text-center px-6 py-12" colSpan={7}>
                    <div className="flex flex-col items-center gap-4">
                      <Truck className="w-12 h-12 text-gray-600" />
                      <span className="text-gray-400 font-medium text-lg">
                        {t("no_data")}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-all duration-300 group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-2 h-2 bg-orange-400 rounded-full"
                          style={{ boxShadow: "0 0 8px #f97316" }}
                        ></div>
                        <span className="font-medium text-white group-hover:text-orange-400 transition-colors">
                          {s.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-cyan-400 font-medium">
                        {s.contact_person}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-emerald-400">{s.phones}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-purple-400">{s.email}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-indigo-400">{s.address}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-red-400 font-semibold">
                        {Number(s.debt).toLocaleString()} {t("soum")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <ActionMenu
                        onEdit={() => {
                          setEditingSupplier(s);
                          setIsEditOpen(true);
                        }}
                        onDelete={() => {
                          setDeletingSupplier(s);
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
            <Truck className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <span className="text-gray-400 font-medium">{t("no_data")}</span>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((s) => (
              <div
                key={s.id}
                className="bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-6 space-y-4"
                style={{ boxShadow: "0 0 20px rgba(0, 0, 0, 0.3)" }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2 h-2 bg-orange-400 rounded-full"
                      style={{ boxShadow: "0 0 8px #f97316" }}
                    ></div>
                    <span className="text-lg font-semibold text-white">
                      {s.name}
                    </span>
                  </div>
                  <ActionMenu
                    onEdit={() => {
                      setEditingSupplier(s);
                      setIsEditOpen(true);
                    }}
                    onDelete={() => {
                      setDeletingSupplier(s);
                      setIsDeleteOpen(true);
                    }}
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <User
                      className="w-4 h-4 text-cyan-400"
                      style={{ filter: "drop-shadow(0 0 8px #06b6d4)" }}
                    />
                    <span className="text-gray-400">Контакт:</span>
                    <span className="text-cyan-400 font-medium">
                      {s.contact_person}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone
                      className="w-4 h-4 text-emerald-400"
                      style={{ filter: "drop-shadow(0 0 8px #10b981)" }}
                    />
                    <span className="text-gray-400">Телефон:</span>
                    <span className="text-emerald-400">{s.phones}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail
                      className="w-4 h-4 text-purple-400"
                      style={{ filter: "drop-shadow(0 0 8px #a855f7)" }}
                    />
                    <span className="text-gray-400">Email:</span>
                    <span className="text-purple-400">{s.email}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin
                      className="w-4 h-4 text-indigo-400"
                      style={{ filter: "drop-shadow(0 0 8px #6366f1)" }}
                    />
                    <span className="text-gray-400">Адрес:</span>
                    <span className="text-indigo-400">{s.address}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign
                      className="w-4 h-4 text-red-400"
                      style={{ filter: "drop-shadow(0 0 8px #ef4444)" }}
                    />
                    <span className="text-gray-400">Задолженность:</span>
                    <span className="text-red-400 font-semibold">
                      {Number(s.debt).toLocaleString()} {t("soum")}
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
        <Pagination meta={meta} onPageChange={handlePageChange} />
      </div>

      {/* Модальные окна */}
      <AddSupplierModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAdd}
      />
      <EditSupplierModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        supplier={editingSupplier}
        onSubmit={handleEdit}
      />
      <DeleteSupplierModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        supplier={deletingSupplier}
      />
    </div>
  );
};

export default Suppliers;
