import React, { useState, useRef, useEffect } from "react";
import { TimerReset, ChevronDown, Clock, Loader2, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";
import { BASE_URL } from "../../../../utils/auth";

const API_URL = `${BASE_URL}/api/autologout`;

const OPTIONS = [
  { value: "5", labelKey: "label_5" },
  { value: "15", labelKey: "label_15" },
  { value: "30", labelKey: "label_30" },
  { value: "60", labelKey: "label_60" },
  { value: "120", labelKey: "label_120" },
  { value: "360", labelKey: "label_360" },
  { value: "720", labelKey: "label_720" },
  { value: "1440", labelKey: "label_1440" },
  { value: "never", labelKey: "never" },
];

const STORAGE_KEY = "pharm_auto_logout_v2";

function saveSessionToStorage({ auto_logout_minutes, auto_refetch }) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      auto_logout_minutes,
      auto_refetch,
      startTimestamp: Date.now(),
    })
  );
}

function getSessionFromStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const AutoLogoutSelector = () => {
  const { t } = useTranslation("settings");
  const [autoLogout, setAutoLogout] = useState("never");
  const [msLeft, setMsLeft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const boxRef = useRef();

  // 1. Один раз — пробуем восстановить сессию из localStorage
  useEffect(() => {
    const session = getSessionFromStorage();

    // Проверяем не истек ли auto_refetch
    let expired = false;
    if (session && session.auto_refetch && session.startTimestamp) {
      const refetchMs = Number(session.auto_refetch) * 60 * 1000;
      expired = Date.now() - session.startTimestamp > refetchMs;
    } else {
      expired = true;
    }

    if (session && session.auto_logout_minutes && !expired) {
      setAutoLogout(session.auto_logout_minutes);
      if (session.auto_logout_minutes === "never") {
        setMsLeft(null);
      } else {
        const totalMs = Number(session.auto_logout_minutes) * 60 * 1000;
        const passed = Date.now() - session.startTimestamp;
        setMsLeft(Math.max(totalMs - passed, 0));
      }
      setLoading(false);
    } else {
      // Если нет сессии или истекло время — fetch с API
      setLoading(true);
      fetch(API_URL, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => res.json())
        .then((s) => {
          const v = s.auto_logout_minutes || "never";
          const refetch = s.auto_refetch || v;
          setAutoLogout(v);
          if (v === "never") {
            setMsLeft(null);
          } else {
            setMsLeft(Number(v) * 60 * 1000);
          }
          saveSessionToStorage({ auto_logout_minutes: v, auto_refetch: refetch });
        })
        .finally(() => setLoading(false));
    }
  }, []);

  // 2. Локальный таймер
  useEffect(() => {
    if (msLeft === null || isNaN(msLeft)) {
      return;
    }
    if (msLeft <= 0) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    const timer = setTimeout(() => setMsLeft((prev) => prev - 1000), 1000);
    return () => clearTimeout(timer);
  }, [msLeft]);

  // 3. Смена опции — PUT + старт нового таймера
  const handleSelect = (newValue) => {
    setLoading(true);
    fetch(API_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ auto_logout_minutes: newValue }),
    })
      .then((res) => res.json())
      .then((s) => {
        const v = s.auto_logout_minutes || newValue;
        const refetch = s.auto_refetch || v;
        setAutoLogout(v);
        if (v === "never") {
          setMsLeft(null);
        } else {
          setMsLeft(Number(v) * 60 * 1000);
        }
        saveSessionToStorage({ auto_logout_minutes: v, auto_refetch: refetch });
        setOpen(false);
      })
      .finally(() => setLoading(false));
  };

  // Клик вне
  useEffect(() => {
    function handler(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Helpers
  function formatTime(ms) {
    if (!ms || ms <= 0) return "00:00";
    const total = Math.floor(ms / 1000);
    const min = Math.floor(total / 60);
    const sec = total % 60;
    if (total >= 3600) {
      const hr = Math.floor(total / 3600);
      const remMin = Math.floor((total % 3600) / 60);
      return `${hr}:${remMin.toString().padStart(2, "0")}:${sec
        .toString()
        .padStart(2, "0")}`;
    }
    return `${min.toString().padStart(2, "0")}:${sec
      .toString()
      .padStart(2, "0")}`;
  }

  function formatLabel(value) {
    const item = OPTIONS.find((o) => o.value === value);
    if (!item) return "";
    if (value === "never") return t("session_unlimited");
    return t("autologout_after", { label: t(item.labelKey) }) || t(item.labelKey);
  }

  // Вычисляем процент времени
  const value = autoLogout;
  const total = value === "never" ? 1 : Number(value) * 60 * 1000;
  const percent = msLeft && total ? msLeft / total : 1;

  return (
    <div className="w-full bg-gradient-to-br from-gray-900 via-slate-900 to-black flex items-center justify-center rounded-3xl">
      {/* Декоративные неоновые элементы */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-400/5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-blue-400/3 rounded-full blur-2xl"></div>

      {/* Liquid Glass Container */}
      <div 
        className="relative backdrop-blur-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/20 rounded-3xl w-full"
        style={{
          background: `
            linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, transparent 100%),
            linear-gradient(225deg, rgba(6,182,212,0.1) 0%, rgba(147,51,234,0.1) 50%, rgba(59,130,246,0.1) 100%)
          `,
          boxShadow: `
            0 8px 32px rgba(0,0,0,0.3),
            0 0 0 1px rgba(255,255,255,0.1),
            inset 0 1px 0 rgba(255,255,255,0.2),
            inset 0 -1px 0 rgba(0,0,0,0.1)
          `,
          backdropFilter: 'blur(20px) saturate(180%)'
        }}
      >
        {/* Стеклянный блик сверху */}
        <div 
          className="absolute top-0 left-0 right-0 h-1/2 opacity-20"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 100%)'
          }}
        />

        {/* Основной контент */}
        <div className="relative p-8 flex flex-col items-center justify-center min-h-[400px]">
          
          {/* Header с иконкой */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              {/* Неоновые эффекты для иконки */}
              <div className="absolute inset-0 bg-cyan-400/20 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute inset-0 bg-blue-400/10 rounded-full blur-2xl"></div>
              
              <div className="relative bg-gray-800/30 backdrop-blur-sm border border-cyan-400/30 p-4 rounded-2xl">
                <div className="flex items-center gap-2">
                  <TimerReset 
                    className="text-cyan-400 w-8 h-8" 
                    style={{ filter: 'drop-shadow(0 0 12px #06b6d4)' }} 
                  />
                  <Clock 
                    className="text-blue-400 w-6 h-6" 
                    style={{ filter: 'drop-shadow(0 0 8px #3b82f6)' }} 
                  />
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white text-center"
                style={{ textShadow: '0 0 20px rgba(6, 182, 212, 0.5)' }}>
              {t("autologout")}
            </h2>
            <p className="text-cyan-400 text-sm mt-2 text-center opacity-80">
              {t("session_management")}
            </p>
          </div>

          {/* Кастомный дропдаун в стиле Liquid Glass */}
          <div ref={boxRef} className="relative w-full mb-8 z-[9999]">
            <button
              type="button"
              className={`
                w-full px-6 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 group
                backdrop-blur-xl bg-gradient-to-r from-white/10 to-white/5 
                border border-white/20 text-white flex items-center justify-between
                hover:from-cyan-400/20 hover:to-blue-400/20 hover:border-cyan-400/40
                disabled:opacity-50 disabled:cursor-not-allowed
                ${open ? 'from-cyan-400/20 to-blue-400/20 border-cyan-400/40' : ''}
              `}
              onClick={() => setOpen((v) => !v)}
              disabled={loading}
              style={{
                boxShadow: open 
                  ? '0 0 30px rgba(6, 182, 212, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)' 
                  : '0 8px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
              }}
            >
              <span className="flex items-center gap-3">
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
                    {t("loading")}
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 text-cyan-400" 
                         style={{ filter: 'drop-shadow(0 0 8px #06b6d4)' }} />
                    {t(OPTIONS.find((o) => o.value === value)?.labelKey) || t("select")}
                  </>
                )}
              </span>
              
              <ChevronDown 
                className={`w-5 h-5 text-cyan-400 transition-transform duration-300 ${
                  open ? 'rotate-180' : ''
                }`}
                style={{ filter: 'drop-shadow(0 0 8px #06b6d4)' }}
              />
            </button>

            {/* Выпадающий список */}
            {open && !loading && (
              <div
                className="absolute left-0 right-0 mt-3 z-[10000] backdrop-blur-3xl rounded-2xl p-5 transform transition-all duration-300 ease-out"
                style={{
                  background: `
                    linear-gradient(135deg, rgba(17,24,39,0.95) 0%, rgba(31,41,55,0.9) 50%, rgba(17,24,39,0.95) 100%),
                    linear-gradient(225deg, rgba(6,182,212,0.2) 0%, rgba(59,130,246,0.2) 50%, rgba(147,51,234,0.2) 100%)
                  `,
                  border: '2px solid rgba(6,182,212,0.4)',
                  boxShadow: `
                    0 25px 50px rgba(0,0,0,0.8),
                    0 0 0 1px rgba(6,182,212,0.3),
                    0 0 40px rgba(6,182,212,0.2),
                    inset 0 1px 0 rgba(255,255,255,0.1),
                    inset 0 -1px 0 rgba(0,0,0,0.2)
                  `,
                  backdropFilter: 'blur(25px) saturate(200%)'
                }}
              >
                {/* Декоративная верхняя полоска */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.8), rgba(59,130,246,0.8), rgba(147,51,234,0.8), transparent)'
                  }}
                />
                
                <div className="grid grid-cols-3 gap-4">
                  {OPTIONS.map((opt) => {
                    const selected = value === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => handleSelect(opt.value)}
                        className={`
                          relative flex flex-col items-center justify-center px-3 py-4 rounded-xl transition-all duration-300 font-semibold text-sm group
                          ${selected
                            ? "bg-gradient-to-br from-cyan-400/40 to-blue-500/40 border-2 border-cyan-400/60 text-white transform scale-105 shadow-lg"
                            : "bg-gray-800/60 border-2 border-gray-600/40 text-gray-200 hover:bg-gradient-to-br hover:from-cyan-400/20 hover:to-blue-400/20 hover:border-cyan-400/50 hover:text-white hover:scale-102"
                          }
                        `}
                        style={{
                          minHeight: 80,
                          boxShadow: selected 
                            ? '0 0 25px rgba(6, 182, 212, 0.6), inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.2)' 
                            : '0 8px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.2)',
                          textShadow: selected ? '0 0 12px rgba(255,255,255,0.8)' : '0 1px 2px rgba(0,0,0,0.8)'
                        }}
                      >
                        {/* Фоновое свечение для выбранного элемента */}
                        {selected && (
                          <div 
                            className="absolute inset-0 rounded-xl opacity-30"
                            style={{
                              background: 'radial-gradient(circle at center, rgba(6,182,212,0.4) 0%, transparent 70%)'
                            }}
                          />
                        )}
                        
                        {/* Искорка для выбранного элемента */}
                        {selected && (
                          <div className="absolute top-2 right-2 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"
                               style={{ boxShadow: '0 0 12px #06b6d4' }} />
                        )}
                        
                        {/* Hover эффект */}
                        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                             style={{
                               background: 'linear-gradient(135deg, rgba(6,182,212,0.1) 0%, rgba(59,130,246,0.1) 100%)'
                             }}
                        />
                        
                        <span className="relative text-center leading-tight font-medium">
                          {t(opt.labelKey)}
                        </span>
                      </button>
                    );
                  })}
                </div>
                
                {/* Декоративная нижняя полоска */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(147,51,234,0.6), rgba(59,130,246,0.6), rgba(6,182,212,0.6), transparent)'
                  }}
                />
              </div>
            )}
          </div>

          {/* Прогресс бар и информация */}
          {!loading && value !== "never" && (
            <div className="w-full">
              {/* Liquid Glass прогресс контейнер */}
              <div 
                className="w-full h-12 rounded-2xl mb-4 relative backdrop-blur-sm"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.2)'
                }}
              >
                {/* Анимированный прогресс */}
                <div
                  className="h-full transition-all duration-700 ease-out relative rounded-2xl"
                  style={{
                    width: `${Math.max(percent * 100, 0)}%`,
                    background: `
                      linear-gradient(135deg, 
                        rgba(6,182,212,0.8) 0%, 
                        rgba(59,130,246,0.8) 50%, 
                        rgba(147,51,234,0.8) 100%
                      )
                    `,
                    boxShadow: `
                      0 0 20px rgba(6,182,212,0.4),
                      inset 0 1px 0 rgba(255,255,255,0.2),
                      inset 0 -1px 0 rgba(0,0,0,0.1)
                    `,
                  }}
                >
                  {/* Стеклянный блик на прогрессе */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-1/2 opacity-40"
                    style={{
                      background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)'
                    }}
                  />
                  
                  {/* Движущийся блик */}
                  <div 
                    className="absolute top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"
                    style={{
                      left: `${Math.max(percent * 100 - 10, 0)}%`,
                      filter: 'blur(1px)'
                    }}
                  />

                  {/* Индикатор на конце */}
                  {percent > 0.05 && (
                    <div
                      className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-white/50 backdrop-blur-sm"
                      style={{
                        background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 100%)',
                        boxShadow: '0 0 15px rgba(6,182,212,0.5), inset 0 1px 0 rgba(255,255,255,0.3)'
                      }}
                    />
                  )}
                </div>

                {/* Время по центру */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span 
                    className="text-xl font-bold text-white tracking-wider"
                    style={{ 
                      textShadow: '0 0 15px rgba(0,0,0,0.8), 0 0 30px rgba(6,182,212,0.5)',
                      filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.3))'
                    }}
                  >
                    {formatTime(msLeft || 0)}
                  </span>
                </div>
              </div>

              {/* Описание */}
              <div className="text-center">
                <span className="text-cyan-400 font-medium">
                  {percent <= 0 ? t("session_finished") : formatLabel(value)}
                </span>
              </div>
            </div>
          )}

          {/* Безлимитная сессия */}
          {!loading && value === "never" && (
            <div className="text-center">
              <div 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl backdrop-blur-sm"
                style={{
                  background: 'linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(16,185,129,0.1) 100%)',
                  border: '1px solid rgba(34,197,94,0.2)',
                  boxShadow: '0 8px 16px rgba(34,197,94,0.1), inset 0 1px 0 rgba(255,255,255,0.1)'
                }}
              >
                <Zap className="w-5 h-5 text-emerald-400" 
                     style={{ filter: 'drop-shadow(0 0 8px #10b981)' }} />
                <span className="text-emerald-400 font-semibold">
                  {t("session_unlimited")}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Нижний блик */}
        <div 
          className="absolute bottom-0 left-0 right-0 h-1/3 opacity-10"
          style={{
            background: 'linear-gradient(0deg, rgba(255,255,255,0.1) 0%, transparent 100%)'
          }}
        />
      </div>

      {/* CSS для дополнительных анимаций */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes liquidShimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          @keyframes glassFloat {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-3px) rotate(1deg); }
          }
          
          .animate-liquid-shimmer {
            animation: liquidShimmer 3s ease-in-out infinite;
          }
          
          .animate-glass-float {
            animation: glassFloat 4s ease-in-out infinite;
          }
          
          .hover\\:scale-102:hover {
            transform: scale(1.02);
          }
        `
      }} />
    </div>
  );
};

export default AutoLogoutSelector;