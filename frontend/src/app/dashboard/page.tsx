import LogoutButton from "@/components/logout-button";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  const session = cookies().get("auth_session");
  if (!session) {
    redirect("/signin");
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <LogoutButton />
    </div>
  );
}
