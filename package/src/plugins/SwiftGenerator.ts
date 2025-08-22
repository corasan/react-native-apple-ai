import type { GenerableConfig, GenerableProperty, GenerableSchema, Tool } from '../types'
import { toPascalCase } from '../utils/toPascalName'
import { ConfigLoader } from './ConfigLoader'

export class SwiftGenerator {
  private config: GenerableConfig
  private indentLevel = 0
  private readonly indentSize = 4

  constructor() {
    const configLoader = new ConfigLoader()
    this.config = configLoader.loadConfig()
    configLoader.validateConfig(this.config)
  }

  generate(): string {
    const swiftCode = this.generateFile(this.config.schemas, this.config.tools)

    console.log(`Creating ${this.config.schemas.length} struct(s):`)
    for (const schema of this.config.schemas) {
      console.log(`   - ${schema.name}`)
    }

    if (this.config.tools) {
      console.log(`Creating ${this.config.tools.length} tool(s):`)
      for (const tool of this.config.tools) {
        console.log(`   - ${toPascalCase(tool.name)}Tool`)
      }
    }

    return swiftCode
  }

  private indent(): string {
    return ' '.repeat(this.indentLevel * this.indentSize)
  }

  private increaseIndent(): void {
    this.indentLevel++
  }

  private decreaseIndent(): void {
    this.indentLevel--
  }

  private mapTypeToSwift(property: GenerableProperty): string {
    switch (property.type) {
      case 'string':
        return 'String'
      case 'number':
        return 'Double'
      case 'boolean':
        return 'Bool'
      // case 'array':
      //   if (property.items) {
      //     return `[${this.mapTypeToSwift(property.items)}]`;
      //   }
      //   return '[Any]';
      // case 'object':
      //   return 'Dictionary<String, Any>';
      default:
        return 'String'
    }
  }

  private generateGuideDescription(property: GenerableProperty): string[] {
    const lines: string[] = []

    if (property.guide) {
      lines.push(`${this.indent()}@Guide(description: "${property.guide.description}")`)
    }

    return lines
  }

  private generateProperty(name: string, property: GenerableProperty): string[] {
    const lines: string[] = []

    lines.push(...this.generateGuideDescription(property))

    const swiftType = this.mapTypeToSwift(property)

    lines.push(`${this.indent()}var ${name}: ${swiftType}`)

    return lines
  }

  generateStruct(schema: GenerableSchema): string {
    const lines: string[] = []

    lines.push('@Generable')
    lines.push(`struct ${schema.name} {`)

    this.increaseIndent()

    Object.entries(schema.properties).forEach(([name, property], index) => {
      if (index > 0) {
        lines.push('')
      }
      lines.push(...this.generateProperty(name, property))
    })

    this.decreaseIndent()
    lines.push('}')

    return lines.join('\n')
  }

  private generateEnum(schemas: GenerableSchema[]): string {
    if (schemas.length === 0) {
      return ''
    }

    const lines: string[] = []

    lines.push('enum GenerableTypes: String, CaseIterable  {')
    this.increaseIndent()

    for (const schema of schemas) {
      lines.push(`${this.indent()}case ${schema.name.toLowerCase()} = "${schema.name}"`)
    }

    lines.push('')
    lines.push(`${this.indent()}init?(fromString string: String) {`)
    this.increaseIndent()
    lines.push(`${this.indent()}self.init(rawValue: string)`)
    this.decreaseIndent()
    lines.push(`${this.indent()}}`)

    lines.push('')
    lines.push(`${this.indent()}func generate(`)
    this.increaseIndent()
    lines.push(`${this.indent()}session: LanguageModelSession,`)
    lines.push(`${this.indent()}options: GenerationOptions = GenerationOptions(),`)
    lines.push(`${this.indent()}includeSchemaInPrompt: Bool = true,`)
    lines.push(`${this.indent()}isolation: isolated (any Actor)? = #isolation,`)
    lines.push(`${this.indent()}@PromptBuilder prompt: () throws -> Prompt`)
    this.decreaseIndent()
    lines.push(
      `${this.indent()}) async throws -> LanguageModelSession.Response<${schemas[0]?.name || 'Any'}> {`,
    )
    this.increaseIndent()
    lines.push(`${this.indent()}switch self {`)
    for (const schema of schemas) {
      lines.push(`${this.indent()}case .${schema.name.toLowerCase()}:`)
      this.increaseIndent()
      lines.push(`${this.indent()}return try await session.respond(`)
      this.increaseIndent()
      lines.push(`${this.indent()}generating: ${schema.name}.self,`)
      lines.push(`${this.indent()}options: options,`)
      lines.push(`${this.indent()}includeSchemaInPrompt: includeSchemaInPrompt,`)
      lines.push(`${this.indent()}isolation: isolation,`)
      lines.push(`${this.indent()}prompt: prompt`)
      this.decreaseIndent()
      lines.push(`${this.indent()})`)
      this.decreaseIndent()
    }
    lines.push(`${this.indent()}}`)
    this.decreaseIndent()
    lines.push(`${this.indent()}}`)

    this.decreaseIndent()
    lines.push('}')

    return lines.join('\n')
  }

