"use client";
import { useEffect } from "react";

export interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = "info", onClose, duration = 3500 }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  return (
    <div
      className={`fixed z-[9999] bottom-8 left-1/2 -translate-x-1/2 px-6 py-4 rounded-xl shadow-lg text-white font-semibold text-base animate-fade-in-up transition-all
        ${type === "success" ? "bg-green-600" : type === "error" ? "bg-red-600" : "bg-indigo-600"}
      `}
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
