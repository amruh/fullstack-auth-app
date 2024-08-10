"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewPasswordSchema } from "@/schemas";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { redirect, useSearchParams } from "next/navigation";
import { PasswordInput } from "@/components/password-input";
import { resetPassword } from "@/actions/password-reset";
import { toast } from "sonner";
import { useState } from "react";

export default function NewPasswordForm() {
  const [success, setSuccess] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof NewPasswordSchema>) => {
    toast.loading("Processing...", {
      id: "password-reset-processing",
    });

    const result = await resetPassword(values, token);

    if (!result.success) {
      toast.error(result.message);
    } else {
      toast.success(`${result.message}. You can sign in now`);
      setSuccess(true);
    }

    toast.dismiss("password-reset-processing");
  };

  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
  } = form;

  if (success) {
    return redirect("/signin");
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
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
        <FormField
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="mb-2 space-y-0.5">
              <FormLabel>Confirm Password</FormLabel>
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
        <Button type="submit" disabled={isSubmitting} className="mt-3 w-full">
          Reset password
        </Button>
      </form>
    </Form>
  );
}
