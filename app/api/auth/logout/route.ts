import { NextResponse } from 'next/server';

function logoutAndRedirect(request: Request) {
  const response = NextResponse.redirect(new URL('/login', request.url));
  // Session Cookie-ஐ நீக்குதல்
  response.cookies.delete('buildmart_session');
  return response;
}

// Browser நேரடி Navigation (GET)
export async function GET(request: Request) {
  return logoutAndRedirect(request);
}

// Form Submission அல்லது Fetch Call (POST)
export async function POST(request: Request) {
  return logoutAndRedirect(request);
}