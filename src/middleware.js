import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { decrypt } from "./lib/session";

// const protectedRoutes = ["/dashboard"];
// const publicRoutes = ["/login", "/register"];

// export default async function middleware(req) {
//   const path = req.nextUrl.pathname;

//   if (path.startsWith("/_next") || path.startsWith("/api/auth")) {
//     return NextResponse.next();
//   }

//   const isProtectedRoute = protectedRoutes.includes(path);
//   const isPublicRoute = publicRoutes.includes(path);

//   const cookie = cookies().get("session")?.value;

//   const session = await decrypt(cookie);

//   console.log("SESSION = ", session);

//   if (isProtectedRoute && !session) {
//     return NextResponse.redirect(new URL("/login", req.nextUrl));
//   }

//   if (isPublicRoute && session?.userId) {
//     return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
//   }

//   return NextResponse.next();
// }

// const protectedRoutes = ["/dashboard"];
// const publicRoutes = ["/", "/login", "/register"];
// const authRoutes = ["/login", "/register"];

// export default async function middleware(req) {
//   const path = req.nextUrl.pathname;

//   if (
//     path.startsWith("/_next") ||
//     path.startsWith("/api/auth") ||
//     path.startsWith("/_vercel") ||
//     path.includes(".") // Skip files with extensions (images, favicons, etc.)
//   ) {
//     return NextResponse.next();
//   }

//   // const isProtectedRoute = protectedRoutes.includes(path);
//   const isPublicRoute = publicRoutes.includes(path);
//   const isAuthRoute = authRoutes.includes(path);

//   const cookie = cookies().get("session")?.value;

//   const session = await decrypt(cookie);

//   // console.log("SESSION = ", session);

//   if (!session || !session?.userId) {
//     if (isPublicRoute) return NextResponse.next();
//     return NextResponse.redirect(new URL("/login", req.nextUrl));
//   }

//   if (session?.userId) {
//     if (isAuthRoute)
//       return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
//     return NextResponse.next();
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      * - Any files with extensions (images, etc.)
//      */
//     "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
//   ],
// };

const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/", "/login", "/register"];
const authRoutes = ["/login", "/register"];

export default async function middleware(req) {
  const path = req.nextUrl.pathname;

  // Skip middleware for static files and API routes
  if (
    path.startsWith("/_next") ||
    path.startsWith("/api/auth") ||
    path.startsWith("/_vercel") ||
    path.includes(".")
  ) {
    return NextResponse.next();
  }

  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  const isPublicRoute = publicRoutes.includes(path);
  const isAuthRoute = authRoutes.includes(path);

  // Check if it's a dynamic route that should be protected (like /history/*)
  const isDynamicProtectedRoute = path.startsWith("/history");

  const cookie = cookies().get("session")?.value;
  const session = await decrypt(cookie);

  if (!session || !session?.userId) {
    // Allow public routes
    if (isPublicRoute) return NextResponse.next();
    // Redirect protected routes (including dynamic ones) to login
    if (isProtectedRoute || isDynamicProtectedRoute) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
    // For any other route, allow access (or redirect based on your needs)
    return NextResponse.next();
  }

  if (session?.userId) {
    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}
