import { z } from "zod";

const contact = {
  name: z.string().trim().min(1, "Name is required").max(200),
  email: z.union([z.string().trim().email("Enter a valid email address"), z.literal("")]).transform(v => v || null),
  phone: z.string().trim().max(100).transform(v => v || null),
};
export const customerSchema = z.object({ ...contact, address: z.string().trim().max(1000).transform(v => v || null) });
export const staffSchema = z.object({ ...contact, role: z.string().trim().max(100).transform(v => v || null) });
export const materialSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  quantity: z.number().finite().min(0, "Quantity cannot be negative"),
  unit: z.string().trim().max(100).transform(v => v || null),
});