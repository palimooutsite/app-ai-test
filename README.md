# SaaS Accounting System (Backend + Frontend Scaffold)

Production-oriented backend scaffold for a multi-tenant SME accounting platform using **NestJS + Prisma + PostgreSQL** plus a **Next.js frontend**.

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
frontend/
  app/
    login/
    dashboard/
    accounts/
    journal-entries/
    reports/
      balance-sheet/
      income-statement/
      cash-flow/
    integrations/
    settings/users-roles/
  components/
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

Frontend scaffold added with Next.js App Router.
Implemented routes:
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

## 6) Run backend + frontend with Docker Compose

### Prerequisites
- Docker Engine + Docker Compose v2 (`docker compose`).

### Start all services
1. From repository root, build and run all containers:
   - `docker compose up --build -d`
2. Run Prisma migrations inside the backend container:
   - `docker compose exec backend npx prisma migrate deploy`

### Service URLs
- Frontend: `http://localhost:3001`
- Backend API: `http://localhost:3000/api/v1`
- Postgres: `localhost:5432`

### Stop services
- `docker compose down`
- Remove database volume too (optional reset):
  - `docker compose down -v`

## 7) Docker deployment notes (backend and frontend)

### Backend container
- Built from root `Dockerfile`.
- Uses production NestJS build (`dist/main.js`).
- Required env vars:
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `PORT`

Example standalone backend run:
```bash
docker build -t accounting-backend -f Dockerfile .
docker run --rm -p 3000:3000 \
  -e DATABASE_URL='postgresql://postgres:postgres@host.docker.internal:5432/accounting?schema=public' \
  -e JWT_SECRET='super-secret-jwt' \
  -e PORT=3000 \
  accounting-backend
```

### Frontend container
- Built from `frontend/Dockerfile`.
- Uses production Next.js start server (`npm run start`).
- Exposes container port `3000` (mapped to host `3001` in compose).
- Optional env var for API base URL:
  - `NEXT_PUBLIC_API_BASE_URL` (example: `http://backend:3000/api/v1` in Docker network).

Example standalone frontend run:
```bash
docker build -t accounting-frontend -f frontend/Dockerfile .
docker run --rm -p 3001:3000 \
  -e NEXT_PUBLIC_API_BASE_URL='http://localhost:3000/api/v1' \
  accounting-frontend
```

## Notes for production hardening

- Move JWT secret and DB credentials into managed secret store.
- Add refresh tokens and token revocation.
- Add idempotency keys for integrations.
- Add audit logs and immutable journal posting workflow.
- Add reconciliation workflows and scheduled sync jobs.
