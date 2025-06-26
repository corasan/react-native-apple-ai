import { useState } from 'react'
import { ActivityIndicator, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { FoundationModels } from 'react-native-apple-ai'
import { Text, View } from '@/components/Themed'

// FoundationModels.initialize('You are a helpful assistant')

export default function IndexScreen() {
  const [result, setResult] = useState('')
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)

  const respond = async () => {
    try {
      setLoading(true)
      // await FoundationModels.streamResponse(prompt, stream => {
      //   setResult(stream)
      // })
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
