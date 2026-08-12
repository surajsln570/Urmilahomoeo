# Urmila Homoeopathic Clinic — Next.js Edition

A production-ready migration of the original Laravel + Inertia/React application to
**Next.js 15 (App Router)**, **TypeScript**, **Prisma/MySQL**, and **NextAuth**.

See [`MIGRATION_NOTES.md`](./MIGRATION_NOTES.md) for a full module-by-module mapping from
the original Laravel codebase to this project, including behavioral notes and bugs fixed
along the way.

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict, no `any`) |
| Styling | Tailwind CSS + shadcn-style primitives |
| Forms | React Hook Form + Zod |
| ORM | Prisma |
| Database | MySQL |
| Auth | NextAuth (Credentials provider, JWT sessions) |

## Project structure

```
prisma/
  schema.prisma        # full DB schema (converted from all Laravel migrations)
  seed.ts               # roles + a default admin user
src/
  app/                  # App Router: pages + API route handlers
    api/                # REST endpoints (users, patients, treatments, hero-images,
                         # time-slots, appointments, auth, register)
    dashboard/           # protected admin/staff area
    login/ register/ appointment/  # public pages
  actions/              # server actions — one file per domain, holds all business logic
  components/
    ui/                 # shadcn-style primitives (Button, Input, Dialog, Table, ...)
    forms/               # React Hook Form + Zod forms
    layout/              # nav, footer, dashboard sidebar
    dashboard/            # CRUD screens (client components) for each admin module
    public/               # homepage sections
  lib/                  # prisma client, NextAuth config, upload helper, utils
  validations/          # Zod schemas (1:1 with the original Laravel FormRequests)
  types/                 # shared/augmented types (e.g. NextAuth session)
```

## Getting started

### 1. Prerequisites
- Node.js 20+
- A MySQL 8 database

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
# edit .env: set DATABASE_URL, NEXTAUTH_SECRET (openssl rand -base64 32), NEXTAUTH_URL
```

### 4. Set up the database
```bash
npx prisma migrate dev --name init   # creates tables from prisma/schema.prisma
npm run prisma:seed                  # seeds roles + a default admin user
```

The seed creates:
- Roles: `Super Admin`, `Admin`, `Doctor`, `Patient`
- Admin login: `admin@urmilaclinic.test` / `password` (**change this immediately in production**)

### 5. Run the dev server
```bash
npm run dev
```
Visit `http://localhost:3000` for the public site, and `http://localhost:3000/dashboard`
for the admin area (requires Super Admin / Admin / Doctor role).

### 6. Build for production
```bash
npm run build
npm start
```

## File uploads

Treatment images and hero images are written to `public/uploads/treatments` and
`public/uploads/hero` respectively (see `src/lib/upload.ts`), mirroring the original
Laravel `public_path('upload/...')` pattern. For a multi-instance/production deployment,
swap `saveUploadedFile`/`deleteUploadedFile` for an S3 (or equivalent) adapter — the
call sites in `src/actions/treatment.actions.ts` and `src/actions/hero-image.actions.ts`
are the only places that need to change.

## Auth & roles

- Sessions are JWT-based via NextAuth's Credentials provider (`src/lib/auth.ts`).
- `src/middleware.ts` protects `/dashboard/*` and redirects authenticated users away from
  `/login` and `/register`, mirroring Laravel's `auth`/`guest` middleware groups.
- `src/app/dashboard/layout.tsx` additionally enforces that only `Super Admin`, `Admin`,
  and `Doctor` roles may enter the dashboard — self-registered users get the `Patient`
  role and are redirected to the public site.

## Known limitations / follow-ups

- Password reset and e-mail verification flows were **not implemented** in the original
  Laravel app (no `MustVerifyEmail`, no password-reset routes were found in the audited
  codebase), so they were not built here either. See `MIGRATION_NOTES.md` for exact
  audit findings.
- Local disk storage for uploads works for a single-instance deployment; see "File
  uploads" above for scaling notes.
