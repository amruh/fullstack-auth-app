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

export const ResetLinkSchema = z.object({
  email: z
    .string({ message: "Please provide an email address" })
    .trim()
    .email("Please enter a valid email"),
});

const NewPassword = z.object({
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long",
    })
    .regex(/(?=.*[a-z])/, "Password must have one lowercase character")
    .regex(/(?=.*[A-Z])/, "Password must have one uppercase character")
    .regex(/(?=.*[@$!%*?&])/, "Password must contain special character"),
  confirmPassword: z.string({ message: "Please provide a password" }),
});

export const NewPasswordSchema = NewPassword.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  },
);
