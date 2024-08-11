"use server";

import { NewPasswordSchema, ResetLinkSchema } from "@/schemas";

export const sendResetLink = async (values: unknown) => {
  const validatedFields = ResetLinkSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid email address",
    };
  }

  const { email } = validatedFields.data;

  try {
    const response = await fetch(
      "http://localhost:3001/api/user/send-password-reset-link",
      {
        headers: new Headers({ "Content-Type": "application/json" }),
        method: "POST",
        body: JSON.stringify({ email }),
        cache: "no-store",
      },
    );

    const result = await response.json();

    if (!response.ok) {
      return { success: false, message: result.message };
    }

    return {
      success: true,
      message: result.message,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
};

export const resetPassword = async (values: unknown, token: string | null) => {
  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid password",
    };
  }

  const { password, confirmPassword } = validatedFields.data;

  try {
    const response = await fetch(
      "http://localhost:3001/api/user/password-reset",
      {
        headers: new Headers({ "Content-Type": "application/json" }),
        method: "POST",
        body: JSON.stringify({ token, password, confirmPassword }),
        cache: "no-store",
      },
    );

    const result = await response.json();

    if (!response.ok) {
      console.log("sini");
      return { success: false, message: result.message };
    }

    return {
      success: true,
      message: result.message,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
};
