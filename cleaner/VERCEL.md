# CleanMa Cleaner deployment

Use a separate Vercel project connected to this repository, root directory `.`.
Framework preset: Other (standalone React HTML bundled with esbuild).
Build command: `npm run build:cleaner`. Output: `cleaner/netlify`.
The Owner app is TanStack Start/React on Vite; do not replace its SSR configuration with a static Vite preset.

Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (publishable key only) in Preview and Production. The build accepts these values and defaults to the existing shared project for local builds. Never inject service-role credentials into the frontend.

Deployment pending: Vercel team access returned 403 on 11 November 2026. Environment variables in Vercel have not been verified or configured yet.

Security verification: company branding updates applied. The pg_net REVOKE migration did not change effective privileges because the managed objects/grants belong to supabase_admin; administrative remediation is still required. Leaked-password protection remains pending: the connected Supabase tools do not expose Auth configuration updates and no Management API credential is available.
