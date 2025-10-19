Here’s a complete `README.md` you can drop into the repo.

---

# Hackathon Live and Submission Platform

A Netflix-like, Twitch-enabled hackathon platform with AI-assisted judging and a live leaderboard. Built with Next.js, Supabase, and a background worker tier for video and code evaluation.

## Table of contents

* [Features](#features)
* [Architecture](#architecture)
* [Tech stack](#tech-stack)
* [Monorepo layout](#monorepo-layout)
* [Getting started](#getting-started)
* [Environment variables](#environment-variables)
* [Database and Supabase](#database-and-supabase)
* [Running the app](#running-the-app)
* [Background workers and AI](#background-workers-and-ai)
* [Realtime and leaderboard](#realtime-and-leaderboard)
* [Rubric source of truth](#rubric-source-of-truth)
* [Security and RLS](#security-and-rls)
* [Quality and CI](#quality-and-ci)
* [API](#api)
* [Contributing](#contributing)
* [License](#license)

---

## Features

* Livestream hub with Twitch or YouTube embeds, Netflix-style rails, filters, and search
* Participant submission with a 3 minute presentation video and GitHub repo link
* AI auto-categorization from a fixed category list with manual override and rationale
* Rubric defined in markdown, parsed to JSON, validated with schema and sums
* AI-assisted scoring for Presentation and Technical criteria with judge overrides
* Judge console with per-criterion sliders, comments, history, and assignment filters
* Live leaderboard with podium view, category filters, and realtime updates
* Dark UI theme with accent color `#532D8D`, surfaces `#212121` and `#181818`

---

## Architecture

* Web tier: Next.js App Router on Vercel
* Identity and data: Supabase Auth, Postgres, Realtime, Storage for thumbnails
* Video storage: R2 or S3 for 3 minute demos using presigned uploads
* Queue and cache: Redis with BullMQ for long running AI jobs
* Workers: Railway or Fly for AI pipelines and static analysis
* Observability: Sentry for errors, OpenTelemetry for traces

See `docs/architecture.md` for diagrams, models, policies, and rollout.

---

## Tech stack

* Frontend: Next.js 14, React 18, TypeScript, Tailwind CSS, shadcn/ui, Lucide
* Data access: Prisma to Supabase Postgres
* Realtime: Supabase Realtime channels
* Auth: Supabase Auth for Google and GitHub, NextAuth optional for Twitch
* Storage: Supabase Storage for thumbnails, R2 or S3 for videos
* Jobs: BullMQ on Redis
* Tests: Jest, Testing Library, Playwright
* Tooling: Supabase CLI, Prisma, ESLint, Prettier

---

## Monorepo layout

```
.
├─ apps/
│  └─ web/                     # Next.js app
│     ├─ app/                  # App Router routes
│     ├─ components/
│     ├─ lib/
│     ├─ pages/api/            # API routes if using pages router for some endpoints
│     └─ public/
├─ packages/
│  └─ workers/                 # Background job processors
├─ prisma/
│  └─ schema.prisma
├─ supabase/
│  ├─ migrations/              # SQL migrations including RLS and policies
│  └─ seed.sql
├─ rubric/
│  └─ rubric.md                # Rubric v1 markdown
├─ docs/
│  ├─ PRD.md
│  ├─ architecture.md
│  └─ ui-ux-spec.md
└─ README.md
```

---

## Getting started

### Prerequisites

* Node 20+
* pnpm or npm
* Supabase CLI
* Redis instance for jobs or Docker for local Redis
* ffmpeg and ffprobe on the machine for video checks
* Optional Vercel CLI for preview deploys

### Quickstart

```bash
# 1. Clone and install
git clone <repo>
cd <repo>
pnpm install

# 2. Copy envs
cp .env.example .env.local
# fill in values then continue

# 3. Start Supabase locally or point DATABASE_URL to a hosted Supabase Postgres
supabase start
supabase db reset   # applies migrations and seed

# 4. Generate Prisma client
pnpm prisma generate

# 5. Run web and workers
pnpm dev            # runs Next.js dev server
pnpm worker:dev     # runs background workers
```

---

## Environment variables

### Web and server

```
# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Database
DATABASE_URL=         # Supabase Postgres connection for Prisma

# Redis
REDIS_URL=

# R2 or S3 for videos
STORAGE_BUCKET=
STORAGE_REGION=
STORAGE_ACCESS_KEY=
STORAGE_SECRET_KEY=

# OAuth
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
TWITCH_CLIENT_ID=
TWITCH_CLIENT_SECRET=

# AI
AI_PROVIDER_API_KEY=

# Observability
SENTRY_DSN=
```

For local Supabase, the CLI prints URL and keys. For hosted Supabase, copy from the project settings.

---

## Database and Supabase

### Schema and RLS

* Prisma schema is in `prisma/schema.prisma`
* SQL migration for Supabase is in `supabase/migrations/*_init_hackathon.sql`
* RLS is enabled on `projects`, `scores`, `rubric`, `event_config`
* Example policies

  * Public can read published projects
  * Owner or organizer can write projects
  * Judges can write their own scores
  * Public can read scores after event state is `CLOSED`

### Users table

* `public.users.id` must equal `auth.users.id`
* On first sign in, a server hook should upsert the profile row

Apply migrations and seed:

```bash
supabase db reset
supabase db dump   # optional for snapshots
```

---

## Running the app

### Scripts

```
pnpm dev                 # Next.js dev server
pnpm build               # Next.js build
pnpm start               # Next.js start
pnpm worker:dev          # workers in watch mode
pnpm worker:start        # workers in production
pnpm lint
pnpm test
pnpm test:e2e
pnpm prisma:generate
pnpm prisma:migrate
```

### Local Redis

```bash
docker run -p 6379:6379 --name redis -d redis:7
export REDIS_URL=redis://localhost:6379
```

---

## Background workers and AI

Workers consume jobs from Redis and write results back to Postgres, which triggers Supabase Realtime updates.

Pipelines

* Categorizer

  * Input description
  * Output primary category, up to two secondary tags, rationale, confidence
* Presentation scorer

  * Download video from R2 or S3
  * ASR and rubric mapping for Presentation and Delight
* Code scorer

  * Shallow clone or metadata fetch
  * Static checks and rubric mapping for Technical
* Final score

  * If human exists use human else AI per criterion
  * Optional blend per section

---

## Realtime and leaderboard

* Client subscribes to `leaderboard` and `project:{id}` channels
* Table based Realtime on `projects` and `scores` drives UI updates
* Public `GET /api/leaderboard` serves a compact ranked list with ETag
* For heavy load, materialize a leaderboard view and refresh on score writes

---

## Rubric source of truth

* Organizers edit `rubric/rubric.md`
* Parser converts markdown to JSON, validates section sums and total
* Parsed JSON is stored in the `rubric` table with `version` and `etag`
* Clients fetch from `GET /api/rubric` and cache by ETag

Rubric v1 outline

```
Presentation and Storytelling - 25
Technical Prowess - 40
Impact and Feasibility - 15
Delight and Memorability - 10
Polish - 10
```

---

## Security and RLS

* Supabase Auth provides JWT to the frontend
* Roles: visitor, participant, judge, organizer
* Keep sensitive writes on server even with RLS
* Signed URLs for video uploads
* CSP and frame ancestor allowlist for Twitch and YouTube embeds
* Strip PII from AI outputs and logs

---

## Quality and CI

* Unit tests for parser, scoring adapters, reducers
* Component tests for cards, rails, stepper, sliders
* Playwright flows for submission and judging
* GitHub Actions

  * lint, typecheck, unit tests
  * build and Vercel preview
  * Supabase migrate on staging
  * Playwright on staging
  * manual approve for production

---

## API

Public endpoints

* `GET /api/leaderboard` ranked rows with totals
* `GET /api/rubric` parsed JSON with version and etag

Auth protected endpoints

* `POST /api/projects` create or update draft
* `POST /api/projects/:id/publish` toggle visibility
* `POST /api/projects/:id/stream` register provider and url or key
* `POST /api/projects/:id/submission` attach demo and repo
* `POST /api/ai/categorize` return category and rationale
* `POST /api/judge/scores` write human scores and comments

OpenAPI spec lives in `docs/openapi.yaml`. Keep payloads versioned with `rubricVersion`.

---

## Contributing

* Use conventional commits
* Run `pnpm lint` and `pnpm test` before pushing
* New DB changes should include both Prisma updates and a Supabase SQL migration
* Do not commit service role keys or storage secrets

---

## License

MIT unless specified otherwise in the repository.
