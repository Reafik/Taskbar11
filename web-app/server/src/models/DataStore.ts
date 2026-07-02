import fs from 'fs';
import path from 'path';
import { Project, ContextData } from '../types';

const DATA_DIR = path.join(__dirname, '../../data');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const API_KEYS_FILE = path.join(DATA_DIR, 'api-keys.json');

export class DataStore {
  constructor() {
    this.ensureDataDirectory();
  }

  private ensureDataDirectory() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(PROJECTS_FILE)) {
      fs.writeFileSync(PROJECTS_FILE, JSON.stringify([]));
    }
    if (!fs.existsSync(API_KEYS_FILE)) {
      fs.writeFileSync(API_KEYS_FILE, JSON.stringify([]));
    }
  }

  private readProjects(): Project[] {
    const data = fs.readFileSync(PROJECTS_FILE, 'utf-8');
    return JSON.parse(data);
  }

  private writeProjects(projects: Project[]) {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
  }

  private readApiKeys(): string[] {
    const data = fs.readFileSync(API_KEYS_FILE, 'utf-8');
    return JSON.parse(data);
  }

  private writeApiKeys(keys: string[]) {
    fs.writeFileSync(API_KEYS_FILE, JSON.stringify(keys, null, 2));
  }

  getAllProjects(): Project[] {
    return this.readProjects();
  }

  getProject(fileKey: string): Project | undefined {
    const projects = this.readProjects();
    return projects.find(p => p.fileKey === fileKey);
  }

  createOrUpdateProject(fileKey: string, name: string, contexts: ContextData[]): Project {
    const projects = this.readProjects();
    const existingIndex = projects.findIndex(p => p.fileKey === fileKey);
    
    if (existingIndex >= 0) {
      projects[existingIndex].name = name;
      projects[existingIndex].contexts = contexts;
      projects[existingIndex].lastSync = new Date().toISOString();
      this.writeProjects(projects);
      return projects[existingIndex];
    } else {
      const newProject: Project = {
        id: `proj_${Date.now()}`,
        fileKey,
        name,
        contexts,
        lastSync: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
      projects.push(newProject);
      this.writeProjects(projects);
      return newProject;
    }
  }

  getContexts(fileKey: string): ContextData[] {
    const project = this.getProject(fileKey);
    return project ? project.contexts : [];
  }

  getContext(fileKey: string, contextId: string): ContextData | undefined {
    const project = this.getProject(fileKey);
    if (!project) return undefined;
    return project.contexts.find(c => c.id === contextId);
  }

  createApiKey(apiKey: string): string {
    const keys = this.readApiKeys();
    keys.push(apiKey);
    this.writeApiKeys(keys);
    return apiKey;
  }

  validateApiKey(apiKey: string): boolean {
    const keys = this.readApiKeys();
    return keys.includes(apiKey);
  }

  searchContexts(query: string): ContextData[] {
    const projects = this.readProjects();
    const allContexts = projects.flatMap(p => p.contexts);
    const lowerQuery = query.toLowerCase();
    
    return allContexts.filter(ctx => 
      ctx.title.toLowerCase().includes(lowerQuery) ||
      ctx.description.toLowerCase().includes(lowerQuery) ||
      ctx.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }
}

export default new DataStore();
