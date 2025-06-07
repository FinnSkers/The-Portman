"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Palette,
  Layout,
  Eye,
  Download,
  Share,
  Code,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  Zap,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Settings,
  Camera
} from "lucide-react";

// Sample portfolio templates
const portfolioTemplates = [
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    description: "Clean, minimalist design perfect for developers",
    preview: "/api/placeholder/400/300",
    category: "Developer",
    features: ["Dark/Light Mode", "Responsive", "Animation"],
    color: "from-slate-600 to-slate-800"
  },
  {
    id: "creative-studio",
    name: "Creative Studio",
    description: "Bold design for creative professionals",
    preview: "/api/placeholder/400/300",
    category: "Creative",
    features: ["Portfolio Gallery", "Video Support", "Interactive"],
    color: "from-purple-600 to-pink-600"
  },
  {
    id: "corporate-pro",
    name: "Corporate Pro",
    description: "Professional layout for business executives",
    preview: "/api/placeholder/400/300",
    category: "Business",
    features: ["Clean Layout", "PDF Resume", "Contact Form"],
    color: "from-blue-600 to-cyan-600"
  },
  {
    id: "tech-innovator",
    name: "Tech Innovator",
    description: "Cutting-edge design for tech leaders",
    preview: "/api/placeholder/400/300",
    category: "Technology",
    features: ["Code Samples", "GitHub Integration", "Tech Stack"],
    color: "from-green-600 to-emerald-600"
  },
  {
    id: "academic-scholar",
    name: "Academic Scholar",
    description: "Scholarly design for researchers and academics",
    preview: "/api/placeholder/400/300",
    category: "Academic",
    features: ["Publications", "Research", "Citations"],
    color: "from-indigo-600 to-purple-600"
  },
  {
    id: "startup-founder",
    name: "Startup Founder",
    description: "Dynamic design for entrepreneurs",
    preview: "/api/placeholder/400/300",
    category: "Startup",
    features: ["Pitch Deck", "Metrics", "Vision Board"],
    color: "from-orange-600 to-red-600"
  }
];

const colorSchemes = [
  { name: "Ocean Blue", primary: "#3b82f6", secondary: "#06b6d4" },
  { name: "Forest Green", primary: "#10b981", secondary: "#059669" },
  { name: "Royal Purple", primary: "#8b5cf6", secondary: "#7c3aed" },
  { name: "Sunset Orange", primary: "#f59e0b", secondary: "#ea580c" },
  { name: "Rose Pink", primary: "#ec4899", secondary: "#be185d" },
  { name: "Slate Gray", primary: "#64748b", secondary: "#475569" }
];

