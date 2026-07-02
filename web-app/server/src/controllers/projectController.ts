import { Request, Response } from 'express';
import dataStore from '../models/DataStore';
import { SyncRequest } from '../types';

export class ProjectController {
  async getAllProjects(req: Request, res: Response) {
    try {
      const projects = dataStore.getAllProjects();
      res.json(projects);
    } catch (error) {
      console.error('Error getting projects:', error);
      res.status(500).json({ error: 'Failed to get projects' });
    }
  }

  async getProject(req: Request, res: Response) {
    try {
      const { fileKey } = req.params;
      const project = dataStore.getProject(fileKey);
      
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      res.json(project);
    } catch (error) {
      console.error('Error getting project:', error);
      res.status(500).json({ error: 'Failed to get project' });
    }
  }

  async syncFromFigma(req: Request, res: Response) {
    try {
      const syncData: SyncRequest = req.body;
      
      if (!syncData.fileKey || !syncData.contexts) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      const projectName = syncData.fileKey ? `Design System ${syncData.fileKey.substring(0, 8)}` : 'Design System';
      const project = dataStore.createOrUpdateProject(
        syncData.fileKey,
        projectName,
        syncData.contexts,
        syncData.tokens
      );
      
      res.json({
        success: true,
        project,
        message: `Synced ${syncData.contexts.length} contexts`
      });
    } catch (error) {
      console.error('Error syncing from Figma:', error);
      res.status(500).json({ error: 'Failed to sync from Figma' });
    }
  }

  async getContexts(req: Request, res: Response) {
    try {
      const { fileKey } = req.params;
      const contexts = dataStore.getContexts(fileKey);
      res.json(contexts);
    } catch (error) {
      console.error('Error getting contexts:', error);
      res.status(500).json({ error: 'Failed to get contexts' });
    }
  }

  async getContext(req: Request, res: Response) {
    try {
      const { fileKey, contextId } = req.params;
      const context = dataStore.getContext(fileKey, contextId);
      
      if (!context) {
        return res.status(404).json({ error: 'Context not found' });
      }
      
      res.json(context);
    } catch (error) {
      console.error('Error getting context:', error);
      res.status(500).json({ error: 'Failed to get context' });
    }
  }

  async searchContexts(req: Request, res: Response) {
    try {
      const query = req.query.q as string;
      
      if (!query) {
        return res.status(400).json({ error: 'Missing search query' });
      }
      
      const results = dataStore.searchContexts(query);
      res.json(results);
    } catch (error) {
      console.error('Error searching contexts:', error);
      res.status(500).json({ error: 'Failed to search contexts' });
    }
  }
}

export default new ProjectController();
