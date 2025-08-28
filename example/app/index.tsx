import { useCallback, useState } from 'react'
import { createTool, LanguageModelSession } from 'react-native-apple-ai'
import { z } from 'zod'
import { WeatherDemo } from '@/components/WeatherDemo'
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
  const [loading, setLoading] = useState(false)

  const handleSubmit = useCallback(async (prompt: string) => {
    setLoading(true)
    setResult('')

    session.streamResponse(prompt, token => {
      setResult(token)
    })

    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }, [])

  return <WeatherDemo response={result} isLoading={loading} onSubmit={handleSubmit} />
}
