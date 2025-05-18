import {
  boolean,
  timestamp,
  pgTable,
  text,
  primaryKey,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "admin"]);

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  password: text("password"),
  firstName: text("firstName"),
  lastName: text("lastName"),
  role: roleEnum("role").notNull().default("user"),
  createdAt: timestamp("createdAt", { withTimezone: true }).$defaultFn(
    () => new Date()
  ),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).$defaultFn(
    () => new Date()
  ),
});

export const roast = pgTable("roast", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),

  type: text("type"),
  extractedData: text("extractedData"),
  jobDescription: text("jobDescription"),
  aiResponse: text("aiResponse"),

  platform: text("platform"),
  platformUserName: text("platformUserName"),

  userId: text("userId").references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt", { withTimezone: true }).$defaultFn(
    () => new Date()
  ),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).$defaultFn(
    () => new Date()
  ),
});
