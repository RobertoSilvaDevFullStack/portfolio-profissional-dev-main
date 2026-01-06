import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database.js';

// Get all notifications for a user
export const getNotifications = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;

        const notifications = await prisma.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });

        return res.json({
            success: true,
            data: { notifications },
        });
    } catch (error) {
        return next(error);
    }
};

// Mark notification as read
export const markAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user.id;

        const notification = await prisma.notification.findFirst({
            where: { id, userId },
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                error: 'Notification not found',
            });
        }

        const updated = await prisma.notification.update({
            where: { id },
            data: { read: true },
        });

        return res.json({
            success: true,
            data: { notification: updated },
        });
    } catch (error) {
        return next(error);
    }
};

// Mark all notifications as read
export const markAllAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = (req as any).user.id;

        await prisma.notification.updateMany({
            where: { userId, read: false },
            data: { read: true },
        });

        return res.json({
            success: true,
            message: 'All notifications marked as read',
        });
    } catch (error) {
        return next(error);
    }
};

// Delete notification
export const deleteNotification = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user.id;

        const notification = await prisma.notification.findFirst({
            where: { id, userId },
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                error: 'Notification not found',
            });
        }

        await prisma.notification.delete({
            where: { id },
        });

        return res.json({
            success: true,
            message: 'Notification deleted',
        });
    } catch (error) {
        return next(error);
    }
};
