"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  CheckCircle, XCircle, Loader2, Server, ChevronDown, ChevronUp, Info, List, Search, Copy
} from "lucide-react";

interface Endpoint {
  name: string;
  url: string;
  method: string;
}

interface EndpointStatus {
  healthy: boolean;
  status: number | null;
  details: string | null;
  checked: number;
  url: string;
  method: string;
}

interface ProcessLogEntry {
  message: string;
  details?: string;
  status: "processing" | "success" | "error";
  timestamp: number;
}

const ENDPOINTS: Endpoint[] = [
  { name: "Health", url: "/healthz", method: "GET" },
  { name: "System Status", url: "/system/status", method: "GET" },
  { name: "CV Health", url: "/system/cv", method: "GET" },
  { name: "Portfolio Health", url: "/system/portfolio", method: "GET" },
  { name: "ATS Health", url: "/system/ats", method: "GET" },
  { name: "Analytics Health", url: "/system/analytics", method: "GET" },
  { name: "Users Health", url: "/system/users", method: "GET" },
  { name: "AI Services", url: "/system/ai", method: "GET" },
  { name: "Logs Health", url: "/system/logs", method: "GET" },
  { name: "Portfolio Templates", url: "/api/v1/portfolio/templates/", method: "GET" },
  { name: "ATS Templates", url: "/api/v1/ats/templates/", method: "GET" },
  { name: "Analytics Dashboard", url: "/api/v1/analytics/dashboard", method: "GET" },
  { name: "Logs", url: "/api/v1/logs", method: "GET" },
];

async function checkEndpoint(endpoint: Endpoint): Promise<{ healthy: boolean; status: number | null; details: string | null }> {
  try {
    if (endpoint.method === "GET") {
      const res = await fetch(endpoint.url, { method: "GET" });
      if (res.ok) return { healthy: true, status: res.status, details: null };
      let details: string | null = null;
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        try {
          const json = await res.json();
          details = typeof json.detail === "string" ? json.detail : JSON.stringify(json);
        } catch {
          details = `HTTP ${res.status}: ${res.statusText}`;
        }
      } else {
        // Not JSON (likely HTML error page)
        details = `HTTP ${res.status}: ${res.statusText}`;
      }
      return { healthy: false, status: res.status, details };
    } else {
      // For POST endpoints that require real data, mark as not supported
      return { healthy: false, status: null, details: "Health check not supported for this endpoint" };
    }
  } catch (e: any) {
    return { healthy: false, status: null, details: e.message || "Network error" };
  }
}

function formatTime(ts: number | null) {
  if (!ts || typeof window === 'undefined') return "-";
  const d = new Date(ts);
  return d.toLocaleTimeString();
}

function classByStatus(healthy: boolean | undefined) {
  if (healthy === true) return "bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700";
  if (healthy === false) return "bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-700";
  return "bg-gray-50 dark:bg-gray-800/20 border border-gray-200 dark:border-gray-700";
}

const SYSTEM_STATUS_URL = "/system/status";

