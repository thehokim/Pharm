import React from "react";
import ThemeToggle from "./ThemeToggle";
import { Sun } from "lucide-react";
import { useTranslation } from "react-i18next";

const ThemeSelector = ({ theme, setTheme }) => {
  const { t } = useTranslation("settings");
  return (
    <div className="bg-blue-50 rounded-2xl px-6 py-8 flex flex-col gap-4 items-center">
      <div className="font-bold flex items-center justify-center gap-3 text-gray-700 text-xl mb-2">
        <Sun className="stroke-blue-500 stroke-2 w-7 h-7"/>
        {t("theme")}
      </div>
      <ThemeToggle value={theme === "dark"} onChange={v => setTheme(v ? "dark" : "light")} />
      <div className="text-base mt-2 text-[#64b5f6] pl-1">
        {theme === "light" ? t("light") : t("dark")}
      </div>
    </div>
  );
};

export default ThemeSelector;
