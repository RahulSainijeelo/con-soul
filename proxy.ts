import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// ──────────────────────────────────────────────────────────────
// AUTH SEPARATION:
//   • Clerk   → Admin dashboard only (/dashboard/*)
//   • NextAuth (Google OAuth) → Client/customer login
//
// The Clerk proxy must NEVER intercept /api/auth/* routes.
// Even without auth.protect(), clerkMiddleware injects headers
// and cookies that break NextAuth's Google OAuth handshake.
// ──────────────────────────────────────────────────────────────

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
});

export const config = {
  matcher: [
    // Skip Next.js internals, static files, AND NextAuth routes
    "/((?!_next|api/auth|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Run for API routes EXCEPT /api/auth (NextAuth handles its own auth)
    "/(api(?!/auth)|trpc)(.*)",
  ],
};
