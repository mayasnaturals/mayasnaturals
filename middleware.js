import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Only protect the specific admin routes
  if (pathname.startsWith("/admin-s3cr3t-p4n3l-8891")) {
    // If accessing the login page, let it pass
    if (pathname === "/admin-s3cr3t-p4n3l-8891") {
      return NextResponse.next();
    }

    const token = request.cookies.get("admin_token")?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL("/admin-s3cr3t-p4n3l-8891", request.url));
    }
    // We only check if token exists here. 
    // Full verification happens in API routes which run in Node.js environment.
  }

  // Also protect admin api routes except login
  if (pathname.startsWith("/api/admin") && !pathname.includes("/login")) {
    const token = request.cookies.get("admin_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin-s3cr3t-p4n3l-8891/:path*",
    "/api/admin/:path*"
  ],
};
