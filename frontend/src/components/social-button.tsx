"use client";

import { Button } from "./ui/button";
import Link from "next/link";
import GoogleIcon from "./google-icon";
import FacebookIcon from "./facebook-icon";

export function GoogleButton() {
  return (
    <Button variant={"outline"} size={"lg"} className="space-x-3">
      <GoogleIcon />
      <Link href="http://localhost:3001/api/signup/google" className="">
        Using Google
      </Link>
    </Button>
  );
}

export function FacebookButton() {
  return (
    <Button variant={"outline"} size={"lg"} className="space-x-3">
      <FacebookIcon />
      <Link href="http://localhost:3001/api/signup/facebook" className="">
        Using Facebook
      </Link>
    </Button>
  );
}
