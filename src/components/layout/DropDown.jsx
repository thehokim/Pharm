import React, { useState, useRef, useEffect } from "react";

export default function DropDown({
  value,
  onChange,
  options,
  placeholder = "",
  labelRenderer,
  disabled,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const selected = options.find((opt) => opt.value === value);

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        disabled={disabled}
        type="button"
        className={`w-full border px-3 py-2 rounded-lg bg-gray-50 flex justify-between items-center ${
          open ? "border-blue-500" : "border-gray-300"
        }`}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={`${!selected ? "text-gray-400" : ""}`}>
          {selected
            ? labelRenderer
              ? labelRenderer(selected)
              : selected.label || selected.labelKey
            : placeholder}
        </span>
        <svg
          className="ml-2 h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-10 left-0 right-0 bg-white border border-gray-300 rounded-lg mt-2 shadow">
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`px-4 py-2 cursor-pointer hover:bg-indigo-50 rounded-lg ${
                opt.value === value ? "bg-indigo-100 font-medium" : ""
              }`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {labelRenderer ? labelRenderer(opt) : opt.label || opt.labelKey}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
