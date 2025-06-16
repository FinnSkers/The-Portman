"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Zap, Target, TrendingUp } from "lucide-react";
import Link from "next/link";

function FloatingParticles() {
  const [particles, setParticles] = React.useState<Array<{
    id: number;
    left: number;
    top: number;
    delay: number;
    duration: number;
  }>>([]);

  React.useEffect(() => {
    // Generate particles only on client side to avoid hydration mismatch
    const newParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 6,
      duration: 6 + Math.random() * 4,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-primary/20 rounded-full floating-animation"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,rgba(6,182,212,0.1)_0%,transparent_50%)]" />
      </div>
      {/* Floating Particles */}
      <FloatingParticles />

      <div className="relative container mx-auto px-4 text-center">
        {/* Announcement Badge */}
        <div className="mb-8 animate-fade-up">
          <Badge
            variant="secondary"
            className="glass-morphism px-4 py-2 text-sm font-medium"
          >
            <Sparkles className="mr-2 h-3 w-3" />
            New: AI-Powered Portfolio Generation 2.0
          </Badge>
        </div>

        {/* Main Heading */}
        <div className="mb-8 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            Transform Your
            <br />
            <span className="text-gradient">Career with AI</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Create ATS-optimized resumes, stunning portfolios, and gain career insights 
            with our cutting-edge AI platform. Built for the future of professional development.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="mb-12 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" className="cyber-border pulse-glow group" asChild>
              <Link href="/auth">
                Start Building Your Future
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="glass-morphism" asChild>
              <Link href="#demo">
                Watch Demo
              </Link>
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <FeatureCard
            icon={<Target className="h-6 w-6" />}
            title="ATS Optimization"
            description="99% success rate with applicant tracking systems"
          />
          <FeatureCard
            icon={<Zap className="h-6 w-6" />}
            title="AI-Powered"
            description="Advanced machine learning for personalized results"
          />
          <FeatureCard
            icon={<TrendingUp className="h-6 w-6" />}
            title="Career Growth"
            description="Data-driven insights for career advancement"
          />
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-fade-up" style={{ animationDelay: "0.4s" }}>
          <StatCard number="50K+" label="Resumes Created" />
          <StatCard number="98%" label="Success Rate" />
          <StatCard number="500+" label="Companies" />
          <StatCard number="24h" label="Avg. Response" />
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="glass-morphism p-6 rounded-xl border cyber-border group hover:scale-105 transition-all duration-300">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
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
      <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">{number}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
