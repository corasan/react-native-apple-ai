import { ConfigPlugin, withXcodeProject } from '@expo/config-plugins';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import { SwiftGenerator } from './SwiftGenerator';

export interface GenerablePackagePluginOptions {
  configPath?: string;
}


export function generateSwiftFilesInPackage() {
  try {
    const swiftGenerator = new SwiftGenerator();
    const generatedCode = swiftGenerator.generate();
    const packagePath = resolve(__dirname, '../../../ios/Generables');
    const filePath = resolve(packagePath, 'Generables.swift');

    mkdirSync(packagePath, { recursive: true });
    writeFileSync(filePath, generatedCode, 'utf8');

    console.log(`✅ Created Generables.swift`);

  } catch (error) {
    console.error('❌ Failed to create Swift file in package:', error);
    throw error;
  }
}

const withGenerablePlugin: ConfigPlugin = (
  config
) => {
  return withXcodeProject(config, (conf) => {
    generateSwiftFilesInPackage()
    return conf
  })
};

export default withGenerablePlugin;
