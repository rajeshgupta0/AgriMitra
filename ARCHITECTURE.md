# AgriMitra AI — Technical Architecture

> Voice-first digital farming companion for India's 100M+ small and marginal farmers.
> Designed to scale to **100,000+ active farmers** with a single multi-tenant deployment.

---

## 1. High-Level Architecture

```text
                  ┌──────────────────────────────────────────────────┐
                  │            CLIENTS                               │
                  │  • React Native app  (Android / iOS)             │
                  │  • PWA web client     (low-end devices)          │
                  │  • USSD / IVR gateway (feature phones, future)   │
                  └──────────────────┬───────────────────────────────┘
                                     │ HTTPS · JWT (Supabase Auth)
                                     ▼
        ┌────────────────────────────────────────────────────────────┐
        │  API GATEWAY  (Cloudflare → Node.js / Express on Fly.io)   │
        │  • Rate limit · WAF · request signing                      │
        │  • Routes:  /api/v1/*   /webhooks/*   /public/*            │
        └────────────────────────────────────────────────────────────┘
              │            │              │              │
   ┌──────────▼──┐ ┌──────▼──────┐ ┌─────▼──────┐ ┌─────▼─────────┐
   │  Core API   │ │  AI Service │ │  Data Sync │ │  Voice / STT  │
   │  (Node/TS)  │ │  (Python)   │ │  Workers   │ │  (Whisper)    │
   └──────┬──────┘ └──────┬──────┘ └─────┬──────┘ └─────┬─────────┘
          │               │              │              │
          ▼               ▼              ▼              ▼
   ┌──────────────────────────────────────────────────────────────┐
   │  SUPABASE  (managed Postgres + Auth + Storage + Realtime)    │
   │  • Postgres 15  · PostGIS  · pgvector  · pg_cron             │
   │  • Row-Level Security on every tenant table                  │
   │  • Storage buckets: crop-scans, voice-notes, scheme-docs     │
   └──────────────────────────────────────────────────────────────┘
          │               │              │              │
          ▼               ▼              ▼              ▼
   ┌────────────┐ ┌──────────────┐ ┌────────────┐ ┌────────────────┐
   │ Gemini API │ │ OpenWeather  │ │ Agmarknet  │ │ Govt Agri APIs │
   │ TF-Lite    │ │ IMD          │ │ eNAM       │ │ PM-KISAN, etc. │
   └────────────┘ └──────────────┘ └────────────┘ └────────────────┘
```

**Key design choices**

| Decision | Why |
|---|---|
| Supabase as backbone | Postgres + Auth + Storage + Realtime in one — cuts ops cost for an early-stage CTO. |
| Express API in front | Lets us host private business logic, fan out to 3rd-party APIs, and queue heavy AI jobs without exposing service keys to clients. |
| On-device TF-Lite | Crop disease detection works offline in villages with weak connectivity. |
| pgvector | Single store for embeddings of community questions, scheme matching, and crop encyclopedia. |
| Cloudflare in front | Edge caching of weather/market reads keeps Supabase egress under control at 100k DAU. |

---

## 2. Database Architecture

### 2.1 ER Diagram

```text
 auth.users ──1:1──► profiles ──1:N──► farms ──1:N──► plots ──1:N──► crop_cycles
                          │                                      │
                          │ 1:N                                  │ 1:N
                          ▼                                      ▼
                     user_roles                            crop_observations
                          │
                          │
 conversations ──1:N──► messages                     disease_scans (image, model, conf, label)
       ▲
       │
   farmer ↔ assistant (AI) ↔ expert

 weather_snapshots(lat,lon,ts)   market_prices(commodity,mandi,date)
 schemes  ──N:N──► scheme_eligibility (rule-engine output per farmer)
 posts ──1:N──► comments ──1:N──► reactions   (community feed)
 audit_log (actor, action, target, ts, ip)
```

### 2.2 Core Tables (Postgres / Supabase)

