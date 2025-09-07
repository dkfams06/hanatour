import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/auth-middleware';
import pool from '@/lib/db';

// Dynamic Server Usage 오류 해결을 위한 설정
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateToken(request);

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        error: '유효하지 않은 토큰입니다.' 
      }, { status: 401 });
    }

    // 데이터베이스에서 최신 마일리지 정보 가져오기
    const [userRows] = await pool.query<any[]>(
      'SELECT mileage FROM users WHERE id = ?',
      [user.id]
    );

    const currentMileage = userRows[0]?.mileage || 0;

    return NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        email: user.email,
        name: user.name,
        role: user.role,
        mileage: currentMileage, // 최신 마일리지 값 사용
      }
    });
  } catch (error) {
    console.error('토큰 검증 에러:', error);
    return NextResponse.json({ 
      success: false, 
      error: '토큰 검증 중 오류가 발생했습니다.' 
    }, { status: 500 });
  }
} 