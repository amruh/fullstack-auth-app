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
      <Link href="/">Back to Home Page</Link>
      {children}
    </div>
  );
}
