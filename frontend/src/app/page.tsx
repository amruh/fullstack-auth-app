import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";
import Link from "next/link";

export default function Home() {
  const session = cookies().get("auth_session");
  return (
    <main className="flex h-screen flex-col items-center justify-center gap-y-10">
      <h1 className="font-bold text-4xl">Full Stack Authentication Flow</h1>
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
