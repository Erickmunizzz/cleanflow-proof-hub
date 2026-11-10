import { describe, expect, it } from "vitest";
import { customerSchema, staffSchema, materialSchema } from "@/lib/admin-records.schema";
import { checklistSummary, recordedHours } from "@/lib/job-summary";

describe("Directory records", () => {
  it("accepts a customer with an email", () => {
    expect(customerSchema.parse({ name: "Oak Office", email: "office@example.invalid", phone: "", address: "" })).toEqual({ name: "Oak Office", email: "office@example.invalid", phone: null, address: null });
  });
  it("accepts a staff member with the Cleaner role", () => {
    expect(staffSchema.parse({ name: "Alex Morgan", role: "Cleaner", email: "", phone: "" }).role).toBe("Cleaner");
  });
  it("preserves a numeric material quantity and unit", () => {
    expect(materialSchema.parse({ name: "Floor cleaner", quantity: 2.5, unit: "litres" })).toEqual({ name: "Floor cleaner", quantity: 2.5, unit: "litres" });
  });
  it("requires a customer name", () => {
    expect(customerSchema.safeParse({ name: " ", email: "", phone: "", address: "" }).success).toBe(false);
  });
  it("counts actual checklist completion", () => {
    expect(checklistSummary([{ label: "Floors", done: true }, { label: "Bins", done: false }, null]).completed).toBe(1);
  });
  it("calculates elapsed attendance time", () => {
    expect(recordedHours("2026-11-06T09:00:00Z", "2026-11-06T11:30:00Z")).toBe(2.5);
  });
  it("does not invent hours for missing check-outs", () => { expect(recordedHours("2026-11-06T09:00:00Z", null)).toBeNull(); });
});