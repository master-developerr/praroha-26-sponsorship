import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { buildSignInUrl, sanitizeReturnPath } from "@/lib/authRedirect";

const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

const isProtectedRoute = createRouteMatcher([
  "/workspace(.*)",
  "/admin(.*)",
  "/pending",
  "/register/profile",
  "/rejected",
  "/suspended",
  "/api/ai(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();

  if (isProtectedRoute(request) && !userId) {
    const requestedPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
    return NextResponse.redirect(new URL(buildSignInUrl(requestedPath), request.url));
  }

  if (isAuthRoute(request) && userId) {
    const requestedPath = sanitizeReturnPath(request.nextUrl.searchParams.get("redirect"));
    return NextResponse.redirect(new URL(requestedPath, request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
