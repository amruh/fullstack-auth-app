import { z } from "zod";

export const SignUpSchema = z.object({
  name: z.string().min(2, { message: "Name must be 2 characters minimum" }),
  email: z.string().trim().email("Please enter a valid email"),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
  confirmPassword: z.string().min(8, {
    message: "Password provide password confirmation",
  }),
});

export const LoginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email"),
  password: z.string().trim().min(8, {
    message: "Password must be at least 8 characters long",
  }),
});
