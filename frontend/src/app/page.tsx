"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FeatureCards from "../components/FeatureCards";
import TestimonialCarousel from "../components/TestimonialCarousel";
import SignInSignUpForm from "../components/SignInSignUpForm";
import PortfolioCarousel from "../components/PortfolioCarousel";
import DashboardTabs from "../components/DashboardTabs";
import UserProfile from "../components/UserProfile";
import SettingsPanel from "../components/SettingsPanel";
import FloatingMascot from "../components/FloatingMascot";
import PixelParticles from "../components/PixelParticles";
import { ThemeProvider } from "../components/ThemeProvider";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ThemeLoader from "./ThemeLoader";

export default function Home() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <ThemeProvider>
      <main className="relative min-h-screen flex flex-col items-center justify-center bg-black text-green-400 pt-16 pb-16 overflow-hidden">
        {/* Animated Background */}
        <PixelParticles />
      
      {/* Interactive Mouse Trail */}
      <motion.div
        className="fixed w-6 h-6 pointer-events-none z-0"
        animate={{
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      >
        <div className="w-full h-full bg-green-400 opacity-30 rounded-full blur-sm"></div>
      </motion.div>

      <Navbar
        onSignInClick={() => setShowSignIn((v) => !v)}
        onSettingsClick={() => setShowSettings((v) => !v)}
      />
      {/* Professional Animated Menu (only visible in pro mode) */}
      {/* <ProMenu /> */}

      {/* Main Content Wrapper */}
      <div className="main-content w-full relative z-10">
      {/* Crazy Animated Hero Section */}
      <section id="hero" className="w-full flex justify-center items-center min-h-[100vh] my-8 px-2 relative">
        {/* Floating geometric shapes */}
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity },
          }}
          className="absolute top-1/4 left-1/4 w-16 h-16 border-2 border-pink-400 opacity-30"
        />
        <motion.div
          animate={{
            rotate: -360,
            y: [0, -30, 0],
          }}
          transition={{
            rotate: { duration: 15, repeat: Infinity, ease: "linear" },
            y: { duration: 3, repeat: Infinity },
          }}
          className="absolute top-1/3 right-1/4 w-12 h-12 bg-blue-400 opacity-20 rounded-full"
        />
        <motion.div
          animate={{
            x: [0, 50, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 left-1/3 w-8 h-8 border-2 border-yellow-400 opacity-40 rotate-45"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, type: "spring", bounce: 0.3 }}
          className="relative max-w-5xl w-full glass rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Animated gradient background with crazy effects */}
          <motion.div
            animate={{
              background: [
                "linear-gradient(45deg, #000000 0%, #18181b 50%, #000000 100%)",
                "linear-gradient(135deg, #18181b 0%, #000000 50%, #18181b 100%)",
                "linear-gradient(225deg, #000000 0%, #18181b 50%, #000000 100%)",
                "linear-gradient(315deg, #18181b 0%, #000000 50%, #18181b 100%)",
              ],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute inset-0 z-0"
          />
          
          {/* Pulsating glow effects */}
          <motion.div
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-radial from-green-400/20 via-transparent to-transparent z-0"
          />
          
          <motion.div
            animate={{
              opacity: [0.1, 0.2, 0.1],
              scale: [1.1, 1, 1.1],
            }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
            className="absolute inset-0 bg-gradient-radial from-pink-400/20 via-transparent to-transparent z-0"
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center p-8 md:p-12 lg:p-20">
            
            {/* Crazy Animated Logo */}
            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                y: { duration: 4, repeat: Infinity },
                rotate: { duration: 6, repeat: Infinity },
                scale: { duration: 3, repeat: Infinity },
              }}
              className="mb-8 relative"
            >
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(57, 255, 20, 0.5), 0 0 40px rgba(57, 255, 20, 0.3)",
                    "0 0 30px rgba(255, 0, 168, 0.5), 0 0 60px rgba(255, 0, 168, 0.3)",
                    "0 0 25px rgba(0, 225, 255, 0.5), 0 0 50px rgba(0, 225, 255, 0.3)",
                    "0 0 20px rgba(57, 255, 20, 0.5), 0 0 40px rgba(57, 255, 20, 0.3)",
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="relative h-40 w-40 rounded-full"
              >
                <Image src="/8bitlogo.svg" alt="Portman 8-bit Logo" fill className="object-contain" />
              </motion.div>
              
              {/* Orbiting elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                <div className="absolute -top-2 left-1/2 w-3 h-3 bg-green-400 rounded-full"></div>
                <div className="absolute top-1/2 -right-2 w-2 h-2 bg-pink-400 rounded-full"></div>
                <div className="absolute -bottom-2 left-1/2 w-4 h-4 bg-blue-400 rounded-full"></div>
                <div className="absolute top-1/2 -left-2 w-2 h-2 bg-yellow-400 rounded-full"></div>
              </motion.div>
            </motion.div>
            
            {/* Glitchy Title Effect */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="relative"
            >
              <motion.span
                animate={{
                  textShadow: [
                    "0 0 5px #39ff14, 0 0 10px #39ff14, 0 0 15px #39ff14",
                    "2px 0 0 #ff00a8, -2px 0 0 #00e1ff",
                    "0 0 5px #39ff14, 0 0 10px #39ff14, 0 0 15px #39ff14",
                  ],
                }}
                transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 3 }}
                className="text-4xl md:text-7xl font-8bit text-center gradient-text drop-shadow-lg mb-4 tracking-wide block"
              >
                Portman: AI-Powered Career Tools
              </motion.span>
            </motion.h1>
            
            {/* Typewriter Effect Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-4 text-lg md:text-2xl text-green-100 text-center max-w-3xl font-sans font-medium"
            >
              <motion.span
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1.5, duration: 2 }}
                className="inline-block overflow-hidden whitespace-nowrap border-r-2 border-green-400"
              >
                Build your portfolio, optimize your resume, and get AI-driven career insights—all in a playful 8-bit world.
              </motion.span>
            </motion.p>
            
            {/* Crazy CTA Buttons */}
            <div className="flex flex-col md:flex-row gap-4 mt-12">
              <motion.button
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2, duration: 0.8 }}
                whileHover={{
                  scale: 1.1,
                  rotate: [0, -5, 5, 0],
                  boxShadow: "0 0 25px rgba(57, 255, 20, 0.8)",
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSignIn(true)}
                className="px-8 py-4 font-8bit text-black bg-green-400 border-2 border-green-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300"
              >
                Start Your Journey
              </motion.button>
              
              <motion.button
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.2, duration: 0.8 }}
                whileHover={{
                  scale: 1.1,
                  rotate: [0, 5, -5, 0],
                  boxShadow: "0 0 25px rgba(255, 0, 168, 0.8)",
                }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 font-8bit text-pink-400 border-2 border-pink-400 rounded-lg hover:bg-pink-400 hover:text-black focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
              >
                Watch Demo
              </motion.button>
            </div>
          </div>
          
          {/* Animated border */}
          <motion.div
            animate={{
              background: [
                "linear-gradient(90deg, #39ff14, #ff00a8, #00e1ff, #fff700, #39ff14)",
                "linear-gradient(180deg, #ff00a8, #00e1ff, #fff700, #39ff14, #ff00a8)",
                "linear-gradient(270deg, #00e1ff, #fff700, #39ff14, #ff00a8, #00e1ff)",
                "linear-gradient(360deg, #fff700, #39ff14, #ff00a8, #00e1ff, #fff700)",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute bottom-0 left-0 right-0 h-2"
          />
        </motion.div>
      </section>

      {/* Rest of the sections with entrance animations */}
      <section id="features" className="max-w-6xl mx-auto my-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <FeatureCards />
        </motion.div>
      </section>

      <section id="testimonials" className="max-w-4xl mx-auto my-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <TestimonialCarousel />
        </motion.div>
      </section>

      {/* Sign In/Sign Up Modal */}
      {showSignIn && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setShowSignIn(false)}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="relative"
          >
            <button
              className="absolute -top-4 -right-4 w-8 h-8 bg-red-500 text-white rounded-full font-8bit text-sm hover:bg-red-600 transition-colors z-10"
              onClick={() => setShowSignIn(false)}
              aria-label="Close"
            >
              ×
            </button>
            <SignInSignUpForm />
          </motion.div>
        </motion.div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setShowSettings(false)}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="relative"
          >
            <button
              className="absolute -top-4 -right-4 w-8 h-8 bg-red-500 text-white rounded-full font-8bit text-sm hover:bg-red-600 transition-colors z-10"
              onClick={() => setShowSettings(false)}
              aria-label="Close"
            >
              ×
            </button>
            <SettingsPanel />
          </motion.div>
        </motion.div>
      )}

      <section id="portfolios" className="max-w-4xl mx-auto my-12 px-4">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <PortfolioCarousel />
        </motion.div>
      </section>

      <section id="dashboard" className="max-w-3xl mx-auto my-12 px-4">
        <motion.div
          initial={{ opacity: 0, rotateY: 45 }}
          whileInView={{ opacity: 1, rotateY: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <DashboardTabs />
        </motion.div>
      </section>

      <section id="profile" className="max-w-md mx-auto my-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <UserProfile />
        </motion.div>
      </section>

      </div> {/* End main-content wrapper */}

      <FloatingMascot />
      <Footer />
    </main>
    </ThemeProvider>
  );
}
