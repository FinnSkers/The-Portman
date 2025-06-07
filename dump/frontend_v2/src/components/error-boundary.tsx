'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCw, Home, FileText, Bug } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
  copied: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      copied: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Report error to monitoring service
    this.reportError(error, errorInfo);

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    const errorReport = {
      errorId: this.state.errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // In production, send to error reporting service
    if (process.env.NODE_ENV === 'production') {
      fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorReport),
      }).catch(console.error);
    }
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      copied: false
    });
  };

  private handleCopyError = async () => {
    if (!this.state.error || !this.state.errorInfo) return;

    const errorText = `
Error ID: ${this.state.errorId}
Error: ${this.state.error.message}
Stack: ${this.state.error.stack}
Component Stack: ${this.state.errorInfo.componentStack}
Timestamp: ${new Date().toISOString()}
URL: ${window.location.href}
    `.trim();

    try {
      await navigator.clipboard.writeText(errorText);
      this.setState({ copied: true });
      toast.success('Error details copied to clipboard');
      setTimeout(() => this.setState({ copied: false }), 2000);
    } catch (err) {
      toast.error('Failed to copy error details');
    }
  };
  private handleGoHome = () => {
    window.location.href = '/';
  };

  private reportError = (error: Error) => {
    // Track error in analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: error.toString(),
        fatal: false,
      });
    }
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private copyErrorToClipboard = () => {
    const errorText = `
Error: ${this.state.error?.message || 'Unknown error'}
Stack: ${this.state.error?.stack || 'No stack trace'}
Component Stack: ${this.state.errorInfo?.componentStack || 'No component stack'}
    `.trim();

    navigator.clipboard.writeText(errorText).then(() => {
      alert('Error details copied to clipboard');
    }).catch(() => {
      console.log('Failed to copy error details');
    });
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-red-600">
                Oops! Something went wrong
              </CardTitle>
              <CardDescription className="text-base mt-2">
                We encountered an unexpected error. Don't worry, your data is safe.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Error Summary */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Bug className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-red-800 mb-1">Error Details</h4>
                    <p className="text-sm text-red-700 font-mono bg-red-100 p-2 rounded">
                      {this.state.error?.message || 'Unknown error occurred'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button 
                  onClick={this.handleRetry}
                  className="w-full"
                  variant="default"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                
                <Button 
                  onClick={this.handleReload}
                  className="w-full"
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reload Page
                </Button>
                
                <Button 
                  onClick={this.handleGoHome}
                  className="w-full"
                  variant="outline"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </div>

              {/* Developer Info (only in development) */}
              {process.env.NODE_ENV === 'development' && (
                <details className="bg-gray-50 border rounded-lg p-4">
                  <summary className="cursor-pointer font-semibold text-gray-700 mb-2">
                    🔧 Developer Information
                  </summary>
                  <div className="space-y-3 text-sm">
                    <div>
                      <Badge variant="secondary" className="mb-2">Stack Trace</Badge>
                      <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
                        {this.state.error?.stack || 'No stack trace available'}
                      </pre>
                    </div>
                    
                    {this.state.errorInfo?.componentStack && (
                      <div>
                        <Badge variant="secondary" className="mb-2">Component Stack</Badge>
                        <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                    
                    <Button 
                      onClick={this.copyErrorToClipboard}
                      size="sm"
                      variant="outline"
                      className="w-full"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Copy Error Details
                    </Button>
                  </div>
                </details>
              )}

              {/* Help Text */}
              <div className="text-center text-sm text-muted-foreground">
                <p>
                  If this problem persists, please{' '}
                  <a 
                    href="mailto:support@portman.ai" 
                    className="text-blue-600 hover:underline"
                  >
                    contact support
                  </a>
                  {' '}or try refreshing the page.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook for functional components to handle errors
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    console.error('Error captured:', error);
    setError(error);
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { captureError, resetError };
};

// Higher-order component for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

// Async error boundary for handling promise rejections
export const AsyncErrorBoundary: React.FC<Props> = ({ children, ...props }) => {
  React.useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      // You can throw the error to be caught by ErrorBoundary
      // throw new Error(`Unhandled promise rejection: ${event.reason}`);
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return <ErrorBoundary {...props}>{children}</ErrorBoundary>;
};

export default ErrorBoundary;
