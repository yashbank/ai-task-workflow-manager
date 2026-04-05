import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { NextFetchEvent } from "next/server";
import { withAuth } from "next-auth/middleware";

const authMiddleware = withAuth({
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

function authDisabled() {
  return (
    process.env.DISABLE_AUTH === "true" || process.env.NEXT_PUBLIC_DISABLE_AUTH === "true"
  );
}

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  if (authDisabled()) {
    return NextResponse.next();
  }
  return authMiddleware(req as Parameters<typeof authMiddleware>[0], event);
}

export const config = {
  matcher: ["/dashboard/:path*", "/tasks/:path*", "/kanban/:path*", "/ai/:path*"],
};
