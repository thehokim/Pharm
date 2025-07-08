import React from "react";

// Современный toggle, без inline label
function Toggle({ checked, onChange, color = "#2979FF", hideInlineLabel }) {
  return (
    <button
      type="button"
      aria-label="toggle"
      onClick={() => onChange(!checked)}
      className="relative w-[88px] h-[44px] flex items-center rounded-full border-2 transition-colors duration-200"
      style={{
        background: checked ? color : "#E5E8EF",
        borderColor: checked ? color : "#E5E8EF",
        boxShadow: checked
          ? "0 6px 24px 0 #2979FF22, 0 1.5px 4px #2979FF22"
          : "0 2px 8px #E5E8EF88",
        outline: "none",
      }}
    >
      {/* Бегунок */}
      <span
        className="absolute top-1/2 -translate-y-1/2 w-[36px] h-[36px] rounded-full shadow-md transition-all duration-300"
        style={{
          left: checked ? "44px" : "4px",
          background: "#fff",
        }}
      />
      {/* Нет текста в самом тоггле! */}
      <span className="w-full h-full block opacity-0 absolute inset-0 cursor-pointer z-20" />
    </button>
  );
}

export default Toggle;
