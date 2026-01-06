import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import fs from 'fs/promises';
import path from 'path';

// POST /api/uploads/blog - Upload para blog (requer auth)
export const uploadBlogImage = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Não autenticado' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Nenhum arquivo enviado' });
        }

        // URL pública do arquivo
        const fileUrl = `/uploads/blog/${req.file.filename}`;

        return res.status(201).json({
            message: 'Upload realizado com sucesso',
            file: {
                filename: req.file.filename,
                originalName: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
                url: fileUrl,
            },
        });
    } catch (error) {
        console.error('Upload blog image error:', error);
        return res.status(500).json({ error: 'Erro ao fazer upload' });
    }
};

// POST /api/uploads/projects - Upload para projects (requer auth)
export const uploadProjectImage = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Não autenticado' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Nenhum arquivo enviado' });
        }

        const fileUrl = `/uploads/projects/${req.file.filename}`;

        return res.status(201).json({
            message: 'Upload realizado com sucesso',
            file: {
                filename: req.file.filename,
                originalName: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
                url: fileUrl,
            },
        });
    } catch (error) {
        console.error('Upload project image error:', error);
        return res.status(500).json({ error: 'Erro ao fazer upload' });
    }
};

// POST /api/uploads/site - Upload geral (requer auth)
export const uploadSiteAsset = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Não autenticado' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'Nenhum arquivo enviado' });
        }

        const fileUrl = `/uploads/site/${req.file.filename}`;

        return res.status(201).json({
            message: 'Upload realizado com sucesso',
            file: {
                filename: req.file.filename,
                originalName: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size,
                url: fileUrl,
            },
        });
    } catch (error) {
        console.error('Upload site asset error:', error);
        return res.status(500).json({ error: 'Erro ao fazer upload' });
    }
};

// DELETE /api/uploads/:category/:filename - Deletar arquivo (requer auth)
export const deleteFile = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Não autenticado' });
        }

        const { category, filename } = req.params;

        // Validar categoria
        if (!['blog', 'projects', 'site'].includes(category)) {
            return res.status(400).json({ error: 'Categoria inválida' });
        }

        // Validar filename (evitar path traversal)
        if (filename.includes('..') || filename.includes('/')) {
            return res.status(400).json({ error: 'Nome de arquivo inválido' });
        }

        const filePath = path.join(process.cwd(), 'uploads', category, filename);

        // Verificar se arquivo existe
        try {
            await fs.access(filePath);
        } catch {
            return res.status(404).json({ error: 'Arquivo não encontrado' });
        }

        // Deletar arquivo
        await fs.unlink(filePath);

        return res.json({ message: 'Arquivo deletado com sucesso' });
    } catch (error) {
        console.error('Delete file error:', error);
        return res.status(500).json({ error: 'Erro ao deletar arquivo' });
    }
};
