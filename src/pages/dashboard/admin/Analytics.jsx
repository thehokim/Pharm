import React, { useEffect, useState } from "react";
import { AudioLinesIcon, ChevronDown } from "lucide-react";
import { BASE_URL } from "../../../utils/auth";

const Analytics = () => {
  const [filter, setFilter] = useState("popular");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [popularProducts, setPopularProducts] = useState([]);
  const [rareProducts, setRareProducts] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${BASE_URL}/api/analytics/products`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        // Разделяем: больше 10 продаж = популярные
        const popular = data.filter((p) => p.sales_count > 10);
        const rare = data.filter((p) => p.sales_count <= 10);
        setPopularProducts(popular);
        setRareProducts(rare);
      })
      .catch((err) => {
        console.error("Ошибка при загрузке аналитики товаров:", err);
      });
  }, []);

  const data = filter === "popular" ? popularProducts : rareProducts;
  const filterLabel = filter === "popular" ? "Часто продаваемые" : "Редко продаваемые";

  return (
    <div className="bg-gray-50 min-h-screen p-2 space-y-6">
      {/* Заголовок */}
      <div className="bg-white flex items-center justify-between p-4 rounded-xl">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <AudioLinesIcon /> Аналитика Товаров
        </h2>

        {/* Кастомный фильтр */}
        <div className="relative inline-block text-left">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="inline-flex justify-between w-52 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-100 rounded-full hover:bg-blue-50"
          >
            {filterLabel}
            <ChevronDown className="w-4 h-4 ml-2 text-gray-500" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 z-10 mt-2 w-52 px-2 py-1 origin-top-right rounded-xl bg-white border border-gray-100">
              <div className="py-1 text-sm">
                <button
                  onClick={() => {
                    setFilter("popular");
                    setDropdownOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-left hover:bg-blue-50 rounded-xl transition-colors duration-200"
                >
                  Часто продаваемые
                </button>
                <button
                  onClick={() => {
                    setFilter("rare");
                    setDropdownOpen(false);
                  }}
                  className="block w-full px-4 py-2 text-left hover:bg-blue-50 rounded-lg transition-colors duration-200"
                >
                  Редко продаваемые
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Таблица */}
      <div className="bg-white rounded-2xl overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-600">
            <tr>
              <th className="px-6 py-4">#</th>
              <th className="px-6 py-4">Товар</th>
              <th className="px-6 py-4">Продаж</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((item, i) => (
              <tr key={i} className="hover:bg-indigo-50 transition-colors duration-150">
                <td className="px-6 py-4">{i + 1}</td>
                <td className="px-6 py-4 font-medium">{item.name}</td>
                <td className="px-6 py-4 font-semibold text-gray-800">
                  {item.sales_count}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-white border-t-1 border-gray-100 font-semibold text-gray-700">
              <td className="px-6 py-4" colSpan={2}>
                Всего
              </td>
              <td className="px-6 py-4">
                {data.reduce((acc, item) => acc + item.sales_count, 0)} продаж
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default Analytics;
