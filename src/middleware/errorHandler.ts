import { NextFunction, Request, Response } from 'express';
import { SERVICE_ID } from '../config/serviceConfig';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  console.error('Unhandled error in request', err);

  res.status(500).json({
    ok: false,
    error: err.message || 'Internal server error',
    service: SERVICE_ID,
  });
}

export default errorHandler;
