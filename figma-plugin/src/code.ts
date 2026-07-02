import { ContextData, MessageToPlugin, MessageToUI, SyncStatus } from './types';

// Show the plugin UI
figma.showUI(__html__, { width: 400, height: 600, themeColors: true });

// Plugin data keys
const CONTEXT_DATA_KEY = 'design-context';
const SYNC_STATUS_KEY = 'sync-status';

// Store for all context data
let contextStore: Map<string, ContextData> = new Map();

// Initialize plugin
async function initialize() {
  // Load all existing context data from the document
  await loadAllContexts();
  
  // Send initial selection
  updateSelection();
  
  // Listen for selection changes
  figma.on('selectionchange', () => {
    updateSelection();
  });
}

// Load all contexts from the document
async function loadAllContexts() {
  contextStore.clear();
  
  // Traverse all nodes and collect context data
  function traverse(node: BaseNode) {
    if ('getPluginData' in node) {
      const dataStr = node.getPluginData(CONTEXT_DATA_KEY);
      if (dataStr) {
        try {
          const data: ContextData = JSON.parse(dataStr);
          contextStore.set(data.id, data);
        } catch (e) {
          console.error('Failed to parse context data', e);
        }
      }
    }
    
    if ('children' in node) {
      for (const child of node.children) {
        traverse(child);
      }
    }
  }
  
  traverse(figma.root);
}

// Update selection information
function updateSelection() {
  if (figma.currentPage.selection.length === 1) {
    const node = figma.currentPage.selection[0];
    figma.ui.postMessage({
      type: 'selection-updated',
      selection: {
        id: node.id,
        name: node.name,
        type: node.type
      }
    } as MessageToUI);
    
    // Load context for this node if it exists
    const dataStr = node.getPluginData(CONTEXT_DATA_KEY);
    if (dataStr) {
      try {
        const data: ContextData = JSON.parse(dataStr);
        figma.ui.postMessage({
          type: 'context-data',
          data
        } as MessageToUI);
      } catch (e) {
        figma.ui.postMessage({
          type: 'context-data',
          data: null
        } as MessageToUI);
      }
    } else {
      figma.ui.postMessage({
        type: 'context-data',
        data: null
      } as MessageToUI);
    }
  } else {
    figma.ui.postMessage({
      type: 'selection-updated',
      selection: null
    } as MessageToUI);
  }
}

// Handle messages from UI
figma.ui.onmessage = async (msg: MessageToPlugin) => {
  try {
    switch (msg.type) {
      case 'create-context':
        await handleCreateContext(msg.data);
        break;
      
      case 'update-context':
        await handleUpdateContext(msg.id, msg.data);
        break;
      
      case 'delete-context':
        await handleDeleteContext(msg.id);
        break;
      
      case 'get-context':
        await handleGetContext(msg.nodeId);
        break;
      
      case 'get-all-contexts':
        await handleGetAllContexts();
        break;
      
      case 'sync-to-server':
        await handleSyncToServer(msg.apiKey);
        break;
      
      case 'selection-changed':
        updateSelection();
        break;
      
      case 'close':
        figma.closePlugin();
        break;
    }
  } catch (error) {
    figma.ui.postMessage({
      type: 'error',
      message: error instanceof Error ? error.message : 'An error occurred'
    } as MessageToUI);
  }
};

