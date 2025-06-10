"use client"

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, Download, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { uploadCV, parseCV, updateProfileFromCV } from '@/lib/api'

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

export default function UploadPage() {  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isParsing, setIsParsing] = useState(false)
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [parsedData, setParsedData] = useState<ParsedData | null>(null)
  const [profileUpdated, setProfileUpdated] = useState(false)
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile)    setError('')
    setUploadComplete(false)
    setParsedData(null)
    setProfileUpdated(false)
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
      setIsParsing(true)      // Parse CV
      const parseRes = await parseCV(filename)
      if (parseRes.error) {
        throw new Error(parseRes.error)
      }

      setParsedData(parseRes.parsed_data)
      setIsParsing(false)
      setIsUpdatingProfile(true)

      // Update user profile with parsed CV data
      try {
        await updateProfileFromCV(parseRes.parsed_data)
        setProfileUpdated(true)
      } catch (profileError) {
        console.warn('Profile update failed:', profileError)
        // Don't throw error for profile update failure - parsing was successful
      }
      
      setIsUpdatingProfile(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload or parsing failed. Please try again.')
      setIsUploading(false)
      setIsParsing(false)
      setUploadComplete(false)
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
    setParsedData(null)
    setProfileUpdated(false)
    setError('')
    setIsUploading(false)
    setIsParsing(false)
    setIsUpdatingProfile(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4 text-white/80 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">CV Upload & Analysis</h1>
          <p className="text-white/70">Upload your CV to get intelligent insights and analysis</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
            >
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Upload className="h-5 w-5 mr-2" />
                Upload Your CV
              </h2>

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
                      {isParsing && (
                        <Loader2 className="h-6 w-6 text-blue-400 animate-spin" />
                      )}
                      {error && (
                        <AlertCircle className="h-6 w-6 text-red-400" />
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-3">                    <Button
                      onClick={handleUpload}
                      disabled={isUploading || isParsing || isUpdatingProfile}
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
                      ) : isUpdatingProfile ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Updating Profile...
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
                      disabled={isUploading || isParsing || isUpdatingProfile}
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
                  className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400 text-sm mt-4"
                >
                  {error}
                </motion.div>
              )}
            </motion.div>

            {/* Status Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Process Status</h3>
              <div className="space-y-3">
                <div className={`flex items-center space-x-3 ${file ? 'text-green-400' : 'text-white/40'}`}>
                  <div className={`w-2 h-2 rounded-full ${file ? 'bg-green-400' : 'bg-white/20'}`} />
                  <span className="text-sm">File Selected</span>
                </div>
                <div className={`flex items-center space-x-3 ${uploadComplete ? 'text-green-400' : isUploading ? 'text-blue-400' : 'text-white/40'}`}>
                  <div className={`w-2 h-2 rounded-full ${uploadComplete ? 'bg-green-400' : isUploading ? 'bg-blue-400 animate-pulse' : 'bg-white/20'}`} />
                  <span className="text-sm">File Uploaded</span>
                </div>                <div className={`flex items-center space-x-3 ${parsedData ? 'text-green-400' : isParsing ? 'text-blue-400' : 'text-white/40'}`}>
                  <div className={`w-2 h-2 rounded-full ${parsedData ? 'bg-green-400' : isParsing ? 'bg-blue-400 animate-pulse' : 'bg-white/20'}`} />
                  <span className="text-sm">CV Parsed & Analyzed</span>
                </div>
                <div className={`flex items-center space-x-3 ${profileUpdated ? 'text-green-400' : isUpdatingProfile ? 'text-blue-400' : 'text-white/40'}`}>
                  <div className={`w-2 h-2 rounded-full ${profileUpdated ? 'bg-green-400' : isUpdatingProfile ? 'bg-blue-400 animate-pulse' : 'bg-white/20'}`} />
                  <span className="text-sm">Profile Updated</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            <AnimatePresence>
              {parsedData && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
                >                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                      Parsed CV Data
                    </h2>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const dataStr = JSON.stringify(parsedData, null, 2)
                        const blob = new Blob([dataStr], { type: 'application/json' })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = 'parsed_cv_data.json'
                        a.click()
                        URL.revokeObjectURL(url)
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>

                  {/* Profile Update Success Message */}
                  {profileUpdated && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-green-500/20 border border-green-500/40 rounded-lg p-3 mb-4"
                    >
                      <div className="flex items-center text-green-400">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">Profile updated successfully with CV data!</span>
                      </div>
                    </motion.div>
                  )}

                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {/* Personal Information */}
                    {(parsedData.name || parsedData.email || parsedData.phone) && (
                      <div className="bg-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-2">Personal Information</h3>
                        <div className="space-y-1 text-sm">
                          {parsedData.name && <p className="text-white/80"><span className="text-blue-400">Name:</span> {parsedData.name}</p>}
                          {parsedData.email && <p className="text-white/80"><span className="text-blue-400">Email:</span> {parsedData.email}</p>}
                          {parsedData.phone && <p className="text-white/80"><span className="text-blue-400">Phone:</span> {parsedData.phone}</p>}
                          {parsedData.address && <p className="text-white/80"><span className="text-blue-400">Address:</span> {parsedData.address}</p>}
                        </div>
                      </div>
                    )}

                    {/* Summary */}
                    {parsedData.summary && (
                      <div className="bg-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-2">Professional Summary</h3>
                        <p className="text-white/80 text-sm">{parsedData.summary}</p>
                      </div>
                    )}

                    {/* Experience */}
                    {parsedData.experience && parsedData.experience.length > 0 && (
                      <div className="bg-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-2">Work Experience</h3>
                        <div className="space-y-3">
                          {parsedData.experience.map((exp, index) => (
                            <div key={index} className="border-l-2 border-blue-400/30 pl-3">
                              <div className="text-white/90 font-medium text-sm">{exp.position}</div>
                              <div className="text-blue-400 text-sm">{exp.company}</div>
                              {exp.duration && <div className="text-white/60 text-xs">{exp.duration}</div>}
                              {exp.description && <div className="text-white/70 text-xs mt-1">{exp.description}</div>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    {parsedData.education && parsedData.education.length > 0 && (
                      <div className="bg-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-2">Education</h3>
                        <div className="space-y-2">
                          {parsedData.education.map((edu, index) => (
                            <div key={index} className="text-sm">
                              <div className="text-white/90 font-medium">{edu.degree}</div>
                              <div className="text-blue-400">{edu.institution}</div>
                              {edu.year && <div className="text-white/60 text-xs">{edu.year}</div>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skills */}
                    {parsedData.skills && parsedData.skills.length > 0 && (
                      <div className="bg-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-2">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {parsedData.skills.map((skill, index) => (
                            <span key={index} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Languages */}
                    {parsedData.languages && parsedData.languages.length > 0 && (
                      <div className="bg-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-2">Languages</h3>
                        <div className="flex flex-wrap gap-2">
                          {parsedData.languages.map((lang, index) => (
                            <span key={index} className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Certifications */}
                    {parsedData.certifications && parsedData.certifications.length > 0 && (
                      <div className="bg-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-2">Certifications</h3>
                        <div className="space-y-1">
                          {parsedData.certifications.map((cert, index) => (
                            <div key={index} className="text-white/80 text-sm">• {cert}</div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Links */}
                    {parsedData.links && parsedData.links.length > 0 && (
                      <div className="bg-white/5 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-white mb-2">Links</h3>
                        <div className="space-y-1">
                          {parsedData.links.map((link, index) => (
                            <a key={index} href={link} target="_blank" rel="noopener noreferrer" 
                               className="text-blue-400 hover:text-blue-300 text-sm block truncate">
                              {link}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!parsedData && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6"
              >
                <h2 className="text-xl font-semibold text-white mb-4">CV Analysis Results</h2>
                <div className="text-center py-8 text-white/60">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Upload and analyze your CV to see parsed data here</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}