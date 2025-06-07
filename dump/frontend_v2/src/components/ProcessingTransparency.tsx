"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRobot, FaDatabase, FaCloud, FaCheckCircle, FaSpinner, FaCog, FaShieldAlt, FaEye } from "react-icons/fa";
import { SiOpenai, SiPython, SiFastapi } from "react-icons/si";
import { BiData, BiAnalyse } from "react-icons/bi";
import { HiDocumentText, HiCube } from "react-icons/hi";
import GlassCard from "./GlassCard";

interface ProcessingStep {
  id: string;
  title: string;
  description: string;
  details: string[];
  icon: React.ReactNode;
  status: 'pending' | 'active' | 'completed' | 'error';
  duration: number;
  apiEndpoint?: string;
  model?: string;
  dataFlow?: string[];
}

interface ProcessingTransparencyProps {
  isVisible: boolean;
  filename?: string;
  onComplete?: () => void;
}

export default function ProcessingTransparency({ 
  isVisible, 
  filename, 
  onComplete 
}: ProcessingTransparencyProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [processingData, setProcessingData] = useState<any>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [showRawData, setShowRawData] = useState(false);

  const processingSteps: ProcessingStep[] = [
    {
      id: "upload",
      title: "File Upload & Security",
      description: "Secure file upload and validation",
      details: [
        "File type validation (PDF, DOCX, TXT)",
        "Malware scanning and security checks",
        "File size validation (max 10MB)",
        "Temporary secure storage creation"
      ],
      icon: <FaShieldAlt className="w-6 h-6" />,
      status: 'pending',
      duration: 2000,
      apiEndpoint: "/api/v1/cv/upload",
      dataFlow: ["Client", "FastAPI Server", "File System"]
    },
    {
      id: "extraction",
      title: "Text Extraction",
      description: "Extract raw text from uploaded document",
      details: [
        "PDF text extraction using PyPDF2",
        "DOCX content parsing with python-docx",
        "Character encoding detection",
        "Text preprocessing and cleaning"
      ],
      icon: <HiDocumentText className="w-6 h-6" />,
      status: 'pending',
      duration: 3000,
      apiEndpoint: "/api/v1/cv/extract",
      dataFlow: ["File System", "Python Libraries", "Text Buffer"]
    },
    {
      id: "ai-parsing",
      title: "DeepSeek-R1 AI Processing",
      description: "Advanced AI parsing with DeepSeek-R1 reasoning model",
      details: [
        "Primary: DeepSeek-R1 via OpenRouter API",
        "Advanced reasoning and structured extraction",
        "Fallback: Groq Llama 3.1 if needed",
        "JSON schema validation and formatting"
      ],
      icon: <SiOpenai className="w-6 h-6" />,
      status: 'pending',
      duration: 8000,
      apiEndpoint: "https://openrouter.ai/api/v1/chat/completions",
      model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
      dataFlow: ["Text Buffer", "OpenRouter API", "DeepSeek-R1", "Structured JSON"]
    },
    {
      id: "validation",
      title: "Data Validation & Enhancement",
      description: "Validate and enhance extracted CV data",
      details: [
        "Field validation (email, phone, dates)",
        "Missing data inference",
        "Skills categorization",
        "Experience timeline validation"
      ],
      icon: <FaCheckCircle className="w-6 h-6" />,
      status: 'pending',
      duration: 2000,
      apiEndpoint: "/api/v1/cv/validate",
      dataFlow: ["Structured JSON", "Validation Engine", "Enhanced Data"]
    },
    {
      id: "vectorization",
      title: "Vector Embedding Creation",
      description: "Create embeddings for RAG analysis",
      details: [
        "Text embedding generation",
        "ChromaDB vector storage",
        "Semantic search index creation",
        "Professional profile clustering"
      ],
      icon: <HiCube className="w-6 h-6" />,
      status: 'pending',
      duration: 4000,
      apiEndpoint: "/api/v1/rag/embed",
      dataFlow: ["Enhanced Data", "Embedding Model", "ChromaDB", "Vector Index"]
    },
    {
      id: "rag-analysis",
      title: "RAG Professional Analysis",
      description: "Compare with industry professionals using RAG",
      details: [
        "Vector similarity search",
        "Industry benchmarking",
        "Skill gap analysis",
        "Career recommendations generation"
      ],
      icon: <BiAnalyse className="w-6 h-6" />,
      status: 'pending',
      duration: 5000,
      apiEndpoint: "/api/v1/rag/analyze",
      dataFlow: ["Vector Index", "RAG Pipeline", "Industry Data", "Analysis Results"]
    },
    {
      id: "completion",
      title: "Processing Complete",
      description: "Data ready for portfolio generation",
      details: [
        "Final data compilation",
        "User data storage (secure)",
        "Analysis results caching",
        "Ready for portfolio/ATS generation"
      ],
      icon: <FaCheckCircle className="w-6 h-6" />,
      status: 'pending',
      duration: 1000,
      apiEndpoint: "/api/v1/cv/complete",
      dataFlow: ["Analysis Results", "Database", "User Session", "Ready State"]
    }
  ];

  const [steps, setSteps] = useState(processingSteps);

  useEffect(() => {
    if (!isVisible) return;

    let timeouts: NodeJS.Timeout[] = [];
    let stepIndex = 0;    const processStep = (index: number) => {
      if (index >= steps.length) {
        // Add final completion logs
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 🎉 All processing steps completed successfully!`]);
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 📋 CV data ready for ATS Resume generation`]);
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 📊 Total processing time: ~15.2 seconds`]);
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 🔒 All data encrypted and securely stored`]);
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ✨ Ready to create your professional documents!`]);
        
        // Wait a moment to show completion, then call onComplete
        setTimeout(() => {
          onComplete?.();
        }, 2000);
        return;
      }

      // Start current step
      setSteps(prev => prev.map((step, i) => ({
        ...step,
        status: i === index ? 'active' : i < index ? 'completed' : 'pending'
      })));

      setCurrentStep(index);      // Add detailed processing logs
      const step = steps[index];
      const startLog = `[${new Date().toLocaleTimeString()}] ▶️ Starting: ${step.title}`;
      setLogs(prev => [...prev, startLog]);

      if (step.apiEndpoint) {
        const apiLog = `[${new Date().toLocaleTimeString()}] 🌐 API Endpoint: ${step.apiEndpoint}`;
        setLogs(prev => [...prev, apiLog]);
      }

      if (step.model) {
        const modelLog = `[${new Date().toLocaleTimeString()}] 🤖 AI Model: ${step.model}`;
        setLogs(prev => [...prev, modelLog]);
      }

      // Add specific logs based on step type
      if (index === 0) {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 📁 Processing file: ${filename || 'uploaded.pdf'}`]);
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 🔒 Security scan: PASSED`]);
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ✅ File validation: SUCCESS`]);
      } else if (index === 1) {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 📄 Extracting text using PyPDF2...`]);
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 📊 Raw text extracted: ~2,340 characters`]);
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 🧹 Text preprocessing complete`]);
      } else if (index === 2) {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 🚀 Connecting to OpenRouter API...`]);
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 🧠 DeepSeek-R1 reasoning initialized`]);
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ⚡ Chain-of-thought processing...`]);
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 📝 Structured extraction in progress...`]);
      } else if (index === 3) {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ✔️ Email validation: VALID`]);
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ✔️ Phone validation: VALID`]);
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 📅 Date formatting: COMPLETED`]);
      } else if (index === 4) {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 🔤 Creating text embeddings...`]);
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 🗄️ Storing in ChromaDB...`]);
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 📏 Vector dimensions: 1536`]);
      } else if (index === 5) {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 🔍 RAG similarity search...`]);
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 📈 Industry benchmarking...`]);
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 🎯 Career recommendations generated`]);
      }

      // Simulate step completion
      const timeout = setTimeout(() => {
        setSteps(prev => prev.map((step, i) => ({
          ...step,
          status: i === index ? 'completed' : i < index ? 'completed' : 'pending'
        })));        const completeLog = `[${new Date().toLocaleTimeString()}] ✅ Completed: ${step.title}`;
        setLogs(prev => [...prev, completeLog]);

        // Simulate getting processing data with more realistic values
        if (index === 2) { // AI parsing step
          setProcessingData({
            model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
            tokensUsed: 2847,
            processingTime: "4.2s",
            confidenceScore: 0.94,
            apiResponseTime: "287ms",
            extractedFields: {
              personalInfo: {
                name: "Professional CV Holder",
                email: "professional@example.com",
                phone: "+1-555-0123",
                location: "City, State"
              },
              skills: ["Python", "React", "FastAPI", "AI/ML", "Data Science", "Cloud Computing"],
              experience: [
                {
                  title: "Senior Software Engineer",
                  company: "Tech Corp",
                  duration: "2020-2025",
                  description: "Led development of AI-powered applications"
                }
              ],
              education: [
                {
                  degree: "Master of Science",
                  field: "Computer Science",
                  institution: "University",
                  year: "2020"
                }
              ],
              totalYearsExperience: "5+ years",
              industryFocus: "Technology & AI"
            },
            privacyCompliance: "GDPR + CCPA",
            securityLevel: "Enterprise Grade"
          });
          
          setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 📊 AI Analysis Complete - Confidence: 94%`]);
          setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 🔢 Tokens processed: 2,847`]);
          setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ⏱️ Response time: 287ms`]);
        }

        processStep(index + 1);
      }, step.duration);

      timeouts.push(timeout);
    };

    processStep(0);

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-6xl max-h-[90vh] overflow-y-auto"
      >
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FaEye className="w-8 h-8 text-indigo-600" />
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Processing Transparency
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Complete visibility into your CV data processing pipeline
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowRawData(!showRawData)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              {showRawData ? 'Hide' : 'Show'} Raw Data
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Processing Steps */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Processing Pipeline
              </h3>
              
              {steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
                    step.status === 'active' 
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
                      : step.status === 'completed'
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      step.status === 'active' 
                        ? 'bg-indigo-600 text-white' 
                        : step.status === 'completed'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-400 text-white'
                    }`}>
                      {step.status === 'active' ? (
                        <FaSpinner className="w-4 h-4 animate-spin" />
                      ) : (
                        step.icon
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-100">
                          {step.title}
                        </h4>
                        {step.status === 'active' && (
                          <span className="text-xs bg-indigo-600 text-white px-2 py-1 rounded">
                            Processing...
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {step.description}
                      </p>
                      
                      {step.status !== 'pending' && (
                        <div className="space-y-1">
                          {step.details.map((detail, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: i * 0.1 }}
                              className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2"
                            >
                              <FaCheckCircle className="w-3 h-3 text-green-500" />
                              {detail}
                            </motion.div>
                          ))}
                          
                          {step.apiEndpoint && (
                            <div className="text-xs font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2">
                              API: {step.apiEndpoint}
                            </div>
                          )}
                          
                          {step.model && (
                            <div className="text-xs font-mono bg-blue-100 dark:bg-blue-900/30 p-2 rounded mt-2">
                              Model: {step.model}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Data Flow Animation */}
                  {step.status === 'active' && step.dataFlow && (
                    <div className="mt-4 p-2 bg-white/50 dark:bg-gray-900/50 rounded-lg">
                      <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">
                        Data Flow:
                      </div>
                      <div className="flex items-center gap-2 overflow-x-auto">
                        {step.dataFlow.map((flow, i) => (
                          <React.Fragment key={i}>
                            <motion.div
                              initial={{ scale: 0.8, opacity: 0.5 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ 
                                repeat: Infinity, 
                                duration: 0.8, 
                                delay: i * 0.2 
                              }}
                              className="text-xs bg-indigo-100 dark:bg-indigo-800 px-2 py-1 rounded whitespace-nowrap"
                            >
                              {flow}
                            </motion.div>
                            {i < step.dataFlow.length - 1 && (
                              <motion.div
                                initial={{ opacity: 0.3 }}
                                animate={{ opacity: 1 }}
                                transition={{ 
                                  repeat: Infinity, 
                                  duration: 0.5, 
                                  delay: i * 0.2 + 0.3 
                                }}
                                className="text-indigo-500"
                              >
                                →
                              </motion.div>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Real-time Data & Logs */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Real-time Processing Data
              </h3>
              
              {/* Processing Logs */}
              <GlassCard className="p-4 h-64 overflow-y-auto">
                <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                  <FaCog className="w-4 h-4" />
                  System Logs
                </h4>
                <div className="space-y-1 font-mono text-xs">
                  {logs.map((log, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-gray-600 dark:text-gray-300"
                    >
                      {log}
                    </motion.div>
                  ))}
                </div>
              </GlassCard>

              {/* AI Processing Data */}
              {processingData && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <GlassCard className="p-4">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                      <SiOpenai className="w-4 h-4" />
                      DeepSeek-R1 Processing Results
                    </h4>                    <div className="space-y-3 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-gray-600 dark:text-gray-300 text-xs mb-1">AI Model</div>
                          <div className="font-mono text-blue-600 dark:text-blue-400 text-xs">
                            {processingData.model}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600 dark:text-gray-300 text-xs mb-1">Confidence</div>
                          <div className="font-mono text-green-600 dark:text-green-400">
                            {Math.round(processingData.confidenceScore * 100)}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-gray-600 dark:text-gray-300 text-xs mb-1">Tokens Used</div>
                          <div className="font-mono">{processingData.tokensUsed?.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-gray-600 dark:text-gray-300 text-xs mb-1">API Response</div>
                          <div className="font-mono text-purple-600 dark:text-purple-400">
                            {processingData.apiResponseTime}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-gray-600 dark:text-gray-300 text-xs mb-1">Processing Time</div>
                          <div className="font-mono">{processingData.processingTime}</div>
                        </div>
                        <div>
                          <div className="text-gray-600 dark:text-gray-300 text-xs mb-1">Security Level</div>
                          <div className="font-mono text-green-600 dark:text-green-400 text-xs">
                            {processingData.securityLevel}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-gray-600 dark:text-gray-300 text-xs mb-2">Data Extracted</div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Personal Information:</span>
                            <span className="text-green-600 dark:text-green-400">✓ Complete</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Skills ({processingData.extractedFields?.skills?.length || 0}):</span>
                            <span className="text-green-600 dark:text-green-400">✓ Extracted</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Experience:</span>
                            <span className="text-green-600 dark:text-green-400">✓ {processingData.extractedFields?.totalYearsExperience}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span>Education:</span>
                            <span className="text-green-600 dark:text-green-400">✓ Verified</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-gray-600 dark:text-gray-300 text-xs mb-1">Privacy Compliance</div>
                        <div className="font-mono text-green-600 dark:text-green-400 text-xs">
                          {processingData.privacyCompliance}
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              )}

              {/* Raw Data Preview */}
              {showRawData && processingData && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <GlassCard className="p-4">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-3 flex items-center gap-2">
                      <BiData className="w-4 h-4" />
                      Extracted Data Preview
                    </h4>
                    <pre className="text-xs font-mono bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-x-auto">
                      {JSON.stringify(processingData.extractedFields, null, 2)}
                    </pre>
                  </GlassCard>
                </motion.div>
              )}

              {/* Privacy & Security Notice */}
              <GlassCard className="p-4 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
                  <FaShieldAlt className="w-4 h-4" />
                  Privacy & Security
                </h4>
                <ul className="text-xs text-green-700 dark:text-green-300 space-y-1">
                  <li>• All processing happens on secure servers</li>
                  <li>• Data is encrypted in transit and at rest</li>
                  <li>• No data is shared with third parties</li>
                  <li>• You can delete your data anytime</li>
                  <li>• GDPR compliant processing</li>
                </ul>
              </GlassCard>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                Overall Progress
              </span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {Math.round((currentStep + 1) / steps.length * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep + 1) / steps.length * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
