import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/**
 * Converted from Laravel's `auth` middleware group (protects /dashboard/*)
 * and the `guest` middleware group (keeps logged-in users off /login, /register).
 */
export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    if ((pathname === "/login" || pathname === "/register") && token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        if (pathname.startsWith("/dashboard")) {
          return !!token;
        }
        // /login and /register are handled above; always let the middleware run.
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
