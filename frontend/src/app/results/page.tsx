"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Download, ArrowLeft, FileText, User, Briefcase, GraduationCap, Award, Globe, Link as LinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

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

export default function ResultsPage() {
  const [parsedData, setParsedData] = useState<ParsedData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get parsed data from sessionStorage
    const stored = sessionStorage.getItem('parsedCV')
    if (stored) {
      try {
        setParsedData(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse stored CV data:', e)
      }
    }
    setLoading(false)
  }, [])

  const downloadData = () => {
    if (!parsedData) return
    
    const dataStr = JSON.stringify(parsedData, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'parsed_cv_data.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!parsedData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <FileText className="h-16 w-16 text-white/50 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-4">No CV Data Found</h1>
            <p className="text-white/70 mb-8">Please upload and analyze a CV first.</p>
            <Link href="/upload">
              <Button variant="cyber">
                Upload CV
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/upload">
            <Button variant="ghost" className="mb-4 text-white/80 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Upload
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                <CheckCircle className="h-8 w-8 mr-3 text-green-400" />
                CV Analysis Complete
              </h1>
              <p className="text-white/70">Your CV has been successfully parsed and analyzed</p>
            </div>
            <Button onClick={downloadData} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            {(parsedData.name || parsedData.email || parsedData.phone || parsedData.address) && (
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Personal Information
                </h2>
                <div className="space-y-3">
                  {parsedData.name && (
                    <div>
                      <p className="text-blue-400 text-sm font-medium">Full Name</p>
                      <p className="text-white">{parsedData.name}</p>
                    </div>
                  )}
                  {parsedData.email && (
                    <div>
                      <p className="text-blue-400 text-sm font-medium">Email</p>
                      <p className="text-white">{parsedData.email}</p>
                    </div>
                  )}
                  {parsedData.phone && (
                    <div>
                      <p className="text-blue-400 text-sm font-medium">Phone</p>
                      <p className="text-white">{parsedData.phone}</p>
                    </div>
                  )}
                  {parsedData.address && (
                    <div>
                      <p className="text-blue-400 text-sm font-medium">Address</p>
                      <p className="text-white">{parsedData.address}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Skills */}
            {parsedData.skills && parsedData.skills.length > 0 && (
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {parsedData.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm border border-blue-500/30"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {parsedData.languages && parsedData.languages.length > 0 && (
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Languages
                </h2>
                <div className="flex flex-wrap gap-2">
                  {parsedData.languages.map((lang, index) => (
                    <span 
                      key={index} 
                      className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm border border-green-500/30"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            {parsedData.links && parsedData.links.length > 0 && (
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <LinkIcon className="h-5 w-5 mr-2" />
                  Links
                </h2>
                <div className="space-y-2">
                  {parsedData.links.map((link, index) => (
                    <a 
                      key={index} 
                      href={link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-400 hover:text-blue-300 text-sm block truncate border-b border-blue-400/30 pb-1"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Summary */}
            {parsedData.summary && (
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Professional Summary</h2>
                <p className="text-white/80 leading-relaxed">{parsedData.summary}</p>
              </div>
            )}

            {/* Work Experience */}
            {parsedData.experience && parsedData.experience.length > 0 && (
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Work Experience
                </h2>
                <div className="space-y-6">
                  {parsedData.experience.map((exp, index) => (
                    <div key={index} className="border-l-3 border-blue-400/50 pl-4 relative">
                      <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-400 rounded-full"></div>
                      <div className="text-white font-semibold text-lg">{exp.position}</div>
                      <div className="text-blue-400 font-medium">{exp.company}</div>
                      {exp.duration && (
                        <div className="text-white/60 text-sm mb-2">{exp.duration}</div>
                      )}
                      {exp.description && (
                        <div className="text-white/80 text-sm mt-2 leading-relaxed">
                          {exp.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {parsedData.education && parsedData.education.length > 0 && (
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Education
                </h2>
                <div className="space-y-4">
                  {parsedData.education.map((edu, index) => (
                    <div key={index} className="border-l-3 border-purple-400/50 pl-4 relative">
                      <div className="absolute -left-2 top-0 w-4 h-4 bg-purple-400 rounded-full"></div>
                      <div className="text-white font-semibold">{edu.degree}</div>
                      <div className="text-purple-400 font-medium">{edu.institution}</div>
                      {edu.year && (
                        <div className="text-white/60 text-sm">{edu.year}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {parsedData.certifications && parsedData.certifications.length > 0 && (
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Certifications
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {parsedData.certifications.map((cert, index) => (
                    <div 
                      key={index} 
                      className="bg-white/5 rounded-lg p-3 border border-white/10 flex items-center"
                    >
                      <Award className="h-4 w-4 text-yellow-400 mr-2 flex-shrink-0" />
                      <span className="text-white/80 text-sm">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/upload">
            <Button variant="outline" className="w-full sm:w-auto">
              Upload Another CV
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="cyber" className="w-full sm:w-auto">
              Go to Dashboard
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
