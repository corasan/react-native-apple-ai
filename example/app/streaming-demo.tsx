import { useCallback, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import {
  createTool,
  LanguageModelSession,
  useStreamingResponse,
} from 'react-native-apple-ai'
import { z } from 'zod'
import { Text, View } from '@/components/Themed'
import { weatherResult } from '@/utils/weatherResult'

const WEATHER_API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather?units=imperial'
const options = {
  method: 'GET',
  headers: { accept: 'application/json', 'accept-encoding': 'deflate, gzip, br' },
}

const weatherTool = createTool({
  name: 'weather_tool',
  description: 'A weather tool that can get current weather information for any city.',
  arguments: z.object({
    city: z.string(),
  }),
  handler: async args => {
    try {
      const url = `${BASE_URL}&q=${args.city}&APPID=${WEATHER_API_KEY}`
      const res = await fetch(url, options)
      const result = await res.json()

      if (!result.main) {
        throw new Error(`Invalid API response structure: ${JSON.stringify(result)}`)
      }

      return {
        temperature: result.main.temp,
        humidity: result.main.humidity || 0,
        precipitation: result.weather?.[0]?.description || 'Unknown',
        units: 'imperial',
      }
    } catch (error) {
      console.error('Weather tool error:', error)
      return weatherResult()
    }
  },
})

const session = new LanguageModelSession({
  instructions:
    'You are a helpful assistant. When users ask about weather, use the weather tool to get current information.',
  tools: [weatherTool],
})

export default function StreamingDemoScreen() {
  const [prompt, setPrompt] = useState('')

  const { response, isStreaming, error, streamResponse, reset } =
    useStreamingResponse(session)

  const respond = useCallback(async () => {
    if (!prompt.trim()) {
      Alert.alert('Error', 'Please enter a message')
      return
    }
    try {
      await streamResponse(prompt)
    } catch (err) {
      console.error('Error during streaming:', err)
    }
  }, [prompt, streamResponse])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{response}</Text>

      <View style={{ height: 40 }}>
        {isStreaming && <ActivityIndicator size="small" />}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          value={prompt}
          onChangeText={text => {
            setPrompt(text)
            if (error) reset() // Clear error when user starts typing
          }}
          style={styles.input}
          placeholder="Ask about the weather..."
          editable={!isStreaming}
        />
        <TouchableOpacity
          onPress={() => respond()}
          disabled={isStreaming || !prompt.trim()}
          style={[
            styles.button,
            (isStreaming || !prompt.trim()) && styles.buttonDisabled,
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              (isStreaming || !prompt.trim()) && styles.buttonTextDisabled,
            ]}
          >
            {isStreaming ? '...' : 'Send'}
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
  },
  title: {
    fontSize: 18,
    paddingVertical: 10,
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
