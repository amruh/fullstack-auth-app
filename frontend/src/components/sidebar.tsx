"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AvatarIcon, DashboardIcon } from "@radix-ui/react-icons";
import Logo from "./logo";
import LogoutButton from "./logout-button";

const ROUTES = [
  {
    name: "Dashboard",
    path: "/app/dashboard",
    Icon: DashboardIcon,
  },
  {
    name: "Profile",
    path: "/app/profile",
    Icon: AvatarIcon,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col gap-y-5 p-4 text-sm">
      <div className="flex justify-center">
        <Logo />
      </div>
      <div className="flex flex-col space-y-2">
        {ROUTES.map(({ Icon, ...route }) => (
          <Link
            href={route.path}
            key={route.name}
            className={cn(
              "flex items-center gap-x-2 border border-transparent px-3 py-2 text-zinc-500 transition hover:rounded-md hover:bg-white/50 hover:text-zinc-800",
              {
                "rounded-md border border-zinc-200 bg-white/70 text-zinc-800 shadow-sm":
                  pathname === route.path,
              },
            )}
          >
            <Icon />
            {route.name}
          </Link>
        ))}
      </div>
      <LogoutButton />
    </aside>
  );
}
