"use client";
import React, { useState, useEffect } from "react";
import {
  ChevronUp, 
  ChevronDown, 
  Server, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Database,
  HardDrive,
  Cpu,
  Wifi,
  Settings,
  Clock,
  Users,
  FileText,
  Bot,
  Loader2,
  X,
  Minimize2,
  Maximize2,
  BarChart3,
  Shield,
  Globe,
  TrendingUp,
  Gauge
} from "lucide-react";

interface SystemHealth {
  status: "ok" | "warning" | "error";
  timestamp: string;
  version: string;
  uptime?: {
    uptime_days: number;
    uptime_hours: number;
  };
  database?: {
    status: string;
    response_time_ms: number;
    user_count: number;
  };
  memory?: {
    status: string;
    usage_percent: number;
    used_gb: number;
    total_gb: number;
  };
  disk?: {
    status: string;
    usage_percent: number;
    free_gb: number;
    total_gb: number;
  };
  services?: Record<string, { status: string; importable?: boolean }>;
  dependencies?: Record<string, { status: string; available?: boolean }>;
  issues?: string[];
}

interface ServiceHealth {
  service: string;
  status: "ok" | "warning" | "error";
  timestamp: string;
  checks?: Record<string, any>;
}

interface AIHealth {
  status: string;
  services?: Record<string, string>;
  timestamp: string;
}

const StatusIndicator: React.FC<{ 
  status: "ok" | "warning" | "error" | "loading";
  size?: "sm" | "md" | "lg";
  showPulse?: boolean;
}> = ({ status, size = "md", showPulse = false }) => {
  const config = {
    ok: { 
      icon: CheckCircle, 
      color: "text-emerald-500", 
      bg: "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700",
      pulse: "animate-pulse"
    },
    warning: { 
      icon: AlertTriangle, 
      color: "text-amber-500", 
      bg: "bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-700",
      pulse: "animate-pulse"
    },
    error: { 
      icon: XCircle, 
      color: "text-red-500", 
      bg: "bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-700",
      pulse: "animate-pulse"
    },
    loading: { 
      icon: Loader2, 
      color: "text-blue-500", 
      bg: "bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700",
      pulse: ""
    }
  };
  
  const sizeConfig = {
    sm: "w-3 h-3 p-0.5",
    md: "w-4 h-4 p-1",
    lg: "w-6 h-6 p-1.5"
  };
  
  const { icon: Icon, color, bg, pulse } = config[status];
  const sizeClass = sizeConfig[size];
  
  return (
    <div className={`${bg} border rounded-full ${sizeClass} ${showPulse && status !== 'loading' ? pulse : ''}`}>
      <Icon className={`w-full h-full ${color} ${status === 'loading' ? 'animate-spin' : ''}`} />
    </div>
  );
};

