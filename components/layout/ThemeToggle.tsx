"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-[62px] h-[28px] rounded-full border border-border opacity-0" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative rounded-full bg-white dark:bg-black text-black dark:text-white px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] hover:opacity-90 transition-all duration-300 shadow-sm active:scale-95"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? "Light" : "Dark"}
    </button>
  );
}
