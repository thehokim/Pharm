import React, { useState, useEffect } from "react";
import { TimerReset } from "lucide-react";
import { BASE_URL } from "../../../../utils/auth";
import { useTranslation } from "react-i18next";

const PendingOrdersList = () => {
  const { t } = useTranslation("warehouse");
  const [orders, setOrders] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${BASE_URL}/api/orders/?status=pending`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(res => setOrders(res.data || []))
      .catch(err => console.error("PendingOrdersList fetch error:", err));
  }, [token]);

  const visible = showAll ? orders : orders.slice(0, 5);

  return (
    <div className="bg-white p-4 rounded-2xl">
      <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <TimerReset className="w-5 h-5" /> {t("pending_orders")}
      </h2>
      <ul className="space-y-2 text-sm">
        {visible.map(o => (
          <li key={o.id} className="flex justify-between items-center p-2 rounded-xl hover:bg-indigo-50 transition">
            <div>
              <p className="font-medium text-gray-800">{o.id}</p>
              <p className="text-xs text-gray-500">{o.client} — {o.created_at.split('T')[0]}</p>
            </div>
            <div className="text-right">
              <p>{o.items.reduce((sum,i)=>sum+i.quantity,0)} {t("items")}</p>
              <span className={`text-xs px-2 py-1 rounded-full ${o.status==="completed"?"bg-green-500 text-white":"bg-yellow-300 text-gray-800"}`}>
                {t(o.status)}
              </span>
            </div>
          </li>
        ))}
      </ul>
      {orders.length>5 && (
        <button onClick={()=>setShowAll(!showAll)} className="mt-4 w-full bg-blue-50 text-blue-600 font-bold py-2 rounded-2xl hover:bg-blue-100 transition">
          {showAll?t("hide"):t("show_more")}
        </button>
      )}
    </div>
  );
};
export default PendingOrdersList;