const StatusPopup: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(true);
  const [showLogModal, setShowLogModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [endpointStatus, setEndpointStatus] = useState<Record<string, EndpointStatus>>({});
  const [log, setLog] = useState<ProcessLogEntry[]>([]);
  const [visible, setVisible] = useState(true);
  const [search, setSearch] = useState("");
  const [logSearch, setLogSearch] = useState("");
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint | null>(null);
  const logEndRef = useRef<HTMLDivElement | null>(null);
  const [lastChecked, setLastChecked] = useState<number | null>(null);
  const [systemStatus, setSystemStatus] = useState<any>(null);
  const [systemStatusLoading, setSystemStatusLoading] = useState(false);
  const [systemStatusError, setSystemStatusError] = useState<string | null>(null);

  // Hydration guard
  useEffect(() => {
    setMounted(true);
  }, []);

  // Poll all endpoints
  const pollAll = async () => {
    setRefreshing(true);
    const results = await Promise.all(
      ENDPOINTS.map(async (ep) => {
        const res = await checkEndpoint(ep);
        // Debug: log each endpoint result
        console.log(`[PORTMAN Status] Checked ${ep.name}:`, res);
        return [ep.name, { ...res, checked: Date.now(), url: ep.url, method: ep.method } as EndpointStatus];
      })
    );
    setEndpointStatus(Object.fromEntries(results));
    setLastChecked(Date.now());
    setRefreshing(false);
  };

  // Fetch system status
  const fetchSystemStatus = async () => {
    setSystemStatusLoading(true);
    setSystemStatusError(null);
    try {
      const res = await fetch(SYSTEM_STATUS_URL);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setSystemStatus(data);
    } catch (e: any) {
      setSystemStatusError(e.message || "Failed to fetch system status");
    } finally {
      setSystemStatusLoading(false);
    }
  };
  useEffect(() => {
    if (!mounted) return;
    let isMounted = true;
    pollAll();
    fetchSystemStatus();
    // Change interval to 5 minutes (300000 ms)
    const interval = setInterval(() => isMounted && pollAll(), 300000);
    return () => { isMounted = false; clearInterval(interval); };
  }, [mounted]);

  // Listen for process events
  useEffect(() => {
    function onProcessing(e: any) {
      const entry: ProcessLogEntry = {
        message: e.detail?.message || "Processing...",
        details: e.detail?.details || "",
        status: e.detail?.status || "processing",
        timestamp: Date.now(),
      };
      setLog((prev) => [...prev, entry].slice(-50));
    }
    window.addEventListener("portman-processing", onProcessing);
    return () => window.removeEventListener("portman-processing", onProcessing);
  }, []);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth", inline: "end" });
    }
  }, [log]);

  // Summary
  const allOk = ENDPOINTS.every((ep) => endpointStatus[ep.name]?.healthy);
  const failed = ENDPOINTS.filter((ep) => endpointStatus[ep.name]?.healthy === false);
  const warning = ENDPOINTS.filter((ep) => {
    const status = endpointStatus[ep.name]?.status;
    return status !== undefined && status !== null && status >= 400 && status < 500;
  });
  const healthy = ENDPOINTS.filter((ep) => endpointStatus[ep.name]?.healthy === true);

  // Filtered endpoints
  const filteredEndpoints = useMemo(() => {
    if (!search) return ENDPOINTS;
    return ENDPOINTS.filter((ep) => ep.name.toLowerCase().includes(search.toLowerCase()) || ep.url.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    if (!logSearch) return log;
    return log.filter((entry) => entry.message.toLowerCase().includes(logSearch.toLowerCase()) || (entry.details && entry.details.toLowerCase().includes(logSearch.toLowerCase())));
  }, [log, logSearch]);

  function handleClose() {
    setVisible(false);
    setTimeout(() => setOpen(false), 350);
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
  }
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {!mounted ? (
        // Render a placeholder during SSR to prevent hydration mismatch
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur border border-blue-200 dark:border-blue-700 rounded-xl shadow-lg p-4 max-w-xl">
          <div className="text-sm text-gray-500">Loading status...</div>
        </div>
      ) : open ? (
        <div
          className={`bg-white/95 dark:bg-gray-900/95 shadow-2xl rounded-3xl px-8 py-6 min-w-[400px] max-w-[98vw] border border-blue-300 dark:border-blue-800 flex flex-col gap-4 transition-all duration-300 ease-out animate-fadein ${!visible ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          style={{ transform: visible ? 'translateY(0) scale(1)' : 'translateY(40px) scale(0.95)', opacity: visible ? 1 : 0 }}
        >          {/* System Details Section */}
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-1">
              <Info className="w-4 h-4 text-blue-400" />
              <span className="font-medium text-sm text-blue-700 dark:text-blue-200">System Details</span>
              <button
                className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 border border-blue-200 dark:border-blue-700 hover:bg-blue-200 dark:hover:bg-blue-700 transition"
                onClick={fetchSystemStatus}
                disabled={systemStatusLoading}
                aria-label="Refresh system status"
              >
                {systemStatusLoading ? <Loader2 className="w-2.5 h-2.5 animate-spin inline" /> : "Refresh"}
              </button>
            </div>            {systemStatusError && (
              <div className="text-[10px] text-red-500">{systemStatusError}</div>
            )}            {systemStatus && (
              <div className="text-[10px] text-gray-700 dark:text-gray-200 space-y-1.5">
                <div className="grid grid-cols-2 gap-1.5">
                  <div><span className="font-medium">Version:</span> {systemStatus.version}</div>
                  <div><span className="font-medium">Status:</span> 
                    <span className={`ml-1 px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                      systemStatus.status === 'ok' ? 'bg-emerald-200 text-emerald-800 border border-emerald-300' : 
                      systemStatus.status === 'warning' ? 'bg-amber-200 text-amber-800 border border-amber-300' : 
                      'bg-red-200 text-red-800 border border-red-300'
                    }`}>{systemStatus.status}</span>
                  </div>
                </div>
                  {/* Database Health */}
                <div className="border-t pt-2">
                  <div className="font-medium text-[11px] text-blue-700 dark:text-blue-200 mb-1">Database</div>
                  <div className="ml-2 space-y-1">
                    <div><span className="font-medium">Status:</span> 
                      <span className={systemStatus.database?.status === 'ok' ? 'text-emerald-600 ml-1 font-semibold' : 'text-red-600 ml-1 font-semibold'}>
                        {systemStatus.database?.status}
                      </span>
                    </div>
                    {systemStatus.database?.response_time_ms && (
                      <div><span className="font-medium">Response:</span> {systemStatus.database.response_time_ms}ms</div>
                    )}
                    {systemStatus.database?.user_count !== undefined && (
                      <div><span className="font-medium">Users:</span> {systemStatus.database.user_count}</div>
                    )}
                  </div>
                </div>                {/* System Resources */}
                <div className="border-t pt-2">
                  <div className="font-medium text-[11px] text-blue-700 dark:text-blue-200 mb-1">System Resources</div>
                  <div className="ml-2 space-y-1">
                    {systemStatus.memory && (
                      <div className="flex justify-between">
                        <span className="font-medium">Memory:</span>
                        <span className={`${
                          systemStatus.memory.status === 'ok' ? 'text-emerald-600 font-semibold' : 
                          systemStatus.memory.status === 'warning' ? 'text-amber-600 font-semibold' : 'text-red-600 font-semibold'
                        }`}>
                          {systemStatus.memory.usage_percent}% ({systemStatus.memory.used_gb}GB/{systemStatus.memory.total_gb}GB)
                        </span>
                      </div>
                    )}
                    {systemStatus.disk && (
                      <div className="flex justify-between">
                        <span className="font-medium">Disk:</span>
                        <span className={`${
                          systemStatus.disk.status === 'ok' ? 'text-emerald-600 font-semibold' : 
                          systemStatus.disk.status === 'warning' ? 'text-amber-600 font-semibold' : 'text-red-600 font-semibold'
                        }`}>
                          {systemStatus.disk.usage_percent}% ({systemStatus.disk.free_gb}GB free)
                        </span>
                      </div>
                    )}
                    {systemStatus.uptime && (
                      <div><span className="font-medium">Uptime:</span> {systemStatus.uptime.uptime_days?.toFixed(1)} days</div>
                    )}
                  </div>
                </div>                {/* Services Health */}
                <div className="border-t pt-2">
                  <div className="font-medium text-[11px] text-blue-700 dark:text-blue-200 mb-1">Services</div>
                  <div className="ml-2 grid grid-cols-2 gap-1 text-[10px]">
                    {systemStatus.services && Object.entries(systemStatus.services).map(([service, health]: [string, any]) => (
                      <div key={service} className="flex justify-between">
                        <span className="capitalize">{service}:</span>
                        <span className={health.status === 'ok' ? 'text-emerald-600 font-semibold' : 'text-red-600 font-semibold'}>
                          {health.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>                {/* Environment & Dependencies */}
                <div className="border-t pt-2">
                  <div className="font-medium text-[11px] text-blue-700 dark:text-blue-200 mb-1">Environment</div>
                  <div className="ml-2 space-y-1">
                    {systemStatus.environment?.critical && (
                      <div className="text-[10px]">
                        <span className="font-medium">Critical vars:</span> {
                          Object.entries(systemStatus.environment.critical)
                            .filter(([_, data]: [string, any]) => data.set)
                            .length
                        }/{Object.keys(systemStatus.environment.critical).length} set
                      </div>
                    )}
                    {systemStatus.dependencies && (
                      <div className="text-[10px]">
                        <span className="font-medium">Dependencies:</span> {
                          Object.entries(systemStatus.dependencies)
                            .filter(([_, data]: [string, any]) => data.status === 'ok')
                            .length
                        }/{Object.keys(systemStatus.dependencies).length} ok
                      </div>
                    )}
                  </div>
                </div>                {/* Issues Summary */}
                {systemStatus.issues && systemStatus.issues.length > 0 && (
                  <div className="border-t pt-2">
                    <div className="font-medium text-[11px] text-red-700 dark:text-red-200 mb-1">Issues</div>
                    <div className="ml-2 text-red-600 text-[10px]">
                      {systemStatus.issues.join(', ')}
                    </div>
                  </div>
                )}
              </div>
            )}            {!systemStatus && !systemStatusError && (
              <div className="text-[10px] text-gray-400">Loading system info...</div>
            )}
          </div>          {/* Heads-up summary */}
          <div className="flex items-center gap-3 mb-2 w-full">
            <Server className="w-4 h-4 text-blue-500 animate-pulse" />
            <span className="font-bold text-sm text-blue-700 dark:text-blue-200 tracking-tight">PORTMAN Status</span>
            <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold ${allOk ? 'bg-emerald-200 text-emerald-800 border border-emerald-300' : failed.length ? 'bg-red-200 text-red-800 border border-red-300' : 'bg-amber-200 text-amber-800 border border-amber-300'}`}>{allOk ? 'Online' : failed.length ? `${failed.length} Error${failed.length > 1 ? 's' : ''}` : 'Warning'}</span>
            <span className="ml-2 text-[10px] text-gray-500">Checked: {formatTime(lastChecked)}</span>
            <button
              className="ml-auto text-[10px] px-2 py-1 rounded-lg bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-700 transition border border-blue-200 dark:border-blue-700 mr-2 font-medium"
              onClick={pollAll}
              disabled={refreshing}
              aria-label="Refresh health checks"
            >
              {refreshing ? <Loader2 className="w-3 h-3 animate-spin inline" /> : "Refresh"}
            </button>
            <button
              className="text-gray-400 hover:text-blue-500 transition"
              onClick={handleClose}
              aria-label="Minimize status popup"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>          {/* Error/Warning Banner */}
          {!allOk && (
            <div className={`rounded-xl px-4 py-2 mb-2 text-[11px] font-semibold flex items-center gap-2 ${failed.length ? 'bg-red-200 text-red-800 border border-red-400' : 'bg-amber-200 text-amber-800 border border-amber-400'}`}>
              <XCircle className="w-3 h-3" />
              {failed.length ? `${failed.length} endpoint${failed.length > 1 ? 's are' : ' is'} down. Click for details.` : 'Some endpoints have warnings.'}
            </div>
          )}          {/* Endpoint Table with Search */}
          <div className="flex flex-row items-center gap-2 mb-1">
            <Search className="w-3 h-3 text-blue-400" />
            <input
              className="flex-1 px-2 py-1 rounded-lg border border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-800 text-[11px] focus:outline-none"
              placeholder="Search endpoints..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="overflow-x-auto max-h-40">
            <table className="w-full text-[10px] border-separate border-spacing-y-1">
              <thead>
                <tr className="text-gray-500">
                  <th className="text-left font-medium">Endpoint</th>
                  <th className="text-left font-medium">Status</th>
                  <th className="text-left font-medium">HTTP</th>
                  <th className="text-left font-medium">Last Checked</th>
                  <th className="text-left font-medium">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredEndpoints.map((ep) => {
                  const status = endpointStatus[ep.name];
                  return (
                    <tr key={ep.name} className={`rounded-lg ${classByStatus(status?.healthy)}`}>
                      <td className="font-medium py-1 px-2 cursor-pointer hover:underline" onClick={() => setSelectedEndpoint(ep)}>{ep.name}</td>
                      <td className={`font-medium ${status?.healthy === true ? 'text-emerald-600' : status?.healthy === false ? 'text-red-600' : 'text-gray-500'}`}>{status?.healthy === true ? 'Healthy' : status?.healthy === false ? 'Error' : 'Unknown'}</td>
                      <td>{status?.status ?? '-'}</td>
                      <td>{status?.checked ? formatTime(status.checked) : '-'}</td>                      <td>
                        {status?.details && (
                          <button className="text-[9px] text-blue-600 hover:underline" onClick={() => setSelectedEndpoint(ep)}>View</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>          {/* Endpoint Details Modal */}
          {selectedEndpoint && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fadein">
              <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 max-w-lg w-full border border-blue-400 dark:border-blue-700 transition-all duration-300 ease-out animate-fadein">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-500" />
                    <span className="font-bold text-sm text-blue-700 dark:text-blue-200">Endpoint Details</span>
                  </div>
                  <button className="text-gray-400 hover:text-blue-500 transition" onClick={() => setSelectedEndpoint(null)} aria-label="Close details"><ChevronDown className="w-5 h-5" /></button>
                </div>
                <div className="mb-2">
                  <div className="font-medium text-[11px] text-blue-900 dark:text-blue-200">{selectedEndpoint.name}</div>
                  <div className="text-[10px] text-gray-500">{selectedEndpoint.url} [{selectedEndpoint.method}]</div>
                </div>
                <div className="mb-2">
                  <span className="font-medium text-[10px]">Status: </span>
                  <span className={endpointStatus[selectedEndpoint.name]?.healthy ? 'text-emerald-700 font-semibold' : 'text-red-700 font-semibold'}>
                    {endpointStatus[selectedEndpoint.name]?.healthy ? 'Healthy' : 'Error'}
                  </span>
                  <span className="ml-2 text-[9px] text-gray-500">HTTP: {endpointStatus[selectedEndpoint.name]?.status ?? '-'}</span>
                </div>
                {endpointStatus[selectedEndpoint.name]?.details && (
                  <div className="mb-2">
                    <span className="font-medium text-[10px]">Details:</span>
                    <pre className="bg-gray-100 dark:bg-gray-800 rounded p-2 text-[9px] mt-1 max-h-40 overflow-auto whitespace-pre-wrap">{endpointStatus[selectedEndpoint.name]?.details}</pre>
                    <button className="mt-1 text-[9px] text-blue-600 hover:underline flex items-center gap-1" onClick={() => copyToClipboard(endpointStatus[selectedEndpoint.name]?.details!)}><Copy className="w-2.5 h-2.5" /> Copy</button>
                  </div>
                )}
                <div className="mt-4 text-[9px] text-gray-500">Tip: If this endpoint is down, check backend logs or network connectivity.</div>
              </div>
            </div>
          )}          {/* Log Viewer */}
          <div className="mt-2">
            <div className="flex flex-row items-center gap-2 mb-1">
              <List className="w-3 h-3 text-blue-400" />
              <span className="text-[10px] font-medium text-blue-700 dark:text-blue-200">Recent Activity</span>
              <input
                className="flex-1 px-2 py-1 rounded-lg border border-blue-200 dark:border-blue-700 bg-white dark:bg-gray-800 text-[11px] focus:outline-none ml-2"
                placeholder="Search logs..."
                value={logSearch}
                onChange={e => setLogSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-row gap-3 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-blue-300/40 scrollbar-track-transparent">
              {filteredLogs.map((entry, i) => (
                <div
                  key={i}
                  className={`rounded-xl px-3 py-2 min-w-[180px] shadow border flex flex-col gap-1 transition-all duration-300 ease-out ${
                    i === filteredLogs.length - 1
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/40"
                      : entry.status === "success"
                      ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30"
                      : entry.status === "error"
                      ? "border-red-400 bg-red-50 dark:bg-red-900/30"
                      : "border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80"
                  }`}
                  style={{ opacity: filteredLogs.length ? 1 : 0, transform: filteredLogs.length ? 'translateY(0)' : 'translateY(10px)' }}
                >
                  <div className="flex items-center gap-1">
                    {entry.status === "processing" && <Loader2 className="w-2.5 h-2.5 text-blue-500 animate-spin" />}
                    {entry.status === "success" && <CheckCircle className="w-2.5 h-2.5 text-emerald-500" />}
                    {entry.status === "error" && <XCircle className="w-2.5 h-2.5 text-red-500" />}
                    <span className="font-medium text-[10px] truncate max-w-[90px]">{entry.message}</span>
                  </div>
                  <span className="text-[9px] text-gray-500 dark:text-gray-400">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                  {entry.details && (
                    <span className="text-[9px] text-gray-700 dark:text-gray-300 truncate max-w-[120px]">{entry.details}</span>
                  )}
                </div>
              ))}
              <div ref={logEndRef} />
            </div>
          </div>          {/* Log Modal */}
          {showLogModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fadein">
              <div
                className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-blue-400 dark:border-blue-700 transition-all duration-300 ease-out animate-fadein"
                style={{ transform: showLogModal ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(40px)', opacity: showLogModal ? 1 : 0 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <List className="w-5 h-5 text-blue-500" />
                    <span className="font-bold text-sm text-blue-700 dark:text-blue-200">PORTMAN Backend Health</span>
                  </div>
                  <button
                    className="text-gray-400 hover:text-blue-500 transition"
                    onClick={() => setShowLogModal(false)}
                    aria-label="Close log modal"
                  >
                    <ChevronDown className="w-5 h-5" />
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
                              ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30"
                              : healthy === false
                              ? "border-red-400 bg-red-50 dark:bg-red-900/30"
                              : "border-gray-200 dark:border-gray-700"
                          }`}
                          title={`Last checked: ${checked ? new Date(checked).toLocaleTimeString() : "-"}\nStatus code: ${code ?? "-"}`}
                        >
                          {healthy ? (
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-500" />
                          )}
                          <span className="font-medium text-[11px] text-blue-900 dark:text-blue-200">{ep.name}</span>
                          <span className="text-[9px] ml-auto text-gray-500">{ep.url}</span>
                          <span className={`ml-2 text-[9px] font-mono px-2 py-0.5 rounded ${
                            healthy === true
                              ? "bg-emerald-200 text-emerald-800 border border-emerald-300"
                              : healthy === false
                              ? "bg-red-200 text-red-800 border border-red-300"
                              : "bg-gray-100 text-gray-700"
                          }`}>
                            {code ?? "-"}
                          </span>
                          <span className="ml-2 text-[8px] text-gray-400">{checked ? new Date(checked).toLocaleTimeString() : "-"}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="text-[10px] font-medium text-blue-700 dark:text-blue-200 mb-1">Process Log</div>
                  {filteredLogs.length === 0 && (
                    <div className="text-center text-[10px] text-gray-500 dark:text-gray-400">No log entries yet.</div>
                  )}
                  {filteredLogs.map((entry, i) => (
                    <div
                      key={i}
                      className={`rounded-xl px-4 py-3 shadow border flex flex-col gap-1 transition-all duration-300 ease-out ${
                        entry.status === "processing"
                          ? "border-blue-400 bg-blue-50 dark:bg-blue-900/30"
                          : entry.status === "success"
                          ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30"
                          : "border-red-400 bg-red-50 dark:bg-red-900/30"
                      }`}
                      style={{ opacity: filteredLogs.length ? 1 : 0, transform: filteredLogs.length ? 'translateY(0)' : 'translateY(10px)' }}
                    >
                      <div className="flex items-center gap-2">
                        {entry.status === "processing" && <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />}
                        {entry.status === "success" && <CheckCircle className="w-3 h-3 text-emerald-500" />}
                        {entry.status === "error" && <XCircle className="w-3 h-3 text-red-500" />}
                        <span className="font-medium text-[11px]">{entry.message}</span>
                        <span className="ml-auto text-[9px] text-gray-500 dark:text-gray-400">{new Date(entry.timestamp).toLocaleString()}</span>
                      </div>
                      {entry.details && (
                        <div className="text-[10px] text-gray-700 dark:text-gray-200 mt-1">{entry.details}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}</div>
      ) : (        <button
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg p-3 flex items-center justify-center transition-all duration-300 animate-fadein"
          onClick={() => { setOpen(true); setVisible(true); }}
          aria-label="Show status popup"
        >
          <Server className="w-5 h-5 animate-pulse" />
          <ChevronUp className="w-3 h-3 ml-1" />
        </button>
      )}
    </div>
  );
};

export default StatusPopup;
