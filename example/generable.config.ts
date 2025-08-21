import type { GenerableConfig } from 'react-native-apple-ai'

const config: GenerableConfig = {
  schemas: [
    // {
    //   name: 'User',
    //   properties: {
    //     id: {
    //       type: 'string',
    //       guide: {
    //         description: 'Unique user identifier',
    //       },
    //     },
    //     email: {
    //       type: 'string',
    //       guide: {
    //         description: 'User email address',
    //       },
    //     },
    //     name: {
    //       type: 'string',
    //       guide: {
    //         description: 'User display name',
    //       },
    //     },
    //     age: {
    //       type: 'number',
    //       guide: {
    //         description: 'User age in years',
    //       },
    //     },
    //     isActive: {
    //       type: 'boolean',
    //       guide: {
    //         description: 'Whether the user account is active',
    //       },
    //     },
    //   },
    // },
  ],
  // tools: [
  //   {
  //     name: 'Weather',
  //     description: 'A tool to get the weather details based on the city',
  //     functionName: 'getWeatherByCity',
  //     arguments: {
  //       city: {
  //         type: 'string',
  //         guide: {
  //           description: 'The city to fetch the weather from',
  //         },
  //       },
  //     },
  //     resultSchema: {
  //       humidity: {
  //         type: 'number',
  //       },
  //       temperature: {
  //         type: 'number',
  //       },
  //       precipitation: {
  //         type: 'number',
  //       },
  //     },
  //   },
  // ],
  outputPath: 'ios/Generated',
  moduleName: 'Generables',
}

export default config
