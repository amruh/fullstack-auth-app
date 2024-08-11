"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { emailVerification } from "@/actions/email-verification";
import Link from "next/link";

export default function EmailVerificationForm() {
  const [error, setError] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(async () => {
    if (success || error) return;

    if (!token) {
      toast.error("Missing token");
      setError(true);
      return;
    }

    emailVerification(token)
      .then((data) => {
        if (!data.success) {
          setError(true);
        } else {
          setSuccess(true);
        }
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        toast.success("Email verified");
      });
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <Card className="w-[400px]">
      <CardHeader className="space-y-2 pb-4">
        <CardTitle className="text-2xl font-semibold">
          Verifying email address
        </CardTitle>
        {!success && !error && (
          <CardDescription className="text-sm">
            Please wait a moment
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex w-full items-center justify-center">
          {!success && !error ? (
            <div
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status"
            >
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
          ) : (
            <div>
              {!token ? (
                <p className="text-sm">Missing Token!</p>
              ) : (
                <p className="text-sm">
                  You can{" "}
                  <span className="font-semibold">
                    <Link href="/signin">Sign In</Link>
                  </span>{" "}
                  now
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
