import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const token = request.cookies.get("auth_token")?.value;
    const role = request.cookies.get("user_role")?.value;

    if (pathname.startsWith("/admin")) {
        if (!token) {
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("redirect", pathname);
            return NextResponse.redirect(loginUrl);
        }
        if (role !== "admin") {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    if (pathname.startsWith("/cart")) {
        if (!token) {
            const loginUrl = new URL("/login", request.url);
            loginUrl.searchParams.set("redirect", pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/cart/:path*"],
};