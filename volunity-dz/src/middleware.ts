import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from '@/i18n/config';
import { createClient } from '@/lib/supabase/middleware';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: true,
});

export default async function middleware(request: NextRequest) {
  const { supabase, supabaseResponse } = createClient(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const segments = pathname.split('/').filter(Boolean);
  const locale = locales.includes(segments[0] as any) ? segments[0] : defaultLocale;

  const protectedPaths = ['dashboard', 'notifications', 'settings', 'profile', 'qr-scan', 'events/new'];
  const guestPaths = ['login', 'register', 'forgot-password'];
  const adminPaths = ['admin'];

  const routeSegment = segments[1] || '';

  const isProtected = protectedPaths.includes(routeSegment);
  const isGuestRoute = guestPaths.includes(routeSegment);
  const isAdminRoute = adminPaths.includes(routeSegment) || (segments.length >= 1 && adminPaths.includes(segments[0]));
  const isBareAdmin = segments.length >= 1 && adminPaths.includes(segments[0]) && !locales.includes(segments[0] as any);

  if (isBareAdmin) {
    if (!user) {
      return NextResponse.redirect(new URL(`/${defaultLocale}/login`, request.url));
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.redirect(new URL(`/${defaultLocale}/dashboard`, request.url));
    }

    const response = supabaseResponse;
    response.headers.set('x-volunity-locale', defaultLocale);
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    return response;
  }

  if (!user && isProtected) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user && isGuestRoute) {
    const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  if (isAdminRoute && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  const response = intlMiddleware(request);

  const supabaseCookies = supabaseResponse.headers.getSetCookie();
  supabaseCookies.forEach((cookie) => {
    response.headers.append('Set-Cookie', cookie);
  });

  response.headers.set('x-volunity-locale', locale);

  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
