import React, { useEffect, useState } from "react";
import {
  CheckCircle, Info, AlertTriangle, XCircle, Loader2, Eye, EyeOff, Bell, Trash2, Calendar, MessageSquare
} from "lucide-react";
import { BASE_URL } from "../../../../utils/auth";
import { useTranslation } from "react-i18next";

// Неоновые иконки для типов уведомлений
const iconByType = {
  success: (
    <div className="relative">
      <div className="absolute inset-0 bg-green-400 rounded-full blur-md opacity-50 animate-pulse"></div>
      <CheckCircle className="relative text-green-400 w-6 h-6" 
                   style={{ filter: 'drop-shadow(0 0 10px #22c55e)' }} />
    </div>
  ),
  error: (
    <div className="relative">
      <div className="absolute inset-0 bg-red-400 rounded-full blur-md opacity-50 animate-pulse"></div>
      <XCircle className="relative text-red-400 w-6 h-6" 
               style={{ filter: 'drop-shadow(0 0 10px #ef4444)' }} />
    </div>
  ),
  warning: (
    <div className="relative">
      <div className="absolute inset-0 bg-yellow-400 rounded-full blur-md opacity-50 animate-pulse"></div>
      <AlertTriangle className="relative text-yellow-400 w-6 h-6" 
                     style={{ filter: 'drop-shadow(0 0 10px #eab308)' }} />
    </div>
  ),
  info: (
    <div className="relative">
      <div className="absolute inset-0 bg-blue-400 rounded-full blur-md opacity-50 animate-pulse"></div>
      <Info className="relative text-blue-400 w-6 h-6" 
             style={{ filter: 'drop-shadow(0 0 10px #3b82f6)' }} />
    </div>
  ),
};

