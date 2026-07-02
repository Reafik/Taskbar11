// Types for the plugin
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

export interface SyncStatus {
  synced: boolean;
  lastSync: string | null;
  pendingChanges: number;
}

// Message types for communication between plugin and UI
export type MessageToPlugin = 
  | { type: 'create-context'; data: Partial<ContextData> }
  | { type: 'update-context'; id: string; data: Partial<ContextData> }
  | { type: 'delete-context'; id: string }
  | { type: 'get-context'; nodeId: string }
  | { type: 'get-all-contexts' }
  | { type: 'sync-to-server'; apiKey: string }
  | { type: 'selection-changed' }
  | { type: 'close' };

export type MessageToUI = 
  | { type: 'context-data'; data: ContextData | null }
  | { type: 'all-contexts'; data: ContextData[] }
  | { type: 'sync-status'; status: SyncStatus }
  | { type: 'error'; message: string }
  | { type: 'success'; message: string }
  | { type: 'selection-updated'; selection: { id: string; name: string; type: string } | null };
