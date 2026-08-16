import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Only protect the admin dashboard routes with Clerk.
// All /api/* routes handle their own auth internally via NextAuth's
// getServerSession and/or Clerk's auth() on a per-handler basis,
// so the proxy must NOT intercept them — doing so causes 401s
// for users authenticated through NextAuth (Google sign-in) but who
// don't have a Clerk session cookie.
const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
]);

// Routes that should be completely ignored by Clerk (NextAuth handles these)
const isIgnoredRoute = createRouteMatcher([
  "/api/auth(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Skip Clerk entirely for NextAuth routes (Google OAuth, callbacks, etc.)
  if (isIgnoredRoute(req)) {
    return;
  }

  if (isProtectedRoute(req)) {
    await auth.protect();
  }
  // All other routes pass through without Clerk interference.
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
