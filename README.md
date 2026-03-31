# SaaS Accounting System (Backend-first)

Production-oriented backend scaffold for a multi-tenant SME accounting platform using **NestJS + Prisma + PostgreSQL**.

## 1) Folder structure

```txt
backend/
  prisma/
    schema.prisma
  src/
    app.module.ts
    main.ts
    common/
      decorators/
      guards/
      interfaces/
    database/
      database.module.ts
      prisma.service.ts
    modules/
      auth/
      accounts/
      journal/
      reports/
      integrations/
      health/
Dockerfile
docker-compose.yml
```

## 2) Database schema (Prisma)

See `backend/prisma/schema.prisma`.

Highlights:
- Tenant boundary via `companyId` on every operational model.
- Double-entry model (`JournalEntry` + `JournalLine`) with decimal precision.
- Connection models for bank + e-commerce sync.
- Role enum for RBAC (`ADMIN`, `ACCOUNTANT`, `OWNER`).

## 3) Backend modules implementation (NestJS)

Implemented modules:
- `AuthModule`: JWT login.
- `AccountsModule`: chart of accounts CRUD-lite.
- `JournalModule`: journal entries with double-entry validation.
- `ReportsModule`: balance sheet, income statement, cash flow.
- `IntegrationsModule`: bank/Shopee/Tokopedia sync service stubs.
- `HealthModule`: service health endpoint.

Cross-cutting:
- Global DTO validation (`ValidationPipe`).
- Role guard with decorator-based RBAC.
- Per-tenant data isolation at service query layer.

## 4) Frontend pages (Next.js App Router)

Backend-first delivery complete.
Suggested frontend routes for next phase:
- `/login`
- `/dashboard`
- `/accounts`
- `/journal-entries`
- `/reports/balance-sheet`
- `/reports/income-statement`
- `/reports/cash-flow`
- `/integrations`
- `/settings/users-roles`

## 5) REST API endpoints

Auth:
- `POST /api/v1/auth/login`

Accounts:
- `POST /api/v1/accounts`
- `GET /api/v1/accounts`
- `DELETE /api/v1/accounts/:id`

Journal:
- `POST /api/v1/journal-entries`
- `GET /api/v1/journal-entries`

Reports:
- `GET /api/v1/reports/income-statement?from=YYYY-MM-DD&to=YYYY-MM-DD`
- `GET /api/v1/reports/balance-sheet?asOf=YYYY-MM-DD`
- `GET /api/v1/reports/cash-flow?from=YYYY-MM-DD&to=YYYY-MM-DD`

Integrations:
- `POST /api/v1/integrations/bank/sync`
- `POST /api/v1/integrations/ecommerce/shopee/sync`
- `POST /api/v1/integrations/ecommerce/tokopedia/sync`

Health:
- `GET /api/v1/health`

## 6) Step-by-step setup

1. Copy env values:
   - `DATABASE_URL`
   - `JWT_SECRET`
2. Start Postgres and backend with Docker:
   - `docker compose up --build`
3. Run migrations:
   - `cd backend && npx prisma migrate dev --name init`
4. Seed initial company/admin user (recommended script for next phase).
5. Authenticate via `/auth/login`, then call protected endpoints with Bearer token.

## Notes for production hardening

- Move JWT secret and DB credentials into managed secret store.
- Add refresh tokens and token revocation.
- Add idempotency keys for integrations.
- Add audit logs and immutable journal posting workflow.
- Add reconciliation workflows and scheduled sync jobs.
