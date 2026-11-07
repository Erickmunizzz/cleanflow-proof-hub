import type { Json } from "@/integrations/supabase/types";

export function checklistSummary(value: Json) {
  const items = Array.isArray(value) ? value.filter((item): item is { label: string; done: boolean } => typeof item === "object" && item !== null && !Array.isArray(item) && typeof item['label'] === "string" && typeof item['done'] === "boolean") : [];
  return { items, completed: items.filter(item => item.done).length, total: items.length };
}
export function recordedHours(start: string | null, end: string | null) {
  if (!start || !end) return null;
  const duration = new Date(end).getTime() - new Date(start).getTime();
  return Number.isFinite(duration) && duration >= 0 ? duration / 3600000 : null;
}
export function csvCell(value: unknown) { return `"${String(value ?? "").replace(/^[=+@\-]/, "'$&").replaceAll('"', '""')}"`; }