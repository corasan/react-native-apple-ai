# react-native-apple-ai

React Native Nitro module for Apple's Foundation Models (Apple Intelligence). Enables AI capabilities in React Native applications using Apple's on-device model, with tool calling support and streaming responses on iOS 26.0+.

## Requirements

- iOS 26.0 or later
- Apple Intelligence enabled in Settings > Apple Intelligence & Siri
- Compatible Apple devices (Apple Silicon Macs, recent iPhones/iPads)
- React Native with Nitro modules support

## Installation

```sh
npm install react-native-apple-ai react-native-nitro-modules
yarn add react-native-apple-ai react-native-nitro-modules
bun add react-native-apple-ai react-native-nitro-modules
```

## Usage

### Basic Chat Session

```typescript
import { LanguageModelSession } from 'react-native-apple-ai';

const session = new LanguageModelSession({
  instructions: 'You are a helpful assistant'
});

// Stream responses
await session.streamResponse('Hello, how are you?', (response) => {
  console.log('Streaming response:', response);
});
```

### Using React Hooks

```typescript
import { useLanguageModel } from 'react-native-apple-ai';

function ChatComponent() {
  const { send, response, loading, error, isSessionReady } = useLanguageModel({
    instructions: 'You are a helpful coding assistant',
    onResponse: (response) => console.log('Got response:', response),
    onError: (error) => console.error('Error:', error)
  });

  const handleSendMessage = async () => {
    if (isSessionReady) {
      await send('Explain React hooks');
    }
  };

  return (
    <View>
      <Text>{response}</Text>
      <Button onPress={handleSendMessage} disabled={loading} title="Send" />
    </View>
  );
}
```

### Tool calling

```typescript
import { createTool, LanguageModelSession } from 'react-native-apple-ai';
import { z } from 'zod';

const weatherTool = createTool({
  name: 'weather_tool',
  description: 'Get current weather for a city',
  arguments: z.object({
    city: z.string(),
  }),
  handler: async (args) => {
    const response = await fetch(`/weather?city=${args.city}`);
    const res = await response.json();
    return res.data
  },
});

const session = new LanguageModelSession({
  instructions: 'You are a weather assistant',
  tools: [weatherTool]
});
```

## API Reference

### `LanguageModelSession`

Core class for managing AI conversations.

```typescript
constructor(config?: {
  instructions?: string;
  tools?: Tool[];
})
```

### `useLanguageModel(config)`

React hook for session management with automatic lifecycle handling.

Returns:
- `session` - The current session instance
- `response` - Latest AI response
- `loading` - Whether a request is in progress
- `error` - Any error that occurred
- `send(prompt)` - Send a message to the AI
- `reset()` - Reset the conversation state
- `isSessionReady` - Whether the session is ready to use

### `useStreamingResponse(session)`

Lower-level hook for streaming responses.

### `checkFoundationModelsAvailability()`

Check if Apple Intelligence is available on the device.

## Development

This project uses a workspace structure with:
- `package/` - The nitro module source code
- `example/` - Example app demonstrating usage

### Setup

```sh
bun install
bun run build
```

### Running the example

```sh
cd example
bun start    # Start Expo dev server
bun ios      # Run on iOS
```

Note: Android is not supported as this module requires Apple's Foundation Models framework.
