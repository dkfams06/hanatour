import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/auth-middleware';

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateToken(request);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: '토큰이 없거나 유효하지 않습니다.',
        authHeader: request.headers.get('Authorization'),
      }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      user,
      authHeader: request.headers.get('Authorization'),
      userRole: user.role,
      isAdmin: user.role === 'admin',
    });

  } catch (error) {
    console.error('사용자 정보 조회 에러:', error);
    return NextResponse.json({
      success: false,
      error: '사용자 정보 조회 중 오류가 발생했습니다.',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}