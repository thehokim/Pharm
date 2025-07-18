import React, { useEffect, useState } from "react";
import { Search, ShoppingCart } from "lucide-react";
import { BASE_URL } from "../../../utils/auth";
import Pagination from "../../../components/layout/Pagination";
import { useTranslation } from "react-i18next";

// маленький компонент для кастомного тултипа
const Tooltip = ({ text, children }) => (
  <span className="relative inline-block group">
    {children}
    {text && (
      <span className="
        absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
        hidden group-hover:block 
        whitespace-nowrap 
        bg-white text-black text-xs rounded px-2 py-1 z-10
        ">
        {text}
      </span>
    )}
  </span>
);

const getStatusStyle = (status) => {
  switch (status) {
    case "completed":
      return "bg-green-500 text-white";
    case "pending":
      return "bg-yellow-300 text-gray-800";
    case "cancelled":
      return "bg-red-300 text-white";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

// собираем строку "Название (кол-во)" для каждого элемента
const formatItems = (items, productsMap) => {
  if (!Array.isArray(items)) return "";
  return items
    .map((it) => {
      const name = productsMap[it.product_id] || `#${it.product_id}`;
      return `${name} (${it.quantity} шт)`;
    })
    .join(", ");
};

// считаем общее кол-во
const getTotalItems = (items) =>
  Array.isArray(items) ? items.reduce((sum, it) => sum + (it.quantity || 0), 0) : 0;

const Orders = () => {
  const { t } = useTranslation("warehouse");
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pageSize: 10, total: 0, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [clientsMap, setClientsMap] = useState({});
  const [productsMap, setProductsMap] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    // 1) Подгружаем продукты
    fetch(`${BASE_URL}/api/products/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((prods) => {
        const m = {};
        (prods.data || []).forEach((p) => (m[p.id] = p.name));
        setProductsMap(m);
      })
      .catch(() => console.warn("Не удалось загрузить продукты"));

    // 2) Подгружаем клиентов
    fetch(`${BASE_URL}/api/clients/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((cls) => {
        const m = {};
        (cls.data || []).forEach((c) => (m[c.id] = c.company_name || c.name));
        setClientsMap(m);
      })
      .catch(() => console.warn("Не удалось загрузить клиентов"));
  }, [token]);

  useEffect(() => {
    // 3) Подгружаем заказы с пагинацией
    fetch(`${BASE_URL}/api/orders/?page=${page}&pageSize=${meta.pageSize}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((res) => {
        setOrders(res.data || []);
        setMeta({
          page: res.meta?.page || 1,
          pageSize: res.meta?.pageSize || 10,
          total: res.meta?.total || 0,
          totalPages: res.meta?.totalPages || 1,
        });
      })
      .catch((e) => console.error("Не удалось загрузить заказы:", e));
  }, [token, page]);

  const filtered = orders.filter((o) => {
    const term = searchTerm.toLowerCase();
    const idStr     = String(o.id).toLowerCase();
    const clientStr = String(clientsMap[o.client_id] || "").toLowerCase();
    const statusStr = String(o.status).toLowerCase();
    return idStr.includes(term) || clientStr.includes(term) || statusStr.includes(term);
  });

  return (
    <div className="space-y-4 bg-gray-50 p-4">
      {/* Header */}
      <div className="bg-white flex items-center justify-between p-4 rounded-xl">
        <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
          <ShoppingCart /> {t("orders")}
        </h2>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder={t("search_order_placeholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full focus:outline-none transition"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl overflow-hidden">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="text-xs font-semibold uppercase tracking-wide text-gray-600">
            <tr>
              <th className="px-6 py-4 bg-gray-100 rounded-tl-xl">ID</th>
              <th className="px-6 py-4 bg-gray-100">{t("client")}</th>
              <th className="px-6 py-4 bg-gray-100">{t("date")}</th>
              <th className="px-6 py-4 bg-gray-100">{t("items")}</th>
              <th className="px-6 py-4 bg-gray-100 rounded-tr-xl">{t("status")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((order) => {
              const clientName = clientsMap[order.client_id] || "—";
              const totalItems = getTotalItems(order.items);
              const tooltipTxt = formatItems(order.items, productsMap);
              return (
                <tr key={order.id} className="hover:bg-indigo-50 transition-colors duration-150">
                  <td className="px-6 py-4 font-medium">{order.id}</td>
                  <td className="px-6 py-4">{clientName}</td>
                  <td className="px-6 py-4">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <Tooltip text={tooltipTxt}>
                      <span className="cursor-help">{totalItems} {t("items", "шт")}</span>
                    </Tooltip>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {t(order.status, order.status)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Pagination
        page={meta.page}
        pageSize={meta.pageSize}
        total={meta.total}
        totalPages={meta.totalPages}
        onPageChange={setPage}
      />
    </div>
  );
};
export default Orders;