  generateFile(schemas: GenerableSchema[], tools?: Tool[]): string {
    const lines: string[] = []

    lines.push('import FoundationModels')
    lines.push('import NitroModules')
    lines.push('')

    schemas.forEach((schema, index) => {
      if (index > 0) {
        lines.push('')
        lines.push('')
      }
      lines.push(this.generateStruct(schema))
    })

    if (tools && tools.length > 0) {
      lines.push('')
      lines.push('')
      tools.forEach((tool, index) => {
        if (index > 0) {
          lines.push('')
          lines.push('')
        }
        lines.push(this.generateTool(tool))
      })
    }

    if (schemas.length > 0) {
      lines.push('')
      lines.push('')
      lines.push(this.generateEnum(schemas))
    }

    return lines.join('\n')
  }

  private generateTool(tool: Tool): string {
    const lines: string[] = []
    const toolStructName = `${toPascalCase(tool.name)}Tool`

    lines.push(`struct ${toolStructName}: Tool {`)
    this.increaseIndent()

    lines.push(`${this.indent()}var name = "${tool.name}"`)
    lines.push(`${this.indent()}var description = "${tool.description}"`)
    lines.push('')

    lines.push(`${this.indent()}@Generable`)
    lines.push(`${this.indent()}struct Arguments {`)
    this.increaseIndent()

    Object.entries(tool.arguments).forEach(([name, property], index) => {
      if (index > 0) {
        lines.push('')
      }
      lines.push(...this.generateProperty(name, property))
    })

    this.decreaseIndent()
    lines.push(`${this.indent()}}`)
    lines.push('')

    lines.push(
      `${this.indent()}func call(arguments: Arguments) async throws -> ToolOutput {`,
    )
    this.increaseIndent()
    lines.push(`${this.indent()}let toolBridge = ToolBridge.shared`)

    const argumentEntries = Object.entries(tool.arguments)
    if (argumentEntries.length > 0) {
      lines.push(`${this.indent()}let argumentsDict: AnyMapHolder = AnyMapHolder()`)
      for (const [name, property] of argumentEntries) {
        const setterMethod = this.getAnyMapSetterMethod(property.type)
        lines.push(
          `${this.indent()}argumentsDict.${setterMethod}(key: "${name}", value: arguments.${name})`,
        )
      }
      lines.push(
        `${this.indent()}let result = try await toolBridge.callJSFunction(functionName: "${tool.functionName}", args: argumentsDict)`,
      )
    } else {
      lines.push(`${this.indent()}var argumentsDict: AnyMapHolder = AnyMapHolder()`)
      lines.push(
        `${this.indent()}let result = try await toolBridge.callJSFunction(functionName: "${tool.functionName}", arguments: argumentsDict)`,
      )
    }

    if (tool.resultSchema) {
      lines.push('')
      for (const [name, property] of Object.entries(tool.resultSchema)) {
        const anyMapMethod = this.getAnyMapMethod(property.type)
        lines.push(`${this.indent()}let ${name} = result.${anyMapMethod}(key: "${name}")`)
      }

      lines.push('')
      const properties = Object.keys(tool.resultSchema)
        .map(name => `"${name}": ${name}`)
        .join(', ')
      lines.push(
        `${this.indent()}return ToolOutput(GeneratedContent(properties: [${properties}]))`,
      )
    } else {
      lines.push(`${this.indent()}return ToolOutput(GeneratedContent(properties: [:]))`)
    }

    this.decreaseIndent()
    lines.push(`${this.indent()}}`)

    this.decreaseIndent()
    lines.push('}')

    return lines.join('\n')
  }

  private getAnyMapMethod(type: string): string {
    switch (type) {
      case 'string':
        return 'getString'
      case 'number':
        return 'getDouble'
      case 'boolean':
        return 'getBoolean'
      case 'array':
        return 'getArray'
      case 'object':
        return 'getObject'
      default:
        return 'getString'
    }
  }

  private getAnyMapSetterMethod(type: string): string {
    switch (type) {
      case 'string':
        return 'setString'
      case 'number':
        return 'setDouble'
      case 'boolean':
        return 'setBoolean'
      case 'array':
        return 'setArray'
      case 'object':
        return 'setObject'
      default:
        return 'setString'
    }
  }

  pritoPascalCase(str: string): string {
    return str
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .split(/[\s_-]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('')
  }
}
