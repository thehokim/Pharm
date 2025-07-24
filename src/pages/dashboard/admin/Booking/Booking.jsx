import React, { useEffect, useState, useMemo } from "react";
import {
  Search,
  CalendarDays,
  Calendar,
  MoreVertical,
  Plus,
  Activity,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import AddReservationModal from "./AddReservationModal";
import { DropdownMenu } from "./DropdownMenu";
import EditReservationModal from "./EditReservationModal";
import DeleteReservationModal from "./DeleteReservationModal";
import { BASE_URL } from "../../../../utils/auth";
import { useTranslation } from "react-i18next";
import Pagination from "../../../../components/layout/Pagination";

// Функция для статусов с фармацевтической тематикой
const STATUS_LABELS = (t) => ({
  pending: t("booking.statuses.pending"),
  confirmed: t("booking.statuses.confirmed"),
  completed: t("booking.statuses.completed"),
  cancelled: t("booking.statuses.cancelled"),
});

// Конфигурация статусов с неоновыми цветами
const STATUS_CONFIG = {
  pending: {
    bg: "bg-amber-900/20",
    text: "text-amber-400",
    border: "border-amber-400/30",
    icon: Clock,
    glow: "#f59e0b"
  },
  confirmed: {
    bg: "bg-cyan-900/20",
    text: "text-cyan-400",
    border: "border-cyan-400/30",
    icon: CheckCircle,
    glow: "#06b6d4"
  },
  completed: {
    bg: "bg-emerald-900/20",
    text: "text-emerald-400",
    border: "border-emerald-400/30",
    icon: CheckCircle,
    glow: "#10b981"
  },
  cancelled: {
    bg: "bg-red-900/20",
    text: "text-red-400",
    border: "border-red-400/30",
    icon: XCircle,
    glow: "#ef4444"
  }
};

const PAGE_SIZE = 10;

const Booking = () => {
  const { t } = useTranslation("booking");
  const [reservations, setReservations] = useState([]);
  // ИСПРАВЛЕНО: добавлены все необходимые поля в meta
  const [meta, setMeta] = useState({ 
    page: 1, 
    totalPages: 1, 
    total: 0, 
    pageSize: PAGE_SIZE 
  });
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

  // ДОБАВЛЕНО: обработчик смены страницы
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const fetchReservations = (page = 1, pageSize = PAGE_SIZE) => {
    fetch(`${BASE_URL}/api/reservations?page=${page}&pageSize=${pageSize}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setReservations(result.data || []);
        // ИСПРАВЛЕНО: правильно устанавливаем meta
        setMeta({
          page: result.meta?.page || 1,
          pageSize: result.meta?.pageSize || PAGE_SIZE,
          total: result.meta?.total || 0,
          totalPages: result.meta?.totalPages || 1,
        });
      })
      .catch((err) => console.error(t("error_loading_reservations"), err));
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
    return sum.toLocaleString() + " " + (t("delete_sum"));
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
      alert(t("error_deleting"));
    }
  };

  const statusLabels = STATUS_LABELS(t);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black p-6 space-y-6">
      {/* Декоративные неоновые элементы */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/5 rounded-full blur-3xl"></div>

      {/* Header */}
      <div className="relative bg-gray-900/90 backdrop-blur-xl border-2 border-emerald-400/30 rounded-3xl p-6 overflow-hidden"
           style={{ boxShadow: '0 0 50px rgba(16, 185, 129, 0.2)' }}>
        
        {/* Неоновое свечение заголовка */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-transparent to-cyan-400/10"></div>
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-400 rounded-2xl blur-md opacity-50"></div>
              <div className="relative bg-gray-800 border-2 border-emerald-400 p-4 rounded-2xl">
                <div className="flex items-center gap-2">
                  <Calendar className="text-emerald-400 w-7 h-7" 
                           style={{ filter: 'drop-shadow(0 0 10px #10b981)' }} />
                </div>
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white"
                  style={{ textShadow: '0 0 20px rgba(16, 185, 129, 0.5)' }}>
                {t("booking.title")}
              </h1>
              <p className="text-emerald-400 text-sm mt-1">
                {t("patient_records_management")}
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 items-center">
            {/* Кнопка добавления */}
            <button
              onClick={() => setIsAddOpen(true)}
              className="relative bg-gradient-to-r from-emerald-500 to-cyan-500 p-4 rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-lg group overflow-hidden"
              style={{ 
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)',
                filter: 'drop-shadow(0 0 15px rgba(16, 185, 129, 0.5))'
              }}
              title={t("booking.add")}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Plus className="w-6 h-6 text-white relative z-10" />
            </button>
            
            {/* Поиск */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Search className="text-cyan-400 w-5 h-5" 
                        style={{ filter: 'drop-shadow(0 0 8px #06b6d4)' }} />
              </div>
              <input
                type="text"
                placeholder={t("booking.search")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-80 bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-400 pl-12 pr-4 py-4 rounded-2xl focus:border-cyan-400 focus:outline-none transition-all duration-300"
                style={{ 
                  boxShadow: searchTerm ? '0 0 20px rgba(6, 182, 212, 0.2)' : 'none'
                }}
                autoFocus
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="relative bg-gray-900/90 backdrop-blur-xl border-2 border-gray-700/50 rounded-3xl "
           style={{ boxShadow: '0 0 30px rgba(0, 0, 0, 0.5)' }}>
        
        <div className="">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-800/50 border-b border-gray-700/50">
              <tr>
                <th className="px-6 py-5 font-semibold text-gray-300 flex items-center gap-2">
                  <Users className="w-4 h-4 text-emerald-400" 
                         style={{ filter: 'drop-shadow(0 0 8px #10b981)' }} />
                  {t("booking.client_full_name")}
                </th>
                <th className="px-6 py-5 font-semibold text-gray-300">
                  {t("booking.date")}
                </th>
                <th className="px-6 py-5 font-semibold text-gray-300">
                  {t("booking.status")}
                </th>
                <th className="px-6 py-5 font-semibold text-gray-300">
                  {t("booking.sum")}
                </th>
                <th className="px-6 py-5 text-right font-semibold text-gray-300">
                  {t("booking.actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((item, index) => (
                  <tr
                    key={item.id}
                    className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-all duration-300 group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"
                             style={{ boxShadow: '0 0 8px #10b981' }}></div>
                        <span className="font-medium text-white group-hover:text-emerald-400 transition-colors">
                          {item.client_full_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        <CalendarDays className="w-4 h-4 text-cyan-400" 
                                     style={{ filter: 'drop-shadow(0 0 8px #06b6d4)' }} />
                        <span>{item.created_at?.slice(0, 10)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {(() => {
                        const config = STATUS_CONFIG[item.status] || STATUS_CONFIG.pending;
                        const IconComponent = config.icon;
                        return (
                          <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-2xl border ${config.bg} ${config.text} ${config.border}`}
                               style={{ boxShadow: `0 0 15px ${config.glow}20` }}>
                            <IconComponent className="w-4 h-4" 
                                          style={{ filter: `drop-shadow(0 0 8px ${config.glow})` }} />
                            <span className="text-xs font-semibold">
                              {statusLabels[item.status] || item.status}
                            </span>
                          </div>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-emerald-400 text-lg"
                            style={{ textShadow: '0 0 10px rgba(16, 185, 129, 0.5)' }}>
                        {item.total_amount?.toLocaleString()} {t("delete_sum")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <button
                        className="bg-gray-800 border border-gray-600/50 p-2 rounded-xl text-gray-400 hover:text-white hover:border-purple-400 transition-all duration-300 hover:scale-110 relative z-10"
                        style={{ boxShadow: activeMenuId === item.id ? '0 0 15px #a855f7' : 'none' }}
                        title={t("booking.actions")}
                        onClick={() =>
                          setActiveMenuId(
                            activeMenuId === item.id ? null : item.id
                          )
                        }
                      >
                        <MoreVertical className="w-5 h-5" />
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
                    className="text-center px-6 py-12"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <Activity className="w-12 h-12 text-gray-600" />
                      <span className="text-gray-400 font-medium text-lg">
                        {t("booking.noData")}
                      </span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
            {filtered.length > 0 && (
              <tfoot>
                <tr className="border-t-2 border-emerald-400/30 bg-gray-800/30">
                  <td className="px-6 py-4 font-semibold text-white" colSpan={3}>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-emerald-400" 
                                    style={{ filter: 'drop-shadow(0 0 8px #10b981)' }} />
                      {t("booking.totalSum")}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-emerald-400 text-xl"
                          style={{ textShadow: '0 0 15px rgba(16, 185, 129, 0.5)' }}>
                      {getTotalSum()}
                    </span>
                  </td>
                  <td />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* ИСПРАВЛЕНО: Pagination с новым API */}
      <Pagination 
        meta={meta}
        onPageChange={handlePageChange}
      />

      {/* Модальные окна */}
      <AddReservationModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={() => fetchReservations(page, PAGE_SIZE)}
      />
      <EditReservationModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, reservation: null })}
        reservation={editModal.reservation}
        onSave={() => fetchReservations(page, PAGE_SIZE)}
        onUpdate={() => fetchReservations(page, PAGE_SIZE)}
      />
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