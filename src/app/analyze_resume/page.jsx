"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/fileUpload";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { checkResumeIsGoodForTheGob } from "@/lib/llmResponse";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, Loader, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/provider/dataProvider";
import { Button } from "@/components/ui/button";
import { addResponseToDB } from "@/actions/resumeActions";
import DashboardButton from "@/components/DashboardButton";

export default function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingAiResponse, setIsGeneratingAiResponse] = useState(false);

  const {
    data,
    setAiResumeAnalysizForJobDesc,
    setResumeExtractedText,
    setJobDescription,
  } = useData();

  const handlePdfUpload = async () => {
    if (!file) return;

    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/fileUpload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setResumeExtractedText(data.text);
      } else {
        toast.error(data.error);
        console.error("Error:", data.error);
      }
    } catch (error) {
      toast.error("Upload failed");
      console.error("Upload failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    if (!file) {
      toast.error("Please upload your resume");
      return;
    }

    await handlePdfUpload();

    if (!data?.resumeExtractedText || !data?.jobDescription) {
      toast.message("Please upload a resume and enter a job description.");
      return;
    }

    setIsGeneratingAiResponse(true);
    setAiResumeAnalysizForJobDesc(null);

    const extractedData = data?.resumeExtractedText;
    const jobDescription = data?.jobDescription;

    try {
      const response = await checkResumeIsGoodForTheGob(
        extractedData,
        jobDescription
      );

      if (response.error) {
        toast.error(response.error);
        return;
      }

      setAiResumeAnalysizForJobDesc(response);

      await addResponseToDB({
        type: "resume_analysis",
        aiResponse: response,
        extractedData: data.resumeExtractedText,
        jobDescription: data.jobDescription,
      });

      toast.success("Your resume has been analyzed successfully.");
    } catch (error) {
      toast.error("An error occurred during analysis. Please try again.");
    } finally {
      setIsGeneratingAiResponse(false);
    }
  };

  return (
    // <div className="w-[94%] md:w-[80%] mx-auto my-10 flex flex-col gap-6 mt-5">
    <div className="container md:mx-auto py-2 md:py-6 flex flex-col gap-6 ">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Analysis History</h1>
        <DashboardButton text="Dashboard" href="/dashboard" />
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <FileUpload
          setFile={setFile}
          file={file}
          isLoading={isLoading}
          handlePdfUpload={handlePdfUpload}
        />

        <div className="w-full">
          <label htmlFor="jobDescription" className="block text-xl font-medium">
            Job Description
          </label>
          <Textarea
            id="jobDescription"
            value={data?.jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="mt-1"
            rows={6}
          />
        </div>
      </div>

      <div className=" mx-auto ">
        <RainbowButton
          disabled={
            isLoading || !data?.jobDescription || isGeneratingAiResponse
          }
          onClick={handleSubmit}
          className="flex gap-3"
        >
          {isGeneratingAiResponse && (
            <Loader className="w-5 h-5 animate-spin" />
          )}
          {isGeneratingAiResponse ? "Analyzing..." : "Analyze"}
        </RainbowButton>
      </div>

      <AnalysisResult />
    </div>
  );
}

function AnalysisResult() {
  const { data, setAiResumeAnalysizForJobDesc } = useData();
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    if (data?.aiResumeAnalysizForJobDesc) {
      try {
        setAnalysisResult(JSON.parse(data.aiResumeAnalysizForJobDesc));
      } catch (error) {
        console.error("Error parsing analysis result:", error);
        setAnalysisResult(null);
      }
    } else {
      setAnalysisResult(null); // Ensure re-render when cleared
    }
  }, [data?.aiResumeAnalysizForJobDesc]);

  return (
    <Card className="w-full mx-auto">
      <CardHeader className="w-full flex flex-row justify-between items-center ">
        <CardTitle className="text-2xl font-bold">
          Resume Analysis Result
        </CardTitle>

        <Button onClick={() => setAiResumeAnalysizForJobDesc("")}>
          Clear Response
        </Button>
      </CardHeader>
      {analysisResult && (
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Alignment Score</h3>
            <Progress
              value={analysisResult?.alignment_score}
              className="w-full h-2"
            />
            <p className="text-sm text-muted-foreground text-right">
              {analysisResult?.alignment_score}% Match
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Key Strengths
            </h3>
            <ul className="grid gap-2">
              {analysisResult?.key_strengths?.map((strength, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200"
                  >
                    Strength
                  </Badge>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              Gaps
            </h3>
            <ul className="grid gap-2">
              {analysisResult?.gaps?.map((gap, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Badge
                    variant="outline"
                    className="bg-red-50 text-red-700 border-red-200"
                  >
                    Gap
                  </Badge>
                  <span>{gap}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              Recommendations
            </h3>
            <ul className="grid gap-2">
              {analysisResult?.recommendations?.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Badge
                    variant="outline"
                    className="bg-yellow-50 text-yellow-700 border-yellow-200"
                  >
                    Tip
                  </Badge>
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Overall Feedback</h3>
            <p className="text-sm text-muted-foreground">
              {analysisResult?.overall_feedback}
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
