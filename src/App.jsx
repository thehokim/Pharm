import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import { getUserRole } from './utils/auth'
import AdminRoutes from './router/AdminRoutes'
import SalesRoutes from './router/SalesRoutes'
import AccountantRoutes from './router/AccountantRoutes'
import WarehouseRoutes from './router/WarehouseRoutes'

export default function App() {
  const role = getUserRole()

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />

      {role === 'admin' && <Route path="/admin/*" element={<AdminRoutes />} />}
      {role === 'sales' && <Route path="/sales/*" element={<SalesRoutes />} />}
      {role === 'accountant' && (
        <Route path="/accountant/*" element={<AccountantRoutes />} />
      )}
      {role === 'warehouse' && (
        <Route path="/warehouse/*" element={<WarehouseRoutes />} />
      )}
    </Routes>
  )
}
