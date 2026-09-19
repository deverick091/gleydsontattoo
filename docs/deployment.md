# Gleydsontattoo — Deployment Guide

## Environments

| Environment | Purpose |
|-------------|---------|
| `development` | Local development |
| `staging` | Pre-production testing |
| `production` | Live system |

## Local Development

### Prerequisites
- Node.js 20+
- PostgreSQL 16 (or Docker)
- npm 10+

### Setup
```bash
# Clone the repository
git clone https://github.com/your-user/gleydsontattoo.git
cd gleydsontattoo

# Copy environment variables
cp .env.example .env
# Edit .env with your values

# Backend setup
cd backend
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev
```

### With Docker
```bash
docker compose up -d
# Backend: http://localhost:3001
# Frontend: http://localhost:3000
# PostgreSQL: localhost:5432
```

## Production Deployment

### Option A: Vercel (Frontend) + Railway (Backend)

#### Frontend (Vercel)
1. Connect GitHub repo to Vercel
2. Set root directory: `frontend`
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL` = your backend URL
4. Deploy

#### Backend (Railway)
1. Connect GitHub repo to Railway
2. Set root directory: `backend`
3. Add PostgreSQL service
4. Set environment variables from `.env.example`
5. Deploy

### Option B: VPS with Docker

```bash
# On your VPS
git clone https://github.com/your-user/gleydsontattoo.git
cd gleydsontattoo

# Create production .env
cp .env.example .env
# Edit with production values
# Set NODE_ENV=production

# Build and start
docker compose -f docker-compose.prod.yml up -d
```

### SSL/HTTPS
- Use Let's Encrypt with Certbot
- Or use Cloudflare as reverse proxy
- HTTPS is MANDATORY in production

### Domain Configuration
1. Point domain A record to server IP
2. Configure reverse proxy (Nginx/Caddy)
3. Setup SSL certificate
4. Update CORS_ORIGIN in .env

## CI/CD (GitHub Actions)

The project includes GitHub Actions workflows:
- `ci.yml` — Runs on every push: lint, type-check, tests, build
- `security.yml` — Weekly: dependency audit, secret scanning

## Monitoring

### Health Check
```
GET /api/health
Response: { "status": "ok", "timestamp": "..." }
```

### Logs
- Application logs: stdout/stderr
- Access logs: Morgan
- Audit logs: Database (audit_logs table)
- Error tracking: Integrate Sentry (optional)

## Backup

### Automated Database Backup
```bash
# Add to crontab
0 2 * * * pg_dump -U gleydsontattoo -d gleydsontattoo -F c -f /backups/db_$(date +\%Y\%m\%d).dump

# Clean old backups (keep 7 days)
0 3 * * * find /backups -name "*.dump" -mtime +7 -delete
```

### File Uploads Backup
```bash
# Sync uploads to external storage
0 4 * * * rsync -avz /app/uploads/ /backups/uploads/
```

