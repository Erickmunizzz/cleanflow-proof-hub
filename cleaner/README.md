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
