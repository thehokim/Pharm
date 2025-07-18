import React, { useEffect, useState, useRef } from "react";
import { BarChart3, ChevronDown, TrendingUp, TrendingDown, Package, Activity, Pill, Hash } from "lucide-react";
import { BASE_URL } from "../../../../utils/auth";
import { useTranslation } from "react-i18next";

const Analytics = () => {
  const { t } = useTranslation("analytics");
  
  const FILTERS = [
    { 
      value: "popular", 
      label: t("popular"),
      icon: TrendingUp,
      color: "text-emerald-400",
      bg: "bg-emerald-900/20",
      border: "border-emerald-400/30",
      glow: "#10b981"
    },
    { 
      value: "rare", 
      label: t("rare"),
      icon: TrendingDown,
      color: "text-amber-400",
      bg: "bg-amber-900/20", 
      border: "border-amber-400/30",
      glow: "#f59e0b"
    },
  ];

  const [filter, setFilter] = useState("popular");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [popularProducts, setPopularProducts] = useState([]);
  const [rareProducts, setRareProducts] = useState([]);
  const dropdownRef = useRef(null);
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    const startDate = "1970-01-01";
    const endDate = new Date().toISOString().slice(0, 10);

    const url = new URL(`${BASE_URL}/api/analytics/products`);
    url.searchParams.append("start_date", startDate);
    url.searchParams.append("end_date", endDate);

    fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Ошибка HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const popular = data.filter((p) => p.sales_count > 10);
        const rare = data.filter((p) => p.sales_count <= 10);
        setPopularProducts(popular);
        setRareProducts(rare);
      })
      .catch((err) => {
        console.error(t("error_loading_data"), err);
      });
  }, [token]);

  // Клик вне dropdown — закрыть
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  const data = filter === "popular" ? popularProducts : rareProducts;
  const selectedFilter = FILTERS.find((f) => f.value === filter);
  const totalSales = data.reduce((sum, p) => sum + p.sales_count, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black p-6 space-y-6">
      {/* Декоративные неоновые элементы */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/5 rounded-full blur-3xl"></div>

      {/* Заголовок и фильтр */}
      <div className="relative bg-gray-900/90 backdrop-blur-xl border-2 border-emerald-400/30 rounded-3xl p-6 "
           style={{ boxShadow: '0 0 50px rgba(16, 185, 129, 0.2)' }}>
        
        {/* Неоновое свечение заголовка */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-transparent to-cyan-400/10"></div>
        
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-400 rounded-2xl blur-md opacity-50"></div>
              <div className="relative bg-gray-800 border-2 border-emerald-400 p-4 rounded-2xl">
                <div className="flex items-center gap-2">
                  <BarChart3 className="text-emerald-400 w-7 h-7" 
                             style={{ filter: 'drop-shadow(0 0 10px #10b981)' }} />
                  <Activity className="text-cyan-400 w-5 h-5" 
                            style={{ filter: 'drop-shadow(0 0 8px #06b6d4)' }} />
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white"
                  style={{ textShadow: '0 0 20px rgba(16, 185, 129, 0.5)' }}>
                {t("title")}
              </h1>
              <p className="text-emerald-400 text-sm mt-1">
                {t("pharma_sales_analysis")}
              </p>
            </div>
          </div>
          
          {/* Кастомный dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className={`flex items-center justify-between w-64 px-6 py-4 bg-gray-800/50 border rounded-2xl font-medium hover:bg-gray-800/70 transition-all duration-300 group ${selectedFilter?.border}`}
              style={{ 
                boxShadow: `0 0 20px ${selectedFilter?.glow}20`
              }}
            >
              <div className="flex items-center gap-3">
                {selectedFilter?.icon && (
                  <selectedFilter.icon className={`w-5 h-5 ${selectedFilter.color}`} 
                                      style={{ filter: `drop-shadow(0 0 8px ${selectedFilter.glow})` }} />
                )}
                <span className={selectedFilter?.color}>
                  {selectedFilter?.label}
                </span>
              </div>
              <ChevronDown
                className={`text-gray-400 group-hover:text-white transition-all duration-300 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
                size={18}
              />
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 z-30 mt-2 w-64 bg-gray-800/95 backdrop-blur-xl border border-gray-600/50 rounded-2xl shadow-2xl py-2 animate-fadeIn"
                   style={{ boxShadow: '0 0 30px rgba(16, 185, 129, 0.2)' }}>
                {FILTERS.map((filterOption) => {
                  const IconComponent = filterOption.icon;
                  return (
                    <button
                      key={filterOption.value}
                      onClick={() => {
                        setFilter(filterOption.value);
                        setDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-700/50 transition-all duration-300 flex items-center gap-3 ${
                        filter === filterOption.value ? filterOption.bg : ''
                      }`}
                    >
                      <IconComponent className={`w-5 h-5 ${filterOption.color}`} 
                                    style={{ filter: `drop-shadow(0 0 8px ${filterOption.glow})` }} />
                      <span className={`font-medium ${filterOption.color}`}>
                        {filterOption.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Статистические карточки */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 z-0">
        <div className="bg-gray-900/90 backdrop-blur-xl border border-emerald-400/30 rounded-3xl p-6"
             style={{ boxShadow: '0 0 30px rgba(16, 185, 129, 0.15)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-emerald-900/30 border border-emerald-400/30 p-3 rounded-2xl">
              <Package className="w-6 h-6 text-emerald-400" 
                       style={{ filter: 'drop-shadow(0 0 10px #10b981)' }} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">{t("total_products")}</p>
              <p className="text-2xl font-bold text-emerald-400"
                 style={{ textShadow: '0 0 15px rgba(16, 185, 129, 0.5)' }}>
                {data.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/90 backdrop-blur-xl border border-cyan-400/30 rounded-3xl p-6"
             style={{ boxShadow: '0 0 30px rgba(6, 182, 212, 0.15)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-cyan-900/30 border border-cyan-400/30 p-3 rounded-2xl">
              <selectedFilter.icon className={`w-6 h-6 ${selectedFilter.color}`} 
                                  style={{ filter: `drop-shadow(0 0 10px ${selectedFilter.glow})` }} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">{t("total_sales")}</p>
              <p className="text-2xl font-bold text-cyan-400"
                 style={{ textShadow: '0 0 15px rgba(6, 182, 212, 0.5)' }}>
                {totalSales}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/90 backdrop-blur-xl border border-purple-400/30 rounded-3xl p-6"
             style={{ boxShadow: '0 0 30px rgba(168, 85, 247, 0.15)' }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-900/30 border border-purple-400/30 p-3 rounded-2xl">
              <Pill className="w-6 h-6 text-purple-400" 
                    style={{ filter: 'drop-shadow(0 0 10px #a855f7)' }} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">{t("avg_sales")}</p>
              <p className="text-2xl font-bold text-purple-400"
                 style={{ textShadow: '0 0 15px rgba(168, 85, 247, 0.5)' }}>
                {data.length ? Math.round(totalSales / data.length) : 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Таблица */}
      <div className="relative bg-gray-900/90 backdrop-blur-xl border-2 border-gray-700/50 rounded-3xl"
           style={{ boxShadow: '0 0 30px rgba(0, 0, 0, 0.5)' }}>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-800/50 border-b border-gray-700/50">
              <tr>
                <th className="px-6 py-5 font-semibold text-gray-300 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-emerald-400" 
                        style={{ filter: 'drop-shadow(0 0 8px #10b981)' }} />
                  #
                </th>
                <th className="px-6 py-5 font-semibold text-gray-300">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-cyan-400" 
                             style={{ filter: 'drop-shadow(0 0 8px #06b6d4)' }} />
                    {t("product")}
                  </div>
                </th>
                <th className="px-6 py-5 font-semibold text-gray-300">
                  <div className="flex items-center gap-2">
                    <selectedFilter.icon className={`w-4 h-4 ${selectedFilter.color}`} 
                                        style={{ filter: `drop-shadow(0 0 8px ${selectedFilter.glow})` }} />
                    {t("sales")}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.length ? (
                data.map((item, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-all duration-300 group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"
                             style={{ boxShadow: '0 0 8px #10b981' }}></div>
                        <span className="font-medium text-white">
                          {i + 1}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-white group-hover:text-cyan-400 transition-colors">
                        {item.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-2xl border ${selectedFilter.bg} ${selectedFilter.border}`}
                           style={{ boxShadow: `0 0 15px ${selectedFilter.glow}20` }}>
                        <selectedFilter.icon className={`w-4 h-4 ${selectedFilter.color}`} 
                                            style={{ filter: `drop-shadow(0 0 8px ${selectedFilter.glow})` }} />
                        <span className={`font-bold ${selectedFilter.color}`}>
                          {item.sales_count}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    className="text-center px-6 py-12"
                    colSpan={3}
                  >
                    <div className="flex flex-col items-center gap-4">
                      <Package className="w-12 h-12 text-gray-600" />
                      <span className="text-gray-400 font-medium text-lg">
                        {t("noData")}
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
            {data.length > 0 && (
              <tfoot>
                <tr className="border-t-2 border-emerald-400/30 bg-gray-800/30">
                  <td className="px-6 py-4 font-semibold text-white" colSpan={2}>
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-emerald-400" 
                                style={{ filter: 'drop-shadow(0 0 8px #10b981)' }} />
                      {t("total")}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-emerald-400 text-lg"
                          style={{ textShadow: '0 0 15px rgba(16, 185, 129, 0.5)' }}>
                      {t("totalSales", { count: totalSales })}
                    </span>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
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

export default Analytics;