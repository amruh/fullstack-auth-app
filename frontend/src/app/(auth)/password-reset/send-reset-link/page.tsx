import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SendResetLinkForm from "./form";

export default function SendResetLinkPage() {
  return (
    <Card className="w-[400px]">
      <CardHeader className="space-y-2 pb-4">
        <CardTitle className="text-2xl font-semibold">
          Forgot your password?
        </CardTitle>
        <CardDescription className="text-sm">
          Provide an email address to recieve a password reset link
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SendResetLinkForm />
      </CardContent>
    </Card>
  );
}
