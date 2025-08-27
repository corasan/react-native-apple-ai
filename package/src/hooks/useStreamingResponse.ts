import { useCallback, useEffect, useRef, useState } from 'react'
import type { AppleAIError } from '../errors'
import { isAppleAIError, parseNativeError } from '../errors'
import type { LanguageModelSession } from '../LanguageModelSession'

export interface StreamingOptions {
  onToken?: (token: string) => void
  onComplete?: (fullResponse: string) => void
  onError?: (error: AppleAIError) => void
}

export interface UseStreamingResponseReturn {
  response: string
  isStreaming: boolean
  isComplete: boolean
  error: AppleAIError | null
  streamResponse: (prompt: string, options?: StreamingOptions) => Promise<string>
  cancel: () => void
  reset: () => void
}

export function useStreamingResponse(
  session: LanguageModelSession,
): UseStreamingResponseReturn {
  const [response, setResponse] = useState<string>('')
  const [isStreaming, setIsStreaming] = useState<boolean>(false)
  const [isComplete, setIsComplete] = useState<boolean>(false)
  const [error, setError] = useState<AppleAIError | null>(null)

  const activeStreamRef = useRef<Promise<string> | null>(null)
  const isCancelledRef = useRef<boolean>(false)

  const cancel = useCallback(() => {
    isCancelledRef.current = true
    setIsStreaming(false)
    setIsComplete(false)
  }, [])

  const reset = useCallback(() => {
    setResponse('')
    setIsStreaming(false)
    setIsComplete(false)
    setError(null)
    isCancelledRef.current = false
    activeStreamRef.current = null
  }, [])

  const streamResponse = useCallback(
    async (prompt: string, options?: StreamingOptions): Promise<string> => {
      if (!session?.session) {
        const error = parseNativeError(new Error('Session not initialized'))
        setError(error)
        options?.onError?.(error)
        throw error
      }

      if (isStreaming) {
        const error = parseNativeError(new Error('Another stream is already in progress'))
        setError(error)
        options?.onError?.(error)
        throw error
      }

      try {
        setIsStreaming(true)
        setIsComplete(false)
        setError(null)
        setResponse('')
        isCancelledRef.current = false

        const streamPromise = session.session.streamResponse(prompt, (fullResponse: string) => {
          if (isCancelledRef.current) return

          setResponse(fullResponse)
          options?.onToken?.(fullResponse)
        })

        activeStreamRef.current = streamPromise

        const fullResponse = await streamPromise

        if (!isCancelledRef.current) {
          setIsComplete(true)
          setIsStreaming(false)
          options?.onComplete?.(fullResponse)
        }

        return fullResponse
      } catch (err) {
        setIsStreaming(false)
        setIsComplete(false)

        const appleAIError = isAppleAIError(err) ? err : parseNativeError(err)

        if (!isCancelledRef.current) {
          setError(appleAIError)
          options?.onError?.(appleAIError)
        }

        throw appleAIError
      }
    },
    [session, isStreaming],
  )

  useEffect(() => {
    return () => {
      cancel()
    }
  }, [cancel])

  return {
    response,
    isStreaming,
    isComplete,
    error,
    streamResponse,
    cancel,
    reset,
  }
}
