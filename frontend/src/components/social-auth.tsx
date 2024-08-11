"use client";

import { usePathname } from "next/navigation";
import { FacebookButton, GoogleButton } from "./social-button";

export default function SocialAuth() {
  const pathname = usePathname();

  if (pathname !== "/signin" && pathname !== "/signup") {
    return <div></div>;
  }

  return (
    <>
      {/* Separator */}
      <div
        className="mx-auto my-2 h-px w-[450px]"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(149, 131, 198, 0) 1.46%, rgba(149, 131, 198, 0.6) 40.83%, rgba(149, 131, 198, 0.3) 65.57%, rgba(149, 131, 198, 0) 107.92%)",
        }}
      ></div>

      {/* Social Buttons */}
      <div className="flex gap-x-3">
        <GoogleButton />
        <FacebookButton />
      </div>
    </>
  );
}
