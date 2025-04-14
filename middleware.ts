import { createClient } from "@/utils/supabase/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const supabase = createClient(request);

    const {
        data: { session },
    } = await supabase.auth.getSession();

    const path = request.nextUrl.pathname;
    const publicRoutes = ["/", "/login", "/signup"];
    const isProtectedRoute = !publicRoutes.includes(path);

    if (isProtectedRoute && !session) {
        const redirectUrl = new URL("/login", request.url);
        redirectUrl.searchParams.set("next", path);
        return NextResponse.redirect(redirectUrl);
    }

    if (session && (path === "/login" || path === "/signup")) {
        return NextResponse.redirect(new URL("/protected", request.url));
    }

    const response = NextResponse.next();

    // If session exists, append user ID to the request headers
    if (session?.user) {
        response.headers.set("x-user-id", session.user.id);
    }

    return response;
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
