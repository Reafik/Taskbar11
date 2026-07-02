import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import figmaRoutes from './routes/figma';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api', projectRoutes);
app.use('/api/figma', figmaRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Design Context Pro API is running' });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Design Context Pro API running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🎨 Figma API: ${process.env.FIGMA_ACCESS_TOKEN ? 'Configured' : 'Not configured'}`);
});

export default app;
