"use client";

import { logOut } from "@/actions/user";
import { Button } from "./ui/button";

export default function LogoutButton() {
  return (
    <Button
      onClick={async () => {
        await logOut();
      }}
    >
      Logout
    </Button>
  );
}
