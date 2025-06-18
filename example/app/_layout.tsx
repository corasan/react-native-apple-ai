import 'expo-dev-client'
import 'react-native-reanimated'
import { useColorScheme } from '@/components/useColorScheme'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { ToolBridge } from 'react-native-apple-ai'
export { ErrorBoundary } from 'expo-router'

ToolBridge.registerJSFunction('fetchFromServer', () => {
  console.log('Calling registered JS function')
  return { name: 'Henry', lastname: 'Paulino' }
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
