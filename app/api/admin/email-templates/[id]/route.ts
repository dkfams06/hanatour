import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// 개별 이메일 템플릿 조회 (GET)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const [templates] = await pool.query<any[]>(
      `SELECT id, name, type, subject, html_content, text_content, variables, is_active, created_at, updated_at 
       FROM email_templates 
       WHERE id = ?`,
      [id]
    );

    if (templates.length === 0) {
      return NextResponse.json(
        { success: false, error: '템플릿을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const template = templates[0];
    
    // JSON 필드 파싱
    if (template.variables) {
      template.variables = JSON.parse(template.variables);
    }

    return NextResponse.json({
      success: true,
      data: template
    });

  } catch (error) {
    console.error('이메일 템플릿 조회 에러:', error);
    return NextResponse.json(
      { success: false, error: '이메일 템플릿 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 이메일 템플릿 삭제 (DELETE)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // 템플릿 존재 확인
    const [existingTemplates] = await pool.query<any[]>(
      'SELECT id, name FROM email_templates WHERE id = ?',
      [id]
    );

    if (existingTemplates.length === 0) {
      return NextResponse.json(
        { success: false, error: '존재하지 않는 템플릿입니다.' },
        { status: 404 }
      );
    }

    // 템플릿 삭제
    await pool.query('DELETE FROM email_templates WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: '이메일 템플릿이 삭제되었습니다.'
    });

  } catch (error) {
    console.error('이메일 템플릿 삭제 에러:', error);
    return NextResponse.json(
      { success: false, error: '이메일 템플릿 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 