import React, { useEffect, useState } from "react";
import { Banknote } from "lucide-react";
import AccountantStatCard from "./AccountantStatCard";
import FinanceChart from "./FinanceChart";
import FinanceSummary from "./FinanceSummary";
import RecentStatements from "./RecentStatements";
import TaxCalendar from "./TaxCalendar";
import { useTranslation } from "react-i18next";
import { BASE_URL } from "../../../../utils/auth";

// Формат суммы локализовано
const formatSum = (value, t) => {
  if (value == null) return t("no_data");
  return value.toLocaleString("ru-RU", { minimumFractionDigits: 2 }) + " " + t("sum");
};

const getMonthName = (month, t) => {
  if (!month) return "";
  const key = month.toLowerCase();
  return t(`months.${key}`, month);
};

const Home = () => {
  const { t, i18n } = useTranslation("home_accountant");
  const [revenue, setRevenue] = useState(null);
  const [revenueDelta, setRevenueDelta] = useState("");
  const [statements, setStatements] = useState(null);
  const [statementsDelta, setStatementsDelta] = useState("");
  const [debt, setDebt] = useState(null);
  const [debtDelta, setDebtDelta] = useState("");
  const [tax, setTax] = useState(null);
  const [taxDelta, setTaxDelta] = useState("");
  const [taxMonth, setTaxMonth] = useState("");
  const [taxTotalAmount, setTaxTotalAmount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    setLoading(true);
    setErr(null);

    const fetchWithAuth = (url) =>
      fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json());

    // Получаем последний месяц для налогов
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthYear = lastMonth.getFullYear();
    const lastMonthNumber = (lastMonth.getMonth() + 1).toString().padStart(2, '');

    Promise.all([
      fetchWithAuth(`${BASE_URL}/api/income/`),
      fetchWithAuth(`${BASE_URL}/api/transactions?status=pending`),
      fetchWithAuth(`${BASE_URL}/api/reports/client-debts`),
      fetchWithAuth(`${BASE_URL}/api/tax-total?year=${lastMonthYear}&month=${lastMonthNumber}`),
    ])
      .then(([income, transactions, clientDebts, taxTotal]) => {
        setRevenue(income?.total || 0);
        setRevenueDelta(t("month_growth", { value: income?.delta || "+0" }));
        setStatements(transactions?.length ?? 0);
        setStatementsDelta(t("from_yesterday", { value: "+3" }));
        setDebt(clientDebts?.total_debt || 0);
        setDebtDelta(clientDebts?.delta || "-");

        // Обрабатываем налоги за последний месяц
        const lastMonthTaxes = Array.isArray(taxTotal) ? taxTotal : [];
        const totalTaxAmount = lastMonthTaxes.reduce((sum, tax) => sum + (tax.total_amount || 0), 0);
        
        setTax(totalTaxAmount);
        setTaxDelta(t("last_month"));
        setTaxMonth(getMonthName(lastMonthNumber, t));
        setTaxTotalAmount(totalTaxAmount);

        setLoading(false);
      })
      .catch((e) => {
        setErr(t("load_error"));
        setLoading(false);
      });
    // eslint-disable-next-line
  }, [i18n.language]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600" />
      </div>
    );
  if (err)
    return (
      <div className="text-center text-red-600 font-semibold py-8">{err}</div>
    );

  const statData = [
    {
      label: t("revenue"),
      value: formatSum(revenue, t),
      delta: revenueDelta,
      type: "revenue",
    },
    {
      label: t("statements"),
      value: statements ?? t("no_data"),
      delta: statementsDelta,
      type: "statements",
    },
    {
      label: t("debt"),
      value: formatSum(debt, t),
      delta: debtDelta || "-",
      type: "debt",
    },
    {
      label: t("tax"),
      value: formatSum(tax, t),
      delta: taxDelta,
      type: "tax",
      bottom: (
        taxMonth && taxTotalAmount !== null ? (
          <div className="mt-1 text-xs text-gray-500 text-center">
            <span className="font-semibold">{taxMonth}</span> — {formatSum(taxTotalAmount, t)}
          </div>
        ) : null
      )
    },
  ];

  return (
    <div className="space-y-4 bg-gray-50">
      <div className="bg-white rounded-xl p-4">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <Banknote /> {t("dashboard_title")}
        </h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statData.map((stat, idx) => (
          <AccountantStatCard key={idx} {...stat} />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <FinanceChart />
        <FinanceSummary />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RecentStatements />
        <TaxCalendar />
      </div>
    </div>
  );
};

export default Home;
