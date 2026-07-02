import axios from 'axios';
import { ContextData, Project } from '../types';

const API_BASE_URL = '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const apiService = {
  async getProjects(): Promise<Project[]> {
    const response = await api.get('/projects');
    return response.data;
  },
  
  async getProject(fileKey: string): Promise<Project> {
    const response = await api.get(`/projects/${fileKey}`);
    return response.data;
  },
  
  async getContexts(fileKey: string): Promise<ContextData[]> {
    const response = await api.get(`/projects/${fileKey}/contexts`);
    return response.data;
  },
  
  async getContext(fileKey: string, contextId: string): Promise<ContextData> {
    const response = await api.get(`/projects/${fileKey}/contexts/${contextId}`);
    return response.data;
  },
  
  async createApiKey(): Promise<string> {
    const response = await api.post('/auth/api-key');
    return response.data.apiKey;
  },
  
  async searchContexts(query: string): Promise<ContextData[]> {
    const response = await api.get('/search', { params: { q: query } });
    return response.data;
  }
};

export default apiService;
