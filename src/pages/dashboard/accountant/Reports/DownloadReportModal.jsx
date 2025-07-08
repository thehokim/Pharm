import React from "react";
import { X, Download } from "lucide-react";
import DropDown from "../../../../components/layout/DropDown"; // Проверь путь!
import DatePicker from "../../admin/Product/DatePicker";

export default function DownloadReportModal({
  open,
  onClose,
  reportOptions,
  formatOptions,
  selectedReport,
  setSelectedReport,
  selectedFormat,
  setSelectedFormat,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  dateRequiredReports = [],
  handleDownload,
  t,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-[95vw] max-w-md relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black text-xl"
        >
          <X />
        </button>
        <div className="flex items-center justify-start gap-2 mb-6">
          <div className="bg-indigo-50 p-2 rounded-full">
            <Download className="text-indigo-700"/>
          </div>
          <h3 className="text-xl font-semibold flex items-center gap-2">
            {t("download_report")}
          </h3>
        </div>

        {/* Report Dropdown */}
        <div className="mb-5 flex gap-2">
          <div className="w-full">
            <label className="block mb-1 text-sm text-gray-600">
              {t("report")}
            </label>
            <DropDown
              value={selectedReport}
              onChange={setSelectedReport}
              options={reportOptions}
              placeholder={t("choose_report")}
              labelRenderer={(opt) => t(opt.labelKey)}
            />
          </div>
          <div className="w-full">
            <label className="block mb-1 text-sm text-gray-600">
              {t("format")}
            </label>
            <DropDown
              value={selectedFormat}
              onChange={setSelectedFormat}
              options={formatOptions}
              placeholder={t("choose_format")}
              labelRenderer={(opt) =>
                opt.labelKey ? t(opt.labelKey) : opt.label
              }
            />
          </div>
        </div>

        {/* Date fields if needed */}
        <div className="mb-5 space-y-4 gap-4">
          <div className="flex-1 w-full">
            <label className="block mb-1 text-sm text-gray-600">
              {t("period_from")}
            </label>
            <DatePicker value={startDate} onChange={setStartDate} />
          </div>
          <div className="flex-1 w-full">
            <label className="block mb-1 text-sm text-gray-600">
              {t("period_to")}
            </label>
            <DatePicker value={endDate} onChange={setEndDate} />
          </div>
        </div>

        <button
          onClick={handleDownload}
          className="w-full bg-blue-500 hover:bg-blue-600 transition text-white font-semibold py-2.5 rounded-lg text-base flex items-center justify-center gap-2"
        >
          <Download className="w-5 h-5" />
          {t("download_btn")}
        </button>
      </div>
    </div>
  );
}
