import { useState } from 'react'
import { ActivityIndicator, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { LanguageModelSession } from 'react-native-apple-ai'
import type { ToolDefinition } from 'react-native-apple-ai/src/specs/LanguageModelSession.nitro'
import type { AnyMap } from 'react-native-nitro-modules'
import { Text, View } from '@/components/Themed'

const WEATHER_API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY
const options = {
  method: 'GET',
  headers: { accept: 'application/json', 'accept-encoding': 'deflate, gzip, br' },
}

// const weatherTool = ToolFactory.create({
//   name: 'WeatherTool',
//   description: 'A tool to get the weather details based on the city',
//   arguments: {
//     city: {
//       type: 'string',
//     },
//   },
//   action: async () => {
//     // const url = `https://api.tomorrow.io/v4/weather/realtime?location=london&apikey=${WEATHER_API_KEY}`
//     // const res = await fetch(url, options)
//     // const result = await res.json()
//     // const data = result.data.values

//     return {
//       temperature: 0,
//       humidity: 0,
//       precipitation: 0,
//     }
//   },
// })
const weatherTool: ToolDefinition = {
  name: 'weather_tool',
  description: 'A tool to get the weather details based on the city',
  arguments: {
    city: {
      type: 'string',
    },
  },
  implementation: async args => {
    console.log('arguments:', args)

    const url = `https://api.tomorrow.io/v4/weather/realtime?location=london&apikey=${WEATHER_API_KEY}`
    const res = await fetch(url, options)
    const result = await res.json()
    const data = result.data.values

    return {
      temperature: data.temperature,
      humidity: data.humidity,
      precipitation: data.precipitationProbability,
    }
  },
}
const session = new LanguageModelSession({
  instructions: 'You are a helpful assistant',
  tools: [weatherTool],
})

// FoundationModels.initialize('You are a helpful assistant')

export default function IndexScreen() {
  const [result, setResult] = useState('')
  const [prompt, setPrompt] = useState('What is the weather like in tokyo?')
  const [loading, setLoading] = useState(false)

  const respond = async () => {
    try {
      setLoading(true)
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
