import type { GenerableConfig } from './src/types'

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
        preferences: {
          type: 'object',
          guide: {
            description: 'User preferences as key-value pairs',
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
        description: {
          type: 'string',
          guide: {
            description: 'Product description',
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
        images: {
          type: 'array',
          guide: {
            description: 'Product image URLs',
          },
        },
        specifications: {
          type: 'object',
          guide: {
            description: 'Product specifications as key-value pairs',
          },
        },
      },
    },
    {
      name: 'Order',
      properties: {
        id: {
          type: 'string',
          guide: {
            description: 'Order identifier',
          },
        },
        userId: {
          type: 'string',
          guide: {
            description: 'User who placed the order',
          },
        },
        productIds: {
          type: 'array',
          guide: {
            description: 'List of product IDs in the order',
          },
        },
        total: {
          type: 'number',
          guide: {
            description: 'Total order amount',
          },
        },
        status: {
          type: 'string',
          guide: {
            description: 'Order status',
          },
        },
        isPaid: {
          type: 'boolean',
          guide: {
            description: 'Payment status',
          },
        },
        metadata: {
          type: 'object',
          guide: {
            description: 'Additional order metadata',
          },
        },
      },
    },
  ],
  outputPath: 'ios/Generated',
  moduleName: 'FoundationModels',
}

export default config
