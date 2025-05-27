import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/provider/theme-provider";
import { Header } from "@/components/header";
import { Toaster } from "sonner";
import Providers from "@/provider";
import Script from "next/script";
import FeedbackForm from "@/components/FeedbackForm";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ProfilePulse",
  description:
    "ProfilePulse | Analyze and roast your professional profiles for llm based feedback and improvement",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script
          defer
          data-domain="profile-pulse-mu.vercel.app"
          src="https://feedlytic.vercel.app/tracking-script.js"
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <Header />
          <div className="container mx-auto mt-32 md:mt-16">{children}</div>
          <FeedbackForm />
        </Providers>

        <Toaster position="top-center" />
      </body>
    </html>
  );
}
