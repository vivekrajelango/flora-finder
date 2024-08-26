/** @type {import('next').NextConfig} */
import { config } from 'dotenv';
config(); // Load .env file

export default {
  env: {
    NEXT_PUBLIC_GOOGLE_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  },
};
