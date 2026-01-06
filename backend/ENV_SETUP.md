# Backend Environment Variables

# Database (use PostgreSQL local ou Railway)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/portfolio?schema=public"

# JWT
JWT_SECRET="dev-secret-key-change-in-production-123456789"
JWT_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV="development"

# CORS
ALLOWED_ORIGINS="http://localhost:8080,http://localhost:5173"

# Upload
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE="5242880"

# Rate Limiting
RATE_LIMIT_WINDOW_MS="900000"
RATE_LIMIT_MAX_REQUESTS="100"
