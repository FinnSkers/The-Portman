"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain,   
  Target, 
  BarChart3, 
  Palette, 
  Shield,
  Clock,
  ArrowRight
} from "lucide-react";

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Platform Features
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Everything You Need for
            <span className="text-gradient"> Career Success</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our comprehensive platform combines cutting-edge AI with intuitive design 
            to accelerate your professional growth and career advancement.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            icon={<Brain className="h-8 w-8" />}
            title="AI-Powered Optimization"
            description="Advanced machine learning algorithms analyze your CV and optimize it for maximum ATS compatibility and recruiter appeal."
            features={["Smart keyword extraction", "Industry-specific optimization", "Real-time suggestions"]}
          />
          
          <FeatureCard
            icon={<Target className="h-8 w-8" />}
            title="ATS Compatibility"
            description="Ensure your resume passes through Applicant Tracking Systems with our 99% success rate optimization engine."
            features={["Format validation", "Keyword optimization", "Structure analysis"]}
          />
          
          <FeatureCard
            icon={<Palette className="h-8 w-8" />}
            title="Portfolio Generation"
            description="Create stunning professional portfolios that showcase your skills and experience in minutes, not hours."
            features={["Drag & drop builder", "Professional templates", "Mobile responsive"]}
          />
          
          <FeatureCard
            icon={<BarChart3 className="h-8 w-8" />}
            title="Career Analytics"
            description="Track your application success, identify improvement areas, and make data-driven career decisions."
            features={["Performance tracking", "Market insights", "Salary benchmarks"]}
          />
          
          <FeatureCard
            icon={<Shield className="h-8 w-8" />}
            title="Privacy First"
            description="Your data is encrypted and secure. We never share your information without explicit consent."
            features={["End-to-end encryption", "GDPR compliant", "Data ownership"]}
          />
          
          <FeatureCard
            icon={<Clock className="h-8 w-8" />}
            title="Instant Results"
            description="Get optimized resumes and portfolios in seconds, not days. Our AI works at the speed of thought."
            features={["Real-time processing", "Instant downloads", "Quick iterations"]}
          />
        </div>

        {/* Stats Section */}
        <div className="glass-morphism rounded-2xl p-8 mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatItem number="50K+" label="Resumes Generated" />
            <StatItem number="98%" label="ATS Success Rate" />
            <StatItem number="2.5x" label="More Interviews" />
            <StatItem number="< 30s" label="Average Processing Time" />
          </div>
        </div>

        {/* Process Steps */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-12">
            How It Works
          </h3>          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ProcessStep
              step="01"
              title="Upload Your CV"
              description="Simply drag and drop your existing resume or start from scratch with our guided builder."
            />
            <ProcessStep
              step="02"
              title="AI Analysis"
              description="Our advanced AI analyzes your content, identifies improvements, and optimizes for your target role."
            />
            <ProcessStep
              step="03"
              title="Download & Apply"
              description="Get your optimized resume and portfolio instantly. Track applications and iterate based on feedback."
            />
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button size="lg" className="cyber-border group">
            Start Your Transformation
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
}

function FeatureCard({ icon, title, description, features }: FeatureCardProps) {
  return (
    <Card className="glass-morphism border-0 hover:scale-105 transition-all duration-300 group">
      <CardHeader>
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm">
              <div className="h-1.5 w-1.5 rounded-full bg-primary mr-3" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

interface StatItemProps {
  number: string;
  label: string;
}

function StatItem({ number, label }: StatItemProps) {
  return (
    <div>
      <div className="text-4xl font-bold text-gradient mb-2">{number}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

interface ProcessStepProps {
  step: string;
  title: string;
  description: string;
}

function ProcessStep({ step, title, description }: ProcessStepProps) {
  return (
    <div className="text-center group">
      <div className="mb-6 mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        <span className="text-sm font-bold">{step}</span>
      </div>
      <h4 className="text-xl font-semibold mb-3">{title}</h4>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
