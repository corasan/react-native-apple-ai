# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a React Native Nitro module that provides Apple Foundation Models integration for React Native applications. The project uses a workspace structure with the main package implementation and an example Expo app.

IMPORTANT: Always use context7 for up to date documentation

## Project Structure

- **Root workspace**: Contains scripts for building, linting, and releasing
- **`package/`**: Main Nitro module source code and native implementations
- **`example/`**: Expo example app demonstrating the module usage
- **`package/src/specs/`**: Nitro interface definitions (`.nitro.ts` files)
- **`package/ios/`**: Native Swift implementations of Nitro modules
- **`package/nitrogen/generated/`**: Auto-generated Nitro bridge code

## Development Commands

### Building and Development
- `bun typescript` - Type check the package without emitting files
- `bun build` - Build the package (runs from package directory)
- `bun specs` - Generate Nitro bindings using nitro-codegen
- `bun specs:pod` - Generate specs and install iOS pods
- `bun clean` - Remove build artifacts and node_modules

### Example App
- `cd example && npm run ios` - Run example on iOS
- `cd example && npm run android` - Run example on Android
- `cd example && npm run prebuild` - Generate native code for Expo
- `cd example && npm run pod` - Install iOS CocoaPods

### Release
- `bun release` - Create a new release (runs build and specs before releasing)

## Architecture

### Nitro Module System
This project uses React Native Nitro Modules, which provides:
- Type-safe native bridge interfaces defined in `.nitro.ts` files
- Automatic code generation for Swift/Kotlin implementations
- Hybrid objects that can hold native state

### Core Interfaces
- **FoundationModels**: Main interface for AI model interactions with streaming support
- **Tool**: Hybrid object representing AI tools with name, description, and arguments
- **ToolFactory/ToolBridge**: Factory pattern for creating and managing tools
- **LanguageModelSessionFactory**: Factory for creating language model sessions

### Nitro Configuration
The `package/nitro.json` file configures:
- C++ namespace: `rnappleai`
- iOS module name: `RNAppleAI`
- Native class mappings for autolinking
- Android namespace and library name

### Native Implementation
Swift files in `package/ios/` implement the Nitro interfaces:
- `HybridFoundationModels.swift` - Main Foundation Models implementation
- `HybridTool.swift` - Tool hybrid object implementation
- `FMLanguageModelSession.swift` - Language model session management
- `ToolBridge.swift` - Tool bridge for communication

## Important Notes

- Always run `bun specs` after modifying `.nitro.ts` interface files to regenerate bindings
- The project uses Bun as the package manager and task runner
- iOS CocoaPods installation is required for iOS development (`bun specs:pod`)
- The example app uses Expo with custom dev client for native module testing
- Generated code in `nitrogen/generated/` should not be manually edited

## Testing

Run type checking before committing:
```bash
bun typescript
```

For iOS development, ensure pods are installed:
```bash
bun specs:pod
```
