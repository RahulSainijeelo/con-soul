import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/dashboard((?!/api|_next|.*\\..*).*)", // Protect all /dashboard routes
    "/api/trips(.*)", // Match trips API routes so Clerk auth() works for admin trip management
  ],
};