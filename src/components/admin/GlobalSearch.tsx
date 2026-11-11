import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAdminSession } from "./AdminSession";

export function GlobalSearch() {
  const session = useAdminSession();
  const [query, setQuery] = useState("");
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => { const timer = setTimeout(() => setTerm(query.trim()), 300); return () => clearTimeout(timer); }, [query]);
  useEffect(() => {
    const close = (event: PointerEvent) => { if (!container.current?.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  const results = useQuery({
    queryKey: ["global-search", session?.user.id, term],
    enabled: Boolean(session) && term.length >= 2 && open,
    queryFn: async () => {
      const profile = await supabase.from("profiles").select("company_id,role,is_active").eq("id", session!.user.id).single();
      if (profile.error) throw profile.error;
      if (!profile.data.is_active || profile.data.role !== "owner") throw new Error("An active owner profile is required.");
      const company = profile.data.company_id;
      // Escape wildcard and PostgREST filter punctuation; never interpolate a raw filter expression.
      const pattern = `%${term.replace(/[\\%_]/g, "\\$&")}%`;
      const data = await Promise.all([
        supabase.from("clients").select("id,name").eq("company_id", company).ilike("name", pattern).order("name").order("id").limit(6),
        supabase.from("jobs").select("id,title,scheduled_date,status").eq("company_id", company).ilike("title", pattern).order("scheduled_date", { ascending: false }).order("id").limit(6),
        supabase.from("staff").select("id,name").eq("company_id", company).ilike("name", pattern).order("name").order("id").limit(6),
        supabase.from("materials").select("id,name").eq("company_id", company).ilike("name", pattern).order("name").order("id").limit(6),
      ]);
      for (const result of data) if (result.error) throw result.error;
      return [
        { label: "Customers", section: "customers", rows: data[0].data!.map(row => ({ id: row.id, title: row.name, detail: "" })) },
        { label: "Jobs", section: "jobs", rows: data[1].data!.map(row => ({ id: row.id, title: row.title, detail: `${new Date(row.scheduled_date).toLocaleDateString("en-GB")} · ${row.status.replaceAll("_", " ")}` })) },
        { label: "Employees", section: "employees", rows: data[2].data!.map(row => ({ id: row.id, title: row.name, detail: "" })) },
        { label: "Inventory", section: "storage", rows: data[3].data!.map(row => ({ id: row.id, title: row.name, detail: "" })) },
      ];
    },
    staleTime: 0,
  });
  return <div ref={container} className="relative min-w-0 max-w-[640px] flex-1" onKeyDown={event => { if (event.key === "Escape") setOpen(false); }}>
    <Search className="pointer-events-none absolute left-3 top-3 size-4 text-muted-foreground" />
    <input aria-label="Search workspace" aria-expanded={open} aria-controls="workspace-search-results" value={query} onFocus={() => setOpen(true)} onChange={event => { setQuery(event.target.value); setOpen(true); }} placeholder="Search customers, jobs, staff, inventory..." className="h-10 w-full rounded-xl border border-transparent bg-surface-2 pl-10 pr-4 text-[13.5px] outline-none focus:border-primary focus:bg-card" />
    {open && <div id="workspace-search-results" className="absolute left-0 top-12 z-50 max-h-[65dvh] w-[min(26rem,calc(100vw-2rem))] overflow-y-auto rounded-xl border border-border bg-card p-3 shadow-xl">
      {query.trim().length < 2 ? <p className="p-2 text-sm text-muted-foreground">Type at least 2 characters.</p> : term !== query.trim() || results.isFetching ? <p role="status" className="p-2 text-sm">Searching…</p> : results.isError ? <p role="alert" className="p-2 text-sm text-destructive">Search could not be loaded. <button type="button" className="underline" onClick={() => void results.refetch()}>Try again</button></p> : results.data?.every(group => !group.rows.length) ? <p role="status" className="p-2 text-sm text-muted-foreground">No matching records.</p> : results.data?.map(group => group.rows.length > 0 && <section key={group.label}><h2 className="px-2 py-2 text-xs font-semibold text-muted-foreground">{group.label}</h2>{group.rows.map(row => <Link key={row.id} to="/admin/$section" params={{ section: group.section }} onClick={() => setOpen(false)} className="block rounded-lg p-2 text-sm hover:bg-secondary focus:bg-secondary"><span className="block truncate font-medium">{row.title}</span>{row.detail && <span className="text-xs text-muted-foreground">{row.detail}</span>}</Link>)}</section>)}
    </div>}
  </div>;
}
