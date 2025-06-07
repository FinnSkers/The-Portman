"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCVStore } from "@/store/useCVStore";
import { FaCode, FaPalette, FaEye, FaDownload, FaGlobe, FaCheckCircle, FaSpinner } from "react-icons/fa";
import { HiTemplate, HiColorSwatch, HiDocumentText } from "react-icons/hi";
import GlassCard from "./GlassCard";

interface PortfolioTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: 'modern' | 'classic' | 'creative' | 'minimal';
  features: string[];
  color: string;
}

interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  font: string;
}

export default function PortfolioGenerator() {
  const data = useCVStore((state) => state.data) as any;
  const [selectedTemplate, setSelectedTemplate] = useState<string>('modern-glass');
  const [theme, setTheme] = useState<ThemeConfig>({
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#06b6d4',
    background: '#ffffff',
    text: '#1f2937',
    font: 'Inter'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<'select' | 'customize' | 'preview' | 'deploy'>('select');

  const templates: PortfolioTemplate[] = [
    {
      id: 'modern-glass',
      name: 'Modern Glass',
      description: 'Sleek glassmorphism design with 3D elements',
      preview: '/templates/modern-glass.jpg',
      category: 'modern',
      features: ['3D Animations', 'Glassmorphism', 'Dark Mode', 'Responsive'],
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 'professional-clean',
      name: 'Professional Clean',
      description: 'Clean, corporate-friendly design',
      preview: '/templates/professional-clean.jpg',
      category: 'classic',
      features: ['ATS Friendly', 'Print Ready', 'Multi-section', 'Professional'],
      color: 'from-gray-600 to-gray-800'
    },
    {
      id: 'creative-portfolio',
      name: 'Creative Portfolio',
      description: 'Bold, artistic design for creatives',
      preview: '/templates/creative-portfolio.jpg',
      category: 'creative',
      features: ['Interactive Gallery', 'Video Support', 'Animation Heavy', 'Portfolio Focus'],
      color: 'from-pink-500 to-orange-500'
    },
    {
      id: 'minimal-elegant',
      name: 'Minimal Elegant',
      description: 'Clean, minimal design focusing on content',
      preview: '/templates/minimal-elegant.jpg',
      category: 'minimal',
      features: ['Typography Focus', 'Fast Loading', 'SEO Optimized', 'Clean Layout'],
      color: 'from-green-500 to-blue-500'
    }
  ];

  const colorPresets = [
    { name: 'Ocean', primary: '#0ea5e9', secondary: '#06b6d4', accent: '#3b82f6' },
    { name: 'Purple', primary: '#8b5cf6', secondary: '#a855f7', accent: '#ec4899' },
    { name: 'Emerald', primary: '#10b981', secondary: '#059669', accent: '#06b6d4' },
    { name: 'Orange', primary: '#f97316', secondary: '#ea580c', accent: '#eab308' },
    { name: 'Rose', primary: '#f43f5e', secondary: '#e11d48', accent: '#ec4899' },
    { name: 'Slate', primary: '#64748b', secondary: '#475569', accent: '#0ea5e9' }
  ];

  const fonts = [
    'Inter', 'Poppins', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Source Sans Pro', 'Nunito'
  ];

  const generatePortfolio = async () => {
    setIsGenerating(true);
    setCurrentStep('deploy');

    // Simulate portfolio generation process
    try {
      // Step 1: Process CV data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Step 2: Apply template
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Step 3: Generate static files
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Step 4: Deploy to hosting
      await new Promise(resolve => setTimeout(resolve, 1000));

      const portfolioId = `portfolio-${Date.now()}`;
      const url = `https://${portfolioId}.portman.app`;
      setGeneratedUrl(url);
      
    } catch (error) {
      console.error('Portfolio generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const renderTemplateSelector = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Choose Your Template</h2>
        <p className="text-gray-600 dark:text-gray-400">Select a design that matches your professional style</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {templates.map((template) => (
          <motion.div
            key={template.id}
            className={`relative overflow-hidden rounded-xl border-2 cursor-pointer transition-all duration-300 ${
              selectedTemplate === template.id
                ? 'border-indigo-500 ring-4 ring-indigo-200 dark:ring-indigo-800'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
            onClick={() => setSelectedTemplate(template.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`h-32 bg-gradient-to-br ${template.color} relative`}>
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                <HiTemplate className="w-12 h-12 text-white" />
              </div>
              {selectedTemplate === template.id && (
                <div className="absolute top-2 right-2">
                  <FaCheckCircle className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">{template.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{template.description}</p>
              <div className="flex flex-wrap gap-1">
                {template.features.map((feature) => (
                  <span
                    key={feature}
                    className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center">
        <motion.button
          onClick={() => setCurrentStep('customize')}
          className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Customize Template
        </motion.button>
      </div>
    </div>
  );

  const renderCustomization = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Customize Your Portfolio</h2>
        <p className="text-gray-600 dark:text-gray-400">Personalize colors, fonts, and styling</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Color Customization */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <FaPalette className="w-5 h-5" />
            Color Scheme
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            {colorPresets.map((preset) => (
              <motion.button
                key={preset.name}
                onClick={() => setTheme({ ...theme, primary: preset.primary, secondary: preset.secondary, accent: preset.accent })}
                className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.primary }}></div>
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.secondary }}></div>
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.accent }}></div>
                  </div>
                  <span className="text-sm font-medium">{preset.name}</span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Custom Color Inputs */}
          <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Primary Color</label>
              <input
                type="color"
                value={theme.primary}
                onChange={(e) => setTheme({ ...theme, primary: e.target.value })}
                className="w-full h-10 rounded border border-gray-300 dark:border-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Secondary Color</label>
              <input
                type="color"
                value={theme.secondary}
                onChange={(e) => setTheme({ ...theme, secondary: e.target.value })}
                className="w-full h-10 rounded border border-gray-300 dark:border-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Font Customization */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <HiDocumentText className="w-5 h-5" />
            Typography
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Font Family</label>
            <select
              value={theme.font}
              onChange={(e) => setTheme({ ...theme, font: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {fonts.map((font) => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          {/* Preview Text */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview</h4>
            <div style={{ fontFamily: theme.font, color: theme.primary }}>
              <h3 className="text-xl font-bold mb-1">John Doe</h3>
              <p className="text-sm" style={{ color: theme.secondary }}>Software Developer</p>
              <p className="text-sm mt-2" style={{ color: theme.text }}>
                Passionate developer with expertise in modern web technologies.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <motion.button
          onClick={() => setCurrentStep('select')}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Back
        </motion.button>
        <motion.button
          onClick={() => setCurrentStep('preview')}
          className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Preview Portfolio
        </motion.button>
      </div>
    </div>
  );

  const renderPreview = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Preview Your Portfolio</h2>
        <p className="text-gray-600 dark:text-gray-400">See how your portfolio will look</p>
      </div>

      <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        {/* Mock Portfolio Preview */}
        <div className="relative h-96 bg-gradient-to-br" style={{ background: `linear-gradient(to bottom right, ${theme.primary}, ${theme.secondary})` }}>
          <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold" style={{ fontFamily: theme.font }}>
                  {data?.personal_info?.name?.[0] || 'J'}
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: theme.font }}>
                {data?.personal_info?.name || 'John Doe'}
              </h1>
              <p className="text-lg opacity-90" style={{ fontFamily: theme.font }}>
                {data?.personal_info?.title || 'Professional Title'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white dark:bg-gray-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3" style={{ color: theme.primary, fontFamily: theme.font }}>
                About
              </h3>
              <p className="text-gray-600 dark:text-gray-400" style={{ fontFamily: theme.font }}>
                {data?.summary || 'Professional summary and key achievements...'}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3" style={{ color: theme.primary, fontFamily: theme.font }}>
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {(data?.skills || ['JavaScript', 'React', 'Node.js']).slice(0, 6).map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-sm"
                    style={{ backgroundColor: theme.accent + '20', color: theme.accent, fontFamily: theme.font }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <motion.button
          onClick={() => setCurrentStep('customize')}
          className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Back to Customize
        </motion.button>
        <motion.button
          onClick={generatePortfolio}
          disabled={isGenerating}
          className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
          whileHover={{ scale: isGenerating ? 1 : 1.05 }}
          whileTap={{ scale: isGenerating ? 1 : 0.95 }}
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <FaSpinner className="animate-spin" />
              Generating...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <FaGlobe />
              Generate Portfolio
            </span>
          )}
        </motion.button>
      </div>
    </div>
  );

  const renderDeployment = () => (
    <div className="space-y-6">
      {isGenerating ? (
        <div className="text-center space-y-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto"
          >
            <FaSpinner className="w-full h-full text-indigo-600" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Generating Your Portfolio</h2>
          <div className="max-w-md mx-auto space-y-3">
            <div className="text-left">
              <div className="flex items-center gap-3 mb-2">
                <FaCheckCircle className="text-green-500" />
                <span>Processing CV data</span>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <FaCheckCircle className="text-green-500" />
                <span>Applying template</span>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <FaSpinner className="animate-spin text-indigo-600" />
                <span>Generating static files</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
                <span className="text-gray-400">Deploying to hosting</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 mx-auto text-green-500"
          >
            <FaCheckCircle className="w-full h-full" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Portfolio Generated Successfully!</h2>
          <p className="text-gray-600 dark:text-gray-400">Your portfolio is now live and ready to share</p>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 max-w-md mx-auto">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Portfolio URL:</p>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-900 rounded border p-3">
              <FaGlobe className="text-indigo-600" />
              <code className="text-sm flex-1">{generatedUrl}</code>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <motion.button
              onClick={() => window.open(generatedUrl, '_blank')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center gap-2">
                <FaEye />
                View Portfolio
              </span>
            </motion.button>
            <motion.button
              onClick={() => navigator.clipboard.writeText(generatedUrl)}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Copy URL
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <GlassCard className="max-w-6xl mx-auto p-8">
      {/* Step Indicator */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-4">
          {['select', 'customize', 'preview', 'deploy'].map((step, index) => (
            <React.Fragment key={step}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                currentStep === step ? 'bg-indigo-600 text-white' :
                ['select', 'customize', 'preview'].indexOf(currentStep) > index ? 'bg-green-500 text-white' :
                'bg-gray-200 dark:bg-gray-700 text-gray-500'
              }`}>
                {['select', 'customize', 'preview'].indexOf(currentStep) > index ? <FaCheckCircle /> : index + 1}
              </div>
              {index < 3 && (
                <div className={`w-12 h-1 ${
                  ['select', 'customize', 'preview'].indexOf(currentStep) > index ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'
                }`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {currentStep === 'select' && renderTemplateSelector()}
          {currentStep === 'customize' && renderCustomization()}
          {currentStep === 'preview' && renderPreview()}
          {currentStep === 'deploy' && renderDeployment()}
        </motion.div>
      </AnimatePresence>
    </GlassCard>
  );
}
