# CleanMa Cleaner

The supplied HTML's React view, icons and Tailwind styles are retained in `src/app.js` and `styles.css`. Live components are in `src/panels.js`; authentication, queries, actions and Realtime subscriptions are in `src/use-cleaner.js`; public Supabase configuration is in `src/supabase.js`.

Build from repository root: `node scripts/build-cleaner.mjs`. Deploy `cleaner/netlify/index.html` on Netlify or open `/cleaner.html` on the Owner deployment. Requires HTTPS and network connectivity. Browser location permission is required for attendance.

Both apps use project `eymkowczlmbrfxlxcwdm`. No passwords or service-role keys are embedded. Use an existing Supabase Auth email/password for a user whose active `profiles` row has role `cleaner` and whose active `staff` row links that profile in the same company. Owners intentionally cannot use the cleaner workspace. No test accounts were created.

For email-link sign-in, add the deployed Netlify URL to Supabase Auth Redirect URLs. This is not needed for password login. Email OTP availability and code length depend on the project's email template.

## Implemented flows
- Assigned jobs and real server timestamps for GPS attendance.
- Checklist done flags persisted; job definitions remain owner-only.
- Bidirectional messages to active company owners.
- Private photo uploads; Owner Check-in page obtains signed image URLs.
- Incidents and pending absence requests.
- Worked hours calculated from check-in/out, not simulated payments.
- Realtime invalidation plus 30-second refresh fallback.

## Validation and limits
SQL attendance/checklist tests ran as an authenticated transient cleaner within ROLLBACK. DOM smoke test rendered login with no runtime errors. Owner build and TypeScript passed. No screenshot comparison, live-device GPS, email delivery or two-session WebSocket test was performed. Pixel-perfect equivalence is not certified: authentication/chat/profile/hour panels were adapted to real workflows using the reference's styling.
NFC, offline writes, payroll payouts and automatic photo classification are not implemented. The app requires connectivity and does not claim simulated success for these actions. Password-leak protection and pg_net administrator permissions remain platform tasks discussed previously.

## Mobile reliability (11 November 2026)
- GPS requires HTTPS and browser permission. Attendance is online-only and server-timestamped.
- Camera/gallery accepts JPEG, PNG and WebP, reduces to 2048px JPEG before private upload. HEIC must be converted. Photos are not queued offline; keep originals until upload succeeds.
- Essential workspace data and pending checklist flags are cached locally per signed-in user for 24 hours, cleared on sign-out. Use a trusted device. No chat/photo cache. Keep a single tab open when working offline; reopening the app itself without a network is not supported (no service worker).
- Checklist replay uses an idempotent RPC, validates assignment/status and rejects changed task definitions. Pending conflicts remain visible and can be discarded explicitly. Sync runs on reconnection/focus and every 10 seconds while open.
- NFC is optional, feature-detected Web NFC. Provision active NDEF text/URL tags with the exact `nfc_tags.tag_code`, assigned to a job or client. Both NFC attendance actions require GPS and validate the employee, company and site server-side. NFC codes are not cryptographic proof of physical presence. Unsupported browsers use GPS.
- Messages and notifications subscribe to Realtime, with a 10-second polling fallback. Owner chat has the same safety polling. No zero-latency guarantee.
- Physical GPS/camera/NFC and two-account delivery still require real-device acceptance tests.
