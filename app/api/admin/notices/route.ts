import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/auth-middleware';
import db from '@/lib/db';

// 관리자용 공지사항 목록 조회
export async function GET(request: NextRequest) {
  try {
    const user = await authenticateToken(request);
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || 'all';
    const search = searchParams.get('search') || '';
    const offset = (page - 1) * limit;

    // WHERE 조건 구성
    let whereClause = '1=1';
    const params: any[] = [];

    if (status !== 'all') {
      whereClause += ' AND status = ?';
      params.push(status);
    }

    if (search) {
      whereClause += ' AND (title LIKE ? OR content LIKE ? OR author LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // 전체 공지사항 수 조회
    const [countResult] = await db.execute(
      `SELECT COUNT(*) as total FROM notices WHERE ${whereClause}`,
      params
    );
    const total = (countResult as any)[0].total;

    // 공지사항 목록 조회
    const [notices] = await db.execute(
      `SELECT id, title, content, author, isImportant, viewCount, status, createdAt, updatedAt 
       FROM notices 
       WHERE ${whereClause}
       ORDER BY isImportant DESC, createdAt DESC 
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
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
    console.error('관리자 공지사항 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '공지사항을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 공지사항 생성
export async function POST(request: NextRequest) {
  try {
    const user = await authenticateToken(request);
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const { title, content, isImportant, status } = await request.json();

    // 유효성 검사
    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: '제목과 내용은 필수입니다.' },
        { status: 400 }
      );
    }

    // ID 생성 (타임스탬프 기반)
    const noticeId = `notice_${Date.now()}`;

    // 공지사항 생성
    await db.execute(
      `INSERT INTO notices (id, title, content, author, isImportant, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [noticeId, title, content, user.name || user.username, isImportant || false, status || 'draft']
    );

    return NextResponse.json({
      success: true,
      message: '공지사항이 생성되었습니다.',
      data: { id: noticeId }
    });
  } catch (error) {
    console.error('공지사항 생성 오류:', error);
    return NextResponse.json(
      { success: false, error: '공지사항 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}