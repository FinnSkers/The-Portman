import { CVData, AnalyticsData, ProfessionalAnalysis, ATSAnalysis } from './store';
import { config, getApiUrl, apiConfig, log } from './config';

// API Configuration using environment config
const API_BASE_URL = config.apiBaseUrl;
const API_VERSION = `/api/${config.apiVersion}`;

// Error handling utility
class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Generic API request function with retry logic
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = getApiUrl(endpoint);
  
  for (let attempt = 1; attempt <= apiConfig.retries; attempt++) {
    try {
      log.debug(`API Request [${attempt}/${apiConfig.retries}]:`, url);
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        timeout: apiConfig.timeout,
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.text();
        log.error(`API Error [${response.status}]:`, errorData);
        throw new APIError(
          `API request failed: ${response.statusText}`,
          response.status,
          errorData
        );
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        log.debug('API Response:', data);
        return data;
      } else {
        const text = await response.text();
        log.debug('API Response (text):', text);
        return text as unknown as T;
      }
    } catch (error) {
      log.error(`API Request failed (attempt ${attempt}):`, error);
      
      if (attempt === apiConfig.retries) {
        // Last attempt failed, throw the error
        if (error instanceof APIError) {
          throw error;
        }
        throw new APIError('Network request failed', 0, error);
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, apiConfig.retryDelay * attempt));
    }
  }
  
  throw new APIError('Max retry attempts exceeded', 0);
}

// CV/Resume API Functions
export const cvAPI = {
  // Upload and parse CV
  uploadCV: async (file: File): Promise<CVData> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}${API_VERSION}/cv/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new APIError('Failed to upload CV', response.status);
    }

    return await response.json();
  },
  // Parse CV from text
  parseCV: async (text: string): Promise<CVData> => {
    return apiRequest<CVData>('/cv/parse', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },

  // Get CV analysis
  analyzeCV: async (cvData: CVData): Promise<any> => {
    return apiRequest('/cv/analyze', {
      method: 'POST',
      body: JSON.stringify(cvData),
    });
  },

  // Update CV data
  updateCV: async (cvData: CVData): Promise<CVData> => {
    return apiRequest<CVData>('/cv/update', {
      method: 'PUT',
      body: JSON.stringify(cvData),
    });
  },
};

// Analytics API Functions
export const analyticsAPI = {
  // Get overview metrics
  getOverview: async (): Promise<AnalyticsData['overview']> => {
    return apiRequest<AnalyticsData['overview']>('/analytics/metrics');
  },

  // Get engagement metrics
  getEngagement: async (timeframe: string = '30d'): Promise<AnalyticsData['engagement']> => {
    return apiRequest<AnalyticsData['engagement']>(`/analytics/engagement?timeframe=${timeframe}`);
  },

  // Get performance metrics
  getPerformance: async (): Promise<AnalyticsData['performance']> => {
    return apiRequest<AnalyticsData['performance']>('/analytics/performance');
  },

  // Get complete analytics data
  getFullAnalytics: async (): Promise<AnalyticsData> => {
    return apiRequest<AnalyticsData>('/analytics/dashboard');
  },

  // Track event
  trackEvent: async (event: string, properties: Record<string, any>): Promise<void> => {
    return apiRequest('/analytics/track', {
      method: 'POST',
      body: JSON.stringify({ event, properties }),
    });
  },
};

// Professional Analysis API Functions
export const analysisAPI = {
  // Get professional analysis
  getProfessionalAnalysis: async (cvData: CVData): Promise<ProfessionalAnalysis> => {
    return apiRequest<ProfessionalAnalysis>('/api/analysis/professional', {
      method: 'POST',
      body: JSON.stringify(cvData),
    });
  },

  // Get skill recommendations
  getSkillRecommendations: async (currentSkills: string[]): Promise<any> => {
    return apiRequest('/api/analysis/skills/recommendations', {
      method: 'POST',
      body: JSON.stringify({ skills: currentSkills }),
    });
  },

  // Get career progression
  getCareerProgression: async (currentRole: string, targetRole: string): Promise<any> => {
    return apiRequest('/api/analysis/career/progression', {
      method: 'POST',
      body: JSON.stringify({ current_role: currentRole, target_role: targetRole }),
    });
  },

  // Get peer comparison
  getPeerComparison: async (cvData: CVData): Promise<any> => {
    return apiRequest('/api/analysis/peer/comparison', {
      method: 'POST',
      body: JSON.stringify(cvData),
    });
  },
};

