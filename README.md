# react-native-apple-ai

Foundation Models implementation for React Native.

## Installation

```sh
npm install react-native-apple-ai
```

## Usage

```javascript
import { FoundationModelsSpec } from 'react-native-apple-ai';
import { NitroModules } from 'react-native-nitro-modules';

const FoundationModels = NitroModules.create<FoundationModelsSpec>('FoundationModels');

const result = FoundationModels.hello('World');
console.log(result);
```

## API

### `hello(name: string): string`

Returns a greeting message.

### `add(a: number, b: number): number`

Adds two numbers and returns the result.

## Development

This project uses a workspace structure with:
- `package/` - The nitro module source code
- `example/` - Example app demonstrating usage

### Setup

```sh
npm install
npm run build
```

### Running the example

```sh
cd example
npm run ios
# or
npm run android
```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository.

## License

MIT
