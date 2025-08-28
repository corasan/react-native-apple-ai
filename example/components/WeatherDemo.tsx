import { useCallback, useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import { Text, View } from '@/components/Themed'

interface WeatherDemoProps {
  response: string
  isLoading: boolean
  error?: any
  onSubmit: (prompt: string) => Promise<void> | void
  onReset?: () => void
}

export function WeatherDemo({
  response,
  isLoading,
  error,
  onSubmit,
  onReset,
}: WeatherDemoProps) {
  const [prompt, setPrompt] = useState('')

  const respond = useCallback(async () => {
    if (!prompt.trim()) {
      Alert.alert('Error', 'Please enter a message')
      return
    }
    try {
      await onSubmit(prompt)
    } catch (err) {
      console.error('Error during response:', err)
    }
  }, [prompt, onSubmit])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{response}</Text>

      <View style={{ height: 40 }}>
        {isLoading && <ActivityIndicator size="small" />}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          value={prompt}
          onChangeText={text => {
            setPrompt(text)
            if (error && onReset) onReset()
          }}
          style={styles.input}
          placeholder="Ask about the weather..."
          editable={!isLoading}
        />
        <TouchableOpacity
          onPress={() => respond()}
          disabled={isLoading || !prompt.trim()}
          style={[styles.button, (isLoading || !prompt.trim()) && styles.buttonDisabled]}
        >
          <Text
            style={[
              styles.buttonText,
              (isLoading || !prompt.trim()) && styles.buttonTextDisabled,
            ]}
          >
            {isLoading ? '...' : 'Send'}
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
