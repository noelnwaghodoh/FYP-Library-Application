import { NextResponse } from "next/server";

export function middleware(request) {
  // We only care about protecting route paths that start with /student
  if (request.nextUrl.pathname.startsWith("/student")) {
    // Read the official express-session cookie that your Express server places onto the browser
    const session = request.cookies.get("connect.sid");

    // If the "isLoggedIn" cookie doesn't exist, they bypassed login or their session expired
    if (!session) {
      // Act as a bouncer, redirecting them immediately back to the root login page
      console.log("NO SESSION");
    //  alert("NO SESSION");
      return NextResponse.redirect(new URL("/", request.url));
    }
    console.log("SESSION EXISTS");
  }

  // If the cookie exists, or they are just visiting public pages, let them proceed normally
  return NextResponse.next();
}

/**
 * The Matcher tells Next.js exactly which paths this middleware should run on.
 * By specifying '/student*' we guarantee performance won't drop on public routing.
 */
export const config = {
  matcher: ["/student", "/student/:path*"],
};
