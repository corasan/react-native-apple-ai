import { useCallback, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import { createTool, isAppleAIError, LanguageModelSession } from 'react-native-apple-ai'
import { z } from 'zod'
import { Text, View } from '@/components/Themed'

const WEATHER_API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY
const options = {
  method: 'GET',
  headers: { accept: 'application/json', 'accept-encoding': 'deflate, gzip, br' },
}

function weatherResult(data?: any) {
  const units = 'imperial'
  if (!data) {
    return {
      temperature: 0,
      humidity: 0,
      precipitation: 0,
      units,
    }
  }
  return {
    temperature: data.temp,
    humidity: data.humidity,
    precipitation: data.weather?.[0]?.description || 'Unknown',
    units,
  }
}

const weatherTool = createTool({
  name: 'weather_tool',
  description: 'A weather tool that can get current weather information for any city.',
  arguments: z.object({
    city: z.string(),
  }),
  handler: async args => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${args.city}&units=imperial&APPID=${WEATHER_API_KEY}`
      const res = await fetch(url, options)
      const result = await res.json()

      if (!result.main) {
        throw new Error(`Invalid API response structure: ${JSON.stringify(result)}`)
      }

      return weatherResult(result.main)
    } catch (error) {
      console.error('Weather tool error:', error)
      return weatherResult()
    }
  },
})
const session = new LanguageModelSession({
  instructions: 'You are a helpful assistant',
  tools: [weatherTool],
})

export default function IndexScreen() {
  const [result, setResult] = useState('')
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const respond = useCallback(async () => {
    if (!prompt.trim()) {
      Alert.alert('Error', 'Please enter a message')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setResult('')

      session.streamResponse(prompt, token => {
        setResult(token)
      })

      setTimeout(() => {
        setLoading(false)
      }, 2000)
    } catch (err) {
      console.error('Error during streaming:', err)

      let errorMessage = 'An unexpected error occurred'

      if (isAppleAIError(err)) {
        errorMessage = `${err.code}: ${err.message}`
        if (err.details) {
          console.error('Error details:', err.details)
        }
      } else if (err instanceof Error) {
        errorMessage = err.message
      } else if (typeof err === 'string') {
        errorMessage = err
      }

      setError(errorMessage)
      setResult('')

      Alert.alert('Error', errorMessage)
    }
  }, [prompt])

  return (
    <View style={styles.container}>
      <View style={{ paddingBottom: 20 }}>
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <Text style={styles.title}>{result}</Text>
        )}
      </View>

      {loading && (
        <View style={{ height: 40, paddingBottom: 20 }}>
          <ActivityIndicator size="small" />
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          value={prompt}
          onChangeText={text => {
            setPrompt(text)
            if (error) setError(null)
          }}
          style={styles.input}
          placeholder="Ask about the weather..."
          editable={!loading}
        />
        <TouchableOpacity
          onPress={() => respond()}
          disabled={loading || !prompt.trim()}
          style={[styles.button, (loading || !prompt.trim()) && styles.buttonDisabled]}
        >
          <Text
            style={[
              styles.buttonText,
              (loading || !prompt.trim()) && styles.buttonTextDisabled,
            ]}
          >
            {loading ? '...' : 'Send'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 16,
    paddingBottom: 60,
  },
  title: {
    fontSize: 18,
    paddingVertical: 6,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    borderRadius: 8,
    padding: 12,
    marginVertical: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 16,
    fontWeight: '500',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  inputContainer: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e3e3e3',
    borderRadius: 100,
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: 'dodgerblue',
    borderRadius: 100,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  buttonTextDisabled: {
    color: '#888',
  },
})
