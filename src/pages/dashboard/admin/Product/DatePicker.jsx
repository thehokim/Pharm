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

  const months = t("months", { returnObjects: true }) || [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
  ];
  
  const weekdays = t("weekdays", { returnObjects: true }) || [
    "Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"
  ];

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
        className="w-full bg-gray-800/50 border border-gray-600/50 text-white placeholder-gray-500 px-4 py-4 rounded-2xl focus:border-blue-400 focus:outline-none transition-all duration-300 flex items-center justify-between group"
        style={{ 
          boxShadow: selected ? '0 0 15px rgba(59, 130, 246, 0.2)' : 'none'
        }}
        onClick={() => setShow((v) => !v)}
      >
        {selected ? (
          <span className="text-white font-medium">
            {selected.toLocaleDateString("ru-RU")}
          </span>
        ) : (
          <span className="text-gray-400">{t("select_date") || "Выберите дату"}</span>
        )}
        <svg 
          className="w-5 h-5 text-blue-400 ml-2 group-hover:text-blue-300 transition-colors duration-300" 
          style={{ filter: 'drop-shadow(0 0 8px #3b82f6)' }}
          fill="none" 
          viewBox="0 0 24 24"
        >
          <path stroke="currentColor" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {show && (
        <div className="absolute left-0 bottom-full mb-2 z-30 bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl p-6 w-full animate-fadeIn"
             style={{ boxShadow: '0 0 30px rgba(59, 130, 246, 0.2)' }}>
          
          {/* Заголовок с навигацией */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              className="w-10 h-10 bg-gray-800/50 border border-gray-600/50 rounded-xl hover:border-emerald-400 hover:bg-emerald-400/10 transition-all duration-300 flex items-center justify-center group"
              onClick={() =>
                setView(
                  new Date(view.getFullYear(), view.getMonth() - 1, 1)
                )
              }
            >
              <svg className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 transition-colors" 
                   style={{ filter: 'drop-shadow(0 0 8px #10b981)' }}
                   fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeWidth={2} d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            
            <span className="font-bold text-white text-lg"
                  style={{ textShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }}>
              {months[view.getMonth()]} {view.getFullYear()}
            </span>
            
            <button
              type="button"
              className="w-10 h-10 bg-gray-800/50 border border-gray-600/50 rounded-xl hover:border-emerald-400 hover:bg-emerald-400/10 transition-all duration-300 flex items-center justify-center group"
              onClick={() =>
                setView(
                  new Date(view.getFullYear(), view.getMonth() + 1, 1)
                )
              }
            >
              <svg className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 transition-colors"
                   style={{ filter: 'drop-shadow(0 0 8px #10b981)' }}
                   fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeWidth={2} d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
          
          {/* Дни недели */}
          <div className="grid grid-cols-7 gap-2 mb-3">
            {weekdays.map((d, i) => (
              <div key={i} className="text-xs text-center text-cyan-400 font-semibold py-2"
                   style={{ filter: 'drop-shadow(0 0 8px #06b6d4)' }}>
                {d}
              </div>
            ))}
          </div>
          
          {/* Сетка дат */}
          <div className="grid grid-cols-7 gap-2">
            {Array(offset)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="w-10 h-10" />
              ))}
            {days.map((d) => {
              const isToday = d.toDateString() === new Date().toDateString();
              const isSelected = selected && d.toDateString() === selected.toDateString();
              
              return (
                <button
                  key={d.toISOString()}
                  type="button"
                  className={`w-10 h-10 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isSelected
                      ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold border-2 border-emerald-400/50 shadow-lg"
                      : isToday
                      ? "border-2 border-blue-400/50 text-blue-400 bg-blue-900/20 hover:bg-blue-400/20"
                      : "hover:bg-emerald-400/10 hover:border-emerald-400/30 text-gray-300 hover:text-emerald-400 border border-transparent"
                  }`}
                  style={{
                    boxShadow: isSelected 
                      ? '0 0 20px rgba(16, 185, 129, 0.4)' 
                      : isToday 
                      ? '0 0 15px rgba(59, 130, 246, 0.3)' 
                      : 'none'
                  }}
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
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px) scale(0.95);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.2s ease-out;
          }
        `
      }} />
    </div>
  );
}