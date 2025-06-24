import React, { useEffect, useState } from "react";
import { Search, CalendarDays, CalendarCheck, MoreHorizontal } from "lucide-react";
import AddReservationModal from "./AddReservationModal";
import { BASE_URL } from "../../../../utils/auth";
// import EditReservationModal from "./EditReservationModal";
// import DeleteReservationModal from "./DeleteReservationModal";

const Booking = () => {
  const [reservations, setReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = () => {
    fetch(`${BASE_URL}/api/reservations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setReservations)
      .catch((err) => console.error("Ошибка загрузки бронирований:", err));
  };

  const getTotalSum = () => {
    const sum = reservations.reduce((acc, item) => acc + (item.total_amount || 0), 0);
    return sum.toLocaleString() + " сум";
  };

  const filtered = reservations.filter((item) =>
    item.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4 bg-gray-50 min-h-screen">
      <div className="bg-white flex items-center justify-between p-4 rounded-xl">
        <h2 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
          <CalendarCheck /> Бронирование
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setIsAddOpen(true)}
            className="bg-black text-white text-2xl w-10 h-10 rounded-full flex items-center justify-center"
          >
            +
          </button>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Поиск..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-full focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-600">
            <tr>
              <th className="px-6 py-4">Клиент ID</th>
              <th className="px-6 py-4">Дата</th>
              <th className="px-6 py-4">Статус</th>
              <th className="px-6 py-4">Сумма</th>
              <th className="px-6 py-4 text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-indigo-50 transition-colors duration-150">
                <td className="px-6 py-4 font-medium">{item.client_id}</td>
                <td className="px-6 py-4 flex items-center gap-2 text-gray-600">
                  <CalendarDays size={16} className="text-indigo-400" />
                  {item.created_at?.slice(0, 10)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      item.status === "confirmed"
                        ? "bg-blue-100 text-blue-700"
                        : item.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : item.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-gray-800">
                  {item.total_amount?.toLocaleString()} сум
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => {
                      // TODO: открой EditReservationModal или DeleteReservationModal
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <MoreHorizontal />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-white border-t font-semibold text-gray-700">
              <td className="px-6 py-4" colSpan={3}>
                Общая сумма
              </td>
              <td className="px-6 py-4">{getTotalSum()}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Модалка добавления */}
      <AddReservationModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onAdd={fetchReservations} />
    </div>
  );
};

export default Booking;
