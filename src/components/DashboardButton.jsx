"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

export default function DashboardButton({ href, text, icon, size = "sm" }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
  };

  return (
    <Link href={href} onClick={handleClick}>
      <Button
        size={size}
        disabled={isLoading}
        className={`ml-2 relative ${isLoading ? "cursor-wait" : ""}`}
      >
        {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : icon}
        <span className="">{isLoading ? "Loading..." : text}</span>
      </Button>
    </Link>
  );
}
