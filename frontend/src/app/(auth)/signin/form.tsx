"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import LoginFormButton from "./form-button";
import { PasswordInput } from "@/components/password-input";
import { useSearchParams } from "next/navigation";
import { signIn } from "@/actions/user";
import Link from "next/link";

type TLoginSchema = z.infer<typeof LoginSchema>;

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "";
  const [logInError, dispatchLogIn] = useFormState(
    signIn.bind(null, callbackUrl),
    undefined,
  );

  useEffect(() => {
    if (logInError?.status === "failed") {
      toast.error(logInError.message);
    }
  }, [logInError]);

  const form = useForm<TLoginSchema>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const {
    control,
    formState: { isSubmitting },
  } = form;

  return (
    <Form {...form}>
      <form action={dispatchLogIn}>
        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem className="mb-2 space-y-0.5">
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="johndoe12@email.com"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="password"
          render={({ field }) => (
            <FormItem className="mb-2 space-y-0.5">
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  {...field}
                  placeholder="********"
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-3 flex justify-end">
          <Link
            className="text-right text-xs hover:underline"
            href="/password-reset/send-reset-link"
          >
            Forgot password?
          </Link>
        </div>
        <LoginFormButton />
      </form>
    </Form>
  );
}
