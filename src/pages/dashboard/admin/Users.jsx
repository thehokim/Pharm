import React from "react";
import { Search, Plus, MoreVertical } from "lucide-react";

const users = [
  {
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Administrator",
    status: "Active",
    lastActive: "Just now",
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Sales Manager",
    status: "Active",
    lastActive: "5 minutes ago",
  },
  {
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    role: "Accountant",
    status: "Inactive",
    lastActive: "2 hours ago",
  },
  {
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    role: "Warehouse Operator",
    status: "Active",
    lastActive: "10 minutes ago",
  },
  {
    name: "Michael Brown",
    email: "michael.brown@example.com",
    role: "Sales Manager",
    status: "Inactive",
    lastActive: "1 day ago",
  },
];

const Users = () => {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Users Management</h2>
        <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded shadow hover:bg-gray-900">
          <Plus size={16} />
          Add User
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search users..."
          className="pl-10 pr-4 py-2 border rounded w-full focus:outline-none focus:ring focus:ring-blue-200"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="border-b bg-gray-50 text-gray-700">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Last Active</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user.status === "Active"
                        ? "bg-black text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-2">{user.lastActive}</td>
                <td className="px-4 py-2">
                  <MoreVertical size={18} className="text-gray-500 cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
