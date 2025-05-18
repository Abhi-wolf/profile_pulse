import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileText, Github, Linkedin, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getRoastById } from "@/lib/queries";

export default async function RoastDetailsPage({ params }) {
  //   const data = await db.query.roast.findFirst({
  //     where: eq(roast.id, params.id),
  //   });

  const data = await getRoastById(params.id);

  if (!data) {
    notFound();
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case "resume":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "github":
        return <Github className="h-4 w-4 text-purple-500" />;
      case "linkedin":
        return <Linkedin className="h-4 w-4 text-blue-700" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-6">
        <Link href="/history">
          <Button variant="outline" size="icon" className="mr-4">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold"> Details</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getTypeIcon(data.type)}
            <span className="capitalize">{data.type}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.platformUserName && (
            <div>
              <p className="text-sm text-muted-foreground">Platform Username</p>
              <p className="font-medium">{data.platformUserName}</p>
            </div>
          )}

          {data.platform && (
            <div>
              <p className="text-sm text-muted-foreground">Platform</p>
              <p className="font-medium capitalize">{data.platform}</p>
            </div>
          )}

          <div>
            <p className="text-sm text-muted-foreground">Job Description</p>
            <p className="font-medium">{data.jobDescription || "N/A"}</p>
          </div>

          {/* <div>
            <p className="text-sm text-muted-foreground">Extracted Data</p>
            <pre className="bg-muted p-3 rounded text-sm whitespace-pre-wrap">
              {data.extractedData || "N/A"}
            </pre>
          </div> */}

          <div>
            <p className="text-sm text-muted-foreground">AI Response</p>
            <pre className="bg-muted p-3 rounded text-sm whitespace-pre-wrap">
              {data.aiResponse || "N/A"}
            </pre>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{new Date(data.createdAt).toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
