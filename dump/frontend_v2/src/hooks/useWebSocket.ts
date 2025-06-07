'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { config, log } from '@/lib/config';
import { CVProcessingUpdate, PortfolioGenerationUpdate, AnalyticsUpdate } from '@/lib/websocket';

interface UseWebSocketOptions {
  userId?: string;
  enableAnalytics?: boolean;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [cvProcessingUpdate, setCVProcessingUpdate] = useState<CVProcessingUpdate | null>(null);
  const [portfolioUpdate, setPortfolioUpdate] = useState<PortfolioGenerationUpdate | null>(null);
  const [analyticsUpdate, setAnalyticsUpdate] = useState<AnalyticsUpdate | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!config.features.realTimeUpdates) {
      log.debug('Real-time updates disabled in config');
      return;
    }

    // Initialize socket connection
    const wsUrl = config.apiBaseUrl.replace(/:\d+/, ':8001'); // WebSocket on port 8001
    socketRef.current = io(wsUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    const socket = socketRef.current;

    // Connection event handlers
    socket.on('connect', () => {
      setIsConnected(true);
      log.debug('Connected to WebSocket server');

      // Join user-specific room if userId provided
      if (options.userId) {
        socket.emit('join-user-room', options.userId);
      }

      // Join analytics room if enabled
      if (options.enableAnalytics) {
        socket.emit('join-analytics');
      }
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      log.debug('Disconnected from WebSocket server');
    });

    // CV processing updates
    socket.on('cv-processing-update', (update: CVProcessingUpdate) => {
      log.debug('CV processing update:', update);
      setCVProcessingUpdate(update);
    });

    // Portfolio generation updates
    socket.on('portfolio-generation-update', (update: PortfolioGenerationUpdate) => {
      log.debug('Portfolio generation update:', update);
      setPortfolioUpdate(update);
    });

    // Analytics updates
    socket.on('analytics-update', (update: AnalyticsUpdate) => {
      log.debug('Analytics update:', update);
      setAnalyticsUpdate(update);
    });

    // ATS processing updates
    socket.on('ats-processing-update', (update: any) => {
      log.debug('ATS processing update:', update);
      // Handle ATS updates as needed
    });

    // Connection error handling
    socket.on('connect_error', (error) => {
      log.error('WebSocket connection error:', error);
      setIsConnected(false);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setIsConnected(false);
    };
  }, [options.userId, options.enableAnalytics]);

  // Emit CV processing event
  const emitCVProcessing = (data: Omit<CVProcessingUpdate, 'userId'>) => {
    if (socketRef.current && options.userId) {
      socketRef.current.emit('cv-processing', {
        ...data,
        userId: options.userId,
      });
    }
  };

  // Emit portfolio generation event
  const emitPortfolioGeneration = (data: Omit<PortfolioGenerationUpdate, 'userId'>) => {
    if (socketRef.current && options.userId) {
      socketRef.current.emit('portfolio-generation', {
        ...data,
        userId: options.userId,
      });
    }
  };

  return {
    isConnected,
    cvProcessingUpdate,
    portfolioUpdate,
    analyticsUpdate,
    emitCVProcessing,
    emitPortfolioGeneration,
    socket: socketRef.current,
  };
}

// Real-time analytics hook
export function useRealTimeAnalytics() {
  const { analyticsUpdate, isConnected } = useWebSocket({ enableAnalytics: true });

  return {
    analyticsUpdate,
    isConnected,
  };
}

// User-specific real-time updates hook
export function useUserRealTimeUpdates(userId: string) {
  const {
    isConnected,
    cvProcessingUpdate,
    portfolioUpdate,
    emitCVProcessing,
    emitPortfolioGeneration,
  } = useWebSocket({ userId });

  return {
    isConnected,
    cvProcessingUpdate,
    portfolioUpdate,
    emitCVProcessing,
    emitPortfolioGeneration,
  };
}
