import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

type LegalTab = "terms" | "privacy" | "cookies";
type Consent = "all" | "essential";
const consentKey = "cleanma-cookie-consent-v1";
const LegalContext = createContext<(tab: LegalTab) => void>(() => {});
export const useLegalDocuments = () => useContext(LegalContext);
const documents = {
  terms: [
    ["Terms of Service", "Last Updated: November 10, 2026", 'Welcome to Cleanma UK ("Cleanma", "we", "us", or "our"). Cleanma provides a cloud-based cleaning business management software platform accessible via web and mobile applications (the "Service").', 'By registering for or using the Service, you ("Customer", "User") agree to be bound by these Terms of Service.'],
    ["1.1 Accounts and Subscription", "Eligibility: You must be a registered business entity or sole trader in the UK or relevant jurisdiction to open a commercial account.", "Account Responsibility: You are responsible for maintaining the security of your account credentials and for all activities that occur under your organization's workspace.", "Subscription & Upgrades: Service levels (Starter, Growth, Scale) are billed on a monthly or annual recurring basis. Upgrades take effect immediately, while downgrades take effect at the start of the next billing cycle."],
    ["1.2 Acceptable Use", "You agree not to reverse engineer, decompile, or extract the source code of the Service; use the Service for any illegal, fraudulent, or unauthorized purpose; or store sensitive financial credentials outside designated secure integration fields (e.g., Stripe/Xero)."],
    ["1.3 Data Ownership & Availability", "Customer Data: You retain full ownership of all data uploaded to Cleanma (employee records, customer details, job schedules).", "Service Availability (SLA): Cleanma strives to maintain 99.9% uptime, excluding scheduled maintenance windows announced in advance."],
    ["1.4 Termination & Cancellation", "You may cancel your subscription at any time via your account billing settings. Upon cancellation, your access will remain active until the end of the current billing cycle. Data export tools are available up to 30 days post-cancellation."],
  ],
  privacy: [
    ["Privacy Policy", "Last Updated: November 10, 2026", "Cleanma UK is committed to protecting the privacy of our customers and their workers. This Privacy Policy explains how personal data is collected, used, and safeguarded in accordance with the UK GDPR and the Data Protection Act 2018."],
    ["2.1 Information We Collect", "Account Information: Name, business email address, company address, phone number, and billing details.", "Operational Data: Worker rosters, check-in timestamps, GPS location data (only when clocking in/out if enabled), absence records, and hourly rate parameters.", "Technical Data: IP address, browser type, device information, and session logs."],
    ["2.2 How We Use Your Information", "To provide, maintain, and improve the Cleanma platform features.", "To process subscription payments and calculate payroll integration specs.", "To send system notifications, security alerts, and customer support communications."],
    ["2.3 Data Sharing & Processors", "We do not sell personal data. Data is shared strictly with sub-processors required to deliver the Service:", "Supabase: Database hosting and authentication infrastructure.", "Stripe: Payment processing and billing operations.", "Xero / Accounting Platforms: Optional third-party integrations initiated by the user."],
    ["2.4 Your Rights under UK GDPR", "Under UK data protection laws, individuals have rights including access to personal data stored in your workspace, rectification of inaccurate information, and erasure (the Right to be Forgotten) subject to legal retention obligations.", "For data privacy inquiries, contact: support.cleanmaap.com"],
  ],
  cookies: [
    ["Cookie Policy", "Cleanma uses essential and analytical cookies to ensure the proper functionality of our web application and to improve user experience."],
    ["Essential Cookies", "Required for session authentication, security (CSRF protection), and workspace preferences."],
    ["Analytical Cookies", "Anonymous usage statistics to optimize page load speeds and feature navigation. Optional analytics are not currently enabled by this application. Choosing Accept All records your preference; it does not install tracking tools."],
    ["Your preferences", "You can change your choice below. Essential storage remains available for authentication and workspace settings. Your cookie preference is saved in this browser."],
  ],
};
export function LegalProvider({ children }: { children: ReactNode }) {
  const [tab, setTab] = useState<LegalTab>("terms");
  const [open, setOpen] = useState(false);
  const [consent, setConsent] = useState<Consent | null>(null);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const pathname = useRouterState({ select: state => state.location.pathname });
  useEffect(() => {
    function read() {
      try { const value = localStorage.getItem(consentKey); setConsent(value === "all" || value === "essential" ? value : null); } catch { /* Storage may be disabled. */ }
      setReady(true);
    }
    read();
    window.addEventListener("storage", read);
    return () => window.removeEventListener("storage", read);
  }, []);
  function choose(value: Consent) {
    setConsent(value);
    try { localStorage.setItem(consentKey, value); setStorageError(false); } catch { setStorageError(true); }
  }
  function show(value: LegalTab) { setTab(value); setOpen(true); }
  const actions = <div className="flex flex-wrap gap-2">
    <Button type="button" onClick={() => choose("all")}>Accept All</Button>
    <Button type="button" variant="outline" onClick={() => choose("essential")}>Essential Only</Button>
  </div>;
  return <LegalContext.Provider value={show}>
    {children}
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[85dvh] overflow-y-auto rounded-2xl sm:max-w-2xl">
        <DialogHeader><DialogTitle>Legal & Compliance</DialogTitle><DialogDescription>Cleanma UK · Terms, privacy and cookie preferences</DialogDescription></DialogHeader>
        <Tabs value={tab} onValueChange={value => setTab(value as LegalTab)}>
          <TabsList className="grid w-full grid-cols-3"><TabsTrigger value="terms">Terms</TabsTrigger><TabsTrigger value="privacy">Privacy</TabsTrigger><TabsTrigger value="cookies">Cookies</TabsTrigger></TabsList>
          {(Object.keys(documents) as LegalTab[]).map(key => <TabsContent key={key} value={key} className="space-y-5 py-4">
            {documents[key].map(([heading, ...paragraphs]) => <section key={heading} className="space-y-2"><h2 className="font-semibold">{heading}</h2>{paragraphs.map(text => <p key={text} className="text-sm leading-relaxed text-muted-foreground">{text}</p>)}</section>)}
            {key === "cookies" && <div className="space-y-3">{actions}<p role="status" className="text-sm text-muted-foreground">{consent ? `Current choice: ${consent === "all" ? "Accept All" : "Essential Only"}` : "No preference saved yet."}</p>{storageError && <p role="alert" className="text-sm text-destructive">Your browser could not save this preference. It applies for this visit only.</p>}</div>}
          </TabsContent>)}
        </Tabs>
      </DialogContent>
    </Dialog>
    {ready && !consent && (pathname === "/" || pathname === "/auth") && !open && <aside aria-label="Cookie preferences" className="fixed bottom-4 right-4 z-40 w-[calc(100%-2rem)] max-w-sm space-y-4 rounded-2xl border border-border bg-card p-5 shadow-xl">
      <p className="text-sm leading-relaxed text-muted-foreground">We use essential cookies for authentication and workspace settings. Learn more in our <button type="button" className="text-primary underline underline-offset-4" onClick={() => show("privacy")}>Privacy Policy</button>.</p>
      {actions}
    </aside>}
  </LegalContext.Provider>;
}
export function AuthLegalFooter() {
  const show = useLegalDocuments();
  return <p className="text-center text-xs leading-relaxed text-muted-foreground">By signing in, you agree to Cleanma's <button type="button" className="text-primary underline underline-offset-4" onClick={() => show("terms")}>Terms of Service</button> and <button type="button" className="text-primary underline underline-offset-4" onClick={() => show("privacy")}>Privacy Policy</button>.</p>;
}
export function LegalSettingsCard() {
  const show = useLegalDocuments();
  return <section className="space-y-3 rounded-xl border border-border bg-card p-5"><h2 className="text-sm font-semibold">Legal & Compliance</h2><p className="text-sm text-muted-foreground">View Terms of Service, UK GDPR Privacy Policy, and Cookie Settings.</p><Button type="button" onClick={() => show("terms")}>View Documents →</Button></section>;
}
