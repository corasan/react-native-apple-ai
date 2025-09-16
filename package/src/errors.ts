export interface AppleAIErrorInfo {
  code: string
  message: string
  details?: Record<string, any>
}

export class AppleAIError extends Error {
  public readonly code: string
  public readonly details?: Record<string, any>

  constructor(code: string, message: string, details?: Record<string, any>) {
    super(message)
    this.name = 'AppleAIError'
    this.code = code
    this.details = details
  }

  static fromErrorInfo(errorInfo: AppleAIErrorInfo): AppleAIError {
    return new AppleAIError(errorInfo.code, errorInfo.message, errorInfo.details)
  }

  toErrorInfo(): AppleAIErrorInfo {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
    }
  }
}

export class SessionNotInitializedError extends AppleAIError {
  constructor(details?: Record<string, any>) {
    super('SESSION_NOT_INITIALIZED', 'Language model session is not initialized', details)
  }
}

export class ToolCallError extends AppleAIError {
  constructor(message: string, details?: Record<string, any>) {
    super('TOOL_CALL_ERROR', `Tool call failed: ${message}`, details)
  }
}

export class ToolExecutionError extends AppleAIError {
  constructor(toolName: string, message: string, details?: Record<string, any>) {
    super('TOOL_EXECUTION_ERROR', `Tool '${toolName}' execution failed: ${message}`, {
      ...details,
      toolName,
    })
  }
}

export class SchemaCreationError extends AppleAIError {
  constructor(message: string, details?: Record<string, any>) {
    super('SCHEMA_CREATION_ERROR', `Failed to create tool schema: ${message}`, details)
  }
}

export class ArgumentParsingError extends AppleAIError {
  constructor(message: string, details?: Record<string, any>) {
    super('ARGUMENT_PARSING_ERROR', `Failed to parse tool arguments: ${message}`, details)
  }
}

export class ResponseParsingError extends AppleAIError {
  constructor(message: string, details?: Record<string, any>) {
    super('RESPONSE_PARSING_ERROR', `Failed to parse tool response: ${message}`, details)
  }
}

export class UnknownToolError extends AppleAIError {
  constructor(toolName: string, details?: Record<string, any>) {
    super('UNKNOWN_TOOL_ERROR', `Unknown tool: ${toolName}`, {
      ...details,
      toolName,
    })
  }
}

export class SessionStreamingError extends AppleAIError {
  constructor(message: string, details?: Record<string, any>) {
    super('SESSION_STREAMING_ERROR', `Session streaming failed: ${message}`, details)
  }
}

export class UnsupportedPlatformError extends AppleAIError {
  constructor(
    message = 'Foundation Models requires iOS 26.0 or later',
    details?: Record<string, any>,
  ) {
    super('UNSUPPORTED_PLATFORM', message, details)
  }
}

export function isAppleAIError(error: any): error is AppleAIError {
  return (
    error instanceof AppleAIError ||
    (error && typeof error === 'object' && 'code' in error && 'message' in error)
  )
}

export function parseNativeError(error: any): AppleAIError {
  if (isAppleAIError(error)) {
    return error
  }

  if (typeof error === 'string') {
    try {
      const parsed = JSON.parse(error)
      if (
        parsed &&
        typeof parsed === 'object' &&
        'code' in parsed &&
        'message' in parsed
      ) {
        return AppleAIError.fromErrorInfo(parsed)
      }
    } catch {
      // Not JSON, treat as plain error message
    }
    return new AppleAIError('UNKNOWN_ERROR', error)
  }

  if (error && typeof error === 'object') {
    const message = error.message || error.localizedDescription || 'Unknown error'
    const code = error.code || 'UNKNOWN_ERROR'
    return new AppleAIError(code, message, { originalError: error })
  }

  return new AppleAIError('UNKNOWN_ERROR', 'An unknown error occurred')
}
