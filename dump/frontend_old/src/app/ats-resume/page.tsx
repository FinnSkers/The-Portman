"use client";
import React, { useEffect, useState } from "react";
import { useCVStore } from "@/store/useCVStore";
import { getATSTemplates, analyzeATSCompatibility, generateATSResume, downloadATSResume } from "@/utils/api";
import GlassCard from "@/components/GlassCard";
import ProcessingTransparency from "@/components/ProcessingTransparency";
import { motion } from "framer-motion";
import { 
  FaFileAlt, 
  FaDownload, 
  FaCheck, 
  FaCog, 
  FaChartBar, 
  FaStar, 
  FaLightbulb,
  FaIndustry,
  FaSearch,
  FaSpinner,
  FaArrowRight,
  FaRobot,
  FaCheckCircle
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { Tab } from "@headlessui/react";

interface ATSTemplate {
  id: string;
  name: string;
  description: string;
  font: string;
  sections: string[];
  features: string[];
}

interface ATSAnalysis {
  ats_score: number;
  industry: string;
  keyword_matches: string[];
  suggestions: string[];
  score_breakdown: {
    structure: number;
    keywords: number;
    formatting: number;
  };
}

interface GeneratedResume {
  resume_id: string;
  ats_score: number;
  download_url: string;
  keyword_density: Record<string, number>;
  optimization_suggestions: string[];
  template_config: ATSTemplate;
}

export default function ATSResumePage() {
  const { data } = useCVStore();
  const router = useRouter();
    // State management
  const [templates, setTemplates] = useState<ATSTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [atsAnalysis, setATSAnalysis] = useState<ATSAnalysis | null>(null);
  const [generatedResumes, setGeneratedResumes] = useState<GeneratedResume[]>([]);
  const [showProcessingTransparency, setShowProcessingTransparency] = useState(false);
  const [loading, setLoading] = useState({
    templates: false,
    analysis: false,
    generation: false,
    download: false
  });
  const [activeTab, setActiveTab] = useState(0);
  const [targetJobTitle, setTargetJobTitle] = useState("");
  const [targetIndustry, setTargetIndustry] = useState("");
  const [includeSections, setIncludeSections] = useState([
    "contact", "summary", "experience", "education", "skills"
  ]);
  const [keywordOptimization, setKeywordOptimization] = useState(true);

  // Initialize: Check for CV data and load templates
  useEffect(() => {
    if (!data) {
      return;
    }
    loadTemplates();
    analyzeCV();
  }, [data]);

  // Load available ATS templates
  const loadTemplates = async () => {
    setLoading(prev => ({ ...prev, templates: true }));
    try {
      const templatesData = await getATSTemplates();
      setTemplates(templatesData);
      if (templatesData.length > 0) {
        setSelectedTemplate(templatesData[0].id);
      }
    } catch (error) {
      console.error("Failed to load templates:", error);
    } finally {
      setLoading(prev => ({ ...prev, templates: false }));
    }
  };
  // Analyze ATS compatibility
  const analyzeCV = async () => {
    if (!data?.parsed_data) return;
    
    setLoading(prev => ({ ...prev, analysis: true }));
    setShowProcessingTransparency(true);
    
    try {
      const analysis = await analyzeATSCompatibility(
        data.parsed_data, 
        targetJobTitle || undefined
      );
      setATSAnalysis(analysis);
      
      // Show transparency for a moment then hide
      setTimeout(() => {
        setShowProcessingTransparency(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to analyze ATS compatibility:", error);
      setShowProcessingTransparency(false);
    } finally {
      setLoading(prev => ({ ...prev, analysis: false }));
    }
  };
  // Generate ATS resume
  const generateResume = async () => {
    if (!data?.parsed_data || !selectedTemplate) return;

    setLoading(prev => ({ ...prev, generation: true }));
    setShowProcessingTransparency(true);
    
    try {
      const requestData = {
        cv_data: data.parsed_data,
        template_type: selectedTemplate,
        include_sections: includeSections,
        keyword_optimization: keywordOptimization,
        target_job_title: targetJobTitle || undefined,
        target_industry: targetIndustry || undefined,
      };

      const resume = await generateATSResume(requestData);
      setGeneratedResumes(prev => [...prev, resume]);
      
      // Show transparency for the generation process
      setTimeout(() => {
        setShowProcessingTransparency(false);
      }, 4000);
    } catch (error) {
      console.error("Failed to generate resume:", error);
      setShowProcessingTransparency(false);
    } finally {
      setLoading(prev => ({ ...prev, generation: false }));
    }
  };

  // Download resume
  const downloadResume = async (resumeId: string) => {
    setLoading(prev => ({ ...prev, download: true }));
    try {
      const blob = await downloadATSResume(resumeId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ats_resume_${resumeId}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to download resume:", error);
    } finally {
      setLoading(prev => ({ ...prev, download: false }));
    }
  };

  // If no CV data, redirect to upload
  if (!data) {
    return (
      <main className="w-full min-h-screen bg-gradient-to-br from-indigo-50/90 via-white/95 to-blue-50/90 dark:from-gray-900/95 dark:via-gray-950/98 dark:to-indigo-950/95 flex flex-col items-center justify-center">
        <GlassCard className="max-w-2xl mx-auto p-8 text-center">
          <div className="text-red-600 font-semibold mb-4">No CV data found. Please upload your CV first.</div>
          <motion.button 
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold shadow hover:bg-blue-600 transition"
            onClick={() => router.push("/")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Go Back to Upload
          </motion.button>
        </GlassCard>
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-indigo-50/90 via-white/95 to-blue-50/90 dark:from-gray-900/95 dark:via-gray-950/98 dark:to-indigo-950/95 flex flex-col items-center justify-start py-0 px-0">
      <div className="w-full dashboard-container flex flex-col gap-8 py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              ATS Resume Maker
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Create ATS-optimized resumes that pass through applicant tracking systems
            </p>
          </div>
          <div className="flex gap-3">
            <motion.button 
              className="px-5 py-2 rounded-lg bg-blue-500 text-white font-semibold shadow hover:bg-blue-600 transition"
              onClick={() => router.push("/analysis")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View Analysis
            </motion.button>
            <motion.button 
              className="px-5 py-2 rounded-lg bg-gray-500 text-white font-semibold shadow hover:bg-gray-600 transition"
              onClick={() => router.push("/")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Back to Upload
            </motion.button>
          </div>
        </div>

        {/* Tab Navigation */}
        <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
          <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
            {["Configuration", "Analysis", "Generated Resumes"].map((tab, index) => (
              <Tab
                key={tab}
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700 transition-all duration-300 ${
                    selected
                      ? 'bg-white shadow text-blue-900 dark:bg-blue-800 dark:text-white'
                      : 'text-blue-100 hover:bg-white/[0.12] hover:text-white dark:text-blue-300'
                  }`
                }
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels>
            {/* Configuration Tab */}
            <Tab.Panel>
              <div className="grid md:grid-cols-2 gap-8">
                
                {/* Template Selection */}
                <GlassCard className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-indigo-700 dark:text-indigo-200 flex items-center gap-2">
                    <FaFileAlt className="text-lg" /> Choose Template
                  </h3>
                  
                  {loading.templates ? (
                    <div className="flex items-center justify-center py-8">
                      <FaSpinner className="animate-spin text-2xl text-indigo-500" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {templates.map((template) => (
                        <motion.div
                          key={template.id}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedTemplate === template.id
                              ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                              : 'border-gray-200 hover:border-indigo-300 dark:border-gray-700'
                          }`}
                          onClick={() => setSelectedTemplate(template.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                              {template.name}
                            </h4>
                            {selectedTemplate === template.id && (
                              <FaCheck className="text-green-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            {template.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {template.features.slice(0, 3).map((feature, idx) => (
                              <span 
                                key={idx}
                                className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </GlassCard>

                {/* Configuration Options */}
                <GlassCard className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-indigo-700 dark:text-indigo-200 flex items-center gap-2">
                    <FaCog className="text-lg" /> Configuration
                  </h3>

                  <div className="space-y-4">
                    {/* Target Job Title */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                        Target Job Title (Optional)
                      </label>
                      <input
                        type="text"
                        value={targetJobTitle}
                        onChange={(e) => setTargetJobTitle(e.target.value)}
                        placeholder="e.g., Senior Software Engineer"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      />
                    </div>

                    {/* Target Industry */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                        Target Industry (Optional)
                      </label>
                      <select
                        value={targetIndustry}
                        onChange={(e) => setTargetIndustry(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      >
                        <option value="">Select Industry</option>
                        <option value="technology">Technology</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="finance">Finance</option>
                        <option value="engineering">Engineering</option>
                        <option value="marketing">Marketing</option>
                        <option value="education">Education</option>
                        <option value="retail">Retail</option>
                        <option value="consulting">Consulting</option>
                        <option value="manufacturing">Manufacturing</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Sections to Include */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                        Include Sections
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {["contact", "summary", "experience", "education", "skills", "certifications", "projects", "languages"].map((section) => (
                          <label key={section} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={includeSections.includes(section)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setIncludeSections(prev => [...prev, section]);
                                } else {
                                  setIncludeSections(prev => prev.filter(s => s !== section));
                                }
                              }}
                              className="rounded text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                              {section}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Keyword Optimization */}
                    <div>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={keywordOptimization}
                          onChange={(e) => setKeywordOptimization(e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                          Enable Keyword Optimization
                        </span>
                      </label>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Automatically optimize keywords based on industry standards
                      </p>
                    </div>

                    {/* Generate Button */}
                    <motion.button
                      onClick={generateResume}
                      disabled={loading.generation || !selectedTemplate}
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: loading.generation ? 1 : 1.02 }}
                      whileTap={{ scale: loading.generation ? 1 : 0.98 }}
                    >
                      {loading.generation ? (
                        <>
                          <FaSpinner className="animate-spin" />
                          Generating Resume...
                        </>
                      ) : (
                        <>
                          <FaFileAlt />
                          Generate ATS Resume
                        </>
                      )}
                    </motion.button>
                  </div>
                </GlassCard>
              </div>
            </Tab.Panel>

            {/* Analysis Tab */}
            <Tab.Panel>
              <div className="grid md:grid-cols-2 gap-8">
                
                {/* ATS Score Overview */}
                <GlassCard className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-indigo-700 dark:text-indigo-200 flex items-center gap-2">
                    <FaChartBar className="text-lg" /> ATS Compatibility Score
                  </h3>

                  {loading.analysis ? (
                    <div className="flex items-center justify-center py-8">
                      <FaSpinner className="animate-spin text-2xl text-indigo-500" />
                    </div>
                  ) : atsAnalysis ? (
                    <div className="space-y-4">
                      {/* Overall Score */}
                      <div className="text-center">
                        <div className="text-4xl font-black text-indigo-600 dark:text-indigo-400">
                          {atsAnalysis.ats_score}/100
                        </div>
                        <div className="text-gray-600 dark:text-gray-300">
                          Overall ATS Score
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-3">
                          <div 
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-1000"
                            style={{ width: `${atsAnalysis.ats_score}%` }}
                          />
                        </div>
                      </div>

                      {/* Score Breakdown */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200">Score Breakdown:</h4>
                        {Object.entries(atsAnalysis.score_breakdown).map(([category, score]) => (
                          <div key={category} className="flex justify-between items-center">
                            <span className="capitalize text-gray-700 dark:text-gray-300">
                              {category}:
                            </span>
                            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                              {score}/100
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Industry */}
                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <FaIndustry className="text-blue-500" />
                        <span>Industry: <strong>{atsAnalysis.industry}</strong></span>
                      </div>

                      {/* Keyword Matches */}
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center gap-2">
                          <FaStar className="text-yellow-500" />
                          Keyword Matches ({atsAnalysis.keyword_matches.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {atsAnalysis.keyword_matches.slice(0, 8).map((keyword, idx) => (
                            <span 
                              key={idx}
                              className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 rounded"
                            >
                              {keyword}
                            </span>
                          ))}
                          {atsAnalysis.keyword_matches.length > 8 && (
                            <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300 rounded">
                              +{atsAnalysis.keyword_matches.length - 8} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      Click "Analyze" to get ATS compatibility score
                    </div>
                  )}

                  <motion.button
                    onClick={analyzeCV}
                    disabled={loading.analysis}
                    className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold shadow hover:bg-blue-600 transition-all disabled:opacity-50"
                    whileHover={{ scale: loading.analysis ? 1 : 1.02 }}
                    whileTap={{ scale: loading.analysis ? 1 : 0.98 }}
                  >
                    {loading.analysis ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <FaSearch />
                        Re-analyze
                      </>
                    )}
                  </motion.button>
                </GlassCard>

                {/* Suggestions */}
                <GlassCard className="p-6">
                  <h3 className="text-xl font-bold mb-4 text-indigo-700 dark:text-indigo-200 flex items-center gap-2">
                    <FaLightbulb className="text-lg" /> Optimization Suggestions
                  </h3>

                  {atsAnalysis?.suggestions ? (
                    <div className="space-y-3">
                      {atsAnalysis.suggestions.map((suggestion, idx) => (
                        <div 
                          key={idx}
                          className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
                        >
                          <FaLightbulb className="text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {suggestion}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      Analyze your CV to see optimization suggestions
                    </div>
                  )}
                </GlassCard>
              </div>
            </Tab.Panel>

            {/* Generated Resumes Tab */}
            <Tab.Panel>
              <div className="space-y-6">
                {generatedResumes.length === 0 ? (
                  <GlassCard className="p-8 text-center">
                    <div className="text-gray-500 dark:text-gray-400 mb-4">
                      No resumes generated yet. Go to the Configuration tab to create your first ATS resume.
                    </div>
                    <motion.button
                      onClick={() => setActiveTab(0)}
                      className="px-6 py-3 bg-indigo-500 text-white rounded-lg font-semibold shadow hover:bg-indigo-600 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Start Creating <FaArrowRight className="inline ml-2" />
                    </motion.button>
                  </GlassCard>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {generatedResumes.map((resume, idx) => (
                      <motion.div
                        key={resume.resume_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <GlassCard className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                              {resume.template_config.name} Resume
                            </h4>
                            <div className="text-right">
                              <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                                {resume.ats_score}/100
                              </div>
                              <div className="text-xs text-gray-500">ATS Score</div>
                            </div>
                          </div>

                          {/* Keywords Found */}
                          <div className="mb-4">
                            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                              Keywords ({Object.keys(resume.keyword_density).length})
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {Object.entries(resume.keyword_density).slice(0, 6).map(([keyword, density]) => (
                                <span 
                                  key={keyword}
                                  className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded"
                                  title={`Density: ${(density * 100).toFixed(1)}%`}
                                >
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Optimization Suggestions */}
                          {resume.optimization_suggestions.length > 0 && (
                            <div className="mb-4">
                              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Suggestions ({resume.optimization_suggestions.length})
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                {resume.optimization_suggestions[0]}
                                {resume.optimization_suggestions.length > 1 && (
                                  <span className="text-blue-500"> +{resume.optimization_suggestions.length - 1} more</span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Download Button */}
                          <motion.button
                            onClick={() => downloadResume(resume.resume_id)}
                            disabled={loading.download}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold shadow hover:bg-green-600 transition-all disabled:opacity-50"
                            whileHover={{ scale: loading.download ? 1 : 1.02 }}
                            whileTap={{ scale: loading.download ? 1 : 0.98 }}
                          >
                            {loading.download ? (
                              <>
                                <FaSpinner className="animate-spin" />
                                Downloading...
                              </>
                            ) : (
                              <>
                                <FaDownload />
                                Download DOCX
                              </>
                            )}
                          </motion.button>
                        </GlassCard>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </Tab.Panel>
          </Tab.Panels>        </Tab.Group>
      </div>

      {/* Processing Transparency Modal */}
      <ProcessingTransparency
        isVisible={showProcessingTransparency}
        filename={data?.personal_info?.name || 'resume'}
        onComplete={() => setShowProcessingTransparency(false)}
      />
    </main>
  );
}
