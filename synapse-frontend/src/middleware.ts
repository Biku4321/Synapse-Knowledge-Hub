import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define your public routes here
// Ensure your landing page ("/") and auth routes are public!
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/uploadthing(.*)" // If you use uploadthing or other public APIs
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    // FIX: await the auth protection call
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};