"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useAuth } from "@/provider/user-provider";
import { logout } from "@/actions/authActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useData } from "@/provider/dataProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, GalleryVerticalEnd } from "lucide-react";

export function Header() {
  const { user, removeUser } = useAuth();
  const { clearData } = useData();
  const router = useRouter();

  const handleLogout = async () => {
    const response = await logout();

    if (response.success) {
      removeUser();
      clearData();

      toast.success(response.message);
      router.push("/login");
    } else {
      toast.error(response.message);
    }
  };

  return (
    <header className="fixed top-0 z-50 w-full bg-background border-b">
      <div className="container mx-auto py-3">
        <div className="flex items-center justify-between px-2 md:px-4">
          <Link href="/" className="text-2xl font-bold flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Profile Pulse.
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/analyze_resume"
              className="font-medium hover:text-primary transition-colors"
            >
              Resume Analysis
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-1 font-medium"
                >
                  Roast <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/roast">Resume Roast</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/roast">GitHub Roast</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/roast">LeetCode Roast</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          <div className="flex items-center space-x-2">
            <ThemeToggle />
            {user?.id ? (
              <Button variant="destructive" onClick={handleLogout}>
                Sign Out
              </Button>
            ) : (
              <Link href="/login">
                <Button>Login</Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="md:hidden flex justify-center py-2 border-t">
          <nav className="flex items-center space-x-1">
            <Link
              href="/analyze_resume"
              className="font-medium hover:text-primary transition-colors"
            >
              Resume Analysis
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-1 font-medium"
                >
                  Roast <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/roast">Resume Roast</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/roast">GitHub Roast</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/roast">LeetCode Roast</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
}
