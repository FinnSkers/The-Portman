"use client";
import React, { useState, useEffect, useRef } from "react";
import { CheckCircle, XCircle, Loader2, Server, ChevronDown, ChevronUp, Info, List } from "lucide-react";

// List of backend endpoints to check
const ENDPOINTS = [
  { name: "CV Upload", url: "/api/v1/cv/upload/", method: "OPTIONS" },
  { name: "CV Parse", url: "/api/v1/cv/parse/", method: "OPTIONS" },
  { name: "Portfolio", url: "/api/v1/portfolio/", method: "OPTIONS" },
  { name: "ATS Resume", url: "/api/v1/ats/", method: "OPTIONS" },
  { name: "Analytics", url: "/api/v1/analytics/", method: "OPTIONS" },
  { name: "Logs", url: "/api/v1/logs/", method: "OPTIONS" },
  { name: "Health", url: "/healthz", method: "GET" },
];

async function checkEndpoint(endpoint: { name: string; url: string; method: string }) {
  try {
    const res = await fetch(endpoint.url, { method: endpoint.method });
    // Treat 2xx as healthy for all, and 405 as healthy for OPTIONS requests (common for file upload endpoints)
    if (res.ok) return true;
    if (endpoint.method === "OPTIONS" && res.status === 405) return true;
    return false;
  } catch {
    return false;
  }
}

interface ProcessLogEntry {
  message: string;
  details?: string;
  status: "processing" | "success" | "error";
  timestamp: number;
}

