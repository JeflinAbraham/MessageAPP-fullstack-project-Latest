import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
export { default } from 'next-auth/middleware';

export const config = {
    // the middleware runs whenever we hit these urls.
    matcher: ['/dashboard/:path*', '/sign-in', '/sign-up', '/', '/verify/:path*'],
};

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });
    const url = request.nextUrl;

    // if the user is trying to access sign-in, sign-up, verify, redirect the user to dashboard if the user is already authenticated.
    if (
        token &&
        (url.pathname.startsWith('/sign-in') ||
            url.pathname.startsWith('/sign-up') ||
            url.pathname.startsWith('/verify')
        )) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // if the user is not authenticated and is trying to access the dashboard, redirect the user to sign-in page.
    if (!token && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }

    return NextResponse.next();
}