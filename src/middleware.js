import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { decrypt } from "./lib/session";

const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/login", "/register"];

export default async function middleware(req) {
  const path = req.nextUrl.pathname;

  if (path.startsWith("/_next") || path.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const cookie = cookies().get("session")?.value;


  const session = await decrypt(cookie);


  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isPublicRoute && session?.userId) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
// };
