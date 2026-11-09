import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Bell, CalendarDays, Loader2, MessageSquare, Package, Save, Settings, ShieldCheck, Sparkles } from "lucide-react";
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
import type { Json, Tables } from "@/integrations/supabase/types";

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
type CompanySettingsRow = Tables<"company_settings">;
function draftFromSettings(row: CompanySettingsRow): SettingsDraft {
  const defaults = createSettingsDraft();
  const stored = row.settings_data as unknown as Partial<SettingsDraft>;
  return {
    ...defaults,
    company: { ...defaults.company, ...stored?.company, name: row.company_name },
    system: { ...defaults.system, ...stored?.system, timezone: row.timezone, language: row.language },
    welcome: { ...defaults.welcome, ...stored?.welcome, emailBody: row.welcome_email_template, smsBody: row.welcome_sms_template },
    cleaningTypes: stored?.cleaningTypes ?? defaults.cleaningTypes,
    absenceTypes: stored?.absenceTypes ?? defaults.absenceTypes,
    resourceCategories: stored?.resourceCategories ?? defaults.resourceCategories,
    notifications: { ...defaults.notifications, ...stored?.notifications },
    policies: { ...defaults.policies, ...stored?.policies },
  };
}
function formatSavedAt(row: CompanySettingsRow) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: row.timezone || "Europe/London",
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(new Date(row.updated_at));
}

