import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

const ImportPage: React.FC = () => {
  const [figmaUrl, setFigmaUrl] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!figmaUrl) {
      setError('Please enter a Figma URL');
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await apiService.analyzeFigmaFile(figmaUrl, accessToken || undefined);
      
      if (result.success) {
        navigate(`/project/${result.project.fileKey}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to analyze Figma file. Please check your URL and access token.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container">
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h1 className="page-title">Import Design System</h1>
        
        <div className="card">
          <p style={{ marginBottom: 24, color: 'var(--text-secondary)' }}>
            Paste your Figma file URL to automatically extract design tokens and components.
          </p>
          
          <form onSubmit={handleImport}>
            <label htmlFor="figmaUrl">Figma File URL *</label>
            <input
              type="text"
              id="figmaUrl"
              className="search-box"
              placeholder="https://www.figma.com/file/..."
              value={figmaUrl}
              onChange={(e) => setFigmaUrl(e.target.value)}
              disabled={loading}
              style={{ marginBottom: 16 }}
            />
            
            <label htmlFor="accessToken">Figma Personal Access Token (Optional)</label>
            <input
              type="password"
              id="accessToken"
              className="search-box"
              placeholder="figd_..."
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              disabled={loading}
              style={{ marginBottom: 8 }}
            />
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 24 }}>
              Required only for private files. Get your token from{' '}
              <a href="https://www.figma.com/developers/api#access-tokens" target="_blank" rel="noopener noreferrer">
                Figma Settings
              </a>
            </p>
            
            {error && (
              <div style={{ 
                padding: 12, 
                background: 'rgba(242, 72, 34, 0.1)', 
                border: '1px solid rgba(242, 72, 34, 0.2)',
                borderRadius: 6,
                color: '#f24822',
                marginBottom: 16,
                fontSize: 14
              }}>
                {error}
              </div>
            )}
            
            <button 
              type="submit" 
              className="button" 
              disabled={loading}
              style={{ width: '100%', opacity: loading ? 0.6 : 1 }}
            >
              {loading ? 'Analyzing...' : 'Analyze Design System'}
            </button>
          </form>
        </div>
        
        <div className="card" style={{ marginTop: 24, background: 'var(--surface)' }}>
          <h3 style={{ marginBottom: 12 }}>What gets imported?</h3>
          <ul style={{ paddingLeft: 24, lineHeight: 2, color: 'var(--text-secondary)' }}>
            <li>Design tokens (colors, typography, spacing, etc.)</li>
            <li>Variable collections and modes</li>
            <li>Component structure</li>
            <li>File metadata</li>
          </ul>
          
          <h3 style={{ marginTop: 24, marginBottom: 12 }}>How it works</h3>
          <ol style={{ paddingLeft: 24, lineHeight: 2, color: 'var(--text-secondary)' }}>
            <li>Paste your Figma file URL</li>
            <li>We analyze your design system</li>
            <li>Add context and documentation to tokens</li>
            <li>Share with your team</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default ImportPage;
