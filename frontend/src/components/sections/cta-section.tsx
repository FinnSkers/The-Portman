"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(59,130,246,0.1)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.1)_0%,transparent_50%)]" />

      <div className="container mx-auto px-4 relative">
        <div className="text-center max-w-4xl mx-auto">
          {/* Icon */}
          <div className="mb-8 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Zap className="h-8 w-8" />
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Ready to Transform
            <br />
            <span className="text-gradient">Your Career?</span>
          </h2>

          {/* Description */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Join over 50,000 professionals who have accelerated their career growth 
            with AI-powered optimization. Start your transformation today.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="cyber-border pulse-glow group text-lg px-8 py-4" asChild>
              <Link href="/auth">
                <Sparkles className="mr-2 h-5 w-5" />
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="glass-morphism text-lg px-8 py-4" asChild>
              <Link href="#demo">
                Watch Demo
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center">
              <div className="h-2 w-2 bg-green-500 rounded-full mr-2" />
              Free to start
            </div>
            <div className="flex items-center">
              <div className="h-2 w-2 bg-green-500 rounded-full mr-2" />
              No credit card required
            </div>
            <div className="flex items-center">
              <div className="h-2 w-2 bg-green-500 rounded-full mr-2" />
              Cancel anytime
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">50K+</div>
            <div className="text-sm text-muted-foreground">Users Worldwide</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">2.5M+</div>
            <div className="text-sm text-muted-foreground">CVs Optimized</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">98%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">4.9★</div>
            <div className="text-sm text-muted-foreground">User Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
}
