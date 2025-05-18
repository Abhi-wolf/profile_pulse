import { z } from "zod";

export const loginFormValidation = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .trim(),
});

export const registerationFormValidation = z.object({
  email: z.string().email({ message: "Invalid email address" }).trim(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .trim(),
  firstName: z
    .string()
    .min(2, { message: "First name must be at least 2 characters" })
    .trim(),
  lastName: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters" })
    .trim(),
});
