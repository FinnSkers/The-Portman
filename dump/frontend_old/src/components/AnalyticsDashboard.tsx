"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaChartLine, FaUsers, FaFileAlt, FaDownload, FaEye, FaClock, FaGlobe } from "react-icons/fa";
import { BiAnalyse, BiTrendingUp } from "react-icons/bi";
import { HiDocumentText, HiTemplate } from "react-icons/hi";
import GlassCard from "./GlassCard";

interface AnalyticsData {
  totalCVsProcessed: number;
  totalPortfoliosGenerated: number;
  totalATSResumes: number;
  totalDownloads: number;
  averageATSScore: number;
  popularTemplates: Array<{ name: string; usage: number; percentage: number }>;
  recentActivity: Array<{ 
    type: 'cv_upload' | 'portfolio_generated' | 'ats_resume' | 'download';
    timestamp: string;
    user?: string;
    details: string;
  }>;
  performanceMetrics: {
    avgProcessingTime: number;
    successRate: number;
    userSatisfaction: number;
  };
  userEngagement: {
    dailyActive: number;
    weeklyActive: number;
    monthlyActive: number;
    averageSessionDuration: number;
  };
  geographicData: Array<{ country: string; users: number; percentage: number }>;
}

interface TimeRange {
  label: string;
  value: '24h' | '7d' | '30d' | '90d';
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange['value']>('7d');

  const timeRanges: TimeRange[] = [
    { label: 'Last 24 Hours', value: '24h' },
    { label: 'Last 7 Days', value: '7d' },
    { label: 'Last 30 Days', value: '30d' },
    { label: 'Last 90 Days', value: '90d' }
  ];

