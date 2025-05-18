"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// Debounce utility
function useDebouncedValue(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export default function Filters() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [username, setUsername] = useState(searchParams.get("username") || "");
  const [type, setType] = useState(searchParams.get("type") || "all");

  const debouncedUsername = useDebouncedValue(username, 500);

  const handleFilterChange = (key, value) => {
    const params = new URLSearchParams(searchParams);

    if (value) params.set(key, value);
    else params.delete(key);

    router.push(`/history?${params.toString()}`);
  };

  useEffect(() => {
    handleFilterChange("username", debouncedUsername);
  }, [debouncedUsername]);

  useEffect(() => {
    handleFilterChange("type", "all");
  }, []);

  return (
    <div className="flex gap-4 mb-4">
      <Input
        placeholder="Search username..."
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Select
        value={type}
        onValueChange={(val) => {
          setType(val);
          handleFilterChange("type", val);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="resume_roast">Resume</SelectItem>
          <SelectItem value="github_roast">GitHub</SelectItem>
          <SelectItem value="leetcode_roast">Leetcode</SelectItem>
          <SelectItem value="resume_analysis">Resume Analysis</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
