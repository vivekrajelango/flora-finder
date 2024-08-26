/** @type {import('next').NextConfig} */
import { config } from 'dotenv';
config(); // Load .env file

export default {
  env: {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY
  },
};
