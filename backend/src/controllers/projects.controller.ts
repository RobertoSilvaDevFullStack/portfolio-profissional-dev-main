import { Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database.js';
import { AuthRequest } from '../middleware/auth.js';

const createProjectSchema = z.object({
    title: z.string().min(1, 'Título é obrigatório'),
    description: z.string().optional(),
    imageUrl: z.string().optional(),
    projectUrl: z.string().optional(),
    githubUrl: z.string().optional(),
    technologies: z.array(z.string()).default([]),
    status: z.enum(['active', 'archived']).default('active'),
    order: z.number().default(0),
});

// GET /api/projects - Listar projetos (público)
export const getProjects = async (req: AuthRequest, res: Response) => {
    try {
        const { status } = req.query;

        const where: any = {};

        // Se não autenticado, mostrar apenas ativos
        if (!req.user) {
            where.status = 'active';
        } else if (status) {
            where.status = status as string;
        }

        const projects = await prisma.project.findMany({
            where,
            orderBy: [
                { order: 'asc' },
                { createdAt: 'desc' },
            ],
        });

        res.json({ projects });
    } catch (error) {
        console.error('Get projects error:', error);
        res.status(500).json({ error: 'Erro ao buscar projetos' });
    }
};

// POST /api/projects - Criar projeto (requer auth)
export const createProject = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Não autenticado' });
        }

        const data = createProjectSchema.parse(req.body);

        const project = await prisma.project.create({
            data,
        });

        res.status(201).json({ project });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors[0].message });
        }
        console.error('Create project error:', error);
        res.status(500).json({ error: 'Erro ao criar projeto' });
    }
};

// PUT /api/projects/:id - Atualizar projeto (requer auth)
export const updateProject = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Não autenticado' });
        }

        const { id } = req.params;
        const data = createProjectSchema.partial().parse(req.body);

        const project = await prisma.project.update({
            where: { id },
            data,
        });

        res.json({ project });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors[0].message });
        }
        console.error('Update project error:', error);
        res.status(500).json({ error: 'Erro ao atualizar projeto' });
    }
};

// DELETE /api/projects/:id - Deletar projeto (requer auth)
export const deleteProject = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Não autenticado' });
        }

        const { id } = req.params;

        await prisma.project.delete({
            where: { id },
        });

        res.json({ message: 'Projeto deletado com sucesso' });
    } catch (error) {
        console.error('Delete project error:', error);
        res.status(500).json({ error: 'Erro ao deletar projeto' });
    }
};
