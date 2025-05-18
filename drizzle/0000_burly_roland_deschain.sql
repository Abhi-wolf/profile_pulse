CREATE TYPE "public"."role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "resume" (
	"id" text PRIMARY KEY NOT NULL,
	"resumeText" text,
	"jobDescription" text,
	"aiResponse" text,
	"userId" text,
	"createdAt" timestamp,
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "roast" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text,
	"roastText" text,
	"platform" text,
	"platformUserName" text,
	"createdAt" timestamp,
	"updatedAt" timestamp,
	"userId" text
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text,
	"emailVerified" timestamp,
	"image" text,
	"password" text,
	"firstName" text,
	"lastName" text,
	"role" "role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp,
	"updatedAt" timestamp,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "resume" ADD CONSTRAINT "resume_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roast" ADD CONSTRAINT "roast_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;