```sql
-- Roles are NEVER on profiles. Separate table to prevent privilege escalation.
create type public.app_role as enum (
  'farmer', 'expert', 'district_officer', 'ngo', 'admin', 'super_admin'
);

create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  name          text not null,
  mobile        text unique not null,
  language      text default 'hi',
  state         text, district text, village text,
  created_at    timestamptz default now()
);

create table public.user_roles (
  id       uuid primary key default gen_random_uuid(),
  user_id  uuid not null references auth.users(id) on delete cascade,
  role     app_role not null,
  scope    jsonb,                -- e.g. {"district":"Indore"}
  unique (user_id, role)
);

create table public.farms (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references auth.users(id) on delete cascade,
  name        text,
  geom        geography(polygon, 4326),     -- PostGIS
  land_size   numeric, land_unit text,
  irrigation  text,
  created_at  timestamptz default now()
);

create table public.plots (
  id        uuid primary key default gen_random_uuid(),
  farm_id   uuid not null references public.farms(id) on delete cascade,
  name      text, area numeric, soil_type text
);

create table public.crop_cycles (
  id          uuid primary key default gen_random_uuid(),
  plot_id     uuid not null references public.plots(id) on delete cascade,
  crop        text not null,
  sown_on     date, expected_harvest date,
  status      text default 'growing',
  health_score smallint                       -- 0-100, refreshed by AI worker
);

create table public.disease_scans (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id),
  crop_cycle_id uuid references public.crop_cycles(id),
  image_path   text not null,                 -- Supabase Storage path
  model        text not null,                 -- "tflite-v3" | "gemini-vision"
  label        text, confidence numeric(4,3),
  remedy       text,
  created_at   timestamptz default now()
);

create table public.weather_snapshots (
  id  bigserial primary key,
  lat numeric(7,4), lon numeric(7,4),
  ts  timestamptz not null,
  payload jsonb not null                       -- raw OpenWeather/IMD blob
);
create index on public.weather_snapshots (lat, lon, ts desc);

create table public.market_prices (
  id          bigserial primary key,
  commodity   text not null,
  mandi       text not null,
  state       text,
  price_min   integer, price_max integer, price_modal integer,
  arrival_qty integer, unit text default 'qtl',
  reported_on date not null,
  unique (commodity, mandi, reported_on)
);

create table public.schemes (
  id        uuid primary key default gen_random_uuid(),
  code      text unique not null,             -- 'PM-KISAN'
  title     text not null,
  summary   text,
  benefit   text,
  rules     jsonb not null                    -- declarative eligibility rules
);

create table public.conversations (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references auth.users(id) on delete cascade,
  channel   text default 'voice',             -- voice | text | ussd
  started_at timestamptz default now()
);

create table public.messages (
  id              bigserial primary key,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  role            text not null,              -- user | assistant | expert | system
  content         text,
  audio_path      text,
  intent          text,
  tokens          integer,
  embedding       vector(768),                -- pgvector
  created_at      timestamptz default now()
);

create table public.posts (
  id        uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id),
  body      text not null,
  topic     text, media_paths text[],
  created_at timestamptz default now()
);

create table public.audit_log (
  id      bigserial primary key,
  actor   uuid, action text, target text, meta jsonb,
  ip      inet, created_at timestamptz default now()
);
```

### 2.3 Required Grants & RLS (every public table)

```sql
-- Pattern repeated per table:
grant select, insert, update, delete on public.farms to authenticated;
grant all on public.farms to service_role;
alter table public.farms enable row level security;

create policy "owner can read"  on public.farms for select to authenticated
  using (owner_id = auth.uid());
create policy "owner can write" on public.farms for all   to authenticated
  using (owner_id = auth.uid()) with check (owner_id = auth.uid());

-- District officers can read all farms in their district scope:
create policy "officer scope read" on public.farms for select to authenticated
  using (
    public.has_role(auth.uid(), 'district_officer')
    and (select scope->>'district' from public.user_roles
         where user_id = auth.uid() and role='district_officer')
        = (select district from public.profiles where id = owner_id)
  );
```

The `has_role(uuid, app_role)` function is SECURITY DEFINER and prevents
recursive RLS — same pattern used across every role-gated policy.

---

## 3. Folder Structure

