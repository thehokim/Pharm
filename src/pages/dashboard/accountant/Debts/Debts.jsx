import React, { useEffect, useState } from "react";
import {
  AlertOctagon,
  Search as SearchIcon,
  Eye,
  EyeOff,
  TrendingUp,
  Users,
  DollarSign,
  SortAsc,
  SortDesc
} from "lucide-react";
import { BASE_URL } from "../../../../utils/auth";
import { useTranslation } from "react-i18next";

export default function Debts() {
  const { t } = useTranslation("acc_debt");
  const [search, setSearch] = useState("");
  const [debts, setDebts] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showAmounts, setShowAmounts] = useState(true);
  const [sortBy, setSortBy] = useState("amount"); // 'amount', 'client'
  const [sortOrder, setSortOrder] = useState("desc"); // 'asc', 'desc'
  const [filterLevel, setFilterLevel] = useState("all"); // 'all', 'high', 'medium', 'low'
  const [shownPhoneIdx, setShownPhoneIdx] = useState(null);
  const [hoveredDetailIdx, setHoveredDetailIdx] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`${BASE_URL}/api/reports/client-debts?format=json`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const formatted = (
          Array.isArray(data) ? data : data.data || data.debts || []
        ).map((item) => {
          const client =
            item.client_name ||
            item.name ||
            item.username ||
            `#${item.client_id}`;
          const value = item.debt !== undefined ? item.debt : item.amount || 0;
          return {
            client,
            amount: value,
            phone_number: item.phone_number,
            due_date: item.due_date
          };
        });
        setDebts(formatted);
      })
      .catch((e) => console.error("Ошибка загрузки задолженностей:", e));
  }, [token]);

  const getDebtLevel = (amount) => {
    if (amount > 100000) return "high";
    if (amount > 50000) return "medium";
    return "low";
  };

  const getDebtColor = (amount) => {
    if (amount > 100000) return "text-red-600";
    if (amount > 50000) return "text-orange-600";
    return "text-yellow-600";
  };

  const getDebtBgColor = (amount) => {
    if (amount > 100000) return "from-red-50 to-red-100";
    if (amount > 50000) return "from-orange-50 to-orange-100";
    return "from-yellow-50 to-yellow-100";
  };

  const sortedDebts = [...debts].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case "amount":
        comparison = a.amount - b.amount;
        break;
      case "client":
        comparison = a.client.localeCompare(b.client);
        break;
      default:
        comparison = 0;
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const filtered = sortedDebts.filter((d) => {
    const term = search.trim().toLowerCase();
    const matchesSearch =
      d.client.toLowerCase().includes(term) ||
      d.amount.toLocaleString().toLowerCase().includes(term);

    const matchesFilter =
      filterLevel === "all" || getDebtLevel(d.amount) === filterLevel;

    return matchesSearch && matchesFilter;
  });

  const totalDebt = debts.reduce((sum, d) => sum + d.amount, 0);
  const averageDebt = debts.length > 0 ? totalDebt / debts.length : 0;
  const highRiskClients = debts.filter((d) => d.amount > 100000).length;

  const formatAmount = (amount) => {
    return showAmounts ? Number(amount).toLocaleString() : "••••••";
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  // === DAYS LEFT LOGIC ===
  const getDaysLeft = (due_date) => {
    if (!due_date) return "";
    // поддержка формата "2025-07-08" или "08-07-2025"
    let yyyy, mm, dd;
    if (due_date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // "2025-07-08"
      [yyyy, mm, dd] = due_date.split("-");
    } else if (due_date.match(/^\d{2}-\d{2}-\d{4}$/)) {
      // "08-07-2025"
      [dd, mm, yyyy] = due_date.split("-");
    } else {
      return "";
    }
    const dateObj = new Date(`${yyyy}-${mm}-${dd}`);
    if (!dateObj || isNaN(dateObj)) return "";

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    dateObj.setHours(0, 0, 0, 0);

    const diffTime = dateObj - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return t("expired");
    if (diffDays === 0) return t("expires_today");
    if (diffDays === 1) return t("expires_tomorrow");
    return t("days_left", { days: diffDays });
  };

  // For "Contact" button auto-hide after 3s
  useEffect(() => {
    if (shownPhoneIdx !== null) {
      const timer = setTimeout(() => setShownPhoneIdx(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [shownPhoneIdx]);

  return (
    <div className="space-y-6 bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex gap-3 items-center">
            <div className="rounded-full bg-red-50 hover:bg-red-100 p-3 transition-colors">
              <AlertOctagon className="text-red-500" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{t("title")}</h2>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <button
              onClick={() => setShowAmounts(!showAmounts)}
              className="flex items-center gap-2 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 text-indigo-700 rounded-full transition-colors"
            >
              {showAmounts ? <EyeOff size={22} /> : <Eye size={22} />}
            </button>
            <div className="relative">
              <SearchIcon
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder={t("search_placeholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-64 pl-12 pr-4 py-3 border border-gray-200 rounded-full focus:border-blue-400 focus:outline-none transition text-gray-700 bg-gray-50"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">{t("total_debt")}</p>
              <p className="text-2xl font-bold text-red-600">
                {formatAmount(totalDebt)}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <DollarSign className="text-red-600" size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">{t("total_debted_clients")}</p>
              <p className="text-2xl font-bold text-gray-900">{debts.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="text-blue-600" size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">
                {t("center_debt")}
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatAmount(Math.round(averageDebt))}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="text-green-600" size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">{t("high")}</p>
              <p className="text-2xl font-bold text-red-600">
                {highRiskClients}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <AlertOctagon className="text-orange-600" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterLevel("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterLevel === "all"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {t("total")} ({debts.length})
            </button>
            <button
              onClick={() => setFilterLevel("high")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterLevel === "high"
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {t("high")} (
              {debts.filter((d) => getDebtLevel(d.amount) === "high").length})
            </button>
            <button
              onClick={() => setFilterLevel("medium")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterLevel === "medium"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {t("normal_risk")} (
              {debts.filter((d) => getDebtLevel(d.amount) === "medium").length})
            </button>
            <button
              onClick={() => setFilterLevel("low")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterLevel === "low"
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {t("low_risk")} (
              {debts.filter((d) => getDebtLevel(d.amount) === "low").length})
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => toggleSort("amount")}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <span className="text-sm font-medium">{t("soum")}</span>
              {sortBy === "amount" &&
                (sortOrder === "asc" ? (
                  <SortAsc size={16} />
                ) : (
                  <SortDesc size={16} />
                ))}
            </button>
            <button
              onClick={() => toggleSort("client")}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <span className="text-sm font-medium">{t("client")}</span>
              {sortBy === "client" &&
                (sortOrder === "asc" ? (
                  <SortAsc size={16} />
                ) : (
                  <SortDesc size={16} />
                ))}
            </button>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {filtered.length > 0 ? (
          filtered.map((d, idx) => (
            <div
              key={idx}
              className={`group relative bg-white p-6 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                hoveredCard === idx
                  ? "border-blue-300 scale-105 -translate-y-1"
                  : "border-gray-100 hover:border-gray-200"
              }`}
              onMouseEnter={() => setHoveredCard(idx)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Risk indicator */}
              <div
                className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${
                  d.amount > 100000
                    ? "from-red-400 to-red-600"
                    : d.amount > 50000
                    ? "from-orange-400 to-orange-600"
                    : "from-yellow-400 to-yellow-600"
                }`}
              />
              {/* Gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${getDebtBgColor(
                  d.amount
                )} opacity-0 group-hover:opacity-30 transition-opacity duration-300`}
              />
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="mb-4">
                  <div
                    className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 ${
                      d.amount > 100000
                        ? "bg-gradient-to-br from-red-500 to-red-600"
                        : d.amount > 50000
                        ? "bg-gradient-to-br from-orange-500 to-orange-600"
                        : "bg-gradient-to-br from-yellow-500 to-yellow-600"
                    }`}
                  >
                    <span className="text-white font-bold text-lg">
                      {d.client.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      d.amount > 100000
                        ? "bg-red-100 text-red-800"
                        : d.amount > 50000
                        ? "bg-orange-100 text-orange-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {d.amount > 100000
                      ? t("high_risk")
                      : d.amount > 50000
                      ? t("normal_risk")
                      : t("low_risk")}
                  </div>
                </div>

                <p className="text-gray-600 font-medium mb-3 group-hover:text-blue-600 transition-colors">
                  {d.client}
                </p>
                <div className="space-y-3">
                  <p
                    className={`text-2xl font-bold group-hover:scale-105 transition-transform ${getDebtColor(
                      d.amount
                    )}`}
                  >
                    {formatAmount(d.amount)}
                    {showAmounts && (
                      <span className="font-normal text-sm text-gray-400 ml-2">
                        {t("currency")}
                      </span>
                    )}
                  </p>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ease-out ${
                        d.amount > 100000
                          ? "bg-gradient-to-r from-red-500 to-red-600"
                          : d.amount > 50000
                          ? "bg-gradient-to-r from-orange-500 to-orange-600"
                          : "bg-gradient-to-r from-yellow-500 to-yellow-600"
                      }`}
                      style={{
                        width:
                          hoveredCard === idx
                            ? `${Math.min(
                                (d.amount /
                                  Math.max(
                                    ...filtered.map((item) => item.amount)
                                  )) *
                                  100,
                                100
                              )}%`
                            : "0%",
                      }}
                    />
                  </div>
                </div>
                <div className={`mt-4 flex items-center justify-center gap-2 transition-all duration-300 ${
                  hoveredCard === idx ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                }`}>
                  {/* CONTACT */}
                  <button
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-full transition-colors"
                    onClick={() => setShownPhoneIdx(idx)}
                  >
                    {shownPhoneIdx === idx ? d.phone_number : t("contact")}
                  </button>
                  {/* DETAILS */}
                  <button
                    className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-xs rounded-full transition-colors"
                    onMouseEnter={() => setHoveredDetailIdx(idx)}
                    onMouseLeave={() => setHoveredDetailIdx(null)}
                  >
                    {hoveredDetailIdx === idx && d.due_date
                      ? getDaysLeft(d.due_date)
                      : t("details")}
                  </button>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full -translate-y-10 translate-x-10 opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-purple-100 to-pink-100 rounded-full translate-y-8 -translate-x-8 opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
            </div>
          ))
        ) : (
          <div className="col-span-full">
            <div className="text-center py-16 px-6">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertOctagon className="text-gray-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {t("no_data")}
              </h3>
              <p className="text-gray-400 max-w-md mx-auto">
                {search
                  ? "Попробуйте изменить критерии поиска"
                  : "Задолженности не найдены"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
