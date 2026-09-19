# Gleydsontattoo — API Documentation

## Base URL

- Development: `http://localhost:3001/api`
- Production: `https://api.gleydsontattoo.com.br/api`

## Response Format

### Success
```json
{
  "success": true,
  "data": { ... },
  "message": "Operação realizada com sucesso"
}
```

### Paginated
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### Error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos",
    "details": [
      { "field": "email", "message": "E-mail inválido" }
    ]
  }
}
```

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 204 | No Content (deleted) |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (not authenticated) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (duplicate booking) |
| 422 | Unprocessable Entity |
| 429 | Too Many Requests (rate limited) |
| 500 | Internal Server Error |

## Authentication

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@gleydsontattoo.com",
  "password": "your-password"
}

Response 200:
{
  "success": true,
  "data": {
    "accessToken": "eyJhbG...",
    "user": {
      "id": "uuid",
      "name": "Gleydson",
      "email": "admin@gleydsontattoo.com",
      "role": "ADMIN"
    }
  }
}
```

### Protected Routes
```
GET /api/protected-resource
Authorization: Bearer eyJhbG...
```

## Endpoints Summary

### Public Endpoints (no auth required)
- `GET /api/services` — List active services
- `GET /api/services/:id` — Service details
- `GET /api/portfolio` — Portfolio gallery
- `GET /api/appointments/available-slots?professionalId=&date=` — Available slots
- `POST /api/appointments` — Create booking
- `POST /api/budgets` — Submit budget request
- `GET /api/settings` — Public settings (studio info)

### Admin Endpoints (auth required)
- All CRUD operations for appointments, clients, services, portfolio, budgets
- Schedule management (time slots, blocks)
- User management
- Settings management
- Audit logs

See the route files in `backend/src/routes/` for complete endpoint definitions.

