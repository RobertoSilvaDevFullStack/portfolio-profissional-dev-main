import { Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database.js';
import { AuthRequest } from '../middleware/auth.js';

const createPostSchema = z.object({
    title: z.string().min(1, 'Título é obrigatório'),
    slug: z.string().min(1, 'Slug é obrigatório'),
    excerpt: z.string().optional(),
    content: z.string().optional(),
    coverImageUrl: z.string().optional(),
    status: z.enum(['draft', 'scheduled', 'published']).default('draft'),
    scheduledFor: z.string().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    metaKeywords: z.string().optional(),
    metaOgImage: z.string().optional(),
});

// GET /api/posts - Listar posts (público)
export const getPosts = async (req: AuthRequest, res: Response) => {
    try {
        const { status } = req.query;

        const where: any = {};

        // Se não autenticado, mostrar apenas publicados
        if (!req.user) {
            where.status = 'published';
        } else if (status) {
            where.status = status as string;
        }

        const posts = await prisma.post.findMany({
            where,
            include: {
                author: {
                    select: {
                        id: true,
                        fullName: true,
                        avatarUrl: true,
                    },
                },
                _count: {
                    select: {
                        comments: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return res.json({ posts });
    } catch (error) {
        console.error('Get posts error:', error);
        return res.status(500).json({ error: 'Erro ao buscar posts' });
    }
};

// GET /api/posts/:slug - Buscar post por slug (público)
export const getPostBySlug = async (req: AuthRequest, res: Response) => {
    try {
        const { slug } = req.params;

        const post = await prisma.post.findUnique({
            where: { slug },
            include: {
                author: {
                    select: {
                        id: true,
                        fullName: true,
                        avatarUrl: true,
                    },
                },
                comments: {
                    where: { status: 'approved' },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!post) {
            return res.status(404).json({ error: 'Post não encontrado' });
        }

        // Se não publicado, requer autenticação
        if (post.status !== 'published' && !req.user) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        // Incrementar contador de visualizações
        await prisma.post.update({
            where: { id: post.id },
            data: { viewCount: { increment: 1 } },
        });

        return res.json({ post });
    } catch (error) {
        console.error('Get post by slug error:', error);
        return res.status(500).json({ error: 'Erro ao buscar post' });
    }
};

// POST /api/posts - Criar post (requer auth)
export const createPost = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Não autenticado' });
        }

        const data = createPostSchema.parse(req.body);

        const post = await prisma.post.create({
            data: {
                ...data,
                authorId: req.user.userId,
                scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : null,
                publishedAt: data.status === 'published' ? new Date() : null,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        fullName: true,
                        avatarUrl: true,
                    },
                },
            },
        });

        return res.status(201).json({ post });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors[0].message });
        }
        console.error('Create post error:', error);
        return res.status(500).json({ error: 'Erro ao criar post' });
    }
};

// PUT /api/posts/:id - Atualizar post (requer auth)
export const updatePost = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Não autenticado' });
        }

        const { id } = req.params;
        const data = createPostSchema.partial().parse(req.body);

        const post = await prisma.post.update({
            where: { id },
            data: {
                ...data,
                scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : undefined,
                publishedAt: data.status === 'published' ? new Date() : undefined,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        fullName: true,
                        avatarUrl: true,
                    },
                },
            },
        });

        return res.json({ post });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors[0].message });
        }
        console.error('Update post error:', error);
        return res.status(500).json({ error: 'Erro ao atualizar post' });
    }
};

// DELETE /api/posts/:id - Deletar post (requer auth)
export const deletePost = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Não autenticado' });
        }

        const { id } = req.params;

        await prisma.post.delete({
            where: { id },
        });

        return res.json({ message: 'Post deletado com sucesso' });
    } catch (error) {
        console.error('Delete post error:', error);
        return res.status(500).json({ error: 'Erro ao deletar post' });
    }
};
