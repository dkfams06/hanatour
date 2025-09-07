import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { db } from '@/lib/db';

// Dynamic Server Usage 오류 해결을 위한 설정
export const dynamic = 'force-dynamic';

// 사용자별 문의 목록 조회 (GET)
export async function GET(request: NextRequest) {
  try {
    // 인증 확인
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded || !decoded.id) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 토큰입니다.' },
        { status: 401 }
      );
    }

    const userId = decoded.id;
    const { searchParams } = new URL(request.url);
    
    // 필터 파라미터 추출
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // 쿼리 구성
    let query = `
      SELECT 
        i.*,
        COUNT(r.id) as responseCount,
        MAX(r.createdAt) as lastResponseAt
      FROM inquiries i
      LEFT JOIN inquiry_responses r ON i.id = r.inquiryId
      WHERE i.customerEmail = (SELECT email FROM users WHERE id = ?)
    `;
    const queryParams: any[] = [userId];

    // 상태 필터 적용
    if (status) {
      query += ` AND i.status = ?`;
      queryParams.push(status);
    }

    // 그룹화 및 정렬
    query += ` GROUP BY i.id ORDER BY i.createdAt DESC`;

    // 페이지네이션
    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    // 문의 목록 조회
    const [inquiries] = await db.query<any[]>(query, queryParams);

    // 전체 개수 조회
    let countQuery = `
      SELECT COUNT(*) as total
      FROM inquiries i
      WHERE i.customerEmail = (SELECT email FROM users WHERE id = ?)
    `;
    const countParams: any[] = [userId];

    if (status) {
      countQuery += ` AND i.status = ?`;
      countParams.push(status);
    }

    const [countResult] = await db.query<any[]>(countQuery, countParams);
    const total = countResult[0]?.total || 0;

    return NextResponse.json({
      success: true,
      data: inquiries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('사용자 문의 목록 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '문의 목록 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}
