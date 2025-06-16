import { GenerableConfig } from './src/types';

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
        email: {
          type: 'string',
          required: true,
          constraints: {
            pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'
          },
          description: 'User email address'
        },
        name: {
          type: 'string',
          required: true,
          constraints: {
            minLength: 2,
            maxLength: 50
          },
          description: 'User display name'
        },
        age: {
          type: 'number',
          required: false,
          constraints: {
            min: 0,
            max: 150
          },
          description: 'User age in years'
        },
        isActive: {
          type: 'boolean',
          required: true,
          description: 'Whether the user account is active'
        },
        tags: {
          type: 'array',
          required: false,
          items: {
            type: 'string'
          },
          description: 'User tags or categories'
        },
        preferences: {
          type: 'object',
          required: false,
          description: 'User preferences as key-value pairs'
        }
      }
    },
    {
      name: 'Product',
      description: 'Product information model',
      properties: {
        id: {
          type: 'string',
          required: true,
          description: 'Product identifier'
        },
        title: {
          type: 'string',
          required: true,
          constraints: {
            minLength: 1,
            maxLength: 100
          },
          description: 'Product title'
        },
        description: {
          type: 'string',
          required: false,
          constraints: {
            maxLength: 500
          },
          description: 'Product description'
        },
        price: {
          type: 'number',
          required: true,
          constraints: {
            min: 0
          },
          description: 'Product price'
        },
        category: {
          type: 'string',
          required: true,
          constraints: {
            enum: ['electronics', 'clothing', 'books', 'home', 'sports', 'other']
          },
          description: 'Product category'
        },
        inStock: {
          type: 'boolean',
          required: true,
          description: 'Product availability status'
        },
        images: {
          type: 'array',
          required: false,
          items: {
            type: 'string'
          },
          description: 'Product image URLs'
        },
        specifications: {
          type: 'object',
          required: false,
          description: 'Product specifications as key-value pairs'
        }
      }
    },
    {
      name: 'Order',
      description: 'Order information model',
      properties: {
        id: {
          type: 'string',
          required: true,
          description: 'Order identifier'
        },
        userId: {
          type: 'string',
          required: true,
          description: 'User who placed the order'
        },
        productIds: {
          type: 'array',
          required: true,
          items: {
            type: 'string'
          },
          description: 'List of product IDs in the order'
        },
        total: {
          type: 'number',
          required: true,
          constraints: {
            min: 0
          },
          description: 'Total order amount'
        },
        status: {
          type: 'string',
          required: true,
          constraints: {
            enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
          },
          description: 'Order status'
        },
        isPaid: {
          type: 'boolean',
          required: true,
          description: 'Payment status'
        },
        metadata: {
          type: 'object',
          required: false,
          description: 'Additional order metadata'
        }
      }
    }
  ],
  outputPath: 'ios/Generated',
  moduleName: 'FoundationModels'
};

export default config;
