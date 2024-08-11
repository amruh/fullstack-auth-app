import { z } from "zod";

export const SignInSchema = z.object({
  email: z.string().trim().email("Please enter a valid email"),
  password: z.string().min(8),
});

const SignUp = z.object({
  name: z
    .string({ message: "Please provide a name" })
    .min(2, "Name must contain at least 2 character(s)"),
  email: z.string().trim().email("Please enter a valid email"),
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

export const SignUpSchema = SignUp.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }
);

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
  }
);

export const UpdateUserSchema = z.object({
  username: z
    .string({ message: "Please provide a username" })
    .min(4, "Username must have at least 4 characters "),
});
