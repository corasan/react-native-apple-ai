import { ConfigPlugin, withDangerousMod } from '@expo/config-plugins';
import { GenerableCLI } from './cli';

export interface GenerablePluginOptions {
  configPath?: string;
}

const withGenerablePlugin: ConfigPlugin<GenerablePluginOptions> = (
  config
) => {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const cli = new GenerableCLI();

      try {
        await cli.run();
      } catch (error) {
        console.warn('Generable plugin failed:', error);
      }

      return config;
    }
  ]);
};

export default withGenerablePlugin;
