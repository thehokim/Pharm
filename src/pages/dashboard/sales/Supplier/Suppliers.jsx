import React, { useState, useEffect, useMemo } from "react";
import { Plus, Search, TruckElectric } from "lucide-react";
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
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
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
          page: (result.meta?.page ?? 0) + 1,
          totalPages: result.meta?.totalPages || 1,
        });
      })
      .catch((err) => console.error("Ошибка загрузки поставщиков:", err));
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
        if (!res.ok) throw new Error(t("add_error") || "Ошибка добавления");
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
        if (!res.ok) throw new Error(t("edit_error") || "Ошибка при редактировании");
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
        if (!res.ok) throw new Error(t("delete_error") || "Ошибка при удалении");
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
      [s.name, s.contact_person, s.phones, s.email, s.address, String(s.debt)]
        .some((v) => (v || "").toLowerCase().includes(q))
    );
  }, [suppliers, search]);

  return (
    <div className="space-y-4 bg-gray-50 p-4 min-h-screen">
      {/* Header */}
      <div className="bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl border border-gray-200">
        <div className="flex items-center justify-center gap-3">
          <div className="bg-indigo-100 rounded-full p-3">
            <TruckElectric className="text-indigo-700" />
          </div>
          <span className="text-2xl font-bold text-gray-800">
            {t("suppliers")}
          </span>
        </div>
        <div className="flex gap-2 items-center w-full md:w-auto">
          <button
            onClick={() => setIsAddOpen(true)}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-indigo-50 text-indigo-600 text-2xl font-bold hover:bg-indigo-100 hover:text-indigo-800 transition-colors focus:outline-none"
            title={t("add_supplier")}
          >
            <Plus size={20} />
          </button>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={t("search_placeholder")}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-full bg-gray-50 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold">{t("name")}</th>
              <th className="px-6 py-4 font-semibold">{t("contact_person")}</th>
              <th className="px-6 py-4 font-semibold">{t("phones")}</th>
              <th className="px-6 py-4 font-semibold">{t("email")}</th>
              <th className="px-6 py-4 font-semibold">{t("address")}</th>
              <th className="px-6 py-4 font-semibold">{t("debt")}</th>
              <th className="px-6 py-4 font-semibold text-center">{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((s) => (
                <tr key={s.id} className="hover:bg-indigo-50 border-b border-gray-100 transition-colors">
                  <td className="px-6 py-4 font-medium">{s.name}</td>
                  <td className="px-6 py-4">{s.contact_person}</td>
                  <td className="px-6 py-4">{s.phones}</td>
                  <td className="px-6 py-4">{s.email}</td>
                  <td className="px-6 py-4">{s.address}</td>
                  <td className="px-6 py-4 text-red-600 font-semibold">{Number(s.debt).toLocaleString()} {t("soum")}</td>
                  <td className="px-6 py-4 flex justify-center">
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
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="text-center px-6 py-8 text-gray-400 font-medium"
                >
                  {t("no_data")}
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
