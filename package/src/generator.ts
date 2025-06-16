import { GenerableSchema, GenerableProperty } from './types';

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
      case 'array':
        if (property.items) {
          return `[${this.mapTypeToSwift(property.items)}]`;
        }
        return '[Any]';
      case 'object':
        return 'Dictionary<String, Any>';
      default:
        return 'Any';
    }
  }

  private generatePropertyDocumentation(property: GenerableProperty): string[] {
    const lines: string[] = [];

    if (property.description) {
      lines.push(`${this.indent()}/// ${property.description}`);
    }

    if (property.constraints) {
      const constraints = property.constraints;
      if (constraints.minLength !== undefined || constraints.maxLength !== undefined) {
        const min = constraints.minLength ?? 0;
        const max = constraints.maxLength ?? 'unlimited';
        lines.push(`${this.indent()}/// Length: ${min} - ${max}`);
      }
      if (constraints.min !== undefined || constraints.max !== undefined) {
        const min = constraints.min ?? 'unlimited';
        const max = constraints.max ?? 'unlimited';
        lines.push(`${this.indent()}/// Range: ${min} - ${max}`);
      }
      if (constraints.pattern) {
        lines.push(`${this.indent()}/// Pattern: ${constraints.pattern}`);
      }
      if (constraints.enum) {
        lines.push(`${this.indent()}/// Allowed values: ${constraints.enum.join(', ')}`);
      }
    }

    return lines;
  }

  private generateProperty(name: string, property: GenerableProperty): string[] {
    const lines: string[] = [];

    lines.push(...this.generatePropertyDocumentation(property));

    const swiftType = this.mapTypeToSwift(property);
    const isOptional = !property.required;
    const optionalMarker = isOptional ? '?' : '';

    lines.push(`${this.indent()}var ${name}: ${swiftType}${optionalMarker}`);

    return lines;
  }

  generateStruct(schema: GenerableSchema): string {
    const lines: string[] = [];

    if (schema.description) {
      lines.push(`/// ${schema.description}`);
    }

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

    lines.push('import Foundation');
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
