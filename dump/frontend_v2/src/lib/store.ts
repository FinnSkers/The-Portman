import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// CV Data Types
export interface CVData {
  personal_info: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  summary: string;
  experience: Array<{
    title: string;
    company: string;
    location: string;
    start_date: string;
    end_date: string | null;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    location: string;
    graduation_date: string;
    gpa?: string;
    relevant_coursework?: string[];
  }>;
  skills: {
    technical: string[];
    soft: string[];
    languages: string[];
    certifications: string[];
  };
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    url?: string;
    github?: string;
  }>;
}

// Analytics Data Types
export interface AnalyticsData {
  metrics: {
    cvs_processed: number;
    portfolios_generated: number;
    ats_resumes_created: number;
    total_downloads: number;
    avg_ats_score: number;
  };
  popular_templates: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  performance: {
    avg_processing_time: number;
    success_rate: number;
    user_satisfaction: number;
  };
  user_engagement: {
    daily_active_users: number;
    weekly_active_users: number;
    monthly_active_users: number;
    avg_session_duration: number;
  };
  recent_activity: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    user: string;
  }>;
  geographic_distribution: Array<{
    country: string;
    users: number;
    percentage: number;
  }>;
  last_updated: string;
}

// Professional Analysis Data
export interface ProfessionalAnalysis {
  match_score: number;
  career_level: string;
  strengths: string[];
  improvement_areas: string[];
  skills_analysis: {
    current_skills: Array<{ skill: string; level: number; market_demand: number }>;
    recommended_skills: Array<{ skill: string; priority: 'high' | 'medium' | 'low'; market_value: number }>;
    skill_gaps: string[];
  };
  career_progression: Array<{
    stage: string;
    timeframe: string;
    requirements: string[];
    salary_range: { min: number; max: number };
  }>;
  peer_comparison: {
    percentile: number;
    similar_profiles: number;
    competitive_advantages: string[];
  };
}

// Portfolio Templates
export interface PortfolioTemplate {
  id: string;
  name: string;
  description: string;
  preview_url: string;
  color_schemes: string[];
  features: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// ATS Analysis
export interface ATSAnalysis {
  overall_score: number;
  ats_compatibility: number;
  keyword_optimization: number;
  format_score: number;
  recommendations: Array<{
    category: string;
    suggestion: string;
    impact: 'high' | 'medium' | 'low';
  }>;
  missing_keywords: string[];
  format_issues: string[];
}

// Main Store Interface
interface AppState {
  // CV Management
  cvData: CVData | null;
  isProcessingCV: boolean;
  cvError: string | null;
  
  // Analytics
  analyticsData: AnalyticsData | null;
  
  // Professional Analysis
  professionalAnalysis: ProfessionalAnalysis | null;
  
  // Portfolio
  selectedTemplate: PortfolioTemplate | null;
  portfolioConfig: {
    colorScheme: string;
    includedSections: string[];
    customizations: Record<string, any>;
  };
  
  // ATS Resume
  atsAnalysis: ATSAnalysis | null;
  atsOptimizedResume: any | null;
  
  // UI State
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  activeView: string;
  
  // Actions
  setCVData: (data: CVData) => void;
  setProcessingCV: (processing: boolean) => void;
  setCVError: (error: string | null) => void;
  setAnalyticsData: (data: AnalyticsData) => void;
  setProfessionalAnalysis: (analysis: ProfessionalAnalysis) => void;
  setSelectedTemplate: (template: PortfolioTemplate) => void;
  updatePortfolioConfig: (config: Partial<typeof AppState.prototype.portfolioConfig>) => void;
  setATSAnalysis: (analysis: ATSAnalysis) => void;
  setATSOptimizedResume: (resume: any) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveView: (view: string) => void;
  resetState: () => void;
}

// Create the store
export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        cvData: null,
        isProcessingCV: false,
        cvError: null,
        analyticsData: null,
        professionalAnalysis: null,
        selectedTemplate: null,
        portfolioConfig: {
          colorScheme: 'blue',
          includedSections: ['about', 'experience', 'skills', 'projects', 'contact'],
          customizations: {},
        },
        atsAnalysis: null,
        atsOptimizedResume: null,
        theme: 'system',
        sidebarOpen: false,
        activeView: 'home',

        // Actions
        setCVData: (data) => set({ cvData: data }),
        setProcessingCV: (processing) => set({ isProcessingCV: processing }),
        setCVError: (error) => set({ cvError: error }),
        setAnalyticsData: (data) => set({ analyticsData: data }),
        setProfessionalAnalysis: (analysis) => set({ professionalAnalysis: analysis }),
        setSelectedTemplate: (template) => set({ selectedTemplate: template }),
        updatePortfolioConfig: (config) =>
          set((state) => ({
            portfolioConfig: { ...state.portfolioConfig, ...config },
          })),
        setATSAnalysis: (analysis) => set({ atsAnalysis: analysis }),
        setATSOptimizedResume: (resume) => set({ atsOptimizedResume: resume }),
        setTheme: (theme) => set({ theme }),
        setSidebarOpen: (open) => set({ sidebarOpen: open }),
        setActiveView: (view) => set({ activeView: view }),
        resetState: () =>
          set({
            cvData: null,
            isProcessingCV: false,
            cvError: null,
            analyticsData: null,
            professionalAnalysis: null,
            selectedTemplate: null,
            portfolioConfig: {
              colorScheme: 'blue',
              includedSections: ['about', 'experience', 'skills', 'projects', 'contact'],
              customizations: {},
            },
            atsAnalysis: null,
            atsOptimizedResume: null,
            activeView: 'home',
          }),
      }),
      {
        name: 'portman-app-storage',
        partialize: (state) => ({
          cvData: state.cvData,
          portfolioConfig: state.portfolioConfig,
          theme: state.theme,
        }),
      }
    )
  )
);

// Selectors for optimized re-renders
export const useCV = () => useAppStore((state) => ({
  cvData: state.cvData,
  isProcessingCV: state.isProcessingCV,
  cvError: state.cvError,
  setCVData: state.setCVData,
  setProcessingCV: state.setProcessingCV,
  setCVError: state.setCVError,
}));

export const useAnalytics = () => useAppStore((state) => ({
  analyticsData: state.analyticsData,
  setAnalyticsData: state.setAnalyticsData,
}));

export const useProfessionalAnalysis = () => useAppStore((state) => ({
  professionalAnalysis: state.professionalAnalysis,
  setProfessionalAnalysis: state.setProfessionalAnalysis,
}));

export const usePortfolio = () => useAppStore((state) => ({
  selectedTemplate: state.selectedTemplate,
  portfolioConfig: state.portfolioConfig,
  setSelectedTemplate: state.setSelectedTemplate,
  updatePortfolioConfig: state.updatePortfolioConfig,
}));

export const useATS = () => useAppStore((state) => ({
  atsAnalysis: state.atsAnalysis,
  atsOptimizedResume: state.atsOptimizedResume,
  setATSAnalysis: state.setATSAnalysis,
  setATSOptimizedResume: state.setATSOptimizedResume,
}));