const Notifications = () => {
  const { t } = useTranslation("home");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [readingId, setReadingId] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/notifications/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const sorted = [...data].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setNotifications(sorted);
    } catch (err) {
      console.error(t("notifications.loadError"), err);
    }
    setLoading(false);
  };

  // Пометить как прочитанное
  const markAsRead = async (id) => {
    setReadingId(id);
    try {
      await fetch(`${BASE_URL}/api/notifications/${id}/read/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        )
      );
    } catch (err) {
      alert(t("notifications.readError"));
    }
    setReadingId(null);
  };

  // Удалить уведомление
  const deleteNotification = async (id) => {
    setDeletingId(id);
    try {
      await fetch(`${BASE_URL}/api/notifications/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      alert(t("notifications.deleteError"));
    }
    setDeletingId(null);
  };

  // Получить цвет границы для типа уведомления
  const getBorderColor = (type) => {
    switch(type) {
      case 'success': return 'border-green-400/30';
      case 'error': return 'border-red-400/30';
      case 'warning': return 'border-yellow-400/30';
      case 'info': return 'border-blue-400/30';
      default: return 'border-cyan-400/30';
    }
  };

  // Получить цвет свечения для типа уведомления
  const getGlowColor = (type) => {
    switch(type) {
      case 'success': return '0 0 20px rgba(34, 197, 94, 0.3)';
      case 'error': return '0 0 20px rgba(239, 68, 68, 0.3)';
      case 'warning': return '0 0 20px rgba(234, 179, 8, 0.3)';
      case 'info': return '0 0 20px rgba(59, 130, 246, 0.3)';
      default: return '0 0 20px rgba(6, 182, 212, 0.3)';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black p-6 space-y-6">
      {/* Декоративные неоновые элементы */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/5 rounded-full blur-3xl"></div>

      {/* Header */}
      <div className="relative bg-gray-900/90 backdrop-blur-xl border-2 border-cyan-400/30 rounded-3xl p-6 overflow-hidden"
           style={{ boxShadow: '0 0 50px rgba(6, 182, 212, 0.2)' }}>
        {/* Неоновое свечение заголовка */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-transparent to-emerald-400/10"></div>
        
        <div className="relative flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-400 rounded-2xl blur-md opacity-50"></div>
            <div className="relative bg-gray-800 border-2 border-cyan-400 p-4 rounded-2xl">
              <div className="flex items-center gap-2">
                <Bell className="text-cyan-400 w-7 h-7"
                     style={{ filter: 'drop-shadow(0 0 10px #06b6d4)' }} />
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white"
                style={{ textShadow: '0 0 20px rgba(6, 182, 212, 0.5)' }}>
              {t("notifications.title")}
            </h1>
            <p className="text-cyan-400 text-sm mt-1">
              {t("notification_center")}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative bg-gray-900/90 backdrop-blur-xl border-2 border-gray-700/50 rounded-3xl p-8"
           style={{ boxShadow: '0 0 30px rgba(0, 0, 0, 0.5)' }}>
        
        {loading ? (
          <div className="flex flex-col items-center gap-6 py-12">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-400 rounded-full blur-xl opacity-50"></div>
              <Loader2 className="relative w-12 h-12 text-cyan-400 animate-spin" 
                       style={{ filter: 'drop-shadow(0 0 15px #06b6d4)' }} />
            </div>
            <span className="text-gray-400 text-lg font-medium">
              {t("notifications.loading")}
            </span>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-6 py-12">
            <div className="relative">
              <div className="absolute inset-0 bg-gray-400 rounded-full blur-xl opacity-30"></div>
              <Bell className="relative w-16 h-16 text-gray-600" />
            </div>
            <span className="text-gray-400 text-lg font-medium">
              {t("notifications.empty")}
            </span>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`
                  relative bg-gray-800/40 backdrop-blur-sm border-2 rounded-2xl p-6 transition-all duration-300 group hover:scale-[1.02]
                  ${n.is_read 
                    ? 'border-gray-600/50 hover:border-gray-500/70' 
                    : `${getBorderColor(n.type)} hover:border-opacity-60`
                  }
                `}
                style={{
                  boxShadow: n.is_read 
                    ? '0 0 15px rgba(0, 0, 0, 0.3)' 
                    : getGlowColor(n.type)
                }}
              >
                {/* Индикатор непрочитанного */}
                {!n.is_read && (
                  <div 
                    className="absolute left-0 top-6 bottom-6 w-1 rounded-r-full"
                    style={{
                      background: n.type === 'success' ? '#22c55e' : 
                                 n.type === 'error' ? '#ef4444' :
                                 n.type === 'warning' ? '#eab308' : '#3b82f6',
                      boxShadow: `0 0 10px ${n.type === 'success' ? '#22c55e' : 
                                             n.type === 'error' ? '#ef4444' :
                                             n.type === 'warning' ? '#eab308' : '#3b82f6'}`
                    }}
                  />
                )}

                <div className="flex items-start gap-4">
                  {/* Иконка типа */}
                  <div className="pt-1">
                    {iconByType[n.type] || iconByType.info}
                  </div>

                  {/* Основной контент */}
                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold text-lg mb-2 ${
                      n.is_read ? 'text-gray-300' : 'text-white'
                    }`}>
                      {n.title}
                    </div>
                    
                    <div className={`text-sm mb-3 leading-relaxed ${
                      n.is_read ? 'text-gray-400' : 'text-gray-200'
                    }`}>
                      {n.message}
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {new Date(n.created_at).toLocaleString()}
                    </div>
                  </div>

                  {/* Кнопки действий */}
                  <div className="flex flex-col gap-2 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                    
                    {/* Кнопка "Прочитать" */}
                    {!n.is_read && (
                      <button
                        title={t("notifications.markAsRead")}
                        className="p-2 rounded-xl bg-gray-700/50 border border-gray-600/50 text-gray-400 hover:border-cyan-400 hover:text-cyan-400 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => markAsRead(n.id)}
                        disabled={readingId === n.id}
                        style={{ 
                          boxShadow: readingId !== n.id ? '0 0 10px rgba(6, 182, 212, 0.2)' : 'none'
                        }}
                      >
                        {readingId === n.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Eye className="w-4 h-4" style={{ filter: 'drop-shadow(0 0 6px currentColor)' }} />
                        )}
                      </button>
                    )}

                    {/* Кнопка "Удалить" */}
                    <button
                      title={t("notifications.delete")}
                      className="p-2 rounded-xl bg-gray-700/50 border border-gray-600/50 text-gray-400 hover:border-red-400 hover:text-red-400 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => deleteNotification(n.id)}
                      disabled={deletingId === n.id}
                      style={{ 
                        boxShadow: deletingId !== n.id ? '0 0 10px rgba(239, 68, 68, 0.2)' : 'none'
                      }}
                    >
                      {deletingId === n.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" style={{ filter: 'drop-shadow(0 0 6px currentColor)' }} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Декоративный градиент снизу для непрочитанных */}
                {!n.is_read && (
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl opacity-50"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${
                        n.type === 'success' ? '#22c55e' : 
                        n.type === 'error' ? '#ef4444' :
                        n.type === 'warning' ? '#eab308' : '#3b82f6'
                      }, transparent)`
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes notificationSlideIn {
            from {
              opacity: 0;
              transform: translateX(-20px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateX(0) scale(1);
            }
          }
          
          .notification-enter {
            animation: notificationSlideIn 0.3s ease-out;
          }
        `
      }} />
    </div>
  );
};

export default Notifications;