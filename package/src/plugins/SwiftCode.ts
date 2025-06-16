#!/usr/bin/env node

import { resolve } from 'path';
import { SwiftGenerator } from './SwiftGenerator';
import { ConfigLoader } from './ConfigLoader';

export class SwiftCode {
  private generator: SwiftGenerator;
  private configLoader: ConfigLoader;

  constructor() {
    this.generator = new SwiftGenerator();
    this.configLoader = new ConfigLoader();
  }

  generate(): string {
    const config = this.configLoader.loadConfig();
    this.configLoader.validateConfig(config);

    const outputPath = config.outputPath || 'ios/Generated';
    const fileName = `${config.moduleName || 'Generables'}.swift`;
    const fullOutputPath = resolve(process.cwd(), outputPath, fileName);

    const swiftCode = this.generator.generateFile(config.schemas);

    console.log(`✅ Generated Swift code at: ${fullOutputPath}`);
    console.log(`📊 Generated ${config.schemas.length} struct(s):`);
    config.schemas.forEach(schema => {
      console.log(`   - ${schema.name}`);
    });
    return swiftCode
  }
}
