# Gleydsontattoo — Database Documentation

## Database Engine

PostgreSQL 16 with Prisma ORM.

## Entity Relationship Diagram

```
┌──────────────┐     ┌──────────────────┐     ┌───────────────┐
│     User     │     │   Professional   │     │    Client     │
│──────────────│     │──────────────────│     │───────────────│
│ id (PK)      │     │ id (PK)          │     │ id (PK)       │
│ email        │◄───┐│ name             │     │ name          │
│ password     │    ││ email            │     │ phone         │
│ name         │    ││ specialties[]    │     │ whatsapp      │
│ role         │    ││ isActive         │     │ email         │
│ isActive     │    ││ userId (FK?)     │     │ notes         │
└──────┬───────┘    │└────────┬─────────┘     └──────┬────────┘
       │            │         │                       │
       │ 1:N        │         │ 1:N                   │ 1:N
       ▼            │         ▼                       ▼
┌──────────────┐    │  ┌──────────────┐        ┌──────────────┐
│  AuditLog    │    │  │ Appointment  │◄───────│   Budget     │
│──────────────│    │  │──────────────│        │──────────────│
│ id (PK)      │    │  │ id (PK)      │        │ id (PK)      │
│ userId (FK)  │    │  │ clientId (FK)│        │ clientId(FK) │
│ action       │    │  │ professId(FK)│        │ name         │
│ resource     │    │  │ serviceId(FK)│        │ style        │
│ details      │    │  │ date         │        │ status       │
│ ipAddress    │    │  │ startTime    │        │ adminResponse│
└──────────────┘    │  │ endTime      │        └──────────────┘
                    │  │ status       │
                    │  │ UNIQUE(prof, │
                    │  │  date, start)│
                    │  └──────┬───────┘
                    │         │ 1:N
                    │         ▼
                    │  ┌──────────────┐
                    │  │ Notification │
                    │  │──────────────│
                    │  │ id (PK)      │
                    │  │ appointId(FK)│
                    │  │ type         │
                    │  │ channel      │
                    │  │ status       │
                    │  └──────────────┘
                    │
                    │  ┌──────────────┐     ┌────────────────┐
                    │  │   Service    │────▶│ServiceCategory │
                    │  │──────────────│     │────────────────│
                    │  │ id (PK)      │     │ id (PK)        │
                    │  │ name         │     │ name           │
                    │  │ categoryId   │     │ slug (UNIQUE)  │
                    │  │ duration     │     └────────────────┘
                    │  │ priceType    │
                    │  └──────────────┘
                    │
                    │  ┌──────────────┐     ┌──────────────┐
                    │  │  TimeSlot    │     │ BlockedTime  │
                    │  │──────────────│     │──────────────│
                    │  │ id (PK)      │     │ id (PK)      │
                    │  │ professId(FK)│     │ professId(FK)│
                    │  │ dayOfWeek    │     │ startDate    │
                    │  │ startTime    │     │ endDate      │
                    │  │ endTime      │     │ reason       │
                    │  │ UNIQUE(prof, │     └──────────────┘
                    │  │  day, start) │
                    │  └──────────────┘
                    │
                    │  ┌───────────────┐    ┌──────────────┐
                    │  │PortfolioItem  │    │   Setting    │
                    │  │───────────────│    │──────────────│
                    │  │ id (PK)       │    │ id (PK)      │
                    │  │ title         │    │ key (UNIQUE) │
                    │  │ imageUrl      │    │ value        │
                    │  │ categoryId(FK)│    │ type         │
                    │  │ isFeatured    │    └──────────────┘
                    │  └───────────────┘
```

## Key Constraints

### Appointment Concurrency
- **UNIQUE** constraint on `(professional_id, date, start_time)` prevents double-booking at the database level.
- Application uses `Prisma.$transaction` with **Serializable** isolation + `SELECT ... FOR UPDATE` for safe concurrent booking.

### Indexes
- `appointments(professional_id, date)` — Fast lookup of daily schedule
- `appointments(client_id)` — Fast client history lookup
- `appointments(status)` — Filter by status
- `clients(phone)` — Deduplication and search
- `clients(email)` — Lookup
- `portfolio_items(category_id, order)` — Ordered gallery
- `settings(key)` — Fast config lookup
- `audit_logs(created_at)` — Time-range queries

## Backup Strategy

### Automated Backups
```bash
# Daily backup via pg_dump
pg_dump -U gleydsontattoo -d gleydsontattoo -F c -f backup_$(date +%Y%m%d).dump

# Restore
pg_restore -U gleydsontattoo -d gleydsontattoo backup_20240101.dump
```

### Retention Policy
- Daily backups: keep 7 days
- Weekly backups: keep 4 weeks
- Monthly backups: keep 12 months

### Storage
- Store backups in encrypted external storage (S3, GCS, or similar)
- NEVER store backups in the Git repository
- NEVER store backups in public directories

