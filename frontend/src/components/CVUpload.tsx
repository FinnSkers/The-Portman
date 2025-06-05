"use client";
import React, { useRef, useState } from "react";
import { useCVStore } from "@/store/useCVStore";
import { uploadCV, parseCV } from "@/utils/api";
import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";
import Lottie from "lottie-react";
import uploadAnim from "../../public/portfolio-lottie.json";
import successAnim from "../../public/success-lottie.json";
import { FaFileAlt, FaChartBar, FaRedo } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function CVUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const { file, setFile, setData, setFilename, setStatus, setError, status, error } = useCVStore();
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [retryParse, setRetryParse] = useState(false);
  const router = useRouter();

  // Handle drag events on the card
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
      await handleFile(droppedFile);
    }
  };

  // After successful upload and parse, always set showSuccess and scroll to the action buttons
  const handleFile = async (file: File) => {
    setFile(file);
    setError(null);
    setStatus('uploading');
    setLoading(true);
    setShowSuccess(false);
    abortRef.current = new AbortController();
    try {
      const uploadRes = await uploadCV(file, abortRef.current?.signal);
      setFilename(uploadRes.filename);
      setStatus('uploaded');
      setStatus('parsing');
      const parseRes = await parseCV(uploadRes.filename, abortRef.current?.signal);
      console.log('CV PARSE RESPONSE:', parseRes); // DEBUG: log backend response
      setData(parseRes);
      setStatus('parsed');
      setTimeout(() => {
        setShowSuccess(true);
        // Scroll to action buttons for better UX
        setTimeout(() => {
          const el = document.getElementById('cv-action-buttons');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 200);
      }, 400);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Upload cancelled');
      } else {
        setError(err instanceof Error ? err.message : "Upload failed");
      }
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    abortRef.current?.abort();
    setStatus('idle');
    setLoading(false);
    setError('Upload cancelled');
  };

  const handleReplace = () => {
    setFile(null);
    setFilename(null);
    setData(null);
    setStatus('idle');
    setError(null);
    inputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await handleFile(file);
  };

  const handleRetryParse = async () => {
    if (!file) return;
    setRetryParse(true);
    setStatus('parsing');
    try {
      const parseRes = await parseCV(file.name, abortRef.current?.signal);
      setData(parseRes);
      setStatus('parsed');
      setShowSuccess(true);
    } catch (err: any) {
      setError(err instanceof Error ? err.message : "Parsing failed");
      setStatus('error');
    } finally {
      setRetryParse(false);
    }
  };

  const { data } = useCVStore();

  return (
    <GlassCard
      className={`w-full max-w-md mx-auto flex flex-col items-center transition-all duration-300 relative ${
        dragActive 
          ? 'ring-4 ring-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/80 scale-105 shadow-2xl' 
          : 'hover:shadow-xl'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      tabIndex={0}
      aria-label="Upload your CV by clicking the button or dragging a file here. Accepted formats: PDF, DOCX, TXT. Max size: 5MB."
      aria-describedby="cv-upload-guidance"
    >
      {dragActive && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-indigo-400/30 to-purple-400/30 rounded-xl pointer-events-none border-4 border-dashed border-indigo-400 flex flex-col items-center justify-center z-20"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-4xl" role="img" aria-label="Upload icon">📤</span>
            <span className="font-bold text-indigo-700 dark:text-indigo-300 text-lg">Drop your CV here!</span>
            <span className="text-xs text-gray-600 dark:text-gray-300">Accepted: PDF, DOCX, TXT (max 5MB)</span>
          </div>
        </motion.div>
      )}
      <motion.div
        className="w-full flex flex-col items-center relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span id="cv-upload-guidance" className="text-sm font-medium mb-2 text-center flex flex-col items-center">
          <span className="flex gap-2 mb-2">
            <span className="inline-block text-2xl" role="img" aria-label="PDF">📄</span>
            <span className="inline-block text-2xl" role="img" aria-label="DOCX">📝</span>
            <span className="inline-block text-2xl" role="img" aria-label="TXT">📑</span>
          </span>
          Upload your CV (PDF, DOCX, TXT)
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Max file size: 5MB</span>
        </span>
        {(status === 'idle' || status === 'error') && (
          <motion.div className="w-full">
            <motion.button
              type="button"
              className="mb-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-300/50 w-full relative overflow-hidden group ripple neural-pulse"
              aria-label="Upload CV"
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 20px 25px -5px rgba(79, 70, 229, 0.3), 0 10px 10px -5px rgba(139, 92, 246, 0.2)"
              }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                background: status === 'error' 
                  ? ["linear-gradient(45deg, #dc2626, #ef4444)", "linear-gradient(45deg, #6366f1, #8b5cf6)", "linear-gradient(45deg, #dc2626, #ef4444)"]
                  : "linear-gradient(45deg, #6366f1, #8b5cf6)"
              }}
              transition={{ 
                duration: 0.5, 
                ease: "easeOut",
                background: { duration: 2, repeat: status === 'error' ? 2 : 0 }
              }}
              onClick={() => inputRef.current?.click()}
            >
              <motion.span
                className="absolute inset-0 bg-white/10 group-hover:opacity-20 transition-opacity duration-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
              <span className="relative z-10 flex items-center gap-3">
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  className="inline-block text-2xl"
                  role="img" aria-label="Upload icon"
                >📤</motion.span>
                Upload your CV
              </span>
            </motion.button>
          </motion.div>
        )}
        <input
          id="cv-upload"
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          className="hidden"
          onChange={handleFileChange}
          aria-label="Select a CV file to upload (PDF, DOCX, TXT, max 5MB)"
        />
        <span className="text-sm text-gray-500 dark:text-gray-400 mb-2">or drag & drop your file here</span>
        {file && (
          <motion.div
            className="mt-3 w-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            aria-live="polite"
          >
            <div className="flex items-center gap-3">
              <motion.span
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  repeatDelay: 3
                }}
                className="text-2xl"
                role="img" aria-label="File icon"
              >📄</motion.span>
              <div className="flex-1 min-w-0">
                <motion.p 
                  className="text-green-700 dark:text-green-300 font-medium truncate"
                  initial={{ x: -10 }}
                  animate={{ x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {file.name}
                </motion.p>
                <motion.p 
                  className="text-green-600 dark:text-green-400 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </motion.p>
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-green-500"
                role="img" aria-label="Success"
              >
                ✅
              </motion.div>
            </div>
          </motion.div>
        )}{(status === 'uploading' || status === 'parsing') && (
          <motion.div
            className="w-full flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <motion.div 
              className="w-32 h-32 mt-4 flex items-center justify-center"
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: status === 'parsing' ? [0, 360] : 0
              }}
              transition={{ 
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 3, repeat: Infinity, ease: "linear" }
              }}
            >
              <Lottie animationData={uploadAnim} loop={true} style={{ width: '100%', height: '100%' }} />
            </motion.div>
            
            <div className="w-full mt-4 flex flex-col items-center">
              <motion.div
                className="w-3/4 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-3 shadow-inner"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div
                  className={`h-3 rounded-full relative ${status === 'uploading' 
                    ? 'bg-gradient-to-r from-indigo-400 to-purple-500' 
                    : 'bg-gradient-to-r from-green-400 to-emerald-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: status === 'uploading' ? '65%' : '100%' }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                >
                  <motion.div
                    className="absolute inset-0 bg-white/30 rounded-full"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ 
                      duration: 1.5, 
                      repeat: Infinity, 
                      ease: 'easeInOut' 
                    }}
                  />
                </motion.div>
              </motion.div>
              
              <motion.div
                className="flex items-center gap-2 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <motion.div
                  className={`w-2 h-2 rounded-full ${status === 'uploading' 
                    ? 'bg-indigo-500' 
                    : 'bg-green-500'
                  }`}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                <span className={`text-base font-semibold ${status === 'uploading' 
                  ? 'text-indigo-600 dark:text-indigo-400' 
                  : 'text-green-600 dark:text-green-400'
                }`} aria-live="polite" aria-busy="true">
                  {status === 'uploading' ? 'Uploading your CV...' : 'AI is analyzing your CV...'}
                </span>
                <motion.div
                  className={`w-2 h-2 rounded-full ${status === 'uploading' 
                    ? 'bg-indigo-500' 
                    : 'bg-green-500'
                  }`}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                />
              </motion.div>
            </div>
            
            <motion.button
              type="button"
              className="mt-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-4 focus:ring-red-300"
              onClick={handleCancel}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Cancel Upload
            </motion.button>
          </motion.div>
        )}        {status === 'parsed' && showSuccess && (
          <motion.div
            className="flex flex-col items-center gap-4 mt-4 w-full"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {/* Success animation and shrinking circle */}
            <motion.div 
              className="relative flex items-center justify-center"
              initial={{ scale: 1 }}
              animate={{ scale: 0.8 }}
              transition={{ delay: 0.2, duration: 0.5, type: 'spring', stiffness: 200 }}
              style={{ width: '8rem', height: '8rem' }}
            >
              <Lottie animationData={successAnim} loop={false} style={{ width: '100%', height: '100%' }} />
              {/* Reupload button inside the circle, bottom center, now full width below the circle */}
            </motion.div>
            <motion.button
              type="button"
              className="w-full px-5 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 text-base font-semibold focus:outline-none focus:ring-4 focus:ring-gray-300/50 flex items-center gap-2 justify-center mb-4 mt-2"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5, type: 'spring' }}
              onClick={handleReplace}
              whileHover={{ scale: 1.10, boxShadow: "0 8px 32px 0 rgba(99,102,241,0.18)" }}
              whileTap={{ scale: 0.97 }}
              aria-label="Upload New CV"
            >
              <FaRedo className="text-lg" />
              <span>Upload New CV</span>
            </motion.button>
            <motion.div
              id="cv-action-buttons"
              className="flex flex-row gap-4 w-full mt-2 justify-center"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.5, type: 'spring' }}
            >
              <motion.button
                type="button"
                className="flex-1 flex items-center gap-2 px-0 py-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:shadow-xl border border-blue-400/30 hover:border-blue-500/60 transition-all duration-300 text-lg font-semibold justify-center relative overflow-hidden group h-14 min-w-[140px]"
                onClick={() => router.push('/analysis')}
                whileHover={{ scale: 1.06, boxShadow: "0 8px 32px 0 rgba(59,130,246,0.18)" }}
                whileTap={{ scale: 0.97 }}
                aria-label="More Analysis"
              >
                <FaChartBar className="text-xl relative z-10" />
                <span className="relative z-10">More Analysis</span>
              </motion.button>
              <motion.button
                type="button"
                className="flex-1 flex items-center gap-2 px-0 py-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg shadow-md hover:shadow-xl border border-green-400/30 hover:border-green-500/60 transition-all duration-300 text-lg font-semibold justify-center relative overflow-hidden group h-14 min-w-[140px]"
                onClick={() => router.push('/portfolio')}
                whileHover={{ scale: 1.06, boxShadow: "0 8px 32px 0 rgba(16,185,129,0.18)" }}
                whileTap={{ scale: 0.97 }}
                aria-label="Make Portfolio"
              >
                <FaFileAlt className="text-xl relative z-10" />
                <span className="relative z-10">Make Portfolio</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}{error && (
          <motion.div 
            className="mt-4 w-full flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <motion.div
              className="w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-3"
              initial={{ x: -10 }}
              animate={{ x: [0, 3, -3, 0] }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              <div className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 0.6, repeat: 2 }}
                  className="text-xl"
                >
                  ❌
                </motion.span>
                <span className="text-red-700 dark:text-red-300 font-medium">
                  {error}
                </span>
              </div>
            </motion.div>
            {status === 'error' && file && (
              <motion.button
                type="button"
                className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 font-semibold hover:from-yellow-600 hover:to-orange-600"
                onClick={handleRetryParse}
                disabled={retryParse}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.span
                  animate={{ 
                    rotate: retryParse ? [0, 360] : 0 
                  }}
                  transition={{ 
                    duration: 1, 
                    repeat: retryParse ? Infinity : 0,
                    ease: "linear"
                  }}
                  className="inline-block mr-2"
                >
                  🔄
                </motion.span>
                {retryParse ? 'Retrying...' : 'Retry Parsing'}
              </motion.button>
            )}
          </motion.div>
        )}
      </motion.div>
    </GlassCard>
  );
}
