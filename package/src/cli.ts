#!/usr/bin/env node

import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { SwiftGenerator } from './generator';
import { ConfigLoader } from './config';

export class GenerableCLI {
  private generator: SwiftGenerator;
  private configLoader: ConfigLoader;

  constructor() {
    this.generator = new SwiftGenerator();
    this.configLoader = new ConfigLoader();
  }

  async run(): Promise<void> {
    try {
      console.log('🔄 Loading configuration...');
      const config = this.configLoader.loadConfig();
      this.configLoader.validateConfig(config);

      console.log(`📋 Found ${config.schemas.length} schema(s)`);

      const outputPath = config.outputPath || 'ios/Generated';
      const fileName = `${config.moduleName || 'FoundationModels'}.swift`;
      const fullOutputPath = resolve(process.cwd(), outputPath, fileName);

      console.log('🏗️  Generating Swift code...');
      const swiftCode = this.generator.generateFile(config.schemas);

      mkdirSync(dirname(fullOutputPath), { recursive: true });
      writeFileSync(fullOutputPath, swiftCode, 'utf-8');

      console.log(`✅ Generated Swift code at: ${fullOutputPath}`);
      console.log(`📊 Generated ${config.schemas.length} struct(s):`);
      config.schemas.forEach(schema => {
        console.log(`   - ${schema.name}`);
      });

    } catch (error) {
      console.error('❌ Generation failed:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  }
}

if (require.main === module) {
  const cli = new GenerableCLI();
  cli.run();
}
