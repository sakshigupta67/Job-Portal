import './config/instrument.js';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import * as Sentry from '@sentry/node';
import { clerkWebhooks } from './controllers/webhooks.js';
import companyRoutes from './routes/companyRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import userRoutes from './routes/userRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

await connectDB();

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);

app.post('/webhooks', express.raw({ type: 'application/json' }), clerkWebhooks);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/company', companyRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('API Working');
});

app.get('/debug-sentry', function mainHandler(req, res) {
  throw new Error('My first Sentry error!');
});

Sentry.setupExpressErrorHandler(app);

if (!process.env.VERCEL) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

export default app;