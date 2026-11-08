import { useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Bell, CalendarDays, Check, ClipboardList, Loader2, MessageSquare, Package, Save, Settings, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAdminSession } from "./AdminSession";
import { supabase } from "@/integrations/supabase/client";
import { createSettingsDraft, type SettingsDraft } from "@/lib/settings-draft";

const sections = [
  { id: "general", title: "General settings", description: "Company info, timezone Europe/London, language, logo", icon: Settings },
  { id: "welcome", title: "Welcome messages", description: "Onboarding SMS/email templates for new cleaners", icon: MessageSquare },
  { id: "cleaning", title: "Cleaning types", description: "Hospital, Office, Deep, Window, Carpet etc.", icon: Sparkles },
  { id: "absence", title: "Absence types", description: "Sick leave, holiday, unpaid, emergency", icon: CalendarDays },
  { id: "notifications", title: "Notification types", description: "Check-in, cancellations, inventory alerts", icon: Bell },
  { id: "resources", title: "Resource categories", description: "Chemicals, equipment, PPE, consumables", icon: Package },
  { id: "policies", title: "Company policies", description: "Attendance, cancellations, health and safety", icon: ShieldCheck },
] as const;
type SectionId = typeof sections[number]["id"];

function Field({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return <div className="min-w-0 space-y-2"><Label htmlFor={id} className="text-[13px] font-medium">{label}</Label>{children}</div>;
}
const inputClass = "h-10 rounded-xl bg-surface-2 text-[13px] shadow-none focus:bg-card";
const textClass = "min-h-28 rounded-xl bg-surface-2 text-[13px] shadow-none focus:bg-card";

export function SettingsPage() {
  const session = useAdminSession();
  const [draft, setDraft] = useState(createSettingsDraft);
  const [editing, setEditing] = useState<SettingsDraft>(createSettingsDraft);
  const [active, setActive] = useState<SectionId | null>(null);
  const [updated, setUpdated] = useState<SectionId[]>([]);
  const companyQuery = useQuery({
    queryKey: ["settings-company", session?.user.id],
    enabled: Boolean(session),
    queryFn: async () => {
      if (!session) return null;
      const profile = await supabase.from("profiles").select("company_id").eq("id", session.user.id).maybeSingle();
      if (profile.error) throw new Error(profile.error.message);
      if (!profile.data) return null;
      const company = await supabase.from("companies").select("id,name").eq("id", profile.data.company_id).maybeSingle();
      if (company.error) throw new Error(company.error.message);
      return company.data;
    },
  });
  const item = sections.find(section => section.id === active);
  function open(id: SectionId) {
    setEditing({ ...draft, company: { ...draft.company, name: updated.includes("general") ? draft.company.name : companyQuery.data?.name ?? draft.company.name } });
    setActive(id);
  }
  function companyField(key: keyof SettingsDraft["company"], value: string) {
    setEditing(previous => ({ ...previous, company: { ...previous.company, [key]: value } }));
  }
  function saveDraft(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!active) return;
    setDraft(editing);
    setUpdated(previous => previous.includes(active) ? previous : [...previous, active]);
    setActive(null);
    toast.success("Draft updated for this visit. Not saved to Supabase.");
  }
  return <div className="max-w-[1200px] space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <h1 className="text-[26px] font-bold">System Settings</h1>
      <span className="flex items-center gap-1.5 rounded-full border border-warning-border bg-warning-soft px-3 py-1 text-[11px] font-medium text-warning-strong"><ClipboardList className="size-3.5" />Draft settings · not saved to Supabase</span>
    </div>
    {companyQuery.isFetching && <p role="status" className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" />Loading company details…</p>}
    {companyQuery.isError && <div role="alert" className="flex flex-wrap items-center gap-3 text-sm text-danger"><span>Company details could not be loaded.</span><Button variant="outline" size="sm" onClick={() => void companyQuery.refetch()}>Try again</Button></div>}
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {sections.map(section => {
        const Icon = section.icon;
        return <Button key={section.id} variant="outline" onClick={() => open(section.id)} aria-label={`Configure ${section.title}`} className="group relative h-auto min-h-[195px] w-full flex-col items-start justify-start gap-0 whitespace-normal rounded-xl border-border bg-card p-5 text-left shadow-none transition-shadow hover:bg-card hover:shadow-card-md">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-accent text-muted-foreground transition-colors group-hover:bg-primary-soft group-hover:text-primary"><Icon className="size-5" /></span>
          <span className="mt-4 text-[14px] font-semibold">{section.title}</span>
          <span className="mt-1 text-[12.5px] font-normal leading-relaxed text-muted-foreground">{section.description}</span>
          <span className="mt-auto flex items-center gap-1 pt-4 text-[12px] font-medium text-primary">Configure <ArrowRight className="size-3.5" /></span>
          {updated.includes(section.id) && <Check aria-label="Draft updated" className="absolute right-5 top-5 size-4 text-success-strong" />}
        </Button>;
      })}
    </div>
    <Dialog open={active !== null} onOpenChange={value => { if (!value) setActive(null); }}>
      <DialogContent className="max-h-[85dvh] w-[calc(100%-2rem)] max-w-[640px] overflow-y-auto rounded-xl bg-card p-5 sm:p-6">
        <DialogHeader><DialogTitle>{item?.title}</DialogTitle><DialogDescription>Draft only · changes are kept for this visit, not saved to Supabase.</DialogDescription></DialogHeader>
        <form onSubmit={saveDraft} className="space-y-6">
          {active === "general" && <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2"><Field id="company-name" label="Company name"><Input id="company-name" required maxLength={200} className={inputClass} value={editing.company.name} onChange={event => companyField("name", event.target.value)} /></Field></div>
            <Field id="company-email" label="Company email"><Input id="company-email" type="email" className={inputClass} value={editing.company.email} onChange={event => companyField("email", event.target.value)} /></Field>
            <Field id="company-phone" label="Phone number"><Input id="company-phone" type="tel" className={inputClass} value={editing.company.phone} onChange={event => companyField("phone", event.target.value)} /></Field>
            <div className="sm:col-span-2"><Field id="company-address" label="Company address"><Textarea id="company-address" className={textClass} value={editing.company.address} onChange={event => companyField("address", event.target.value)} /></Field></div>
            <Field id="timezone" label="Timezone"><Select value={editing.system.timezone} onValueChange={timezone => setEditing(previous => ({ ...previous, system: { ...previous.system, timezone } }))}><SelectTrigger id="timezone" className={inputClass}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Europe/London">Europe/London</SelectItem></SelectContent></Select></Field>
            <Field id="language" label="Language"><Select value={editing.system.language}><SelectTrigger id="language" className={inputClass}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="en-GB">English (UK)</SelectItem></SelectContent></Select></Field>
            <div className="sm:col-span-2"><Field id="company-logo" label="Logo URL"><Input id="company-logo" type="url" className={inputClass} value={editing.company.logoUrl} onChange={event => companyField("logoUrl", event.target.value)} /></Field></div>
          </div>}
          {active === "welcome" && <div className="space-y-4">{([['emailSubject', 'Email subject'], ['emailBody', 'Welcome email'], ['smsBody', 'Welcome SMS']] as const).map(([key, label]) => <Field key={key} id={key} label={label}>{key === "emailSubject" ? <Input id={key} className={inputClass} value={editing.welcome[key]} onChange={event => setEditing(previous => ({ ...previous, welcome: { ...previous.welcome, [key]: event.target.value } }))} /> : <Textarea id={key} className={textClass} value={editing.welcome[key]} onChange={event => setEditing(previous => ({ ...previous, welcome: { ...previous.welcome, [key]: event.target.value } }))} />}</Field>)}</div>}
          {(active === "cleaning" || active === "absence" || active === "resources") && (() => {
            const key = active === "cleaning" ? "cleaningTypes" : active === "absence" ? "absenceTypes" : "resourceCategories";
            return <Field id={key} label={item?.title ?? "Categories"}><Textarea id={key} className={`${textClass} min-h-48`} value={editing[key]} onChange={event => setEditing(previous => ({ ...previous, [key]: event.target.value }))} /></Field>;
          })()}
          {active === "notifications" && <div className="divide-y divide-border">{([['checkIn', 'Check-in notifications'], ['cancellations', 'Cancellation notifications'], ['inventory', 'Inventory alerts']] as const).map(([key, label]) => <div key={key} className="flex items-center justify-between gap-4 py-4"><Label htmlFor={key}>{label}</Label><Switch id={key} checked={editing.notifications[key]} onCheckedChange={checked => setEditing(previous => ({ ...previous, notifications: { ...previous.notifications, [key]: checked } }))} /></div>)}</div>}
          {active === "policies" && <div className="space-y-4">{([['attendance', 'Attendance policy'], ['cancellation', 'Cancellation policy'], ['healthAndSafety', 'Health and safety policy']] as const).map(([key, label]) => <Field key={key} id={key} label={label}><Textarea id={key} className={textClass} value={editing.policies[key]} onChange={event => setEditing(previous => ({ ...previous, policies: { ...previous.policies, [key]: event.target.value } }))} /></Field>)}</div>}
          <DialogFooter className="gap-2"><Button type="button" variant="outline" className="rounded-xl" onClick={() => setActive(null)}>Cancel</Button><Button type="submit" className="rounded-xl"><Save />Save draft</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>;
}