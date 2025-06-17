import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { cvService, CVData, CVAnalysis, CVUploadResponse, CVProcessingStatus, ParsedCVData } from '@/lib/api/cv';

// Query Keys
export const cvKeys = {
  all: ['cv'] as const,
  lists: () => [...cvKeys.all, 'list'] as const,
  list: (filters: string) => [...cvKeys.lists(), { filters }] as const,
  details: () => [...cvKeys.all, 'detail'] as const,
  detail: (id: string) => [...cvKeys.details(), id] as const,
  analysis: (id: string) => [...cvKeys.all, 'analysis', id] as const,
  status: (id: string) => [...cvKeys.all, 'status', id] as const,
  insights: (id: string) => [...cvKeys.all, 'insights', id] as const,
};

export const useCV = () => {
  const queryClient = useQueryClient();

  // Get all user CVs
  const useUserCVs = (options?: Omit<UseQueryOptions<CVData[]>, 'queryKey' | 'queryFn'>) => {
    return useQuery({
      queryKey: cvKeys.lists(),
      queryFn: cvService.getAllUserCVs,
      staleTime: 5 * 60 * 1000, // 5 minutes
      ...options,
    });
  };

  // Get CV by ID
  const useCVById = (cvId: string, options?: Omit<UseQueryOptions<CVData>, 'queryKey' | 'queryFn'>) => {
    return useQuery({
      queryKey: cvKeys.detail(cvId),
      queryFn: () => cvService.getCV(cvId),
      enabled: !!cvId,
      staleTime: 5 * 60 * 1000,
      ...options,
    });
  };
  // Get CV processing status
  const useCVStatus = (cvId: string, options?: Omit<UseQueryOptions<CVProcessingStatus>, 'queryKey' | 'queryFn'>) => {
    return useQuery({
      queryKey: cvKeys.status(cvId),
      queryFn: () => cvService.getCVStatus(cvId),
      enabled: !!cvId,
      refetchInterval: (query) => {
        // Stop polling when processing is complete
        const data = query.state.data;
        return data?.status === 'pending' || data?.status === 'processing' ? 2000 : false;
      },
      ...options,
    });
  };

  // Get CV analysis
  const useCVAnalysis = (cvId: string, options?: Omit<UseQueryOptions<CVAnalysis>, 'queryKey' | 'queryFn'>) => {
    return useQuery({
      queryKey: cvKeys.analysis(cvId),
      queryFn: () => cvService.getCVAnalysis(cvId),
      enabled: !!cvId,
      staleTime: 10 * 60 * 1000, // 10 minutes
      ...options,
    });
  };
  // Get industry insights
  const useIndustryInsights = (cvId: string, options?: Omit<UseQueryOptions<{
    target_industries: string[];
    skill_recommendations: string[];
    career_paths: string[];
    market_trends: Record<string, unknown>;
  }>, 'queryKey' | 'queryFn'>) => {
    return useQuery({
      queryKey: cvKeys.insights(cvId),
      queryFn: () => cvService.getIndustryInsights(cvId),
      enabled: !!cvId,
      staleTime: 30 * 60 * 1000, // 30 minutes
      ...options,
    });
  };

  // Upload CV mutation
  const useUploadCV = (options?: UseMutationOptions<CVUploadResponse, Error, { file: File; onProgress?: (progress: number) => void }>) => {
    return useMutation({
      mutationFn: ({ file, onProgress }) => cvService.uploadCV(file, onProgress),
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: cvKeys.lists() });
        queryClient.setQueryData(cvKeys.detail(data.cv.id), data.cv);
      },
      ...options,
    });
  };

  // Parse CV mutation
  const useParseCV = (options?: UseMutationOptions<ParsedCVData, Error, string>) => {
    return useMutation({
      mutationFn: cvService.parseCV,
      onSuccess: (data, cvId) => {
        queryClient.invalidateQueries({ queryKey: cvKeys.detail(cvId) });
        queryClient.invalidateQueries({ queryKey: cvKeys.status(cvId) });
      },
      ...options,
    });
  };

  // Analyze CV mutation
  const useAnalyzeCV = (options?: UseMutationOptions<CVAnalysis, Error, string>) => {
    return useMutation({
      mutationFn: cvService.analyzeCV,
      onSuccess: (data, cvId) => {
        queryClient.setQueryData(cvKeys.analysis(cvId), data);
        queryClient.invalidateQueries({ queryKey: cvKeys.detail(cvId) });
      },
      ...options,
    });
  };

  // Update CV data mutation
  const useUpdateCVData = (options?: UseMutationOptions<CVData, Error, { cvId: string; data: Partial<ParsedCVData> }>) => {
    return useMutation({
      mutationFn: ({ cvId, data }) => cvService.updateCVData(cvId, data),
      onSuccess: (data, { cvId }) => {
        queryClient.setQueryData(cvKeys.detail(cvId), data);
        queryClient.invalidateQueries({ queryKey: cvKeys.lists() });
      },
      ...options,
    });
  };

  // Delete CV mutation
  const useDeleteCV = (options?: UseMutationOptions<void, Error, string>) => {
    return useMutation({
      mutationFn: cvService.deleteCV,
      onSuccess: (_, cvId) => {
        queryClient.removeQueries({ queryKey: cvKeys.detail(cvId) });
        queryClient.removeQueries({ queryKey: cvKeys.analysis(cvId) });
        queryClient.removeQueries({ queryKey: cvKeys.status(cvId) });
        queryClient.invalidateQueries({ queryKey: cvKeys.lists() });
      },
      ...options,
    });
  };

  // Generate ATS resume mutation
  const useGenerateATSResume = (options?: UseMutationOptions<string, Error, { cvId: string; jobDescription?: string }>) => {
    return useMutation({
      mutationFn: ({ cvId, jobDescription }) => cvService.generateATSResume(cvId, jobDescription),
      ...options,
    });
  };
  // Compare with job mutation
  const useCompareWithJob = (options?: UseMutationOptions<{
    match_score: number;
    matching_skills: string[];
    missing_skills: string[];
    recommendations: string[];
  }, Error, { cvId: string; jobDescription: string }>) => {
    return useMutation({
      mutationFn: ({ cvId, jobDescription }) => cvService.compareWithJob(cvId, jobDescription),
      ...options,
    });
  };

  // Export CV mutation
  const useExportCV = (options?: UseMutationOptions<Blob, Error, { cvId: string; format: 'json' | 'pdf' | 'docx' }>) => {
    return useMutation({
      mutationFn: ({ cvId, format }) => cvService.exportCV(cvId, format),
      ...options,
    });
  };

  return {
    // Queries
    useUserCVs,
    useCVById,
    useCVStatus,
    useCVAnalysis,
    useIndustryInsights,
    
    // Mutations
    useUploadCV,
    useParseCV,
    useAnalyzeCV,
    useUpdateCVData,
    useDeleteCV,
    useGenerateATSResume,
    useCompareWithJob,
    useExportCV,
  };
};
