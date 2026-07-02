import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TokenCollection, DesignToken } from '../types';
import apiService from '../services/api';

const TokensPage: React.FC = () => {
  const { fileKey } = useParams<{ fileKey: string }>();
  const [collections, setCollections] = useState<TokenCollection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [selectedToken, setSelectedToken] = useState<DesignToken | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [description, setDescription] = useState('');
  const [usage, setUsage] = useState('');
  
  useEffect(() => {
    if (fileKey) {
      loadTokens();
    }
  }, [fileKey]);
  
  const loadTokens = async () => {
    try {
      const data = await apiService.getTokens(fileKey!);
      setCollections(data);
      if (data.length > 0) {
        setSelectedCollection(data[0].id);
      }
    } catch (error) {
      console.error('Failed to load tokens', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleTokenClick = (token: DesignToken) => {
    setSelectedToken(token);
    setDescription(token.description || '');
    setUsage(token.usage || '');
    setEditMode(false);
  };
  
  const handleSave = async () => {
    if (!selectedToken) return;
    
    try {
      await apiService.updateTokenContext(fileKey!, selectedToken.id, description, usage);
      setEditMode(false);
      await loadTokens();
      alert('Token context updated successfully');
    } catch (error) {
      alert('Failed to update token context');
    }
  };
  
  const renderTokenValue = (token: DesignToken) => {
    if (token.type === 'color') {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ 
            width: 32, 
            height: 32, 
            background: token.value,
            border: '1px solid var(--border)',
            borderRadius: 4
          }} />
          <code style={{ fontSize: 12 }}>{token.value}</code>
        </div>
      );
    }
    return <code style={{ fontSize: 12 }}>{String(token.value)}</code>;
  };
  
  if (loading) {
    return <div className="container"><div className="loading">Loading tokens...</div></div>;
  }
  
  if (collections.length === 0) {
    return (
      <div className="container">
        <Link to={`/project/${fileKey}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: 32, display: 'inline-block' }}>
          ← Back to project
        </Link>
        <div className="empty-state">
          <div className="empty-state-icon">🎨</div>
          <h2>No tokens found</h2>
          <p>This design system doesn't have any variables/tokens yet.</p>
        </div>
      </div>
    );
  }
  
  const currentCollection = collections.find(c => c.id === selectedCollection);
  
  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 120px)' }}>
      <div className="sidebar" style={{ width: 280 }}>
        <div className="container" style={{ padding: '16px 24px' }}>
          <Link to={`/project/${fileKey}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: 14 }}>
            ← Back
          </Link>
        </div>
        <div style={{ padding: '0 24px' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--text-secondary)' }}>
            COLLECTIONS
          </h3>
          {collections.map(collection => (
            <div
              key={collection.id}
              className={`sidebar-item ${selectedCollection === collection.id ? 'active' : ''}`}
              onClick={() => setSelectedCollection(collection.id)}
            >
              <div style={{ fontWeight: 500 }}>{collection.name}</div>
              <div style={{ fontSize: 11, opacity: 0.6 }}>{collection.tokens.length} tokens</div>
            </div>
          ))}
        </div>
      </div>
      
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflowY: 'auto', borderRight: '1px solid var(--border)' }}>
          <div className="container" style={{ padding: 24 }}>
            <h2 style={{ marginBottom: 24 }}>{currentCollection?.name}</h2>
            
            {currentCollection?.tokens.map(token => (
              <div
                key={token.id}
                className="card"
                onClick={() => handleTokenClick(token)}
                style={{ 
                  cursor: 'pointer',
                  background: selectedToken?.id === token.id ? 'rgba(0, 102, 255, 0.05)' : 'white',
                  borderColor: selectedToken?.id === token.id ? 'var(--primary-color)' : 'var(--border)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{token.name}</h4>
                    {renderTokenValue(token)}
                    {token.description && (
                      <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8 }}>
                        {token.description}
                      </p>
                    )}
                  </div>
                  <span className="tag" style={{ fontSize: 10 }}>{token.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {selectedToken && (
          <div style={{ width: 400, overflowY: 'auto', background: 'var(--surface)' }}>
            <div style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h3>Token Details</h3>
                {!editMode ? (
                  <button className="button button-secondary" onClick={() => setEditMode(true)}>
                    Edit Context
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="button button-secondary" onClick={() => setEditMode(false)}>
                      Cancel
                    </button>
                    <button className="button" onClick={handleSave}>
                      Save
                    </button>
                  </div>
                )}
              </div>
              
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Name</h4>
                <p style={{ fontSize: 14 }}>{selectedToken.name}</p>
              </div>
              
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Value</h4>
                {renderTokenValue(selectedToken)}
              </div>
              
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Type</h4>
                <span className="tag">{selectedToken.type}</span>
              </div>
              
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Description</h4>
                {editMode ? (
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe this token..."
                    style={{ 
                      width: '100%', 
                      minHeight: 80, 
                      padding: 8, 
                      fontSize: 13,
                      borderRadius: 4,
                      border: '1px solid var(--border)'
                    }}
                  />
                ) : (
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    {selectedToken.description || 'No description'}
                  </p>
                )}
              </div>
              
              <div style={{ marginBottom: 24 }}>
                <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Usage</h4>
                {editMode ? (
                  <textarea
                    value={usage}
                    onChange={(e) => setUsage(e.target.value)}
                    placeholder="When to use this token..."
                    style={{ 
                      width: '100%', 
                      minHeight: 80, 
                      padding: 8, 
                      fontSize: 13,
                      borderRadius: 4,
                      border: '1px solid var(--border)'
                    }}
                  />
                ) : (
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    {selectedToken.usage || 'No usage guidelines'}
                  </p>
                )}
              </div>
              
              {selectedToken.codeSyntax && (
                <div style={{ marginBottom: 24 }}>
                  <h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Code Syntax</h4>
                  {selectedToken.codeSyntax.web && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>CSS/Web</div>
                      <code style={{ 
                        display: 'block', 
                        padding: 8, 
                        background: 'white',
                        borderRadius: 4,
                        fontSize: 12,
                        border: '1px solid var(--border)'
                      }}>
                        {selectedToken.codeSyntax.web}
                      </code>
                    </div>
                  )}
                  {selectedToken.codeSyntax.ios && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>iOS/Swift</div>
                      <code style={{ 
                        display: 'block', 
                        padding: 8, 
                        background: 'white',
                        borderRadius: 4,
                        fontSize: 12,
                        border: '1px solid var(--border)'
                      }}>
                        {selectedToken.codeSyntax.ios}
                      </code>
                    </div>
                  )}
                  {selectedToken.codeSyntax.android && (
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>Android</div>
                      <code style={{ 
                        display: 'block', 
                        padding: 8, 
                        background: 'white',
                        borderRadius: 4,
                        fontSize: 12,
                        border: '1px solid var(--border)'
                      }}>
                        {selectedToken.codeSyntax.android}
                      </code>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TokensPage;
