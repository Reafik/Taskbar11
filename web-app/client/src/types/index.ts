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

export interface Project {
  id: string;
  fileKey: string;
  name: string;
  contexts: ContextData[];
  lastSync: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  apiKey: string;
}
