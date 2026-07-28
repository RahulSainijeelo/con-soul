import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/dashboard((?!/api|_next|.*\\..*).*)", // Protect all /dashboard routes
    // Do NOT match /api routes here — booking and payment APIs use NextAuth, not Clerk
  ],
};