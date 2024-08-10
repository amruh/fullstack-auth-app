import LogoutButton from "@/components/logout-button";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = cookies().get("auth_session");
  if (!session) {
    redirect("/signin");
  }

  const response = await fetch("http://localhost:3001/api/user-info", {
    headers: {
      Cookie: `${session.name}=${session.value}`,
    },
  });

  const userData = await response.json();

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col">
        <h1>Hi {userData.data.username}</h1>
        <LogoutButton />

      </div>
    </div>
  );
}