// Create new context for selected node
async function handleCreateContext(data: Partial<ContextData>) {
  if (figma.currentPage.selection.length !== 1) {
    figma.ui.postMessage({
      type: 'error',
      message: 'Please select exactly one element'
    } as MessageToUI);
    return;
  }
  
  const node = figma.currentPage.selection[0];
  const user = await figma.currentUser;
  
  const contextData: ContextData = {
    id: `ctx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    nodeId: node.id,
    nodeName: node.name,
    title: data.title || node.name,
    description: data.description || '',
    usage: data.usage || '',
    properties: data.properties || [],
    examples: data.examples || [],
    guidelines: data.guidelines || [],
    tags: data.tags || [],
    lastUpdated: new Date().toISOString(),
    createdBy: user?.name || 'Unknown'
  };
  
  node.setPluginData(CONTEXT_DATA_KEY, JSON.stringify(contextData));
  contextStore.set(contextData.id, contextData);
  
  figma.ui.postMessage({
    type: 'success',
    message: 'Context created successfully'
  } as MessageToUI);
  
  figma.ui.postMessage({
    type: 'context-data',
    data: contextData
  } as MessageToUI);
}

// Update existing context
async function handleUpdateContext(id: string, data: Partial<ContextData>) {
  const existingData = contextStore.get(id);
  if (!existingData) {
    figma.ui.postMessage({
      type: 'error',
      message: 'Context not found'
    } as MessageToUI);
    return;
  }
  
  const node = figma.getNodeById(existingData.nodeId);
  if (!node || !('setPluginData' in node)) {
    figma.ui.postMessage({
      type: 'error',
      message: 'Node not found or invalid'
    } as MessageToUI);
    return;
  }
  
  const updatedData: ContextData = {
    ...existingData,
    ...data,
    lastUpdated: new Date().toISOString()
  };
  
  node.setPluginData(CONTEXT_DATA_KEY, JSON.stringify(updatedData));
  contextStore.set(id, updatedData);
  
  figma.ui.postMessage({
    type: 'success',
    message: 'Context updated successfully'
  } as MessageToUI);
  
  figma.ui.postMessage({
    type: 'context-data',
    data: updatedData
  } as MessageToUI);
}

// Delete context
async function handleDeleteContext(id: string) {
  const existingData = contextStore.get(id);
  if (!existingData) {
    figma.ui.postMessage({
      type: 'error',
      message: 'Context not found'
    } as MessageToUI);
    return;
  }
  
  const node = figma.getNodeById(existingData.nodeId);
  if (node && 'setPluginData' in node) {
    node.setPluginData(CONTEXT_DATA_KEY, '');
  }
  
  contextStore.delete(id);
  
  figma.ui.postMessage({
    type: 'success',
    message: 'Context deleted successfully'
  } as MessageToUI);
  
  figma.ui.postMessage({
    type: 'context-data',
    data: null
  } as MessageToUI);
}

// Get context for specific node
async function handleGetContext(nodeId: string) {
  const node = figma.getNodeById(nodeId);
  if (!node || !('getPluginData' in node)) {
    figma.ui.postMessage({
      type: 'context-data',
      data: null
    } as MessageToUI);
    return;
  }
  
  const dataStr = node.getPluginData(CONTEXT_DATA_KEY);
  if (dataStr) {
    const data: ContextData = JSON.parse(dataStr);
    figma.ui.postMessage({
      type: 'context-data',
      data
    } as MessageToUI);
  } else {
    figma.ui.postMessage({
      type: 'context-data',
      data: null
    } as MessageToUI);
  }
}

// Get all contexts
async function handleGetAllContexts() {
  await loadAllContexts();
  figma.ui.postMessage({
    type: 'all-contexts',
    data: Array.from(contextStore.values())
  } as MessageToUI);
}

// Sync to server
async function handleSyncToServer(apiKey: string) {
  try {
    await loadAllContexts();
    const allContexts = Array.from(contextStore.values());
    
    // Send to server
    const response = await fetch('https://api.designcontext.app/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        fileKey: figma.fileKey,
        contexts: allContexts
      })
    });
    
    if (!response.ok) {
      throw new Error('Sync failed');
    }
    
    // Update sync status
    const syncStatus: SyncStatus = {
      synced: true,
      lastSync: new Date().toISOString(),
      pendingChanges: 0
    };
    
    await figma.clientStorage.setAsync(SYNC_STATUS_KEY, syncStatus);
    
    figma.ui.postMessage({
      type: 'success',
      message: 'Synced successfully to web app'
    } as MessageToUI);
    
    figma.ui.postMessage({
      type: 'sync-status',
      status: syncStatus
    } as MessageToUI);
  } catch (error) {
    figma.ui.postMessage({
      type: 'error',
      message: error instanceof Error ? error.message : 'Sync failed'
    } as MessageToUI);
  }
}

// Initialize the plugin
initialize();
