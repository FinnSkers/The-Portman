"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Success Stories
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Loved by
            <span className="text-gradient"> Professionals</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of professionals who have transformed their careers with PORTMAN.
            Real stories from real people who landed their dream jobs.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <TestimonialCard
            name="Sarah Chen"
            role="Senior Software Engineer"
            company="Google"
            avatar="/testimonials/sarah.jpg"
            rating={5}
            content="PORTMAN transformed my resume and I got 3x more interview callbacks. The AI optimization is incredible - it found keywords I never thought to include."
          />
          
          <TestimonialCard
            name="Marcus Rodriguez"
            role="Product Manager"
            company="Microsoft"
            avatar="/testimonials/marcus.jpg"
            rating={5}
            content="The portfolio generator is a game-changer. I created a stunning professional portfolio in minutes that helped me stand out from other candidates."
          />
          
          <TestimonialCard
            name="Emily Watson"
            role="UX Designer"
            company="Figma"
            avatar="/testimonials/emily.jpg"
            rating={5}
            content="Finally landed my dream job at Figma! The ATS optimization feature ensured my resume actually reached human recruiters instead of being filtered out."
          />
          
          <TestimonialCard
            name="David Kim"
            role="Data Scientist"
            company="Netflix"
            avatar="/testimonials/david.jpg"
            rating={5}
            content="The career analytics helped me understand exactly what skills were in demand. I upskilled accordingly and got offers from top tech companies."
          />
          
          <TestimonialCard
            name="Lisa Thompson"
            role="Marketing Director"
            company="Shopify"
            avatar="/testimonials/lisa.jpg"
            rating={5}
            content="PORTMAN's AI suggestions were spot-on. It highlighted achievements I had forgotten about and restructured my experience beautifully."
          />
          
          <TestimonialCard
            name="James Wilson"
            role="DevOps Engineer"
            company="Amazon"
            avatar="/testimonials/james.jpg"
            rating={5}
            content="Increased my interview rate by 400%! The AI knew exactly how to position my technical skills for maximum impact."
          />
        </div>

        {/* Success Metrics */}
        <div className="glass-morphism rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <SuccessMetric
              number="2.5x"
              label="More Interviews"
              description="Average increase in interview callbacks"
            />
            <SuccessMetric
              number="87%"
              label="Job Success Rate"
              description="Users who land jobs within 3 months"
            />
            <SuccessMetric
              number="$25K"
              label="Salary Increase"
              description="Average salary boost reported by users"
            />
            <SuccessMetric
              number="4.9/5"
              label="User Rating"
              description="Based on 10,000+ reviews"
            />
          </div>
        </div>

        {/* Company Logos */}
        <div className="mt-16">
          <p className="text-center text-muted-foreground mb-8">
            Our users have been hired by top companies worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {[
              "Google", "Microsoft", "Amazon", "Apple", "Meta", 
              "Netflix", "Spotify", "Uber", "Airbnb", "Tesla"
            ].map((company) => (
              <div 
                key={company} 
                className="text-2xl font-bold text-muted-foreground hover:text-foreground transition-colors"
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  content: string;
}

function TestimonialCard({ name, role, company, avatar, rating, content }: TestimonialCardProps) {
  return (
    <Card className="glass-morphism border-0 hover:scale-105 transition-all duration-300 h-full">
      <CardContent className="p-6 flex flex-col h-full">
        {/* Quote Icon */}
        <Quote className="h-8 w-8 text-primary/30 mb-4" />
          {/* Content */}
        <p className="text-muted-foreground mb-6 flex-grow italic">
          &ldquo;{content}&rdquo;
        </p>
        
        {/* Rating */}
        <div className="flex items-center mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star 
              key={i} 
              className={`h-4 w-4 ${
                i < rating 
                  ? "text-yellow-400 fill-yellow-400" 
                  : "text-muted-foreground"
              }`} 
            />
          ))}
        </div>
        
        {/* Author */}
        <div className="flex items-center">
          <Avatar className="h-12 w-12 mr-4">
            <AvatarImage src={avatar} alt={name} />
            <AvatarFallback>{name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{name}</p>
            <p className="text-sm text-muted-foreground">{role} at {company}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface SuccessMetricProps {
  number: string;
  label: string;
  description: string;
}

function SuccessMetric({ number, label, description }: SuccessMetricProps) {
  return (
    <div>
      <div className="text-4xl font-bold text-gradient mb-2">{number}</div>
      <div className="text-lg font-semibold mb-1">{label}</div>
      <div className="text-sm text-muted-foreground">{description}</div>
    </div>
  );
}
