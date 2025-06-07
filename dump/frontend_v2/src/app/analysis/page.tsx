"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Users, 
  CheckCircle,
  Briefcase,
  Globe
} from "lucide-react";
import { 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

// Sample analysis data
const skillsAnalysis = [
  { skill: "Technical Skills", yourLevel: 85, industryAvg: 78, maxLevel: 100 },
  { skill: "Leadership", yourLevel: 72, industryAvg: 68, maxLevel: 100 },
  { skill: "Communication", yourLevel: 90, industryAvg: 75, maxLevel: 100 },
  { skill: "Problem Solving", yourLevel: 88, industryAvg: 80, maxLevel: 100 },
  { skill: "Innovation", yourLevel: 78, industryAvg: 70, maxLevel: 100 },
  { skill: "Teamwork", yourLevel: 85, industryAvg: 82, maxLevel: 100 }
];

const careerProgression = [
  { role: "Junior Developer", salary: 45000, year: 2020, duration: "1 year" },
  { role: "Software Developer", salary: 65000, year: 2021, duration: "2 years" },
  { role: "Senior Developer", salary: 85000, year: 2023, duration: "Current" },
  { role: "Tech Lead", salary: 110000, year: 2024, duration: "Projected" },
  { role: "Engineering Manager", salary: 140000, year: 2026, duration: "Projected" }
];

const competitorAnalysis = [
  {
    name: "Sarah Chen",
    title: "Senior Frontend Developer",
    company: "Google",
    matchScore: 94,
    strengths: ["React", "TypeScript", "System Design"],
    experience: "6 years",
    location: "San Francisco, CA"
  },
  {
    name: "Michael Rodriguez",
    title: "Full Stack Engineer",
    company: "Microsoft",
    matchScore: 89,
    strengths: ["Node.js", "Azure", "DevOps"],
    experience: "5 years",
    location: "Seattle, WA"
  },
  {
    name: "Emily Johnson",
    title: "Senior Software Engineer",
    company: "Meta",
    matchScore: 87,
    strengths: ["React Native", "GraphQL", "Mobile"],
    experience: "7 years",
    location: "New York, NY"
  }
];

const recommendations = [
  {
    type: "skill",
    priority: "high",
    title: "Learn Cloud Architecture",
    description: "93% of similar roles require cloud skills. AWS or Azure certification recommended.",
    impact: "Potential 15-20% salary increase",
    timeframe: "3-6 months"
  },
  {
    type: "certification",
    priority: "medium",
    title: "Get Scrum Master Certification",
    description: "Leadership roles in your field often require agile methodologies knowledge.",
    impact: "Better leadership opportunities",
    timeframe: "1-2 months"
  },
  {
    type: "experience",
    priority: "high",
    title: "Contribute to Open Source",
    description: "85% of top performers in your field contribute to open source projects.",
    impact: "Enhanced portfolio credibility",
    timeframe: "Ongoing"
  },
  {
    type: "network",
    priority: "medium",
    title: "Expand Professional Network",
    description: "Your network size is below industry average for your experience level.",
    impact: "More job opportunities",
    timeframe: "3-6 months"
  }
];

export default function AnalysisPage() {
  const [selectedTab, setSelectedTab] = useState("overview");

  const overallScore = 87;

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">AI Analysis</h1>
          <p className="text-muted-foreground">
            Deep insights into your professional profile and career trajectory
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
            <Brain className="w-3 h-3 mr-1" />
            AI Analyzed
          </Badge>
          <span className="text-sm text-muted-foreground">
            Updated 2 hours ago
          </span>
        </div>
      </div>

      {/* Overall Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-0">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold mb-2">Professional Match Score</h2>
                <p className="text-muted-foreground mb-4">
                  Based on industry analysis and peer comparison
                </p>
                <div className="flex items-center gap-4">
                  <div className="text-5xl font-bold text-blue-600">{overallScore}%</div>
                  <div className="space-y-1">
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Excellent
                    </Badge>
                    <p className="text-sm text-muted-foreground">Top 15% in your field</p>
                  </div>
                </div>
              </div>
              <div className="flex-1 w-full max-w-sm">
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={skillsAnalysis}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="skill" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
                    <Radar
                      name="Your Level"
                      dataKey="yourLevel"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Radar
                      name="Industry Avg"
                      dataKey="industryAvg"
                      stroke="#8b5cf6"
                      fill="transparent"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Analysis Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="career">Career</TabsTrigger>
          <TabsTrigger value="competitors">Peers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Strengths & Areas for Improvement */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="w-5 h-5" />
                    Key Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      title: "Technical Expertise",
                      description: "Advanced proficiency in modern web technologies",
                      score: 92
                    },
                    {
                      title: "Communication Skills",
                      description: "Strong written and verbal communication abilities",
                      score: 90
                    },
                    {
                      title: "Problem Solving",
                      description: "Excellent analytical and critical thinking skills",
                      score: 88
                    },
                    {
                      title: "Adaptability",
                      description: "Quick to learn and adapt to new technologies",
                      score: 85
                    }
                  ].map((strength, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{strength.title}</h4>
                        <Badge variant="secondary">{strength.score}%</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{strength.description}</p>
                      <Progress value={strength.score} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-600">
                    <Target className="w-5 h-5" />
                    Growth Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recommendations.slice(0, 4).map((rec, i) => (
                    <div key={i} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{rec.title}</h4>
                        <Badge 
                          variant={rec.priority === "high" ? "destructive" : "secondary"}
                          className="text-xs"
                        >
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-green-600">{rec.impact}</span>
                        <span className="text-muted-foreground">{rec.timeframe}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Skills Comparison Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Skills vs Industry Average</CardTitle>
                  <CardDescription>
                    How your skills compare to similar professionals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={skillsAnalysis} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="skill" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="yourLevel" fill="#3b82f6" name="Your Level" />
                      <Bar dataKey="industryAvg" fill="#8b5cf6" name="Industry Avg" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Skill Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Recommended Skills</CardTitle>
                  <CardDescription>
                    Skills that could boost your career prospects
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      skill: "Cloud Architecture (AWS/Azure)",
                      demand: 94,
                      salaryImpact: "+18%",
                      jobs: "1,250+ jobs",
                      difficulty: "Medium"
                    },
                    {
                      skill: "Machine Learning",
                      demand: 89,
                      salaryImpact: "+22%",
                      jobs: "890+ jobs",
                      difficulty: "Hard"
                    },
                    {
                      skill: "DevOps/CI/CD",
                      demand: 87,
                      salaryImpact: "+15%",
                      jobs: "2,100+ jobs",
                      difficulty: "Medium"
                    },
                    {
                      skill: "Mobile Development",
                      demand: 82,
                      salaryImpact: "+12%",
                      jobs: "780+ jobs",
                      difficulty: "Easy"
                    }
                  ].map((skill, i) => (
                    <div key={i} className="p-4 border rounded-lg space-y-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{skill.skill}</h4>
                        <Badge 
                          variant={skill.difficulty === "Easy" ? "secondary" : 
                                  skill.difficulty === "Medium" ? "default" : "destructive"}
                        >
                          {skill.difficulty}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Market Demand:</span>
                          <div className="flex items-center gap-2">
                            <Progress value={skill.demand} className="flex-1 h-2" />
                            <span className="font-medium">{skill.demand}%</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-green-600 font-medium">{skill.salaryImpact}</div>
                          <div className="text-muted-foreground">{skill.jobs}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="career" className="space-y-6">
          {/* Career Progression */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Career Progression Analysis
                </CardTitle>
                <CardDescription>
                  Your career trajectory and future projections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {careerProgression.map((role, i) => (
                    <div key={i} className="flex items-center gap-6">
                      <div className="flex flex-col items-center">
                        <div className={`
                          w-4 h-4 rounded-full 
                          ${i < 3 ? 'bg-blue-600' : 'bg-muted-foreground/30'}
                        `} />
                        {i < careerProgression.length - 1 && (
                          <div className="w-px h-12 bg-muted-foreground/20 mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div>
                            <h4 className="font-medium">{role.role}</h4>
                            <p className="text-sm text-muted-foreground">
                              {role.year} • {role.duration}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-green-600">
                              ${role.salary.toLocaleString()}
                            </div>
                            {i > 0 && (
                              <div className="text-xs text-muted-foreground">
                                +{Math.round(((role.salary - careerProgression[i-1].salary) / careerProgression[i-1].salary) * 100)}%
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="competitors" className="space-y-6">
          {/* Peer Comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Peer Analysis
                </CardTitle>
                <CardDescription>
                  Similar professionals in your field and location
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {competitorAnalysis.map((peer, i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{peer.name}</h4>
                            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                              {peer.matchScore}% match
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {peer.title} at {peer.company}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-3 h-3" />
                              {peer.experience}
                            </span>
                            <span className="flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              {peer.location}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Key Strengths:</div>
                          <div className="flex flex-wrap gap-1">
                            {peer.strengths.map((strength, j) => (
                              <Badge key={j} variant="secondary" className="text-xs">
                                {strength}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
