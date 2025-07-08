import React, { useEffect, useState, useRef } from "react";
import { AudioLinesIcon, ChevronDown } from "lucide-react";
import { BASE_URL } from "../../../../utils/auth";
import { useTranslation } from "react-i18next";

const Analytics = () => {
  const { t } = useTranslation("analytics");
  const FILTERS = [
    { value: "popular", label: t("popular") },
    { value: "rare", label: t("rare") },
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
        console.error("Ошибка при загрузке данных:", err);
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
  const filterLabel = FILTERS.find((f) => f.value === filter)?.label;

  return (
    <div className="bg-gray-50 min-h-screen py-6 px-2 sm:px-6 space-y-7">
      {/* Заголовок и фильтр */}
      <div className="bg-white flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl border border-gray-200">
        <div className="flex gap-2 items-center justify-center">
          <div className="flex items-center p-2 rounded-full bg-indigo-100">
            <AudioLinesIcon className="text-indigo-700" />
          </div>
          <span className="text-gray-800 text-2xl font-bold">{t("title")}</span>
        </div>
        {/* Кастомный dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center justify-between w-60 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-base font-medium text-gray-700 hover:bg-blue-50 transition"
            type="button"
          >
            {filterLabel}
            <ChevronDown
              className={`ml-2 transition-transform ${
                dropdownOpen ? "rotate-180" : ""
              }`}
              size={18}
            />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 z-20 mt-2 w-60 rounded-xl bg-white border border-gray-200 shadow-lg animate-fadeIn">
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => {
                    setFilter(f.value);
                    setDropdownOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 font-medium transition ${
                    filter === f.value ? "bg-blue-50 text-blue-700" : ""
                  }`}
                  type="button"
                >
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Таблица */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-x-auto">
        <table className="min-w-full text-base text-left text-gray-700">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 font-semibold">#</th>
              <th className="px-6 py-4 font-semibold">{t("product")}</th>
              <th className="px-6 py-4 font-semibold">{t("sales")}</th>
            </tr>
          </thead>
          <tbody>
            {data.length ? (
              data.map((item, i) => (
                <tr
                  key={i}
                  className="hover:bg-indigo-50 border-b border-gray-100 transition-colors"
                >
                  <td className="px-6 py-4">{i + 1}</td>
                  <td className="px-6 py-4 font-medium">{item.name}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">
                    {item.sales_count}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className="px-6 py-7 text-center text-gray-400 font-medium"
                  colSpan={3}
                >
                  {t("noData")}
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="bg-white border-t border-gray-100 font-semibold text-gray-700">
              <td className="px-6 py-4" colSpan={2}>
                {t("total")}
              </td>
              <td className="px-6 py-4">
                {t("totalSales", {
                  count: data.reduce((sum, p) => sum + p.sales_count, 0),
                })}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default Analytics;
