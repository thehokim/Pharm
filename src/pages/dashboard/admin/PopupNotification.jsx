import { X, XCircle } from "lucide-react";
import React from "react";

const PopupNotification = ({ message, onClose }) => {
  return (
    <div className="fixed top-6 right-6 bg-red-100 border-l-4 border-red-500 p-4 rounded-lg z-50 w-[300px] animate-fade-in">
        <div className="w-full flex">
      <div className="text-sm text-gray-800">{message}</div>
      <button
        onClick={onClose}
        className="text-xs text-gray-600 absolute top-2 right-2"
      >
        <XCircle className="w-4 h-4"/>
      </button>
      </div>
    </div>
  );
};

export default PopupNotification;
