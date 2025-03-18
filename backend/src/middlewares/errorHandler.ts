import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export class HttpError extends Error {
  status: number;
  
  constructor(message: string, status: number = 500) {
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export const errorHandler = (
  err: Error | HttpError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500;
  let errorMessage = 'Internal Server Error';
  let errorType = 'SERVER_ERROR';

  if (err instanceof HttpError) {
    statusCode = err.status;
    errorMessage = err.message;
    
    if (statusCode === 400) {
      errorType = 'BAD_REQUEST';
    } else if (statusCode === 401) {
      errorType = 'UNAUTHORIZED';
    } else if (statusCode === 403) {
      errorType = 'FORBIDDEN';
    } else if (statusCode === 404) {
      errorType = 'NOT_FOUND';
    }
  } else {
    // For unexpected errors, log them but don't expose details to client
    logger.error(`Unhandled error: ${err.message}`, { 
      stack: err.stack,
      path: req.path,
      method: req.method
    });
  }

  res.status(statusCode).json({
    error: errorType,
    message: errorMessage
  });
}; 