"use client";

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
import { ResetLinkSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { sendResetLink } from "@/actions/password-reset";

export default function SendResetLinkForm() {
  const form = useForm<z.infer<typeof ResetLinkSchema>>({
    resolver: zodResolver(ResetLinkSchema),
    defaultValues: {
      email: "",
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: z.infer<typeof ResetLinkSchema>) => {
    toast.loading("Processing...", {
      id: "send-password-reset-link-processing",
    });

    const result = await sendResetLink(values);

    if (!result.success) {
      toast.error(result.message);
    } else {
      toast.success(result.message);
    }

    toast.dismiss("send-password-reset-link-processing");
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    {...field}
                    type="email"
                    placeholder="email@example.com"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          Send reset password link
        </Button>
      </form>
    </Form>
  );
}
