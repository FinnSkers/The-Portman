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
import PortfolioDataModal from "@/components/PortfolioDataModal";

export default function CVUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const { file, setFile, setData, setFilename, setStatus, setError, status, error } = useCVStore();
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);

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
      setData(parseRes);
      setStatus('parsed');
      setTimeout(() => setShowSuccess(true), 400); // show success after short delay
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

  const { data } = useCVStore();

  return (
    <GlassCard
      className={`w-full max-w-md mx-auto flex flex-col items-center transition-all duration-200 ${dragActive ? 'ring-4 ring-indigo-400 bg-indigo-50 dark:bg-indigo-950' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      tabIndex={0}
      aria-label="Upload your CV by clicking the button or dragging a file here"
    >
      <motion.div
        className="w-full flex flex-col items-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-sm font-medium mb-2 text-center flex flex-col items-center">
          <span className="animated-icon mb-2">
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="inline-block text-2xl"
            >📄</motion.span>
          </span>
          Upload your CV (PDF, DOCX, TXT)
        </span>
        {(status === 'idle' || status === 'error') && (
          <label htmlFor="cv-upload" className="w-full">
            <button
              type="button"
              className="mb-2 px-6 py-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-300 w-full"
              aria-label="Upload CV"
            >
              Upload CV
            </button>
          </label>
        )}
        <input
          id="cv-upload"
          ref={inputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          className="hidden"
          onChange={handleFileChange}
        />
        <span className="text-sm text-gray-500 dark:text-gray-400 mb-2">or drag & drop your file here</span>
        {file && <span className="mt-2 text-green-600">{file.name}</span>}
        {(status === 'uploading' || status === 'parsing') && (
          <>
            <div className="w-32 h-32 mt-4 flex items-center justify-center">
              <Lottie animationData={uploadAnim} loop={true} style={{ width: '100%', height: '100%' }} />
            </div>
            <div className="w-full mt-4 flex flex-col items-center">
              <motion.div
                className="w-3/4 h-2 bg-gray-200 rounded-full overflow-hidden mb-2"
                initial={{ width: 0 }}
                animate={{ width: '75%' }}
                transition={{ duration: 0.7, ease: 'easeInOut' }}
              >
                <motion.div
                  className={`h-2 rounded-full ${status === 'uploading' ? 'bg-indigo-400' : 'bg-green-400'}`}
                  initial={{ width: 0 }}
                  animate={{ width: status === 'uploading' ? '60%' : '100%' }}
                  transition={{ duration: 0.7, ease: 'easeInOut' }}
                />
              </motion.div>
              <span className="mt-1 text-blue-600 animate-pulse loader text-base font-semibold" aria-live="polite" aria-busy="true">
                {status === 'uploading' ? 'Uploading your CV...' : 'Analyzing your CV...'}
              </span>
            </div>
            <button
              type="button"
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded shadow hover:bg-red-600 transition"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </>
        )}
        {status === 'parsed' && showSuccess && (
          <motion.div
            className="flex flex-col items-center gap-4 mt-4 w-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div className="w-32 h-32 flex items-center justify-center">
              <Lottie animationData={successAnim} loop={false} style={{ width: '100%', height: '100%' }} />
            </div>
            <motion.div
              className="w-full bg-white/80 dark:bg-gray-900/80 rounded-xl shadow-lg p-6 flex flex-col gap-4 items-center"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.15 } }
              }}
            >
              <motion.button
                type="button"
                className="w-full flex items-center gap-3 px-5 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition text-lg font-semibold justify-center"
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                onClick={() => setShowDataModal(true)}
              >
                <FaFileAlt className="text-2xl" /> Show Data
              </motion.button>
              <motion.button
                type="button"
                className="w-full flex items-center gap-3 px-5 py-3 bg-purple-500 text-white rounded-lg shadow hover:bg-purple-600 transition text-lg font-semibold justify-center"
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                onClick={() => {/* Analyze Data handler */}}
              >
                <FaChartBar className="text-2xl" /> Analyze Data
              </motion.button>
              <motion.button
                type="button"
                className="w-full flex items-center gap-3 px-5 py-3 bg-gray-400 text-white rounded-lg shadow hover:bg-gray-500 transition text-lg font-semibold justify-center"
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                onClick={handleReplace}
              >
                <FaRedo className="text-2xl" /> Upload New
              </motion.button>
            </motion.div>
          </motion.div>
        )}
        {error && <span className="mt-4 text-red-600">{error}</span>}
      </motion.div>
      <PortfolioDataModal open={showDataModal} onClose={() => setShowDataModal(false)} data={data || {}} />
    </GlassCard>
  );
}
