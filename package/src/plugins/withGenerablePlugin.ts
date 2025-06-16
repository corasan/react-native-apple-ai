import { ConfigPlugin, withDangerousMod, withXcodeProject } from '@expo/config-plugins';
import { GenerableCLI } from '../cli';
import { ConfigLoader } from '../config';
import { resolve } from 'path';
import { existsSync } from 'fs';

export interface GenerablePluginOptions {
  configPath?: string;
}

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

  const withGeneratedFiles = withXcodeProject(frameworkConfig, (conf) => {
    const xcodeProject = conf.modResults;

    try {
      const configLoader = new ConfigLoader();
      const generableConfig = configLoader.loadConfig();

      const outputPath = generableConfig.outputPath || 'ios/example/Generated';
      const fileName = `${generableConfig.moduleName || 'Generables'}.swift`;
      const relativePath = `${outputPath}/${fileName}`;
      const fullPath = resolve(conf.modRequest.projectRoot, relativePath);

      console.log('The full path ->', fullPath);


      if (existsSync(fullPath)) {
        const fileUuid = xcodeProject.generateUuid();
        const buildUuid = xcodeProject.generateUuid();

        const fileReferenceSection = xcodeProject.pbxFileReferenceSection();
        fileReferenceSection[fileUuid] = {
          isa: 'PBXFileReference',
          lastKnownFileType: 'sourcecode.swift',
          name: fileName,
          path: relativePath,
          sourceTree: '"<group>"'
        };
        fileReferenceSection[fileUuid + '_comment'] = fileName;

        const buildFileSection = xcodeProject.pbxBuildFileSection();
        buildFileSection[buildUuid] = {
          isa: 'PBXBuildFile',
          fileRef: fileUuid
        };
        buildFileSection[buildUuid + '_comment'] = fileName + ' in Sources';

        // Add to sources build phase
        const sourcesPhase = xcodeProject.pbxSourcesBuildPhaseObj(xcodeProject.getFirstTarget().uuid);
        sourcesPhase.files.push({
          value: buildUuid,
          comment: fileName + ' in Sources'
        });

        // Add to proper group structure to avoid "Recovered References"
        const mainGroup = xcodeProject.getFirstProject().firstProject.mainGroup;
        let generatedGroup = xcodeProject.pbxGroupByName('Generated');

        if (!generatedGroup) {
          const generatedGroupUuid = xcodeProject.generateUuid();
          const pbxGroupSection = xcodeProject.hash.project.objects.PBXGroup;

          // Create Generated group
          pbxGroupSection[generatedGroupUuid] = {
            isa: 'PBXGroup',
            children: [],
            name: 'Generated',
            sourceTree: '"<group>"'
          };
          pbxGroupSection[generatedGroupUuid + '_comment'] = 'Generated';

          // Add Generated group to main group
          const mainGroupObj = xcodeProject.getPBXGroupByKey(mainGroup);
          mainGroupObj.children.push({
            value: generatedGroupUuid,
            comment: 'Generated'
          });

          generatedGroup = pbxGroupSection[generatedGroupUuid];
        }

        // Add file to Generated group
        const generatedGroupKeys = Object.keys(xcodeProject.hash.project.objects.PBXGroup).filter(key =>
          xcodeProject.hash.project.objects.PBXGroup[key].name === 'Generated' && !key.endsWith('_comment')
        );

        if (generatedGroupKeys.length > 0) {
          const generatedGroupKey = generatedGroupKeys[0];
          const generatedGroupObj = xcodeProject.hash.project.objects.PBXGroup[generatedGroupKey];

          // Check if file is not already in the group
          const fileAlreadyInGroup = generatedGroupObj.children.some((child: any) => child.value === fileUuid);
          if (!fileAlreadyInGroup) {
            generatedGroupObj.children.push({
              value: fileUuid,
              comment: fileName
            });
          }
        }

        console.log(`✅ Added ${fileName} to Xcode project`);
      }
    } catch (error) {
      console.warn('Failed to add generated Swift files to Xcode project:', error);
    }

    return conf;
  });

  return withDangerousMod(withGeneratedFiles, [
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
