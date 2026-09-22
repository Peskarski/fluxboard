import type { Request, Response, NextFunction } from 'express';
import { verifyJwt } from './jwt.js';
import { AUTH_COOKIE_NAME } from './constants.js';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token = req.cookies[AUTH_COOKIE_NAME] as string | undefined;
  if (!token) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  try {
    req.userId = verifyJwt(token).userId;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
