import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const getSessionCookies = () => {
  const session = cookies().get("auth_session");
  if (!session) {
    redirect("/signin");
  }

  return session;
};
