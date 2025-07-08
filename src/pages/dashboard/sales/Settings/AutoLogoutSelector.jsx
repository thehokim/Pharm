import React, { useState, useRef, useEffect } from "react";
import { TimerReset } from "lucide-react";
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
      // localStorage.removeItem(STORAGE_KEY);
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
    <div className="bg-blue-50 rounded-2xl w-full px-8 py-7 flex flex-col items-center justify-center min-h-[240px] relative">
      <div className="flex flex-col items-center mb-4">
        <div className="flex gap-2">
          <TimerReset className="text-blue-500 w-7 h-7 mb-" />
          <span className="font-extrabold text-[#2F3747] text-2xl text-center leading-tight">
            {t("autologout")}
          </span>
        </div>
      </div>
      {/* Кастомный дропдаун */}
      <div ref={boxRef} className="relative w-full max-w-[320px] mb-6">
        <button
          type="button"
          className="w-full px-5 py-4 rounded-xl bg-white border border-gray-200 text-lg font-semibold flex items-center justify-between transition ring-2 ring-transparent hover:ring-blue-200 focus:ring-blue-400 outline-none"
          onClick={() => setOpen((v) => !v)}
          style={{ minHeight: 56 }}
          disabled={loading}
        >
          <span>
            {loading
              ? t("loading")
              : t(OPTIONS.find((o) => o.value === value)?.labelKey) ||
                t("select")}
          </span>
          <svg
            width="22"
            height="22"
            fill="none"
            stroke="#9CA3AF"
            viewBox="0 0 24 24"
          >
            <path
              d="M6 9l6 6 6-6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {open && !loading && (
          <div
            className="absolute left-0 right-0 mt-3 z-30 rounded-3xl bg-white p-4 transition-all"
            style={{ minWidth: 320 }}
          >
            <div className="grid grid-cols-3 gap-2">
              {OPTIONS.map((opt) => {
                const selected = value === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={`
                      flex flex-col items-center justify-center px-2 py-2 rounded-2xl transition font-semibold text-sm leading-tight
                      ${
                        selected
                          ? "bg-blue-500 font-bold border-2 border-[#1764FF] text-white"
                          : "bg-[#F6F8FA] text-[#353C49] hover:bg-blue-100"
                      }
                    `}
                    style={{
                      minHeight: 70,
                      minWidth: 94,
                      outline: "none",
                      boxShadow: selected ? "0 4px 16px #1764FF11" : "none",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: selected ? 700 : 500,
                        fontSize: 16,
                        lineHeight: "1.2",
                        textAlign: "center",
                      }}
                    >
                      {t(opt.labelKey)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {!loading && value !== "never" && (
        <div className="w-full flex flex-col items-center mt-1">
          <div className="w-full bg-[#E5E8EF] rounded-full h-8 relative mb-2 shadow-inner overflow-hidden flex items-center">
            <div
              className="transition-all duration-700 h-full rounded-full flex items-center"
              style={{
                width: `${Math.max(percent * 100, 0)}%`,
                background: "linear-gradient(90deg, #4F8DFD 30%, #2979FF 90%)",
                boxShadow: "0 2px 16px #4F8DFD55",
                position: "relative",
              }}
            >
              <div
                style={{
                  display: percent > 0.03 ? "block" : "none",
                  position: "absolute",
                  right: "0px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 32,
                  height: 32,
                  borderRadius: 32,
                  background: "#fff",
                  border: "5px solid #2979FF",
                  boxShadow: "0 2px 8px #2979FF44",
                  zIndex: 1,
                }}
              />
            </div>
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-extrabold text-white tracking-widest drop-shadow">
              {formatTime(msLeft || 0)}
            </span>
          </div>
          <div className="text-blue-400 text-base font-medium mt-1 text-center">
            {percent <= 0
              ? t("session_finished")
              : formatLabel(value)}
          </div>
        </div>
      )}
      {!loading && value === "never" && (
        <div className="mt-4 text-base text-blue-400 font-medium text-center">
          {t("session_unlimited")}
        </div>
      )}
    </div>
  );
};

export default AutoLogoutSelector;
