import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { UpdateInquiryRequest } from '@/lib/types';

// Dynamic Server Usage 오류 해결을 위한 설정
export const dynamic = 'force-dynamic';

interface RouteParams {
  params: {
    id: string;
  };
}

// 문의 상세 조회 (GET)
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    // 문의 정보 조회
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

    // 답변 목록 조회
    const [responses] = await db.query<any[]>(
      'SELECT * FROM inquiry_responses WHERE inquiryId = ? ORDER BY createdAt ASC',
      [id]
    );

    // 첨부파일 목록 조회 (향후 확장용)
    const [attachments] = await db.query<any[]>(
      'SELECT * FROM inquiry_attachments WHERE inquiryId = ? ORDER BY createdAt ASC',
      [id]
    );

    return NextResponse.json({
      success: true,
      data: {
        inquiry: inquiries[0],
        responses,
        attachments
      }
    });

  } catch (error) {
    console.error('문의 상세 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '문의 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 문의 수정 (PATCH)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;
    const body: UpdateInquiryRequest = await request.json();

    // 기존 문의 정보 조회
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

    // 업데이트 가능한 필드 목록
    const updatableFields = ['status', 'priority', 'assignedTo', 'adminNotes'];
    const updateFields = [];
    const updateValues = [];

    for (const field of updatableFields) {
      if (body[field as keyof UpdateInquiryRequest] !== undefined) {
        updateFields.push(`${field} = ?`);
        updateValues.push(body[field as keyof UpdateInquiryRequest]);
      }
    }

    // 완료 상태로 변경 시 완료일시 추가
    if (body.status === 'completed' && inquiry.status !== 'completed') {
      updateFields.push('completedAt = NOW()');
    }

    if (updateFields.length === 0) {
      return NextResponse.json(
        { success: false, error: '업데이트할 내용이 없습니다.' },
        { status: 400 }
      );
    }

    // 업데이트 시간 추가
    updateFields.push('updatedAt = NOW()');

    const updateQuery = `
      UPDATE inquiries 
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `;

    updateValues.push(id);
    await db.query(updateQuery, updateValues);

    // 업데이트된 문의 정보 조회
    const [updatedInquiries] = await db.query<any[]>(
      'SELECT * FROM inquiries WHERE id = ?',
      [id]
    );

    return NextResponse.json({
      success: true,
      data: updatedInquiries[0],
      message: '문의 정보가 성공적으로 업데이트되었습니다.'
    });

  } catch (error) {
    console.error('문의 수정 오류:', error);
    return NextResponse.json(
      { success: false, error: '문의 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 문의 삭제 (DELETE)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    // 기존 문의 정보 조회
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

    // 문의 삭제 (답변과 첨부파일은 CASCADE로 자동 삭제)
    await db.query('DELETE FROM inquiries WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: '문의가 성공적으로 삭제되었습니다.'
    });

  } catch (error) {
    console.error('문의 삭제 오류:', error);
    return NextResponse.json(
      { success: false, error: '문의 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
} 