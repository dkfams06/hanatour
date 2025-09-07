import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/db';
import { CreateInquiryResponseRequest } from '@/lib/types';
import { verifyToken } from '@/lib/jwt';

// Dynamic Server Usage 오류 해결을 위한 설정
export const dynamic = 'force-dynamic';

interface RouteParams {
  params: {
    id: string;
  };
}

// 답변 목록 조회 (GET)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    // 인증 토큰 확인
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: '인증이 필요합니다.' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: '유효하지 않은 토큰입니다.' },
        { status: 401 }
      );
    }

    // 문의 존재 확인
    const [inquiries] = await db.query<any[]>(
      'SELECT * FROM inquiries WHERE id = ?',
      [id]
    );

    if (inquiries.length === 0) {
      return NextResponse.json(
        { success: false, error: '문의를 찾을 수 없거나 접근 권한이 없습니다.' },
        { status: 404 }
      );
    }

    // 답변 목록 조회 (내부 메모는 제외)
    const [responses] = await db.query<any[]>(
      'SELECT * FROM inquiry_responses WHERE inquiryId = ? AND isInternal = false ORDER BY createdAt ASC',
      [id]
    );

    return NextResponse.json({
      success: true,
      data: responses
    });

  } catch (error) {
    console.error('답변 목록 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '답변 목록 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 답변 생성 (POST)
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const body: CreateInquiryResponseRequest = await request.json();
    const { content, adminName, isInternal = false } = body;

    // 필수 필드 검증
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: '답변 내용을 입력해주세요.' },
        { status: 400 }
      );
    }

    // 문의 존재 확인
    const [inquiries] = await db.query<any[]>(
      'SELECT * FROM inquiries WHERE id = ?',
      [id]
    );

    if (inquiries.length === 0) {
      return NextResponse.json(
        { success: false, error: '문의를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const inquiry = inquiries[0];

    // 답변 생성
    const responseId = uuidv4();
    const insertQuery = `
      INSERT INTO inquiry_responses (
        id, inquiryId, responseType, content, adminName, isInternal, createdAt
      ) VALUES (?, ?, 'admin_response', ?, ?, ?, NOW())
    `;

    await db.query(insertQuery, [
      responseId,
      id,
      content.trim(),
      adminName || '관리자',
      isInternal
    ]);

    // 문의 상태 업데이트 (답변 등록 시 완료로 변경, 내부 메모는 제외)
    if (!isInternal && (inquiry.status === 'pending' || inquiry.status === 'in_progress')) {
      await db.query(
        'UPDATE inquiries SET status = ?, completedAt = NOW(), updatedAt = NOW() WHERE id = ?',
        ['completed', id]
      );
    }

    // 생성된 답변 정보 조회
    const [createdResponse] = await db.query<any[]>(
      'SELECT * FROM inquiry_responses WHERE id = ?',
      [responseId]
    );

    return NextResponse.json({
      success: true,
      data: createdResponse[0],
      message: '답변이 성공적으로 등록되었습니다.'
    }, { status: 201 });

  } catch (error) {
    console.error('답변 생성 오류:', error);
    return NextResponse.json(
      { success: false, error: '답변 등록에 실패했습니다.' },
      { status: 500 }
    );
  }
} 