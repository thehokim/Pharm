import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  ClipboardList,
  FileSearch,
  Settings,
  UserCog,
  BookOpen,
  Heart,
  Bell,
  BarChart3,
  Activity,
  Circle,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";

// Меню с фармацевтической тематикой
const menu = [
  { labelKey: "dashboard", icon: LayoutDashboard, to: "", color: "#10b981" },
  { labelKey: "booking", icon: BookOpen, to: "booking", color: "#06b6d4" },
  { labelKey: "users", icon: Users, to: "users", color: "#8b5cf6" },
  { labelKey: "analytics", icon: BarChart3, to: "analytics", color: "#f59e0b" },
  { labelKey: "products", icon: Package, to: "products", color: "#06b6d4" },
  { labelKey: "clients", icon: UserCog, to: "clients", color: "#8b5cf6" },
  { labelKey: "suppliers", icon: ClipboardList, to: "suppliers", color: "#10b981" },
  { labelKey: "orders", icon: ShoppingCart, to: "orders", color: "#f59e0b" },
  { labelKey: "logs", icon: FileSearch, to: "logs", color: "#6b7280" },
  { labelKey: "notifications", icon: Bell, to: "notifications", color: "#ef4444" },
  { labelKey: "settings", icon: Settings, to: "settings", color: "#6b7280" },
];

