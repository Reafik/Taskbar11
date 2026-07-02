import { Router } from 'express';
import figmaController from '../controllers/figmaController';
import { authenticateApiKey, optionalAuth } from '../middleware/auth';

const router = Router();

// Analyze Figma file by URL or file key
router.post('/analyze', optionalAuth, figmaController.analyzeFile.bind(figmaController));

// Get tokens for a file
router.get('/:fileKey/tokens', optionalAuth, figmaController.getTokens.bind(figmaController));

// Update token context
router.put('/:fileKey/tokens/:tokenId', authenticateApiKey, figmaController.updateTokenContext.bind(figmaController));

// Search tokens
router.get('/tokens/search', optionalAuth, figmaController.searchTokens.bind(figmaController));

export default router;
