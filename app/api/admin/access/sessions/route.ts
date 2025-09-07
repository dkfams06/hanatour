import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/auth-middleware';
import pool from '@/lib/db';

// Dynamic Server Usage 오류 해결을 위한 설정
export const dynamic = 'force-dynamic';

// 활성 세션 조회
export async function GET(request: NextRequest) {
  try {
    const user = await authenticateToken(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
    }

    const query = `
      SELECT 
        s.id,
        s.user_id,
        u.username,
        u.email,
        u.name,
        u.nickname,
        u.role,
        s.ip_address,
        s.user_agent,
        s.device,
        s.location,
        s.login_time,
        s.last_activity,
        s.is_active
      FROM active_sessions s
      LEFT JOIN users u ON s.user_id = u.id
      WHERE s.is_active = 1
      ORDER BY s.last_activity DESC
    `;

    const [sessions] = await pool.query(query) as any;

    return NextResponse.json({ sessions });

  } catch (error) {
    console.error('활성 세션 조회 오류:', error);
    return NextResponse.json({ error: '활성 세션 조회 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 세션 강제 종료
export async function DELETE(request: NextRequest) {
  try {
    const user = await authenticateToken(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: '관리자 권한이 필요합니다.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: '세션 ID가 필요합니다.' }, { status: 400 });
    }

    // 세션 비활성화
    const query = `UPDATE active_sessions SET is_active = 0 WHERE id = ?`;
    await pool.query(query, [sessionId]);

    return NextResponse.json({ message: '세션이 종료되었습니다.' });

  } catch (error) {
    console.error('세션 종료 오류:', error);
    return NextResponse.json({ error: '세션 종료 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
