import React, { useEffect, useState } from "react";
import { PackageSearch, Search } from "lucide-react";
import { BASE_URL } from "../../../utils/auth";
import { useTranslation } from "react-i18next";

const getStatus = (qty, t) => {
  if (qty === 0) {
    return { label: t("out_of_stock"), style: "bg-gray-200 text-gray-700" };
  }
  if (qty < 10) {
    return { label: t("low_stock"), style: "bg-yellow-100 text-yellow-700" };
  }
  return { label: t("in_stock"), style: "bg-green-100 text-green-700" };
};

const Inventory = () => {
  const { t } = useTranslation("warehouse");
  const [products, setProducts] = useState([]);
  const [filterMedicine, setFilterMedicine] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${BASE_URL}/api/products/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setProducts(data.data || []))
      .catch((err) => console.error("Ошибка загрузки продуктов:", err));
  }, [token]);

  const filtered = products.filter((p) => {
    // фильтр по is_medicine
    if (filterMedicine === "medicine" && !p.is_medicine) return false;
    if (filterMedicine === "other" && p.is_medicine) return false;
    // фильтр по названию
    return p.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-4 bg-gray-50 p-4">
      {/* Header с фильтром и поиском */}
      <div className="bg-white flex items-center justify-between p-4 rounded-xl">
        <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
          <PackageSearch /> {t("inventory")}
        </h2>
        <div className="flex gap-2 w-full max-w-md">
          <select
            value={filterMedicine}
            onChange={(e) => setFilterMedicine(e.target.value)}
            className="border border-gray-300 rounded-full px-4 py-2 bg-white focus:outline-none"
          >
            <option value="all">{t("all", "Все")}</option>
            <option value="medicine">{t("medicine", "Лекарства")}</option>
            <option value="other">{t("other", "Прочие")}</option>
          </select>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={t("search_placeholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full focus:outline-none transition"
            />
          </div>
        </div>
      </div>

      {/* Таблица */}
      <div className="bg-white rounded-2xl overflow-hidden">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="text-xs font-semibold uppercase tracking-wide text-gray-600">
            <tr>
              <th className="px-6 py-4 bg-gray-100 rounded-tl-xl">{t("name")}</th>
              <th className="px-6 py-4 bg-gray-100">{t("code")}</th>
              <th className="px-6 py-4 bg-gray-100">{t("quantity")}</th>
              <th className="px-6 py-4 bg-gray-100 rounded-tr-xl">{t("status")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((item) => {
              const { label, style } = getStatus(item.stock_quantity, t);
              return (
                <tr
                  key={item.id}
                  className="hover:bg-indigo-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 font-medium">{item.name}</td>
                  <td className="px-6 py-4">{item.code || item.barcode}</td>
                  <td className="px-6 py-4">{item.stock_quantity} {t("items", "шт")}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${style}`}
                    >
                      {label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Inventory;
