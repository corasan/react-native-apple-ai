import { GenerableSchema, GenerableProperty } from '../types';

export class SwiftGenerator {
  private indentLevel = 0;
  private readonly indentSize = 2;

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
      case 'object':
        return 'Dictionary<String, Any>';
      default:
        return 'Any';
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

    return lines.join('\n');
  }
}
