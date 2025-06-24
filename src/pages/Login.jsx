import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { setUserRole, setToken, BASE_URL } from "../utils/auth";

const Login = () => {
  const [username, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASE_URL}/api/auth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Неверный логин или пароль");
      }

      const data = await response.json();
      const { access_token, role } = data;

      setToken(access_token);
      setUserRole(role);

      switch (role) {
        case "admin":
        case "sales":
        case "accountant":
        case "warehouse":
          navigate(`/${role}`);
          break;
        default:
          alert("Неизвестная роль");
      }
    } catch (error) {
      alert(error.message || "Ошибка входа");
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
          placeholder="Логин"
          value={username}
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
      </form>
    </div>
  );
};

export default Login;
