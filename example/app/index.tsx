import { Text, View } from '@/components/Themed'
import { useState } from 'react'
import { Button, StyleSheet } from 'react-native'
import { FoundationModels } from 'react-native-foundation-models'

export default function IndexScreen() {
  const [result, setResult] = useState('')
  const respond = async () => {
    try {
      const res = await FoundationModels.respond('User', 'Generate a cool user')
      setResult(res)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>{FoundationModels.hello('Nitro Developer')}</Text>
      <Text style={styles.title}>2 + 2 is {FoundationModels.add(2, 2)}</Text> */}

      <Text style={styles.title}>{result}</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <Button title="Click Me" onPress={() => respond()} />
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
    fontSize: 20,
    fontWeight: 'bold',
    paddingVertical: 10,
    textAlign: 'center',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
})
