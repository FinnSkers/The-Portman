"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { FileText, Download, CheckCircle, AlertTriangle, Target, Search, Award, Eye, Settings, ArrowRight, RefreshCw, Zap } from "lucide-react";

// Sample ATS templates
const atsTemplates = [
	{
		id: "classic-professional",
		name: "Classic Professional",
		description: "Traditional format optimized for corporate roles",
		atsScore: 95,
		features: ["Clean Layout", "ATS Keywords", "Professional Format"],
		category: "Corporate",
	},
	{
		id: "modern-technical",
		name: "Modern Technical",
		description: "Tech-focused layout with skills prominence",
		atsScore: 92,
		features: ["Skills Section", "Project Highlights", "Tech Stack"],
		category: "Technology",
	},
	{
		id: "executive-summary",
		name: "Executive Summary",
		description: "Leadership-focused format for senior roles",
		atsScore: 94,
		features: ["Executive Summary", "Achievements", "Leadership"],
		category: "Executive",
	},
	{
		id: "creative-balanced",
		name: "Creative Balanced",
		description: "Creative yet ATS-friendly design",
		atsScore: 88,
		features: ["Visual Elements", "Portfolio Links", "Creative Skills"],
		category: "Creative",
	},
];

const atsMetrics = {
	overallScore: 87,
	readability: 92,
	keywordMatch: 85,
	formatting: 89,
	sections: 90,
	recommendations: [
		{
			type: "keyword",
			priority: "high",
			issue: "Missing key industry terms",
			solution: "Add 'React', 'Node.js', 'Agile' to skills section",
			impact: "+8 points",
		},
		{
			type: "formatting",
			priority: "medium",
			issue: "Inconsistent date formats",
			solution: "Use MM/YYYY format throughout",
			impact: "+3 points",
		},
		{
			type: "content",
			priority: "high",
			issue: "Weak action verbs",
			solution: "Replace 'worked on' with 'developed', 'led', 'implemented'",
			impact: "+5 points",
		},
	],
};

const jobMatching = [
	{
		title: "Senior Full Stack Developer",
		company: "TechCorp Inc.",
		match: 94,
		location: "San Francisco, CA",
		salary: "$120k - $150k",
		requirements: ["React", "Node.js", "TypeScript", "AWS"],
		missing: ["Docker", "Kubernetes"],
	},
	{
		title: "Software Engineering Lead",
		company: "InnovateLabs",
		match: 89,
		location: "New York, NY",
		salary: "$130k - $160k",
		requirements: ["Leadership", "React", "Python", "Agile"],
		missing: ["Team Management", "Architecture"],
	},
	{
		title: "Frontend Developer",
		company: "StartupX",
		match: 96,
		location: "Remote",
		salary: "$100k - $125k",
		requirements: ["React", "JavaScript", "CSS", "Git"],
		missing: [],
	},
];

