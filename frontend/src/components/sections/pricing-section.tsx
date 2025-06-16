"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Star, Crown } from "lucide-react";
import Link from "next/link";

export function PricingSection() {
  const [isAnnual, setIsAnnual] = React.useState(false);

  return (
    <section id="pricing" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            Pricing Plans
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Choose Your
            <span className="text-gradient"> Success Plan</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Start free and upgrade as you grow. All plans include our core AI optimization features.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isAnnual ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
              Annual
            </span>
            <Badge variant="secondary" className="text-xs">
              Save 20%
            </Badge>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          
          {/* Free Plan */}
          <PricingCard
            name="Starter"
            description="Perfect for getting started with AI-powered CV optimization"
            price={0}
            originalPrice={0}
            isAnnual={isAnnual}
            icon={<Zap className="h-6 w-6" />}
            features={[
              "1 CV optimization per month",
              "Basic ATS compatibility check",
              "Standard templates",
              "Email support",
              "Basic analytics"
            ]}
            buttonText="Get Started Free"
            buttonVariant="outline"
            popular={false}
          />

          {/* Pro Plan */}
          <PricingCard
            name="Professional"
            description="For serious job seekers and career changers"
            price={isAnnual ? 19 : 24}
            originalPrice={isAnnual ? 24 : 29}
            isAnnual={isAnnual}
            icon={<Star className="h-6 w-6" />}
            features={[
              "Unlimited CV optimizations",
              "Advanced ATS scoring",
              "Premium templates",
              "Portfolio generator",
              "Career analytics dashboard",
              "Priority support",
              "Industry insights",
              "Keyword optimization"
            ]}
            buttonText="Start Pro Trial"
            buttonVariant="default"
            popular={true}
          />

          {/* Enterprise Plan */}
          <PricingCard
            name="Enterprise"
            description="For teams and organizations"
            price={isAnnual ? 79 : 99}
            originalPrice={isAnnual ? 99 : 119}
            isAnnual={isAnnual}
            icon={<Crown className="h-6 w-6" />}
            features={[
              "Everything in Professional",
              "Team management",
              "Bulk CV processing",
              "Custom branding",
              "API access",
              "Dedicated support",
              "Training sessions",
              "Custom integrations"
            ]}
            buttonText="Contact Sales"
            buttonVariant="outline"
            popular={false}
          />
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <h3 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FAQItem
              question="Can I cancel anytime?"
              answer="Yes, you can cancel your subscription at any time. No hidden fees or commitments."
            />
            <FAQItem
              question="Do you offer refunds?"
              answer="We offer a 30-day money-back guarantee for all paid plans if you're not satisfied."
            />
            <FAQItem
              question="What formats do you support?"
              answer="We support PDF, DOCX, and TXT formats for CV uploads and optimization."
            />
            <FAQItem
              question="Is my data secure?"
              answer="Yes, we use enterprise-grade encryption and never share your data with third parties."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

interface PricingCardProps {
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  isAnnual: boolean;
  icon: React.ReactNode;
  features: string[];
  buttonText: string;
  buttonVariant: "default" | "outline";
  popular: boolean;
}

function PricingCard({
  name,
  description,
  price,
  originalPrice,
  isAnnual,
  icon,
  features,
  buttonText,
  buttonVariant,
  popular
}: PricingCardProps) {
  return (
    <Card className={`relative glass-morphism border-0 hover:scale-105 transition-all duration-300 ${
      popular ? 'ring-2 ring-primary/50' : ''
    }`}>
      {popular && (
        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
          Most Popular
        </Badge>
      )}
      
      <CardHeader className="text-center pb-8">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary mx-auto">
          {icon}
        </div>
        <CardTitle className="text-2xl">{name}</CardTitle>
        <CardDescription className="text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Price */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-4xl font-bold">${price}</span>
            <span className="text-muted-foreground">/{isAnnual ? 'year' : 'month'}</span>
          </div>
          {price > 0 && originalPrice > price && (
            <p className="text-sm text-muted-foreground">
              <span className="line-through">${originalPrice}</span> - Save ${originalPrice - price}
            </p>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-3 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <Button 
          variant={buttonVariant} 
          className={`w-full ${buttonVariant === 'default' ? 'cyber-border' : ''}`}
          asChild
        >
          <Link href="/auth">
            {buttonText}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

interface FAQItemProps {
  question: string;
  answer: string;
}

function FAQItem({ question, answer }: FAQItemProps) {
  return (
    <div className="glass-morphism p-6 rounded-xl border">
      <h4 className="font-semibold mb-3">{question}</h4>
      <p className="text-sm text-muted-foreground">{answer}</p>
    </div>
  );
}
