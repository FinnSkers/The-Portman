"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);
  return (
    <button
      aria-label="Toggle dark mode"
      className="fixed bottom-6 left-6 z-50 bg-gray-900/80 dark:bg-gray-800/80 rounded-full p-3 shadow-lg hover:bg-gray-700 transition-colors"
      onClick={() => setDark((d) => !d)}
    >
      {dark ? <Sun className="w-6 h-6 text-yellow-400" /> : <Moon className="w-6 h-6 text-blue-700" />}
    </button>
  );
}
