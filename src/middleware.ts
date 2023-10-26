import { authMiddleware } from '@clerk/nextjs/server';

export default authMiddleware({
  publicRoutes: [
    '/',
    '/drinks(.*)',
    '/drink(.*)',
    '/:locale/sign-in',
    '/:locale/sign-up',
    '/settings',
    '/submit-drink',
    '/edit-category',
    '/api/(.*)',
    '/products(.*)',
    '/v2/(.*)',
  ],
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
