import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ContextData } from '../types';
import apiService from '../services/api';

const ContextDetailPage: React.FC = () => {
  const { fileKey, contextId } = useParams<{ fileKey: string; contextId: string }>();
  const [context, setContext] = useState<ContextData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (fileKey && contextId) {
      loadContext();
    }
  }, [fileKey, contextId]);
  
  const loadContext = async () => {
    try {
      const data = await apiService.getContext(fileKey!, contextId!);
      setContext(data);
    } catch (error) {
      console.error('Failed to load context', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <div className="container"><div className="loading">Loading component...</div></div>;
  }
  
  if (!context) {
    return <div className="container"><div className="empty-state">Component not found</div></div>;
  }
  
  return (
    <div className="container">
      <div style={{ marginBottom: 32 }}>
        <Link to={`/project/${fileKey}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
          ← Back to design system
        </Link>
      </div>
      
      <div className="card">
        <h1 className="page-title" style={{ marginBottom: 16 }}>{context.title}</h1>
        
        <div className="card-meta" style={{ marginBottom: 24 }}>
          <span>Component: {context.nodeName}</span>
          <span>Created by: {context.createdBy}</span>
          <span>Updated: {new Date(context.lastUpdated).toLocaleDateString()}</span>
        </div>
        
        {context.tags.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            {context.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        )}
        
        {context.description && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Description</h2>
            <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}>{context.description}</p>
          </div>
        )}
        
        {context.usage && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Usage Guidelines</h2>
            <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}>{context.usage}</p>
          </div>
        )}
        
        {context.properties && context.properties.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Properties</h2>
            <div style={{ 
              background: 'var(--surface)', 
              border: '1px solid var(--border)', 
              borderRadius: 6,
              overflow: 'hidden'
            }}>
              {context.properties.map((prop, index) => (
                <div 
                  key={index}
                  style={{ 
                    padding: 16,
                    borderBottom: index < context.properties.length - 1 ? '1px solid var(--border)' : 'none'
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>
                    {prop.name}
                    <span style={{ 
                      marginLeft: 8, 
                      fontSize: 12, 
                      color: 'var(--text-secondary)',
                      fontWeight: 400 
                    }}>
                      {prop.type}
                    </span>
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                    {prop.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {context.examples && context.examples.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Examples</h2>
            <ul style={{ paddingLeft: 24, lineHeight: 1.8 }}>
              {context.examples.map((example, index) => (
                <li key={index} style={{ color: 'var(--text-secondary)' }}>{example}</li>
              ))}
            </ul>
          </div>
        )}
        
        {context.guidelines && context.guidelines.length > 0 && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Guidelines</h2>
            <ul style={{ paddingLeft: 24, lineHeight: 1.8 }}>
              {context.guidelines.map((guideline, index) => (
                <li key={index} style={{ color: 'var(--text-secondary)' }}>{guideline}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContextDetailPage;