// Portfolio API Functions
export const portfolioAPI = {
  // Get available templates
  getTemplates: async (): Promise<any[]> => {
    return apiRequest<any[]>('/api/portfolio/templates');
  },

  // Generate portfolio
  generatePortfolio: async (cvData: CVData, templateId: string, config: any): Promise<any> => {
    return apiRequest('/api/portfolio/generate', {
      method: 'POST',
      body: JSON.stringify({
        cv_data: cvData,
        template_id: templateId,
        config,
      }),
    });
  },

  // Preview portfolio
  previewPortfolio: async (cvData: CVData, templateId: string): Promise<string> => {
    return apiRequest<string>('/api/portfolio/preview', {
      method: 'POST',
      body: JSON.stringify({
        cv_data: cvData,
        template_id: templateId,
      }),
    });
  },

  // Deploy portfolio
  deployPortfolio: async (portfolioId: string): Promise<any> => {
    return apiRequest('/api/portfolio/deploy', {
      method: 'POST',
      body: JSON.stringify({ portfolio_id: portfolioId }),
    });
  },
};

// ATS Resume API Functions
export const atsAPI = {
  // Analyze resume for ATS compatibility
  analyzeATS: async (cvData: CVData, jobDescription?: string): Promise<ATSAnalysis> => {
    return apiRequest<ATSAnalysis>('/api/ats/analyze', {
      method: 'POST',
      body: JSON.stringify({
        cv_data: cvData,
        job_description: jobDescription,
      }),
    });
  },

  // Optimize resume for ATS
  optimizeResume: async (
    cvData: CVData,
    jobDescription: string,
    targetKeywords: string[]
  ): Promise<any> => {
    return apiRequest('/api/ats/optimize', {
      method: 'POST',
      body: JSON.stringify({
        cv_data: cvData,
        job_description: jobDescription,
        target_keywords: targetKeywords,
      }),
    });
  },

  // Get ATS-friendly templates
  getATSTemplates: async (): Promise<any[]> => {
    return apiRequest<any[]>('/api/ats/templates');
  },

  // Generate ATS resume
  generateATSResume: async (cvData: CVData, templateId: string): Promise<any> => {
    return apiRequest('/api/ats/generate', {
      method: 'POST',
      body: JSON.stringify({
        cv_data: cvData,
        template_id: templateId,
      }),
    });
  },
};

// User API Functions (for future authentication)
export const userAPI = {
  // Register user
  register: async (userData: any): Promise<any> => {
    return apiRequest('/api/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Login user
  login: async (email: string, password: string): Promise<any> => {
    return apiRequest('/api/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  // Get user profile
  getProfile: async (): Promise<any> => {
    return apiRequest('/api/users/profile');
  },

  // Update user profile
  updateProfile: async (profileData: any): Promise<any> => {
    return apiRequest('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
};

// Utility functions for common API operations
export const apiUtils = {
  // Handle file upload with progress
  uploadWithProgress: async (
    file: File,
    endpoint: string,
    onProgress?: (progress: number) => void
  ): Promise<any> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('file', file);

      if (onProgress) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = (e.loaded / e.total) * 100;
            onProgress(progress);
          }
        });
      }

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            resolve(xhr.responseText);
          }
        } else {
          reject(new APIError('Upload failed', xhr.status, xhr.responseText));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new APIError('Network error during upload', 0));
      });

      xhr.open('POST', `${API_BASE_URL}${endpoint}`);
      xhr.send(formData);
    });
  },

  // Batch API requests
  batchRequests: async <T>(
    requests: Array<() => Promise<T>>
  ): Promise<Array<T | APIError>> => {
    const results = await Promise.allSettled(requests.map(req => req()));
    return results.map(result => 
      result.status === 'fulfilled' ? result.value : result.reason
    );
  },

  // Retry mechanism for failed requests
  retryRequest: async <T>(
    requestFn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> => {
    let lastError: Error;
    
    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        if (i < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        }
      }
    }
    
    throw lastError!;
  },
};

// Export the APIError class for error handling in components
export { APIError };
