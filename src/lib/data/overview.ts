// Demo data copied from the CleanFlow UK prototype. Replace with real data later.
export type Tone = "success" | "warning" | "danger";

export const statusCards: { title: string; tone: Tone; rows: [string, string][] }[] = [
  { title: "Cancellations", tone: "success", rows: [["In total:", "0"], ["Next 7 days:", "0"], ["Later:", "0"]] },
  { title: "Compensation hours", tone: "success", rows: [["Average workhours differ:", "0"], ["Max exceeded:", "0"]] },
  { title: "Active work settings", tone: "success", rows: [["In total:", "12"], ["Next 7 days:", "12"]] },
  { title: "Key Returns", tone: "success", rows: [["In total:", "2"], ["Today:", "0"], ["Past:", "2"]] },
  { title: "Inventory", tone: "warning", rows: [["Below comfort minimum:", "2"], ["Below minimum:", "1"]] },
  { title: "Product Requests", tone: "danger", rows: [["In total:", "3"], ["To be sent:", "2"], ["Global:", "1"]] },
];

export const snapshot = { customers: 5, workplaces: 8, employees: 4, supervisors: 1 };

export const staffPins = [
  { name: "Aisha", left: "18%", top: "22%", tone: "primary", live: true },
  { name: "Sofia", left: "56%", top: "30%", tone: "muted", live: false },
  { name: "Marcus", left: "44%", top: "52%", tone: "success", live: true },
  { name: "James", left: "68%", top: "64%", tone: "warning", live: false },
] as const;

export const recentCheckins = [
  { name: "Aisha Khan", loc: "Pret - Camden High St", time: "08:02", gps: "GPS OK ±15m", avatar: "AK", weak: false },
  { name: "Marcus Doyle", loc: "WeWork - Shoreditch", time: "08:07", gps: "GPS OK ±3m", avatar: "MD", weak: false },
  { name: "Sofia Ribeiro", loc: "Nando's - King's Cross", time: "08:14", gps: "GPS OK ±8m", avatar: "SR", weak: false },
  { name: "James Patel", loc: "PureGym - Islington", time: "08:21", gps: "GPS OK ±6m", avatar: "JP", weak: false },
  { name: "Elena Popova", loc: "Itsu - Liverpool St", time: "08:29", gps: "GPS Weak ±5m", avatar: "EP", weak: true },
];

export const attentionJobs: { site: string; issue: string; time: string; priority: "High" | "Medium" | "Low" }[] = [
  { site: "Itsu - Liverpool St", issue: "No check-out after 2h", time: "09:42", priority: "High" },
  { site: "WeWork - Moorgate", issue: "Key return overdue", time: "10:15", priority: "Medium" },
  { site: "Pret - Camden", issue: "Client note: missed bin area", time: "11:03", priority: "Low" },
];

export const completedJobsWeek = { total: 42, change: "+12.4%" };
