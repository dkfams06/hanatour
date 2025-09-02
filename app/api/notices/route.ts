import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Dynamic Server Usage 오류 해결을 위한 설정
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // 전체 공지사항 수 조회
    const [countResult] = await db.execute(
      'SELECT COUNT(*) as total FROM notices WHERE status = "published"'
    );
    const total = (countResult as any)[0].total;

    // 공지사항 목록 조회 (중요 공지 먼저, 그 다음 최신순)
    const [notices] = await db.execute(
      `SELECT id, title, content, author, isImportant, viewCount, createdAt 
       FROM notices 
       WHERE status = "published" 
       ORDER BY isImportant DESC, createdAt DESC 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    return NextResponse.json({
      success: true,
      data: {
        notices,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('공지사항 조회 오류:', error);
    return NextResponse.json(
      { success: false, message: '공지사항을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
} 