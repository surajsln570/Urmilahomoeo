# Migration Notes: Laravel → Next.js

Source repo: `https://github.com/surajsln570/urmilahomoeopathicclinic.git`
This document maps every audited Laravel piece to its Next.js equivalent.

## 1. Database / Migrations → `prisma/schema.prisma`

| Laravel migration | Prisma model | Notes |
|---|---|---|
| `create_roles_table` | `Role` | unique `name` |
| `create_users_table` | `User` | `role_id` FK → `Role`; password stored bcrypt-hashed |
| `patient/.../create_patients_table` | `Patient` | `registration_number` kept unique |
| `treatment/.../create_treatments_table` | `Treatment` | `image` stores a public-relative path |
| `website/.../create_hero_images_table` + `add_status_to_hero_images_table` | `HeroImage` | boolean `status`, only one row is "active" at a time (enforced in `toggleHeroImageStatus`) |
| `appointment/.../create_time_slots_table` | `TimeSlot` | `day` as `Weekday` enum instead of a free-text column |
| `.../add_mode_to_time_slots_table` (x3 migrations, consolidated) | `TimeSlot.mode` | `SlotMode` enum (`online` / `offline` / `both`) |
| `appointment/.../create_appointment_table` + `update_appointments_table` | `Appointment` | `time_slot_id` FK with `onDelete: Cascade`; `status` as `AppointmentStatus` enum |

All foreign keys, uniqueness constraints, and cascade rules from the original
migrations were preserved. Enum values were introduced where Laravel used string
columns with implicit allowed-value sets (e.g. `sex`, `religion`, `day`, `mode`,
`status`) — this gives compile-time safety that the original raw strings didn't have,
without changing behavior.

## 2. Models → Prisma Client + server actions

Laravel Eloquent models (`User`, `Role`, `Patient`, `Treatment`, `HeroImage`,
`TimeSlot`, `Appointment`) map directly to Prisma models of the same name. There is no
separate "model" layer in the Next.js app — Prisma Client **is** the model layer, and
all query logic that used to live in Eloquent scopes/accessors now lives in the
relevant `src/actions/*.ts` file, colocated with the business logic that uses it.

## 3. Services → `src/actions/*.ts`

| Laravel service | Next.js file |
|---|---|
| `AuthService` (login/register) | `auth.actions.ts` + `lib/auth.ts` (NextAuth) |
| `UserService` | `user.actions.ts` |
| `PatientService` | `patient.actions.ts` |
| `TreatmentServices` | `treatment.actions.ts` |
| `HeroService` | `hero-image.actions.ts` |
| `TimeSlotService` | `time-slot.actions.ts` |
| `AppointmentService` | `appointment.actions.ts` |

Every service method was preserved 1:1, including:
- Duplicate-email checks on register/create-user
- Duplicate `registration_number` checks on patient create/update
- Time-slot overlap prevention (same day, overlapping start/end range) on create/update
- Hero image "only one active at a time" toggle behavior
- Appointment slot-capacity check (`10 appointments per hour of slot duration`) before
  allowing a booking, and day-of-week validation between the chosen date and the
  chosen slot's configured day

## 4. Controllers → Route Handlers (`src/app/api/**/route.ts`) + Server Actions

Every controller action found in `app/modules/*/controllers/*.php` was converted to
**both** a server action (used directly by React Server/Client Components — no network
round-trip) and a REST route handler (used by the public appointment form's dynamic
"available slots" fetch, and available generically for any external API consumer).
This mirrors the original `web.php` / `api.php` route lists module-by-module.

| Laravel route (method + path) | Next.js equivalent |
|---|---|
| `GET /` | `src/app/page.tsx` |
| `GET /appointment`, `POST /appointment/store` | `src/app/appointment/page.tsx`, `POST /api/appointments` |
| `GET /appointment/slots` | `GET /api/appointments/available-slots?date=` |
| `GET/POST /login` | `src/app/login/page.tsx` + NextAuth `signIn()` |
| `GET/POST /register` | `src/app/register/page.tsx` + `POST /api/register` |
| `POST /logout` | `signOut()` (NextAuth) |
| `GET /dashboard` | `src/app/dashboard/page.tsx` |
| `GET/POST/PUT/DELETE /users*` | `src/app/dashboard/users/page.tsx` + `/api/users`, `/api/users/[id]` |
| `GET/POST/PUT/DELETE /patients*` | `src/app/dashboard/patients/page.tsx` + `/api/patients`, `/api/patients/[id]` |
| `GET/POST/PUT/DELETE /treatments*` | `src/app/dashboard/treatments/page.tsx` + `/api/treatments`, `/api/treatments/[id]` |
| `GET/POST/DELETE /hero-images*`, status toggle | `src/app/dashboard/hero-images/page.tsx` + `/api/hero-images`, `/api/hero-images/[id]`, `/api/hero-images/[id]/status` |
| `GET/POST/PUT/DELETE /time-slots*` | `src/app/dashboard/time-slots/page.tsx` + `/api/time-slots`, `/api/time-slots/[id]` |
| `GET /appointments`, status update, delete | `src/app/dashboard/appointments/page.tsx` + `/api/appointments`, `/api/appointments/[id]/status` |

## 5. Blade / Inertia views → React components

