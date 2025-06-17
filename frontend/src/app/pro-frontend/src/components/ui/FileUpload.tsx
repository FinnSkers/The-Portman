"use client";

import React, { useRef, useState, ChangeEvent } from 'react';
import { cn } from '@/lib/utils/helpers';
import { Button } from './Button';
import { formatFileSize, isValidFileType } from '@/lib/utils/helpers';
import { motion } from 'framer-motion';

export interface FileUploadProps {
  onFileSelect: (file: File) => void;
  acceptedFileTypes?: string[];
  maxSize?: number; // in bytes
  label?: string;
  helperText?: string;
  error?: string;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  acceptedFileTypes = ['.pdf', '.doc', '.docx', '.txt'],
  maxSize = 5 * 1024 * 1024, // 5MB default
  label = 'Upload your CV',
  helperText = 'Drag & drop your file here, or click to browse',
  error,
  className,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!isValidFileType(file)) {
      setFileError(`Invalid file type. Please upload ${acceptedFileTypes.join(', ')}`);
      return false;
    }

    // Check file size
    if (file.size > maxSize) {
      setFileError(`File is too large. Maximum size is ${formatFileSize(maxSize)}`);
      return false;
    }

    setFileError(null);
    return true;
  };

  const handleFile = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={cn('flex flex-col space-y-2', className)}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors',
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : error || fileError
            ? 'border-red-500 bg-red-50'
            : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
        )}
        onClick={handleBrowseClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept={acceptedFileTypes.join(',')}
          className="hidden"
          aria-label="File upload"
        />

        <div className="text-gray-500">
          {/* File icon */}
          <motion.div 
            initial={{ scale: 1 }}
            animate={{ 
              scale: isDragging ? 1.1 : 1,
              y: isDragging ? -10 : 0
            }}
            transition={{ duration: 0.3 }}
            className="mx-auto mb-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </motion.div>
          
          {selectedFile ? (
            <div>
              <p className="font-medium text-gray-700">{selectedFile.name}</p>
              <p className="text-sm text-gray-500 mt-1">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
          ) : (
            <div>
              <p className="font-medium text-gray-700">{helperText}</p>
              <p className="text-xs text-gray-500 mt-2">
                Accepted file types: {acceptedFileTypes.join(', ')}
              </p>
              <p className="text-xs text-gray-500">
                Maximum size: {formatFileSize(maxSize)}
              </p>
            </div>
          )}
        </div>
      </div>

      {(error || fileError) && (
        <p className="text-sm text-red-500" role="alert">
          {error || fileError}
        </p>
      )}

      {selectedFile && (
        <div className="flex justify-end mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedFile(null);
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            }}
          >
            Remove file
          </Button>
        </div>
      )}
    </div>
  );
};
