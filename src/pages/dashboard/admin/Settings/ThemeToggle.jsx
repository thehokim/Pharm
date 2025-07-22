import React from "react";

// SVG Солнце
const SunIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="#"
  >
    <g clipPath="url(#clip0_1611_4242)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.99988 5.25C6.92881 5.25 5.24988 6.92893 5.24988 9C5.24988 11.0711 6.92881 12.75 8.99988 12.75C11.0709 12.75 12.7499 11.0711 12.7499 9C12.7499 6.92893 11.0709 5.25 8.99988 5.25ZM3.74988 9C3.74988 6.1005 6.10038 3.75 8.99988 3.75C11.8994 3.75 14.2499 6.1005 14.2499 9C14.2499 11.8995 11.8994 14.25 8.99988 14.25C6.10038 14.25 3.74988 11.8995 3.74988 9Z"
        fill="#fbbf24"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.24988 3V0.75H9.74988V3H8.24988Z"
        fill="#fbbf24"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.7122 4.22703L14.3032 2.63604L15.3639 3.6967L13.7729 5.28769L12.7122 4.22703Z"
        fill="#fbbf24"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.9999 8.25H17.2499V9.75H14.9999V8.25Z"
        fill="#fbbf24"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.7729 12.7123L15.3639 14.3033L14.3032 15.364L12.7122 13.773L13.7729 12.7123Z"
        fill="#fbbf24"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.24988 17.25V15H9.74988V17.25H8.24988Z"
        fill="#fbbf24"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2.63591 14.3033L4.2269 12.7123L5.28756 13.773L3.69657 15.364L2.63591 14.3033Z"
        fill="#fbbf24"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.749878 8.25H2.99988V9.75H0.749878L0.749878 8.25Z"
        fill="#fbbf24"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.69657 2.63603L5.28756 4.22702L4.2269 5.28768L2.63591 3.69669L3.69657 2.63603Z"
        fill="#fbbf24"
      />
    </g>
    <defs>
      <clipPath id="clip0_1611_4242">
        <rect width="24" height="24" fill="#fbbf24" />
      </clipPath>
    </defs>
  </svg>
);

// SVG Луна
const MoonIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_1611_4239)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.74695 1.78908C4.24028 2.48442 1.63636 5.46984 1.63636 9C1.63636 13.0382 5.04375 16.3636 9.31205 16.3636C11.6757 16.3636 13.7809 15.3404 15.1855 13.7405C14.661 13.851 14.1167 13.9091 13.559 13.9091C9.38342 13.9091 5.94571 10.6409 5.94571 6.54545C5.94571 4.727 6.62628 3.06878 7.74695 1.78908ZM0 9C0 4.00084 4.19828 0 9.31205 0C9.63455 0 9.95347 0.0158719 10.268 0.0468976C10.6246 0.0820799 10.9169 0.345274 10.9891 0.696309C11.0613 1.04734 10.8966 1.4045 10.5828 1.57758C8.77796 2.57294 7.58207 4.43283 7.58207 6.54545C7.58207 9.67994 10.2289 12.2727 13.559 12.2727C14.7381 12.2727 15.8338 11.9463 16.7567 11.385C17.06 11.2005 17.4477 11.2327 17.7165 11.4647C17.9852 11.6967 18.0737 12.0756 17.9354 12.4026C16.5423 15.6979 13.1965 18 9.31205 18C4.19828 18 0 13.9992 0 9Z"
        fill="#e2e8f0"
      />
    </g>
    <defs>
      <clipPath id="clip0_1611_4239">
        <rect width="24" height="24" fill="#e2e8f0" />
      </clipPath>
    </defs>
  </svg>
);

function ThemeToggle({ value, onChange }) {
  // Основные размеры (как в макете): width = 92px, height = 48px, бегунок = 40px
  return (
    <button
      type="button"
      aria-label="Переключить тему"
      onClick={() => onChange(!value)}
      className="relative z-0 flex items-center w-[92px] h-[48px] rounded-full backdrop-blur-md border border-white/20 transition-all duration-300 hover:border-white/30"
      style={{
        boxSizing: "border-box",
        padding: 0,
        background: 'rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
      }}
    >
      {/* Акцентный бегунок */}
      <span
        className="absolute top-1/2 -translate-y-1/2 w-[40px] h-[40px] rounded-full transition-all duration-300 shadow-lg"
        style={{
          left: value ? "48px" : "4px",
          background: value 
            ? 'linear-gradient(135deg, #1e293b, #334155)' 
            : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
          boxShadow: value 
            ? '0 4px 12px rgba(30, 41, 59, 0.4), 0 2px 4px rgba(0, 0, 0, 0.2)' 
            : '0 4px 12px rgba(251, 191, 36, 0.4), 0 2px 4px rgba(0, 0, 0, 0.2)',
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Иконка на бегунке */}
        <span className="text-white">
          {value ? <MoonIcon /> : <SunIcon />}
        </span>
      </span>
      
      {/* Солнце (слева) - показываем только когда неактивно */}
      <span 
        className={`absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none transition-opacity duration-300 ${
          value ? 'opacity-30' : 'opacity-0'
        }`}
      >
        <SunIcon />
      </span>
      
      {/* Луна (справа) - показываем только когда неактивно */}
      <span 
        className={`absolute right-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none transition-opacity duration-300 ${
          !value ? 'opacity-30' : 'opacity-0'
        }`}
      >
        <MoonIcon />
      </span>
      
      {/* Прозрачный слой для клика */}
      <span className="w-full h-full block opacity-0 absolute inset-0 cursor-pointer z-20" />
    </button>
  );
}

export default ThemeToggle;