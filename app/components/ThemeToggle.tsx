"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-11 w-11 rounded-full border border-black/10 bg-white/60 dark:border-white/15 dark:bg-white/5" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="group flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white/70 text-xl shadow-sm backdrop-blur-xl transition hover:scale-105 hover:bg-white dark:border-white/15 dark:bg-white/10 dark:hover:bg-white/20"
      aria-label={
        isDark
          ? "Chuyển sang giao diện sáng"
          : "Chuyển sang giao diện tối"
      }
      title={
        isDark
          ? "Chuyển sang giao diện sáng"
          : "Chuyển sang giao diện tối"
      }
    >
      <span className="transition-transform duration-300 group-hover:rotate-12">
        {isDark ? "☀️" : "🌙"}
      </span>
    </button>
  );
}