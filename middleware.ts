import { NextResponse, type NextRequest } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
]);

const hasValidClerkSecret =
  !!process.env.CLERK_SECRET_KEY &&
  process.env.CLERK_SECRET_KEY.startsWith("sk_live_") ||
  (process.env.CLERK_SECRET_KEY?.startsWith("sk_test_") && !process.env.CLERK_SECRET_KEY.includes("placeholder"));

export default function middleware(req: NextRequest, evt: any) {
  if (hasValidClerkSecret) {
    return clerkMiddleware(async (auth, request) => {
      if (!isPublicRoute(request)) {
        await auth.protect();
      }
    })(req, evt);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
