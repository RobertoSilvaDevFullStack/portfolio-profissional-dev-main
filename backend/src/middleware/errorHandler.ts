import { Request, Response, NextFunction } from 'express';

// Error handler middleware
export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Error:', err);

    // Default error
    const statusCode = (err as any).statusCode || 500;
    const message = err.message || 'Erro interno do servidor';

    return res.status(statusCode).json({
        error: message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};
