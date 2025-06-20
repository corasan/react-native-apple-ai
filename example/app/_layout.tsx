import 'expo-dev-client'
import 'react-native-reanimated'
import { useColorScheme } from '@/components/useColorScheme'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { ToolBridge } from 'react-native-apple-ai'
export { ErrorBoundary } from 'expo-router'

const options = {
  method: 'GET',
  headers: { accept: 'application/json', 'accept-encoding': 'deflate, gzip, br' },
}

const WEATHER_API_KEY = process.env.EXPO_PUBLIC_WEATHER_API_KEY

ToolBridge.registerJSFunction('getWeatherByCity', async args => {
  const url = `https://api.tomorrow.io/v4/weather/realtime?location=${args.city}&apikey=${WEATHER_API_KEY}`
  const res = await fetch(url, options)
  const result = await res.json()
  const data = result.data.values

  return {
    temperature: data.temperature,
    humidity: data.humidity,
    precipitation: data.precipitationProbability,
  }
})

export default function RootLayout() {
  const colorScheme = useColorScheme()

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  )
}