export default function PortfolioPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(portfolioTemplates[0]);
  const [selectedColor, setSelectedColor] = useState(colorSchemes[0]);
  const [generationStage, setGenerationStage] = useState<"design" | "generating" | "preview">("design");
  const [generationProgress, setGenerationProgress] = useState(0);
  const [customizations, setCustomizations] = useState({
    siteName: "John Doe Portfolio",
    tagline: "Full Stack Developer & Tech Enthusiast",
    showSkills: true,
    showProjects: true,
    showExperience: true,
    showEducation: true,
    showContact: true
  });

  const handleGeneratePortfolio = async () => {
    setGenerationStage("generating");
    setGenerationProgress(0);

    // Simulate portfolio generation process
    const steps = [
      "Analyzing your CV data...",
      "Applying template design...",
      "Generating responsive layouts...",
      "Optimizing for performance...",
      "Adding interactive elements...",
      "Finalizing your portfolio..."
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setGenerationProgress(((i + 1) / steps.length) * 100);
    }

    setGenerationStage("preview");
    toast.success("Portfolio generated successfully! 🎉");
  };

  const handlePreviewDevice = (device: string) => {
    toast.info(`Previewing on ${device}`);
  };

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Portfolio Generator</h1>
          <p className="text-muted-foreground">
            Create stunning, professional portfolios from your CV data
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Powered
          </Badge>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Design Stage */}
        {generationStage === "design" && (
          <motion.div
            key="design"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Tabs defaultValue="templates" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="customization">Customize</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="templates" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layout className="w-5 h-5" />
                      Choose Your Template
                    </CardTitle>
                    <CardDescription>
                      Select a template that matches your professional style
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {portfolioTemplates.map((template) => (
                        <motion.div
                          key={template.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`
                            cursor-pointer rounded-lg border-2 transition-all duration-300
                            ${selectedTemplate.id === template.id 
                              ? 'border-blue-500 shadow-lg' 
                              : 'border-muted hover:border-muted-foreground/50'
                            }
                          `}
                          onClick={() => setSelectedTemplate(template)}
                        >
                          <div className={`h-48 rounded-t-lg bg-gradient-to-br ${template.color} p-6 text-white`}>
                            <div className="space-y-2">
                              <div className="h-4 bg-white/20 rounded w-2/3" />
                              <div className="h-2 bg-white/15 rounded w-1/2" />
                              <div className="mt-4 space-y-1">
                                <div className="h-2 bg-white/15 rounded w-full" />
                                <div className="h-2 bg-white/15 rounded w-3/4" />
                              </div>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold">{template.name}</h3>
                              {selectedTemplate.id === template.id && (
                                <CheckCircle className="w-5 h-5 text-blue-600" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">
                              {template.description}
                            </p>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {template.features.map((feature) => (
                                <Badge key={feature} variant="secondary" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                            <Badge className="text-xs">{template.category}</Badge>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="customization" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Color Scheme */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Palette className="w-5 h-5" />
                        Color Scheme
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        {colorSchemes.map((scheme) => (
                          <div
                            key={scheme.name}
                            className={`
                              cursor-pointer p-3 rounded-lg border transition-all
                              ${selectedColor.name === scheme.name 
                                ? 'border-blue-500 shadow-md' 
                                : 'border-muted hover:border-muted-foreground/50'
                              }
                            `}
                            onClick={() => setSelectedColor(scheme)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex gap-1">
                                <div 
                                  className="w-4 h-4 rounded-full"
                                  style={{ backgroundColor: scheme.primary }}
                                />
                                <div 
                                  className="w-4 h-4 rounded-full"
                                  style={{ backgroundColor: scheme.secondary }}
                                />
                              </div>
                              <span className="text-sm font-medium">{scheme.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Content Sections */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Content Sections
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        { key: "showSkills", label: "Skills & Technologies" },
                        { key: "showProjects", label: "Featured Projects" },
                        { key: "showExperience", label: "Work Experience" },
                        { key: "showEducation", label: "Education" },
                        { key: "showContact", label: "Contact Information" }
                      ].map((section) => (
                        <div key={section.key} className="flex items-center justify-between">
                          <Label htmlFor={section.key}>{section.label}</Label>
                          <input
                            type="checkbox"
                            id={section.key}
                            checked={customizations[section.key as keyof typeof customizations] as boolean}
                            onChange={(e) => setCustomizations(prev => ({
                              ...prev,
                              [section.key]: e.target.checked
                            }))}
                            className="w-4 h-4"
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Portfolio Settings</CardTitle>
                    <CardDescription>
                      Customize your portfolio details and metadata
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="siteName">Site Name</Label>
                        <Input
                          id="siteName"
                          value={customizations.siteName}
                          onChange={(e) => setCustomizations(prev => ({
                            ...prev,
                            siteName: e.target.value
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tagline">Tagline</Label>
                        <Input
                          id="tagline"
                          value={customizations.tagline}
                          onChange={(e) => setCustomizations(prev => ({
                            ...prev,
                            tagline: e.target.value
                          }))}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Generate Button */}
            <div className="flex justify-center">
              <Button 
                size="lg" 
                onClick={handleGeneratePortfolio}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Zap className="w-4 h-4 mr-2" />
                Generate Portfolio
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Generation Stage */}
        {generationStage === "generating" && (
          <motion.div
            key="generating"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center min-h-[60vh] space-y-8"
          >
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center mx-auto">
                <Sparkles className="w-10 h-10 text-white animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold">Generating Your Portfolio</h2>
              <p className="text-muted-foreground max-w-md">
                Our AI is creating your personalized portfolio using the latest design trends and your professional data.
              </p>
            </div>
            
            <div className="w-full max-w-md space-y-4">
              <Progress value={generationProgress} className="h-3" />
              <p className="text-center text-sm text-muted-foreground">
                {Math.round(generationProgress)}% complete
              </p>
            </div>
          </motion.div>
        )}

        {/* Preview Stage */}
        {generationStage === "preview" && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      Portfolio Generated Successfully!
                    </CardTitle>
                    <CardDescription>
                      Your portfolio is ready. Preview it across different devices.
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handlePreviewDevice("Desktop")}>
                      <Monitor className="w-4 h-4 mr-1" />
                      Desktop
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handlePreviewDevice("Tablet")}>
                      <Tablet className="w-4 h-4 mr-1" />
                      Tablet
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handlePreviewDevice("Mobile")}>
                      <Smartphone className="w-4 h-4 mr-1" />
                      Mobile
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Portfolio Preview */}
                <div className="border rounded-lg p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                  <div className="space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-2">
                      <h1 className="text-3xl font-bold">{customizations.siteName}</h1>
                      <p className="text-muted-foreground">{customizations.tagline}</p>
                    </div>
                    
                    {/* Content Sections */}
                    <div className="grid gap-4">
                      {customizations.showSkills && (
                        <div className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                          <h2 className="font-semibold mb-2">Skills</h2>
                          <div className="flex flex-wrap gap-2">
                            {["React", "TypeScript", "Node.js", "Python"].map((skill) => (
                              <Badge key={skill} variant="secondary">{skill}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {customizations.showExperience && (
                        <div className="p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg">
                          <h2 className="font-semibold mb-2">Experience</h2>
                          <div className="space-y-2">
                            <div>
                              <h3 className="font-medium">Senior Developer</h3>
                              <p className="text-sm text-muted-foreground">TechCorp • 2021 - Present</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Eye className="w-4 h-4 mr-2" />
                View Live Portfolio
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download Code
              </Button>
              <Button variant="outline">
                <Share className="w-4 h-4 mr-2" />
                Share Portfolio
              </Button>
              <Button variant="outline" onClick={() => setGenerationStage("design")}>
                <Settings className="w-4 h-4 mr-2" />
                Edit Design
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
