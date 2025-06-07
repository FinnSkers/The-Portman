"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  X, 
  AlertCircle,
  Loader2,
  Bot,
  Sparkles,
  User,
  Briefcase,
  GraduationCap,
  Code
} from "lucide-react";
import { useCVUpload, useEventTracking } from "@/hooks/useAPI";
import { useCV } from "@/lib/store";
import { useRouter } from "next/navigation";

type UploadStage = "upload" | "processing" | "complete" | "error";

interface UploadedFile {
  file: File;
  preview?: string;
}

export function CVUpload() {
  const [stage, setStage] = useState<UploadStage>("upload");
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [progress, setProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState("");
  
  const { cvData, isProcessingCV, cvError } = useCV();
  const { execute: uploadCV, loading: uploading, error: uploadError } = useCVUpload();
  const { trackEvent } = useEventTracking();
  const router = useRouter();

  const onDrop = useCallback(async (acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      toast.error("Please upload a valid CV file (PDF, DOCX, or TXT)");
      return;
    }

    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile({ file });
      setStage("processing");
      
      // Track upload event
      trackEvent('cv_upload_started', {
        file_size: file.size,
        file_type: file.type,
        file_name: file.name
      });
      
      try {
        await processCV(file);
      } catch (error) {
        setStage("error");
        console.error('CV processing failed:', error);
      }
    }
  }, [trackEvent]);

  const processCV = async (file: File) => {
    const steps = [
      { text: "Uploading CV file...", duration: 1000 },
      { text: "Extracting text and structure...", duration: 1500 },
      { text: "Analyzing skills and experience...", duration: 2000 },
      { text: "Running AI comparison analysis...", duration: 2500 },
      { text: "Generating insights and recommendations...", duration: 1800 },
      { text: "Finalizing your profile...", duration: 1200 }
    ];

    let currentProgress = 0;
    
    // Start the actual API call
    const uploadPromise = uploadCV(file);
    
    // Simulate progress for better UX
    for (const [index, step] of steps.entries()) {
      setProcessingStep(step.text);
      
      const startProgress = currentProgress;
      const endProgress = ((index + 1) / steps.length) * 100;
      const progressIncrement = (endProgress - startProgress) / (step.duration / 100);
      
      for (let i = 0; i < step.duration / 100; i++) {
        await new Promise(resolve => setTimeout(resolve, 100));
        currentProgress = Math.min(endProgress, startProgress + (progressIncrement * (i + 1)));
        setProgress(currentProgress);
      }
    }
    
    // Wait for API call to complete
    const result = await uploadPromise;
    
    if (result) {
      setStage("complete");
      setProgress(100);
      
      // Track successful upload
      trackEvent('cv_upload_completed', {
        file_size: file.size,
        file_type: file.type,
        processing_time: Date.now() // You could track actual time
      });
      
      toast.success("CV processed successfully! 🎉");
    } else {
      setStage("error");
      
      // Track failed upload
      trackEvent('cv_upload_failed', {
        file_size: file.size,
        file_type: file.type,
        error: uploadError?.message || 'Unknown error'
      });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const resetUpload = () => {
    setStage("upload");
    setUploadedFile(null);
    setProgress(0);
    setProcessingStep("");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const navigateToPage = (page: string) => {
    trackEvent('navigation_from_upload', { destination: page });
    router.push(page);
  };

  return (
    <Card className="max-w-2xl mx-auto border-0 shadow-xl">
      <CardContent className="p-8">
        <AnimatePresence mode="wait">
          {/* Upload Stage */}
          {stage === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div
                {...getRootProps()}
                className={`
                  border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-300
                  ${isDragActive 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                    : 'border-muted-foreground/25 hover:border-blue-400 hover:bg-muted/50'
                  }
                `}
              >
                <input {...getInputProps()} />
                
                <div className="space-y-6">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">
                      {isDragActive ? "Drop your CV here" : "Upload your CV"}
                    </h3>
                    <p className="text-muted-foreground">
                      Drag & drop your CV file here, or click to browse
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge variant="secondary">PDF</Badge>
                    <Badge variant="secondary">DOCX</Badge>
                    <Badge variant="secondary">TXT</Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    Maximum file size: 10MB
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Processing Stage */}
          {stage === "processing" && uploadedFile && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                  <Bot className="w-8 h-8 text-white animate-pulse" />
                </div>
                <h3 className="text-xl font-semibold">Processing your CV</h3>
                <p className="text-muted-foreground">
                  Our AI is analyzing your experience and skills...
                </p>
              </div>

              {/* File Info */}
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <FileText className="w-8 h-8 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium">{uploadedFile.file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(uploadedFile.file.size)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetUpload}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Progress */}
              <div className="space-y-4">
                <Progress value={progress} className="h-2" />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {processingStep}
                </div>
              </div>
            </motion.div>
          )}

          {/* Complete Stage */}
          {stage === "complete" && uploadedFile && cvData && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8 text-center"
            >
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-green-600">
                  CV Processed Successfully!
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Your CV has been analyzed and is ready. You can now generate your portfolio, 
                  create ATS resumes, or view detailed analytics.
                </p>
              </div>

              {/* Results Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <User className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Profile</p>
                  <p className="text-xs text-muted-foreground">
                    {cvData.personal_info.name || 'Extracted'}
                  </p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <Code className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Skills</p>
                  <p className="text-xs text-muted-foreground">
                    {cvData.skills.technical.length + cvData.skills.soft.length} identified
                  </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <Briefcase className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Experience</p>
                  <p className="text-xs text-muted-foreground">
                    {cvData.experience.length} positions
                  </p>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Education</p>
                  <p className="text-xs text-muted-foreground">
                    {cvData.education.length} degrees
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigateToPage('/portfolio')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Portfolio
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigateToPage('/analysis')}
                >
                  View Analysis
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigateToPage('/dashboard')}
                >
                  View Dashboard
                </Button>
              </div>
              
              <Button 
                variant="ghost" 
                onClick={resetUpload}
                className="text-muted-foreground"
              >
                Upload Another CV
              </Button>
            </motion.div>
          )}

          {/* Error Stage */}
          {stage === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6 text-center"
            >
              <div className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/20 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-red-600">Processing Failed</h3>
                <p className="text-muted-foreground">
                  {uploadError?.message || cvError || 'There was an error processing your CV. Please try again.'}
                </p>
              </div>
              <div className="flex gap-4 justify-center">
                <Button onClick={resetUpload} variant="outline">
                  Try Again
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => toast.info('Please contact support if the issue persists')}
                >
                  Get Help
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
