import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

// JWT Encrypt செய்வதற்கான Secret Key
const key = () =>
  new TextEncoder().encode(
    process.env.AUTH_SECRET || 'development-secret-change-before-production'
  );

export type Session = {
  id: string;
  name: string;
  role: 'ADMIN' | 'MANAGER' | 'STAFF';
};

/**
 * 1. புதிய JWT Token உருவாக்குதல் (8 மணிநேரம் செல்லுபடியாகும்)
 */
export async function createSession(user: Session) {
  return new SignJWT(user)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(key());
}

/**
 * 2. Cookie-ல் இருக்கும் JWT Token-ஐ சரிபார்த்து பயனரின் தரவை எடுத்தல்
 */
export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get('buildmart_session')?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, key());
    return payload as unknown as Session;
  } catch {
    return null;
  }
}

/**
 * 3. லாகின் செய்த பயனர் மட்டுமே அணுகுவதை உறுதி செய்தல் (Authorization Middleware)
 */
export async function requireSession() {
  const session = await getSession();
  if (!session) {
    throw new Error('UNAUTHORIZED');
  }
  return session;
}