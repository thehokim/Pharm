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
  { labelKey: "parser", icon: FileSearch, to: "parser", color: "#6b7280" },
  { labelKey: "notifications", icon: Bell, to: "notifications", color: "#ef4444" },
  { labelKey: "settings", icon: Settings, to: "settings", color: "#6b7280" },
];

const Sidebar = () => {
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
      <aside 
        className="w-66 h-screen bg-gray-900 border-r-2 border-emerald-400/20 fixed top-0 left-0 overflow-y-auto overflow-x-hidden shadow-2xl"
        style={{ 
          boxShadow: '0 0 50px rgba(16, 185, 129, 0.2), 4px 0 30px rgba(16, 185, 129, 0.15)',
          background: 'linear-gradient(180deg, rgba(17, 24, 39, 0.95), rgba(31, 41, 55, 0.95))'
        }}
      >
        
        {/* Декоративные неоновые элементы */}
        <div 
          className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl"
          style={{ 
            background: 'rgba(16, 185, 129, 0.1)',
            transform: 'translate(4rem, -4rem)'
          }}
        ></div>
        <div 
          className="absolute bottom-0 left-0 w-24 h-24 rounded-full blur-2xl"
          style={{ 
            background: 'rgba(6, 182, 212, 0.1)',
            transform: 'translate(-3rem, 3rem)'
          }}
        ></div>
        
        <div className="relative z-10">
          {/* Заголовок компании */}
          <div className="relative p-6 border-b border-gray-700/50 overflow-hidden">
            {/* Неоновое свечение заголовка */}
            <div 
              className="absolute inset-0"
              style={{ 
                background: 'linear-gradient(to right, rgba(16, 185, 129, 0.1), transparent, rgba(6, 182, 212, 0.1))'
              }}
            ></div>
            
            <div className="relative flex items-center justify-center gap-3">
              <div className="relative">
                <div 
                  className="absolute inset-0 rounded-full blur-md"
                  style={{ 
                    background: '#10b981',
                    opacity: 0.6
                  }}
                ></div>
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
          <nav className="flex flex-col gap-2 px-4 py-6">
            {menu.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = isActiveRoute(item.to);
              
              return (
                <NavLink
                  key={index}
                  to={`/admin/${item.to}`}
                  className={`relative flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 text-sm group overflow-hidden ${
                    isActive
                      ? "bg-gray-800/60 font-semibold text-white border border-gray-600/50"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/40"
                  }`}
                  style={{
                    borderColor: isActive ? `${item.color}50` : 'transparent',
                    boxShadow: isActive ? `0 0 20px ${item.color}20, inset 0 0 20px ${item.color}10` : 'none'
                  }}
                  end={item.to === ""}
                >
                  {/* Неоновая полоска активного элемента */}
                  <div 
                    className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl transition-all duration-300 group-hover:w-2"
                    style={{ 
                      backgroundColor: item.color,
                      boxShadow: `0 0 10px ${item.color}`,
                      opacity: isActive ? 1 : 0
                    }}
                  ></div>
                  
                  {/* Фоновое свечение при hover */}
                  <div 
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ 
                      background: `radial-gradient(circle at center, ${item.color}15, transparent 70%)` 
                    }}
                  ></div>
                  
                  <div className="relative flex items-center gap-4 w-full">
                    {/* Иконка с неоновым эффектом */}
                    <div className="relative">
                      <div 
                        className="absolute inset-0 blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <div 
                        className="relative transition-all duration-300 group-hover:scale-110"
                        style={{ 
                          color: item.color,
                          filter: `drop-shadow(0 0 8px ${item.color}50)`
                        }}
                      >
                        <IconComponent size={18} />
                      </div>
                    </div>
                    
                    {/* Текст меню */}
                    <span 
                      className="font-medium transition-all duration-300 group-hover:tracking-wide"
                      style={{ 
                        textShadow: isActive ? `0 0 10px ${item.color}50` : 'none'
                      }}
                    >
                      {t(item.labelKey)}
                    </span>

                    {/* Пульсирующий индикатор для уведомлений */}
                    {item.labelKey === "notifications" && (
                      <div className="ml-auto">
                        <div 
                          className="w-2 h-2 bg-red-400 rounded-full animate-pulse"
                          style={{ boxShadow: '0 0 8px #ef4444' }}
                        ></div>
                      </div>
                    )}
                  </div>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>

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