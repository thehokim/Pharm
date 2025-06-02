import React, { useState, useEffect } from "react";
import { Search, Plus, UsersIcon } from "lucide-react";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";
import DeleteUserModal from "./DeleteUserModal";
import ActionMenu from "../../../../components/layout/ActionMenu";
import { BASE_URL } from "../../../../utils/auth";

const ToggleSwitch = ({ checked, onChange }) => (
  <button
    onClick={onChange}
    className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${
      checked ? "bg-blue-500" : "bg-gray-300"
    }`}
  >
    <div
      className={`bg-white w-5 h-5 rounded-full transform transition-transform duration-300 ${
        checked ? "translate-x-5" : ""
      }`}
    />
  </button>
);

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const token = localStorage.getItem("token");

  const fetchUsers = () => {
    fetch(`${BASE_URL}/api/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) =>
        setUsers(
          data.map((user) => ({
            id: user.id,
            name: user.full_name,
            email: user.username,
            role: user.role,
            isActive: user.is_active,
            lastActive: new Date(user.created_at).toLocaleString(),
          }))
        )
      )
      .catch((err) => console.error("Ошибка загрузки пользователей:", err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = (form) => {
    fetch(`${BASE_URL}/api/users`, {
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
      .then(() => fetchUsers())
      .catch((err) => alert(err.message));
  };

  const handleEditSubmit = (form) => {
    if (!editingUser) return;
    fetch(`${BASE_URL}/api/users/${editingUser.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username: form.username,
        full_name: form.full_name,
        role: form.role,
        ...(form.password && { password: form.password }),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка при обновлении");
        return res.json();
      })
      .then(() => fetchUsers())
      .catch((err) => alert(err.message));
  };

  const handleConfirmDelete = () => {
    if (!deletingUser) return;
    fetch(`${BASE_URL}/api/users/${deletingUser.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ошибка при удалении пользователя");
        return res.json();
      })
      .then(() => {
        fetchUsers();
        setIsDeleteOpen(false);
      })
      .catch((err) => alert(err.message));
  };

  const toggleUserStatus = (index) => {
    // Только для UI — не сохраняется на сервере
    const updated = [...users];
    updated[index].isActive = !updated[index].isActive;
    setUsers(updated);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsEditOpen(true);
  };

  const handleDelete = (user) => {
    setDeletingUser(user);
    setIsDeleteOpen(true);
  };

  return (
    <div className="space-y-4 bg-gray-50">
      <div className="bg-white flex items-center p-4 rounded-xl justify-between">
        <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
          <UsersIcon /> Управление пользователями
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-black text-white px-3 py-3 rounded-full hover:bg-gray-900 transition"
          >
            <Plus size={16} />
          </button>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Поиск пользователя..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full focus:outline-none transition"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="text-sm font-semibold uppercase tracking-wide text-gray-600">
            <tr>
              <th className="px-6 py-4 bg-gray-100 rounded-tl-xl">Имя</th>
              <th className="px-6 py-4 bg-gray-100">Email</th>
              <th className="px-6 py-4 bg-gray-100">Роль</th>
              <th className="px-6 py-4 bg-gray-100">Статус</th>
              <th className="px-6 py-4 bg-gray-100">Последняя активность</th>
              <th className="px-6 py-4 bg-gray-100 rounded-tr-xl">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user, i) => (
              <tr key={user.id} className="hover:bg-indigo-50 transition-colors duration-150">
                <td className="px-6 py-4 font-medium">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.role}</td>
                <td className="px-6 py-4">
                  <ToggleSwitch checked={user.isActive} onChange={() => toggleUserStatus(i)} />
                </td>
                <td className="px-6 py-4">{user.lastActive}</td>
                <td className="px-6 py-4 flex justify-center mt-2">
                  <ActionMenu onEdit={() => handleEdit(user)} onDelete={() => handleDelete(user)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddUser} />
      <EditUserModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} userData={editingUser} onSubmit={handleEditSubmit} />
      <DeleteUserModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={handleConfirmDelete} user={deletingUser} />
    </div>
  );
};

export default Users;