const MetricCard: React.FC<{
  icon: React.ComponentType<any>;
  label: string;
  value: string;
  status: "ok" | "warning" | "error";
  detail?: string;
  trend?: "up" | "down" | "stable";
  onClick?: () => void;
}> = ({ icon: Icon, label, value, status, detail, trend, onClick }) => {  const colorMap = {
    ok: "text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30 hover:from-emerald-100 hover:to-emerald-200 dark:hover:from-emerald-800/40 dark:hover:to-emerald-700/40",
    warning: "text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 hover:from-amber-100 hover:to-amber-200 dark:hover:from-amber-800/40 dark:hover:to-amber-700/40", 
    error: "text-red-700 dark:text-red-300 border-red-200 dark:border-red-700 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 hover:from-red-100 hover:to-red-200 dark:hover:from-red-800/40 dark:hover:to-red-700/40"
  };

  const trendConfig = {
    up: { icon: TrendingUp, color: "text-emerald-500" },
    down: { icon: TrendingUp, color: "text-red-500 rotate-180" },
    stable: { icon: BarChart3, color: "text-gray-500" }
  };
  
  return (
    <div 
      className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer transform hover:scale-105 hover:shadow-lg ${colorMap[status]} ${onClick ? 'hover:shadow-md' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" />
          <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
        </div>
        {trend && (
          <div className={trendConfig[trend].color}>
            <TrendingUp className={`w-3 h-3 ${trend === 'down' ? 'rotate-180' : ''}`} />
          </div>
        )}
      </div>      <div className="text-lg font-bold mb-1">{value}</div>
      {detail && <div className="text-xs opacity-75 font-medium">{detail}</div>}
    </div>
  );
};

const ServiceStatusCard: React.FC<{
  name: string;
  health: ServiceHealth | null;
  isLoading: boolean;
  onRefresh: () => void;
  icon?: React.ComponentType<any>;
}> = ({ name, health, isLoading, onRefresh, icon: ServiceIcon }) => {
  const [expanded, setExpanded] = useState(false);
    const getStatusColor = (status: string) => {
    switch (status) {
      case "ok": return "text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700";
      case "warning": return "text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-700";
      case "error": return "text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-700";
      default: return "text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700";
    }
  };

  const getServiceIcon = (serviceName: string) => {
    const iconMap = {
      'CV': FileText,
      'Portfolio': Globe,
      'ATS': Shield,
      'Analytics': BarChart3,
      'Users': Users,
      'Endpoints Health': Wifi
    };
    return iconMap[serviceName as keyof typeof iconMap] || Settings;
  };

  const IconComponent = ServiceIcon || getServiceIcon(name);
    return (
    <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <IconComponent className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <div className="flex items-center gap-3">
            <StatusIndicator 
              status={isLoading ? "loading" : (health?.status as any) || "error"} 
              size="md"
              showPulse={health?.status === "warning" || health?.status === "error"}
            />
            <div>
              <span className="font-semibold text-gray-900 dark:text-gray-100">{name}</span>
              {health && (
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(health.status)}`}>
                    {health.status.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(health.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 text-blue-600 dark:text-blue-400 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          {health && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title={expanded ? "Collapse" : "Expand"}
            >
              {expanded ? 
                <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-400" /> : 
                <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              }
            </button>
          )}
        </div>
      </div>      {expanded && health && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {health.checks && Object.entries(health.checks).map(([check, result]) => (
              <div key={check} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <span className="font-medium text-sm capitalize text-gray-700 dark:text-gray-300">
                  {check.replace('_', ' ')}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor((result && result.status) || 'unknown')}`}>
                  {(result && result.status) || 'unknown'}
                </span>
              </div>
            ))}
            {(!health.checks || Object.keys(health.checks).length === 0) && (
              <div className="col-span-full text-center py-4 text-gray-500 dark:text-gray-400">
                No detailed checks available
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ModernStatusPopup: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [isHidden, setIsHidden] = useState(false);
  const [isPopupMode, setIsPopupMode] = useState(true);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [serviceHealth, setServiceHealth] = useState<Record<string, ServiceHealth | null>>({});
  const [aiHealth, setAIHealth] = useState<AIHealth | null>(null);
  const [endpointsHealth, setEndpointsHealth] = useState<ServiceHealth | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingServices, setLoadingServices] = useState<Set<string>>(new Set());
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(5); // minutes

  useEffect(() => {
    setMounted(true);
  }, []);  const fetchSystemHealth = async () => {
    try {
      // Use base URL without /api/v1 for system health endpoints
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/system/status`);
      
      if (!response.ok) throw new Error(`HTTP ${response.status} - ${response.statusText}`);
      const data = await response.json();
      setSystemHealth(data);
    } catch (error) {
      console.error('Failed to fetch system health:', error);
      setSystemHealth({
        status: "error",
        timestamp: new Date().toISOString(),
        version: "Unknown",
        issues: [`Failed to connect to backend: ${error}`]
      });
    }
  };  const fetchServiceHealth = async (service: string) => {
    setLoadingServices(prev => new Set(prev).add(service));
    try {
      // Use base URL without /api/v1 for system health endpoints
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/system/${service}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setServiceHealth(prev => ({ ...prev, [service]: data }));    } catch (error) {
      console.error(`Failed to fetch ${service} health:`, error);
      setServiceHealth(prev => ({ 
        ...prev, 
        [service]: {
          service,
          status: "error",
          timestamp: new Date().toISOString(),
          checks: { connection: { status: "error", error: String(error) } }
        }
      }));
    } finally {
      setLoadingServices(prev => {
        const newSet = new Set(prev);
        newSet.delete(service);
        return newSet;
      });
    }
  };  const fetchAIHealth = async () => {
    try {
      // Use base URL without /api/v1 for system health endpoints
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/system/ai`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setAIHealth(data);
    } catch (error) {
      console.error('Failed to fetch AI health:', error);
      setAIHealth({
        status: "error",
        services: {},
        timestamp: new Date().toISOString()
      });
    }
  };  const fetchEndpointsHealth = async () => {
    try {
      // Use base URL without /api/v1 for system health endpoints
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/system/endpoints`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setEndpointsHealth(data);    } catch (error) {
      console.error('Failed to fetch endpoints health:', error);
      setEndpointsHealth({
        service: "API Endpoints",
        status: "error",
        timestamp: new Date().toISOString(),
        checks: { connection: { status: "error", error: String(error) } }
      });
    }
  };

  const refreshAll = async () => {
    setIsLoading(true);
    setLastUpdate(new Date());
      await Promise.all([
      fetchSystemHealth(),
      fetchAIHealth(),
      fetchEndpointsHealth(),
      ...['cv', 'portfolio', 'ats', 'analytics', 'users'].map(service => 
        fetchServiceHealth(service)
      )
    ]);
    
    setIsLoading(false);
  };
  useEffect(() => {
    if (!mounted) return;
    
    refreshAll();
    
    // Auto-refresh based on user setting
    if (autoRefresh) {
      const interval = setInterval(refreshAll, refreshInterval * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [mounted, autoRefresh, refreshInterval]);
  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  if (!isVisible && !isPopupMode) return null;  const getOverallStatus = (): "ok" | "warning" | "error" => {
    if (!systemHealth) return "error";
    if (systemHealth.status === "error") return "error";
    if (systemHealth.issues && systemHealth.issues.length > 0) return "warning";
    
    const serviceStatuses = Object.values(serviceHealth).filter((s): s is ServiceHealth => s !== null);
    if (serviceStatuses.some(s => s.status === "error")) return "error";
    if (serviceStatuses.some(s => s.status === "warning")) return "warning";
    
    // Check endpoints health
    if (endpointsHealth?.status === "error") return "error";
    if (endpointsHealth?.status === "warning") return "warning";
    
    return "ok";
  };

  const getTotalIssues = (): number => {
    let issueCount = 0;
    
    // Count system health issues
    if (systemHealth?.issues) {
      issueCount += systemHealth.issues.length;
    }
    
    // Count service issues
    Object.values(serviceHealth).forEach(service => {
      if (service && (service.status === "error" || service.status === "warning")) {
        issueCount += 1;
      }
    });
    
    // Count AI health issues
    if (aiHealth && (aiHealth.status === "error" || aiHealth.status === "warning")) {
      issueCount += 1;
    }
    
    // Count endpoint issues
    if (endpointsHealth && (endpointsHealth.status === "error" || endpointsHealth.status === "warning")) {
      issueCount += 1;
    }
    
    return issueCount;
  };

  const getStatusMessage = (): string => {
    const status = getOverallStatus();
    const issues = getTotalIssues();
    
    switch (status) {
      case "ok":
        return "All systems operational";
      case "warning":
        return issues > 1 ? `${issues} warnings detected` : "1 warning detected";
      case "error":
        return issues > 1 ? `${issues} errors detected` : "1 error detected";
      default:
        return "Status unknown";
    }
  };
  const overallStatus = getOverallStatus();
  const totalIssues = getTotalIssues();

  return (
    <>
      {/* Popup Button Mode - Chat-like floating action button */}
      {isPopupMode && (
        <div className="fixed bottom-6 right-6 z-50">          {/* Popup Status Panel */}
          {!isMinimized && (
            <div className="mb-4 w-96 max-h-96 overflow-y-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl">
              {/* Popup Header */}
              <div className="sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 p-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <StatusIndicator 
                      status={isLoading ? "loading" : overallStatus} 
                      size="md"
                      showPulse={overallStatus === "warning" || overallStatus === "error"}
                    />
                    <div>
                      <h3 className="font-bold text-base bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        PORTMAN Status
                      </h3>
                      <p className={`text-xs font-medium ${
                        overallStatus === "ok" ? "text-emerald-600 dark:text-emerald-400" :
                        overallStatus === "warning" ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"
                      }`}>
                        {getStatusMessage()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    title="Minimize"
                  >
                    <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Popup Content - Compact system overview */}
              <div className="p-4 space-y-4">
                {/* System Health Summary */}
                {systemHealth && (
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Server className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="font-medium text-xs text-gray-900 dark:text-gray-100">System Health</span>
                      </div>
                      <StatusIndicator status={systemHealth.status as any} size="sm" />
                    </div>
                    {systemHealth.issues && systemHealth.issues.length > 0 && (
                      <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                        {systemHealth.issues.length} issue(s) detected
                      </div>
                    )}
                  </div>
                )}

                {/* Service Health Summary */}
                <div className="space-y-2">
                  {Object.entries(serviceHealth).map(([service, health]) => (
                    health && (
                      <div key={service} className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2">
                        <span className="text-xs font-medium capitalize text-gray-900 dark:text-gray-100">{service}</span>
                        <StatusIndicator status={health.status as any} size="sm" />
                      </div>
                    )
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={refreshAll}
                    disabled={isLoading}
                    className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isLoading ? "Refreshing..." : "Refresh All"}
                  </button>
                  <button
                    onClick={() => {
                      setIsPopupMode(false);
                      setIsMinimized(false);
                    }}
                    className="py-2 px-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-lg transition-colors"
                    title="Open full view"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Floating Action Button */}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className={`relative w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group ${
              isMinimized ? '' : 'rotate-180'
            }`}
            title="PORTMAN Status"
          >
            {/* Issue count badge */}
            {totalIssues > 0 && (
              <div className={`absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full text-xs font-bold text-white flex items-center justify-center ${
                overallStatus === "error" ? "bg-red-500" : "bg-amber-500"
              } border-2 border-white shadow-sm`}>
                {totalIssues > 99 ? "99+" : totalIssues}
              </div>
            )}
            
            {/* Status indicator dot */}
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
              overallStatus === "ok" ? "bg-emerald-500" :
              overallStatus === "warning" ? "bg-amber-500" : "bg-red-500"
            } ${overallStatus !== "ok" ? "animate-pulse" : ""}`} />
            
            {/* Main icon */}
            <Server className={`w-6 h-6 transition-transform duration-300 ${
              isMinimized ? 'group-hover:scale-110' : 'rotate-180'
            }`} />
          </button>
        </div>
      )}      {/* Hidden State - Enhanced minimal heads-up display */}
      {isHidden && !isPopupMode && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer"
               onClick={() => {
                 setIsHidden(false);
                 setIsVisible(true);
                 setIsMinimized(true);
               }}>
            <div className="flex items-center gap-3 p-4">
              {/* Status Icon with pulsing effect for issues */}
              <div className={`relative ${overallStatus !== "ok" ? "animate-pulse" : ""}`}>
                <StatusIndicator 
                  status={isLoading ? "loading" : overallStatus} 
                  size="lg"
                  showPulse={overallStatus === "warning" || overallStatus === "error"}
                />
                {/* Problem indicator badge */}
                {overallStatus !== "ok" && (
                  <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                    overallStatus === "error" ? "bg-red-500" : "bg-amber-500"
                  } border-2 border-white dark:border-gray-900 animate-pulse`} />
                )}
              </div>
              
              {/* Compact info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    PORTMAN
                  </span>
                  {systemHealth && (
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                      v{systemHealth.version}
                    </span>
                  )}
                </div>
                
                {/* Status message */}
                <div className={`text-xs font-medium truncate ${
                  overallStatus === "ok" ? "text-emerald-600 dark:text-emerald-400" :
                  overallStatus === "warning" ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"
                }`}>
                  {getStatusMessage()}
                </div>
                
                {/* Last update timestamp */}
                {lastUpdate && (
                  <div className="text-xs text-gray-400 dark:text-gray-500 truncate">
                    {lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
              </div>
              
              {/* Expand indicator */}
              <div className="flex items-center">
                <ChevronUp className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
              </div>
            </div>
            
            {/* Hover tooltip for full status */}
            <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg p-2 max-w-xs whitespace-nowrap">
                Click to view detailed system status
              </div>
            </div>
          </div>
        </div>
      )}{/* Main Status Component */}
      {!isHidden && !isPopupMode && (
        <div className="fixed bottom-4 right-4 z-50 max-w-2xl">          {isMinimized ? (
            // Minimized View - Enhanced and coherent with frontend design
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <div className="flex items-center gap-4 p-4">
                {/* Status indicator with problem badge */}
                <div className="relative">
                  <StatusIndicator 
                    status={isLoading ? "loading" : overallStatus} 
                    size="lg"
                    showPulse={overallStatus === "warning" || overallStatus === "error"}
                  />
                  {overallStatus !== "ok" && (
                    <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                      overallStatus === "error" ? "bg-red-500" : "bg-amber-500"
                    } border-2 border-white dark:border-gray-900`} />
                  )}
                </div>
                
                <div className="flex-1">
                  {/* Header with brand and version */}
                  <div className="flex items-center gap-3 mb-1">
                    <Server className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-bold text-base bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      PORTMAN
                    </span>
                    {systemHealth && (
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold">
                        v{systemHealth.version}
                      </span>
                    )}
                  </div>
                  
                  {/* Status message with better visual hierarchy */}
                  <div className={`text-xs font-medium mb-1 ${
                    overallStatus === "ok" ? "text-emerald-600 dark:text-emerald-400" :
                    overallStatus === "warning" ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"
                  }`}>
                    {getStatusMessage()}
                  </div>
                  
                  {/* Additional context for issues */}
                  {overallStatus !== "ok" && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      {overallStatus === "error" ? "Immediate attention required" : "Monitor recommended"}
                    </div>
                  )}
                  
                  {/* Timestamp */}
                  {lastUpdate && (
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      Updated: {lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </div>
                
                {/* Action buttons with consistent styling */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={refreshAll}
                    disabled={isLoading}
                    className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-xl transition-all duration-200 disabled:opacity-50 group/btn border border-transparent hover:border-blue-200 dark:hover:border-blue-700"
                    title="Refresh status"
                  >
                    <RefreshCw className={`w-4 h-4 text-blue-600 dark:text-blue-400 group-hover/btn:text-blue-700 dark:group-hover/btn:text-blue-300 ${
                      isLoading ? 'animate-spin' : 'group-hover/btn:rotate-180'
                    } transition-transform duration-300`} />
                  </button>
                    <button
                    onClick={() => setIsMinimized(false)}
                    className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/50 rounded-xl transition-all duration-200 group/btn border border-transparent hover:border-blue-200 dark:hover:border-blue-700"
                    title="Show detailed status"
                  >
                    <Maximize2 className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover/btn:text-blue-700 dark:group-hover/btn:text-blue-300 group-hover/btn:scale-110 transition-all duration-200" />
                  </button>
                  
                  <button
                    onClick={() => {
                      setIsPopupMode(true);
                      setIsMinimized(true);
                    }}
                    className="p-2 hover:bg-purple-50 dark:hover:bg-purple-900/50 rounded-xl transition-all duration-200 group/btn border border-transparent hover:border-purple-200 dark:hover:border-purple-700"
                    title="Switch to popup mode"
                  >
                    <Globe className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover/btn:text-purple-700 dark:group-hover/btn:text-purple-300 transition-colors duration-200" />
                  </button>
                  
                  <button
                    onClick={() => setIsHidden(true)}
                    className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 group/btn border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                    title="Minimize to heads-up display"
                  >
                    <Minimize2 className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover/btn:text-gray-700 dark:group-hover/btn:text-gray-300 transition-colors duration-200" />
                  </button>
                  
                  <button
                    onClick={() => setIsVisible(false)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/50 rounded-xl transition-all duration-200 group/btn border border-transparent hover:border-red-200 dark:hover:border-red-700"
                    title="Close status monitor"
                  >
                    <X className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover/btn:text-red-600 dark:group-hover/btn:text-red-400 transition-colors duration-200" />                  </button>
                </div>
              </div>
            </div>
          ) : (            // Expanded View - Enhanced
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-2 border-blue-200 dark:border-blue-700 rounded-2xl shadow-2xl p-6 max-h-[85vh] overflow-y-auto">
              {/* Enhanced Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <StatusIndicator 
                    status={isLoading ? "loading" : overallStatus} 
                    size="lg"
                    showPulse={overallStatus === "warning" || overallStatus === "error"}
                  />
                  <div>
                    <h2 className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                      <Server className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      PORTMAN Status Dashboard
                    </h2>
                    {systemHealth && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Version {systemHealth.version} • Last updated: {lastUpdate?.toLocaleTimeString() || 'Never'}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Auto-refresh toggle */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-gray-600 dark:text-gray-400">Auto-refresh</label>
                    <button
                      onClick={() => setAutoRefresh(!autoRefresh)}
                      className={`w-8 h-4 rounded-full transition-colors ${autoRefresh ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                    >
                      <div className={`w-3 h-3 bg-white rounded-full transition-transform ${autoRefresh ? 'translate-x-4' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                  <button
                    onClick={refreshAll}
                    disabled={isLoading}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                    Refresh All                  </button>
                  <button
                    onClick={() => {
                      setIsPopupMode(true);
                      setIsMinimized(true);
                    }}
                    className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/50 rounded-xl transition-colors"
                    title="Switch to popup mode"
                  >
                    <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </button>
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
                    title="Minimize"
                  >
                    <Minimize2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button></div>
              </div>              {/* Enhanced System Overview */}
              {systemHealth && (
                <div className="mb-8">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                    <Gauge className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    System Performance
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {systemHealth.database && (
                      <MetricCard
                        icon={Database}
                        label="Database"
                        value={`${systemHealth.database.response_time_ms}ms`}
                        status={systemHealth.database.status === "ok" ? "ok" : "error"}
                        detail={`${systemHealth.database.user_count} users`}
                        trend={systemHealth.database.response_time_ms < 100 ? "stable" : "up"}
                      />
                    )}
                    {systemHealth.memory && (
                      <MetricCard
                        icon={Cpu}
                        label="Memory"
                        value={`${systemHealth.memory.usage_percent.toFixed(1)}%`}
                        status={
                          systemHealth.memory.usage_percent < 70 ? "ok" : 
                          systemHealth.memory.usage_percent < 85 ? "warning" : "error"
                        }
                        detail={`${systemHealth.memory.used_gb.toFixed(1)}GB / ${systemHealth.memory.total_gb.toFixed(1)}GB`}
                        trend={systemHealth.memory.usage_percent < 70 ? "stable" : "up"}
                      />
                    )}
                    {systemHealth.disk && (
                      <MetricCard
                        icon={HardDrive}
                        label="Disk Space"
                        value={`${systemHealth.disk.usage_percent.toFixed(1)}%`}
                        status={
                          systemHealth.disk.usage_percent < 70 ? "ok" : 
                          systemHealth.disk.usage_percent < 85 ? "warning" : "error"
                        }
                        detail={`${systemHealth.disk.free_gb.toFixed(1)}GB free`}
                        trend={systemHealth.disk.usage_percent < 70 ? "stable" : "up"}
                      />
                    )}
                    {systemHealth.uptime && (
                      <MetricCard
                        icon={Clock}
                        label="Uptime"
                        value={`${systemHealth.uptime.uptime_days.toFixed(1)}d`}
                        status="ok"
                        detail={`${systemHealth.uptime.uptime_hours.toFixed(1)} hours`}
                        trend="stable"
                      />
                    )}
                  </div>
                </div>
              )}              {/* Enhanced Services Status */}
              <div className="mb-8">
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                  <Settings className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Core Services
                </h3>
                <div className="grid gap-4">
                  {['cv', 'portfolio', 'ats', 'analytics', 'users'].map(service => (
                    <ServiceStatusCard
                      key={service}
                      name={service.charAt(0).toUpperCase() + service.slice(1)}
                      health={serviceHealth[service]}
                      isLoading={loadingServices.has(service)}
                      onRefresh={() => fetchServiceHealth(service)}
                    />
                  ))}
                </div>
              </div>

              {/* Enhanced API Endpoints Status */}
              <div className="mb-8">
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                  <Wifi className="w-5 h-5 text-green-600 dark:text-green-400" />
                  API Endpoints
                </h3>
                <ServiceStatusCard
                  name="Endpoints Health"
                  health={endpointsHealth}
                  isLoading={false}
                  onRefresh={fetchEndpointsHealth}
                />
              </div>              {/* Enhanced AI Services */}
              {aiHealth && (
                <div className="mb-8">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-3">
                    <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    AI Services
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aiHealth.services && Object.entries(aiHealth.services).map(([service, status]) => (
                      <div key={service} className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 border border-indigo-200 dark:border-indigo-700 rounded-xl hover:shadow-md transition-all">
                        <div className="flex items-center gap-3">
                          <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                          <span className="font-semibold text-gray-900 dark:text-gray-100 capitalize">{service}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${
                          status === 'configured' 
                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700' 
                            : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700'
                        }`}>
                          {status}
                        </span>
                      </div>
                    ))}
                    {(!aiHealth.services || Object.keys(aiHealth.services).length === 0) && (
                      <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                        No AI services configured
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Enhanced Issues Section */}
              {systemHealth?.issues && systemHealth.issues.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold text-lg text-red-700 dark:text-red-400 mb-4 flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5" />
                    System Issues
                  </h3>
                  <div className="space-y-3">
                    {systemHealth.issues.map((issue, index) => (
                      <div key={index} className="p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/30 border-2 border-red-200 dark:border-red-700 rounded-xl">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-red-700 dark:text-red-300 font-medium">{issue}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ModernStatusPopup;
