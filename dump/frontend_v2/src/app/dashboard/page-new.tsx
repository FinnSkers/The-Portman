"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
	BarChart3,
	TrendingUp,
	Download,
	Eye,
	MousePointer,
	Monitor,
	Globe,
	Activity,
	Star,
	Zap,
	Clock
} from "lucide-react";
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie
} from "recharts";
import { useAnalyticsData, useEventTracking } from "@/hooks/useAPI";
import { useAnalytics } from "@/lib/store";

interface DashboardAnalyticsData {
	overview: {
		total_views: number;
		total_clicks: number;
		profile_completeness: number;
		last_updated: string;
	};
	engagement: {
		daily_views: { date: string; views: number; clicks: number }[];
		top_skills: { skill: string; mentions: number; growth: number }[];
		device_stats: { device: string; percentage: number }[];
		geographic_data: { country: string; views: number; percentage: number }[];
	};
	performance: {
		avg_processing_time?: number;
		success_rate?: number;
		user_satisfaction?: number;
		response_rate?: number;
		interview_rate?: number;
		portfolio_views?: number;
		resume_downloads?: number;
	};
}

export default function DashboardPage() {
	const { analyticsData } = useAnalytics();
	const { fetchAllAnalytics, loading, error } = useAnalyticsData();
	const { trackEvent } = useEventTracking();

	useEffect(() => {
		// Fetch analytics data on component mount
		fetchAllAnalytics();

		// Track page visit
		trackEvent("dashboard_viewed", {
			timestamp: new Date().toISOString(),
			user_agent: navigator.userAgent,
		});
	}, [fetchAllAnalytics, trackEvent]);

	// Default data for when analytics data is not available
	const defaultData = {
		overview: {
			total_views: 1247,
			total_clicks: 89,
			profile_completeness: 85,
			last_updated: new Date().toISOString(),
		},
		engagement: {
			daily_views: [
				{ date: "2024-01-01", views: 45, clicks: 12 },
				{ date: "2024-01-02", views: 52, clicks: 8 },
				{ date: "2024-01-03", views: 38, clicks: 15 },
				{ date: "2024-01-04", views: 67, clicks: 18 },
				{ date: "2024-01-05", views: 71, clicks: 22 },
				{ date: "2024-01-06", views: 59, clicks: 14 },
				{ date: "2024-01-07", views: 82, clicks: 25 },
			],
			top_skills: [
				{ skill: "JavaScript", mentions: 45, growth: 12 },
				{ skill: "React", mentions: 38, growth: 8 },
				{ skill: "Python", mentions: 32, growth: 15 },
				{ skill: "Node.js", mentions: 28, growth: 5 },
				{ skill: "TypeScript", mentions: 25, growth: 18 },
			],
			device_stats: [
				{ device: "Desktop", percentage: 65 },
				{ device: "Mobile", percentage: 28 },
				{ device: "Tablet", percentage: 7 },
			],
			geographic_data: [
				{ country: "United States", views: 342, percentage: 35 },
				{ country: "United Kingdom", views: 198, percentage: 22 },
				{ country: "Canada", views: 156, percentage: 18 },
				{ country: "Germany", views: 89, percentage: 12 },
				{ country: "Others", views: 127, percentage: 13 },
			],
		},
		performance: {
			response_rate: 68,
			interview_rate: 24,
			portfolio_views: 1247,
			resume_downloads: 89,
		},
	};

	// Fix: Always use the local DashboardAnalyticsData type for data
	const analyticsDataRaw = analyticsData as any;
	const data: DashboardAnalyticsData =
		analyticsDataRaw && analyticsDataRaw.overview ? analyticsDataRaw : defaultData;

	const deviceColors = {
		Desktop: "#3B82F6",
		Mobile: "#10B981",
		Tablet: "#F59E0B",
	};

	const recentActivities = [
		{
			type: "view",
			message: "Portfolio viewed by Tech Recruiter",
			time: "2 hours ago",
			icon: Eye,
		},
		{
			type: "download",
			message: "Resume downloaded",
			time: "4 hours ago",
			icon: Download,
		},
		{
			type: "click",
			message: "LinkedIn profile clicked",
			time: "6 hours ago",
			icon: MousePointer,
		},
		{
			type: "view",
			message: "Portfolio viewed by Startup Founder",
			time: "1 day ago",
			icon: Eye,
		},
		{
			type: "download",
			message: "Resume downloaded",
			time: "2 days ago",
			icon: Download,
		},
	];

	if (loading) {
		return (
			<div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					<div className="flex items-center justify-center h-64">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
						<span className="ml-3 text-muted-foreground">
							Loading analytics...
						</span>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					<div className="flex flex-col items-center justify-center h-64 space-y-4">
						<div className="text-red-600">
							Failed to load analytics data
						</div>
						<Button onClick={fetchAllAnalytics} variant="outline">
							Try Again
						</Button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto space-y-8">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
						<div>
							<h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
								Analytics Dashboard
							</h1>
							<p className="text-muted-foreground mt-2">
								Track your portfolio performance and professional insights
							</p>
						</div>
						<Button
							onClick={fetchAllAnalytics}
							variant="outline"
							className="flex items-center gap-2"
						>
							<Activity className="w-4 h-4" />
							Refresh Data
						</Button>
					</div>
				</motion.div>

				{/* Overview Stats */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.1 }}
					>
						<Card className="hover:shadow-lg transition-shadow">
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium text-muted-foreground">
									Total Views
								</CardTitle>
								<Eye className="h-4 w-4 text-blue-600" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{data.overview.total_views.toLocaleString()}
								</div>
								<div className="flex items-center space-x-2 text-xs text-muted-foreground">
									<TrendingUp className="h-3 w-3 text-green-600" />
									<span className="text-green-600">+12.5%</span>
									<span>from last month</span>
								</div>
							</CardContent>
						</Card>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
					>
						<Card className="hover:shadow-lg transition-shadow">
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium text-muted-foreground">
									Total Clicks
								</CardTitle>
								<MousePointer className="h-4 w-4 text-green-600" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{data.overview.total_clicks.toLocaleString()}
								</div>
								<div className="flex items-center space-x-2 text-xs text-muted-foreground">
									<TrendingUp className="h-3 w-3 text-green-600" />
									<span className="text-green-600">+8.2%</span>
									<span>from last month</span>
								</div>
							</CardContent>
						</Card>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.3 }}
					>
						<Card className="hover:shadow-lg transition-shadow">
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium text-muted-foreground">
									Portfolio Views
								</CardTitle>
								<Zap className="h-4 w-4 text-purple-600" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{data.performance.portfolio_views !== undefined ? data.performance.portfolio_views.toLocaleString() : "-"}
								</div>
								<div className="flex items-center space-x-2 text-xs text-muted-foreground">
									<TrendingUp className="h-3 w-3 text-green-600" />
									<span className="text-green-600">+15.3%</span>
									<span>from last month</span>
								</div>
							</CardContent>
						</Card>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.4 }}
					>
						<Card className="hover:shadow-lg transition-shadow">
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium text-muted-foreground">
									Profile Completeness
								</CardTitle>
								<Star className="h-4 w-4 text-orange-600" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">
									{data.overview.profile_completeness}%
								</div>
								<Progress
									value={data.overview.profile_completeness}
									className="mt-2"
								/>
							</CardContent>
						</Card>
					</motion.div>
				</div>

				{/* Charts Section */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Views & Clicks Over Time */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.5 }}
					>
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<BarChart3 className="w-5 h-5" />
									Views & Clicks Over Time
								</CardTitle>
								<CardDescription>
									Daily engagement metrics
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ResponsiveContainer width="100%" height={300}>
									<AreaChart data={data.engagement.daily_views}>
										<CartesianGrid
											strokeDasharray="3 3"
											stroke="#374151"
											opacity={0.3}
										/>
										<XAxis dataKey="date" tick={{ fontSize: 12 }} />
										<YAxis tick={{ fontSize: 12 }} />
										<Tooltip
											contentStyle={{
												backgroundColor: "hsl(var(--background))",
												border: "1px solid hsl(var(--border))",
												borderRadius: "8px",
											}}
										/>
										<Area
											type="monotone"
											dataKey="views"
											stackId="1"
											stroke="#3B82F6"
											fill="#3B82F6"
											fillOpacity={0.6}
											name="Views"
										/>
										<Area
											type="monotone"
											dataKey="clicks"
											stackId="2"
											stroke="#10B981"
											fill="#10B981"
											fillOpacity={0.6}
											name="Clicks"
										/>
									</AreaChart>
								</ResponsiveContainer>
							</CardContent>
						</Card>
					</motion.div>

					{/* Device Distribution */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.6 }}
					>
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Monitor className="w-5 h-5" />
									Device Distribution
								</CardTitle>
								<CardDescription>
									How visitors access your portfolio
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="flex flex-col items-center space-y-4">
									<ResponsiveContainer width="100%" height={200}>
										<PieChart>
											<Pie
												data={data.engagement.device_stats}
												cx="50%"
												cy="50%"
												innerRadius={60}
												outerRadius={80}
												paddingAngle={5}
												dataKey="percentage"
											>
												{data.engagement.device_stats.map(
													(
														entry: {
															device: string;
															percentage: number;
														},
														index: number
													) => (
														<></>
													)
												)}
											</Pie>
											<Tooltip />
										</PieChart>
									</ResponsiveContainer>
									<div className="flex flex-wrap gap-4 justify-center">
										{data.engagement.device_stats.map((device, index) => (
											<div key={index} className="flex items-center gap-2">
												<div
													className="w-3 h-3 rounded-full"
													style={{
														backgroundColor:
															deviceColors[
																device.device as keyof typeof deviceColors
															],
													}}
												/>
												<span className="text-sm">{device.device}</span>
												<Badge variant="secondary">
													{device.percentage}%
												</Badge>
											</div>
										))}
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</div>

				{/* Geographic & Skills Analysis */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Geographic Distribution */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.7 }}
					>
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Globe className="w-5 h-5" />
									Geographic Distribution
								</CardTitle>
								<CardDescription>
									Where your visitors are located
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{data.engagement.geographic_data.map(
										(
											country: {
												country: string;
												views: number;
												percentage: number;
											},
											index: number
										) => (
											<div
												key={index}
												className="flex items-center justify-between"
											>
												<div className="flex items-center gap-3">
													<div className="w-6 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-sm opacity-80" />
													<span className="font-medium">
														{country.country}
													</span>
												</div>
												<div className="flex items-center gap-3">
													<Progress
														value={country.percentage}
														className="w-20"
													/>
													<span className="text-sm text-muted-foreground w-12 text-right">
														{country.views}
													</span>
												</div>
											</div>
										)
									)}
								</div>
							</CardContent>
						</Card>
					</motion.div>

					{/* Skills Market Analysis */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.8 }}
					>
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<TrendingUp className="w-5 h-5" />
									Top Skills Performance
								</CardTitle>
								<CardDescription>
									Your most mentioned skills
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{data.engagement.top_skills.map(
										(
											skill: {
												skill: string;
												mentions: number;
												growth: number;
											},
											index: number
										) => (
											<div key={index} className="space-y-2">
												<div className="flex justify-between items-center">
													<span className="font-medium">{skill.skill}</span>
													<div className="flex items-center gap-2">
														<Badge
															variant={
																skill.growth > 10
																	? "default"
																	: "secondary"
															}
														>
															{skill.growth > 0
																? "+"
																: ""}
															{skill.growth}%
														</Badge>
														<span className="text-sm text-muted-foreground">
															{skill.mentions} mentions
														</span>
													</div>
												</div>
												<Progress
													value={(skill.mentions / 50) * 100}
													className="h-2"
												/>
											</div>
										)
									)}
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</div>

				{/* Recent Activity */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.9 }}
				>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Clock className="w-5 h-5" />
								Recent Activity
							</CardTitle>
							<CardDescription>
								Latest interactions with your portfolio
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{recentActivities.map((activity, index) => (
									<div
										key={index}
										className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
									>
										<div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/20">
											<activity.icon className="w-4 h-4 text-blue-600" />
										</div>
										<div className="flex-1">
											<p className="font-medium">{activity.message}</p>
											<p className="text-sm text-muted-foreground">
												{activity.time}
											</p>
										</div>
										<Badge variant="outline" className="text-xs">
											{activity.type}
										</Badge>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</div>
	);
}
