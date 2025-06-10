'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  FileText, 
  Upload, 
  Users, 
  Settings, 
  TrendingUp,
  Activity,
  Calendar,
  Bell,
  Search,
  Filter,
  Download,
  Eye,
  Edit3,
  Trash2,
  Plus
} from 'lucide-react'
import { ProtectedRoute, useAuth } from '@/components/auth/AuthComponent'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import Link from 'next/link'

// Stats card component
const StatsCard = ({ title, value, change, icon: Icon, color = 'blue' }: {
  title: string
  value: string
  change: string
  icon: any
  color?: string
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card className="backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300">      <CardContent className="p-4">        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-300">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className={`text-xs ${change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
              {change} from last month
            </p>
          </div>
          <div className={`p-3 rounded-full bg-${color}-500/20`}>
            <Icon className={`h-5 w-5 text-${color}-400`} />
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
)

// Recent activity item component
const ActivityItem = ({ action, file, time, status }: {
  action: string
  file: string
  time: string
  status: 'success' | 'processing' | 'failed'
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
  >    <div className="flex items-center space-x-3">      <div className={`w-2 h-2 rounded-full ${
        status === 'success' ? 'bg-emerald-400' :
        status === 'processing' ? 'bg-amber-400' : 'bg-red-400'
      }`} /><div>
        <p className="text-white text-sm font-medium">{action}</p>
        <p className="text-xs text-gray-400">{file}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-xs text-gray-400">{time}</p>      <p className={`text-xs capitalize ${
        status === 'success' ? 'text-emerald-400' :
        status === 'processing' ? 'text-amber-400' : 'text-red-400'
      }`}>
        {status}
      </p>
    </div>
  </motion.div>
)

// File item component
const FileItem = ({ name, size, uploadDate, status }: {
  name: string
  size: string
  uploadDate: string
  status: 'processed' | 'processing' | 'failed'
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
  >    <div className="flex items-center space-x-3">
      <FileText className="h-5 w-5 text-blue-400" />
      <div>
        <p className="text-white text-sm font-medium">{name}</p>
        <p className="text-xs text-gray-400">{size} • {uploadDate}</p>
      </div>
    </div>
    <div className="flex items-center space-x-2">
      <span className={`px-3 py-1 rounded-full text-xs border ${
        status === 'processed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
        status === 'processing' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
        'bg-red-500/20 text-red-400 border-red-500/30'
      }`}>
        {status}
      </span>      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
          <Eye className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
          <Download className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-400 hover:text-red-300">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </motion.div>
)

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Header */}
        <div className="sticky top-0 z-10 backdrop-blur-xl bg-black/20 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">              <div>
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <p className="text-sm text-gray-400">Welcome back, {user?.username}</p>
              </div>              <div className="flex items-center space-x-4">
                <Button size="sm" variant="ghost" className="h-9 w-9 p-0">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-9 w-9 p-0">
                  <Settings className="h-4 w-4" />
                </Button>
                {user?.is_admin && (
                  <Link href="/admin">
                    <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-sm h-9 px-4">
                      Admin Panel
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >            <div className="flex flex-wrap gap-4">              <Link href="/upload">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-sm h-10 px-6">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </Link>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 text-sm h-10 px-6">
                <Search className="h-4 w-4 mr-2" />
                Search Files
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 text-sm h-10 px-6">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Documents"
              value="1,234"
              change="+12%"
              icon={FileText}
              color="blue"
            />
            <StatsCard
              title="Processed Today"
              value="56"
              change="+23%"
              icon={TrendingUp}
              color="green"
            />
            <StatsCard
              title="Processing Queue"
              value="8"
              change="-5%"
              icon={Activity}
              color="yellow"
            />
            <StatsCard
              title="Storage Used"
              value="2.4 GB"
              change="+8%"
              icon={BarChart3}
              color="purple"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card className="backdrop-blur-xl bg-white/10 border-white/20">                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white text-lg font-medium">Recent Activity</CardTitle>
                      <CardDescription className="text-gray-400 text-sm">
                        Latest document processing activities
                      </CardDescription>
                    </div>                    <Button size="sm" variant="ghost" className="h-9 w-9 p-0">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ActivityItem
                    action="Document Processed"
                    file="Financial_Report_Q3.pdf"
                    time="2 minutes ago"
                    status="success"
                  />
                  <ActivityItem
                    action="Upload Started"
                    file="Contract_Agreement.docx"
                    time="5 minutes ago"
                    status="processing"
                  />
                  <ActivityItem
                    action="Processing Failed"
                    file="Corrupted_File.pdf"
                    time="15 minutes ago"
                    status="failed"
                  />
                  <ActivityItem
                    action="Document Processed"
                    file="Invoice_2024_001.pdf"
                    time="1 hour ago"
                    status="success"
                  />
                  <ActivityItem
                    action="Bulk Upload Complete"
                    file="Monthly_Reports.zip"
                    time="2 hours ago"
                    status="success"
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >              <Card className="backdrop-blur-xl bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white text-lg font-medium">Processing Status</CardTitle>
                </CardHeader>
                <CardContent>                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Success Rate</span>
                      <span className="text-emerald-400">94.2%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-emerald-400 h-2 rounded-full w-[94%]"></div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Queue Length</span>
                      <span className="text-amber-400">8 files</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-amber-400 h-2 rounded-full w-[30%]"></div>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Storage</span>
                      <span className="text-blue-400">2.4/10 GB</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-400 h-2 rounded-full w-[24%]"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>              <Card className="backdrop-blur-xl bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white text-lg font-medium">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start text-sm h-10" variant="ghost">
                    <Plus className="h-4 w-4 mr-2" />
                    New Upload
                  </Button>
                  <Button className="w-full justify-start text-sm h-10" variant="ghost">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Processing
                  </Button>
                  <Button className="w-full justify-start text-sm h-10" variant="ghost">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                  <Button className="w-full justify-start text-sm h-10" variant="ghost">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent Files */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <Card className="backdrop-blur-xl bg-white/10 border-white/20">              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white text-lg font-medium">Recent Files</CardTitle>
                    <CardDescription className="text-gray-400 text-sm">
                      Your recently uploaded and processed documents
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search files..."
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 text-sm h-10 w-64"
                      />
                    </div>
                    <Button size="sm" variant="outline" className="border-white/20 text-white text-sm h-10 px-4">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <FileItem
                  name="Financial_Report_Q3.pdf"
                  size="2.4 MB"
                  uploadDate="Today, 3:42 PM"
                  status="processed"
                />
                <FileItem
                  name="Contract_Agreement.docx"
                  size="856 KB"
                  uploadDate="Today, 2:15 PM"
                  status="processing"
                />
                <FileItem
                  name="Invoice_2024_001.pdf"
                  size="1.2 MB"
                  uploadDate="Yesterday, 4:28 PM"
                  status="processed"
                />
                <FileItem
                  name="Meeting_Notes.txt"
                  size="45 KB"
                  uploadDate="Yesterday, 2:10 PM"
                  status="processed"
                />
                <FileItem
                  name="Presentation_Draft.pptx"
                  size="5.7 MB"
                  uploadDate="2 days ago"
                  status="failed"
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  )
}