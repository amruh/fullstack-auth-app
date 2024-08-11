import { Button } from "@/components/ui/button";
import { getSessionCookies } from "@/lib/cookies";
import Link from "next/link";

export default function Home() {
  const session = getSessionCookies();
  return (
    <main className="flex h-screen items-center justify-center">
      <div className="flex w-44 flex-col gap-y-2">
        {session ? (
          <Button>
            <Link href="/app/dashboard" className="w-full">
              Dashboard
            </Link>
          </Button>
        ) : (
          <>
            <Button>
              <Link href="/signin" className="w-full">
                Sign In
              </Link>
            </Button>
            <Button>
              {" "}
              <Link href="/signup" className="w-full">
                Sign Up
              </Link>
            </Button>
          </>
        )}
      </div>
    </main>
  );
}
