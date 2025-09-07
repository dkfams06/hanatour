import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/auth-middleware';
import { db } from '@/lib/db';

// Dynamic Server Usage 오류 해결을 위한 설정
export const dynamic = 'force-dynamic';

// 관리자용 후기 목록 조회 (GET)
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
    const status = searchParams.get('status') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    let where = '1=1';
    const params: any[] = [];

    if (status !== 'all') {
      where += ' AND status = ?';
      params.push(status);
    }

    // 후기 목록 조회 (최신순) - 사용자 정보와 투어 정보와 함께 조회
    const [rows] = await db.query<any[]>(
      `SELECT r.*, u.username, u.name as userName, u.nickname, t.title as tourTitle
       FROM reviews r 
       LEFT JOIN users u ON r.userId = u.id 
       LEFT JOIN tours t ON r.tourId = t.id
       WHERE ${where} ORDER BY r.createdAt DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    // JSON 필드 파싱
    const reviews = rows.map(review => ({
      ...review,
      images: review.images ? JSON.parse(review.images) : [],
    }));

    // 전체 개수 조회
    const [countRows] = await db.query<any[]>(
      `SELECT COUNT(*) as total FROM reviews r WHERE ${where}`,
      params
    );
    const total = countRows[0]?.total || 0;

    return NextResponse.json({
      success: true,
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('관리자 후기 목록 조회 에러:', error);
    return NextResponse.json(
      { success: false, error: '후기 목록 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}