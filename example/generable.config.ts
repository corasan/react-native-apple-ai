import type { GenerableConfig } from 'react-native-foundation-models'

const config: GenerableConfig = {
  schemas: [
    {
      name: 'User',
      properties: {
        id: {
          type: 'string',
          guide: {
            description: 'Unique user identifier',
          },
        },
        email: {
          type: 'string',
          guide: {
            description: 'User email address',
          },
        },
        name: {
          type: 'string',
          guide: {
            description: 'User display name',
          },
        },
        age: {
          type: 'number',
          guide: {
            description: 'User age in years',
          },
        },
        isActive: {
          type: 'boolean',
          guide: {
            description: 'Whether the user account is active',
          },
        },
        tags: {
          type: 'array',
          guide: {
            description: 'User tags or categories',
          },
        },
      },
    },
    {
      name: 'Product',
      properties: {
        id: {
          type: 'string',
          guide: {
            description: 'Product identifier',
          },
        },
        title: {
          type: 'string',
          guide: {
            description: 'Product title',
          },
        },
        price: {
          type: 'number',
          guide: {
            description: 'Product price',
          },
        },
        category: {
          type: 'string',
          guide: {
            description: 'Product category',
          },
        },
        inStock: {
          type: 'boolean',
          guide: {
            description: 'Product availability status',
          },
        },
      },
    },
  ],
  outputPath: 'ios/example/Generated',
  moduleName: 'RNFoundationModels',
}

export default config
