import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const { pathname } = req.nextUrl

    // Public routes - allow access
    if (
      pathname.startsWith('/api/auth') ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/favicon') ||
      pathname === '/' ||
      pathname === '/login' ||
      pathname === '/register' ||
      pathname === '/products' ||
      pathname === '/about' ||
      pathname === '/contact' ||
      pathname.startsWith('/products/')
    ) {
      return NextResponse.next()
    }

    // Protected routes - require authentication
    if (!token) {
      const loginUrl = new URL('/login', req.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Admin routes - require admin role
    if (pathname.startsWith('/admin')) {
      if (token.role !== 'admin') {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }

    // Kasir routes - require kasir or admin role
    if (pathname.startsWith('/kasir')) {
      if (token.role !== 'kasir' && token.role !== 'admin') {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }

    // Customer routes - require customer role (or any authenticated user)
    if (pathname.startsWith('/orders') || pathname.startsWith('/profile') || pathname.startsWith('/checkout')) {
      if (!token) {
        return NextResponse.redirect(new URL('/login', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Allow public routes
        if (
          pathname.startsWith('/api/auth') ||
          pathname.startsWith('/_next') ||
          pathname.startsWith('/favicon') ||
          pathname === '/' ||
          pathname === '/login' ||
          pathname === '/register' ||
          pathname === '/products' ||
          pathname === '/about' ||
          pathname === '/contact' ||
          pathname.startsWith('/products/')
        ) {
          return true
        }

        // Require token for protected routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (NextAuth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
}
