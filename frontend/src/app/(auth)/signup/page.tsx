import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SignUpForm from "./form";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <Card className="w-[400px]">
      <CardHeader className="space-y-2 pb-4">
        <CardTitle className="text-center text-2xl font-semibold">
          🔐 Sign Up
        </CardTitle>
        <CardDescription className="text-center">Welcome!</CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm />
      </CardContent>
      <CardFooter>
        <p className="mx-auto text-xs">
          Already have an account?{" "}
          <span className="font-medium hover:underline">
            {" "}
            <Link href="/signin">Sign In</Link>
          </span>{" "}
          instead.
        </p>
      </CardFooter>
    </Card>
  );
}