The original frontend was already React (via Inertia), so component logic ported
directly with minimal restructuring:

| Laravel/Inertia view | Next.js component |
|---|---|
| `layouts/dashboardLayout.blade.php` | `src/app/dashboard/layout.tsx` + `components/layout/dashboard-sidebar.tsx` |
| `screens/homescreen/*` | `src/app/page.tsx` |
| `components/homescreen/nav.blade.php` | `components/layout/public-nav.tsx` |
| `components/homescreen/footer.blade.php` | `components/layout/footer.tsx` |
| `screens/apointment/appointment.blade.php` + `AppointmentForm.jsx` | `src/app/appointment/page.tsx` + `components/forms/appointment-form.tsx` |
| `Pages/Patient/Index.jsx` + `PatientModal.jsx` | `components/dashboard/patients-manager.tsx` |
| `Pages/cms/Treatment.jsx` | `components/dashboard/treatments-manager.tsx` |
| `Pages/cms/HeroImage.jsx` | `components/dashboard/hero-images-manager.tsx` |
| `Pages/appointment/TimeSlots.jsx` | `components/dashboard/time-slots-manager.tsx` |
| `Pages/appointment/index.jsx` | `components/dashboard/appointments-manager.tsx` |
| `Pages/users/Index.jsx` | `components/dashboard/users-manager.tsx` |
| `login.blade.php` / `register.blade.php` | `components/forms/login-form.tsx`, `register-form.tsx` |

## 6. Validation → Zod (`src/validations/*.ts`)

Every Laravel `FormRequest` rule set has a matching Zod schema:

- `LoginRequest` → `loginSchema`
- `RegisterRequest` → `registerSchema`
- `StoreUserRequest` / `UpdateUserRequest` → `userSchema` / `updateUserSchema`
- `StorePatientRequest` / `UpdatePatientRequest` → `patientSchema` (single schema
  covers both, since the original rules were identical apart from the unique-ignore
  clause, which is now handled in `patient.actions.ts`)
- `TreatmentRequest` → `treatmentSchema`
- `StoreHeroImageRequest` → image-specific checks moved to `lib/upload.ts::validateImage`
  since Zod can't inspect a `File`'s MIME/size the same way `mimes:` / `max:` rules do
- `TimeSlotRequest` → `timeSlotSchema` (adds a `refine()` for `endTime > startTime`,
  same behavior as the Laravel `after:start_time` rule)
- `AppointmentRequest` / `UpdateAppointmentRequest` → `appointmentSchema` /
  `updateAppointmentSchema`

## 7. Authentication, roles, middleware

- Laravel's session-based `Auth::login()` / `Auth::logout()` → NextAuth Credentials
  provider with JWT sessions (`src/lib/auth.ts`).
- Laravel's `auth` middleware group protecting the dashboard routes → `src/middleware.ts`
  (route matcher) + a server-side role check in `src/app/dashboard/layout.tsx`.
- Laravel's `guest` middleware (redirecting logged-in users away from `/login`,
  `/register`) → handled in the same `middleware.ts`.
- Role-based access: only `Super Admin`, `Admin`, `Doctor` may reach `/dashboard`;
  self-registered users always get the `Patient` role, matching
  `AuthService::register()`'s hardcoded `role_id` assignment.
- **Not present in the audited Laravel codebase, and therefore not built here:**
  password-reset flow and e-mail verification. If these exist in a version of the repo
  not covered by this audit, they can be added via NextAuth's email/token flows or a
  custom reset-token table + route handler pair.

## 8. File uploads

Laravel's `$request->file('image')->move(public_path('upload/...'), $filename)`
pattern is replicated in `src/lib/upload.ts`:
- `saveUploadedFile(file, folder)` writes to `public/uploads/<folder>` with a
  timestamp-prefixed filename, returning the public path to store in the DB.
- `deleteUploadedFile(path)` removes the old file when a record is updated/deleted,
  matching the original controllers' cleanup behavior.
- `validateImage(file, maxSizeMb)` replicates the `mimes:jpg,jpeg,png,webp|max:2048`
  validation rule.

## 9. Bugs fixed during migration

- The original hero-image "activate" logic in Laravel toggled `status` on the target
  row without guaranteeing all other rows were deactivated first (relying on manual
  discipline in the admin UI). The Next.js version wraps this in a
  `prisma.$transaction` (`deactivate all` → `activate target`) so only one hero image
  can ever be active, even under concurrent requests.
- Time-slot overlap checking previously only ran on create; it now also runs on update
  (excluding the row being edited), preventing an edit from silently creating an
  overlapping slot.
- Appointment booking now runs inside error-handled `prisma.appointment.create` and
  surfaces a friendly "slot just booked" message if a race condition causes a
  duplicate booking, instead of a raw 500 error.

## 10. Jobs / Events / Notifications / Helpers / Config

No queued jobs, events/listeners, or notification classes were found in the audited
`app/modules/**` tree — the original app does all writes synchronously within request
handlers, which the Next.js server actions replicate directly. No custom Laravel
helpers (`app/Helpers`) were found either. Laravel `config/*.php` values (app name,
mail, filesystem disks) map to `.env` variables consumed by `next.config.ts` and
`src/lib/*` as documented in `.env.example`.
