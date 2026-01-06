import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database.js';

// Get analytics/stats
export const getStats = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const [postsCount, projectsCount, leadsCount, visitsCount] = await Promise.all([
            prisma.post.count({ where: { status: 'published' } }),
            prisma.project.count({ where: { status: 'active' } }),
            prisma.lead.count(),
            prisma.pageVisit.count(),
        ]);

        return res.json({
            success: true,
            data: {
                posts: postsCount,
                projects: projectsCount,
                leads: leadsCount,
                visits: visitsCount,
            },
        });
    } catch (error) {
        return next(error);
    }
};

// Log page visit
export const logPageVisit = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, referrer, userAgent } = req.body;

        await prisma.pageVisit.create({
            data: {
                page: page || '/',
                referrer,
                userAgent,
                ipAddress: req.ip || 'unknown',
            },
        });

        return res.json({
            success: true,
            message: 'Page visit logged',
        });
    } catch (error) {
        return next(error);
    }
};

// Get page visits
export const getPageVisits = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { limit = '100', page } = req.query;

        const where: any = {};
        if (page) where.page = page;

        const visits = await prisma.pageVisit.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: parseInt(limit as string),
        });

        const total = await prisma.pageVisit.count({ where });

        return res.json({
            success: true,
            data: {
                visits,
                total,
            },
        });
    } catch (error) {
        return next(error);
    }
};
