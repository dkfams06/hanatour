import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/auth-middleware';
import db from '@/lib/db';

// 공지사항 상세 조회 (관리자용)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authenticateToken(request);
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const { id } = await params;

    // 공지사항 조회 (관리자는 모든 상태의 공지사항 조회 가능)
    const [notices] = await db.execute(
      `SELECT id, title, content, author, isImportant, viewCount, status, createdAt, updatedAt 
       FROM notices 
       WHERE id = ?`,
      [id]
    );

    if (!(notices as any[]).length) {
      return NextResponse.json(
        { success: false, error: '공지사항을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: (notices as any[])[0]
    });
  } catch (error) {
    console.error('공지사항 상세 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '공지사항을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 공지사항 수정
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authenticateToken(request);
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const { title, content, isImportant, status } = await request.json();

    // 유효성 검사
    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: '제목과 내용은 필수입니다.' },
        { status: 400 }
      );
    }

    // 공지사항 존재 여부 확인
    const [existingNotices] = await db.execute(
      'SELECT id FROM notices WHERE id = ?',
      [id]
    );

    if (!(existingNotices as any[]).length) {
      return NextResponse.json(
        { success: false, error: '공지사항을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 공지사항 수정
    const [result] = await db.execute(
      `UPDATE notices 
       SET title = ?, content = ?, isImportant = ?, status = ?, updatedAt = NOW()
       WHERE id = ?`,
      [title, content, isImportant || false, status || 'draft', id]
    ) as any;

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: '공지사항 수정에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '공지사항이 수정되었습니다.'
    });
  } catch (error) {
    console.error('공지사항 수정 오류:', error);
    return NextResponse.json(
      { success: false, error: '공지사항 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 공지사항 삭제
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authenticateToken(request);
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const { id } = await params;

    // 공지사항 존재 여부 확인
    const [existingNotices] = await db.execute(
      'SELECT id FROM notices WHERE id = ?',
      [id]
    );

    if (!(existingNotices as any[]).length) {
      return NextResponse.json(
        { success: false, error: '공지사항을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 공지사항 삭제
    const [result] = await db.execute(
      'DELETE FROM notices WHERE id = ?',
      [id]
    ) as any;

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: '공지사항 삭제에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '공지사항이 삭제되었습니다.'
    });
  } catch (error) {
    console.error('공지사항 삭제 오류:', error);
    return NextResponse.json(
      { success: false, error: '공지사항 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
}