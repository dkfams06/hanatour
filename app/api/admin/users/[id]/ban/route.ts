import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/auth-middleware';
import db from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;
    const { status } = await request.json();

    // 인증 확인
    const user = await authenticateToken(request);
    
    console.log('사용자 차단 API - 인증 정보:', {
      user,
      userRole: user?.role,
      isAdmin: user?.role === 'admin',
      authHeader: request.headers.get('Authorization')
    });
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { 
          success: false, 
          error: '관리자 권한이 필요합니다.',
          debug: {
            hasUser: !!user,
            userRole: user?.role,
            isAdmin: user?.role === 'admin',
            authHeader: request.headers.get('Authorization')
          }
        },
        { status: 403 }
      );
    }

    // 상태 유효성 검사
    if (!['banned', 'approved'].includes(status)) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 상태입니다.' },
        { status: 400 }
      );
    }

    // 자기 자신은 차단할 수 없음
    if (user.id === userId) {
      return NextResponse.json(
        { success: false, error: '자기 자신을 차단할 수 없습니다.' },
        { status: 400 }
      );
    }

    // 사용자 상태 업데이트
    const [result] = await db.execute(
      'UPDATE users SET status = ? WHERE id = ?',
      [status, userId]
    ) as any;

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: '사용자를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `사용자가 ${status === 'banned' ? '차단' : '차단 해제'}되었습니다.`
    });

  } catch (error) {
    console.error('사용자 차단/해제 오류:', error);
    return NextResponse.json(
      { success: false, error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}