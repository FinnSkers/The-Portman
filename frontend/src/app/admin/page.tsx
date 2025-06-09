'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Shield, 
  Settings, 
  Database,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Search,
  Filter,
  Download,
  Plus,
  Edit3,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Crown,
  Mail,
  Calendar,
  BarChart3,
  TrendingUp,
  Server,
  HardDrive,
  Cpu,
  Wifi
} from 'lucide-react'
import { ProtectedRoute, useAuth } from '@/components/auth/AuthComponent'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import Link from 'next/link'

// Admin stats card component
const AdminStatsCard = ({ title, value, change, icon: Icon, color = 'blue' }: {
  title: string
  value: string
  change: string
  icon: any
  color?: string
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-300">{title}</p>
            <p className="text-3xl font-bold text-white">{value}</p>
            <p className={`text-sm ${change.startsWith('+') ? 'text-green-400' : change.startsWith('-') ? 'text-red-400' : 'text-gray-400'}`}>
              {change}
            </p>
          </div>
          <div className={`p-4 rounded-full bg-${color}-500/20`}>
            <Icon className={`h-8 w-8 text-${color}-400`} />
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
)

// User management row component
const UserRow = ({ user, onEdit, onDelete, onToggleStatus }: {
  user: any
  onEdit: (user: any) => void
  onDelete: (userId: string) => void
  onToggleStatus: (userId: string) => void
}) => (
  <motion.tr
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="border-b border-white/10 hover:bg-white/5 transition-colors"
  >
    <td className="px-6 py-4">
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          user.is_admin ? 'bg-purple-500/20' : 'bg-blue-500/20'
        }`}>
          {user.is_admin ? (
            <Crown className="h-5 w-5 text-purple-400" />
          ) : (
            <Users className="h-5 w-5 text-blue-400" />
          )}
        </div>
        <div>
          <p className="text-white font-medium">{user.username}</p>
          <p className="text-sm text-gray-400">{user.email}</p>
        </div>
      </div>
    </td>
    <td className="px-6 py-4">
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
        user.is_admin 
          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
      }`}>
        {user.is_admin ? 'Admin' : 'User'}
      </span>
    </td>
    <td className="px-6 py-4">
      <div className="flex items-center space-x-2">
        {user.is_active ? (
          <CheckCircle className="h-4 w-4 text-green-400" />
        ) : (
          <XCircle className="h-4 w-4 text-red-400" />
        )}
        <span className={`text-sm ${user.is_active ? 'text-green-400' : 'text-red-400'}`}>
          {user.is_active ? 'Active' : 'Inactive'}
        </span>
      </div>
    </td>
    <td className="px-6 py-4 text-sm text-gray-400">
      {new Date(user.created_at).toLocaleDateString()}
    </td>
    <td className="px-6 py-4">
      <div className="flex items-center space-x-2">
        <Button size="sm" variant="ghost" onClick={() => onEdit(user)}>
          <Edit3 className="h-4 w-4" />
        </Button>
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={() => onToggleStatus(user.id)}
          className={user.is_active ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'}
        >
          {user.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
        </Button>
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={() => onDelete(user.id)}
          className="text-red-400 hover:text-red-300"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </td>
  </motion.tr>
)

// System status component
const SystemStatusCard = () => (
  <Card className="backdrop-blur-xl bg-white/10 border-white/20">
    <CardHeader>
      <CardTitle className="text-white flex items-center">
        <Server className="h-5 w-5 mr-2" />
        System Status
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-gray-300">API Server</span>
        </div>
        <span className="text-green-400 text-sm">Online</span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-gray-300">Database</span>
        </div>
        <span className="text-green-400 text-sm">Connected</span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
          <span className="text-gray-300">AI Services</span>
        </div>
        <span className="text-yellow-400 text-sm">Degraded</span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-gray-300">Storage</span>
        </div>
        <span className="text-green-400 text-sm">85% Used</span>
      </div>
    </CardContent>
  </Card>
)

export default function AdminPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')

  // Mock user data
  const mockUsers = [
    {
      id: '1',
      username: 'admin',
      email: 'admin@portman.com',
      is_admin: true,
      is_active: true,
      created_at: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      username: 'john_doe',
      email: 'john@example.com',
      is_admin: false,
      is_active: true,
      created_at: '2024-02-20T14:22:00Z'
    },
    {
      id: '3',
      username: 'jane_smith',
      email: 'jane@example.com',
      is_admin: false,
      is_active: false,
      created_at: '2024-03-10T09:15:00Z'
    }
  ]

  const handleEditUser = (user: any) => {
    console.log('Edit user:', user)
    // TODO: Implement user editing
  }

  const handleDeleteUser = (userId: string) => {
    console.log('Delete user:', userId)
    // TODO: Implement user deletion
  }

  const handleToggleUserStatus = (userId: string) => {
    console.log('Toggle user status:', userId)
    // TODO: Implement user status toggle
  }

  const filteredUsers = mockUsers.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Header */}
        <div className="sticky top-0 z-10 backdrop-blur-xl bg-black/20 border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center">
                  <Shield className="h-6 w-6 mr-2 text-purple-400" />
                  Admin Panel
                </h1>
                <p className="text-sm text-gray-400">System administration and user management</p>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/dashboard">
                  <Button size="sm" variant="outline" className="border-white/20 text-white">
                    Back to Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Admin Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex space-x-1 bg-white/10 backdrop-blur-xl rounded-lg p-1">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'users', label: 'Users', icon: Users },
                { id: 'system', label: 'System', icon: Settings },
                { id: 'logs', label: 'Logs', icon: Activity }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white/20 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Admin Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <AdminStatsCard
                  title="Total Users"
                  value="1,247"
                  change="+12% this month"
                  icon={Users}
                  color="blue"
                />
                <AdminStatsCard
                  title="Active Sessions"
                  value="89"
                  change="+5% from yesterday"
                  icon={Activity}
                  color="green"
                />
                <AdminStatsCard
                  title="System Load"
                  value="47%"
                  change="Normal range"
                  icon={Cpu}
                  color="yellow"
                />
                <AdminStatsCard
                  title="Storage Used"
                  value="156 GB"
                  change="85% of capacity"
                  icon={HardDrive}
                  color="purple"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* System Status */}
                <SystemStatusCard />

                {/* Recent Activity */}
                <div className="lg:col-span-2">
                  <Card className="backdrop-blur-xl bg-white/10 border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white">Recent Admin Activity</CardTitle>
                      <CardDescription className="text-gray-400">
                        Latest administrative actions and system events
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <div>
                            <p className="text-white font-medium">User Created</p>
                            <p className="text-sm text-gray-400">New user registration: john_new@example.com</p>
                          </div>
                        </div>
                        <span className="text-sm text-gray-400">2 min ago</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                          <div>
                            <p className="text-white font-medium">System Backup</p>
                            <p className="text-sm text-gray-400">Daily backup completed successfully</p>
                          </div>
                        </div>
                        <span className="text-sm text-gray-400">1 hour ago</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                          <div>
                            <p className="text-white font-medium">Failed Login Attempt</p>
                            <p className="text-sm text-gray-400">Multiple failed attempts from IP: 192.168.1.100</p>
                          </div>
                        </div>
                        <span className="text-sm text-gray-400">3 hours ago</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card className="backdrop-blur-xl bg-white/10 border-white/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">User Management</CardTitle>
                      <CardDescription className="text-gray-400">
                        Manage user accounts, permissions, and access
                      </CardDescription>
                    </div>
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-4">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                      />
                    </div>
                    <Button size="sm" variant="outline" className="border-white/20 text-white">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Created
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <UserRow
                            key={user.id}
                            user={user}
                            onEdit={handleEditUser}
                            onDelete={handleDeleteUser}
                            onToggleStatus={handleToggleUserStatus}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* System Tab */}
          {activeTab === 'system' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              <Card className="backdrop-blur-xl bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">System Configuration</CardTitle>
                  <CardDescription className="text-gray-400">
                    Application settings and configuration
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start" variant="ghost">
                    <Settings className="h-4 w-4 mr-2" />
                    General Settings
                  </Button>
                  <Button className="w-full justify-start" variant="ghost">
                    <Shield className="h-4 w-4 mr-2" />
                    Security Settings
                  </Button>
                  <Button className="w-full justify-start" variant="ghost">
                    <Database className="h-4 w-4 mr-2" />
                    Database Management
                  </Button>
                  <Button className="w-full justify-start" variant="ghost">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Configuration
                  </Button>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-xl bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">System Maintenance</CardTitle>
                  <CardDescription className="text-gray-400">
                    Maintenance tools and utilities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start" variant="ghost">
                    <Download className="h-4 w-4 mr-2" />
                    Backup Database
                  </Button>
                  <Button className="w-full justify-start" variant="ghost">
                    <Activity className="h-4 w-4 mr-2" />
                    View System Logs
                  </Button>
                  <Button className="w-full justify-start text-yellow-400 hover:text-yellow-300" variant="ghost">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Clear Cache
                  </Button>
                  <Button className="w-full justify-start text-red-400 hover:text-red-300" variant="ghost">
                    <XCircle className="h-4 w-4 mr-2" />
                    Restart Services
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Logs Tab */}
          {activeTab === 'logs' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="backdrop-blur-xl bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">System Logs</CardTitle>
                  <CardDescription className="text-gray-400">
                    Real-time system logs and error tracking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-black/50 rounded-lg p-4 font-mono text-sm text-gray-300 max-h-96 overflow-y-auto">
                    <div className="space-y-1">
                      <div className="text-green-400">[2024-06-09 15:42:23] INFO: Server started successfully</div>
                      <div className="text-blue-400">[2024-06-09 15:42:24] INFO: Database connection established</div>
                      <div className="text-green-400">[2024-06-09 15:42:25] INFO: Authentication service initialized</div>
                      <div className="text-yellow-400">[2024-06-09 15:43:12] WARN: High memory usage detected (87%)</div>
                      <div className="text-green-400">[2024-06-09 15:43:45] INFO: User login: admin@portman.com</div>
                      <div className="text-red-400">[2024-06-09 15:44:12] ERROR: Failed login attempt from 192.168.1.100</div>
                      <div className="text-green-400">[2024-06-09 15:44:23] INFO: Document processed: financial_report.pdf</div>
                      <div className="text-blue-400">[2024-06-09 15:45:01] INFO: Backup process started</div>
                      <div className="text-green-400">[2024-06-09 15:45:34] INFO: Backup completed successfully</div>
                      <div className="text-yellow-400">[2024-06-09 15:46:12] WARN: Slow query detected (2.3s)</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
