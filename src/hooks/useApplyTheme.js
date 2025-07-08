// hooks/useApplyTheme.js
import { useEffect } from "react";

export default function useApplyTheme(theme) {
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);
}
