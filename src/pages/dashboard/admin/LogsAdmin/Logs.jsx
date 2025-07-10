import React, { useEffect, useState } from "react";
import {
  Search,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
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
        console.error("Ошибка загрузки логов:", err);
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

  // Пагинация с кнопками
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
      <nav className="flex flex-wrap justify-center gap-1 mt-5 py-4 select-none">
        <button
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
          onClick={() => setPage(1)}
          disabled={currentPage === 1}
          title="First"
        >
          <ChevronsLeft size={20} />
        </button>
        <button
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
          onClick={() => setPage(currentPage - 1)}
          disabled={currentPage === 1}
          title="Prev"
        >
          <ChevronLeft size={20} />
        </button>
        {range.map((p, i) =>
          p === "dots" ? (
            <span key={i} className="px-2 text-gray-400">…</span>
          ) : (
            <button
              key={i}
              className={`px-3 py-1 rounded-lg transition ${
                p === currentPage
                  ? "bg-indigo-600 text-white font-bold shadow"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setPage(p)}
              disabled={p === currentPage}
            >
              {p}
            </button>
          )
        )}
        <button
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
          onClick={() => setPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          title="Next"
        >
          <ChevronRight size={20} />
        </button>
        <button
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
          onClick={() => setPage(totalPages)}
          disabled={currentPage === totalPages}
          title="Last"
        >
          <ChevronsRight size={20} />
        </button>
        <span className="ml-4 mt-1 text-gray-400 text-xs select-none">
          {t("page")} <b>{currentPage}</b> {t("of")} <b>{totalPages}</b>
        </span>
      </nav>
    );
  };

  return (
    <div className="space-y-4 bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="bg-white flex items-center justify-between p-4 rounded-xl">
        <div className="flex items-center justify-center gap-3">
          <div className="bg-indigo-100 rounded-full p-3">
            <ClipboardList className="text-indigo-700" />
          </div>
          <span className="text-2xl font-bold text-gray-800">
            {t("title")}
          </span>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder={t("searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full focus:outline-none transition"
          />
        </div>
      </div>
      {/* Таблица */}
      <div className="bg-white rounded-2xl overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-600">
            <tr>
              <th className="px-6 py-4">{t("full_name")}</th>
              <th className="px-6 py-4">{t("role")}</th>
              <th className="px-6 py-4">{t("action")}</th>
              <th className="px-6 py-4">{t("date")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logs.map((log, i) => (
              <tr key={i} className="hover:bg-indigo-50 transition-colors duration-150">
                <td className="px-6 py-4 font-medium">{log.full_name}</td>
                <td className="px-6 py-4">{log.role}</td>
                <td className="px-6 py-4">{log.action}</td>
                <td className="px-6 py-4">{log.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && (
          <div className="p-6 text-center text-gray-500">{t("noMatches")}</div>
        )}
        {renderPagination()}
      </div>
    </div>
  );
};

export default Logs;
