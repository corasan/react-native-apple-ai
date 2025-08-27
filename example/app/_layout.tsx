import 'expo-dev-client'
import 'react-native-reanimated'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Tabs } from 'expo-router'
import { useColorScheme } from '@/components/useColorScheme'

export { ErrorBoundary } from 'expo-router'

export default function RootLayout() {
  const colorScheme = useColorScheme()

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Tabs>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Original',
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="streaming-demo"
          options={{
            title: 'Streaming',
            headerShown: false,
          }}
        />
      </Tabs>
    </ThemeProvider>
  )
}
