## Featured Work CMS — Plan

### 1. Enable Lovable Cloud
Provision database, storage, auth. Required for cross-device persistence, video uploads, public URLs, and server-side media processing.

### 2. Database schema (one migration)
Tables in `public`, all with grants + RLS:
- `showcase_items` — `id, kind ('project'|'certification'|'achievement'|'video'), title, description, thumbnail_url, media_url, live_url, github_url, tech (text[]), issuer, issue_date, verify_url, featured (bool), sort_order (int), owner_id (uuid), created_at`
- `media_assets` — `id, owner_id, kind ('image'|'video'|'pdf'|'other'), original_url, webp_url, poster_url, width, height, duration, size_bytes, mime, created_at`
- `showcase_settings` — single row per owner: `layout ('grid'|'carousel'|'masonry'|'featured'), featured_projects_first, featured_certs_first`
- `user_roles` + `app_role` enum + `has_role()` security-definer fn (per project rules)

RLS:
- Public SELECT on `showcase_items` and `showcase_settings` (it's a portfolio — visitors must read).
- INSERT/UPDATE/DELETE restricted to `has_role(auth.uid(),'admin')`.
- `media_assets` SELECT public, writes admin-only.

### 3. Storage buckets
- `showcase-media` (public) — images, videos, PDFs.

### 4. Replace client-only auth with real auth
- Drop SHA-256 secret-modal gate. New flow: secret chatbot command → `/atelier/login` email+password sign-in → checks `has_role('admin')` → `/atelier`.
- First-run bootstrap: SQL seeds an admin row for the user's email (asked via secret/env), OR a "claim admin" page that grants admin if no admin exists yet.
- Keep "open the secret" chatbot trigger so the secret entry UX survives.

### 5. Server functions (`src/lib/showcase.functions.ts`)
- `listShowcase()` public — returns items + settings.
- `upsertShowcaseItem`, `deleteShowcaseItem`, `reorderShowcase`, `toggleFeatured` — admin-gated via `requireSupabaseAuth` + `has_role` check.
- `getSignedUpload({ filename, mime })` — admin-gated, returns Supabase signed upload URL.
- `processUploadedMedia({ path, kind })` — admin-gated. For images: download, generate WebP + responsive variants via `@cf-wasm/photon` (WASM, Worker-safe), re-upload. For videos: store original, extract first-frame poster via client-side capture (server-side ffmpeg is not Worker-compatible — see note below). Returns `media_assets` row.

**Honest scope note on "full pipeline":** Cloudflare Workers (the runtime) does not support `sharp`, `ffmpeg`, or native binaries. Realistic edge-compatible pipeline:
- ✅ Image resize / WebP / responsive variants (WASM via `@cf-wasm/photon`)
- ✅ Lazy loading, signed uploads, streaming playback via Supabase Storage range requests
- ⚠️ Video transcoding / HLS — NOT possible on Workers. Videos stored as-is and streamed via Supabase Storage. To get true transcoding we'd need an external service (Mux, Cloudflare Stream, Bunny). Recommend deferring or wiring Mux later.
- ✅ Video poster: captured client-side from first frame at upload time, then uploaded alongside.

### 6. Featured Work section (frontend)
New `src/components/FeaturedWorkSection.tsx` mounted in `index.tsx` directly below Hero, above existing Marquee/Projects (keep them).
- Reads via TanStack Query (`listShowcase` server fn).
- Header: "Featured Work" / "Selected projects, certifications, achievements, and digital experiences."
- Layout switcher driven by `showcase_settings.layout`: Grid / Carousel (embla) / Masonry (CSS columns) / Featured Hero.
- Card types: ProjectCard, CertCard, AchievementCard, VideoCard — each with framer-motion hover (scale, glow, blur expand, image zoom).
- VideoCard → click opens modal player with fullscreen + controls.

### 7. Admin Portal — Media & Showcase Manager
New tab in `AdminShell.tsx`: **Media & Showcase**.
- Sub-tabs: Items · Media Library · Settings
- **Items**: list with kind filter; per-row drag-reorder (dnd-kit), featured toggle, edit dialog (kind-specific fields), delete, instant preview thumbnail.
- **Media Library**: drag-drop multi-upload zone (react-dropzone), grid of uploaded assets with preview, replace, delete, copy URL. Client-side image compression before upload (browser-image-compression). Video poster captured via `<video>` + canvas at upload time. Upload progress bar per file.
- **Settings**: radio for layout mode + checkboxes for "featured first" toggles.
- Live preview: every save invalidates the showcase query; main site reflects instantly.

### 8. Files

Create:
- supabase migration (tables, RLS, grants, roles)
- `src/lib/showcase.functions.ts`
- `src/lib/media.server.ts` (image WASM processing helpers, imported only inside handlers)
- `src/components/FeaturedWorkSection.tsx` + `cards/{Project,Cert,Achievement,Video}Card.tsx` + `VideoModal.tsx`
- `src/components/admin/editors/ShowcaseEditor.tsx` + `MediaLibrary.tsx` + `ShowcaseSettings.tsx`
- `src/routes/atelier.login.tsx` (real auth)

Modify:
- `src/lib/admin-auth.ts` → wrap Supabase auth + role check (keep `useAdminAuth` API shape)
- `src/components/chatbot/SecretModal.tsx` → routes to `/atelier/login`
- `src/components/admin/AdminShell.tsx` → add Media & Showcase tab
- `src/routes/index.tsx` → mount `<FeaturedWorkSection />` under Hero

Install: `@supabase/supabase-js` (auto via Cloud), `embla-carousel-react`, `react-dropzone`, `browser-image-compression`, `@cf-wasm/photon`.

### 9. Open decisions
1. **Admin bootstrap**: the secret-code modal granted you access before. With real auth, how do you want first admin set?  
   a) I create a "claim admin" page — first signed-in user becomes admin (one-time).  
   b) You give me an email now and I seed an admin row in the migration.  
   c) Keep an additional client-side gate using the existing secret code on top of email/password.
2. **Video transcoding**: skip for now (videos uploaded & streamed as-is, max ~50MB recommended) — or plan a follow-up to wire Mux/Cloudflare Stream?
3. **Keep current Projects section** below Featured Work, or eventually merge them? (You said keep — confirming both will show until you decide.)

Reply with answers (or just "go" + your bootstrap choice for #1) and I'll build.