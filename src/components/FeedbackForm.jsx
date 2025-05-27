"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader, Star, X } from "lucide-react";
import { addFeedback } from "@/actions/resumeActions";
import { toast } from "sonner";

export default function FeedbackForm() {
  const [rating, setRating] = useState(4);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading;

    const formData = new FormData(event.currentTarget);
    const input = {
      userName: formData.get("userName"),
      feedback: formData.get("feedback"),
      rating: rating,
    };

    const res = await addFeedback(input);

    if (res.success) {
      toast.success("Feedback submitted successfully");
      formRef?.current?.reset();
      setRating(4);
      setOpen(false);
    } else {
      toast.error("Something went wrong");
    }

    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-2 right-2 ">
      <Button
        variant="default"
        aria-label="Give Feedback"
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 right-4 rounded-full  px-4 py-2 shadow-lg hover:shadow-xl transition-shadow"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <span className="hidden md:inline-block">Feedback</span>
      </Button>

      {open && (
        <div className="fixed bottom-2 right-2 bg-white dark:bg-gray-800 w-[350px] md:w-[400px] p-2 md:p-6  rounded-md ">
          <div className="flex flex-col gap-2 ">
            <div className="flex justify-between">
              <h3 className="text-lg md:text-2xl font-bold text-foreground ">
                I&apos;d love your feedback!
              </h3>
              <Button size="icon" onClick={() => setOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-sm md:text-md text-foreground">
              Help me improve this platform by sharing your thoughts.
            </p>
          </div>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-6 mt-4"
          >
            <div className="space-y-2">
              <Label htmlFor="userName" className="text-sm font-medium">
                Name
              </Label>
              <Input
                id="userName"
                name="userName"
                placeholder="Your name"
                disabled={isLoading}
                required
                className="w-full px-3 py-2 border rounded-md "
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback" className="text-sm font-medium">
                Feedback
              </Label>
              <Textarea
                id="feedback"
                name="feedback"
                disabled={isLoading}
                placeholder="Your feedback"
                required
                className="w-full px-3 py-2 border rounded-md min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Rating</Label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    disabled={isLoading}
                    onClick={() => setRating(value)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-4 md:w-8 h-4 md:h-8 ${
                        rating >= value
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full md:py-2 md:px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {isLoading && <Loader className="h-4 w-4 animate-spin" />}
              {isLoading ? "Submitting..." : "Submit Feedback"}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
