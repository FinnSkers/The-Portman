import Navigation from '@/components/layout/Navigation'
import HeroSection from '@/components/sections/HeroSection'
import FeaturesSection from '@/components/sections/FeaturesSection'
import DemoSection from '@/components/sections/DemoSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import StatsSection from '@/components/sections/StatsSection'
import PricingSection from '@/components/sections/PricingSection'
import FAQSection from '@/components/sections/FAQSection'
import CTASection from '@/components/sections/CTASection'
import Footer from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <DemoSection />
      <TestimonialsSection />
      <StatsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </main>
  )
}