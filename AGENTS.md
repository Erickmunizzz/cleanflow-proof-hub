<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture
- Admin area lives under `/admin` (layout `src/routes/admin.tsx` with sidebar/topbar in `src/components/admin/`); sidebar items come from `src/lib/admin-nav.ts` so one list drives menu and section routes.
- Customer, staff and material directories use dedicated routes and a shared records form; remaining admin sections derive truthful views from available Supabase records without implying unsupported registers exist.
- Shared authenticated server functions own directory reads and writes; session-gated Suspense reads preserve the existing public Overview and /admin URLs.
- Initial sample records belong in conditional database migrations, never mount-time writes, to prevent duplicate records and privileged browser seeding.
- Demo data lives in `src/lib/data/` so screens can switch to real data without UI changes.
- Prototype colours are semantic tokens in `src/styles.css` (success/warning/danger/ink/primary-soft); never use raw Tailwind palette colours.
- The root session provider owns identity and auth transitions; sidebar and topbar share its profile name to avoid conflicting account displays.
- Paginate owner-facing lists with stable ordering; preserve explicit loading, error and empty states so failures never masquerade as missing records.
