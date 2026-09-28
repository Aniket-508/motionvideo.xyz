import { z } from "zod";

// Shared by the contact form (client-side check) and its server function.
export const contactSchema = z.object({
  email: z.email().max(254),
  message: z.string().trim().min(10).max(5000),
  name: z.string().trim().min(1).max(100),
  // Honeypot: hidden from people, filled in by naive bots.
  website: z.string().max(0).optional(),
});
