# CleanMa Cleaner operations

Project: `cleanma-cleaner`, GitHub `Erickmunizzz/cleanflow-proof-hub`, production branch main. Secondary branches/PRs use Vercel Preview deployments. Root `.`, build `npm run build:cleaner`, output `cleaner/netlify`, Node 24. Owner app remains TanStack Start/React on Vite.

`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are configured in Preview and Production. Server-only `CRON_SECRET` is configured in this project; never add it to VITE-prefixed variables. No service-role key is needed: the dedicated RPC checks a SHA256 digest stored in a private RLS-protected table, then emits notifications for active cleaners' assigned jobs only. No customer/employee records are returned by the scheduler.

Daily reminders use two daily UTC calls (06:00 and 07:00). The database only runs at hour 7 in Europe/London, covering GMT/BST. Hobby timing may be anywhere within the scheduled hour. Duplicate invocations use the notification unique key. Scheduled jobs only; notifications appear under Cleaner Profile and follow recipient/company RLS and Realtime. These are in-app reminders, not email, SMS or device push. Preview never dispatches reminders. Only this cleaner project has the scheduler credential; other projects sharing the repository must not configure CRON_SECRET or will also schedule this routine.

Analytics and Speed Insights scripts are prepared in the generated Cleaner HTML; analytics normalizes the tracked URL to `/` to avoid query/path identifiers. Dashboard enablement is NOT confirmed: the dashboard browser requires login and the connected tools do not expose enablement. Metrics are not guaranteed until that step is completed. Review usage costs before enabling paid options.

The explicitly requested Friend Tester account was created directly in hosted Auth with confirmed email and linked profile/staff; no credentials are committed. Login and cleaner_workspace were verified. No fake jobs were created.

Previous security limitations remain: managed pg_net grants require supabase_admin; leaked-password protection needs authenticated access to Auth settings. Neither is changed by this deployment.
