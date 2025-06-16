import { GenerableConfig, GenerableSchema } from './types';
import { existsSync } from 'node:fs';
import { resolve } from 'path';

export class ConfigLoader {
  private configPath: string;

  constructor(configPath = 'generable.config.ts') {
    this.configPath = configPath;
  }

  loadConfig(): GenerableConfig {
    const fullPath = resolve(process.cwd(), this.configPath);

    if (!existsSync(fullPath)) {
      throw new Error(`Configuration file not found: ${fullPath}`);
    }

    try {
      delete require.cache[require.resolve(fullPath)];
      const config = require(fullPath);
      return config.default || config;
    } catch (error) {
      throw new Error(`Failed to load configuration: ${error}`);
    }
  }

  validateConfig(config: GenerableConfig): void {
    if (!config.schemas || !Array.isArray(config.schemas)) {
      throw new Error('Configuration must have a schemas array');
    }

    config.schemas.forEach((schema, index) => {
      if (!schema.name) {
        throw new Error(`Schema at index ${index} must have a name`);
      }
      if (!schema.properties || typeof schema.properties !== 'object') {
        throw new Error(`Schema '${schema.name}' must have properties object`);
      }
    });
  }
}

export const defaultConfig: GenerableConfig = {
  schemas: [],
  outputPath: 'ios/Generated',
  moduleName: 'FoundationModels'
};

export function createExampleConfig(): GenerableConfig {
  const userSchema: GenerableSchema = {
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
  };

  const productSchema: GenerableSchema = {
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
  };

  return {
    schemas: [userSchema, productSchema],
    outputPath: 'ios/Generated',
    moduleName: 'FoundationModels'
  };
}
