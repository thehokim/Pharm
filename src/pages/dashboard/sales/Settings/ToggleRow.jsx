import React from "react";
import Toggle from "./Toggle";
import { useTranslation } from "react-i18next";

const ToggleRow = ({
  icon: Icon,
  labelKey,       // Ключ основного лейбла (например, "notifications")
  checked,        // Состояние включен/выключен
  setChecked,     // Сеттер состояния
  labelOnKey,     // Ключ лейбла для состояния "Вкл"
  labelOffKey,    // Ключ лейбла для состояния "Выкл"
  color = "#2979FF" // Основной цвет свитча
}) => {
  const { t } = useTranslation("settings");
  const label = t(labelKey);
  const labelOn = t(labelOnKey);
  const labelOff = t(labelOffKey);

  return (
    <div className="bg-blue-50 rounded-2xl px-8 py-7 flex flex-col items-center justify-center transition-all">
      <div className="flex flex-col items-center mb-8">
        <div className="flex gap-2">
        <Icon className="text-blue-500 w-7 h-7 mb-2" />
        <span className="font-extrabold text-[#2F3747] text-xl text-center leading-tight">
          {label}
        </span>
        </div>
      </div>
      <Toggle
        checked={checked}
        onChange={setChecked}
        color={color}
        hideInlineLabel
      />
      <div
        className={`mt-8 text-lg font-medium text-center transition-colors duration-200`}
        style={{
          color: checked ? color : "#8C94A5",
          minHeight: 28,
        }}
      >
        {checked ? labelOn : labelOff}
      </div>
    </div>
  );
};

export default ToggleRow;
