"use client";

import { useState } from "react";
import { FileUpload } from "@/components/fileUpload";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { roastResume } from "@/lib/llmResponse";
import { addResponseToDB } from "@/actions/resumeActions";

export function ResumeRoast({ onRoastGenerated }) {
  const [file, setFile] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePdfUpload = async () => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/fileUpload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        return data.text;
      } else {
        toast.error(data.error);
        console.error("Error:", data.error);
        return null;
      }
    } catch (error) {
      toast.error("Upload failed");
      console.error("Upload failed:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please upload a resume");
      return;
    }

    setIsLoading(true);

    try {
      const extractedText = await handlePdfUpload();

      if (!extractedText) {
        toast.error("Failed to extract text from resume");
        setIsLoading(false);
        return;
      }

      // Get roast from AI
      const response = await roastResume(extractedText);
      // console.log("AI Response:", response);

      await addResponseToDB({
        type: "resume_roast",
        aiResponse: response.response,
        extractedData: JSON.stringify(extractedText),
      });

      onRoastGenerated({ response, type: "resume" });
    } catch (error) {
      console.error("Error in submission:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <FileUpload setFile={setFile} file={file} isLoading={isLoading} />

      <div className="w-full flex justify-center items-center mt-4">
        <RainbowButton
          disabled={isLoading}
          onClick={handleSubmit}
          className="flex gap-3"
        >
          {isLoading && <Loader className="w-5 h-5 animate-spin" />}
          {isLoading ? "Analyzing Resume..." : "Roast My Resume!"}
        </RainbowButton>
      </div>
    </div>
  );
}
