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
      },
    },
  ],
  outputPath: 'ios/Generated',
  moduleName: 'Generables',
}

export default config
