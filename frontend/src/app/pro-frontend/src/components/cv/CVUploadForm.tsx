"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileUpload, AnimatedButton } from '@/components/ui';
import { useCV } from '@/hooks/useCV';

interface CVUploadFormProps {
  onSuccess?: (cvId: string) => void;
}

export const CVUploadForm: React.FC<CVUploadFormProps> = ({ onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
    const handleFileChange = (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
  };
    const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval);
            return prev;
          }
          return prev + 5;
        });
      }, 200);
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await cvService.uploadCV(formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? 0));
          setUploadProgress(progress);
        }
      });
      
      clearInterval(interval);
      setUploadProgress(100);
      
      // Simulate CV processing
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        if (onSuccess && response.id) {
          onSuccess(response.id);
        }
      }, 3000);
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload CV. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-4">Upload Your CV</h2>
      
      {error && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm"
        >
          {error}
        </motion.div>
      )}
      
      <div className="space-y-4">        <FileUpload
          acceptedFileTypes={['.pdf', '.doc', '.docx', '.txt']}
          label="Drag and drop your CV here, or click to browse"
          helperText="Accepted formats: PDF, DOCX, TXT (Max 10MB)"
          onFileSelect={handleFileChange}
          maxSize={10 * 1024 * 1024} // 10MB
          error={error || undefined}
        />
        
        {(isUploading || uploadProgress > 0) && (
          <div className="mt-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">
                {isProcessing ? 'Processing CV...' : 'Uploading...'}
              </span>
              <span className="text-sm font-medium text-gray-700">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <motion.div 
                className="bg-blue-600 h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                transition={{ duration: 0.3 }}
              ></motion.div>
            </div>
          </div>
        )}
        
        <div className="flex justify-end">
          <AnimatedButton
            onClick={handleUpload}
            disabled={!file || isUploading || isProcessing}
            isLoading={isUploading || isProcessing}
            variant="primary"
            animationVariant="pulse"
          >
            {isProcessing ? 'Processing...' : isUploading ? 'Uploading...' : 'Upload CV'}
          </AnimatedButton>
        </div>
      </div>
      
      <div className="mt-6 text-sm text-gray-600">
        <h3 className="font-medium mb-1">What happens next?</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Our AI will analyze your CV and extract your professional information.</li>
          <li>You'll be able to review and edit the extracted information.</li>
          <li>Then you can choose from our portfolio templates to showcase your experience.</li>
        </ul>
      </div>
    </motion.div>
  );
};
