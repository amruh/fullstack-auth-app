import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NewPasswordForm from "./form";

export default function NewPasswordPage() {
  return (
    <Card className="w-[400px]">
      <CardHeader className="space-y-2 pb-4">
        <CardTitle className="text-2xl font-semibold">
          Reset your password
        </CardTitle>
        <CardDescription className="text-sm">
          Provide a password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <NewPasswordForm />
      </CardContent>
    </Card>
  );
}
