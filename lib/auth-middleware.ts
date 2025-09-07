import { NextRequest } from 'next/server';
import { verifyToken, extractTokenFromHeader, UserJWTPayload } from '@/lib/jwt';

export interface AuthenticatedRequest extends NextRequest {
  user?: UserJWTPayload;
}

/**
 * JWT 토큰 검증 미들웨어
 */
export async function authenticateToken(request: NextRequest): Promise<UserJWTPayload | null> {
  const authHeader = request.headers.get('Authorization');
  const token = extractTokenFromHeader(authHeader);

  if (!token) {
    return null;
  }

  const user = await verifyToken(token);
  return user;
}

/**
 * 관리자 권한 확인
 */
export function requireAdmin(user: UserJWTPayload | null): boolean {
  return user?.role === 'admin';
}

/**
 * 인증된 사용자 확인
 */
export function requireAuth(user: UserJWTPayload | null): boolean {
  return user !== null;
} 