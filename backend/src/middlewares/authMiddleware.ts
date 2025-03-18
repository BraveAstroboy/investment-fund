import { Request, Response, NextFunction } from 'express';
import { HttpError } from './errorHandler';

// Simple API key middleware for basic security
export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string;
  
  // In a real application, this would check against a DB or environment variable
  // For this example, we're using a simple check
  if (!apiKey || apiKey !== process.env.API_KEY) {
    throw new HttpError('Invalid or missing API key', 401);
  }
  
  next();
}; 