"use client";

import { logOut } from "@/actions/user";
import { Button } from "./ui/button";
import { ExitIcon } from "@radix-ui/react-icons";
import { sleep } from "@/lib/utils";
import { useState } from "react";

export default function LogoutButton() {
  const [ispending, setIsPending] = useState(false);
  return (
    <Button
      className="mt-auto space-x-2 shadow-xl"
      onClick={async () => {
        setIsPending(true);
        await sleep(1000);
        await logOut();
        setIsPending(false);
      }}
      disabled={ispending}
    >
      <span>Logout</span> <ExitIcon className="size-4" />
    </Button>
  );
}
