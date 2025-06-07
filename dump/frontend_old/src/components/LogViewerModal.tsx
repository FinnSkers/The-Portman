"use client";
import React, { useEffect, useState } from "react";
import GlassCard from "./GlassCard";

export default function LogViewerModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch("/api/logs")
      .then((res) => res.json())
      .then((data) => {
        setLogs(data.logs || []);
        setError(null);
      })
      .catch((err) => setError("Failed to load logs"))
      .finally(() => setLoading(false));
  }, [open]);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
      <div className="relative w-full max-w-2xl mx-auto">
        <GlassCard className="w-full max-h-[70vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg">
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-xl font-bold z-10"
            onClick={onClose}
            aria-label="Close log viewer"
          >
            ×
          </button>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">System Logs</h2>
          {loading ? (
            <div className="text-center text-gray-500 py-8">Loading logs...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : logs.length === 0 ? (
            <div className="text-center text-gray-400 py-8">No logs found.</div>
          ) : (
            <ul className="space-y-2">
              {logs.map((log, i) => (
                <li key={i} className="rounded bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-mono text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
                  {log.timestamp && (
                    <span className="text-xs text-indigo-500 mr-2">[{log.timestamp}]</span>
                  )}
                  {log.error && (
                    <span className="text-red-500 font-semibold">{log.error}</span>
                  )}
                  {log.details && (
                    <span className="ml-2 text-gray-600 dark:text-gray-300">{log.details}</span>
                  )}
                  {log.raw && (
                    <span>{log.raw}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
