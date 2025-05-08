import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setUserRole } from '../utils/auth'

export default function Login() {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()

    // Простой механизм: логин задаёт роль
    const roleMap = {
      admin: 'admin',
      sales: 'sales',
      accountant: 'accountant',
      warehouse: 'warehouse',
    }

    const role = roleMap[login]
    if (role) {
      setUserRole(role)
      navigate(`/${role}`)
    } else {
      alert('Неверный логин')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-80"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Вход</h2>
        <input
          type="text"
          placeholder="Логин"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded"
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Войти
        </button>
      </form>
    </div>
  )
}