```text
agrimitra/
├── apps/
│   ├── mobile/                # React Native (Expo, TypeScript)
│   │   ├── src/
│   │   │   ├── screens/       # dashboard, assistant, weather, market, community, profile
│   │   │   ├── components/    # cards, charts, voice UI
│   │   │   ├── features/      # voice/, scan/, schemes/, market/
│   │   │   ├── lib/           # api client, offline cache, i18n
│   │   │   ├── ml/            # TF-Lite models + runtime
│   │   │   └── store/         # zustand slices
│   │   └── app.config.ts
│   │
│   └── web/                   # PWA (TanStack Start, current Lovable app)
│       └── src/routes/...
│
├── services/
│   ├── api/                   # Node.js + Express + TypeScript
│   │   ├── src/
│   │   │   ├── routes/        # v1/farms.ts, v1/scans.ts, v1/market.ts, ...
│   │   │   ├── middleware/    # auth, rbac, ratelimit, tenant
│   │   │   ├── domain/        # farms/, crops/, schemes/, market/
│   │   │   ├── integrations/  # gemini, openweather, agmarknet, agri-gov
│   │   │   ├── jobs/          # BullMQ queues + workers
│   │   │   └── lib/           # supabase admin, logger, telemetry
│   │   └── package.json
│   │
│   ├── ai/                    # Python (FastAPI)
│   │   ├── disease_model/     # TF training + export to TF-Lite
│   │   ├── whisper/           # STT pipeline
│   │   ├── rag/               # pgvector retrieval over crop KB + schemes
│   │   └── serve.py
│   │
│   └── workers/               # cron + queue consumers
│       ├── weather_ingest.ts  # pulls OpenWeather/IMD every 30 min
│       ├── market_ingest.ts   # pulls Agmarknet nightly
│       └── scheme_match.ts    # nightly eligibility refresh
│
├── packages/
│   ├── shared-types/          # zod schemas shared by api + clients
│   ├── ui-kit/                # shared design tokens
│   └── eslint-config/
│
├── infra/
│   ├── supabase/              # SQL migrations
│   ├── terraform/             # Fly.io, Cloudflare, R2 backups
│   └── docker/
│
└── ARCHITECTURE.md            # this file
```

---

## 4. API Design

REST + JSON, versioned at `/api/v1/*`. All requests carry a Supabase JWT in
`Authorization: Bearer …`. Long-running AI work returns `202` + a job ID.

| Method | Endpoint | Role | Purpose |
|---|---|---|---|
| POST | `/api/v1/auth/otp/start` | public | Send SMS OTP |
| POST | `/api/v1/auth/otp/verify` | public | Verify OTP → JWT |
| GET  | `/api/v1/me` | any | Current profile + roles |
| POST | `/api/v1/farms` | farmer | Create farm |
| GET  | `/api/v1/farms/:id/health` | farmer | Aggregated risk score |
| POST | `/api/v1/scans` | farmer | Upload crop photo → disease result |
| POST | `/api/v1/assistant/messages` | farmer | Send text/voice → AI reply (SSE) |
| POST | `/api/v1/assistant/transcribe` | farmer | Audio → text (Whisper) |
| GET  | `/api/v1/weather?lat&lon` | any | Cached forecast (edge 10 min) |
| GET  | `/api/v1/market?crop&state` | any | Mandi prices (edge 1 h) |
| GET  | `/api/v1/schemes/eligible` | farmer | Personalised schemes |
| POST | `/api/v1/community/posts` | farmer/expert | Create post |
| GET  | `/api/v1/admin/metrics` | admin | Platform KPIs |
| POST | `/webhooks/agmarknet` | signed | Daily price drop |

All responses share the envelope:

```json
{ "ok": true, "data": {...}, "meta": { "requestId": "..." } }
```

Errors use RFC 7807 `application/problem+json`.

---

## 5. Authentication Flow

```text
 Mobile number  ──►  POST /auth/otp/start  ──►  Supabase Auth (SMS provider)
                                                       │
                                                       ▼
                                          OTP delivered to farmer phone
                                                       │
 Farmer enters OTP ──►  POST /auth/otp/verify  ──►  Supabase returns JWT (access + refresh)
                                                       │
                                                       ▼
              JWT stored in secure storage (Keychain / Keystore)
                                                       │
       ┌───────────────────────────────────────────────┴───────────────┐
       ▼                                                               ▼
  Client → API (Authorization: Bearer)                       Client → Supabase (RLS)
       │                                                               │
       ▼                                                               ▼
  Express verifies JWT via Supabase JWKS                      Postgres enforces RLS using auth.uid()
       │
       ▼
  rbac middleware reads user_roles → attaches `req.actor`
```

Refresh tokens rotate every 60 days; sessions are revocable from
`/admin/sessions`. All sensitive admin actions require a second factor (TOTP).

---

## 6. Role-Based Access Control

| Role | Can do | Cannot do |
|---|---|---|
| **Farmer** | Manage own farms/plots/crops, scan crops, chat with AI, post in community, view personalised schemes & prices. | Read other farmers' data, moderate content. |
| **Agriculture Expert** | Answer questions, verify AI advisories, publish authoritative posts, escalate disease alerts. | Modify farmer profiles, see PII outside conversations. |
| **District Officer** | Read farms aggregated in their district scope, push advisories, see disease heatmaps. | Edit farmer-owned data, access other districts. |
| **NGO / FPO** | Onboard groups of farmers, run campaigns, view group-level analytics. | Read individual chat content. |
| **Admin** | Manage schemes, content, taxonomy, integrations, scheduled jobs. | Read raw voice/photo content without audit reason. |
| **Super Admin** | Manage roles, secrets, billing; can impersonate with audit trail. | Bypass audit logging. |

