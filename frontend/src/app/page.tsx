"use client";

import Image from "next/image";
import CVUpload from "@/components/CVUpload";
import TemplateSelector from "@/components/TemplateSelector";
import PortfolioPreview from "@/components/PortfolioPreview";
import ThreeDHero from "@/components/ThreeDHero";
import ParallaxSection from "@/components/ParallaxSection";
import AnimatedParticles from "@/components/AnimatedParticles";
import GlassCard from "@/components/GlassCard";
import FloatingActionButton from "@/components/FloatingActionButton";
import TemplateShowcaseCarousel from "@/components/TemplateShowcaseCarousel";
import PortfolioTestimonials from "@/components/PortfolioTestimonials";
import AnimatedHeadline from "@/components/AnimatedHeadline";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { ArrowDownTrayIcon, UserCircleIcon, SparklesIcon, Cog6ToothIcon, SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { Dialog, Transition } from "@headlessui/react";
import Lottie from "lottie-react";
// Fix Lottie animation import for Next.js
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import animationData from "../../public/portfolio-lottie.json" assert { type: "json" };
import { useCVStore } from "@/store/useCVStore";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import FloatingChatTip, { FloatingProTip } from '../components/FloatingChatTip';
import PortfolioDataModal from "@/components/PortfolioDataModal";
import { useInView } from 'react-intersection-observer';

export default function Home() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const [showUpload, setShowUpload] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [showMainSections, setShowMainSections] = useState(false);
  const [showDone, setShowDone] = useState(false);
  const [showActionButtons, setShowActionButtons] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { status, data } = useCVStore();

  useEffect(() => {
    setTheme(
      window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    );
  }, [setTheme]);

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      if (rect.bottom < 80) {
        setShowMainSections(true);
      } else {
        setShowMainSections(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Watch for status change to 'parsed' to show 'Done!' and then buttons
  useEffect(() => {
    if (status === 'parsed') {
      setShowDone(true);
      setShowActionButtons(false);
      const timer = setTimeout(() => {
        setShowDone(false);
        setShowActionButtons(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setShowDone(false);
      setShowActionButtons(false);
    }
  }, [status]);

  // Drag and drop handlers for hero circle
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };
  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      // Use the same upload logic as CVUpload
      // You may want to refactor to share logic, but for now, call the store
      const { setFile, setData, setFilename, setStatus, setError } = require("@/store/useCVStore").useCVStore.getState();
      setFile(droppedFile);
      setError(null);
      setStatus('uploading');
      try {
        const { uploadCV, parseCV } = require("@/utils/api");
        const uploadRes = await uploadCV(droppedFile);
        setFilename(uploadRes.filename);
        setStatus('uploaded');
        setStatus('parsing');
        const parseRes = await parseCV(uploadRes.filename);
        setData(parseRes);
        setStatus('parsed');
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
        setStatus('error');
      }
    }
  };
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Use the same upload logic as above
    const { setFile, setData, setFilename, setStatus, setError } = require("@/store/useCVStore").useCVStore.getState();
    setFile(file);
    setError(null);
    setStatus('uploading');
    try {
      const { uploadCV, parseCV } = require("@/utils/api");
      const uploadRes = await uploadCV(file);
      setFilename(uploadRes.filename);
      setStatus('uploaded');
      setStatus('parsing');
      const parseRes = await parseCV(uploadRes.filename);
      setData(parseRes);
      setStatus('parsed');
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setStatus('error');
    }
  };

  // Scroll progress indicator
  const [scrollProgress, setScrollProgress] = useState(0);
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Section in-view detection for fade/slide-in
  const { ref: statsRef, inView: statsInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: timelineRef, inView: timelineInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const { ref: awardsRef, inView: awardsInView } = useInView({ triggerOnce: true, threshold: 0.2 });
  // ...add refs for other sections as needed...

  // Advanced parallax for hero/upload section
  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 600], [0, -120]);
  const heroScale = useTransform(scrollY, [0, 600], [1, 1.08]);

  return (
    <main className="relative w-full min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-950 dark:to-indigo-950">
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 h-1 bg-indigo-500 z-50"
        style={{ width: `${scrollProgress * 100}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${scrollProgress * 100}%` }}
        transition={{ type: 'spring', stiffness: 80, damping: 20 }}
      />
      {/* Animated Particles and SVG/Blob background */}
      <AnimatedParticles className="z-0" color="#a5b4fc" count={80} />
      <motion.div
        className="absolute top-0 left-0 w-full h-[70vh] pointer-events-none z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <svg className="w-full h-full" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.path
            fill="#a5b4fc"
            fillOpacity="0.25"
            d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
            initial={{ y: 0 }}
            animate={{ y: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
          />
        </svg>
        {/* Floating animated circles */}
        <motion.div
          className="absolute left-1/4 top-10 w-64 h-64 bg-gradient-to-br from-pink-400 to-indigo-400 rounded-full blur-2xl opacity-40"
          animate={{ y: [0, 60, 0], x: [0, 40, 0] }}
          transition={{ repeat: Infinity, duration: 14, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute right-1/4 top-32 w-40 h-40 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur-2xl opacity-30"
          animate={{ y: [0, -40, 0], x: [0, -30, 0] }}
          transition={{ repeat: Infinity, duration: 16, ease: 'easeInOut' }}
        />
      </motion.div>
      {/* Hero Section - snap, full width, huge upload, modern animation */}
      <section ref={heroRef} className="relative flex flex-col items-center justify-center gap-10 py-12 md:py-20 px-2 w-full min-h-screen max-h-screen snap-start z-10 overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ y: heroParallax, scale: heroScale }}
          aria-hidden
        >
          {/* Large animated gradient background shape */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] bg-gradient-to-br from-indigo-300/40 via-pink-200/30 to-blue-200/30 rounded-full blur-3xl animate-float-slow" />
          {/* Extra floating glassmorphism shape */}
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tr from-indigo-200/30 to-pink-200/20 rounded-full blur-2xl animate-float z-0" />
        </motion.div>
        <motion.h1
          className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-800 via-pink-500 to-blue-600 drop-shadow-[0_8px_32px_rgba(99,102,241,0.25)] tracking-tight animate-fade-in-up text-center leading-tight font-[Space_Grotesk,Inter,sans-serif]"
          initial={{ scale: 0.98 }}
          animate={{ scale: [0.98, 1.02, 0.98] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        >
          <span className="block mb-2 text-shadow-lg">Upload & get</span>
          <span className="block mt-2">
            <AnimatedHeadline />
          </span>
        </motion.h1>
        <div className="flex items-center justify-center w-full mt-2">
          <motion.div
            initial={{ scale: 0.96 }}
            animate={{ scale: [0.96, 1.04, 0.96] }}
            transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}
            className="w-full flex items-center justify-center"
          >
            <div
              className={`relative w-[19rem] h-[19rem] md:w-[20rem] md:h-[20rem] flex flex-col items-center justify-center border-[8px] rounded-full shadow-2xl transition-all duration-200 ${dragActive ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-950' : 'border-indigo-500'} bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              tabIndex={0}
              aria-label="Upload your CV by clicking the button or dragging a file here"
              style={{ background: 'transparent' }}
            >
              <span className="absolute top-10 left-1/2 -translate-x-1/2 text-2xl md:text-3xl text-gray-700 dark:text-gray-100 select-none opacity-95 pointer-events-none font-bold text-center w-64 tracking-tight drop-shadow-lg">
                <span className="inline-block align-middle text-4xl mr-2">📄</span>Upload your CV<br/>
                <span className="text-base font-normal tracking-wide opacity-80">(PDF, DOCX, TXT)</span>
              </span>
              <button
                type="button"
                className="flex items-center gap-3 px-10 py-5 bg-gradient-to-br from-indigo-600 via-pink-500 to-blue-500 text-white font-extrabold rounded-full shadow-2xl hover:scale-105 hover:shadow-[0_8px_32px_rgba(99,102,241,0.25)] transition text-2xl focus:outline-none focus:ring-4 focus:ring-indigo-300 mt-32 z-10 ripple"
                onClick={() => inputRef.current?.click()}
                aria-label="Upload CV"
              >
                <ArrowDownTrayIcon className="w-10 h-10 animate-bounce" />
                <span className="text-2xl">Upload CV</span>
              </button>
              <input
                id="cv-upload-hero"
                ref={inputRef}
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </motion.div>
        </div>
      </section>
      {/* After hero: new modern sections, all snap-start */}
      <section className="w-full snap-start">
        <div className="w-full px-0 md:px-8">
          <TemplateShowcaseCarousel />
        </div>
      </section>
      <section className="w-full snap-start bg-white/80 dark:bg-gray-900/80 py-20">
        {/* Stats/Trust bar */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 40 }}
          animate={statsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="snap-start w-full"
        >
          <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-12 text-center">
            <div className="flex flex-col items-center">
              <span className="text-5xl font-extrabold text-indigo-600">2M+</span>
              <span className="text-lg text-gray-700 dark:text-gray-200 mt-2">CVs Parsed</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-5xl font-extrabold text-pink-500">4.9/5</span>
              <span className="text-lg text-gray-700 dark:text-gray-200 mt-2">User Rating</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-5xl font-extrabold text-blue-500">100+</span>
              <span className="text-lg text-gray-700 dark:text-gray-200 mt-2">Templates</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-5xl font-extrabold text-green-500">AI</span>
              <span className="text-lg text-gray-700 dark:text-gray-200 mt-2">Powered</span>
            </div>
          </div>
        </motion.div>
      </section>
      <section className="w-full snap-start py-20" id="how-it-works">
        {/* How it works - visually rich, detailed, modern */}
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-extrabold mb-14 text-center bg-gradient-to-br from-indigo-700 via-pink-500 to-blue-500 bg-clip-text text-transparent drop-shadow-lg tracking-tight animate-fade-in-up">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="glass p-8 flex flex-col items-center text-center animate-fade-in-up">
              <span className="mb-4 bg-indigo-100 dark:bg-indigo-900 rounded-full p-4 shadow-lg">
                <svg className="w-10 h-10 text-indigo-600 dark:text-indigo-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" /></svg>
              </span>
              <h3 className="text-2xl font-bold mb-2">1. Upload Your CV</h3>
              <p className="text-gray-700 dark:text-gray-200">Drag & drop or click to upload your resume in PDF, DOCX, or TXT format. We support all major CV formats.</p>
            </div>
            <div className="glass p-8 flex flex-col items-center text-center animate-fade-in-up delay-100">
              <span className="mb-4 bg-pink-100 dark:bg-pink-900 rounded-full p-4 shadow-lg">
                <svg className="w-10 h-10 text-pink-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 17v-2a4 4 0 0 1 8 0v2M5 10a7 7 0 0 1 14 0v2a7 7 0 0 1-14 0v-2z" /></svg>
              </span>
              <h3 className="text-2xl font-bold mb-2">2. AI Parsing & Analysis</h3>
              <p className="text-gray-700 dark:text-gray-200">Our AI extracts your experience, skills, and achievements, benchmarking you against top professionals in your field.</p>
            </div>
            <div className="glass p-8 flex flex-col items-center text-center animate-fade-in-up delay-200">
              <span className="mb-4 bg-blue-100 dark:bg-blue-900 rounded-full p-4 shadow-lg">
                <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
              </span>
              <h3 className="text-2xl font-bold mb-2">3. Choose & Customize Template</h3>
              <p className="text-gray-700 dark:text-gray-200">Pick from stunning, animated portfolio templates. Instantly personalize colors, fonts, and layout to match your style.</p>
            </div>
            <div className="glass p-8 flex flex-col items-center text-center animate-fade-in-up delay-300">
              <span className="mb-4 bg-green-100 dark:bg-green-900 rounded-full p-4 shadow-lg">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
              </span>
              <h3 className="text-2xl font-bold mb-2">4. Preview & Launch</h3>
              <p className="text-gray-700 dark:text-gray-200">See your portfolio update in real time. Export, share, or deploy your new site with a single click. Your brand, your way.</p>
            </div>
            <div className="glass p-8 flex flex-col items-center text-center animate-fade-in-up delay-400">
              <span className="mb-4 bg-yellow-100 dark:bg-yellow-900 rounded-full p-4 shadow-lg">
                <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3" /></svg>
              </span>
              <h3 className="text-2xl font-bold mb-2">5. Track & Improve</h3>
              <p className="text-gray-700 dark:text-gray-200">(Coming soon) Get analytics on views, downloads, and engagement. Receive AI-powered tips to keep your portfolio at its best.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full snap-start bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-indigo-950 py-12">
        {/* Featured In / Awards bar */}
        <div className="max-w-5xl mx-auto flex flex-wrap justify-center items-center gap-10 py-6">
          <img src="/vercel.svg" alt="Vercel" className="h-10 opacity-80 grayscale hover:grayscale-0 transition" />
          <img src="/next.svg" alt="Next.js" className="h-10 opacity-80 grayscale hover:grayscale-0 transition" />
          <img src="/globe.svg" alt="Globe" className="h-10 opacity-80 grayscale hover:grayscale-0 transition" />
          <img src="/file.svg" alt="File" className="h-10 opacity-80 grayscale hover:grayscale-0 transition" />
        </div>
      </section>
      <section className="w-full snap-start">
        <section id="features" className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-16 px-4 md:px-16 animate-fade-in-up">
          <GlassCard>
            <SparklesIcon className="w-8 h-8 text-indigo-500 mb-2" />
            <h3 className="text-xl font-bold mb-2">AI CV Parsing</h3>
            <p>Extract structured data from your CV using advanced AI models. PDF, DOCX, TXT supported.</p>
          </GlassCard>
          <GlassCard>
            <Cog6ToothIcon className="w-8 h-8 text-indigo-500 mb-2" />
            <h3 className="text-xl font-bold mb-2">Template Customization</h3>
            <p>Choose, preview, and personalize modern portfolio templates with instant feedback.</p>
          </GlassCard>
          <GlassCard>
            <UserCircleIcon className="w-8 h-8 text-indigo-500 mb-2" />
            <h3 className="text-xl font-bold mb-2">Live Preview</h3>
            <p>See your portfolio update in real time as you customize templates and upload your CV.</p>
          </GlassCard>
          <GlassCard>
            <ArrowDownTrayIcon className="w-8 h-8 text-indigo-500 mb-2" />
            <h3 className="text-xl font-bold mb-2">Export & Share</h3>
            <p>Export your portfolio or share it online with a single click. PWA & SEO optimized.</p>
          </GlassCard>
        </section>
      </section>
      <main className="w-full flex flex-col gap-12 py-12 px-4 md:px-24 animate-fade-in-up delay-200 snap-start">
        <TemplateSelector onSelect={setSelectedTemplate} />
        <PortfolioPreview />
      </main>
      <section className="w-full snap-start">
        <div className="w-full px-0 md:px-8">
          <PortfolioTestimonials />
        </div>
      </section>
      {/* FAQ Section */}
      <section className="w-full snap-start bg-white/80 dark:bg-gray-900/80 py-20 relative overflow-hidden">
        {/* Floating glassmorphism shapes for visual effect */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-gradient-to-br from-indigo-300/30 to-pink-200/20 rounded-full blur-3xl animate-float z-0" />
        <div className="absolute -bottom-32 right-0 w-96 h-96 bg-gradient-to-tr from-blue-200/30 to-indigo-400/20 rounded-full blur-2xl animate-float-slow z-0" />
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-3xl font-bold mb-10 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {/* Interactive FAQ accordion */}
            {[{
              q: 'Is my data secure?',
              a: 'Yes, your CV and personal data are processed securely and never shared with third parties.'
            }, {
              q: 'Can I customize my portfolio?',
              a: 'Absolutely! Choose from dozens of templates and personalize colors, fonts, and layout.'
            }, {
              q: 'How fast is the process?',
              a: 'Most portfolios are ready in under 30 seconds, thanks to our optimized AI pipeline.'
            }].map((item, i) => (
              <details
                key={item.q}
                className="glass p-6 group transition-all duration-300 border-2 border-transparent hover:border-indigo-300/60 shadow-xl hover:shadow-2xl"
              >
                <summary className="font-semibold text-lg cursor-pointer flex items-center gap-3 group-open:text-indigo-600 transition-all">
                  <span className="transition-transform duration-300 group-open:rotate-90">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  {item.q}
                </summary>
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="mt-2 text-gray-700 dark:text-gray-200 overflow-hidden"
                >
                  {item.a}
                </motion.p>
              </details>
            ))}
          </div>
        </div>
      </section>
      {/* Blog/Insights Section */}
      <section className="w-full snap-start bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-indigo-950 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">Insights & Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <GlassCard>
              <h3 className="font-bold text-lg mb-2">How to Make Your Portfolio Stand Out in 2025</h3>
              <p className="text-gray-700 dark:text-gray-200">Learn the latest trends in design, animation, and storytelling for personal branding.</p>
              <a href="#" className="text-indigo-600 hover:underline mt-2 inline-block">Read more →</a>
            </GlassCard>
            <GlassCard>
              <h3 className="font-bold text-lg mb-2">AI in Career Growth</h3>
              <p className="text-gray-700 dark:text-gray-200">Discover how AI-powered tools can help you land your dream job faster.</p>
              <a href="#" className="text-indigo-600 hover:underline mt-2 inline-block">Read more →</a>
            </GlassCard>
            <GlassCard>
              <h3 className="font-bold text-lg mb-2">Top 10 Portfolio Mistakes</h3>
              <p className="text-gray-700 dark:text-gray-200">Avoid common pitfalls and make your online presence shine.</p>
              <a href="#" className="text-indigo-600 hover:underline mt-2 inline-block">Read more →</a>
            </GlassCard>
          </div>
        </div>
      </section>
      {/* Floating Chat Tip Button */}
      <FloatingProTip />
      <FloatingChatTip />
      <PortfolioDataModal
        open={showDataModal}
        onClose={() => setShowDataModal(false)}
        data={data?.parsed_data || data || {}}
      />
      {/* Floating upload CTA (appears after hero) */}
      <AnimatePresence>
        {showMainSections && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.5 }}
            className="z-50"
          >
            <FloatingActionButton
              onClick={() => heroRef.current?.scrollIntoView({ behavior: 'smooth' })}
              tooltip="Upload your CV"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
