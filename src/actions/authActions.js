"use server";

import { db, eq } from "@/db";
import { users } from "@/db/schema/userSchema";
import { createSession, deleteSession } from "@/lib/session";
import bcrypt, { hash } from "bcrypt";

const apiURL = "https://feedlytic.vercel.app/api/events";




export async function login(values) {
  const { email, password } = values;


  const existingUser = await db
    .select(users)
    .from(users)
    .where(eq(users.email, email))
    .limit(1);


  if (existingUser.length === 0) {
    return {
      error: "Invalid email or password",
      success: false,
    };
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    existingUser[0].password
  );

  if (!isPasswordValid) {
    return {
      error: "Invalid email or password",
      success: false,
    };
  }

  const user = {
    email: existingUser[0].email,
    firstName: existingUser[0].firstName,
    lastName: existingUser[0].lastName,
    id: existingUser[0].id,
    role: existingUser[0].role,
  };

  try {
    await createSession(existingUser[0].id);
    return {
      error: null,
      user: user,
      success: true,
      message: "Login successful",
    };
  } catch (error) {
    return { error: e.message, success: false };
  }
}

export async function register(values) {
  const { email, password, firstName, lastName } = values;

  try {
    const existingUser = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);


    if (existingUser.length > 0) {
      return { error: "User already exists", success: false };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        firstName,
        lastName,
      })
      .returning({
        id: users.id,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
      });

    await createSession(newUser[0].id);

    const eventData = {
      eventName: "User Registered",    // required
      domain: "profile-pulse-mu.vercel.app",  // required
      eventDescription: `User ${email} registered successfully`, // optional
    };

    const response = await fetch(apiURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.FEEDLYTIC_API_KEY}`,
      },
      body: JSON.stringify(eventData), 
    });

    console.log("FEEDLYTIC RESPONSE = ", response)

    return {
      error: null,
      user: newUser[0],
      success: true,
      message: "Login successful",
    };
  } catch (e) {
    console.error(e);
    return { error: e.message, success: false };
  }
}

export async function logout() {
  try {
    await deleteSession();
    return { error: null, success: true, message: "Logout successful" };
  } catch (e) {
    console.log(e);
    return { error: e.message, success: false };
  }
}
