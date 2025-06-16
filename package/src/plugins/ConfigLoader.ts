import { GenerableConfig } from '../types';
import { existsSync } from 'node:fs';
import { resolve } from 'path';

export class ConfigLoader {
  private configPath: string;

  constructor(configPath = 'generable.config') {
    this.configPath = configPath;
  }

  loadConfig(): GenerableConfig {
    const basePath = resolve(process.cwd(), this.configPath);
    const jsPath = `${basePath}.js`;
    const tsPath = `${basePath}.ts`;

    let fullPath: string;
    let isTypeScript = false;

    if (existsSync(jsPath)) {
      fullPath = jsPath;
    } else if (existsSync(tsPath)) {
      fullPath = tsPath;
      isTypeScript = true;
    } else {
      throw new Error(`Configuration file not found: ${jsPath} or ${tsPath}`);
    }

    try {
      delete require.cache[require.resolve(fullPath)];

      if (isTypeScript) {
        try {
          const ts = require('typescript');
          const fs = require('fs');

          const tsContent = fs.readFileSync(fullPath, 'utf8');

          const result = ts.transpile(tsContent, {
            module: ts.ModuleKind.CommonJS,
            target: ts.ScriptTarget.ES2018,
            esModuleInterop: true,
            allowSyntheticDefaultImports: true,
            skipLibCheck: true,
          });

          const Module = require('module');
          const tempModule = new Module(fullPath, module);
          tempModule.filename = fullPath;
          tempModule._compile(result, fullPath);

          const config = tempModule.exports.default || tempModule.exports;
          return config;
        } catch (tsError) {
          throw new Error(`Failed to compile TypeScript config: ${tsError}`);
        }
      } else {
        const config = require(fullPath);
        return config.default || config;
      }
    } catch (error) {
      throw new Error(`Failed to load configuration: ${error}`);
    }
  }

  validateConfig(config: GenerableConfig): void {
    if (!config.schemas || !Array.isArray(config.schemas)) {
      throw new Error('Configuration must have a schemas array');
    }

    config.schemas.forEach((schema, index) => {
      if (!schema.name) {
        throw new Error(`Schema at index ${index} must have a name`);
      }
      if (!schema.properties || typeof schema.properties !== 'object') {
        throw new Error(`Schema '${schema.name}' must have properties object`);
      }
    });
  }
}
