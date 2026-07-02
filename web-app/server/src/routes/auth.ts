import { Router } from 'express';
import authController from '../controllers/authController';

const router = Router();

router.post('/api-key', authController.generateApiKey.bind(authController));

export default router;
