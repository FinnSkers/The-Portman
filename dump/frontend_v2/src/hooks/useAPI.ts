// filepath: c:\Users\SAM\Desktop\THE PORTMAN\frontend\src\hooks/useAPI.ts
"use client";

import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  cvAPI, 
  analyticsAPI, 
  analysisAPI, 
  portfolioAPI, 
  atsAPI,
  APIError 
} from '@/lib/api';
import { 
  useCV, 
  useAnalytics, 
  useProfessionalAnalysis, 
  usePortfolio, 
  useATS,
  CVData 
} from '@/lib/store';

// Generic hook for API calls with loading and error states
export function useAPICall<T, P extends any[] = []>(
  apiFunction: (...params: P) => Promise<T>,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: APIError) => void;
    showSuccessToast?: boolean;
    showErrorToast?: boolean;
    successMessage?: string;
  } = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<APIError | null>(null);

  const execute = useCallback(async (...params: P): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await apiFunction(...params);
      setData(result);
      
      if (options.onSuccess) {
        options.onSuccess(result);
      }
      
      if (options.showSuccessToast) {
        toast.success(options.successMessage || 'Operation completed successfully');
      }
      
      return result;
    } catch (err) {
      const apiError = err instanceof APIError ? err : new APIError('Unknown error', 0);
      setError(apiError);
      
      if (options.onError) {
        options.onError(apiError);
      }
      
      if (options.showErrorToast !== false) {
        toast.error(`Error: ${apiError.message}`);
      }
      
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, options]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
}

// CV-specific hooks
export function useCVUpload() {
  const { setCVData, setProcessingCV, setCVError } = useCV();
  
  return useAPICall(cvAPI.uploadCV, {
    onSuccess: (data) => {
      setCVData(data);
      setCVError(null);
    },
    onError: (error) => {
      setCVError(error.message);
    },
    showSuccessToast: true,
    successMessage: 'CV uploaded and parsed successfully!',
  });
}

export function useCVAnalysis() {
  const { cvData } = useCV();
  
  return useAPICall(cvAPI.analyzeCV, {
    showSuccessToast: true,
    successMessage: 'CV analysis completed!',
  });
}

// Analytics hooks
export function useAnalyticsData() {
  const { setAnalyticsData } = useAnalytics();
  
  const performanceCall = useAPICall(analyticsAPI.getPerformance);
  
  const fetchAllAnalytics = useCallback(async () => {
    try {
      const [performance] = await Promise.all([
        performanceCall.execute(),
      ]);
      
      if (performance) {
        setAnalyticsData({
          performance,
        });
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  }, [performanceCall, setAnalyticsData]);

  return {
    fetchAllAnalytics,
    loading: performanceCall.loading,
    error: performanceCall.error,
  };
}

// Professional Analysis hooks
export function useProfessionalAnalysisData() {
  const { setProfessionalAnalysis } = useProfessionalAnalysis();
  const { cvData } = useCV();
  
  return useAPICall(analysisAPI.getProfessionalAnalysis, {
    onSuccess: (data) => {
      setProfessionalAnalysis(data);
    },
    showSuccessToast: true,
    successMessage: 'Professional analysis completed!',
  });
}

export function useSkillRecommendations() {
  return useAPICall(analysisAPI.getSkillRecommendations, {
    showSuccessToast: true,
    successMessage: 'Skill recommendations generated!',
  });
}

export function useCareerProgression() {
  return useAPICall(analysisAPI.getCareerProgression, {
    showSuccessToast: true,
    successMessage: 'Career progression analysis completed!',
  });
}

// Portfolio hooks
export function usePortfolioTemplates() {
  const [templates, setTemplates] = useState<any[]>([]);
  
  const { data, loading, error, execute } = useAPICall(portfolioAPI.getTemplates, {
    onSuccess: (data) => {
      setTemplates(data);
    },
  });
  
  useEffect(() => {
    execute();
  }, [execute]);
  
  return { templates, loading, error, refetch: execute };
}

export function usePortfolioGeneration() {
  const { cvData } = useCV();
  const { selectedTemplate, portfolioConfig } = usePortfolio();
  
  return useAPICall(portfolioAPI.generatePortfolio, {
    showSuccessToast: true,
    successMessage: 'Portfolio generated successfully!',
  });
}

export function usePortfolioPreview() {
  return useAPICall(portfolioAPI.previewPortfolio);
}

// ATS hooks
export function useATSAnalysis() {
  const { setATSAnalysis } = useATS();
  const { cvData } = useCV();
  
  return useAPICall(atsAPI.analyzeATS, {
    onSuccess: (data) => {
      setATSAnalysis(data);
    },
    showSuccessToast: true,
    successMessage: 'ATS analysis completed!',
  });
}

export function useATSOptimization() {
  const { setATSOptimizedResume } = useATS();
  
  return useAPICall(atsAPI.optimizeResume, {
    onSuccess: (data) => {
      setATSOptimizedResume(data);
    },
    showSuccessToast: true,
    successMessage: 'Resume optimized for ATS!',
  });
}

export function useATSTemplates() {
  const [templates, setTemplates] = useState<any[]>([]);
  
  const { data, loading, error, execute } = useAPICall(atsAPI.getATSTemplates, {
    onSuccess: (data) => {
      setTemplates(data);
    },
  });
  
  useEffect(() => {
    execute();
  }, [execute]);
  
  return { templates, loading, error, refetch: execute };
}

// File upload hook with progress
export function useFileUpload() {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const upload = useCallback(async (file: File) => {
    setUploading(true);
    setError(null);
    setProgress(0);
    
    try {
      const result = await cvAPI.uploadCV(file);
      setProgress(100);
      return result;
    } catch (err) {
      const errorMessage = err instanceof APIError ? err.message : 'Upload failed';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);
  
  const reset = useCallback(() => {
    setProgress(0);
    setUploading(false);
    setError(null);
  }, []);
  
  return { upload, progress, uploading, error, reset };
}

// Event tracking hook
export function useEventTracking() {
  const trackEvent = useCallback(async (event: string, properties: Record<string, any> = {}) => {
    try {
      await analyticsAPI.trackEvent(event, properties);
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  }, []);
  
  return { trackEvent };
}
