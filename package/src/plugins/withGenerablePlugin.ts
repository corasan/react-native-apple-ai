import { ConfigPlugin, withXcodeProject } from '@expo/config-plugins';
import { SwiftCode } from './SwiftCode';
import { withBuildSourceFile } from '@expo/config-plugins/build/ios/XcodeProjectFile'

export interface GenerablePluginOptions {
  configPath?: string;
}

const swiftCode = new SwiftCode();
const res = swiftCode.generate();

const withGenerablePlugin: ConfigPlugin = (
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

  config = withBuildSourceFile(frameworkConfig, {
    filePath: 'Generables.swift',
    contents: res,
    overwrite: true
  })
  return config
};

export default withGenerablePlugin;