export default function StatusPopup() {
  const [open, setOpen] = useState(true);
  const [showLogModal, setShowLogModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [endpointStatus, setEndpointStatus] = useState<{
    [key: string]: { healthy: boolean; status: number | null; checked: number | null }
  }>({});
  const [log, setLog] = useState<ProcessLogEntry[]>([]);
  const [visible, setVisible] = useState(true); // for fade-out
  const logEndRef = useRef<HTMLDivElement>(null);

  // Add a manual refresh trigger
  const pollAll = async () => {
    setRefreshing(true);
    const results = await Promise.all(
      ENDPOINTS.map(async (ep) => {
        try {
          const res = await fetch(ep.url, { method: ep.method });
          let healthy = false;
          if (res.ok) healthy = true;
          if (ep.method === "OPTIONS" && res.status === 405) healthy = true;
          return [ep.name, { healthy, status: res.status, checked: Date.now() }];
        } catch {
          return [ep.name, { healthy: false, status: null, checked: Date.now() }];
        }
      })
    );
    setEndpointStatus(Object.fromEntries(results));
    setRefreshing(false);
  };

  // Automated backend health check for all endpoints
  useEffect(() => {
    let mounted = true;
    pollAll();
    const interval = setInterval(() => mounted && pollAll(), 10000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  // Listen for process events
  useEffect(() => {
    function onProcessing(e: CustomEvent) {
      const entry: ProcessLogEntry = {
        message: e.detail?.message || "Processing...",
        details: e.detail?.details || "",
        status: e.detail?.status || "processing",
        timestamp: Date.now(),
      };
      setLog((prev) => [...prev, entry].slice(-20)); // keep last 20
    }
    window.addEventListener("portman-processing", onProcessing as any);
    return () => window.removeEventListener("portman-processing", onProcessing as any);
  }, []);

  // Scroll to end on new log
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth", inline: "end" });
    }
  }, [log]);

  // Compute summary
  const allOk = ENDPOINTS.every((ep) => endpointStatus[ep.name]?.healthy);
  const failed = ENDPOINTS.filter((ep) => endpointStatus[ep.name]?.healthy === false);
  const current = log.length ? log[log.length - 1] : null;

  // When closing, fade out before unmounting
  function handleClose() {
    setVisible(false);
    setTimeout(() => setOpen(false), 350); // match fade duration
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Status Popup */}
      {open ? (
        <div
          className={`bg-white/90 dark:bg-gray-900/90 shadow-2xl rounded-3xl px-8 py-6 min-w-[380px] max-w-[98vw] border border-blue-300 dark:border-blue-800 flex flex-col gap-4 transition-all duration-300 ease-out animate-fadein ${!visible ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          style={{ transform: visible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)', opacity: visible ? 1 : 0 }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-2 w-full">
            <Server className="w-6 h-6 text-blue-500 animate-pulse" />
            <span className="font-bold text-lg text-blue-700 dark:text-blue-200 tracking-tight">PORTMAN Status</span>
            <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold ${allOk ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{allOk ? 'Online' : 'Issues'}</span>
            <button
              className="ml-auto text-xs px-3 py-1 rounded-lg bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-700 transition border border-blue-200 dark:border-blue-700 mr-2 font-medium"
              onClick={pollAll}
              disabled={refreshing}
              aria-label="Refresh health checks"
            >
              {refreshing ? <Loader2 className="w-4 h-4 animate-spin inline" /> : "Refresh"}
            </button>
            <button
              className="text-gray-400 hover:text-blue-500 transition"
              onClick={handleClose}
              aria-label="Minimize status popup"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
          {/* Endpoint Status Row */}
          <div className="flex flex-row flex-wrap gap-2 items-center justify-between w-full">
            {ENDPOINTS.map((ep) => {
              const status = endpointStatus[ep.name];
              const healthy = status?.healthy;
              const code = status?.status;
              return (
                <div
                  key={ep.name}
                  className={`flex items-center gap-2 px-3 py-1 rounded-lg border text-xs font-medium shadow-sm transition-all duration-200 min-w-[120px] max-w-[180px] truncate ${
                    healthy === true
                      ? "border-green-300 bg-green-50 dark:bg-green-900/30 text-green-700"
                      : healthy === false
                      ? "border-red-300 bg-red-50 dark:bg-red-900/30 text-red-700"
                      : "border-gray-200 dark:border-gray-700 text-gray-700"
                  }`}
                  title={`Status: ${healthy ? 'Healthy' : 'Unreachable'}\nHTTP: ${code ?? '-'}\n${ep.url}`}
                >
                  {healthy ? <CheckCircle className="w-3 h-3 text-green-500" /> : <XCircle className="w-3 h-3 text-red-500" />}
                  <span className="truncate max-w-[80px]">{ep.name}</span>
                  <span className="ml-1 font-mono text-[11px]">{code ?? '-'}</span>
                </div>
              );
            })}
          </div>
          {/* Details & Process */}
          <div className="flex flex-row items-center gap-6 justify-between w-full mt-2">
            {/* Backend Health Summary */}
            <div className="flex flex-col items-start flex-1 min-w-[140px] gap-1">
              <div className="flex items-center gap-1">
                {allOk ? (
                  <CheckCircle className="w-4 h-4 text-green-500 animate-pulse" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500 animate-pulse" />
                )}
                <span className={`font-semibold ${allOk ? "text-green-700" : "text-red-700"}`}>Backend</span>
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-300">
                {allOk ? "All systems operational" : `${failed.length} endpoint(s) down`}
              </span>
              <button
                className="mt-1 text-xs text-blue-600 dark:text-blue-300 hover:underline flex items-center gap-1"
                onClick={() => setShowLogModal(true)}
                aria-label="Show full log details"
              >
                <List className="w-4 h-4" /> Details
              </button>
            </div>
            {/* Current Process */}
            <div className="flex flex-col items-start flex-1 min-w-[120px] gap-1">
              <div className="flex items-center gap-1">
                {current && current.status === "processing" ? (
                  <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                ) : current && current.status === "success" ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : current && current.status === "error" ? (
                  <XCircle className="w-4 h-4 text-red-500" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
                <span className="font-semibold text-blue-700">Process</span>
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-300">
                {current ? current.message : "Idle. All APIs connected."}
              </span>
              {current && current.details && (
                <span className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 max-w-[180px] truncate">{current.details}</span>
              )}
            </div>
          </div>
          {/* Process Log */}
          <div className="mt-2">
            <div className="text-xs font-semibold text-blue-700 dark:text-blue-200 mb-1">Recent Activity</div>
            <div className="flex flex-row gap-3 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-blue-300/40 scrollbar-track-transparent">
              {log.map((entry, i) => (
                <div
                  key={i}
                  className={`rounded-xl px-3 py-2 min-w-[160px] shadow border flex flex-col gap-1 transition-all duration-300 ease-out ${
                    i === log.length - 1
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/40"
                      : entry.status === "success"
                      ? "border-green-400 bg-green-50 dark:bg-green-900/30"
                      : entry.status === "error"
                      ? "border-red-400 bg-red-50 dark:bg-red-900/30"
                      : "border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80"
                  }`}
                  style={{ opacity: log.length ? 1 : 0, transform: log.length ? 'translateY(0)' : 'translateY(10px)' }}
                >
                  <div className="flex items-center gap-1">
                    {entry.status === "processing" && <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />}
                    {entry.status === "success" && <CheckCircle className="w-3 h-3 text-green-500" />}
                    {entry.status === "error" && <XCircle className="w-3 h-3 text-red-500" />}
                    <span className="font-medium text-xs truncate max-w-[90px]">{entry.message}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                  {entry.details && (
                    <span className="text-[11px] text-gray-700 dark:text-gray-300 truncate max-w-[120px]">{entry.details}</span>
                  )}
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>
          {/* Log Modal */}
          {showLogModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fadein">
              <div
                className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-blue-400 dark:border-blue-700 transition-all duration-300 ease-out animate-fadein"
                style={{ transform: showLogModal ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(40px)', opacity: showLogModal ? 1 : 0 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <List className="w-6 h-6 text-blue-500" />
                    <span className="font-bold text-lg text-blue-700 dark:text-blue-200">PORTMAN Backend Health</span>
                  </div>
                  <button
                    className="text-gray-400 hover:text-blue-500 transition"
                    onClick={() => setShowLogModal(false)}
                    aria-label="Close log modal"
                  >
                    <ChevronDown className="w-6 h-6" />
                  </button>
                </div>
                <div className="mb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {ENDPOINTS.map((ep) => {
                      const status = endpointStatus[ep.name];
                      const healthy = status?.healthy;
                      const code = status?.status;
                      const checked = status?.checked;
                      return (
                        <div
                          key={ep.name}
                          className={`flex items-center gap-3 p-3 rounded-lg border transition bg-white/80 dark:bg-gray-800/80 ${
                            healthy === true
                              ? "border-green-400 bg-green-50 dark:bg-green-900/30"
                              : healthy === false
                              ? "border-red-400 bg-red-50 dark:bg-red-900/30"
                              : "border-gray-200 dark:border-gray-700"
                          }`}
                          title={`Last checked: ${checked ? new Date(checked).toLocaleTimeString() : "-"}\nStatus code: ${code ?? "-"}`}
                        >
                          {healthy ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                          <span className="font-semibold text-blue-900 dark:text-blue-200">{ep.name}</span>
                          <span className="text-xs ml-auto text-gray-500">{ep.url}</span>
                          <span className={`ml-2 text-xs font-mono px-2 py-0.5 rounded ${
                            healthy === true
                              ? "bg-green-100 text-green-700"
                              : healthy === false
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}>
                            {code ?? "-"}
                          </span>
                          <span className="ml-2 text-[10px] text-gray-400">{checked ? new Date(checked).toLocaleTimeString() : "-"}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-blue-700 dark:text-blue-200 mb-1">Process Log</div>
                  {log.length === 0 && (
                    <div className="text-center text-gray-500 dark:text-gray-400">No log entries yet.</div>
                  )}
                  {log.map((entry, i) => (
                    <div
                      key={i}
                      className={`rounded-xl px-4 py-3 shadow border flex flex-col gap-1 transition-all duration-300 ease-out ${
                        entry.status === "processing"
                          ? "border-blue-400 bg-blue-50 dark:bg-blue-900/30"
                          : entry.status === "success"
                          ? "border-green-400 bg-green-50 dark:bg-green-900/30"
                          : "border-red-400 bg-red-50 dark:bg-red-900/30"
                      }`}
                      style={{ opacity: log.length ? 1 : 0, transform: log.length ? 'translateY(0)' : 'translateY(10px)' }}
                    >
                      <div className="flex items-center gap-2">
                        {entry.status === "processing" && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
                        {entry.status === "success" && <CheckCircle className="w-4 h-4 text-green-500" />}
                        {entry.status === "error" && <XCircle className="w-4 h-4 text-red-500" />}
                        <span className="font-semibold text-base">{entry.message}</span>
                        <span className="ml-auto text-xs text-gray-500 dark:text-gray-400">{new Date(entry.timestamp).toLocaleString()}</span>
                      </div>
                      {entry.details && (
                        <div className="text-sm text-gray-700 dark:text-gray-200 mt-1">{entry.details}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-3 flex items-center justify-center transition-all duration-300 animate-fadein"
          onClick={() => { setOpen(true); setVisible(true); }}
          aria-label="Show status popup"
        >
          <Server className="w-6 h-6 animate-pulse" />
          <ChevronUp className="w-4 h-4 ml-1" />
        </button>
      )}
    </div>
  );
}
