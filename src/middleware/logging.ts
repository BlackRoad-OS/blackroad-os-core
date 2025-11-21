import { Request, Response, NextFunction } from 'express';
import { SERVICE_ID } from '../config/serviceConfig';

export function loggingMiddleware(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logEntry = {
      ts: new Date(start).toISOString(),
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      duration_ms: duration,
      service_id: SERVICE_ID,
    };

    try {
      console.log(JSON.stringify(logEntry));
    } catch (error) {
      console.error('Failed to log request', error);
    }
  });

  next();
}

export default loggingMiddleware;
