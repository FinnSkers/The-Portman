// Environment configuration for PORTMAN application
interface EnvironmentConfig {
  apiBaseUrl: string;
  apiVersion: string;
  environment: 'development' | 'staging' | 'production';
  features: {
    analytics: boolean;
    realTimeUpdates: boolean;
    debugMode: boolean;
    mockData: boolean;
  };
  limits: {
    maxFileSize: number; // in MB
    maxFiles: number;
    requestTimeout: number; // in ms
  };
  api: {
    retryAttempts: number;
    retryDelay: number; // in ms
  };
  sentry?: {
    dsn: string;
    environment: string;
  };
  analytics?: {
    googleAnalyticsId?: string;
    mixpanelToken?: string;
  };
}

// Get environment variables with fallbacks
const getEnvVar = (key: string, fallback: string = ''): string => {
  if (typeof window !== 'undefined') {
    // Client-side: use runtime config or fallback
    return (window as any).__ENV__?.[key] || fallback;
  }
  // Server-side: use process.env
  return process.env[key] || fallback;
};

const getEnvBoolean = (key: string, fallback: boolean = false): boolean => {
  const value = getEnvVar(key, fallback.toString());
  return value.toLowerCase() === 'true';
};

const getEnvNumber = (key: string, fallback: number = 0): number => {
  const value = getEnvVar(key, fallback.toString());
  return parseInt(value, 10) || fallback;
};

// Environment-specific configurations
const configs: Record<string, EnvironmentConfig> = {
  development: {
    apiBaseUrl: getEnvVar('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:8000'),
    apiVersion: 'v1',
    environment: 'development',
    features: {
      analytics: false,
      realTimeUpdates: true,
      debugMode: true,
      mockData: getEnvBoolean('NEXT_PUBLIC_USE_MOCK_DATA', true),
    },
    limits: {
      maxFileSize: 10, // 10MB
      maxFiles: 5,
      requestTimeout: 30000, // 30 seconds
    },
    api: {
      retryAttempts: 3,
      retryDelay: 1000,
    },
  },
  staging: {
    apiBaseUrl: getEnvVar('NEXT_PUBLIC_API_BASE_URL', 'https://staging-api.portman.ai'),
    apiVersion: 'v1',
    environment: 'staging',
    features: {
      analytics: true,
      realTimeUpdates: true,
      debugMode: getEnvBoolean('NEXT_PUBLIC_DEBUG_MODE', false),
      mockData: false,
    },
    limits: {
      maxFileSize: 10,
      maxFiles: 5,
      requestTimeout: 30000,
    },
    api: {
      retryAttempts: 3,
      retryDelay: 1000,
    },
    analytics: {
      googleAnalyticsId: getEnvVar('NEXT_PUBLIC_GA_ID'),
    },
  },
  production: {
    apiBaseUrl: getEnvVar('NEXT_PUBLIC_API_BASE_URL', 'https://api.portman.ai'),
    apiVersion: 'v1',
    environment: 'production',
    features: {
      analytics: true,
      realTimeUpdates: true,
      debugMode: false,
      mockData: false,
    },
    limits: {
      maxFileSize: 25, // 25MB for production
      maxFiles: 10,
      requestTimeout: 45000, // 45 seconds
    },
    api: {
      retryAttempts: 5,
      retryDelay: 2000,
    },
    sentry: {
      dsn: getEnvVar('NEXT_PUBLIC_SENTRY_DSN'),
      environment: 'production',
    },
    analytics: {
      googleAnalyticsId: getEnvVar('NEXT_PUBLIC_GA_ID'),
      mixpanelToken: getEnvVar('NEXT_PUBLIC_MIXPANEL_TOKEN'),
    },
  },
};

// Determine current environment
const getCurrentEnvironment = (): string => {
  const env = getEnvVar('NODE_ENV', 'development');
  const customEnv = getEnvVar('NEXT_PUBLIC_APP_ENV');
  
  if (customEnv && configs[customEnv]) {
    return customEnv;
  }
  
  if (env === 'production') {
    return 'production';
  }
  
  return 'development';
};

// Get current configuration
const currentEnv = getCurrentEnvironment();
export const config: EnvironmentConfig = {
  ...configs[currentEnv],
  // Override with custom environment variables if provided
  apiBaseUrl: getEnvVar('NEXT_PUBLIC_API_BASE_URL', configs[currentEnv].apiBaseUrl),
};

// Helper functions
export const isDevelopment = config.environment === 'development';
export const isStaging = config.environment === 'staging';
export const isProduction = config.environment === 'production';

export const getApiUrl = (endpoint: string = ''): string => {
  const baseUrl = config.apiBaseUrl.endsWith('/') 
    ? config.apiBaseUrl.slice(0, -1) 
    : config.apiBaseUrl;
  const version = config.apiVersion;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  return `${baseUrl}/api/${version}${cleanEndpoint}`;
};

// Feature flags
export const features = {
  isAnalyticsEnabled: () => config.features.analytics,
  isRealTimeEnabled: () => config.features.realTimeUpdates,
  isDebugMode: () => config.features.debugMode,
  shouldUseMockData: () => config.features.mockData,
};

// Validation helpers
export const validateFileSize = (fileSize: number): boolean => {
  const maxSize = config.limits.maxFileSize * 1024 * 1024; // Convert MB to bytes
  return fileSize <= maxSize;
};

export const validateFileCount = (fileCount: number): boolean => {
  return fileCount <= config.limits.maxFiles;
};

// API configuration
export const apiConfig = {
  timeout: config.limits.requestTimeout,
  retries: config.api.retryAttempts,
  retryDelay: config.api.retryDelay,
};

// Logging helper
export const log = {
  debug: (...args: any[]) => {
    if (config.features.debugMode) {
      console.log('[DEBUG]', ...args);
    }
  },
  info: (...args: any[]) => {
    if (config.features.debugMode || !isProduction) {
      console.info('[INFO]', ...args);
    }
  },
  warn: (...args: any[]) => {
    console.warn('[WARN]', ...args);
  },
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args);
  },
};

// Environment info for debugging
export const getEnvironmentInfo = () => ({
  environment: config.environment,
  apiBaseUrl: config.apiBaseUrl,
  features: config.features,
  buildTime: process.env.NEXT_PUBLIC_BUILD_TIME || 'unknown',
  version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
});

// Initialize environment (call this in _app.tsx or layout.tsx)
export const initializeEnvironment = () => {
  if (typeof window !== 'undefined') {
    // Client-side initialization
    log.info('PORTMAN Frontend initialized', getEnvironmentInfo());
    
    // Set global config for runtime access
    (window as any).__PORTMAN_CONFIG__ = config;
    
    // Initialize analytics if enabled
    if (config.features.analytics && config.analytics?.googleAnalyticsId) {
      // Initialize Google Analytics
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${config.analytics.googleAnalyticsId}`;
      script.async = true;
      document.head.appendChild(script);
      
      (window as any).dataLayer = (window as any).dataLayer || [];
      function gtag(...args: any[]) {
        (window as any).dataLayer.push(args);
      }
      gtag('js', new Date());
      gtag('config', config.analytics.googleAnalyticsId);
      (window as any).gtag = gtag;
    }
  }
};

export default config;
