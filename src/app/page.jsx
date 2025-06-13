import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSession } from "@/lib/session";
import { FileText, Github, Code, Zap } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const session = await getSession();

  return (
    <div className="w-full flex flex-col min-h-screen mx-auto">
      <main className="flex-grow mx-auto ">
        {/* Hero Section */}
        <section className="py-20 text-center">
          <div className="container">
            {/* <h1 className="text-4xl font-bold mb-6">Welcome to ProfilePulse</h1> */}
            <h1 className="text-4xl font-bold mb-6">Welcome to Scan Score</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Analyze and roast your professional profiles for llm based
              feedback and improvement
            </p>
            <Link href="/login">
              <Button size="lg">
                {session?.userId ? "Go to Dashboard" : "Get Started"}
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-2">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureCard
                icon={<FileText className="h-10 w-10" />}
                title="Resume Analysis"
                description="Get your resume analyzed for job descriptions and receive tailored feedback."
              />
              <FeatureCard
                icon={<Zap className="h-10 w-10" />}
                title="Resume Roast"
                description="Receive honest, constructive criticism to improve your resume."
              />
              <FeatureCard
                icon={<Github className="h-10 w-10" />}
                title="GitHub Roast"
                description="Get insights and suggestions to enhance your GitHub profile and projects."
              />
              <FeatureCard
                icon={<Code className="h-10 w-10" />}
                title="LeetCode Roast"
                description="Analyze your LeetCode performance and get tips for improvement."
              />
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20">
          <div className="container text-center">
            {/* <h2 className="text-3xl font-bold mb-6">About ProfilePulse</h2> */}
            <h2 className="text-3xl font-bold mb-6">About Scan Score</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Scan Score is your go-to platform for honest, constructive
              feedback on your professional profiles. We use advanced AI to
              analyze and &quot;roast&quot; your resume, GitHub, and LeetCode
              profiles, helping you stand out in the competitive job market.
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Scan Up Your Profile?
            </h2>
            <p className="text-xl mb-8">
              Join Scan Score today and take your professional presence to the
              next level.
            </p>
            <Link href="/login">
              <Button size="lg" variant="secondary">
                {session?.userId ? "Go to Dashboard" : "Get Started"}
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {icon}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}
