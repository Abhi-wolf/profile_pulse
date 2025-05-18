"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { githubData } from "@/lib/leetcode_data";
import { roastGitHub } from "@/lib/llmResponse";
import { addResponseToDB } from "@/actions/resumeActions";

export function GitHubRoast({ onRoastGenerated }) {
  const [githubUserName, setGithubUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!githubUserName) {
      toast.error("Please enter your GitHub profile Username");
      return;
    }

    setIsLoading(true);

    try {
      onRoastGenerated({
        response: { response: null, success: true },
        type: "github",
      });
      const userData = await githubData(githubUserName);

      if (userData.success === false) {
        toast.error("Failed to fetch Github profile data");
        setIsLoading(false);
        return;
      }

      const response = await roastGitHub(userData.data);

      await addResponseToDB({
        type: "github_roast",
        platform: "github",
        aiResponse: response.response,
        platformUserName: githubUserName,
        extractedData: JSON.stringify(userData.data),
      });

      onRoastGenerated({ response, type: "github" });
    } catch (error) {
      console.error("Error in submission:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="github">GitHub Profile Link</Label>
        <Input
          id="github"
          placeholder="your-github-username"
          value={githubUserName}
          disabled={isLoading}
          onChange={(e) => setGithubUserName(e.target.value)}
        />
      </div>

      <div className="w-full flex justify-center items-center mt-4">
        <RainbowButton
          disabled={isLoading}
          onClick={handleSubmit}
          className="flex gap-3"
        >
          {isLoading && <Loader className="w-5 h-5 animate-spin" />}
          {isLoading ? "Analyzing Profile..." : "Roast My GitHub!"}
        </RainbowButton>
      </div>
    </div>
  );
}
