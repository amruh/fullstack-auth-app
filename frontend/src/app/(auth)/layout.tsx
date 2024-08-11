import SocialAuth from "@/components/social-auth";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { cookies } from "next/headers";
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

  return (
    <div className="relative flex h-screen flex-col items-center justify-center gap-y-2">
      {/* Back to homepage button */}
      <Link href="/" className="group flex items-center gap-x-2 text-sm">
        <ArrowLeftIcon className="size-4 transition-transform group-hover:-translate-x-1" />{" "}
        Homepage
      </Link>

      {children}

      <SocialAuth />
    </div>
  );
}
