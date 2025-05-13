import React from "react";

const StatCard = ({ icon: Icon, title, value, subtitle, managers = [] }) => {
  const isCurrency = typeof value === "number" && title !== "Менеджеры";

  return (
    <div className="bg-white rounded-2xl p-4 space-y-3">
      {/* Заголовок с иконкой */}
      <div className="flex items-center gap-3">
        <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      </div>

      {/* Основное значение */}
      <div className="text-2xl font-bold text-gray-800">
        {value.toLocaleString()} {isCurrency ? "сум" : ""}
      </div>

      {/* Менеджеры или подзаголовок */}
      {managers.length ? (
        <ul className="text-sm space-y-1 mt-2">
          {managers.slice(0, 3).map((m, i) => (
            <li key={i} className="flex justify-between text-gray-700">
              <span>{m.fullName}</span>
              <span className="text-green-600 font-medium">
                +{m.profit.toLocaleString()} сум
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-sm text-gray-500 leading-snug">{subtitle}</div>
      )}
    </div>
  );
};

export default StatCard;
