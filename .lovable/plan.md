# Cinematic Chatbot + Hidden Admin Portal

## Overview
Replace current chatbot with a premium floating glass orb. Add a hidden command (`open the secret`) inside the chat that triggers a secure modal. Correct credentials unlock a full Admin Portal that lets you edit every section of the portfolio live, persisted locally — no more re-prompting Lovable for content changes.

## Architecture

### Content store (single source of truth)
- New file `src/lib/content-store.ts` — Zustand store + localStorage persistence holding ALL editable content:
  - hero (title, name, subtitle, role, CTAs)
  - about (heading, body, highlights)
  - projects[] (title, desc, image, live, github, tech[])
  - internships[], education[], timeline[], techStack[]
  - contact (email, socials, CTA text)
  - media (profile photo, resume URL, project assets) — stored as base64 data URLs in localStorage
- All section components refactored to read from the store instead of hardcoded constants. Defaults seeded from current content so first load is identical.
- Edits propagate instantly through React subscription → live preview everywhere.

### Auth (secret access)
- Credentials are NOT hardcoded in source. Stored as SHA-256 hash in a config file + verified client-side. Default seed: name `Reddy`, code `Venkatreddy60@` (hashed at build).
- Session token in `sessionStorage` (expires on tab close).
- Note for the user: pure client-side auth is by nature inspectable. For real security we'd enable Lovable Cloud later — the architecture is prepared (single `useAdminAuth` hook to swap).

### Access log
- Each successful unlock writes `{ time, userAgent, platform }` to `localStorage.adminAccessLog[]`.
- Visible inside the Admin Portal "Access Log" tab. Email integration left as a TODO stub in `src/lib/admin-notify.ts`.

## Chatbot (redesign)

`src/components/chatbot/`
- `ChatOrb.tsx` — floating bottom-right orb. Glass + silver rim + electric-blue glow. Framer Motion: breathing scale, Y float, glow pulse, magnetic hover, click morph.
- `ChatPanel.tsx` — opens with blur+scale+spring. Glass rounded panel. Mobile = full-width sheet; desktop = floating 380×560 modal.
- Greeting "Hello — How may I help?" + quick chips: Projects · Resume · Contact · Experience (smooth scroll to sections).
- Glass input with animated placeholder cycle.
- Command parser: `open the secret` (case-insensitive, trimmed) → bot replies "Enter Secret Code" and triggers `SecretModal`. Command excluded from chips/suggestions.

## Secret modal

`src/components/chatbot/SecretModal.tsx`
- Glass card, silver border glow, cinematic blur backdrop.
- Fields: Name, Secret Code (masked).
- Wrong → shake + red glow. Correct → silver/blue success sweep → routes to `/__atelier` (obscured path, no nav link).

## Admin Portal

Route: `src/routes/__atelier.tsx` (no nav exposure; protected by `useAdminAuth` — unauth visitors get bounced silently to `/`).

Layout: sidebar (Hero · About · Projects · Internships · Education · Timeline · Tech · Contact · Media · Access Log) + main edit canvas. Notion/Apple-settings vibe, matches portfolio theme (deep black, midnight blue, silver glass).

Per-section editors (all with live preview thumbnail at top):
- Text fields with debounced autosave
- Projects/Internships/Education/Timeline/Tech: list with add / edit-in-place / delete / drag-reorder (dnd-kit)
- Media tab: upload images & resume → base64 in store with preview/replace/delete
- Soft reveal, hover elevation, panel slide micro-interactions

## Files

Create:
- `src/lib/content-store.ts`
- `src/lib/admin-auth.ts`, `src/lib/admin-notify.ts`
- `src/components/chatbot/ChatOrb.tsx`
- `src/components/chatbot/ChatPanel.tsx`
- `src/components/chatbot/SecretModal.tsx`
- `src/components/admin/AdminShell.tsx`
- `src/components/admin/editors/{Hero,About,Projects,Internships,Education,Timeline,Tech,Contact,Media,AccessLog}Editor.tsx`
- `src/routes/__atelier.tsx`

Modify:
- `src/routes/index.tsx` — mount `<ChatOrb />`, remove old chatbot
- All section components → read from `useContent()` store
- `src/routes/__root.tsx` — update title to "IV Reddy — Digital Craft"

Install:
- `zustand`, `@dnd-kit/core`, `@dnd-kit/sortable`

## Key decisions to confirm

1. **Persistence**: localStorage only (works immediately, but data is per-browser — edits on your phone won't show on someone else's view). For cross-device persistent edits we'd need Lovable Cloud. **Proceed with localStorage now?**
2. **Default credentials seeded as `Reddy` / `Venkatreddy60@`** (hashed, not plaintext in source). OK?
3. **Admin route path** `/__atelier` — obscure but discoverable if someone reads the route tree. Acceptable since the real gate is the password.
4. **Access notifications**: stub only now (logged in-portal). Email wiring deferred until Cloud is enabled.

Reply "go" to build, or adjust any of the four points above.
