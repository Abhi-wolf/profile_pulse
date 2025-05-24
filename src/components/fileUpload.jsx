"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader } from "lucide-react";
import { useState } from "react";

export function FileUpload({ setFile, file, isLoading, handlePdfUpload }) {
  const [error, setError] = useState(null);

  const handleFile = (e) => {

    const size = e.target.files?.[0].size;

    //   check if file size is greater than 5 MB
    if (size / 1048576 >= 5) {
      setError("File size is greater than 5 MB");
      return;
    }

    if (e.target.files?.[0]) {
      setError("");
      setFile(e.target.files?.[0]);
    }
  };

  return (
    <div className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>Upload Resume</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="resume"
                className="block text-sm font-medium text-gray-700"
              >
                Upload Resume (PDF only)
              </label>
              <div>
                <Input
                  id="resume"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleFile(e)}
                  className="mt-1"
                  disabled={isLoading}
                />

                {error && (
                  <span className="ml-2 md:ml-4 text-xs text-red-500">
                    {error}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