export default function ATSResumePage() {
	const [selectedTemplate, setSelectedTemplate] = useState(atsTemplates[0]);
	const [generationStage, setGenerationStage] = useState<"analyze" | "optimize" | "generate" | "complete">("analyze");
	const [analysisProgress, setAnalysisProgress] = useState(0);
	const [currentJobTitle, setCurrentJobTitle] = useState("Software Developer");
	const [targetIndustry, setTargetIndustry] = useState("Technology");

	const handleAnalyzeResume = async () => {
		setGenerationStage("analyze");
		setAnalysisProgress(0);
		const steps = [
			"Scanning resume structure...",
			"Analyzing keyword density...",
			"Checking ATS compatibility...",
			"Evaluating content quality...",
			"Generating recommendations...",
		];
		for (let i = 0; i < steps.length; i++) {
			await new Promise((resolve) => setTimeout(resolve, 1200));
			setAnalysisProgress(((i + 1) / steps.length) * 100);
		}
		setGenerationStage("optimize");
		toast.success("Resume analysis complete!");
	};

	const handleOptimizeResume = async () => {
		setGenerationStage("generate");
		setAnalysisProgress(0);
		const steps = [
			"Applying ATS optimizations...",
			"Enhancing keyword density...",
			"Improving formatting...",
			"Adding missing elements...",
			"Finalizing resume...",
		];
		for (let i = 0; i < steps.length; i++) {
			await new Promise((resolve) => setTimeout(resolve, 1500));
			setAnalysisProgress(((i + 1) / steps.length) * 100);
		}
		setGenerationStage("complete");
		toast.success("ATS-optimized resume generated! 🎉");
	};

	return (
		<div className="min-h-screen p-6 space-y-8">
			{/* Header */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div>
					<h1 className="text-3xl font-bold">ATS Resume Maker</h1>
					<p className="text-muted-foreground">
						Create ATS-optimized resumes that pass through applicant tracking systems
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
						<Target className="w-3 h-3 mr-1" />
						ATS Optimized
					</Badge>
				</div>
			</div>
			<AnimatePresence mode="wait">
				{/* Analysis Stage */}
				{generationStage === "analyze" && (
					<motion.div
						key="analyze"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.3 }}
						className="space-y-6"
					>
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Search className="w-5 h-5" />
									Resume Analysis
								</CardTitle>
								<CardDescription>
									Let's analyze your current resume for ATS compatibility
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="jobTitle">Target Job Title</Label>
										<Input
											id="jobTitle"
											value={currentJobTitle}
											onChange={(e) => setCurrentJobTitle(e.target.value)}
											placeholder="e.g., Senior Software Developer"
										/>
									</div>
									<div className="space-y-2">
										<Label htmlFor="industry">Target Industry</Label>
										<Input
											id="industry"
											value={targetIndustry}
											onChange={(e) => setTargetIndustry(e.target.value)}
											placeholder="e.g., Technology"
										/>
									</div>
								</div>
								<div className="flex justify-center">
									<Button
										size="lg"
										onClick={handleAnalyzeResume}
										className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
									>
										<Search className="w-4 h-4 mr-2" />
										Analyze Resume
										<ArrowRight className="w-4 h-4 ml-2" />
									</Button>
								</div>
								{analysisProgress > 0 && (
									<div className="space-y-2">
										<Progress value={analysisProgress} className="h-2" />
										<p className="text-center text-sm text-muted-foreground">
											Analyzing... {Math.round(analysisProgress)}%
										</p>
									</div>
								)}
							</CardContent>
						</Card>
					</motion.div>
				)}
				{/* Optimization Stage */}
				{generationStage === "optimize" && (
					<motion.div
						key="optimize"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.3 }}
						className="space-y-6"
					>
						{/* ATS Score Overview */}
						<Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-0">
							<CardContent className="p-8">
								<div className="flex flex-col md:flex-row items-center gap-8">
									<div className="text-center md:text-left">
										<h2 className="text-2xl font-bold mb-2">ATS Compatibility Score</h2>
										<p className="text-muted-foreground mb-4">
											Your resume's compatibility with applicant tracking systems
										</p>
										<div className="flex items-center gap-4">
											<div className="text-5xl font-bold text-blue-600">
												{atsMetrics.overallScore}%
											</div>
											<div className="space-y-1">
												<Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
													Good
												</Badge>
												<p className="text-sm text-muted-foreground">
													Room for improvement
												</p>
											</div>
										</div>
									</div>
									<div className="flex-1 w-full max-w-sm space-y-4">
										{[
											{ label: "Readability", score: atsMetrics.readability },
											{ label: "Keywords", score: atsMetrics.keywordMatch },
											{ label: "Formatting", score: atsMetrics.formatting },
											{ label: "Sections", score: atsMetrics.sections },
										].map((metric, i) => (
											<div key={i} className="space-y-1">
												<div className="flex justify-between text-sm">
													<span>{metric.label}</span>
													<span className="font-medium">{metric.score}%</span>
												</div>
												<Progress value={metric.score} className="h-2" />
											</div>
										))}
									</div>
								</div>
							</CardContent>
						</Card>
						<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
							{/* Recommendations */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<AlertTriangle className="w-5 h-5 text-orange-600" />
										Optimization Recommendations
									</CardTitle>
									<CardDescription>
										Issues found and suggested improvements
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{atsMetrics.recommendations.map((rec, i) => (
										<div key={i} className="p-4 border rounded-lg space-y-2">
											<div className="flex items-center justify-between">
												<h4 className="font-medium">{rec.issue}</h4>
												<Badge
													variant={
														rec.priority === "high" ? "destructive" : "secondary"
													}
													className="text-xs"
												>
													{rec.priority}
												</Badge>
											</div>
											<p className="text-sm text-muted-foreground">
												{rec.solution}
											</p>
											<div className="flex justify-between items-center">
												<span className="text-xs text-muted-foreground">Impact:</span>
												<span className="text-sm font-medium text-green-600">
													{rec.impact}
												</span>
											</div>
										</div>
									))}
								</CardContent>
							</Card>
							{/* Job Matching */}
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Target className="w-5 h-5 text-blue-600" />
										Job Match Analysis
									</CardTitle>
									<CardDescription>
										How well your resume matches current job openings
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{jobMatching.slice(0, 3).map((job, i) => (
										<div key={i} className="p-4 border rounded-lg space-y-3">
											<div className="flex items-start justify-between">
												<div>
													<h4 className="font-medium">{job.title}</h4>
													<p className="text-sm text-muted-foreground">
														{job.company}
													</p>
													<p className="text-xs text-muted-foreground">
														{job.location} • {job.salary}
													</p>
												</div>
												<Badge
													className={`${
														job.match >= 90
															? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
															: job.match >= 80
															? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
															: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
													}`}
												>
													{job.match}% match
												</Badge>
											</div>
											{job.missing.length > 0 && (
												<div>
													<p className="text-xs text-muted-foreground mb-1">
														Missing skills:
													</p>
													<div className="flex flex-wrap gap-1">
														{job.missing.map((skill) => (
															<Badge key={skill} variant="outline" className="text-xs">
																{skill}
															</Badge>
														))}
													</div>
												</div>
											)}
										</div>
									))}
								</CardContent>
							</Card>
						</div>
						{/* Template Selection */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<FileText className="w-5 h-5" />
									Choose ATS Template
								</CardTitle>
								<CardDescription>
									Select a template optimized for applicant tracking systems
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
									{atsTemplates.map((template) => (
										<div
											key={template.id}
											className={`                        cursor-pointer p-4 border rounded-lg transition-all duration-300                        ${
												selectedTemplate.id === template.id
													? "border-blue-500 shadow-lg bg-blue-50 dark:bg-blue-950/20"
													: "border-muted hover:border-muted-foreground/50"
											}                      `}
											onClick={() => setSelectedTemplate(template)}
										>
											<div className="space-y-3">
												<div className="flex items-center justify-between">
													<Badge variant="secondary" className="text-xs">
														{template.category}
													</Badge>
													<div className="flex items-center gap-1">
														<Award className="w-3 h-3 text-green-600" />
														<span className="text-xs font-medium text-green-600">
															{template.atsScore}%
														</span>
													</div>
												</div>
												<div>
													<h3 className="font-medium">{template.name}</h3>
													<p className="text-sm text-muted-foreground">
														{template.description}
													</p>
												</div>
												<div className="flex flex-wrap gap-1">
													{template.features.map((feature) => (
														<Badge key={feature} variant="outline" className="text-xs">
															{feature}
														</Badge>
													))}
												</div>
												{selectedTemplate.id === template.id && (
													<CheckCircle className="w-5 h-5 text-blue-600 mx-auto" />
												)}
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
						{/* Generate Button */}
						<div className="flex justify-center">
							<Button
								size="lg"
								onClick={handleOptimizeResume}
								className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
							>
								<Zap className="w-4 h-4 mr-2" />
								Generate Optimized Resume
								<ArrowRight className="w-4 h-4 ml-2" />
							</Button>
						</div>
					</motion.div>
				)}
				{/* Generation Stage */}
				{generationStage === "generate" && (
					<motion.div
						key="generate"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.3 }}
						className="flex flex-col items-center justify-center min-h-[60vh] space-y-8"
					>
						<div className="text-center space-y-4">
							<div className="w-20 h-20 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center mx-auto">
								<RefreshCw className="w-10 h-10 text-white animate-spin" />
							</div>
							<h2 className="text-2xl font-bold">Optimizing Your Resume</h2>
							<p className="text-muted-foreground max-w-md">
								Applying ATS optimizations and enhancing your resume for maximum compatibility.
							</p>
						</div>

						<div className="w-full max-w-md space-y-4">
							<Progress value={analysisProgress} className="h-3" />
							<p className="text-center text-sm text-muted-foreground">
								{Math.round(analysisProgress)}% complete
							</p>
						</div>
					</motion.div>
				)}
				{/* Complete Stage */}
				{generationStage === "complete" && (
					<motion.div
						key="complete"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.3 }}
						className="space-y-6"
					>
						{/* Success Card */}
						<Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200">
							<CardContent className="p-8 text-center">
								<CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
								<h2 className="text-2xl font-bold text-green-600 mb-2">
									Resume Optimized!
								</h2>
								<p className="text-muted-foreground mb-6">
									Your ATS score improved from {atsMetrics.overallScore}% to 96%
								</p>

								<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
									{[
										{ label: "ATS Score", value: "96%", change: "+9%" },
										{ label: "Keyword Match", value: "94%", change: "+9%" },
										{ label: "Readability", value: "98%", change: "+6%" },
										{ label: "Job Matches", value: "85%", change: "+12%" },
									].map((stat, i) => (
										<div key={i} className="text-center">
											<div className="text-2xl font-bold text-green-600">
												{stat.value}
											</div>
											<div className="text-sm text-muted-foreground">
												{stat.label}
											</div>
											<div className="text-xs text-green-600">{stat.change}</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
						{/* Action Buttons */}
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
								<Download className="w-4 h-4 mr-2" />
								Download Resume (PDF)
							</Button>
							<Button variant="outline">
								<Download className="w-4 h-4 mr-2" />
								Download (.docx)
							</Button>
							<Button variant="outline">
								<Eye className="w-4 h-4 mr-2" />
								Preview Resume
							</Button>
							<Button variant="outline" onClick={() => setGenerationStage("optimize")}>
								<Settings className="w-4 h-4 mr-2" />
								Edit Resume
							</Button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}