"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Upload, 
  FileText, 
  Download,
  CheckCircle,
  ArrowRight,
  Sparkles
} from "lucide-react";

export function DemoSection() {
  const [activeDemo, setActiveDemo] = React.useState("upload");

  return (
    <section id="demo" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Play className="mr-2 h-3 w-3" />
            Interactive Demo
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            See PORTMAN in
            <span className="text-gradient"> Action</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Experience the power of AI-driven career optimization. Watch how we transform 
            an ordinary resume into an ATS-optimized, recruiter-friendly masterpiece.
          </p>
        </div>

        {/* Demo Interface */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Demo Steps */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">3-Step Transformation Process</h3>
              
              <DemoStep
                step="01"
                title="Upload Your Resume"
                description="Drag and drop your existing CV or paste text directly into our interface."
                icon={<Upload className="h-5 w-5" />}
                isActive={activeDemo === "upload"}
                onClick={() => setActiveDemo("upload")}
              />
              
              <DemoStep
                step="02"
                title="AI Analysis & Optimization"
                description="Our AI analyzes your content and applies industry-specific optimizations."
                icon={<Sparkles className="h-5 w-5" />}
                isActive={activeDemo === "analyze"}
                onClick={() => setActiveDemo("analyze")}
              />
              
              <DemoStep
                step="03"
                title="Download Enhanced Resume"
                description="Get your ATS-optimized resume ready for applications in seconds."
                icon={<Download className="h-5 w-5" />}
                isActive={activeDemo === "download"}
                onClick={() => setActiveDemo("download")}
              />

              <div className="pt-6">
                <Button size="lg" className="cyber-border group">
                  Try Demo Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>

            {/* Demo Visualization */}
            <div className="relative">
              <Card className="glass-morphism border-0 p-6">
                <CardContent className="p-0">
                  {activeDemo === "upload" && <UploadDemo />}
                  {activeDemo === "analyze" && <AnalyzeDemo />}
                  {activeDemo === "download" && <DownloadDemo />}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Results Preview */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center mb-12">
            Before vs After Transformation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* Before */}
            <Card className="p-6">
              <div className="flex items-center mb-4">
                <div className="h-3 w-3 bg-destructive rounded-full mr-3" />
                <span className="font-medium text-muted-foreground">Before</span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="bg-muted p-3 rounded">
                  <p className="text-destructive">❌ Generic job titles</p>
                </div>
                <div className="bg-muted p-3 rounded">
                  <p className="text-destructive">❌ Missing keywords</p>
                </div>
                <div className="bg-muted p-3 rounded">
                  <p className="text-destructive">❌ Poor formatting</p>
                </div>
                <div className="bg-muted p-3 rounded">
                  <p className="text-destructive">❌ ATS incompatible</p>
                </div>
              </div>
            </Card>

            {/* After */}
            <Card className="p-6 border-primary/20">
              <div className="flex items-center mb-4">
                <div className="h-3 w-3 bg-primary rounded-full mr-3" />
                <span className="font-medium">After PORTMAN</span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="bg-primary/5 border border-primary/20 p-3 rounded">
                  <p className="text-primary">✅ Industry-specific titles</p>
                </div>
                <div className="bg-primary/5 border border-primary/20 p-3 rounded">
                  <p className="text-primary">✅ Optimized keywords</p>
                </div>
                <div className="bg-primary/5 border border-primary/20 p-3 rounded">
                  <p className="text-primary">✅ Professional layout</p>
                </div>
                <div className="bg-primary/5 border border-primary/20 p-3 rounded">
                  <p className="text-primary">✅ 99% ATS compatible</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

interface DemoStepProps {
  step: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

function DemoStep({ step, title, description, icon, isActive, onClick }: DemoStepProps) {
  return (
    <div 
      className={`p-6 rounded-xl border cursor-pointer transition-all duration-300 ${
        isActive 
          ? "border-primary/50 bg-primary/5 cyber-border" 
          : "border-border hover:border-primary/30"
      }`}
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
          isActive 
            ? "bg-primary text-primary-foreground" 
            : "bg-muted text-muted-foreground"
        }`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <span className="text-xs font-mono text-muted-foreground mr-3">{step}</span>
            <h4 className="font-semibold">{title}</h4>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {isActive && (
          <CheckCircle className="h-5 w-5 text-primary" />
        )}
      </div>
    </div>
  );
}

function UploadDemo() {
  return (
    <div className="aspect-video bg-muted/50 rounded-lg border-2 border-dashed border-primary/30 flex items-center justify-center">
      <div className="text-center">
        <Upload className="h-12 w-12 text-primary mx-auto mb-4" />
        <p className="text-lg font-medium mb-2">Drop your resume here</p>
        <p className="text-sm text-muted-foreground">or click to browse files</p>
      </div>
    </div>
  );
}

function AnalyzeDemo() {
  return (
    <div className="aspect-video bg-background rounded-lg border p-6">
      <div className="space-y-4">
        <div className="flex items-center mb-6">
          <Sparkles className="h-5 w-5 text-primary mr-2 animate-spin" />
          <span className="font-medium">AI Analysis in Progress...</span>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Keyword optimization</span>
            <Badge variant="secondary">95%</Badge>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full w-[95%]" />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm">ATS compatibility</span>
            <Badge variant="secondary">98%</Badge>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full w-[98%]" />
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm">Format optimization</span>
            <Badge variant="secondary">100%</Badge>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

function DownloadDemo() {
  return (
    <div className="aspect-video bg-background rounded-lg border p-6 flex items-center justify-center">
      <div className="text-center">
        <div className="h-20 w-16 bg-primary/10 border-2 border-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
          <FileText className="h-8 w-8 text-primary" />
        </div>
        <p className="font-medium mb-2">Resume Optimized!</p>
        <p className="text-sm text-muted-foreground mb-4">Your enhanced resume is ready</p>
        <Button size="sm" className="cyber-border">
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
      </div>
    </div>
  );
}
