import React, { useEffect } from "react";
import {
  Info,
  CheckCircle,
  AlertTriangle,
  XCircle,
  X,
} from "lucide-react";

const PopupNotification = ({ title, message, type = "info", onClose }) => {
  // Автоматическое закрытие через 5 сек
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-100 border-green-500";
      case "error":
        return "bg-red-100 border-red-500";
      case "warning":
        return "bg-yellow-100 border-yellow-500";
      default:
        return "bg-blue-100 border-blue-500";
    }
  };

  return (
    <div
      className={`fixed top-6 right-6 p-4 w-[300px] rounded-lg shadow z-50 border-l-4 animate-fade-in ${getBgColor()}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-2">
          {getIcon()}
          <div className="text-sm text-gray-800">
            {title && <div className="font-semibold">{title}</div>}
            <div>{message}</div>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default PopupNotification;
