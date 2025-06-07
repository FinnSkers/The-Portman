"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useIsMobile, mobileGrid, mobileSpacing, mobileTypography, mobileAnimations } from "@/lib/mobile-utils";
import { 
  BarChart3, 
  Users, 
  TrendingUp, 
  Download,
  Eye,
  MousePointer,
  Smartphone,
  Globe,
  Activity,
  FileText,
  Star,
  ArrowUpRight,
  Zap,
  Clock,
  Share
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";
import { useAnalyticsData, useEventTracking } from "@/hooks/useAPI";
import { useAnalytics } from "@/lib/store";

export default function DashboardPage() {
  const { fetchAllAnalytics, loading, error } = useAnalyticsData();
  const { trackEvent } = useEventTracking();
  const { setAnalyticsData } = useAnalytics();
  const isMobile = useIsMobile() || false; // Fallback to false if undefined

  useEffect(() => {
    trackEvent("dashboard_view", { timestamp: new Date().toISOString() });
  }, [trackEvent]);
  // Fallback data for development
  const fallbackData = {
    metrics: {
      cvs_processed: 1247,
      portfolios_generated: 892,
      ats_resumes_created: 634,
      total_downloads: 2150,
      avg_ats_score: 85.2
    },
    popular_templates: [
      { name: "Modern Professional", count: 420, percentage: 35 },
      { name: "Creative Portfolio", count: 336, percentage: 28 },
      { name: "Minimalist", count: 264, percentage: 22 },
      { name: "Tech Focused", count: 180, percentage: 15 }
    ],
    performance: {
      avg_processing_time: 3.2,
      success_rate: 98.5,
      user_satisfaction: 4.7
    },
    user_engagement: {
      daily_active_users: 324,
      weekly_active_users: 1890,
      monthly_active_users: 5420,
      avg_session_duration: 14.2
    },
    recent_activity: [
      { id: "1", type: "upload", description: "CV uploaded", timestamp: new Date().toISOString(), user: "user_123" },
      { id: "2", type: "generate", description: "Portfolio generated", timestamp: new Date().toISOString(), user: "user_456" }
    ],
    geographic_distribution: [
      { country: "United States", users: 15420, percentage: 33.7 },
      { country: "United Kingdom", users: 8924, percentage: 19.5 },
      { country: "Germany", users: 6845, percentage: 14.9 },
      { country: "Canada", users: 4923, percentage: 10.8 },
      { country: "France", users: 3847, percentage: 8.4 },
      { country: "Others", users: 5821, percentage: 12.7 }
    ],
    last_updated: new Date().toISOString()
  };
  const data = fallbackData;
  const isUsingFallback = true;

  // Create chart data from analytics data
  const chartData = {
    traffic: [
      { name: "Jan", views: 4000, visitors: 2400, portfolios: data.metrics.portfolios_generated * 0.8 },
      { name: "Feb", views: 3000, visitors: 1398, portfolios: data.metrics.portfolios_generated * 0.85 },
      { name: "Mar", views: 2000, visitors: 3800, portfolios: data.metrics.portfolios_generated * 0.9 },
      { name: "Apr", views: 2780, visitors: 3908, portfolios: data.metrics.portfolios_generated * 0.95 },
      { name: "May", views: 1890, visitors: 4800, portfolios: data.metrics.portfolios_generated * 0.98 },
      { name: "Jun", views: 2390, visitors: 3800, portfolios: data.metrics.portfolios_generated }
    ],
    devices: [
      { name: "Desktop", value: 62, count: data.user_engagement.daily_active_users * 0.6 },
      { name: "Mobile", value: 28, count: data.user_engagement.daily_active_users * 0.3 },
      { name: "Tablet", value: 10, count: data.user_engagement.daily_active_users * 0.1 }
    ],
    performanceRadar: [
      { metric: "Processing Speed", score: 95 - data.performance.avg_processing_time * 10, target: 90 },
      { metric: "Success Rate", score: data.performance.success_rate, target: 95 },
      { metric: "User Satisfaction", score: data.performance.user_satisfaction * 20, target: 85 },
      { metric: "ATS Score", score: data.metrics.avg_ats_score, target: 80 },
      { metric: "Engagement", score: Math.min(data.user_engagement.avg_session_duration * 6, 100), target: 75 }
    ]
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }
  return (
    <div className={`${mobileGrid.container} ${mobileSpacing.section}`}>
      {/* Header */}
      <motion.div
        {...mobileAnimations.fadeInUp}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className={`${mobileTypography.hero} font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
            Analytics Dashboard
          </h1>
          <p className={`${mobileTypography.body} text-muted-foreground mt-2`}>
            Real-time insights into your portfolio performance
          </p>
          {isUsingFallback && (
            <Badge variant="outline" className="mt-2 text-amber-600 border-amber-200">
              <Activity className="w-3 h-3 mr-1" />
              Demo Data
            </Badge>
          )}
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" size={isMobile ? "sm" : "default"} className="flex-1 md:flex-none">
            <Activity className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button size={isMobile ? "sm" : "default"} className="flex-1 md:flex-none">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Overview Cards */}
      <motion.div
        {...mobileAnimations.fadeInUp}
        transition={{ delay: 0.1 }}
        className={`${mobileGrid["grid-2"]} lg:grid-cols-5`}
      ><Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CVs Processed</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.metrics.cvs_processed.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <ArrowUpRight className="w-3 h-3 inline mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolios Generated</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.metrics.portfolios_generated.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <ArrowUpRight className="w-3 h-3 inline mr-1" />
              +18% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ATS Resumes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.metrics.ats_resumes_created}</div>
            <p className="text-xs text-muted-foreground">
              <ArrowUpRight className="w-3 h-3 inline mr-1" />
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.metrics.total_downloads.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <ArrowUpRight className="w-3 h-3 inline mr-1" />
              +3.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg ATS Score</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.metrics.avg_ats_score}%</div>
            <p className="text-xs text-muted-foreground">
              <ArrowUpRight className="w-3 h-3 inline mr-1" />
              +5.1% from last month
            </p>
          </CardContent>
        </Card>
      </motion.div>      {/* Charts Row 1 */}
      <motion.div
        {...mobileAnimations.fadeInUp}
        transition={{ delay: 0.2 }}
        className={`${mobileGrid.grid} lg:grid-cols-2`}
      >
        {/* Traffic Trends */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Traffic Trends
            </CardTitle>
            <CardDescription>Monthly views, visitors, and portfolios created</CardDescription>
          </CardHeader>          <CardContent>
            <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
              <AreaChart data={chartData.traffic}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  stackId="1"
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="visitors" 
                  stackId="1"
                  stroke="#82ca9d" 
                  fill="#82ca9d" 
                  fillOpacity={0.6}
                />
                <Area 
                  type="monotone" 
                  dataKey="portfolios" 
                  stackId="1"
                  stroke="#ffc658" 
                  fill="#ffc658" 
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Device Breakdown
            </CardTitle>
            <CardDescription>How users access your portfolios</CardDescription>
          </CardHeader>
          <CardContent>            <div className="flex flex-col lg:flex-row items-center gap-4">
              <ResponsiveContainer width="60%" height={200}>
                <PieChart>
                  <Pie
                    data={chartData.devices}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartData.devices.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {chartData.devices.map((device, index) => (
                  <div key={device.name} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm">{device.name}</span>
                    <Badge variant="secondary">{device.value}%</Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>      {/* Charts Row 2 */}
      <motion.div
        {...mobileAnimations.fadeInUp}
        transition={{ delay: 0.3 }}
        className={`${mobileGrid.grid} lg:grid-cols-2`}
      >
        {/* Geographic Distribution */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Geographic Distribution
            </CardTitle>
            <CardDescription>Top countries by visitor count</CardDescription>
          </CardHeader>          <CardContent>
            <div className="space-y-4">
              {data.geographic_distribution.map((country: { country: string; users: number; percentage: number }, index: number) => (
                <div key={country.country} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-5 bg-gray-200 rounded-sm flex items-center justify-center">
                      <span className="text-xs font-semibold">
                        {country.country.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium">{country.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={country.percentage} className="w-20" />
                    <span className="text-sm text-gray-600 w-16 text-right">
                      {country.users.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Template Usage */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Template Usage
            </CardTitle>
            <CardDescription>Most popular portfolio templates</CardDescription>
          </CardHeader>          <CardContent>
            <ResponsiveContainer width="100%" height={isMobile ? 200 : 250}>
              <LineChart data={data.popular_templates}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#8884d8" 
                  strokeWidth={3}
                  dot={{ fill: "#8884d8", strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>      {/* Performance Metrics */}
      <motion.div
        {...mobileAnimations.fadeInUp}
        transition={{ delay: 0.4 }}
      >
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Performance Metrics
            </CardTitle>
            <CardDescription>Key performance indicators for portfolio optimization</CardDescription>
          </CardHeader>          <CardContent>
            <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
              <RadarChart data={chartData.performanceRadar}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar
                  name="Target"
                  dataKey="target"
                  stroke="#82ca9d"
                  fill="transparent"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <p className="text-red-700">Error loading analytics: {error?.message || String(error)}</p>
          <Button onClick={() => fetchAllAnalytics()} variant="outline" size="sm" className="mt-2">
            Try Again
          </Button>
        </motion.div>
      )}
    </div>
  );
}