Enforcement is two-tier:
1. **Postgres RLS** using `has_role()` and a `scope jsonb` column.
2. **Express `rbac()` middleware** for cross-table actions (e.g. broadcasting).

Every privileged call writes to `audit_log` with actor, action, target, IP.

---

## 7. Storage Architecture

Supabase Storage (S3-compatible) with three buckets:

| Bucket | Visibility | Used for | Lifecycle |
|---|---|---|---|
| `crop-scans` | private (signed URL) | Disease scan images | 90 days → cold archive in R2 |
| `voice-notes` | private | Assistant audio | 30 days then delete |
| `scheme-docs` | public-read | PDFs, posters | Long-lived, CDN cached |

Upload flow:

```text
Client (RN)
  │  1. requests signed upload URL  ──► POST /api/v1/uploads/sign
  │  2. PUT image directly to Supabase Storage (no proxy through API)
  │  3. POST /api/v1/scans { storage_path }
  ▼
API enqueues "disease.classify" job (BullMQ)
  ▼
AI worker pulls image → TF-Lite (fast path) or Gemini Vision (fallback)
  ▼
Writes disease_scans row + push notification to farmer
```

Images are resized client-side to 1024 px max edge before upload to save
data on 2G/3G connections.

---

## 8. Security Architecture

- **Transport:** TLS 1.3 everywhere; HSTS preload on web.
- **Auth:** Supabase JWT (RS256) verified at the edge via JWKS.
- **Secrets:** Stored in Supabase Vault + Fly.io secrets — never in repo.
  Service-role key only inside `services/api` and workers.
- **RLS:** Enabled on every public table. CI fails if a migration adds a
  table without RLS + grants (`check_rls.sql` runs in pipeline).
- **RBAC:** `user_roles` table + `has_role()` security-definer fn; never
  trust client-side role.
- **PII:** Mobile numbers stored hashed for search, plaintext encrypted at
  rest (pgcrypto). Photos are private buckets with signed URLs (5 min TTL).
- **Rate limiting:** Cloudflare turnstile on OTP; 60 req/min/user on API;
  10 scans/min/user on AI.
- **Abuse:** Voice/photo uploads scanned (NSFW + malware) before storage.
- **Audit:** `audit_log` for every privileged write; admin impersonation
  writes a forced log entry.
- **Backups:** Nightly logical dump to R2, 30-day retention, quarterly
  restore drill.
- **Compliance:** DPDP Act ready — consent capture during onboarding,
  data-export & delete endpoints under `/api/v1/me/data`.

---

## 9. Scaling to 100,000+ Farmers

| Concern | Strategy |
|---|---|
| Read fan-out (weather, market) | Cache at Cloudflare edge (10 min weather, 1 h market). 95% of reads never touch Postgres. |
| Write hot spots (scans, messages) | Append-only tables, partitioned monthly (`messages_2026_06`). |
| AI cost | Two-tier inference: TF-Lite on device (free) → Gemini fallback only when confidence < 0.7. |
| Voice transcription | Whisper-tiny on workers; batched. Average cost target < ₹0.05 per query. |
| Realtime | Supabase Realtime channels per district, not per user. |
| Background jobs | BullMQ on Redis (Upstash) — separate queues for scans, ingest, notify. |
| Multi-region | Stateless API → deployable in 3 Fly.io regions (BOM, DEL, MAA). Postgres stays primary in BOM with read replicas. |
| Observability | OpenTelemetry → Grafana Cloud; Sentry for client & server; structured logs to Loki. |
| Cost ceiling | At 100k DAU, target infra spend < ₹3 lakh / month (≈ ₹3/farmer/month). |

---

## 10. What's Implemented vs. Roadmap

**Implemented in this preview (Lovable PWA):**

- Onboarding (mobile + OTP + 5-step wizard)
- Bottom-nav app shell (Home, Assistant, Community, Insights, Profile)
- Dashboard with risk score, weather, alerts, schemes, mandi, community feed
- Voice assistant (push-to-talk + Whisper via AI gateway)
- Weather Center and Market Intelligence screens
- Offline-first PWA caching for core routes

**Next (services layer):**

1. Migrate auth + persistence to Supabase (replace `localStorage` store).
2. Stand up `services/api` (Express) and move AI calls behind it.
3. Train + ship the first TF-Lite disease model (wheat rust, tomato blight).
4. Wire OpenWeather + Agmarknet ingest workers.
5. Build expert/officer dashboards (web only).
