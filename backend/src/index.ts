import dotenv from 'dotenv';
// Load environment variables before any other imports
dotenv.config();

import { app } from './app';
import { env } from './config/env';

const start = async () => {
  try {
    const port = parseInt(env.PORT);
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 Server listening at http://localhost:${port}`);
    console.log(`Routes registered at /api/v1/transactions`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
