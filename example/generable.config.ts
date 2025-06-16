import type { GenerableConfig } from 'react-native-foundation-models'

const config: GenerableConfig = {
  schemas: [
    {
      name: 'User',
      description: 'User profile data model for the example app',
      properties: {
        id: {
          type: 'string',
          required: true,
          description: 'Unique user identifier',
        },
        email: {
          type: 'string',
          required: true,
          constraints: {
            pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
          },
          description: 'User email address',
        },
        name: {
          type: 'string',
          required: true,
          constraints: {
            minLength: 2,
            maxLength: 50,
          },
          description: 'User display name',
        },
        age: {
          type: 'number',
          required: false,
          constraints: {
            min: 13,
            max: 120,
          },
          description: 'User age in years',
        },
        isActive: {
          type: 'boolean',
          required: true,
          description: 'Whether the user account is active',
        },
        avatar: {
          type: 'string',
          required: false,
          description: 'User avatar image URL',
        },
        preferences: {
          type: 'object',
          required: false,
          description: 'User preferences as key-value pairs',
        },
      },
    },
    {
      name: 'Post',
      description: 'Social media post model',
      properties: {
        id: {
          type: 'string',
          required: true,
          description: 'Post identifier',
        },
        userId: {
          type: 'string',
          required: true,
          description: 'ID of the user who created the post',
        },
        title: {
          type: 'string',
          required: true,
          constraints: {
            minLength: 1,
            maxLength: 200,
          },
          description: 'Post title',
        },
        content: {
          type: 'string',
          required: true,
          constraints: {
            minLength: 1,
            maxLength: 2000,
          },
          description: 'Post content',
        },
        imageUrls: {
          type: 'array',
          required: false,
          items: {
            type: 'string',
          },
          description: 'Array of image URLs attached to the post',
        },
        likesCount: {
          type: 'number',
          required: true,
          constraints: {
            min: 0,
          },
          description: 'Number of likes on the post',
        },
        isPublished: {
          type: 'boolean',
          required: true,
          description: 'Whether the post is published',
        },
        tags: {
          type: 'array',
          required: false,
          items: {
            type: 'string',
          },
          description: 'Post tags for categorization',
        },
      },
    },
    {
      name: 'Settings',
      description: 'App settings configuration',
      properties: {
        theme: {
          type: 'string',
          required: true,
          constraints: {
            enum: ['light', 'dark', 'auto'],
          },
          description: 'App theme preference',
        },
        notifications: {
          type: 'boolean',
          required: true,
          description: 'Whether notifications are enabled',
        },
        language: {
          type: 'string',
          required: true,
          constraints: {
            enum: ['en', 'es', 'fr', 'de', 'pt'],
          },
          description: 'App language setting',
        },
        fontSize: {
          type: 'number',
          required: true,
          constraints: {
            min: 12,
            max: 24,
          },
          description: 'Text font size preference',
        },
        autoSync: {
          type: 'boolean',
          required: true,
          description: 'Whether to automatically sync data',
        },
      },
    },
  ],
  outputPath: 'ios/Generated',
  moduleName: 'ExampleModels',
}

export default config
