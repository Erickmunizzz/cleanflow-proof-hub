import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminSession } from "./AdminSession";
type Result = { category: string; id: string; title: string; detail: string; href: string };
const pages = [
  { title: "Plans & upgrades", keywords: "plans planos subscription assinatura upgrade", href: "/admin/settings" },
  { title: "Company policies", keywords: "policies politicas política políticas", href: "/admin/settings" },
  { title: "Integrations", keywords: "integrations integracoes integrações xero stripe slack", href: "/admin/settings" },
  { title: "Profile & company settings", keywords: "profile perfil account conta company empresa", href: "/admin/settings" },
];
const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
function hrefFor(row: Omit<Result,"href">) {
  if (row.category === "Jobs") return `/admin/jobs?job=${encodeURIComponent(row.id)}`;
  const section = row.category === "Customers" ? "customers" : row.category === "Employees" ? "employees" : "storage";
  return `/admin/${section}?q=${encodeURIComponent(row.title)}`;
}
export function GlobalSearch() {
  const session = useAdminSession();
  const [query, setQuery] = useState("");
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const container = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { const timer = setTimeout(() => setTerm(query.trim()), 250); return () => clearTimeout(timer); }, [query]);
  useEffect(() => {
    const close = (event: PointerEvent) => { if (!container.current?.contains(event.target as Node)) setOpen(false); };
    const shortcut = (event: KeyboardEvent) => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") { event.preventDefault(); input.current?.focus(); setOpen(true); } };
    document.addEventListener("pointerdown", close); document.addEventListener("keydown", shortcut);
    return () => { document.removeEventListener("pointerdown", close); document.removeEventListener("keydown", shortcut); };
  }, []);
  const results = useQuery({
    queryKey: ["global-search", session?.user.id, term], enabled: Boolean(session) && term.length > 0 && open,
    queryFn: async ({ signal }) => {
      const r = await (supabase as unknown as SupabaseClient).rpc("search_workspace", { search_term: term }).abortSignal(signal);
      if (r.error) throw r.error;
      return (r.data as Omit<Result,"href">[]).map(row => ({ ...row, href: hrefFor(row) }));
    }, staleTime: 0,
  });
  const settings: Result[] = term ? pages.filter(page => normalize(`${page.title} ${page.keywords}`).includes(normalize(term))).map(page => ({ category: "Settings", id: page.title, title: page.title, detail: "Open System Settings", href: page.href })) : [];
  const matches = [...(results.data ?? []), ...settings];
  const loading = term !== query.trim() || results.isFetching;
  const selected = Math.min(active, Math.max(0,matches.length-1));
  useEffect(() => { if (open) document.getElementById(`search-option-${selected}`)?.scrollIntoView({ block: "nearest" }); }, [selected, open]);
  return <div ref={container} className="relative min-w-0 max-w-[640px] flex-1" onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false); }}>
    <Search className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
    <input ref={input} role="combobox" aria-autocomplete="list" aria-label="Search workspace (Ctrl or Command K)" aria-expanded={open} aria-controls="workspace-search-results" aria-activedescendant={open && !loading && matches.length ? `search-option-${selected}` : undefined} maxLength={120} value={query}
      onFocus={() => setOpen(true)} onChange={event => { setQuery(event.target.value); setActive(0); setOpen(true); }}
      onKeyDown={event => { if(event.key === "Escape") setOpen(false); if(event.key === "ArrowDown" || event.key === "ArrowUp") { event.preventDefault(); setOpen(true); setActive(n => Math.max(0,Math.min(matches.length-1,n+(event.key === "ArrowDown"?1:-1)))); } if(event.key === "Enter" && open && !loading && matches[selected]) {event.preventDefault(); window.location.assign(matches[selected].href);} }}
      placeholder="Search customers, jobs, staff, settings…" className="h-10 w-full rounded-xl border border-transparent bg-surface-2 pl-10 pr-4 text-[13.5px] outline-none focus:border-primary focus:bg-card" />
    {open && <div className="absolute left-0 top-12 z-50 max-h-[65dvh] w-[min(26rem,calc(100vw-2rem))] overflow-y-auto rounded-xl border border-border bg-card p-3 shadow-xl">
      {!query.trim() ? <p className="p-2 text-sm text-muted-foreground">Search your workspace · Ctrl / ⌘ K</p> : loading ? <p role="status" className="p-2 text-sm text-muted-foreground">Searching…</p> : <>
        {results.isError && <p role="alert" className="p-2 text-sm text-destructive">Records could not be loaded. <button type="button" className="underline" onClick={() => void results.refetch()}>Try again</button></p>}
        {!matches.length && !results.isError && <p role="status" className="p-2 text-sm text-muted-foreground">No results found.</p>}
        <div id="workspace-search-results" role="listbox" aria-label="Search results">{matches.map((row,index) => <div key={`${row.category}-${row.id}`}>{(index===0 || matches[index-1]?.category!==row.category) && <h2 className="px-2 py-2 text-xs font-semibold text-muted-foreground">{row.category}</h2>}<a id={`search-option-${index}`} role="option" aria-selected={selected===index} href={row.href} onMouseEnter={()=>setActive(index)} className={`block rounded-lg p-2 text-sm focus:bg-secondary ${selected===index?"bg-secondary":"hover:bg-secondary"}`}><span className="block truncate font-medium">{row.title}</span>{row.detail && <span className="block truncate text-xs text-muted-foreground">{row.detail}</span>}</a></div>)}</div>
      </>}
    </div>}
  </div>;
}
