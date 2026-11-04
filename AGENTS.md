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
- Not-yet-ported admin screens render via `admin.$section.tsx` placeholder; replace with a dedicated route file when porting each screen.
- Demo data lives in `src/lib/data/` so screens can switch to real data without UI changes.
- Prototype colours are semantic tokens in `src/styles.css` (success/warning/danger/ink/primary-soft); never use raw Tailwind palette colours.
