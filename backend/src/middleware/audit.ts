import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import prisma from '../config/database';

export const audit = (action: string, resource: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    res.on('finish', async () => {
      try {
        if (req.user) {
          await prisma.auditLog.create({
            data: {
              userId: req.user.id,
              action,
              resource,
              resourceId: req.params.id || null,
              details: { body: req.body, query: req.query, params: req.params } as any,
              ipAddress: req.ip || req.socket.remoteAddress || null
            }
          });
        }
      } catch (error) {
        console.error('Failed to save audit log:', error);
      }
    });
    next();
  };
};
