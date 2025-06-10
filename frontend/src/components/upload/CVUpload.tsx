"use client"

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { uploadCV, parseCV } from '@/lib/api'

interface ParsedData {
  name?: string
  email?: string
  phone?: string
  address?: string
  summary?: string
  experience?: Array<{
    company?: string
    position?: string
    duration?: string
    description?: string
  }>
  education?: Array<{
    institution?: string
    degree?: string
    year?: string
  }>
  skills?: string[]
  languages?: string[]
  certifications?: string[]
  links?: string[]
}

interface CVUploadProps {
  onUploadComplete?: (data: ParsedData) => void
  onError?: (error: string) => void
  className?: string
}

export default function CVUpload({ onUploadComplete, onError, className = '' }: CVUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isParsing, setIsParsing] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)
    setError('')
    setUploadComplete(false)
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setError('')

    try {
      // Upload file
      const uploadRes = await uploadCV(file)
      const filename = uploadRes.filename
      if (!filename) throw new Error('No filename returned from upload')
      
      setUploadComplete(true)
      setIsUploading(false)
      setIsParsing(true)

      // Parse CV
      const parseRes = await parseCV(filename)
      if (parseRes.error) {
        throw new Error(parseRes.error)
      }

      setIsParsing(false)
      onUploadComplete?.(parseRes.parsed_data)
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Upload or parsing failed. Please try again.'
      setError(errorMessage)
      setIsUploading(false)
      setIsParsing(false)
      setUploadComplete(false)
      onError?.(errorMessage)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const resetUpload = () => {
    setFile(null)
    setUploadComplete(false)
    setError('')
    setIsUploading(false)
    setIsParsing(false)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {!file && (
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
            dragActive 
              ? 'border-blue-400 bg-blue-500/10' 
              : 'border-white/30 hover:border-white/50 hover:bg-white/5'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDrag}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onClick={() => inputRef.current?.click()}
        >
          <input
            type="file"
            ref={inputRef}
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            accept=".pdf,.doc,.docx,.txt"
            className="hidden"
          />
          <FileText className="h-12 w-12 text-white/50 mx-auto mb-4" />
          <p className="text-white text-lg mb-2">
            {dragActive ? 'Drop your CV here' : 'Drag & drop your CV here'}
          </p>
          <p className="text-white/60 text-sm mb-4">
            or click to browse files
          </p>
          <p className="text-white/40 text-xs">
            Supports PDF, DOC, DOCX, TXT files
          </p>
        </div>
      )}

      {file && (
        <div className="space-y-4">
          <div className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-white font-medium">{file.name}</p>
                <p className="text-white/60 text-sm">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {uploadComplete && !isParsing && !error && (
                <CheckCircle className="h-6 w-6 text-green-400" />
              )}
              {(isUploading || isParsing) && (
                <Loader2 className="h-6 w-6 text-blue-400 animate-spin" />
              )}
              {error && (
                <AlertCircle className="h-6 w-6 text-red-400" />
              )}
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={handleUpload}
              disabled={isUploading || isParsing}
              className="flex-1"
              variant="cyber"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : isParsing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Parsing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Analyze CV
                </>
              )}
            </Button>
            <Button
              onClick={resetUpload}
              variant="outline"
              disabled={isUploading || isParsing}
            >
              Reset
            </Button>
          </div>
        </div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-sm"
        >
          {error}
        </motion.div>
      )}

      {/* Status indicators */}
      <div className="space-y-2">
        <div className={`flex items-center space-x-3 ${file ? 'text-green-400' : 'text-white/40'}`}>
          <div className={`w-2 h-2 rounded-full ${file ? 'bg-green-400' : 'bg-white/20'}`} />
          <span className="text-xs">File Selected</span>
        </div>
        <div className={`flex items-center space-x-3 ${uploadComplete ? 'text-green-400' : isUploading ? 'text-blue-400' : 'text-white/40'}`}>
          <div className={`w-2 h-2 rounded-full ${uploadComplete ? 'bg-green-400' : isUploading ? 'bg-blue-400 animate-pulse' : 'bg-white/20'}`} />
          <span className="text-xs">File Uploaded</span>
        </div>
        <div className={`flex items-center space-x-3 ${uploadComplete && !isParsing && !error ? 'text-green-400' : isParsing ? 'text-blue-400' : 'text-white/40'}`}>
          <div className={`w-2 h-2 rounded-full ${uploadComplete && !isParsing && !error ? 'bg-green-400' : isParsing ? 'bg-blue-400 animate-pulse' : 'bg-white/20'}`} />
          <span className="text-xs">CV Parsed & Analyzed</span>
        </div>
      </div>
    </div>
  )
}