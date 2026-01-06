import multer from 'multer';
import path from 'path';
import { Request } from 'express';

// Configuração de armazenamento
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        // Determina pasta baseado na rota
        const uploadPath = _req.path.includes('blog')
            ? './uploads/blog'
            : _req.path.includes('projects')
                ? './uploads/projects'
                : './uploads/site';

        cb(null, uploadPath);
    },
    filename: (_req, file, cb) => {
        // Gera nome único: timestamp-random-originalname
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext)
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '');

        cb(null, `${name}-${uniqueSuffix}${ext}`);
    },
});

// Filtro de tipos de arquivo
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
    ];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de arquivo não permitido. Apenas imagens (JPEG, PNG, GIF, WebP, SVG).'));
    }
};

// Configuração do Multer
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB padrão
    },
});

// Middleware para upload único
export const uploadSingle = upload.single('file');

// Middleware para múltiplos uploads
export const uploadMultiple = upload.array('files', 10);
