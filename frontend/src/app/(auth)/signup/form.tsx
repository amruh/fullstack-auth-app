"use client";

import { signUp } from "@/actions/user";
import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignUpSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type TSignUpSchema = z.infer<typeof SignUpSchema>;

export default function SignUpForm() {
  const form = useForm<TSignUpSchema>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: TSignUpSchema) {
    toast.loading("Processing...", { id: "sign-up-processing" });

    const result = await signUp(values);

    if (result?.status === "failed") {
      toast.error(result.message);
    } else {
      toast.success("Check your email, we just sent a verification link");
    }

    toast.dismiss("sign-up-processing");
  }
  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem className="mb-2 space-y-0.5">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="John Doe"
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
        <FormField
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="mb-5 space-y-1">
              <FormLabel className="">Confirm Password</FormLabel>
              <FormControl className="col-span-3">
                <PasswordInput
                  {...field}
                  disabled={isSubmitting}
                  placeholder="********"
                />
              </FormControl>
              <FormMessage className="col-span-3" />
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-3 w-full" disabled={isSubmitting}>
          Sign Up
        </Button>
      </form>
    </Form>
  );
}
