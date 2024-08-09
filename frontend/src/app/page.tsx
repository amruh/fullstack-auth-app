import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex h-screen items-center justify-center">
      <div className="flex w-44 flex-col gap-y-2">
        <Button>
          <Link href="http://localhost:3001/api/auth/signin" className="w-full">
            Sign In
          </Link>
        </Button>
        <Button>
          {" "}
          <Link href="/signup" className="w-full">
            Sign Up
          </Link>
        </Button>
      </div>
    </main>
  );
}
