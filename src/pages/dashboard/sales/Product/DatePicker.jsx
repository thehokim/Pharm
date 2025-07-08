import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

function getMonthDays(year, month) {
  const days = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export default function DatePicker({ value, onChange }) {
  const { t } = useTranslation("product");

  const months = t("months", { returnObjects: true });
  const weekdays = t("weekdays", { returnObjects: true });

  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState(value ? new Date(value) : null);
  const [view, setView] = useState(selected || new Date());

  const ref = useRef(null);

  // Закрытие по клику вне
  useEffect(() => {
    if (!show) return;
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) setShow(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [show]);

  useEffect(() => {
    setSelected(value ? new Date(value) : null);
    if (value) setView(new Date(value));
  }, [value]);

  const days = getMonthDays(view.getFullYear(), view.getMonth());
  const firstDay = new Date(view.getFullYear(), view.getMonth(), 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-between focus:border-blue-500 outline-none"
        onClick={() => setShow((v) => !v)}
      >
        {selected
          ? selected.toLocaleDateString("ru-RU")
          : <span className="text-gray-400">{t("select_date")}</span>}
        <svg className="w-5 h-5 text-gray-400 ml-2" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {show && (
        <div className="absolute left-0 bottom-12 z-30 bg-white border border-gray-200 rounded-xl shadow-lg p-4 w-full animate-fadeIn">
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              className="px-2 py-1 rounded hover:bg-gray-100"
              onClick={() =>
                setView(
                  new Date(view.getFullYear(), view.getMonth() - 1, 1)
                )
              }
            >
              &lt;
            </button>
            <span className="font-medium text-gray-700">
              {months[view.getMonth()]} {view.getFullYear()}
            </span>
            <button
              type="button"
              className="px-2 py-1 rounded hover:bg-gray-100"
              onClick={() =>
                setView(
                  new Date(view.getFullYear(), view.getMonth() + 1, 1)
                )
              }
            >
              &gt;
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-1">
            {weekdays.map((d, i) => (
              <div key={i} className="text-xs text-center text-gray-400">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array(offset)
              .fill(0)
              .map((_, i) => (
                <div key={i} />
              ))}
            {days.map((d) => {
              const isToday =
                d.toDateString() === new Date().toDateString();
              const isSelected =
                selected && d.toDateString() === selected.toDateString();
              return (
                <button
                  key={d.toISOString()}
                  type="button"
                  className={
                    "w-9 h-9 rounded-full text-sm " +
                    (isSelected
                      ? "bg-blue-600 text-white font-bold"
                      : isToday
                      ? "border border-blue-400 text-blue-600"
                      : "hover:bg-blue-50 text-gray-700")
                  }
                  onClick={() => {
                    setSelected(d);
                    onChange(d.toISOString().slice(0, 10));
                    setShow(false);
                  }}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
