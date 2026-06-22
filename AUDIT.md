# AgriMitra AI — Product Audit & Roadmap

_Reviewed as: Product Manager · CTO · UX Lead · AgriTech Consultant._

## 1. What's in place
- **Onboarding**: Language → OTP → Register → Welcome (< 2 min path).
- **Farmer app shell** (5 tabs): Home, Assistant, Community, Insights, Profile.
- **Dashboard**: Risk ring, weather, disease alerts, crop health, actions, schemes, mandi feed.
- **Voice Assistant**: Push-to-talk STT (AI gateway), TTS playback, quick intents, emergency mode, history.
- **Disease scanner**: Multi-image camera/gallery, animated processing, confidence ring, treatment tabs.
- **Insights hub**: Weather / Market / Schemes tabs with sparklines and Sell/Wait signals.
- **Pro Tools**: Digital Twin, Risk Engine, Smart Planner, Farm Analytics, Knowledge Hub, Learn (gamified).
- **Stakeholder portals**: Super Admin console, District Officer console, NGO/FPO workspace.
- **Offline-first**: PWA manifest, service-worker registration, NetworkFirst routes + CacheFirst assets, offline banner.

## 2. Strengths
1. **Voice-first, vernacular by design** — meets target user where they are.
2. **Single conceptual model**: farm → twin → scores → recommendations → actions.
3. **Token-driven UI** with semantic colors; consistent shadow/radius vocabulary.
4. **Stakeholder layering**: farmer ↔ expert ↔ officer ↔ NGO ↔ admin in one ecosystem.
5. **Offline resilience** — meaningful in rural connectivity.

## 3. Gaps & Risks
### UX / UI
- Bottom nav is fixed at 5; "Pro Tools" launcher is one tap deep via Profile → consider surfacing on Home.
- Some screens use mock data only; empty/skeleton/error states exist on a few but should be standardized.
- Right-to-left and large-font support not yet validated.

### Accessibility
- All actionable controls are buttons/links but several icon-only buttons need explicit `aria-label`.
- Color-only severity badges should also carry text (mostly compliant; audit pass needed).
- Tap targets meet 44×44 minimum on tabs; verify on all icon buttons.

### Data / Backend
- No persistence yet beyond `localStorage`. Required: Postgres (Supabase) with RLS, audit log, multi-tenant villages, role table separate from profile.
- AI calls happen client→server route; needs rate limiting, abuse heuristics, per-user quotas.
- Webhooks (IMD/Agmarknet) and ingestion pipelines are documented but not wired.

### Security
- Roles must live in `user_roles` table (never on profile). `has_role()` SECURITY DEFINER pattern.
- Sensitive endpoints (officer/NGO/admin) must be gated behind `_authenticated` + role check; UI today is open for demonstration.
- Add HIBP password check and rate-limit OTP attempts.

### Scalability
- AI inference: tier to on-device TF-Lite (disease) → cloud LLM (advice) → batch (forecast).
- Postgres partition by district for `disease_scans`, `market_prices`, `audit_log`.
- Edge cache mandi prices / schemes (CDN-level) — they're public read-only.

## 4. Missing Screens / Workflows
- **Forgot password / reset password** for officers/admins.
- **Two-factor for admin/officer logins** (TOTP).
- **Community moderation queue** + report-post workflow.
- **Expert verification & badge issuance** workflow.
- **Field-officer mobile route assignment** (officers visiting villages).
- **Push-notification preferences** per category (weather, disease, market, scheme).
- **Data export** for farmers (their own data) — DPDP Act compliance.

## 5. Improvements — Startup-grade
- **Activation funnel**: track time-to-first-scan and time-to-first-advice; <90s is best-in-class.
- **Voice everywhere**: every text input shows a mic; every result has a 🔊 button.
- **Per-village leaderboards** to drive habit formation.
- **WhatsApp fallback channel** for farmers who cannot install the app.

## 6. Government Adoption Features
- **Aadhaar e-KYC** with consent ledger (DigiLocker-style).
- **API contracts** with PM-KISAN, PMFBY, eNAM, Agmarknet, IMD, ISRO Bhuvan.
- **Officer report exports** (PDF + CSV, scheduled to email).
- **Multi-tenant by state**: each state can theme + localize content.

## 7. Patent-worthy Ideas
- **Farmer Digital Twin scoring algorithm** combining soil, weather, market, history into a single Productivity-x-Profitability vector.
- **Hyper-local disease nowcasting** from federated scan reports (privacy-preserving).
- **Voice-first agronomic intent router** that maps free-form vernacular speech to a finite set of farm actions.

## 8. Hackathon-winning Demos
1. Speak in Marathi → AI replies in Marathi with audio + action card.
2. Take a leaf photo → diagnosis + WhatsApp message to local expert in 5 seconds.
3. District Officer publishes advisory → 12,400 farmers receive voice + SMS in < 30s.
4. Farmer asks "kab bechu?" → Sell/Wait signal with 14-day price forecast.

## 9. 90-Day Roadmap
- **D 0–30**: Lovable Cloud + Auth + roles table + RLS; persist profile, scans, threads. Wire IMD + Agmarknet ingestion.
- **D 31–60**: On-device TF-Lite disease model; WhatsApp Business channel; push notifications.
- **D 61–90**: Officer/NGO consoles behind RBAC; analytics warehouse (BigQuery/Clickhouse); state-tenant theming; pilot with 1 district (10k farmers).

---

_This document is the deliberate audit output; the in-app "Pro Tools" launcher (Profile → Pro Tools) is the navigational entry-point for everything shipped above._
