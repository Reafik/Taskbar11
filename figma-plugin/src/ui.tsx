import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ContextData, MessageToPlugin, MessageToUI } from './types';

interface AppState {
  currentContext: ContextData | null;
  selection: { id: string; name: string; type: string } | null;
  allContexts: ContextData[];
  alert: { type: 'success' | 'error'; message: string } | null;
  activeTab: 'edit' | 'list';
  apiKey: string;
}

class App extends React.Component<{}, AppState> {
  state: AppState = {
    currentContext: null,
    selection: null,
    allContexts: [],
    alert: null,
    activeTab: 'edit',
    apiKey: ''
  };
  
  private alertTimeout: number | null = null;
  
  componentDidMount() {
    window.onmessage = (event) => {
      const msg = event.data.pluginMessage as MessageToUI;
      this.handleMessage(msg);
    };
    
    this.postMessage({ type: 'get-all-contexts' });
  }
  
  componentWillUnmount() {
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
    }
  }
  
  handleMessage(msg: MessageToUI) {
    switch (msg.type) {
      case 'context-data':
        this.setState({ currentContext: msg.data });
        break;
      
      case 'all-contexts':
        this.setState({ allContexts: msg.data });
        break;
      
      case 'selection-updated':
        this.setState({ selection: msg.selection });
        break;
      
      case 'success':
      case 'error':
        this.showAlert(msg.type, msg.message);
        if (msg.type === 'success') {
          this.postMessage({ type: 'get-all-contexts' });
        }
        break;
    }
  }
  
  showAlert(type: 'success' | 'error', message: string) {
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
    }
    
    this.setState({ alert: { type, message } });
    
    this.alertTimeout = window.setTimeout(() => {
      this.setState({ alert: null });
    }, 3000);
  }
  
  postMessage(msg: MessageToPlugin) {
    parent.postMessage({ pluginMessage: msg }, '*');
  }
  
  handleCreateOrUpdate = () => {
    const { currentContext, selection } = this.state;
    
    if (!selection) {
      this.showAlert('error', 'Please select an element first');
      return;
    }
    
    const formData = this.getFormData();
    
    if (currentContext) {
      this.postMessage({
        type: 'update-context',
        id: currentContext.id,
        data: formData
      });
    } else {
      this.postMessage({
        type: 'create-context',
        data: formData
      });
    }
  };
  
  getFormData(): Partial<ContextData> {
    const form = document.getElementById('context-form') as HTMLFormElement;
    if (!form) return {};
    
    return {
      title: (form.elements.namedItem('title') as HTMLInputElement).value,
      description: (form.elements.namedItem('description') as HTMLTextAreaElement).value,
      usage: (form.elements.namedItem('usage') as HTMLTextAreaElement).value,
    };
  }
  
  handleDelete = () => {
    const { currentContext } = this.state;
    if (currentContext && confirm('Are you sure you want to delete this context?')) {
      this.postMessage({
        type: 'delete-context',
        id: currentContext.id
      });
    }
  };
  
  handleSync = () => {
    const { apiKey } = this.state;
    if (!apiKey) {
      this.showAlert('error', 'Please enter an API key');
      return;
    }
    
    this.postMessage({
      type: 'sync-to-server',
      apiKey
    });
  };
  
  handleSelectNode = (nodeId: string) => {
    this.postMessage({
      type: 'get-context',
      nodeId
    });
  };
  
  renderEditTab() {
    const { currentContext, selection } = this.state;
    
    if (!selection) {
      return (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <h3>No element selected</h3>
          <p>Select an element in Figma to add context and documentation</p>
        </div>
      );
    }
    
    return (
      <form id="context-form">
        <div className="selection-info">
          <div className="selection-info-title">{selection.name}</div>
          <div className="selection-info-type">{selection.type}</div>
        </div>
        
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="Component title"
          defaultValue={currentContext?.title || selection.name}
        />
        
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          placeholder="Describe what this component does and when to use it"
          defaultValue={currentContext?.description || ''}
        />
        
        <label htmlFor="usage">Usage Guidelines</label>
        <textarea
          id="usage"
          name="usage"
          placeholder="How and when to use this component"
          defaultValue={currentContext?.usage || ''}
        />
        
        <div className="button-group">
          <button type="button" onClick={this.handleCreateOrUpdate}>
            {currentContext ? 'Update' : 'Create'} Context
          </button>
          {currentContext && (
            <button type="button" className="danger" onClick={this.handleDelete}>
              Delete
            </button>
          )}
        </div>
      </form>
    );
  }
  
  renderListTab() {
    const { allContexts } = this.state;
    
    if (allContexts.length === 0) {
      return (
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <h3>No contexts yet</h3>
          <p>Start documenting your design system by adding context to components</p>
        </div>
      );
    }
    
    return (
      <div>
        <h3>All Contexts ({allContexts.length})</h3>
        <div className="property-list">
          {allContexts.map((ctx) => (
            <div key={ctx.id} className="property-item">
              <div className="property-item-content">
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{ctx.title}</div>
                <div style={{ fontSize: 11, opacity: 0.6 }}>{ctx.nodeName}</div>
                {ctx.description && (
                  <div style={{ fontSize: 11, marginTop: 4, opacity: 0.8 }}>
                    {ctx.description.substring(0, 100)}
                    {ctx.description.length > 100 ? '...' : ''}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <h3>Sync to Web App</h3>
        <label htmlFor="apiKey">API Key</label>
        <input
          type="text"
          id="apiKey"
          placeholder="Enter your API key"
          value={this.state.apiKey}
          onChange={(e) => this.setState({ apiKey: e.target.value })}
        />
        <button type="button" onClick={this.handleSync}>
          Sync to Server
        </button>
      </div>
    );
  }
  
  render() {
    const { alert, activeTab } = this.state;
    
    return (
      <div className="container">
        <h1>Design Context Pro</h1>
        
        {alert && (
          <div className={`alert alert-${alert.type}`}>
            {alert.message}
          </div>
        )}
        
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'edit' ? 'active' : ''}`}
            onClick={() => this.setState({ activeTab: 'edit' })}
          >
            Edit
          </button>
          <button
            className={`tab ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => this.setState({ activeTab: 'list' })}
          >
            All Contexts
          </button>
        </div>
        
        {activeTab === 'edit' ? this.renderEditTab() : this.renderListTab()}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
