"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CVUpload } from "@/components/cv-upload";
import { useIsMobile, mobileGrid, mobileSpacing, mobileTypography, mobileAnimations } from "@/lib/mobile-utils";
import { 
  Upload, 
  Bot, 
  BarChart3, 
  FileText, 
  Briefcase, 
  Sparkles,
  Users,
  ArrowRight
} from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Smart CV Upload",
    description: "Upload your CV in PDF, DOCX, or TXT format and let our AI extract and structure your data perfectly.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Bot,
    title: "AI-Powered Analysis", 
    description: "Get deep insights with our RAG system that compares you with industry professionals and provides personalized recommendations.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Briefcase,
    title: "Portfolio Generation",
    description: "Transform your CV into stunning, responsive portfolio websites with 20+ professional templates.",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: FileText,
    title: "ATS Resume Maker",
    description: "Create ATS-optimized resumes that pass through applicant tracking systems with high scores.",
    color: "from-orange-500 to-red-500"
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Track your progress with comprehensive analytics showing performance metrics and engagement data.",
    color: "from-indigo-500 to-purple-500"
  },
  {
    icon: Users,
    title: "Professional Comparison",
    description: "See how you stack up against similar professionals in your industry with detailed benchmarking.",
    color: "from-teal-500 to-blue-500"
  }
];

const stats = [
  { label: "CVs Processed", value: "10,000+", icon: FileText },
  { label: "Portfolios Created", value: "5,000+", icon: Briefcase },
  { label: "Success Rate", value: "98%", icon: Users },
  { label: "Happy Users", value: "2,500+", icon: Users }
];

export default function Home() {
  const [uploadStage, setUploadStage] = useState<"upload" | "processing" | "complete">("upload");
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className={`relative overflow-hidden ${mobileSpacing.section} ${mobileGrid.container}`}>
        <div className="text-center">
          <motion.div
            {...mobileAnimations.fadeInUp}
            transition={{ duration: 0.8 }}
            className={mobileSpacing.stack}
          >
            <Badge className="mx-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered Portfolio Platform
            </Badge>
            
            <h1 className={`${mobileTypography.hero} font-bold tracking-tight`}>
              Transform Your{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                CV into Success
              </span>
            </h1>
            
            <p className={`mx-auto max-w-2xl ${mobileTypography.subheading} text-muted-foreground leading-relaxed px-4`}>
              PORTMAN uses advanced AI to analyze your CV, generate stunning portfolios, 
              create ATS-optimized resumes, and provide professional insights that accelerate your career.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
              <Button size={isMobile ? "default" : "lg"} className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Upload className="w-4 h-4 mr-2" />
                Upload Your CV
              </Button>
              <Button variant="outline" size={isMobile ? "default" : "lg"} className="w-full sm:w-auto">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Demo
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
      </section>

      {/* CV Upload Section */}
      <section className={`${mobileSpacing.section} ${mobileGrid.container} bg-muted/30`}>
        <motion.div
          {...mobileAnimations.fadeInUp}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className={`text-center ${mobileSpacing.stack}`}
        >
          <h2 className={`${mobileTypography.heading} font-bold`}>
            Start Your Journey in{" "}
            <span className="text-blue-600">3 Simple Steps</span>
          </h2>
          <div className={`${mobileGrid["grid-3"]} mb-8`}>
            {[
              { step: "1", title: "Upload", desc: "Drop your CV file", icon: Upload },
              { step: "2", title: "Analyze", desc: "AI processes your data", icon: Bot },
              { step: "3", title: "Generate", desc: "Get your portfolio", icon: Sparkles }
            ].map((item, i) => (
              <motion.div
                key={i}
                {...mobileAnimations.scale}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center space-y-4"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                  {item.step}
                </div>
                <item.icon className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
                <div className="text-center">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <CVUpload />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className={`${mobileSpacing.section} ${mobileGrid.container}`}>
        <motion.div
          {...mobileAnimations.fadeInUp}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className={`text-center ${mobileSpacing.stack} mb-12`}
        >
          <h2 className={`${mobileTypography.heading} font-bold`}>
            Powerful Features for{" "}
            <span className="text-purple-600">Career Success</span>
          </h2>
          <p className={`mx-auto max-w-2xl ${mobileTypography.body} text-muted-foreground px-4`}>
            Our comprehensive platform combines AI technology with professional expertise 
            to give you everything you need to advance your career.
          </p>
        </motion.div>

        <div className={mobileGrid["grid-3"]}>
          {features.map((feature, i) => (
            <motion.div
              key={i}
              {...mobileAnimations.fadeInUp}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader className={mobileSpacing.card}>
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <CardTitle className={mobileTypography.body}>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 pb-6">
                  <CardDescription className={`${mobileTypography.caption} leading-relaxed`}>
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className={`${mobileSpacing.section} ${mobileGrid.container} bg-muted/30`}>
        <motion.div
          {...mobileAnimations.fadeInUp}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
            className="text-center space-y-8 mb-16"
          >
          <h2 className={`${mobileTypography.heading} font-bold text-center mb-8`}>
            Trusted by{" "}
            <span className="text-green-600">Professionals Worldwide</span>
          </h2>

          <div className={mobileGrid["grid-4"]}>
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                {...mobileAnimations.scale}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center space-y-3"
              >
                <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 mx-auto text-muted-foreground" />
                <div className="space-y-1">
                  <div className={`${mobileTypography.heading} font-bold text-foreground`}>
                    {stat.value}
                  </div>
                  <div className={`${mobileTypography.caption} text-muted-foreground font-medium`}>
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className={`${mobileSpacing.section} ${mobileGrid.container}`}>
        <div className="text-center">
          <motion.div
            {...mobileAnimations.fadeInUp}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className={mobileSpacing.stack}
          >
            <h2 className={`${mobileTypography.heading} font-bold`}>
              Ready to Transform Your Career?
            </h2>
            <p className={`${mobileTypography.body} text-muted-foreground max-w-2xl mx-auto px-4`}>
              Join thousands of professionals who have accelerated their careers with PORTMAN's AI-powered platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
              <Button size={isMobile ? "default" : "lg"} className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Upload className="w-4 h-4 mr-2" />
                Get Started Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button variant="outline" size={isMobile ? "default" : "lg"} className="w-full sm:w-auto">
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
