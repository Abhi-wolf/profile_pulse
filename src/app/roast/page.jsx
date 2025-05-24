"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ResumeRoast } from "@/components/ResumeRoast";
import { GitHubRoast } from "@/components/GithubRoast";
import { LeetCodeRoast } from "@/components/LeetcodeRoast";
import { RoastDisplay } from "@/components/RoastDisplay";
import DashboardButton from "@/components/DashboardButton";

export default function Page() {
  const [roast, setRoast] = useState({
    resumeRoast: "",
    githubRoast: "",
    leetcodeRoast: "",
  });
  const [selectedTab, setSelectedTab] = useState("resume");

  // Enhanced handler for setting loading state and roast result
  const handleRoastResult = (res) => {

    if (res.response.success) {
      if (res.type === "resume") {
        setRoast((prev) => ({ ...prev, resumeRoast: res.response.response }));
      } else if (res.type === "github") {
        setRoast((prev) => ({ ...prev, githubRoast: res.response.response }));
      } else if (res.type === "leetcode") {
        setRoast((prev) => ({ ...prev, leetcodeRoast: res.response.response }));
      }
    } else {
      toast.error(res.response.error || "Failed to generate roast");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold ">
          Developer Roast Generator
        </h1>

        <DashboardButton text="Dashboard" href="/dashboard" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Your Info</CardTitle>
          <CardDescription>
            Prepare to be roasted based on your developer profile!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="resume"
            className="w-full"
            value={selectedTab}
            onValueChange={setSelectedTab}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="resume">Resume</TabsTrigger>
              <TabsTrigger value="github">GitHub</TabsTrigger>
              <TabsTrigger value="leetcode">LeetCode</TabsTrigger>
            </TabsList>
            <TabsContent value="resume">
              <ResumeRoast onRoastGenerated={handleRoastResult} />
            </TabsContent>
            <TabsContent value="github">
              <GitHubRoast onRoastGenerated={handleRoastResult} />
            </TabsContent>
            <TabsContent value="leetcode">
              <LeetCodeRoast onRoastGenerated={handleRoastResult} />
            </TabsContent>
          </Tabs>
        </CardContent>

        {selectedTab === "resume" && roast.resumeRoast && (
          <RoastDisplay roastText={roast.resumeRoast} type="Resume" />
        )}
        {selectedTab === "github" && roast.githubRoast && (
          <RoastDisplay roastText={roast.githubRoast} type="GitHub" />
        )}
        {selectedTab === "leetcode" && roast.leetcodeRoast && (
          <RoastDisplay roastText={roast.leetcodeRoast} type="LeetCode" />
        )}
      </Card>
    </div>
  );
}
