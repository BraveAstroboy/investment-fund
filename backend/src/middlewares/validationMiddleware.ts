import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { HttpError } from './errorHandler';

export const validationMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const validationErrors = errors.array().map(error => ({
      field: error.type === 'field' ? error.path : 'unknown',
      message: error.msg
    }));
    
    throw new HttpError(
      'Validation failed: ' + validationErrors.map(e => `${e.field}: ${e.message}`).join(', '),
      400
    );
  }
  
  next();
}; 