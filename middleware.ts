import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const auth = request.headers.get("authorization");

  const username = "admin";
  const password = "malvagol2026";

  if (auth) {
    const encoded = auth.split(" ")[1];
    const decoded = atob(encoded);

    const [user, pass] = decoded.split(":");

    if (user === username && pass === password) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Autenticación requerida", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Admin Area"',
    },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};