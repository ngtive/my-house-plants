import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPages = ["/login", "/verify-otp"];

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  console.log(request.url);
  if (request.url === "/")
    return NextResponse.redirect(new URL("/home", request.url));
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
