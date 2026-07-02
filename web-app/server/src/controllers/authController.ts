import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import dataStore from '../models/DataStore';

export class AuthController {
  async generateApiKey(req: Request, res: Response) {
    try {
      const apiKey = `dcp_${uuidv4().replace(/-/g, '')}`;
      dataStore.createApiKey(apiKey);
      
      res.json({ apiKey });
    } catch (error) {
      console.error('Error generating API key:', error);
      res.status(500).json({ error: 'Failed to generate API key' });
    }
  }
}

export default new AuthController();
