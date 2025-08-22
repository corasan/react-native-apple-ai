import { useState } from 'react'
import { ActivityIndicator, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { createTool, LanguageModelSession } from 'react-native-apple-ai'
import { z } from 'zod'
import { Text, View } from '@/components/Themed'

const WEATHER_API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY
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
  implementation: async args => {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${args.city}&units=imperial&APPID=${WEATHER_API_KEY}`
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
      return {
        temperature: 0,
        humidity: 0,
        precipitation: 0,
        units: 'imperial',
      }
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

  const respond = async () => {
    try {
      setLoading(true)
      setResult('')
      session.streamResponse(prompt, token => {
        setResult(token)
      })
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={{ paddingBottom: 20 }}>
        <Text style={styles.title}>{result}</Text>
      </View>

      <View style={{ height: 40 }}>{loading && <ActivityIndicator size="small" />}</View>

      <View style={styles.inputContainer}>
        <TextInput value={prompt} onChangeText={setPrompt} style={styles.input} />
        <TouchableOpacity onPress={() => respond()}>
          <View style={styles.button}>
            <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>Send</Text>
          </View>
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
    paddingVertical: 10,
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
    padding: 8,
  },
})
