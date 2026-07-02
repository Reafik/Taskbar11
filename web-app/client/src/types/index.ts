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
