import React, { useState, useEffect } from "react";
import { Plus, Search, TruckElectric } from "lucide-react";
import ActionMenu from "../../../../components/layout/ActionMenu"; // подкорректируй путь, если нужно
import AddSupplierModal from "./AddSupplierModal";
import EditSupplierModal from "./EditSupplierModal";
import DeleteSupplierModal from "./DeleteSupplierModal";
import { BASE_URL } from "../../../../utils/auth";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [deletingSupplier, setDeletingSupplier] = useState(null);
  const token = localStorage.getItem("token");

  const fetchSuppliers = () => {
    fetch(`${BASE_URL}/api/suppliers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setSuppliers)
      .catch((err) => console.error("Ошибка загрузки поставщиков:", err));
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

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
        if (!res.ok) throw new Error("Ошибка добавления");
        return res.json();
      })
      .then(() => fetchSuppliers())
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
        if (!res.ok) throw new Error("Ошибка при редактировании");
        return res.json();
      })
      .then(() => fetchSuppliers())
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
        if (!res.ok) throw new Error("Ошибка при удалении");
        return res.json();
      })
      .then(() => {
        fetchSuppliers();
        setIsDeleteOpen(false);
      })
      .catch((err) => alert(err.message));
  };

  return (
    <div className="space-y-4 bg-gray-50">
      {/* Header */}
      <div className="bg-white flex items-center justify-between p-4 rounded-xl">
        <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
          <TruckElectric className="w-7 h-7" /> Поставщики
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
              placeholder="Поиск поставщика..."
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
              <th className="px-6 py-4 bg-gray-100 rounded-tl-xl">Название</th>
              <th className="px-6 py-4 bg-gray-100">Контактное лицо</th>
              <th className="px-6 py-4 bg-gray-100">Телефон</th>
              <th className="px-6 py-4 bg-gray-100">Email</th>
              <th className="px-6 py-4 bg-gray-100">Адрес</th>
              <th className="px-6 py-4 bg-gray-100">Задолженность</th>
              <th className="px-6 py-4 bg-gray-100 rounded-tr-xl text-center">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {suppliers.map((s) => (
              <tr key={s.id} className="hover:bg-indigo-50 transition-colors duration-150">
                <td className="px-6 py-4 font-medium">{s.name}</td>
                <td className="px-6 py-4">{s.contact_person}</td>
                <td className="px-6 py-4">{s.phone}</td>
                <td className="px-6 py-4">{s.email}</td>
                <td className="px-6 py-4">{s.address}</td>
                <td className="px-6 py-4 text-red-600 font-semibold">
                  {s.debt.toLocaleString()} сум
                </td>
                <td className="px-6 py-4 flex justify-center mt-3">
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
            ))}
          </tbody>
        </table>
      </div>

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
