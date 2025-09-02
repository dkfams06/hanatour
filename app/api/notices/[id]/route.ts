import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // 조회수 증가
    await db.execute(
      'UPDATE notices SET viewCount = viewCount + 1 WHERE id = ?',
      [id]
    );

    // 공지사항 상세 조회
    const [notices] = await db.execute(
      `SELECT id, title, content, author, isImportant, viewCount, createdAt, updatedAt 
       FROM notices 
       WHERE id = ? AND status = "published"`,
      [id]
    );

    if (!(notices as any[]).length) {
      return NextResponse.json(
        { success: false, message: '공지사항을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const notice = (notices as any[])[0];

    return NextResponse.json({
      success: true,
      data: notice
    });
  } catch (error) {
    console.error('공지사항 상세 조회 오류:', error);
    return NextResponse.json(
      { success: false, message: '공지사항을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
} 