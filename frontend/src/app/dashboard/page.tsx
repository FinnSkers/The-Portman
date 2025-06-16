"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Upload, 
  BarChart3, 
  Settings,
  User,
  Zap,
  Plus,
  TrendingUp,
  Download,
  Eye,
  Loader2
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import type { DashboardAnalytics, CV } from "@/lib/api";

export default function DashboardPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = React.useState(true);
  const [analytics, setAnalytics] = React.useState<DashboardAnalytics | null>(null);
  const [cvs, setCvs] = React.useState<CV[]>([]);  const [error, setError] = React.useState<string>("");

  React.useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) return; // Wait for user to be loaded by auth context
      
      try {
        setIsLoading(true);
        setError("");

        // Load dashboard data
        const [analyticsResponse, cvsResponse] = await Promise.all([
          api.getAnalytics(),
          api.getCVs()
        ]);

        if (analyticsResponse.data) {
          setAnalytics(analyticsResponse.data);
        }
        
        if (cvsResponse.data) {
          setCvs(cvsResponse.data);
        }

      } catch (err) {
        console.error("Dashboard data loading error:", err);
        setError("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const response = await api.uploadCV(file);
      if (response.data) {
        // Refresh CV list
        const cvsResponse = await api.getCVs();
        if (cvsResponse.data) {
          setCvs(cvsResponse.data);
        }
      }
    } catch (err) {
      console.error("File upload error:", err);
      setError("Failed to upload CV");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !analytics) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Zap className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-gradient">PORTMAN</span>
              </Link>
              <Badge variant="secondary">Dashboard</Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/profile">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>      <div className="container mx-auto px-4 py-8">
        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
            {error}
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name || "User"}! 👋
          </h1>
          <p className="text-muted-foreground">
            Ready to take your career to the next level? Let&apos;s get started.
          </p>
        </div>        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="glass-morphism border-0 cursor-pointer hover:scale-105 transition-transform">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Upload className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Upload New CV</h3>
                  <p className="text-sm text-muted-foreground">Add a new resume for AI optimization</p>
                </div>
              </div>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isLoading}
              />
            </CardContent>
          </Card>
          
          <QuickActionCard
            title="View Analytics"
            description="Track your career progress and insights"
            icon={<BarChart3 className="h-6 w-6" />}
            href="/dashboard/analytics"
            color="bg-green-500/10 text-green-500"
          />
          <QuickActionCard
            title="Manage CVs"
            description="View and edit your existing resumes"
            icon={<FileText className="h-6 w-6" />}
            href="/dashboard/cvs"
            color="bg-purple-500/10 text-purple-500"
          />
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
              {/* Recent CVs */}
            <Card className="glass-morphism border-0">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent CVs</CardTitle>
                  <CardDescription>Your latest resume optimizations</CardDescription>
                </div>
                <Button size="sm" asChild>
                  <Link href="/dashboard/cvs">
                    View All ({cvs.length})
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {cvs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No CVs uploaded yet</p>
                    <p className="text-sm">Upload your first resume to get started</p>
                  </div>
                ) : (
                  cvs.slice(0, 3).map((cv) => (
                    <CVItem
                      key={cv.id}
                      name={cv.filename}
                      type={cv.file_type.toUpperCase()}
                      lastModified={new Date(cv.uploaded_at).toLocaleDateString()}
                      status={cv.status === 'completed' ? 'Ready' : cv.status === 'processing' ? 'Processing' : 'Error'}
                      atsScore={cv.analysis?.ats_score}
                    />
                  ))
                )}
              </CardContent>
            </Card>            {/* Analytics Overview */}
            <Card className="glass-morphism border-0">
              <CardHeader>
                <CardTitle>Performance Overview</CardTitle>
                <CardDescription>Your career metrics at a glance</CardDescription>
              </CardHeader>
              <CardContent>                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard 
                    number={analytics?.total_cvs?.toString() || "0"} 
                    label="CVs Created" 
                  />
                  <StatCard 
                    number={analytics?.avg_ats_score ? `${Math.round(analytics.avg_ats_score)}%` : "0%"} 
                    label="Avg ATS Score" 
                  />
                  <StatCard 
                    number={analytics?.total_applications?.toString() || "0"} 
                    label="Applications" 
                  />
                  <StatCard 
                    number={analytics?.interview_rate ? `${Math.round(analytics.interview_rate * 100)}%` : "0%"} 
                    label="Interview Rate" 
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Account Status */}
            <Card className="glass-morphism border-0">
              <CardHeader>
                <CardTitle className="text-lg">Account Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Plan</span>
                    <Badge>Professional</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">CVs Remaining</span>
                    <span className="text-sm font-medium">Unlimited</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Next Billing</span>
                    <span className="text-sm font-medium">Jan 15, 2025</span>
                  </div>
                  <Button size="sm" variant="outline" className="w-full" asChild>
                    <Link href="/settings/billing">
                      Manage Plan
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tips & Insights */}
            <Card className="glass-morphism border-0">
              <CardHeader>
                <CardTitle className="text-lg">AI Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-start">
                      <TrendingUp className="h-4 w-4 text-primary mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Skill Trending</p>
                        <p className="text-xs text-muted-foreground">
                          React.js is trending in your field
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-green-500/5 rounded-lg border border-green-500/20">
                    <div className="flex items-start">
                      <Zap className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Optimization Tip</p>
                        <p className="text-xs text-muted-foreground">
                          Add quantified achievements to boost impact
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

function QuickActionCard({ title, description, icon, href, color }: QuickActionCardProps) {
  return (
    <Card className="glass-morphism border-0 hover:scale-105 transition-all duration-300 group cursor-pointer">
      <Link href={href}>
        <CardHeader className="pb-3">
          <div className={`mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg ${color}`}>
            {icon}
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription className="text-sm">{description}</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <Button size="sm" variant="ghost" className="group-hover:translate-x-1 transition-transform">
            Get Started
            <Plus className="ml-2 h-3 w-3" />
          </Button>
        </CardContent>
      </Link>
    </Card>
  );
}

interface CVItemProps {
  name: string;
  type: string;
  lastModified: string;
  status: string;
  atsScore?: number;
}

function CVItem({ name, type, lastModified, status, atsScore }: CVItemProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/30 transition-colors">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="font-medium text-sm">{name}</p>
          <p className="text-xs text-muted-foreground">
            {type} • {lastModified}
            {atsScore && ` • ATS Score: ${atsScore}%`}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Badge variant={status === "Ready" ? "default" : "secondary"} className="text-xs">
          {status}
        </Badge>
        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
          <Eye className="h-3 w-3" />
        </Button>
        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
          <Download className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

interface StatCardProps {
  number: string;
  label: string;
}

function StatCard({ number, label }: StatCardProps) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-gradient mb-1">{number}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
