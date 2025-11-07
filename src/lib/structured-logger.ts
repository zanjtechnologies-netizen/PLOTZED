// ================================================
// src/lib/structured-logger.ts
// Structured Logging Utility
// ================================================

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical'

interface LogContext {
  [key: string]: any
}

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: LogContext
  error?: {
    name: string
    message: string
    stack?: string
  }
  environment: string
  service: string
}

class StructuredLogger {
  private service: string = 'plotzed-api'
  private environment: string = process.env.NODE_ENV || 'development'

  private formatLogEntry(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error
  ): LogEntry {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      environment: this.environment,
      service: this.service,
    }

    if (context) {
      entry.context = context
    }

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: this.environment === 'development' ? error.stack : undefined,
      }
    }

    return entry
  }

  private output(entry: LogEntry): void {
    const formatted = JSON.stringify(entry, null, this.environment === 'development' ? 2 : 0)

    switch (entry.level) {
      case 'debug':
        console.debug(formatted)
        break
      case 'info':
        console.info(formatted)
        break
      case 'warn':
        console.warn(formatted)
        break
      case 'error':
      case 'critical':
        console.error(formatted)
        break
    }

    // Send to external logging service in production
    if (this.environment === 'production') {
      this.sendToExternalService(entry)
    }
  }

  private async sendToExternalService(entry: LogEntry): Promise<void> {
    // TODO: Implement integration with logging service (Datadog, LogRocket, etc.)
    // For now, this is a placeholder
    try {
      if (process.env.LOGGING_ENDPOINT) {
        await fetch(process.env.LOGGING_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry),
        })
      }
    } catch (error) {
      // Silently fail to avoid logging loops
      console.error('Failed to send log to external service:', error)
    }
  }

  debug(message: string, context?: LogContext): void {
    if (this.environment === 'development') {
      this.output(this.formatLogEntry('debug', message, context))
    }
  }

  info(message: string, context?: LogContext): void {
    this.output(this.formatLogEntry('info', message, context))
  }

  warn(message: string, context?: LogContext): void {
    this.output(this.formatLogEntry('warn', message, context))
  }

  error(message: string, error?: Error, context?: LogContext): void {
    this.output(this.formatLogEntry('error', message, context, error))
  }

  critical(message: string, error?: Error, context?: LogContext): void {
    this.output(this.formatLogEntry('critical', message, context, error))
  }

  // Specialized logging methods
  logApiRequest(method: string, path: string, userId?: string): void {
    this.info('API Request', {
      method,
      path,
      userId,
      type: 'api_request',
    })
  }

  logApiResponse(
    method: string,
    path: string,
    statusCode: number,
    duration: number
  ): void {
    const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info'

    this.output(this.formatLogEntry(level, 'API Response', {
      method,
      path,
      statusCode,
      duration,
      type: 'api_response',
    }))
  }

  logDatabaseQuery(query: string, duration: number, error?: Error): void {
    if (error) {
      this.error('Database Query Failed', error, {
        query,
        duration,
        type: 'database_query',
      })
    } else {
      this.debug('Database Query', {
        query,
        duration,
        type: 'database_query',
      })
    }
  }

  logSecurityEvent(event: string, context?: LogContext): void {
    this.warn('Security Event', {
      event,
      ...context,
      type: 'security_event',
    })
  }

  logPayment(
    action: string,
    amount: number,
    userId: string,
    status: string,
    context?: LogContext
  ): void {
    this.info('Payment Event', {
      action,
      amount,
      userId,
      status,
      ...context,
      type: 'payment',
    })
  }

  logExternalService(
    service: string,
    action: string,
    success: boolean,
    duration?: number,
    error?: Error
  ): void {
    if (success) {
      this.info('External Service Call', {
        service,
        action,
        success,
        duration,
        type: 'external_service',
      })
    } else {
      this.error('External Service Failed', error, {
        service,
        action,
        success,
        duration,
        type: 'external_service',
      })
    }
  }
}

// Export singleton instance
export const structuredLogger = new StructuredLogger()

// Convenience function for error logging
export function logError(params: {
  error: Error
  context?: LogContext
  level?: 'error' | 'critical'
}): void {
  const { error, context, level = 'error' } = params

  if (level === 'critical') {
    structuredLogger.critical(error.message, error, context)
  } else {
    structuredLogger.error(error.message, error, context)
  }
}