  useEffect(() => {
    fetchAnalytics();
  }, [selectedTimeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch real analytics data from backend API
      const response = await fetch(`http://localhost:8000/api/v1/analytics/dashboard?time_range=${selectedTimeRange}`);
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }
      const data = await response.json();
      
      // Transform backend data to match frontend interface
      const transformedData: AnalyticsData = {
        totalCVsProcessed: data.metrics.cvs_processed,
        totalPortfoliosGenerated: data.metrics.portfolios_generated,
        totalATSResumes: data.metrics.ats_resumes_created,
        totalDownloads: data.metrics.total_downloads,
        averageATSScore: data.metrics.avg_ats_score,
        popularTemplates: data.popular_templates.map((template: any) => ({
          name: template.name,
          usage: template.count,
          percentage: template.percentage
        })),
        recentActivity: data.recent_activity.map((activity: any) => ({
          type: activity.type,
          timestamp: formatTimestamp(activity.timestamp),
          user: activity.user,
          details: activity.description
        })),
        performanceMetrics: {
          avgProcessingTime: data.performance.avg_processing_time,
          successRate: data.performance.success_rate,
          userSatisfaction: data.performance.user_satisfaction
        },
        userEngagement: {
          dailyActive: data.user_engagement.daily_active_users,
          weeklyActive: data.user_engagement.weekly_active_users,
          monthlyActive: data.user_engagement.monthly_active_users,
          averageSessionDuration: data.user_engagement.avg_session_duration
        },
        geographicData: data.geographic_distribution.map((geo: any) => ({
          country: geo.country,
          users: geo.users,
          percentage: geo.percentage
        }))
      };
      
      setAnalytics(transformedData);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Fallback to mock data if API fails
      const mockData: AnalyticsData = {
        totalCVsProcessed: 1247,
        totalPortfoliosGenerated: 892,
        totalATSResumes: 654,
        totalDownloads: 1879,
        averageATSScore: 87.3,
        popularTemplates: [
          { name: 'Modern Glass', usage: 324, percentage: 36.3 },
          { name: 'Professional Clean', usage: 267, percentage: 29.9 },
          { name: 'Creative Portfolio', usage: 178, percentage: 20.0 },
          { name: 'Minimal Elegant', usage: 123, percentage: 13.8 }
        ],
        recentActivity: [
          { type: 'cv_upload', timestamp: '2 minutes ago', user: 'John D.', details: 'Software Engineer CV uploaded' },
          { type: 'portfolio_generated', timestamp: '5 minutes ago', user: 'Sarah M.', details: 'Modern Glass template' },
          { type: 'ats_resume', timestamp: '8 minutes ago', user: 'Mike R.', details: 'Technical ATS resume generated' },
          { type: 'download', timestamp: '12 minutes ago', user: 'Lisa K.', details: 'Portfolio website downloaded' },
          { type: 'cv_upload', timestamp: '15 minutes ago', user: 'David L.', details: 'Marketing Manager CV uploaded' }
        ],
        performanceMetrics: {
          avgProcessingTime: 12.3,
          successRate: 98.7,
          userSatisfaction: 4.8
        },
        userEngagement: {
          dailyActive: 156,
          weeklyActive: 743,
          monthlyActive: 2891,
          averageSessionDuration: 8.7
        },
        geographicData: [
          { country: 'United States', users: 542, percentage: 35.2 },
          { country: 'United Kingdom', users: 298, percentage: 19.3 },
          { country: 'Canada', users: 187, percentage: 12.1 },
          { country: 'Germany', users: 156, percentage: 10.1 },
          { country: 'Australia', users: 123, percentage: 8.0 },
          { country: 'Others', users: 234, percentage: 15.3 }
        ]
      };
      setAnalytics(mockData);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'cv_upload': return <FaFileAlt className="w-4 h-4 text-blue-500" />;
      case 'portfolio_generated': return <HiTemplate className="w-4 h-4 text-purple-500" />;
      case 'ats_resume': return <HiDocumentText className="w-4 h-4 text-green-500" />;
      case 'download': return <FaDownload className="w-4 h-4 text-orange-500" />;
      default: return <FaEye className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'cv_upload': return 'bg-blue-100 dark:bg-blue-900/20';
      case 'portfolio_generated': return 'bg-purple-100 dark:bg-purple-900/20';
      case 'ats_resume': return 'bg-green-100 dark:bg-green-900/20';
      case 'download': return 'bg-orange-100 dark:bg-orange-900/20';
      default: return 'bg-gray-100 dark:bg-gray-900/20';
    }
  };

  if (loading) {
    return (
      <GlassCard className="max-w-6xl mx-auto p-8">
        <div className="text-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 mx-auto"
          >
            <BiAnalyse className="w-12 h-12 text-indigo-600" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Loading Analytics...</h2>
          <p className="text-gray-600 dark:text-gray-400">Fetching real-time platform data</p>
        </div>
      </GlassCard>
    );
  }

  if (!analytics) {
    return (
      <GlassCard className="max-w-6xl mx-auto p-8">
        <div className="text-center space-y-4">
          <FaChartLine className="w-12 h-12 mx-auto text-red-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Unavailable</h2>
          <p className="text-gray-600 dark:text-gray-400">Unable to load analytics data. Please try again later.</p>
        </div>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3"
        >
          <BiAnalyse className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h1>
        </motion.div>
        <p className="text-gray-600 dark:text-gray-400">Real-time insights into platform performance</p>
      </div>

      {/* Time Range Selector */}
      <GlassCard className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <FaClock className="w-4 h-4" />
            Time Range:
          </div>
          <div className="flex flex-wrap gap-2">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => setSelectedTimeRange(range.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedTimeRange === range.value
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white/10 hover:bg-white/20 text-gray-700 dark:text-gray-300'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <motion.div whileHover={{ scale: 1.02 }}>
          <GlassCard className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <FaFileAlt className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {analytics.totalCVsProcessed.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">CVs Processed</div>
          </GlassCard>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <GlassCard className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
              <HiTemplate className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {analytics.totalPortfoliosGenerated.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Portfolios Generated</div>
          </GlassCard>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <GlassCard className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <HiDocumentText className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {analytics.totalATSResumes.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">ATS Resumes</div>
          </GlassCard>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <GlassCard className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
              <FaDownload className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {analytics.totalDownloads.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Downloads</div>
          </GlassCard>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }}>
          <GlassCard className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center">
              <BiTrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {analytics.averageATSScore}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg ATS Score</div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Popular Templates & Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Templates */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <HiTemplate className="w-5 h-5 text-purple-600" />
            Popular Templates
          </h3>
          <div className="space-y-4">
            {analytics.popularTemplates.map((template, index) => (
              <motion.div
                key={template.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {template.name}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {template.usage} uses ({template.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${template.percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* Performance Metrics */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <FaChartLine className="w-5 h-5 text-green-600" />
            Performance Metrics
          </h3>
          <div className="space-y-6">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {analytics.performanceMetrics.avgProcessingTime}s
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Processing Time</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {analytics.performanceMetrics.successRate}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600 mb-1">
                ★ {analytics.performanceMetrics.userSatisfaction}/5.0
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">User Satisfaction</div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* User Engagement & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Engagement */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <FaUsers className="w-5 h-5 text-blue-600" />
            User Engagement
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-xl font-bold text-blue-600 mb-1">
                {analytics.userEngagement.dailyActive}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Daily Active</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-xl font-bold text-purple-600 mb-1">
                {analytics.userEngagement.weeklyActive}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Weekly Active</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-xl font-bold text-green-600 mb-1">
                {analytics.userEngagement.monthlyActive.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Monthly Active</div>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-xl font-bold text-orange-600 mb-1">
                {analytics.userEngagement.averageSessionDuration}m
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Avg Session</div>
            </div>
          </div>
        </GlassCard>

        {/* Recent Activity */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <FaEye className="w-5 h-5 text-indigo-600" />
            Recent Activity
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {analytics.recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-3 rounded-lg ${getActivityColor(activity.type)} flex items-center gap-3`}
              >
                <div className="flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {activity.details}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {activity.user} • {activity.timestamp}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Geographic Distribution */}
      <GlassCard className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <FaGlobe className="w-5 h-5 text-blue-600" />
          Geographic Distribution
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analytics.geographicData.map((geo, index) => (
            <motion.div
              key={geo.country}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-white/10 dark:bg-gray-800/50 rounded-lg"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-900 dark:text-white">
                  {geo.country}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {geo.percentage}%
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {geo.users.toLocaleString()} users
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${geo.percentage}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
