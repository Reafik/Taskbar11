import { Router } from 'express';
import projectController from '../controllers/projectController';
import { authenticateApiKey, optionalAuth } from '../middleware/auth';

const router = Router();

router.get('/projects', optionalAuth, projectController.getAllProjects.bind(projectController));
router.get('/projects/:fileKey', optionalAuth, projectController.getProject.bind(projectController));
router.get('/projects/:fileKey/contexts', optionalAuth, projectController.getContexts.bind(projectController));
router.get('/projects/:fileKey/contexts/:contextId', optionalAuth, projectController.getContext.bind(projectController));
router.get('/search', optionalAuth, projectController.searchContexts.bind(projectController));

router.post('/sync', authenticateApiKey, projectController.syncFromFigma.bind(projectController));

export default router;
