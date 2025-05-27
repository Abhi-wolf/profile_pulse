import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CalendarDays,
  Github,
  Code,
  File,
  FileUser,
  FileTerminal,
} from "lucide-react";
import DashboardButton from "@/components/DashboardButton";
import { getDashboardData } from "@/lib/queries";
import Link from "next/link";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getSession();

  const {
    data: { userDetails, roastCount, recentRoasts, roastTypeCounts },
  } = await getDashboardData();

  if (!session || !session?.userId) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Analysis History</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* User Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${userDetails?.firstName} ${userDetails?.lastName}`}
                  alt={`${userDetails?.firstName} ${userDetails?.lastName}`}
                />
                <AvatarFallback>
                  {userDetails?.firstName.charAt(0)}
                  {userDetails?.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="text-xl font-semibold">
                  {userDetails?.firstName} {userDetails?.lastName}
                </h3>
                <p className="text-muted-foreground">{userDetails?.email}</p>
                <Badge className="mt-2">{userDetails?.role}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Roast Statistics</CardTitle>
            <CardDescription>Overview of your roast activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-muted rounded-lg p-4 text-center">
                <h3 className="text-3xl font-bold">{roastCount}</h3>
                <p className="text-muted-foreground">Total Roasts</p>
              </div>
              <div className="bg-muted rounded-lg p-4 text-center">
                <h3 className="text-3xl font-bold">{roastTypeCounts.github}</h3>
                <p className="text-muted-foreground">GitHub Roasts</p>
              </div>
              <div className="bg-muted rounded-lg p-4 text-center">
                <h3 className="text-3xl font-bold">
                  {roastTypeCounts.leetcode}
                </h3>
                <p className="text-muted-foreground">LeetCode Roasts</p>
              </div>
              <div className="bg-muted rounded-lg p-4 text-center">
                <h3 className="text-3xl font-bold">
                  {roastTypeCounts.resumeRoast}
                </h3>
                <p className="text-muted-foreground">Resume Roasts</p>
              </div>
              <div className="bg-muted rounded-lg p-4 text-center">
                <h3 className="text-3xl font-bold">
                  {roastTypeCounts.resumeAnalysis}
                </h3>
                <p className="text-muted-foreground">Resume Analysis</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      {/* <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest roasts</CardDescription>
          </div>

          <Link href="/history">
            <Button size="sm">View All</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentRoasts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No roasts found for the selected filter.
              </div>
            ) : (
              recentRoasts.map((roast) => (
                <div
                  key={roast.id}
                  className="flex items-start space-x-4 p-3 rounded-lg border"
                >
                  <div className=" rounded-full p-2 flex items-center justify-center h-12 w-12">
                    <div className="bg-muted rounded-full p-2 flex items-center justify-center h-8 w-8">
                      {roast.type === "github_roast" && (
                        <Github className="h-5 w-5" />
                      )}
                      {roast.type === "leetcode_roast" && (
                        <Code className="h-5 w-5" />
                      )}
                      {roast.type === "resume_roast" && (
                        <FileUser className="h-5 w-5" />
                      )}
                      {roast.type === "resume_analysis" && (
                        <FileTerminal className="h-5 w-5" />
                      )}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex  justify-between items-start">
                      <div className=" flex flex-col gap-1">
                        <h4 className="font-semibold">
                          {roast.type === "github_roast"
                            ? "GitHub Roast"
                            : roast.type === "leetcode_roast"
                            ? "LeetCode Roast"
                            : roast.type === "resume_roast"
                            ? "Resume Roast"
                            : "Resume Analysis"}
                        </h4>
                        {roast?.platformUserName && (
                          <p className="text-sm text-muted-foreground">
                            Username:{" "}
                            <span className="font-medium">
                              {roast.platformUserName}
                            </span>
                          </p>
                        )}
                        <p className="flex items-center text-sm text-muted-foreground">
                          <CalendarDays className="h-4 w-4 mr-1" />
                          {new Date(roast.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                      <div className="mt-2 flex justify-end">
                        <Link href={`/history/${roast.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card> */}

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest roasts</CardDescription>
          </div>
          <Link href="/history">
            <Button size="sm" className="w-full sm:w-auto">
              View All
            </Button>
          </Link>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {recentRoasts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No roasts found for the selected filter.
              </div>
            ) : (
              recentRoasts.map((roast) => (
                <div
                  key={roast.id}
                  className="flex flex-col sm:flex-row sm:items-start sm:space-x-4 space-y-2 sm:space-y-0 p-3 rounded-lg border"
                >
                  {/* Icon */}
                  <div className="hidden md:flex self-center sm:self-start rounded-full p-2 items-center justify-center h-12 w-12">
                    <div className="bg-muted rounded-full p-2 flex items-center justify-center h-8 w-8">
                      {roast.type === "github_roast" && (
                        <Github className="h-5 w-5" />
                      )}
                      {roast.type === "leetcode_roast" && (
                        <Code className="h-5 w-5" />
                      )}
                      {roast.type === "resume_roast" && (
                        <FileUser className="h-5 w-5" />
                      )}
                      {roast.type === "resume_analysis" && (
                        <FileTerminal className="h-5 w-5" />
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row  md:justify-between gap-4">
                      <div className="flex flex-col gap-1">
                        <h4 className="font-semibold">
                          {roast.type === "github_roast"
                            ? "GitHub Roast"
                            : roast.type === "leetcode_roast"
                            ? "LeetCode Roast"
                            : roast.type === "resume_roast"
                            ? "Resume Roast"
                            : "Resume Analysis"}
                        </h4>
                        {roast?.platformUserName && (
                          <p className="text-sm text-muted-foreground">
                            Username:{" "}
                            <span className="font-medium">
                              {roast.platformUserName}
                            </span>
                          </p>
                        )}
                        <p className="flex items-center text-sm text-muted-foreground">
                          <CalendarDays className="h-4 w-4 mr-1" />
                          {new Date(roast.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>

                      <div className="sm:mt-2 flex sm:justify-end">
                        <Link
                          href={`/history/${roast.id}`}
                          className="w-full sm:w-auto"
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full sm:w-auto"
                          >
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
