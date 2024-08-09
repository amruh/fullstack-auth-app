"use server";

import { LoginSchema, SignUpSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const signUp = async (values: unknown) => {
  const validatedFields = SignUpSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields" };
  }

  revalidatePath("/");
  redirect("/login");
};

export const logIn = async (
  callbackUrl: string,
  _: unknown,
  formData: unknown,
) => {
  if (!(formData instanceof FormData)) {
    return {
      error: "Invalid form data.",
    };
  }

  const email = formData.get("email");
  const password = formData.get("password");

  const validatedFields = LoginSchema.safeParse({
    email: email,
    password: password,
  });

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
    };
  }

  console.log(validatedFields.data);

  await fetch("http://localhost:3001/login", {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify(validatedFields.data),
    cache: "no-store",
  });
};
