import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex h-screen flex-col items-center justify-center gap-y-2">
      <Link href="/">Back to Home Page</Link>
      {children}
    </div>
  );
}
