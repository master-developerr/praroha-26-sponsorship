import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
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

const hasValidClerkSecret =
  !!process.env.CLERK_SECRET_KEY &&
  (process.env.CLERK_SECRET_KEY.startsWith("sk_live_") ||
    (process.env.CLERK_SECRET_KEY.startsWith("sk_test_") &&
      !process.env.CLERK_SECRET_KEY.includes("placeholder")));

// Instantiate Clerk middleware only when a valid secret key exists.
// This prevents Next.js / Vercel Edge 500 Internal Server Errors when
// CLERK_SECRET_KEY is not yet populated in the deployment environment.
const clerkHandler = hasValidClerkSecret
  ? clerkMiddleware(async (auth, request) => {
      try {
        const { userId } = await auth();

        if (isProtectedRoute(request) && !userId) {
          const requestedPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
          return NextResponse.redirect(new URL(buildSignInUrl(requestedPath), request.url));
        }

        if (isAuthRoute(request) && userId) {
          const requestedPath = sanitizeReturnPath(request.nextUrl.searchParams.get("redirect"));
          return NextResponse.redirect(new URL(requestedPath, request.url));
        }
      } catch (err) {
        console.error("[Proxy Auth Error]", err);
      }

      return NextResponse.next();
    })
  : null;

export default async function proxy(req: NextRequest, evt: any) {
  if (!clerkHandler) {
    return NextResponse.next();
  }

  try {
    return await clerkHandler(req, evt);
  } catch (error) {
    console.error("[Proxy Handler Error]", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
