import Sidebar from "@/components/sidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = cookies().get("auth_session");
  if (!session) {
    redirect("/signin");
  }

  return (
    <div className="grid h-full bg-zinc-100 md:grid-cols-[200px_auto] md:grid-rows-[100%]">
      <Sidebar />
      <main className="m-2 overflow-x-auto rounded-xl border border-zinc-200 bg-white px-8 py-6">
        {children}
      </main>
    </div>
  );
}
