import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  // console.log("Request cookie -->> ", request.cookies.get(process.env.NEXT_PUBLIC_USER_LS_KEY));
  if (request.cookies.has(process.env.NEXT_PUBLIC_USER_LS_KEY!)) {
    let tokenObj = request.cookies.get(
      process.env.NEXT_PUBLIC_USER_LS_KEY!
    )?.value;
    tokenObj = JSON.parse(tokenObj as string);
    console.log("User token: ", tokenObj);
  } else {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

export const config = {
  matcher: ["/user/profile"],
};
