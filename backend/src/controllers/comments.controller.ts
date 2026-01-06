import { Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database.js';
import { AuthRequest } from '../middleware/auth.js';

const createCommentSchema = z.object({
    postId: z.string().uuid('ID do post inválido'),
    authorName: z.string().min(1, 'Nome é obrigatório'),
    authorEmail: z.string().email('Email inválido'),
    content: z.string().min(1, 'Comentário não pode estar vazio'),
    parentId: z.string().uuid('ID do comentário pai inválido').optional(),
});

const updateCommentSchema = z.object({
    content: z.string().min(1, 'Comentário não pode estar vazio'),
});

const moderateCommentSchema = z.object({
    status: z.enum(['approved', 'rejected', 'spam']),
    moderationNotes: z.string().optional(),
});

// GET /api/comments/post/:postId - Listar comentários de um post
export const getCommentsByPost = async (req: AuthRequest, res: Response) => {
    try {
        const { postId } = req.params;

        const where: any = { postId, parentId: null }; // Only root comments

        // Se não autenticado, mostrar apenas aprovados
        if (!req.user) {
            where.status = 'approved';
        }

        const comments = await prisma.comment.findMany({
            where,
            include: {
                author: {
                    select: {
                        id: true,
                        fullName: true,
                        avatarUrl: true,
                    },
                },
                likes: {
                    select: {
                        userId: true,
                    },
                },
                replies: {
                    where: req.user ? {} : { status: 'approved' },
                    include: {
                        author: {
                            select: {
                                id: true,
                                fullName: true,
                                avatarUrl: true,
                            },
                        },
                        likes: {
                            select: {
                                userId: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return res.json({ comments });
    } catch (error) {
        console.error('Get comments error:', error);
        return res.status(500).json({ error: 'Erro ao buscar comentários' });
    }
};

// POST /api/comments - Criar comentário (público)
export const createComment = async (req: AuthRequest, res: Response) => {
    try {
        const data = createCommentSchema.parse(req.body);

        const comment = await prisma.comment.create({
            data: {
                ...data,
                authorId: req.user?.userId, // Se autenticado, associa ao usuário
            },
        });

        return res.status(201).json({
            message: 'Comentário enviado para moderação',
            comment: {
                id: comment.id,
                createdAt: comment.createdAt,
            },
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors[0].message });
        }
        console.error('Create comment error:', error);
        return res.status(500).json({ error: 'Erro ao criar comentário' });
    }
};

// PUT /api/comments/:id - Atualizar comentário (requer auth e ser autor)
export const updateComment = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Não autenticado' });
        }

        const { id } = req.params;
        const data = updateCommentSchema.parse(req.body);

        // Verificar se o comentário existe e se o usuário é o autor
        const existingComment = await prisma.comment.findUnique({
            where: { id },
        });

        if (!existingComment) {
            return res.status(404).json({ error: 'Comentário não encontrado' });
        }

        if (existingComment.authorId !== req.user.userId) {
            return res.status(403).json({ error: 'Sem permissão para editar' });
        }

        const comment = await prisma.comment.update({
            where: { id },
            data: {
                content: data.content,
            },
        });

        return res.json({ comment });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors[0].message });
        }
        console.error('Update comment error:', error);
        return res.status(500).json({ error: 'Erro ao atualizar comentário' });
    }
};

// PUT /api/comments/:id/moderate - Moderar comentário (requer auth)
export const moderateComment = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Não autenticado' });
        }

        const { id } = req.params;
        const data = moderateCommentSchema.parse(req.body);

        const comment = await prisma.comment.update({
            where: { id },
            data: {
                status: data.status,
                moderationNotes: data.moderationNotes,
                moderatedBy: req.user.userId,
                moderatedAt: new Date(),
            },
        });

        return res.json({ comment });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors[0].message });
        }
        console.error('Moderate comment error:', error);
        return res.status(500).json({ error: 'Erro ao moderar comentário' });
    }
};

// DELETE /api/comments/:id - Deletar comentário (requer auth)
export const deleteComment = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Não autenticado' });
        }

        const { id } = req.params;

        // Verificar se é autor ou admin (aqui simplificado - todos autenticados podem deletar)
        await prisma.comment.delete({
            where: { id },
        });

        return res.json({ message: 'Comentário deletado com sucesso' });
    } catch (error) {
        console.error('Delete comment error:', error);
        return res.status(500).json({ error: 'Erro ao deletar comentário' });
    }
};

// POST /api/comments/:id/like - Curtir/descurtir comentário (toggle)
export const toggleLike = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Não autenticado' });
        }

        const { id: commentId } = req.params;
        const userId = req.user.userId;

        // Verificar se já curtiu
        const existingLike = await prisma.commentLike.findUnique({
            where: {
                commentId_userId: {
                    commentId,
                    userId,
                },
            },
        });

        if (existingLike) {
            // Remover curtida
            await prisma.commentLike.delete({
                where: { id: existingLike.id },
            });
            return res.json({ liked: false, message: 'Curtida removida' });
        } else {
            // Adicionar curtida
            await prisma.commentLike.create({
                data: {
                    commentId,
                    userId,
                },
            });
            return res.json({ liked: true, message: 'Comentário curtido' });
        }
    } catch (error) {
        console.error('Toggle like error:', error);
        return res.status(500).json({ error: 'Erro ao processar curtida' });
    }
};
