import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Users as UsersIcon,
  UserCheck,
  Shield,
  Activity,
  Clock,
  Edit3,
  Trash2,
} from "lucide-react";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";
import DeleteUserModal from "./DeleteUserModal";
import { BASE_URL } from "../../../../utils/auth";
import ActionMenu from "../../../../components/layout/ActionMenu";
import { useTranslation } from "react-i18next";
import Pagination from "../../../../components/layout/Pagination";

// Фармацевтический toggle switch с неоновыми эффектами
const PharmaToggleSwitch = ({ checked, onChange }) => (
  <button
    onClick={onChange}
    className={`relative w-14 h-8 flex items-center rounded-full p-1 transition-all duration-300 border-2 ${
      checked
        ? "bg-emerald-900/30 border-emerald-400/50"
        : "bg-gray-800/50 border-gray-600/50"
    }`}
    style={{
      boxShadow: checked
        ? "0 0 20px rgba(16, 185, 129, 0.3), inset 0 0 20px rgba(16, 185, 129, 0.1)"
        : "0 0 10px rgba(107, 114, 128, 0.2)",
    }}
    tabIndex={0}
    aria-checked={checked}
    type="button"
  >
    <div
      className={`relative w-6 h-6 rounded-full shadow-lg transform transition-all duration-300 ${
        checked ? "translate-x-5.5 bg-emerald-400" : "translate-x-0 bg-gray-400"
      }`}
      style={{
        boxShadow: checked
          ? "0 0 15px rgba(16, 185, 129, 0.8), 0 0 30px rgba(16, 185, 129, 0.4)"
          : "0 0 10px rgba(107, 114, 128, 0.5)",
      }}
    >
      {checked && (
        <div className="absolute inset-0 bg-emerald-400 rounded-full animate-pulse opacity-50"></div>
      )}
    </div>

    {/* Индикатор активности */}
    <div
      className={`absolute right-2 transition-opacity duration-300 ${
        checked ? "opacity-100" : "opacity-0"
      }`}
    >
      <Activity
        className="w-3 h-3 text-emerald-400"
        style={{ filter: "drop-shadow(0 0 8px #10b981)" }}
      />
    </div>
  </button>
);

