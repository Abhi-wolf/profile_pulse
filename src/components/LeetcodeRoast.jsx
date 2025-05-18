"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { leetcodeData } from "@/lib/leetcode_data";
import { roastLeetCode, roastResume } from "@/lib/llmResponse";
import { addResponseToDB } from "@/actions/resumeActions";

export function LeetCodeRoast({ onRoastGenerated }) {
  const [leetcodeUserName, setLeetcodeUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!leetcodeUserName) {
      toast.error("Please enter your LeetCode username");
      return;
    }

    setIsLoading(true);

    try {
      // Fetch LeetCode data
      onRoastGenerated({
        response: { response: null, success: true },
        type: "leetcode",
      });
      const userData = await leetcodeData(leetcodeUserName);

      if (!userData || userData.success === false) {
        toast.error("Failed to fetch LeetCode profile data");
        setIsLoading(false);
        return;
      }

      // Generate roast based on the data
      const response = await roastLeetCode(userData.data);
      await addResponseToDB({
        type: "leetcode_roast",
        platform: "leetcode",
        aiResponse: response.response,
        platformUserName: leetcodeUserName,
        extractedData: JSON.stringify(userData.data),
      });
      onRoastGenerated({ response, type: "leetcode" });
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
        <Label htmlFor="leetcode">LeetCode Username</Label>
        <Input
          id="leetcode"
          placeholder="your-leetcode-username"
          value={leetcodeUserName}
          disabled={isLoading}
          onChange={(e) => setLeetcodeUserName(e.target.value)}
        />
      </div>

      <div className="w-full flex justify-center items-center mt-4">
        <RainbowButton
          disabled={isLoading}
          onClick={handleSubmit}
          className="flex gap-3"
        >
          {isLoading && <Loader className="w-5 h-5 animate-spin" />}
          {isLoading ? "Analyzing LeetCode..." : "Roast My LeetCode!"}
        </RainbowButton>
      </div>
    </div>
  );
}
