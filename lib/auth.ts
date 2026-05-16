import { SignJWT, jwtVerify } from 'jose';

const getJwtSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  return new TextEncoder().encode(secret);
};

export async function signAuth(): Promise<string> {
  const token = await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h') // Token expires in 24 hours
    .sign(getJwtSecretKey());
  
  return token;
}

export async function verifyAuth(token: string) {
  try {
    const verified = await jwtVerify(token, getJwtSecretKey());
    return verified.payload.role === 'admin';
  } catch (err) {
    return false;
  }
}
