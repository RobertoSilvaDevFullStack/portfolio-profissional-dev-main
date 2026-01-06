import { Response } from 'express';
import { z } from 'zod';
import prisma from '../config/database.js';
import { AuthRequest } from '../middleware/auth.js';

const createLeadSchema = z.object({
    name: z.string().min(1, 'Nome é obrigatório'),
    email: z.string().email('Email inválido'),
    message: z.string().optional(),
    phone: z.string().optional(),
});

const updateLeadSchema = z.object({
    status: z.enum(['new', 'contacted', 'converted', 'archived']),
    notes: z.string().optional(),
});

export const createLead = async (req: AuthRequest, res: Response) => {
    try {
        const data = createLeadSchema.parse(req.body);

        const lead = await prisma.lead.create({
            data,
        });

        return res.status(201).json({
            message: 'Mensagem enviada com sucesso!',
            lead: {
                id: lead.id,
                createdAt: lead.createdAt,
            },
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors[0].message });
        }
        console.error('Create lead error:', error);
        return res.status(500).json({ error: 'Erro ao enviar mensagem' });
    }
};

export const getLeads = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Não autenticado' });
        }

        const { status } = req.query;

        const where: any = {};
        if (status) {
            where.status = status as string;
        }

        const leads = await prisma.lead.findMany({
            where,
            orderBy: {
                createdAt: 'desc',
            },
        });

        return res.json({ leads });
    } catch (error) {
        console.error('Get leads error:', error);
        return res.status(500).json({ error: 'Erro ao buscar leads' });
    }
};

export const updateLead = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Não autenticado' });
        }

        const { id } = req.params;
        const data = updateLeadSchema.parse(req.body);

        const lead = await prisma.lead.update({
            where: { id },
            data,
        });

        return res.json({ lead });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: error.errors[0].message });
        }
        console.error('Update lead error:', error);
        return res.status(500).json({ error: 'Erro ao atualizar lead' });
    }
};

export const deleteLead = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Não autenticado' });
        }

        const { id } = req.params;

        await prisma.lead.delete({
            where: { id },
        });

        return res.json({ message: 'Lead deletado com sucesso' });
    } catch (error) {
        console.error('Delete lead error:', error);
        return res.status(500).json({ error: 'Erro ao deletar lead' });
    }
};
