import { useState, type FormEvent, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { BriefcaseBusiness, MapPin, Pencil, Plus, Save, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { ownerContextOptions } from "@/lib/owner-context";

type Row = { id: string; name: string; main_area?: boolean; group_name?: string; title_no?: string };
type Structure = Record<"areas" | "groups" | "titles", Row[]>;
type Section = keyof Structure;
type Draft = { expected: Structure; changes: Structure };
type Editor = { section: Section; row: Row };
const pageSize = 10;

function StructureCard({ title, icon: Icon, rows, columns, fields, formId, onAdd, onOpenAdd, actions, cells, disabled }: {
  title: string; icon: typeof MapPin; rows: Row[]; columns: string[]; fields?: ReactNode;
  formId?: string; onOpenAdd?: () => void; onAdd: (event: FormEvent<HTMLFormElement>) => void;
  actions: (row: Row) => ReactNode; cells: (row: Row) => ReactNode; disabled: boolean;
}) {
  const [page, setPage] = useState(0);
  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  const current = Math.min(page, pages - 1);
  const addLabel = title === "Customer Areas" ? "Add area" : title === "Employee Groups" ? "Add group" : "Add title";
  return <section className="flex min-w-0 flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-card">
    <h2 className="flex items-center gap-2 text-sm font-semibold"><Icon className="size-4 text-primary" />{title}</h2>
    {fields && <form id={formId} className="space-y-2" onSubmit={onAdd}>{fields}</form>}
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface-2 text-[11px] uppercase tracking-wide text-muted-foreground">
          <tr>{columns.map(column => <th key={column} scope="col" className="px-2.5 py-2">{column}</th>)}</tr>
        </thead>
        <tbody>{rows.slice(current * pageSize, (current + 1) * pageSize).map(row =>
          <tr key={row.id} className="border-t border-border">{cells(row)}<td className="px-2 py-2">{actions(row)}</td></tr>,
        )}</tbody>
      </table>
      {!rows.length && <p className="p-4 text-sm text-muted-foreground">No records yet.</p>}
    </div>
    {pages > 1 && <div className="flex items-center justify-between gap-1 text-xs">
      <Button size="sm" variant="ghost" disabled={!current} onClick={() => setPage(current - 1)}>Previous</Button>
      <span>{current + 1} / {pages}</span>
      <Button size="sm" variant="ghost" disabled={current + 1 >= pages} onClick={() => setPage(current + 1)}>Next</Button>
    </div>}
    {formId ? <Button type="submit" form={formId} variant="outline" className="mt-auto" disabled={disabled}><Plus />{addLabel}</Button>
      : <Button type="button" className="mt-auto bg-ink text-ink-foreground hover:bg-ink/90" disabled={disabled} onClick={onOpenAdd}><Plus />{addLabel}</Button>}
  </section>;
}

export function CompanyStructure() {
  const { data: { companyId } } = useSuspenseQuery(ownerContextOptions);
  return <StructureWorkspace key={companyId} companyId={companyId} />;
}

function StructureWorkspace({ companyId }: { companyId: string }) {
  const client = useQueryClient();
  const key = ["company-structure", companyId];
  const [draft, setDraft] = useState<Draft | null>(null);
  const [editor, setEditor] = useState<Editor | null>(null);
  const [removal, setRemoval] = useState<Editor | null>(null);
  const [status, setStatus] = useState("");
  const [validation, setValidation] = useState("");
  const query = useQuery({
    queryKey: key,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_company_structure", { target_company: companyId });
      if (error) throw new Error(error.message);
      return data as unknown as Structure;
    },
  });
  const save = useMutation({
    mutationFn: async ({ expected, changes }: Draft) => {
      const { data, error } = await supabase.rpc("save_company_structure", { target_company: companyId, expected, changes });
      if (error) throw new Error(error.code === "23505" ? "Use unique area names, group and name pairs, and title numbers." : error.message);
      return data as unknown as Structure;
    },
    onSuccess: data => {
      client.setQueryData(key, data);
      setDraft(null);
      setStatus("Changes saved.");
    },
  });

  if (query.isPending) return <p role="status">Loading company structure…</p>;
  if (query.isError && !query.data) return <div role="alert" className="space-y-3">
    <p>{query.error.message}</p><Button onClick={() => void query.refetch()}>Try again</Button>
  </div>;

  const original = draft?.expected ?? query.data!;
  const view = draft?.changes ?? original;
  function change(section: Section, rows: Row[]) {
    setDraft({ expected: original, changes: { ...view, [section]: rows } });
    setStatus("");
    save.reset();
  }
  function submit(section: Section, event: FormEvent<HTMLFormElement>, id: string = crypto.randomUUID()) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const group = String(form.get("group_name") ?? "").trim();
    const title = String(form.get("title_no") ?? "").trim();
    if (!name || (section === "groups" && !group) || (section === "titles" && !title)) {
      setValidation("Enter a value in each required field.");
      return;
    }
    const row: Row = section === "areas" ? { id, name, main_area: form.has("main_area") }
      : section === "groups" ? { id, name, group_name: group } : { id, name, title_no: title };
    const rows = view[section];
    change(section, rows.some(item => item.id === id) ? rows.map(item => item.id === id ? row : item) : [...rows, row]);
    setValidation("");
    event.currentTarget.reset();
    setEditor(null);
  }
  function actions(section: Section, row: Row) {
    return <div className="flex gap-1">
      <Button type="button" variant="ghost" size="icon" className="size-7" aria-label={`Edit ${row.name}`}
        disabled={save.isPending} onClick={() => { setValidation(""); setEditor({ section, row }); }}><Pencil /></Button>
      <Button type="button" variant="ghost" size="icon" className="size-7 text-danger" aria-label={`Delete ${row.name}`}
        disabled={save.isPending} onClick={() => setRemoval({ section, row })}><Trash2 /></Button>
    </div>;
  }

  return <div className="space-y-5">
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div><h1 className="text-[28px] font-bold">Company Structure</h1>
        <p className="text-sm text-muted-foreground">Manage customer areas, employee groups and titles.</p>
      </div>
      <Button disabled={!draft || save.isPending} onClick={() => { if (draft) save.mutate(draft); }}>
        <Save />{save.isPending ? "Saving…" : "Save changes"}
      </Button>
    </header>
    {draft && <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
      <span>Unsaved changes</span>
      <Button variant="outline" size="sm" disabled={save.isPending} onClick={() => {
        setDraft(null); setStatus(""); save.reset(); void query.refetch();
      }}>Discard changes and reload</Button>
    </div>}
    {status && <p role="status" className="text-sm text-success-strong">{status}</p>}
    {save.error && <p role="alert" className="text-sm text-danger">{save.error.message}</p>}
    {validation && !editor && <p role="alert" className="text-sm text-danger">{validation}</p>}
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <StructureCard title="Customer Areas" icon={MapPin} rows={view.areas} columns={["Area name", "Main area", "Functions"]}
        formId="add-customer-area" disabled={save.isPending} onAdd={event => submit("areas", event)}
        fields={<fieldset className="flex flex-wrap items-center gap-2" disabled={save.isPending}>
          <Input className="min-w-24 flex-1" aria-label="Area name" placeholder="Area name" name="name" maxLength={120} required />
          <label className="flex items-center gap-1 whitespace-nowrap text-xs"><input name="main_area" type="checkbox" /> Main area</label>
        </fieldset>}
        actions={row => actions("areas", row)} cells={row => <><td className="break-words px-2.5 py-2">{row.name}</td><td className="px-2.5 py-2">{row.main_area ? "Yes" : "—"}</td></>} />
      <StructureCard title="Employee Groups" icon={Users} rows={view.groups} columns={["Group", "Name", "Functions"]}
        formId="add-employee-group" disabled={save.isPending} onAdd={event => submit("groups", event)}
        fields={<fieldset className="space-y-2" disabled={save.isPending}>
          <Input aria-label="Group name" placeholder="Group name" name="group_name" maxLength={120} required />
          <Input aria-label="Name" placeholder="Name" name="name" maxLength={120} required />
        </fieldset>}
        actions={row => actions("groups", row)} cells={row => <><td className="break-words px-2.5 py-2">{row.group_name}</td><td className="break-words px-2.5 py-2">{row.name}</td></>} />
      <StructureCard title="Employee Titles" icon={BriefcaseBusiness} rows={view.titles} columns={["Title no", "Name", "Functions"]}
        disabled={save.isPending} onAdd={event => submit("titles", event)}
        onOpenAdd={() => { setValidation(""); setEditor({ section: "titles", row: { id: crypto.randomUUID(), name: "", title_no: "" } }); }}
        actions={row => actions("titles", row)} cells={row => <><td className="px-2.5 py-2 font-mono">{row.title_no}</td><td className="break-words px-2.5 py-2">{row.name}</td></>} />
    </div>
    <Dialog open={Boolean(editor)} onOpenChange={open => { if (!open) { setEditor(null); setValidation(""); } }}>
      {editor && <DialogContent>
        <DialogHeader><DialogTitle>{editor.row.name ? "Edit record" : "Add title"}</DialogTitle>
          <DialogDescription>Use Save changes to persist the updates.</DialogDescription></DialogHeader>
        <form className="space-y-3" onSubmit={event => submit(editor.section, event, editor.row.id)}>
          {editor.section === "groups" && <label className="grid gap-1 text-sm">Group name<Input name="group_name" defaultValue={editor.row.group_name} maxLength={120} required /></label>}
          {editor.section === "titles" && <label className="grid gap-1 text-sm">Title no<Input name="title_no" defaultValue={editor.row.title_no} maxLength={30} required /></label>}
          <label className="grid gap-1 text-sm">{editor.section === "areas" ? "Area name" : "Name"}<Input name="name" defaultValue={editor.row.name} maxLength={120} required /></label>
          {editor.section === "areas" && <label className="flex items-center gap-2 text-sm"><input name="main_area" type="checkbox" defaultChecked={editor.row.main_area} /> Main area</label>}
          {validation && <p role="alert" className="text-sm text-danger">{validation}</p>}
          <Button type="submit">Apply</Button>
        </form>
      </DialogContent>}
    </Dialog>
    <Dialog open={Boolean(removal)} onOpenChange={open => { if (!open) setRemoval(null); }}>
      {removal && <DialogContent>
        <DialogHeader><DialogTitle>Delete {removal.row.name}?</DialogTitle>
          <DialogDescription>The record will be removed when you save changes.</DialogDescription></DialogHeader>
        <Button variant="destructive" onClick={() => {
          change(removal.section, view[removal.section].filter(row => row.id !== removal.row.id)); setRemoval(null);
        }}>Delete</Button>
      </DialogContent>}
    </Dialog>
  </div>;
}
