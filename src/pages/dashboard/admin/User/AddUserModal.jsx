import { X, ChevronDown, UserPlus, User, Shield, Lock, CheckCircle, Users, Activity, Briefcase, Database, Camera } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

const AddUserModal = ({ isOpen, onClose, onSubmit }) => {
  const { t } = useTranslation("user");
  const [form, setForm] = useState({
    username: "",
    full_name: "",
    role: "",
    password: "",
    confirmPassword: "",
  });
  const [roleOpen, setRoleOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const roleRef = useRef(null);

  // Роли c переводом и иконками
  const roles = [
    { 
      value: "admin", 
      label: t("admin"), 
      icon: Shield, 
      color: "text-red-400",
      bg: "bg-red-900/20",
      border: "border-red-400/30",
      glow: "#ef4444"
    },
    { 
      value: "sales", 
      label: t("sales"), 
      icon: Users, 
      color: "text-cyan-400",
      bg: "bg-cyan-900/20",
      border: "border-cyan-400/30",
      glow: "#06b6d4"
    },
    { 
      value: "accountant", 
      label: t("accountant"), 
      icon: Activity, 
      color: "text-emerald-400",
      bg: "bg-emerald-900/20",
      border: "border-emerald-400/30",
      glow: "#10b981"
    },
    { 
      value: "warehouse", 
      label: t("warehouse"), 
      icon: Database, 
      color: "text-amber-400",
      bg: "bg-amber-900/20",
      border: "border-amber-400/30",
      glow: "#f59e0b"
    },
    { 
      value: "media", 
      label: t("media"), 
      icon: Camera, 
      color: "text-purple-400",
      bg: "bg-purple-900/20",
      border: "border-purple-400/30",
      glow: "#a855f7"
    },
  ];

  useEffect(() => {
    if (!isOpen) {
      setForm({
        username: "",
        full_name: "",
        role: "",
        password: "",
        confirmPassword: "",
      });
      setRoleOpen(false);
    }
  }, [isOpen]);

  // Закрытие dropdown при клике вне
  useEffect(() => {
    if (!roleOpen) return;
    const handleClick = (e) => {
      if (roleRef.current && !roleRef.current.contains(e.target)) {
        setRoleOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [roleOpen]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRoleSelect = (value) => {
    setForm((prev) => ({ ...prev, role: value }));
    setRoleOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert(t("passwordsNotMatch"));
      return;
    }
    
    setIsLoading(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (error) {
      console.error("Error adding user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const selectedRole = roles.find((r) => r.value === form.role);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
         onClick={handleBackdropClick}>
      
      <div className="relative bg-gray-900/95 backdrop-blur-xl border-2 border-emerald-400/30 rounded-3xl w-full max-w-2xl overflow-hidden"
           style={{ boxShadow: '0 0 50px rgba(16, 185, 129, 0.3)' }}>
        
        {/* Декоративные неоновые элементы */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-400/10 rounded-full blur-2xl translate-y-12 -translate-x-12"></div>
        
        {/* Заголовок */}
        <div className="relative bg-gray-800/50 border-b border-gray-700/50 px-8 py-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-400 rounded-2xl blur-md opacity-50"></div>
                <div className="relative bg-gray-800 border-2 border-emerald-400 p-3 rounded-2xl">
                  <UserPlus className="text-emerald-400 w-6 h-6" 
                           style={{ filter: 'drop-shadow(0 0 10px #10b981)' }} />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white"
                    style={{ textShadow: '0 0 15px rgba(16, 185, 129, 0.5)' }}>
                  {t("addTitle")}
                </h2>
                <p className="text-emerald-400 text-sm mt-1">
                  {t("register_new_employee")}
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="bg-gray-800 border border-red-400/50 p-3 rounded-2xl transition-all duration-300 hover:border-red-400 hover:scale-110 group"
              style={{ boxShadow: '0 0 15px rgba(239, 68, 68, 0.2)' }}
            >
              <X className="w-6 h-6 text-red-400 group-hover:rotate-90 transition-transform duration-300" 
                 style={{ filter: 'drop-shadow(0 0 8px #ef4444)' }} />
            </button>
          </div>
        </div>
        
        {/* Содержимое формы */}
        <div className="px-8 py-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Логин */}
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-3">
                <User className="inline w-4 h-4 mr-2 text-cyan-400" 
                      style={{ filter: 'drop-shadow(0 0 8px #06b6d4)' }} />
                {t("login")}
              </label>
              <input
                name="username"
                placeholder={t("placeholder_login")}
                value={form.username}
                onChange={handleChange}
                required
                className="w-full bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-500 px-4 py-4 rounded-2xl focus:border-cyan-400 focus:outline-none transition-all duration-300"
                style={{ 
                  boxShadow: form.username ? '0 0 15px rgba(6, 182, 212, 0.2)' : 'none'
                }}
              />
            </div>

            {/* ФИО */}
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-3">
                <User className="inline w-4 h-4 mr-2 text-emerald-400" 
                      style={{ filter: 'drop-shadow(0 0 8px #10b981)' }} />
                {t("fio")}
              </label>
              <input
                name="full_name"
                placeholder={t("placeholder_full_name")}
                value={form.full_name}
                onChange={handleChange}
                required
                className="w-full bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-500 px-4 py-4 rounded-2xl focus:border-emerald-400 focus:outline-none transition-all duration-300"
                style={{ 
                  boxShadow: form.full_name ? '0 0 15px rgba(16, 185, 129, 0.2)' : 'none'
                }}
              />
            </div>

            {/* Роль */}
            <div className="md:col-span-2 relative" ref={roleRef}>
              <label className="block text-gray-400 text-sm font-medium mb-3">
                <Shield className="inline w-4 h-4 mr-2 text-purple-400" 
                        style={{ filter: 'drop-shadow(0 0 8px #a855f7)' }} />
                {t("chooseRole")}
              </label>
              <button
                type="button"
                onClick={() => setRoleOpen((v) => !v)}
                className={`w-full bg-gray-800/50 border border-gray-600/50 text-white px-4 py-4 rounded-2xl focus:border-purple-400 focus:outline-none transition-all duration-300 flex items-center justify-between group ${
                  !selectedRole ? "text-gray-500" : ""
                }`}
                style={{ 
                  boxShadow: selectedRole ? `0 0 15px ${selectedRole.glow}20` : 'none'
                }}
              >
                <div className="flex items-center gap-3">
                  {selectedRole && (
                    <selectedRole.icon className={`w-4 h-4 ${selectedRole.color}`} 
                                      style={{ filter: `drop-shadow(0 0 8px ${selectedRole.glow})` }} />
                  )}
                  <span className="font-medium">
                    {selectedRole ? selectedRole.label : t("select_role_placeholder")}
                  </span>
                </div>
                <ChevronDown className="text-gray-400 group-hover:text-white transition-colors" />
              </button>
              
              {roleOpen && (
                <div className="absolute z-30 top-full mt-2 left-0 bg-gray-800/95 backdrop-blur-xl border border-gray-600/50 rounded-2xl w-full shadow-2xl py-2 max-h-52 overflow-y-auto"
                     style={{ boxShadow: '0 0 30px rgba(168, 85, 247, 0.2)' }}>
                  {roles.map((role) => {
                    const IconComponent = role.icon;
                    return (
                      <button
                        key={role.value}
                        type="button"
                        className={`w-full px-4 py-3 text-left hover:bg-gray-700/50 transition-all duration-300 flex items-center gap-3 ${
                          form.role === role.value ? role.bg : ''
                        }`}
                        onClick={() => handleRoleSelect(role.value)}
                      >
                        <IconComponent className={`w-4 h-4 ${role.color}`} 
                                      style={{ filter: `drop-shadow(0 0 8px ${role.glow})` }} />
                        <span className={`font-medium ${role.color}`}>
                          {role.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Пароль */}
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-3">
                <Lock className="inline w-4 h-4 mr-2 text-red-400" 
                      style={{ filter: 'drop-shadow(0 0 8px #ef4444)' }} />
                {t("password")}
              </label>
              <input
                name="password"
                type="password"
                placeholder={t("placeholder_password")}
                value={form.password}
                onChange={handleChange}
                required
                className="w-full bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-500 px-4 py-4 rounded-2xl focus:border-red-400 focus:outline-none transition-all duration-300"
                style={{ 
                  boxShadow: form.password ? '0 0 15px rgba(239, 68, 68, 0.2)' : 'none'
                }}
              />
            </div>

            {/* Подтверждение пароля */}
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-3">
                <CheckCircle className="inline w-4 h-4 mr-2 text-amber-400" 
                             style={{ filter: 'drop-shadow(0 0 8px #f59e0b)' }} />
                {t("repeatPassword")}
              </label>
              <input
                name="confirmPassword"
                type="password"
                placeholder={t("placeholder_repeat_password")}
                value={form.confirmPassword}
                onChange={handleChange}
                required
                className="w-full bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-500 px-4 py-4 rounded-2xl focus:border-amber-400 focus:outline-none transition-all duration-300"
                style={{ 
                  boxShadow: form.confirmPassword ? '0 0 15px rgba(245, 158, 11, 0.2)' : 'none'
                }}
              />
            </div>
          </div>

          {/* Предупреждение о пароле */}
          {form.password && form.confirmPassword && form.password !== form.confirmPassword && (
            <div className="mt-6 p-4 bg-red-900/20 border border-red-400/30 rounded-2xl">
              <div className="flex items-center gap-3">
                <X className="w-5 h-5 text-red-400" 
                   style={{ filter: 'drop-shadow(0 0 8px #ef4444)' }} />
                <p className="text-red-400 text-sm">
                  Пароли не совпадают
                </p>
              </div>
            </div>
          )}

          {/* Кнопка создания */}
          <button
            onClick={handleSubmit}
            disabled={isLoading || form.password !== form.confirmPassword}
            className="w-full mt-8 relative bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:from-emerald-600 hover:to-cyan-600 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
            style={{ 
              boxShadow: '0 0 30px rgba(16, 185, 129, 0.3)',
              filter: isLoading ? 'none' : 'drop-shadow(0 0 15px rgba(16, 185, 129, 0.5))'
            }}
          >
            {/* Анимированный фон */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative flex items-center justify-center gap-3">
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Создание...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>{t("add")}</span>
                </>
              )}
            </div>
          </button>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.2s ease-out;
          }
        `
      }} />
    </div>
  );
};

export default AddUserModal;