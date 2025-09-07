import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/auth-middleware';
import pool from '@/lib/db';

// Dynamic Server Usage 오류 해결을 위한 설정
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // 인증 확인
    const user = await authenticateToken(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let applications: any[] = [];
    let total = 0;

    if (type === 'all' || type === 'deposit') {
      // 입금 신청 조회
      const [depositRows] = await pool.query<any[]>(
        `SELECT 
          id,
          'deposit' as type,
          amount,
          status,
          applicationMethod,
          createdAt as requestDate,
          processedAt as processedDate,
          adminNotes
        FROM deposit_applications 
        WHERE userId = ? 
        ORDER BY createdAt DESC 
        LIMIT ? OFFSET ?`,
        [user.id, limit, offset]
      );

      const [depositCount] = await pool.query<any[]>(
        'SELECT COUNT(*) as total FROM deposit_applications WHERE userId = ?',
        [user.id]
      );

      applications = [...depositRows];
      total += depositCount[0]?.total || 0;
    }

    if (type === 'all' || type === 'withdrawal') {
      // 출금 신청 조회
      const [withdrawalRows] = await pool.query<any[]>(
        `SELECT 
          id,
          'withdrawal' as type,
          amount,
          status,
          bankName,
          accountNumber,
          accountHolder,
          createdAt as requestDate,
          transferCompletedAt as processedDate,
          adminNotes
        FROM withdrawal_applications 
        WHERE userId = ? 
        ORDER BY createdAt DESC 
        LIMIT ? OFFSET ?`,
        [user.id, limit, offset]
      );

      const [withdrawalCount] = await pool.query<any[]>(
        'SELECT COUNT(*) as total FROM withdrawal_applications WHERE userId = ?',
        [user.id]
      );

      applications = [...applications, ...withdrawalRows];
      total += withdrawalCount[0]?.total || 0;
    }

    // 날짜순으로 정렬
    applications.sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());

    return NextResponse.json({
      success: true,
      applications,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('신청 내역 조회 에러:', error);
    return NextResponse.json(
      { success: false, error: '신청 내역 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
