export interface ContextData {
  id: string;
  nodeId: string;
  nodeName: string;
  title: string;
  description: string;
  usage: string;
  properties: Array<{
    name: string;
    type: string;
    description: string;
  }>;
  examples: string[];
  guidelines: string[];
  tags: string[];
  lastUpdated: string;
  createdBy: string;
}

export interface DesignToken {
  id: string;
  name: string;
  type: 'color' | 'number' | 'string' | 'boolean';
  value: any;
  description?: string;
  usage?: string;
  resolvedType: string;
  scopes?: string[];
  codeSyntax?: {
    web?: string;
    ios?: string;
    android?: string;
  };
  variableCollectionId?: string;
  collectionName?: string;
}

export interface TokenCollection {
  id: string;
  name: string;
  modes: Array<{
    modeId: string;
    name: string;
  }>;
  tokens: DesignToken[];
}

export interface Project {
  id: string;
  fileKey: string;
  name: string;
  contexts: ContextData[];
  tokens?: TokenCollection[];
  lastSync: string;
  createdAt: string;
  figmaFileUrl?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  apiKey: string;
}

export interface SyncRequest {
  fileKey: string;
  contexts: ContextData[];
  tokens?: TokenCollection[];
}

export interface FigmaFile {
  name: string;
  lastModified: string;
  thumbnailUrl: string;
  version: string;
  document: any;
}

export interface FigmaVariable {
  id: string;
  name: string;
  key: string;
  variableCollectionId: string;
  resolvedType: string;
  valuesByMode: Record<string, any>;
  scopes: string[];
  description?: string;
}

export interface FigmaVariableCollection {
  id: string;
  name: string;
  modes: Array<{
    modeId: string;
    name: string;
  }>;
}