export function SettingsPage() {
  const session = useAdminSession();
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState(createSettingsDraft);
  const [editing, setEditing] = useState<SettingsDraft>(createSettingsDraft);
  const [active, setActive] = useState<SectionId | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const companyQuery = useQuery({
    queryKey: ["settings-company", session?.user.id],
    enabled: Boolean(session),
    queryFn: async () => {
      if (!session) return null;
      const profile = await supabase.from("profiles").select("company_id,role,is_active")
        .eq("id", session.user.id).maybeSingle();
      if (profile.error) throw new Error(profile.error.message);
      if (!profile.data || profile.data.role !== "owner" || !profile.data.is_active) {
        throw new Error("Only an active company owner can manage system settings.");
      }
      const company = await supabase.from("companies").select("id,name")
        .eq("id", profile.data.company_id).maybeSingle();
      if (company.error) throw new Error(company.error.message);
      if (!company.data) throw new Error("Company workspace could not be found.");
      return company.data;
    },
  });
  const companyId = companyQuery.data?.id;
  const settingsQuery = useQuery({
    queryKey: ["company-settings", companyId],
    enabled: Boolean(companyId),
    queryFn: async () => {
      const company = companyQuery.data;
      if (!company) throw new Error("Company workspace could not be found.");
      const { data: existing, error: readError } = await supabase.from("company_settings")
        .select("*").eq("company_id", company.id).maybeSingle();
      if (readError) throw new Error(readError.message);
      if (existing) return existing;

      const defaults = createSettingsDraft();
      const initial = {
        company_id: company.id,
        company_name: company.name,
        timezone: defaults.system.timezone,
        language: defaults.system.language,
        welcome_sms_template: defaults.welcome.smsBody,
        welcome_email_template: defaults.welcome.emailBody,
        settings_data: defaults as unknown as Json,
      };
      const { data: created, error: insertError } = await supabase.from("company_settings")
        .insert(initial).select("*").single();
      if (!insertError) return created;
      if (insertError.code !== "23505") throw new Error(insertError.message);

      // Another tab may have created this company's first row at the same time.
      const { data: raced, error: raceReadError } = await supabase.from("company_settings")
        .select("*").eq("company_id", company.id).single();
      if (raceReadError) throw new Error(raceReadError.message);
      return raced;
    },
  });

  useEffect(() => {
    if (settingsQuery.data) setDraft(draftFromSettings(settingsQuery.data));
  }, [settingsQuery.data]);
  useEffect(() => {
    if (!companyId) return;
    const channel = supabase.channel(`company-settings-${companyId}`)
      .on("postgres_changes", {
        event: "*", schema: "public", table: "company_settings",
        filter: `company_id=eq.${companyId}`,
      }, () => { void queryClient.invalidateQueries({ queryKey: ["company-settings", companyId] }); })
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [companyId, queryClient]);

  const item = sections.find(section => section.id === active);
  function open(id: SectionId) {
    setEditing(draft);
    setSaveError("");
    setActive(id);
  }
  function companyField(key: keyof SettingsDraft["company"], value: string) {
    setEditing(previous => ({ ...previous, company: { ...previous.company, [key]: value } }));
  }
  async function saveDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!active || !companyId) return;
    setSaving(true);
    setSaveError("");
    const payload = {
      company_id: companyId,
      company_name: editing.company.name.trim(),
      timezone: editing.system.timezone,
      language: editing.system.language,
      welcome_sms_template: editing.welcome.smsBody,
      welcome_email_template: editing.welcome.emailBody,
      settings_data: editing as unknown as Json,
    };
    const { data, error } = await supabase.from("company_settings")
      .upsert(payload, { onConflict: "company_id" }).select("*").single();
    setSaving(false);
    if (error) {
      setSaveError(error.message);
      toast.error("Settings could not be saved.");
      return;
    }
    setDraft(draftFromSettings(data));
    queryClient.setQueryData(["company-settings", companyId], data);
    setActive(null);
    toast.success("Settings saved to Supabase.");
  }
  return <div className="max-w-[1200px] space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <h1 className="text-[26px] font-bold">System Settings</h1>
      <span role="status" className="rounded-full border border-border bg-card px-3 py-1 text-[11px] font-medium text-muted-foreground">{settingsQuery.data ? `Saved · ${formatSavedAt(settingsQuery.data)}` : "Settings not saved yet"}</span>
    </div>
    {companyQuery.isFetching && <p role="status" className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" />Loading company details…</p>}
    {companyQuery.isError && <div role="alert" className="flex flex-wrap items-center gap-3 text-sm text-danger"><span>{companyQuery.error.message}</span><Button variant="outline" size="sm" onClick={() => void companyQuery.refetch()}>Try again</Button></div>}
    {settingsQuery.isLoading && <p role="status" className="text-sm text-muted-foreground">Loading workspace settings…</p>}
    {settingsQuery.isError && <div role="alert" className="flex flex-wrap items-center gap-3 text-sm text-danger"><span>Settings could not be loaded: {settingsQuery.error.message}</span><Button variant="outline" size="sm" onClick={() => void settingsQuery.refetch()}>Try again</Button></div>}
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {sections.map(section => {
        const Icon = section.icon;
        return <Button key={section.id} variant="outline" onClick={() => open(section.id)} disabled={!settingsQuery.data} aria-label={`Configure ${section.title}`} className="group relative h-auto min-h-[195px] w-full flex-col items-start justify-start gap-0 whitespace-normal rounded-xl border-border bg-card p-5 text-left shadow-none transition-shadow hover:bg-card hover:shadow-card-md">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-accent text-muted-foreground transition-colors group-hover:bg-primary-soft group-hover:text-primary"><Icon className="size-5" /></span>
          <span className="mt-4 text-[14px] font-semibold">{section.title}</span>
          <span className="mt-1 text-[12.5px] font-normal leading-relaxed text-muted-foreground">{section.description}</span>
          <span className="mt-auto flex items-center gap-1 pt-4 text-[12px] font-medium text-primary">Configure <ArrowRight className="size-3.5" /></span>
          
        </Button>;
      })}
    </div>
    <Dialog open={active !== null} onOpenChange={value => { if (!value) setActive(null); }}>
      <DialogContent className="max-h-[85dvh] w-[calc(100%-2rem)] max-w-[640px] overflow-y-auto rounded-xl bg-card p-5 sm:p-6">
        <DialogHeader><DialogTitle>{item?.title}</DialogTitle><DialogDescription>Changes are saved to this company workspace in Supabase.</DialogDescription></DialogHeader>
        <form onSubmit={event => void saveDraft(event)} className="space-y-6">
          {active === "general" && <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2"><Field id="company-name" label="Company name"><Input id="company-name" required maxLength={200} className={inputClass} value={editing.company.name} onChange={event => companyField("name", event.target.value)} /></Field></div>
            <Field id="company-email" label="Company email"><Input id="company-email" type="email" className={inputClass} value={editing.company.email} onChange={event => companyField("email", event.target.value)} /></Field>
            <Field id="company-phone" label="Phone number"><Input id="company-phone" type="tel" className={inputClass} value={editing.company.phone} onChange={event => companyField("phone", event.target.value)} /></Field>
            <div className="sm:col-span-2"><Field id="company-address" label="Company address"><Textarea id="company-address" className={textClass} value={editing.company.address} onChange={event => companyField("address", event.target.value)} /></Field></div>
            <Field id="timezone" label="Timezone"><Select value={editing.system.timezone} onValueChange={timezone => setEditing(previous => ({ ...previous, system: { ...previous.system, timezone } }))}><SelectTrigger id="timezone" className={inputClass}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Europe/London">Europe/London</SelectItem></SelectContent></Select></Field>
            <Field id="language" label="Language"><Select value={editing.system.language} onValueChange={language => setEditing(previous => ({ ...previous, system: { ...previous.system, language } }))}><SelectTrigger id="language" className={inputClass}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="en-GB">English (UK)</SelectItem></SelectContent></Select></Field>
            <div className="sm:col-span-2"><Field id="company-logo" label="Logo URL"><Input id="company-logo" type="url" className={inputClass} value={editing.company.logoUrl} onChange={event => companyField("logoUrl", event.target.value)} /></Field></div>
          </div>}
          {active === "welcome" && <div className="space-y-4">{([['emailSubject', 'Email subject'], ['emailBody', 'Welcome email'], ['smsBody', 'Welcome SMS']] as const).map(([key, label]) => <Field key={key} id={key} label={label}>{key === "emailSubject" ? <Input id={key} className={inputClass} value={editing.welcome[key]} onChange={event => setEditing(previous => ({ ...previous, welcome: { ...previous.welcome, [key]: event.target.value } }))} /> : <Textarea id={key} className={textClass} value={editing.welcome[key]} onChange={event => setEditing(previous => ({ ...previous, welcome: { ...previous.welcome, [key]: event.target.value } }))} />}</Field>)}</div>}
          {(active === "cleaning" || active === "absence" || active === "resources") && (() => {
            const key = active === "cleaning" ? "cleaningTypes" : active === "absence" ? "absenceTypes" : "resourceCategories";
            return <Field id={key} label={item?.title ?? "Categories"}><Textarea id={key} className={`${textClass} min-h-48`} value={editing[key]} onChange={event => setEditing(previous => ({ ...previous, [key]: event.target.value }))} /></Field>;
          })()}
          {active === "notifications" && <div className="divide-y divide-border">{([['checkIn', 'Check-in notifications'], ['cancellations', 'Cancellation notifications'], ['inventory', 'Inventory alerts']] as const).map(([key, label]) => <div key={key} className="flex items-center justify-between gap-4 py-4"><Label htmlFor={key}>{label}</Label><Switch id={key} checked={editing.notifications[key]} onCheckedChange={checked => setEditing(previous => ({ ...previous, notifications: { ...previous.notifications, [key]: checked } }))} /></div>)}</div>}
          {active === "policies" && <div className="space-y-4">{([['attendance', 'Attendance policy'], ['cancellation', 'Cancellation policy'], ['healthAndSafety', 'Health and safety policy']] as const).map(([key, label]) => <Field key={key} id={key} label={label}><Textarea id={key} className={textClass} value={editing.policies[key]} onChange={event => setEditing(previous => ({ ...previous, policies: { ...previous.policies, [key]: event.target.value } }))} /></Field>)}</div>}
          {saveError && <p role="alert" className="text-sm text-destructive">{saveError}</p>}
          <DialogFooter className="gap-2"><Button type="button" variant="outline" className="rounded-xl" onClick={() => setActive(null)}>Cancel</Button><Button type="submit" disabled={saving} className="rounded-xl"><Save />{saving ? "Saving…" : "Save changes"}</Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>;
}