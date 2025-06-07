import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { config, log } from '@/lib/config';

// WebSocket server for real-time features
export class WebSocketManager {
  private io: SocketIOServer | null = null;
  private server: any = null;

  constructor() {
    if (typeof window === 'undefined' && config.features.realTimeUpdates) {
      this.initializeServer();
    }
  }

  private initializeServer() {
    try {
      // Create HTTP server for Socket.IO
      this.server = createServer();
      
      this.io = new SocketIOServer(this.server, {
        cors: {
          origin: config.apiBaseUrl,
          methods: ['GET', 'POST'],
          credentials: true,
        },
        transports: ['websocket', 'polling'],
      });

      this.setupEventHandlers();
      
      // Start server on a different port
      const wsPort = 8001;
      this.server.listen(wsPort, () => {
        log.info(`WebSocket server running on port ${wsPort}`);
      });
    } catch (error) {
      log.error('Failed to initialize WebSocket server:', error);
    }
  }

  private setupEventHandlers() {
    if (!this.io) return;

    this.io.on('connection', (socket) => {
      log.debug(`Client connected: ${socket.id}`);

      // Join user-specific room
      socket.on('join-user-room', (userId: string) => {
        socket.join(`user-${userId}`);
        log.debug(`User ${userId} joined their room`);
      });

      // Join analytics room
      socket.on('join-analytics', () => {
        socket.join('analytics');
        log.debug('Client joined analytics room');
      });

      // Handle CV processing updates
      socket.on('cv-processing', (data) => {
        socket.to(`user-${data.userId}`).emit('cv-processing-update', data);
      });

      // Handle portfolio generation updates
      socket.on('portfolio-generation', (data) => {
        socket.to(`user-${data.userId}`).emit('portfolio-generation-update', data);
      });

      socket.on('disconnect', () => {
        log.debug(`Client disconnected: ${socket.id}`);
      });
    });
  }

  // Emit CV processing updates
  public emitCVProcessingUpdate(userId: string, update: any) {
    if (this.io) {
      this.io.to(`user-${userId}`).emit('cv-processing-update', update);
    }
  }

  // Emit portfolio generation updates
  public emitPortfolioUpdate(userId: string, update: any) {
    if (this.io) {
      this.io.to(`user-${userId}`).emit('portfolio-generation-update', update);
    }
  }

  // Emit analytics updates
  public emitAnalyticsUpdate(data: any) {
    if (this.io) {
      this.io.to('analytics').emit('analytics-update', data);
    }
  }

  // Emit ATS processing updates
  public emitATSUpdate(userId: string, update: any) {
    if (this.io) {
      this.io.to(`user-${userId}`).emit('ats-processing-update', update);
    }
  }

  // Get server instance
  public getIO() {
    return this.io;
  }
}

// Singleton instance
let wsManager: WebSocketManager | null = null;

export const getWebSocketManager = (): WebSocketManager => {
  if (!wsManager) {
    wsManager = new WebSocketManager();
  }
  return wsManager;
};

// Export types for client-side usage
export interface CVProcessingUpdate {
  userId: string;
  stage: 'uploading' | 'parsing' | 'analyzing' | 'completed' | 'error';
  progress: number;
  message: string;
  data?: any;
}

export interface PortfolioGenerationUpdate {
  userId: string;
  stage: 'generating' | 'customizing' | 'building' | 'deploying' | 'completed' | 'error';
  progress: number;
  message: string;
  portfolioId?: string;
  previewUrl?: string;
}

export interface AnalyticsUpdate {
  type: 'cv-processed' | 'portfolio-generated' | 'user-registered' | 'ats-analyzed';
  timestamp: Date;
  data: any;
}
