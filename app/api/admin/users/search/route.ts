import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/auth-middleware';
import pool from '@/lib/db';

// Dynamic Server Usage 오류 해결을 위한 설정
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // 인증 확인
    const user = await authenticateToken(request);
    if (!user || (user.role !== 'admin' && user.role !== 'staff')) {
      return NextResponse.json(
        { success: false, error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query.trim()) {
      return NextResponse.json({
        success: true,
        users: []
      });
    }

    // 사용자 검색 (이름, 닉네임, 이메일, username으로 검색)
    const [rows] = await pool.query<any[]>(
      `SELECT id, username, email, name, nickname, phone, mileage, role, status, createdAt 
       FROM users 
       WHERE name LIKE ? OR nickname LIKE ? OR email LIKE ? OR username LIKE ?
       ORDER BY createdAt DESC 
       LIMIT ?`,
      [`%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, limit]
    );

    return NextResponse.json({
      success: true,
      users: rows
    });

  } catch (error) {
    console.error('사용자 검색 에러:', error);
    return NextResponse.json(
      { success: false, error: '사용자 검색 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
