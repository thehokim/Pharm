import React, { useState } from "react";
import { Search, Plus, MoreVertical, UsersIcon } from "lucide-react";
import AddUserModal from "./AddUserModal";
import ActionMenu from "../../../../components/layout/ActionMenu";
import EditUserModal from "./EditUserModal";
import DeleteUserModal from "./DeleteUserModal";

// Компонент переключателя
const ToggleSwitch = ({ checked, onChange }) => {
  return (
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
};

const initialUsers = [
  {
    name: "Джон Доу",
    email: "john.doe@example.com",
    role: "Администратор",
    isActive: true,
    lastActive: "Только что",
  },
  {
    name: "Джейн Смит",
    email: "jane.smith@example.com",
    role: "Менеджер по продажам",
    isActive: true,
    lastActive: "5 минут назад",
  },
  {
    name: "Роберт Джонсон",
    email: "robert.johnson@example.com",
    role: "Бухгалтер",
    isActive: false,
    lastActive: "2 часа назад",
  },
  {
    name: "Сара Уильямс",
    email: "sarah.williams@example.com",
    role: "Оператор склада",
    isActive: true,
    lastActive: "10 минут назад",
  },
  {
    name: "Майкл Браун",
    email: "michael.brown@example.com",
    role: "Менеджер по продажам",
    isActive: false,
    lastActive: "1 день назад",
  },
];

const Users = () => {
  const [users, setUsers] = useState(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const toggleUserStatus = (index) => {
    const updated = [...users];
    updated[index].isActive = !updated[index].isActive;
    setUsers(updated);
  };

  const handleAddUser = (newUser) => {
    console.log("Добавлен пользователь:", newUser);
    // Здесь можно отправить данные на сервер или добавить в локальный список
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsEditOpen(true);
  };

  const handleEditSubmit = (data) => {
    console.log("Изменён пользователь:", data);
    // обнови пользователя в списке или отправь PATCH на сервер
  };

  const handleDelete = (user) => {
    setDeletingUser(user);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    console.log("Удалён пользователь:", deletingUser);
    // здесь можешь удалить пользователя из списка или отправить DELETE-запрос
    setIsDeleteOpen(false);
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
              <tr
                key={i}
                className="hover:bg-indigo-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 font-medium">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.role}</td>
                <td className="px-6 py-4">
                  <ToggleSwitch
                    checked={user.isActive}
                    onChange={() => toggleUserStatus(i)}
                  />
                </td>
                <td className="px-6 py-4">{user.lastActive}</td>
                <td className="px-6 py-4 flex justify-center mt-2">
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

      <AddUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddUser}
      />
    </div>
  );
};

export default Users;
