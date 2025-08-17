import { withAuth } from "next-auth/middleware";
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { getToken } from "next-auth/jwt";

const publicAuthPages = ["/auth/login"];

const handleI18nRouting = createMiddleware(routing);

const authMiddleware = withAuth(
  function onSuccess(req) {
    return handleI18nRouting(req);
  },
  {
    callbacks: {
      authorized: ({ token }) => token != null,
    },
    pages: {
      signIn: "/auth/login",
    },
  }
);

const routesRegex = (routes: string[]) => {
  return RegExp(
    `^(/(${routing.locales.join("|")}))?(${routes
      .flatMap((p) => {
        if (p === "/") return ["", "/"];
        return p.replace(/\[.*?\]/g, "[^/]+");
      })
      .join("|")})/?$`,
    "i"
  );
};

export default async function middleware(req: NextRequest) {
  const publicAuthPathnameRegex = routesRegex(publicAuthPages);
  const isAuthPublicPage = publicAuthPathnameRegex.test(req.nextUrl.pathname);

  if (isAuthPublicPage) {
    const token = await getToken({ req });
    const redirectUrl = new URL("/", req.nextUrl.origin);

    if (token) {
      return NextResponse.redirect(redirectUrl);
    }

    return handleI18nRouting(req);
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (authMiddleware as any)(req);
  }
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
