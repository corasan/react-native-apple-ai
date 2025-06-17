import { GenerableSchema, GenerableProperty, GenerableConfig } from '../types';
import { ConfigLoader } from './ConfigLoader';

export class SwiftGenerator {
  private config: GenerableConfig;
  private indentLevel = 0;
  private readonly indentSize = 2;

  constructor() {
    const configLoader = new ConfigLoader();
    this.config = configLoader.loadConfig();
    configLoader.validateConfig(this.config)
  }

  generate(): string {
    const swiftCode = this.generateFile(this.config.schemas);

    console.log(`Creating ${this.config.schemas.length} struct(s):`);
    this.config.schemas.forEach(schema => {
      console.log(`   - ${schema.name}`);
    });
    return swiftCode
  }

  private indent(): string {
    return ' '.repeat(this.indentLevel * this.indentSize);
  }

  private increaseIndent(): void {
    this.indentLevel++;
  }

  private decreaseIndent(): void {
    this.indentLevel--;
  }

  private mapTypeToSwift(property: GenerableProperty): string {
    switch (property.type) {
      case 'string':
        return 'String';
      case 'number':
        return 'Double';
      case 'boolean':
        return 'Bool';
      // case 'array':
      //   if (property.items) {
      //     return `[${this.mapTypeToSwift(property.items)}]`;
      //   }
      //   return '[Any]';
      // case 'object':
      //   return 'Dictionary<String, Any>';
      default:
        return 'String';
    }
  }

  private generateGuideDescription(property: GenerableProperty): string[] {
    const lines: string[] = [];

    if (property.guide) {
      lines.push(`${this.indent()}@Guide(description: "${property.guide.description}")`);
    }

    return lines;
  }

  private generateProperty(name: string, property: GenerableProperty): string[] {
    const lines: string[] = [];

    lines.push(...this.generateGuideDescription(property));

    const swiftType = this.mapTypeToSwift(property);

    lines.push(`${this.indent()}var ${name}: ${swiftType}`);

    return lines;
  }

  generateStruct(schema: GenerableSchema): string {
    const lines: string[] = [];

    lines.push(`@Generable`);
    lines.push(`struct ${schema.name} {`);

    this.increaseIndent();

    Object.entries(schema.properties).forEach(([name, property], index) => {
      if (index > 0) {
        lines.push('');
      }
      lines.push(...this.generateProperty(name, property));
    });

    this.decreaseIndent();
    lines.push('}');

    return lines.join('\n');
  }

  private generateEnum(schemas: GenerableSchema[]): string {
    if (schemas.length === 0) {
      return '';
    }

    const lines: string[] = [];

    lines.push('enum GenerableTypes: String, CaseIterable  {');
    this.increaseIndent();

    schemas.forEach((schema) => {
      lines.push(`${this.indent()}case ${schema.name.toLowerCase()} = "${schema.name}"`);
    });

    lines.push('');
    lines.push(`${this.indent()}init?(fromString string: String) {`);
    this.increaseIndent();
    lines.push(`${this.indent()}self.init(rawValue: string)`);
    this.decreaseIndent();
    lines.push(`${this.indent()}}`);

    lines.push('');
    lines.push(`${this.indent()}func generate(`);
    this.increaseIndent();
    lines.push(`${this.indent()}session: LanguageModelSession,`);
    lines.push(`${this.indent()}options: GenerationOptions = GenerationOptions(),`);
    lines.push(`${this.indent()}includeSchemaInPrompt: Bool = true,`);
    lines.push(`${this.indent()}isolation: isolated (any Actor)? = #isolation,`);
    lines.push(`${this.indent()}@PromptBuilder prompt: () throws -> Prompt`);
    this.decreaseIndent();
    lines.push(`${this.indent()}) async throws -> LanguageModelSession.Response<${schemas[0]?.name || 'Any'}> {`);
    this.increaseIndent();
    lines.push(`${this.indent()}switch self {`);
    schemas.forEach((schema) => {
      lines.push(`${this.indent()}case .${schema.name.toLowerCase()}:`);
      this.increaseIndent();
      lines.push(`${this.indent()}return try await session.respond(`);
      this.increaseIndent();
      lines.push(`${this.indent()}generating: ${schema.name}.self,`);
      lines.push(`${this.indent()}options: options,`);
      lines.push(`${this.indent()}includeSchemaInPrompt: includeSchemaInPrompt,`);
      lines.push(`${this.indent()}isolation: isolation,`);
      lines.push(`${this.indent()}prompt: prompt`);
      this.decreaseIndent();
      lines.push(`${this.indent()})`);
      this.decreaseIndent();
    });
    lines.push(`${this.indent()}}`);
    this.decreaseIndent();
    lines.push(`${this.indent()}}`);

    this.decreaseIndent();
    lines.push('}');

    return lines.join('\n');
  }

  generateFile(schemas: GenerableSchema[]): string {
    const lines: string[] = [];

    lines.push('import FoundationModels');
    lines.push('');

    schemas.forEach((schema, index) => {
      if (index > 0) {
        lines.push('');
        lines.push('');
      }
      lines.push(this.generateStruct(schema));
    });

    if (schemas.length > 0) {
      lines.push('');
      lines.push('');
      lines.push(this.generateEnum(schemas));
    }

    return lines.join('\n');
  }
}
