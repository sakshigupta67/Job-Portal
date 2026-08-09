import './config/instrument.js';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import connectDB from './config/db.js';
import * as Sentry from '@sentry/node';
import { clerkWebhooks } from './controllers/webhooks.js';

// Initialize Express
const app = express();

// Connect to database
await connectDB();

// Middleware
app.use(cors());

// IMPORTANT: Clerk webhook must come before express.json()
app.post(
  '/webhooks',
  express.raw({ type: 'application/json' }),
  clerkWebhooks
);

// Normal JSON requests
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('API Working');
});

app.get('/debug-sentry', function mainHandler(req, res) {
  throw new Error('My first Sentry error!');
});

// Sentry error handler
Sentry.setupExpressErrorHandler(app);

// Vercel handles the server
export default app;