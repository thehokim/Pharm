import React, { useEffect, useState } from "react";
import {
  Search,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  User,
  Shield,
  Activity,
  Calendar,
  FileText,
} from "lucide-react";
import { BASE_URL } from "../../../../utils/auth";
import { useTranslation } from "react-i18next";

const PAGE_SIZE = 12;

const Logs = () => {
  const { t } = useTranslation("logs");
  const [logs, setLogs] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const token = localStorage.getItem("token");

  // Получаем action-logs с сервера (с поддержкой search & pagination)
  const fetchLogs = (page = 1, pageSize = PAGE_SIZE, search = "") => {
    let url = `${BASE_URL}/api/action-logs/?page=${page}&pageSize=${pageSize}`;
    if (search.trim()) url += `&search=${encodeURIComponent(search.trim())}`;

    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((result) => {
        // Если сервер возвращает page с 0 — корректируем +1
        setMeta({
          page: (result.meta?.page ?? 0) + 1,
          totalPages: result.meta?.totalPages || 1,
        });
        setLogs(
          Array.isArray(result.data)
            ? result.data.map((log) => ({
                ...log,
                date: new Date(log.timestamp).toLocaleString("ru-RU", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              }))
            : []
        );
      })
      .catch((err) => {
        console.error(t("error_loading_logs"), err);
      });
  };

  useEffect(() => {
    fetchLogs(page, PAGE_SIZE, searchTerm);
    // eslint-disable-next-line
  }, [page, searchTerm]);

  // Сброс на первую страницу при поиске
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  // Неоновая пагинация
  const renderPagination = () => {
    if (meta.totalPages <= 1) return null;
    const { page: currentPage, totalPages } = meta;

    const range = [];
    let dotsAdded = false;
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        range.push(i);
        dotsAdded = false;
      } else if (!dotsAdded) {
        range.push("dots");
        dotsAdded = true;
      }
    }

    return (
      <div className="flex justify-center">
        <nav className="flex flex-wrap justify-center gap-2 mt-6 py-4 select-none bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl px-6"
             style={{ boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)' }}>
          
          {/* First Page */}
          <button
            className="p-3 rounded-xl bg-gray-800/50 border border-gray-600/50 text-gray-400 hover:border-cyan-400 hover:text-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110"
            onClick={() => setPage(1)}
            disabled={currentPage === 1}
            title="Первая"
            style={{ 
              boxShadow: currentPage !== 1 ? '0 0 10px rgba(6, 182, 212, 0.2)' : 'none'
            }}
          >
            <ChevronsLeft size={18} style={{ filter: 'drop-shadow(0 0 6px currentColor)' }} />
          </button>
          
          {/* Previous Page */}
          <button
            className="p-3 rounded-xl bg-gray-800/50 border border-gray-600/50 text-gray-400 hover:border-cyan-400 hover:text-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110"
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 1}
            title="Предыдущая"
            style={{ 
              boxShadow: currentPage !== 1 ? '0 0 10px rgba(6, 182, 212, 0.2)' : 'none'
            }}
          >
            <ChevronLeft size={18} style={{ filter: 'drop-shadow(0 0 6px currentColor)' }} />
          </button>

          {/* Page Numbers */}
          {range.map((p, i) =>
            p === "dots" ? (
              <span key={i} className="px-4 py-3 text-gray-500 select-none">…</span>
            ) : (
              <button
                key={i}
                className={`px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  p === currentPage
                    ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white border-2 border-cyan-400/50 shadow-lg scale-110"
                    : "bg-gray-800/50 border border-gray-600/50 text-gray-300 hover:border-cyan-400 hover:text-cyan-400 hover:scale-105"
                }`}
                onClick={() => setPage(p)}
                disabled={p === currentPage}
                style={{
                  boxShadow: p === currentPage 
                    ? '0 0 20px rgba(6, 182, 212, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.1)' 
                    : '0 0 10px rgba(6, 182, 212, 0.2)',
                  textShadow: p === currentPage ? '0 0 10px rgba(255, 255, 255, 0.8)' : 'none'
                }}
              >
                {p}
              </button>
            )
          )}

          {/* Next Page */}
          <button
            className="p-3 rounded-xl bg-gray-800/50 border border-gray-600/50 text-gray-400 hover:border-cyan-400 hover:text-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110"
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            title="Следующая"
            style={{ 
              boxShadow: currentPage !== totalPages ? '0 0 10px rgba(6, 182, 212, 0.2)' : 'none'
            }}
          >
            <ChevronRight size={18} style={{ filter: 'drop-shadow(0 0 6px currentColor)' }} />
          </button>

          {/* Last Page */}
          <button
            className="p-3 rounded-xl bg-gray-800/50 border border-gray-600/50 text-gray-400 hover:border-cyan-400 hover:text-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:scale-110"
            onClick={() => setPage(totalPages)}
            disabled={currentPage === totalPages}
            title="Последняя"
            style={{ 
              boxShadow: currentPage !== totalPages ? '0 0 10px rgba(6, 182, 212, 0.2)' : 'none'
            }}
          >
            <ChevronsRight size={18} style={{ filter: 'drop-shadow(0 0 6px currentColor)' }} />
          </button>

          {/* Page Info */}
          <div className="ml-4 flex items-center">
            <span className="text-gray-400 text-sm select-none">
              {t("page")} <span className="text-cyan-400 font-semibold">{currentPage}</span> {t("of")} <span className="text-cyan-400 font-semibold">{totalPages}</span>
            </span>
          </div>
        </nav>
      </div>
    );
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
        
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-400 rounded-2xl blur-md opacity-50"></div>
              <div className="relative bg-gray-800 border-2 border-cyan-400 p-4 rounded-2xl">
                <div className="flex items-center gap-2">
                  <ClipboardList className="text-cyan-400 w-7 h-7"
                                style={{ filter: 'drop-shadow(0 0 10px #06b6d4)' }} />
                  <FileText className="text-emerald-400 w-5 h-5"
                            style={{ filter: 'drop-shadow(0 0 8px #10b981)' }} />
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white"
                  style={{ textShadow: '0 0 20px rgba(6, 182, 212, 0.5)' }}>
                {t("title")}
              </h1>
              <p className="text-cyan-400 text-sm mt-1">
                {t("logbook_desc")}
              </p>
            </div>
          </div>

          {/* Поиск */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <Search className="text-cyan-400 w-5 h-5"
                      style={{ filter: 'drop-shadow(0 0 8px #06b6d4)' }} />
            </div>
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-80 bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400 pl-12 pr-4 py-4 rounded-2xl focus:border-cyan-400 focus:outline-none transition-all duration-300"
              style={{
                boxShadow: searchTerm ? '0 0 20px rgba(6, 182, 212, 0.2)' : 'none'
              }}
            />
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="relative bg-gray-900/90 backdrop-blur-xl border-2 border-gray-700/50 rounded-3xl hidden md:block"
           style={{ boxShadow: '0 0 30px rgba(0, 0, 0, 0.5)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-800/50 border-b border-gray-700/50">
              <tr>
                <th className="px-6 py-5 font-semibold text-gray-300">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-cyan-400"
                          style={{ filter: 'drop-shadow(0 0 8px #06b6d4)' }} />
                    {t("full_name")}
                  </div>
                </th>
                <th className="px-6 py-5 font-semibold text-gray-300">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400"
                            style={{ filter: 'drop-shadow(0 0 8px #10b981)' }} />
                    {t("role")}
                  </div>
                </th>
                <th className="px-6 py-5 font-semibold text-gray-300">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-400"
                              style={{ filter: 'drop-shadow(0 0 8px #a855f7)' }} />
                    {t("action")}
                  </div>
                </th>
                <th className="px-6 py-5 font-semibold text-gray-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400"
                              style={{ filter: 'drop-shadow(0 0 8px #f59e0b)' }} />
                    {t("date")}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center px-6 py-12">
                    <div className="flex flex-col items-center gap-4">
                      <ClipboardList className="w-12 h-12 text-gray-600" />
                      <span className="text-gray-400 font-medium text-lg">
                        {t("noMatches")}
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-all duration-300 group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full"
                             style={{ boxShadow: '0 0 8px #06b6d4' }}></div>
                        <span className="font-medium text-white group-hover:text-cyan-400 transition-colors">
                          {log.full_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-emerald-400 font-medium">
                        {log.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-purple-400">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-amber-400">
                        {log.date}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="block md:hidden">
        {logs.length === 0 ? (
          <div className="bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-3xl py-12 text-center">
            <ClipboardList className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <span className="text-gray-400 font-medium">{t("noMatches")}</span>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log, i) => (
              <div
                key={i}
                className="bg-gray-900/90 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-6 space-y-4"
                style={{ boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)' }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"
                       style={{ boxShadow: '0 0 8px #06b6d4' }}></div>
                  <span className="text-lg font-semibold text-white">{log.full_name}</span>
                </div>

                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400"
                            style={{ filter: 'drop-shadow(0 0 8px #10b981)' }} />
                    <span className="text-gray-400">{t("role_colon")}</span>
                    <span className="text-emerald-400 font-medium">{log.role}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-400"
                              style={{ filter: 'drop-shadow(0 0 8px #a855f7)' }} />
                    <span className="text-gray-400">{t("action_colon")}</span>
                    <span className="text-purple-400">{log.action}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400"
                              style={{ filter: 'drop-shadow(0 0 8px #f59e0b)' }} />
                    <span className="text-gray-400">{t("date_colon")}</span>
                    <span className="text-amber-400">{log.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
};

export default Logs;