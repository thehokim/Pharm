import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import { getUserRole, BASE_URL } from "./utils/auth";
import AdminRoutes from "./router/AdminRoutes";
import SalesRoutes from "./router/SalesRoutes";
import AccountantRoutes from "./router/AccountantRoutes";
import WarehouseRoutes from "./router/WarehouseRoutes";
import { useTranslation } from "react-i18next";
import "./i18n";

export default function App() {
  const [role, setRole] = useState(getUserRole());
  const [refresh, setRefresh] = useState(false);
  const location = useLocation();
  const { i18n } = useTranslation();

  // 1. Подгружаем язык из API настроек пользователя на старте
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${BASE_URL}/api/settings/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.ok ? res.json() : Promise.reject())
        .then((settings) => {
          // Только если реально пришёл язык — и он отличается!
          if (settings.language && i18n.language !== settings.language) {
            i18n.changeLanguage(settings.language);
          }
        })
        .catch(() => {
          setRefresh(r => !r);
        });
    }
  }, [i18n]);

  // 2. Следим за сменой маршрута и localStorage (для актуальности роли)
  useEffect(() => {
    setRole(getUserRole());

    const onStorageChange = () => setRole(getUserRole());
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={() => setRole(getUserRole())} />} />
      <Route path="/" element={<Navigate to={role ? `/${role}` : "/login"} />} />

      {role === "admin" && <Route path="/admin/*" element={<AdminRoutes />} />}
      {role === "sales" && <Route path="/sales/*" element={<SalesRoutes />} />}
      {role === "accountant" && <Route path="/accountant/*" element={<AccountantRoutes />} />}
      {role === "warehouse" && <Route path="/warehouse/*" element={<WarehouseRoutes />} />}
      {/* Если путь не найден — редирект на стартовую */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
