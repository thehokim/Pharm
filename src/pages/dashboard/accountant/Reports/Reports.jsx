import React, { useEffect, useState } from "react";
import { Search, Download, FileText, Plus, X } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../../../../utils/auth";
import { useTranslation } from "react-i18next";
import DownloadReportModal from "./DownloadReportModal";

const reportOptions = [
  { value: "sales-overview", labelKey: "sales_overview" },
  { value: "top-products", labelKey: "top_products" },
  { value: "client-debts", labelKey: "client_debts" },
  { value: "stock-alerts", labelKey: "stock_alerts" },
  { value: "user-activity", labelKey: "user_activity" },
];

const formatOptions = [
  { value: "json", label: "JSON" },
  { value: "csv", label: "CSV" },
  { value: "xlsx", label: "XLSX" },
];

// Для этих отчётов нужны даты
const dateRequiredReports = ["sales-overview", "top-products"];

const Reports = () => {
  const { t } = useTranslation("acc_rept");
  const [reports, setReports] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("json");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/reports/user-activity?format=json`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) =>
        setReports(Array.isArray(res.data) ? res.data : res.data.data || [])
      )
      .catch((err) => console.error("Ошибка при загрузке отчётов:", err));
  }, [token]);

  const filteredReports = reports.filter((r) =>
    Object.values(r).some((v) =>
      String(v).toLowerCase().includes(search.toLowerCase())
    )
  );

  const handleDownload = () => {
    if (!selectedReport) {
      alert(t("choose_report"));
      return;
    }
    if (dateRequiredReports.includes(selectedReport) && !startDate) {
      alert(t("choose_start_date"));
      return;
    }

    const url = new URL(`${BASE_URL}/api/reports/${selectedReport}`);
    url.searchParams.append("format", selectedFormat);
    if (dateRequiredReports.includes(selectedReport)) {
      url.searchParams.append("start_date", startDate);
      url.searchParams.append("end_date", endDate);
    }

    axios
      .get(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      })
      .then((res) => {
        const blob = new Blob([res.data], {
          type: res.headers["content-type"],
        });
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        const ext = selectedFormat === "json" ? "json" : selectedFormat;
        a.href = downloadUrl;
        a.download = `${selectedReport}.${ext}`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(downloadUrl);
        setModalOpen(false);
      })
      .catch((err) => {
        console.error("Ошибка при скачивании отчёта:", err);
        alert(t("download_error"));
      });
  };

  return (
    <div className="space-y-8 bg-gray-50 min-h-screen px-2 py-4 md:p-6">
      {/* Title row */}
      <div className="bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5 rounded-2xl">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-50 rounded-full hover:bg-indigo-100 p-2">
            <FileText className="text-indigo-700" />
          </div>
          <h2 className="text-2xl sm:text-2xl font-bold text-gray-800 flex items-center gap-3">
            {t("reports_title")}
          </h2>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setModalOpen(true)}
            className="p-2 flex items-center justify-center rounded-full  bg-indigo-50 text-indigo-600 text-3xl font-bold hover:bg-indigo-100 hover:text-indigo-800 transition-colors focus:outline-none"
            title={t("download_report")}
          >
            <Plus />
          </button>
          <div className="relative w-full max-w-xs">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder={t("search_placeholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 pr-4 py-2 w-full border border-gray-300 rounded-full focus:border-indigo-400 focus:outline-none transition bg-gray-50 text-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl overflow-x-auto">
        <table className="min-w-full text-[15px] text-left text-gray-700">
          <thead className="bg-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-600">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">{t("user_id")}</th>
              <th className="px-6 py-4">{t("role")}</th>
              <th className="px-6 py-4">{t("action")}</th>
              <th className="px-6 py-4">{t("timestamp")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredReports.map((r) => (
              <tr
                key={r.id}
                className="hover:bg-indigo-50 transition-colors duration-150"
              >
                <td className="px-6 py-4">{r.id}</td>
                <td className="px-6 py-4">{r.user_id}</td>
                <td className="px-6 py-4">{r.role}</td>
                <td className="px-6 py-4">{r.action}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(r.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
            {filteredReports.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-8 text-gray-400 font-medium text-base"
                >
                  {t("no_reports")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <DownloadReportModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        reportOptions={reportOptions}
        formatOptions={formatOptions}
        selectedReport={selectedReport}
        setSelectedReport={setSelectedReport}
        selectedFormat={selectedFormat}
        setSelectedFormat={setSelectedFormat}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        dateRequiredReports={dateRequiredReports}
        handleDownload={handleDownload}
        t={t}
      />
    </div>
  );
};

export default Reports;
