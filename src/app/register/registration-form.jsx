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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/provider/user-provider";
import { registerationFormValidation } from "@/lib/validations";
import { register } from "@/actions/authActions";
import { toast } from "sonner";

export function RegisterForm({ className, ...props }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const { setUser } = useAuth();
  const router = useRouter();

  async function handleRegisteration(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const data = { email, password, firstName, lastName };

    const validResult = registerationFormValidation.safeParse(data);

    if (!validResult.success) {
      setErrors(validResult.error.flatten().fieldErrors);
      return;
    }
    setLoading(true);
    setErrors(null);
    const response = await register(data);

    if (response?.error || !response?.success) {
      toast.error(`${response.error || "Sigup failed"}`);
    } else {
      setUser(response.user);
      toast.success("Sigup Successful");
      router.push("/dashboard");
    }
    setLoading(false);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome To Scan Score</CardTitle>
          <CardDescription>
            Register with your Name, Email and Password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegisteration}>
            <div className="grid gap-2">
              <div className="grid gap-6">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center w-full gap-2">
                    <div className="w-full flex flex-col gap-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="Kumar"
                        required
                      />
                    </div>

                    <div className="w-full flex flex-col gap-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Kumar"
                        required
                      />
                    </div>
                  </div>

                  {errors?.firstName ? (
                    <span className="text-xs text-red-500 p-1">
                      {errors.firstName[0]}
                    </span>
                  ) : (
                    errors?.lastName && (
                      <span className="text-xs text-red-500 p-1">
                        {errors.lastName[0]}
                      </span>
                    )
                  )}
                </div>

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
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Registering..." : "Register"}
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/login" className="underline underline-offset-4">
                  Login
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
