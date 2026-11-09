import { z } from "zod";

const contact = {
  name: z.string().trim().min(1, "Name is required").max(200),
  email: z.union([z.string().trim().email("Enter a valid email address"), z.literal("")]).transform(v => v || null),
  phone: z.string().trim().max(100).transform(v => v || null),
};
export const customerSchema = z.object({ ...contact, address: z.string().trim().max(1000).transform(v => v || null) });
export const staffSchema = z.object({ ...contact, weekly_hours: z.number().min(0).max(168).nullable().optional(), role: z.string().trim().max(100).transform(v => v || null), profile_id: z.union([z.string().uuid(), z.literal("")]).default("").transform(v => v || null) }).transform(({ weekly_hours, ...staff }) => weekly_hours === undefined ? staff : { ...staff, weekly_hours });
export const materialSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  quantity: z.number().finite().min(0, "Quantity cannot be negative"),
  unit: z.string().trim().max(100).transform(v => v || null),
});
