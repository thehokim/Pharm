import React, { useEffect } from "react";
import {
  Info, CheckCircle, AlertTriangle, XCircle, X
} from "lucide-react";
import { useTranslation } from "react-i18next";

// Можно расширить пропсы по необходимости!
const PopupNotification = ({
  title,
  message,
  type = "info", // "info" | "success" | "error" | "warning"
  onClose,
  duration = 5000,
}) => {
  const { t } = useTranslation("notif");

  useEffect(() => {
    if (!duration) return;
    const timer = setTimeout(() => onClose(), duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getIcon = () => {
    switch (type) {
      case "success": return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "error": return <XCircle className="w-6 h-6 text-red-500" />;
      case "warning": return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      default: return <Info className="w-6 h-6 text-blue-500" />;
    }
  };

  const getBg = () => {
    switch (type) {
      case "success": return "bg-green-50 border-green-400";
      case "error": return "bg-red-50 border-red-400";
      case "warning": return "bg-yellow-50 border-yellow-400";
      default: return "bg-blue-50 border-blue-400";
    }
  };

  const getTitle = () => {
    if (title) return title;
    switch (type) {
      case "success": return t("successTitle");
      case "error": return t("errorTitle");
      case "warning": return t("warningTitle");
      default: return t("infoTitle");
    }
  };

  return (
    <div className={`fixed top-7 right-7 z-[9999] min-w-[320px] max-w-xs p-4 rounded-2xl border shadow-lg flex items-start gap-3 animate-fade-in-fast ${getBg()}`}>
      <div className="pt-1">{getIcon()}</div>
      <div className="flex-1">
        <div className="font-bold text-gray-800 mb-0.5">{getTitle()}</div>
        <div className="text-gray-700 text-sm">{message}</div>
      </div>
      <button
        onClick={onClose}
        className="ml-2 text-gray-400 hover:text-gray-800"
        aria-label={t("close")}
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default PopupNotification;
