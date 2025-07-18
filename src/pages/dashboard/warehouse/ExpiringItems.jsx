import React, { useEffect, useState } from "react";
import { AlarmClock, Search } from "lucide-react";
import { BASE_URL } from "../../../utils/auth";
import { useTranslation } from "react-i18next";

const getUrgencyColor = (daysLeft) => {
  if (daysLeft <= 0) {
    return "bg-gray-800 text-gray-100";
  }
  if (daysLeft <= 15) {
    return "bg-red-200 text-red-800";
  }
  if (daysLeft <= 30) {
    return "bg-red-100 text-red-700";
  }
  if (daysLeft <= 60) {
    return "bg-orange-100 text-orange-700";
  }
  if (daysLeft <= 90) {
    return "bg-yellow-100 text-yellow-700";
  }
  if (daysLeft <= 120) {
    return "bg-lime-100 text-lime-700";
  }
  if (daysLeft <= 180) {
    return "bg-green-100 text-green-700";
  }
  return "bg-gray-100 text-gray-700";
};

const ExpiringItems = () => {
  const { t } = useTranslation("warehouse");
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const today = new Date();
    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(today.getMonth() + 6);

    fetch(`${BASE_URL}/api/products/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((products) => {
        const prods = products.data || [];
        const expiring = prods
          .map((p) => {
            const expDateObj = new Date(p.expiration_date);
            const diffMs = expDateObj - today;
            const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
            return {
              id: p.id,
              name: p.name,
              code: p.barcode,
              quantity: p.stock_quantity,
              expDate: p.expiration_date,
              daysLeft,
            };
          })
          .filter(
            (i) => i.daysLeft > 0 && new Date(i.expDate) <= sixMonthsLater
          )
          .sort((a, b) => a.daysLeft - b.daysLeft);

        setItems(expiring);
      })
      .catch((err) => console.error("Ошибка загрузки продуктов:", err));
  }, [token]);

  const filtered = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 bg-gray-50 p-4">
      {/* Header */}
      <div className="bg-white flex items-center justify-between p-4 rounded-xl">
        <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
          <AlarmClock /> {t("expiring_items")}
        </h2>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder={t("search_expiring_placeholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full focus:outline-none transition"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl overflow-hidden">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="text-xs font-semibold uppercase tracking-wide text-gray-600">
            <tr>
              <th className="px-6 py-4 bg-gray-100 rounded-tl-xl">{t("name")}</th>
              <th className="px-6 py-4 bg-gray-100">{t("code")}</th>
              <th className="px-6 py-4 bg-gray-100">{t("quantity")}</th>
              <th className="px-6 py-4 bg-gray-100">{t("expiration_date")}</th>
              <th className="px-6 py-4 bg-gray-100 rounded-tr-xl">{t("days_left")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-indigo-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 font-medium">{item.name}</td>
                <td className="px-6 py-4">{item.code}</td>
                <td className="px-6 py-4">{item.quantity} {t("items", "шт")}</td>
                <td className="px-6 py-4">{item.expDate}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${getUrgencyColor(
                      item.daysLeft
                    )}`}
                  >
                    {item.daysLeft} {t("days_left")}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  {t("no_expiring")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpiringItems;
