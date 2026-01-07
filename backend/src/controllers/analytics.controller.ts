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

        // Popular posts (by views)
        const popularPosts = await prisma.post.findMany({
            where: { status: 'published' },
            orderBy: { viewCount: 'desc' },
            take: 3,
            select: {
                title: true,
                viewCount: true,
                _count: { select: { comments: true } } // Using comments count as proxy for shares/engagement for now
            }
        });

        // Project clicks
        const projectClicks = await prisma.project.findMany({
            where: { status: 'active' },
            orderBy: { clicks: 'desc' },
            take: 5,
            select: {
                title: true,
                clicks: true
            }
        });

        // Traffic sources (aggregated from PageVisit)
        // This is a simplified aggregation. For production with huge data, use raw SQL or optimized queries.
        const visits = await prisma.pageVisit.findMany({
            select: { referrer: true },
            take: 1000, // Limit sample size for performance
            orderBy: { createdAt: 'desc' }
        });

        const sourcesMap = visits.reduce((acc: any, visit) => {
            let source = 'Direto';
            if (visit.referrer) {
                try {
                    const url = new URL(visit.referrer);
                    if (url.hostname.includes('facebook') || url.hostname.includes('instagram') || url.hostname.includes('linkedin') || url.hostname.includes('twitter')) {
                        source = 'Redes Sociais';
                    } else if (url.hostname.includes('google') || url.hostname.includes('bing')) {
                        source = 'Pesquisa Orgânica';
                    } else if (url.hostname !== 'localhost' && !url.hostname.includes('robertosilvadevfullstack')) {
                        source = url.hostname;
                    }
                } catch (e) {
                    // Invalid URL, keep as is or ignore
                }
            }
            acc[source] = (acc[source] || 0) + 1;
            return acc;
        }, {});

        const trafficSources = Object.entries(sourcesMap)
            .map(([name, value]) => ({ name, value: Number(value) }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 4);

        return res.json({
            success: true,
            data: {
                posts: postsCount,
                projects: projectsCount,
                leads: leadsCount,
                visits: visitsCount,
                popularPosts: popularPosts.map(p => ({
                    title: p.title,
                    views: p.viewCount,
                    shares: p._count.comments // Placeholder
                })),
                projectClicks,
                trafficSources
            },
        });
    } catch (error) {
        return next(error);
    }
};

// Log project click
export const logProjectClick = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await prisma.project.update({
            where: { id },
            data: { clicks: { increment: 1 } }
        });
        return res.json({ success: true });
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
                referrer: referrer || null,
                userAgent: userAgent || null,
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

// DEBUG: Get raw counts
export const getDebugCounts = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const [visits, projects, posts] = await Promise.all([
            prisma.pageVisit.findMany({ take: 10, orderBy: { createdAt: 'desc' } }),
            prisma.project.findMany({ take: 5, select: { id: true, title: true, clicks: true } }),
            prisma.post.findMany({ take: 5, select: { id: true, title: true, viewCount: true } }),
        ]);

        return res.json({
            success: true,
            data: {
                recentVisits: visits,
                projects,
                posts,
                counts: {
                    totalVisits: await prisma.pageVisit.count(),
                    totalProjects: await prisma.project.count(),
                    totalPosts: await prisma.post.count(),
                }
            },
        });
    } catch (error) {
        return next(error);
    }
};
