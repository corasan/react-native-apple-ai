import { ConfigPlugin, withDangerousMod, withXcodeProject } from '@expo/config-plugins';
import { GenerableCLI } from './cli.node.';

export interface GenerablePluginOptions {
  configPath?: string;
}

const withGenerablePlugin: ConfigPlugin<GenerablePluginOptions> = (
  config
) => {
  const frameworkConfig = withXcodeProject(config, (conf) => {
    const xcodeProject = conf.modResults
    const frameworksGroup = xcodeProject.pbxGroupByName("Frameworks");
    const hasFramework = frameworksGroup.children.some(
        (child: any) => child.comment === 'FoundationModels.framework'
      );
      if (!hasFramework) {
        xcodeProject.addFramework('FoundationModels.framework');
      }
      return conf
  })
  return withDangerousMod(frameworkConfig, [
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
