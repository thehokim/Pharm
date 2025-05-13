import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setUserRole } from "../utils/auth";
import { LogIn } from "lucide-react";

const Login = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    const roleMap = {
      admin: "admin",
      sales: "sales",
      accountant: "accountant",
      warehouse: "warehouse",
    };

    const role = roleMap[login.trim().toLowerCase()];
    if (role) {
      setUserRole(role);
      navigate(`/${role}`);
    } else {
      alert("Неверный логин. Введите: admin, sales, accountant или warehouse");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-100 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl w-full max-w-sm space-y-5"
      >
        <div className="flex justify-center items-center gap-2 mb-4">
          <LogIn className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-800">Вход в систему</h2>
        </div>

        <input
          type="text"
          placeholder="Логин (например: admin)"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition duration-200"
        >
          Войти
        </button>
        <p className="text-xs text-gray-500 text-center mt-2">
          Используйте логины: <b>admin</b>, <b>sales</b>, <b>accountant</b>, <b>warehouse</b>
        </p>
      </form>
    </div>
  );
};

export default Login;
