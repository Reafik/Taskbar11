import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Project, ContextData } from '../types';
import apiService from '../services/api';

const ProjectPage: React.FC = () => {
  const { fileKey } = useParams<{ fileKey: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [contexts, setContexts] = useState<ContextData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  useEffect(() => {
    if (fileKey) {
      loadProject();
    }
  }, [fileKey]);
  
  const loadProject = async () => {
    try {
      const projectData = await apiService.getProject(fileKey!);
      setProject(projectData);
      setContexts(projectData.contexts);
    } catch (error) {
      console.error('Failed to load project', error);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredContexts = contexts.filter(ctx => {
    const matchesSearch = ctx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ctx.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || ctx.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });
  
  const allTags = Array.from(new Set(contexts.flatMap(ctx => ctx.tags)));
  
  if (loading) {
    return <div className="container"><div className="loading">Loading design system...</div></div>;
  }
  
  if (!project) {
    return <div className="container"><div className="empty-state">Project not found</div></div>;
  }
  
  return (
    <div className="container">
      <div style={{ marginBottom: 32 }}>
        <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
          ← Back to projects
        </Link>
      </div>
      
      <h1 className="page-title">{project.name}</h1>
      
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-meta">
          <span>{contexts.length} components documented</span>
          <span>Last synced: {new Date(project.lastSync).toLocaleString()}</span>
        </div>
      </div>
      
      <input
        type="text"
        className="search-box"
        placeholder="Search components..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      
      {allTags.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <button
            className={`tag ${!selectedTag ? 'active' : ''}`}
            onClick={() => setSelectedTag(null)}
            style={{ cursor: 'pointer' }}
          >
            All
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              className={`tag ${selectedTag === tag ? 'active' : ''}`}
              onClick={() => setSelectedTag(tag)}
              style={{ cursor: 'pointer' }}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
      
      {filteredContexts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h2>No components found</h2>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid">
          {filteredContexts.map((context) => (
            <Link
              to={`/project/${fileKey}/context/${context.id}`}
              key={context.id}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="card" style={{ cursor: 'pointer' }}>
                <h3 className="card-title">{context.title}</h3>
                <p className="card-description">
                  {context.description.substring(0, 120)}
                  {context.description.length > 120 ? '...' : ''}
                </p>
                <div style={{ marginTop: 12 }}>
                  {context.tags.map(tag => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectPage;
