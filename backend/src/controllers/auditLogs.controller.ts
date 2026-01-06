import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database.js';

// Get all audit logs
export const getAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { limit = '50', offset = '0', action, userId } = req.query;

        const where: any = {};
        if (action) where.action = action;
        if (userId) where.userId = userId;

        const logs = await prisma.auditLog.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        fullName: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: parseInt(limit as string),
            skip: parseInt(offset as string),
        });

        const total = await prisma.auditLog.count({ where });

        return res.json({
            success: true,
            data: {
                logs,
                pagination: {
                    total,
                    limit: parseInt(limit as string),
                    offset: parseInt(offset as string),
                },
            },
        });
    } catch (error) {
        return next(error);
    }
};

// Create audit log (internal use)
export const createAuditLog = async (
    userId: string,
    action: string,
    entity: string,
    entityId: string,
    oldData?: any,
    newData?: any,
    ipAddress?: string,
    userAgent?: string
) => {
    try {
        await prisma.auditLog.create({
            data: {
                userId,
                action,
                entity,
                entityId,
                oldData,
                newData,
                ipAddress,
                userAgent,
            },
        });
    } catch (error) {
        console.error('Error creating audit log:', error);
    }
};
