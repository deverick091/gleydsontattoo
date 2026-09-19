# Gleydsontattoo — Security Documentation

## Security Principles

1. **Defense in Depth** — Multiple layers of security
2. **Principle of Least Privilege** — Minimum access required
3. **Zero Trust** — Verify everything, trust nothing
4. **Fail Secure** — Errors default to denying access
5. **Data Minimization** — Collect only what's necessary (LGPD)

## Authentication

### JWT Implementation
- **Access Token**: 15-minute expiry, stored in memory (frontend)
- **Refresh Token**: 7-day expiry, HttpOnly + Secure + SameSite=Strict cookie
- Tokens signed with HS256 using separate secrets
- Password hashing: bcrypt with 12 salt rounds

### Magic Links (Client Area)
- One-time use tokens with 15-minute expiry
- Sent via WhatsApp or email
- Hashed before storage
- Invalidated after use

## Authorization (RBAC)

| Role | Access |
|------|--------|
| ADMIN | Full system access |
| ATTENDANT | Clients, appointments, budgets only |
| CLIENT | Own data, appointments, history |
| PUBLIC | Site, portfolio, booking, budget form |

## HTTP Security Headers

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 0 (rely on CSP instead)
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; ...
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

## Input Validation

- All inputs validated with Zod schemas on the server
- Client-side validation for UX only (never trusted)
- Sanitization of all string inputs
- File uploads: MIME type validation, size limits, safe filenames
- SQL Injection: Prevented by Prisma parameterized queries

## Rate Limiting

| Endpoint | Limit |
|----------|-------|
| `/api/auth/login` | 5 requests / 15 minutes |
| `/api/auth/magic-link` | 3 requests / 15 minutes |
| `/api/appointments` (POST) | 10 requests / 15 minutes |
| General API | 100 requests / 15 minutes |

## File Upload Security

1. Validate MIME type against whitelist (jpeg, png, webp, avif)
2. Check file magic bytes (not just extension)
3. Limit file size (10MB default)
4. Generate random UUID filenames
5. Strip EXIF metadata
6. Store outside web root
7. Serve through API with proper Content-Type

## LGPD Compliance

1. **Consent**: Explicit consent before collecting personal data
2. **Purpose**: Data collected only for stated purposes
3. **Minimization**: Only essential data collected
4. **Access**: Clients can view their own data
5. **Deletion**: Data can be deleted on request
6. **Security**: Data encrypted in transit (HTTPS) and protected at rest
7. **Logging**: Access to personal data is audited

## Environment Variables

- All secrets stored in `.env` (never committed)
- `.env.example` provided with placeholder values
- Zod validation ensures all required vars are set at startup
- Separate secrets for JWT access and refresh tokens

## Audit Trail

Every admin action is logged:
- User ID
- Action type
- Affected resource and ID
- Request IP address
- Timestamp
- Additional context (JSON)

