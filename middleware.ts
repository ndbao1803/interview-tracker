import { createClient } from '@/utils/supabase/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Initialize Supabase client using middleware helper
  const supabase = createClient(request)

  // Check if we have a session
  const { data: { session }, error } = await supabase.auth.getSession()

  // Get the pathname of the request
  const path = request.nextUrl.pathname
  // Define public and protected routes
  //TODO:Add further endpoint
  const publicRoutes = ['/', '/login', '/signup']
  const isProtectedRoute = !publicRoutes.includes(path)

  // If it's a protected route and there's no session, redirect to login
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/login', request.url)
    // Add the original URL as ?next= parameter to redirect after login
    redirectUrl.searchParams.set('next', path)
    return NextResponse.redirect(redirectUrl)
  }

  // If there's a session and user is trying to access auth pages, redirect to protected area
  if (session && (path === '/login' || path === '/signup')) {
    return NextResponse.redirect(new URL('/protected', request.url))
  }

  // Allow the request to continue
  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
