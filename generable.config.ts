import { GenerableConfig } from './package/src/types';

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
            enum: ['electronics', 'clothing', 'books', 'home', 'other']
          },
          description: 'Product category'
        },
        inStock: {
          type: 'boolean',
          required: true,
          description: 'Product availability status'
        }
      }
    }
  ],
  outputPath: 'example/ios/Generated',
  moduleName: 'FoundationModels'
};

export default config;
