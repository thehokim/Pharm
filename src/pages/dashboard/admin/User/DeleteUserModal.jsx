import { X, AlertTriangle, Trash2, Shield, User } from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const DeleteUserModal = ({ isOpen, onClose, onConfirm, user }) => {
  const { t } = useTranslation("user");
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } catch (error) {
      console.error("Error deleting user:", error);
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

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
         onClick={handleBackdropClick}>
      
      <div className="relative bg-gray-900/95 backdrop-blur-xl border-2 border-red-400/30 rounded-3xl w-full max-w-md overflow-hidden"
           style={{ boxShadow: '0 0 50px rgba(239, 68, 68, 0.3)' }}>
        
        {/* Декоративные неоновые элементы */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-400/10 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-400/10 rounded-full blur-2xl translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10 p-8">
          {/* Кнопка закрытия */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-gray-800 border border-red-400/50 p-2 rounded-2xl transition-all duration-300 hover:border-red-400 hover:scale-110 group"
            style={{ boxShadow: '0 0 15px rgba(239, 68, 68, 0.2)' }}
          >
            <X className="w-5 h-5 text-red-400 group-hover:rotate-90 transition-transform duration-300" 
               style={{ filter: 'drop-shadow(0 0 8px #ef4444)' }} />
          </button>

          {/* Иконка предупреждения */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-400 rounded-full blur-2xl opacity-50 animate-pulse"></div>
              <div className="relative bg-red-900/30 border-2 border-red-400 p-6 rounded-full">
                <AlertTriangle className="text-red-400 w-12 h-12" 
                              style={{ filter: 'drop-shadow(0 0 15px #ef4444)' }} />
              </div>
            </div>
          </div>

          {/* Заголовок */}
          <h2 className="text-2xl font-bold text-white text-center mb-2"
              style={{ textShadow: '0 0 15px rgba(239, 68, 68, 0.5)' }}>
            {t("deleteTitle")}
          </h2>
          
          <p className="text-red-400 text-center text-sm mb-8">
            {t("critical_system_action")}
          </p>

          {/* Информация о пользователе */}
          <div className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gray-700 border border-red-400/30 p-2 rounded-xl">
                <User className="w-5 h-5 text-red-400" 
                      style={{ filter: 'drop-shadow(0 0 8px #ef4444)' }} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">{t("deleting_user")}</p>
                <p className="text-white font-semibold">
                  {user?.name || user?.full_name || t("user")}
                </p>
                {user?.role && (
                  <p className="text-red-400 text-sm">
                    Роль: {user.role}
                  </p>
                )}
              </div>
            </div>
            
            {/* Предупреждающий текст */}
            <div className="bg-red-900/20 border border-red-400/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" 
                              style={{ filter: 'drop-shadow(0 0 8px #ef4444)' }} />
                <div>
                  <p className="text-red-400 font-medium text-sm mb-2">
                    {t("attention_irreversible_action")}
                  </p>
                  <p className="text-gray-300 text-sm">
                    {t("deleteQuestion")} <strong className="text-red-400">{user?.name || user?.full_name || t("user")}</strong>? 
                    Все данные пользователя будут удалены без возможности восстановления.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex gap-4">
            {/* Кнопка отмены */}
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 bg-gray-800/50 border border-gray-600/50 text-gray-300 font-medium px-6 py-4 rounded-2xl transition-all duration-300 hover:border-gray-500 hover:bg-gray-800/70 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Shield className="w-5 h-5" />
              {t("cancel")}
            </button>
            
            {/* Кнопка удаления */}
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="flex-1 relative bg-gradient-to-r from-red-500 to-red-600 text-white font-bold px-6 py-4 rounded-2xl transition-all duration-300 hover:from-red-600 hover:to-red-700 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
              style={{ 
                boxShadow: '0 0 30px rgba(239, 68, 68, 0.3)',
                filter: isLoading ? 'none' : 'drop-shadow(0 0 15px rgba(239, 68, 68, 0.5))'
              }}
            >
              {/* Анимированный фон */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Удаление...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-5 h-5" />
                    <span>{t("deleting")}</span>
                  </>
                )}
              </div>
            </button>
          </div>

          {/* Дополнительное предупреждение */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-xs">
              {t("data_will_be_deleted")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;