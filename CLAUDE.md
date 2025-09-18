# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native Nitro module that provides access to Apple's Foundation Models (Apple Intelligence) for iOS 26.0+. The project exposes Apple's on-device language model capabilities to React Native applications, enabling AI features with support for tool calling and streaming responses.

## Architecture

### Workspace Structure
- `package/` - The main Nitro module source code and native bindings
- `example/` - Demo Expo app showcasing the module's capabilities
- Root contains workspace configuration for both packages

### Core Components

**Main Module (`package/src/`)**:
- `LanguageModelSession.ts` - Core class that manages AI sessions and interfaces with native code
- `hooks/useLanguageModel.ts` - React hook providing session lifecycle management and error handling
- `hooks/useStreamingResponse.ts` - Lower-level hook for streaming AI responses
- `types.ts` - TypeScript definitions including tool schemas and availability statuses
- `tool-utils.ts` - Utilities for creating and managing AI tools
- `errors.ts` - Custom error types for Apple AI integration
- `specs/LanguageModelSession.nitro.ts` - Nitro interface specifications

**Native Integration**:
- Uses Nitro modules for React Native-to-native bridging
- iOS implementation connects to Apple's Foundation Models framework
- Requires iOS 18.2+ and Apple Intelligence enabled

## Common Development Commands

### Build and Development
```bash
# Install dependencies for all workspaces
bun install

# Build the module
bun run build

# Type checking
bun run typecheck

# Generate Nitro specs
bun specs

# Generate Nitro specs and install iOS pods
bun specs:pod

# Clean build artifacts
bun run clean
```

### Example App Development
```bash
cd example

# Start Expo development server
bun start
# or
npm run start

# Run on iOS (requires macOS and Xcode)
bun ios
# or
npm run ios

# Run on Android
bun android
# or
npm run android

# Prebuild for iOS
npm run prebuild:ios

# Install iOS pods
npm run pod
```

### Code Quality
```bash
# Format and lint code with Biome
npx @biomejs/biome format --write .
npx @biomejs/biome lint .
```

## Development Notes

### Tool Integration
The module supports creating custom tools that the AI can invoke during conversations. Tools are defined using Zod schemas and can perform external API calls or other operations. See `example/app/index.tsx` for a weather tool implementation.

### Error Handling
The module includes comprehensive error handling for Apple AI availability states:
- Platform not supported (iOS < 26.0)
- Device not eligible for Apple Intelligence
- Apple Intelligence not enabled in Settings
- Model downloading or not ready

### Session Management
`LanguageModelSession` handles the lifecycle of AI conversations. Sessions can be configured with system instructions and tools. The React hooks provide higher-level abstractions with automatic error handling and state management.

### Native Dependencies
- Requires `react-native-nitro-modules` peer dependency
- iOS implementation uses Swift and integrates with Apple's Foundation Models framework
- Build process generates TypeScript definitions from Nitro specs

### Testing Device Requirements
- iOS 26.0+ physical device or simulator
- Apple Intelligence must be enabled in Settings > Apple Intelligence & Siri
- Compatible hardware (Apple Silicon Macs, newer iPhones/iPads)
