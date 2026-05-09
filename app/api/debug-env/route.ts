import { NextResponse } from 'next/server';

export async function GET() {
  const envVars = {
    DATABASE_URL: process.env.DATABASE_URL ? 'SET (Hidden for security)' : 'NOT SET',
    JWT_SECRET: process.env.JWT_SECRET ? 'SET (Hidden for security)' : 'NOT SET',
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? 'SET' : 'NOT SET',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '(Empty/Same-origin)',
    NODE_ENV: process.env.NODE_ENV,
  };

  const isDatabaseSet = !!process.env.DATABASE_URL;
  const isAuthSet = !!process.env.JWT_SECRET;

  return NextResponse.json({
    success: true,
    message: 'Environment diagnostics',
    isReady: isDatabaseSet && isAuthSet,
    diagnostics: envVars,
    help: isDatabaseSet && isAuthSet 
      ? 'Critical variables are set. If you still see 500 errors, check database connection logs.' 
      : 'One or more critical environment variables are missing. Please add them to your Vercel Dashboard.'
  });
}
