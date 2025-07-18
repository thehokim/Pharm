import React, { useState } from "react";
import { UserPlus, User, Lock, Badge, X, Check, AlertTriangle } from "lucide-react";
import { BASE_URL } from "../../../../utils/auth";
import { useTranslation } from "react-i18next";

const AddManagerModal = ({ onClose, onAdd }) => {
  const { t } = useTranslation("home");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleSave = async () => {
    if (!fullName.trim() || !username.trim() || !password.trim()) {
      alert(t("addManagerModal.fillAll"));
      return;
    }

    setIsLoading(true);
    const newManager = {
      full_name: fullName,
      username,
      role: "sales",
      password,
    };

    try {
      const res = await fetch(`${BASE_URL}/api/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newManager),
      });
      
      if (!res.ok) throw new Error(t("addManagerModal.error"));
      
      const data = await res.json();
      if (onAdd) onAdd({ fullName: data.full_name, profit: 0 });
      onClose();
    } catch (err) {
      alert(t("addManagerModal.error") + ": " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
         onClick={handleBackdropClick}>
      
      <div className="relative bg-gray-900/95 backdrop-blur-xl border-2 border-emerald-400/30 rounded-3xl p-8 w-full max-w-lg overflow-hidden"
           style={{ boxShadow: '0 0 50px #10b98130, 0 0 100px #10b98120' }}>
        
        {/* Декоративные неоновые элементы */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-400/10 rounded-full blur-2xl translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10">
          {/* Кнопка закрытия */}
          <button
            onClick={onClose}
            className="absolute top-0 right-0 bg-gray-800 border border-red-400/50 p-2 rounded-2xl transition-all duration-300 hover:border-red-400 hover:scale-110 group"
            style={{ boxShadow: '0 0 15px #ef444420' }}
          >
            <X className="w-5 h-5 text-red-400 group-hover:rotate-90 transition-transform duration-300" 
               style={{ filter: 'drop-shadow(0 0 8px #ef4444)' }} />
          </button>

          {/* Заголовок с фармацевтическими иконками */}
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-400 rounded-2xl blur-md opacity-50"></div>
              <div className="relative bg-gray-800 border-2 border-emerald-400 p-4 rounded-2xl">
                <div className="flex items-center gap-2">
                  <UserPlus className="text-emerald-400 w-6 h-6" 
                            style={{ filter: 'drop-shadow(0 0 10px #10b981)' }} />
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white"
                  style={{ textShadow: '0 0 15px #10b98150' }}>
                {t("addManagerModal.title")}
              </h2>
              <p className="text-emerald-400 text-sm mt-1">
                {t("new_specialist_registration")}
              </p>
            </div>
          </div>

          {/* Поля ввода */}
          <div className="space-y-6">
            {/* Полное имя */}
            <div className="relative">
              <label className="block text-gray-400 text-sm font-medium mb-2">
                {t("addManagerModal.fullName")}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <User className="w-5 h-5 text-emerald-400" 
                        style={{ filter: 'drop-shadow(0 0 8px #10b981)' }} />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t("enter_full_name")}
                  className="w-full bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-500 px-12 py-4 rounded-2xl focus:border-emerald-400 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                  style={{ 
                    boxShadow: fullName ? '0 0 15px #10b98120' : 'none'
                  }}
                />
              </div>
            </div>

            {/* Имя пользователя */}
            <div className="relative">
              <label className="block text-gray-400 text-sm font-medium mb-2">
                {t("addManagerModal.username")}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Badge className="w-5 h-5 text-cyan-400" 
                         style={{ filter: 'drop-shadow(0 0 8px #06b6d4)' }} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t("enter_username")}
                  className="w-full bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-500 px-12 py-4 rounded-2xl focus:border-cyan-400 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                  style={{ 
                    boxShadow: username ? '0 0 15px #06b6d420' : 'none'
                  }}
                />
              </div>
            </div>

            {/* Пароль */}
            <div className="relative">
              <label className="block text-gray-400 text-sm font-medium mb-2">
                {t("addManagerModal.password")}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Lock className="w-5 h-5 text-purple-400" 
                        style={{ filter: 'drop-shadow(0 0 8px #a855f7)' }} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("enter_password")}
                  className="w-full bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-500 px-12 py-4 rounded-2xl focus:border-purple-400 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                  style={{ 
                    boxShadow: password ? '0 0 15px #a855f720' : 'none'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Предупреждение */}
          <div className="mt-6 p-4 bg-amber-900/20 border border-amber-400/30 rounded-2xl">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400" 
                            style={{ filter: 'drop-shadow(0 0 8px #f59e0b)' }} />
              <p className="text-amber-400 text-sm">
                {t("ensure_data_correct")}
              </p>
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 bg-gray-800/50 border border-gray-600/50 text-gray-300 font-medium px-6 py-4 rounded-2xl transition-all duration-300 hover:border-gray-500 hover:bg-gray-800/70 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("addManagerModal.cancel")}
            </button>
            
            <button
              onClick={handleSave}
              disabled={isLoading || !fullName.trim() || !username.trim() || !password.trim()}
              className="flex-1 relative bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold px-6 py-4 rounded-2xl transition-all duration-300 hover:from-emerald-600 hover:to-cyan-600 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden group"
              style={{ 
                boxShadow: '0 0 20px #10b98130',
                filter: isLoading ? 'none' : 'drop-shadow(0 0 15px #10b98150)'
              }}
            >
              {/* Анимированный фон */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>{t("saving")}</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>{t("addManagerModal.save")}</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddManagerModal;