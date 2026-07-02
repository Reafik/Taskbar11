import axios, { AxiosInstance } from 'axios';
import { FigmaFile, FigmaVariable, FigmaVariableCollection, DesignToken, TokenCollection } from '../types';

export class FigmaService {
  private client: AxiosInstance;
  
  constructor(accessToken?: string) {
    this.client = axios.create({
      baseURL: 'https://api.figma.com/v1',
      headers: {
        'X-Figma-Token': accessToken || process.env.FIGMA_ACCESS_TOKEN || ''
      }
    });
  }

  /**
   * Extract file key from Figma URL
   */
  static extractFileKeyFromUrl(url: string): string | null {
    // Supports URLs like:
    // https://www.figma.com/file/{fileKey}/...
    // https://www.figma.com/design/{fileKey}/...
    const match = url.match(/figma\.com\/(file|design)\/([a-zA-Z0-9]+)/);
    return match ? match[2] : null;
  }

  /**
   * Get file metadata
   */
  async getFile(fileKey: string): Promise<FigmaFile> {
    try {
      const response = await this.client.get(`/files/${fileKey}`);
      return {
        name: response.data.name,
        lastModified: response.data.lastModified,
        thumbnailUrl: response.data.thumbnailUrl || '',
        version: response.data.version,
        document: response.data.document
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Figma API Error: ${error.response?.data?.err || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get local variables (design tokens) from a file
   */
  async getLocalVariables(fileKey: string): Promise<{
    variables: Record<string, FigmaVariable>;
    variableCollections: Record<string, FigmaVariableCollection>;
  }> {
    try {
      const response = await this.client.get(`/files/${fileKey}/variables/local`);
      return {
        variables: response.data.meta.variables || {},
        variableCollections: response.data.meta.variableCollections || {}
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Figma API Error: ${error.response?.data?.err || error.message}`);
      }
      throw error;
    }
  }

  /**
   * Convert Figma variables to design tokens
   */
  convertVariablesToTokens(
    variables: Record<string, FigmaVariable>,
    variableCollections: Record<string, FigmaVariableCollection>
  ): TokenCollection[] {
    const collections: Map<string, TokenCollection> = new Map();

    // Group variables by collection
    Object.values(variables).forEach((variable) => {
      const collectionId = variable.variableCollectionId;
      const collection = variableCollections[collectionId];

      if (!collection) return;

      if (!collections.has(collectionId)) {
        collections.set(collectionId, {
          id: collectionId,
          name: collection.name,
          modes: collection.modes,
          tokens: []
        });
      }

      // Convert variable to token
      const token: DesignToken = {
        id: variable.id,
        name: variable.name,
        type: this.mapResolvedTypeToTokenType(variable.resolvedType),
        value: this.getVariableValue(variable),
        description: variable.description || '',
        usage: '',
        resolvedType: variable.resolvedType,
        scopes: variable.scopes,
        variableCollectionId: collectionId,
        collectionName: collection.name,
        codeSyntax: this.generateCodeSyntax(variable)
      };

      collections.get(collectionId)!.tokens.push(token);
    });

    return Array.from(collections.values());
  }

  /**
   * Map Figma resolved type to token type
   */
  private mapResolvedTypeToTokenType(resolvedType: string): 'color' | 'number' | 'string' | 'boolean' {
    switch (resolvedType) {
      case 'COLOR':
        return 'color';
      case 'FLOAT':
        return 'number';
      case 'STRING':
        return 'string';
      case 'BOOLEAN':
        return 'boolean';
      default:
        return 'string';
    }
  }

  /**
   * Get the default value from a variable
   */
  private getVariableValue(variable: FigmaVariable): any {
    const firstMode = Object.keys(variable.valuesByMode)[0];
    if (!firstMode) return null;
    
    const value = variable.valuesByMode[firstMode];
    
    // Handle color values
    if (variable.resolvedType === 'COLOR' && typeof value === 'object' && value !== null) {
      const color = value as { r: number; g: number; b: number; a: number };
      return this.rgbaToHex(color.r, color.g, color.b, color.a);
    }
    
    return value;
  }

  /**
   * Convert RGBA to Hex
   */
  private rgbaToHex(r: number, g: number, b: number, a: number = 1): string {
    const toHex = (n: number) => {
      const hex = Math.round(n * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    return a < 1 ? `${hex}${toHex(a)}` : hex;
  }

  /**
   * Generate code syntax for different platforms
   */
  private generateCodeSyntax(variable: FigmaVariable): {
    web?: string;
    ios?: string;
    android?: string;
  } {
    const cssVarName = variable.name.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-');
    const swiftVarName = variable.name.replace(/\s+/g, '').replace(/\//g, '');
    const androidVarName = variable.name.toLowerCase().replace(/\s+/g, '_').replace(/\//g, '_');

    return {
      web: `var(--${cssVarName})`,
      ios: `.${swiftVarName}`,
      android: `R.color.${androidVarName}`
    };
  }

  /**
   * Analyze a Figma file and extract all design system data
   */
  async analyzeDesignSystem(fileKey: string): Promise<{
    file: FigmaFile;
    tokens: TokenCollection[];
  }> {
    const file = await this.getFile(fileKey);
    
    let tokens: TokenCollection[] = [];
    try {
      const { variables, variableCollections } = await this.getLocalVariables(fileKey);
      tokens = this.convertVariablesToTokens(variables, variableCollections);
    } catch (error) {
      console.warn('Could not fetch variables:', error);
      // Continue without tokens if they're not available
    }

    return { file, tokens };
  }
}

export default FigmaService;
