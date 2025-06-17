import React from 'react';
import { MainLayout } from '@/components/layout';
import { 
  Hero, 
  LogoMarquee,
  Features, 
  HowItWorks,
  PortfolioTemplates,
  Pricing 
} from '@/components/home';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portman - Transform Your CV Into a Stunning Portfolio',
  description: 'Create a professional portfolio website from your CV in minutes. Stand out from the crowd with beautiful templates and AI-powered insights.',
};

export default function HomePage() {
  return (
    <MainLayout>
      <Hero />
      <LogoMarquee />
      <Features />
      <HowItWorks />
      <PortfolioTemplates />
      <Pricing />
    </MainLayout>
  );
}
