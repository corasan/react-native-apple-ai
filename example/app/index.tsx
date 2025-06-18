import { Text, View } from '@/components/Themed'
import { useState } from 'react'
import { Button, StyleSheet } from 'react-native'
import { FoundationModels } from 'react-native-apple-ai'

export default function IndexScreen() {
  const [result, setResult] = useState('')
  const respond = async () => {
    try {
      FoundationModels.initialize('You are a helpful assistant')
      await FoundationModels.streamResponse('Get the contact name for Henry', stream => {
        setResult(stream)
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{result}</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Button title="Respond" onPress={() => respond()} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    paddingVertical: 10,
    textAlign: 'center',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
})
