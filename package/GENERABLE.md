# Foundation Models Generation System

A Swift code generation system for React Native that creates `@Generable` structs from TypeScript schema definitions.

## Overview

This system allows you to define your data models once in TypeScript and automatically generate corresponding Swift structs with the `@Generable` macro. This ensures type safety across the JavaScript-Swift boundary in React Native applications.

## Quick Start

### 1. Create Configuration

Create a `generable.config.ts` file in your project root:

```typescript
import { GenerableConfig } from 'react-native-foundation-models';

const config: GenerableConfig = {
  schemas: [
    {
      name: 'User',
      description: 'User profile data model',
      properties: {
        id: {
          type: 'string',
          required: true,
          description: 'Unique user identifier'
        },
        name: {
          type: 'string',
          required: true,
          constraints: {
            minLength: 2,
            maxLength: 50
          }
        },
        age: {
          type: 'number',
          required: false,
          constraints: {
            min: 0,
            max: 150
          }
        },
        isActive: {
          type: 'boolean',
          required: true
        }
      }
    }
  ],
  outputPath: 'ios/example/Generated',
  moduleName: 'FoundationModels'
};

export default config;
```

### 2. Generate Swift Code

Run the generator:

```bash
npm run generate
```

This creates Swift structs in your iOS project:

```swift
import Foundation

/// User profile data model
@Generable
struct User {
  /// Unique user identifier
  var id: String

  /// Length: 2 - 50
  var name: String

  /// Range: 0 - 150
  var age: Double?

  var isActive: Bool
}
```

## Configuration

### Schema Definition

Each schema defines a Swift struct with the following properties:

- `name`: The struct name
- `description`: Optional documentation
- `properties`: Object defining struct properties

### Property Types

Supported property types and their Swift mappings:

| TypeScript | Swift | Example |
|------------|-------|---------|
| `string` | `String` | `"hello"` |
| `number` | `Double` | `42.0` |
| `boolean` | `Bool` | `true` |
| `array` | `[Type]` | `["a", "b"]` |
| `object` | `Dictionary<String, Any>` | `{"key": "value"}` |

### Property Configuration

```typescript
{
  type: 'string',
  required: true,           // Optional property if false
  description: 'Field docs',
  constraints: {
    minLength: 2,          // String minimum length
    maxLength: 50,         // String maximum length
    min: 0,                // Number minimum value
    max: 100,              // Number maximum value
    pattern: '^[A-Z]+$',   // Regex pattern
    enum: ['a', 'b', 'c']  // Allowed values
  }
}
```

### Array Properties

```typescript
{
  type: 'array',
  items: {
    type: 'string'  // Array element type
  }
}
```

## Build Integration

### Automatic Generation

Add to your `package.json`:

```json
{
  "scripts": {
    "prebuild": "npm run generate"
  }
}
```

### Expo Plugin

For Expo projects, add to `app.config.js`:

```javascript
export default {
  plugins: [
    ['react-native-foundation-models/plugin', {
      configPath: 'generable.config.ts'
    }]
  ]
};
```

## CLI Usage

```bash
# Generate using default config
npm run generate

# Development mode (TypeScript)
npm run generate:dev
```

## Example Schemas

### User Model
```typescript
{
  name: 'User',
  properties: {
    id: { type: 'string', required: true },
    email: {
      type: 'string',
      required: true,
      constraints: { pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$' }
    },
    profile: { type: 'object', required: false }
  }
}
```

### Product Model
```typescript
{
  name: 'Product',
  properties: {
    id: { type: 'string', required: true },
    price: {
      type: 'number',
      required: true,
      constraints: { min: 0 }
    },
    category: {
      type: 'string',
      required: true,
      constraints: { enum: ['electronics', 'books', 'clothing'] }
    },
    tags: {
      type: 'array',
      items: { type: 'string' }
    }
  }
}
```

## Generated Output

The system generates clean, documented Swift code:

```swift
import Foundation

/// User profile data model
@Generable
struct User {
  /// Unique user identifier
  var id: String

  /// Pattern: ^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$
  var email: String

  var profile: Dictionary<String, Any>?
}

/// Product information model
@Generable
struct Product {
  var id: String

  /// Range: 0 - unlimited
  var price: Double

  /// Allowed values: electronics, books, clothing
  var category: String

  var tags: [String]?
}
```

## Configuration Options

```typescript
interface GenerableConfig {
  schemas: GenerableSchema[];    // Array of schema definitions
  outputPath?: string;           // Output directory (default: 'ios/Generated')
  moduleName?: string;           // Module name (default: 'FoundationModels')
}
```

## Best Practices

1. **Keep schemas simple**: Focus on data transfer objects
2. **Use constraints**: Document validation rules for better Swift code
3. **Consistent naming**: Use PascalCase for struct names, camelCase for properties
4. **Version control**: Include generated files in version control
5. **Validation**: Run generation as part of CI/CD pipeline

## Troubleshooting

### Configuration not found
Ensure `generable.config.ts` exists in your project root.

### TypeScript errors
Make sure all required properties are defined in your schemas.

### Generated code issues
Check that your property types map correctly to Swift types.

### Build integration
Verify the output path exists and is included in your Xcode project.
