import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const allowedUrls = ["/auth/login", "/auth/signUp"];
  /* User is already logged in */
  if (request.cookies.has(process.env.NEXT_PUBLIC_USER_LS_KEY!)) {
    /* Redirect to profile URL if user is already logged in and trying to access login/sign up */
    if (allowedUrls.includes(pathname)) {
      return NextResponse.redirect(new URL("/user/profile", request.url));
    }
    // let tokenObj = request.cookies.get(
    //   process.env.NEXT_PUBLIC_USER_LS_KEY!
    // )?.value;
    // tokenObj = JSON.parse(tokenObj as string);
    // console.log("User token: ", tokenObj);
  } else {
    /* User is not logged in */
    /* Except allowed URLs, restrict all other URLs */
    if (allowedUrls.includes(pathname)) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }
}

/* Except auth urls (login, signup) and static assets, restrict all */
export const config = {
  matcher: ["/((?!auth|_next/static|_next/image|favicon.ico).*)"],
};
