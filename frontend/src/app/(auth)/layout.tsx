import { FacebookButton, GoogleButton } from "@/components/social-button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { cookies, headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = cookies().get("auth_session");
  if (session) {
    redirect("/dashboard");
  }

  const headersList = headers();
  const fullUrl = headersList.get("referer") || "";

  return (
    <div className="relative flex h-screen flex-col items-center justify-center gap-y-2">
      {/* Back to homepage button */}
      {fullUrl.includes("/signin") || fullUrl.includes("/signup")}
      <Link href="/" className="group flex items-center gap-x-2 text-sm">
        <ArrowLeftIcon className="size-4 transition-transform group-hover:-translate-x-1" />{" "}
        Homepage
      </Link>

      {children}

      {/* Only show when url are signin or signup */}
      {fullUrl.includes("/signin") ||
        (fullUrl.includes("/signup") && (
          <>
            {/* Separator */}
            <div
              className="mx-auto my-2 h-px w-[450px]"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, rgba(149, 131, 198, 0) 1.46%, rgba(149, 131, 198, 0.6) 40.83%, rgba(149, 131, 198, 0.3) 65.57%, rgba(149, 131, 198, 0) 107.92%)",
              }}
            ></div>

            {/* Social Buttons */}
            <div className="flex gap-x-3">
              <GoogleButton />
              <FacebookButton />
            </div>
          </>
        ))}
    </div>
  );
}
