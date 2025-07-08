import React, { useEffect, useState, useMemo } from "react";
import {
  Search,
  CalendarDays,
  CalendarCheck,
  MoreHorizontal,
  Plus,
} from "lucide-react";
import AddReservationModal from "./AddReservationModal";
import { DropdownMenu } from "./DropdownMenu";
import EditReservationModal from "./EditReservationModal";
import DeleteReservationModal from "./DeleteReservationModal";
import { BASE_URL } from "../../../../utils/auth";
import { useTranslation } from "react-i18next";
import Pagination from "../../../../components/layout/Pagination";

// Функция для статусов
const STATUS_LABELS = (t) => ({
  pending: t("booking.statuses.pending"),
  confirmed: t("booking.statuses.confirmed"),
  completed: t("booking.statuses.completed"),
  cancelled: t("booking.statuses.cancelled"),
});

const PAGE_SIZE = 10; // можешь менять размер

const Booking = () => {
  const { t } = useTranslation("booking");
  const [reservations, setReservations] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [editModal, setEditModal] = useState({
    isOpen: false,
    reservation: null,
  });
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    reservation: null,
  });
  const [page, setPage] = useState(1);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchReservations(page, PAGE_SIZE);
    // eslint-disable-next-line
  }, [page]);

  const fetchReservations = (page = 1, pageSize = PAGE_SIZE) => {
    fetch(`${BASE_URL}/api/reservations?page=${page}&pageSize=${pageSize}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setReservations(result.data || []);
        setMeta({
          page: (result.meta?.page || 0) + 1, // сервер с 0 или 1? Если с 1, убери +1!
          totalPages: result.meta?.totalPages || 1,
        });
      })
      .catch((err) => console.error("Ошибка загрузки бронирований:", err));
  };

  // Поиск по всем полям, включая ФИО клиента и статусы
  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    const labels = STATUS_LABELS(t);
    return reservations.filter(
      (item) =>
        (item.client_full_name &&
          item.client_full_name.toLowerCase().includes(term)) ||
        (item.status && item.status.toLowerCase().includes(term)) ||
        (labels[item.status] &&
          labels[item.status].toLowerCase().includes(term)) ||
        (item.total_amount &&
          String(item.total_amount).toLowerCase().includes(term)) ||
        (item.created_at && item.created_at.toLowerCase().includes(term))
    );
  }, [reservations, searchTerm, t]);

  const getTotalSum = () => {
    const sum = filtered.reduce(
      (acc, item) => acc + (item.total_amount || 0),
      0
    );
    return sum.toLocaleString() + " сум";
  };

  const handleDelete = async (reservation) => {
    try {
      await fetch(`${BASE_URL}/api/reservations/${reservation.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteModal({ isOpen: false, reservation: null });
      fetchReservations(page, PAGE_SIZE);
    } catch (err) {
      alert("Ошибка при удалении");
    }
  };

  const statusLabels = STATUS_LABELS(t);

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-4">
      {/* Header */}
      <div className="bg-white flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 text-3xl">
            <CalendarCheck size={28} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-gray-800">
            {t("booking.title")}
          </span>
        </div>
        <div className="flex gap-3 items-center w-full md:w-auto">
          <button
            onClick={() => setIsAddOpen(true)}
            className="w-11 h-11 flex items-center justify-center rounded-full  bg-indigo-50 text-indigo-600 text-3xl font-bold hover:bg-indigo-100 hover:text-indigo-800 transition-colors focus:outline-none"
            title={t("booking.add")}
          >
            <Plus />
          </button>
          <div className="relative flex-1 max-w-xs">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder={t("booking.search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-full bg-gray-50 focus:outline-none focus:border-indigo-500 transition"
              autoFocus
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200">
        <table className="min-w-full text-sm text-left text-gray-800 relative">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 font-semibold">
                {t("booking.client_full_name")}
              </th>
              <th className="px-6 py-4 font-semibold">{t("booking.date")}</th>
              <th className="px-6 py-4 font-semibold">{t("booking.status")}</th>
              <th className="px-6 py-4 font-semibold">{t("booking.sum")}</th>
              <th className="px-6 py-4 text-right font-semibold">
                {t("booking.actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-indigo-50 border-b border-gray-100 transition-colors relative"
                >
                  {/* Заменили client_id на client_full_name */}
                  <td className="px-6 py-3 font-medium">
                    {item.client_full_name}
                  </td>
                  <td className="px-6 py-3 flex items-center gap-2 text-gray-600">
                    <CalendarDays size={16} className="text-indigo-400" />
                    {item.created_at?.slice(0, 10)}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                        item.status === "confirmed"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : item.status === "pending"
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : item.status === "completed"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }`}
                    >
                      {statusLabels[item.status] || item.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 font-semibold text-gray-900">
                    {item.total_amount?.toLocaleString()} {t("delete_sum")}
                  </td>
                  <td className="px-6 py-3 text-right relative">
                    <button
                      className="text-gray-400 hover:text-gray-700 transition relative z-10"
                      title={t("booking.actions")}
                      onClick={() =>
                        setActiveMenuId(
                          activeMenuId === item.id ? null : item.id
                        )
                      }
                      tabIndex={0}
                    >
                      <MoreHorizontal />
                    </button>
                    {/* Dropdown меню */}
                    {activeMenuId === item.id && (
                      <DropdownMenu
                        onEdit={() => {
                          setEditModal({ isOpen: true, reservation: item });
                          setActiveMenuId(null);
                        }}
                        onDelete={() => {
                          setDeleteModal({ isOpen: true, reservation: item });
                          setActiveMenuId(null);
                        }}
                        onClose={() => setActiveMenuId(null)}
                      />
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center px-6 py-8 text-gray-400 font-medium"
                >
                  {t("booking.noData")}
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-200 bg-white font-semibold text-gray-700">
              <td className="px-6 py-4" colSpan={3}>
                {t("booking.totalSum")}
              </td>
              <td className="px-6 py-4">{getTotalSum()}</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        page={meta.page}
        totalPages={meta.totalPages}
        onPageChange={setPage}
      />

      {/* Модалка добавления */}
      <AddReservationModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={() => fetchReservations(page, PAGE_SIZE)}
      />
      {/* Модалка редактирования */}
      <EditReservationModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, reservation: null })}
        reservation={editModal.reservation}
        onSave={() => fetchReservations(page, PAGE_SIZE)}
        onUpdate={() => fetchReservations(page, PAGE_SIZE)}
      />
      {/* Модалка удаления */}
      <DeleteReservationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, reservation: null })}
        reservation={deleteModal.reservation}
        onDelete={() => handleDelete(deleteModal.reservation)}
      />
    </div>
  );
};

export default Booking;
