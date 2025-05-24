"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { login } from "@/actions/authActions";
import { use, useState } from "react";
import { toast } from "sonner";
import { loginFormValidation } from "@/lib/validations";
import { useAuth } from "@/provider/user-provider";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

export default function LoginForm({ className, ...props }) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const { setUser, refreshUser } = useAuth();
  const router = useRouter();

  async function handleLogin(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");

    const data = { email, password };

    const validResult = loginFormValidation.safeParse(data);

    if (!validResult.success) {
      setErrors(validResult.error.flatten().fieldErrors);
      return;
    }

    setIsLoading(true);
    setErrors(null);
    const response = await login(data);

    if (response?.error || !response?.success) {
      toast.error(`${response.error || "Login failed"}`);
    } else {
      // setUser(response.user);
      refreshUser();
      toast.success("Login Successful");
      router.push("/dashboard");
    }

    setIsLoading(false);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your Email and Password</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="flex flex-col gap-2">
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex flex-col">
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="m@example.com"
                    required
                  />
                  {errors?.email && (
                    <span className="text-xs text-red-500 p-1">
                      {errors.email[0]}
                    </span>
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <div className="flex flex-col">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                  />

                  {errors?.password && (
                    <span className="text-xs text-red-500 p-1">
                      {errors.password[0]}
                    </span>
                  )}
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader className="h-4 w-4 animate-spin" />}
                <span className="">
                  {isLoading ? "Logging in..." : "Login"}
                </span>
              </Button>
            </div>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="underline underline-offset-4">
                Register
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-center text-xs text-muted-foreground">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline hover:text-primary">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline hover:text-primary">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}
