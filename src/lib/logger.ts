// src/lib/logger.ts

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogData {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  error?: {
    message: string;
    stack?: string;
    code?: string;
  };
}

class Logger {
  private formatLog(level: LogLevel, message: string, data?: any): LogData {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(data && { data }),
    };
  }

  private log(level: LogLevel, message: string, data?: any) {
    const logData = this.formatLog(level, message, data);
    
    // Development: Pretty print
    if (process.env.NODE_ENV === 'development') {
      const emoji = {
        info: 'ℹ️',
        warn: '⚠️',
        error: '❌',
        debug: '🐛',
      }[level];
      
      console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](
        `${emoji} [${level.toUpperCase()}] ${message}`,
        data || ''
      );
      return;
    }
    
    // Production: Structured JSON
    const output = JSON.stringify(logData);
    
    switch (level) {
      case 'error':
        console.error(output);
        break;
      case 'warn':
        console.warn(output);
        break;
      default:
        console.log(output);
    }
    
    // TODO: Send to monitoring service (Sentry, Datadog, etc.)
    // if (process.env.NODE_ENV === 'production') {
      // this.sendToMonitoring(logData);
    // }
  }

  /**
   * Log informational messages
   */
  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  /**
   * Log warning messages
   */
  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  /**
   * Log error messages
   */
  error(message: string, error?: any, data?: any) {
    const errorData = {
      ...data,
      error: error
        ? {
            message: error?.message || String(error),
            stack: error?.stack,
            code: error?.code,
            name: error?.name,
          }
        : undefined,
    };
    
    this.log('error', message, errorData);
    
    // TODO: Send to error tracking service
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
    //   // Send to Sentry or similar
       //Sentry.captureException(error || new Error(message), {
         //extra: data,
       //});
     }
  }

  /**
   * Log debug messages (only in development)
   */
  debug(message: string, data?: any) {
    if (process.env.NODE_ENV === 'development') {
      this.log('debug', message, data);
    }
  }

  /**
   * Log API requests
   */
  apiRequest(method: string, path: string, data?: any) {
    this.info(`API ${method} ${path}`, data);
  }

  /**
   * Log API responses
   */
  apiResponse(method: string, path: string, status: number, duration?: number) {
    const logData = {
      method,
      path,
      status,
      ...(duration && { duration: `${duration}ms` }),
    };
    
    if (status >= 500) {
      this.error('API Server Error', null, logData);
    } else if (status >= 400) {
      this.warn('API Client Error', logData);
    } else {
      this.info('API Success', logData);
    }
  }

  /**
   * Log database queries (for debugging)
   */
  dbQuery(operation: string, model: string, data?: any) {
    this.debug(`DB ${operation} ${model}`, data);
  }
}

// Export singleton instance
export const logger = new Logger();

// Export type for external use
export type { LogLevel, LogData };