import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../types';
import apiService from '../services/api';

const HomePage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  
  useEffect(() => {
    loadProjects();
  }, []);
  
  const loadProjects = async () => {
    try {
      const data = await apiService.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects', error);
    } finally {
      setLoading(false);
    }
  };
  
  const generateApiKey = async () => {
    try {
      const key = await apiService.createApiKey();
      setApiKey(key);
      setShowApiKey(true);
    } catch (error) {
      console.error('Failed to generate API key', error);
    }
  };
  
  if (loading) {
    return <div className="container"><div className="loading">Loading projects...</div></div>;
  }
  
  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 className="page-title">Design Systems</h1>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/import" className="button">
            Import from Figma
          </Link>
          <button className="button button-secondary" onClick={generateApiKey}>
            Generate API Key
          </button>
        </div>
      </div>
      
      {showApiKey && (
        <div className="card" style={{ background: '#f0f7ff', borderColor: '#0066ff' }}>
          <h3>Your API Key</h3>
          <p style={{ marginTop: 12, marginBottom: 12 }}>Copy this key and paste it in the Figma plugin to sync your design systems:</p>
          <code style={{ 
            display: 'block', 
            padding: 12, 
            background: 'white', 
            borderRadius: 4, 
            fontFamily: 'monospace',
            fontSize: 14,
            wordBreak: 'break-all'
          }}>
            {apiKey}
          </code>
        </div>
      )}
      
      {projects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🎨</div>
          <h2>No design systems yet</h2>
          <p>Install the Figma plugin and sync your first design system to get started.</p>
          <button className="button" style={{ marginTop: 24 }} onClick={generateApiKey}>
            Generate API Key to Get Started
          </button>
        </div>
      ) : (
        <div className="grid">
          {projects.map((project) => (
            <Link 
              to={`/project/${project.fileKey}`} 
              key={project.id}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="card" style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
                <h3 className="card-title">{project.name}</h3>
                <div className="card-meta">
                  <span>{project.contexts.length} components</span>
                  {project.tokens && <span>{project.tokens.reduce((sum, col) => sum + col.tokens.length, 0)} tokens</span>}
                  <span>Last sync: {new Date(project.lastSync).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
