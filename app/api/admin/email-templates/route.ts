import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

// 이메일 템플릿 목록 조회 (GET)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const isActive = searchParams.get('isActive');

    let where = '1=1';
    const params: any[] = [];

    if (type) {
      where += ' AND type = ?';
      params.push(type);
    }

    if (isActive !== null) {
      where += ' AND is_active = ?';
      params.push(isActive === 'true');
    }

    const [templates] = await pool.query<any[]>(
      `SELECT id, name, type, subject, html_content, text_content, variables, is_active, created_at, updated_at 
       FROM email_templates 
       WHERE ${where} 
       ORDER BY type, name`,
      params
    );

    return NextResponse.json({
      success: true,
      data: templates
    });

  } catch (error) {
    console.error('이메일 템플릿 조회 에러:', error);
    return NextResponse.json(
      { success: false, error: '이메일 템플릿 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 이메일 템플릿 생성 (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      type,
      subject,
      htmlContent,
      textContent,
      variables,
      isActive = true
    } = body;

    // 필수 필드 검증
    if (!name || !type || !subject || !htmlContent) {
      return NextResponse.json(
        { success: false, error: '필수 입력값이 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 타입 중복 확인
    const [existingTemplates] = await pool.query<any[]>(
      'SELECT id FROM email_templates WHERE type = ?',
      [type]
    );

    if (existingTemplates.length > 0) {
      return NextResponse.json(
        { success: false, error: '이미 존재하는 템플릿 타입입니다.' },
        { status: 400 }
      );
    }

    // 템플릿 생성
    const id = uuidv4();
    await pool.query(
      `INSERT INTO email_templates (id, name, type, subject, html_content, text_content, variables, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        name,
        type,
        subject,
        htmlContent,
        textContent || null,
        variables ? JSON.stringify(variables) : null,
        isActive
      ]
    );

    return NextResponse.json({
      success: true,
      message: '이메일 템플릿이 생성되었습니다.',
      data: { id }
    });

  } catch (error) {
    console.error('이메일 템플릿 생성 에러:', error);
    return NextResponse.json(
      { success: false, error: '이메일 템플릿 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 이메일 템플릿 수정 (PUT)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      name,
      subject,
      htmlContent,
      textContent,
      variables,
      isActive
    } = body;

    // 필수 필드 검증
    if (!id || !name || !subject || !htmlContent) {
      return NextResponse.json(
        { success: false, error: '필수 입력값이 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 템플릿 존재 확인
    const [existingTemplates] = await pool.query<any[]>(
      'SELECT id FROM email_templates WHERE id = ?',
      [id]
    );

    if (existingTemplates.length === 0) {
      return NextResponse.json(
        { success: false, error: '존재하지 않는 템플릿입니다.' },
        { status: 404 }
      );
    }

    // 템플릿 수정
    await pool.query(
      `UPDATE email_templates 
       SET name = ?, subject = ?, html_content = ?, text_content = ?, variables = ?, is_active = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        name,
        subject,
        htmlContent,
        textContent || null,
        variables ? JSON.stringify(variables) : null,
        isActive,
        id
      ]
    );

    return NextResponse.json({
      success: true,
      message: '이메일 템플릿이 수정되었습니다.'
    });

  } catch (error) {
    console.error('이메일 템플릿 수정 에러:', error);
    return NextResponse.json(
      { success: false, error: '이메일 템플릿 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 