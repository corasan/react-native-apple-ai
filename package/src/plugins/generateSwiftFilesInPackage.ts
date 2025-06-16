import { ConfigPlugin, withXcodeProject } from '@expo/config-plugins';
import { SwiftCode } from './SwiftCode';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve } from 'path';

export interface GenerablePackagePluginOptions {
  configPath?: string;
}


export function generateSwiftFilesInPackage() {
  try {
    const swiftCode = new SwiftCode();
    const generatedCode = swiftCode.generate();
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

const withGenerablePackagePlugin: ConfigPlugin = (
  config
) => {
  return withXcodeProject(config, (conf) => {
    generateSwiftFilesInPackage()
    return conf
  })
};

export default withGenerablePackagePlugin;
