---
sidebar_position: 2
---

# Core Concepts

## Language Model Sessions

The `LanguageModelSession` is the core class that manages AI conversations. Each session maintains context and can be configured with:

- **Instructions**: Define the AI's behavior and role
- **Tools**: Custom functions the AI can invoke
- **Streaming**: Real-time response handling

```typescript
import { LanguageModelSession } from 'react-native-apple-ai';

const session = new LanguageModelSession({
  instructions: "You are a helpful coding assistant.",
  tools: [weatherTool, calculatorTool]
});
```

## Apple Intelligence Availability

Before using the module, check if Apple Intelligence is available:

```typescript
import { checkFoundationModelsAvailability } from 'react-native-apple-ai';

const availability = checkFoundationModelsAvailability();
console.log(availability.status); // 'available' or 'unavailable.xxx'
console.log(availability.message); // Human-readable message
```

### Availability States

- `available`: Ready to use
- `unavailable.platformNotSupported`: iOS version too old (requires 26.0+)
- `unavailable.deviceNotEligible`: Device doesn't support Apple Intelligence
- `unavailable.appleIntelligenceNotEnabled`: Not enabled in Settings
- `unavailable.modelNotReady`: Model downloading or not ready
- `unavailable.unknown`: Unknown reason

## Tool Calling

Define custom tools that the AI can invoke during conversations:

```typescript
import { z } from 'zod';
import { createTool } from 'react-native-apple-ai';

const weatherTool = createTool({
  name: 'get_weather',
  description: 'Get current weather for a location',
  schema: z.object({
    location: z.string().describe('The city and state/country'),
    unit: z.enum(['celsius', 'fahrenheit']).optional()
  }),
  handler: async ({ location, unit = 'celsius' }) => {
    // Fetch weather data
    return `Weather in ${location}: 22°${unit === 'celsius' ? 'C' : 'F'}`;
  }
});
```

## Streaming Responses

Handle real-time AI responses as they're generated:

```typescript
session.streamResponse("Tell me a story", (fullResponse: string) => {
  console.log(fullResponse); // Gets called with the complete response so far
});
```

## Error Handling

The module provides specific error types for different failure scenarios:

```typescript
import { AppleAIError, isAppleAIError } from 'react-native-apple-ai';

try {
  await session.streamResponse("Hello", (response) => {
    console.log(response);
  });
} catch (error) {
  if (isAppleAIError(error)) {
    switch (error.code) {
      case 'SESSION_NOT_INITIALIZED':
        // Handle session not ready
        break;
      case 'TOOL_EXECUTION_ERROR':
        // Handle tool execution failure
        break;
      case 'UNSUPPORTED_PLATFORM':
        // Handle platform not supported
        break;
    }
  }
}
```