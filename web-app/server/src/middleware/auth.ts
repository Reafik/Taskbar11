import { Request, Response, NextFunction } from 'express';
import dataStore from '../models/DataStore';

export function authenticateApiKey(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid API key' });
  }
  
  const apiKey = authHeader.substring(7);
  
  if (!dataStore.validateApiKey(apiKey)) {
    return res.status(401).json({ error: 'Unauthorized: Invalid API key' });
  }
  
  next();
}

export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const apiKey = authHeader.substring(7);
    if (dataStore.validateApiKey(apiKey)) {
      (req as any).authenticated = true;
    }
  }
  
  next();
}
