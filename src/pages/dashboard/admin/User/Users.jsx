import React, { useState, useEffect } from "react";
import { Search, Plus, Users as UsersIcon } from "lucide-react";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";
import DeleteUserModal from "./DeleteUserModal";
import { BASE_URL } from "../../../../utils/auth";
import ActionMenu from "../../../../components/layout/ActionMenu";
import { useTranslation } from "react-i18next";
import Pagination from "../../../../components/layout/Pagination"; 

const ToggleSwitch = ({ checked, onChange }) => (
  <button
    onClick={onChange}
    className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${
      checked ? "bg-blue-500" : "bg-gray-300"
    }`}
    tabIndex={0}
    aria-checked={checked}
    type="button"
  >
    <div
      className={`bg-white w-5 h-5 rounded-full shadow transform transition-transform duration-300 ${
        checked ? "translate-x-5" : ""
      }`}
    />
  </button>
);

const PAGE_SIZE = 10;

const Users = () => {
  const { t } = useTranslation("user");
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const token = localStorage.getItem("token") || "";

  const fetchUsers = (page = 1, pageSize = PAGE_SIZE) => {
    fetch(`${BASE_URL}/api/users/?page=${page}&pageSize=${pageSize}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((result) => {
        const arr = Array.isArray(result.data) ? result.data : [];
        setUsers(
          arr.map((u) => ({
            id: u.id,
            name: u.full_name,
            email: u.username,
            role: u.role,
            isActive: u.is_active,
            lastActive: new Date(u.created_at).toLocaleString(),
          }))
        );
        setMeta({
          page: (result.meta?.page || 0) + 1, // если сервер отдаёт 0 для первой, добавляем +1
          totalPages: result.meta?.totalPages || 1,
        });
      })
      .catch((err) => console.error("Ошибка загрузки пользователей:", err));
  };

  useEffect(() => {
    fetchUsers(page, PAGE_SIZE);
    // eslint-disable-next-line
  }, [page]);

  // ... остальной CRUD-код не меняется

  const handleAddUser = (form) => {
    fetch(`${BASE_URL}/api/users/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username: form.username,
        full_name: form.full_name,
        role: form.role,
        password: form.password,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка при добавлении пользователя");
        return res.json();
      })
      .then(() => fetchUsers(page, PAGE_SIZE))
      .catch((err) => alert(err.message));
  };

  const handleEditSubmit = (form) => {
    if (!editingUser) return;
    fetch(`${BASE_URL}/api/users/${editingUser.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username: form.username,
        full_name: form.full_name,
        role: form.role,
        is_active: editingUser.isActive,
        ...(form.password && { password: form.password }),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка при обновлении пользователя");
        return res.json();
      })
      .then(() => {
        setIsEditOpen(false);
        fetchUsers(page, PAGE_SIZE);
      })
      .catch((err) => alert(err.message));
  };

  const handleConfirmDelete = () => {
    if (!deletingUser) return;
    fetch(`${BASE_URL}/api/users/${deletingUser.id}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка при удалении пользователя");
        return res.json();
      })
      .then(() => {
        setIsDeleteOpen(false);
        fetchUsers(page, PAGE_SIZE);
      })
      .catch((err) => alert(err.message));
  };

  const toggleUserStatus = (user) => {
    const newStatus = !user.isActive;
    fetch(`${BASE_URL}/api/users/${user.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username: user.email,
        full_name: user.name,
        role: user.role,
        is_active: newStatus,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка при обновлении статуса");
        return res.json();
      })
      .then(() => fetchUsers(page, PAGE_SIZE))
      .catch((err) => alert(err.message));
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsEditOpen(true);
  };
  const handleDelete = (user) => {
    setDeletingUser(user);
    setIsDeleteOpen(true);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 bg-gray-50 p-4 min-h-screen">
      <div className="bg-white flex flex-col sm:flex-row items-center p-4 rounded-2xl border border-gray-200 justify-between gap-4">
        <div className="flex items-center justify-center gap-3">
        <div className="rounded-full p-3 bg-indigo-100">
          <UsersIcon className="text-indigo-700"/>
        </div>
        <span className="text-2xl font-semibold text-gray-800">{t("title")}</span>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center w-11 h-11 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition text-2xl focus:outline-none"
            title={t("addUser")}
          >
            <Plus size={24} />
          </button>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-full bg-gray-50 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 ">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="text-sm font-semibold uppercase tracking-wide text-gray-600">
            <tr>
              <th className="px-6 py-4 bg-gray-100 rounded-tl-xl">{t("name")}</th>
              <th className="px-6 py-4 bg-gray-100">{t("username")}</th>
              <th className="px-6 py-4 bg-gray-100">{t("role")}</th>
              <th className="px-6 py-4 bg-gray-100">{t("active")}</th>
              <th className="px-6 py-4 bg-gray-100">{t("created")}</th>
              <th className="px-6 py-4 bg-gray-100 rounded-tr-xl text-center">{t("actions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-indigo-50 transition-colors duration-150">
                <td className="px-6 py-4 font-medium">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.role}</td>
                <td className="px-6 py-4">
                  <ToggleSwitch
                    checked={user.isActive}
                    onChange={() => toggleUserStatus(user)}
                  />
                </td>
                <td className="px-6 py-4">{user.lastActive}</td>
                <td className="px-6 py-4 flex justify-center">
                  <ActionMenu
                    onEdit={() => handleEdit(user)}
                    onDelete={() => handleDelete(user)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        page={meta.page}
        totalPages={meta.totalPages}
        onPageChange={setPage}
      />

      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddUser}
      />
      <EditUserModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        userData={editingUser}
        onSubmit={handleEditSubmit}
      />
      <DeleteUserModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        user={deletingUser}
      />
    </div>
  );
};

export default Users;
