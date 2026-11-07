import { describe, expect, it } from "vitest";
import { readAllRows } from "@/lib/supabase-pages";
import { checklistSummary } from "@/lib/job-summary";

describe("Owner data visibility", () => {
  it("returns rows beyond Supabase's first 1000 records", async () => {
    const rows = Array.from({ length: 1003 }, (_, id) => ({ id }));
    const result = await readAllRows((start, end) => Promise.resolve({ data: rows.slice(start, end + 1), error: null }));
    expect(result).toHaveLength(1003);
    expect(result[1002]).toEqual({ id: 1002 });
  });
  it("does not turn a query error into an empty list", async () => {
    await expect(readAllRows(() => Promise.resolve({ data: null, error: { message: "Access denied" } }))).rejects.toThrow("Access denied");
  });
  it("ignores malformed checklist values instead of crashing a job", () => {
    expect(checklistSummary([null, "invalid", { label: "Bins", done: true }, { label: "Floors" }])).toEqual({ items: [{ label: "Bins", done: true }], completed: 1, total: 1 });
  });
});