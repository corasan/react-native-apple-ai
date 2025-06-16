export interface GenerableProperty {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required?: boolean;
  items?: GenerableProperty;
  properties?: Record<string, GenerableProperty>;
  constraints?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    enum?: (string | number)[];
  };
  description?: string;
}

export interface GenerableSchema {
  name: string;
  properties: Record<string, GenerableProperty>;
  description?: string;
}

export interface GenerableConfig {
  schemas: GenerableSchema[];
  outputPath?: string;
  moduleName?: string;
}