const Sidebar = ({ isOpen = true, onToggle }) => {
  const { t } = useTranslation("sidebar");
  const location = useLocation();

  const isActiveRoute = (routeTo) => {
    if (routeTo === "") {
      return location.pathname === "/admin" || location.pathname === "/admin/";
    }
    return location.pathname.includes(routeTo);
  };

  return (
    <>
      {/* Основной контейнер сайдбара */}
      <div className="relative">
        <aside 
          className={`h-screen bg-gray-900 border-r-2 border-emerald-400/20 fixed top-0 left-0 overflow-y-auto overflow-x-hidden shadow-2xl transition-all duration-300 ${
            isOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full"
          }`}
          style={{ 
            boxShadow: '0 0 50px rgba(16, 185, 129, 0.2), 4px 0 30px rgba(16, 185, 129, 0.15)',
            background: 'linear-gradient(180deg, rgba(17, 24, 39, 0.95), rgba(31, 41, 55, 0.95))',
            zIndex: 1000,
            direction: 'rtl' // Изменяем направление для перемещения скроллбара влево
          }}
        >
          
          {/* Внутренний контейнер для возврата правильного направления текста */}
          <div style={{ direction: 'ltr', height: '100%' }}>
            
            {/* Декоративные неоновые элементы */}
            <div 
              className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl"
              style={{ 
                background: 'rgba(16, 185, 129, 0.1)',
                transform: 'translate(4rem, -4rem)',
                pointerEvents: 'none',
                zIndex: 1
              }}
            />
            <div 
              className="absolute bottom-0 left-0 w-24 h-24 rounded-full blur-2xl"
              style={{ 
                background: 'rgba(6, 182, 212, 0.1)',
                transform: 'translate(-3rem, 3rem)',
                pointerEvents: 'none',
                zIndex: 1
              }}
            />
            
            {/* Заголовок компании */}
            <div className="relative p-6 border-b border-gray-700/50 overflow-hidden" style={{ zIndex: 100 }}>
              <div 
                className="absolute inset-0"
                style={{ 
                  background: 'linear-gradient(to right, rgba(16, 185, 129, 0.1), transparent, rgba(6, 182, 212, 0.1))',
                  pointerEvents: 'none',
                  zIndex: 1
                }}
              />
              
              <div className="relative flex items-center justify-center gap-3" style={{ zIndex: 2 }}>
                <div className="relative">
                  <div 
                    className="absolute inset-0 rounded-full blur-md"
                    style={{ 
                      background: '#10b981',
                      opacity: 0.6,
                      pointerEvents: 'none'
                    }}
                  />
                  <div className="relative bg-gray-800 border-2 border-emerald-400 p-3 rounded-full">
                    <div className="flex items-center gap-1">
                      <Heart 
                        className="text-emerald-400 w-5 h-5" 
                        style={{ filter: 'drop-shadow(0 0 10px #10b981)' }} 
                      />
                      <Circle 
                        className="text-cyan-400 w-4 h-4" 
                        style={{ filter: 'drop-shadow(0 0 8px #06b6d4)' }} 
                      />
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <h1 
                    className="text-xl font-bold text-white"
                    style={{ textShadow: '0 0 15px rgba(16, 185, 129, 0.5)' }}
                  >
                    {t("companyName")}
                  </h1>
                  <p className="text-emerald-400 text-xs mt-1 flex items-center justify-center gap-1">
                    <Zap className="w-3 h-3" />
                    <span>Pharma System</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Навигационное меню */}
            <nav className="flex flex-col gap-2 px-4 py-6" style={{ position: 'relative', zIndex: 200 }}>
              {menu.map((item, index) => {
                const IconComponent = item.icon;
                const isActive = isActiveRoute(item.to);
                
                return (
                  <NavLink
                    key={index}
                    to={`/admin/${item.to}`}
                    className={`relative flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 text-sm group overflow-hidden ${
                      isActive
                        ? "font-semibold text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800/40"
                    }`}
                    style={{
                      background: isActive 
                        ? `linear-gradient(135deg, rgba(31, 41, 55, 0.8), rgba(17, 24, 39, 0.9))` 
                        : 'transparent',
                      border: isActive ? `1px solid ${item.color}40` : '1px solid transparent',
                      boxShadow: isActive 
                        ? `0 0 25px ${item.color}25, inset 0 0 25px ${item.color}15, 0 0 50px ${item.color}10` 
                        : 'none',
                      position: 'relative',
                      zIndex: 10,
                      pointerEvents: 'auto',
                      cursor: 'pointer'
                    }}
                    end={item.to === ""}
                  >
                    {/* Неоновая полоска активного элемента */}
                    <div 
                      className="absolute left-0 top-0 bottom-0 transition-all duration-300"
                      style={{ 
                        width: isActive ? '4px' : '0px',
                        background: isActive 
                          ? `linear-gradient(to bottom, ${item.color}, ${item.color}80, ${item.color})` 
                          : 'transparent',
                        borderRadius: '0 8px 8px 0',
                        boxShadow: isActive 
                          ? `0 0 15px ${item.color}, 0 0 30px ${item.color}50` 
                          : 'none',
                        pointerEvents: 'none'
                      }}
                    />
                    
                    {/* Дополнительное свечение края при активном состоянии */}
                    {isActive && (
                      <div 
                        className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full opacity-60 animate-pulse"
                        style={{ 
                          backgroundColor: item.color,
                          boxShadow: `0 0 20px ${item.color}`,
                          pointerEvents: 'none'
                        }}
                      />
                    )}

                    {/* Фоновое свечение при hover */}
                    <div 
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"
                      style={{ 
                        background: isActive 
                          ? 'transparent'
                          : `radial-gradient(circle at 20% center, ${item.color}20, ${item.color}10, transparent 60%)`,
                        pointerEvents: 'none'
                      }}
                    />
                    
                    <div className="flex items-center gap-4 w-full" style={{ position: 'relative', zIndex: 2 }}>
                      {/* Иконка с неоновым эффектом */}
                      <div className="relative flex-shrink-0">
                        <div 
                          className={`absolute inset-0 blur-md transition-opacity duration-300 ${
                            isActive ? 'opacity-60' : 'opacity-0 group-hover:opacity-40'
                          }`}
                          style={{ 
                            backgroundColor: item.color,
                            pointerEvents: 'none'
                          }}
                        />
                        <div 
                          className="relative transition-all duration-300 group-hover:scale-110"
                          style={{ 
                            color: isActive ? '#ffffff' : item.color,
                            filter: isActive 
                              ? `drop-shadow(0 0 12px ${item.color}) drop-shadow(0 0 20px ${item.color}50)` 
                              : `drop-shadow(0 0 8px ${item.color}50)`
                          }}
                        >
                          <IconComponent size={18} />
                        </div>
                      </div>
                      
                      {/* Текст меню */}
                      <span 
                        className="font-medium transition-all duration-300 group-hover:tracking-wide whitespace-nowrap"
                        style={{ 
                          color: isActive ? '#ffffff' : 'inherit',
                          textShadow: isActive 
                            ? `0 0 12px ${item.color}60, 0 0 20px ${item.color}30` 
                            : 'none',
                          fontWeight: isActive ? '600' : '500'
                        }}
                      >
                        {t(item.labelKey)}
                      </span>

                      {/* Пульсирующий индикатор для уведомлений */}
                      {item.labelKey === "notifications" && (
                        <div className="ml-auto">
                          <div 
                            className="w-2 h-2 bg-red-400 rounded-full animate-pulse"
                            style={{ 
                              boxShadow: '0 0 8px #ef4444',
                              pointerEvents: 'none'
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </NavLink>
                );
              })}
            </nav>
            
          </div>
        </aside>

        {/* Кнопка-стрелка для переключения (как в EXB) */}
        <button
          onClick={onToggle}
          className={`fixed top-1/2 -translate-y-1/2 w-6 h-12 bg-gray-800 hover:bg-gray-700 border-2 border-emerald-400/30 hover:border-emerald-400/50 text-emerald-400 hover:text-emerald-300 transition-all duration-300 shadow-lg hover:shadow-emerald-400/20 z-50 flex items-center justify-center group ${
            isOpen ? "left-64" : "left-0"
          }`}
          style={{
            borderRadius: '0 8px 8px 0',
            boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)',
          }}
          title={isOpen ? "Скрыть панель" : "Показать панель"}
        >
          <div className="transition-transform duration-300 group-hover:scale-110">
            {isOpen ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </div>
          
          {/* Неоновый эффект при hover */}
          <div 
            className="absolute inset-0 bg-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ borderRadius: '0 6px 6px 0' }}
          />
        </button>
      </div>

      {/* Кастомные стили для скроллбара */}
      <style dangerouslySetInnerHTML={{
        __html: `
          aside {
            overflow-x: hidden !important;
            overflow-y: auto;
          }
          aside::-webkit-scrollbar {
            width: 6px;
            height: 0px;
          }
          aside::-webkit-scrollbar-track {
            background: #374151;
            border-radius: 10px;
          }
          aside::-webkit-scrollbar-thumb {
            background: #10b981;
            border-radius: 10px;
            box-shadow: 0 0 10px #10b981;
          }
          aside::-webkit-scrollbar-thumb:hover {
            background: #059669;
          }
          aside::-webkit-scrollbar-horizontal {
            height: 0px;
            display: none;
          }
        `
      }} />
    </>
  );
};

export default Sidebar;