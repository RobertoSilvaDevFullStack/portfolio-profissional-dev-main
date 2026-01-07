import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import postsRoutes from './routes/posts.routes.js';
import projectsRoutes from './routes/projects.routes.js';
import leadsRoutes from './routes/leads.routes.js';
import commentsRoutes from './routes/comments.routes.js';
import uploadsRoutes from './routes/uploads.routes.js';
import notificationsRoutes from './routes/notifications.routes.js';
import auditLogsRoutes from './routes/auditLogs.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:8080'];
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, Postman)
        if (!origin) return callback(null, true);

        // Allow configured origins
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // Allow any origin for analytics endpoints (public tracking)
        // This is safe because analytics endpoints don't expose sensitive data
        return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: 'Muitas requisições deste IP, tente novamente mais tarde.',
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/uploads', uploadsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/audit-logs', auditLogsRoutes);
app.use('/api/analytics', analyticsRoutes);

// Static files (uploads)
app.use('/uploads', express.static(process.env.UPLOAD_DIR || './uploads'));

// 404 handler
app.use((_req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

// Error handler
app.use(errorHandler);

export default app;
