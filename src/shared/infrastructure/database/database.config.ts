import * as dotenv from 'dotenv';
dotenv.config();

export const databaseConfig = {
  mongoUrl: process.env.MONGODB_URI ?? 'mongodb://localhost/project-tracking',
};
