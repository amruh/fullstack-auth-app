"use server";

import { getSessionCookies } from "@/lib/cookies";
import { LoginSchema, SignUpSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const signUp = async (values: unknown) => {
  const validatedFields = SignUpSchema.safeParse(values);

  if (!validatedFields.success) {
    return { status: "failed", message: "Invalid fields" };
  }

  const response = await fetch("http://localhost:3001/api/signup/credentials", {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      ...validatedFields.data,
      username: validatedFields.data.name,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const result = (await response.json()) as {
      status: string;
      message: string;
    };
    return result;
  }

  revalidatePath("/");
  redirect("/signin");
};

export const signIn = async (
  callbackUrl: string,
  _: unknown,
  formData: unknown,
) => {
  if (!(formData instanceof FormData)) {
    return {
      status: "failed",
      message: "Invalid Form Data.",
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
      status: "failed",
      message: "Invalid Fields.",
    };
  }

  const response = await fetch("http://localhost:3001/api/signin/credentials", {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    body: JSON.stringify({
      email: validatedFields.data.email,
      password: validatedFields.data.password,
    }),
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    return {
      status: result.status as string,
      message: result.message as string,
    };
  }

  cookies().set({
    name: "auth_session",
    value: result.accessToken.id,
    httpOnly: true,
    expires: new Date(result.accessToken.expiresAt),
    path: "/",
  });

  revalidatePath("/", "layout");
  redirect("/app/dashboard");
};

export const logOut = async () => {
  const cookie = getSessionCookies();

  const response = await fetch("http://localhost:3001/api/logout", {
    method: "POST",
    headers: {
      Cookie: `${cookie.name}=${cookie.value}`,
    },
  });

  const result = await response.json();

  if (!response.ok) {
    return {
      status: result.status as string,
      message: result.message as string,
    };
  }

  cookies().delete("auth_session");

  revalidatePath("/", "layout");
  redirect("/signin");
};

export const updateProfile = async (username: string, id: string) => {
  const cookie = getSessionCookies();

  try {
    const response = await fetch(`http://localhost:3001/api/user/${id}`, {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json",
        Cookie: `${cookie.name}=${cookie.value}`,
      }),
      body: JSON.stringify({ username }),
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: result.success as boolean,
        message: result.message as string,
      };
    }

    revalidatePath("/", "layout");

    return {
      success: result.success as boolean,
      message: result.message as string,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "something wen't wrong",
    };
  }
};