// Роль пользователя с цветовым кодированием
const UserRoleBadge = ({ role }) => {
  const getRoleConfig = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return {
          color: "text-red-400",
          bg: "bg-red-900/20",
          border: "border-red-400/30",
          icon: Shield,
          glow: "#ef4444",
        };
      case "warehouse":
      case "warehouse":
        return {
          color: "text-orange-400",
          bg: "bg-orange-900/20",
          border: "border-orange-400/30",
          icon: UserCheck,
          glow: "#10b981",
        };
      case "accountant":
      case "accountant":
        return {
          color: "text-emerald-400",
          bg: "bg-emerald-900/20",
          border: "border-emerald-400/30",
          icon: UserCheck,
          glow: "#10b981",
        };
      case "sales":
      case "manager":
        return {
          color: "text-cyan-400",
          bg: "bg-cyan-900/20",
          border: "border-cyan-400/30",
          icon: UsersIcon,
          glow: "#06b6d4",
        };
      default:
        return {
          color: "text-gray-400",
          bg: "bg-gray-900/20",
          border: "border-gray-400/30",
          icon: UsersIcon,
          glow: "#6b7280",
        };
    }
  };

  const config = getRoleConfig(role);
  const IconComponent = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-2xl border ${config.bg} ${config.border}`}
      style={{ boxShadow: `0 0 15px ${config.glow}20` }}
    >
      <IconComponent
        className={`w-4 h-4 ${config.color}`}
        style={{ filter: `drop-shadow(0 0 8px ${config.glow})` }}
      />
      <span className={`text-xs font-semibold ${config.color}`}>{role}</span>
    </div>
  );
};

const PAGE_SIZE = 10;

const Users = () => {
  const { t } = useTranslation("user");
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({ 
    page: 1, 
    totalPages: 1, 
    total: 0, 
    pageSize: PAGE_SIZE 
  });
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
        // ИСПРАВЛЕНО: правильно устанавливаем meta объект
        setMeta({
          page: result.meta?.page || 1,
          pageSize: result.meta?.pageSize || PAGE_SIZE,
          total: result.meta?.total || 0,
          totalPages: result.meta?.totalPages || 1,
        });
      })
      .catch((err) => console.error(t("error_loading_users"), err));
  };

  useEffect(() => {
    fetchUsers(page, PAGE_SIZE);
    // eslint-disable-next-line
  }, [page]);

  // ДОБАВЛЕНО: обработчик смены страницы
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

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
        if (!res.ok) throw new Error(t("error_adding_user"));
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
        if (!res.ok) throw new Error(t("error_updating_user"));
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black p-6 space-y-6">
      {/* Декоративные неоновые элементы */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/5 rounded-full blur-3xl"></div>

      {/* Header */}
      <div
        className="relative bg-gray-900/90 backdrop-blur-xl border-2 border-emerald-400/30 rounded-3xl p-6 overflow-hidden"
        style={{ boxShadow: "0 0 50px rgba(16, 185, 129, 0.2)" }}
      >
        {/* Неоновое свечение заголовка */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-transparent to-cyan-400/10"></div>

        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-400 rounded-2xl blur-md opacity-50"></div>
              <div className="relative bg-gray-800 border-2 border-emerald-400 p-4 rounded-2xl">
                <div className="flex items-center gap-2">
                  <UsersIcon
                    className="text-emerald-400 w-7 h-7"
                    style={{ filter: "drop-shadow(0 0 10px #10b981)" }}
                  />
                  <Shield
                    className="text-cyan-400 w-5 h-5"
                    style={{ filter: "drop-shadow(0 0 8px #06b6d4)" }}
                  />
                </div>
              </div>
            </div>
            <div>
              <h1
                className="text-3xl font-bold text-white"
                style={{ textShadow: "0 0 20px rgba(16, 185, 129, 0.5)" }}
              >
                {t("title")}
              </h1>
              <p className="text-emerald-400 text-sm mt-1">
                {t("title_2")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Кнопка добавления */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="relative bg-gradient-to-r from-emerald-500 to-cyan-500 p-4 rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-lg group overflow-hidden"
              style={{
                boxShadow: "0 0 20px rgba(16, 185, 129, 0.3)",
                filter: "drop-shadow(0 0 15px rgba(16, 185, 129, 0.5))",
              }}
              title={t("addUser")}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Plus className="w-6 h-6 text-white relative z-10" />
            </button>

            {/* Поиск */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Search
                  className="text-cyan-400 w-5 h-5"
                  style={{ filter: "drop-shadow(0 0 8px #06b6d4)" }}
                />
              </div>
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-80 bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400 pl-12 pr-4 py-4 rounded-2xl focus:border-cyan-400 focus:outline-none transition-all duration-300"
                style={{
                  boxShadow: searchTerm
                    ? "0 0 20px rgba(6, 182, 212, 0.2)"
                    : "none",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div
        className="relative bg-gray-900/90 backdrop-blur-xl border-2 border-gray-700/50 rounded-3xl overflow-hidden"
        style={{ boxShadow: "0 0 30px rgba(0, 0, 0, 0.5)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-800/50 border-b border-gray-700/50">
              <tr>
                <th className="px-6 py-5 font-semibold text-gray-300 flex items-center gap-2">
                  <UserCheck
                    className="w-4 h-4 text-emerald-400"
                    style={{ filter: "drop-shadow(0 0 8px #10b981)" }}
                  />
                  {t("name")}
                </th>
                <th className="px-6 py-5 font-semibold text-gray-300">
                  {t("username")}
                </th>
                <th className="px-6 py-5 font-semibold text-gray-300">
                  {t("role")}
                </th>
                <th className="px-6 py-5 font-semibold text-gray-300">
                  {t("active")}
                </th>
                <th className="px-6 py-5 font-semibold text-gray-300">
                  <div className="flex items-center gap-2">
                    <Clock
                      className="w-4 h-4 text-cyan-400"
                      style={{ filter: "drop-shadow(0 0 8px #06b6d4)" }}
                    />
                    {t("created")}
                  </div>
                </th>
                <th className="px-6 py-5 font-semibold text-gray-300 text-center">
                  {t("actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-all duration-300 group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            user.isActive ? "bg-emerald-400" : "bg-gray-500"
                          }`}
                          style={{
                            boxShadow: user.isActive
                              ? "0 0 8px #10b981"
                              : "none",
                          }}
                        ></div>
                        <span className="font-medium text-white group-hover:text-emerald-400 transition-colors">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400 font-mono text-sm">
                        {user.email}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <UserRoleBadge role={user.role} />
                    </td>
                    <td className="px-6 py-4">
                      <PharmaToggleSwitch
                        checked={user.isActive}
                        onChange={() => toggleUserStatus(user)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400 text-sm">
                        {user.lastActive}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="bg-gray-800 border border-emerald-400/30 p-2 rounded-xl text-emerald-400 hover:border-emerald-400 hover:scale-110 transition-all duration-300"
                          style={{
                            boxShadow: "0 0 10px rgba(16, 185, 129, 0.2)",
                          }}
                          title="Редактировать"
                        >
                          <Edit3
                            className="w-4 h-4"
                            style={{ filter: "drop-shadow(0 0 8px #10b981)" }}
                          />
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="bg-gray-800 border border-red-400/30 p-2 rounded-xl text-red-400 hover:border-red-400 hover:scale-110 transition-all duration-300"
                          style={{
                            boxShadow: "0 0 10px rgba(239, 68, 68, 0.2)",
                          }}
                          title="Удалить"
                        >
                          <Trash2
                            className="w-4 h-4"
                            style={{ filter: "drop-shadow(0 0 8px #ef4444)" }}
                          />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center px-6 py-12">
                    <div className="flex flex-col items-center gap-4">
                      <UsersIcon className="w-12 h-12 text-gray-600" />
                      <span className="text-gray-400 font-medium text-lg">
                        Пользователи не найдены
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ИСПРАВЛЕНО: Pagination с правильным API */}
      <Pagination 
        meta={meta}
        onPageChange={handlePageChange}
      />

      {/* Модальные окна */}
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