import {
  LayoutDashboard,
  CalendarDays,
  CreditCard,
  ClipboardCheck,
  Users,
  Briefcase,
  FileText,
  Globe,
  ShieldCheck,
  FileChartColumnIncreasing,
  KeyRound,
  Package,
  Building2,
  MessageSquare,
  Clock3,
  History,
  Settings,
  ListChecks,
  type LucideIcon,
} from "lucide-react";

export type AdminNavItem = {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
};

export type AdminNavGroup = { group: string; items: AdminNavItem[] };

// Shared navigation for the admin workspace.
export const adminNav: AdminNavGroup[] = [
  {
    group: "Operations",
    items: [
      { id: "overview", label: "Overview", icon: LayoutDashboard },
      { id: "jobs", label: "Jobs", icon: ListChecks },
      { id: "scheduling", label: "Scheduling", icon: CalendarDays },
      { id: "checkin", label: "Check-in", icon: ClipboardCheck },
    ],
  },
  {
    group: "CRM",
    items: [
      { id: "customers", label: "Customers", icon: Users },
      { id: "employees", label: "Staff", icon: Briefcase },
      { id: "plans", label: "Cleaning Plans", icon: FileText },
      { id: "client-portal", label: "Client Portal", icon: Globe, badge: "GROWTH" },
      { id: "safety", label: "Safety & Compliance", icon: ShieldCheck },
    ],
  },
  {
    group: "Finance",
    items: [{ id: "invoices", label: "Invoicing", icon: FileText }, { id: "wages", label: "Wages & Hours", icon: Clock3 }, { id: "payments", label: "Payments", icon: CreditCard }],
  },
  {
    group: "Quality",
    items: [{ id: "reports", label: "Reports", icon: FileChartColumnIncreasing }],
  },
  {
    group: "Ops",
    items: [
      { id: "keys", label: "Keys", icon: KeyRound },
      { id: "storage", label: "Materials & Replenishment", icon: Package },
      { id: "structure", label: "Company Structure", icon: Building2 },
    ],
  },
  {
    group: "System",
    items: [
      { id: "messages", label: "Send Message", icon: MessageSquare },
      { id: "workhours", label: "Work Hours", icon: Clock3 },
      { id: "eventlog", label: "Event Log", icon: History },
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
];

export const findAdminNavItem = (id: string) =>
  adminNav.flatMap((g) => g.items).find((i) => i.id === id);
