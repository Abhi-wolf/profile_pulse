import { GalleryVerticalEnd } from "lucide-react";
import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-[90vh] flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Profile Pulse.
        </a>
        <LoginForm />
      </div>
    </div>
  );
}
