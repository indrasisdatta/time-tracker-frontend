import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // console.log("Request: ", request);
  return NextResponse.redirect(new URL("/auth/login", request.url));
}

export const config = {
  matcher: ["/user/profile"],
};
