import { SignJWT, jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');

export interface UserJWTPayload {
  id: string;
  username: string;
  nickname: string;
  email: string;
  name: string;
  role: string;
  mileage?: number;
  iat?: number;
  exp?: number;
}

/**
 * JWT 토큰 생성
 */
export async function generateToken(payload: Omit<UserJWTPayload, 'iat' | 'exp'>): Promise<string> {
  const token = await new SignJWT({
    id: payload.id,
    username: payload.username,
    nickname: payload.nickname,
    email: payload.email,
    name: payload.name,
    role: payload.role,
    mileage: payload.mileage,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // 7일 후 만료
    .setIssuer('hanatour')
    .setAudience('hanatour-users')
    .sign(secret);

  return token;
}

/**
 * JWT 토큰 검증
 */
export async function verifyToken(token: string): Promise<UserJWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret, {
      issuer: 'hanatour',
      audience: 'hanatour-users',
    });

    return payload as unknown as UserJWTPayload;
  } catch (error) {
    console.error('JWT 검증 실패:', error);
    return null;
  }
}

/**
 * Authorization 헤더에서 토큰 추출
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
} 