import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

const publicRoutes = ['/login', '/auth/callback', '/guide', '/privacy', '/terms', '/data-deletion', '/api/auth', '/dashboard'];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth?.user?.id;
  
  const userAgent = req.headers.get('user-agent') || 'N/A';
  
  if (nextUrl.pathname === '/login') {
    console.log('=== LOGIN PAGE ACCESS ===');
    console.log('User-Agent:', userAgent);
    console.log('Path:', nextUrl.pathname);
    console.log('========================');
  }
  
  const isPublicRoute = publicRoutes.some(route => 
    nextUrl.pathname === route || nextUrl.pathname.startsWith(route + '/')
  );
  
  const isShareTarget = nextUrl.pathname === '/share-target';
  
  if (!isLoggedIn && !isPublicRoute && !isShareTarget) {
    return NextResponse.redirect(new URL('/login', nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest\\.json|manifest\\.webmanifest|sw\\.js|workbox-.*\\.js|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
