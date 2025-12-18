import 'dotenv/config';

import { z } from 'zod';

// Schema for environment variables
const envSchema = z.object({
  PORT: z.string().default('3000'),
  API_KEY: z.string().min(1, "API_KEY is required for Gemini AI"),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// Validate process.env
// In a real Node environment, we would use dotenv.config() in index.ts before this.
// For this environment, we assume process.env is populated.
export const env = envSchema.parse(process.env);
