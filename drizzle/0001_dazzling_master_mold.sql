DROP TABLE "resume" CASCADE;--> statement-breakpoint
ALTER TABLE "roast" ADD COLUMN "extractedData" text;--> statement-breakpoint
ALTER TABLE "roast" ADD COLUMN "jobDescription" text;--> statement-breakpoint
ALTER TABLE "roast" ADD COLUMN "aiResponse" text;--> statement-breakpoint
ALTER TABLE "roast" DROP COLUMN "roastText";