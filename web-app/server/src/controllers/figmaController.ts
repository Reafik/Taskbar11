import { Request, Response } from 'express';
import FigmaService from '../services/FigmaService';
import dataStore from '../models/DataStore';

export class FigmaController {
  async analyzeFile(req: Request, res: Response) {
    try {
      const { url, fileKey: directFileKey, accessToken } = req.body;
      
      let fileKey = directFileKey;
      
      // Extract file key from URL if provided
      if (url && !fileKey) {
        fileKey = FigmaService.extractFileKeyFromUrl(url);
        if (!fileKey) {
          return res.status(400).json({ error: 'Invalid Figma URL' });
        }
      }
      
      if (!fileKey) {
        return res.status(400).json({ error: 'File key or URL is required' });
      }

      // Use provided access token or fall back to server token
      const figmaService = new FigmaService(accessToken);
      
      // Analyze the design system
      const { file, tokens } = await figmaService.analyzeDesignSystem(fileKey);
      
      // Save or update project
      const project = dataStore.createOrUpdateProject(
        fileKey,
        file.name,
        [], // Empty contexts initially
        tokens,
        url
      );
      
      res.json({
        success: true,
        project: {
          id: project.id,
          fileKey,
          name: file.name,
          tokenCount: tokens.reduce((sum, col) => sum + col.tokens.length, 0),
          collections: tokens.length,
          lastModified: file.lastModified,
          thumbnailUrl: file.thumbnailUrl
        },
        tokens
      });
    } catch (error) {
      console.error('Error analyzing Figma file:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Failed to analyze Figma file' 
      });
    }
  }

  async getTokens(req: Request, res: Response) {
    try {
      const { fileKey } = req.params;
      const tokens = dataStore.getTokens(fileKey);
      res.json(tokens);
    } catch (error) {
      console.error('Error getting tokens:', error);
      res.status(500).json({ error: 'Failed to get tokens' });
    }
  }

  async updateTokenContext(req: Request, res: Response) {
    try {
      const { fileKey, tokenId } = req.params;
      const { description, usage } = req.body;
      
      const token = dataStore.updateTokenContext(fileKey, tokenId, description, usage);
      
      if (!token) {
        return res.status(404).json({ error: 'Token not found' });
      }
      
      res.json({ success: true, token });
    } catch (error) {
      console.error('Error updating token context:', error);
      res.status(500).json({ error: 'Failed to update token context' });
    }
  }

  async searchTokens(req: Request, res: Response) {
    try {
      const query = req.query.q as string;
      
      if (!query) {
        return res.status(400).json({ error: 'Missing search query' });
      }
      
      const results = dataStore.searchTokens(query);
      res.json(results);
    } catch (error) {
      console.error('Error searching tokens:', error);
      res.status(500).json({ error: 'Failed to search tokens' });
    }
  }
}

export default new FigmaController();
