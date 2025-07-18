import React, { useState } from "react";
import { Trash2, Edit3, Users, X, Check, AlertTriangle, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { BASE_URL } from "../../../../utils/auth";

const EditManagersModal = ({ managers = [], onClose, onSave }) => {
  const { t } = useTranslation("home");
  const [editedManagers, setEditedManagers] = useState(managers);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState(null);
  const token = localStorage.getItem("token");

  const handleChange = (index, value) => {
    const updated = [...editedManagers];
    updated[index].fullName = value;
    setEditedManagers(updated);
  };

  const handleDelete = async (index) => {
    const manager = editedManagers[index];
    setDeletingIndex(index);
    
    try {
      const res = await fetch(`${BASE_URL}/api/users/${manager.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) throw new Error("delete");
      
      const updated = [...editedManagers];
      updated.splice(index, 1);
      setEditedManagers(updated);
    } catch (err) {
      alert(t("editManagers.deleteError", { message: err.message }));
    } finally {
      setDeletingIndex(null);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      for (const manager of editedManagers) {
        await fetch(`${BASE_URL}/api/users/${manager.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ full_name: manager.fullName }),
        });
      }
      
      if (onSave) onSave(editedManagers);
      onClose();
    } catch (err) {
      alert(t("editManagers.saveError", { message: err.message }));
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
      
      <div className="relative bg-gray-900/95 backdrop-blur-xl border-2 border-cyan-400/30 rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-hidden"
           style={{ boxShadow: '0 0 50px #06b6d430, 0 0 100px #06b6d420' }}>
        
        {/* Декоративные неоновые элементы */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-400/10 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-400/10 rounded-full blur-2xl translate-y-12 -translate-x-12"></div>
        
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
              <div className="absolute inset-0 bg-cyan-400 rounded-2xl blur-md opacity-50"></div>
              <div className="relative bg-gray-800 border-2 border-cyan-400 p-4 rounded-2xl">
                <div className="flex items-center gap-2">
                  <Edit3 className="text-cyan-400 w-6 h-6" 
                         style={{ filter: 'drop-shadow(0 0 10px #06b6d4)' }} />
                  <Users className="text-purple-400 w-5 h-5" 
                         style={{ filter: 'drop-shadow(0 0 8px #a855f7)' }} />
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white"
                  style={{ textShadow: '0 0 15px #06b6d450' }}>
                {t("editManagers.title")}
              </h2>
              <p className="text-cyan-400 text-sm mt-1">
                {t("team_management")}
              </p>
            </div>
          </div>

          {/* Список менеджеров */}
          <div className="max-h-[50vh] overflow-y-auto space-y-4 pr-2"
               style={{ 
                 scrollbarWidth: 'thin',
                 scrollbarColor: '#06b6d4 #374151'
               }}>
            
            {editedManagers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">{t("no_managers_to_edit")}</p>
              </div>
            ) : (
              editedManagers.map((manager, index) => (
                <div key={index} 
                     className="relative bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 transition-all duration-300 hover:border-cyan-400/30 hover:bg-gray-800/60 group"
                     style={{ boxShadow: '0 0 0 1px #06b6d420' }}>
                  
                  {/* Индикатор активности */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 rounded-l-2xl transition-all duration-300 group-hover:w-2"
                       style={{ boxShadow: '0 0 10px #06b6d4' }}></div>
                  
                  <div className="flex items-center gap-4 ml-3">
                    {/* Иконка пользователя */}
                    <div className="relative">
                      <div className="bg-gray-700 border border-cyan-400/30 p-3 rounded-2xl">
                        <User className="w-5 h-5 text-cyan-400" 
                              style={{ filter: 'drop-shadow(0 0 8px #06b6d4)' }} />
                      </div>
                    </div>
                    
                    {/* Поле ввода */}
                    <div className="flex-1">
                      <input
                        type="text"
                        value={manager.fullName}
                        onChange={(e) => handleChange(index, e.target.value)}
                        placeholder={t("editManagers.placeholder")}
                        className="w-full bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-500 px-4 py-3 rounded-2xl focus:border-cyan-400 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                        style={{ 
                          boxShadow: manager.fullName ? '0 0 15px #06b6d420' : 'none'
                        }}
                      />
                    </div>
                    
                    {/* Кнопка удаления */}
                    <button
                      onClick={() => handleDelete(index)}
                      disabled={deletingIndex === index}
                      className="relative bg-gray-800 border border-red-400/50 p-3 rounded-2xl transition-all duration-300 hover:border-red-400 hover:scale-110 hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed group/delete"
                      title={t("editManagers.delete")}
                      style={{ boxShadow: '0 0 15px #ef444420' }}
                    >
                      {deletingIndex === index ? (
                        <div className="w-5 h-5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin"></div>
                      ) : (
                        <Trash2 className="w-5 h-5 text-red-400 group-hover/delete:scale-110 transition-transform duration-300" 
                                style={{ filter: 'drop-shadow(0 0 8px #ef4444)' }} />
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Предупреждение */}
          {editedManagers.length > 0 && (
            <div className="mt-6 p-4 bg-amber-900/20 border border-amber-400/30 rounded-2xl">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400" 
                              style={{ filter: 'drop-shadow(0 0 8px #f59e0b)' }} />
                <p className="text-amber-400 text-sm">
                  {t("changes_will_be_saved")}
                </p>
              </div>
            </div>
          )}

          {/* Кнопки */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 bg-gray-800/50 border border-gray-600/50 text-gray-300 font-medium px-6 py-4 rounded-2xl transition-all duration-300 hover:border-gray-500 hover:bg-gray-800/70 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("editManagers.cancel")}
            </button>
            
            <button
              onClick={handleSave}
              disabled={isLoading || editedManagers.length === 0}
              className="flex-1 relative bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-bold px-6 py-4 rounded-2xl transition-all duration-300 hover:from-cyan-600 hover:to-purple-600 hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden group"
              style={{ 
                boxShadow: '0 0 20px #06b6d430',
                filter: isLoading ? 'none' : 'drop-shadow(0 0 15px #06b6d450)'
              }}
            >
              {/* Анимированный фон */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>{t("saving_edit")}</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>{t("editManagers.save")}</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Кастомный скроллбар */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: #374151;
          border-radius: 10px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: #06b6d4;
          border-radius: 10px;
          box-shadow: 0 0 10px #06b6d4;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: #0891b2;
        }
      `}</style>
    </div>
  );
};

export default EditManagersModal;