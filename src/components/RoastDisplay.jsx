"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function RoastDisplay({ roastText, type }) {
  const lines = roastText?.split(/\n|•/).filter((line) => line.trim());

  return (
    <Card className="m-2 lg:m-4">
      <CardHeader className="w-full flex flex-row justify-between items-center">
        <CardTitle className="text-2xl font-bold">Your {type} Roast </CardTitle>
        {/* <Button onClick={clearRoast}>Clear Roast</Button> */}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            Feedback Points
          </h3>
          <ul className="grid gap-2">
            {lines?.map((line, index) => (
              <li key={index} className="flex items-start gap-2">
                <Badge
                  variant="outline"
                  className="bg-red-50 text-red-700 border-red-200"
                >
                  Point
                </Badge>
                <span>{line.trim()}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
